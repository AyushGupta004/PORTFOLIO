import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function waitForServer(url, timeoutMs = 30000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200 || res.status === 304) {
        return true;
      }
    } catch {
      // Retry
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

async function runScrollTests() {
  console.log('🚀 Starting TASK R3 Scroll Engine Verification Suite...\n');

  const port = 5175;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Starting Vite test server on ${baseUrl}...`);

  const serverProcess = spawn('npx', ['vite', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], {
    cwd: path.resolve(rootDir, 'frontend'),
    shell: true,
    stdio: 'pipe',
  });

  const stopServer = () => {
    if (serverProcess && serverProcess.pid) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', serverProcess.pid.toString(), '/f', '/t'], { shell: true });
        } else {
          serverProcess.kill('SIGTERM');
        }
      } catch {
        // Ignore
      }
    }
  };

  try {
    await waitForServer(baseUrl);
    console.log(`✓ Test server ready at ${baseUrl}\n`);
  } catch (err) {
    stopServer();
    throw err;
  }

  let browser;
  let hasFailures = false;
  const failures = [];

  try {
    browser = await chromium.launch({ headless: true });

    // ==========================================
    // TEST 1: DESKTOP PINNED HORIZONTAL ENGINE
    // ==========================================
    console.log('--------------------------------------------------');
    console.log('🖥️ TEST SUITE 1: Desktop Pinned Track (1366x768)');
    console.log('--------------------------------------------------');

    const context = await browser.newContext({
      viewport: { width: 1366, height: 768 },
    });
    const page = await context.newPage();
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const menuButton = page.locator('#header-menu-button');
    const dialog = page.locator('[role="dialog"]');

    // Helper to get active scroll metrics
    const getScrollMetrics = async () => {
      return await page.evaluate(() => {
        const progressBar = document.querySelector('[role="progressbar"]');
        const currentHash = window.location.hash;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentY = window.scrollY;

        return {
          ariaProgress: progressBar ? progressBar.getAttribute('aria-valuenow') : null,
          currentHash,
          scrollHeight,
          currentY,
        };
      });
    };

    const getMenuIndex = async () => {
      const openedForCheck = !(await dialog.isVisible());
      if (openedForCheck) {
        await menuButton.click();
        await dialog.waitFor({ state: 'visible' });
      }

      const activeEntry = dialog.locator('[aria-current="location"]');
      const label = await activeEntry.getAttribute('aria-label');
      if (openedForCheck) await page.keyboard.press('Escape');
      return label?.match(/^Navigate to section (\d{2})/)?.[1] ?? null;
    };

    // Test checkpoints: 0%, 25%, 50%, 75%, 100%
    const checkpoints = [
      { pct: 0, expectedIndex: '01', expectedHash: '#home', minProgress: 0, maxProgress: 5 },
      { pct: 25, expectedIndex: '03', expectedHash: '#projects', minProgress: 22, maxProgress: 28 },
      { pct: 50, expectedIndex: '05', expectedHash: '#coding', minProgress: 47, maxProgress: 53 },
      { pct: 75, expectedIndex: '07', expectedHash: '#education', minProgress: 72, maxProgress: 78 },
      { pct: 100, expectedIndex: '09', expectedHash: '#contact', minProgress: 98, maxProgress: 100 },
    ];

    for (const cp of checkpoints) {
      console.log(`\nTesting scroll checkpoint: ${cp.pct}%...`);
      const { scrollHeight } = await getScrollMetrics();
      const targetY = (cp.pct / 100) * scrollHeight;

      await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), targetY);
      // Wait for spring smoothing to settle
      await page.waitForTimeout(600);

      const metrics = await getScrollMetrics();
      metrics.menuIndex = await getMenuIndex();
      const actualProgress = parseFloat(metrics.ariaProgress || '0');

      console.log(`  Target Y: ${targetY.toFixed(0)}px / ${scrollHeight.toFixed(0)}px`);
      console.log(`  MENU index: "${metrics.menuIndex}" (expected: "${cp.expectedIndex}")`);
      console.log(`  Progress: ${actualProgress}% (expected: ${cp.minProgress}% - ${cp.maxProgress}%)`);
      console.log(`  URL Hash: "${metrics.currentHash}" (expected: "${cp.expectedHash}")`);

      if (metrics.menuIndex !== cp.expectedIndex) {
        hasFailures = true;
        const msg = `At ${cp.pct}%, MENU index is "${metrics.menuIndex}" but expected "${cp.expectedIndex}"`;
        failures.push(msg);
        console.error(`  ❌ ${msg}`);
      } else {
        console.log(`  ✓ MENU index verified: ${metrics.menuIndex}`);
      }

      if (actualProgress < cp.minProgress || actualProgress > cp.maxProgress) {
        hasFailures = true;
        const msg = `At ${cp.pct}%, progress is ${actualProgress}% (out of range ${cp.minProgress}-${cp.maxProgress}%)`;
        failures.push(msg);
        console.error(`  ❌ ${msg}`);
      } else {
        console.log(`  ✓ Progress bar verified: ${actualProgress}%`);
      }

      if (metrics.currentHash !== cp.expectedHash) {
        hasFailures = true;
        const msg = `At ${cp.pct}%, hash is "${metrics.currentHash}" but expected "${cp.expectedHash}"`;
        failures.push(msg);
        console.error(`  ❌ ${msg}`);
      } else {
        console.log(`  ✓ URL Hash verified: ${metrics.currentHash}`);
      }
    }

    // ==========================================
    // TEST 2: MENU DRAWER & LINK NAVIGATION
    // ==========================================
    console.log('\n--------------------------------------------------');
    console.log('📋 TEST SUITE 2: Navigation Menu Drawer & Links');
    console.log('--------------------------------------------------');

    await menuButton.click();
    await page.waitForTimeout(400);

    const isDialogOpen = await dialog.isVisible();
    if (!isDialogOpen) {
      hasFailures = true;
      failures.push('Navigation Menu dialog failed to open on click');
      console.error('❌ Menu drawer did not open');
    } else {
      console.log('✓ Navigation Menu drawer opened successfully');
    }

    // Click 04 SKILLS in menu
    const skillsLink = page.locator('button:has-text("SKILLS")').first();
    await skillsLink.click();
    await page.waitForTimeout(1400);

    const afterSkillsMetrics = await getScrollMetrics();
    afterSkillsMetrics.menuIndex = await getMenuIndex();
    console.log(`After selecting 04 SKILLS: MENU index is "${afterSkillsMetrics.menuIndex}", Hash: "${afterSkillsMetrics.currentHash}"`);
    if (afterSkillsMetrics.menuIndex !== '04') {
      hasFailures = true;
      const msg = `After menu click SKILLS, expected MENU index 04 but got ${afterSkillsMetrics.menuIndex}`;
      failures.push(msg);
      console.error(`❌ ${msg}`);
    } else {
      console.log('✓ Menu link smoothly scrolled to Section 04');
    }

    // ==========================================
    // TEST 3: PLAIN #HASH NAVIGATION ON LOAD
    // ==========================================
    console.log('\n--------------------------------------------------');
    console.log('🔗 TEST SUITE 3: Plain #hash Sync on Load & Change');
    console.log('--------------------------------------------------');

    await page.goto(`${baseUrl}/#experience`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const hashMetrics = await getScrollMetrics();
    hashMetrics.menuIndex = await getMenuIndex();
    console.log(`After navigating to /#experience: MENU index is "${hashMetrics.menuIndex}"`);
    if (hashMetrics.menuIndex !== '06') {
      hasFailures = true;
      const msg = `On direct load /#experience, expected MENU index 06 but got ${hashMetrics.menuIndex}`;
      failures.push(msg);
      console.error(`❌ ${msg}`);
    } else {
      console.log('✓ Direct #hash URL navigation on load works');
    }

    // ==========================================
    // TEST 4: ACCESSIBILITY TABBING INTO OFF-SCREEN PANEL
    // ==========================================
    console.log('\n--------------------------------------------------');
    console.log('⌨️ TEST SUITE 4: Tabbing Into Off-Screen Panel');
    console.log('--------------------------------------------------');

    // Currently at 06. Focus an input in 09 Contact section
    await page.evaluate(() => {
      const contactInput = document.querySelector('#section-09 input, #section-09 textarea, #section-09 button');
      if (contactInput) {
        contactInput.focus();
      }
    });
    await page.waitForTimeout(1000);

    const tabMetrics = await getScrollMetrics();
    tabMetrics.menuIndex = await getMenuIndex();
    console.log(`After focusing element in Section 09: MENU index is "${tabMetrics.menuIndex}"`);
    if (tabMetrics.menuIndex !== '09') {
      hasFailures = true;
      const msg = `Tabbing into Section 09 failed to scroll panel into view (got index ${tabMetrics.menuIndex})`;
      failures.push(msg);
      console.error(`❌ ${msg}`);
    } else {
      console.log('✓ Tabbing into off-screen panel brought Section 09 into view');
    }

    // ==========================================
    // TEST 5: MOBILE UNPINNED STACK MODE (< 768px)
    // ==========================================
    console.log('\n--------------------------------------------------');
    console.log('📱 TEST SUITE 5: Mobile Stacked Layout (390x844)');
    console.log('--------------------------------------------------');

    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(baseUrl, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(800);

    // Verify pinned sticky is NOT present on mobile
    const hasStickyPinned = await mobilePage.evaluate(() => {
      const sticky = document.querySelector('.sticky');
      return !!sticky;
    });

    if (hasStickyPinned) {
      hasFailures = true;
      const msg = 'Mobile layout (<768px) incorrectly retained sticky pinned container';
      failures.push(msg);
      console.error(`❌ ${msg}`);
    } else {
      console.log('✓ Mobile layout correctly uses stacked vertical layout without pin');
    }

    await mobileContext.close();
    await context.close();

  } finally {
    if (browser) await browser.close();
    stopServer();
  }

  console.log('\n==================================================');
  if (hasFailures) {
    console.error(`🚨 Scroll Engine Verification FAILED with ${failures.length} errors:`);
    failures.forEach((f) => console.error(` - ${f}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL SCROLL ENGINE TESTS PASSED! Native vertical scroll, light spring, progress sync, #hash routing, and accessibility verified.');
    process.exit(0);
  }
}

runScrollTests().catch((err) => {
  console.error('Fatal error in scroll tests:', err);
  process.exit(1);
});

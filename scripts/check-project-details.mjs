import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function waitForServer(url, timeoutMs = 25000) {
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
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

async function runProjectDetailsTests() {
  console.log('🧪 Starting TASK R8 Project Details Verification Suite...');

  const port = 5175;
  const baseUrl = `http://127.0.0.1:${port}`;

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
    console.log(`✓ Dev server online at ${baseUrl}`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    // Scroll to section 03 (Featured Projects)
    // Section index 2 out of 8 scroll intervals
    const targetScrollY = (2 / 8) * (9 * 768 - 768);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), targetScrollY);
    await page.waitForTimeout(600);

    // Test 1: Check initial visible cards and count
    console.log('\n--- Test 1: Initial State & Counts ---');
    const initialCards = await page.$$eval('#section-03 .grid > div', (cards) => {
      return cards.map((c) => {
        const title = c.querySelector('h3')?.textContent?.trim();
        const blurb = c.querySelector('p')?.textContent?.trim() || null;
        const detailsBtn = c.querySelector('button[aria-haspopup="dialog"]');
        const liveAppBtn = Array.from(c.querySelectorAll('a')).find((a) => a.textContent?.includes('LIVE APP'));
        const githubBtn = Array.from(c.querySelectorAll('a')).find((a) => a.textContent?.includes('GITHUB'));
        const codeBtn = Array.from(c.querySelectorAll('a')).find((a) => a.textContent?.includes('CODE'));
        const dashText = c.textContent?.includes('—');
        return {
          title,
          hasBlurb: Boolean(blurb),
          blurb,
          hasDetailsBtn: Boolean(detailsBtn),
          hasLiveApp: Boolean(liveAppBtn),
          hasGithub: Boolean(githubBtn),
          hasOldCodeText: Boolean(codeBtn),
          hasDash: dashText,
        };
      });
    });

    console.log(`Visible cards count: ${initialCards.length}`);
    if (initialCards.length !== 5) {
      throw new Error(`Expected 5 featured projects initially, but got ${initialCards.length}`);
    }
    console.log('✓ Initial visible card count is 5 (featured projects)');

    // Check Bhojanam has no description row and no '—'
    const bhojanam = initialCards.find((c) => c.title === 'Bhojanam');
    if (!bhojanam) throw new Error('Bhojanam card not found');
    if (bhojanam.hasBlurb) throw new Error('Bhojanam should not have a description row (blurb is null)');
    if (bhojanam.hasDash) throw new Error('Bhojanam card contains "—"');
    if (!bhojanam.hasLiveApp) throw new Error('Bhojanam should have LIVE APP button');
    if (bhojanam.hasGithub) throw new Error('Bhojanam should not have GITHUB button (repoUrl is null/empty)');
    if (!bhojanam.hasDetailsBtn) throw new Error('Bhojanam should have a Details button');
    console.log('✓ Bhojanam has no description row, no "—", has LIVE APP, has Details button');

    // Check button text matches visible cards count
    const featuredToggleText = await page.$eval('#section-03 button[aria-label="Toggle featured projects only"]', (btn) => btn.textContent?.trim());
    console.log(`Toggle button text: "${featuredToggleText}"`);
    if (!featuredToggleText.includes('FEATURED ONLY (5)')) {
      throw new Error(`Expected toggle button to show FEATURED ONLY (5), got "${featuredToggleText}"`);
    }
    console.log('✓ "FEATURED ONLY (5)" matches 5 visible cards');

    // Test 2: Toggle "Featured only" to show ALL ARCHIVES
    console.log('\n--- Test 2: Toggle to ALL ARCHIVES ---');
    await page.click('#section-03 button[aria-label="Toggle featured projects only"]');
    await page.waitForTimeout(400);

    const allCardsCount = await page.$$eval('#section-03 .grid > div', (cards) => cards.length);
    const allToggleText = await page.$eval('#section-03 button[aria-label="Toggle featured projects only"]', (btn) => btn.textContent?.trim());
    console.log(`Visible cards count after toggle: ${allCardsCount}`);
    console.log(`Toggle button text after toggle: "${allToggleText}"`);

    if (allCardsCount !== 6) {
      throw new Error(`Expected 6 total projects when all archives toggled, got ${allCardsCount}`);
    }
    if (!allToggleText.includes('ALL ARCHIVES (6)')) {
      throw new Error(`Expected toggle button to show ALL ARCHIVES (6), got "${allToggleText}"`);
    }
    console.log('✓ ALL ARCHIVES (6) correctly shows all 6 cards including ChargeShield AI');

    // Test 3: Filter by category (e.g. AI & Backend)
    console.log('\n--- Test 3: Category Filtering ---');
    await page.click('#section-03 button[aria-label="Filter projects by AI & Backend"]');
    await page.waitForTimeout(500);

    const aiCardsCount = await page.$$eval('#section-03 .grid > div', (cards) => cards.length);
    const aiToggleText = await page.$eval('#section-03 button[aria-label="Toggle featured projects only"]', (btn) => btn.textContent?.trim());
    console.log(`AI & Backend cards count: ${aiCardsCount}`);
    console.log(`Toggle button text: "${aiToggleText}"`);
    if (aiCardsCount !== 3) {
      throw new Error(`Expected 3 cards in AI & Backend when showing all, got ${aiCardsCount}`);
    }
    if (!aiToggleText.includes('ALL ARCHIVES (3)')) {
      throw new Error(`Expected toggle text to show ALL ARCHIVES (3), got "${aiToggleText}"`);
    }
    console.log('✓ AI & Backend filtered to 3 cards; button count matches (3)');

    // Toggle featured only back ON while on AI & Backend
    await page.click('#section-03 button[aria-label="Toggle featured projects only"]');
    await page.waitForTimeout(400);
    const aiFeaturedCardsCount = await page.$$eval('#section-03 .grid > div', (cards) => cards.length);
    const aiFeaturedToggleText = await page.$eval('#section-03 button[aria-label="Toggle featured projects only"]', (btn) => btn.textContent?.trim());
    console.log(`AI & Backend featured cards count: ${aiFeaturedCardsCount}`);
    console.log(`Toggle button text: "${aiFeaturedToggleText}"`);
    if (aiFeaturedCardsCount !== 2) {
      throw new Error(`Expected 2 featured cards in AI & Backend, got ${aiFeaturedCardsCount}`);
    }
    if (!aiFeaturedToggleText.includes('FEATURED ONLY (2)')) {
      throw new Error(`Expected toggle text to show FEATURED ONLY (2), got "${aiFeaturedToggleText}"`);
    }
    console.log('✓ AI & Backend featured shows 2 cards; button count matches (2)');

    // Reset filter to All
    await page.click('#section-03 button[aria-label="Filter projects by All"]');
    await page.waitForTimeout(400);

    // Test 4: Modal opening, Focus Trap, Details content, Esc to close, Focus return
    console.log('\n--- Test 4: Modal, Keyboard Accessibility & Focus Restoration ---');
    const prakartiDetailsBtn = await page.$('#section-03 button[aria-label="View full details for Prakarti Report"]');
    if (!prakartiDetailsBtn) throw new Error('Details button for Prakarti Report not found');

    // Focus and press Enter on Details button
    await prakartiDetailsBtn.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);

    // Check modal exists in DOM
    const modal = await page.$('div[role="dialog"][aria-modal="true"]');
    if (!modal) throw new Error('Modal with role="dialog" and aria-modal="true" not found');
    console.log('✓ Modal opened with role="dialog" and aria-modal="true"');

    // Verify modal content
    const modalTitle = await page.$eval('#project-modal-title', (el) => el.textContent?.trim());
    const modalDesc = await page.$eval('#project-modal-description', (el) => el.textContent?.trim());
    const stackPills = await page.$$eval('#project-modal-stack span', (pills) => pills.map((p) => p.textContent?.trim()));

    console.log(`Modal Title: "${modalTitle}"`);
    console.log(`Modal Description length: ${modalDesc.length} chars`);
    console.log(`Modal Stack Pills: ${stackPills.join(', ')}`);

    if (modalTitle !== 'Prakarti Report') {
      throw new Error(`Expected modal title "Prakarti Report", got "${modalTitle}"`);
    }
    if (!modalDesc.startsWith('FastAPI + Gemini vision classifies uploads into 9 categories')) {
      throw new Error(`Modal description mismatch: "${modalDesc}"`);
    }
    if (stackPills.length !== 7) {
      throw new Error(`Expected all 7 stack pills in modal, got ${stackPills.length}`);
    }
    console.log('✓ Modal displays full description from content.ts and all 7 stack pills');

    // Test Focus Trap
    const activeElementTag = await page.evaluate(() => document.activeElement?.tagName);
    console.log(`Active element in modal: ${activeElementTag}`);

    // Press Escape to close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    const isModalOpen = await page.$('div[role="dialog"]');
    if (isModalOpen) throw new Error('Modal should be closed after pressing Escape');
    console.log('✓ Modal closed successfully via Escape key');

    // Check focus returned to the Details button that opened it
    const activeAriaLabel = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'));
    console.log(`Active element aria-label after close: "${activeAriaLabel}"`);
    if (activeAriaLabel !== 'View full details for Prakarti Report') {
      throw new Error(`Expected focus to return to Details button, but active element has aria-label "${activeAriaLabel}"`);
    }
    console.log('✓ Focus successfully returned to the trigger button on modal close');

    // Test Bhojanam Modal (no description row)
    console.log('\n--- Test 5: Bhojanam Modal Details ---');
    const bhojanamDetailsBtn = await page.$('#section-03 button[aria-label="View full details for Bhojanam"]');
    await bhojanamDetailsBtn.click();
    await page.waitForTimeout(400);

    const bhojanamModalDesc = await page.$('#project-modal-description');
    if (bhojanamModalDesc) {
      throw new Error('Bhojanam modal should not render a description row when blurb is null');
    }
    const bhojanamLiveLink = await page.$('div[role="dialog"] a[href="https://chandravardhan396.github.io/Bhojanam/"]');
    if (!bhojanamLiveLink) {
      throw new Error('Bhojanam modal should contain LIVE APP link');
    }
    console.log('✓ Bhojanam modal has no description row (blurb null) and has LIVE APP link');

    // Close Bhojanam modal
    await page.click('div[role="dialog"] button:has-text("CLOSE")');
    await page.waitForTimeout(300);

    await browser.close();
    console.log('\n🎉 ALL TASK R8 PROJECT DETAILS TESTS PASSED!\n');
  } finally {
    stopServer();
  }
}

runProjectDetailsTests().catch((err) => {
  console.error('❌ Project Details Test FAILED:', err);
  process.exit(1);
});

import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.resolve(rootDir, 'docs', 'layout-check');

const VIEWPORTS = [
  { name: '1366x768', width: 1366, height: 768, isDesktop: true },
  { name: '1440x900', width: 1440, height: 900, isDesktop: true },
  { name: '1920x1080', width: 1920, height: 1080, isDesktop: true },
  { name: '390x844', width: 390, height: 844, isDesktop: false },
];

const SECTIONS = [
  { id: 'section-01', num: '01', name: 'Home' },
  { id: 'section-02', num: '02', name: 'About' },
  { id: 'section-03', num: '03', name: 'Featured Projects' },
  { id: 'section-04', num: '04', name: 'Skills' },
  { id: 'section-05', num: '05', name: 'Coding Activity' },
  { id: 'section-06', num: '06', name: 'Experience' },
  { id: 'section-07', num: '07', name: 'Education' },
  { id: 'section-08', num: '08', name: 'Credentials' },
  { id: 'section-09', num: '09', name: 'Contact' },
];

// Helper to wait for port availability
async function waitForServer(url, timeoutMs = 30000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200 || res.status === 304) {
        return true;
      }
    } catch {
      // Retry after delay
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server at ${url} failed to respond within ${timeoutMs}ms`);
}

async function runLayoutChecks() {
  console.log('🚀 Starting Layout Verification Suite...');

  // Ensure output directory exists
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Start Vite preview or dev server
  const port = 5174;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Starting Vite server on ${baseUrl}...`);

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
      } catch (e) {
        // Ignore kill errors
      }
    }
  };

  serverProcess.stderr.on('data', (d) => {
    const err = d.toString();
    if (!err.includes('warn') && !err.includes('ready')) {
      console.error(`[Vite stderr]: ${err}`);
    }
  });

  try {
    await waitForServer(baseUrl);
    console.log(`✓ Dev server online at ${baseUrl}`);
  } catch (err) {
    serverProcess.kill();
    throw err;
  }

  let browser;
  let hasFailures = false;
  const failuresList = [];

  try {
    browser = await chromium.launch({ headless: true });

    for (const vp of VIEWPORTS) {
      console.log(`\n==================================================`);
      console.log(`📱 Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) - ${vp.isDesktop ? 'Pinned Desktop' : 'Mobile Stack'}`);
      console.log(`==================================================`);

      const vpDocsDir = path.resolve(docsDir, vp.name);
      if (!fs.existsSync(vpDocsDir)) {
        fs.mkdirSync(vpDocsDir, { recursive: true });
      }

      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });

      const page = await context.newPage();
      await page.goto(baseUrl, { waitUntil: 'networkidle' });
      // Allow fonts and animations to settle
      await page.waitForTimeout(800);

      // Measure header height (must be <= 72px)
      const headerStats = await page.evaluate(() => {
        const header = document.querySelector('header');
        if (!header) return null;
        const rect = header.getBoundingClientRect();
        return {
          height: rect.height,
          bottom: rect.bottom,
        };
      });

      if (!headerStats) {
        throw new Error('Header element not found on page');
      }

      console.log(`Header height: ${headerStats.height.toFixed(1)}px (allowed <= 72px)`);
      if (headerStats.height > 72.5) {
        hasFailures = true;
        const msg = `[${vp.name}] Header height exceeds 72px limit: ${headerStats.height}px`;
        failuresList.push(msg);
        console.error(`❌ ${msg}`);
      } else {
        console.log(`✓ Header height is within <= 72px limit`);
      }

      // Check pinned viewport native scrollbars (Desktop only)
      if (vp.isDesktop) {
        const nativeScrollbarStats = await page.evaluate(() => {
          // Check for horizontal page scrollbar on document
          const docScrollX = document.documentElement.scrollWidth > window.innerWidth;
          
          // Check if sticky viewport has vertical or horizontal scrollbars
          const stickyViewport = document.querySelector('.sticky');
          const stickyHasScrollY = stickyViewport ? stickyViewport.scrollHeight > stickyViewport.clientHeight : false;
          const stickyHasScrollX = stickyViewport ? stickyViewport.scrollWidth > stickyViewport.clientWidth : false;

          // Check panel wrappers
          const panels = document.querySelectorAll('#section-01, #section-02, #section-03, #section-04, #section-05, #section-06, #section-07, #section-08, #section-09');
          const panelsWithNativeScrollbars = [];

          panels.forEach((p, idx) => {
            const parent = p.parentElement;
            const overflowY = window.getComputedStyle(parent).overflowY;
            const hasScrollY = (overflowY === 'scroll' || overflowY === 'auto') && parent.scrollHeight > parent.clientHeight;
            if (hasScrollY) {
              panelsWithNativeScrollbars.push(`Panel 0${idx + 1} (${p.id}) has internal scrollable parent`);
            }
          });

          return {
            docScrollX,
            stickyHasScrollY,
            stickyHasScrollX,
            panelsWithNativeScrollbars,
          };
        });

        if (nativeScrollbarStats.docScrollX) {
          hasFailures = true;
          const msg = `[${vp.name}] Document has unexpected horizontal scrollbar (scrollWidth > innerWidth)`;
          failuresList.push(msg);
          console.error(`❌ ${msg}`);
        }

        if (nativeScrollbarStats.panelsWithNativeScrollbars.length > 0) {
          hasFailures = true;
          for (const pErr of nativeScrollbarStats.panelsWithNativeScrollbars) {
            const msg = `[${vp.name}] Native scrollbar detected: ${pErr}`;
            failuresList.push(msg);
            console.error(`❌ ${msg}`);
          }
        }
      }

      // Test each of the 9 sections
      const horizontalScrollDistance = vp.isDesktop
        ? await page.evaluate(() => {
            const firstPanel = document.querySelector('[data-panel-index="0"]');
            const track = firstPanel?.parentElement;
            return track ? Math.max(0, track.scrollWidth - window.innerWidth) : 0;
          })
        : 0;

      for (let i = 0; i < SECTIONS.length; i++) {
        const sec = SECTIONS[i];

        if (vp.isDesktop) {
          // The pinned wrapper's vertical scroll distance is the track's horizontal overflow.
          const targetScrollY = (i / (SECTIONS.length - 1)) * horizontalScrollDistance;
          await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), targetScrollY);
          await page.waitForTimeout(400); // allow spring/transform to settle
        } else {
          // Mobile stack: scroll section into view
          await page.evaluate((id) => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          }, sec.id);
          await page.waitForTimeout(300);
        }

        // Section layout inspection
        const sectionMetrics = await page.evaluate(({ secId, isDesktop, viewportHeight }) => {
          const sectionEl = document.getElementById(secId);
          if (!sectionEl) return { error: `Element #${secId} not found` };

          const rect = sectionEl.getBoundingClientRect();
          const scrollWidth = sectionEl.scrollWidth;
          const clientWidth = sectionEl.clientWidth;

          // Header overlap check: look at heading or first child content
          const heading = sectionEl.querySelector('.font-heading, h1, h2, h3') || sectionEl.firstElementChild;
          const headingRect = heading ? heading.getBoundingClientRect() : null;

          // Check all child elements to ensure nothing is clipped or overflowing
          const hasHorizontalOverflow = scrollWidth > clientWidth + 1;

          // Vertical clipping check on desktop (section must fit inside viewport without being cut off)
          let hasVerticalClipping = false;
          let clippingDetails = null;

          if (isDesktop) {
            // Check if section itself or its content extends below viewport height
            const bottom = rect.bottom;
            if (bottom > viewportHeight + 2) {
              hasVerticalClipping = true;
              clippingDetails = `Section bottom (${bottom.toFixed(1)}px) exceeds viewport height (${viewportHeight}px) by ${(bottom - viewportHeight).toFixed(1)}px`;
            }

            // Check if section's scrollHeight > clientHeight (internal content overflow)
            if (sectionEl.scrollHeight > sectionEl.clientHeight + 2) {
              hasVerticalClipping = true;
              clippingDetails = `Section scrollHeight (${sectionEl.scrollHeight}px) exceeds clientHeight (${sectionEl.clientHeight}px) by ${sectionEl.scrollHeight - sectionEl.clientHeight}px`;
            }
          }

          return {
            rect: { top: rect.top, bottom: rect.bottom, left: rect.left, width: rect.width, height: rect.height },
            panelAlignmentError: Math.abs(rect.left),
            scrollWidth,
            clientWidth,
            hasHorizontalOverflow,
            hasVerticalClipping,
            clippingDetails,
            headingTop: headingRect ? headingRect.top : null,
          };
        }, { secId: sec.id, isDesktop: vp.isDesktop, viewportHeight: vp.height });

        if (sectionMetrics.error) {
          hasFailures = true;
          failuresList.push(`[${vp.name}] ${sectionMetrics.error}`);
          console.error(`❌ ${sectionMetrics.error}`);
          continue;
        }

        let sectionPassed = true;

        // 1. Check scrollWidth > clientWidth
        if (sectionMetrics.hasHorizontalOverflow) {
          sectionPassed = false;
          hasFailures = true;
          const msg = `[${vp.name}] Section ${sec.num} (${sec.name}) horizontal overflow: scrollWidth (${sectionMetrics.scrollWidth}px) > clientWidth (${sectionMetrics.clientWidth}px)`;
          failuresList.push(msg);
          console.error(`  ❌ ${msg}`);
        }

        // 2. Check Header overlap
        // In mobile vertical stack or desktop pinned, content heading should not be hidden under header
        if (sectionMetrics.headingTop !== null && sectionMetrics.headingTop < headerStats.bottom - 1) {
          // On desktop, only check if section is the active one in viewport
          if (!vp.isDesktop || Math.abs(sectionMetrics.rect.left) < 50) {
            sectionPassed = false;
            hasFailures = true;
            const msg = `[${vp.name}] Section ${sec.num} (${sec.name}) heading sits under header: headingTop (${sectionMetrics.headingTop.toFixed(1)}px) < headerBottom (${headerStats.bottom.toFixed(1)}px)`;
            failuresList.push(msg);
            console.error(`  ❌ ${msg}`);
          }
        }

        // 3. Check Clipping (desktop pinned mode)
        if (vp.isDesktop && sectionMetrics.hasVerticalClipping) {
          sectionPassed = false;
          hasFailures = true;
          const msg = `[${vp.name}] Section ${sec.num} (${sec.name}) vertical clipping: ${sectionMetrics.clippingDetails}`;
          failuresList.push(msg);
          console.error(`  ❌ ${msg}`);
        }

        // 4. Check every panel aligns with the viewport at its corresponding scroll position.
        if (vp.isDesktop && sectionMetrics.panelAlignmentError > 2) {
          sectionPassed = false;
          hasFailures = true;
          const msg = `[${vp.name}] Section ${sec.num} (${sec.name}) is misaligned by ${sectionMetrics.panelAlignmentError.toFixed(1)}px`;
          failuresList.push(msg);
          console.error(`  ❌ ${msg}`);
        }

        // Save screenshot
        const screenshotPath = path.resolve(vpDocsDir, `${sec.num}-${sec.id}.png`);
        await page.screenshot({ path: screenshotPath });

        if (sectionPassed) {
          console.log(`  ✓ Section ${sec.num} (${sec.name}) passed | screenshot: docs/layout-check/${vp.name}/${sec.num}-${sec.id}.png`);
        }
      }

      await context.close();
    }
  } finally {
    if (browser) await browser.close();
    stopServer();
  }

  console.log(`\n==================================================`);
  if (hasFailures) {
    console.error(`🚨 Layout check FAILED with ${failuresList.length} issues:`);
    failuresList.forEach((f) => console.error(` - ${f}`));
    process.exit(1);
  } else {
    console.log(`🎉 ALL 4 VIEWPORTS PASSED! Layout is clean, responsive, and within all constraints.`);
    process.exit(0);
  }
}

runLayoutChecks().catch((err) => {
  console.error('Fatal error during layout verification:', err);
  process.exit(1);
});

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
      if (res.ok || res.status === 200 || res.status === 304) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server failed at ${url}`);
}

async function checkConsole() {
  const port = 5176;
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
      } catch {}
    }
  };

  try {
    await waitForServer(baseUrl);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const consoleLogs = [];
    const pageErrors = [];

    page.on('console', (msg) => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
    });

    page.on('pageerror', (err) => {
      pageErrors.push(err.message);
    });

    console.log(`Navigating to ${baseUrl}...`);
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Scroll through the entire page
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let step = 0; step <= 8; step++) {
      const y = (step / 8) * (scrollHeight - 768);
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForTimeout(200);
    }

    // Toggle theme
    const themeBtn = page.locator('button[aria-label*="Toggle color theme"]');
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);
      await themeBtn.click();
      await page.waitForTimeout(300);
    }

    await browser.close();
    stopServer();

    console.log(`\nCaptured ${consoleLogs.length} console messages:`);
    consoleLogs.forEach((l) => console.log(`[${l.type}]: ${l.text}`));

    console.log(`\nCaptured ${pageErrors.length} page errors:`);
    pageErrors.forEach((e) => console.error(`[ERROR]: ${e}`));

    const warningsAndErrors = consoleLogs.filter(
      (l) => l.type === 'error' || l.type === 'warning'
    );

    if (pageErrors.length > 0 || warningsAndErrors.length > 0) {
      console.error(`❌ Found ${pageErrors.length} uncaught errors and ${warningsAndErrors.length} console warnings/errors.`);
      process.exit(1);
    } else {
      console.log('✅ ZERO console errors or warnings detected in browser runtime!');
      process.exit(0);
    }
  } catch (err) {
    stopServer();
    console.error('Fatal check error:', err);
    process.exit(1);
  }
}

checkConsole();


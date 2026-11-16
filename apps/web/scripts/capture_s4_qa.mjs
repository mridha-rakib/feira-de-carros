import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const SCREENSHOT_DIR =
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\86701703-265b-499b-b383-7e58303b94c8\\screenshots\\s4';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'desktop_1366', width: 1366, height: 768 },
  { name: 'mobile_390', width: 390, height: 844 },
  { name: 'mobile_430', width: 430, height: 932 },
];

const SCREENS = [
  {
    id: 'web_029_plan_selection',
    url: 'http://localhost:3000/vendedor/anuncios/FDC-2026-0105/plano',
  },
  {
    id: 'web_030_pix_checkout',
    url: 'http://localhost:3000/vendedor/pedidos/PED-2026-0812/pix',
  },
  {
    id: 'web_031_card_checkout',
    url: 'http://localhost:3000/vendedor/pedidos/PED-2026-0812/cartao',
  },
  {
    id: 'web_032_payment_status',
    url: 'http://localhost:3000/vendedor/pedidos/PED-2026-0812/status',
  },
  {
    id: 'web_033_payment_history',
    url: 'http://localhost:3000/vendedor/pagamentos',
  },
  {
    id: 'web_036_renewal',
    url: 'http://localhost:3000/vendedor/anuncios/FDC-2026-0142/renovar',
  },
  {
    id: 'web_037_boost',
    url: 'http://localhost:3000/vendedor/anuncios/FDC-2026-0142/impulsionar',
  },
];

async function capture() {
  console.log(`Starting Batch S4 Visual QA Capture. Output Directory: ${SCREENSHOT_DIR}`);
  const browser = await chromium.launch({ headless: true });

  for (const screen of SCREENS) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 1,
      });

      // Inject authenticated seller session cookie
      await context.addCookies([
        {
          name: 'fdc_web_session',
          value: 'qa_seller_session_token',
          domain: 'localhost',
          path: '/',
        },
      ]);

      const page = await context.newPage();
      console.log(`Capturing ${screen.id} at ${vp.name} (${vp.width}x${vp.height})...`);

      try {
        await page.goto(screen.url, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(500);

        const filename = `${screen.id}_${vp.name}.png`;
        const filepath = path.join(SCREENSHOT_DIR, filename);
        await page.screenshot({ path: filepath, fullPage: true });
        console.log(`  Saved: ${filename}`);
      } catch (err) {
        console.error(`  Error capturing ${screen.id} at ${vp.name}:`, err.message);
      } finally {
        await context.close();
      }
    }
  }

  await browser.close();
  console.log('Batch S4 Visual QA Capture Completed Successfully!');
}

capture().catch((err) => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});

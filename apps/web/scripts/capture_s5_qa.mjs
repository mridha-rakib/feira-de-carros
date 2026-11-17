import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const SCREENSHOT_DIR =
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\86701703-265b-499b-b383-7e58303b94c8\\screenshots\\s5';

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
    id: 'web_038_mark_as_sold',
    url: 'http://localhost:3000/vendedor/anuncios/FC-2026-0151/vendido',
  },
  {
    id: 'web_039_listing_analytics',
    url: 'http://localhost:3000/vendedor/anuncios/FC-2026-0151/estatisticas',
  },
  {
    id: 'web_045_seller_messages',
    url: 'http://localhost:3000/vendedor/mensagens',
  },
  {
    id: 'web_046_conversation_thread',
    url: 'http://localhost:3000/vendedor/mensagens/CONV-001',
  },
  {
    id: 'web_048_conversation_safety_actions',
    url: 'http://localhost:3000/vendedor/mensagens/CONV-001/acoes',
  },
  {
    id: 'web_049_order_refund_request',
    url: 'http://localhost:3000/vendedor/pedidos/PED-2026-0810/reembolso',
  },
  {
    id: 'web_050_refunds_management',
    url: 'http://localhost:3000/vendedor/reembolsos',
  },
  {
    id: 'web_012_account_settings',
    url: 'http://localhost:3000/conta/configuracoes',
  },
  {
    id: 'web_051_privacy_policy',
    url: 'http://localhost:3000/privacidade',
  },
  {
    id: 'web_052_help_center',
    url: 'http://localhost:3000/ajuda',
  },
];

async function capture() {
  console.log(`Starting Batch S5 Visual QA Capture. Output Directory: ${SCREENSHOT_DIR}`);
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
        await page.waitForTimeout(600);

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
  console.log('Batch S5 Visual QA Capture Completed Successfully!');
}

capture().catch((err) => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});

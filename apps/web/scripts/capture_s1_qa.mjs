import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const SCREENSHOT_DIR = path.resolve('apps/web/public/screenshots/s1');
const BRAIN_DIR =
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\86701703-265b-499b-b383-7e58303b94c8\\screenshots';

for (const dir of [SCREENSHOT_DIR, BRAIN_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const VIEWPORTS = {
  desktop_1440: { width: 1440, height: 900 },
  desktop_1366: { width: 1366, height: 768 },
  mobile_390: { width: 390, height: 844 },
  mobile_430: { width: 430, height: 932 },
};

const SCREENS = [
  { id: 'web_016_application', path: '/vendedor/solicitacao', name: 'WEB-016 Solicitação' },
  {
    id: 'web_018_status_pending',
    path: '/vendedor/solicitacao/status',
    name: 'WEB-018 Status Em Análise',
  },
  { id: 'web_019_correction', path: '/vendedor/solicitacao/corrigir', name: 'WEB-019 Correção' },
  { id: 'web_020_dashboard', path: '/vendedor/anuncios', name: 'WEB-020 Meus Anúncios' },
];

async function capture() {
  console.log('Launching browser for Visual QA...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const page = await browser.newPage();

  for (const screen of SCREENS) {
    for (const [vpName, vpSize] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(vpSize);
      const url = `http://localhost:3000${screen.path}`;
      console.log(`Capturing ${screen.id} at ${vpName} (${vpSize.width}x${vpSize.height})...`);
      await page.goto(url, { waitUntil: 'networkidle' });

      // Save screenshot
      const filename = `${screen.id}_${vpName}.png`;
      const localPath = path.join(SCREENSHOT_DIR, filename);
      const brainPath = path.join(BRAIN_DIR, filename);

      await page.screenshot({ path: localPath, fullPage: true });
      fs.copyFileSync(localPath, brainPath);
    }
  }

  // Also capture status states on WEB-018: CORRECTION_REQUESTED and APPROVED at 1440 and 390
  for (const state of ['correction', 'approved']) {
    for (const [vpName, vpSize] of Object.entries({
      desktop_1440: VIEWPORTS.desktop_1440,
      mobile_390: VIEWPORTS.mobile_390,
    })) {
      await page.setViewportSize(vpSize);
      await page.goto('http://localhost:3000/vendedor/solicitacao/status', {
        waitUntil: 'networkidle',
      });

      if (state === 'correction') {
        await page.click('button:has-text("Correção solicitada")');
      } else if (state === 'approved') {
        await page.click('button:has-text("Aprovado")');
      }
      await page.waitForTimeout(300);

      const filename = `web_018_status_${state}_${vpName}.png`;
      const localPath = path.join(SCREENSHOT_DIR, filename);
      const brainPath = path.join(BRAIN_DIR, filename);

      await page.screenshot({ path: localPath, fullPage: true });
      fs.copyFileSync(localPath, brainPath);
    }
  }

  await browser.close();
  console.log('Visual QA capture complete! All screenshots saved.');
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

// Portable output directory outside of public website assets
const OUTPUT_DIR = process.env.QA_SCREENSHOT_DIR
  ? path.resolve(process.env.QA_SCREENSHOT_DIR)
  : path.resolve('apps/web/screenshots/s1');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
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
  console.log(`Starting Visual QA Capture. Output Directory: ${OUTPUT_DIR}`);
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

      const filename = `${screen.id}_${vpName}.png`;
      const targetPath = path.join(OUTPUT_DIR, filename);
      await page.screenshot({ path: targetPath, fullPage: true });
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
      const targetPath = path.join(OUTPUT_DIR, filename);
      await page.screenshot({ path: targetPath, fullPage: true });
    }
  }

  await browser.close();
  console.log('Visual QA capture complete! All screenshots saved cleanly.');
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});

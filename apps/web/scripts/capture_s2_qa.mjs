import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const OUTPUT_DIR = process.env.QA_SCREENSHOT_DIR
  ? path.resolve(process.env.QA_SCREENSHOT_DIR)
  : path.resolve('apps/web/screenshots/s2');

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
  {
    id: 'web_023_category',
    path: '/vendedor/anuncios/novo',
    name: 'WEB-023 Categoria',
  },
  {
    id: 'web_024_details',
    path: '/vendedor/anuncios/novo/detalhes',
    name: 'WEB-024 Ficha Técnica',
  },
  {
    id: 'web_025_photos_plan',
    path: '/vendedor/anuncios/novo/fotos',
    name: 'WEB-025 Fotos e Plano',
  },
  {
    id: 'web_026_review',
    path: '/vendedor/anuncios/novo/revisao',
    name: 'WEB-026 Revisão e Publicação',
  },
];

async function capture() {
  console.log(`Starting Batch S2 Visual QA Capture. Output Directory: ${OUTPUT_DIR}`);
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const page = await browser.newPage();

  // First populate the store with demo data on step 1 so all screens render complete content
  await page.goto('http://localhost:3000/vendedor/anuncios/novo', {
    waitUntil: 'networkidle',
  });
  const demoBtn = page.locator('button:has-text("Preencher Demo QA")');
  if (await demoBtn.isVisible()) {
    await demoBtn.click();
    await page.waitForTimeout(300);
  }

  for (const screen of SCREENS) {
    for (const [vpName, vpSize] of Object.entries(VIEWPORTS)) {
      await page.setViewportSize(vpSize);
      const url = `http://localhost:3000${screen.path}`;
      console.log(`Capturing ${screen.id} at ${vpName} (${vpSize.width}x${vpSize.height})...`);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const filename = `${screen.id}_${vpName}.png`;
      const targetPath = path.join(OUTPUT_DIR, filename);
      await page.screenshot({ path: targetPath, fullPage: true });
    }
  }

  // Also capture submitted success state on WEB-026 (desktop_1440 and mobile_390)
  for (const [vpName, vpSize] of Object.entries({
    desktop_1440: VIEWPORTS.desktop_1440,
    mobile_390: VIEWPORTS.mobile_390,
  })) {
    await page.setViewportSize(vpSize);
    await page.goto('http://localhost:3000/vendedor/anuncios/novo/revisao', {
      waitUntil: 'networkidle',
    });
    const submitBtn = page.locator('button:has-text("Enviar para Moderação")');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
      const filename = `web_026_submitted_success_${vpName}.png`;
      const targetPath = path.join(OUTPUT_DIR, filename);
      await page.screenshot({ path: targetPath, fullPage: true });
    }
  }

  await browser.close();
  console.log('Batch S2 Visual QA capture complete! All screenshots saved cleanly.');
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});

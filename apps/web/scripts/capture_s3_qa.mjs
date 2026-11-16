import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const OUTPUT_DIR = process.env.QA_SCREENSHOT_DIR
  ? path.resolve(process.env.QA_SCREENSHOT_DIR)
  : path.resolve('apps/web/screenshots/s3');

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
    id: 'web_027_correction',
    path: '/vendedor/anuncios/FC-2026-0151/corrigir',
    name: 'WEB-027 Correção do Anúncio',
  },
  {
    id: 'web_028_detail',
    path: '/vendedor/anuncios/FDC-2026-0142',
    name: 'WEB-028 Detalhes do Anúncio',
  },
  {
    id: 'web_034_edit',
    path: '/vendedor/anuncios/FDC-2026-0142/editar',
    name: 'WEB-034 Editar Anúncio Publicado',
  },
  {
    id: 'web_035_revisions',
    path: '/vendedor/anuncios/FDC-2026-0189/revisoes',
    name: 'WEB-035 Comparação de Versões em Análise',
  },
];

async function capture() {
  console.log(`Starting Batch S3 Visual QA Capture. Output Directory: ${OUTPUT_DIR}`);
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const context = await browser.newContext();
  await context.addCookies([
    {
      name: 'fdc_web_session',
      value: 'qa_seller_session_token',
      domain: 'localhost',
      path: '/',
    },
  ]);

  const page = await context.newPage();

  for (const screen of SCREENS) {
    for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
      console.log(`Capturing ${screen.id} at ${vpName} (${viewport.width}x${viewport.height})...`);
      await page.setViewportSize(viewport);
      await page.goto(`http://localhost:3000${screen.path}`, {
        waitUntil: 'networkidle',
      });
      await page.waitForSelector('main h1', { timeout: 5000 });
      await page.waitForTimeout(800);

      const filename = `${screen.id}_${vpName}.png`;
      const fullPath = path.join(OUTPUT_DIR, filename);
      await page.screenshot({ path: fullPath, fullPage: true });
      console.log(`  Saved: ${filename}`);
    }
  }

  // Also capture the Resubmitted state of WEB-027
  console.log('Capturing WEB-027 resubmitted state...');
  await page.setViewportSize(VIEWPORTS.desktop_1440);
  await page.goto('http://localhost:3000/vendedor/anuncios/FC-2026-0151/corrigir', {
    waitUntil: 'networkidle',
  });
  const resubmitBtn = page.locator('button:has-text("Reenviar para análise")');
  if (await resubmitBtn.isVisible()) {
    await resubmitBtn.click();
    await page.waitForTimeout(600);
    const filename1440 = 'web_027_resubmitted_desktop_1440.png';
    await page.screenshot({ path: path.join(OUTPUT_DIR, filename1440), fullPage: true });
    console.log(`  Saved: ${filename1440}`);

    await page.setViewportSize(VIEWPORTS.mobile_390);
    await page.waitForTimeout(300);
    const filename390 = 'web_027_resubmitted_mobile_390.png';
    await page.screenshot({ path: path.join(OUTPUT_DIR, filename390), fullPage: true });
    console.log(`  Saved: ${filename390}`);
  }

  await browser.close();
  console.log('Batch S3 Visual QA Capture Completed Successfully!');
}

capture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});

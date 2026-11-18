import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';

const outputDir = path.join(
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\86701703-265b-499b-b383-7e58303b94c8\\screenshots\\d3',
);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const viewports = [
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'desktop_1366', width: 1366, height: 768 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'mobile_390', width: 390, height: 844 },
  { name: 'mobile_430', width: 430, height: 932 },
];

test.describe('Visual Screenshots for Dealership Batch D3 (WEB-023 to WEB-038)', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'fdc_web_session',
        value: 'demo_dealer_session',
        domain: 'localhost',
        path: '/',
      },
    ]);
  });

  for (const vp of viewports) {
    test(`Capture Batch D3 screens at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. WEB-023: Category Selection
      await page.goto('/concessionaria/anuncios/novo');
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(outputDir, `web_023_category_${vp.name}.png`),
      });

      // 2. WEB-024: Details
      await page.goto('/concessionaria/anuncios/novo/detalhes');
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(outputDir, `web_024_details_${vp.name}.png`),
      });

      // 3. WEB-034: Edit Published Listing
      await page.goto('/concessionaria/anuncios/dlr-veh-001/editar');
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(outputDir, `web_034_edit_${vp.name}.png`),
      });

      // 4. WEB-035: Revision Comparison
      await page.goto('/concessionaria/anuncios/dlr-veh-001/revisoes');
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(outputDir, `web_035_revisoes_${vp.name}.png`),
      });

      // 5. WEB-038: Sold Vehicle Removal
      await page.goto('/concessionaria/anuncios/dlr-veh-001/vendido');
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(outputDir, `web_038_sold_${vp.name}.png`),
      });
    });
  }
});

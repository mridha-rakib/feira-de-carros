import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';

const outputDir = path.join(
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\86701703-265b-499b-b383-7e58303b94c8\\screenshots\\d2',
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

test.describe('Visual Screenshots for Dealership Batch D2 (WEB-021)', () => {
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
    test(`Capture Batch D2 inventory screen at ${vp.name} (${vp.width}x${vp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. WEB-021: Inventory Overview & Fleet Management (Figma 1592:3472 / 1592:3701)
      await page.goto('/concessionaria/anuncios');
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(outputDir, `web_021_inventory_${vp.name}.png`),
      });

      // 2. D3 Boundary Modal (Novo Anúncio)
      const newListingBtn = page.getByTestId('btn-new-listing');
      if (await newListingBtn.isVisible()) {
        await newListingBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(outputDir, `modal_new_listing_d3_${vp.name}.png`),
        });
        const closeBtn = page.getByRole('button', { name: 'Entendido' });
        if (await closeBtn.isVisible()) {
          await closeBtn.click();
          await page.waitForTimeout(200);
        }
      }

      // 3. View Details Modal
      const viewBtn = page.getByTestId('btn-view-dlr-veh-001').first();
      if (await viewBtn.isVisible()) {
        await viewBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(outputDir, `modal_view_vehicle_${vp.name}.png`),
        });
        const closeViewBtn = page.getByRole('button', { name: 'Fechar' });
        if (await closeViewBtn.isVisible()) {
          await closeViewBtn.click();
          await page.waitForTimeout(200);
        }
      }
    });
  }
});

import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';

const outputDir = path.join(
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\86701703-265b-499b-b383-7e58303b94c8\\screenshots\\d4',
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

test.describe('Visual Screenshots for Dealership Batch D4 (WEB-022)', () => {
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
    test(`Capture Batch D4 screens at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. WEB-022: Business Profile Editor
      await page.goto('/concessionaria/perfil');
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(outputDir, `web_022_profile_editor_${vp.name}.png`),
        fullPage: true,
      });

      // 2. Buyer-Facing Showroom with Preview Banner
      await page.goto('/concessionarias/dealer-lider-seminovos?preview=true');
      await page.waitForTimeout(300);
      await page.screenshot({
        path: path.join(outputDir, `web_022_showroom_preview_${vp.name}.png`),
        fullPage: true,
      });
    });
  }
});

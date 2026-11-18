import path from 'node:path';
import { test } from '@playwright/test';

const VIEWPORTS = [
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'desktop_1366', width: 1366, height: 768 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'mobile_430', width: 430, height: 932 },
  { name: 'mobile_390', width: 390, height: 844 },
];

test.describe('Capture Visuals — /criar-conta across 5 Viewports', () => {
  for (const vp of VIEWPORTS) {
    test(`capture /criar-conta at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/criar-conta', { waitUntil: 'networkidle' });

      const screenshotsDir = path.resolve(
        'C:/Users/rakib_bro/.gemini/antigravity/brain/86701703-265b-499b-b383-7e58303b94c8/screenshots/criar-conta',
      );
      await page.screenshot({
        path: path.join(screenshotsDir, `after_${vp.name}.png`),
        fullPage: true,
      });
    });
  }
});

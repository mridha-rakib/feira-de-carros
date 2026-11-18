import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';

const outputDir = path.join(
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\86701703-265b-499b-b383-7e58303b94c8\\screenshots\\b4',
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

test.describe('Visual Screenshots for Buyer Batch B4', () => {
  test.slow();
  for (const vp of viewports) {
    test(`Capture Batch B4 screens at ${vp.name} (${vp.width}x${vp.height})`, async ({
      page,
      context,
    }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. Favorites Login Required (Figma 840:317 / 840:646) - Unauthenticated
      await page.goto('/favoritos');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(outputDir, `web_004_favorites_login_required_${vp.name}.png`),
      });

      // 2. Favorites Registered View (Figma 733:232 / 733:274) - Authenticated
      const demoLoginBtn = page.getByRole('button', {
        name: /Simular login como João Silva/i,
      });
      if (await demoLoginBtn.isVisible()) {
        await demoLoginBtn.click();
        await page.waitForTimeout(500);
      }
      await page.screenshot({
        path: path.join(outputDir, `web_004_favorites_registered_${vp.name}.png`),
      });

      // 3. Favorites Empty State (Figma 840:110 / 840:527)
      page.once('dialog', (dialog) => dialog.accept());
      const clearBtn = page.getByRole('button', { name: 'Limpar todos' });
      if (await clearBtn.isVisible()) {
        await clearBtn.click();
        await page.waitForTimeout(400);
        await page.screenshot({
          path: path.join(outputDir, `web_004_favorites_empty_${vp.name}.png`),
        });
      }

      // Add session cookie for account routes
      await context.addCookies([
        {
          name: 'fdc_web_session',
          value: 'mock-buyer-session',
          domain: 'localhost',
          path: '/',
        },
      ]);

      // 4. Saved Searches (Figma 856:165 / 856:192)
      await page.goto('/buscas-salvas');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(outputDir, `web_009_saved_searches_${vp.name}.png`),
      });

      // 5. Matching Alerts (Figma 856:219 / 856:240)
      await page.goto('/conta/alertas');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(outputDir, `web_010_matching_alerts_${vp.name}.png`),
      });

      // 6. Notification Preferences (Figma 856:261 / 856:282)
      await page.goto('/conta/notificacoes');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(outputDir, `web_011_notification_preferences_${vp.name}.png`),
      });
    });
  }
});

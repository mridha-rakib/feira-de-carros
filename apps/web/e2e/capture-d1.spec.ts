import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';

const outputDir = path.join(
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\86701703-265b-499b-b383-7e58303b94c8\\screenshots\\d1',
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

test.describe('Visual Screenshots for Dealership Batch D1', () => {
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
    test(`Capture Batch D1 screens at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. WEB-017: Registration Form (Figma 1575:3428 / 1582:3455)
      await page.goto('/concessionaria/solicitacao');
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(outputDir, `web_017_registration_${vp.name}.png`),
      });

      // 2. Helper Modal (Figma 1629:3604)
      const guideBtn = page.getByRole('button', { name: /Guia de cadastro/i });
      if (await guideBtn.isVisible()) {
        await guideBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(outputDir, `modal_helper_${vp.name}.png`),
        });
        const closeHelperBtn = page.getByRole('button', { name: 'Entendi' });
        if (await closeHelperBtn.isVisible()) {
          await closeHelperBtn.click();
          await page.waitForTimeout(200);
        }
      }

      // 3. Status Tracking Page (Figma 1629:3592 / 1629:3646)
      await page.goto('/concessionaria/solicitacao/status');
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(outputDir, `status_pending_${vp.name}.png`),
      });

      // 4. Status Action Modal (Figma 1629:3592)
      const actionsBtn = page.getByRole('button', { name: 'Ações do anúncio' });
      if (await actionsBtn.isVisible()) {
        await actionsBtn.click();
        await page.waitForTimeout(300);
        await page.screenshot({
          path: path.join(outputDir, `modal_status_action_${vp.name}.png`),
        });
        const cancelBtn = page.getByRole('button', { name: 'Cancelar' });
        if (await cancelBtn.isVisible()) {
          await cancelBtn.click();
          await page.waitForTimeout(200);
        }
      }

      // 5. Correction Form (Figma 1629:3560 / 1629:3614)
      await page.goto('/concessionaria/solicitacao/corrigir');
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(outputDir, `correction_form_${vp.name}.png`),
      });

      // 6. Shared Login Page with Persona Quick-Fills (/entrar)
      await page.goto('/entrar');
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(outputDir, `shared_login_${vp.name}.png`),
      });
    });
  }
});

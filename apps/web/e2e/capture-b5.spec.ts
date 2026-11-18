import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';

const outputDir = path.join(
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\86701703-265b-499b-b383-7e58303b94c8\\screenshots\\b5',
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

test.describe('Visual Screenshots for Buyer Batch B5', () => {
  for (const vp of viewports) {
    test(`Capture Batch B5 screens at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // 1. WEB-015: Login Required State (Figma 1168:488 / 1168:527) - Guest
      await page.goto('/mensagens');
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(outputDir, `web_015_login_required_${vp.name}.png`),
      });

      // Authenticate via /entrar
      await page.goto('/entrar?redirect=/mensagens');
      await page.getByRole('button', { name: 'Continuar com Google' }).click();
      await page.getByRole('button', { name: /Entrar \(simulação\)/i }).click();
      await page.waitForURL('**/mensagens');
      await page.waitForTimeout(500);

      // 2. WEB-012: Buyer Inbox (Figma 1168:202 / 1168:266)
      await page.screenshot({
        path: path.join(outputDir, `web_012_buyer_inbox_${vp.name}.png`),
      });

      // 3. WEB-013: Active Conversation Thread (Figma 1168:310 / 1168:369)
      const corollaBtn = page.getByRole('button', { name: /Carlos Eduardo Mendes/i });
      if (await corollaBtn.isVisible()) {
        await corollaBtn.click();
        await page.waitForTimeout(400);
      }
      await page.screenshot({
        path: path.join(outputDir, `web_013_active_conversation_${vp.name}.png`),
      });

      // 4. WEB-017: Report & Block Modal (Figma 1168:614 / 1168:658)
      const moreBtn = page.getByRole('button', { name: 'Opções da conversa' });
      if (await moreBtn.isVisible()) {
        await moreBtn.click();
        const reportOption = page.getByRole('button', { name: /Denunciar anunciante/i });
        if (await reportOption.isVisible()) {
          await reportOption.click();
          await page.waitForTimeout(400);
          await page.screenshot({
            path: path.join(outputDir, `web_017_report_modal_${vp.name}.png`),
          });
          const cancelBtn = page.getByRole('button', { name: 'Cancelar' });
          if (await cancelBtn.isVisible()) {
            await cancelBtn.click();
            await page.waitForTimeout(300);
          }
        }
      }

      // 5. WEB-018: Read Only / Blocked Conversation (Figma 1168:693 / 1168:746)
      // Navigate or select Polo blocked conversation
      await page.goto('/mensagens?id=conv-bloqueada-polo');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(outputDir, `web_018_read_only_${vp.name}.png`),
      });

      // 6. WEB-019: Team Mediated Conversation (Figma 1168:790 / 1168:846)
      await page.goto('/mensagens?id=conv-mediada-compass');
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(outputDir, `web_019_team_mediated_${vp.name}.png`),
      });
    });
  }
});

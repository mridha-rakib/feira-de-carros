import fs from 'node:fs';
import path from 'node:path';
import { test } from '@playwright/test';

const BREAKPOINTS = [
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'desktop_1366', width: 1366, height: 768 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'mobile_430', width: 430, height: 932 },
  { name: 'mobile_390', width: 390, height: 844 },
];

const TARGETS = [
  { slug: 'web_045_messages_inbox', path: '/concessionaria/mensagens' },
  { slug: 'web_029_plan_selection', path: '/concessionaria/anuncios/dlr-veh-001/plano' },
  { slug: 'web_036_boost_offering', path: '/concessionaria/anuncios/dlr-veh-002/impulsionar' },
  { slug: 'web_037_renewal_offering', path: '/concessionaria/anuncios/dlr-veh-003/renovar' },
  { slug: 'web_030_pix_checkout', path: '/concessionaria/pedidos/DLR-ORD-1001/pix' },
  { slug: 'web_031_card_checkout', path: '/concessionaria/pedidos/DLR-ORD-1001/cartao' },
];

test.describe('Dealership D5 Responsive Screenshot Capture Suite', () => {
  const outputDir = path.resolve(process.cwd(), 'screenshots/d5');
  const artifactDir =
    'C:/Users/rakib_bro/.gemini/antigravity/brain/86701703-265b-499b-b383-7e58303b94c8/screenshots/d5';

  test.beforeAll(() => {
    fs.mkdirSync(outputDir, { recursive: true });
    try {
      fs.mkdirSync(artifactDir, { recursive: true });
    } catch {
      // ignore
    }
  });

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

  for (const bp of BREAKPOINTS) {
    for (const target of TARGETS) {
      test(`Capture ${target.slug} @ ${bp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: bp.width, height: bp.height });
        await page.goto(target.path, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(400);

        const filename = `${target.slug}_${bp.name}.png`;
        const localPath = path.join(outputDir, filename);
        await page.screenshot({ path: localPath, fullPage: false });

        try {
          const artPath = path.join(artifactDir, filename);
          fs.copyFileSync(localPath, artPath);
        } catch {
          // ignore
        }
      });
    }
  }
});

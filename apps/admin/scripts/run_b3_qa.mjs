process.env.ADMIN_E2E_MOCK = 'true';

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';
import next from 'next';

const PORT = 3012;
const BASE_URL = `http://localhost:${PORT}`;

const ROOT_SCREENSHOTS_DIR = path.resolve(import.meta.dirname, '../../../screenshots/admin-b3');
const ARTIFACTS_DIR =
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\a7c0407c-7356-40dd-bed2-ada338d6a46f\\screenshots';

for (const dir of [ROOT_SCREENSHOTS_DIR, ARTIFACTS_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function saveScreenshot(page, filename, options = {}) {
  const p1 = path.join(ROOT_SCREENSHOTS_DIR, filename);
  const p2 = path.join(ARTIFACTS_DIR, filename);
  await page.screenshot({ path: p1, ...options });
  fs.copyFileSync(p1, p2);
  console.log(`[Screenshot Captured] ${filename}`);
}

async function main() {
  console.log('Preparing Next.js server on port', PORT, '...');
  const app = next({
    dev: false,
    dir: path.resolve(import.meta.dirname, '..'),
    quiet: true,
  });
  await app.prepare();
  const handle = app.getRequestHandler();

  const server = http.createServer((req, res) => handle(req, res));
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Server listening on ${BASE_URL}`);

  console.log('Launching Chromium...');
  const browser = await chromium.launch({ headless: true });

  try {
    // =========================================================================
    // 1. DESKTOP 1600px (Figma ADM-D-003 & DETAIL-01 Mariana Costa)
    // =========================================================================
    console.log('\n--- Testing Desktop 1600px (ADM-D-003) ---');
    const context1600 = await browser.newContext({
      viewport: { width: 1600, height: 900 },
    });
    await context1600.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);

    const page1600 = await context1600.newPage();
    await page1600.goto(`${BASE_URL}/usuarios`);
    const desktopView = page1600.getByTestId('desktop-users-management');
    await desktopView.waitFor({ state: 'visible' });

    // Wait for content & Mariana Costa detail panel (DETAIL-01)
    await desktopView.getByText('Mariana Silva Costa').first().waitFor({ state: 'visible' });
    await saveScreenshot(page1600, 'ADM-D-003-Desktop-Users-1600px.png', { fullPage: true });
    await saveScreenshot(page1600, 'ADM-D-003-DETAIL-01-Mariana-Costa.png', { fullPage: true });

    // =========================================================================
    // 2. DESKTOP 1366px
    // =========================================================================
    console.log('\n--- Testing Desktop 1366px ---');
    await page1600.setViewportSize({ width: 1366, height: 768 });
    await saveScreenshot(page1600, 'ADM-D-003-Desktop-Users-1366px.png', { fullPage: true });

    // =========================================================================
    // 3. DESKTOP PAGINATION (Page 2)
    // =========================================================================
    console.log('\n--- Testing Pagination Page 2 ---');
    await page1600.setViewportSize({ width: 1600, height: 900 });
    const page2Button = desktopView
      .locator('[data-testid="admin-pagination"]')
      .getByRole('button', { name: '2', exact: true });
    await page2Button.click();
    await desktopView.getByText('Pioneiro Automóveis Ltda').first().waitFor({ state: 'visible' });
    await saveScreenshot(page1600, 'ADM-D-003-Desktop-Users-Page2-1600px.png', { fullPage: true });

    // Reset back to Page 1
    const page1Button = desktopView
      .locator('[data-testid="admin-pagination"]')
      .getByRole('button', { name: '1', exact: true });
    await page1Button.click();
    await desktopView.getByText('Mariana Silva Costa').first().waitFor({ state: 'visible' });

    // =========================================================================
    // 4. USER SELECTION INTERACTION (DETAIL-02 through DETAIL-07)
    // =========================================================================
    console.log('\n--- Testing Detail Selections (DETAIL-02 to DETAIL-07) ---');

    // Bruno Almeida (DETAIL-02)
    await desktopView.getByText('Bruno Ferreira Almeida').first().click();
    await page1600.waitForSelector(
      '[data-testid="selected-user-detail-panel"] >> text=USR-2026-0002',
    );
    await saveScreenshot(page1600, 'ADM-D-003-DETAIL-02-Bruno-Almeida.png', { fullPage: true });
    console.log('✓ Bruno Almeida (DETAIL-02) captured');

    // Vale Auto Veículos (DETAIL-03)
    await desktopView.getByText('Vale Auto Veículos Ltda').first().click();
    await page1600.waitForSelector(
      '[data-testid="selected-user-detail-panel"] >> text=12 veículos no catálogo',
    );
    await saveScreenshot(page1600, 'ADM-D-003-DETAIL-03-Vale-Auto-Veiculos.png', {
      fullPage: true,
    });
    console.log('✓ Vale Auto Veículos (DETAIL-03) captured');

    // Rafael Santos (DETAIL-04)
    await desktopView.getByText('Rafael Santos Pereira').first().click();
    await page1600.waitForSelector(
      '[data-testid="selected-user-detail-panel"] >> text=USR-2026-0004',
    );
    await saveScreenshot(page1600, 'ADM-D-003-DETAIL-04-Rafael-Santos.png', { fullPage: true });
    console.log('✓ Rafael Santos (DETAIL-04) captured');

    // Lucas Ribeiro (DETAIL-05 — Registered Buyer)
    await desktopView.getByText('Lucas Ribeiro Alvarenga').first().click();
    await page1600.waitForSelector(
      '[data-testid="selected-user-detail-panel"] >> text=USR-2026-0005',
    );
    await saveScreenshot(page1600, 'ADM-D-003-DETAIL-05-Lucas-Ribeiro-Comprador.png', {
      fullPage: true,
    });
    await saveScreenshot(page1600, 'ADM-D-003-DETAIL-05-Lucas-Ribeiro-Suspenso.png', {
      fullPage: true,
    });
    console.log('✓ Lucas Ribeiro (DETAIL-05) captured');

    // Fernanda Rocha (DETAIL-06 — Suspended Seller)
    await desktopView.getByText('Fernanda Mendes Rocha').first().click();
    await page1600.waitForSelector(
      '[data-testid="selected-user-detail-panel"] >> text=USR-2026-0006',
    );
    await saveScreenshot(page1600, 'ADM-D-003-DETAIL-06-Fernanda-Rocha.png', { fullPage: true });
    await saveScreenshot(page1600, 'ADM-D-003-DETAIL-06-Fernanda-Rocha-Suspenso.png', {
      fullPage: true,
    });
    console.log('✓ Fernanda Rocha (DETAIL-06) captured');

    // Tiago Pereira (DETAIL-07)
    await desktopView.getByText('Tiago Pereira').first().click();
    await page1600.waitForSelector(
      '[data-testid="selected-user-detail-panel"] >> text=USR-2026-0007',
    );
    await saveScreenshot(page1600, 'ADM-D-003-DETAIL-07-Tiago-Pereira.png', { fullPage: true });
    console.log('✓ Tiago Pereira (DETAIL-07) captured');

    // =========================================================================
    // 5. INSPECTION MODAL (Mariana Costa Full Dossier)
    // =========================================================================
    console.log('\n--- Testing User Inspection Modal ---');
    await desktopView.getByText('Mariana Silva Costa').first().click();
    await page1600.click(
      '[data-testid="selected-user-detail-panel"] button:has-text("Abrir Dossiê Completo")',
    );
    await page1600.waitForSelector('[data-testid="user-inspection-modal"]');
    await saveScreenshot(page1600, 'ADM-D-003-Inspection-Modal.png');

    // Switch tab to Activity
    await page1600.click(
      '[data-testid="user-inspection-modal"] button:has-text("Atividade no Portal")',
    );
    await page1600.waitForSelector('text=Veículos Favoritos');

    // Close Modal
    await page1600.click(
      '[data-testid="user-inspection-modal"] button:has-text("Concluir Inspeção")',
    );
    await page1600.waitForSelector('[data-testid="user-inspection-modal"]', { state: 'hidden' });

    // =========================================================================
    // 6. STATUS CHANGE MODAL (Desktop Main Admin action)
    // =========================================================================
    console.log('\n--- Testing Status Change Modal ---');
    await page1600.click('[data-testid="selected-user-detail-panel"] button:has-text("Suspender")');
    await page1600.waitForSelector('[data-testid="user-status-change-modal"]');
    await saveScreenshot(page1600, 'ADM-D-003-Status-Modal.png');

    await page1600.click('[data-testid="user-status-change-modal"] button:has-text("Cancelar")');
    await page1600.waitForSelector('[data-testid="user-status-change-modal"]', { state: 'hidden' });

    // Capture Brand Logo & Navigation on Login Page
    console.log('\n--- Testing Login Page (ADM-D-001) Brand Logo ---');
    const loginContext = await browser.newContext({
      viewport: { width: 1600, height: 900 },
    });
    const loginPage = await loginContext.newPage();
    await loginPage.goto(`${BASE_URL}/login`);
    await loginPage.waitForSelector('img[alt="Feira de Carros"]');
    await saveScreenshot(loginPage, 'ADM-D-001-Desktop-Login-1600px.png', { fullPage: true });
    await loginContext.close();

    await context1600.close();

    // =========================================================================
    // 7. TABLET 768px (ADM-D-003 / ADM-M-008)
    // =========================================================================
    console.log('\n--- Testing Tablet 768px ---');
    const contextTablet = await browser.newContext({
      viewport: { width: 768, height: 1024 },
    });
    await contextTablet.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);
    const pageTablet = await contextTablet.newPage();
    await pageTablet.goto(`${BASE_URL}/usuarios`);
    await pageTablet.waitForSelector('[data-testid="mobile-users-management"]');
    await saveScreenshot(pageTablet, 'ADM-D-003-Tablet-Users-768px.png', { fullPage: true });
    await contextTablet.close();

    // =========================================================================
    // 8. MOBILE VIEWPORTS & READ-ONLY MODAL (ADM-M-008)
    // =========================================================================
    console.log('\n--- Testing Mobile (ADM-M-008) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    await mobileContext.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${BASE_URL}/usuarios`);
    await mobilePage.waitForSelector('[data-testid="mobile-users-management"]');

    // 390px
    await saveScreenshot(mobilePage, 'ADM-M-008-Mobile-Users-390px.png', { fullPage: true });

    // 360px
    await mobilePage.setViewportSize({ width: 360, height: 800 });
    await saveScreenshot(mobilePage, 'ADM-M-008-Mobile-Users-360px.png', { fullPage: true });

    // 430px
    await mobilePage.setViewportSize({ width: 430, height: 932 });
    await saveScreenshot(mobilePage, 'ADM-M-008-Mobile-Users-430px.png', { fullPage: true });

    // Perform Authorized Customer Lookup for Mariana Costa (ADM-M-008)
    await mobilePage.setViewportSize({ width: 390, height: 844 });
    await mobilePage.getByRole('button', { name: 'Mariana Costa' }).click();
    await mobilePage.waitForSelector('text=Mariana Silva Costa');

    // Open Mobile Read-Only Inspection Modal
    await mobilePage
      .locator('button:has-text("Inspecionar Dossiê (Modo Leitura)")')
      .first()
      .click();
    await mobilePage.waitForSelector('[data-testid="user-inspection-modal"]');
    await mobilePage.waitForSelector('text=Consulta em modo leitura no mobile');
    await saveScreenshot(mobilePage, 'ADM-M-008-Mobile-Inspection-Modal.png');

    await mobileContext.close();

    console.log('\n===========================================');
    console.log('✓ All B3 QA Screenshots Captured Successfully!');
    console.log('===========================================\n');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('QA Test execution failed:', err);
  process.exit(1);
});

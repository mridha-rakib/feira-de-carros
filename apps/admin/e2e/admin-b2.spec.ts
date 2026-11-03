import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const outputDir =
  process.env.VISUAL_SCREENSHOT_DIR ||
  (process.env.CI
    ? path.join(process.cwd(), 'playwright-report', 'screenshots')
    : 'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\56db1518-8764-44d2-b32f-7eaeabd2599b\\screenshots');

if (!fs.existsSync(outputDir)) {
  try {
    fs.mkdirSync(outputDir, { recursive: true });
  } catch {
    // Ignore in read-only runner
  }
}

test.describe('Admin B2 — Seller Approval (ADM-D-003 & ADM-M-002)', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);
  });

  test('desktop ADM-D-003: renders seller approval table, metrics, and inspection modal', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop only test');
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/vendedores');

    // Verify Desktop Container
    const desktopView = page.getByTestId('desktop-seller-approval');
    await expect(desktopView).toBeVisible();

    // Verify Headers & Metrics
    await expect(
      desktopView.getByRole('heading', { name: 'Aprovação de Vendedores' }),
    ).toBeVisible();
    await expect(desktopView.getByText('Pendentes de Análise')).toBeVisible();
    await expect(desktopView.getByText('Concessionárias', { exact: true })).toBeVisible();

    // Verify Table Rows
    await expect(desktopView.locator('table')).toBeVisible();
    await expect(desktopView.getByText('Mariana Silva Costa')).toBeVisible();
    await expect(desktopView.getByText('Vale Auto Veículos Ltda')).toBeVisible();

    // Test Search Filter
    const searchInput = desktopView.getByPlaceholder(/Buscar por nome/i);
    await searchInput.fill('Bruno');
    await expect(desktopView.getByText('Bruno Ferreira Almeida')).toBeVisible();
    await expect(desktopView.getByText('Mariana Silva Costa')).not.toBeVisible();
    await searchInput.fill('');

    // Test Type Filter
    await desktopView.getByRole('button', { name: /Concessionárias/i }).click();
    await expect(desktopView.getByText('Vale Auto Veículos Ltda')).toBeVisible();
    await expect(desktopView.getByText('Bruno Ferreira Almeida')).not.toBeVisible();
    await desktopView.getByRole('button', { name: /Todos/i }).click();

    // Test Inspection Modal
    const inspectBtn = desktopView.locator('button', { hasText: 'Analisar' }).first();
    await inspectBtn.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(modal.getByText(/Documento Cadastrado/i)).toBeVisible();
    await expect(modal.getByText(/Comprovante de Residência/i)).toBeVisible();

    // Capture Inspection Modal Screenshot
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-003-Inspection-Modal.png'),
        fullPage: false,
      });
    } catch {
      // Ignored if write fails
    }

    // Close Modal
    await modal.getByRole('button', { name: 'Fechar modal' }).click();
    await expect(modal).not.toBeVisible();

    // Capture Desktop Screenshots
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-003-Desktop-Seller-Approval-1600px.png'),
        fullPage: true,
      });
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-003-Desktop-Seller-Approval-1366px.png'),
        fullPage: true,
      });
    } catch {
      // Ignored if write fails
    }
  });

  test('mobile ADM-M-002: renders mobile cards, quick metrics, and navigation', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Runs with custom viewport on desktop runner');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/vendedores');

    // Verify Mobile Container
    const mobileView = page.getByTestId('mobile-seller-approval');
    await expect(mobileView).toBeVisible();

    // Verify Mobile Header
    await expect(mobileView.getByText('Vendedores • ADM-M-002')).toBeVisible();
    await expect(
      mobileView.getByRole('heading', { name: 'Aprovação de Vendedores' }),
    ).toBeVisible();

    // Verify Mobile Cards
    await expect(mobileView.getByText('Mariana Silva Costa')).toBeVisible();
    await expect(
      mobileView.locator('button', { hasText: 'Analisar documentos' }).first(),
    ).toBeVisible();

    // Capture Mobile Screenshots
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-M-002-Mobile-Seller-Approval-390px.png'),
        fullPage: true,
      });
      await page.setViewportSize({ width: 360, height: 780 });
      await page.screenshot({
        path: path.join(outputDir, 'ADM-M-002-Mobile-Seller-Approval-360px.png'),
        fullPage: true,
      });
    } catch {
      // Ignored if write fails
    }
  });
});

test.describe('Admin B2 — Advertisements Moderation (ADM-D-004 & ADM-M-003)', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);
  });

  test('desktop ADM-D-004: renders moderation table, FIPE comparison, and inspection modal', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop only test');
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/anuncios');

    // Verify Desktop Container
    const desktopView = page.getByTestId('desktop-ad-moderation');
    await expect(desktopView).toBeVisible();

    // Verify Headers & Metrics
    await expect(desktopView.getByRole('heading', { name: 'Moderação de Anúncios' })).toBeVisible();
    await expect(desktopView.getByText('Pendentes de Revisão')).toBeVisible();
    await expect(desktopView.getByText('Destaques Pagos')).toBeVisible();

    // Verify Table Rows with FIPE comparison
    await expect(desktopView.locator('table')).toBeVisible();
    await expect(desktopView.getByText('Fiat Strada 1.3 Freedom Cabine Dupla 2023')).toBeVisible();
    await expect(
      desktopView.getByText('Chevrolet Onix 1.0 Turbo Premier Automático 2022'),
    ).toBeVisible();

    // Test Search Filter
    const searchInput = desktopView.getByPlaceholder(/Buscar veículo/i);
    await searchInput.fill('Polo');
    await expect(desktopView.getByText('Volkswagen Polo Track 1.0 MPI 2023')).toBeVisible();
    await expect(
      desktopView.getByText('Fiat Strada 1.3 Freedom Cabine Dupla 2023'),
    ).not.toBeVisible();
    await searchInput.fill('');

    // Test Inspection Modal
    const reviewBtn = desktopView.locator('button', { hasText: 'Revisar' }).first();
    await reviewBtn.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: /Fiat Strada/i })).toBeVisible();
    await expect(modal.getByText(/Referência Tabela FIPE/i)).toBeVisible();
    await expect(modal.getByText(/Valor Anunciado/i)).toBeVisible();

    // Capture Inspection Modal Screenshot
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-004-Inspection-Modal.png'),
        fullPage: false,
      });
    } catch {
      // Ignored if write fails
    }

    // Close Modal
    await modal.getByRole('button', { name: 'Fechar modal' }).click();
    await expect(modal).not.toBeVisible();

    // Capture Desktop Screenshots
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-004-Desktop-Ad-Moderation-1600px.png'),
        fullPage: true,
      });
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-004-Desktop-Ad-Moderation-1366px.png'),
        fullPage: true,
      });
    } catch {
      // Ignored if write fails
    }
  });

  test('mobile ADM-M-003: renders mobile vehicle cards, FIPE indicators, and navigation', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Runs with custom viewport on desktop runner');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/anuncios');

    // Verify Mobile Container
    const mobileView = page.getByTestId('mobile-ad-moderation');
    await expect(mobileView).toBeVisible();

    // Verify Mobile Header
    await expect(mobileView.getByText('Anúncios • ADM-M-003')).toBeVisible();
    await expect(mobileView.getByRole('heading', { name: 'Moderação de Veículos' })).toBeVisible();

    // Verify Mobile Cards
    await expect(mobileView.getByText('Fiat Strada 1.3 Freedom Cabine Dupla 2023')).toBeVisible();
    await expect(
      mobileView.locator('button', { hasText: 'Revisar anúncio' }).first(),
    ).toBeVisible();

    // Capture Mobile Screenshots
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-M-003-Mobile-Ad-Moderation-390px.png'),
        fullPage: true,
      });
      await page.setViewportSize({ width: 360, height: 780 });
      await page.screenshot({
        path: path.join(outputDir, 'ADM-M-003-Mobile-Ad-Moderation-360px.png'),
        fullPage: true,
      });
    } catch {
      // Ignored if write fails
    }
  });
});

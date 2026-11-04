import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const outputDir =
  process.env.VISUAL_SCREENSHOT_DIR ||
  (process.env.CI
    ? path.join(process.cwd(), 'playwright-report', 'screenshots')
    : 'C:\\Users\\rakib_bro\\sta-projects\\feira-de-carros\\frontend\\screenshots');

if (!fs.existsSync(outputDir)) {
  try {
    fs.mkdirSync(outputDir, { recursive: true });
  } catch {
    // Ignore in read-only runner
  }
}

test.describe('Admin B2 — Seller Approval (ADM-D-005 & ADM-M-002)', () => {
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

  test('desktop ADM-D-005: renders queue, selected seller detail panel, and interactive actions', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop only test');
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/vendedores');

    // Verify Desktop Container
    const desktopView = page.getByTestId('desktop-seller-approval');
    await expect(desktopView).toBeVisible();

    // Verify Headers & Metrics (ADM-D-005)
    await expect(
      desktopView.getByRole('heading', { name: 'Aprovação de Vendedores' }),
    ).toBeVisible();
    await expect(desktopView.getByText('Pendentes de Análise')).toBeVisible();
    await expect(desktopView.getByText('Concessionárias', { exact: true })).toBeVisible();

    // Verify Queue Table
    await expect(desktopView.locator('table')).toBeVisible();
    await expect(desktopView.getByText('Mariana Silva Costa').first()).toBeVisible();
    await expect(desktopView.getByText('Vale Auto Veículos Ltda').first()).toBeVisible();

    // Verify Selected Seller Detail Panel (Figma ADM-D-005)
    const detailPanel = desktopView.getByTestId('selected-seller-detail-panel');
    await expect(detailPanel).toBeVisible();
    await expect(detailPanel.getByRole('button', { name: 'Aprovar Vendedor' })).toBeVisible();
    await expect(detailPanel.getByRole('button', { name: 'Solicitar Correção' })).toBeVisible();
    await expect(detailPanel.getByRole('button', { name: 'Recusar Cadastro' })).toBeVisible();

    // Test Selecting Different Row in Queue
    const secondRow = desktopView.locator('table tbody tr').nth(1);
    await secondRow.click();
    await expect(detailPanel.getByText('Vale Auto Veículos Ltda')).toBeVisible();

    // Test Search Filter
    const searchInput = desktopView.getByPlaceholder(/Buscar por nome/i);
    await searchInput.fill('Bruno');
    await expect(desktopView.locator('table').getByText('Bruno Ferreira Almeida')).toBeVisible();
    await expect(desktopView.locator('table').getByText('Mariana Silva Costa')).not.toBeVisible();
    await searchInput.fill('');

    // Verify Pagination (ADM-D-005: 21 sellers -> 3 pages)
    const pagination = desktopView.getByTestId('admin-pagination');
    await expect(pagination).toBeVisible();
    await expect(pagination.getByText(/1–10/i)).toBeVisible();
    await expect(pagination.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    const nextBtn = pagination.getByRole('button', { name: 'Próximo' });
    await expect(nextBtn).toBeEnabled();

    // Navigate to page 2 (11–20) and page 3 (21–21)
    await nextBtn.click();
    await expect(pagination.getByText(/11–20/i)).toBeVisible();
    await expect(pagination.getByRole('button', { name: 'Anterior' })).toBeEnabled();

    // Capture Pagination Page 2 Screenshot
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-005-Desktop-Seller-Approval-Page2-1600px.png'),
        fullPage: true,
      });
    } catch {
      // Ignored if write fails
    }

    await nextBtn.click();
    await expect(pagination.getByText(/21–21/i)).toBeVisible();
    await expect(nextBtn).toBeDisabled();

    // Navigate back to page 1
    await pagination.getByRole('button', { name: '1', exact: true }).click();
    await expect(pagination.getByText(/1–10/i)).toBeVisible();

    // Test Inspection Modal (Desktop Full View)
    const inspectBtn = desktopView.locator('button', { hasText: 'Analisar' }).first();
    await inspectBtn.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(modal.getByText(/Documento Cadastrado/i)).toBeVisible();
    await expect(modal.getByText(/Comprovante de Residência/i)).toBeVisible();
    // Desktop modal has decision action
    await expect(modal.getByRole('button', { name: 'Aprovar Vendedor' })).toBeVisible();

    // Capture Inspection Modal Screenshot
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-005-Inspection-Modal.png'),
        fullPage: false,
      });
    } catch {
      // Ignored if write fails
    }

    // Close Modal
    await modal.getByRole('button', { name: 'Fechar modal' }).click();
    await expect(modal).not.toBeVisible();

    // Capture Desktop Screenshots (1600px & 1366px)
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-005-Desktop-Seller-Approval-1600px.png'),
        fullPage: true,
      });
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-005-Desktop-Seller-Approval-1366px.png'),
        fullPage: true,
      });
    } catch {
      // Ignored if write fails
    }
  });

  test('mobile ADM-M-002: strictly read-only authorization (no approval/rejection controls)', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Runs with custom viewport on desktop runner');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/vendedores');

    // Verify Mobile Container
    const mobileView = page.getByTestId('mobile-seller-approval');
    await expect(mobileView).toBeVisible();

    // Verify Mobile Header (ADM-M-002)
    await expect(mobileView.getByText('Solicitações de vendedores • ADM-M-002')).toBeVisible();
    await expect(
      mobileView.getByRole('heading', { name: 'Solicitações de Vendedores' }),
    ).toBeVisible();

    // Verify Mobile Cards have read-only trigger
    await expect(mobileView.getByText('Mariana Silva Costa')).toBeVisible();
    const openDetailBtn = mobileView
      .locator('button', { hasText: 'Ver detalhes e documentos' })
      .first();
    await expect(openDetailBtn).toBeVisible();

    // Crucial Task 2 Check: On mobile cards list, operational decision buttons are NOT exposed
    await expect(mobileView.getByRole('button', { name: 'Aprovar Vendedor' })).not.toBeVisible();
    await expect(mobileView.getByRole('button', { name: 'Recusar Cadastro' })).not.toBeVisible();

    // Mobile Load More Verification (ADM-M-002)
    const loadMoreBtn = mobileView.getByTestId('load-more-button');
    await expect(loadMoreBtn).toBeVisible();
    await loadMoreBtn.click();
    await expect(mobileView.getByText(/Exibindo 12 de/i)).toBeVisible();

    // Open Mobile Read-Only Modal
    await openDetailBtn.click();
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Crucial Task 2 Check: Mobile safety guard banner is displayed
    await expect(modal.getByTestId('mobile-readonly-guard-banner')).toBeVisible();
    await expect(
      modal.getByText(/Visualização móvel restrita \(ADM-021 \/ AUTH-019\)/i),
    ).toBeVisible();

    // Crucial Task 2 Check: Decision buttons are NOT present in mobile modal!
    await expect(modal.getByRole('button', { name: 'Aprovar Vendedor' })).not.toBeVisible();
    await expect(modal.getByRole('button', { name: 'Rejeitar Solicitação' })).not.toBeVisible();
    await expect(modal.getByRole('button', { name: 'Solicitar Correção' })).not.toBeVisible();

    // Capture Mobile Modal Screenshot (showing read-only state)
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-M-002-Mobile-Inspection-Modal.png'),
        fullPage: false,
      });
    } catch {
      // Ignored if write fails
    }

    // Close button works
    await modal.getByRole('button', { name: 'Fechar', exact: true }).click();
    await expect(modal).not.toBeVisible();

    // Capture Mobile Screenshots (430px, 390px, 360px)
    try {
      await page.setViewportSize({ width: 430, height: 932 });
      await page.screenshot({
        path: path.join(outputDir, 'ADM-M-002-Mobile-Seller-Approval-430px.png'),
        fullPage: true,
      });

      await page.setViewportSize({ width: 390, height: 844 });
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

test.describe('Admin B2 — Advertisements Moderation (ADM-D-014 & ADM-M-003)', () => {
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

  test('desktop ADM-D-014: renders queue, selected vehicle preview panel, and FIPE comparison', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop only test');
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/anuncios');

    // Verify Desktop Container
    const desktopView = page.getByTestId('desktop-ad-moderation');
    await expect(desktopView).toBeVisible();

    // Verify Headers & Metrics (ADM-D-014)
    await expect(
      desktopView.getByRole('heading', { name: 'Fila de Revisão de Anúncios' }),
    ).toBeVisible();
    await expect(desktopView.getByText('Pendentes de Revisão')).toBeVisible();
    await expect(desktopView.getByText('Destaques Pagos')).toBeVisible();

    // Verify Queue Table
    await expect(desktopView.locator('table')).toBeVisible();
    await expect(
      desktopView.getByText('Fiat Strada 1.3 Freedom Cabine Dupla 2023').first(),
    ).toBeVisible();

    // Verify Selected Vehicle Preview Panel (Figma ADM-D-014)
    const previewPanel = desktopView.getByTestId('selected-vehicle-preview-panel');
    await expect(previewPanel).toBeVisible();
    await expect(previewPanel.getByText('Referência FIPE')).toBeVisible();
    await expect(previewPanel.getByRole('button', { name: 'Aprovar e Publicar' })).toBeVisible();
    await expect(previewPanel.getByRole('button', { name: 'Solicitar Ajuste' })).toBeVisible();
    await expect(previewPanel.getByRole('button', { name: 'Reprovar Anúncio' })).toBeVisible();

    // Verify Vehicle Images in Queue Table & Selected Preview Panel
    const tableImages = desktopView.locator('table tbody tr img');
    await expect(tableImages.first()).toBeVisible();
    const previewImage = previewPanel.locator('img');
    await expect(previewImage.first()).toBeVisible();
    await expect(previewPanel.getByText('DEMO')).toBeVisible();

    // Test Selecting Another Row in Queue
    const secondRow = desktopView.locator('table tbody tr').nth(1);
    await secondRow.click();
    await expect(
      previewPanel.getByText('Chevrolet Onix 1.0 Turbo Premier Automático 2022'),
    ).toBeVisible();

    // Test Search Filter
    const searchInput = desktopView.getByPlaceholder(/Buscar veículo/i);
    await searchInput.fill('Polo');
    await expect(
      desktopView.locator('table').getByText('Volkswagen Polo Track 1.0 MPI 2023'),
    ).toBeVisible();
    await expect(
      desktopView.locator('table').getByText('Fiat Strada 1.3 Freedom Cabine Dupla 2023'),
    ).not.toBeVisible();
    await searchInput.fill('');

    // Verify Pagination (ADM-D-014: 18 ads -> 2 pages)
    const pagination = desktopView.getByTestId('admin-pagination');
    await expect(pagination).toBeVisible();
    await expect(pagination.getByText(/1–10/i)).toBeVisible();
    await expect(pagination.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    const nextBtn = pagination.getByRole('button', { name: 'Próximo' });
    await expect(nextBtn).toBeEnabled();

    // Navigate to page 2 (11–18)
    await nextBtn.click();
    await expect(pagination.getByText(/11–18/i)).toBeVisible();
    await expect(nextBtn).toBeDisabled();
    await expect(pagination.getByRole('button', { name: 'Anterior' })).toBeEnabled();

    // Capture Pagination Page 2 Screenshot
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-014-Desktop-Ad-Moderation-Page2-1600px.png'),
        fullPage: true,
      });
    } catch {
      // Ignored if write fails
    }

    // Navigate back to page 1
    await pagination.getByRole('button', { name: '1', exact: true }).click();
    await expect(pagination.getByText(/1–10/i)).toBeVisible();

    // Test Inspection Modal (Desktop Full View)
    const reviewBtn = desktopView.locator('button', { hasText: 'Revisar' }).first();
    await reviewBtn.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(modal.getByText(/Referência Tabela FIPE/i)).toBeVisible();
    await expect(modal.getByText(/Valor Anunciado/i)).toBeVisible();
    // Desktop modal has decision action
    await expect(modal.getByRole('button', { name: 'Aprovar e Publicar' })).toBeVisible();

    // Capture Inspection Modal Screenshot
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-014-Inspection-Modal.png'),
        fullPage: false,
      });
    } catch {
      // Ignored if write fails
    }

    // Close Modal
    await modal.getByRole('button', { name: 'Fechar modal' }).click();
    await expect(modal).not.toBeVisible();

    // Capture Desktop Screenshots (1600px & 1366px)
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-014-Desktop-Ad-Moderation-1600px.png'),
        fullPage: true,
      });
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.screenshot({
        path: path.join(outputDir, 'ADM-D-014-Desktop-Ad-Moderation-1366px.png'),
        fullPage: true,
      });
    } catch {
      // Ignored if write fails
    }
  });

  test('mobile ADM-M-003: strictly read-only authorization (no approval/rejection controls)', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Runs with custom viewport on desktop runner');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/anuncios');

    // Verify Mobile Container
    const mobileView = page.getByTestId('mobile-ad-moderation');
    await expect(mobileView).toBeVisible();

    // Verify Mobile Header (ADM-M-003)
    await expect(mobileView.getByText('Fila de anúncios • ADM-M-003')).toBeVisible();
    await expect(mobileView.getByRole('heading', { name: 'Fila de Anúncios' })).toBeVisible();

    // Verify Mobile Cards
    await expect(mobileView.getByText('Fiat Strada 1.3 Freedom Cabine Dupla 2023')).toBeVisible();
    const openDetailBtn = mobileView
      .locator('button', { hasText: 'Ver detalhes do anúncio' })
      .first();
    await expect(openDetailBtn).toBeVisible();

    // Crucial Task 2 Check: On mobile cards list, operational decision buttons are NOT exposed
    await expect(mobileView.getByRole('button', { name: 'Aprovar e Publicar' })).not.toBeVisible();
    await expect(mobileView.getByRole('button', { name: 'Reprovar Anúncio' })).not.toBeVisible();

    // Mobile Load More & Vehicle Hero Image Verification (ADM-M-003)
    const firstCardImage = mobileView.locator('img').first();
    await expect(firstCardImage).toBeVisible();
    const loadMoreBtn = mobileView.getByTestId('load-more-button');
    await expect(loadMoreBtn).toBeVisible();
    await loadMoreBtn.click();
    await expect(mobileView.getByText(/Exibindo 12 de/i)).toBeVisible();

    // Open Mobile Read-Only Modal
    await openDetailBtn.click();
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Crucial Task 2 Check: Mobile safety guard banner is displayed
    await expect(modal.getByTestId('mobile-readonly-guard-banner')).toBeVisible();
    await expect(
      modal.getByText(/Visualização móvel restrita \(ADM-021 \/ VEH-016\)/i),
    ).toBeVisible();

    // Crucial Task 2 Check: Decision buttons are NOT present in mobile modal!
    await expect(modal.getByRole('button', { name: 'Aprovar e Publicar' })).not.toBeVisible();
    await expect(modal.getByRole('button', { name: 'Reprovar Anúncio' })).not.toBeVisible();
    await expect(modal.getByRole('button', { name: 'Solicitar Alteração' })).not.toBeVisible();

    // Capture Mobile Modal Screenshot (showing read-only state)
    try {
      await page.screenshot({
        path: path.join(outputDir, 'ADM-M-003-Mobile-Inspection-Modal.png'),
        fullPage: false,
      });
    } catch {
      // Ignored if write fails
    }

    // Close button works
    await modal.getByRole('button', { name: 'Fechar', exact: true }).click();
    await expect(modal).not.toBeVisible();

    // Capture Mobile Screenshots (430px, 390px, 360px)
    try {
      await page.setViewportSize({ width: 430, height: 932 });
      await page.screenshot({
        path: path.join(outputDir, 'ADM-M-003-Mobile-Ad-Moderation-430px.png'),
        fullPage: true,
      });

      await page.setViewportSize({ width: 390, height: 844 });
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

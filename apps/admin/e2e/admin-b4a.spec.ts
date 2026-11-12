import { expect, test } from '@playwright/test';

test.describe('Admin B4A — Financial Transactions & Cash Ledger (ADM-D-024, 025, 026, 027, ADM-M-009)', () => {
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
  // Desktop Suite
  test.describe('Desktop 1600px / 1366px Viewports', () => {
    test.beforeEach(async ({ page, isMobile }) => {
      test.skip(Boolean(isMobile), 'Desktop-only financial transactions tests');
      await page.goto('/pagamentos');
      await page.waitForLoadState('domcontentloaded');
    });

    test('renders ADM-D-024 transaction queue, official 2026 logo, KPI cards, table and split layout', async ({
      page,
    }) => {
      // 1. Verify Page Badge & Title
      await expect(page.getByText('ADM-D-024')).toBeVisible();
      await expect(page.getByRole('heading', { name: /Transações de Pagamentos/i })).toBeVisible();

      // 2. Verify Official 2026 Brand Logo in Sidebar
      const brandLogo = page.locator('aside img[alt="Feira de Carros"]');
      await expect(brandLogo).toBeVisible();
      await expect(brandLogo).toHaveAttribute('src', /logo-on-dark\.png/);

      // 3. Verify KPI Cards (Figma ADM-D-024)
      const desktop = page.locator('[data-testid="desktop-finance-management"]');
      await expect(desktop.getByText('Volume Transacionado')).toBeVisible();
      await expect(desktop.getByText('Transações Confirmadas')).toBeVisible();
      await expect(desktop.getByText('Pagamentos Pendentes')).toBeVisible();
      await expect(desktop.getByText('Livro Caixa (Dinheiro)')).toBeVisible();

      // Check values
      await expect(desktop.getByText(/190,00/).first()).toBeVisible();
      await expect(desktop.getByText(/160,00/).first()).toBeVisible();
      await expect(desktop.getByText(/30,00/).first()).toBeVisible();
      await expect(desktop.getByText(/110,00/).first()).toBeVisible();

      // 4. Verify 6-column Table
      const table = page.locator('[data-testid="transactions-table"]');
      await expect(table).toBeVisible();
      await expect(table.locator('th')).toHaveCount(6);

      // Check 5 primary sample transactions present
      await expect(page.locator('[data-testid="transaction-row-TX-2026-0001"]')).toBeVisible();
      await expect(page.locator('[data-testid="transaction-row-TX-2026-0002"]')).toBeVisible();
      await expect(page.locator('[data-testid="transaction-row-TX-2026-0003"]')).toBeVisible();
      await expect(page.locator('[data-testid="transaction-row-TX-2026-0004"]')).toBeVisible();
      await expect(page.locator('[data-testid="transaction-row-TX-2026-0005"]')).toBeVisible();

      // 5. Verify Split Screen Detail Panel (calibrated 521px in 1600px Figma)
      const detailPanel = page.locator('[data-testid="selected-transaction-detail-panel"]');
      await expect(detailPanel).toBeVisible();
      await expect(detailPanel.getByText('TX-2026-0001')).toBeVisible();
      await expect(detailPanel.getByText('Mariana Silva Costa')).toBeVisible();
      await expect(detailPanel.getByText('Regra de Independência')).toBeVisible();
    });

    test('supports row selection and updating detail panel with pending cash action', async ({
      page,
    }) => {
      // Click on pending cash transaction row TX-2026-0005
      const row5 = page.locator('[data-testid="transaction-row-TX-2026-0005"]');
      await row5.click();

      // Verify detail panel updates to TX-2026-0005
      const detailPanel = page.locator('[data-testid="selected-transaction-detail-panel"]');
      await expect(detailPanel.getByText('TX-2026-0005')).toBeVisible();
      await expect(detailPanel.getByText('Lucas Ribeiro Alvarenga')).toBeVisible();

      // Verify cash registration button is exposed for pending cash
      const cashBtn = detailPanel.locator('[data-testid="simulate-cash-registration-btn"]');
      await expect(cashBtn).toBeVisible();
      await expect(cashBtn).toContainText('Simular Registro em Dinheiro');
    });

    test('supports search and status filter', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/Buscar por ID/i);
      await searchInput.fill('Mariana');

      // Table should display only TX-2026-0001
      await expect(page.locator('[data-testid="transaction-row-TX-2026-0001"]')).toBeVisible();
      await expect(page.locator('[data-testid="transaction-row-TX-2026-0002"]')).not.toBeVisible();

      // Clear search
      await searchInput.fill('');
      await expect(page.locator('[data-testid="transaction-row-TX-2026-0002"]')).toBeVisible();

      // Filter by status PENDING
      const statusSelect = page.getByLabel('Filtrar por status de pagamento');
      await statusSelect.selectOption('PENDING');

      await expect(page.locator('[data-testid="transaction-row-TX-2026-0005"]')).toBeVisible();
      await expect(page.locator('[data-testid="transaction-row-TX-2026-0001"]')).not.toBeVisible();
    });

    test('ADM-D-025: dedicated transaction detail view at /pagamentos/[id]', async ({ page }) => {
      await page.goto('/pagamentos/TX-2026-0001');
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByText('ADM-D-025', { exact: true })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'TX-2026-0001' })).toBeVisible();
      await expect(page.getByText('Mariana Silva Costa').first()).toBeVisible();
      await expect(page.getByText('Pix Instantâneo')).toBeVisible();
      await expect(page.getByText('ANX-2026-0151', { exact: true })).toBeVisible();
      await expect(
        page.getByText('Regra de Independência entre Pagamento e Moderação'),
      ).toBeVisible();
      await expect(page.getByText('Histórico de Confirmação & Trilha de Auditoria')).toBeVisible();
    });

    test('ADM-D-026: cash registration preview and fail-closed confirmation flow', async ({
      page,
    }) => {
      await page.goto('/pagamentos/TX-2026-0005/dinheiro');
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByText('ADM-D-026', { exact: true })).toBeVisible();
      await expect(
        page.getByRole('heading', { name: /Registrar Pagamento em Dinheiro/i }),
      ).toBeVisible();
      await expect(page.getByText('Main Admin Desktop Only')).toBeVisible();
      await expect(page.getByText('Atenção Contábil — Prevenção de Duplicidade')).toBeVisible();

      // Verify form fields
      await expect(page.locator('#cash-amount')).toBeVisible();
      await expect(page.locator('#slip-number')).toBeVisible();

      // Click submit to open confirmation dialog
      const submitBtn = page.locator('[data-testid="submit-cash-registration-btn"]');
      await submitBtn.click();

      // Step 1: STATE / ADM-D-026 / Confirmar cash presencial (node 231:1292)
      const confirmState = page.locator('[data-testid="cash-dialog-confirm-state"]');
      await expect(confirmState).toBeVisible();
      await expect(confirmState.getByText('Confirmar Recebimento em Espécie')).toBeVisible();

      // Click confirm inside dialog
      const dialogConfirmBtn = page.locator('[data-testid="cash-dialog-confirm-button"]');
      await dialogConfirmBtn.click();

      // Step 2: STATE / ADM-D-026 / Bloqueio sem recibo confirmado (node 231:1311)
      const blockedState = page.locator('[data-testid="cash-dialog-blocked-state"]');
      await expect(blockedState).toBeVisible();
      await expect(blockedState.getByText('Operação Não Executada • Fail-Closed')).toBeVisible();
      await expect(
        blockedState.getByText('Bloqueio de Segurança / Modo Demonstração'),
      ).toBeVisible();
      await expect(blockedState.getByText('NENHUM (Não gerado)')).toBeVisible();

      // Dismiss dialog
      await page.locator('[data-testid="cash-dialog-dismiss-button"]').click();
      await expect(blockedState).not.toBeVisible();
    });

    test('ADM-D-027: cash receipts ledger at /pagamentos/dinheiro', async ({ page }) => {
      await page.goto('/pagamentos/dinheiro');
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByText('ADM-D-027')).toBeVisible();
      await expect(
        page.getByRole('heading', { name: /Livro Caixa — Recebimentos em Dinheiro/i }),
      ).toBeVisible();

      // Verify 3 fictional receipts totaling R$ 110,00
      await expect(page.getByText('Total em Espécie: R$ 110,00 (3 recibos)')).toBeVisible();

      const ledgerTable = page.locator('[data-testid="cash-receipts-table"]');
      await expect(ledgerTable).toBeVisible();
      await expect(page.locator('[data-testid="cash-receipt-row-REC-2026-0001"]')).toBeVisible();
      await expect(page.locator('[data-testid="cash-receipt-row-REC-2026-0002"]')).toBeVisible();
      await expect(page.locator('[data-testid="cash-receipt-row-REC-2026-0003"]')).toBeVisible();

      // Open read-only receipt modal
      await page.locator('[data-testid="cash-receipt-row-REC-2026-0001"]').click();
      const modal = page.locator('div[role="dialog"]');
      await expect(modal).toBeVisible();
      await expect(modal.getByText('REC-2026-0001')).toBeVisible();
      await expect(modal.getByText('CANHOTO-00412')).toBeVisible();
      await expect(modal.getByText('Política de Imutabilidade')).toBeVisible();
    });
  });

  // Mobile Suite
  test.describe('Mobile Viewport (ADM-M-009)', () => {
    test.beforeEach(async ({ page, isMobile }) => {
      test.skip(!isMobile, 'Mobile-only tests');
      await page.goto('/pagamentos');
      await page.waitForLoadState('domcontentloaded');
    });

    test('renders ADM-M-009 with official 2026 logo, financial alerts, restriction notice and bottom nav', async ({
      page,
    }) => {
      const mobileContainer = page.locator('[data-testid="mobile-finance-management"]');
      await expect(mobileContainer).toBeVisible();

      // 1. Verify official 2026 brand logo in mobile header
      const logo = mobileContainer.locator('header img[alt="Feira de Carros"]');
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute('src', /logo-on-dark\.png/);

      // 2. Verify ADM-M-009 badge and header title
      await expect(page.getByText('ADM-M-009')).toBeVisible();
      await expect(page.getByRole('heading', { name: /Transações e Pagamentos/i })).toBeVisible();

      // 3. Verify ADM-021 restriction notice
      await expect(
        page.getByText('Terminal Móvel Restrito — Modo Leitura (ADM-021)'),
      ).toBeVisible();

      // 4. Verify Financial alerts & disputes banner
      await expect(page.getByText('Resumo de Alertas Financeiros')).toBeVisible();
      await expect(page.getByText('Pendente Balcão')).toBeVisible();
      await expect(page.getByText('Disputas / Contestações')).toBeVisible();

      // 5. Verify masked transaction card
      const card1 = page.locator('[data-testid="mobile-tx-card-TX-2026-0001"]');
      await expect(card1).toBeVisible();
      await expect(card1.getByText('TX-2026-0001')).toBeVisible();
      await expect(card1.getByText('***.452.886-**')).toBeVisible();

      // 6. Verify inspection modal in read-only mode
      await card1.getByRole('button', { name: /Inspecionar Transação/i }).click();
      const modal = page.locator('div[role="dialog"]');
      await expect(modal).toBeVisible();
      await expect(modal.getByText('Somente Leitura (ADM-021)')).toBeVisible();

      // 7. Verify NO prohibited mobile controls (no cash confirmation, refund execution, ad activation)
      await expect(
        page.getByRole('button', { name: /Confirmar Recebimento em Espécie/i }),
      ).not.toBeVisible();
      await expect(page.getByRole('button', { name: /Executar Estorno/i })).not.toBeVisible();
      await expect(page.getByRole('button', { name: /Ativar Anúncio/i })).not.toBeVisible();

      // 8. Verify approved bottom navigation
      await expect(
        page.getByRole('navigation', { name: 'Navegação móvel principal' }),
      ).toBeVisible();
    });
  });
});

import { expect, test } from '@playwright/test';

test.describe('Admin B5A — Reports & Moderation Management (ADM-D-032, 033, 034, 035)', () => {
  test.beforeEach(async ({ context }) => {
    // Authenticate with mock admin session cookie
    await context.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);
  });

  // ===========================================================================
  // 1. ADM-D-032 — FILA DE DENÚNCIAS E MODERAÇÃO (/moderacao)
  // ===========================================================================
  test.describe('ADM-D-032 — Moderation Queue Desktop', () => {
    test.beforeEach(async ({ page, isMobile }) => {
      test.skip(Boolean(isMobile), 'Desktop-only test');
      await page.goto('/moderacao');
      await page.waitForLoadState('domcontentloaded');
    });

    test('renders ADM-D-032 header, frame badge, and 4 KPI cards', async ({ page }) => {
      await expect(page.getByText('ADM-D-032').first()).toBeVisible();
      await expect(
        page.getByRole('heading', {
          name: /Fila de denúncias e moderação/i,
        }),
      ).toBeVisible();

      // 4 Summary KPI cards
      await expect(page.getByTestId('kpi-total-reports')).toBeVisible();
      await expect(page.getByTestId('kpi-under-review')).toBeVisible();
      await expect(page.getByTestId('kpi-corrections')).toBeVisible();
      await expect(page.getByTestId('kpi-support-access')).toBeVisible();

      // Verify KPI values from Figma
      await expect(page.getByTestId('kpi-total-reports').getByText('3')).toBeVisible();
      await expect(page.getByTestId('kpi-under-review').getByText('2')).toBeVisible();
      await expect(page.getByTestId('kpi-corrections').getByText('1')).toBeVisible();
      await expect(page.getByTestId('kpi-support-access').getByText('DENY_PENDING')).toBeVisible();
    });

    test('displays 3 demo reports and supports selection and detail panel update', async ({
      page,
    }) => {
      const table = page.getByTestId('report-table');
      await expect(table).toBeVisible();

      // Verify 3 demo reports present
      await expect(page.getByTestId('report-row-RPT-DEMO-008')).toBeVisible();
      await expect(page.getByTestId('report-row-RPT-DEMO-009')).toBeVisible();
      await expect(page.getByTestId('report-row-RPT-DEMO-010')).toBeVisible();

      // Default selected or clicking RPT-DEMO-008 updates side panel
      await page.getByTestId('report-row-RPT-DEMO-008').click();
      const panel = page.getByTestId('report-detail-panel-RPT-DEMO-008');
      await expect(panel).toBeVisible();
      await expect(panel.getByText('RPT-DEMO-008').first()).toBeVisible();
      await expect(panel.getByText('Toyota Corolla 2021').first()).toBeVisible();
      await expect(panel.getByText('Vale Auto Veículos').first()).toBeVisible();
      await expect(panel.getByText(/112\.900/)).toBeVisible();
    });

    test('supports search and category/status filtering', async ({ page }) => {
      // Search by vehicle / seller
      const searchInput = page.getByTestId('moderation-search-input');
      await searchInput.fill('Corolla');
      await expect(page.getByTestId('report-row-RPT-DEMO-008')).toBeVisible();
      await expect(page.getByTestId('report-row-RPT-DEMO-009')).not.toBeVisible();
      await expect(page.getByTestId('report-row-RPT-DEMO-010')).not.toBeVisible();

      // Clear search
      await searchInput.fill('');
      await expect(page.getByTestId('report-row-RPT-DEMO-009')).toBeVisible();

      // Status filter: CORRECTION_REQUESTED
      const statusFilter = page.getByTestId('moderation-status-filter');
      await statusFilter.selectOption('CORRECTION_REQUESTED');
      await expect(page.getByTestId('report-row-RPT-DEMO-010')).toBeVisible();
      await expect(page.getByTestId('report-row-RPT-DEMO-008')).not.toBeVisible();

      // Reset filters
      await page.getByTestId('moderation-reset-filters').click();
      await expect(page.getByTestId('report-row-RPT-DEMO-008')).toBeVisible();
      await expect(page.getByTestId('report-row-RPT-DEMO-009')).toBeVisible();
      await expect(page.getByTestId('report-row-RPT-DEMO-010')).toBeVisible();
    });

    test('navigates to report detail via row external link button', async ({ page }) => {
      await page.getByTestId('navigate-detail-RPT-DEMO-008').click();
      await page.waitForURL('**/moderacao/RPT-DEMO-008');
      await expect(page.getByText('ADM-D-033').first()).toBeVisible();
    });
  });

  // ===========================================================================
  // 2. ADM-D-033 — DETALHES DA DENÚNCIA E DO VENDEDOR (/moderacao/[id])
  // ===========================================================================
  test.describe('ADM-D-033 — Report Details & Evidence View', () => {
    test.beforeEach(async ({ page, isMobile }) => {
      test.skip(Boolean(isMobile), 'Desktop-only test');
      await page.goto('/moderacao/RPT-DEMO-008');
      await page.waitForLoadState('domcontentloaded');
    });

    test('renders report protocol, Corolla vehicle info, and unverified allegation banner', async ({
      page,
    }) => {
      await expect(page.getByText('ADM-D-033').first()).toBeVisible();
      await expect(page.getByText('RPT-DEMO-008').first()).toBeVisible();
      await expect(page.getByText('Toyota Corolla 2021').first()).toBeVisible();
      await expect(page.getByText('Vale Auto Veículos').first()).toBeVisible();

      // Unverified allegation warning banner
      const banner = page.getByTestId('unverified-allegation-banner');
      await expect(banner).toBeVisible();
      await expect(banner).toContainText('Alegação não verificada');

      // Evidence summary
      await expect(page.getByText('Resumo de Evidências')).toBeVisible();
      await expect(page.getByText('Motivo relatado')).toBeVisible();
    });

    test('provides functional navigation to conversation review and decision preview', async ({
      page,
    }) => {
      // Button to conversation review
      const convBtn = page.getByTestId('navigate-conversation-btn');
      await expect(convBtn).toBeVisible();

      // Button to moderation decision
      const decisionBtn = page.getByTestId('navigate-decision-btn');
      await expect(decisionBtn).toBeVisible();
      await decisionBtn.click();
      await page.waitForURL('**/moderacao/RPT-DEMO-008/decisao');
      await expect(page.getByText('ADM-D-035').first()).toBeVisible();
    });

    test('shows valid not-found state for unknown report ID', async ({ page }) => {
      await page.goto('/moderacao/RPT-INVALID-999');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByTestId('report-not-found-state')).toBeVisible();
      await expect(page.getByText('Denúncia não encontrada')).toBeVisible();
      await expect(page.getByTestId('back-to-moderation-not-found-btn')).toBeVisible();
    });
  });

  // ===========================================================================
  // 3. ADM-D-034 — REVISÃO DE CONVERSA VINCULADA (/moderacao/[id]/conversa)
  // ===========================================================================
  test.describe('ADM-D-034 — Restricted Conversation Review', () => {
    test.beforeEach(async ({ page, isMobile }) => {
      test.skip(Boolean(isMobile), 'Desktop-only test');
      await page.goto('/moderacao/RPT-DEMO-008/conversa');
      await page.waitForLoadState('domcontentloaded');
    });

    test('renders privacy restriction banner and scoped message excerpt', async ({ page }) => {
      await expect(page.getByText('ADM-D-034').first()).toBeVisible();
      await expect(page.getByTestId('conversation-privacy-banner')).toBeVisible();
      await expect(page.getByTestId('conversation-privacy-banner')).toContainText('DENY_PENDING');

      // Verify messages rendered with sender aliases
      await expect(page.getByTestId('conversation-message-msg-1')).toBeVisible();
      await expect(page.getByTestId('conversation-message-msg-2')).toBeVisible();
      await expect(page.getByText('Comprador (ID protegido)')).toBeVisible();
      await expect(page.getByText('Vendedor (Vale Auto Veículos)')).toBeVisible();

      // Check evidence authenticity status
      await expect(page.getByText('Status de Autenticidade da Evidência')).toBeVisible();
      await expect(page.getByText('Verificação Pendente')).toBeVisible();
    });

    test('handles report without conversation with restricted notice', async ({ page }) => {
      await page.goto('/moderacao/RPT-DEMO-010/conversa');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByTestId('conversation-restricted-no-excerpt')).toBeVisible();
    });
  });

  // ===========================================================================
  // 4. ADM-D-035 — DECISÃO E MEDIDAS DE MODERAÇÃO (/moderacao/[id]/decisao)
  // ===========================================================================
  test.describe('ADM-D-035 — Moderation Decision Preview & Fail-Closed', () => {
    test.beforeEach(async ({ page, isMobile }) => {
      test.skip(Boolean(isMobile), 'Desktop-only test');
      await page.goto('/moderacao/RPT-DEMO-008/decisao');
      await page.waitForLoadState('domcontentloaded');
    });

    test('renders blocked authorization banner and 3 decision options', async ({ page }) => {
      await expect(page.getByText('ADM-D-035').first()).toBeVisible();
      await expect(page.getByTestId('decision-blocked-auth-banner')).toBeVisible();
      await expect(page.getByTestId('decision-blocked-auth-banner')).toContainText(
        'Autorização de Alçada Bloqueada',
      );

      // 3 options
      await expect(page.getByTestId('decision-option-NOT_SUBSTANTIATED')).toBeVisible();
      await expect(page.getByTestId('decision-option-CORRECTION_REQUESTED')).toBeVisible();
      await expect(page.getByTestId('decision-option-RESTRICTIVE_MEASURE')).toBeVisible();
    });

    test('simulates decision selection and confirms fail-closed blocked result state', async ({
      page,
    }) => {
      // Select option: CORRECTION_REQUESTED
      await page.getByTestId('decision-option-CORRECTION_REQUESTED').click();

      // Justification textarea appears
      const textarea = page.getByTestId('decision-justification-input');
      await expect(textarea).toBeVisible();
      await textarea.fill(
        'Solicitação de ajuste de quilometragem no anúncio FC-2026-0121 para conferência documental.',
      );

      // Click preview simulation
      const simulateBtn = page.getByTestId('simulate-decision-btn');
      await expect(simulateBtn).toBeEnabled();
      await simulateBtn.click();

      // Preview state is displayed
      const preview = page.getByTestId('decision-preview-state');
      await expect(preview).toBeVisible();
      await expect(preview).toContainText('Prévia de Decisão — Não Executada');

      // Click confirm demonstration
      await page.getByTestId('confirm-decision-btn').click();

      // Verify fail-closed blocked result
      const blockedState = page.getByTestId('decision-blocked-result-state');
      await expect(blockedState).toBeVisible();
      await expect(page.getByText('Nenhuma ação de moderação foi executada')).toBeVisible();
      await expect(page.getByTestId('blocked-confirmation-state')).toContainText('fail-closed');
    });
  });

  // ===========================================================================
  // 5. MOBILE RESTRICTIONS
  // ===========================================================================
  test.describe('Mobile Read-Only Restrictions', () => {
    test('displays read-only notice on mobile viewports', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto('/moderacao');
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByText('Moderação — Acesso móvel somente leitura')).toBeVisible();
    });
  });
});

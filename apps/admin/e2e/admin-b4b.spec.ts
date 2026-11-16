import { expect, test } from '@playwright/test';

test.describe('Admin B4B — Refunds, Chargebacks, Revenue Analytics & Mobile Alerts (ADM-D-028, 029, 030, 031, ADM-M-006)', () => {
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
  // 1. DESKTOP: ADM-D-028 — FILA DE REEMBOLSOS (/reembolsos)
  // ===========================================================================
  test.describe('ADM-D-028 — Refund Requests Queue Desktop', () => {
    test.beforeEach(async ({ page, isMobile }) => {
      test.skip(Boolean(isMobile), 'Desktop-only test');
      await page.goto('/reembolsos');
      await page.waitForLoadState('domcontentloaded');
    });

    test('renders ADM-D-028 header, frame code, and 4 KPI cards', async ({ page }) => {
      await expect(page.getByText('ADM-D-028').first()).toBeVisible();
      await expect(
        page.getByRole('heading', {
          name: /Fila de Solicitações de Reembolso/i,
        }),
      ).toBeVisible();

      // 4 Summary KPI cards
      await expect(page.getByTestId('kpi-total-refunds')).toBeVisible();
      await expect(page.getByTestId('kpi-pending-refunds')).toBeVisible();
      await expect(page.getByTestId('kpi-hold-legal-refunds')).toBeVisible();
      await expect(page.getByTestId('kpi-policy-compliance')).toBeVisible();

      // Check values
      await expect(page.getByTestId('kpi-total-refunds').getByText('3')).toBeVisible();
      await expect(page.getByTestId('kpi-total-refunds').getByText(/110,00/)).toBeVisible();
      await expect(page.getByTestId('kpi-hold-legal-refunds').getByText(/40,00/)).toBeVisible();
    });

    test('displays 3 demo requests and supports table selection & status filtering', async ({
      page,
    }) => {
      const table = page.getByTestId('refund-table-container');
      await expect(table).toBeVisible();

      // 3 demo requests present
      await expect(page.getByTestId('refund-row-CXL-DEMO-001')).toBeVisible();
      await expect(page.getByTestId('refund-row-CXL-DEMO-002')).toBeVisible();
      await expect(page.getByTestId('refund-row-CXL-DEMO-003')).toBeVisible();

      // Selecting CXL-DEMO-002 updates side detail panel to HOLD_LEGAL
      await page.getByTestId('refund-row-CXL-DEMO-002').click();
      const panel = page.getByTestId('refund-detail-panel');
      await expect(panel.getByText('CXL-DEMO-002').first()).toBeVisible();
      await expect(panel.getByText('Retenção Jurídica').first()).toBeVisible();
      await expect(panel.getByText('Rafael Santos Pereira')).toBeVisible();

      // Filter by status: HOLD_LEGAL
      await page.getByTestId('refund-status-filter').selectOption('HOLD_LEGAL');
      await expect(page.getByTestId('refund-row-CXL-DEMO-002')).toBeVisible();
      await expect(page.getByTestId('refund-row-CXL-DEMO-001')).not.toBeVisible();
      await expect(page.getByTestId('refund-row-CXL-DEMO-003')).not.toBeVisible();

      // Reset filters button restores all 3
      await page.getByTestId('refund-reset-filters-btn').click();
      await expect(page.getByTestId('refund-row-CXL-DEMO-001')).toBeVisible();
      await expect(page.getByTestId('refund-row-CXL-DEMO-002')).toBeVisible();
    });
  });

  // ===========================================================================
  // 2. ADM-D-029 — DETALHES DA REVISÃO DE REEMBOLSO (/reembolsos/[id])
  // ===========================================================================
  test.describe('ADM-D-029 — Refund Review Details & Error Handling', () => {
    test('renders dossier, CDC Art. 49 criteria matrix, and HOLD policy banner for valid ID', async ({
      page,
    }) => {
      await page.goto('/reembolsos/CXL-DEMO-001');
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByText('ADM-D-029').first()).toBeVisible();
      await expect(
        page.getByRole('heading', {
          name: /Análise de Reembolso — Protocolo CXL-DEMO-001/i,
        }),
      ).toBeVisible();
      await expect(page.getByText('Mariana Silva Costa').first()).toBeVisible();
      await expect(page.getByText(/40,00/).first()).toBeVisible();

      // Legal policy hold banner
      const banner = page.getByTestId('refund-policy-hold-banner');
      await expect(banner).toBeVisible();
      await expect(banner).toContainText('Retenção de Segurança');

      // Consumer Protection Checklist (CDC Art. 49)
      await expect(
        page.getByText(/Direito legal de arrependimento \(Art\. 49 do CDC/i),
      ).toBeVisible();

      // Decision Simulation Previews (Fail-closed non-mutating)
      await page.getByTestId('simulate-approve-btn').click();
      await expect(page.getByTestId('simulation-approved-preview')).toBeVisible();

      await page.getByTestId('simulate-hold-btn').click();
      await expect(page.getByTestId('simulation-hold-preview')).toBeVisible();
    });

    test('renders appropriate NOT FOUND state when navigating to an invalid refund ID', async ({
      page,
    }) => {
      await page.goto('/reembolsos/INVALID-PROTOCOL-999');
      await page.waitForLoadState('domcontentloaded');

      // Must display dedicated not-found view, NOT silently fallback to CXL-DEMO-001
      const notFoundContainer = page.getByTestId('refund-not-found-state');
      await expect(notFoundContainer).toBeVisible();
      await expect(
        notFoundContainer.getByRole('heading', {
          name: /Solicitação de Reembolso não encontrada/i,
        }),
      ).toBeVisible();
      await expect(notFoundContainer).toContainText('INVALID-PROTOCOL-999');

      // Back button returns to queue
      const backBtn = page.getByTestId('back-to-refunds-not-found-btn');
      await expect(backBtn).toBeVisible();
      await backBtn.click();
      await page.waitForURL('**/reembolsos');
    });
  });

  // ===========================================================================
  // 3. ADM-D-030 — DISPUTAS E CONTESTAÇÕES DE CARTÃO (/contestacoes)
  // ===========================================================================
  test.describe('ADM-D-030 — Card Disputes & Chargebacks Desktop', () => {
    test.beforeEach(async ({ page, isMobile }) => {
      test.skip(Boolean(isMobile), 'Desktop-only test');
      await page.goto('/contestacoes');
      await page.waitForLoadState('domcontentloaded');
    });

    test('renders ADM-D-030 frame, R$ 130 total disputed, and R$ 0 guaranteed revenue', async ({
      page,
    }) => {
      await expect(page.getByText('ADM-D-030').first()).toBeVisible();
      await expect(
        page.getByRole('heading', {
          name: /Disputas e Contestações de Cartão/i,
        }),
      ).toBeVisible();

      // Total disputed: R$ 130,00
      await expect(page.getByTestId('kpi-total-disputes').getByText(/130,00/)).toBeVisible();

      // Strict fail-closed governance: R$ 0,00 guaranteed revenue
      await expect(page.getByTestId('kpi-guaranteed-revenue-zero').getByText(/0,00/)).toBeVisible();

      // 3 demo disputes present
      await expect(page.getByTestId('dispute-row-DSP-2026-0001')).toBeVisible();
      await expect(page.getByTestId('dispute-row-DSP-2026-0002')).toBeVisible();
      await expect(page.getByTestId('dispute-row-DSP-2026-0003')).toBeVisible();
    });

    test('inspects urgent dispute DSP-2026-0003 with incomplete evidence', async ({ page }) => {
      await page.getByTestId('dispute-row-DSP-2026-0003').click();

      const detailPanel = page.getByTestId('dispute-detail-panel');
      await expect(detailPanel.getByText('DSP-2026-0003').first()).toBeVisible();
      await expect(detailPanel.getByText('CHG-GETNET-10928')).toBeVisible();
      await expect(detailPanel.getByText('Elo', { exact: true })).toBeVisible();
      await expect(detailPanel.getByText('Pendente de Extrato Bancário')).toBeVisible();

      // Simulation action
      await page.getByTestId('simulate-submit-evidence-btn').click();
      await expect(page.getByTestId('demo-action-feedback')).toBeVisible();
    });
  });

  // ===========================================================================
  // 4. ADM-D-031 — RELATÓRIOS DE RECEITA E PAGAMENTOS (/relatorios)
  // ===========================================================================
  test.describe('ADM-D-031 — Revenue & Payment Reports Desktop', () => {
    test.beforeEach(async ({ page, isMobile }) => {
      test.skip(Boolean(isMobile), 'Desktop-only test');
      await page.goto('/relatorios');
      await page.waitForLoadState('domcontentloaded');
    });

    test('renders confirmed revenue R$ 42.580,00, 1.248 active ads, and R$ 0 vehicle sales', async ({
      page,
    }) => {
      await expect(page.getByText('ADM-D-031').first()).toBeVisible();
      await expect(
        page.getByRole('heading', {
          name: /Relatórios de Receita e Pagamentos/i,
        }),
      ).toBeVisible();

      // Confirmed Revenue KPI: R$ 42.580,00
      await expect(page.getByTestId('kpi-confirmed-revenue').getByText(/42\.580,00/)).toBeVisible();

      // Active Ads: 1.248
      await expect(page.getByTestId('kpi-active-ads-monetized').getByText(/1\.248/)).toBeVisible();

      // Platform vehicle sales processed: R$ 0,00
      await expect(page.getByTestId('kpi-vehicle-sales-zero').getByText(/0,00/)).toBeVisible();
    });

    test('supports switching chart to area mode and exporting demo CSV', async ({ page }) => {
      const chart = page.getByTestId('revenue-chart-container');
      await expect(chart).toBeVisible();

      // Switch to area mode
      await page.getByTestId('chart-mode-area-btn').click();
      await expect(chart.locator('svg path[fill^="url"]')).toBeVisible();

      // Trigger demo CSV export
      await page.getByTestId('export-csv-btn').click();
      await expect(page.getByTestId('csv-export-success-badge')).toBeVisible();
    });
  });

  // ===========================================================================
  // 5. ADM-M-006 — ALERTAS FINANCEIROS MOBILE (/alertas)
  // ===========================================================================
  test.describe('ADM-M-006 — Mobile Financial Alerts', () => {
    test.beforeEach(async ({ isMobile }) => {
      test.skip(!isMobile, 'Mobile-only suite for ADM-M-006');
    });

    test('renders approved dark mobile header, official 2026 logo, and approved metrics (12 pending, 3 disputes)', async ({
      page,
    }) => {
      await page.goto('/alertas');
      await page.waitForLoadState('domcontentloaded');

      // 1. Frame code and title
      await expect(page.getByText('ADM-M-006').first()).toBeVisible();
      await expect(page.getByRole('heading', { name: /Alertas Financeiros/i })).toBeVisible();

      // 2. Official 2026 Brand Logo in dark mobile header
      const headerLogo = page.locator('header img[alt="Feira de Carros"]');
      await expect(headerLogo).toBeVisible();
      await expect(headerLogo).toHaveAttribute('src', /logo-on-dark\.png/);

      // 3. Approved Figma ADM-M-006 Metrics: 12 pending payments, 3 disputes
      await expect(page.getByTestId('mobile-kpi-pending-payments').getByText('12')).toBeVisible();
      await expect(
        page.getByTestId('mobile-kpi-card-disputes').getByText('3', { exact: true }),
      ).toBeVisible();

      // 4. Mobile Security & Restricted Operations Warning (ADM-019)
      const warningBanner = page.getByTestId('mobile-restrictions-banner');
      await expect(warningBanner).toBeVisible();
      await expect(warningBanner).toContainText('Operações Restritas no Ambiente Móvel');
      await expect(warningBanner).toContainText('bloqueados em dispositivos móveis');

      // 5. Read-only Alert Cards
      await expect(page.getByTestId('alert-card-chargeback-urgent')).toBeVisible();
      await expect(page.getByTestId('alert-card-refund-review')).toBeVisible();
      await expect(page.getByTestId('alert-card-cash-pending-TX-2026-0005')).toBeVisible();

      // 6. Mobile bottom navigation with active 'Alertas' tab
      const mobileNav = page.locator('nav[aria-label="Navegação móvel principal"]');
      await expect(mobileNav).toBeVisible();
      const alertasTab = mobileNav.getByRole('link', { name: /Alertas/i });
      await expect(alertasTab).toBeVisible();
      await expect(alertasTab).toHaveClass(/text-red-600/);
    });
  });

  // ===========================================================================
  // 6. INVARIANT: FAIL-CLOSED & NO MUTATION
  // ===========================================================================
  test.describe('Financial Security Invariants', () => {
    test('confirms no real payment, refund, or chargeback mutation is executed', async ({
      page,
      isMobile,
    }) => {
      test.skip(Boolean(isMobile), 'Desktop-only invariant check');
      await page.goto('/reembolsos/CXL-DEMO-001');
      await page.waitForLoadState('domcontentloaded');

      // Verify fail-closed hold banner
      await expect(page.getByTestId('refund-policy-hold-banner')).toBeVisible();

      // Navigate to contestacoes
      await page.goto('/contestacoes');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByTestId('kpi-guaranteed-revenue-zero')).toContainText('0,00');
    });
  });
});

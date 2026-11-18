import { type Page, expect, test } from '@playwright/test';

async function setupDealerSession(page: Page) {
  await page.context().addCookies([
    {
      name: 'fdc_web_session',
      value: 'demo_dealer_session',
      domain: 'localhost',
      path: '/',
    },
  ]);
}

test.describe('Dealership Frontend Batch D2 — Inventory Overview & Fleet Management (WEB-021)', () => {
  test.beforeEach(async ({ page }) => {
    await setupDealerSession(page);
  });

  test('WEB-021: Renders page header, breadcrumbs, dealership metadata, and active account badge', async ({
    page,
  }) => {
    await page.goto('/concessionaria/anuncios');

    // Breadcrumb
    await expect(page.getByText('Início')).toBeVisible();
    await expect(page.getByText('Minha Concessionária')).toBeVisible();
    await expect(page.getByText('Estoque').first()).toBeVisible();

    // Main Heading & Badges
    await expect(page.getByRole('heading', { name: 'Estoque da Concessionária' })).toBeVisible();
    await expect(page.getByText('Conta Ativa')).toBeVisible();
    await expect(page.getByText('Líder Veículos e Seminovos Ltda · Ipatinga - MG')).toBeVisible();

    // New Listing CTA
    await expect(page.getByTestId('btn-new-listing')).toBeVisible();
  });

  test('WEB-021: Displays 3 Figma analytics summary cards (total views, views today, visitor origins)', async ({
    page,
  }) => {
    await page.goto('/concessionaria/anuncios');

    const metricsContainer = page.getByTestId('dealer-metrics-container');
    await expect(metricsContainer).toBeVisible();

    // Metric 1: Visualizações Totais
    await expect(page.getByText('Visualizações totais')).toBeVisible();
    await expect(page.getByTestId('metric-total-views')).toHaveText('12.840');
    await expect(page.getByText('+18% este mês')).toBeVisible();

    // Metric 2: Visualizações Hoje
    await expect(page.getByText('Visualizações hoje')).toBeVisible();
    await expect(page.getByTestId('metric-views-today')).toHaveText('482');
    await expect(page.getByText('Últimas 24h')).toBeVisible();

    // Metric 3: Origem dos Visitantes
    await expect(page.getByText('Origem dos visitantes')).toBeVisible();
    await expect(page.getByTestId('metric-top-origins')).toHaveText(
      'Ipatinga, MG · Belo Horizonte, MG',
    );
  });

  test('WEB-021: Renders desktop inventory table with all 5 vehicles and matching columns', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/anuncios');

    const table = page.getByTestId('dealer-inventory-table');
    await expect(table).toBeVisible();

    // Verify all 5 vehicle rows exist
    await expect(page.getByTestId('vehicle-row-dlr-veh-001')).toBeVisible();
    await expect(page.getByTestId('vehicle-row-dlr-veh-002')).toBeVisible();
    await expect(page.getByTestId('vehicle-row-dlr-veh-003')).toBeVisible();
    await expect(page.getByTestId('vehicle-row-dlr-veh-004')).toBeVisible();
    await expect(page.getByTestId('vehicle-row-dlr-veh-005')).toBeVisible();

    // Check specific vehicle data: Honda Civic
    const civicRow = page.getByTestId('vehicle-row-dlr-veh-001');
    await expect(civicRow.getByText('Honda Civic')).toBeVisible();
    await expect(civicRow.getByText('BRA2E19')).toBeVisible();
    await expect(civicRow.getByText('R$ 124.900')).toBeVisible();
    await expect(civicRow.getByText('Ativo')).toBeVisible();
    await expect(civicRow.getByText('Plano Premium')).toBeVisible();
    await expect(civicRow.getByText('15/11/2026')).toBeVisible();
    await expect(civicRow.getByText('2.340')).toBeVisible();

    // Table Footer count & Provenance Tag
    await expect(page.getByTestId('inventory-footer-count')).toContainText(
      'Mostrando 5 de 5 veículos da frota',
    );
    await expect(
      page.getByText(
        'Valores, fotos e métricas são dados ilustrativos para revisão do design. (DEMO DATA)',
      ),
    ).toBeVisible();
  });

  test('WEB-021: Filters vehicles reactively by text search (make, model, plate)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/anuncios');

    const searchInput = page.getByTestId('input-dealer-search');

    // Search for "Corolla"
    await searchInput.fill('Corolla');
    await expect(page.getByTestId('vehicle-row-dlr-veh-002')).toBeVisible();
    await expect(page.getByTestId('vehicle-row-dlr-veh-001')).not.toBeVisible();
    await expect(page.getByTestId('inventory-footer-count')).toContainText('Mostrando 1 de 5');

    // Search for plate "BRA2E19"
    await searchInput.fill('BRA2E19');
    await expect(page.getByTestId('vehicle-row-dlr-veh-001')).toBeVisible();
    await expect(page.getByTestId('vehicle-row-dlr-veh-002')).not.toBeVisible();

    // Non-existent search shows zero-state in table
    await searchInput.fill('Inexistente XYZ');
    await expect(
      page.getByTestId('dealer-inventory-table').getByText('Nenhum veículo encontrado'),
    ).toBeVisible();

    // Clear filters button restores 5 vehicles
    await page.getByTestId('btn-clear-filters').click();
    await expect(page.getByTestId('vehicle-row-dlr-veh-001')).toBeVisible();
    await expect(page.getByTestId('inventory-footer-count')).toContainText('Mostrando 5 de 5');
  });

  test('WEB-021: Filters vehicles by status and plan dropdowns', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/anuncios');

    // Filter by Status: "Em análise"
    await page.getByTestId('select-status-filter').selectOption('in_review');
    await expect(page.getByTestId('vehicle-row-dlr-veh-002')).toBeVisible();
    await expect(page.getByTestId('vehicle-row-dlr-veh-001')).not.toBeVisible();
    await expect(page.getByTestId('inventory-footer-count')).toContainText('Mostrando 1 de 5');

    // Filter by Plan: "Plano Premium" (reset status first)
    await page.getByTestId('select-status-filter').selectOption('all');
    await page.getByTestId('select-plan-filter').selectOption('premium');
    await expect(page.getByTestId('vehicle-row-dlr-veh-001')).toBeVisible(); // Civic
    await expect(page.getByTestId('vehicle-row-dlr-veh-003')).toBeVisible(); // Onix
    await expect(page.getByTestId('vehicle-row-dlr-veh-002')).not.toBeVisible();
    await expect(page.getByTestId('inventory-footer-count')).toContainText('Mostrando 2 de 5');
  });

  test('WEB-021: Interactive fleet status actions (pause/activate and renew)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/anuncios');

    // 1. Pause active Honda Civic
    const pauseBtn = page.getByTestId('btn-pause-dlr-veh-001');
    await expect(pauseBtn).toHaveText('Pausar');
    await pauseBtn.click();

    // Row updates to "Pausado" and button changes to "Ativar"
    const civicRow = page.getByTestId('vehicle-row-dlr-veh-001');
    await expect(civicRow.getByText('Pausado').first()).toBeVisible();
    const activateBtn = page.getByTestId('btn-activate-dlr-veh-001');
    await expect(activateBtn).toBeVisible();

    // Reactivate Honda Civic
    await activateBtn.click();
    await expect(civicRow.getByText('Ativo').first()).toBeVisible();

    // 2. Renew expiring Chevrolet Onix
    const renewBtn = page.getByTestId('btn-renew-dlr-veh-003');
    await expect(renewBtn).toBeVisible();
    await renewBtn.click();

    // Renew Modal opens
    await expect(page.getByRole('heading', { name: 'Renovar Validade do Anúncio' })).toBeVisible();
    await page.getByRole('button', { name: 'Confirmar renovação' }).click();

    // Onix transitions to "Ativo"
    const onixRow = page.getByTestId('vehicle-row-dlr-veh-003');
    await expect(onixRow.getByText('Ativo').first()).toBeVisible();
  });

  test('WEB-021: Action navigation for "+ Novo anúncio", View and Edit', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/anuncios');

    // 1. New Listing navigation to wizard (Batch D3 implementation)
    await page.getByTestId('btn-new-listing').click();
    await expect(page).toHaveURL(/\/concessionaria\/anuncios\/novo/);
    await page.goto('/concessionaria/anuncios');

    // 2. View Vehicle Modal
    await page.getByTestId('btn-view-dlr-veh-001').click();
    await expect(page.locator('#dealer-modal-title')).toHaveText('Honda Civic');
    await expect(page.getByText('Detalhes do Anúncio')).toBeVisible();
    await page.getByRole('button', { name: 'Fechar' }).click();
    await expect(page.getByText('Detalhes do Anúncio')).not.toBeVisible();

    // 3. Edit Vehicle Navigation (Batch D3 implementation)
    await page.getByTestId('btn-edit-dlr-veh-001').click();
    await expect(page).toHaveURL(/\/concessionaria\/anuncios\/dlr-veh-001\/editar/);
    await expect(page.getByRole('heading', { name: 'Editar Anúncio' })).toBeVisible();
  });

  test('WEB-021: Mobile layout (390px) renders responsive cards and hides desktop table', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/concessionaria/anuncios');

    // Desktop table hidden
    await expect(page.getByTestId('dealer-inventory-table')).not.toBeVisible();

    // Mobile cards container visible
    const mobileList = page.getByTestId('dealer-inventory-mobile-list');
    await expect(mobileList).toBeVisible();

    // 5 mobile cards rendered
    await expect(page.getByTestId('mobile-card-dlr-veh-001')).toBeVisible();
    await expect(page.getByTestId('mobile-card-dlr-veh-002')).toBeVisible();
    await expect(page.getByTestId('mobile-card-dlr-veh-003')).toBeVisible();
    await expect(page.getByTestId('mobile-card-dlr-veh-004')).toBeVisible();
    await expect(page.getByTestId('mobile-card-dlr-veh-005')).toBeVisible();

    // Check first card content
    const firstCard = page.getByTestId('mobile-card-dlr-veh-001');
    await expect(firstCard.getByText('Honda Civic')).toBeVisible();
    await expect(firstCard.getByText('R$ 124.900')).toBeVisible();
    await expect(firstCard.getByText('Plano Premium')).toBeVisible();
    await expect(firstCard.getByText(/2.340 views/i)).toBeVisible();
  });
});

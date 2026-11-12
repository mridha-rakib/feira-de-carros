import { expect, test } from '@playwright/test';

test.describe('Admin Dashboard ADM-D-002 Parity', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop only test suite');

  test('renders 4 summary cards, revenue chart, attention panel, and recent listings', async ({
    page,
    context,
  }) => {
    // Inject mock admin session cookie for testing
    await context.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/');

    const desktop = page.locator('[data-testid="desktop-dashboard"]');
    const cards = desktop.getByTestId('summary-cards');

    // Page title and subtitle
    await expect(desktop.getByRole('heading', { name: 'Visão geral' })).toBeVisible();
    await expect(
      desktop.getByText('Acompanhe anúncios, vendedores, pagamentos e pendências em um só lugar.'),
    ).toBeVisible();

    // 4 Summary cards matching Figma
    await expect(cards.getByText('Anúncios ativos')).toBeVisible();
    await expect(cards.getByText('1.248')).toBeVisible();

    await expect(cards.getByText('Vendedores aprovados')).toBeVisible();
    await expect(cards.getByText('682')).toBeVisible();

    await expect(cards.getByText('Aguardando aprovação')).toBeVisible();
    await expect(cards.getByText('36')).toBeVisible();

    await expect(cards.getByText('Receita confirmada')).toBeVisible();
    await expect(cards.getByText('R$ 42.580')).toBeVisible();

    // Key sections
    await expect(desktop.getByText('Receita dos anúncios')).toBeVisible();
    await expect(desktop.getByText('Requer atenção')).toBeVisible();
    await expect(desktop.getByText('Anúncios recentes')).toBeVisible();
  });
});

import { expect, test } from '@playwright/test';

test.describe('Admin Dashboard ADM-D-002 Parity', () => {
  test('renders 4 summary cards, revenue chart, attention panel, and recent listings', async ({
    page,
    context,
  }) => {
    // Inject mock admin session cookie
    await context.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/');
    await expect(page).toHaveTitle(/Painel de Controle/);

    // Summary cards
    await expect(page.getByText('Total de Usuários')).toBeVisible();
    await expect(page.locator('p').filter({ hasText: /^Anúncios Ativos$/ })).toBeVisible();
    await expect(page.getByText('Receita Estimada (Mês)')).toBeVisible();
    await expect(page.getByText('Pendentes de Moderação')).toBeVisible();

    // Key sections
    await expect(page.getByText('Evolução de Receita & Anúncios')).toBeVisible();
    await expect(page.getByText('Requer Atenção')).toBeVisible();
    await expect(page.getByText('Últimos Anúncios Cadastrados')).toBeVisible();
  });
});

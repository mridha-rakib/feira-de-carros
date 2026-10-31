import { expect, test } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test('renders KPI metrics and moderation queue', async ({ page, context }) => {
    // Inject mock admin session cookie
    await context.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock-valid-admin-session',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/');
    await expect(page).toHaveTitle(/Painel de Controle/);
    await expect(page.getByText('Fila de Moderação')).toBeVisible();
    await expect(page.getByText('Fila Prioritária de Moderação')).toBeVisible();
  });
});

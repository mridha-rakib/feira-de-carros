import { expect, test } from '@playwright/test';

test.describe('Marketplace Homepage', () => {
  test('renders hero heading and quick search', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Feira de Carros/);
    await expect(page.getByRole('heading', { name: /Encontre o carro perfeito/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Buscar Veículos/i })).toBeVisible();
  });
});

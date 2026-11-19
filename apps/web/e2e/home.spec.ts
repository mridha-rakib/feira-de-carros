import { expect, test } from '@playwright/test';

test.describe('Marketplace Homepage — Canonical WEB-001', () => {
  test('renders canonical hero heading, quick search, and featured listings', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: /Encontre.*seu próximo carro.*com.*segurança/i }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Buscar veículos/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Destaques da semana/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Encontre por categoria/i })).toBeVisible();
  });
});

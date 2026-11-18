import { expect, test } from '@playwright/test';

test.describe('Buyer Frontend Batch B1 — Marketplace Discovery & Search', () => {
  test('WEB-001: Marketplace Homepage renders brand, search, benefits and categories', async ({
    page,
  }) => {
    await page.goto('/');

    // Check locality header chip
    await expect(
      page
        .getByText(/Ipatinga, MG/i)
        .filter({ visible: true })
        .first(),
    ).toBeVisible();

    // Check Hero and search bar
    await expect(page.getByRole('heading', { name: /Encontre.*seu próximo carro/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Carros/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Motos/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Caminhões/i }).first()).toBeVisible();

    // Check 4 verified benefits (objective, unapproved claims replaced)
    await expect(page.getByText('Anunciantes Locais').first()).toBeVisible();
    await expect(page.getByText('Negociação Transparente').first()).toBeVisible();
    await expect(page.getByText('Variedade de veículos').first()).toBeVisible();
    await expect(page.getByText('Atendimento ágil').first()).toBeVisible();

    // Check Featured listings
    const featuredHeading = page.getByRole('heading', { name: /Destaques da semana/i });
    await expect(featuredHeading).toBeVisible();
    await featuredHeading.scrollIntoViewIfNeeded();
    await expect(
      page.getByText('Honda Civic 2022').filter({ visible: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText('Toyota Corolla 2021').filter({ visible: true }).first(),
    ).toBeVisible();

    // Check Categories
    await expect(page.getByRole('heading', { name: /Encontre por categoria/i })).toBeVisible();

    // Check Footer
    await expect(page.getByText(/FEIRA DE CARROS/i).first()).toBeVisible();
    await expect(page.getByText(/A plataforma conecta compradores e vendedores/i)).toBeVisible();
  });

  test('WEB-002: Location selection opens modal and switches active city', async ({ page }) => {
    await page.goto('/localidade');

    await expect(page.getByRole('heading', { name: /Escolha sua localização/i })).toBeVisible();
    await expect(page.getByText('Localidade padrão do marketplace: Ipatinga, MG')).toBeVisible();

    // Select alternative city
    const bhOption = page.getByRole('button', { name: /Belo Horizonte, MG/i });
    await expect(bhOption).toBeVisible();
    await bhOption.click();

    // Check applied text
    await expect(page.getByText('Belo Horizonte · MG')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Ver anúncios em Belo Horizonte, MG/i }),
    ).toBeVisible();
  });

  test('WEB-003: Category Browse renders classes and body types', async ({ page }) => {
    await page.goto('/categorias');

    await expect(page.getByRole('heading', { name: /Explore por categoria/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Carros' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Motos' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Caminhões' })).toBeVisible();

    await expect(page.getByRole('heading', { name: /Tipos de carro — exemplos/i })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sedã' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'SUV' })).toBeVisible();
  });

  test('WEB-004 & WEB-005: Search Results and Filter Sidebar', async ({ page }) => {
    await page.goto('/veiculos');

    await expect(page.getByRole('heading', { name: /Filtrar veículos/i })).toBeVisible();
    await expect(page.getByText(/anúncios encontrados/i)).toBeVisible();

    // Check vehicle cards
    await expect(page.getByText('Honda Civic 2022').first()).toBeVisible();
    await expect(page.getByText('Toyota Corolla 2021').first()).toBeVisible();

    // Filter by Brand Toyota
    const brandSelect = page.locator('#filter-brand');
    if (await brandSelect.isVisible()) {
      await brandSelect.selectOption('Toyota');
      await page.getByRole('button', { name: 'Aplicar filtros' }).click();

      await expect(page.getByText('Toyota Corolla 2021').first()).toBeVisible();
      await expect(page.getByText('Honda Civic 2022')).not.toBeVisible();
    }
  });

  test('WEB-001 & WEB-004: Favorites authentication gate prompts unauthenticated guest to login (Figma 840:317)', async ({
    page,
  }) => {
    await page.goto('/');

    // Guest clicks on favorite button of a featured vehicle
    const favoriteBtn = page.getByRole('button', { name: /Salvar nos favoritos/i }).first();
    await expect(favoriteBtn).toBeVisible();
    await favoriteBtn.click();

    // Verify Auth Gate Modal opens matching Figma 840:317
    await expect(
      page.getByRole('heading', { name: /Acesse sua conta para salvar/i }),
    ).toBeVisible();
    await expect(
      page.getByText(/Salve seus veículos favoritos, receba alertas de variação de preço/i),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /Entrar ou Cadastrar/i })).toBeVisible();

    // Click cancel/dismiss
    await page.getByRole('button', { name: /Continuar navegando como visitante/i }).click();
    await expect(
      page.getByRole('heading', { name: /Acesse sua conta para salvar/i }),
    ).not.toBeVisible();
  });
});

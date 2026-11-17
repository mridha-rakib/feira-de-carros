import { expect, test } from '@playwright/test';

test.describe('Buyer Frontend Batch B2 — Vehicle Detail, Phone Reveal & Dealer Showroom', () => {
  test('WEB-006: Vehicle Detail page renders specs, gallery, checklist, seller info and breadcrumb', async ({
    page,
  }) => {
    await page.goto('/veiculos/veh-civic-2022');

    // Breadcrumb
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Início' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Veículos', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Honda' })).toBeVisible();

    // Vehicle details
    await expect(
      page.getByRole('heading', { name: 'Honda Civic 2022' }).filter({ visible: true }),
    ).toBeVisible();
    await expect(page.getByText('R$ 124.900').filter({ visible: true })).toBeVisible();
    await expect(page.getByText('2.0 EXL Flex Automático').filter({ visible: true })).toBeVisible();

    // Technical Specs
    await expect(page.getByRole('heading', { name: 'Ficha Técnica do Veículo' })).toBeVisible();
    await expect(page.getByText('2022/2022')).toBeVisible();
    await expect(page.getByText('28.500 km')).toBeVisible();
    await expect(page.getByText('Prata Metálico')).toBeVisible();

    // Features Checklist
    await expect(page.getByRole('heading', { name: 'Itens e Opcionais' })).toBeVisible();
    await expect(page.getByText('Ar-condicionado digital dual zone')).toBeVisible();
    await expect(page.getByText('Apple CarPlay e Android Auto sem fio')).toBeVisible();

    // Seller Box
    await expect(page.getByRole('heading', { name: 'Líder Veículos Seminovos' })).toBeVisible();
    await expect(page.getByText('Concessionária Cadastrada').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ver Telefone' }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enviar Mensagem' }).first()).toBeVisible();

    // Report Link
    await expect(page.getByRole('button', { name: /Denunciar este anúncio/i })).toBeVisible();
  });

  test('WEB-006: Non-existent vehicle ID displays 404 state', async ({ page }) => {
    await page.goto('/veiculos/veh-nao-existe-404');
    await expect(page.getByRole('heading', { name: 'Veículo não encontrado' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Ver todos os veículos disponíveis' }),
    ).toBeVisible();
  });

  test('Phone Disclosure Flow: Revealing seller phone with safety guidance and telemetry (Figma 1211:2518)', async ({
    page,
  }) => {
    await page.goto('/veiculos/veh-corolla-2021');

    // Click "Ver Telefone"
    const phoneBtn = page.getByRole('button', { name: 'Ver Telefone' }).first();
    await expect(phoneBtn).toBeVisible();
    await phoneBtn.click();

    // Verify Phone Reveal Modal
    await expect(page.getByRole('heading', { name: 'Telefone do anunciante' })).toBeVisible();
    await expect(page.getByText('Carlos Eduardo Mendes').first()).toBeVisible();
    await expect(page.getByText('(31) 98765-4321')).toBeVisible();
    await expect(page.getByText('DEMO DATA · Telefone simulado')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ligar agora' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'WhatsApp' })).toBeVisible();

    // Close Modal
    await page.getByRole('button', { name: 'Fechar' }).click();
    await expect(page.getByRole('heading', { name: 'Telefone do anunciante' })).not.toBeVisible();
  });

  test('Listing Report Modal: Reporting vehicle with reason selection and protocol (Figma 1212:3890 & 1212:3977)', async ({
    page,
  }) => {
    await page.goto('/veiculos/veh-civic-2022');

    // Open report modal
    await page.getByRole('button', { name: /Denunciar este anúncio/i }).click();

    // Verify modal header
    await expect(page.getByRole('heading', { name: 'Denunciar anúncio' })).toBeVisible();

    // Select reason
    const reasonRadio = page.getByLabel('Preço incorreto ou divergente da realidade');
    await reasonRadio.check();

    // Submit report
    await page.getByRole('button', { name: 'Enviar denúncia' }).click();

    // Verify confirmation state matching Figma 1212:3977
    await expect(page.getByRole('heading', { name: 'Denúncia enviada com sucesso' })).toBeVisible();
    await expect(page.getByText(/DEN-2026-/)).toBeVisible();

    // Dismiss confirmation
    await page.getByRole('button', { name: 'Concluir e fechar' }).click();
    await expect(
      page.getByRole('heading', { name: 'Denúncia enviada com sucesso' }),
    ).not.toBeVisible();
  });

  test('Public Dealership Showroom: Brand profile and active stock (Figma 1211:2395 & 1211:2461)', async ({
    page,
  }) => {
    await page.goto('/concessionarias/dealer-lider-seminovos');

    // Header & identity
    await expect(page.getByRole('heading', { name: 'Líder Veículos Seminovos' })).toBeVisible();
    await expect(page.getByText('Concessionária Cadastrada').first()).toBeVisible();
    await expect(page.getByText('DEMO DATA').first()).toBeVisible();

    // Operating hours & address
    await expect(page.getByText(/Segunda a Sexta: 08:00 às 18:00/)).toBeVisible();
    await expect(page.getByText(/Av. Castelo Branco, 1200/)).toBeVisible();

    // Inventory
    await expect(page.getByRole('heading', { name: 'Estoque da Loja' })).toBeVisible();
    await expect(page.getByText('Honda Civic 2022').first()).toBeVisible();
    await expect(page.getByText('Hyundai Creta 2022').first()).toBeVisible();

    // Phone modal from dealership page
    await page.getByRole('button', { name: 'Ver Telefone da Loja' }).click();
    await expect(page.getByRole('heading', { name: 'Telefone da Concessionária' })).toBeVisible();
    await expect(page.getByText('(31) 3822-1000')).toBeVisible();
    await page.getByRole('button', { name: 'Fechar' }).click();
  });

  test('Public Dealership Showroom: Non-existent dealership displays 404 state', async ({
    page,
  }) => {
    await page.goto('/concessionarias/dealer-nao-existe-404');
    await expect(
      page.getByRole('heading', { name: 'Concessionária não encontrada' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explorar catálogo de veículos' })).toBeVisible();
  });
});

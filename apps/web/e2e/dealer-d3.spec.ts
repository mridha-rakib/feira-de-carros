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

test.describe('Dealership Frontend Batch D3 — Listing Creation, Editing & Lifecycle (WEB-023 to WEB-038)', () => {
  test.beforeEach(async ({ page }) => {
    await setupDealerSession(page);
  });

  test('WEB-023 to WEB-026: Full 4-step listing creation wizard journey', async ({ page }) => {
    // 1. Start from Inventory Overview and click "+ Novo anúncio"
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/anuncios');

    const newListingBtn = page.getByTestId('btn-new-listing');
    await expect(newListingBtn).toBeVisible();
    await newListingBtn.click();

    // 2. Step 1: Category Selection (WEB-023)
    await expect(page).toHaveURL(/\/concessionaria\/anuncios\/novo/);
    await expect(page.getByTestId('dealer-wizard-stepper')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Escolha a categoria do veículo' }),
    ).toBeVisible();

    // Select "Carros e utilitários"
    await page.getByTestId('category-card-cars').click();
    await page.getByTestId('btn-continue-step2').click();

    // 3. Step 2: Details & Attributes (WEB-024)
    await expect(page).toHaveURL(/\/concessionaria\/anuncios\/novo\/detalhes/);
    await expect(
      page.getByRole('heading', { name: 'Dados e características do veículo' }),
    ).toBeVisible();

    // Test inline validation
    await page.getByTestId('btn-continue-step3').click();
    await expect(page.getByText('Selecione ou informe a marca do veículo.')).toBeVisible();

    // Fill valid attributes
    await page.getByTestId('input-dealer-make').fill('Toyota');
    await page.getByTestId('input-dealer-model').fill('Yaris');
    await page.getByTestId('input-dealer-version').fill('1.5 XLS 16V Flex Automático');
    await page.getByTestId('input-dealer-year-fab').fill('2023');
    await page.getByTestId('input-dealer-year-model').fill('2024');
    await page.getByTestId('input-dealer-mileage').fill('19500');
    await page.getByTestId('input-dealer-plate').fill('BRA9E88');
    await page.getByTestId('input-dealer-price').fill('98900');
    await page
      .getByTestId('textarea-dealer-description')
      .fill('Veículo com laudo cautelar aprovado e garantia da concessionária.');

    await page.getByTestId('btn-continue-step3').click();

    // 4. Step 3: Photos & Gallery (WEB-025)
    await expect(page).toHaveURL(/\/concessionaria\/anuncios\/novo\/fotos/);
    await expect(page.getByRole('heading', { name: 'Fotos do veículo' })).toBeVisible();

    // Add sample photos
    await page.getByTestId('btn-add-sample-photos').click();
    await expect(page.getByTestId('photo-card-0')).toBeVisible();
    await expect(page.getByTestId('photo-card-0').getByText('Capa')).toBeVisible();

    await page.getByTestId('btn-continue-step4').click();

    // 5. Step 4: Review & Confirmation (WEB-026)
    await expect(page).toHaveURL(/\/concessionaria\/anuncios\/novo\/revisao/);
    await expect(
      page.getByRole('heading', { name: 'Revisão e confirmação do anúncio' }),
    ).toBeVisible();
    await expect(page.getByTestId('review-vehicle-price')).toContainText('R$ 98.900');

    // Submit listing
    await page.getByTestId('btn-submit-dealer-listing').click();

    // Success Screen
    await expect(page.getByTestId('submission-success-card')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Anúncio enviado com sucesso!' })).toBeVisible();
    await expect(page.getByTestId('protocol-number')).toBeVisible();

    // Return to inventory
    await page.getByTestId('btn-go-to-inventory').click();
    await expect(page).toHaveURL(/\/concessionaria\/anuncios/);

    // Newly created vehicle appears in inventory with "Em análise"
    await expect(
      page.getByTestId('dealer-inventory-table').getByText('Toyota Yaris'),
    ).toBeVisible();
    await expect(page.getByTestId('dealer-inventory-table').getByText('BRA9E88')).toBeVisible();
  });

  test('WEB-034 & WEB-035: Listing editing and side-by-side revision comparison', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/anuncios/dlr-veh-001/editar');

    await expect(page.getByRole('heading', { name: 'Editar Anúncio' })).toBeVisible();
    await expect(page.getByText('Governança de Revisão de Anúncios (VEH-018)')).toBeVisible();

    // Update proposed price and mileage
    const priceInput = page.getByTestId('input-edit-price');
    await priceInput.fill('119900');

    const mileageInput = page.getByTestId('input-edit-mileage');
    await mileageInput.fill('29500');

    // Submit proposed revision
    await page.getByTestId('btn-submit-edit-revision').click();

    // Should redirect to revision comparison page (WEB-035)
    await expect(page).toHaveURL(/\/concessionaria\/anuncios\/dlr-veh-001\/revisoes/);
    await expect(
      page.getByRole('heading', { name: 'Comparação de Versões do Anúncio' }),
    ).toBeVisible();
    await expect(page.getByTestId('revision-comparison-container')).toBeVisible();
    await expect(page.getByTestId('proposed-price-text')).toHaveText('R$ 119.900');

    // Return to inventory
    await page.getByTestId('btn-back-to-inventory-from-revisoes').click();
    await expect(page).toHaveURL(/\/concessionaria\/anuncios/);

    // Vehicle row shows "Revisão" badge/link
    await expect(page.getByTestId('btn-revisions-dlr-veh-001')).toBeVisible();
  });

  test('WEB-038: Sold vehicle removal and status update to "Vendido"', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/anuncios/dlr-veh-005/vendido');

    await expect(page.getByRole('heading', { name: 'Confirmar Venda do Veículo' })).toBeVisible();
    await expect(page.getByText('O que acontece ao marcar o veículo como vendido')).toBeVisible();

    // Submit disabled until checkbox checked
    const submitBtn = page.getByTestId('btn-submit-sold');
    await expect(submitBtn).toBeDisabled();

    await page.getByTestId('checkbox-confirm-sold').check();
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    // Success confirmation screen
    await expect(page.getByTestId('sold-success-card')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Veículo Marcado como Vendido!' }),
    ).toBeVisible();

    // Return to inventory
    await page.getByTestId('btn-sold-return-inventory').click();
    await expect(page).toHaveURL(/\/concessionaria\/anuncios/);

    // Vehicle row status is "Vendido"
    const poloRow = page.getByTestId('vehicle-row-dlr-veh-005');
    await expect(poloRow.getByText('Vendido').first()).toBeVisible();
  });

  test('WEB-023 to WEB-038: Mobile responsiveness (390px)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    // Step 1 Category on mobile
    await page.goto('/concessionaria/anuncios/novo');
    await expect(page.getByTestId('dealer-wizard-stepper')).toBeVisible();
    await expect(page.getByTestId('category-card-cars')).toBeVisible();

    // Sold page on mobile
    await page.goto('/concessionaria/anuncios/dlr-veh-004/vendido');
    await expect(page.getByRole('heading', { name: 'Confirmar Venda do Veículo' })).toBeVisible();
  });
});

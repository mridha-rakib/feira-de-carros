import { expect, test } from '@playwright/test';

test.describe('Dealership Batch D5 E2E — Messaging, Advertising & Payment Flows', () => {
  test.beforeEach(async ({ context }) => {
    // Set authenticated demo dealer session cookie
    await context.addCookies([
      {
        name: 'fdc_web_session',
        value: 'demo_dealer_session',
        domain: 'localhost',
        path: '/',
      },
    ]);
  });

  test('1. Dealership Messages: list, select, view thread, and send reply (WEB-045, WEB-046)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/mensagens');
    await expect(page).toHaveURL(/\/concessionaria\/mensagens/);

    // Verify page header
    await expect(page.getByRole('heading', { name: 'Mensagens & Negociações' })).toBeVisible();

    // Verify conversation list exists
    const conv1 = page.getByTestId('conv-item-DLR-CONV-001');
    await expect(conv1).toBeVisible();
    await expect(conv1).toContainText('Carlos Eduardo Menezes');
    await expect(conv1).toContainText('Honda Civic');

    // Select conversation
    await conv1.click();

    // Thread should display message history
    await expect(page.getByRole('heading', { name: 'Carlos Eduardo Menezes' })).toBeVisible();
    await expect(
      page.getByText('Olá! O Civic 2.0 EXL anunciado por R$ 124.900 ainda está disponível'),
    ).toBeVisible();

    // Reply input form
    const replyInput = page.getByTestId('input-dealer-reply');
    await expect(replyInput).toBeVisible();
    await replyInput.fill('Olá Carlos! Temos horário disponível neste sábado às 10h. Confirmado?');

    const sendBtn = page.getByTestId('btn-dealer-send-reply');
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // Expect message to appear in the thread
    await expect(
      page
        .locator('div')
        .filter({ hasText: /^Olá Carlos!/ })
        .first(),
    ).toBeVisible();
  });

  test('2. Dealership Messages: report and block contact (WEB-048)', async ({ page }) => {
    await page.goto('/concessionaria/mensagens');

    // Select conversation 3 (Lucas)
    const conv3 = page.getByTestId('conv-item-DLR-CONV-003');
    await conv3.click();

    // Click Denunciar e Bloquear
    const reportBtn = page.getByTestId('btn-open-report-modal');
    await expect(reportBtn).toBeVisible();
    await reportBtn.click();

    // Verify modal is displayed
    const modal = page.getByTestId('modal-report-block');
    await expect(modal).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Denunciar e Bloquear Contato' })).toBeVisible();

    // Confirm report and block
    const confirmBtn = page.getByTestId('btn-confirm-report-block');
    await confirmBtn.click();

    // Modal should close and thread show blocked notice
    await expect(modal).not.toBeVisible();
    await expect(page.getByTestId('blocked-conversation-alert')).toBeVisible();
    await expect(page.getByText('Contato bloqueado e conversa encerrada')).toBeVisible();
  });

  test('3. Plan Selection and PIX Checkout Flow (WEB-029, WEB-030, WEB-032)', async ({ page }) => {
    await page.goto('/concessionaria/anuncios/dlr-veh-001/plano');
    await expect(page).toHaveURL(/\/concessionaria\/anuncios\/dlr-veh-001\/plano/);

    // Verify headings
    await expect(
      page.getByRole('heading', { name: 'Selecione o Plano de Publicação' }),
    ).toBeVisible();
    await expect(page.getByText(/Honda Civic/)).toBeVisible();

    // Verify plans: Essencial vs Premium
    await expect(page.getByRole('heading', { name: 'Plano Essencial' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Plano Premium' })).toBeVisible();
    await expect(page.getByText('R$ 89,90')).toBeVisible();

    // Select PIX and proceed
    const proceedBtn = page.getByTestId('btn-proceed-checkout');
    await expect(proceedBtn).toBeVisible();
    await proceedBtn.click();

    // Should navigate to PIX checkout
    await page.waitForURL(/\/concessionaria\/pedidos\/.*\/pix/);
    await expect(page.getByRole('heading', { name: 'Pagamento via PIX' })).toBeVisible();
    await expect(page.getByTestId('input-pix-code')).toBeVisible();

    // Copy PIX button
    const copyBtn = page.getByTestId('btn-copy-pix');
    await copyBtn.click();
    await expect(page.getByText('Copiado!')).toBeVisible();

    // Simulate payment confirmation
    const simulateBtn = page.getByTestId('btn-simulate-pix-paid');
    await simulateBtn.click();

    // Should navigate to Status page (WEB-032)
    await page.waitForURL(/\/concessionaria\/pedidos\/.*\/status/);
    await expect(page.getByTestId('heading-payment-confirmed')).toBeVisible();
    await expect(page.getByText('Pagamento Realizado com Sucesso!')).toBeVisible();

    // Return to inventory button
    const backBtn = page.getByTestId('btn-back-to-inventory');
    await expect(backBtn).toBeVisible();
    await backBtn.click();
    await page.waitForURL(/\/concessionaria\/anuncios/);
  });

  test('4. Listing Boost and Card Checkout Flow (WEB-036, WEB-031, WEB-032)', async ({ page }) => {
    await page.goto('/concessionaria/anuncios/dlr-veh-002/impulsionar');
    await expect(page).toHaveURL(/\/concessionaria\/anuncios\/dlr-veh-002\/impulsionar/);

    // Verify boost headline and price
    await expect(page.getByRole('heading', { name: 'Impulsionar Veículo no Topo' })).toBeVisible();
    await expect(page.getByText('R$ 29,90')).toBeVisible();
    await expect(page.getByText('+150% Visualizações')).toBeVisible();

    // Select Credit Card
    await page.getByLabel('Cartão de Crédito').check();

    // Confirm boost
    const confirmBoostBtn = page.getByTestId('btn-confirm-boost');
    await confirmBoostBtn.click();

    // Should navigate to Card checkout (WEB-031)
    await page.waitForURL(/\/concessionaria\/pedidos\/.*\/cartao/);
    await expect(
      page.getByRole('heading', { name: 'Pagamento com Cartão de Crédito' }),
    ).toBeVisible();

    // Fill card form
    await page.getByTestId('input-card-number').fill('4111 2222 3333 4444');
    await page.getByTestId('input-card-holder').fill('LIDER VEICULOS SEMINOVOS');
    await page.getByTestId('input-card-expiry').fill('12/28');
    await page.getByTestId('input-card-cvv').fill('987');

    // Submit card payment
    const payBtn = page.getByTestId('btn-pay-credit-card');
    await payBtn.click();

    // Should navigate to Status page (WEB-032)
    await page.waitForURL(/\/concessionaria\/pedidos\/.*\/status/);
    await expect(page.getByTestId('heading-payment-confirmed')).toBeVisible();
    await expect(page.getByText('R$ 29,90')).toBeVisible();
  });

  test('5. Listing Renewal Flow (WEB-037)', async ({ page }) => {
    await page.goto('/concessionaria/anuncios/dlr-veh-003/renovar');
    await expect(page).toHaveURL(/\/concessionaria\/anuncios\/dlr-veh-003\/renovar/);

    // Verify renewal header and vehicle info
    await expect(page.getByRole('heading', { name: 'Renovar Anúncio de Veículo' })).toBeVisible();
    await expect(page.getByText('Renovação Padrão (+30 dias)')).toBeVisible();
    await expect(page.getByText('R$ 49,90')).toBeVisible();

    // Proceed with PIX
    const confirmRenewalBtn = page.getByTestId('btn-confirm-renewal');
    await confirmRenewalBtn.click();

    // Check PIX page reached
    await page.waitForURL(/\/concessionaria\/pedidos\/.*\/pix/);
    await expect(page.getByText('Renovação de Anúncio (+30 dias)')).toBeVisible();
  });

  test('6. Inventory Console Buttons: Boost and Change Plan links exist', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/anuncios');

    // Verify navigation tabs
    await expect(page.getByRole('link', { name: 'Estoque da frota' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Perfil público' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Mensagens/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Ver showroom público/ })).toBeVisible();

    // Verify Impulsionar action exists for listings
    const boostBtn = page.getByTestId('btn-boost-dlr-veh-001');
    await expect(boostBtn).toBeVisible();

    // Verify Alterar plano link exists
    const changePlanBtn = page.getByTestId('btn-change-plan-dlr-veh-001');
    await expect(changePlanBtn).toBeVisible();
  });
});

import { type Page, expect, test } from '@playwright/test';

async function loginAsBuyer(page: Page, redirect = '/mensagens') {
  await page.goto(`/entrar?redirect=${encodeURIComponent(redirect)}`);
  await page.getByRole('button', { name: 'Continuar com Google' }).click();
  await page.getByRole('button', { name: /Entrar \(simulação\)/i }).click();
  await page.waitForURL(`**${redirect}`);
}

test.describe('Buyer Frontend Batch B5 — Messaging, Conversations, Reporting & Safety', () => {
  test('WEB-015: Unauthenticated guest on /mensagens renders Login Required State (Figma 1168:488 / 1168:527)', async ({
    page,
  }) => {
    // Navigate as guest
    await page.goto('/mensagens');

    // Verify Login Required heading & copy
    await expect(
      page.getByRole('heading', { name: 'Acesse sua conta para ver suas mensagens' }),
    ).toBeVisible();
    await expect(
      page.getByText(
        'Para conversar com anunciantes em tempo real, agendar visitas com segurança e manter seu histórico protegido',
      ),
    ).toBeVisible();

    // Verify CTAs
    const loginLink = page.getByRole('link', { name: 'Entrar na minha conta' });
    const registerLink = page.getByRole('link', { name: 'Criar conta gratuita' });
    await expect(loginLink).toBeVisible();
    await expect(registerLink).toBeVisible();

    // Verify safety highlight features
    await expect(page.getByText(/Negociação Segura:/i)).toBeVisible();
    await expect(page.getByText(/Histórico Salvo:/i)).toBeVisible();
    await expect(page.getByText(/Vínculo do Anúncio:/i)).toBeVisible();

    // Clicking login link takes user to /entrar with redirect param
    await loginLink.click();
    await page.waitForURL(/entrar\?redirect=\/mensagens/);
  });

  test('WEB-012 & WEB-013: Authenticated Buyer Inbox & Thread Selection (Figma 1168:202 / 1168:310)', async ({
    page,
  }) => {
    await loginAsBuyer(page);

    // Verify Inbox title
    await expect(page.getByRole('heading', { name: 'Minhas Mensagens' })).toBeVisible();

    // Verify Conversation List
    await expect(page.getByPlaceholder('Buscar conversas...')).toBeVisible();
    await expect(page.getByRole('button', { name: /Carlos Eduardo Mendes/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Mariana Silva/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /AutoCar Multimarcas/i })).toBeVisible();

    // Verify Active Conversation Header
    await expect(page.getByRole('heading', { name: 'Carlos Eduardo Mendes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Toyota Corolla XEi 2.0' })).toBeVisible();

    // Verify Message bubbles direction alignment
    // Buyer outgoing message bubble
    await expect(page.getByText(/Olá Carlos! Tenho interesse no seu Corolla/i)).toBeVisible();
    // Seller incoming message bubble
    await expect(
      page.getByText(/Sim, o carro está disponível e com todas as revisões em dia/i),
    ).toBeVisible();

    // Verify Right Rail with Vehicle Reference & Safety Advice
    await expect(page.getByText('Veículo de Referência')).toBeVisible();
    await expect(page.getByRole('link', { name: /Ver anúncio completo →/i })).toBeVisible();
    await expect(page.getByText('Dicas de Segurança')).toBeVisible();
    await expect(page.getByText('Privacidade do Chat')).toBeVisible();
  });

  test('WEB-013: Sending a message updates conversation thread', async ({ page }) => {
    await loginAsBuyer(page);

    // Select Mariana Silva conversation
    await page.getByRole('button', { name: /Mariana Silva/i }).click();

    const input = page.getByPlaceholder('Digite sua mensagem ao vendedor...');
    await expect(input).toBeVisible();

    const testMsg = `Pergunta sobre o Creta - ${Date.now()}`;
    await input.fill(testMsg);
    await page
      .locator('form')
      .getByRole('button', { name: /Enviar/i })
      .click();

    // Verify message appears in active thread area
    await expect(
      page.getByRole('region', { name: 'Conversa ativa' }).getByText(testMsg),
    ).toBeVisible();
  });

  test('WEB-014: Vehicle Details CTA initiates conversation thread (Figma 1168:419)', async ({
    page,
  }) => {
    // Start on vehicle page as guest
    await page.goto('/veiculos/veh-corolla-2021');

    // Click Enviar Mensagem while guest -> prompts login gate modal
    const messageCta = page.getByRole('main').getByRole('button', { name: 'Enviar Mensagem' });
    await messageCta.click();

    // Auth gate modal opens
    await expect(page.getByRole('heading', { name: 'Acesse sua conta para salvar' })).toBeVisible();

    // Click to go to login
    await page.getByRole('link', { name: 'Entrar ou Cadastrar' }).click();

    // We are on login page with redirect param
    await expect(page).toHaveURL(/entrar\?redirect=/);

    // Click social demo login and submit
    await page.getByRole('button', { name: 'Continuar com Google' }).click();
    await page.getByRole('button', { name: /Entrar \(simulação\)/i }).click();

    // Redirects back to vehicle details page authenticated
    await page.waitForURL('**/veiculos/veh-corolla-2021');

    // Now click Enviar Mensagem opens drawer
    await messageCta.click();
    await expect(page.getByText('Enviar mensagem ao vendedor')).toBeVisible();

    // Submit message
    const textarea = page.locator('#message-text');
    await textarea.fill('Olá Carlos! Gostaria de agendar uma vistoria no sábado.');
    await page.locator('form').getByRole('button', { name: 'Enviar Mensagem' }).click();

    // Message sent success state
    await expect(page.getByRole('heading', { name: 'Mensagem enviada!' })).toBeVisible();
    const openMessagesLink = page.getByRole('link', {
      name: 'Abrir conversa em Mensagens →',
    });
    await expect(openMessagesLink).toBeVisible();

    // Navigate into the active messages thread
    await openMessagesLink.click();
    await page.waitForURL(/mensagens\?id=/);
    await expect(page.getByRole('heading', { name: 'Minhas Mensagens' })).toBeVisible();
  });

  test('WEB-017 & WEB-018: Safety Report and Block modal transitions thread to read-only (Figma 1168:614 / 1168:693)', async ({
    page,
  }) => {
    await loginAsBuyer(page);

    // Select AutoCar conversation
    await page.getByRole('button', { name: /AutoCar Multimarcas/i }).click();

    // Open options menu
    await page.getByRole('button', { name: 'Opções da conversa' }).click();
    await page.getByRole('button', { name: /Denunciar anunciante/i }).click();

    // Verify Report Modal is open
    await expect(
      page.getByRole('heading', { name: 'Denunciar ou Bloquear Anunciante' }),
    ).toBeVisible();
    await expect(page.getByText('Pedido de sinal ou pagamento antecipado')).toBeVisible();

    // Confirm report with block seller checked
    await page.getByRole('button', { name: 'Confirmar Denúncia' }).click();

    // Conclude modal
    await expect(page.getByRole('heading', { name: 'Denúncia registrada!' })).toBeVisible();
    await page.getByRole('button', { name: 'Concluir' }).click();

    // Conversation is now blocked & read-only (Figma 1168:693)
    await expect(
      page
        .getByRole('region', { name: 'Conversa ativa' })
        .getByText('Esta conversa está arquivada e não aceita novas mensagens.'),
    ).toBeVisible();
  });

  test('WEB-019: Official Team Mediated Conversation displays verified team banner (Figma 1168:790)', async ({
    page,
  }) => {
    await loginAsBuyer(page);

    // Select Mediated conversation
    await page.getByRole('button', { name: /Equipe Feira de Carros/i }).click();

    // Verify official mediation banner
    await expect(page.getByText('Equipe Feira de Carros • Mediação Oficial')).toBeVisible();
    await expect(page.getByText(/Este canal conta com mediação da nossa equipe/i)).toBeVisible();
  });
});

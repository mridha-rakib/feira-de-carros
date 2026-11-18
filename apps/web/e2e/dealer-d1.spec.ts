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

test.describe('Dealership Frontend Batch D1 — Registration & Lifecycle', () => {
  test('WEB-017: Registration page renders 4-step stepper, inputs, and sidebar cards', async ({
    page,
  }) => {
    await page.goto('/concessionaria/solicitacao');

    // Title and Breadcrumb
    await expect(page.getByRole('heading', { name: 'Cadastro da concessionária' })).toBeVisible();
    await expect(
      page.getByText('Informe os dados para solicitar aprovação como anunciante.'),
    ).toBeVisible();
    await expect(page.getByText('Cadastro de anunciante').first()).toBeVisible();

    // 4-Phase Stepper (assert visible element across responsive viewports)
    await expect(page.getByText('Dados da conta').filter({ visible: true }).first()).toBeVisible();
    await expect(
      page.getByText('Dados da revenda').filter({ visible: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText('Contato e endereço').filter({ visible: true }).first(),
    ).toBeVisible();
    await expect(page.getByText('Revisão e envio').filter({ visible: true }).first()).toBeVisible();

    // Step 1 Form Fields
    await expect(page.locator('#dealer-first-name')).toBeVisible();
    await expect(page.locator('#dealer-last-name')).toBeVisible();
    await expect(page.locator('#dealer-birth-date')).toBeVisible();
    await expect(page.locator('#dealer-email')).toBeVisible();
    await expect(page.locator('#dealer-password')).toBeVisible();
    await expect(page.locator('#dealer-confirm-password')).toBeVisible();

    // Sidebar Cards
    const howItWorks = page.getByRole('heading', { name: 'Como funciona?' });
    await howItWorks.scrollIntoViewIfNeeded();
    await expect(howItWorks).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Segurança e privacidade' })).toBeVisible();
    await expect(page.getByText('O envio não garante aprovação automática.')).toBeVisible();
    await expect(
      page.getByText('Requisitos adicionais serão confirmados no cadastro final.'),
    ).toBeVisible();
  });

  test('WEB-017 Step 1: Validates required fields, 18+ eligibility, and password confirmation', async ({
    page,
  }) => {
    await page.goto('/concessionaria/solicitacao');

    const nextBtn = page.getByRole('button', { name: /Continuar para dados da revenda/i });

    // Empty submission error
    await nextBtn.click();
    await expect(page.getByText('Informe o primeiro nome do responsável.')).toBeVisible();

    // Under-18 rejection
    await page.locator('#dealer-first-name').fill('Roberto');
    await page.locator('#dealer-last-name').fill('Almeida');
    await page.locator('#dealer-birth-date').fill('15/05/2012'); // 14 years old
    await page.locator('#dealer-email').fill('roberto@concessionaria.com.br');
    await page.locator('#dealer-password').fill('senha123');
    await page.locator('#dealer-confirm-password').fill('senha123');
    await nextBtn.click();
    await expect(
      page.getByText(/Cadastro permitido apenas para maiores de 18 anos/i),
    ).toBeVisible();

    // Password mismatch rejection
    await page.locator('#dealer-birth-date').fill('15/05/1990'); // 36 years old
    await page.locator('#dealer-confirm-password').fill('senhaDiferente');
    await nextBtn.click();
    await expect(page.getByText(/A confirmação de senha não confere/i)).toBeVisible();

    // Valid Step 1 advances to Step 2
    await page.locator('#dealer-confirm-password').fill('senha123');
    await nextBtn.click();
    await expect(page.getByRole('heading', { name: 'Dados da concessionária' })).toBeVisible();
  });

  test('WEB-017 Step 2 & 3: Validates strict CNPJ check digits and phone before review', async ({
    page,
  }) => {
    await page.goto('/concessionaria/solicitacao');

    // Fill Step 1
    const firstNameInput = page.locator('#dealer-first-name');
    await expect(firstNameInput).toBeVisible();
    await firstNameInput.click();
    await firstNameInput.fill('Carlos');
    await page.locator('#dealer-last-name').fill('Mendes');
    await page.locator('#dealer-birth-date').fill('20/08/1985');
    await page.locator('#dealer-email').fill('carlos@lideripatinga.com.br');
    await page.locator('#dealer-password').fill('segredo123');
    await page.locator('#dealer-confirm-password').fill('segredo123');
    await page.getByRole('button', { name: /Continuar para dados da revenda/i }).click();

    // Step 2: Test invalid CNPJ
    const step2Btn = page.getByRole('button', { name: /Continuar para contato e endereço/i });
    await page.locator('#dealer-company-name').fill('Líder Automóveis Ipatinga');
    await page.locator('#dealer-cnpj').fill('11.222.333/0001-00'); // Invalid check digits
    await step2Btn.click();
    await expect(page.getByText(/CNPJ inválido/i)).toBeVisible();

    // Valid CNPJ advances to Step 3
    await page.locator('#dealer-cnpj').fill('11.222.333/0001-81'); // Valid Receita Federal CNPJ
    await step2Btn.click();
    await expect(page.getByRole('heading', { name: 'Contato e endereço' })).toBeVisible();

    // Step 3: Test phone and address validation
    const step3Btn = page.getByRole('button', { name: /Continuar para revisão/i });
    await page.locator('#dealer-phone').fill('123'); // Invalid phone
    await page.locator('#dealer-address').fill('');
    await step3Btn.click();
    await expect(page.getByText(/Telefone inválido/i)).toBeVisible();

    // Valid Step 3 advances to Step 4 (Revisão e envio)
    await page.locator('#dealer-phone').fill('3138224000');
    await page.locator('#dealer-address').fill('Av. Pedro Linhares Gomes, 4500, Horto');
    await step3Btn.click();
    await expect(page.getByRole('heading', { name: 'Revisão e envio' })).toBeVisible();

    // Check masked CNPJ in summary
    await expect(page.getByText('11.***.***/0001-**')).toBeVisible();
  });

  test('WEB-017 Step 4: Review modal, submission, and status redirect', async ({ page }) => {
    await page.goto('/concessionaria/solicitacao');

    // Fill all steps
    const firstNameInput = page.locator('#dealer-first-name');
    await expect(firstNameInput).toBeVisible();
    await firstNameInput.click();
    await firstNameInput.fill('Fernanda');
    await page.locator('#dealer-last-name').fill('Lima');
    await page.locator('#dealer-birth-date').fill('10/10/1992');
    await page.locator('#dealer-email').fill('fernanda@autovaleveiculos.com.br');
    await page.locator('#dealer-password').fill('senha123456');
    await page.locator('#dealer-confirm-password').fill('senha123456');
    await page.getByRole('button', { name: /Continuar para dados da revenda/i }).click();

    await page.locator('#dealer-company-name').fill('Autovale Veículos Multimarcas');
    await page.locator('#dealer-cnpj').fill('22.333.444/0001-81'); // Valid Brazilian CNPJ
    await page.getByRole('button', { name: /Continuar para contato e endereço/i }).click();

    await page.locator('#dealer-phone').fill('3138245500');
    await page.locator('#dealer-address').fill('Av. Castelo Branco, 1200, República');
    await page.getByRole('button', { name: /Continuar para revisão/i }).click();

    // Check terms checkbox
    const termsCheckbox = page.getByRole('checkbox');
    await termsCheckbox.check();

    // Open review modal (Figma 1629:3560)
    const sendBtn = page.getByRole('button', { name: 'Enviar solicitação' });
    await sendBtn.click();
    await expect(page.getByRole('heading', { name: 'Revisão da solicitação' })).toBeVisible();
    await expect(page.getByText(/Simulação de navegação. Nenhum dado é enviado/i)).toBeVisible();

    // Confirm in modal -> triggers Sent Modal (Figma 1629:3572)
    const modalConfirmBtn = page.getByRole('button', { name: 'Enviar solicitação' }).last();
    await modalConfirmBtn.click();
    await expect(
      page.getByRole('heading', { name: /Solicitação enviada · demonstração/i }),
    ).toBeVisible();

    // Redirects to status
    await expect(page).toHaveURL(/\/concessionaria\/solicitacao\/status/, { timeout: 10000 });
  });

  test('Status Page: Tracks review lifecycle, displays protocol, and toggles QA simulated states', async ({
    page,
  }) => {
    await setupDealerSession(page);
    await page.goto('/concessionaria/solicitacao/status');

    await expect(
      page.getByRole('heading', { name: 'Acompanhamento da solicitação' }),
    ).toBeVisible();
    await expect(page.getByText(/Protocolo:/i)).toBeVisible();
    await expect(page.getByText('Validação fiscal do CNPJ e dados')).toBeVisible();

    // QA State: Correction Required
    const correctionBtn = page.getByRole('button', { name: 'Correção Necessária' });
    await correctionBtn.click();
    await expect(page.getByText('Correção solicitada pela moderação')).toBeVisible();
    await expect(page.getByRole('link', { name: /Corrigir dados/i })).toBeVisible();

    // QA State: Active / Approved
    const activeBtn = page.getByRole('button', { name: 'Aprovado (Ativo)' });
    await activeBtn.click();
    await expect(page.getByText('Cadastro de concessionária aprovado!')).toBeVisible();
    await expect(page.getByRole('link', { name: /Ver meu estoque/i })).toBeVisible();

    // Action Modal test (Figma 1629:3592)
    const actionBtn = page.getByRole('button', { name: 'Ações do anúncio' });
    await actionBtn.click();
    await expect(page.getByRole('heading', { name: 'Gerenciar status do anúncio' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancelar' })).toBeVisible();
    await page.getByRole('button', { name: 'Cancelar' }).click();
  });

  test('Correction Page: Updates dealership data and resubmits to pending review', async ({
    page,
  }) => {
    await setupDealerSession(page);
    await page.goto('/concessionaria/solicitacao/corrigir');

    await expect(
      page.getByRole('heading', { name: 'Corrigir dados da concessionária' }),
    ).toBeVisible();
    await expect(page.getByText(/Motivo do pedido de correção/i)).toBeVisible();

    // Edit fields
    const nameInput = page.locator('#correct-dealership-name');
    await nameInput.fill('Líder Veículos e Seminovos Ltda (Corrigida)');

    const resubmitBtn = page.getByRole('button', { name: /Reenviar para análise/i });
    await resubmitBtn.click();

    // Saved feedback modal (Figma 1629:3582)
    await expect(
      page.getByRole('heading', { name: /Salvar alterações · demonstração/i }),
    ).toBeVisible();

    // Redirects back to status
    await expect(page).toHaveURL(/\/concessionaria\/solicitacao\/status/, { timeout: 10000 });
  });

  test('Shared Login: Connects dealer personas and blocks staff from customer portal', async ({
    page,
  }) => {
    await page.goto('/entrar');

    // Test staff blocking
    const emailInput = page.locator('#buyer-login-email');
    const passwordInput = page.locator('#buyer-login-password');
    const submitBtn = page.getByRole('button', { name: 'Entrar (simulação)' });

    await emailInput.fill('admin@feiradecarros.com.br');
    await passwordInput.fill('123456');
    await submitBtn.click();
    await expect(
      page.getByText(
        /Contas da equipe administrativa .* devem realizar login exclusivamente pelo portal administrativo/i,
      ),
    ).toBeVisible();

    // Test active dealer login
    await emailInput.fill('contato@liderveiculos.com.br');
    await passwordInput.fill('123456');
    await submitBtn.click();
    await expect(page).toHaveURL(/\/concessionaria\/anuncios/, { timeout: 10000 });
  });
});

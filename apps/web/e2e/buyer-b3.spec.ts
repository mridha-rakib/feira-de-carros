import { expect, test } from '@playwright/test';

test.describe('Buyer Frontend Batch B3 — Authentication & Account Management', () => {
  test('WEB-005: Login page renders Figma 845:164 layout, form validation, and demo mode', async ({
    page,
  }) => {
    await page.goto('/entrar');

    // Header & Logo
    await expect(page.getByRole('heading', { name: 'Entrar na sua conta' })).toBeVisible();
    await expect(page.getByText('Acesse seus favoritos, buscas salvas e mensagens.')).toBeVisible();

    // Inputs
    const emailInput = page.locator('#buyer-login-email');
    const passwordInput = page.locator('#buyer-login-password');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Validation on empty submit
    await emailInput.fill('');
    await passwordInput.fill('');
    const submitBtn = page.getByRole('button', { name: 'Entrar (simulação)' });
    await submitBtn.click();
    await expect(page.getByText('Por favor, informe um endereço de e-mail válido.')).toBeVisible();

    // Toggle password visibility
    const togglePasswordBtn = page.getByRole('button', { name: /Exibir senha|Ocultar senha/i });
    await expect(togglePasswordBtn).toBeVisible();
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await togglePasswordBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Links to recovery & register
    await expect(page.getByRole('link', { name: 'Esqueceu a senha?' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Criar conta' })).toBeVisible();

    // Demo note
    await expect(page.getByText(/Ambiente demonstrativo/i).first()).toBeVisible();

    // Suspended account preview toggle
    const previewSuspendedBtn = page.getByRole('button', {
      name: /Prévia: simular conta suspensa/i,
    });
    await expect(previewSuspendedBtn).toBeVisible();
    await previewSuspendedBtn.click();
    await emailInput.fill('rodrigo.silva@email.com');
    await passwordInput.fill('senha123456');
    await submitBtn.click();
    await expect(
      page.getByText(/Esta conta de comprador encontra-se suspensa para análise/i),
    ).toBeVisible();
  });

  test('WEB-006: Registration page renders Figma 845:212 layout, age validation, and duplicate email preview', async ({
    page,
  }) => {
    await page.goto('/cadastrar');

    // Heading
    await expect(page.getByRole('heading', { name: 'Criar conta' })).toBeVisible();

    const firstNameInput = page.locator('#buyer-reg-firstname');
    const lastNameInput = page.locator('#buyer-reg-lastname');
    const birthDateInput = page.locator('#buyer-reg-birthdate');
    const emailInput = page.locator('#buyer-reg-email');
    const passwordInput = page.locator('#buyer-reg-password');
    const confirmInput = page.locator('#buyer-reg-confirm');

    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();
    await expect(birthDateInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(confirmInput).toBeVisible();

    // Test underage (<18) rejection
    await firstNameInput.fill('Lucas');
    await lastNameInput.fill('Santos');
    await birthDateInput.fill('10/10/2015'); // Minor
    await emailInput.fill('lucas.teste@email.com');
    await passwordInput.fill('senhaForte123');
    await confirmInput.fill('senhaForte123');
    await page.locator('input[type="checkbox"]').check();

    const submitBtn = page.getByRole('button', { name: 'Criar conta (simulação)' });
    await submitBtn.click();
    await expect(
      page.getByText(/Cadastro permitido apenas para maiores de 18 anos/i).first(),
    ).toBeVisible();

    // Test Duplicate Email preview toggle
    const toggleDuplicateBtn = page.getByRole('button', { name: /Prévia: e-mail duplicado/i });
    await toggleDuplicateBtn.click();
    await birthDateInput.fill('15/05/1990'); // Adult
    await submitBtn.click();
    await expect(
      page.getByText(/Este endereço de e-mail já possui cadastro na plataforma/i),
    ).toBeVisible();
  });

  test('WEB-007: Unauthenticated visit to /conta redirects to /entrar (Middleware Protection)', async ({
    page,
  }) => {
    await page.goto('/conta');
    await expect(page).toHaveURL(/\/entrar\?redirect=%2Fconta/);
    await expect(page.getByRole('heading', { name: 'Entrar na sua conta' })).toBeVisible();
  });

  test('WEB-007: Buyer Account Dashboard renders profile, tabs, and security actions with active session (Figma 845:270)', async ({
    page,
    context,
  }) => {
    // Authenticate session via cookie
    await context.addCookies([
      {
        name: 'fdc_web_session',
        value: 'demo_buyer_session',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/conta');

    // Heading & Profile Card
    await expect(page.getByRole('heading', { name: 'Minha conta' })).toBeVisible();
    await expect(page.getByText('DEMO DATA').first()).toBeVisible();

    // Form Fields
    const phoneInput = page.locator('#profile-phone');
    const emailInput = page.locator('#profile-email');
    await expect(phoneInput).toBeVisible();
    await expect(emailInput).toBeVisible();

    // Edit profile and save
    await phoneInput.fill('(31) 98888-7777');
    const saveBtn = page.getByRole('button', { name: 'Salvar alterações' });
    await saveBtn.click();
    await expect(
      page.getByText('Dados do perfil atualizados com sucesso (simulação)!'),
    ).toBeVisible();

    // Security Links in Sidebar
    await expect(page.getByRole('link', { name: /Segurança da conta/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Encerrar sessão/i })).toBeVisible();
  });

  test('WEB-008: Password Recovery flow renders email prompt and simulated confirmation (Figma 845:316)', async ({
    page,
  }) => {
    await page.goto('/recuperar-senha');

    // Heading
    await expect(page.getByRole('heading', { name: 'Recuperar acesso' })).toBeVisible();

    const emailInput = page.locator('#recovery-email');
    await expect(emailInput).toBeVisible();

    // Validate empty email submit
    const submitBtn = page.getByRole('button', { name: 'Continuar (simulação)' });
    await emailInput.fill('');
    await submitBtn.click();
    await expect(page.getByText('Por favor, informe um endereço de e-mail válido.')).toBeVisible();

    // Submit valid email
    await emailInput.fill('usuario@exemplo.com');
    await submitBtn.click();

    // Confirmation screen
    await expect(
      page.getByRole('heading', { name: 'Instruções enviadas com sucesso!' }),
    ).toBeVisible();
    await expect(page.getByText('usuario@exemplo.com')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Voltar ao login' })).toBeVisible();
  });

  test('Phase-03B: Password change validates inputs and displays confirmation with session (Figma 1212:524 / 1212:619)', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: 'fdc_web_session',
        value: 'demo_buyer_session',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/conta/senha');

    await expect(page.getByRole('heading', { name: 'Alterar senha' })).toBeVisible();

    const currentPwd = page.locator('#pwd-current');
    const newPwd = page.locator('#pwd-new');
    const confirmPwd = page.locator('#pwd-confirm');

    await expect(currentPwd).toBeVisible();
    await expect(newPwd).toBeVisible();
    await expect(confirmPwd).toBeVisible();

    // Mismatched passwords
    await currentPwd.fill('atual123456');
    await newPwd.fill('novaSenha123');
    await confirmPwd.fill('outraSenha123');

    const submitBtn = page.getByRole('button', { name: 'Salvar nova senha' });
    await submitBtn.click();
    await expect(
      page.getByText('A confirmação de senha não coincide com a nova senha.'),
    ).toBeVisible();

    // Valid change
    await confirmPwd.fill('novaSenha123');
    await submitBtn.click();

    // Confirmation screen (Figma 1212:619)
    await expect(page.getByRole('heading', { name: 'Senha atualizada com sucesso' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Voltar à minha conta' })).toBeVisible();
  });

  test('Phase-03B: LGPD Account Deletion enforces explicit consent and issues DEMO protocol with session (Figma 1212:690 / 1212:769)', async ({
    page,
    context,
  }) => {
    await context.addCookies([
      {
        name: 'fdc_web_session',
        value: 'demo_buyer_session',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/conta/exclusao');

    await expect(page.getByRole('heading', { name: 'Confirmar solicitação' })).toBeVisible();
    await expect(page.getByText(/Lei Geral de Proteção de Dados \(LGPD\)/i)).toBeVisible();

    const submitBtn = page.getByRole('button', { name: 'Enviar solicitação de exclusão' });

    // Select reason
    await page.locator('#deletion-reason').selectOption('nao_utilizo');

    // Click without confirming checkbox
    await submitBtn.click();
    await expect(
      page.getByText(
        'Você deve marcar a caixa de confirmação de ciência sobre o procedimento de exclusão.',
      ),
    ).toBeVisible();

    // Check confirmation checkbox
    await page.locator('input[type="checkbox"]').check();

    // Submit
    await submitBtn.click();

    // Confirmation screen (Figma 1212:769)
    await expect(page.getByRole('heading', { name: 'Pedido recebido' })).toBeVisible();
    await expect(page.getByText('DEMO PROTOCOL')).toBeVisible();
    await expect(page.getByText('Protocolo LGPD de exclusão')).toBeVisible();
    await expect(page.getByText(/^EXC-2026-\d{5}$/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Voltar à minha conta' })).toBeVisible();
  });
});

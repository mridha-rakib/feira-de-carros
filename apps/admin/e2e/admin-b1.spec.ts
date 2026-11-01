import { expect, test } from '@playwright/test';

test.describe('Admin B1 — Authentication & Security (ADM-D-001 & ADM-M-013)', () => {
  test('redirects unauthenticated visitor to login with redirect param', async ({ page }) => {
    // Clear cookies to ensure clean unauthenticated state
    await page.context().clearCookies();
    await page.goto('/');

    await page.waitForURL(/\/login\?redirect=%2F/);
    await expect(page).toHaveURL(/.*\/login\?redirect=%2F/);
    await expect(page.getByText('Acesso Administrativo')).toBeVisible();
    await expect(page.getByLabel(/E-mail Institucional/i)).toBeVisible();
    await expect(page.getByLabel(/Senha de Acesso/i)).toBeVisible();
  });

  test('validates required fields on empty submit', async ({ page }) => {
    await page.goto('/login');
    // Clear pre-filled values
    await page.getByLabel(/E-mail Institucional/i).fill('');
    await page.getByLabel(/Senha de Acesso/i).fill('');
    await page.getByRole('button', { name: 'Entrar no Painel' }).click();

    await expect(page.getByText('O e-mail institucional é obrigatório')).toBeVisible();
    await expect(page.getByText('A senha é obrigatória')).toBeVisible();
  });

  test('displays 401 alert banner on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/E-mail Institucional/i).fill('admin@feiradecarros.com.br');
    await page.getByLabel(/Senha de Acesso/i).fill('wrong-password');
    await page.getByRole('button', { name: 'Entrar no Painel' }).click();

    await expect(page.getByText(/Credenciais inválidas/i)).toBeVisible();
  });

  test('displays 403 alert banner on unauthorized role', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/E-mail Institucional/i).fill('denied@feiradecarros.com.br');
    await page.getByLabel(/Senha de Acesso/i).fill('staff123');
    await page.getByRole('button', { name: 'Entrar no Painel' }).click();

    await expect(page.getByText(/Acesso negado/i)).toBeVisible();
  });

  test('authenticates valid credentials and redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/E-mail Institucional/i).fill('admin@feiradecarros.com.br');
    await page.getByLabel(/Senha de Acesso/i).fill('admin123');
    await page.getByRole('button', { name: 'Entrar no Painel' }).click();

    await page.waitForURL((url) => url.pathname === '/');
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText('Painel Administrativo — ADM-D-002')).toBeVisible();
  });
});

test.describe('Admin B1 — Desktop Dashboard Parity (ADM-D-002)', () => {
  test.beforeEach(async ({ context, page }) => {
    // Authenticate by setting session cookie
    await context.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/');
  });

  test('displays desktop sidebar with navigation and role badge', async ({ page }) => {
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByText('Painel')).toBeVisible();
    await expect(sidebar.getByText('Vendedores & Lojas')).toBeVisible();
    await expect(sidebar.getByText('Anúncios')).toBeVisible();
    await expect(sidebar.getByText('Usuários')).toBeVisible();
    await expect(sidebar.getByText('Financeiro')).toBeVisible();
    await expect(sidebar.getByText('Alertas')).toBeVisible();
    await expect(sidebar.getByText('Configurações')).toBeVisible();
    await expect(sidebar.getByText('main_admin')).toBeVisible();
  });

  test('displays topbar with title and simulated data badge', async ({ page }) => {
    await expect(page.getByText('Painel Administrativo — ADM-D-002')).toBeVisible();
    await expect(page.getByText('SIMULATED_MOCK_DATA')).toBeVisible();
  });

  test('renders all four summary cards', async ({ page }) => {
    // Card 1: Total de Usuários
    await expect(page.getByText('Total de Usuários')).toBeVisible();
    await expect(page.getByText('1.248')).toBeVisible();

    // Card 2: Anúncios Ativos (target paragraph in summary card)
    await expect(page.locator('p').filter({ hasText: /^Anúncios Ativos$/ })).toBeVisible();
    await expect(page.getByText('342')).toBeVisible();

    // Card 3: Receita Estimada (Mês) [Simulado]
    await expect(page.getByText('Receita Estimada (Mês)')).toBeVisible();
    await expect(page.getByRole('heading', { name: /48\.750/ })).toBeVisible();
    await expect(page.getByText('SIMULADO').first()).toBeVisible();

    // Card 4: Pendentes de Moderação
    await expect(page.getByText('Pendentes de Moderação')).toBeVisible();
    await expect(page.getByRole('heading', { name: '28' })).toBeVisible();
  });

  test('renders revenue chart with filter ranges and summary metrics', async ({ page }) => {
    await expect(page.getByText('Evolução de Receita & Anúncios')).toBeVisible();
    await expect(page.getByRole('button', { name: '30 Dias' })).toBeVisible();
    await expect(page.getByRole('button', { name: '90 Dias' })).toBeVisible();
    await expect(page.getByRole('button', { name: '12 Meses' })).toBeVisible();
    await expect(
      page.locator('svg[aria-label="Gráfico de evolução de receita e anúncios"]'),
    ).toBeVisible();

    // Summary metrics footer
    await expect(page.getByText('Receita Acumulada')).toBeVisible();
    await expect(page.getByText('R$ 253.450')).toBeVisible();
    await expect(page.getByText('Ticket Médio')).toBeVisible();
    await expect(page.getByText('R$ 149,00')).toBeVisible();
  });

  test('renders "Requer Atenção" panel with critical operational alerts', async ({ page }) => {
    await expect(page.getByText('Requer Atenção')).toBeVisible();
    await expect(page.getByText('Verificação Cadastral de Concessionária')).toBeVisible();
    await expect(page.getByText('Denúncia de Anúncio Suspeito (Possível Fraude)')).toBeVisible();
    await expect(page.getByText('Solicitação de Reembolso Dentro do Prazo Legal')).toBeVisible();
  });

  test('renders recent listings table with vehicles and filters', async ({ page }) => {
    await expect(page.getByText('Últimos Anúncios Cadastrados')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Todos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Particulares' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Lojas' })).toBeVisible();

    // Recent vehicle rows inside desktop table
    const table = page.getByRole('table');
    await expect(table.getByText('Toyota Corolla 2.0 XEi Flex Automático')).toBeVisible();
    await expect(table.getByText('Jeep Compass Longitude 1.3 T270 Turbo')).toBeVisible();
    await expect(table.getByText('BYD Dolphin Plus 60.48 kWh Elétrico')).toBeVisible();
  });
});

test.describe('Admin B1 — Mobile Dashboard & Navigation (ADM-M-001)', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('renders mobile bottom navigation strictly with Figma labels and ordering', async ({
    page,
  }) => {
    const bottomNav = page.locator('nav[aria-label="Navegação móvel principal"]');
    await expect(bottomNav).toBeVisible();

    const navButtons = bottomNav.locator('button');
    await expect(navButtons).toHaveCount(4);

    // Exact Figma labels and ordering: Painel / Vendedores / Anúncios / Alertas
    await expect(navButtons.nth(0)).toContainText('Painel');
    await expect(navButtons.nth(1)).toContainText('Vendedores');
    await expect(navButtons.nth(2)).toContainText('Anúncios');
    await expect(navButtons.nth(3)).toContainText('Alertas');
  });

  test('displays SRS ADM-020 desktop-only cash notice on mobile', async ({ page }) => {
    await expect(page.getByText('Política de Operação Mobile')).toBeVisible();
    await expect(page.getByText(/SRS ADM-020/)).toBeVisible();
  });

  test('renders summary cards in mobile 2x2 grid', async ({ page }) => {
    await expect(page.getByText('Total de Usuários')).toBeVisible();
    await expect(page.locator('p').filter({ hasText: /^Anúncios Ativos$/ })).toBeVisible();
    await expect(page.getByText('Receita Estimada (Mês)')).toBeVisible();
    await expect(page.getByText('Pendentes de Moderação')).toBeVisible();
  });
});

test.describe('Admin B1 — Error States & Security Safeguards', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);
  });

  test('empty scenario displays clean zero-state presentations', async ({ page }) => {
    await page.goto('/?qa=1');
    await page.getByRole('button', { name: 'Vazio (0 dados)' }).click();

    await expect(page.getByText('Nenhum Anúncio Cadastrado')).toBeVisible();
    await expect(page.getByText('Tudo em dia!')).toBeVisible();
  });

  test('500 server error displays retry button', async ({ page }) => {
    await page.goto('/?qa=1');
    await page.getByRole('button', { name: 'Erro (500)' }).click();

    await expect(page.getByText('Falha ao Carregar Métricas')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tentar Novamente' })).toBeVisible();
  });

  test('403 forbidden state does NOT allow self-elevation', async ({ page }) => {
    await page.goto('/?qa=1');
    await page.getByRole('button', { name: 'Negado (403)' }).click();

    await expect(page.getByText('Acesso Restrito ao Painel (403)')).toBeVisible();
    // Verify that NO self-elevation button exists
    const elevateButton = page.getByRole('button', { name: 'Restaurar Permissão Admin' });
    await expect(elevateButton).not.toBeVisible();

    // Verify authorized exit actions
    await expect(
      page.locator('main').getByRole('button', { name: 'Encerrar Sessão' }),
    ).toBeVisible();
  });
});

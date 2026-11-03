import { expect, test } from '@playwright/test';

test.describe('Admin B1 — Authentication & Security (ADM-D-001 & ADM-M-013)', () => {
  test('redirects unauthenticated visitor to login with safe redirect param', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/');

    await page.waitForURL(/\/login\?redirect=%2F/);
    await expect(page).toHaveURL(/.*\/login\?redirect=%2F/);
    await expect(page.locator('form')).toBeVisible();
    await expect(page.getByLabel(/E-mail corporativo/i)).toBeVisible();
    await expect(page.getByLabel(/^Senha$/i)).toBeVisible();
  });

  test('validates required fields on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/E-mail corporativo/i).fill('');
    await page.getByLabel(/^Senha$/i).fill('');
    await page.getByRole('button', { name: /Entrar no painel/i }).click();

    await expect(page.getByText('O e-mail institucional é obrigatório')).toBeVisible();
    await expect(page.getByText('A senha é obrigatória')).toBeVisible();
  });

  test('displays 401 alert banner on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/E-mail corporativo/i).fill('admin@feiradecarros.com.br');
    await page.getByLabel(/^Senha$/i).fill('wrong-password');
    await page.getByRole('button', { name: /Entrar no painel/i }).click();

    await expect(
      page.locator('div[role="alert"]').getByText('Credenciais inválidas', { exact: true }),
    ).toBeVisible();
  });

  test('displays 403 alert banner on unauthorized role', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/E-mail corporativo/i).fill('denied@feiradecarros.com.br');
    await page.getByLabel(/^Senha$/i).fill('staff123');
    await page.getByRole('button', { name: /Entrar no painel/i }).click();

    await expect(
      page.locator('div[role="alert"]').getByText('Acesso não autorizado', { exact: true }),
    ).toBeVisible();
  });

  test('authenticates valid credentials and redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/E-mail corporativo/i).fill('admin@feiradecarros.com.br');
    await page.getByLabel(/^Senha$/i).fill('admin123');
    await page.getByRole('button', { name: /Entrar no painel/i }).click();

    await page.waitForURL((url) => url.pathname === '/', { timeout: 15000 });
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: 'Visão geral' }).first()).toBeVisible();
  });
});

test.describe('Admin B1 — Desktop Dashboard Parity (ADM-D-002)', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop only test suite');

  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.goto('/');
  });

  test('displays desktop sidebar with exact Figma navigation and role badge', async ({ page }) => {
    const sidebar = page.locator('aside[aria-label="Navegação administrativa desktop"]');
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Painel geral' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Usuários' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Aprovação de vendedores' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Anúncios' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Pagamentos' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Mensagens e denúncias' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Configurações' })).toBeVisible();
    await expect(sidebar.getByText('Acesso • Main Admin')).toBeVisible();
    await expect(sidebar.getByText('Painel administrativo • v0.1')).toBeVisible();
  });

  test('displays topbar with breadcrumb, locality pill, and admin user', async ({ page }) => {
    const desktop = page.getByTestId('desktop-dashboard');
    await expect(desktop.getByText('Visão geral').first()).toBeVisible();
    await expect(desktop.getByText('Ipatinga - MG').first()).toBeVisible();
    await expect(desktop.getByText('Admin principal').first()).toBeVisible();
  });

  test('renders all four exact Figma summary cards', async ({ page }) => {
    const desktop = page.getByTestId('desktop-dashboard');
    const cards = desktop.getByTestId('summary-cards');
    await expect(cards.getByText('Anúncios ativos')).toBeVisible();
    await expect(cards.getByText('1.248')).toBeVisible();
    await expect(cards.getByText('+5,4% este mês')).toBeVisible();

    await expect(cards.getByText('Vendedores aprovados')).toBeVisible();
    await expect(cards.getByText('682')).toBeVisible();
    await expect(cards.getByText('+25 nos últimos 30 dias')).toBeVisible();

    await expect(cards.getByText('Aguardando aprovação')).toBeVisible();
    await expect(cards.getByText('36')).toBeVisible();
    await expect(cards.getByText('18 vendedores • 18 anúncios')).toBeVisible();

    await expect(cards.getByText('Receita confirmada')).toBeVisible();
    await expect(cards.getByText('R$ 42.580')).toBeVisible();
    await expect(cards.getByText('+12,8% vs. mês anterior')).toBeVisible();
  });

  test('renders revenue chart with period selector and 5 monthly bars', async ({ page }) => {
    const desktop = page.getByTestId('desktop-dashboard');
    await expect(desktop.getByText('Receita dos anúncios')).toBeVisible();
    await expect(desktop.getByText('Últimos 6 meses')).toBeVisible();
    await expect(desktop.getByText('Mai', { exact: true })).toBeVisible();
    await expect(desktop.getByText('Jun', { exact: true })).toBeVisible();
    await expect(desktop.getByText('Jul', { exact: true })).toBeVisible();
    await expect(desktop.getByText('Ago', { exact: true })).toBeVisible();
    await expect(desktop.getByText('Set', { exact: true })).toBeVisible();
  });

  test('renders "Requer atenção" panel with 3 operational counts', async ({ page }) => {
    const desktop = page.getByTestId('desktop-dashboard');
    await expect(desktop.getByText('Requer atenção')).toBeVisible();
    await expect(desktop.getByText('Solicitações de vendedores')).toBeVisible();
    await expect(desktop.getByText('Anúncios para revisar')).toBeVisible();
    await expect(desktop.getByText('Pagamentos pendentes')).toBeVisible();
  });

  test('renders recent listings table with vehicles and status badges', async ({ page }) => {
    const desktop = page.getByTestId('desktop-dashboard');
    await expect(desktop.getByText('Anúncios recentes')).toBeVisible();
    await expect(desktop.getByText('Ver todos os anúncios')).toBeVisible();

    await expect(desktop.getByText('FC-2026-0142 • Fiat Strada 2023')).toBeVisible();
    await expect(desktop.getByText('FC-2026-0148 • Chevrolet Onix 2022')).toBeVisible();
    await expect(desktop.getByText('FC-2026-0151 • VW Polo Track 2023')).toBeVisible();
    await expect(desktop.getByText('FC-2026-0153 • Honda CG 160 2022')).toBeVisible();

    await expect(desktop.getByText('Mariana Costa')).toBeVisible();
    await expect(desktop.getByText('Bruno Almeida')).toBeVisible();
    await expect(desktop.getByText('Vale Auto Veículos')).toBeVisible();
    await expect(desktop.getByText('Rafael Santos')).toBeVisible();
  });
});

test.describe('Admin B1 — Mobile Dashboard & Navigation (ADM-M-001)', () => {
  test.skip(({ isMobile }) => !isMobile, 'Mobile only test suite');

  test.beforeEach(async ({ context, page }) => {
    await context.addCookies([
      {
        name: 'fdc_admin_session',
        value: 'mock_admin_token_active',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.goto('/');
  });

  test('renders mobile bottom navigation strictly with Figma labels and ordering', async ({
    page,
  }) => {
    const bottomNav = page.locator('nav[aria-label="Navegação móvel principal"]');
    await expect(bottomNav).toBeVisible();

    const navLinks = bottomNav.locator('a');
    await expect(navLinks).toHaveCount(4);

    await expect(navLinks.nth(0)).toContainText('Painel');
    await expect(navLinks.nth(1)).toContainText('Vendedores');
    await expect(navLinks.nth(2)).toContainText('Anúncios');
    await expect(navLinks.nth(3)).toContainText('Alertas');
  });

  test('displays SRS ADM-020 desktop-only cash notice on mobile', async ({ page }) => {
    const mobile = page.getByTestId('mobile-dashboard');
    await expect(mobile.getByText('Escopo / Admin Mobile')).toBeVisible();
    await expect(
      mobile.getByText(
        'Sem confirmação de caixa, alteração de permissões ou decisões de anúncios a partir do telefone.',
      ),
    ).toBeVisible();
  });

  test('renders summary cards in mobile 2x2 grid', async ({ page }) => {
    const mobile = page.getByTestId('mobile-dashboard');
    const cards = mobile.getByTestId('summary-cards');
    await expect(cards.getByText('Anúncios ativos')).toBeVisible();
    await expect(cards.getByText('1.248')).toBeVisible();
    await expect(cards.getByText('Vendedores')).toBeVisible();
    await expect(cards.getByText('682')).toBeVisible();
    await expect(cards.getByText('Para analisar')).toBeVisible();
    await expect(cards.getByText('36')).toBeVisible();
    await expect(cards.getByText('Receita')).toBeVisible();
    await expect(cards.getByText('R$ 42.580')).toBeVisible();
  });

  test('renders authorized mobile quick access items', async ({ page }) => {
    const mobile = page.getByTestId('mobile-dashboard');
    await expect(mobile.getByText('Acesso rápido - áreas autorizadas')).toBeVisible();
    await expect(mobile.getByText('Consultas', { exact: true })).toBeVisible();
    await expect(mobile.getByText('Clientes', { exact: true })).toBeVisible();
    await expect(mobile.getByText('Pagamentos', { exact: true })).toBeVisible();
    await expect(mobile.getByText('Equipe', { exact: true })).toBeVisible();
    await expect(mobile.getByText('Configurações', { exact: true })).toBeVisible();
    await expect(mobile.getByText('Meu perfil', { exact: true })).toBeVisible();
  });
});

test.describe('Admin B1 — Error States & Security Safeguards', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop only test suite');

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

  test('empty scenario displays zero metrics', async ({ page }) => {
    await page.goto('/?scenario=empty');

    const desktop = page.getByTestId('desktop-dashboard');
    await expect(desktop.getByText('R$ 0')).toBeVisible();
  });

  test('500 server error displays retry button', async ({ page }) => {
    await page.goto('/?scenario=error_500');

    await expect(page.getByText('Falha ao Carregar Métricas (500)')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Tentar Novamente' })).toBeVisible();
  });

  test('403 forbidden state renders access denied screen', async ({ page }) => {
    await page.goto('/?scenario=forbidden_403');

    const alert = page.getByRole('alert');
    await expect(alert.getByText('Acesso Restrito ao Painel (403)')).toBeVisible();
    await expect(alert.getByRole('button', { name: 'Encerrar Sessão' })).toBeVisible();
  });

  test('qa testing harness is never rendered in dashboard ui', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/QA Testing Harness/i)).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Sucesso (Figma)' })).not.toBeVisible();
  });
});

import { expect, test } from '@playwright/test';

test.describe('Role-Based Navigation & Screen Accessibility Suite', () => {
  test.beforeEach(async ({ context }) => {
    // Clear cookies and storage before each test
    await context.clearCookies();
  });

  test('Guest visitor: unauthenticated state and fail-closed route guards', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/');

    if (isMobile) {
      // On mobile, the hamburger menu button exists and opens the drawer with navigation links
      const menuBtn = page.getByRole('button', { name: /Abrir menu de navegação/i });
      await expect(menuBtn).toBeVisible();
      await menuBtn.click();

      // Drawer has "Entrar ou cadastrar" link
      await expect(page.getByRole('link', { name: /Entrar ou cadastrar/i })).toBeVisible();

      // Drawer has "Anunciar meu veículo" pointing to /vendedor/solicitacao
      const ctaLink = page.getByRole('link', { name: /Anunciar meu veículo/i });
      await expect(ctaLink).toHaveAttribute('href', '/vendedor/solicitacao');
    } else {
      // Header has "Entrar" link
      const entrarLink = page
        .getByRole('link', { name: /Fazer login ou cadastrar|Entrar/i })
        .first();
      await expect(entrarLink).toBeVisible();

      // Locality strip links to /vendedor/solicitacao
      const topAreaLink = page
        .locator('header')
        .getByRole('link', { name: 'Área do Vendedor' })
        .first();
      await expect(topAreaLink).toHaveAttribute('href', '/vendedor/solicitacao');

      // CTA "+ Anunciar veículo" points to seller application for guests
      const ctaLink = page.getByRole('link', { name: /Anunciar veículo/i }).first();
      await expect(ctaLink).toHaveAttribute('href', '/vendedor/solicitacao');
    }

    // Direct access to protected routes redirects to /entrar with safe return redirect
    await page.goto('/conta');
    await expect(page).toHaveURL(/\/entrar\?redirect=%2Fconta/);

    await page.goto('/vendedor/anuncios');
    await expect(page).toHaveURL(/\/entrar\?redirect=%2Fvendedor%2Fanuncios/);

    await page.goto('/concessionaria/anuncios');
    await expect(page).toHaveURL(/\/entrar\?redirect=%2Fconcessionaria%2Fanuncios/);
  });

  test('Buyer Journey: login, role badge, header identity, navigation & clean logout', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/entrar');

    // Fill Buyer fixture credentials
    await page.fill('#buyer-login-email', 'comprador@exemplo.com.br');
    await page.fill('#buyer-login-password', '123456');
    await page.getByRole('button', { name: /Entrar \(simulação\)/i }).click();

    // Verify redirected to Buyer dashboard
    await expect(page).toHaveURL('/conta');

    if (isMobile) {
      await page.goto('/');
      const menuBtn = page.getByRole('button', { name: /Abrir menu de navegação/i });
      await menuBtn.click();
      await expect(page.getByText('Carlos Eduardo Mendes')).toBeVisible();
      await expect(page.getByText('Comprador', { exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Minha conta' })).toBeVisible();
      await expect(page.getByRole('link', { name: /Favoritos/i }).last()).toBeVisible();
    } else {
      // Verify MarketplaceHeader displays Buyer identity and NOT Seller or Dealer
      const accountButton = page.getByRole('button', { name: /Abrir menu da conta/i });
      await expect(accountButton).toBeVisible();
      await expect(accountButton).toContainText(/Carlos/i);
      await expect(accountButton).not.toContainText(/Líder/i);
      await expect(accountButton).not.toContainText(/Marcos/i);

      // Open Account dropdown
      await accountButton.click();
      const dropdown = page.getByRole('menu', { name: /Opções da conta/i });
      await expect(dropdown).toBeVisible();

      // Persona Card in dropdown
      await expect(dropdown.getByText('Carlos Eduardo Mendes')).toBeVisible();
      await expect(dropdown.getByText('comprador@exemplo.com.br')).toBeVisible();
      await expect(dropdown.getByText('Comprador', { exact: true })).toBeVisible();

      // Verify role-appropriate links exist in dropdown
      await expect(dropdown.getByRole('menuitem', { name: /Meu perfil e conta/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Meus favoritos/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Buscas salvas/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Alertas de veículos/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Mensagens/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Notificações/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Segurança da conta/i })).toBeVisible();
    }

    // Verify Buyer CANNOT access Seller or Dealer protected areas
    await page.goto('/vendedor/anuncios');
    await expect(page).toHaveURL(/\/entrar\?error=unauthorized_seller_role_required/);

    await page.goto('/concessionaria/anuncios');
    await expect(page).toHaveURL(/\/entrar\?error=unauthorized_dealer_role_required/);

    // Revisit /conta and execute Logout
    if (isMobile) {
      await page.goto('/');
      await page.getByRole('button', { name: /Abrir menu de navegação/i }).click();
      const logoutBtn = page.getByRole('button', { name: /Encerrar sessão/i });
      await expect(logoutBtn).toBeVisible();
      await logoutBtn.click();
    } else {
      await page.goto('/conta');
      const accountButton = page.getByRole('button', { name: /Abrir menu da conta/i });
      await accountButton.click();
      const dropdown = page.getByRole('menu', { name: /Opções da conta/i });
      const logoutBtn = dropdown.getByRole('menuitem', { name: /Encerrar sessão/i });
      await expect(logoutBtn).toBeVisible();
      await logoutBtn.click();
    }

    // Post-logout verification
    await expect(page).toHaveURL('/entrar');
    await page.goto('/');
    if (isMobile) {
      await page.getByRole('button', { name: /Abrir menu de navegação/i }).click();
      await expect(
        page.getByRole('link', { name: /Fazer login ou cadastrar|Entrar/i }).first(),
      ).toBeVisible();
    } else {
      await expect(
        page.getByRole('link', { name: /Fazer login ou cadastrar|Entrar/i }).first(),
      ).toBeVisible();
    }
  });

  test('Seller Journey: login, role badge, header identity, navigation & cross-role protection', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/entrar');

    // Fill Individual Seller fixture credentials
    await page.fill('#buyer-login-email', 'vendedor@exemplo.com.br');
    await page.fill('#buyer-login-password', '123456');
    await page.getByRole('button', { name: /Entrar \(simulação\)/i }).click();

    // Verify redirected to Seller listings dashboard
    await expect(page).toHaveURL('/vendedor/anuncios');

    if (!isMobile) {
      // Verify SellerNavbar renders active seller badge & name
      await expect(page.getByText('Vendedor ativo').first()).toBeVisible();

      // Visit home page to inspect MarketplaceHeader with Seller session
      await page.goto('/');

      const accountButton = page.getByRole('button', { name: /Abrir menu da conta/i });
      await expect(accountButton).toBeVisible();

      // CRITICAL REQUIREMENT: Header must NEVER display Buyer identity for Seller!
      await expect(accountButton).not.toContainText(/Carlos/i);
      await expect(accountButton).not.toContainText(/João/i);
      await expect(accountButton).toContainText(/Marcos/i);

      // Header CTA points to seller ad creation
      const ctaButton = page.getByRole('link', { name: /Anunciar veículo/i }).first();
      await expect(ctaButton).toHaveAttribute('href', '/vendedor/anuncios/novo');

      // Locality strip points to seller dashboard
      const topAreaLink = page
        .locator('header')
        .getByRole('link', { name: 'Área do Vendedor' })
        .first();
      await expect(topAreaLink).toHaveAttribute('href', '/vendedor/anuncios');

      // Open Account dropdown
      await accountButton.click();
      const dropdown = page.getByRole('menu', { name: /Opções da conta/i });
      await expect(dropdown).toBeVisible();

      // Persona Card
      await expect(dropdown.getByText('Marcos Vinícius Silva')).toBeVisible();
      await expect(dropdown.getByText('vendedor@exemplo.com.br')).toBeVisible();
      await expect(dropdown.getByText('Vendedor Particular', { exact: true })).toBeVisible();

      // Verify role-appropriate links
      await expect(dropdown.getByRole('menuitem', { name: /Meus anúncios/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Criar novo anúncio/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Mensagens/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Pagamentos/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Minha conta/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Status do cadastro/i })).toBeVisible();
    } else {
      await page.goto('/');
      await page.getByRole('button', { name: /Abrir menu de navegação/i }).click();
      await expect(page.getByText('Marcos Vinícius Silva')).toBeVisible();
      await expect(page.getByText('Vendedor Particular', { exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Meus anúncios' })).toBeVisible();
    }

    // Navigate to /vendedor/conta and verify settings link
    await page.goto('/vendedor/conta');

    // Click settings link -> /vendedor/configuracoes
    await page.getByRole('link', { name: /Acessar configurações/i }).click();
    await expect(page).toHaveURL('/vendedor/configuracoes');
    await expect(page.getByRole('heading', { name: /Configurações da Conta/i })).toBeVisible();

    // Cross-role protection: Seller CANNOT access Buyer /conta or Dealer /concessionaria/anuncios
    await page.goto('/concessionaria/anuncios');
    await expect(page).toHaveURL(/\/entrar\?error=unauthorized_dealer_role_required/);

    await page.goto('/conta');
    await expect(page).toHaveURL(/\/entrar\?error=unauthorized_buyer_role_required/);

    // Logout
    if (isMobile) {
      await page.goto('/');
      await page.getByRole('button', { name: /Abrir menu de navegação/i }).click();
      const logoutBtn = page.getByRole('button', { name: /Encerrar sessão/i });
      await expect(logoutBtn).toBeVisible();
      await logoutBtn.click();
    } else {
      await page.goto('/vendedor/anuncios');
      const sellerMenuBtn = page.getByRole('button', { name: /Menu do vendedor/i });
      await sellerMenuBtn.click();
      await page.getByRole('menuitem', { name: /Encerrar sessão/i }).click();
    }

    await expect(page).toHaveURL('/entrar');
  });

  test('Dealer Journey: login, role badge, header identity, navigation & cross-role protection', async ({
    page,
    isMobile,
  }) => {
    await page.goto('/entrar');

    // Fill Dealership fixture credentials
    await page.fill('#buyer-login-email', 'contato@liderveiculos.com.br');
    await page.fill('#buyer-login-password', '123456');
    await page.getByRole('button', { name: /Entrar \(simulação\)/i }).click();

    // Verify redirected to Dealership inventory dashboard
    await expect(page).toHaveURL('/concessionaria/anuncios');

    if (!isMobile) {
      // Header on /concessionaria/anuncios must show Dealer identity
      const accountButton = page.getByRole('button', { name: /Abrir menu da conta/i });
      await expect(accountButton).toBeVisible();

      // CRITICAL REQUIREMENT: Dealer must NEVER display Buyer identity!
      await expect(accountButton).not.toContainText(/Carlos/i);
      await expect(accountButton).not.toContainText(/João/i);
      await expect(accountButton).not.toContainText(/Marcos/i);
      await expect(accountButton).toContainText(/Líder/i);

      // Header CTA points to dealer ad creation
      const ctaButton = page.getByRole('link', { name: /Anunciar veículo/i }).first();
      await expect(ctaButton).toHaveAttribute('href', '/concessionaria/anuncios/novo');

      // Locality strip points to dealership dashboard
      const topAreaLink = page
        .locator('header')
        .getByRole('link', { name: 'Painel da Loja' })
        .first();
      await expect(topAreaLink).toHaveAttribute('href', '/concessionaria/anuncios');

      // Open Account dropdown
      await accountButton.click();
      const dropdown = page.getByRole('menu', { name: /Opções da conta/i });
      await expect(dropdown).toBeVisible();

      // Persona Card in dropdown
      await expect(dropdown.getByText('Líder Seminovos')).toBeVisible();
      await expect(dropdown.getByText('contato@liderveiculos.com.br')).toBeVisible();
      await expect(dropdown.getByText('Concessionária', { exact: true })).toBeVisible();

      // Verify role-appropriate links
      await expect(dropdown.getByRole('menuitem', { name: /Estoque da frota/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Adicionar veículo/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Perfil da loja/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Mensagens/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Ver showroom público/i })).toBeVisible();
      await expect(dropdown.getByRole('menuitem', { name: /Status da adesão/i })).toBeVisible();
    } else {
      await page.goto('/');
      await page.getByRole('button', { name: /Abrir menu de navegação/i }).click();
      await expect(page.getByText('Líder Seminovos')).toBeVisible();
      await expect(page.getByText('Concessionária', { exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Estoque da frota' })).toBeVisible();
    }

    // Navigate to public showroom
    await page.goto('/concessionarias/dealer-lider-seminovos');
    await expect(page.getByRole('heading', { name: /Líder Veículos/i })).toBeVisible();

    // Cross-role protection: Dealer CANNOT access Seller /vendedor/anuncios or Buyer /conta
    await page.goto('/vendedor/anuncios');
    await expect(page).toHaveURL(/\/entrar\?error=unauthorized_seller_role_required/);

    await page.goto('/conta');
    await expect(page).toHaveURL(/\/entrar\?error=unauthorized_buyer_role_required/);

    // Revisit and logout
    if (isMobile) {
      await page.goto('/');
      await page.getByRole('button', { name: /Abrir menu de navegação/i }).click();
      const logoutBtn = page.getByRole('button', { name: /Encerrar sessão/i });
      await expect(logoutBtn).toBeVisible();
      await logoutBtn.click();
    } else {
      await page.goto('/concessionaria/anuncios');
      const accountButton = page.getByRole('button', { name: /Abrir menu da conta/i });
      await accountButton.click();
      const dropdown = page.getByRole('menu', { name: /Opções da conta/i });
      await dropdown.getByRole('menuitem', { name: /Encerrar sessão/i }).click();
    }

    await expect(page).toHaveURL('/entrar');
  });

  test('Mobile Drawer Menu reflects active persona and role navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 });

    // Login as Seller
    await page.goto('/entrar');
    await page.fill('#buyer-login-email', 'vendedor@exemplo.com.br');
    await page.fill('#buyer-login-password', '123456');
    await page.getByRole('button', { name: /Entrar \(simulação\)/i }).click();
    await expect(page).toHaveURL('/vendedor/anuncios');

    // Go to home on mobile
    await page.goto('/');

    // Open mobile hamburger menu
    const menuBtn = page.getByRole('button', { name: /Abrir menu de navegação/i });
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();

    // Verify persona card in mobile drawer
    await expect(page.getByText('Marcos Vinícius Silva')).toBeVisible();
    await expect(page.getByText('Vendedor Particular', { exact: true })).toBeVisible();

    // Verify role-appropriate links in drawer
    await expect(page.getByRole('link', { name: 'Meus anúncios' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Criar anúncio' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Mensagens', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Pagamentos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Minha conta' })).toBeVisible();

    // Verify mobile logout button
    const mobileLogoutBtn = page.getByRole('button', { name: /Encerrar sessão/i });
    await expect(mobileLogoutBtn).toBeVisible();
    await mobileLogoutBtn.click();

    await expect(page).toHaveURL('/entrar');
  });
});

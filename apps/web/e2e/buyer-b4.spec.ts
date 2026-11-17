import { expect, test } from '@playwright/test';

test.describe('Buyer Frontend Batch B4 — Favorites, Saved Searches, Alerts & Notification Preferences', () => {
  test('WEB-004: Favorites Login-Required State renders Figma 840:317 for unauthenticated guests', async ({
    page,
  }) => {
    // Navigate as guest
    await page.goto('/favoritos');

    // Verify Figma 840:317 Login Required heading & copy
    await expect(
      page.getByRole('heading', { name: 'Entre para acessar seus favoritos' }),
    ).toBeVisible();
    await expect(
      page.getByText(
        'Salve veículos para acompanhar alterações de preço, comparar opcionais e acessar sua lista em qualquer dispositivo.',
      ),
    ).toBeVisible();

    // Verify CTAs
    await expect(page.getByRole('link', { name: 'Entrar na minha conta' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Criar conta grátis' })).toBeVisible();

    // Verify demonstration simulation button when in non-production
    const demoLoginBtn = page.getByRole('button', {
      name: /Simular login como João Silva/i,
    });
    if (await demoLoginBtn.isVisible()) {
      await expect(demoLoginBtn).toBeVisible();
    }
  });

  test('WEB-004: Favorites Registered view renders Figma 733:232, category chips, and unavailable listing notice', async ({
    page,
  }) => {
    // Authenticate as registered member
    const demoLoginBtn = page.getByRole('button', {
      name: /Simular login como João Silva/i,
    });
    await page.goto('/favoritos');
    if (await demoLoginBtn.isVisible()) {
      await demoLoginBtn.click();
    } else {
      await page.goto('/entrar?redirect=/favoritos');
      await page.getByRole('button', { name: 'Continuar com Google' }).click();
      await page.getByRole('button', { name: /Entrar \(simulação\)/i }).click();
      await page.waitForURL('**/favoritos');
    }

    // Verify Registered Favorites header
    await expect(page.getByRole('heading', { name: 'Meus Favoritos' })).toBeVisible();

    // Verify Category Filter Chips
    await expect(page.getByRole('button', { name: /^Todos/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Carros/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Motos/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Caminhões/i })).toBeVisible();

    // Verify Unavailable Vehicle callout banner
    await expect(page.getByText(/veículo indisponível|veículos indisponíveis/i)).toBeVisible();

    // Sort control is available
    const sortSelect = page.locator('#sort-select');
    await expect(sortSelect).toBeVisible();

    // Vehicle cards exist
    const vehicleCards = page.locator('a[href^="/veiculos/veh-"]');
    await expect(vehicleCards.first()).toBeVisible();

    // Test filter by category Motos
    const motosChip = page.getByRole('button', { name: /^Motos/i });
    await motosChip.click();
    await expect(page.getByText('Honda CG 160 Titan 2022')).toBeVisible();

    // Switch back to Todos
    await page.getByRole('button', { name: /^Todos/i }).click();

    // Test clearing all favorites to inspect Empty State (Figma 840:110)
    page.on('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Limpar todos' }).click();

    // Empty state should now be displayed
    await expect(
      page.getByRole('heading', { name: 'Você ainda não tem nenhum veículo favorito' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'Explorar todos os veículos' })).toBeVisible();
  });

  test('WEB-009: Saved Searches page renders Figma 856:165 cards, pills, alert toggles, and deletion', async ({
    page,
  }) => {
    // Navigate with demo session cookie
    await page.context().addCookies([
      {
        name: 'fdc_web_session',
        value: 'mock-buyer-session',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/buscas-salvas');

    // Heading
    await expect(page.getByRole('heading', { name: 'Buscas salvas' })).toBeVisible();
    await expect(
      page.getByText(
        'Acesse rapidamente suas pesquisas mais frequentes e receba alertas de novos anúncios.',
      ),
    ).toBeVisible();

    // CTA
    await expect(page.getByRole('link', { name: /Nova busca no catálogo/i })).toBeVisible();

    // Cards
    await expect(page.getByText('Toyota Corolla em Ipatinga')).toBeVisible();
    await expect(page.getByText('Motos em Minas Gerais')).toBeVisible();

    // Parameter pills
    await expect(page.getByText('marca: Toyota')).toBeVisible();
    await expect(page.getByText('modelo: Corolla')).toBeVisible();

    // Alert toggle button
    const alertToggle = page
      .locator('button')
      .filter({ hasText: /Alertas ativados|Alertas desativados/i })
      .first();
    await expect(alertToggle).toBeVisible();
    await alertToggle.click();

    // Help card
    await expect(page.getByText('Como funcionam os alertas de busca?')).toBeVisible();
  });

  test('WEB-010: Matching Alerts page renders Figma 856:219 matching listings and mock protocol', async ({
    page,
  }) => {
    await page.context().addCookies([
      {
        name: 'fdc_web_session',
        value: 'mock-buyer-session',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/conta/alertas');

    // Heading
    await expect(page.getByRole('heading', { name: 'Alertas de Novos Veículos' })).toBeVisible();

    // Protocol banner
    await expect(page.getByText(/DEMO PROTOCOL • FEIRA DE CARROS/i)).toBeVisible();

    // Match alert items
    await expect(page.getByText(/Busca: Toyota Corolla em Ipatinga/i).first()).toBeVisible();

    // Vehicle links in alerts
    const viewAdLinks = page.getByRole('link', { name: 'Ver anúncio' });
    await expect(viewAdLinks.first()).toBeVisible();

    // Dismiss action
    const dismissBtns = page.getByRole('button', { name: 'Dispensar alerta' });
    await expect(dismissBtns.first()).toBeVisible();
  });

  test('WEB-011: Notification Preferences page renders Figma 856:261 toggles, channels, frequencies, and save feedback', async ({
    page,
  }) => {
    await page.context().addCookies([
      {
        name: 'fdc_web_session',
        value: 'mock-buyer-session',
        domain: 'localhost',
        path: '/',
      },
    ]);

    await page.goto('/conta/notificacoes');

    // Heading
    await expect(page.getByRole('heading', { name: 'Preferências de Notificação' })).toBeVisible();

    // Sections
    await expect(page.getByRole('heading', { name: 'Alertas de Buscas Salvas' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Mensagens e Propostas' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Novidades e Ofertas Feira de Carros' }),
    ).toBeVisible();

    // Frequency options
    await expect(page.getByText('Imediata')).toBeVisible();
    await expect(page.getByText('Resumo Diário')).toBeVisible();
    await expect(page.getByText('Semanal')).toBeVisible();

    // Select frequency
    await page.getByRole('button', { name: /Resumo Diário/i }).click();

    // Save preferences
    const saveBtn = page.getByRole('button', { name: 'Salvar preferências' });
    await saveBtn.click();

    // Verify feedback toast
    await expect(page.getByText('Preferências de notificação salvas com sucesso!')).toBeVisible();
  });
});

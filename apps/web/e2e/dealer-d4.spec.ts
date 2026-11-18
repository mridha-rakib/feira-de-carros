import { expect, test } from '@playwright/test';

test.describe('Dealership Frontend Batch D4 — Business Profile Editor & Public Showroom (WEB-022)', () => {
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

  // 1. Initial Load & Layout
  test('WEB-022: Business Profile Editor loads correctly with mock fixture, breadcrumbs, and live preview', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/perfil');

    // Breadcrumbs & Header
    await expect(page.getByText('Minha concessionária')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Perfil público da concessionária' }),
    ).toBeVisible();
    await expect(
      page.getByText('Edite as informações exibidas para os compradores.'),
    ).toBeVisible();

    // Section Headings
    await expect(page.getByRole('heading', { name: 'Identidade pública' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sobre a revenda' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Localização pública' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contato e privacidade' })).toBeVisible();

    // Default Fixture Values
    await expect(page.getByTestId('input-public-name')).toHaveValue('Líder Veículos Seminovos');
    await expect(page.getByTestId('input-city')).toHaveValue('Ipatinga');
    await expect(page.getByTestId('select-state')).toHaveValue('MG');
    await expect(page.getByTestId('input-address')).toHaveValue('Av. Castelo Branco, 1200');

    // Live Preview Card & Status Badge
    await expect(page.getByTestId('preview-dealership-name')).toHaveText(
      'Líder Veículos Seminovos',
    );
    await expect(page.getByTestId('preview-saved-badge')).toHaveText('Publicado');
    await expect(page.getByTestId('preview-location')).toContainText('Ipatinga, MG');
  });

  // 2. Field Editing & Live Preview Synchronization
  test('WEB-022: Editing public business name, location, and description updates live preview card and dirty badge', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/perfil');

    // Update business name
    const nameInput = page.getByTestId('input-public-name');
    await nameInput.fill('Auto Prime Seminovos Vale');

    // Assert live preview card reactively updates
    await expect(page.getByTestId('preview-dealership-name')).toHaveText(
      'Auto Prime Seminovos Vale',
    );
    await expect(page.getByTestId('preview-dirty-badge')).toHaveText('Rascunho não salvo');

    // Update city & state
    await page.getByTestId('input-city').fill('Coronel Fabriciano');
    await expect(page.getByTestId('preview-location')).toContainText('Coronel Fabriciano, MG');

    // Update description & check character counter
    const descTextarea = page.getByTestId('textarea-description');
    await descTextarea.fill('Revenda líder em picapes e SUVs com garantia estendida.');
    await expect(page.getByTestId('char-counter')).toContainText('/500');
    await expect(page.getByTestId('preview-description')).toHaveText(
      'Revenda líder em picapes e SUVs com garantia estendida.',
    );
  });

  // 3. Form Validation (Required City & State)
  test('WEB-022: Enforces required validation for city and state', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/perfil');

    // Clear city
    await page.getByTestId('input-city').fill('');
    await page.getByTestId('select-state').selectOption('');

    // Attempt save
    await page.getByTestId('btn-save-profile').click();

    // Assert validation errors are displayed
    await expect(page.getByText('A cidade é obrigatória.')).toBeVisible();
    await expect(page.getByText('O estado (UF) é obrigatório.')).toBeVisible();
  });

  // 4. Save Changes & Public Showroom Integration
  test('WEB-022: Saving changes updates the public showroom at /concessionarias/[id]', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/perfil');

    // Fill new profile name & city
    await page.getByTestId('input-public-name').fill('Líder Motors Premium 2026');
    await page.getByTestId('input-city').fill('Belo Horizonte');
    await page.getByTestId('select-state').selectOption('MG');

    // Save changes
    await page.getByTestId('btn-save-profile').click();

    // Assert success banner appears
    await expect(page.getByTestId('save-success-banner')).toBeVisible();
    await expect(page.getByTestId('preview-saved-badge')).toHaveText('Publicado');

    // Navigate to public showroom
    await page.goto('/concessionarias/dealer-lider-seminovos?preview=true');

    // Assert showroom header reflects the saved changes
    await expect(page.getByTestId('showroom-preview-banner')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Líder Motors Premium 2026' })).toBeVisible();
    await expect(page.getByText('Belo Horizonte, MG').first()).toBeVisible();
  });

  // 5. Unsaved Changes Modal
  test('WEB-022: Shows unsaved changes modal when clicking "Visualizar perfil" with pending edits', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/perfil');

    // Make an edit without saving
    await page.getByTestId('input-public-name').fill('Nome Temporário Não Salvo');

    // Click "Visualizar perfil"
    await page.getByTestId('btn-preview-profile').click();

    // Assert unsaved changes dialog appears
    await expect(page.getByTestId('modal-unsaved-changes')).toBeVisible();
    await expect(page.getByText('Você possui modificações não salvas')).toBeVisible();

    // Click "Continuar editando" to stay
    await page.getByRole('button', { name: 'Continuar editando' }).click();
    await expect(page.getByTestId('modal-unsaved-changes')).not.toBeVisible();
    await expect(page.getByTestId('input-public-name')).toHaveValue('Nome Temporário Não Salvo');
  });

  // 6. Navigation Between Inventory & Profile
  test('WEB-022: Navigation links work smoothly between Inventory Overview and Business Profile', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Start at inventory
    await page.goto('/concessionaria/anuncios');
    await expect(page.getByRole('heading', { name: 'Estoque da Concessionária' })).toBeVisible();

    // Click "Perfil público" tab
    await page.getByRole('link', { name: 'Perfil público' }).first().click();
    await expect(page).toHaveURL(/\/concessionaria\/perfil/);
    await expect(
      page.getByRole('heading', { name: 'Perfil público da concessionária' }),
    ).toBeVisible();

    // Click "Estoque da frota" to navigate back
    await page.getByRole('link', { name: 'Estoque da frota' }).click();
    await expect(page).toHaveURL(/\/concessionaria\/anuncios/);
    await expect(page.getByRole('heading', { name: 'Estoque da Concessionária' })).toBeVisible();
  });

  // 7. Privacy Invariant & Security Verification
  test('WEB-022: Strictly isolates privacy data (never renders raw CNPJ or sensitive responsible details)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/concessionaria/perfil');

    // Assert privacy guidance box is displayed
    await expect(
      page.getByText('CNPJ, informações pessoais e dados sensíveis não são exibidos publicamente.'),
    ).toBeVisible();
    await expect(page.getByText('O que não é exibido?')).toBeVisible();
    await expect(page.getByText('CNPJ da concessionária')).toBeVisible();
    await expect(page.getByText('Dados pessoais do responsável')).toBeVisible();

    // Inspect page source text to ensure sensitive terms are NOT leaked into public profile markup
    const pageContent = await page.content();
    expect(pageContent).not.toContain('11.222.333/0001-81');
    expect(pageContent).not.toContain('Rodrigo Fontes');
  });

  // 8. Mobile Responsiveness (390px)
  test('WEB-022: Mobile layout (390px) renders vertically stacked cards, sticky action bar, and no overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/concessionaria/perfil');

    // Title & Cards
    await expect(
      page.getByRole('heading', { name: 'Perfil público da concessionária' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Identidade pública' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sobre a revenda' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Localização pública' })).toBeVisible();

    // Mobile sticky footer bar
    await expect(page.getByTestId('btn-preview-profile-mobile')).toBeVisible();
    await expect(page.getByTestId('btn-save-profile-mobile')).toBeVisible();

    // Verify horizontal scrolling does not occur
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });
});

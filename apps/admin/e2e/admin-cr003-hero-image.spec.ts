import { expect, test } from '@playwright/test';

test.describe('CR-003: Homepage Hero Image Management (ADM-D-054 & State Board 2942:10293)', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop only test suite for ADM-D-054');

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

  test('navigates to Hero Image Settings from Settings Hub', async ({ page }) => {
    await page.goto('/configuracoes');

    const heroCard = page.locator('[data-testid="settings-card-imagem-principal"]');
    await expect(heroCard).toBeVisible();
    await expect(heroCard.getByText('Imagem Principal da Homepage')).toBeVisible();
    await expect(heroCard.getByText('ADM-D-054')).toBeVisible();

    await heroCard.click();
    await page.waitForURL(/\/configuracoes\/imagem-principal/);
    await expect(page).toHaveURL(/\/configuracoes\/imagem-principal/);
  });

  test('displays approved Figma ADM-D-054 layout and sections', async ({ page }) => {
    await page.goto('/configuracoes/imagem-principal');

    // Header & Badge
    await expect(page.getByText('CR-003 · IMAGEM DO HERO')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Configurações da imagem principal' }),
    ).toBeVisible();
    await expect(page.locator('[data-testid="main-admin-restriction-pill"]')).toContainText(
      'Somente administrador principal',
    );

    // Section B — Published Hero Image Card
    const publishedCard = page.locator('[data-testid="card-published-hero-image"]');
    await expect(publishedCard).toBeVisible();
    await expect(publishedCard.getByText('Imagem publicada atualmente')).toBeVisible();
    await expect(page.locator('[data-testid="badge-published-status"]')).toBeVisible();
    await expect(
      publishedCard.getByText(
        'A imagem atual permanece publicada até a confirmação da substituição.',
      ),
    ).toBeVisible();
    await expect(publishedCard.getByText(/Encontre seu próximo/i)).toBeVisible();

    // Section C — Replace Hero Image Card
    const replaceCard = page.locator('[data-testid="card-replace-hero-image"]');
    await expect(replaceCard).toBeVisible();
    await expect(replaceCard.getByText('Substituir imagem')).toBeVisible();
    await expect(page.locator('[data-testid="hero-image-dropzone"]')).toBeVisible();
    await expect(page.locator('[data-testid="select-file-button"]')).toBeVisible();

    // Section D — Responsive Previews Card
    const previewCard = page.locator('[data-testid="card-responsive-preview"]');
    await expect(previewCard).toBeVisible();
    await expect(previewCard.getByText('Pré-visualização responsiva')).toBeVisible();
    await expect(previewCard.getByText('Desktop (16:9)')).toBeVisible();
    await expect(previewCard.getByText('Mobile (9:16)')).toBeVisible();

    // Section E — Image Validation Card
    const validationCard = page.locator('[data-testid="card-image-validation"]');
    await expect(validationCard).toBeVisible();
    await expect(validationCard.getByText('Validação de imagem')).toBeVisible();
    await expect(page.locator('[data-testid="validation-format"]')).toBeVisible();
    await expect(page.locator('[data-testid="validation-contrast"]')).toBeVisible();
    await expect(page.locator('[data-testid="validation-crop"]')).toBeVisible();

    // Section F — Action Footer
    const footer = page.locator('[data-testid="hero-action-footer"]');
    await expect(footer).toBeVisible();
    await expect(
      footer.getByText('Nenhuma alteração será aplicada antes da publicação.'),
    ).toBeVisible();
    await expect(page.locator('[data-testid="button-discard-changes"]')).toBeVisible();
    await expect(page.locator('[data-testid="button-publish-image"]')).toBeVisible();
  });

  test('staging and discard flow keeps published image untouched (N-HERO-002, AC-02)', async ({
    page,
  }) => {
    await page.goto('/configuracoes/imagem-principal');

    // Initially no staged replacement row
    await expect(page.locator('[data-testid="queued-replacement-row"]')).toHaveCount(0);
    const publishBtn = page.locator('[data-testid="button-publish-image"]');
    await expect(publishBtn).toBeDisabled();

    // Load sample staged replacement
    await page.locator('[data-testid="load-sample-hero-button"]').click();

    // Queued replacement row appears
    const queuedRow = page.locator('[data-testid="queued-replacement-row"]');
    await expect(queuedRow).toBeVisible();
    await expect(queuedRow.getByText('nova-imagem-home.webp')).toBeVisible();
    await expect(queuedRow.getByText('Prévia não publicada')).toBeVisible();

    // Publish button is now enabled
    await expect(publishBtn).toBeEnabled();

    // Discard staged image
    await page.locator('[data-testid="button-discard-changes"]').click();

    // Queued replacement row removed
    await expect(page.locator('[data-testid="queued-replacement-row"]')).toHaveCount(0);
    await expect(publishBtn).toBeDisabled();

    // Published image remained unchanged
    await expect(page.locator('[data-testid="card-published-hero-image"]')).toBeVisible();
    await expect(page.locator('[data-testid="badge-published-status"]')).toBeVisible();
  });

  test('happy path publication updates published hero image (N-HERO-002, AC-01)', async ({
    page,
  }) => {
    await page.goto('/configuracoes/imagem-principal');

    // Stage replacement
    await page.locator('[data-testid="load-sample-hero-button"]').click();
    await expect(page.locator('[data-testid="queued-replacement-row"]')).toBeVisible();

    // Click Publish
    const publishBtn = page.locator('[data-testid="button-publish-image"]');
    await publishBtn.click();

    // Success banner appears (State 3 from Figma node 2942:10312)
    const successBanner = page.locator('[data-testid="state-banner-success"]');
    await expect(successBanner).toBeVisible();
    await expect(successBanner.getByText('Imagem publicada')).toBeVisible();
    await expect(successBanner.getByText('Imagem principal atualizada com sucesso')).toBeVisible();
    await expect(successBanner.getByText(/Registro: Administrador principal/i)).toBeVisible();

    // Published image card reflects new publication
    const publishedCard = page.locator('[data-testid="card-published-hero-image"]');
    await expect(publishedCard.getByText('nova-imagem-home.webp')).toBeVisible();

    // Reset back to original to keep clean test state
    await page.locator('[data-testid="button-reset-canonical"]').click();
  });

  test('publication failure triggers fallback without modifying published image (N-HERO-005, AC-03)', async ({
    page,
  }) => {
    await page.goto('/configuracoes/imagem-principal');

    // Stage image
    await page.locator('[data-testid="load-sample-hero-button"]').click();

    // Enable simulated network failure
    await page.locator('[data-testid="toggle-simulate-failure"]').check();

    // Click publish
    await page.locator('[data-testid="button-publish-image"]').click();

    // Fallback banner appears (State 4 from Figma node 2942:10319)
    const fallbackBanner = page.locator('[data-testid="state-banner-fallback"]');
    await expect(fallbackBanner).toBeVisible();
    await expect(fallbackBanner.getByText('Falha ao publicar • Fallback')).toBeVisible();
    await expect(fallbackBanner.getByText('A imagem anterior continua publicada')).toBeVisible();
    await expect(page.locator('[data-testid="button-retry-publish"]')).toBeVisible();

    // Original image card remains published without corruption
    const publishedCard = page.locator('[data-testid="card-published-hero-image"]');
    await expect(publishedCard.getByText('hero-desktop.png')).toBeVisible();
    await expect(page.locator('[data-testid="badge-published-status"]')).toBeVisible();
  });

  test('unauthorized roles are blocked with restricted access state (N-HERO-004, AC-04)', async ({
    page,
  }) => {
    await page.goto('/configuracoes/imagem-principal?role=sales');

    // Restricted banner appears (State 5 from Figma node 2942:10326)
    const restrictedBanner = page.locator('[data-testid="state-banner-restricted"]');
    await expect(restrictedBanner).toBeVisible();
    await expect(restrictedBanner.getByText('Acesso restrito')).toBeVisible();
    await expect(restrictedBanner.getByText('Permissão insuficiente')).toBeVisible();
    await expect(
      restrictedBanner.getByText(
        'Apenas o administrador principal pode carregar, substituir ou publicar a imagem do Hero.',
      ),
    ).toBeVisible();

    // Controls are disabled
    await expect(page.locator('[data-testid="hero-file-input"]')).toBeDisabled();
    await expect(page.locator('[data-testid="button-publish-image"]')).toBeDisabled();

    // Test support role
    await page.locator('[data-testid="role-toggle-support"]').click();
    await expect(page.locator('[data-testid="state-banner-restricted"]')).toBeVisible();
    await expect(page.locator('[data-testid="button-publish-image"]')).toBeDisabled();

    // Restore to main_admin
    await page.locator('[data-testid="role-toggle-main-admin"]').click();
    await expect(page.locator('[data-testid="state-banner-restricted"]')).toHaveCount(0);
    await expect(page.locator('[data-testid="hero-file-input"]')).toBeEnabled();
  });
});

import { expect, test } from '@playwright/test';

test.describe('Shared Registration Entry & Auth Finalization (/criar-conta)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/criar-conta');
  });

  test('renders page elements, badge, headline, and default buyer + email selections', async ({
    page,
  }) => {
    // Badge
    await expect(page.getByText('Criar conta', { exact: true })).toBeVisible();

    // Main heading & subtitle
    await expect(
      page.getByRole('heading', { name: /Como deseja usar a Feira de Carros\?/i }),
    ).toBeVisible();
    await expect(page.getByText('Escolha o tipo de conta e a forma de cadastro.')).toBeVisible();

    // 3 Role Options
    const buyerRadio = page.getByRole('radio', { name: /Sou comprador/i });
    const sellerRadio = page.getByRole('radio', { name: /Sou vendedor particular/i });
    const dealerRadio = page.getByRole('radio', { name: /Sou concessionária/i });

    await expect(buyerRadio).toBeVisible();
    await expect(sellerRadio).toBeVisible();
    await expect(dealerRadio).toBeVisible();

    // Default selection: Buyer is checked
    await expect(buyerRadio).toBeChecked();
    await expect(sellerRadio).not.toBeChecked();
    await expect(dealerRadio).not.toBeChecked();

    // Registration Method Selection
    await expect(
      page.getByRole('heading', { name: /Como você prefere se cadastrar\?/i }),
    ).toBeVisible();
    const emailMethodRadio = page.getByRole('radio', { name: /Com e-mail e senha/i });
    const socialMethodRadio = page.getByRole('radio', { name: /Com Google, Apple ou Facebook/i });

    await expect(emailMethodRadio).toBeVisible();
    await expect(socialMethodRadio).toBeVisible();

    // Default method: Email is checked
    await expect(emailMethodRadio).toBeChecked();
    await expect(socialMethodRadio).not.toBeChecked();

    // Continuar CTA
    await expect(page.getByRole('button', { name: /^Continuar$/i })).toBeVisible();

    // Link to login
    await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible();

    // Social buttons
    await expect(page.getByRole('button', { name: /Continuar com Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continuar com Apple/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continuar com Facebook/i })).toBeVisible();

    // Option 2 info note
    await expect(
      page.getByText(/Um e-mail = uma conta\. Escolha o perfil correto antes de continuar\./i),
    ).toBeVisible();

    // Right Promotional Panel
    await expect(
      page.getByRole('heading', {
        name: /Encontre, anuncie e gerencie veículos com uma experiência simples e segura\./i,
      }),
    ).toBeVisible();
    await expect(page.getByText('Anúncios verificados')).toBeVisible();
    await expect(page.getByText('Variedade de veículos')).toBeVisible();
    await expect(page.getByText('Experiência prática')).toBeVisible();
  });

  test('supports selecting only one role at a time', async ({ page }) => {
    const buyerRadio = page.getByRole('radio', { name: /Sou comprador/i });
    const sellerRadio = page.getByRole('radio', { name: /Sou vendedor particular/i });
    const dealerRadio = page.getByRole('radio', { name: /Sou concessionária/i });

    await page.getByText('Sou vendedor particular').click();
    await expect(sellerRadio).toBeChecked();
    await expect(buyerRadio).not.toBeChecked();
    await expect(dealerRadio).not.toBeChecked();

    await page.getByText('Sou concessionária').click();
    await expect(dealerRadio).toBeChecked();
    await expect(buyerRadio).not.toBeChecked();
    await expect(sellerRadio).not.toBeChecked();
  });

  test('supports selecting registration method', async ({ page }) => {
    const emailMethodRadio = page.getByRole('radio', { name: /Com e-mail e senha/i });
    const socialMethodRadio = page.getByRole('radio', { name: /Com Google, Apple ou Facebook/i });

    await expect(emailMethodRadio).toBeChecked();
    await expect(socialMethodRadio).not.toBeChecked();

    await page.getByText('Com Google, Apple ou Facebook').click();
    await expect(socialMethodRadio).toBeChecked();
    await expect(emailMethodRadio).not.toBeChecked();

    await page.getByText('Com e-mail e senha').click();
    await expect(emailMethodRadio).toBeChecked();
    await expect(socialMethodRadio).not.toBeChecked();
  });

  test('submitting default buyer + email method navigates to /cadastrar', async ({ page }) => {
    await page.getByRole('button', { name: /^Continuar$/i }).click();
    await page.waitForURL('**/cadastrar');
    expect(page.url()).toContain('/cadastrar');
  });

  test('selecting seller particular and submitting with email navigates to /vendedor/solicitacao', async ({
    page,
  }) => {
    await page.getByText('Sou vendedor particular').click();
    await page.getByRole('button', { name: /^Continuar$/i }).click();
    await page.waitForURL('**/vendedor/solicitacao');
    expect(page.url()).toContain('/vendedor/solicitacao');
  });

  test('selecting concessionária and submitting with email navigates to /concessionaria/solicitacao', async ({
    page,
  }) => {
    await page.getByText('Sou concessionária').click();
    await page.getByRole('button', { name: /^Continuar$/i }).click();
    await page.waitForURL('**/concessionaria/solicitacao');
    expect(page.url()).toContain('/concessionaria/solicitacao');
  });

  test('submitting with social method displays demonstrative notice and maintains role', async ({
    page,
  }) => {
    await page.getByText('Sou vendedor particular').click();
    await page.getByText('Com Google, Apple ou Facebook').click();

    await page.getByRole('button', { name: /^Continuar$/i }).click();
    await expect(page.locator('output')).toContainText(
      /Integração social demonstrativa selecionada para o perfil sou vendedor particular/i,
    );
  });

  test('clicking Entrar navigates to /entrar', async ({ page }) => {
    await page.getByRole('link', { name: 'Entrar' }).click();
    await page.waitForURL('**/entrar');
    expect(page.url()).toContain('/entrar');
  });

  test('in /entrar, clicking Criar conta navigates back to /criar-conta', async ({ page }) => {
    await page.goto('/entrar');
    await page.getByRole('link', { name: 'Criar conta' }).click();
    await page.waitForURL('**/criar-conta');
    expect(page.url()).toContain('/criar-conta');
  });

  test('social buttons display non-blocking demonstrative status and identify provider', async ({
    page,
  }) => {
    await page.getByText('Sou concessionária').click();
    await page.getByRole('button', { name: /Continuar com Google/i }).click();
    await expect(page.locator('output')).toContainText(
      /Identificado provedor Google para sou concessionária/i,
    );
  });
});

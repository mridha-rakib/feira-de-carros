import { expect, test } from '@playwright/test';

test.describe('Shared Registration Entry & Auth Finalization (/criar-conta)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/criar-conta');
  });

  test('renders page elements, badge, headline, and default buyer selection', async ({ page }) => {
    // Badge
    await expect(page.getByText('Criar conta', { exact: true })).toBeVisible();

    // Main heading
    await expect(
      page.getByRole('heading', { name: /Como deseja usar a Feira de Carros\?/i }),
    ).toBeVisible();

    // Subtitle
    await expect(page.getByText('Escolha o tipo de conta para continuar.')).toBeVisible();

    // 3 Options
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

  test('submitting default buyer selection navigates to /cadastrar', async ({ page }) => {
    await page.getByRole('button', { name: /^Continuar$/i }).click();
    await page.waitForURL('**/cadastrar');
    expect(page.url()).toContain('/cadastrar');
  });

  test('selecting seller particular and submitting navigates to /vendedor/solicitacao', async ({
    page,
  }) => {
    const sellerOption = page.getByText('Sou vendedor particular');
    await sellerOption.click();

    const sellerRadio = page.getByRole('radio', { name: /Sou vendedor particular/i });
    await expect(sellerRadio).toBeChecked();

    await page.getByRole('button', { name: /^Continuar$/i }).click();
    await page.waitForURL('**/vendedor/solicitacao');
    expect(page.url()).toContain('/vendedor/solicitacao');
  });

  test('selecting concessionária and submitting navigates to /concessionaria/solicitacao', async ({
    page,
  }) => {
    const dealerOption = page.getByText('Sou concessionária');
    await dealerOption.click();

    const dealerRadio = page.getByRole('radio', { name: /Sou concessionária/i });
    await expect(dealerRadio).toBeChecked();

    await page.getByRole('button', { name: /^Continuar$/i }).click();
    await page.waitForURL('**/concessionaria/solicitacao');
    expect(page.url()).toContain('/concessionaria/solicitacao');
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

  test('social buttons display non-blocking demonstrative status', async ({ page }) => {
    await page.getByRole('button', { name: /Continuar com Google/i }).click();
    await expect(page.locator('output')).toContainText(/Login social com Google é demonstrativo/i);
  });
});

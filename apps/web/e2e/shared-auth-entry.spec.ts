import { expect, test } from '@playwright/test';

test.describe('Shared Registration Entry UX Simplification (/criar-conta)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/criar-conta');
  });

  test('renders page elements, badge, headline, and default buyer selection', async ({ page }) => {
    // Badge
    await expect(page.getByText('Criar conta', { exact: true })).toBeVisible();

    // Main heading & subtitle
    await expect(
      page.getByRole('heading', { name: /Como deseja usar a Feira de Carros\?/i }),
    ).toBeVisible();
    await expect(page.getByText('Escolha o tipo de conta para continuar.')).toBeVisible();

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

    // Verify removed redundant registration-method cards are NOT present
    await expect(
      page.getByRole('heading', { name: /Como você prefere se cadastrar\?/i }),
    ).not.toBeVisible();
    await expect(page.getByText('Preencha um formulário com seus dados.')).not.toBeVisible();
    await expect(page.getByText('Use sua conta atual para criar o cadastro.')).not.toBeVisible();

    // Continuar CTA directly below role cards
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

    await page.getByText('Sou comprador').click();
    await expect(buyerRadio).toBeChecked();
    await expect(sellerRadio).not.toBeChecked();
    await expect(dealerRadio).not.toBeChecked();
  });

  test('submitting default buyer selection navigates to /cadastrar', async ({ page }) => {
    await page.getByRole('button', { name: /^Continuar$/i }).click();
    await page.waitForURL('**/cadastrar');
    expect(page.url()).toContain('/cadastrar');
  });

  test('selecting seller particular and submitting navigates to /vendedor/solicitacao', async ({
    page,
  }) => {
    await page.getByText('Sou vendedor particular').click();
    await page.getByRole('button', { name: /^Continuar$/i }).click();
    await page.waitForURL('**/vendedor/solicitacao');
    expect(page.url()).toContain('/vendedor/solicitacao');
  });

  test('selecting concessionária and submitting navigates to /concessionaria/solicitacao', async ({
    page,
  }) => {
    await page.getByText('Sou concessionária').click();
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

  test('social buttons display non-blocking demonstrative status and preserve chosen role', async ({
    page,
  }) => {
    await page.getByText('Sou concessionária').click();
    await page.getByRole('button', { name: /Continuar com Google/i }).click();
    await expect(page.locator('output')).toContainText(
      /Integração com Google selecionada para o perfil sou concessionária/i,
    );
  });
});

import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from '@playwright/test';

const outputDir =
  process.env.VISUAL_SCREENSHOT_DIR ||
  (process.env.CI
    ? path.join(process.cwd(), 'playwright-report', 'screenshots')
    : 'C:\\Users\\rakib_bro\\sta-projects\\feira-de-carros\\frontend\\screenshots');

if (!fs.existsSync(outputDir)) {
  try {
    fs.mkdirSync(outputDir, { recursive: true });
  } catch {
    // Ignore in read-only runner
  }
}

test.describe('Admin B3 — Users Management (ADM-D-003 & ADM-M-008)', () => {
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

  test('desktop ADM-D-003: renders directory, KPI cards, table, selected user dossier and pagination', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop only test');
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/usuarios');

    const desktopView = page.getByTestId('desktop-users-management');
    await expect(desktopView).toBeVisible();

    // Verify Official 2026 Brand Logo in Sidebar
    const brandLogo = page.locator('aside img[alt="Feira de Carros"]');
    await expect(brandLogo).toBeVisible();
    await expect(brandLogo).toHaveAttribute('src', /logo-on-dark\.png/);

    // Verify Title & Badges
    await expect(desktopView.getByRole('heading', { name: 'Gestão de Usuários' })).toBeVisible();
    await expect(desktopView.getByText('ADM-D-003')).toBeVisible();

    // Verify 4 KPI Summary Cards (Figma ADM-D-003)
    await expect(desktopView.getByRole('button', { name: /Total de contas/i })).toContainText(
      '2.406',
    );
    await expect(desktopView.getByRole('button', { name: /Vendedores aprovados/i })).toContainText(
      '682',
    );
    await expect(desktopView.getByRole('button', { name: /Concessionárias/i })).toContainText('74');
    await expect(desktopView.getByRole('button', { name: /Contas suspensas/i })).toContainText(
      '14',
    );

    // Verify Table & Reference Users
    await expect(desktopView.locator('table')).toBeVisible();
    await expect(desktopView.getByText('Mariana Silva Costa').first()).toBeVisible();
    await expect(desktopView.getByText('Bruno Ferreira Almeida').first()).toBeVisible();
    await expect(desktopView.getByText('Vale Auto Veículos Ltda').first()).toBeVisible();

    // Verify Selected User Dossier Panel (ADM-D-003-DETAIL-01 — Mariana Costa)
    const detailPanel = page.getByTestId('selected-user-detail-panel');
    await expect(detailPanel).toBeVisible();
    await expect(detailPanel.getByRole('heading', { name: 'Mariana Silva Costa' })).toBeVisible();
    await expect(detailPanel.getByText('USR-2026-0001')).toBeVisible();
    await expect(detailPanel.getByRole('button', { name: 'Abrir Dossiê Completo' })).toBeVisible();

    // Capture Desktop 1600px Screenshot
    await page.screenshot({
      path: path.join(outputDir, 'ADM-D-003-Desktop-Users-1600px.png'),
      fullPage: true,
    });

    // Capture Desktop 1366px Screenshot
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.screenshot({
      path: path.join(outputDir, 'ADM-D-003-Desktop-Users-1366px.png'),
      fullPage: true,
    });
  });

  test('desktop ADM-D-003: selection changes to Bruno Almeida (DETAIL-02) and Vale Auto (DETAIL-03)', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop only test');
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/usuarios');

    const desktopView = page.getByTestId('desktop-users-management');
    const detailPanel = page.getByTestId('selected-user-detail-panel');

    // Click Bruno Ferreira Almeida row
    await desktopView.getByText('Bruno Ferreira Almeida').first().click();
    await expect(
      detailPanel.getByRole('heading', { name: 'Bruno Ferreira Almeida' }),
    ).toBeVisible();
    await expect(detailPanel.getByText('USR-2026-0002')).toBeVisible();
    await expect(detailPanel.getByText('(31) 99123-5544')).toBeVisible();

    // Click Vale Auto Veículos row
    await desktopView.getByText('Vale Auto Veículos Ltda').first().click();
    await expect(
      detailPanel.getByRole('heading', { name: 'Vale Auto Veículos Ltda' }),
    ).toBeVisible();
    await expect(detailPanel.getByText('USR-2026-0003')).toBeVisible();
    await expect(detailPanel.getByText('12 veículos no catálogo')).toBeVisible();
    await expect(detailPanel.getByText('Destaque Ouro')).toBeVisible();
  });

  test('desktop ADM-D-003: search filter, pagination navigation, and boundary states', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop only test');
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/usuarios');

    const desktopView = page.getByTestId('desktop-users-management');
    const searchInput = desktopView.getByPlaceholder(/Pesquisar por nome/i);

    // Filter by Fernanda Rocha (DETAIL-06 — Suspended Seller)
    await searchInput.fill('Fernanda Rocha');
    await expect(desktopView.getByText('Fernanda Mendes Rocha').first()).toBeVisible();
    await expect(desktopView.getByText('Suspensão preventiva').first()).toBeVisible();

    // Clear search
    await desktopView.getByRole('button', { name: 'Limpar', exact: true }).click();
    await expect(searchInput).toHaveValue('');

    // Pagination verification: Page 1 shows 10 items
    const pagination = desktopView.getByTestId('admin-pagination');
    await expect(pagination).toBeVisible();
    await expect(pagination.getByText(/1–10/i)).toBeVisible();

    // Navigate to Page 2
    await pagination.getByRole('button', { name: '2', exact: true }).click();
    await expect(pagination.getByText(/11–20/i)).toBeVisible();
    await expect(desktopView.getByText('Pioneiro Automóveis Ltda').first()).toBeVisible();

    // Capture Page 2 Screenshot
    await page.screenshot({
      path: path.join(outputDir, 'ADM-D-003-Desktop-Users-Page2-1600px.png'),
      fullPage: true,
    });

    // Navigate to Page 3
    const nextBtn = pagination.getByRole('button', { name: 'Próximo' });
    await nextBtn.click();
    await expect(pagination.getByText(/21–22/i)).toBeVisible();
    await expect(nextBtn).toBeDisabled();

    // Navigate back to Page 1
    await pagination.getByRole('button', { name: '1', exact: true }).click();
    await expect(pagination.getByText(/1–10/i)).toBeVisible();
  });

  test('desktop ADM-D-003: inspection modal and status transition flows', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'Desktop only test');
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.goto('/usuarios');

    const detailPanel = page.getByTestId('selected-user-detail-panel');

    // Open Inspection Modal
    await detailPanel.getByRole('button', { name: 'Abrir Dossiê Completo' }).click();
    const modal = page.getByTestId('user-inspection-modal');
    await expect(modal).toBeVisible();
    await expect(modal.getByRole('heading', { name: 'Mariana Silva Costa' })).toBeVisible();

    // Test Tabs
    await modal.getByRole('button', { name: 'Atividade no Portal' }).click();
    await expect(modal.getByText('Veículos Favoritos')).toBeVisible();

    await modal.getByRole('button', { name: 'Auditoria & Histórico' }).click();
    await expect(modal.getByText('Trilha de Modificações e Eventos')).toBeVisible();

    // Capture Modal Screenshot
    await page.screenshot({
      path: path.join(outputDir, 'ADM-D-003-Inspection-Modal.png'),
    });

    // Close Modal
    await modal.getByRole('button', { name: 'Concluir Inspeção' }).click();
    await expect(modal).not.toBeVisible();

    // Test Status Change Dialog
    await detailPanel.getByRole('button', { name: 'Suspender' }).click();
    const statusModal = page.getByTestId('user-status-change-modal');
    await expect(statusModal).toBeVisible();
    await expect(
      statusModal.getByRole('heading', { name: 'Suspender Conta Preventivamente' }),
    ).toBeVisible();

    // Capture Status Modal Screenshot
    await page.screenshot({
      path: path.join(outputDir, 'ADM-D-003-Status-Modal.png'),
    });

    await statusModal.getByRole('button', { name: 'Cancelar' }).click();
    await expect(statusModal).not.toBeVisible();
  });

  test('tablet ADM-D-003: verifies 768px layout', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Tablet desktop renderer test');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/usuarios');

    // At 768px (md breakpoint), the mobile web view is active (lg:hidden)
    const mobileView = page.getByTestId('mobile-users-management');
    await expect(mobileView).toBeVisible();

    await page.screenshot({
      path: path.join(outputDir, 'ADM-D-003-Tablet-Users-768px.png'),
      fullPage: true,
    });
  });

  test('mobile ADM-M-008: renders restricted client search, criteria section, and masked consultation', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'Mobile only test');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/usuarios');

    const mobileView = page.getByTestId('mobile-users-management');
    await expect(mobileView).toBeVisible();

    // Verify Title & Badge (ADM-M-008 — Pesquisa de clientes)
    await expect(mobileView.getByRole('heading', { name: 'Pesquisa de clientes' })).toBeVisible();
    await expect(mobileView.getByText('ADM-M-008')).toBeVisible();

    // Verify Criteria for Consultation and Privacy Notice
    await expect(mobileView.getByText('Critérios de Consulta Autorizada')).toBeVisible();
    await expect(mobileView.getByText('Privacidade por campo ativa (LGPD)')).toBeVisible();

    // Verify full directory is NOT revealed before search
    await expect(mobileView.getByText('Aguardando consulta')).toBeVisible();

    // Capture Mobile 390px Initial Search Screen
    await page.screenshot({
      path: path.join(outputDir, 'ADM-M-008-Mobile-Users-390px.png'),
      fullPage: true,
    });

    // Capture Mobile 360px Screenshot
    await page.setViewportSize({ width: 360, height: 800 });
    await page.screenshot({
      path: path.join(outputDir, 'ADM-M-008-Mobile-Users-360px.png'),
      fullPage: true,
    });

    // Capture Mobile 430px Screenshot
    await page.setViewportSize({ width: 430, height: 932 });
    await page.screenshot({
      path: path.join(outputDir, 'ADM-M-008-Mobile-Users-430px.png'),
      fullPage: true,
    });

    // Perform Authorized Customer Lookup for Mariana Costa
    await page.setViewportSize({ width: 390, height: 844 });
    await mobileView.getByRole('button', { name: 'Mariana Costa' }).click();

    // Verify Masked Customer Summary Card is displayed
    await expect(mobileView.getByText('Mariana Silva Costa')).toBeVisible();
    await expect(mobileView.getByText('USR-2026-0001').first()).toBeVisible();
    await expect(mobileView.getByText('***.452.886-**')).toBeVisible();
    await expect(mobileView.getByText('Ativo', { exact: true })).toBeVisible();

    // Open Read-Only Modal on Mobile
    await mobileView.getByRole('button', { name: 'Inspecionar Dossiê (Modo Leitura)' }).click();
    const modal = page.getByTestId('user-inspection-modal');
    await expect(modal).toBeVisible();

    // Verify Mobile Read-Only Security Restriction Alert (AUTH-019 & ADM-021)
    await expect(modal.getByText(/Consulta em modo leitura no mobile/i)).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Fechar Visualização' })).toBeVisible();

    // Verify mutating operational buttons are NOT present on mobile
    await expect(modal.getByRole('button', { name: 'Suspender Conta' })).not.toBeVisible();
    await expect(modal.getByRole('button', { name: 'Bloquear em Definitivo' })).not.toBeVisible();

    // Capture Mobile Modal Screenshot
    await page.screenshot({
      path: path.join(outputDir, 'ADM-M-008-Mobile-Inspection-Modal.png'),
    });

    await modal.getByRole('button', { name: 'Fechar Visualização' }).click();
    await expect(modal).not.toBeVisible();
  });
});

process.env.ADMIN_E2E_MOCK = 'true';

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';
import next from 'next';

const PORT = 3020;
const BASE_URL = `http://localhost:${PORT}`;

const ROOT_SCREENSHOTS_DIR = path.resolve(import.meta.dirname, '../../../screenshots/admin-b5a');
const ARTIFACTS_DIR =
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\a7c0407c-7356-40dd-bed2-ada338d6a46f\\screenshots\\admin-b5a';

for (const dir of [ROOT_SCREENSHOTS_DIR, ARTIFACTS_DIR]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function saveScreenshot(page, filename, options = {}) {
  const p1 = path.join(ROOT_SCREENSHOTS_DIR, filename);
  const p2 = path.join(ARTIFACTS_DIR, filename);
  await page.screenshot({ path: p1, ...options });
  fs.copyFileSync(p1, p2);
  console.log(`[Screenshot Captured] ${filename}`);
}

async function createAuthenticatedPage(browser, options = {}) {
  const context = await browser.newContext(options);
  await context.addCookies([
    {
      name: 'fdc_admin_session',
      value: 'mock_admin_token_active',
      url: BASE_URL,
    },
  ]);
  const page = await context.newPage();
  return { context, page };
}

async function main() {
  console.log('Preparing Next.js server on port', PORT, '...');
  const app = next({
    dev: false,
    dir: path.resolve(import.meta.dirname, '..'),
    quiet: true,
  });
  await app.prepare();
  const handle = app.getRequestHandler();

  const server = http.createServer((req, res) => handle(req, res));
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Server listening on ${BASE_URL}`);

  console.log('Launching Chromium...');
  const browser = await chromium.launch({ headless: true });

  const testResults = {
    totalCaptured: 0,
    screenshots: [],
    errors: [],
  };

  try {
    // =========================================================================
    // 1. ADM-D-032 — FILA DE DENÚNCIAS E MODERAÇÃO (/moderacao)
    // =========================================================================
    console.log('\n--- 1. Testing ADM-D-032 (/moderacao) ---');

    // 1.1 Desktop 1600px
    const { context: ctx32_1600, page: page32_1600 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await page32_1600.goto(`${BASE_URL}/moderacao`);
    await page32_1600.waitForSelector('[data-testid="moderation-queue-page"]');
    await page32_1600.waitForTimeout(400);
    await saveScreenshot(page32_1600, 'ADM-D-032-Desktop-Moderation-Queue-1600px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 1.2 Desktop 1366px (Master-detail without vertical collapse)
    const { context: ctx32_1366, page: page32_1366 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1366, height: 800 },
    });
    await page32_1366.goto(`${BASE_URL}/moderacao`);
    await page32_1366.waitForSelector('[data-testid="moderation-queue-page"]');
    await page32_1366.waitForTimeout(400);
    await saveScreenshot(page32_1366, 'ADM-D-032-Desktop-Moderation-Queue-1366px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 1.3 Selected RPT-DEMO-008 (Corolla photo visible)
    await page32_1600.click('[data-testid="report-row-RPT-DEMO-008"]');
    await page32_1600.waitForTimeout(300);
    await saveScreenshot(page32_1600, 'ADM-D-032-Selected-RPT-DEMO-008-Corolla.png');
    testResults.totalCaptured++;

    // 1.4 Selected RPT-DEMO-010 (Bruno Almeida)
    await page32_1600.click('[data-testid="report-row-RPT-DEMO-010"]');
    await page32_1600.waitForTimeout(300);
    await saveScreenshot(page32_1600, 'ADM-D-032-Selected-RPT-DEMO-010-Bruno.png');
    testResults.totalCaptured++;

    // 1.5 Tablet 768px
    const { context: ctx32_768, page: page32_768 } = await createAuthenticatedPage(browser, {
      viewport: { width: 768, height: 1024 },
    });
    await page32_768.goto(`${BASE_URL}/moderacao`);
    await page32_768.waitForSelector('[data-testid="moderation-queue-page"]');
    await page32_768.waitForTimeout(400);
    await saveScreenshot(page32_768, 'ADM-D-032-Tablet-Moderation-Queue-768px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 1.6 Mobile 430px
    const { context: ctx32_430, page: page32_430 } = await createAuthenticatedPage(browser, {
      viewport: { width: 430, height: 932 },
    });
    await page32_430.goto(`${BASE_URL}/moderacao`);
    await page32_430.waitForSelector('[data-testid="moderation-queue-page"]');
    await page32_430.waitForTimeout(400);
    await saveScreenshot(page32_430, 'ADM-D-032-Mobile-Moderation-Queue-430px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 1.7 Mobile 390px
    const { context: ctx32_390, page: page32_390 } = await createAuthenticatedPage(browser, {
      viewport: { width: 390, height: 844 },
    });
    await page32_390.goto(`${BASE_URL}/moderacao`);
    await page32_390.waitForSelector('[data-testid="moderation-queue-page"]');
    await page32_390.waitForTimeout(400);
    await saveScreenshot(page32_390, 'ADM-D-032-Mobile-Moderation-Queue-390px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 1.8 Mobile 360px
    const { context: ctx32_360, page: page32_360 } = await createAuthenticatedPage(browser, {
      viewport: { width: 360, height: 800 },
    });
    await page32_360.goto(`${BASE_URL}/moderacao`);
    await page32_360.waitForSelector('[data-testid="moderation-queue-page"]');
    await page32_360.waitForTimeout(400);
    await saveScreenshot(page32_360, 'ADM-D-032-Mobile-Moderation-Queue-360px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    await ctx32_1600.close();
    await ctx32_1366.close();
    await ctx32_768.close();
    await ctx32_430.close();
    await ctx32_390.close();
    await ctx32_360.close();

    // =========================================================================
    // 2. ADM-D-033 — DETALHES DA DENÚNCIA E DO VENDEDOR (/moderacao/[id])
    // =========================================================================
    console.log('\n--- 2. Testing ADM-D-033 (/moderacao/RPT-DEMO-008) ---');

    // 2.1 Desktop 1600px
    const { context: ctx33_1600, page: page33_1600 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await page33_1600.goto(`${BASE_URL}/moderacao/RPT-DEMO-008`);
    await page33_1600.waitForSelector('[data-testid="report-detail-page"]');
    await page33_1600.waitForTimeout(400);
    await saveScreenshot(page33_1600, 'ADM-D-033-Desktop-Report-Detail-1600px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 2.2 Desktop 1366px
    const { context: ctx33_1366, page: page33_1366 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1366, height: 800 },
    });
    await page33_1366.goto(`${BASE_URL}/moderacao/RPT-DEMO-008`);
    await page33_1366.waitForSelector('[data-testid="report-detail-page"]');
    await page33_1366.waitForTimeout(400);
    await saveScreenshot(page33_1366, 'ADM-D-033-Desktop-Report-Detail-1366px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 2.3 Tablet 768px
    const { context: ctx33_768, page: page33_768 } = await createAuthenticatedPage(browser, {
      viewport: { width: 768, height: 1024 },
    });
    await page33_768.goto(`${BASE_URL}/moderacao/RPT-DEMO-008`);
    await page33_768.waitForSelector('[data-testid="report-detail-page"]');
    await page33_768.waitForTimeout(400);
    await saveScreenshot(page33_768, 'ADM-D-033-Tablet-Report-Detail-768px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 2.4 Mobile 390px
    const { context: ctx33_390, page: page33_390 } = await createAuthenticatedPage(browser, {
      viewport: { width: 390, height: 844 },
    });
    await page33_390.goto(`${BASE_URL}/moderacao/RPT-DEMO-008`);
    await page33_390.waitForSelector('[data-testid="report-detail-page"]');
    await page33_390.waitForTimeout(400);
    await saveScreenshot(page33_390, 'ADM-D-033-Mobile-Report-Detail-390px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 2.5 Invalid ID Not-Found State
    await page33_1600.goto(`${BASE_URL}/moderacao/RPT-INVALID-999`);
    await page33_1600.waitForSelector('[data-testid="report-not-found-state"]');
    await page33_1600.waitForTimeout(300);
    await saveScreenshot(page33_1600, 'ADM-D-033-Invalid-ID-Not-Found-State.png');
    testResults.totalCaptured++;

    await ctx33_1600.close();
    await ctx33_1366.close();
    await ctx33_768.close();
    await ctx33_390.close();

    // =========================================================================
    // 3. ADM-D-034 — REVISÃO DE CONVERSA VINCULADA (/moderacao/[id]/conversa)
    // =========================================================================
    console.log('\n--- 3. Testing ADM-D-034 (/moderacao/RPT-DEMO-008/conversa) ---');

    // 3.1 Desktop 1600px
    const { context: ctx34_1600, page: page34_1600 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await page34_1600.goto(`${BASE_URL}/moderacao/RPT-DEMO-008/conversa`);
    await page34_1600.waitForSelector('[data-testid="conversation-review-page"]');
    await page34_1600.waitForTimeout(400);
    await saveScreenshot(page34_1600, 'ADM-D-034-Desktop-Conversation-Review-1600px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 3.2 Desktop 1366px
    const { context: ctx34_1366, page: page34_1366 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1366, height: 800 },
    });
    await page34_1366.goto(`${BASE_URL}/moderacao/RPT-DEMO-008/conversa`);
    await page34_1366.waitForSelector('[data-testid="conversation-review-page"]');
    await page34_1366.waitForTimeout(400);
    await saveScreenshot(page34_1366, 'ADM-D-034-Desktop-Conversation-Review-1366px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 3.3 Tablet 768px
    const { context: ctx34_768, page: page34_768 } = await createAuthenticatedPage(browser, {
      viewport: { width: 768, height: 1024 },
    });
    await page34_768.goto(`${BASE_URL}/moderacao/RPT-DEMO-008/conversa`);
    await page34_768.waitForSelector('[data-testid="conversation-review-page"]');
    await page34_768.waitForTimeout(400);
    await saveScreenshot(page34_768, 'ADM-D-034-Tablet-Conversation-Review-768px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 3.4 Mobile 390px
    const { context: ctx34_390, page: page34_390 } = await createAuthenticatedPage(browser, {
      viewport: { width: 390, height: 844 },
    });
    await page34_390.goto(`${BASE_URL}/moderacao/RPT-DEMO-008/conversa`);
    await page34_390.waitForSelector('[data-testid="conversation-review-page"]');
    await page34_390.waitForTimeout(400);
    await saveScreenshot(page34_390, 'ADM-D-034-Mobile-Conversation-Review-390px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 3.5 Report without conversation excerpt (RPT-DEMO-010)
    await page34_1600.goto(`${BASE_URL}/moderacao/RPT-DEMO-010/conversa`);
    await page34_1600.waitForSelector('[data-testid="conversation-restricted-no-excerpt"]');
    await page34_1600.waitForTimeout(300);
    await saveScreenshot(page34_1600, 'ADM-D-034-No-Excerpt-Restricted-State.png');
    testResults.totalCaptured++;

    await ctx34_1600.close();
    await ctx34_1366.close();
    await ctx34_768.close();
    await ctx34_390.close();

    // =========================================================================
    // 4. ADM-D-035 — DECISÃO E MEDIDAS DE MODERAÇÃO (/moderacao/[id]/decisao)
    // =========================================================================
    console.log('\n--- 4. Testing ADM-D-035 (/moderacao/RPT-DEMO-008/decisao) ---');

    // 4.1 Desktop 1600px
    const { context: ctx35_1600, page: page35_1600 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await page35_1600.goto(`${BASE_URL}/moderacao/RPT-DEMO-008/decisao`);
    await page35_1600.waitForSelector('[data-testid="moderation-decision-page"]');
    await page35_1600.waitForTimeout(400);
    await saveScreenshot(page35_1600, 'ADM-D-035-Desktop-Decision-Preview-1600px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 4.2 Desktop 1366px
    const { context: ctx35_1366, page: page35_1366 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1366, height: 800 },
    });
    await page35_1366.goto(`${BASE_URL}/moderacao/RPT-DEMO-008/decisao`);
    await page35_1366.waitForSelector('[data-testid="moderation-decision-page"]');
    await page35_1366.waitForTimeout(400);
    await saveScreenshot(page35_1366, 'ADM-D-035-Desktop-Decision-Preview-1366px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 4.3 Select Option CORRECTION_REQUESTED + Type Justification
    await page35_1600.click('[data-testid="decision-option-CORRECTION_REQUESTED"]');
    await page35_1600.fill(
      '[data-testid="decision-justification-input"]',
      'Solicitação de ajuste de quilometragem no anúncio FC-2026-0121 para conferência documental.',
    );
    await page35_1600.waitForTimeout(300);
    await saveScreenshot(page35_1600, 'ADM-D-035-Selected-Option-With-Justification.png');
    testResults.totalCaptured++;

    // 4.4 Simulation Preview Shown
    await page35_1600.click('[data-testid="simulate-decision-btn"]');
    await page35_1600.waitForSelector('[data-testid="decision-preview-state"]');
    await page35_1600.waitForTimeout(300);
    await saveScreenshot(page35_1600, 'ADM-D-035-Simulation-Preview-State.png');
    testResults.totalCaptured++;

    // 4.5 Blocked Result State (Fail-Closed Confirmation)
    await page35_1600.click('[data-testid="confirm-decision-btn"]');
    await page35_1600.waitForSelector('[data-testid="decision-blocked-result-state"]');
    await page35_1600.waitForTimeout(300);
    await saveScreenshot(page35_1600, 'ADM-D-035-Blocked-Confirmation-Result-State.png');
    testResults.totalCaptured++;

    // 4.6 Tablet 768px
    const { context: ctx35_768, page: page35_768 } = await createAuthenticatedPage(browser, {
      viewport: { width: 768, height: 1024 },
    });
    await page35_768.goto(`${BASE_URL}/moderacao/RPT-DEMO-008/decisao`);
    await page35_768.waitForSelector('[data-testid="moderation-decision-page"]');
    await page35_768.waitForTimeout(400);
    await saveScreenshot(page35_768, 'ADM-D-035-Tablet-Decision-Preview-768px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 4.7 Mobile 390px
    const { context: ctx35_390, page: page35_390 } = await createAuthenticatedPage(browser, {
      viewport: { width: 390, height: 844 },
    });
    await page35_390.goto(`${BASE_URL}/moderacao/RPT-DEMO-008/decisao`);
    await page35_390.waitForSelector('[data-testid="moderation-decision-page"]');
    await page35_390.waitForTimeout(400);
    await saveScreenshot(page35_390, 'ADM-D-035-Mobile-Decision-Preview-390px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    await ctx35_1600.close();
    await ctx35_1366.close();
    await ctx35_768.close();
    await ctx35_390.close();

    // =========================================================================
    // 5. MANIFEST & FIGMA COMPARISON DOCUMENTATION
    // =========================================================================
    console.log('\nGenerating Manifest and Comparison Documentation...');

    const manifest = {
      batch: 'Admin B5A — Reports & Moderation Management',
      timestamp: new Date().toISOString(),
      sourceOfTruthFigmaUrl: 'https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT?node-id=2-8',
      screensVerified: [
        {
          frameCode: 'ADM-D-032',
          name: 'Fila de denúncias e moderação',
          route: '/moderacao',
          figmaNode: '237:1884',
          kpis: {
            totalReports: 3,
            underReview: 2,
            corrections: 1,
            supportAccess: 'DENY_PENDING',
          },
          reportsSample: ['RPT-DEMO-008', 'RPT-DEMO-009', 'RPT-DEMO-010'],
        },
        {
          frameCode: 'ADM-D-033',
          name: 'Detalhes da denúncia e do vendedor',
          route: '/moderacao/[id]',
          figmaNode: '275:1474',
          vehicleReference: {
            title: 'Toyota Corolla 2021',
            adId: 'FC-2026-0121',
            seller: 'Vale Auto Veículos',
            priceBrl: 112900,
            imageAsset: '/images/vehicles/demo/image.png',
          },
        },
        {
          frameCode: 'ADM-D-034',
          name: 'Revisão de conversa vinculada à denúncia',
          route: '/moderacao/[id]/conversa',
          figmaNode: '275:1689',
          scopeRestriction: 'Exclusivamente trecho anexado ao protocolo',
          rbacPolicy: 'Support and Sales DENY_PENDING',
          lgpdProtection: 'Identidades protegidas e sem exportação irrestrita',
        },
        {
          frameCode: 'ADM-D-035',
          name: 'Decisão e medidas de moderação',
          route: '/moderacao/[id]/decisao',
          figmaNode: '275:1904',
          decisionOptions: [
            'Denúncia não fundamentada',
            'Solicitar correção',
            'Medida restritiva',
          ],
          securityInvariant: 'Fail-closed: blocked authorization state with zero mutation',
        },
      ],
      totalScreenshots: testResults.totalCaptured,
    };

    fs.writeFileSync(
      path.join(ROOT_SCREENSHOTS_DIR, 'MANIFEST-B5A.json'),
      JSON.stringify(manifest, null, 2),
    );

    const figmaNotes = `# Figma Source of Truth Comparison — Admin B5A

## Scope: Frontend Only (No Backend, Real Execution or JWT)

### 1. ADM-D-032 — Fila de denúncias e moderação (node 237:1884)
- **Route**: \`/moderacao\`
- **Figma Reference Data**: 3 demonstrative reports:
  - \`RPT-DEMO-008\`: Toyota Corolla 2021 (FC-2026-0121), Vale Auto Veículos, R$ 112.900, 24/10/2026, Em análise.
  - \`RPT-DEMO-009\`: Fiat Strada (FC-2026-0142), 25/10/2026, Em análise.
  - \`RPT-DEMO-010\`: Perfil vendedor Bruno Almeida, 25/10/2026, Correção.
- **KPIs**: 4 summary cards (Total 3, Em análise 2, Correções 1, Acesso Support: DENY_PENDING).
- **Desktop Split Layout**: Master table on left, selected report detail card on right with Toyota Corolla photograph, without collapse at 1366px.
- **Sidebar Integration**: Reuses existing "Mensagens e denúncias" navigation pointing directly to \`/moderacao\`.

### 2. ADM-D-033 — Detalhes da denúncia e do vendedor (node 275:1474)
- **Route**: \`/moderacao/[id]\`
- **Vehicle Asset**: Reuses the approved Toyota Corolla 2021 image (\`/images/vehicles/demo/image.png\`) consistently across queue and detail view.
- **Allegation Protection**: Prominent "Alegação não verificada" banner indicating that complaints do not constitute confirmed violations.
- **Privacy**: Masked CNPJ ("Restrito / não público") and protected reporter identity under LGPD.
- **Navigation**: Direct back button, link to contextual conversation review, and link to moderation decision.

### 3. ADM-D-034 — Revisão de conversa vinculada à denúncia (node 275:1689)
- **Route**: \`/moderacao/[id]/conversa\`
- **Strict Privacy Scope**: Limited strictly to the demonstrative excerpt attached to \`RPT-DEMO-008\`.
- **Anti-Pattern Guard**: No global chat browsing, no full conversation export, no access to unrelated messages.
- **RBAC**: Explicit banner confirming Support and Sales access is \`DENY_PENDING\`.
- **Authenticity Status**: Shows "Verificação Pendente" for unverified complaint excerpts.

### 4. ADM-D-035 — Decisão e medidas de moderação (node 275:1904)
- **Route**: \`/moderacao/[id]/decisao\`
- **Decision Options**:
  1. Denúncia não fundamentada (Relatório não comprovado)
  2. Solicitar correção (Notificação para ajuste de anúncio)
  3. Medida restritiva (Suspensão preventiva)
- **Mandatory Justification**: All decisions require explicit technical rationale before preview.
- **Fail-Closed Execution**: Simulation preview confirms into a clear non-executed blocked state with zero persistent mutation.
`;

    fs.writeFileSync(path.join(ROOT_SCREENSHOTS_DIR, 'FIGMA-COMPARISON-NOTES.md'), figmaNotes);

    // =========================================================================
    // 6. CREATE ZIP ARCHIVE
    // =========================================================================
    const zipPath = path.join(ROOT_SCREENSHOTS_DIR, 'admin-b5a-visual-proof.zip');
    const artifactZipPath = path.join(ARTIFACTS_DIR, 'admin-b5a-visual-proof.zip');

    console.log('\nCreating visual-proof ZIP archive...');
    execSync(
      `powershell -Command "Compress-Archive -Path '${ROOT_SCREENSHOTS_DIR}\\*' -DestinationPath '${zipPath}' -Force"`,
      { stdio: 'inherit' },
    );

    if (fs.existsSync(zipPath)) {
      fs.copyFileSync(zipPath, artifactZipPath);
      console.log(`[ZIP Created] ${zipPath}`);
    }
  } catch (err) {
    console.error('QA Execution Error:', err);
    process.exit(1);
  } finally {
    await browser.close();
    server.close();
    console.log('QA teardown complete.');
  }
}

main().catch(console.error);


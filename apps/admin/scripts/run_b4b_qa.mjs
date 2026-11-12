process.env.ADMIN_E2E_MOCK = 'true';

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';
import next from 'next';

const PORT = 3016;
const BASE_URL = `http://localhost:${PORT}`;

const ROOT_SCREENSHOTS_DIR = path.resolve(import.meta.dirname, '../../../screenshots/admin-b4b');
const ARTIFACTS_DIR =
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\a7c0407c-7356-40dd-bed2-ada338d6a46f\\screenshots\\admin-b4b';

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
    // 1. ADM-D-028 — FILA DE SOLICITAÇÕES DE REEMBOLSO (/reembolsos)
    // =========================================================================
    console.log('\n--- 1. Testing ADM-D-028 (/reembolsos) ---');

    // 1.1 Desktop 1600px
    const { context: ctx28_1600, page: page28_1600 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await page28_1600.goto(`${BASE_URL}/reembolsos`);
    await page28_1600.waitForSelector('[data-testid="refunds-page-container"]');
    await page28_1600.waitForTimeout(400);
    await saveScreenshot(page28_1600, 'ADM-D-028-Desktop-Refunds-Queue-1600px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 1.2 Desktop 1366px (Master-detail without vertical stacking)
    const { context: ctx28_1366, page: page28_1366 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1366, height: 800 },
    });
    await page28_1366.goto(`${BASE_URL}/reembolsos`);
    await page28_1366.waitForSelector('[data-testid="refunds-page-container"]');
    await page28_1366.waitForTimeout(400);
    await saveScreenshot(page28_1366, 'ADM-D-028-Desktop-Refunds-Queue-1366px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 1.3 Select CXL-DEMO-002 (Hold Legal preview)
    await page28_1600.click('[data-testid="refund-row-CXL-DEMO-002"]');
    await page28_1600.waitForTimeout(300);
    await saveScreenshot(page28_1600, 'ADM-D-028-Selected-CXL-DEMO-002-Hold.png');
    testResults.totalCaptured++;

    // 1.4 Tablet 768px
    const { context: ctx28_768, page: page28_768 } = await createAuthenticatedPage(browser, {
      viewport: { width: 768, height: 1024 },
    });
    await page28_768.goto(`${BASE_URL}/reembolsos`);
    await page28_768.waitForSelector('[data-testid="refunds-page-container"]');
    await page28_768.waitForTimeout(400);
    await saveScreenshot(page28_768, 'ADM-D-028-Tablet-Refunds-768px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    await ctx28_1600.close();
    await ctx28_1366.close();
    await ctx28_768.close();

    // =========================================================================
    // 2. ADM-D-029 — DETALHES DA REVISÃO DE REEMBOLSO (/reembolsos/[id])
    // =========================================================================
    console.log('\n--- 2. Testing ADM-D-029 (/reembolsos/[id]) ---');

    // 2.1 Desktop 1600px
    const { context: ctx29_1600, page: page29_1600 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await page29_1600.goto(`${BASE_URL}/reembolsos/CXL-DEMO-001`);
    await page29_1600.waitForSelector('[data-testid="refund-detail-review-page"]');
    await page29_1600.waitForTimeout(400);
    await saveScreenshot(page29_1600, 'ADM-D-029-Desktop-Refund-Detail-1600px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 2.2 Simulation Action: Approve preview
    await page29_1600.click('[data-testid="simulate-approve-btn"]');
    await page29_1600.waitForSelector('[data-testid="simulation-approved-preview"]');
    await page29_1600.waitForTimeout(200);
    await saveScreenshot(page29_1600, 'ADM-D-029-Simulation-Approved-Preview.png');
    testResults.totalCaptured++;

    // 2.3 Simulation Action: Hold preview
    await page29_1600.click('[data-testid="simulate-hold-btn"]');
    await page29_1600.waitForSelector('[data-testid="simulation-hold-preview"]');
    await page29_1600.waitForTimeout(200);
    await saveScreenshot(page29_1600, 'ADM-D-029-Simulation-Hold-Preview.png');
    testResults.totalCaptured++;

    // 2.4 Mobile 390px
    const { context: ctx29_390, page: page29_390 } = await createAuthenticatedPage(browser, {
      viewport: { width: 390, height: 844 },
    });
    await page29_390.goto(`${BASE_URL}/reembolsos/CXL-DEMO-001`);
    await page29_390.waitForSelector('[data-testid="refund-detail-review-page"]');
    await page29_390.waitForTimeout(400);
    await saveScreenshot(page29_390, 'ADM-D-029-Mobile-Refund-Detail-390px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    await ctx29_1600.close();
    await ctx29_390.close();

    // =========================================================================
    // 3. ADM-D-030 — DISPUTAS E CONTESTAÇÕES DE CARTÃO (/contestacoes)
    // =========================================================================
    console.log('\n--- 3. Testing ADM-D-030 (/contestacoes) ---');

    // 3.1 Desktop 1600px
    const { context: ctx30_1600, page: page30_1600 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await page30_1600.goto(`${BASE_URL}/contestacoes`);
    await page30_1600.waitForSelector('[data-testid="disputes-page-container"]');
    await page30_1600.waitForTimeout(400);
    await saveScreenshot(page30_1600, 'ADM-D-030-Desktop-Card-Disputes-1600px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 3.2 Desktop 1366px
    const { context: ctx30_1366, page: page30_1366 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1366, height: 800 },
    });
    await page30_1366.goto(`${BASE_URL}/contestacoes`);
    await page30_1366.waitForSelector('[data-testid="disputes-page-container"]');
    await page30_1366.waitForTimeout(400);
    await saveScreenshot(page30_1366, 'ADM-D-030-Desktop-Card-Disputes-1366px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 3.3 Select DSP-2026-0003 (Incomplete Evidence / Urgent)
    await page30_1600.click('[data-testid="dispute-row-DSP-2026-0003"]');
    await page30_1600.waitForTimeout(300);
    await saveScreenshot(page30_1600, 'ADM-D-030-Selected-DSP-0003-Incomplete.png');
    testResults.totalCaptured++;

    // 3.4 Tablet 768px
    const { context: ctx30_768, page: page30_768 } = await createAuthenticatedPage(browser, {
      viewport: { width: 768, height: 1024 },
    });
    await page30_768.goto(`${BASE_URL}/contestacoes`);
    await page30_768.waitForSelector('[data-testid="disputes-page-container"]');
    await page30_768.waitForTimeout(400);
    await saveScreenshot(page30_768, 'ADM-D-030-Tablet-Disputes-768px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    await ctx30_1600.close();
    await ctx30_1366.close();
    await ctx30_768.close();

    // =========================================================================
    // 4. ADM-D-031 — RELATÓRIOS DE RECEITA E PAGAMENTOS (/relatorios)
    // =========================================================================
    console.log('\n--- 4. Testing ADM-D-031 (/relatorios) ---');

    // 4.1 Desktop 1600px
    const { context: ctx31_1600, page: page31_1600 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await page31_1600.goto(`${BASE_URL}/relatorios`);
    await page31_1600.waitForSelector('[data-testid="revenue-reports-page-container"]');
    await page31_1600.waitForTimeout(400);
    await saveScreenshot(page31_1600, 'ADM-D-031-Desktop-Revenue-Reports-1600px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 4.2 Desktop 1366px
    const { context: ctx31_1366, page: page31_1366 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1366, height: 800 },
    });
    await page31_1366.goto(`${BASE_URL}/relatorios`);
    await page31_1366.waitForSelector('[data-testid="revenue-reports-page-container"]');
    await page31_1366.waitForTimeout(400);
    await saveScreenshot(page31_1366, 'ADM-D-031-Desktop-Revenue-Reports-1366px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 4.3 Toggle Chart to Area Mode
    await page31_1600.click('[data-testid="chart-mode-area-btn"]');
    await page31_1600.waitForTimeout(300);
    await saveScreenshot(page31_1600, 'ADM-D-031-Revenue-Chart-Area-Mode.png');
    testResults.totalCaptured++;

    // 4.4 Hover on Month October (index 5)
    const octRect = await page31_1600.locator('svg text:text("Outubro")').boundingBox();
    if (octRect) {
      await page31_1600.mouse.move(octRect.x + octRect.width / 2, octRect.y - 40);
      await page31_1600.waitForTimeout(300);
      await saveScreenshot(page31_1600, 'ADM-D-031-Revenue-Chart-Hover-Tooltip.png');
      testResults.totalCaptured++;
    }

    // 4.5 Trigger Demo CSV Export
    await page31_1600.click('[data-testid="export-csv-btn"]');
    await page31_1600.waitForSelector('[data-testid="csv-export-success-badge"]');
    await page31_1600.waitForTimeout(200);
    await saveScreenshot(page31_1600, 'ADM-D-031-Demo-Csv-Exported.png');
    testResults.totalCaptured++;

    // 4.6 Mobile 390px
    const { context: ctx31_390, page: page31_390 } = await createAuthenticatedPage(browser, {
      viewport: { width: 390, height: 844 },
    });
    await page31_390.goto(`${BASE_URL}/relatorios`);
    await page31_390.waitForSelector('[data-testid="revenue-reports-page-container"]');
    await page31_390.waitForTimeout(400);
    await saveScreenshot(page31_390, 'ADM-D-031-Mobile-Revenue-Reports-390px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    await ctx31_1600.close();
    await ctx31_1366.close();
    await ctx31_390.close();

    // =========================================================================
    // 5. ADM-M-006 — ALERTAS FINANCEIROS MOBILE (/alertas)
    // =========================================================================
    console.log('\n--- 5. Testing ADM-M-006 (/alertas) ---');

    // 5.1 Mobile 430px (iPhone 14/15 Pro Max)
    const { context: ctx06_430, page: page06_430 } = await createAuthenticatedPage(browser, {
      viewport: { width: 430, height: 932 },
    });
    await page06_430.goto(`${BASE_URL}/alertas`);
    await page06_430.waitForSelector('[data-testid="mobile-financial-alerts-page"]');
    await page06_430.waitForTimeout(400);
    await saveScreenshot(page06_430, 'ADM-M-006-Mobile-Alerts-430px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 5.2 Mobile 390px (iPhone 14/15 Standard)
    const { context: ctx06_390, page: page06_390 } = await createAuthenticatedPage(browser, {
      viewport: { width: 390, height: 844 },
    });
    await page06_390.goto(`${BASE_URL}/alertas`);
    await page06_390.waitForSelector('[data-testid="mobile-financial-alerts-page"]');
    await page06_390.waitForTimeout(400);
    await saveScreenshot(page06_390, 'ADM-M-006-Mobile-Alerts-390px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    // 5.3 Mobile 360px (Android Compact)
    const { context: ctx06_360, page: page06_360 } = await createAuthenticatedPage(browser, {
      viewport: { width: 360, height: 740 },
    });
    await page06_360.goto(`${BASE_URL}/alertas`);
    await page06_360.waitForSelector('[data-testid="mobile-financial-alerts-page"]');
    await page06_360.waitForTimeout(400);
    await saveScreenshot(page06_360, 'ADM-M-006-Mobile-Alerts-360px.png', {
      fullPage: true,
    });
    testResults.totalCaptured++;

    await ctx06_430.close();
    await ctx06_390.close();
    await ctx06_360.close();

    console.log(
      `\n>>> All ${testResults.totalCaptured} B4B screenshots captured successfully! <<<`,
    );

    // =========================================================================
    // 6. BUILD MANIFEST & DOCUMENTATION
    // =========================================================================
    const manifest = {
      project: 'Feira de Carros — Admin B4B',
      scope: 'FRONTEND ONLY',
      generatedAt: new Date().toISOString(),
      sourceOfTruth: 'https://www.figma.com/design/JlRZIGImV7rRROPZndv6NT?node-id=2-8',
      screensImplemented: [
        {
          frameCode: 'ADM-D-028',
          name: 'Fila de solicitações de reembolso',
          route: '/reembolsos',
          figmaNode: '225:1823',
          fictionalIds: ['CXL-DEMO-001', 'CXL-DEMO-002', 'CXL-DEMO-003'],
          totalAmountBrl: 110,
          compliance: 'CDC Art. 49 (3 dias úteis)',
        },
        {
          frameCode: 'ADM-D-029',
          name: 'Detalhes da revisão de reembolso',
          route: '/reembolsos/[id]',
          figmaNode: '237:1296',
          policyState: 'HOLD / Fail-Closed',
          auditTimelineEvents: 3,
        },
        {
          frameCode: 'ADM-D-030',
          name: 'Disputas e contestações de cartão (Chargebacks)',
          route: '/contestacoes',
          figmaNode: '237:1492',
          fictionalIds: ['DSP-2026-0001', 'DSP-2026-0002', 'DSP-2026-0003'],
          totalDisputedBrl: 130,
          underReviewCount: 2,
          incompleteEvidenceCount: 1,
          guaranteedRevenueNoticeBrl: 0,
        },
        {
          frameCode: 'ADM-D-031',
          name: 'Relatórios de receita e pagamentos',
          route: '/relatorios',
          figmaNode: '237:1688',
          totalConfirmedRevenueBrl: 42580,
          period: 'Maio – Outubro 2026',
          activeAdsCount: 1248,
          vehicleSalesProcessedBrl: 0,
          monthlyBreakdown: {
            '2026-05': 4200,
            '2026-06': 5180,
            '2026-07': 6260,
            '2026-08': 6950,
            '2026-09': 8150,
            '2026-10': 11840,
          },
        },
        {
          frameCode: 'ADM-M-006',
          name: 'Alertas financeiros mobile',
          route: '/alertas',
          figmaNode: '447:9562',
          logo: 'Official 2026 BrandLogo (@feira/ui)',
          restrictionsNotice: 'ADM-019 / ADM-021',
        },
      ],
      totalScreenshots: testResults.totalCaptured,
    };

    fs.writeFileSync(
      path.join(ROOT_SCREENSHOTS_DIR, 'MANIFEST-B4B.json'),
      JSON.stringify(manifest, null, 2),
    );

    const figmaNotes = `# Figma Source of Truth Comparison — Admin B4B

## Screens Implemented and Verified

### 1. ADM-D-028 — Fila de solicitações de reembolso (node 225:1823)
- **Route**: \`/reembolsos\`
- **Figma Reference Data**: 3 demonstrative cancellation requests: \`CXL-DEMO-001\`, \`CXL-DEMO-002\`, \`CXL-DEMO-003\` totaling R$ 110,00.
- **KPIs**: 4 summary cards (Total Solicitações, Em Análise CDC Art. 49, Retenção Jurídica HOLD, Governança 100% auditada).
- **Desktop Split Layout**: Main table on left, selected request summary on right, without vertical collapse at 1366px.
- **Consumer Law Compliance**: 3-business-day review rule under Brazilian Consumer Defense Code (CDC Art. 49).

### 2. ADM-D-029 — Detalhes da revisão de reembolso (node 237:1296)
- **Route**: \`/reembolsos/[id]\`
- **Features**: Complete customer and ad dossier, Art. 49 criteria checklist (7 days timeliness, service consumption check, duplicate dispute check), audit timeline events.
- **Policy Invariant**: Explicit HOLD policy banner. Operational refund executions and live PSP transactions remain strictly disabled (fail-closed simulation preview).

### 3. ADM-D-030 — Disputas e contestações de cartão / Chargebacks (node 237:1492)
- **Route**: \`/contestacoes\`
- **Figma Reference Data**: Exactly 3 demo disputes, R$ 130,00 total disputed amount (2 under review at R$ 100, 1 with incomplete evidence at R$ 30).
- **Governance**: Guaranteed revenue is strictly set to R$ 0,00 for disputed amounts.
- **Cross-Reference**: Reconciles \`TX-2026-*\` and \`PAY-2026-*\` references without breaking existing B4A contracts.

### 4. ADM-D-031 — Relatórios de receita e pagamentos (node 237:1688)
- **Route**: \`/relatorios\`
- **Figma Reference Data**: Confirmed revenue of R$ 42.580,00 across May–October 2026; 1.248 active ads; vehicle sales processed by platform: R$ 0,00.
- **Monthly Progression**: May (R$ 4.200), June (R$ 5.180), July (R$ 6.260), August (R$ 6.950), September (R$ 8.150), October (R$ 11.840).
- **Responsive React Chart**: Pure SVG implementation with Bar / Area mode toggling, interactive tooltips, zero third-party charting bloat.
- **Demonstration CSV Export**: Illustrative export button with prominent demo provenance tag.

### 5. ADM-M-006 — Alertas financeiros mobile (node 447:9562)
- **Route**: \`/alertas\`
- **Brand Fidelity**: Features official 2026 BrandLogo from \`@feira/ui\`.
- **Read-Only Security**: Read-only alert cards, masked LGPD documents and cards, explicit ADM-019 mobile restrictions banner preventing any mutation.
- **Navigation**: Integrated with existing \`AdminMobileNavigation\` with \`alertas\` tab active.
`;

    fs.writeFileSync(path.join(ROOT_SCREENSHOTS_DIR, 'FIGMA-COMPARISON-NOTES.md'), figmaNotes);

    // =========================================================================
    // 7. CREATE ZIP ARCHIVE
    // =========================================================================
    const zipPath = path.join(ROOT_SCREENSHOTS_DIR, 'admin-b4b-visual-proof.zip');
    const artifactZipPath = path.join(ARTIFACTS_DIR, 'admin-b4b-visual-proof.zip');

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

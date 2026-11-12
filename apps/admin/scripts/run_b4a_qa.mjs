process.env.ADMIN_E2E_MOCK = 'true';

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from '@playwright/test';
import next from 'next';

const PORT = 3014;
const BASE_URL = `http://localhost:${PORT}`;

const ROOT_SCREENSHOTS_DIR = path.resolve(import.meta.dirname, '../../../screenshots/admin-b4a');
const ARTIFACTS_DIR =
  'C:\\Users\\rakib_bro\\.gemini\\antigravity\\brain\\a7c0407c-7356-40dd-bed2-ada338d6a46f\\screenshots\\admin-b4a';

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

  try {
    // =========================================================================
    // 1. DESKTOP 1600px (Figma ADM-D-024 — Transações de pagamentos)
    // =========================================================================
    console.log('\n--- Testing Desktop 1600px (ADM-D-024) ---');
    const { context: ctx1600, page: page1600 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await page1600.goto(`${BASE_URL}/pagamentos`);
    await page1600.waitForSelector('[data-testid="transactions-table"]');
    await page1600.waitForTimeout(500);
    await saveScreenshot(page1600, 'ADM-D-024-Desktop-Transactions-1600px.png', {
      fullPage: true,
    });

    // 2. Select TX-2026-0005 (Pending Cash)
    console.log('\n--- Selecting TX-2026-0005 (Pending Cash) ---');
    await page1600.click('[data-testid="transaction-row-TX-2026-0005"]');
    await page1600.waitForTimeout(300);
    await saveScreenshot(page1600, 'ADM-D-024-Selected-TX-0005-Pending-Cash.png', {
      fullPage: true,
    });
    await ctx1600.close();

    // =========================================================================
    // 3. DESKTOP 1366px (ADM-D-024 Responsive Laptop)
    // =========================================================================
    console.log('\n--- Testing Desktop 1366px ---');
    const { context: ctx1366, page: page1366 } = await createAuthenticatedPage(browser, {
      viewport: { width: 1366, height: 800 },
    });
    await page1366.goto(`${BASE_URL}/pagamentos`);
    await page1366.waitForSelector('[data-testid="transactions-table"]');
    await page1366.waitForTimeout(500);
    await saveScreenshot(page1366, 'ADM-D-024-Desktop-Transactions-1366px.png', {
      fullPage: true,
    });
    await ctx1366.close();

    // =========================================================================
    // 4. DESKTOP ADM-D-025 (Detalhes da transação — node 225:1160)
    // =========================================================================
    console.log('\n--- Testing ADM-D-025 (Transaction Detail) ---');
    const { context: ctxDetail, page: pageDetail } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await pageDetail.goto(`${BASE_URL}/pagamentos/TX-2026-0001`);
    await pageDetail.waitForSelector('[data-testid="transaction-detail-view"]');
    await pageDetail.waitForTimeout(500);
    await saveScreenshot(pageDetail, 'ADM-D-025-Desktop-Transaction-Detail-1600px.png', {
      fullPage: true,
    });
    await ctxDetail.close();

    // =========================================================================
    // 5. DESKTOP ADM-D-026 (Registrar pagamento em dinheiro — node 225:1381)
    // =========================================================================
    console.log('\n--- Testing ADM-D-026 (Cash Registration Preview & Dialogs) ---');
    const { context: ctxCash, page: pageCash } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await pageCash.goto(`${BASE_URL}/pagamentos/TX-2026-0005/dinheiro`);
    await pageCash.waitForSelector('[data-testid="cash-registration-page"]');
    await pageCash.waitForTimeout(500);
    await saveScreenshot(pageCash, 'ADM-D-026-Desktop-Cash-Registration-Preview.png', {
      fullPage: true,
    });

    // Open confirmation dialog (STATE / ADM-D-026 / Confirmar cash presencial — node 231:1292)
    await pageCash.click('[data-testid="submit-cash-registration-btn"]');
    await pageCash.waitForSelector('[data-testid="cash-dialog-confirm-state"]');
    await pageCash.waitForTimeout(300);
    await saveScreenshot(pageCash, 'ADM-D-026-STATE-Cash-Confirmation-Dialog.png');

    // Proceed to blocked result state (STATE / ADM-D-026 / Bloqueio sem recibo confirmado — node 231:1311)
    await pageCash.click('[data-testid="cash-dialog-confirm-button"]');
    await pageCash.waitForSelector('[data-testid="cash-dialog-blocked-state"]');
    await pageCash.waitForTimeout(300);
    await saveScreenshot(pageCash, 'ADM-D-026-STATE-Cash-Blocked-Result.png');
    await ctxCash.close();

    // 5b. DESKTOP ADM-D-026 Unauthorized Role State
    console.log('\n--- Testing ADM-D-026 (Unauthorized Role State) ---');
    const { context: ctxUnauth, page: pageUnauth } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await pageUnauth.goto(`${BASE_URL}/pagamentos/TX-2026-0005/dinheiro?role=support`);
    await pageUnauth.waitForSelector('[data-testid="unauthorized-desktop-alert"]');
    await pageUnauth.waitForTimeout(400);
    await saveScreenshot(pageUnauth, 'ADM-D-026-STATE-Unauthorized-Role.png', {
      fullPage: true,
    });
    await ctxUnauth.close();

    // =========================================================================
    // 6. DESKTOP ADM-D-027 (Histórico de recebimentos em dinheiro — node 225:1602)
    // =========================================================================
    console.log('\n--- Testing ADM-D-027 (Cash Receipts Ledger & Modal) ---');
    const { context: ctxLedger, page: pageLedger } = await createAuthenticatedPage(browser, {
      viewport: { width: 1600, height: 1000 },
    });
    await pageLedger.goto(`${BASE_URL}/pagamentos/dinheiro`);
    await pageLedger.waitForSelector('[data-testid="cash-receipts-table"]');
    await pageLedger.waitForTimeout(500);
    await saveScreenshot(pageLedger, 'ADM-D-027-Desktop-Cash-Receipts-Ledger-1600px.png', {
      fullPage: true,
    });

    // Open read-only voucher modal
    await pageLedger.click('[data-testid="cash-receipt-row-REC-2026-0001"]');
    await pageLedger.waitForSelector('div[role="dialog"]');
    await pageLedger.waitForTimeout(300);
    await saveScreenshot(pageLedger, 'ADM-D-027-Cash-Receipt-Detail-Modal.png');
    await ctxLedger.close();

    // =========================================================================
    // 7. TABLET 768px
    // =========================================================================
    console.log('\n--- Testing Tablet 768px ---');
    const { context: ctxTablet, page: pageTablet } = await createAuthenticatedPage(browser, {
      viewport: { width: 768, height: 1024 },
    });
    await pageTablet.goto(`${BASE_URL}/pagamentos`);
    await pageTablet.waitForTimeout(500);
    await saveScreenshot(pageTablet, 'ADM-D-024-Tablet-Transactions-768px.png', {
      fullPage: true,
    });
    await ctxTablet.close();

    // =========================================================================
    // 8. MOBILE (Figma ADM-M-009 — Transações e pagamentos — node 468:9564)
    // =========================================================================
    console.log('\n--- Testing Mobile (ADM-M-009) ---');
    for (const vp of [
      { width: 390, height: 844, name: '390px' },
      { width: 360, height: 740, name: '360px' },
      { width: 430, height: 932, name: '430px' },
    ]) {
      const { context: ctxMobile, page: pageMobile } = await createAuthenticatedPage(browser, {
        viewport: { width: vp.width, height: vp.height },
        isMobile: true,
      });
      await pageMobile.goto(`${BASE_URL}/pagamentos`);
      await pageMobile.waitForSelector('[data-testid="mobile-finance-management"]');
      await pageMobile.waitForTimeout(400);
      await saveScreenshot(pageMobile, `ADM-M-009-Mobile-Finance-${vp.name}.png`, {
        fullPage: true,
      });

      // On 390px, also capture read-only inspection modal and mobile blocked cash route
      if (vp.width === 390) {
        await pageMobile.click('[data-testid="mobile-tx-card-TX-2026-0001"] button');
        await pageMobile.waitForSelector('div[role="dialog"]');
        await pageMobile.waitForTimeout(300);
        await saveScreenshot(pageMobile, 'ADM-M-009-Mobile-Inspection-Modal.png');

        // Capture mobile blocked cash registration route
        await pageMobile.goto(`${BASE_URL}/pagamentos/TX-2026-0005/dinheiro`);
        await pageMobile.waitForSelector('[data-testid="mobile-cash-registration-blocked"]');
        await pageMobile.waitForTimeout(300);
        await saveScreenshot(pageMobile, 'ADM-D-026-Mobile-Cash-Blocked-390px.png', {
          fullPage: true,
        });
      }

      await ctxMobile.close();
    }

    console.log('\n===========================================');
    console.log('✓ All B4A QA Screenshots Captured Successfully!');
    console.log('===========================================\n');
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error('QA Runner Failed:', err);
  process.exit(1);
});

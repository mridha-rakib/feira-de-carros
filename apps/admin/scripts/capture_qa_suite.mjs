import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const ARTIFACT_DIR =
  'C:\\Users\\rakib_bro\\.gemini\\antigravity-ide\\brain\\530a5e72-fdfa-4a8f-a3a0-09435cc5907b\\screenshots';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function runQA() {
  console.log('Launching Edge browser...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
  });

  const page = await context.newPage();

  // 1. ADM-D-001 Desktop Login (1600x900)
  console.log('Testing ADM-D-001 (1600x900)...');
  await page.goto('http://localhost:3003/login');
  await page.waitForSelector('text=Acesso Administrativo');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'adm_d_001_login_1600.png'),
    fullPage: false,
  });

  // 401 Error test (type wrong password)
  console.log('Testing 401 error...');
  await page.fill('#admin-email', 'admin@feiradecarros.com.br');
  await page.fill('#admin-password', 'wrong-password');
  await page.click('button:has-text("Entrar no Painel")');
  await page.waitForSelector('text=Credenciais inválidas');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'adm_d_001_login_error_401.png'),
    fullPage: false,
  });

  // 403 Error test (type unauthorized email)
  console.log('Testing 403 forbidden error...');
  await page.fill('#admin-email', 'denied@feiradecarros.com.br');
  await page.fill('#admin-password', 'staff123');
  await page.click('button:has-text("Entrar no Painel")');
  await page.waitForSelector('text=Acesso negado');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'adm_d_001_login_forbidden_403.png'),
    fullPage: false,
  });

  // 1366x768 login
  console.log('Testing ADM-D-001 (1366x768)...');
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'adm_d_001_login_1366.png'),
    fullPage: false,
  });

  // Login with valid admin credentials
  console.log('Logging in with valid admin credentials...');
  await page.fill('#admin-email', 'admin@feiradecarros.com.br');
  await page.fill('#admin-password', 'admin123');
  await page.click('button:has-text("Entrar no Painel")');
  await page.waitForURL((url) => url.pathname === '/');
  console.log('Navigated to overview page! URL:', page.url());

  // Wait for overview content
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.waitForSelector('text=Painel Administrativo — ADM-D-002');
  await page.waitForTimeout(600);

  // 2. ADM-D-002 Desktop Admin Overview (1600x900)
  console.log('Capturing ADM-D-002 Desktop Overview (1600x900)...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'adm_d_002_overview_1600.png'),
    fullPage: false,
  });

  // 1366x768 overview
  console.log('Capturing ADM-D-002 Desktop Overview (1366x768)...');
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'adm_d_002_overview_1366.png'),
    fullPage: false,
  });

  // Scenario: Empty (0 dados)
  console.log('Testing scenario: empty...');
  await page.goto('http://localhost:3003/?scenario=empty&qa=1');
  await page.waitForSelector('text=Nenhum Anúncio Cadastrado');
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'adm_d_002_overview_empty.png'),
    fullPage: false,
  });

  // Scenario: Error (500)
  console.log('Testing scenario: error (500)...');
  await page.goto('http://localhost:3003/?scenario=error&qa=1');
  await page.waitForSelector('text=Falha ao Carregar Métricas');
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'adm_d_002_overview_error_500.png'),
    fullPage: false,
  });

  // Scenario: Forbidden (403)
  console.log('Testing scenario: forbidden (403)...');
  await page.goto('http://localhost:3003/?scenario=forbidden&qa=1');
  await page.waitForSelector('text=Acesso Restrito ao Painel (403)');
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'adm_d_002_overview_forbidden_403.png'),
    fullPage: false,
  });

  // Restore success
  console.log('Restoring normal scenario...');
  await page.goto('http://localhost:3003/');
  await page.waitForSelector('text=Painel Administrativo — ADM-D-002');
  await page.waitForTimeout(600);

  // 3. Tablet Width (768px)
  console.log('Capturing Tablet Overview (768x1024)...');
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'adm_tablet_overview_768.png'),
    fullPage: false,
  });

  // 4. Mobile Views: ADM-M-001 (Overview)
  const mobileViewports = [
    { width: 360, height: 740, name: '360' },
    { width: 375, height: 667, name: '375' },
    { width: 390, height: 844, name: '390' },
    { width: 430, height: 932, name: '430' },
  ];

  for (const vp of mobileViewports) {
    console.log(`Capturing ADM-M-001 Mobile Overview (${vp.width}x${vp.height})...`);
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, `adm_m_001_overview_${vp.name}.png`),
      fullPage: false,
    });
  }

  // 5. Mobile Login ADM-M-013 at 390px and 360px
  console.log('Capturing ADM-M-013 Mobile Login (390x844)...');
  await page.goto('http://localhost:3003/login');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForSelector('text=Acesso Administrativo');
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'adm_m_013_login_390.png'),
    fullPage: false,
  });

  console.log('Capturing ADM-M-013 Mobile Login (360x740)...');
  await page.setViewportSize({ width: 360, height: 740 });
  await page.waitForSelector('text=Acesso Administrativo');
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, 'adm_m_013_login_360.png'),
    fullPage: false,
  });

  await context.close();
  await browser.close();
  console.log('SUCCESS! All QA screenshots captured cleanly.');
}

runQA().catch((err) => {
  console.error('QA script error:', err);
  process.exit(1);
});

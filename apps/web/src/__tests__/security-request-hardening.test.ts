import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  authenticateDemoLogin,
  getRoleDestination,
  isSafeRedirect,
} from '../../lib/adapters/shared-auth-registry';
import {
  isCanonicalProductionDomain,
  isClientDemoPreviewEnvironment,
  isExplicitDevOrTest,
  isProductionEnvironment,
} from '../../lib/security/environment';
import { verifyWebSession } from '../../lib/security/session-verifier';
import { middleware } from '../../middleware';
import { useDealerStore } from '../../stores/use-dealer-store';

describe('Security Hardening — Elimination of Request-Controlled Authentication Bypasses', () => {
  const envMap = process.env as Record<string, string | undefined>;
  const originalNodeEnv = envMap.NODE_ENV;
  const originalFeiraE2eMock = envMap.FEIRA_E2E_MOCK;
  const originalNextPublicDemo = envMap.NEXT_PUBLIC_ENABLE_DEMO_AUTH;
  const originalPreviewMode = envMap.FEIRA_CLIENT_DEMO_PREVIEW_MODE;
  const originalNextPublicPreview = envMap.NEXT_PUBLIC_FEIRA_CLIENT_DEMO_PREVIEW_MODE;
  const originalVercelEnv = envMap.VERCEL_ENV;
  const originalVercelUrl = envMap.VERCEL_URL;

  beforeEach(() => {
    envMap.NODE_ENV = 'production';
    envMap.FEIRA_E2E_MOCK = undefined;
    envMap.NEXT_PUBLIC_ENABLE_DEMO_AUTH = undefined;
    envMap.FEIRA_CLIENT_DEMO_PREVIEW_MODE = undefined;
    envMap.NEXT_PUBLIC_FEIRA_CLIENT_DEMO_PREVIEW_MODE = undefined;
    envMap.VERCEL_ENV = undefined;
    envMap.VERCEL_URL = undefined;
  });

  afterEach(() => {
    envMap.NODE_ENV = originalNodeEnv;
    envMap.FEIRA_E2E_MOCK = originalFeiraE2eMock;
    envMap.NEXT_PUBLIC_ENABLE_DEMO_AUTH = originalNextPublicDemo;
    envMap.FEIRA_CLIENT_DEMO_PREVIEW_MODE = originalPreviewMode;
    envMap.NEXT_PUBLIC_FEIRA_CLIENT_DEMO_PREVIEW_MODE = originalNextPublicPreview;
    envMap.VERCEL_ENV = originalVercelEnv;
    envMap.VERCEL_URL = originalVercelUrl;
  });

  // 1. ENVIRONMENT CONFIGURATION IMMUNITY
  describe('Environment Security Guard (isProductionEnvironment)', () => {
    it('fails closed to production in NODE_ENV=production regardless of NEXT_PUBLIC variables', () => {
      envMap.NODE_ENV = 'production';
      envMap.NEXT_PUBLIC_ENABLE_DEMO_AUTH = 'true'; // Untrusted client flag
      expect(isProductionEnvironment()).toBe(true);
      expect(isExplicitDevOrTest()).toBe(false);
    });

    it('fails closed to production when NODE_ENV is unset or invalid', () => {
      envMap.NODE_ENV = undefined;
      expect(isProductionEnvironment()).toBe(true);
    });

    it('permits test harness only when private server FEIRA_E2E_MOCK=true is explicitly set in production', () => {
      envMap.NODE_ENV = 'production';
      envMap.FEIRA_E2E_MOCK = 'true';
      expect(isProductionEnvironment()).toBe(false);
      expect(isExplicitDevOrTest()).toBe(true);
    });

    it('enables dev/test mode in NODE_ENV=test and NODE_ENV=development', () => {
      envMap.NODE_ENV = 'test';
      expect(isProductionEnvironment()).toBe(false);

      envMap.NODE_ENV = 'development';
      expect(isProductionEnvironment()).toBe(false);
    });
  });

  // 2. SERVER-SIDE SESSION VERIFICATION (verifyWebSession)
  describe('Session Verifier (verifyWebSession)', () => {
    it('CRITICAL: strictly fails closed in production and rejects mock tokens', () => {
      const mockTokens = [
        'demo_dealer_session',
        'demo_seller_session',
        'demo_buyer_session',
        'mock-buyer-session',
        'mock_active_session_token',
      ];

      for (const token of mockTokens) {
        const result = verifyWebSession(token, { isProduction: true });
        expect(result.isValid).toBe(false);
        expect(result.reason).toBe('PRODUCTION_AUTH_FAIL_CLOSED');
      }
    });

    it('CRITICAL: strictly rejects fabricated session values in production', () => {
      const fabricatedTokens = [
        'fabricated_dealer_session_token_123',
        'arbitrary_seller_session_val',
        'fake_token',
      ];

      for (const token of fabricatedTokens) {
        const result = verifyWebSession(token, { isProduction: true });
        expect(result.isValid).toBe(false);
        expect(result.reason).toBe('PRODUCTION_AUTH_FAIL_CLOSED');
      }
    });

    it('in dev/test mode: rejects fabricated tokens and substring tricks', () => {
      // Must not infer roles from substring
      const substringTricks = [
        'my_buyer_token',
        'fake_dealer_session',
        'admin_seller_impersonation',
        'unknown_random_token',
      ];

      for (const token of substringTricks) {
        const result = verifyWebSession(token, { isProduction: false });
        expect(result.isValid).toBe(false);
        expect(result.reason).toBe('INVALID_SESSION_TOKEN');
      }
    });

    it('in dev/test mode: accepts only exact registered fixture session tokens', () => {
      const dealerRes = verifyWebSession('demo_dealer_session', { isProduction: false });
      expect(dealerRes.isValid).toBe(true);
      expect(dealerRes.claim?.role).toBe('dealer');

      const sellerRes = verifyWebSession('demo_seller_session', { isProduction: false });
      expect(sellerRes.isValid).toBe(true);
      expect(sellerRes.claim?.role).toBe('seller');

      const buyerRes = verifyWebSession('demo_buyer_session', { isProduction: false });
      expect(buyerRes.isValid).toBe(true);
      expect(buyerRes.claim?.role).toBe('member');
    });
  });

  // 3. MIDDLEWARE REQUEST-CONTROLLED BYPASS RESISTANCE
  describe('Middleware Production Route Protection', () => {
    it('REGRESSION: blocks request with fdc_runtime_env=test cookie in production', () => {
      envMap.NODE_ENV = 'production';
      envMap.FEIRA_E2E_MOCK = undefined;

      const req = new NextRequest('https://feiradecarros.com.br/concessionaria/painel', {
        headers: {
          cookie: 'fdc_runtime_env=test; fdc_web_session=demo_dealer_session',
        },
      });

      const res = middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/entrar');
    });

    it('REGRESSION: blocks request with fdc_runtime_env=development cookie in production', () => {
      envMap.NODE_ENV = 'production';
      envMap.FEIRA_E2E_MOCK = undefined;

      const req = new NextRequest('https://feiradecarros.com.br/vendedor/anuncios', {
        headers: {
          cookie: 'fdc_runtime_env=development; fdc_web_session=demo_seller_session',
        },
      });

      const res = middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/entrar');
    });

    it('REGRESSION: blocks request with x-fdc-test-env: true header in production', () => {
      envMap.NODE_ENV = 'production';
      envMap.FEIRA_E2E_MOCK = undefined;

      const req = new NextRequest('https://feiradecarros.com.br/conta', {
        headers: {
          'x-fdc-test-env': 'true',
          cookie: 'fdc_web_session=demo_buyer_session',
        },
      });

      const res = middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/entrar');
    });

    it('REGRESSION: blocks fabricated fdc_web_session in production', () => {
      envMap.NODE_ENV = 'production';
      envMap.FEIRA_E2E_MOCK = undefined;

      const req = new NextRequest('https://feiradecarros.com.br/concessionaria/anuncios', {
        headers: {
          cookie: 'fdc_web_session=fabricated_session_value_xyz',
        },
      });

      const res = middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/entrar');
    });

    it('REGRESSION: blocks fabricated dealer/seller session values even with test query params', () => {
      envMap.NODE_ENV = 'production';
      envMap.FEIRA_E2E_MOCK = undefined;

      const req = new NextRequest(
        'https://feiradecarros.com.br/concessionaria/solicitacao/corrigir?demo=1&env=test',
        {
          headers: {
            cookie: 'fdc_web_session=fabricated_dealer_cookie_999',
          },
        },
      );

      const res = middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('/entrar');
    });
  });

  // 4. CROSS-ROLE BOUNDARY ENFORCEMENT IN LOCAL TEST HARNESS
  describe('Middleware Cross-Role Authorization (Dev/Test Harness)', () => {
    beforeEach(() => {
      envMap.NODE_ENV = 'test';
    });

    it('blocks Buyer session from accessing Dealership routes', () => {
      const req = new NextRequest('http://localhost:3000/concessionaria/painel', {
        headers: {
          cookie: 'fdc_web_session=demo_buyer_session',
        },
      });

      const res = middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('error=unauthorized_dealer_role_required');
    });

    it('blocks Buyer session from accessing Seller routes', () => {
      const req = new NextRequest('http://localhost:3000/vendedor/anuncios', {
        headers: {
          cookie: 'fdc_web_session=demo_buyer_session',
        },
      });

      const res = middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('error=unauthorized_seller_role_required');
    });

    it('blocks Seller session from accessing Dealership routes', () => {
      const req = new NextRequest('http://localhost:3000/concessionaria/anuncios', {
        headers: {
          cookie: 'fdc_web_session=demo_seller_session',
        },
      });

      const res = middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('error=unauthorized_dealer_role_required');
    });

    it('blocks Dealership session from accessing Buyer personal account routes', () => {
      const req = new NextRequest('http://localhost:3000/conta', {
        headers: {
          cookie: 'fdc_web_session=demo_dealer_session',
        },
      });

      const res = middleware(req);
      expect(res.status).toBe(307);
      expect(res.headers.get('location')).toContain('error=unauthorized_buyer_role_required');
    });

    it('permits authorized roles to their respective matching routes', () => {
      // Dealer on dealer route
      const dealerReq = new NextRequest(
        'http://localhost:3000/concessionaria/solicitacao/corrigir',
        {
          headers: {
            cookie: 'fdc_web_session=demo_dealer_session',
          },
        },
      );
      expect(middleware(dealerReq).status).toBe(200);

      // Buyer on buyer route
      const buyerReq = new NextRequest('http://localhost:3000/conta', {
        headers: {
          cookie: 'fdc_web_session=demo_buyer_session',
        },
      });
      expect(middleware(buyerReq).status).toBe(200);

      // Public entrypoints without session are permitted
      const publicReq = new NextRequest('http://localhost:3000/concessionaria/solicitacao');
      expect(middleware(publicReq).status).toBe(200);
    });
  });

  // 5. CROSS-ROLE REDIRECT PARAMETER REJECTION
  describe('Cross-Role Redirect Parameter Security', () => {
    it('sanitizes and blocks cross-role redirect parameters in getRoleDestination', () => {
      // Buyer attempting redirect into dealership portal is routed to /conta
      const buyerAttempt = getRoleDestination('member', 'active', '/concessionaria/painel');
      expect(buyerAttempt.destination).toBe('/conta');

      // Buyer attempting redirect into seller portal is routed to /conta
      const buyerSellerAttempt = getRoleDestination('member', 'active', '/vendedor/anuncios');
      expect(buyerSellerAttempt.destination).toBe('/conta');

      // Seller attempting redirect into dealership portal is routed to /vendedor/anuncios
      const sellerDealerAttempt = getRoleDestination('seller', 'active', '/concessionaria/painel');
      expect(sellerDealerAttempt.destination).toBe('/vendedor/anuncios');

      // Dealership attempting redirect into seller portal is routed to /concessionaria/anuncios
      const dealerSellerAttempt = getRoleDestination('dealer', 'active', '/vendedor/anuncios');
      expect(dealerSellerAttempt.destination).toBe('/concessionaria/anuncios');
    });

    it('rejects malicious open redirect vectors in middleware redirect query param', () => {
      envMap.NODE_ENV = 'production';

      const maliciousPaths = [
        '//evil.com',
        '/\\evil.com',
        'https://phishing.com',
        '/user:pass@evil.com',
      ];

      for (const mal of maliciousPaths) {
        expect(isSafeRedirect(mal)).toBe(false);
      }
    });
  });

  // 6. AUTHENTICATION ACTIONS FAIL-CLOSED IN PRODUCTION
  describe('Authentication Actions Fail-Closed in Production', () => {
    it('authenticateDemoLogin unconditionally rejects in production', () => {
      envMap.NODE_ENV = 'production';
      envMap.FEIRA_E2E_MOCK = undefined;

      const res = authenticateDemoLogin('dealer.aprovada@exemplo.com', '123456');
      expect(res.success).toBe(false);
      expect(res.error).toContain('Autenticação em produção indisponível');
    });

    it('loginSimulation in useDealerStore unconditionally rejects in production', () => {
      envMap.NODE_ENV = 'production';
      envMap.FEIRA_E2E_MOCK = undefined;

      const store = useDealerStore.getState();
      const success = store.loginSimulation('dealer.aprovada@exemplo.com');
      expect(success).toBe(false);
      expect(useDealerStore.getState().isAuthenticated).toBe(false);
    });
  });

  // 7. STATUS-AWARE TOKEN & MIDDLEWARE PROTECTION
  describe('Status-Aware Session Claims and Middleware Route Enforcement', () => {
    it('correctly maps status in registered fixture sessions', () => {
      expect(
        verifyWebSession('demo_dealer_pending_session', { isProduction: false }).claim,
      ).toEqual({
        id: 'acc-dealer-pending',
        email: 'dealer.pendente@exemplo.com',
        role: 'dealer',
        status: 'pending_approval',
      });

      expect(
        verifyWebSession('demo_dealer_correction_session', { isProduction: false }).claim,
      ).toEqual({
        id: 'acc-dealer-correction',
        email: 'dealer.corrigir@exemplo.com',
        role: 'dealer',
        status: 'correction_required',
      });

      expect(
        verifyWebSession('demo_dealer_suspended_session', { isProduction: false }).claim,
      ).toEqual({
        id: 'acc-dealer-suspended',
        email: 'dealer.suspenso@exemplo.com',
        role: 'dealer',
        status: 'suspended',
      });

      expect(
        verifyWebSession('demo_seller_pending_session', { isProduction: false }).claim,
      ).toEqual({
        id: 'acc-seller-pending',
        email: 'vendedor.pendente@exemplo.com',
        role: 'seller',
        status: 'pending_approval',
      });

      expect(
        verifyWebSession('demo_seller_correction_session', { isProduction: false }).claim,
      ).toEqual({
        id: 'acc-seller-correction',
        email: 'vendedor.corrigir@exemplo.com',
        role: 'seller',
        status: 'correction_required',
      });
    });

    it('middleware redirects suspended sessions to /entrar?status=suspensa', () => {
      envMap.NODE_ENV = 'test';
      envMap.FEIRA_E2E_MOCK = 'true';

      const req = new NextRequest('http://localhost:3000/concessionaria/anuncios', {
        headers: {
          cookie: 'fdc_web_session=demo_dealer_suspended_session',
        },
      });

      const response = middleware(req);
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('http://localhost:3000/entrar?status=suspensa');
    });

    it('middleware redirects pending seller to /vendedor/solicitacao/status', () => {
      envMap.NODE_ENV = 'test';
      envMap.FEIRA_E2E_MOCK = 'true';

      const req = new NextRequest('http://localhost:3000/vendedor/anuncios', {
        headers: {
          cookie: 'fdc_web_session=demo_seller_pending_session',
        },
      });

      const response = middleware(req);
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/vendedor/solicitacao/status',
      );
    });

    it('middleware redirects pending dealer to /concessionaria/solicitacao/status', () => {
      envMap.NODE_ENV = 'test';
      envMap.FEIRA_E2E_MOCK = 'true';

      const req = new NextRequest('http://localhost:3000/concessionaria/anuncios', {
        headers: {
          cookie: 'fdc_web_session=demo_dealer_pending_session',
        },
      });

      const response = middleware(req);
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe(
        'http://localhost:3000/concessionaria/solicitacao/status',
      );
    });
  });

  // 8. CLIENT DEMO PREVIEW ENVIRONMENT & CANONICAL PRODUCTION IMMUNITY
  describe('Client Demo Preview Mode Security Boundary', () => {
    it('enables client demo preview mode when FEIRA_CLIENT_DEMO_PREVIEW_MODE=true is set on server', () => {
      envMap.NODE_ENV = 'production';
      envMap.FEIRA_CLIENT_DEMO_PREVIEW_MODE = 'true';

      expect(isClientDemoPreviewEnvironment('feira-de-carros-preview.vercel.app')).toBe(true);
      expect(isProductionEnvironment('feira-de-carros-preview.vercel.app')).toBe(false);
      expect(isExplicitDevOrTest('feira-de-carros-preview.vercel.app')).toBe(true);
    });

    it('permits registered fixture session verification in client demo preview mode', () => {
      envMap.NODE_ENV = 'production';
      envMap.FEIRA_CLIENT_DEMO_PREVIEW_MODE = 'true';

      const buyerRes = verifyWebSession('demo_buyer_session');
      expect(buyerRes.isValid).toBe(true);
      expect(buyerRes.claim?.role).toBe('member');

      const sellerRes = verifyWebSession('demo_seller_session');
      expect(sellerRes.isValid).toBe(true);
      expect(sellerRes.claim?.role).toBe('seller');

      const dealerRes = verifyWebSession('demo_dealer_session');
      expect(dealerRes.isValid).toBe(true);
      expect(dealerRes.claim?.role).toBe('dealer');
    });

    it('CRITICAL: unconditionally fails closed on official production domains even if preview env vars are set', () => {
      envMap.NODE_ENV = 'production';
      envMap.FEIRA_CLIENT_DEMO_PREVIEW_MODE = 'true';
      envMap.NEXT_PUBLIC_FEIRA_CLIENT_DEMO_PREVIEW_MODE = 'true';

      const productionDomains = [
        'feiradecarros.com.br',
        'www.feiradecarros.com.br',
        'app.feiradecarros.com.br',
      ];

      for (const domain of productionDomains) {
        expect(isCanonicalProductionDomain(domain)).toBe(true);
        expect(isClientDemoPreviewEnvironment(domain)).toBe(false);
        expect(isProductionEnvironment(domain)).toBe(true);
      }
    });

    it('CRITICAL: ordinary production without preview env vars strictly fails closed and rejects mock authentication', () => {
      envMap.NODE_ENV = 'production';
      envMap.FEIRA_CLIENT_DEMO_PREVIEW_MODE = undefined;
      envMap.NEXT_PUBLIC_FEIRA_CLIENT_DEMO_PREVIEW_MODE = undefined;

      expect(isClientDemoPreviewEnvironment('feira-de-carros-preview.vercel.app')).toBe(false);
      expect(isProductionEnvironment('feira-de-carros-preview.vercel.app')).toBe(true);

      const result = verifyWebSession('demo_buyer_session');
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('PRODUCTION_AUTH_FAIL_CLOSED');
    });
  });
});

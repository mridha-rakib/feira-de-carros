import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getAuthAdapter } from '../../lib/adapters/auth-factory';
import { getDashboardAdapter } from '../../lib/adapters/dashboard-factory';
import { HttpAuthAdapter } from '../../lib/adapters/http-auth-adapter';
import { HttpDashboardAdapter } from '../../lib/adapters/http-dashboard-adapter';
import { MockAuthAdapter } from '../../lib/adapters/mock-auth-adapter';
import { MockDashboardAdapter } from '../../lib/adapters/mock-dashboard-adapter';
import { isExplicitDevOrTest, isProductionEnvironment } from '../../lib/security/environment';

describe('Security — Fail-Closed Production Environment Detection', () => {
  const envMap = process.env as Record<string, string | undefined>;
  const originalNodeEnv = envMap.NODE_ENV;
  const originalAppEnv = envMap.NEXT_PUBLIC_APP_ENV;
  const originalE2eMock = envMap.ADMIN_E2E_MOCK;

  beforeEach(() => {
    envMap.NODE_ENV = 'production';
    envMap.NEXT_PUBLIC_APP_ENV = undefined;
    envMap.ADMIN_E2E_MOCK = undefined;
  });

  afterEach(() => {
    envMap.NODE_ENV = originalNodeEnv;
    envMap.NEXT_PUBLIC_APP_ENV = originalAppEnv;
    envMap.ADMIN_E2E_MOCK = originalE2eMock;
  });

  it('fails closed to production when NEXT_PUBLIC_APP_ENV is undefined in production NODE_ENV', () => {
    envMap.NODE_ENV = 'production';
    envMap.NEXT_PUBLIC_APP_ENV = undefined;
    expect(isExplicitDevOrTest()).toBe(false);
    expect(isProductionEnvironment()).toBe(true);
  });

  it('fails closed to production when NEXT_PUBLIC_APP_ENV is misconfigured or unrecognized in production', () => {
    envMap.NODE_ENV = 'production';
    envMap.NEXT_PUBLIC_APP_ENV = 'staging';
    expect(isExplicitDevOrTest()).toBe(false);
    expect(isProductionEnvironment()).toBe(true);

    envMap.NEXT_PUBLIC_APP_ENV = 'unknown_env';
    expect(isExplicitDevOrTest()).toBe(false);
    expect(isProductionEnvironment()).toBe(true);
  });

  it('CRITICAL: in NODE_ENV=production, public NEXT_PUBLIC_APP_ENV=development CANNOT downgrade to mock', () => {
    envMap.NODE_ENV = 'production';
    envMap.NEXT_PUBLIC_APP_ENV = 'development';
    envMap.ADMIN_E2E_MOCK = undefined;

    // Must FAIL CLOSED to protect production deployments from public env misconfiguration
    expect(isExplicitDevOrTest()).toBe(false);
    expect(isProductionEnvironment()).toBe(true);
  });

  it('CRITICAL: in NODE_ENV=production, public NEXT_PUBLIC_APP_ENV=test CANNOT downgrade without private E2E harness', () => {
    envMap.NODE_ENV = 'production';
    envMap.NEXT_PUBLIC_APP_ENV = 'test';
    envMap.ADMIN_E2E_MOCK = undefined;

    // Must FAIL CLOSED in absence of private server-side test harness flag
    expect(isExplicitDevOrTest()).toBe(false);
    expect(isProductionEnvironment()).toBe(true);
  });

  it('in NODE_ENV=production, private ADMIN_E2E_MOCK=true enables local test runner fixtures', () => {
    envMap.NODE_ENV = 'production';
    envMap.ADMIN_E2E_MOCK = 'true';

    expect(isExplicitDevOrTest()).toBe(true);
    expect(isProductionEnvironment()).toBe(false);
  });

  it('in NODE_ENV=development, local dev mode is permitted', () => {
    envMap.NODE_ENV = 'development';
    envMap.NEXT_PUBLIC_APP_ENV = undefined;

    expect(isExplicitDevOrTest()).toBe(true);
    expect(isProductionEnvironment()).toBe(false);
  });

  it('factories select HTTP adapters (fail-closed) when in production with misconfigured public env', () => {
    envMap.NODE_ENV = 'production';
    envMap.NEXT_PUBLIC_APP_ENV = 'development'; // Attempted public downgrade
    envMap.ADMIN_E2E_MOCK = undefined;

    const authAdapter = getAuthAdapter();
    expect(authAdapter).toBeInstanceOf(HttpAuthAdapter);

    const dashboardAdapter = getDashboardAdapter();
    expect(dashboardAdapter).toBeInstanceOf(HttpDashboardAdapter);
  });

  it('mock auth adapter rejects login unconditionally in fail-closed production environment', async () => {
    envMap.NODE_ENV = 'production';
    envMap.NEXT_PUBLIC_APP_ENV = undefined;
    envMap.ADMIN_E2E_MOCK = undefined;

    const mockAuth = new MockAuthAdapter();
    await expect(
      mockAuth.login({
        email: 'admin@feiradecarros.com.br',
        password: 'any-password',
      }),
    ).rejects.toThrow('A autenticação simulada (mock) está estritamente desabilitada em produção');
  });

  it('mock dashboard adapter rejects getOverview unconditionally in fail-closed production environment', async () => {
    envMap.NODE_ENV = 'production';
    envMap.NEXT_PUBLIC_APP_ENV = undefined;
    envMap.ADMIN_E2E_MOCK = undefined;

    const mockDashboard = new MockDashboardAdapter();
    await expect(mockDashboard.getOverview()).rejects.toThrow(
      'O adaptador de dados simulados (mock) está estritamente desabilitado em produção',
    );
  });
});

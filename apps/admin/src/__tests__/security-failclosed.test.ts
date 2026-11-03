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

  beforeEach(() => {
    envMap.NODE_ENV = 'production';
    envMap.NEXT_PUBLIC_APP_ENV = undefined;
  });

  afterEach(() => {
    envMap.NODE_ENV = originalNodeEnv;
    envMap.NEXT_PUBLIC_APP_ENV = originalAppEnv;
  });

  it('fails closed to production when NEXT_PUBLIC_APP_ENV is undefined in production NODE_ENV', () => {
    envMap.NEXT_PUBLIC_APP_ENV = undefined;
    envMap.NODE_ENV = 'production';
    expect(isExplicitDevOrTest()).toBe(false);
    expect(isProductionEnvironment()).toBe(true);
  });

  it('fails closed to production when NEXT_PUBLIC_APP_ENV is misconfigured or unrecognized', () => {
    envMap.NEXT_PUBLIC_APP_ENV = 'staging';
    expect(isExplicitDevOrTest()).toBe(false);
    expect(isProductionEnvironment()).toBe(true);

    envMap.NEXT_PUBLIC_APP_ENV = 'unknown_env';
    expect(isExplicitDevOrTest()).toBe(false);
    expect(isProductionEnvironment()).toBe(true);
  });

  it('only enables dev/test when explicitly configured', () => {
    envMap.NEXT_PUBLIC_APP_ENV = 'development';
    expect(isExplicitDevOrTest()).toBe(true);
    expect(isProductionEnvironment()).toBe(false);

    envMap.NEXT_PUBLIC_APP_ENV = 'test';
    expect(isExplicitDevOrTest()).toBe(true);
    expect(isProductionEnvironment()).toBe(false);
  });

  it('factories select HTTP adapters (fail-closed) when NEXT_PUBLIC_APP_ENV is missing in production', () => {
    envMap.NODE_ENV = 'production';
    envMap.NEXT_PUBLIC_APP_ENV = undefined;

    const authAdapter = getAuthAdapter();
    expect(authAdapter).toBeInstanceOf(HttpAuthAdapter);

    const dashboardAdapter = getDashboardAdapter();
    expect(dashboardAdapter).toBeInstanceOf(HttpDashboardAdapter);
  });

  it('factories select HTTP adapters when NEXT_PUBLIC_APP_ENV is misconfigured', () => {
    envMap.NEXT_PUBLIC_APP_ENV = 'staging';

    const authAdapter = getAuthAdapter();
    expect(authAdapter).toBeInstanceOf(HttpAuthAdapter);

    const dashboardAdapter = getDashboardAdapter();
    expect(dashboardAdapter).toBeInstanceOf(HttpDashboardAdapter);
  });

  it('mock auth adapter rejects login unconditionally in fail-closed production environment', async () => {
    envMap.NODE_ENV = 'production';
    envMap.NEXT_PUBLIC_APP_ENV = undefined;

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

    const mockDashboard = new MockDashboardAdapter();
    await expect(mockDashboard.getOverview()).rejects.toThrow(
      'O adaptador de dados simulados (mock) está estritamente desabilitado em produção',
    );
  });
});

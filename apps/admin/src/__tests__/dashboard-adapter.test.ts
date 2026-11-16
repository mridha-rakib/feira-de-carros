import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getDashboardAdapter } from '../../lib/adapters/dashboard-factory';
import { HttpDashboardAdapter } from '../../lib/adapters/http-dashboard-adapter';
import {
  MockDashboardAdapter,
  mockDashboardAdapter,
} from '../../lib/adapters/mock-dashboard-adapter';

describe('mockDashboardAdapter & Dashboard Factory', () => {
  const envMap = process.env as Record<string, string | undefined>;
  const originalEnv = envMap.NODE_ENV;
  const originalAppEnv = envMap.NEXT_PUBLIC_APP_ENV;

  beforeEach(() => {
    envMap.NODE_ENV = 'test';
    envMap.NEXT_PUBLIC_APP_ENV = undefined;
  });

  afterEach(() => {
    envMap.NODE_ENV = originalEnv;
    envMap.NEXT_PUBLIC_APP_ENV = originalAppEnv;
  });

  it('returns valid simulated statistics matching Figma in success scenario', async () => {
    mockDashboardAdapter.setScenario('success');
    const data = await mockDashboardAdapter.getOverview();

    expect(data.total_users).toBe(682);
    expect(data.active_listings).toBe(1248);
    expect(data.pending_approvals).toBe(36);
  });

  it('returns zeroes in empty scenario', async () => {
    mockDashboardAdapter.setScenario('empty');
    const data = await mockDashboardAdapter.getOverview();

    expect(data.total_users).toBe(0);
    expect(data.active_listings).toBe(0);
    expect(data.pending_approvals).toBe(0);
  });

  it('throws 500 error in error_500 scenario', async () => {
    mockDashboardAdapter.setScenario('error_500');
    await expect(mockDashboardAdapter.getOverview()).rejects.toThrow(
      'Falha interna ao carregar métricas consolidadas',
    );
  });

  it('throws 403 forbidden error in forbidden_403 scenario', async () => {
    mockDashboardAdapter.setScenario('forbidden_403');
    await expect(mockDashboardAdapter.getOverview()).rejects.toThrow(
      'Acesso restrito ao painel administrativo',
    );
  });

  it('REGRESSION TEST (Finding F-02): strictly blocks mock dashboard data in production deployment', async () => {
    envMap.NEXT_PUBLIC_APP_ENV = 'production';
    const prodMockAdapter = new MockDashboardAdapter();

    await expect(prodMockAdapter.getOverview()).rejects.toThrow(
      'O adaptador de dados simulados (mock) está estritamente desabilitado em produção',
    );
  });

  it('REGRESSION TEST (Finding F-02): getDashboardAdapter selects HttpDashboardAdapter in production', () => {
    envMap.NEXT_PUBLIC_APP_ENV = 'production';
    const adapter = getDashboardAdapter();
    expect(adapter).toBeInstanceOf(HttpDashboardAdapter);
  });

  it('getDashboardAdapter selects MockDashboardAdapter in test/development', () => {
    envMap.NODE_ENV = 'test';
    const adapter = getDashboardAdapter();
    expect(adapter).toBeInstanceOf(MockDashboardAdapter);
  });
});

import { type AdminDashboardOverview, ApiError } from '@feira/api-client';
import type { MockScenario } from '../security/scenario-validator';
import type { AdminDashboardPort } from './dashboard-port';

/**
 * Mock Dashboard Adapter strictly isolated to development and test environments.
 * Strictly blocked in production mode to uphold production safety.
 */
export class MockDashboardAdapter implements AdminDashboardPort {
  constructor(private scenario: MockScenario = 'success') {}

  private isProduction(): boolean {
    if (typeof process === 'undefined') return false;
    return process.env.NEXT_PUBLIC_APP_ENV === 'production';
  }

  setScenario(scenario: MockScenario) {
    this.scenario = scenario;
  }

  getScenario(): MockScenario {
    return this.scenario;
  }

  async getOverview(): Promise<AdminDashboardOverview> {
    if (this.isProduction()) {
      throw new ApiError(
        403,
        'O adaptador de dados simulados (mock) está estritamente desabilitado em produção.',
        { code: 'MOCK_DATA_DISABLED_IN_PRODUCTION' },
      );
    }

    // Artificial latency for realistic testing
    await new Promise((resolve) => setTimeout(resolve, 250));

    if (this.scenario === 'forbidden_403') {
      throw new ApiError(
        403,
        'Acesso restrito ao painel administrativo. Sua conta não possui permissões suficientes.',
        {
          code: 'ACCESS_DENIED',
          request_id: 'req-mock-403',
          details: [{ field: 'role', reason: 'Requer perfil autorizado' }],
        },
      );
    }

    if (this.scenario === 'error_500') {
      throw new ApiError(500, 'Falha interna ao carregar métricas consolidadas do servidor.', {
        code: 'INTERNAL_SERVER_ERROR',
        request_id: 'req-mock-500',
      });
    }

    if (this.scenario === 'empty') {
      return {
        total_users: 0,
        active_listings: 0,
        pending_approvals: 0,
      };
    }

    // Default: Figma ADM-D-002 metrics
    return {
      total_users: 1248,
      active_listings: 1248,
      pending_approvals: 36,
    };
  }
}

export const mockDashboardAdapter = new MockDashboardAdapter();

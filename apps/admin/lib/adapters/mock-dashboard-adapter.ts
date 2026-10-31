import { type AdminDashboardOverview, ApiError } from '@feira/api-client';
import type { AdminDashboardPort } from './dashboard-port';

export type MockScenario = 'success' | 'empty' | 'error' | 'forbidden' | 'loading';

export class MockDashboardAdapter implements AdminDashboardPort {
  constructor(private scenario: MockScenario = 'success') {}

  setScenario(scenario: MockScenario) {
    this.scenario = scenario;
  }

  getScenario(): MockScenario {
    return this.scenario;
  }

  async getOverview(): Promise<AdminDashboardOverview> {
    // Artificial latency for realism
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (this.scenario === 'forbidden') {
      throw new ApiError(403, 'Acesso restrito ao perfil de Administrador Geral (main_admin).', {
        code: 'ACCESS_DENIED',
        request_id: 'req-mock-403',
        details: [{ field: 'role', reason: 'Requer perfil main_admin' }],
      });
    }

    if (this.scenario === 'error') {
      throw new ApiError(500, 'Falha interna ao carregar métricas consolidadas.', {
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

    // Default: Realistic Brazilian automotive marketplace demo statistics
    return {
      total_users: 1248,
      active_listings: 342,
      pending_approvals: 28,
    };
  }
}

export const mockDashboardAdapter = new MockDashboardAdapter();

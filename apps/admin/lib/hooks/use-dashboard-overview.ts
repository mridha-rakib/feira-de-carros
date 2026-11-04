import type { AdminDashboardOverview } from '@feira/api-client';
import { useQuery } from '@tanstack/react-query';
import { getDashboardAdapter } from '../adapters/dashboard-factory';
import type { MockScenario } from '../security/scenario-validator';

/**
 * Custom TanStack Query hook for dashboard overview server state.
 * Uses environment-safe adapter selection architecture.
 */
export function useDashboardOverview(scenario?: MockScenario) {
  return useQuery<AdminDashboardOverview>({
    queryKey: ['admin', 'dashboard', 'overview', scenario],
    queryFn: async () => {
      const adapter = getDashboardAdapter(scenario);
      return await adapter.getOverview();
    },
  });
}

import type { MockScenario } from '../security/scenario-validator';
import type { AdminDashboardPort } from './dashboard-port';
import { HttpDashboardAdapter, httpDashboardAdapter } from './http-dashboard-adapter';
import { MockDashboardAdapter, mockDashboardAdapter } from './mock-dashboard-adapter';

/**
 * Returns the appropriate dashboard adapter based on environment.
 * Production: HttpDashboardAdapter.
 * Development/Test: MockDashboardAdapter with optional scenario.
 */
export function getDashboardAdapter(scenario?: MockScenario): AdminDashboardPort {
  const isProduction =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_APP_ENV === 'production';

  if (isProduction) {
    return httpDashboardAdapter;
  }

  if (scenario) {
    mockDashboardAdapter.setScenario(scenario);
  }

  return mockDashboardAdapter;
}

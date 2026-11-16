import { isProductionEnvironment } from '../security/environment';
import type { MockScenario } from '../security/scenario-validator';
import type { AdminDashboardPort } from './dashboard-port';
import { HttpDashboardAdapter, httpDashboardAdapter } from './http-dashboard-adapter';
import { MockDashboardAdapter, mockDashboardAdapter } from './mock-dashboard-adapter';

/**
 * Returns the appropriate dashboard adapter based on environment.
 * Production / Non-Dev (Fail Closed): HttpDashboardAdapter.
 * Explicit Development/Test: MockDashboardAdapter with optional scenario.
 */
export function getDashboardAdapter(scenario?: MockScenario): AdminDashboardPort {
  if (isProductionEnvironment()) {
    return httpDashboardAdapter;
  }

  if (scenario) {
    mockDashboardAdapter.setScenario(scenario);
  }

  return mockDashboardAdapter;
}

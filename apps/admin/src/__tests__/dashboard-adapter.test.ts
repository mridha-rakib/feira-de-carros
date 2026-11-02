import { describe, expect, it } from 'vitest';
import { mockDashboardAdapter } from '../../lib/adapters/mock-dashboard-adapter';

describe('mockDashboardAdapter', () => {
  it('returns valid simulated statistics in success scenario', async () => {
    mockDashboardAdapter.setScenario('success');
    const data = await mockDashboardAdapter.getOverview();

    expect(data.total_users).toBeGreaterThan(0);
    expect(data.active_listings).toBeGreaterThan(0);
    expect(data.pending_approvals).toBeGreaterThan(0);
  });

  it('returns zeroes in empty scenario', async () => {
    mockDashboardAdapter.setScenario('empty');
    const data = await mockDashboardAdapter.getOverview();

    expect(data.total_users).toBe(0);
    expect(data.active_listings).toBe(0);
    expect(data.pending_approvals).toBe(0);
  });

  it('throws 500 error in error scenario', async () => {
    mockDashboardAdapter.setScenario('error');
    await expect(mockDashboardAdapter.getOverview()).rejects.toThrow();
  });

  it('throws 403 forbidden error in forbidden scenario', async () => {
    mockDashboardAdapter.setScenario('forbidden');
    await expect(mockDashboardAdapter.getOverview()).rejects.toThrow();
  });
});

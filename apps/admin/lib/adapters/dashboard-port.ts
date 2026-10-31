import type { AdminDashboardOverview } from '@feira/api-client';

export interface AdminDashboardPort {
  getOverview(): Promise<AdminDashboardOverview>;
}

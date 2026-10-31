/**
 * OpenAPI v0.2 Admin Dashboard Overview Schemas (API-106, SRS ADM-008, ANA-001)
 */
export interface AdminDashboardOverview {
  total_users: number;
  active_listings: number;
  pending_approvals: number;
}

export interface ResponseGetAdminOverview {
  data: AdminDashboardOverview;
  request_id: string;
  meta?: Record<string, unknown>;
}

import { type AdminDashboardOverview, ApiClient } from '@feira/api-client';
import { env } from '../../env';
import type { AdminDashboardPort } from './dashboard-port';

export class HttpDashboardAdapter implements AdminDashboardPort {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient({
      baseUrl: env.NEXT_PUBLIC_API_URL,
      getToken: () => {
        // In client-side execution, tokens can be fetched via cookie or auth service
        return null;
      },
    });
  }

  async getOverview(): Promise<AdminDashboardOverview> {
    const res = await this.client.get<{ data: AdminDashboardOverview }>('/admin/dashboard');
    return res.data;
  }
}

export const httpDashboardAdapter = new HttpDashboardAdapter();

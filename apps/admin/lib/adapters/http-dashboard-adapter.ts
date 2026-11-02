import { type AdminDashboardOverview, ApiClient, ApiError } from '@feira/api-client';
import type { AdminDashboardPort } from './dashboard-port';

/**
 * Real HTTP Dashboard Adapter implementing OpenAPI v0.2.
 * Connects to the backend server in production deployments.
 */
export class HttpDashboardAdapter implements AdminDashboardPort {
  private client: ApiClient;

  constructor(baseUrl?: string) {
    const apiUrl =
      baseUrl ||
      (typeof process !== 'undefined'
        ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
        : 'http://localhost:4000/api');

    this.client = new ApiClient({
      baseUrl: apiUrl,
    });
  }

  async getOverview(): Promise<AdminDashboardOverview> {
    try {
      const res = await this.client.get<{ data: AdminDashboardOverview }>('/admin/dashboard');
      return res.data;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(
        503,
        'Painel administrativo de produção temporariamente indisponível. O serviço backend não respondeu.',
        { original: err },
      );
    }
  }
}

export const httpDashboardAdapter = new HttpDashboardAdapter();

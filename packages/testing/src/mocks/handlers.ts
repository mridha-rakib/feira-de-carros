import { http, HttpResponse } from 'msw';
import { mockVehicle } from '../fixtures/vehicles';

export const mockDashboardOverview = {
  total_users: 1248,
  active_listings: 342,
  pending_approvals: 28,
};

export const handlers = [
  // GET /v1/admin/dashboard (API-106)
  http.get('*/admin/dashboard', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    const cookieHeader = request.headers.get('cookie') || '';

    // Check auth simulation
    if (!authHeader && !cookieHeader.includes('fdc_admin_session')) {
      return HttpResponse.json(
        {
          code: 'UNAUTHENTICATED',
          message: 'Credenciais de acesso não fornecidas',
          request_id: 'req-err-401',
        },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      data: mockDashboardOverview,
      request_id: 'req-mock-overview-001',
      meta: {
        provenance: 'SIMULATED_MOCK_DATA',
        demonstration_only: true,
      },
    });
  }),

  // POST /v1/auth/login (API-002)
  http.post('*/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return HttpResponse.json(
        {
          code: 'VALIDATION_FAILED',
          message: 'E-mail e senha são obrigatórios',
          request_id: 'req-err-422',
          details: [{ field: 'password', reason: 'Obrigatório' }],
        },
        { status: 422 },
      );
    }

    if (body.password === 'wrong-password') {
      return HttpResponse.json(
        {
          code: 'INVALID_CREDENTIALS',
          message: 'Credenciais inválidas. Verifique seu e-mail e senha.',
          request_id: 'req-err-401',
        },
        { status: 401 },
      );
    }

    if (body.email.includes('denied')) {
      return HttpResponse.json(
        {
          code: 'ACCESS_DENIED',
          message: 'Acesso restrito ao perfil de Administrador.',
          request_id: 'req-err-403',
        },
        { status: 403 },
      );
    }

    return HttpResponse.json({
      data: {
        user_id: 'usr-admin-mock-001',
        authenticated: true,
        account_status: 'ACTIVE',
      },
      request_id: 'req-auth-login-001',
      meta: {
        role: 'main_admin',
        provenance: 'SIMULATED_MOCK_DATA',
      },
    });
  }),

  // GET /v1/vehicles
  http.get('*/vehicles', () => {
    return HttpResponse.json({
      data: [mockVehicle],
      pagination: {
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      },
    });
  }),

  // GET /v1/vehicles/:id
  http.get('*/vehicles/:id', ({ params }) => {
    return HttpResponse.json({
      ...mockVehicle,
      id: params.id,
    });
  }),
];

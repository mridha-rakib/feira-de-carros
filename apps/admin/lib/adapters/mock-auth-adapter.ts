import {
  ApiError,
  type AuthSessionSummary,
  type LoginRequest,
  type UserProfile,
} from '@feira/api-client';
import type { AuthPort } from './auth-port';

export class MockAuthAdapter implements AuthPort {
  private currentUser: UserProfile | null = {
    id: 'usr-admin-001',
    email: 'admin@feiradecarros.com.br',
    name: 'Administrador Central',
    role: 'main_admin',
    accountStatus: 'ACTIVE',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-31T10:00:00Z',
  };

  async login(request: LoginRequest): Promise<AuthSessionSummary> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!request.email || !request.password) {
      throw new ApiError(422, 'E-mail e senha são obrigatórios', {
        code: 'VALIDATION_FAILED',
        request_id: 'req-err-422',
        details: [{ field: 'password', reason: 'Campo obrigatório' }],
      });
    }

    if (request.password === 'wrong-password' || request.password === 'errada') {
      throw new ApiError(401, 'Credenciais inválidas. Verifique seu e-mail e senha.', {
        code: 'INVALID_CREDENTIALS',
        request_id: 'req-err-401',
      });
    }

    if (
      request.email.toLowerCase().includes('denied') ||
      request.email.toLowerCase().includes('negado')
    ) {
      throw new ApiError(
        403,
        'Acesso negado. Esta conta não possui perfil administrativo autorizado.',
        {
          code: 'ACCESS_DENIED',
          request_id: 'req-err-403',
        },
      );
    }

    // Set cookie for browser session simulation
    if (typeof document !== 'undefined') {
      document.cookie =
        'fdc_admin_session=mock_admin_token_active; path=/; max-age=43200; SameSite=Strict';
    }

    this.currentUser = {
      id: 'usr-admin-001',
      email: request.email,
      name: 'Administrador Central',
      role: 'main_admin',
      accountStatus: 'ACTIVE',
      createdAt: '2026-10-01T08:00:00Z',
      updatedAt: new Date().toISOString(),
    };

    return {
      user_id: this.currentUser.id,
      authenticated: true,
      account_status: 'ACTIVE',
    };
  }

  async logout(): Promise<void> {
    if (typeof document !== 'undefined') {
      document.cookie =
        'fdc_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
    }
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    return this.currentUser;
  }
}

export const mockAuthAdapter = new MockAuthAdapter();

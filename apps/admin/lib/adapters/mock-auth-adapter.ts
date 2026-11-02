import {
  ApiError,
  type AuthSessionSummary,
  type LoginRequest,
  type UserProfile,
} from '@feira/api-client';
import type { AuthPort } from './auth-port';

/**
 * Mock Authentication Adapter isolated exclusively to development, local testing, and CI smoke tests.
 * Strictly blocked in production environments to prevent privilege escalation and fake authentication.
 */
export class MockAuthAdapter implements AuthPort {
  private currentUser: UserProfile | null = null;

  private isProduction(): boolean {
    if (typeof process === 'undefined') return false;
    return process.env.NEXT_PUBLIC_APP_ENV === 'production';
  }

  async login(request: LoginRequest): Promise<AuthSessionSummary> {
    // Audit Finding F-01: Mock authentication must never be usable in a real production deployment
    if (this.isProduction()) {
      throw new ApiError(
        403,
        'A autenticação simulada (mock) está estritamente desabilitada em produção. O acesso requer backend real autenticado.',
        { code: 'MOCK_AUTH_DISABLED_IN_PRODUCTION' },
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!request.email || !request.password) {
      throw new ApiError(422, 'E-mail e senha são obrigatórios', {
        code: 'VALIDATION_FAILED',
        request_id: 'req-err-422',
        details: [{ field: 'password', reason: 'Campo obrigatório' }],
      });
    }

    if (request.password === 'wrong-password' || request.password === 'errada') {
      throw new ApiError(
        401,
        'Credenciais inválidas. Verifique seu e-mail e senha institucional.',
        {
          code: 'INVALID_CREDENTIALS',
          request_id: 'req-err-401',
        },
      );
    }

    if (
      request.email.toLowerCase().includes('denied') ||
      request.email.toLowerCase().includes('negado')
    ) {
      throw new ApiError(
        403,
        'Acesso negado. Sua conta não possui permissão para acessar o painel de administração.',
        {
          code: 'ACCESS_DENIED',
          request_id: 'req-err-403',
        },
      );
    }

    // Set cookie for browser session simulation in local dev
    if (typeof document !== 'undefined') {
      document.cookie =
        'fdc_admin_session=mock_admin_token_active; path=/; max-age=43200; SameSite=Strict';
    }

    this.currentUser = {
      id: 'usr-admin-001',
      email: request.email,
      name: 'Admin principal',
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

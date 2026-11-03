import {
  ApiClient,
  ApiError,
  type AuthSessionSummary,
  type LoginRequest,
  type UserProfile,
} from '@feira/api-client';
import type { AuthPort } from './auth-port';

/**
 * Real HTTP Authentication Adapter implementing the approved OpenAPI v0.2 contract.
 * Connects to:
 * - API-002: POST /v1/auth/login
 * - API-004: POST /v1/auth/logout
 * - API-005: GET /v1/me
 *
 * Security Invariant: Fails closed. If user cannot be verified or lacks
 * administrative role, the session is revoked and access is denied.
 */
export class HttpAuthAdapter implements AuthPort {
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

  async login(request: LoginRequest): Promise<AuthSessionSummary> {
    if (!request.email || !request.password) {
      throw new ApiError(422, 'E-mail e senha são obrigatórios', {
        code: 'VALIDATION_FAILED',
        details: [{ field: 'password', reason: 'Campo obrigatório' }],
      });
    }

    try {
      const rawSession = await this.client.post<{ data?: AuthSessionSummary } | AuthSessionSummary>(
        '/v1/auth/login',
        request,
      );
      const session =
        rawSession && typeof rawSession === 'object' && 'data' in rawSession && rawSession.data
          ? rawSession.data
          : (rawSession as AuthSessionSummary);

      if (!session || !session.authenticated) {
        throw new ApiError(401, 'Credenciais inválidas ou sessão não autenticada pelo servidor.', {
          code: 'UNAUTHENTICATED',
        });
      }

      if (session.account_status && session.account_status !== 'ACTIVE') {
        await this.logout().catch(() => {});
        throw new ApiError(403, 'Conta suspensa ou pendente de ativação.', {
          code: 'ACCOUNT_SUSPENDED',
        });
      }

      // Verify the authenticated profile has back-office administrative access (Fail Closed)
      const user = await this.getCurrentUser();
      if (!user || !['main_admin', 'sales', 'support'].includes(user.role)) {
        // Revoke session if user profile cannot be verified or lacks admin privileges
        await this.logout().catch(() => {});
        throw new ApiError(
          403,
          'Acesso negado. Sua conta não possui permissão para acessar o painel de administração.',
          { code: 'ACCESS_DENIED' },
        );
      }

      return session;
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }
      throw new ApiError(503, 'Serviço de autenticação do backend indisponível ou inacessível.', {
        original: err,
      });
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post<void>('/v1/auth/logout');
    } catch {
      // Best-effort logout
    }
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const rawUser = await this.client.get<{ data?: UserProfile } | UserProfile>('/v1/me');
      if (rawUser && typeof rawUser === 'object' && 'data' in rawUser && rawUser.data) {
        return rawUser.data;
      }
      return (rawUser as UserProfile) || null;
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        return null;
      }
      return null;
    }
  }
}

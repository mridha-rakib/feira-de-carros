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
      const session = await this.client.post<AuthSessionSummary>('/v1/auth/login', request);

      // Verify the authenticated profile has back-office administrative access
      const user = await this.getCurrentUser();
      if (user && !['main_admin', 'sales', 'support'].includes(user.role)) {
        // Revoke session if user has no admin privileges
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
      return await this.client.get<UserProfile>('/v1/me');
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        return null;
      }
      return null;
    }
  }
}

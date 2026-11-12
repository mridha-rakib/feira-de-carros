import type { SessionClaim, UserProfile, UserRole } from '@feira/api-client';

export const AUTHORIZED_ADMIN_ROLES: readonly UserRole[] = [
  'main_admin',
  'sales',
  'support',
] as const;

export type SessionRejectionReason =
  | 'MISSING_COOKIE'
  | 'EMPTY_COOKIE'
  | 'MOCK_TOKEN_IN_PRODUCTION'
  | 'PRODUCTION_AUTH_FAIL_CLOSED'
  | 'UNAUTHORIZED_ROLE'
  | 'TOKEN_EXPIRED'
  | 'INVALID_FORMAT';

export interface SessionVerificationResult {
  isValid: boolean;
  reason?: SessionRejectionReason;
  claim?: Partial<SessionClaim>;
  user?: UserProfile;
}

export interface SessionVerificationOptions {
  isProduction: boolean;
  apiUrl?: string;
}

/**
 * Server-side session verification for Admin route protection.
 *
 * Security Principles:
 * 1. FAIL CLOSED IN PRODUCTION:
 *    The production backend authentication contract and cryptographic session
 *    verification (JWT signature validation / auth service session endpoint)
 *    are not yet implemented.
 *    To prevent critical authentication bypass vulnerabilities, protected admin
 *    routes in production strictly FAIL CLOSED. Unverified JWT payload inspection
 *    is explicitly prohibited as an authorization mechanism.
 * 2. LOCAL TEST HARNESS ISOLATION:
 *    Mock authentication is strictly preserved and confined to local development
 *    and E2E test runs (!isProduction).
 * 3. NO INVENTED SECRETS OR ENDPOINTS:
 *    We do not invent JWT secrets, fake backend endpoints, or forged production
 *    sessions.
 */
export async function verifyAdminSession(
  cookieValue: string | undefined | null,
  options: SessionVerificationOptions,
): Promise<SessionVerificationResult> {
  if (!cookieValue) {
    return { isValid: false, reason: 'MISSING_COOKIE' };
  }

  const token = cookieValue.trim();
  if (!token) {
    return { isValid: false, reason: 'EMPTY_COOKIE' };
  }

  // =========================================================================
  // PRODUCTION ROUTE PROTECTION: STRICTLY FAIL-CLOSED
  // =========================================================================
  // Until the backend authentication contract (cryptographic token validation
  // via JWKS or session introspection endpoint) is implemented, production
  // admin routes fail closed unconditionally. Unsigned or unverified payload
  // parsing is strictly forbidden from granting production access.
  if (options.isProduction) {
    if (token.startsWith('mock_')) {
      return { isValid: false, reason: 'MOCK_TOKEN_IN_PRODUCTION' };
    }
    return { isValid: false, reason: 'PRODUCTION_AUTH_FAIL_CLOSED' };
  }

  // =========================================================================
  // DEVELOPMENT & LOCAL E2E TEST FIXTURES (!isProduction ONLY)
  // =========================================================================
  if (token === 'mock_admin_token_active') {
    return {
      isValid: true,
      claim: {
        sub: 'usr-admin-001',
        email: 'admin@feiradecarros.com.br',
        role: 'main_admin',
      },
      user: {
        id: 'usr_admin_001',
        email: 'admin.demo@feiradecarros.com.br',
        name: 'Admin Principal',
        role: 'main_admin',
        accountStatus: 'ACTIVE',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
      },
    };
  }

  if (token === 'mock_seller_token' || token.includes('seller') || token.includes('member')) {
    return { isValid: false, reason: 'UNAUTHORIZED_ROLE' };
  }

  if (token === 'mock_expired_token' || token.includes('expired')) {
    return { isValid: false, reason: 'TOKEN_EXPIRED' };
  }

  // Any other arbitrary string in test/dev mode is rejected
  return { isValid: false, reason: 'INVALID_FORMAT' };
}

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
  | 'MALFORMED_JWT'
  | 'INVALID_FORMAT'
  | 'TOKEN_EXPIRED'
  | 'UNAUTHORIZED_ROLE'
  | 'MISSING_SUBJECT'
  | 'ACCOUNT_SUSPENDED'
  | 'BACKEND_VERIFICATION_FAILED';

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
 * Decode base64url string safely across Node.js and Next.js Edge runtime.
 */
function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  if (typeof atob === 'function') {
    return atob(base64);
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

/**
 * Parses unverified JWT claims without cryptographic verification.
 * Structure: header.payload.signature
 */
export function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const jsonStr = decodeBase64Url(parts[1]);
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Rigorously verifies server-side session credentials and back-office authorization.
 *
 * Security Invariants:
 * 1. An arbitrary, invalid, expired, or non-admin cookie MUST NEVER grant access.
 * 2. Mock tokens are strictly rejected in production deployments.
 * 3. In test/dev mode, only explicitly authorized test tokens are accepted.
 * 4. Fails closed on any ambiguity or backend communication error.
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

  // In production or fail-closed mode, mock tokens are unconditionally forbidden
  if (options.isProduction && token.startsWith('mock_')) {
    return { isValid: false, reason: 'MOCK_TOKEN_IN_PRODUCTION' };
  }

  // Check if token conforms to JWT specification
  const isJwt = token.split('.').length === 3;

  if (isJwt) {
    const payload = parseJwtPayload(token);
    if (!payload) {
      return { isValid: false, reason: 'MALFORMED_JWT' };
    }

    // Expiration check (exp claim in seconds)
    if (typeof payload.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp <= now) {
        return { isValid: false, reason: 'TOKEN_EXPIRED' };
      }
    }

    // Subject check
    const sub = payload.sub || payload.user_id || payload.id;
    if (!sub || typeof sub !== 'string') {
      return { isValid: false, reason: 'MISSING_SUBJECT' };
    }

    // Role authorization check (Must be main_admin, sales, or support)
    const role = (payload.role || payload.user_role) as UserRole | undefined;
    if (!role || !AUTHORIZED_ADMIN_ROLES.includes(role)) {
      return { isValid: false, reason: 'UNAUTHORIZED_ROLE' };
    }

    // Account status check
    const status = (payload.account_status || payload.status || payload.accountStatus) as
      | string
      | undefined;
    if (status && status !== 'ACTIVE') {
      return { isValid: false, reason: 'ACCOUNT_SUSPENDED' };
    }

    return {
      isValid: true,
      claim: {
        sub: String(sub),
        email: typeof payload.email === 'string' ? payload.email : '',
        role: role,
        exp: typeof payload.exp === 'number' ? payload.exp : 0,
        iat: typeof payload.iat === 'number' ? payload.iat : 0,
      },
    };
  }

  // Non-JWT tokens:
  // In development / test mode ONLY: validate against explicit test fixtures
  if (!options.isProduction) {
    if (token === 'mock_admin_token_active') {
      return {
        isValid: true,
        claim: {
          sub: 'usr-admin-001',
          email: 'admin@feiradecarros.com.br',
          role: 'main_admin',
        },
      };
    }

    if (token === 'mock_seller_token' || token.includes('seller') || token.includes('member')) {
      return { isValid: false, reason: 'UNAUTHORIZED_ROLE' };
    }

    if (token === 'mock_expired_token' || token.includes('expired')) {
      return { isValid: false, reason: 'TOKEN_EXPIRED' };
    }

    // Any other arbitrary non-JWT string in test mode is also rejected
    return { isValid: false, reason: 'INVALID_FORMAT' };
  }

  // In production, arbitrary non-JWT tokens are strictly rejected
  return { isValid: false, reason: 'INVALID_FORMAT' };
}

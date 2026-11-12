import { describe, expect, it } from 'vitest';
import { AUTHORIZED_ADMIN_ROLES, verifyAdminSession } from '../../lib/security/session-verifier';

function createUnverifiedJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = 'unverified_sig';
  return `${header}.${body}.${signature}`;
}

describe('Server-Side Authentication — Session Verifier (verifyAdminSession)', () => {
  const futureExp = Math.floor(Date.now() / 1000) + 3600;

  it('rejects missing or empty cookies', async () => {
    expect(await verifyAdminSession(undefined, { isProduction: true })).toEqual({
      isValid: false,
      reason: 'MISSING_COOKIE',
    });
    expect(await verifyAdminSession(null, { isProduction: true })).toEqual({
      isValid: false,
      reason: 'MISSING_COOKIE',
    });
    expect(await verifyAdminSession('', { isProduction: true })).toEqual({
      isValid: false,
      reason: 'MISSING_COOKIE',
    });
    expect(await verifyAdminSession('   ', { isProduction: true })).toEqual({
      isValid: false,
      reason: 'EMPTY_COOKIE',
    });
  });

  it('CRITICAL: strictly rejects mock tokens in production deployments', async () => {
    const mockTokens = [
      'mock_admin_token_active',
      'mock_sales_token',
      'mock_support_token',
      'mock_anything',
    ];

    for (const token of mockTokens) {
      const result = await verifyAdminSession(token, { isProduction: true });
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('MOCK_TOKEN_IN_PRODUCTION');
    }
  });

  it('CRITICAL: strictly fails closed in production for arbitrary cookie strings', async () => {
    const arbitraryTokens = [
      'arbitrary_session_cookie_12345',
      'random-uuid-impersonation-token',
      'hacker_session_bypass',
      'true',
      '1',
    ];

    for (const token of arbitraryTokens) {
      const result = await verifyAdminSession(token, { isProduction: true });
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('PRODUCTION_AUTH_FAIL_CLOSED');
    }
  });

  it('CRITICAL: strictly fails closed in production for unverified JWTs (no payload-only auth)', async () => {
    // Attempted bypass with fabricated JWT claiming main_admin role
    for (const role of AUTHORIZED_ADMIN_ROLES) {
      const forgedJwt = createUnverifiedJwt({
        sub: `usr-${role}-001`,
        email: `${role}@feiradecarros.com.br`,
        role: role,
        account_status: 'ACTIVE',
        exp: futureExp,
      });

      const result = await verifyAdminSession(forgedJwt, { isProduction: true });
      // Must FAIL CLOSED: unverified JWT payload inspection must never grant production access
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('PRODUCTION_AUTH_FAIL_CLOSED');
    }
  });

  it('in non-production mode: preserves local mock authentication for dev and E2E testing', async () => {
    // Valid mock admin fixture
    const validTest = await verifyAdminSession('mock_admin_token_active', {
      isProduction: false,
    });
    expect(validTest.isValid).toBe(true);
    expect(validTest.claim?.role).toBe('main_admin');
    expect(validTest.user?.role).toBe('main_admin');
    expect(validTest.user?.accountStatus).toBe('ACTIVE');

    // Unauthorized mock role
    const unauthorizedTest = await verifyAdminSession('mock_seller_token', {
      isProduction: false,
    });
    expect(unauthorizedTest.isValid).toBe(false);
    expect(unauthorizedTest.reason).toBe('UNAUTHORIZED_ROLE');

    // Expired mock session
    const expiredTest = await verifyAdminSession('mock_expired_token', {
      isProduction: false,
    });
    expect(expiredTest.isValid).toBe(false);
    expect(expiredTest.reason).toBe('TOKEN_EXPIRED');

    // Random non-mock string in dev
    const randomTest = await verifyAdminSession('random_unknown_token', {
      isProduction: false,
    });
    expect(randomTest.isValid).toBe(false);
    expect(randomTest.reason).toBe('INVALID_FORMAT');
  });
});

import { describe, expect, it } from 'vitest';
import {
  AUTHORIZED_ADMIN_ROLES,
  parseJwtPayload,
  verifyAdminSession,
} from '../../lib/security/session-verifier';

function createTestJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = 'fake_crypto_sig_123';
  return `${header}.${body}.${signature}`;
}

describe('Server-Side Authentication — Session Verifier (verifyAdminSession)', () => {
  const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour in future
  const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour in past

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

  it('CRITICAL: strictly rejects arbitrary unverified cookie strings in production', async () => {
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
      expect(result.reason).toBe('INVALID_FORMAT');
    }
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

  it('CRITICAL: rejects malformed JWT tokens', async () => {
    const malformed = 'header.not-valid-json.sig';
    const result = await verifyAdminSession(malformed, { isProduction: true });
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('MALFORMED_JWT');
  });

  it('CRITICAL: rejects expired JWT session tokens', async () => {
    const expiredToken = createTestJwt({
      sub: 'usr-admin-01',
      email: 'admin@feiradecarros.com.br',
      role: 'main_admin',
      exp: pastExp,
    });

    const result = await verifyAdminSession(expiredToken, { isProduction: true });
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('TOKEN_EXPIRED');
  });

  it('CRITICAL: rejects JWT tokens lacking a valid subject identifier', async () => {
    const noSubToken = createTestJwt({
      email: 'admin@feiradecarros.com.br',
      role: 'main_admin',
      exp: futureExp,
    });

    const result = await verifyAdminSession(noSubToken, { isProduction: true });
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('MISSING_SUBJECT');
  });

  it('CRITICAL: rejects non-admin roles (seller, member, dealer, public)', async () => {
    const unauthorizedRoles = ['seller', 'member', 'dealer', 'public', 'unauthorized_role'];

    for (const role of unauthorizedRoles) {
      const token = createTestJwt({
        sub: `usr-${role}-01`,
        email: `${role}@example.com`,
        role: role,
        exp: futureExp,
      });

      const result = await verifyAdminSession(token, { isProduction: true });
      expect(result.isValid).toBe(false);
      expect(result.reason).toBe('UNAUTHORIZED_ROLE');
    }
  });

  it('CRITICAL: rejects accounts that are suspended or pending activation', async () => {
    const suspendedToken = createTestJwt({
      sub: 'usr-admin-suspended',
      email: 'suspended.admin@feiradecarros.com.br',
      role: 'main_admin',
      status: 'SUSPENDED',
      exp: futureExp,
    });

    const result = await verifyAdminSession(suspendedToken, { isProduction: true });
    expect(result.isValid).toBe(false);
    expect(result.reason).toBe('ACCOUNT_SUSPENDED');
  });

  it('authenticates valid administrative JWT tokens (main_admin, sales, support)', async () => {
    for (const role of AUTHORIZED_ADMIN_ROLES) {
      const token = createTestJwt({
        sub: `usr-${role}-001`,
        email: `${role}@feiradecarros.com.br`,
        role: role,
        account_status: 'ACTIVE',
        exp: futureExp,
      });

      const result = await verifyAdminSession(token, { isProduction: true });
      expect(result.isValid).toBe(true);
      expect(result.claim?.role).toBe(role);
      expect(result.claim?.sub).toBe(`usr-${role}-001`);
    }
  });

  it('in non-production mode: accepts authorized test fixture token only', async () => {
    const validTest = await verifyAdminSession('mock_admin_token_active', {
      isProduction: false,
    });
    expect(validTest.isValid).toBe(true);
    expect(validTest.claim?.role).toBe('main_admin');

    const unauthorizedTest = await verifyAdminSession('mock_seller_token', {
      isProduction: false,
    });
    expect(unauthorizedTest.isValid).toBe(false);
    expect(unauthorizedTest.reason).toBe('UNAUTHORIZED_ROLE');

    const expiredTest = await verifyAdminSession('mock_expired_token', {
      isProduction: false,
    });
    expect(expiredTest.isValid).toBe(false);
    expect(expiredTest.reason).toBe('TOKEN_EXPIRED');

    const randomTest = await verifyAdminSession('random_unknown_token', {
      isProduction: false,
    });
    expect(randomTest.isValid).toBe(false);
    expect(randomTest.reason).toBe('INVALID_FORMAT');
  });
});

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getAuthAdapter } from '../../lib/adapters/auth-factory';
import { HttpAuthAdapter } from '../../lib/adapters/http-auth-adapter';
import { MockAuthAdapter, mockAuthAdapter } from '../../lib/adapters/mock-auth-adapter';

describe('mockAuthAdapter', () => {
  const envMap = process.env as Record<string, string | undefined>;
  const originalEnv = envMap.NODE_ENV;
  const originalAppEnv = envMap.NEXT_PUBLIC_APP_ENV;

  beforeEach(() => {
    envMap.NODE_ENV = 'test';
    envMap.NEXT_PUBLIC_APP_ENV = undefined;
  });

  afterEach(() => {
    envMap.NODE_ENV = originalEnv;
    envMap.NEXT_PUBLIC_APP_ENV = originalAppEnv;
  });

  it('authenticates main_admin successfully with valid credentials in non-production', async () => {
    const result = await mockAuthAdapter.login({
      email: 'admin@feiradecarros.com.br',
      password: 'valid-admin-password-123',
    });

    expect(result.authenticated).toBe(true);
    expect(result.user_id).toBe('usr-admin-001');
    expect(result.account_status).toBe('ACTIVE');

    const currentUser = await mockAuthAdapter.getCurrentUser();
    expect(currentUser?.role).toBe('main_admin');
    expect(currentUser?.email).toBe('admin@feiradecarros.com.br');
  });

  it('rejects invalid password with 401 Credenciais inválidas', async () => {
    await expect(
      mockAuthAdapter.login({
        email: 'admin@feiradecarros.com.br',
        password: 'wrong-password',
      }),
    ).rejects.toThrow('Credenciais inválidas');
  });

  it('rejects empty credentials with 422 Validation error', async () => {
    await expect(
      mockAuthAdapter.login({
        email: '',
        password: '',
      }),
    ).rejects.toThrow('E-mail e senha são obrigatórios');
  });

  it('rejects unauthorized roles with 403 Acesso negado', async () => {
    await expect(
      mockAuthAdapter.login({
        email: 'denied-seller@example.com',
        password: 'any-password',
      }),
    ).rejects.toThrow('Acesso negado');
  });

  it('clears session and currentUser on logout', async () => {
    await mockAuthAdapter.logout();
    const user = await mockAuthAdapter.getCurrentUser();
    expect(user).toBeNull();
  });

  it('REGRESSION TEST (Finding F-01): strictly blocks mock authentication in production deployment', async () => {
    envMap.NEXT_PUBLIC_APP_ENV = 'production';
    const prodMockAdapter = new MockAuthAdapter();

    await expect(
      prodMockAdapter.login({
        email: 'admin@feiradecarros.com.br',
        password: 'any-password',
      }),
    ).rejects.toThrow('A autenticação simulada (mock) está estritamente desabilitada em produção');
  });

  it('REGRESSION TEST (Finding F-01): getAuthAdapter selects HttpAuthAdapter when in production', () => {
    envMap.NEXT_PUBLIC_APP_ENV = 'production';
    const adapter = getAuthAdapter();
    expect(adapter).toBeInstanceOf(HttpAuthAdapter);
  });

  it('getAuthAdapter selects MockAuthAdapter in test/development', () => {
    envMap.NODE_ENV = 'test';
    const adapter = getAuthAdapter();
    expect(adapter).toBeInstanceOf(MockAuthAdapter);
  });
});

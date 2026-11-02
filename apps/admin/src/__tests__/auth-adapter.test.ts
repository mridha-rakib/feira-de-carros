import { describe, expect, it } from 'vitest';
import { mockAuthAdapter } from '../../lib/adapters/mock-auth-adapter';

describe('mockAuthAdapter', () => {
  it('authenticates main_admin successfully with valid credentials', async () => {
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
});

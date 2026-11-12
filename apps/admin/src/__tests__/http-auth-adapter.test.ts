import { ApiError } from '@feira/api-client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpAuthAdapter } from '../../lib/adapters/http-auth-adapter';

describe('HttpAuthAdapter — Production Backend Role & Session Verification', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('rejects empty credentials with 422 before sending network requests', async () => {
    const adapter = new HttpAuthAdapter('http://localhost:4000/api');
    await expect(adapter.login({ email: '', password: '' })).rejects.toThrow(
      'E-mail e senha são obrigatórios',
    );
  });

  it('authenticates main_admin successfully when backend confirms active session and admin profile', async () => {
    const adapter = new HttpAuthAdapter('http://localhost:4000/api');

    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/v1/auth/login')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              data: {
                user_id: 'usr-admin-1',
                authenticated: true,
                account_status: 'ACTIVE',
              },
              request_id: 'req-001',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
        );
      }
      if (url.includes('/v1/me')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              id: 'usr-admin-1',
              email: 'admin@feiradecarros.com.br',
              name: 'Admin Principal',
              role: 'main_admin',
              accountStatus: 'ACTIVE',
              createdAt: '2026-01-01T00:00:00Z',
              updatedAt: '2026-01-01T00:00:00Z',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
        );
      }
      return Promise.reject(new Error(`Unhandled route ${url}`));
    });

    const session = await adapter.login({
      email: 'admin@feiradecarros.com.br',
      password: 'password123',
    });

    expect(session.authenticated).toBe(true);
    expect(session.user_id).toBe('usr-admin-1');
  });

  it('fails closed (403) when user role is not authorized for back-office administration (e.g. seller/member)', async () => {
    const adapter = new HttpAuthAdapter('http://localhost:4000/api');

    let logoutCalled = false;
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/v1/auth/login')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              data: {
                user_id: 'usr-seller-1',
                authenticated: true,
                account_status: 'ACTIVE',
              },
              request_id: 'req-002',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
        );
      }
      if (url.includes('/v1/me')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              id: 'usr-seller-1',
              email: 'seller@example.com',
              name: 'Vendedor Particular',
              role: 'seller', // NON-ADMIN ROLE
              accountStatus: 'ACTIVE',
              createdAt: '2026-01-01T00:00:00Z',
              updatedAt: '2026-01-01T00:00:00Z',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
        );
      }
      if (url.includes('/v1/auth/logout')) {
        logoutCalled = true;
        return Promise.resolve(new Response(null, { status: 204 }));
      }
      return Promise.reject(new Error(`Unhandled route ${url}`));
    });

    await expect(
      adapter.login({
        email: 'seller@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(
      'Acesso negado. Sua conta não possui permissão para acessar o painel de administração.',
    );

    expect(logoutCalled).toBe(true);
  });

  it('fails closed (403) when backend cannot verify the user profile (null user)', async () => {
    const adapter = new HttpAuthAdapter('http://localhost:4000/api');

    let logoutCalled = false;
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/v1/auth/login')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              data: {
                user_id: 'usr-unknown',
                authenticated: true,
                account_status: 'ACTIVE',
              },
              request_id: 'req-003',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
        );
      }
      if (url.includes('/v1/me')) {
        return Promise.resolve(
          new Response(JSON.stringify({ message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      }
      if (url.includes('/v1/auth/logout')) {
        logoutCalled = true;
        return Promise.resolve(new Response(null, { status: 204 }));
      }
      return Promise.reject(new Error(`Unhandled route ${url}`));
    });

    await expect(
      adapter.login({
        email: 'ghost@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(
      'Acesso negado. Sua conta não possui permissão para acessar o painel de administração.',
    );

    expect(logoutCalled).toBe(true);
  });

  it('fails closed (403) when user account_status is not ACTIVE (e.g. SUSPENDED)', async () => {
    const adapter = new HttpAuthAdapter('http://localhost:4000/api');

    let logoutCalled = false;
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/v1/auth/login')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              data: {
                user_id: 'usr-suspended',
                authenticated: true,
                account_status: 'SUSPENDED',
              },
              request_id: 'req-004',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          ),
        );
      }
      if (url.includes('/v1/auth/logout')) {
        logoutCalled = true;
        return Promise.resolve(new Response(null, { status: 204 }));
      }
      return Promise.reject(new Error(`Unhandled route ${url}`));
    });

    await expect(
      adapter.login({
        email: 'suspended@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('Conta suspensa ou pendente de ativação.');

    expect(logoutCalled).toBe(true);
  });
});

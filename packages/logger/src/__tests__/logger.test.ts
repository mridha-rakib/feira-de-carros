import { describe, expect, it, vi } from 'vitest';
import { redactSensitiveData, redactString, sanitizeUrl } from '../formatters';
import { Logger } from '../index';

describe('Logger & Privacy Formatter', () => {
  it('redacts sensitive fields like passwords, tokens, cpf, and authorization', () => {
    const raw = {
      username: 'alice',
      password: 'SuperSecretPassword123!',
      token: 'jwt-token-string',
      cpf: '123.456.789-00',
      cnpj: '12.345.678/0001-90',
      nested: {
        authorization: 'Bearer secret-access-token',
        cookie: 'fdc_admin_session=active_session_val',
        publicData: 42,
        email: 'user@example.com',
      },
    };

    const redacted = redactSensitiveData(raw) as Record<string, unknown>;
    expect(redacted.username).toBe('alice');
    expect(redacted.password).toBe('[REDACTED]');
    expect(redacted.token).toBe('[REDACTED]');
    expect(redacted.cpf).toBe('[REDACTED]');
    expect(redacted.cnpj).toBe('[REDACTED]');

    const nested = redacted.nested as Record<string, unknown>;
    expect(nested.authorization).toBe('[REDACTED]');
    expect(nested.cookie).toBe('[REDACTED]');
    expect(nested.email).toBe('[REDACTED]');
    expect(nested.publicData).toBe(42);
  });

  it('redacts Bearer tokens in arbitrary string fields', () => {
    const message = 'Failed request with header Bearer eyJhbGciOi...12345 in context';
    const clean = redactString(message);
    expect(clean).not.toContain('eyJhbGciOi...12345');
    expect(clean).toContain('Bearer [REDACTED]');
  });

  it('sanitizes query parameters in URLs containing tokens or credentials', () => {
    const rawUrl =
      'https://api.feiradecarros.com.br/v1/auth/callback?code=sec_code_999&token=abc12345&cpf=11122233344&page=1&sort=asc';
    const cleanUrl = sanitizeUrl(rawUrl);

    expect(cleanUrl).toContain('page=1');
    expect(cleanUrl).toContain('sort=asc');
    expect(cleanUrl).toContain('code=%5BREDACTED%5D');
    expect(cleanUrl).toContain('token=%5BREDACTED%5D');
    expect(cleanUrl).toContain('cpf=%5BREDACTED%5D');
    expect(cleanUrl).not.toContain('sec_code_999');
    expect(cleanUrl).not.toContain('abc12345');
    expect(cleanUrl).not.toContain('11122233344');
  });

  it('sanitizes relative URLs with query parameters safely', () => {
    const rawUrl = '/v1/users/search?email=admin@feiradecarros.com.br&limit=10';
    const cleanUrl = sanitizeUrl(rawUrl);

    expect(cleanUrl).toContain('limit=10');
    expect(cleanUrl).toContain('email=%5BREDACTED%5D');
    expect(cleanUrl).not.toContain('admin@feiradecarros.com.br');
  });

  it('measures elapsed request duration cleanly', () => {
    const log = new Logger('http-test', 'debug');
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    log.time('req-1');
    log.timeEnd('req-1', 'API response received');

    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy.mock.calls[0]?.[0]).toContain('API response received');

    infoSpy.mockRestore();
  });

  it('logs formatted HTTP requests with sanitized URL, status code, and duration', () => {
    const log = new Logger('http-test', 'debug');
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    log.logRequest('GET', '/v1/admin/dashboard?token=secret123', 45, 200);

    expect(infoSpy).toHaveBeenCalledTimes(1);
    const loggedMessage = infoSpy.mock.calls[0]?.[0] as string;
    expect(loggedMessage).toContain(
      'HTTP GET /v1/admin/dashboard?token=%5BREDACTED%5D -> 200 [45ms]',
    );
    expect(loggedMessage).not.toContain('secret123');

    infoSpy.mockRestore();
  });

  it('redacts error message details containing sensitive tokens', () => {
    const log = new Logger('error-test', 'debug');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const sensitiveErr = new Error('Unauthorized connection using Bearer secret_live_token_777');
    log.error('Authentication failure occurred', { requestId: 'req-abc-123' }, sensitiveErr);

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const loggedError = errorSpy.mock.calls[0]?.[2] as { message: string };
    expect(loggedError.message).toContain('Bearer [REDACTED]');
    expect(loggedError.message).not.toContain('secret_live_token_777');

    errorSpy.mockRestore();
  });
});

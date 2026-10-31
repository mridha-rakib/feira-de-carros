import { describe, expect, it, vi } from 'vitest';
import { redactSensitiveData } from '../formatters';
import { Logger } from '../index';

describe('Logger', () => {
  it('redacts sensitive fields like passwords, tokens, and authorization', () => {
    const raw = {
      username: 'alice',
      password: 'SuperSecretPassword123!',
      token: 'jwt-token-string',
      nested: {
        authorization: 'Bearer 123',
        publicData: 42,
      },
    };

    const redacted = redactSensitiveData(raw) as Record<string, unknown>;
    expect(redacted.username).toBe('alice');
    expect(redacted.password).toBe('[REDACTED]');
    expect(redacted.token).toBe('[REDACTED]');
    expect((redacted.nested as Record<string, unknown>).authorization).toBe('[REDACTED]');
    expect((redacted.nested as Record<string, unknown>).publicData).toBe(42);
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

  it('logs formatted HTTP requests with status code and duration', () => {
    const log = new Logger('http-test', 'debug');
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    log.logRequest('GET', '/v1/admin/dashboard', 45, 200);

    expect(infoSpy).toHaveBeenCalledTimes(1);
    expect(infoSpy.mock.calls[0]?.[0]).toContain('HTTP GET /v1/admin/dashboard -> 200 [45ms]');

    infoSpy.mockRestore();
  });
});

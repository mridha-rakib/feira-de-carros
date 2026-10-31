import { describe, expect, it, vi } from 'vitest';
import { redactSensitiveData } from '../formatters';
import { Logger } from '../index';

describe('Logger', () => {
  it('redacts sensitive fields like passwords and tokens', () => {
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

  it('logs at permitted level', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const log = new Logger('test-ns', 'error');

    log.error('Something broke', { errorId: 101 });
    expect(consoleSpy).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });
});

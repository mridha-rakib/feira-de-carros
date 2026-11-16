import { isProductionEnvironment } from '../security/environment';
import type { AuthPort } from './auth-port';
import { HttpAuthAdapter } from './http-auth-adapter';
import { MockAuthAdapter, mockAuthAdapter } from './mock-auth-adapter';

/**
 * Returns the environment-appropriate authentication adapter.
 * Uses the real HttpAuthAdapter in production or whenever not explicitly in dev/test (FAIL CLOSED).
 * Uses isolated MockAuthAdapter strictly in development and testing environments.
 */
export function getAuthAdapter(): AuthPort {
  if (isProductionEnvironment()) {
    return new HttpAuthAdapter();
  }

  return mockAuthAdapter;
}

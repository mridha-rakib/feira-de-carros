import type { AuthPort } from './auth-port';
import { HttpAuthAdapter } from './http-auth-adapter';
import { MockAuthAdapter, mockAuthAdapter } from './mock-auth-adapter';

/**
 * Returns the environment-appropriate authentication adapter.
 * Uses the real HttpAuthAdapter in production deployments (NEXT_PUBLIC_APP_ENV=production).
 * Uses isolated MockAuthAdapter strictly in development and testing environments.
 */
export function getAuthAdapter(): AuthPort {
  const isProduction =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_APP_ENV === 'production';

  if (isProduction) {
    return new HttpAuthAdapter();
  }

  return mockAuthAdapter;
}

/**
 * Feira de Carros — Web Environment & Security Boundary Helper
 *
 * Security Principles:
 * 1. FAIL CLOSED: In production mode without a verified backend session,
 *    protected routes and authentication endpoints fail closed.
 * 2. NO CLIENT-WRITABLE AUTH: Client-side JavaScript cannot create an authoritative
 *    production session cookie.
 * 3. EXPLICIT TEST HARNESS ISOLATION: Local dev and automated E2E tests (Vitest / Playwright)
 *    operate within isolated test modes (localhost with test harness or NODE_ENV === 'test').
 */

export function isExplicitDevOrTest(): boolean {
  // 1. Browser runtime (when executing in browser window)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    if (!isLocalhost) {
      // Always fail closed on public production hostnames
      return false;
    }

    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)fdc_runtime_env=([^;]+)/);
      if (match) {
        const val = decodeURIComponent(match[1]);
        if (val === 'production') return false;
        if (val === 'test' || val === 'development') return true;
      }
    }

    // Default to true for localhost development
    return true;
  }

  // 2. Server / Node execution runtime (SSR, Middleware, Vitest, Node)
  if (typeof process !== 'undefined') {
    const nodeEnv = process.env.NODE_ENV;
    const isE2eMock =
      process.env.FEIRA_E2E_MOCK === 'true' ||
      process.env.ADMIN_E2E_MOCK === 'true' ||
      process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === 'true';

    // Unit test environment (Vitest)
    if (nodeEnv === 'test') {
      return true;
    }

    // Development mode (next dev)
    if (nodeEnv === 'development') {
      return true;
    }

    // Production build / deployment (NODE_ENV === 'production')
    if (nodeEnv === 'production') {
      // Only permit mock/demo auth if explicit test harness flag is enabled
      return isE2eMock;
    }
  }

  // Default: FAIL CLOSED
  return false;
}

export function isProductionEnvironment(): boolean {
  return !isExplicitDevOrTest();
}

/**
 * Feira de Carros — Web Environment & Security Boundary Helper
 *
 * Security Principles:
 * 1. FAIL CLOSED IN PRODUCTION:
 *    In production mode without verified backend session services,
 *    all protected routes and authentication simulations strictly fail closed.
 * 2. NO REQUEST-CONTROLLED ENVIRONMENT BYPASS:
 *    Incoming request cookies (e.g. fdc_runtime_env), headers (e.g. x-fdc-test-env),
 *    query parameters, or user-agent strings MUST NEVER weaken production security
 *    guards or switch the application into demo/test mode.
 * 3. NO CLIENT-SIDE OR NEXT_PUBLIC SECURITY CONTROLS:
 *    `NEXT_PUBLIC_*` variables are client-visible and can never be used as
 *    authoritative security authorization controls.
 * 4. TRUSTED SERVER-SIDE CONFIGURATION ONLY:
 *    Demo/test mode is enabled exclusively through private server-side environment
 *    variables (NODE_ENV !== 'production' or FEIRA_E2E_MOCK === 'true') on local loopback.
 * 5. BROWSER & MIDDLEWARE HARMONIZATION:
 *    Local loopback hostnames (localhost / 127.0.0.1) operate in the isolated local
 *    test/dev harness, while public/remote hostnames fail closed unconditionally.
 */

export function isProductionEnvironment(hostname?: string): boolean {
  // 1. Browser runtime (when executing inside client browser window)
  if (typeof window !== 'undefined') {
    const currentHost = hostname || window.location.hostname;
    const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';
    if (!isLocalhost) {
      // Unconditionally fail closed on all public/remote production hostnames
      return true;
    }

    // On localhost, it is strictly an isolated local dev/test environment
    return false;
  }

  // 2. Server / Middleware / Node execution runtime
  if (typeof process !== 'undefined') {
    const nodeEnv = process.env.NODE_ENV;
    const isE2eMock = process.env.FEIRA_E2E_MOCK === 'true';

    // Vitest / Unit test execution
    if (nodeEnv === 'test') {
      return false;
    }

    // Next.js local development server (next dev)
    if (nodeEnv === 'development') {
      return false;
    }

    // If explicit hostname was provided (e.g. from middleware request)
    if (hostname) {
      const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
      if (!isLocalhost) {
        return true; // External/remote host: FAIL CLOSED
      }
    }

    // Production build / deployment (NODE_ENV === 'production' or unset)
    if (nodeEnv === 'production') {
      // Local E2E test runner fixture: private server-side environment variable ONLY
      if (isE2eMock) {
        return false;
      }
      return true;
    }
  }

  // Fail closed by default
  return true;
}

export function isExplicitDevOrTest(hostname?: string): boolean {
  return !isProductionEnvironment(hostname);
}

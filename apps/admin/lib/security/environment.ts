/**
 * Environment security helper for Admin application.
 *
 * Security Principle: FAIL CLOSED.
 * Development or testing features (such as mock authentication, mock data, and QA harness)
 * are ONLY accessible when explicitly opted-in via:
 *   NEXT_PUBLIC_APP_ENV === 'development' OR NEXT_PUBLIC_APP_ENV === 'test'
 *   OR (in test environments: NODE_ENV === 'test')
 *   OR runtime server cookie 'fdc_runtime_env=test' (strictly on local loopback)
 *
 * In production or whenever NEXT_PUBLIC_APP_ENV is missing, empty, 'production', 'staging',
 * or any other value, the system treats the environment as PRODUCTION (fails closed).
 */

export function isExplicitDevOrTest(): boolean {
  // 1. In browser runtime:
  if (typeof window !== 'undefined') {
    // If not running on local loopback, it is a deployed environment: FAIL CLOSED unconditionally
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    if (!isLocalhost) {
      return false;
    }

    // Check runtime environment cookie set by server middleware
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)fdc_runtime_env=([^;]+)/);
      if (match) {
        const val = decodeURIComponent(match[1]);
        if (val === 'production') return false;
        if (val === 'test' || val === 'development') return true;
      }

      // Check server-rendered data attribute
      const dataAppEnv = document.documentElement?.getAttribute('data-app-env');
      if (dataAppEnv === 'production') return false;
      if (dataAppEnv === 'test' || dataAppEnv === 'development') return true;
    }
  }

  // 2. In server / node runtime: check process.env
  if (typeof process === 'undefined') return false;

  const appEnv = process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV;
  const nodeEnv = process.env.NODE_ENV;

  // If explicitly declared as production, never allow mock
  if (appEnv === 'production') {
    return false;
  }

  // Allow only if explicitly 'development' or 'test'
  if (appEnv === 'development' || appEnv === 'test') {
    return true;
  }

  // In test execution runners (Vitest / Jest where NODE_ENV === 'test')
  if (nodeEnv === 'test') {
    return true;
  }

  // Default: FAIL CLOSED (treat as production)
  return false;
}

export function isProductionEnvironment(): boolean {
  return !isExplicitDevOrTest();
}

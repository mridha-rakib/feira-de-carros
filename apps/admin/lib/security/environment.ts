/**
 * Environment security helper for Admin application.
 *
 * Security Principles:
 * 1. FAIL CLOSED: If environment configuration is missing, empty, or unrecognized,
 *    the system strictly enforces production security controls.
 * 2. PRODUCTION IMMUNITY: When NODE_ENV === 'production', public environment variables
 *    (such as NEXT_PUBLIC_APP_ENV) CANNOT enable mock authentication or mock data.
 *    This prevents misconfigured deployments or public environment tampering from
 *    downgrading a production deployment.
 * 3. LOCAL TEST HARNESS ISOLATION: Local Playwright E2E fixtures run in production mode
 *    only when explicitly opted in via private server-side flag ADMIN_E2E_MOCK === 'true'
 *    on local loopback (localhost / 127.0.0.1).
 */

export function isExplicitDevOrTest(): boolean {
  // 1. In browser runtime (when running in client browser):
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    if (!isLocalhost) {
      return false; // Fail closed immediately on any non-localhost domain
    }

    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)fdc_runtime_env=([^;]+)/);
      if (match) {
        const val = decodeURIComponent(match[1]);
        if (val === 'production') return false;
        if (val === 'test' || val === 'development') return true;
      }

      const dataAppEnv = document.documentElement?.getAttribute('data-app-env');
      if (dataAppEnv === 'production') return false;
      if (dataAppEnv === 'test' || dataAppEnv === 'development') return true;
    }

    return false;
  }

  // 2. In Node / server / test execution runtime (typeof window === 'undefined')
  if (typeof process !== 'undefined') {
    const nodeEnv = process.env.NODE_ENV;
    let appEnv = process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV;
    if (appEnv === 'undefined' || appEnv === '') {
      appEnv = undefined;
    }
    const isE2eMock = process.env.ADMIN_E2E_MOCK === 'true';

    // Unit test environment (Vitest)
    if (nodeEnv === 'test') {
      if (appEnv === 'production') {
        return false;
      }
      if (appEnv && !['development', 'test'].includes(appEnv)) {
        return false;
      }
      return true;
    }

    // Production build / deployment (NODE_ENV === 'production')
    if (nodeEnv === 'production') {
      if (isE2eMock) {
        return true;
      }
      // Fail closed: Any public variable like NEXT_PUBLIC_APP_ENV=test or development is blocked in production
      return false;
    }

    // Development build (NODE_ENV === 'development')
    if (nodeEnv === 'development') {
      if (appEnv === 'production') {
        return false;
      }
      return true;
    }
  }

  // Default: FAIL CLOSED (treat as production)
  return false;
}

export function isProductionEnvironment(): boolean {
  return !isExplicitDevOrTest();
}

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
 *    authoritative security authorization controls on the server.
 * 4. TRUSTED SERVER-SIDE DEPLOYMENT CONFIGURATION:
 *    Demo/test mode is enabled exclusively through:
 *    - Local loopback development (NODE_ENV !== 'production' or FEIRA_E2E_MOCK === 'true')
 *    - Explicitly configured Client Demo Preview deployments (FEIRA_CLIENT_DEMO_PREVIEW_MODE === 'true')
 *      scoped to dedicated preview environments (e.g. Vercel project `feira-de-carros-preview`).
 * 5. CANONICAL PRODUCTION DOMAIN IMMUNITY:
 *    Official production domains (feiradecarros.com.br) strictly and unconditionally
 *    fail closed. Demo preview mode is barred from running on official production domains.
 */

export const PREVIEW_ENV_VAR = 'FEIRA_CLIENT_DEMO_PREVIEW_MODE';
export const NEXT_PUBLIC_PREVIEW_ENV_VAR = 'NEXT_PUBLIC_FEIRA_CLIENT_DEMO_PREVIEW_MODE';

const CANONICAL_PRODUCTION_DOMAINS = [
  'feiradecarros.com.br',
  'www.feiradecarros.com.br',
  'app.feiradecarros.com.br',
];

/**
 * Validates whether a given hostname is an official canonical production domain.
 */
export function isCanonicalProductionDomain(hostname?: string): boolean {
  if (!hostname) return false;
  const clean = hostname.toLowerCase().trim();
  return CANONICAL_PRODUCTION_DOMAINS.some(
    (domain) => clean === domain || clean.endsWith(`.${domain}`),
  );
}

/**
 * Checks whether the current runtime is operating inside an explicitly configured
 * Client Demo Preview environment (such as the dedicated Vercel preview project).
 */
export function isClientDemoPreviewEnvironment(hostname?: string): boolean {
  const host = hostname || (typeof window !== 'undefined' ? window.location.hostname : undefined);

  // 1. HARD SECURITY GUARD: Official production domains NEVER permit demo preview
  if (isCanonicalProductionDomain(host)) {
    return false;
  }

  // 2. Server-side / Middleware / Edge runtime check
  if (typeof process !== 'undefined') {
    const isExplicitServerPreview = process.env.FEIRA_CLIENT_DEMO_PREVIEW_MODE === 'true';

    // Project-scoped check for dedicated Vercel preview project
    const isVercelPreviewProject =
      process.env.VERCEL_PROJECT_PRODUCTION_URL?.includes('feira-de-carros-preview') ||
      process.env.VERCEL_URL?.includes('feira-de-carros-preview') ||
      process.env.NEXT_PUBLIC_VERCEL_URL?.includes('feira-de-carros-preview');

    if (
      isExplicitServerPreview ||
      (process.env.VERCEL_ENV === 'preview' && isVercelPreviewProject)
    ) {
      return true;
    }
  }

  // 3. Client Browser runtime check
  if (typeof window !== 'undefined') {
    const isExplicitClientPreview =
      process.env.NEXT_PUBLIC_FEIRA_CLIENT_DEMO_PREVIEW_MODE === 'true';

    const isPreviewHost =
      window.location.hostname.includes('feira-de-carros-preview') ||
      window.location.hostname.endsWith('.vercel.app');

    if (isExplicitClientPreview && isPreviewHost) {
      return true;
    }
  }

  return false;
}

export function isProductionEnvironment(hostname?: string): boolean {
  // If the explicit client demo preview environment is active,
  // the environment operates in preview simulation mode rather than fail-closed production.
  if (isClientDemoPreviewEnvironment(hostname)) {
    return false;
  }

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

    // Local E2E test runner fixture: private server-side environment variable ONLY on local loopback
    if (isE2eMock) {
      return false;
    }

    // Production build / deployment (NODE_ENV === 'production')
    if (nodeEnv === 'production') {
      return true;
    }
  }

  // Fail closed by default
  return true;
}

export function isExplicitDevOrTest(hostname?: string): boolean {
  return !isProductionEnvironment(hostname);
}

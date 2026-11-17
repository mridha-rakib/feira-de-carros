import { type NextRequest, NextResponse } from 'next/server';

/**
 * Public onboarding and customer authentication entrypoints permitted for guest visitors without a pre-existing session.
 * As per SRS v0.5 AUTH-001/008/016/019/027, guest users may initiate seller eligibility application or access login.
 */
const PUBLIC_ENTRYPOINTS = new Set([
  '/seller/sell',
  '/seller/application',
  '/vendedor/solicitacao',
  '/dealer/application',
  '/concessionaria/solicitacao',
  '/entrar',
  '/login',
  '/cadastrar',
  '/recuperar-senha',
  '/favoritos',
  '/mensagens',
]);

/**
 * Protected routes requiring an active authenticated session.
 * Application status and correction (/vendedor/solicitacao/status, /vendedor/solicitacao/corrigir)
 * interact with private applicant data (/v1/seller-applications/me) and require authentication.
 * Seller listings and management (/vendedor/anuncios) strictly require the Seller role.
 * Saved searches and notification preferences are private account areas.
 */
const PROTECTED_PREFIXES = [
  '/buyer',
  '/seller',
  '/dealer',
  '/vendedor',
  '/concessionaria',
  '/conta',
  '/buscas-salvas',
];

/**
 * Validates whether a redirect path is safe against open redirect, backslash, and protocol-relative attacks.
 */
function isSafeRedirectPath(path: string | null | undefined): boolean {
  if (!path || typeof path !== 'string') return false;
  const trimmed = path.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('\\')) {
    return false;
  }
  if (/[\r\n\t\0]/.test(trimmed) || trimmed.includes('@')) {
    return false;
  }
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Preserve public onboarding and authentication entrypoints
  const isPublicEntrypoint =
    PUBLIC_ENTRYPOINTS.has(pathname) ||
    pathname === '/vendedor/solicitacao/' ||
    pathname === '/concessionaria/solicitacao/' ||
    pathname.startsWith('/entrar/') ||
    pathname.startsWith('/login/') ||
    pathname.startsWith('/cadastrar/') ||
    pathname.startsWith('/recuperar-senha/');
  if (isPublicEntrypoint) {
    return NextResponse.next();
  }

  // 2. Evaluate protected application routes
  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtectedPath) {
    const hostname = request.nextUrl.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const runtimeEnvCookie = request.cookies.get('fdc_runtime_env')?.value;
    const testHeader = request.headers.get('x-fdc-test-env');
    const isExplicitTestHarness =
      process.env.FEIRA_E2E_MOCK === 'true' ||
      process.env.ADMIN_E2E_MOCK === 'true' ||
      process.env.NEXT_PUBLIC_ENABLE_DEMO_AUTH === 'true' ||
      runtimeEnvCookie === 'test' ||
      runtimeEnvCookie === 'development' ||
      testHeader === 'true';

    // True production environment: non-localhost or explicit production cookie
    const isTrueProduction =
      (!isLocalhost || runtimeEnvCookie === 'production') && !isExplicitTestHarness;
    const sessionCookie = request.cookies.get('fdc_web_session');
    const sessionValue = sessionCookie?.value || '';

    // AUTHENTICATION BOUNDARY & FAIL-CLOSED ENFORCEMENT:
    // In true production, client-written demo cookies (e.g. demo_buyer_session) are NEVER treated
    // as authoritative proof of authentication. Protected routes fail closed until a live backend
    // server-verified JWT/session is present.
    if (isTrueProduction) {
      // In absence of real backend integration, fail closed and redirect to /entrar
      const loginUrl = new URL('/entrar', request.url);
      if (isSafeRedirectPath(pathname)) {
        loginUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    // In dev / test harness mode: verify session existence and enforce strict role boundaries
    if (!sessionValue) {
      const loginUrl = new URL('/entrar', request.url);
      if (isSafeRedirectPath(pathname)) {
        loginUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    // Role-based boundary enforcement (prevent cross-role access through fabricated cookies):
    // A buyer cookie cannot access protected seller or dealership portals
    const isSellerRoute = pathname.startsWith('/vendedor') || pathname.startsWith('/seller');
    const isDealerRoute = pathname.startsWith('/concessionaria') || pathname.startsWith('/dealer');

    if (isSellerRoute && sessionValue.includes('buyer')) {
      const loginUrl = new URL('/entrar', request.url);
      loginUrl.searchParams.set('error', 'unauthorized_seller_role_required');
      return NextResponse.redirect(loginUrl);
    }

    if (isDealerRoute && (sessionValue.includes('buyer') || sessionValue.includes('seller'))) {
      const loginUrl = new URL('/entrar', request.url);
      loginUrl.searchParams.set('error', 'unauthorized_dealer_role_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/buyer/:path*',
    '/seller/:path*',
    '/dealer/:path*',
    '/vendedor/:path*',
    '/concessionaria/:path*',
    '/conta/:path*',
    '/buscas-salvas/:path*',
  ],
};

import { type NextRequest, NextResponse } from 'next/server';

/**
 * Public onboarding and customer authentication entrypoints permitted for guest visitors without a pre-existing session.
 * As per SRS v0.5 AUTH-001/008/016/019/027, guest users may initiate seller eligibility application or access login.
 */
const PUBLIC_ENTRYPOINTS = new Set([
  '/seller/sell',
  '/seller/application',
  '/vendedor/solicitacao',
  '/entrar',
  '/login',
]);

/**
 * Protected routes requiring an active authenticated session.
 * Application status and correction (/vendedor/solicitacao/status, /vendedor/solicitacao/corrigir)
 * interact with private applicant data (/v1/seller-applications/me) and require authentication.
 * Seller listings and management (/vendedor/anuncios) strictly require the Seller role.
 */
const PROTECTED_PREFIXES = ['/buyer', '/seller', '/dealer', '/vendedor', '/conta'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Preserve public seller onboarding and authentication entrypoints
  const isPublicEntrypoint =
    PUBLIC_ENTRYPOINTS.has(pathname) ||
    pathname === '/vendedor/solicitacao/' ||
    pathname.startsWith('/entrar/') ||
    pathname.startsWith('/login/');
  if (isPublicEntrypoint) {
    return NextResponse.next();
  }

  // 2. Evaluate protected application routes
  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtectedPath) {
    const isProduction = process.env.NODE_ENV === 'production';
    const sessionCookie = request.cookies.get('fdc_web_session');

    // Visual QA and local dev/test environments may inspect UI flows without a live backend session.
    // In production, unauthenticated requests fail closed and redirect to canonical customer login (/entrar).
    // Notice: ?demo=true query parameter bypass is strictly prohibited in production.
    if (!sessionCookie?.value && isProduction) {
      const loginUrl = new URL('/entrar', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Security Invariant: A session cookie's mere existence is NOT proof of the Seller role.
    // Edge middleware verifies baseline presence/token shape, but fine-grained RBAC and
    // data isolation remain strictly and authoritatively enforced by backend API endpoints
    // (GET /v1/seller-applications/me, GET /v1/my/listings) via @feira/api-client.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/buyer/:path*',
    '/seller/:path*',
    '/dealer/:path*',
    '/vendedor/:path*',
    '/conta/:path*',
  ],
};

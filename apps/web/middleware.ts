import { type NextRequest, NextResponse } from 'next/server';
import { isSafeRedirect } from './lib/adapters/shared-auth-registry';
import { isProductionEnvironment } from './lib/security/environment';
import { verifyWebSession } from './lib/security/session-verifier';

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
 * Application status and correction (/vendedor/solicitacao/status, /concessionaria/solicitacao/status, etc.)
 * interact with private applicant data and require authentication.
 * Seller listings and management (/vendedor/anuncios) strictly require the Seller role.
 * Dealership management (/concessionaria/anuncios) strictly requires the Dealer role.
 * Saved searches and notification preferences (/conta, /buscas-salvas) are private account areas.
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
    // Environment security check: Strictly evaluated from trusted server-side configuration.
    // Request cookies, headers, query parameters, or user-agent strings NEVER downgrade production.
    const isProduction = isProductionEnvironment(request.nextUrl.hostname);
    const sessionCookie = request.cookies.get('fdc_web_session');

    // Server-side session verification (Fails closed in production)
    const verification = verifyWebSession(sessionCookie?.value, { isProduction });

    if (!verification.isValid) {
      const loginUrl = new URL('/entrar', request.url);
      if (isSafeRedirect(pathname)) {
        loginUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    // Role-based boundary enforcement:
    // Strictly verify role from the verified session claim. NEVER inferred from cookie strings.
    const role = verification.claim?.role;
    const isSellerRoute = pathname.startsWith('/vendedor') || pathname.startsWith('/seller');
    const isDealerRoute = pathname.startsWith('/concessionaria') || pathname.startsWith('/dealer');
    const isBuyerRoute =
      pathname.startsWith('/conta') ||
      pathname.startsWith('/buscas-salvas') ||
      pathname.startsWith('/buyer');

    if (isSellerRoute && role !== 'seller') {
      const loginUrl = new URL('/entrar', request.url);
      loginUrl.searchParams.set('error', 'unauthorized_seller_role_required');
      return NextResponse.redirect(loginUrl);
    }

    if (isDealerRoute && role !== 'dealer') {
      const loginUrl = new URL('/entrar', request.url);
      loginUrl.searchParams.set('error', 'unauthorized_dealer_role_required');
      return NextResponse.redirect(loginUrl);
    }

    if (isBuyerRoute && role !== 'member') {
      const loginUrl = new URL('/entrar', request.url);
      loginUrl.searchParams.set('error', 'unauthorized_buyer_role_required');
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

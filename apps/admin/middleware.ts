import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_ADMIN_PATHS = ['/login', '/mfa', '/api/auth', '/brand'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path));

  if (!isPublic) {
    const adminSessionCookie = request.cookies.get('fdc_admin_session');

    if (!adminSessionCookie?.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role claims (SUPER_ADMIN, SALES_AGENT, SUPPORT_REP) can be inspected here for routing UX
    // Backend API verifies cryptographic signatures and DB permissions authoritatively
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public images/assets (png, jpg, svg, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

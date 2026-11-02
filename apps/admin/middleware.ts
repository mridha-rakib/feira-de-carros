import { type NextRequest, NextResponse } from 'next/server';
import { getSafeRedirectUrl } from './lib/security/redirect-validator';

const PUBLIC_ADMIN_PATHS = ['/login', '/mfa', '/api/auth', '/brand'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path));

  if (!isPublic) {
    const adminSessionCookie = request.cookies.get('fdc_admin_session');
    const isProduction = process.env.NEXT_PUBLIC_APP_ENV === 'production';

    // In production, reject mock tokens unconditionally (Finding F-01)
    if (isProduction && adminSessionCookie?.value?.startsWith('mock_')) {
      const loginUrl = new URL('/login', request.url);
      const safeRedirect = getSafeRedirectUrl(pathname);
      loginUrl.searchParams.set('redirect', safeRedirect);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('fdc_admin_session');
      return response;
    }

    if (!adminSessionCookie?.value) {
      const loginUrl = new URL('/login', request.url);
      const safeRedirect = getSafeRedirectUrl(pathname);
      loginUrl.searchParams.set('redirect', safeRedirect);
      return NextResponse.redirect(loginUrl);
    }
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

import { type NextRequest, NextResponse } from 'next/server';
import { isProductionEnvironment } from './lib/security/environment';
import { getSafeRedirectUrl } from './lib/security/redirect-validator';

const PUBLIC_ADMIN_PATHS = ['/login', '/mfa', '/api/auth', '/brand'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path));
  const isProduction = isProductionEnvironment();

  if (!isPublic) {
    const adminSessionCookie = request.cookies.get('fdc_admin_session');

    // In production or unverified environments (Fail Closed), reject mock tokens unconditionally
    if (isProduction && adminSessionCookie?.value?.startsWith('mock_')) {
      const loginUrl = new URL('/login', request.url);
      const safeRedirect = getSafeRedirectUrl(pathname);
      loginUrl.searchParams.set('redirect', safeRedirect);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('fdc_admin_session');
      response.cookies.set('fdc_runtime_env', isProduction ? 'production' : 'test', {
        path: '/',
        sameSite: 'lax',
      });
      return response;
    }

    if (!adminSessionCookie?.value) {
      const loginUrl = new URL('/login', request.url);
      const safeRedirect = getSafeRedirectUrl(pathname);
      loginUrl.searchParams.set('redirect', safeRedirect);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.set('fdc_runtime_env', isProduction ? 'production' : 'test', {
        path: '/',
        sameSite: 'lax',
      });
      return response;
    }
  }

  const response = NextResponse.next();
  response.cookies.set('fdc_runtime_env', isProduction ? 'production' : 'test', {
    path: '/',
    sameSite: 'lax',
  });
  return response;
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

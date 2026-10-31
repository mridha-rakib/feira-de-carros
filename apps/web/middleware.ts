import { type NextRequest, NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/buyer', '/seller', '/dealer'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtectedPath) {
    const sessionCookie = request.cookies.get('fdc_web_session');

    if (!sessionCookie?.value) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // In production, session claims (JWT payload) are parsed/checked here
    // True authorization is authoritatively enforced by the backend API on every request
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/buyer/:path*', '/seller/:path*', '/dealer/:path*'],
};

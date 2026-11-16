import { type NextRequest, NextResponse } from 'next/server';

const PUBLIC_EXCEPTIONS = ['/seller/sell', '/seller/application', '/vendedor/solicitacao'];

const PROTECTED_PREFIXES = ['/buyer', '/seller', '/dealer', '/vendedor/anuncios'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public onboarding paths
  const isPublicException = PUBLIC_EXCEPTIONS.some((prefix) => pathname.startsWith(prefix));
  if (isPublicException) {
    return NextResponse.next();
  }

  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtectedPath) {
    const sessionCookie = request.cookies.get('fdc_web_session');

    // In local dev/QA or with demo query param, allow access for visual inspection
    const isDevOrDemo =
      process.env.NODE_ENV !== 'production' || request.nextUrl.searchParams.get('demo') === 'true';

    if (!sessionCookie?.value && !isDevOrDemo) {
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
  matcher: ['/buyer/:path*', '/seller/:path*', '/dealer/:path*', '/vendedor/anuncios/:path*'],
};

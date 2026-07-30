// middleware.ts  (place this at the ROOT of your Next.js project, next to package.json)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected pages that require login (Notice /dashboard is removed so anyone can map their land/register)
const PROTECTED_PATHS = [
  '/my-land',
  '/yield-analytics',
  '/harvest-tracker',
  '/green-leaf-harvest',
  '/telemetry',
  '/weather',
  '/ai-support',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get('teapulse_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/my-land/:path*',
    '/yield-analytics/:path*',
    '/harvest-tracker/:path*',
    '/green-leaf-harvest/:path*',
    '/telemetry/:path*',
    '/weather/:path*',
    '/ai-support/:path*',
  ],
};
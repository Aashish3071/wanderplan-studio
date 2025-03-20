import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Test user ID from our created test user
const TEST_USER_ID = 'cm8gypc5m00005jxkexesivnk';

export async function middleware(request: NextRequest) {
  console.log('Middleware running for path:', request.nextUrl.pathname);

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isPublicApiRoute =
    isApiRoute &&
    (request.nextUrl.pathname.startsWith('/api/auth') ||
      request.nextUrl.pathname === '/api/healthcheck');

  // Root path should always be accessible
  if (request.nextUrl.pathname === '/') {
    return NextResponse.next();
  }

  // Check for bypass test mode
  const isTestMode =
    request.cookies.has('bypass_auth_for_testing') || request.nextUrl.searchParams.has('test_mode');

  console.log('Test mode:', isTestMode);

  // Set bypass cookie if test_mode parameter is present
  if (request.nextUrl.searchParams.has('test_mode')) {
    console.log('Setting test mode cookie and headers');

    const response = NextResponse.next();
    response.cookies.set('bypass_auth_for_testing', 'true', {
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    // For API routes in test mode, add a header that our API handlers can use
    if (isApiRoute) {
      // Add a special header that our API handlers can use to identify test mode
      response.headers.set('x-test-mode', 'true');
      response.headers.set('x-test-user-id', TEST_USER_ID);
      console.log('Set test headers for API route');
    }

    return response;
  }

  // Allow public API routes
  if (isPublicApiRoute) {
    return NextResponse.next();
  }

  // Protect API routes
  if (isApiRoute && !token) {
    if (isTestMode) {
      // For API routes in test mode, allow the request with test user headers
      console.log('Using test mode for API route:', request.nextUrl.pathname);
      const response = NextResponse.next();
      response.headers.set('x-test-mode', 'true');
      response.headers.set('x-test-user-id', TEST_USER_ID);
      return response;
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Allow access if in test mode
  if (isTestMode) {
    return NextResponse.next();
  }

  // Redirect to sign in if accessing protected route without token
  if (!token && !isAuthRoute) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect from auth routes to dashboard if already authenticated
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If we reached here and have a token or in test mode, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protected routes that need authentication
    '/dashboard/:path*',
    '/trips/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/map/:path*',
    '/collaboration/:path*',
    '/discover/:path*',
    '/planner/:path*',
    '/explore/:path*',
    '/plan/:path*',

    // API routes that need protection
    '/api/:path*',

    // Auth routes for redirection when already authenticated
    '/auth/:path*',

    // Root path
    '/',
  ],
};

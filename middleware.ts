import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function runs in the Edge Runtime which doesn't support Node.js crypto
export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname;

    // Define public paths that don't require authentication
    const isPublicPath = path === '/login' ||
        path === '/register' ||
        path === '/' ||
        path === '/debug' || // Add debug page as public
        path === '/api/auth/login' ||
        path === '/api/auth/register' ||
        path.startsWith('/api/auth/');

    // Check if the path should be protected
    const shouldProtect = !isPublicPath &&
        !path.startsWith('/_next') &&
        !path.startsWith('/static') &&
        !path.startsWith('/favicon') &&
        !path.includes('.');

    // Get auth token from cookies
    const authToken = request.cookies.get('auth_token')?.value;

    // Debug logging (visible in server console)
    console.log(`Path: ${path}, Protected: ${shouldProtect}, Token exists: ${!!authToken}`);

    // For API routes, let them handle their own auth
    if (path.startsWith('/api/') && !path.startsWith('/api/auth/')) {
        return NextResponse.next();
    }

    // If it's a protected path and there's no token, redirect to login
    if (shouldProtect && !authToken) {
        console.log(`Redirecting to login: No auth token for protected path ${path}`);
        const url = new URL('/login', request.url);
        url.searchParams.set('redirectUrl', path);
        return NextResponse.redirect(url);
    }

    // In Edge Runtime, we can't verify the JWT token (no crypto)
    // Instead, we'll just check if the token exists and let the API routes do the verification
    if (shouldProtect && authToken) {
        // Token exists, continue with the request
        console.log(`Token exists, proceeding to ${path}`);
        return NextResponse.next();
    }

    // Continue with the request
    return NextResponse.next();
}

// Update matcher to explicitly include all paths that should be checked
export const config = {
    matcher: [
        // Match all paths except specific exclusions
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'
    ],
}; 
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Extract tenant information from hostname
    const hostname = request.headers.get('host') || '';
    const parts = hostname.split('.');
    const subdomain = parts.length > 1 ? parts[0] : 'www';

    // Add tenant info to headers for use in API routes and components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-subdomain', subdomain);
    requestHeaders.set('x-tenant-hostname', hostname);

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        const sessionToken = getSessionCookie(request);

        if (!sessionToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Verify session and check role via API
        try {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const response = await fetch(`${baseUrl}/api/auth/get-session`, {
                headers: {
                    // Pass all cookies to ensure session is correctly identified
                    'Cookie': request.headers.get('cookie') || '',
                },
            });

            if (!response.ok) {
                return NextResponse.redirect(new URL('/login', request.url));
            }

            const session = await response.json();

            // Check if user has admin role
            if (!session?.user?.role || (session.user.role !== 'admin' && session.user.role !== 'super-admin')) {
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            console.error('Middleware auth error:', error);
            // In case of error, we redirect to login to be safe
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    // Only run middleware on admin routes
    matcher: ['/admin/:path*'],
};

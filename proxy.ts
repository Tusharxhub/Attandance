import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

// Proxy handler replaces deprecated middleware
export async function proxy(request: NextRequest) {
    const session = request.cookies.get('session')?.value;

    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        try {
            await jwtVerify(session, SECRET_KEY);
            return NextResponse.next();
        } catch {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Redirect authenticated users from root to dashboard
    if (request.nextUrl.pathname === '/') {
        if (session) {
            try {
                await jwtVerify(session, SECRET_KEY);
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } catch {
                // Invalid session, let them login
            }
        }
    }

    return NextResponse.next();
}

// Route matching for proxy
export const config = {
    matcher: ['/', '/dashboard/:path*'],
};

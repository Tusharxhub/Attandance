import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;

    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        try {
            await jwtVerify(session, SECRET_KEY);
            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    if (request.nextUrl.pathname === '/') {
        if (session) {
            try {
                await jwtVerify(session, SECRET_KEY);
                return NextResponse.redirect(new URL('/dashboard', request.url));
            } catch (error) {
                // Invalid session, let them login
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard/:path*'],
};

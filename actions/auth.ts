'use server';

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { redirect } from 'next/navigation';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');
const ADMIN_PASS = process.env.ADMIN_PASS || '';

export async function login(prevState: any, formData: FormData) {
    const password = formData.get('password') as string;

    if (password === ADMIN_PASS) {
        const token = await new SignJWT({ role: 'admin' })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(SECRET_KEY);

        (await cookies()).set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        redirect('/dashboard');
    } else {
        return { error: 'Invalid password' };
    }
}

export async function logout() {
    (await cookies()).delete('session');
    redirect('/');
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    try {
        const { payload } = await jwtVerify(session, SECRET_KEY);
        return payload;
    } catch (error) {
        return null;
    }
}

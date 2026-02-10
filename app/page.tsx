// ...existing code from /src/app/page.tsx...
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/actions/auth';
import { motion } from 'framer-motion';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30"
        >
            {pending ? 'Authenticating...' : 'Access Portal'}
        </button>
    );
}

const initialState = null;

export default function LoginPage() {
    const [state, formAction] = useActionState(login, initialState);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">CR Attendance Portal</h1>
                    <p className="text-slate-400">Class Representative Access Only</p>
                </div>

                <form action={formAction} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value="tusharkanti.dey@stu.adamasuniversity.ac.in"
                            readOnly
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 focus:outline-none cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                            Access Code
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••"
                            required
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        />
                    </div>

                    {state?.error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                            {state.error}
                        </div>
                    )}

                    <SubmitButton />
                </form>
            </motion.div>
        </div>
    );
}

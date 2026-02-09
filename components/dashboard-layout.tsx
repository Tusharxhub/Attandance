'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/actions/auth';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, CalendarCheck, LogOut, FileText } from 'lucide-react';

const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: CalendarCheck, label: 'Mark Attendance', href: '/dashboard/attendance' },
    { icon: Users, label: 'Students', href: '/dashboard/students' },
    { icon: FileText, label: 'Reports', href: '/dashboard/reports' },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        CR Portal
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">v1.0.0</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                    isActive
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
                                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                                )}
                            >
                                <item.icon size={20} />
                                <span className="font-medium text-sm">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <form action={logout}>
                        <button className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                            <LogOut size={20} />
                            <span className="font-medium text-sm">Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

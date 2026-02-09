import { getSession } from '@/actions/auth';
import { routine } from '@/lib/routine';
import Link from 'next/link';
import { CalendarCheck, Users, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function DashboardPage() {
    const session = await getSession();

    // Get today's day name
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];

    const todayRoutine = routine.find(r => r.day === todayName);
    const classesToday = todayRoutine?.periods.length || 0;

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Welcome, Tushar 👋</h1>
                    <p className="text-slate-400 mt-1">Here's what's happening today, {todayName}.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-sm font-medium">
                        Active Session
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Classes Today</p>
                            <h3 className="text-2xl font-bold text-white">{classesToday}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-500">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Total Students</p>
                            <h3 className="text-2xl font-bold text-white">54</h3>
                        </div>
                    </div>
                </div>

                <Link href="/dashboard/attendance" className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all flex flex-col justify-between group">
                    <div className="flex items-center justify-between">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                            <CalendarCheck size={24} />
                        </div>
                        <span className="text-white/80 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mt-4">Mark Attendance</h3>
                        <p className="text-blue-100 text-sm">For current active class</p>
                    </div>
                </Link>
            </div>

            {/* Today's Schedule */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-indigo-400" /> Today's Schedule
                </h2>

                {todayRoutine && todayRoutine.periods.length > 0 ? (
                    <div className="grid gap-4">
                        {todayRoutine.periods.map((period) => (
                            <div key={period.id} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={cn(
                                        "w-1 h-12 rounded-full",
                                        period.type === 'Theory' ? "bg-blue-500" : "bg-purple-500"
                                    )} />
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{period.subject}</h3>
                                        <p className="text-slate-400 text-sm">{period.teacher} • <span className={cn(
                                            "px-2 py-0.5 rounded text-xs font-medium ml-2",
                                            period.type === 'Theory' ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                                        )}>{period.type}</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-white font-medium">{period.startTime} - {period.endTime}</p>
                                        <p className="text-slate-500 text-xs">Time</p>
                                    </div>
                                    <Link
                                        href={`/dashboard/attendance/mark?periodId=${period.id}&date=${new Date().toISOString().split('T')[0]}`}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        Mark
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">No Classes Scheduled</h3>
                        <p className="text-slate-400 max-w-sm mt-2">Enjoy your day off! There are no classes scheduled for {todayName}.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

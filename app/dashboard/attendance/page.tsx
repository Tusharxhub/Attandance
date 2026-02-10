'use client';

import { useState } from 'react';
import { routine } from '@/lib/routine';
import Link from 'next/link';
import { Calendar as CalendarIcon, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function AttendanceSelectorPage() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    const dayRoutine = routine.find(r => r.day === dayName);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white">Attendance Manager</h1>
                <p className="text-slate-400 mt-1">Select a date and class to view or edit attendance.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Date Selector */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <CalendarIcon size={20} className="text-blue-500" /> Select Date
                    </h3>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 color-scheme-dark"
                    />
                    <div className="mt-4 p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl">
                        <p className="text-center text-blue-300 font-medium">{dayName}</p>
                    </div>
                </div>

                {/* Classes List */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Clock size={20} className="text-purple-500" /> Classes on {selectedDate}
                    </h3>

                    {dayRoutine && dayRoutine.periods.length > 0 ? (
                        <div className="grid gap-3">
                            {dayRoutine.periods.map((period, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={period.id}
                                >
                                    <Link
                                        href={`/dashboard/attendance/mark?periodId=${period.id}&date=${selectedDate}`}
                                        className="group block bg-slate-900/50 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/30 p-5 rounded-2xl transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold",
                                                    period.type === 'Theory' ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                                                )}>
                                                    {period.startTime.split(':')[0]}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors">{period.subject}</h4>
                                                    <p className="text-sm text-slate-500">{period.teacher} • {period.startTime} - {period.endTime}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 border-2 border-dashed border-slate-800 rounded-2xl">
                            <p className="text-slate-500">No classes scheduled for this day.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

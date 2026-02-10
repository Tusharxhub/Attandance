'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { students } from '@/lib/student-data';
import { saveAttendance, getAttendance } from '@/actions/attendance';
import { routine } from '@/lib/routine';
import { motion } from 'framer-motion';
import { Check, Search, Save, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function MarkAttendanceContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const periodId = searchParams.get('periodId');

    const [presentIds, setPresentIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Find period details
    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const period = routine.find(r => r.day === dayName)?.periods.find(p => p.id === periodId);

    useEffect(() => {
        if (date && periodId) {
            getAttendance(date, periodId).then((ids) => {
                setPresentIds(new Set(ids));
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [date, periodId]);

    const toggleStudent = (id: string) => {
        const newRv = new Set(presentIds);
        if (newRv.has(id)) newRv.delete(id);
        else newRv.add(id);
        setPresentIds(newRv);
    };

    const toggleAll = () => {
        if (presentIds.size === students.length) {
            setPresentIds(new Set());
        } else {
            setPresentIds(new Set(students.map(s => s.id)));
        }
    };

    const handleSave = async () => {
        if (!periodId) return;
        setSaving(true);
        await saveAttendance(date, periodId, Array.from(presentIds));
        setSaving(false);
        router.push('/dashboard');
        router.refresh(); // Refresh to update dashboard stats
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!periodId) return <div className="text-white">Please select a class from the dashboard.</div>;

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Mark Attendance</h1>
                    <p className="text-slate-400 text-sm">{period?.subject} • {date}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row gap-4 justify-between sticky top-0 z-10 backdrop-blur-xl bg-slate-900/90 shadow-xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or roll..."
                        className="w-full bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={toggleAll}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
                    >
                        {presentIds.size === students.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : <><Save size={18} /> Save Attendance</>}
                    </button>
                </div>
            </div>

            {/* Student Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map(student => {
                    const isPresent = presentIds.has(student.id);
                    return (
                        <motion.div
                            layoutId={student.id}
                            key={student.id}
                            onClick={() => toggleStudent(student.id)}
                            className={cn(
                                "cursor-pointer p-4 rounded-xl border transition-all flex items-center gap-4 relative overflow-hidden group",
                                isPresent
                                    ? "bg-blue-900/20 border-blue-500/50 hover:bg-blue-900/30"
                                    : "bg-slate-900/50 border-slate-800 hover:bg-slate-800"
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                                isPresent ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400"
                            )}>
                                {student.id}
                            </div>
                            <div>
                                <h3 className={cn("font-medium transition-colors", isPresent ? "text-white" : "text-slate-300")}>{student.name}</h3>
                                <p className="text-xs text-slate-500">{student.rollNo.split('/').pop()}</p>
                            </div>

                            {isPresent && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400">
                                    <Check size={20} />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Floating Save Button for Mobile */}
            <div className="fixed bottom-6 right-6 md:hidden">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-900/40"
                >
                    <Save size={24} />
                </button>
            </div>
        </div>
    );
}

export default function MarkAttendancePage() {
    return (
        <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
            <MarkAttendanceContent />
        </Suspense>
    );
}

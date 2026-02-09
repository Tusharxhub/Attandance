import { getAllStudentsStats } from '@/actions/attendance';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function StudentsPage() {
    const studentsWithStats = await getAllStudentsStats();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Student Directory</h1>
                    <p className="text-slate-400 text-sm">Total {studentsWithStats.length} Students</p>
                </div>

                {/* Simple search UI (client side fitering would be better for interaction, but server is fine for list) */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="bg-slate-900 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full md:w-64"
                    />
                </div>
            </div>

            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-700 bg-slate-900">
                                <th className="p-4 text-slate-400 font-medium text-sm">ID</th>
                                <th className="p-4 text-slate-400 font-medium text-sm">Name</th>
                                <th className="p-4 text-slate-400 font-medium text-sm">Roll No</th>
                                <th className="p-4 text-slate-400 font-medium text-sm">Reg No</th>
                                <th className="p-4 text-slate-400 font-medium text-sm text-right">Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsWithStats.map((student) => (
                                <tr key={student.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4 text-slate-500 font-mono text-xs">{student.id}</td>
                                    <td className="p-4 text-white font-medium">{student.name}</td>
                                    <td className="p-4 text-slate-400 text-sm">{student.rollNo}</td>
                                    <td className="p-4 text-slate-400 text-sm">{student.regNo}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="text-right">
                                                <div className={cn(
                                                    "font-bold",
                                                    student.stats.percentage >= 75 ? "text-green-400" :
                                                        student.stats.percentage >= 60 ? "text-yellow-400" : "text-red-400"
                                                )}>
                                                    {student.stats.percentage}%
                                                </div>
                                                <div className="text-xs text-slate-500">{student.stats.present}/{student.stats.total}</div>
                                            </div>
                                            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full",
                                                        student.stats.percentage >= 75 ? "bg-green-500" :
                                                            student.stats.percentage >= 60 ? "bg-yellow-500" : "bg-red-500"
                                                    )}
                                                    style={{ width: `${student.stats.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

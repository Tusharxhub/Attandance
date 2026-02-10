import { getAttendanceReports } from '@/lib/reports';

export default async function ReportsPage() {
  let data;
  try {
    data = await getAttendanceReports();
  } catch {
    return (
      <div className="p-8 text-center text-red-400">
        Unable to load reports. Please try again later.
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-400">
        No report data available.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Attendance Reports</h1>
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-2 text-blue-300">Student-wise Attendance</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-slate-900/50 rounded-xl">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800">
                <th className="p-3 text-left text-slate-400">Name</th>
                <th className="p-3 text-left text-slate-400">Roll No</th>
                <th className="p-3 text-left text-slate-400">Attendance %</th>
                <th className="p-3 text-left text-slate-400">Present/Total</th>
              </tr>
            </thead>
            <tbody>
              {data.studentStats.map((s: { _id: string, name: string, rollNo: string, percentage: number, present: number, total: number }) => (
                <tr key={s._id} className={
                  s.percentage < 75 ? "bg-red-900/20" : ""
                }>
                  <td className="p-3 text-white">{s.name}</td>
                  <td className="p-3 text-slate-300">{s.rollNo}</td>
                  <td className={`p-3 font-bold ${s.percentage < 75 ? 'text-red-400' : 'text-green-400'}`}>{s.percentage}%</td>
                  <td className="p-3 text-slate-400">{s.present}/{s.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2 text-blue-300">Subject-wise Attendance</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-slate-900/50 rounded-xl">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800">
                <th className="p-3 text-left text-slate-400">Subject</th>
                <th className="p-3 text-left text-slate-400">Attendance %</th>
                <th className="p-3 text-left text-slate-400">Present/Total</th>
              </tr>
            </thead>
            <tbody>
              {data.subjectStats.map((s: { _id: string, subject: string, percentage: number, present: number, total: number }) => (
                <tr key={s._id}>
                  <td className="p-3 text-white">{s.subject}</td>
                  <td className="p-3 font-bold text-green-400">{s.percentage}%</td>
                  <td className="p-3 text-slate-400">{s.present}/{s.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

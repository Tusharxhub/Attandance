'use server';

import connectDB from '@/lib/db';
import AttendanceRecord from '@/models/AttendanceRecord';
import Student from '@/models/Student';
import { revalidatePath } from 'next/cache';
import { students as staticStudents } from '@/lib/student-data';

export async function saveAttendance(date: string, periodId: string, presentStudentIds: string[]) {
    try {
        await connectDB();

        // 1. Delete existing attendance for this period/date
        await AttendanceRecord.deleteMany({
            date,
            periodId,
        });

        // 2. Insert new records
        if (presentStudentIds.length > 0) {
            const records = presentStudentIds.map(studentId => ({
                date,
                periodId,
                studentId,
                status: 'present'
            }));

            await AttendanceRecord.insertMany(records);
        }

        revalidatePath('/dashboard');
        revalidatePath(`/dashboard/attendance/mark`);
        revalidatePath(`/dashboard/students`);
        return { success: true };
    } catch (error: any) {
        console.error('Error saving attendance:', error);
        return { success: false, error: error.message };
    }
}

export async function getAttendance(date: string, periodId: string) {
    try {
        await connectDB();

        const records = await AttendanceRecord.find({
            date,
            periodId,
        }).select('studentId');

        return records.map(record => record.studentId);
    } catch (error) {
        console.error('Error fetching attendance:', error);
        return [];
    }
}

export async function getStudentAttendanceStats(studentId: string) {
    // Placeholder - we generally use getAllStudentsStats for the main view
    return { present: 0, total: 0, percentage: 0 };
}

export async function getAllStudentsStats() {
    try {
        await connectDB();

        // 1. Get total unique classes conducted (unique date + periodId combinations)
        // We use aggregation to group by date and periodId
        const uniqueClasses = await AttendanceRecord.aggregate([
            {
                $group: {
                    _id: { date: "$date", periodId: "$periodId" }
                }
            }
        ]);

        const totalClasses = uniqueClasses.length;

        // 2. Get attendance count for each student
        const attendanceCounts = await AttendanceRecord.aggregate([
            {
                $match: { status: 'present' }
            },
            {
                $group: {
                    _id: "$studentId",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Create a map for easy lookup
        const attendanceMap: Record<string, number> = {};
        attendanceCounts.forEach((record: any) => {
            attendanceMap[record._id] = record.count;
        });

        // 3. Merge with static student data
        // Note: In a real app we might fetch students from DB, but keeping static list as source of truth for now per plan
        return staticStudents.map((s) => {
            const attended = attendanceMap[s.id] || 0;
            return {
                ...s,
                stats: {
                    present: attended,
                    total: totalClasses,
                    percentage: totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : 0
                }
            };
        });

    } catch (error) {
        console.error("Error calculating stats:", error);
        return staticStudents.map(s => ({ ...s, stats: { present: 0, total: 0, percentage: 0 } }));
    }
}

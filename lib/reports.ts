import { dbConnect } from './mongodb';
// import Student from '@/models/Student';
import AttendanceRecord from '@/models/AttendanceRecord';

export async function getAttendanceReports() {
  await dbConnect();

  // Student-wise attendance
  const studentStats = await AttendanceRecord.aggregate([
    {
      $group: {
        _id: '$studentId',
        present: { $sum: { $cond: ['$present', 1, 0] } },
        total: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'students',
        localField: '_id',
        foreignField: 'id',
        as: 'student',
      },
    },
    { $unwind: '$student' },
    {
      $project: {
        name: '$student.name',
        rollNo: '$student.rollNo',
        present: 1,
        total: 1,
        percentage: {
          $cond: [
            { $eq: ['$total', 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ['$present', '$total'] }, 100] }, 1] },
          ],
        },
      },
    },
    { $sort: { percentage: 1 } },
  ]);

  // Subject-wise attendance
  const subjectStats = await AttendanceRecord.aggregate([
    {
      $group: {
        _id: '$subject',
        present: { $sum: { $cond: ['$present', 1, 0] } },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        subject: '$_id',
        present: 1,
        total: 1,
        percentage: {
          $cond: [
            { $eq: ['$total', 0] },
            0,
            { $round: [{ $multiply: [{ $divide: ['$present', '$total'] }, 100] }, 1] },
          ],
        },
      },
    },
    { $sort: { percentage: 1 } },
  ]);

  return { studentStats, subjectStats };
}

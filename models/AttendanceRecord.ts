import mongoose, { Schema, model, models } from 'mongoose';

const AttendanceRecordSchema = new Schema({
    studentId: {
        type: String, // Reference to Student.id (string based ID from student-data.ts)
        required: true,
        index: true,
    },
    date: {
        type: String, // Storing as YYYY-MM-DD string as per existing usage
        required: true,
        index: true,
    },
    periodId: {
        type: String,
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'present',
    },
}, { timestamps: true });

// Compound index for unique attendance per student per period per day
AttendanceRecordSchema.index({ studentId: 1, date: 1, periodId: 1 }, { unique: true });

const AttendanceRecord = models.AttendanceRecord || model('AttendanceRecord', AttendanceRecordSchema);

export default AttendanceRecord;

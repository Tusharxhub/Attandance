import mongoose, { Schema, model, models } from 'mongoose';

const StudentSchema = new Schema({
    id: {
        type: String, // String ID as used in student-data.ts (e.g. "1", "2")
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    regNo: {
        type: String,
        required: true,
        unique: true,
    },
    rollNo: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true });

StudentSchema.index({ id: 1 });

export default models.Student || model('Student', StudentSchema);

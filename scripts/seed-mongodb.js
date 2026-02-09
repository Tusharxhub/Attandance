const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Simple way to load env vars without dotenv package if not installed, 
// or just rely on user setting it.
// But since we are in a script, we might need to look for .env
try {
    const envPath = path.join(__dirname, '../.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const firstEquals = line.indexOf('=');
        if (firstEquals !== -1) {
            const key = line.substring(0, firstEquals).trim();
            const value = line.substring(firstEquals + 1).trim();
            if (key && !process.env[key]) {
                process.env[key] = value;
            }
        }
    });
} catch (e) {
    console.log('No .env file found or error reading it, relying on process.env');
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable');
    process.exit(1);
}

// Define Schema inline for the script to avoid TS compilation issues with imports if ts-node isn't set up
const StudentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    regNo: { type: String, required: true, unique: true },
    rollNo: { type: String, required: true, unique: true },
}, { timestamps: true });

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

// Parse student data from lib/student-data.ts manually to avoid TS/module issues in simple JS script
const studentDataPath = path.join(__dirname, '../lib/student-data.ts');
const content = fs.readFileSync(studentDataPath, 'utf8');
const lines = content.split('\n').filter(l => l.trim().startsWith('{') && l.trim().endsWith('},'));

const students = [];
lines.forEach(line => {
    const idMatch = line.match(/id: "([^"]+)"/);
    const nameMatch = line.match(/name: "([^"]+)"/);
    const regNoMatch = line.match(/regNo: "([^"]+)"/);
    const rollNoMatch = line.match(/rollNo: "([^"]+)"/);

    if (idMatch && nameMatch && regNoMatch && rollNoMatch) {
        students.push({
            id: idMatch[1],
            name: nameMatch[1],
            regNo: regNoMatch[1],
            rollNo: rollNoMatch[1]
        });
    }
});

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        console.log(`Seeding ${students.length} students...`);

        // Upsert students
        for (const student of students) {
            await Student.updateOne(
                { id: student.id },
                { $set: student },
                { upsert: true }
            );
        }

        console.log('✅ Seeding complete');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
}

seed();

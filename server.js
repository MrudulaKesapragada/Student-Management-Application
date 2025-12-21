const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json()); // Allows server to read JSON data from forms
app.use(cors());         // Enable cross-origin requests

// 1. Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_db';
mongoose.connect(mongoURI)
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error("Database connection error:", err));

// 2. Student Schema (Database Blueprint)
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    class: { type: String, required: true },
    roll: { type: Number, required: true },
    grade: { type: String, required: true },
    attendance: { type: String, default: 'Present' }
});

const Student = mongoose.model('Student', studentSchema);

// 3. API Routes (CRUD Operations)

// Get all students (Read)
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Enroll a new student (Create)
app.post('/api/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update student (Attendance or Profile)
app.put('/api/students/:id', async (req, res) => {
    try {
        const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Remove student (Delete)
app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const express = require('express');
const app = express();
const port = 3000;
const { connect, Schema, model } = require('mongoose');
const WebSocket = require('ws');
const { Server } = require('ws');
const cors = require('cors');

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serve static files

// Connect to MongoDB
connect('mongodb://localhost/learning-platform', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

// Database Schemas
const progressSchema = new Schema({
    studentId: { type: String, required: true },
    courseId: { type: String, required: true },
    progress: { type: Number, required: true, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now }
});

const courseSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    students: [{ type: String }] // Array of student IDs
});

const quizSchema = new Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    courseId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor'], required: true },
    enrolledCourses: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

// Models
const Progress = model('Progress', progressSchema);
const Course = model('Course', courseSchema);
const Quiz = model('Quiz', quizSchema);
const User = model('User', userSchema);

// Sample data initialization
async function initializeData() {
    try {
        const courseCount = await Course.countDocuments();
        if (courseCount === 0) {
            const sampleCourses = [
                {
                    title: "Introduction to Programming",
                    description: "Learn the fundamentals of programming with JavaScript",
                    instructor: "Dr. Sarah Johnson"
                },
                {
                    title: "Web Development Basics",
                    description: "Master HTML, CSS, and JavaScript for modern web development",
                    instructor: "Prof. Michael Chen"
                },
                {
                    title: "Database Design",
                    description: "Learn MongoDB and relational database concepts",
                    instructor: "Dr. Emily Rodriguez"
                },
                {
                    title: "Advanced JavaScript",
                    description: "Dive deep into ES6+, async programming, and frameworks",
                    instructor: "Alex Thompson"
                }
            ];
            
            await Course.insertMany(sampleCourses);
            console.log('Sample courses created');
        }

        const quizCount = await Quiz.countDocuments();
        if (quizCount === 0) {
            const sampleQuiz = {
                question: "What is the correct way to declare a variable in JavaScript?",
                options: [
                    "var myVariable = 'Hello';",
                    "variable myVariable = 'Hello';",
                    "v myVariable = 'Hello';",
                    "declare myVariable = 'Hello';"
                ],
                correctAnswer: 0,
                courseId: "1"
            };
            
            await new Quiz(sampleQuiz).save();
            console.log('Sample quiz created');
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

// Routes

// Get all courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.json({ 
            message: 'Courses retrieved successfully', 
            courses: courses.length > 0 ? courses : [
                { title: 'Introduction to Programming', description: 'Learn programming basics', instructor: 'Dr. Sarah Johnson' },
                { title: 'Web Development Basics', description: 'HTML, CSS, JavaScript fundamentals', instructor: 'Prof. Michael Chen' }
            ]
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new course
app.post('/courses', async (req, res) => {
    try {
        const { title, description, instructor } = req.body;
        
        if (!title || !description || !instructor) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const newCourse = new Course({ title, description, instructor });
        await newCourse.save();
        
        res.json({ 
            message: 'Course created successfully', 
            course: newCourse 
        });
        
        // Broadcast new course creation
        broadcastUpdate({
            type: 'course_created',
            course: newCourse,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update student progress
app.post('/progress', async (req, res) => {
    try {
        const { studentId, courseId, progress } = req.body;
        
        if (!studentId || !courseId || progress === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (progress < 0 || progress > 100) {
            return res.status(400).json({ error: 'Progress must be between 0 and 100' });
        }
        
        // Update or create progress record
        const progressRecord = await Progress.findOneAndUpdate(
            { studentId, courseId },
            { progress, lastUpdated: new Date() },
            { upsert: true, new: true }
        );
        
        res.json({ 
            message: `Progress updated for student ${studentId}`, 
            progress: progressRecord 
        });
        
        // Broadcast progress update
        broadcastUpdate({
            type: 'progress_update',
            studentId,
            courseId,
            progress,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all progress records
app.get('/all-progress', async (req, res) => {
    try {
        const progressRecords = await Progress.find().sort({ lastUpdated: -1 });
        res.json({ progress: progressRecords });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get progress for specific student
app.get('/progress/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const progressRecords = await Progress.find({ studentId });
        res.json({ progress: progressRecords });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get quiz
app.get('/quiz', async (req, res) => {
    try {
        const quiz = await Quiz.findOne().sort({ createdAt: -1 });
        
        if (!quiz) {
            return res.json({ 
                quiz: {
                    question: "What is the correct way to declare a variable in JavaScript?",
                    options: [
                        "var myVariable = 'Hello';",
                        "variable myVariable = 'Hello';",
                        "v myVariable = 'Hello';",
                        "declare myVariable = 'Hello';"
                    ],
                    correctAnswer: 0,
                    courseId: "1"
                }
            });
        }
        
        res.json({ quiz });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create quiz
app.post('/quiz', async (req, res) => {
    try {
        const { question, options, correctAnswer, courseId } = req.body;
        
        if (!question || !options || correctAnswer === undefined || !courseId) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (options.length !== 4) {
            return res.status(400).json({ error: 'Quiz must have exactly 4 options' });
        }
        
        if (correctAnswer < 0 || correctAnswer > 3) {
            return res.status(400).json({ error: 'Correct answer must be between 0 and 3' });
        }
        
        const newQuiz = new Quiz({ question, options, correctAnswer, courseId });
        await newQuiz.save();
        
        res.json({ 
            message: 'Quiz created successfully', 
            quiz: newQuiz 
        });
        
        // Broadcast quiz creation
        broadcastUpdate({
            type: 'quiz_created',
            quiz: newQuiz,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get statistics for instructor dashboard
app.get('/stats', async (req, res) => {
    try {
        const totalCourses = await Course.countDocuments();
        const totalStudents = await Progress.distinct('studentId').then(ids => ids.length);
        
        const progressRecords = await Progress.find();
        const avgProgress = progressRecords.length > 0 
            ? Math.round(progressRecords.reduce((sum, record) => sum + record.progress, 0) / progressRecords.length)
            : 0;
        
        res.json({
            totalCourses,
            totalStudents,
            avgProgress,
            totalQuizzes: await Quiz.countDocuments(),
            recentActivity: progressRecords.slice(-5).reverse()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User management routes
app.post('/users', async (req, res) => {
    try {
        const { userId, name, email, role } = req.body;
        
        if (!userId || !name || !email || !role) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const newUser = new User({ userId, name, email, role });
        await newUser.save();
        
        res.json({ 
            message: 'User created successfully', 
            user: newUser 
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ error: 'User ID already exists' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// Enroll student in course
app.post('/enroll', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        
        if (!studentId || !courseId) {
            return res.status(400).json({ error: 'Student ID and Course ID are required' });
        }
        
        // Add student to course
        await Course.findByIdAndUpdate(
            courseId,
            { $addToSet: { students: studentId } }
        );
        
        // Add course to student's enrolled courses
        await User.findOneAndUpdate(
            { userId: studentId, role: 'student' },
            { $addToSet: { enrolledCourses: courseId } }
        );
        
        res.json({ message: 'Student enrolled successfully' });
        
        // Broadcast enrollment
        broadcastUpdate({
            type: 'enrollment',
            studentId,
            courseId,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get enrolled courses for a student
app.get('/enrolled/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const user = await User.findOne({ userId: studentId, role: 'student' });
        
        if (!user) {
            return res.status(404).json({ error: 'Student not found' });
        }
        
        const courses = await Course.find({ _id: { $in: user.enrolledCourses } });
        res.json({ courses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit quiz answer
app.post('/quiz/submit', async (req, res) => {
    try {
        const { quizId, studentId, selectedAnswer } = req.body;
        
        if (!quizId || !studentId || selectedAnswer === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        
        const isCorrect = selectedAnswer === quiz.correctAnswer;
        
        res.json({ 
            isCorrect,
            correctAnswer: quiz.correctAnswer,
            message: isCorrect ? 'Correct answer!' : 'Incorrect answer. Try again!'
        });
        
        // Broadcast quiz submission
        broadcastUpdate({
            type: 'quiz_submission',
            studentId,
            quizId,
            isCorrect,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// WebSocket setup
const server = app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
    console.log(`📚 Learning Platform Backend Started`);
    console.log(`🔗 WebSocket server ready for real-time updates`);
    initializeData();
});

const wss = new Server({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('👤 New client connected');
    
    // Send welcome message
    ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to Learning Platform',
        timestamp: new Date().toISOString()
    }));
    
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log(`📨 Received: ${data.type || 'unknown'}`);
            
            // Echo back for testing
            ws.send(JSON.stringify({
                type: 'echo',
                originalMessage: data,
                timestamp: new Date().toISOString()
            }));
        } catch (error) {
            console.log(`📨 Received text: ${message}`);
            ws.send(JSON.stringify({
                type: 'echo',
                message: `Echo: ${message}`,
                timestamp: new Date().toISOString()
            }));
        }
    });
    
    ws.on('close', () => {
        console.log('👤 Client disconnected');
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Broadcast function for real-time updates
function broadcastUpdate(data) {
    const message = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
    console.log(`📡 Broadcasted: ${data.type}`);
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        connections: wss.clients.size
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('💤 Process terminated');
    });
});

module.exports = app;
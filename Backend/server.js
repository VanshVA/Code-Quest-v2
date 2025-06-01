require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const studentAuthRoutes = require('./routes/studentAuthRoutes');
const teacherAuthRoutes = require('./routes/teacherAuthRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes'); 
const teacherDashboardRoutes = require('./routes/teacherDashboardRoutes');
const studentDashboardRoutes = require('./routes/studentDashboardRoutes');
const createDefaultAdmin = require('./utilities/createDefaultAdmin');
const { updateCompetitionStatuses } = require('./utilities/scheduler');

// Connect to MongoDB
connectDB();

// Create default admin on server start
createDefaultAdmin();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/students/auth', studentAuthRoutes);
app.use('/api/teachers/auth', teacherAuthRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/teacher/dashboard', teacherDashboardRoutes);
app.use('/api/student/dashboard', studentDashboardRoutes);


// Default route
app.get('/', (req, res) => {
  res.send('Code-Quest API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!', error: err.message });
});

// Initialize the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Run the competition status update immediately on startup
  updateCompetitionStatuses();
  
  // Set up a recurring interval to update competition statuses every minute
  setInterval(updateCompetitionStatuses, 60 * 1000); // 60 seconds * 1000 ms
});
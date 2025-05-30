require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const studentAuthRoutes = require('./routes/studentAuthRoutes');
const teacherAuthRoutes = require('./routes/teacherAuthRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const createDefaultAdmin = require('./utilities/createDefaultAdmin');

// Connect to MongoDB
connectDB();

// Create default admin on server start
createDefaultAdmin();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/students/auth', studentAuthRoutes);
app.use('/api/teachers/auth', teacherAuthRoutes);
app.use('/api/admin/auth', adminAuthRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Code-Quest API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
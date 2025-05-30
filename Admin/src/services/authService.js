import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject({ message });
  }
);

// Auth service with admin authentication related API calls
const authService = {
  // Admin login
  login: async (email, password) => {
    const response = await api.post(`${API_BASE_URL}/admin/auth/login`, { email, password });
    
    // Store token and user data if successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.admin));
      localStorage.setItem('userType', 'admin');
    }
    
    return response.data;
  },
  
  // Get admin profile
  getProfile: async () => {
    const response = await api.get(`${API_BASE_URL}/admin/auth/profile`);
    return response.data;
  },
  
  // Update admin password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put(`${API_BASE_URL}/admin/auth/update-password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
  
  // Get statistics for admin dashboard
  getStatistics: async () => {
    const response = await api.get(`${API_BASE_URL}/admin/statistics`);
    return response.data;
  },
  
  // Get all teachers
  getAllTeachers: async (page = 1, limit = 10, filters = {}) => {
    const queryString = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await api.get(`${API_BASE_URL}/admin/teachers?${queryString}`);
    return response.data;
  },
  
  // Get all students
  getAllStudents: async (page = 1, limit = 10, filters = {}) => {
    const queryString = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();
    
    const response = await api.get(`${API_BASE_URL}/admin/students?${queryString}`);
    return response.data;
  },
  
  // Create teacher account
  createTeacher: async (teacherData) => {
    const response = await api.post(`${API_BASE_URL}/admin/teachers`, teacherData);
    return response.data;
  },
  
  // Update teacher account
  updateTeacher: async (teacherId, teacherData) => {
    const response = await api.put(`${API_BASE_URL}/admin/teachers/${teacherId}`, teacherData);
    return response.data;
  },
  
  // Delete teacher account
  deleteTeacher: async (teacherId) => {
    const response = await api.delete(`${API_BASE_URL}/admin/teachers/${teacherId}`);
    return response.data;
  },
  
  // Create student account
  createStudent: async (studentData) => {
    const response = await api.post(`${API_BASE_URL}/admin/students`, studentData);
    return response.data;
  },
  
  // Update student account
  updateStudent: async (studentId, studentData) => {
    const response = await api.put(`${API_BASE_URL}/admin/students/${studentId}`, studentData);
    return response.data;
  },
  
  // Delete student account
  deleteStudent: async (studentId) => {
    const response = await api.delete(`${API_BASE_URL}/admin/students/${studentId}`);
    return response.data;
  },
  
  // Logout admin
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    
    // Redirect to admin login page
    window.location.href = '/login';
  },
  
  // Check if admin is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token') && localStorage.getItem('userType') === 'admin';
  },
  
  // Get current admin data
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  
  // Get current date and time
  getCurrentDateTime: () => {
    return "2025-05-30 09:10:14";
  },
  
  // Get current user's login
  getCurrentUserLogin: () => {
    return "VanshSharmaSDElisten";
  },
};

export default authService;
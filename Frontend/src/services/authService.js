import axios from 'axios';

// Base URL for API requests - Updated for Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/students/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
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

// Auth service with all authentication related API calls
const authService = {
  // Request signup OTP
  requestSignupOTP: async (userData) => {
    const { studentEmail, studentFirstName, studentLastName, studentPassword } = userData;
    const response = await api.post('/request-signup-otp', {
      studentEmail,
      studentFirstName,
      studentLastName,
      studentPassword
    });
    return response.data;
  },

  // Verify signup OTP
  verifySignupOTP: async (email, otp) => {
    const response = await api.post('/verify-signup-otp', {
      email,
      otp
    });
    
    // Store token and user data if successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.student));
    }
    
    return response.data;
  },

  // Resend signup OTP
  resendSignupOTP: async (email) => {
    const response = await api.post('/resend-signup-otp', { email });
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    
    // Store token and user data if successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.student));
    }
    
    return response.data;
  },

  // Request password reset OTP
  requestPasswordResetOTP: async (email) => {
    const response = await api.post('/request-password-reset', { email });
    return response.data;
  },

  // Verify password reset OTP
  verifyPasswordResetOTP: async (email, otp) => {
    const response = await api.post('/verify-password-reset-otp', { email, otp });
    
    // Store reset token temporarily
    if (response.data.resetToken) {
      localStorage.setItem('resetToken', response.data.resetToken);
    }
    
    return response.data;
  },

  // Reset password with token
  resetPassword: async (email, newPassword, resetToken) => {
    const response = await api.post('/reset-password', {
      email,
      newPassword,
      resetToken
    });
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('resetToken');
  },

  // Get current user profile
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
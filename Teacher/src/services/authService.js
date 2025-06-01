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

// Auth service with teacher authentication related API calls
const authService = {
  // Teacher login
  login: async (email, password) => {
    const response = await api.post(`${API_BASE_URL}/teachers/auth/login`, { email, password });
    
    // Store token and user data if successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.teacher));
      localStorage.setItem('userType', 'teacher');
    }
    
    return response.data;
  },

  // Request password reset OTP
  requestPasswordResetOTP: async (email) => {
    const response = await api.post(`${API_BASE_URL}/teachers/auth/request-password-reset`, { email });
    return response.data;
  },
  
  // Verify password reset OTP
  verifyPasswordResetOTP: async (email, otp) => {
    const response = await api.post(`${API_BASE_URL}/teachers/auth/verify-password-reset-otp`, { email, otp });
    
    // Store reset token temporarily
    if (response.data.resetToken) {
      localStorage.setItem('resetToken', response.data.resetToken);
    }
    
    return response.data;
  },
  
  // Reset password
  resetPassword: async (email, newPassword, resetToken) => {
    const response = await api.post(`${API_BASE_URL}/teachers/auth/reset-password`, {
      email,
      newPassword,
      resetToken
    });
    
    // Clear reset token after password reset
    localStorage.removeItem('resetToken');
    
    return response.data;
  },
  
  // Get current teacher profile
  getProfile: async () => {
    const response = await api.get(`${API_BASE_URL}/teacher/dashboard/profile`);
    return response.data;
  },
  
  // Update teacher profile
  updateProfile: async (profileData) => {
    const response = await api.put(`${API_BASE_URL}/teacher/dashboard/profile`, profileData);
    
    // Update stored user data
    if (response.data.success) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.teacher };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return response.data;
  },
  
  // Update teacher password
  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put(`${API_BASE_URL}/teacher/dashboard/password`, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
  
  // Logout teacher
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('resetToken');
    
    // Redirect to login page
    window.location.href = '/login';
  },
  
  // Check if teacher is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token') && localStorage.getItem('userType') === 'teacher';
  },
  
  // Get current teacher data
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  
  // Get current date and time
  getCurrentDateTime: () => {
    return "2025-05-30 09:10:14";
  }
};

/**
 * Get the auth token from local storage
 * @returns {string} The auth token
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Handle API errors
 * @param {Error} error - The error object
 * @throws {Error} A formatted error message
 */
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'An error occurred';
    throw new Error(message);
  } else if (error.request) {
    // Request made but no response
    throw new Error('Server did not respond. Please check your connection.');
  } else {
    // Something else went wrong
    throw new Error('An error occurred. Please try again.');
  }
};

export default authService;
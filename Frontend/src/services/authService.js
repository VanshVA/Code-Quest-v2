import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

// Auth service with all authentication related API calls
const authService = {
  // Student Authentication //
  
  // Request signup OTP
  requestSignupOTP: async (userData) => {
    const { studentEmail, studentFirstName, studentLastName, studentPassword } = userData;
    const response = await api.post(`${API_BASE_URL}/students/auth/request-signup-otp`, {
      studentEmail,
      studentFirstName,
      studentLastName,
      studentPassword
    });
    return response.data;
  },

  // Verify signup OTP
  verifySignupOTP: async (email, otp) => {
    const response = await api.post(`${API_BASE_URL}/students/auth/verify-signup-otp`, {
      email,
      otp
    });
    
    // Store token and user data if successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.student));
      localStorage.setItem('userType', 'student');
    }
    
    return response.data;
  },

  // Resend signup OTP
  resendSignupOTP: async (email) => {
    const response = await api.post(`${API_BASE_URL}/students/auth/resend-signup-otp`, { email });
    return response.data;
  },

  // Student login
  studentLogin: async (email, password) => {
    const response = await api.post(`${API_BASE_URL}/students/auth/login`, { email, password });
    
    // Store token and user data if successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.student));
      localStorage.setItem('userType', 'student');
    }
    
    return response.data;
  },
  
  // Teacher Authentication //
  
  // Teacher login
  teacherLogin: async (email, password) => {
    const response = await api.post(`${API_BASE_URL}/teachers/auth/login`, { email, password });
    
    // Store token and user data if successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.teacher));
      localStorage.setItem('userType', 'teacher');
    }
    
    return response.data;
  },
  
  // Request teacher password reset OTP
  requestTeacherPasswordResetOTP: async (email) => {
    const response = await api.post(`${API_BASE_URL}/teachers/auth/request-password-reset`, { email });
    return response.data;
  },
  
  // Verify teacher password reset OTP
  verifyTeacherPasswordResetOTP: async (email, otp) => {
    const response = await api.post(`${API_BASE_URL}/teachers/auth/verify-password-reset-otp`, { email, otp });
    
    // Store reset token temporarily
    if (response.data.resetToken) {
      localStorage.setItem('resetToken', response.data.resetToken);
      localStorage.setItem('userType', 'teacher');
    }
    
    return response.data;
  },
  
  // Reset teacher password
  resetTeacherPassword: async (email, newPassword, resetToken) => {
    const response = await api.post(`${API_BASE_URL}/teachers/auth/reset-password`, {
      email,
      newPassword,
      resetToken
    });
    return response.data;
  },
  
  // Admin Authentication //
  
  // Admin login
  adminLogin: async (email, password) => {
    const response = await api.post(`${API_BASE_URL}/admin/auth/login`, { email, password });
    
    // Store token and user data if successful
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.admin));
      localStorage.setItem('userType', 'admin');
    }
    
    return response.data;
  },
  
  // Common Functions //
  
  // Request password reset OTP (will use appropriate endpoint based on user type)
  requestPasswordResetOTP: async (email, userType = 'student') => {
    const endpoint = userType === 'teacher' 
      ? `${API_BASE_URL}/teachers/auth/request-password-reset`
      : `${API_BASE_URL}/students/auth/request-password-reset`;
      
    const response = await api.post(endpoint, { email });
    return response.data;
  },
  
  // Verify password reset OTP (will use appropriate endpoint based on user type)
  verifyPasswordResetOTP: async (email, otp, userType = 'student') => {
    const endpoint = userType === 'teacher' 
      ? `${API_BASE_URL}/teachers/auth/verify-password-reset-otp`
      : `${API_BASE_URL}/students/auth/verify-password-reset-otp`;
      
    const response = await api.post(endpoint, { email, otp });
    
    // Store reset token temporarily
    if (response.data.resetToken) {
      localStorage.setItem('resetToken', response.data.resetToken);
      localStorage.setItem('userType', userType);
    }
    
    return response.data;
  },
  
  // Reset password (will use appropriate endpoint based on user type)
  resetPassword: async (email, newPassword, resetToken, userType = 'student') => {
    const endpoint = userType === 'teacher' 
      ? `${API_BASE_URL}/teachers/auth/reset-password`
      : `${API_BASE_URL}/students/auth/reset-password`;
      
    const response = await api.post(endpoint, {
      email,
      newPassword,
      resetToken
    });
    return response.data;
  },
  
  // Login (determines user type and calls appropriate endpoint)
  login: async (email, password, userType = null) => {
    if (userType === 'admin') {
      return authService.adminLogin(email, password);
    } else if (userType === 'teacher') {
      return authService.teacherLogin(email, password);
    } else {
      // Try student login by default or determine by email
      return authService.studentLogin(email, password);
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('resetToken');
  },

  // Get current user
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  
  // Get current user type
  getUserType: () => {
    return localStorage.getItem('userType') || null;
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
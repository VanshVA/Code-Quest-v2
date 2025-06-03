import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with authorization header
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add interceptor to include token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const dashboardService = {
  // Get student/dashboard profile
  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/student/dashboard/profile');
      return response.data;
    } catch (error) {
      console.error('Error getting profile:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update student/dashboard profile
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/student/dashboard/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update student/dashboard password
  updatePassword: async (passwordData) => {
    try {
      const response = await axiosInstance.put('/student/dashboard/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default dashboardService;

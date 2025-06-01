import axios from 'axios';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with authentication header
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to all requests
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

// Handle response errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors - redirect to login
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const dashboardService = {
    // Get student profile
    getProfile: async () => {
        try {
            const response = await axiosInstance.get('/student/dashboard/profile');
            return response.data;
        } catch (error) {
            console.error('Error getting student profile:', error);
            throw error;
        }
    },

    // Get dashboard statistics
    getDashboardStatistics: async () => {
        try {
            const response = await axiosInstance.get('/student/dashboard/dashboard-stats');
            return response.data;
        } catch (error) {
            console.error('Error getting dashboard statistics:', error);
            throw error;
        }
    },

    // Get available competitions with optional filtering
    getAvailableCompetitions: async (queryParams = {}) => {
        try {
            // Handle pagination and filtering
            const params = {
                page: queryParams.page || 1,
                limit: queryParams.limit || 10,
                status: queryParams.status || '' // 'joined', 'new', or empty for all
            };
            
            const response = await axiosInstance.get('/student/dashboard/competitions', { params });
            return response.data;
        } catch (error) {
            console.error('Error getting competitions:', error);
            throw error;
        }
    },

    // Get competition overview (without questions)
    getCompetitionOverview: async (id) => {
        try {
            const response = await axiosInstance.get(`/student/dashboard/competitions/${id}/overview`);
            return response.data;
        } catch (error) {
            console.error('Error getting competition overview:', error);
            throw error;
        }
    },

    // Get competition details with questions (for taking the competition)
    getCompetitionDetails: async (id) => {
        try {
            const response = await axiosInstance.get(`/student/dashboard/competitions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error getting competition details:', error);
            throw error;
        }
    },

    // Get active competition (shorthand for most recent active competition)
    getActiveCompetition: async () => {
        try {
            const response = await axiosInstance.get('/student/dashboard/competitions/active');
            return response.data;
        } catch (error) {
            console.error('Error getting active competition:', error);
            throw error;
        }
    },

    // Join a competition
    joinCompetition: async (id) => {
        try {
            const response = await axiosInstance.post(`/student/dashboard/competitions/${id}/join`);
            return response.data;
        } catch (error) {
            console.error('Error joining competition:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to join competition. Please try again.'
            };
        }
    },

    // Save competition answers without submitting (for auto-save)
    saveCompetitionAnswers: async (id, data) => {
        try {
            const cleanData = {
                answers: data.answers.map(answer => ({
                    questionId: answer.questionId,
                    answer: String(answer.answer || ''), // Convert to string
                    questionType: answer.questionType
                })),
                timeSpent: data.timeSpent || 0
            };
            
            const response = await axiosInstance.post(`/student/dashboard/competitions/${id}/save`, cleanData);
            return response.data;
        } catch (error) {
            console.error('Error saving competition progress:', error);
            throw error;
        }
    },

    // Submit competition answers
    submitCompetitionAnswers: async (id, data) => {
        try {
            // Ensure answers are in the correct format to avoid circular references
            const cleanData = {
                answers: data.answers.map(answer => ({
                    questionId: answer.questionId,
                    answer: String(answer.answer || ''), // Convert to string
                })),
                timeSpent: data.timeSpent || 0
            };

            const response = await axiosInstance.post(`/student/dashboard/competitions/${id}/submit`, cleanData);
            return response.data;
        } catch (error) {
            console.error('Error submitting answers:', error);
            if (error.response && error.response.data) {
                return error.response.data;
            }
            return {
                success: false,
                message: error.message || 'Failed to submit answers'
            };
        }
    },
    
    // Get competition results
    getCompetitionResults: async (competitionId) => {
        try {
            const response = await axiosInstance.get(`/student/dashboard/competitions/${competitionId}/results`);
            return response.data;
        } catch (error) {
            console.error('Error getting competition results:', error);
            throw error;
        }
    },

    // Get competition leaderboard
    getCompetitionLeaderboard: async (competitionId, limit = 10) => {
        try {
            const response = await axiosInstance.get(`/student/dashboard/competitions/${competitionId}/leaderboard`, {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting competition leaderboard:', error);
            throw error;
        }
    }
};

export default dashboardService;
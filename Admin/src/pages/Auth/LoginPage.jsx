import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import authService from '../../services/authService';

// Current date and time from global state
const CURRENT_DATE_TIME = "2025-05-30 09:51:37";
const CURRENT_USER = "VanshSharmaSDEimport";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginStatus, setLoginStatus] = useState({ show: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };
  
  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsLoading(true);
        
        // Call admin login API
        const response = await authService.login(formData.email, formData.password);
        
        // Handle successful login
        setLoginStatus({
          show: true,
          type: 'success',
          message: 'Login successful! Redirecting to admin dashboard...',
        });
        
        // Redirect after login
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      } catch (error) {
        setLoginStatus({
          show: true,
          type: 'error',
          message: error.message || 'Invalid admin credentials. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setLoginStatus({
        show: true,
        type: 'error',
        message: 'Please correct the errors in the form.',
      });
    }
  };
  
  // Close status alert
  const handleCloseAlert = () => {
    setLoginStatus({ ...loginStatus, show: false });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(22, 28, 36, 0.94)'
          : 'rgba(249, 250, 251, 0.94)',
      }}
    >
      {/* Current Time Display */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          px: 2.5,
          py: 1,
          borderRadius: '8px',
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="body2" 
          sx={{
            fontFamily: 'monospace',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          UTC: {CURRENT_DATE_TIME}
          <Box 
            component="span"
            sx={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: theme.palette.success.main,
              ml: 1.5,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 0.6, transform: 'scale(0.9)' },
                '50%': { opacity: 1, transform: 'scale(1.1)' },
                '100%': { opacity: 0.6, transform: 'scale(0.9)' },
              },
            }}
          />
        </Typography>
      </MotionBox>
      
      {/* Main Content */}
      <Container maxWidth="sm">
        <MotionPaper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: '16px',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <Box 
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '12px',
                    backgroundColor: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 16px ${theme.palette.primary.main}40`,
                  }}
                >
                  <AdminPanelSettings sx={{ color: 'white', fontSize: '2rem' }} />
                </Box>
              </MotionBox>
            </Box>
            <MotionTypography 
              variant="h4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              sx={{ 
                fontWeight: 700,
                mb: 1,
              }}
            >
              Admin Login
            </MotionTypography>
            <MotionTypography
              variant="body2"
              color="textSecondary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Access Code-Quest administrator panel
            </MotionTypography>
          </Box>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Email Field */}
              <FormControl fullWidth error={!!errors.email}>
                <TextField
                  label="Admin Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  autoComplete="email"
                  error={!!errors.email}
                  InputProps={{
                    sx: { borderRadius: '8px' }
                  }}
                />
                {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
              </FormControl>
              
              {/* Password Field */}
              <FormControl fullWidth error={!!errors.password}>
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  autoComplete="current-password"
                  error={!!errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '8px' }
                  }}
                />
                {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
              </FormControl>
              
              {/* Login Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
                sx={{ 
                  mt: 2,
                  borderRadius: '8px',
                  py: 1.5,
                  backgroundColor: theme.palette.primary.main,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    boxShadow: `0 8px 16px ${theme.palette.primary.main}40`,
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In to Admin Panel'
                )}
              </Button>
            </Stack>
          </form>
          
          {/* Security Notice */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'action.hover', borderRadius: '8px' }}>
            <Typography variant="caption" color="textSecondary" align="center" display="block">
              This is a secured administrative area. Unauthorized access attempts are logged and may be reported.
            </Typography>
          </Box>
        </MotionPaper>
        
        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            © {new Date().getFullYear()} Code-Quest Administration System
          </Typography>
        </Box>
      </Container>
      
      {/* Login Status Alert */}
      <Snackbar
        open={loginStatus.show}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={loginStatus.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {loginStatus.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLoginPage;
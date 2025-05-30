import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  CheckCircleOutline,
  ErrorOutline,
  Info,
  ArrowBack,
  LoginOutlined,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import authService from '../../services/authService';

// Current date and user info from global state
const CURRENT_DATE_TIME = "2025-05-30 06:08:07";
const CURRENT_USER = "VanshSharmaSDEimport";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Get email from URL parameters and reset token from localStorage
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || '';
  const resetToken = localStorage.getItem('resetToken') || '';
  
  // State
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusAlert, setStatusAlert] = useState({ show: false, type: '', message: '' });
  
  // Password requirements
  const passwordRequirements = [
    { 
      id: 'length', 
      label: 'At least 8 characters', 
      validator: (password) => password.length >= 8,
      met: false
    },
    { 
      id: 'uppercase', 
      label: 'At least one uppercase letter', 
      validator: (password) => /[A-Z]/.test(password),
      met: false
    },
    { 
      id: 'lowercase', 
      label: 'At least one lowercase letter', 
      validator: (password) => /[a-z]/.test(password),
      met: false
    },
    { 
      id: 'number', 
      label: 'At least one number', 
      validator: (password) => /\d/.test(password),
      met: false
    },
    { 
      id: 'special', 
      label: 'At least one special character', 
      validator: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
      met: false
    }
  ].map(req => ({
    ...req,
    met: req.validator(formData.newPassword)
  }));
  
  // Canvas animation for background
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Premium gradient orbs class with improved rendering
    class GradientOrb {
      constructor() {
        this.reset();
      }
      
      reset() {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * (isMobile ? 100 : 180) + (isMobile ? 30 : 50);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.12 + 0.04;
        
        // Premium color combinations
        const colorSets = [
          { start: '#bc4037', end: '#f47061' }, // Primary red
          { start: '#9a342d', end: '#bd5c55' }, // Dark red
          { start: '#2C3E50', end: '#4A6572' }, // Dark blue
          { start: '#3a47d5', end: '#00d2ff' }, // Blue
        ];
        
        this.colors = colorSets[Math.floor(Math.random() * colorSets.length)];
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        // Bounce effect at edges
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
      }
      
      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        const startColor = this.hexToRgba(this.colors.start, this.opacity);
        const endColor = this.hexToRgba(this.colors.end, 0);
        
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }
    
    // Create optimal number of orbs based on screen size
    const orbCount = isMobile ? 6 : 10;
    const orbs = Array(orbCount).fill().map(() => new GradientOrb());
    
    // Animation loop with performance optimization
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      orbs.forEach((orb) => {
        orb.update();
        orb.draw();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isMobile, isDark]);
  
  // Validate token and email
  useEffect(() => {
    const validateResetSession = async () => {
      // Check if we have both email and reset token
      if (!email || !resetToken) {
        setIsTokenValid(false);
        setIsValidatingToken(false);
        
        setStatusAlert({
          show: true,
          type: 'error',
          message: 'Invalid or expired password reset session. Please request a new password reset.',
        });
        
        return;
      }
      
      // If we have both, consider the token valid
      // In a real app, you might want to validate the token with the backend
      setIsTokenValid(true);
      setIsValidatingToken(false);
    };
    
    // Short delay to simulate validation
    setTimeout(() => {
      validateResetSession();
    }, 1000);
  }, [email, resetToken]);
  
  // Update password strength based on requirements met
  useEffect(() => {
    // Calculate how many requirements are met
    const metRequirements = passwordRequirements.filter(req => req.validator(formData.newPassword)).length;
    
    // Map to a 0-100 scale
    const strength = (metRequirements / passwordRequirements.length) * 100;
    setPasswordStrength(strength);
    
  }, [formData.newPassword]);
  
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
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Validate that all password requirements are met
    const allRequirementsMet = passwordRequirements.every(req => req.validator(formData.newPassword));
    
    if (!allRequirementsMet) {
      newErrors.newPassword = 'Password does not meet all requirements';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsSubmitting(true);
        
        // Call API to reset password
        await authService.resetPassword(
          email,
          formData.newPassword,
          resetToken
        );
        
        // Clear reset token from localStorage
        localStorage.removeItem('resetToken');
        
        // Show success message
        setStatusAlert({
          show: true,
          type: 'success',
          message: 'Your password has been reset successfully!',
        });
        
        setIsSubmitted(true);
        
        // Redirect to login after delay
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatusAlert({
          show: true,
          type: 'error',
          message: error.message || 'Failed to reset password. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setStatusAlert({
        show: true,
        type: 'error',
        message: 'Please correct the errors in the form.',
      });
    }
  };
  
  // Close status alert
  const handleCloseAlert = () => {
    setStatusAlert({ ...statusAlert, show: false });
  };
  
  // Get color for password strength bar
  const getStrengthColor = () => {
    if (passwordStrength < 40) return theme.palette.error.main;
    if (passwordStrength < 70) return theme.palette.warning.main;
    return theme.palette.success.main;
  };
  
  // Handle redirect to login
  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
      }}
    >
      {/* Canvas Background for Premium Gradient Animation */}
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
      }}>
        <canvas 
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
        {/* Overlay for better text contrast */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: isDark ? 'rgba(30, 28, 28, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(30px)',
          }} 
        />
      </Box>
      
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
          borderRadius: '100px',
          backdropFilter: 'blur(10px)',
          backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="body2" 
          sx={{
            fontFamily: 'monospace',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
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
      <Container maxWidth="xs">
        <MotionPaper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: '24px',
            backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
            boxShadow: isDark ? '0 25px 65px rgba(0, 0, 0, 0.3)' : '0 25px 65px rgba(0, 0, 0, 0.1)',
          }}
        >
          {isValidatingToken ? (
            // Loading state
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress color="primary" size={60} sx={{ mb: 3 }} />
              <Typography variant="h6">Validating reset token...</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Please wait while we verify your reset token.
              </Typography>
            </Box>
          ) : isTokenValid && !isSubmitted ? (
            // Reset password form
            <>
              {/* Title and Description */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
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
                        borderRadius: '16px',
                        background: theme.palette.gradients.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 12px 24px rgba(188, 64, 55, 0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Shine animation */}
                      <Box 
                        component={motion.div}
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          zIndex: 1,
                        }}
                      />
                      <Lock sx={{ color: 'white', fontSize: '2rem', zIndex: 2 }} />
                    </Box>
                  </MotionBox>
                </Box>
                <MotionTypography 
                  variant="h4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  sx={{ 
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  Reset Password
                </MotionTypography>
                <MotionTypography
                  variant="body1"
                  color="textSecondary"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Create a new, strong password for
                </MotionTypography>
                <MotionTypography
                  variant="body1"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  sx={{ fontWeight: 600 }}
                >
                  {email}
                </MotionTypography>
              </Box>
              
              {/* Reset Password Form */}
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* New Password Field */}
                  <FormControl fullWidth error={!!errors.newPassword}>
                    <TextField
                      label="New Password"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={handleChange}
                      variant="outlined"
                      error={!!errors.newPassword}
                      autoComplete="new-password"
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
                        sx: { borderRadius: '12px' }
                      }}
                    />
                    {errors.newPassword && <FormHelperText>{errors.newPassword}</FormHelperText>}
                  </FormControl>
                  
                  {/* Password Strength Indicator */}
                  {formData.newPassword && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          Password Strength
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: getStrengthColor(),
                          }}
                        >
                          {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Medium' : 'Strong'}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={passwordStrength} 
                        sx={{ 
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getStrengthColor(),
                          }
                        }} 
                      />
                      
                      {/* Password Requirements Checklist */}
                      <Box sx={{ mt: 2 }}>
                        {passwordRequirements.map((req, index) => (
                          <Box 
                            key={req.id} 
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              mb: 0.5,
                              color: req.met ? theme.palette.success.main : 'text.secondary',
                            }}
                          >
                            {req.met ? (
                              <CheckCircleOutline fontSize="small" sx={{ mr: 1 }} />
                            ) : (
                              <Info fontSize="small" sx={{ mr: 1, opacity: 0.6 }} />
                            )}
                            <Typography 
                              variant="caption"
                              sx={{
                                fontWeight: req.met ? 600 : 400,
                              }}
                            >
                              {req.label}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {/* Confirm Password Field */}
                  <FormControl fullWidth error={!!errors.confirmPassword}>
                    <TextField
                      label="Confirm New Password"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      variant="outlined"
                      autoComplete="new-password"
                      error={!!errors.confirmPassword}
                      InputProps={{
                        sx: { borderRadius: '12px' }
                      }}
                    />
                    {errors.confirmPassword && <FormHelperText>{errors.confirmPassword}</FormHelperText>}
                  </FormControl>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={isSubmitting}
                    sx={{ 
                      mt: 2,
                      borderRadius: '12px',
                      py: 1.8,
                      background: theme.palette.gradients.primary,
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1rem',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                        transition: 'all 0.5s ease',
                      },
                      '&:hover': {
                        boxShadow: '0 10px 20px rgba(188, 64, 55, 0.3)',
                        '&::after': {
                          left: '100%',
                        }
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </Stack>
              </form>
            </>
          ) : isSubmitted ? (
            // Success Message
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.success.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3,
                  boxShadow: '0 12px 24px rgba(76, 175, 80, 0.3)',
                }}
              >
                <CheckCircleOutline sx={{ fontSize: 50, color: 'white' }} />
              </MotionBox>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                Password Reset Successful
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Your password has been reset successfully. You will be redirected to the login page shortly.
              </Typography>
              <CircularProgress size={24} color="primary" />
            </Box>
          ) : (
            // Invalid Token Message
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <MotionBox
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.error.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3,
                  boxShadow: '0 12px 24px rgba(244, 67, 54, 0.3)',
                }}
              >
                <ErrorOutline sx={{ fontSize: 50, color: 'white' }} />
              </MotionBox>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                Invalid or Expired Link
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                This password reset session is invalid or has expired. Please request a new password reset.
              </Typography>
              <Button
                component={RouterLink}
                to="/forgot-password"
                variant="contained"
                color="primary"
                sx={{ 
                  borderRadius: '12px',
                  py: 1.5,
                  px: 4,
                  background: theme.palette.gradients.primary,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Request New Link
              </Button>
            </Box>
          )}
          
          {/* Back to Login Link */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/login"
              startIcon={<ArrowBack />}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Back to Login
            </Button>
          </Box>
        </MotionPaper>
        
        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            © {new Date().getFullYear()} Code-Quest. All rights reserved.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Link 
              component={RouterLink} 
              to="/terms"
              variant="caption"
              color="textSecondary"
              underline="hover"
              sx={{ mx: 1 }}
            >
              Terms of Service
            </Link>
            <Link 
              component={RouterLink} 
              to="/privacy"
              variant="caption"
              color="textSecondary"
              underline="hover"
              sx={{ mx: 1 }}
            >
              Privacy Policy
            </Link>
            <Link 
              component={RouterLink} 
              to="/help"
              variant="caption"
              color="textSecondary"
              underline="hover"
              sx={{ mx: 1 }}
            >
              Help Center
            </Link>
          </Box>
        </Box>
      </Container>
      
      {/* Status Alert */}
      <Snackbar
        open={statusAlert.show}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={statusAlert.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {statusAlert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResetPasswordPage;
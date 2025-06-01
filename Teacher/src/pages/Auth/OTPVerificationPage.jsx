import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  Link,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  LockOutlined,
  ArrowBack,
  CheckCircleOutline,
  ErrorOutline,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import authService from '../../services/authService';

// Current date and time
const CURRENT_DATE_TIME = new Date().toISOString().replace('T', ' ').substring(0, 19);

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Get email from URL parameters
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || localStorage.getItem('resetEmail') || '';
  
  // State
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusAlert, setStatusAlert] = useState({ show: false, type: '', message: '' });
  
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
  
  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }
    
    if (!email) {
      setError('Email not found. Please go back to the forgot password page.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call API to verify OTP
      const response = await authService.verifyPasswordResetOTP(email, otp);
      
      // Store reset token for password reset
      if (response.resetToken) {
        localStorage.setItem('resetToken', response.resetToken);
      }
      
      setStatusAlert({
        show: true,
        type: 'success',
        message: 'Verification successful! You can now reset your password.',
      });
      
      setIsSubmitted(true);
      
      // After a short delay, navigate to password reset page
      setTimeout(() => {
        navigate(`/reset-password/${response.resetToken}?email=${encodeURIComponent(email)}`);
      }, 2000);
      
    } catch (error) {
      setStatusAlert({
        show: true,
        type: 'error',
        message: error.message || 'Invalid verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Request new OTP
  const handleResendOTP = async () => {
    if (!email) {
      setError('Email not found. Please go back to the forgot password page.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call API to request new OTP
      await authService.requestPasswordResetOTP(email);
      
      setStatusAlert({
        show: true,
        type: 'success',
        message: 'New verification code sent! Please check your email inbox.',
      });
    } catch (error) {
      setStatusAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to send new verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Close alert
  const handleCloseAlert = () => {
    setStatusAlert({ ...statusAlert, show: false });
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
      {/* Canvas Background */}
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
          {!isSubmitted ? (
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
                      <LockOutlined sx={{ color: 'white', fontSize: '2rem', zIndex: 2 }} />
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
                  Verify Your Email
                </MotionTypography>
                <MotionTypography
                  variant="body1"
                  color="textSecondary"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Enter the 6-digit code sent to
                </MotionTypography>
                <MotionTypography
                  variant="body1"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  sx={{ fontWeight: 600 }}
                >
                  {email || 'your email'}
                </MotionTypography>
              </Box>
              
              {/* OTP Verification Form */}
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth error={!!error} sx={{ mb: 3 }}>
                  <TextField
                    label="Verification Code"
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    variant="outlined"
                    placeholder="Enter 6-digit code"
                    inputProps={{ inputMode: 'numeric', maxLength: 6 }}
                    error={!!error}
                    disabled={isLoading}
                    sx={{
                      '& input': {
                        letterSpacing: '0.5em',
                        textAlign: 'center',
                        fontWeight: 600,
                        fontSize: '1.2rem',
                      },
                    }}
                    InputProps={{
                      sx: { borderRadius: '12px' }
                    }}
                    autoFocus
                  />
                  {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
                
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={isLoading}
                  sx={{ 
                    mt: 1,
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
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Verify Code'
                  )}
                </Button>
                
                {/* Resend Code Option */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Didn't receive the code?{' '}
                    <Link
                      component="button"
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      variant="body2"
                      color="primary"
                      underline="hover"
                      sx={{ fontWeight: 600 }}
                    >
                      Resend Code
                    </Link>
                  </Typography>
                </Box>
              </form>
            </>
          ) : (
            /* Success Message */
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
                Verification Successful
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                Your identity has been verified. You'll be redirected to reset your password.
              </Typography>
              <CircularProgress size={24} sx={{ color: 'var(--theme-color)' }} />
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

export default OTPVerificationPage;

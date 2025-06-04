import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
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
  Email,
  ArrowBack,
  LockReset,
  CheckCircleOutline,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import authService from '../../services/authService';

// Current date and user info from global state
const CURRENT_DATE_TIME = "2025-05-30 06:08:07";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
  
  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };
  
  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Call API to request password reset OTP
      await authService.requestPasswordResetOTP(email);
      
      setStatusAlert({
        show: true,
        type: 'success',
        message: 'Verification code sent! Please check your email inbox.',
      });
      
      setSubmitted(true);
      
      // After a short delay, navigate to OTP verification page
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}&type=reset`);
      }, 3000);
      
    } catch (error) {
      setStatusAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to send verification code. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Try another email
  const handleTryAnotherEmail = () => {
    setSubmitted(false);
    setEmail('');
  };
  
  // Handle alert close
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
          {!submitted ? (
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
                      <LockReset sx={{ color: 'white', fontSize: '2rem', zIndex: 2 }} />
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
                  Forgot Password
                </MotionTypography>
                <MotionTypography
                  variant="body1"
                  color="textSecondary"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Enter your email address to receive a verification code
                </MotionTypography>
              </Box>
              
              {/* Reset Password Form */}
              <form onSubmit={handleSubmit}>
                <FormControl fullWidth error={!!error} sx={{ mb: 3 }}>
                  <TextField
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    variant="outlined"
                    placeholder="your.email@example.com"
                    error={!!error}
                    disabled={isLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color={error ? "error" : "primary"} />
                        </InputAdornment>
                      ),
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
                    'Send Verification Code'
                  )}
                </Button>
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
                Check Your Email
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                We've sent a verification code to <strong>{email}</strong>. Please check your inbox.
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                Redirecting to verification page...
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

export default ForgotPasswordPage;
import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
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
  ArrowBack,
  CheckCircleOutline,
  ErrorOutline,
  VerifiedUser,
  Refresh,
  LockOpen,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import authService from '../../services/authService';

// Current date and user info from global state
const CURRENT_DATE_TIME = "2025-05-30 04:25:46";
const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const OTPVerificationPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Get email and verification type from URL
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email') || 'your.email@example.com';
  const verificationType = searchParams.get('type') || 'signup'; // 'signup' or 'reset'
  
  // State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState(120); // 2 minutes countdown
  const [statusAlert, setStatusAlert] = useState({ show: false, type: '', message: '' });
  
  // Refs for OTP input fields
  const inputRefs = useRef([]);
  
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
  
  // Timer countdown
  useEffect(() => {
    if (remainingTime <= 0 || isVerified) return;
    
    const timer = setTimeout(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [remainingTime, isVerified]);
  
  // Format remaining time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle OTP digit input
  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    
    // Allow only numbers
    if (value && !/^[0-9]$/.test(value)) return;
    
    // Update the digit
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    setError('');
    
    // Auto focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  // Handle backspace in OTP input
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      // If current field is empty and backspace is pressed, focus on previous field
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index - 1] = '';
      setOtpDigits(newOtpDigits);
      inputRefs.current[index - 1].focus();
    }
  };
  
  // Handle paste for OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted content is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpDigits(digits);
      inputRefs.current[5].focus();
    }
  };
  
  // Resend OTP - updated with API integration
  const handleResendOtp = async () => {
    try {
      setStatusAlert({
        show: true,
        type: 'info',
        message: 'Sending new verification code...',
      });
      
      // API call to resend OTP
      if (verificationType === 'signup') {
        await authService.resendSignupOTP(email);
      } else {
        await authService.requestPasswordResetOTP(email);
      }
      
      // Reset OTP fields
      setOtpDigits(['', '', '', '', '', '']);
      
      // Reset error
      setError('');
      
      // Reset timer
      setRemainingTime(120);
      
      // Show success alert
      setStatusAlert({
        show: true,
        type: 'success',
        message: 'A new verification code has been sent to your email.',
      });
      
      // Focus on first input
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (error) {
      setStatusAlert({
        show: true,
        type: 'error',
        message: error.message || 'Failed to resend verification code. Please try again.',
      });
    }
  };
  
  // Verify OTP - updated with API integration
  const handleVerifyOtp = async () => {
    // Check if all digits are entered
    if (otpDigits.some(digit => digit === '')) {
      setError('Please enter all digits of the verification code');
      return;
    }
    
    // Start verification process
    setIsVerifying(true);
    
    try {
      const enteredOtp = otpDigits.join('');
      
      let response;
      if (verificationType === 'signup') {
        // Call signup OTP verification
        response = await authService.verifySignupOTP(email, enteredOtp);
      } else {
        // Call password reset OTP verification
        response = await authService.verifyPasswordResetOTP(email, enteredOtp);
      }
      
      setIsVerified(true);
      setStatusAlert({
        show: true,
        type: 'success',
        message: verificationType === 'signup' 
          ? 'Your account has been verified successfully!' 
          : 'Verification successful! You can now reset your password.',
      });
      
      // Redirect based on verification type
      setTimeout(() => {
        if (verificationType === 'signup') {
          // For signup, redirect to dashboard or login
          navigate('/dashboard');
        } else {
          // For password reset, redirect to reset password page
          navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        }
      }, 2000);
    } catch (error) {
      setError('Invalid verification code. Please try again.');
      setStatusAlert({
        show: true,
        type: 'error',
        message: error.message || 'Invalid verification code. Please check and try again.',
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Handle alert close
  const handleCloseAlert = () => {
    setStatusAlert({ ...statusAlert, show: false });
  };
  
  // Update headings based on verification type
  const getPageTitle = () => {
    return verificationType === 'signup' ? 'Account Verification' : 'Reset Password';
  };

  const getVerificationMessage = () => {
    return verificationType === 'signup' 
      ? 'Verify your account to get started' 
      : 'Enter the code to reset your password';
  };
  
  // Auto focus first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

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
          {!isVerified ? (
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
                      <VerifiedUser sx={{ color: 'white', fontSize: '2rem', zIndex: 2 }} />
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
                  {getPageTitle()}
                </MotionTypography>
                <MotionTypography
                  variant="body1"
                  color="textSecondary"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  sx={{ mb: 1 }}
                >
                  {getVerificationMessage()}
                </MotionTypography>
                <MotionTypography
                  variant="body1"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  sx={{ fontWeight: 600 }}
                >
                  {email}
                </MotionTypography>
              </Box>
              
              {/* OTP Input */}
              <Box sx={{ mb: 4 }}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: { xs: 1, sm: 2 },
                  }}
                >
                  {otpDigits.map((digit, index) => (
                    <TextField
                      key={index}
                      inputRef={(el) => (inputRefs.current[index] = el)}
                      value={digit}
                      onChange={(e) => handleOtpChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={index === 0 ? handlePaste : null}
                      variant="outlined"
                      inputProps={{ 
                        maxLength: 1,
                        style: { 
                          textAlign: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          padding: '12px 0',
                        }
                      }}
                      sx={{
                        width: '100%',
                        maxWidth: '50px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                              borderWidth: 2,
                            }
                          }
                        }
                      }}
                      error={!!error && digit === ''}
                    />
                  ))}
                </Box>
                {error && (
                  <FormHelperText error sx={{ textAlign: 'center', mt: 1 }}>
                    {error}
                  </FormHelperText>
                )}
              </Box>
              
              {/* Verify Button */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleVerifyOtp}
                disabled={isVerifying || otpDigits.some(digit => digit === '')}
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
                {isVerifying ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Verify Code'
                )}
              </Button>
              
              {/* Resend Code */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Didn't receive the code?
                </Typography>
                {remainingTime > 0 ? (
                  <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                    Resend in {formatTime(remainingTime)}
                  </Typography>
                ) : (
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleResendOtp}
                    startIcon={<Refresh />}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Resend Code
                  </Button>
                )}
              </Box>
              
              {/* Back Link */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  component={RouterLink}
                  to={verificationType === 'signup' ? '/signup' : '/forgot-password'}
                  startIcon={<ArrowBack />}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {verificationType === 'signup' ? 'Back to Signup' : 'Back to Forgot Password'}
                </Button>
              </Box>
            </>
          ) : (
            // Success Message - updated for different verification types
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
                {verificationType === 'signup' 
                  ? 'Your account has been verified successfully. You will be redirected to the dashboard shortly.' 
                  : 'Your identity has been verified. You will be redirected to reset your password.'}
              </Typography>
              <CircularProgress size={30} color="primary" />
            </Box>
          )}
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
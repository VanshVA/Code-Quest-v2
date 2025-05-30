import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Snackbar,
  Stack,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Apple,
  GitHub,
  Google,
  Visibility,
  VisibilityOff,
  PersonAddOutlined,
  ArrowForward,
  ArrowBack,
  HowToReg,
  Check,
  AccountCircle,
  Email,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Current date and user info from global state
const CURRENT_DATE_TIME = "2025-05-30 04:04:53";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const SignupPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Account Details', 'Personal Information', 'Complete'];
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: '',
    acceptTerms: false,
    allowMarketing: true,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [signupStatus, setSignupStatus] = useState({ show: false, type: '', message: '' });
  
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
  
  // Validate account info (step 1)
  const validateAccountInfo = () => {
    const stepErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!formData.email) {
      stepErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      stepErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      stepErrors.password = 'Password is required';
    } else if (!passwordRegex.test(formData.password)) {
      stepErrors.password = 'Password must be at least 8 characters, with a mix of uppercase, lowercase, numbers and special characters';
    }
    
    if (!formData.confirmPassword) {
      stepErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      stepErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };
  
  // Validate personal info (step 2)
  const validatePersonalInfo = () => {
    const stepErrors = {};
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    
    if (!formData.firstName) {
      stepErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      stepErrors.lastName = 'Last name is required';
    }
    
    if (!formData.username) {
      stepErrors.username = 'Username is required';
    } else if (!usernameRegex.test(formData.username)) {
      stepErrors.username = 'Username must be 3-20 characters long and may only contain letters, numbers, underscores and hyphens';
    }
    
    if (!formData.acceptTerms) {
      stepErrors.acceptTerms = 'You must accept the Terms of Service and Privacy Policy';
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
  
  // Handle next step
  const handleNext = () => {
    let isValid = false;
    
    // Validate current step
    if (activeStep === 0) {
      isValid = validateAccountInfo();
    } else if (activeStep === 1) {
      isValid = validatePersonalInfo();
    }
    
    if (isValid) {
      if (activeStep === steps.length - 2) {
        // This would be an API call in a real application
        console.log('Signup data:', formData);
        
        // Simulate signup success
        setSignupStatus({
          show: true,
          type: 'success',
          message: 'Your account has been created successfully!',
        });
      }
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      setSignupStatus({
        show: true,
        type: 'error',
        message: 'Please correct the errors in the form.',
      });
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Close status alert
  const handleCloseAlert = () => {
    setSignupStatus({ ...signupStatus, show: false });
  };
  
  // Handle completion and go to login
  const handleGoToLogin = () => {
    window.location.href = '/login';
  };
  
  // Render step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            {/* Email Field */}
            <FormControl fullWidth error={!!errors.email}>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                placeholder="your.email@example.com"
                error={!!errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color={errors.email ? "error" : "primary"} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '12px' }
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
                  sx: { borderRadius: '12px' }
                }}
              />
              {errors.password ? (
                <FormHelperText>{errors.password}</FormHelperText>
              ) : (
                <FormHelperText>
                  Use at least 8 characters with uppercase, lowercase, numbers and special characters
                </FormHelperText>
              )}
            </FormControl>
            
            {/* Confirm Password Field */}
            <FormControl fullWidth error={!!errors.confirmPassword}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
                error={!!errors.confirmPassword}
                InputProps={{
                  sx: { borderRadius: '12px' }
                }}
              />
              {errors.confirmPassword && <FormHelperText>{errors.confirmPassword}</FormHelperText>}
            </FormControl>
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={3}>
            {/* First Name Field */}
            <FormControl fullWidth error={!!errors.firstName}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
                placeholder="John"
                error={!!errors.firstName}
                InputProps={{
                  sx: { borderRadius: '12px' }
                }}
              />
              {errors.firstName && <FormHelperText>{errors.firstName}</FormHelperText>}
            </FormControl>
            
            {/* Last Name Field */}
            <FormControl fullWidth error={!!errors.lastName}>
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                placeholder="Doe"
                error={!!errors.lastName}
                InputProps={{
                  sx: { borderRadius: '12px' }
                }}
              />
              {errors.lastName && <FormHelperText>{errors.lastName}</FormHelperText>}
            </FormControl>
            
            {/* Username Field */}
            <FormControl fullWidth error={!!errors.username}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
                placeholder="johndoe"
                error={!!errors.username}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle color={errors.username ? "error" : "primary"} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '12px' }
                }}
              />
              {errors.username ? (
                <FormHelperText>{errors.username}</FormHelperText>
              ) : (
                <FormHelperText>
                  Your username will be visible to other users
                </FormHelperText>
              )}
            </FormControl>
            
            {/* Terms Agreement */}
            <FormControl fullWidth error={!!errors.acceptTerms}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    name="acceptTerms"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <Link component={RouterLink} to="/terms" underline="hover" color="primary">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link component={RouterLink} to="/privacy" underline="hover" color="primary">
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />
              {errors.acceptTerms && <FormHelperText>{errors.acceptTerms}</FormHelperText>}
            </FormControl>
            
            {/* Marketing Consent */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.allowMarketing}
                  onChange={handleChange}
                  name="allowMarketing"
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I would like to receive updates about products, services and promotions
                </Typography>
              }
            />
          </Stack>
        );
      case 2:
        return (
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
                width: 120,
                height: 120,
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
              <Check sx={{ fontSize: 80, color: 'white' }} />
            </MotionBox>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
              Account Created!
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              Your account has been created successfully. Please check your email to verify your account.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoToLogin}
              size="large"
              sx={{
                borderRadius: '12px',
                py: 1.8,
                px: 5,
                background: theme.palette.gradients.primary,
                fontWeight: 700,
                boxShadow: '0 10px 20px rgba(188, 64, 55, 0.3)',
              }}
            >
              Go to Login
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
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
      <Container maxWidth="sm">
        <MotionPaper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          sx={{ 
            p: { xs: 3, md: 6 }, 
            borderRadius: '24px',
            backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
            boxShadow: isDark ? '0 25px 65px rgba(0, 0, 0, 0.3)' : '0 25px 65px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Logo and Title */}
          <Box sx={{ mb: activeStep === 2 ? 2 : 4, textAlign: 'center' }}>
            {activeStep !== 2 && (
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
                    <PersonAddOutlined sx={{ color: 'white', fontSize: '2rem', zIndex: 2 }} />
                  </Box>
                </MotionBox>
              </Box>
            )}
            {activeStep !== 2 && (
              <>
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
                  Create an Account
                </MotionTypography>
                <MotionTypography
                  variant="body1"
                  color="textSecondary"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Join Code-Quest to start your coding journey
                </MotionTypography>
              </>
            )}
          </Box>
          
          {/* Stepper */}
          {activeStep !== 2 && (
            <Stepper 
              activeStep={activeStep} 
              alternativeLabel
              sx={{ mb: 5 }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          
          {/* Form Content */}
          {getStepContent(activeStep)}
          
          {/* Navigation Buttons */}
          {activeStep !== 2 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
                startIcon={<ArrowBack />}
                sx={{ 
                  borderRadius: '12px', 
                  borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                  color: 'text.primary',
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={activeStep === steps.length - 2 ? <HowToReg /> : <ArrowForward />}
                sx={{ 
                  borderRadius: '12px',
                  py: 1.2,
                  px: 3,
                  background: theme.palette.gradients.primary,
                  fontWeight: 700,
                }}
              >
                {activeStep === steps.length - 2 ? 'Complete Signup' : 'Continue'}
              </Button>
            </Box>
          )}
          
          {/* Social Signup - Only on first step */}
          {activeStep === 0 && (
            <>
              <Box sx={{ my: 3 }}>
                <Divider>
                  <Typography 
                    variant="body2" 
                    color="textSecondary"
                    sx={{ 
                      px: 1, 
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: 1,
                    }}
                  >
                    Or sign up with
                  </Typography>
                </Divider>
              </Box>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Google />}
                  sx={{ 
                    py: 1.5, 
                    borderRadius: '12px',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                    color: 'text.primary',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GitHub />}
                  sx={{ 
                    py: 1.5, 
                    borderRadius: '12px',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                    color: 'text.primary',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  GitHub
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Apple />}
                  sx={{ 
                    py: 1.5, 
                    borderRadius: '12px',
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
                    color: 'text.primary',
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Apple
                </Button>
              </Stack>
            </>
          )}
          
          {/* Login Link - Not on success step */}
          {activeStep !== 2 && (
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  color="primary"
                  underline="hover"
                  sx={{ fontWeight: 700 }}
                >
                  Sign In
                </Link>
              </Typography>
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
        open={signupStatus.show}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={signupStatus.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {signupStatus.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignupPage;
import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
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
  Stack,
  TextField,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import {
  Apple,
  GitHub,
  Google,
  Visibility,
  VisibilityOff,
  LockOutlined,
  LoginOutlined,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import authService from '../../services/authService';

// Current date and user info from global state - updated as specified
const CURRENT_DATE_TIME = "2025-05-30 06:01:54";
const CURRENT_USER = "VanshSharmaSDEimport";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Enhanced Canvas animation for background
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
    
    // Premium gradient orbs class with improved rendering and enhanced animation
    class GradientOrb {
      constructor() {
        this.reset();
      }
      
      reset() {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        // Enhanced positioning and size variation for more interesting visuals
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        
        // Greater size variation
        this.size = Math.random() * (isMobile ? 120 : 220) + (isMobile ? 40 : 60);
        
        // Variable speed with smoother, slower movement
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.speedY = (Math.random() - 0.5) * 0.35;
        
        // Variable opacity for depth effect
        this.opacity = Math.random() * 0.14 + 0.05;
        
        // Add subtle pulse effect
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
        this.pulseAmount = Math.random() * 0.1 + 0.05;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.originalSize = this.size;
        
        // Enhanced color combinations with more variation
        const colorSets = [
          { start: '#bc4037', end: '#f47061' }, // Primary red
          { start: '#9a342d', end: '#bd5c55' }, // Dark red
          { start: '#2C3E50', end: '#4A6572' }, // Dark blue
          { start: '#3a47d5', end: '#00d2ff' }, // Blue
          { start: '#8E2DE2', end: '#4A00E0' }, // Purple gradient
          { start: '#FF416C', end: '#FF4B2B' }, // Vibrant red-orange
        ];
        
        this.colors = colorSets[Math.floor(Math.random() * colorSets.length)];
      }
      
      update(time) {
        // Apply pulse effect to size
        this.size = this.originalSize + Math.sin(time * this.pulseSpeed + this.pulseOffset) * (this.originalSize * this.pulseAmount);
        
        // Update position with slight acceleration/deceleration for natural movement
        this.x += this.speedX * (1 + Math.sin(time * 0.001) * 0.1);
        this.y += this.speedY * (1 + Math.cos(time * 0.001) * 0.1);
        
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        // Bounce effect at edges with slight randomization
        if (this.x < -this.size) {
          this.x = width + this.size;
          this.speedY = (Math.random() - 0.5) * 0.35; // Randomize Y speed on wrap
        }
        if (this.x > width + this.size) {
          this.x = -this.size;
          this.speedY = (Math.random() - 0.5) * 0.35;
        }
        if (this.y < -this.size) {
          this.y = height + this.size;
          this.speedX = (Math.random() - 0.5) * 0.35; // Randomize X speed on wrap
        }
        if (this.y > height + this.size) {
          this.y = -this.size;
          this.speedX = (Math.random() - 0.5) * 0.35;
        }
      }
      
      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        const startColor = this.hexToRgba(this.colors.start, this.opacity);
        const endColor = this.hexToRgba(this.colors.end, 0);
        
        // Enhanced gradient stops for more vibrant effect
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(0.6, this.hexToRgba(this.colors.end, this.opacity * 0.5));
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
    // More orbs for better visual effect
    const orbCount = isMobile ? 8 : 12;
    const orbs = Array(orbCount).fill().map(() => new GradientOrb());
    
    // Animation loop with performance optimization and time parameter
    let startTime = Date.now();
    
    const animate = () => {
      const time = Date.now() - startTime;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      orbs.forEach((orb) => {
        orb.update(time);
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
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value,
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
        
        // Call login API with email and password
        const response = await authService.login(formData.email, formData.password);
        
        // Handle successful login
        toast.success('Login successful! Redirecting to dashboard...');
        
        // If "remember me" is checked, store this preference
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }
        
        // Redirect after login
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 1500);
      } catch (error) {
        toast.error(error.message || 'Invalid email or password. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error('Please correct the errors in the form.');
    }
  };
  
  // Handle social login
  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login is not implemented yet.`);
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
      {/* Toast Container */}
      <Toaster position="top-center" />
      
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
        {/* Overlay for better text contrast - enhanced for better depth */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: isDark ? 'rgba(22, 20, 22, 0.82)' : 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(25px)',
          }} 
        />
      </Box>
      
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
          <Box sx={{ mb: 5, textAlign: 'center' }}>
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
              Welcome Back
            </MotionTypography>
            <MotionTypography
              variant="body1"
              color="textSecondary"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Log in to access your Code-Quest account
            </MotionTypography>
          </Box>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit}>
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
                  autoComplete="email"
                  placeholder="your.email@example.com"
                  error={!!errors.email}
                  InputProps={{
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
                    sx: { borderRadius: '12px' }
                  }}
                />
                {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
              </FormControl>
              
              {/* Remember Me & Forgot Password */}
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      name="rememberMe"
                      color="primary"
                      size="small"
                    />
                  }
                  label="Remember me"
                />
                <Link 
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  color="primary"
                  underline="hover"
                  sx={{ fontWeight: 600 }}
                >
                  Forgot password?
                </Link>
              </Box>
              
              {/* Login Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isLoading}
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
                endIcon={!isLoading && <LoginOutlined />}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
              
              {/* Social Login Options */}
              <Box sx={{ my: 2 }}>
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
                    Or continue with
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
                  onClick={() => handleSocialLogin('Google')}
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
                  onClick={() => handleSocialLogin('GitHub')}
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
                  onClick={() => handleSocialLogin('Apple')}
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
            </Stack>
          </form>
          
          {/* Sign up Link */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/signup"
                variant="body2"
                color="primary"
                underline="hover"
                sx={{ fontWeight: 700 }}
              >
                Sign Up
              </Link>
            </Typography>
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
    </Box>
  );
};

export default LoginPage;
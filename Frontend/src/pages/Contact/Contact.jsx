import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
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
  Email,
  LocationOn,
  MailOutline,
  Person,
  Phone,
  Send,
  Verified,
} from '@mui/icons-material';
import { motion } from 'framer-motion';


// Current date and user info from global state
const CURRENT_DATE_TIME = "2025-05-29 21:50:13";
const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const ContactPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Canvas animation for background
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight * 2;
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

  // Form handling
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
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message should be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate form submission
      console.log('Form submitted:', formData);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Clear form after submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
  };

  // Office locations data
  const officeLocations = [
    {
      city: 'Bangalore',
      address: '123 Tech Park, Electronic City Phase 1, Bangalore, 560100',
      phone: '+91 80 4567 8901',
      email: 'bangalore@code-quest.com',
      hours: 'Mon-Fri: 9AM - 6PM IST',
      main: true,
    },
    {
      city: 'San Francisco',
      address: '555 Market Street, Suite 400, San Francisco, CA 94105',
      phone: '+1 (415) 555-0123',
      email: 'sf@code-quest.com',
      hours: 'Mon-Fri: 9AM - 6PM PST',
      main: false,
    },
    {
      city: 'London',
      address: '125 Oxford Street, London, W1D 2DH, United Kingdom',
      phone: '+44 20 7123 4567',
      email: 'london@code-quest.com',
      hours: 'Mon-Fri: 9AM - 6PM GMT',
      main: false,
    },
  ];

  return (
    <>      
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
            backgroundColor: isDark ? 'rgba(30, 28, 28, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(30px)',
          }} 
        />
      </Box>
      
      {/* Hero Section */}
      <Box 
        component="section" 
        sx={{ 
          position: 'relative',
          pt: { xs: '100px', sm: '120px', md: '140px' },
          pb: { xs: '60px', sm: '80px', md: '100px' },
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          {/* Current Time Display */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              position: 'absolute',
              top: { xs: 65, sm: 80, md: 100 },
              right: { xs: '50%', md: 24 },
              transform: { xs: 'translateX(50%)', md: 'none' },
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
          
          {/* User Badge */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            sx={{
              position: 'absolute',
              top: { xs: 110, sm: 80, md: 100 },
              left: { xs: '50%', md: 24 },
              transform: { xs: 'translateX(-50%)', md: 'none' },
              zIndex: 10,
              display: { xs: 'none', md: 'flex' },
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
            <Avatar
              alt={CURRENT_USER}
              src="/assets/images/avatar.jpg"
              sx={{ 
                width: 32, 
                height: 32, 
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: '0 4px 8px rgba(188, 64, 55, 0.2)',
                mr: 1.5
              }}
            />
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: isDark ? 'white' : 'text.primary',
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {CURRENT_USER}
                <Verified 
                  sx={{ 
                    fontSize: '0.9rem', 
                    color: theme.palette.primary.main,
                    ml: 0.7,
                  }} 
                />
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box 
                  sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%',
                    bgcolor: theme.palette.success.main,
                    mr: 0.8,
                    display: 'inline-block',
                  }}
                />
                Premium Member
              </Typography>
            </Box>
          </MotionBox>
          
          <Grid 
            container 
            spacing={{ xs: 4, md: 8 }}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={10} lg={8} sx={{ textAlign: 'center' }}>
              <MotionBox>
                {/* Page Title */}
                <MotionTypography
                  variant="h1"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  sx={{ 
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.8rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: { xs: 3, md: 4 },
                    letterSpacing: '-0.02em',
                  }}
                >
                  Get In
                  <Box 
                    component="span" 
                    sx={{
                      display: 'block',
                      background: theme.palette.gradients.primary,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textFillColor: 'transparent',
                    }}
                  >
                    Touch With Us
                  </Box>
                </MotionTypography>
                
                {/* Subheadline */}
                <MotionTypography
                  variant="h5"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  color="textSecondary"
                  sx={{ 
                    mb: 5,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    maxWidth: '800px',
                    mx: 'auto',
                  }}
                >
                  Have questions about Code-Quest? Our team is ready to help you with
                  any inquiries or support needs you might have.
                </MotionTypography>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Contact Form & Info Section */}
      <Box 
        component="section"
        sx={{ 
          pb: { xs: 10, md: 15 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                sx={{ 
                  p: { xs: 3, sm: 5 }, 
                  borderRadius: '24px',
                  backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                  boxShadow: isDark ? '0 15px 35px rgba(0, 0, 0, 0.2)' : '0 15px 35px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    mb: 3,
                  }}
                >
                  Send us a message
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={!!errors.name}>
                        <TextField
                          label="Your Name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          variant="outlined"
                          placeholder="John Doe"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color={errors.name ? "error" : "primary"} />
                              </InputAdornment>
                            ),
                          }}
                          error={!!errors.name}
                        />
                        {errors.name && <FormHelperText>{errors.name}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={!!errors.email}>
                        <TextField
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          variant="outlined"
                          placeholder="john@example.com"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email color={errors.email ? "error" : "primary"} />
                              </InputAdornment>
                            ),
                          }}
                          error={!!errors.email}
                        />
                        {errors.email && <FormHelperText>{errors.email}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <TextField
                          label="Phone (Optional)"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          variant="outlined"
                          placeholder="+1 555 123 4567"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={!!errors.subject}>
                        <TextField
                          select
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          variant="outlined"
                          error={!!errors.subject}
                        >
                          <MenuItem value="">Select a subject</MenuItem>
                          <MenuItem value="General Inquiry">General Inquiry</MenuItem>
                          <MenuItem value="Technical Support">Technical Support</MenuItem>
                          <MenuItem value="Billing Question">Billing Question</MenuItem>
                          <MenuItem value="Partnership Opportunity">Partnership Opportunity</MenuItem>
                          <MenuItem value="Feature Request">Feature Request</MenuItem>
                        </TextField>
                        {errors.subject && <FormHelperText>{errors.subject}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.message}>
                        <TextField
                          label="Your Message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          variant="outlined"
                          multiline
                          rows={6}
                          placeholder="Please provide details about your inquiry..."
                          error={!!errors.message}
                        />
                        {errors.message && <FormHelperText>{errors.message}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        fullWidth
                        sx={{ 
                          mt: 2,
                          py: 1.5,
                          borderRadius: '50px',
                          background: theme.palette.gradients.primary,
                          fontWeight: 600,
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
                          '&:hover::after': {
                            left: '100%',
                          },
                        }}
                        endIcon={<Send />}
                      >
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </MotionPaper>
            </Grid>
            
            {/* Contact Info */}
            <Grid item xs={12} md={5}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Main contact card */}
                <Paper
                  sx={{ 
                    p: 4, 
                    mb: 4,
                    borderRadius: '24px',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                    boxShadow: isDark ? '0 15px 35px rgba(0, 0, 0, 0.2)' : '0 15px 35px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Gradient accent */}
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '6px',
                      background: theme.palette.gradients.primary,
                    }}
                  />
                  
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      mb: 3,
                    }}
                  >
                    Contact Information
                  </Typography>
                  
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex' }}>
                      <Box 
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: isDark ? 'rgba(188, 64, 55, 0.1)' : 'rgba(188, 64, 55, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <Email color="primary" />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Email Us
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          contact@code-quest.com
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex' }}>
                      <Box 
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: isDark ? 'rgba(188, 64, 55, 0.1)' : 'rgba(188, 64, 55, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <Phone color="primary" />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Call Us
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          +91 80 4567 8901
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex' }}>
                      <Box 
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: isDark ? 'rgba(188, 64, 55, 0.1)' : 'rgba(188, 64, 55, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                          alignSelf: 'flex-start',
                          mt: 0.5,
                        }}
                      >
                        <LocationOn color="primary" />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          Headquarters
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          123 Tech Park, Electronic City Phase 1,<br />
                          Bangalore, 560100, India
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                  
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mt: 4,
                    }}
                  >
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.316681026466!2d77.6536679!3d12.8915376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae155d61b4bdb1%3A0x2a025f589d16e834!2sElectronic%20City%20Phase%201%2C%20Electronic%20City%2C%20Bengaluru%2C%20Karnataka%20560100%2C%20India!5e0!3m2!1sen!2sus!4v1653631234567!5m2!1sen!2sus"
                      width="100%"
                      height="200"
                      style={{ border: 0, borderRadius: '16px' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Code-Quest Headquarters"
                    ></iframe>
                  </Box>
                </Paper>
                
                {/* Hours of operation */}
                <Paper
                  sx={{ 
                    p: 4, 
                    borderRadius: '24px',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                    boxShadow: isDark ? '0 15px 35px rgba(0, 0, 0, 0.2)' : '0 15px 35px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Hours of Operation
                  </Typography>
                  
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Monday - Friday</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>9:00 AM - 6:00 PM IST</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Saturday</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>10:00 AM - 2:00 PM IST</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Sunday</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Closed</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      For urgent support issues, our technical team is available 24/7 through our
                      premium support portal.
                    </Typography>
                  </Stack>
                </Paper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Global Offices Section */}
      <Box 
        component="section"
        sx={{ 
          py: { xs: 10, md: 15 },
          position: 'relative',
          bgcolor: isDark ? 'rgba(20, 20, 20, 0.5)' : 'rgba(245, 245, 245, 0.5)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-100px' }}
            sx={{ 
              textAlign: 'center',
              mb: { xs: 6, md: 8 },
              mx: 'auto',
              maxWidth: '800px',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2.2rem', md: '2.8rem' },
              }}
            >
              Our Global Offices
            </Typography>
            
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{
                fontWeight: 400,
                mb: 3,
                mx: 'auto',
                maxWidth: '650px',
              }}
            >
              With offices around the world, we're here to support our global community of developers.
            </Typography>
          </MotionBox>
          
          <Grid container spacing={4}>
            {officeLocations.map((office, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionPaper
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  sx={{ 
                    p: 4, 
                    borderRadius: '24px',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                    boxShadow: isDark ? '0 15px 35px rgba(0, 0, 0, 0.2)' : '0 15px 35px rgba(0, 0, 0, 0.05)',
                    height: '100%',
                    position: 'relative',
                  }}
                >
                  {office.main && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        px: 2,
                        py: 0.5,
                        borderRadius: '20px',
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      Headquarters
                    </Box>
                  )}
                  
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    {office.city}
                  </Typography>
                  
                  <Stack spacing={2} sx={{ mb: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      {office.address}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Phone 
                        sx={{ 
                          fontSize: '1.1rem',
                          color: theme.palette.primary.main,
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">
                        {office.phone}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email 
                        sx={{ 
                          fontSize: '1.1rem',
                          color: theme.palette.primary.main,
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">
                        {office.email}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Hours:
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {office.hours}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      
      {/* Success snackbar */}
      <Snackbar
        open={submitSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Your message has been sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactPage;
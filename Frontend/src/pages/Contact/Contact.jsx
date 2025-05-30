import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Link,
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
  ArrowForward,
  Call,
  CheckCircle,
  Email,
  Facebook,
  GitHub,
  Instagram,
  LinkedIn,
  LocationOn,
  MessageOutlined,
  Person,
  PhoneInTalk,
  Send,
  Twitter,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Current date and user info from global state
const CURRENT_DATE_TIME = "2025-05-30 07:47:21";
const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

// Contact information
const contactInfo = {
  email: "support@code-quest.com",
  phone: "+1 (555) 234-5678",
  address: "88 Tech Boulevard, Silicon Valley, CA 94043",
  officeHours: "Monday - Friday: 9:00 AM - 6:00 PM (PST)",
  socialMedia: [
    { name: "LinkedIn", icon: <LinkedIn />, url: "https://linkedin.com/company/code-quest" },
    { name: "Twitter", icon: <Twitter />, url: "https://twitter.com/codequest" },
    { name: "GitHub", icon: <GitHub />, url: "https://github.com/code-quest" },
    { name: "Facebook", icon: <Facebook />, url: "https://facebook.com/codequest" },
    { name: "Instagram", icon: <Instagram />, url: "https://instagram.com/codequest" }
  ]
};

// FAQ items
const faqItems = [
  {
    question: "How can I get started with Code-Quest?",
    answer: "Sign up for an account on our platform, complete your profile, and you can immediately start exploring our coding challenges and interactive courses. Our personalized recommendation system will suggest content based on your skill level and interests."
  },
  {
    question: "Do you offer team collaboration features?",
    answer: "Yes, our platform supports collaborative coding through shared workspaces, real-time code editing, and team-based competitions. Teams can work together on projects, participate in hackathons, and track collective progress."
  },
  {
    question: "What programming languages are supported?",
    answer: "We currently support Python, JavaScript, Java, C++, Ruby, Go, TypeScript, PHP, C#, Swift, and Kotlin. Our platform provides syntax highlighting, intelligent autocomplete, and language-specific debugging tools for each supported language."
  },
  {
    question: "How do I request technical support?",
    answer: "You can reach our technical support team through the Help Center in your account dashboard, by emailing support@code-quest.com, or by submitting a ticket through the Contact form on this page. Our support team typically responds within 24 hours."
  }
];

// Support departments
const departments = [
  { value: "technical", label: "Technical Support" },
  { value: "billing", label: "Billing & Payments" },
  { value: "account", label: "Account Management" },
  { value: "partnership", label: "Business Partnership" },
  { value: "careers", label: "Careers & Opportunities" }
];

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
    department: '',
    message: '',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  
  // PREMIUM GRADIENT ANIMATION
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

    // Create premium animation elements
    class GradientOrb {
      constructor() {
        this.reset();
      }
      
      reset() {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * (isMobile ? 100 : 200) + (isMobile ? 50 : 100);
        this.maxRadius = this.radius;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.pulseSpeed = Math.random() * 0.002 + 0.001;
        this.angle = 0;
        
        // Premium color combinations
        const colorSets = [
          { start: '#bc4037', end: '#f47061' }, // Primary red
          { start: '#9a342d', end: '#bd5c55' }, // Dark red
          { start: '#2C3E50', end: '#4A6572' }, // Dark blue
          { start: '#3a47d5', end: '#00d2ff' }, // Blue
        ];
        
        this.colors = colorSets[Math.floor(Math.random() * colorSets.length)];
      }
      
      update(time) {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.pulseSpeed * time;
        
        // Pulsing size effect
        this.radius = this.maxRadius * (0.9 + Math.sin(this.angle) * 0.1);
        
        // Wrap around screen edges
        if (this.x < -this.radius) this.x = width + this.radius;
        if (this.x > width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = height + this.radius;
        if (this.y > height + this.radius) this.y = -this.radius;
      }
      
      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        
        gradient.addColorStop(0, this.hexToRgba(this.colors.start, this.opacity));
        gradient.addColorStop(0.6, this.hexToRgba(this.colors.end, this.opacity * 0.5));
        gradient.addColorStop(1, this.hexToRgba(this.colors.end, 0));
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
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
    const orbCount = isMobile ? 4 : 7;
    const orbs = Array(orbCount).fill().map(() => new GradientOrb());
    
    // Animation loop with time parameter for smooth animation
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      orbs.forEach(orb => {
        orb.update(elapsedTime);
        orb.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(startTime);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isMobile, isDark]);
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.department) {
      errors.department = 'Please select a department';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      errors.message = 'Message should be at least 20 characters long';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate API call
      setSubmitStatus('loading');
      
      setTimeout(() => {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: '',
          message: '',
        });
        
        // Reset after some time
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }, 1500);
    } else {
      setSubmitStatus('error');
    }
  };
  
  // Handle FAQ toggle
  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };
  
  // Handle alert close
  const handleCloseAlert = () => {
    setSubmitStatus(null);
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
    },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.6, -0.05, 0.01, 0.99],
      }
    }),
    hover: {
      y: -10,
      boxShadow: isDark ? '0 20px 60px rgba(0, 0, 0, 0.4)' : '0 20px 60px rgba(0, 0, 0, 0.1)',
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  return (
    <>
      {/* Hero Section with Background Animation */}
      <Box
        sx={{ 
          position: 'relative',
          height: { xs: '350px', md: '400px' },
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Canvas Background for Premium Gradient Animation */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            overflow: 'hidden',
          }}
        >
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
              backgroundColor: isDark ? 'rgba(18, 18, 18, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
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
        
        {/* User Badge */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
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
              Online
            </Typography>
          </Box>
        </MotionBox>
        
        <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <MotionTypography
            variant="h1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              mb: 2,
            }}
          >
            Get in Touch
          </MotionTypography>
          <MotionTypography
            variant="h5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ 
              fontWeight: 400, 
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            We're here to help with any questions about our platform, services, or collaboration opportunities
          </MotionTypography>
        </Container>
      </Box>

      {/* Contact Info Cards Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 10 } }}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          component={Grid}
          container
          spacing={3}
          sx={{ mb: { xs: 5, md: 10 } }}
        >
          {/* Email Card */}
          <Grid item xs={12} sm={6} md={4}>
            <MotionBox
              variants={cardVariants}
              custom={0}
              whileHover="hover"
              component={Paper}
              elevation={isDark ? 4 : 1}
              sx={{ 
                p: 4, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: '24px',
                backgroundColor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                transition: 'all 0.3s ease',
              }}
            >
              <Box 
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(188, 64, 55, 0.1)',
                  color: theme.palette.primary.main,
                  mb: 3,
                }}
              >
                <Email fontSize="large" />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Email
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Our team typically responds within 24 hours
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ fontWeight: 600, fontFamily: 'monospace', mt: 'auto', mb: 3 }}
              >
                {contactInfo.email}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Send />}
                href={`mailto:${contactInfo.email}`}
                sx={{ 
                  borderRadius: '12px', 
                  textTransform: 'none',
                  background: theme.palette.gradients.primary,
                  px: 3,
                }}
              >
                Send Email
              </Button>
            </MotionBox>
          </Grid>

          {/* Phone Card */}
          <Grid item xs={12} sm={6} md={4}>
            <MotionBox
              variants={cardVariants}
              custom={1}
              whileHover="hover"
              component={Paper}
              elevation={isDark ? 4 : 1}
              sx={{ 
                p: 4, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: '24px',
                backgroundColor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                transition: 'all 0.3s ease',
              }}
            >
              <Box 
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  color: theme.palette.success.main,
                  mb: 3,
                }}
              >
                <PhoneInTalk fontSize="large" />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Phone
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Available during our business hours
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ fontWeight: 600, fontFamily: 'monospace', mt: 'auto', mb: 3 }}
              >
                {contactInfo.phone}
              </Typography>
              <Button
                variant="contained"
                color="success"
                startIcon={<Call />}
                href={`tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`}
                sx={{ 
                  borderRadius: '12px', 
                  textTransform: 'none',
                  px: 3
                }}
              >
                Call Now
              </Button>
            </MotionBox>
          </Grid>

          {/* Address Card */}
          <Grid item xs={12} md={4}>
            <MotionBox
              variants={cardVariants}
              custom={2}
              whileHover="hover"
              component={Paper}
              elevation={isDark ? 4 : 1}
              sx={{ 
                p: 4, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: '24px',
                backgroundColor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                transition: 'all 0.3s ease',
              }}
            >
              <Box 
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  color: theme.palette.info.main,
                  mb: 3,
                }}
              >
                <LocationOn fontSize="large" />
              </Box>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Visit Us
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {contactInfo.officeHours}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ fontWeight: 500, mt: 'auto', mb: 3 }}
              >
                {contactInfo.address}
              </Typography>
              <Button
                variant="contained"
                color="info"
                startIcon={<LocationOn />}
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  borderRadius: '12px', 
                  textTransform: 'none',
                  px: 3
                }}
              >
                View Map
              </Button>
            </MotionBox>
          </Grid>
        </MotionBox>
        
        {/* Contact Form Section */}
        <Grid container spacing={5}>
          <Grid item xs={12} lg={6}>
            <MotionBox
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              sx={{ mb: { xs: 4, lg: 0 } }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                Send us a message
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ mb: 4, maxWidth: '500px' }}
              >
                Have a question or want to explore collaboration opportunities? 
                Fill out the form and our team will get back to you promptly.
              </Typography>
              
              <Box 
                component="form" 
                onSubmit={handleSubmit}
                sx={{ 
                  maxWidth: '600px',
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!formErrors.name}>
                      <TextField
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color={formErrors.name ? "error" : "inherit"} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '12px' }
                        }}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!formErrors.email}>
                      <TextField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color={formErrors.email ? "error" : "inherit"} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '12px' }
                        }}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!formErrors.phone}>
                      <TextField
                        label="Phone Number (Optional)"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (123) 456-7890"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneInTalk color={formErrors.phone ? "error" : "inherit"} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '12px' }
                        }}
                        error={!!formErrors.phone}
                        helperText={formErrors.phone}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!formErrors.department}>
                      <TextField
                        select
                        label="Department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        error={!!formErrors.department}
                        helperText={formErrors.department}
                        InputProps={{
                          sx: { borderRadius: '12px' }
                        }}
                      >
                        {departments.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!formErrors.message}>
                      <TextField
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        required
                        multiline
                        rows={5}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5, mr: 1 }}>
                              <MessageOutlined color={formErrors.message ? "error" : "inherit"} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '12px' }
                        }}
                        error={!!formErrors.message}
                        helperText={formErrors.message ? formErrors.message : 'Minimum 20 characters'}
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      disabled={submitStatus === 'loading'}
                      startIcon={submitStatus === 'loading' ? null : <Send />}
                      sx={{
                        py: 2,
                        borderRadius: '12px',
                        background: theme.palette.gradients.primary,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        textTransform: 'none',
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
                        '&:hover:not(:disabled)': {
                          boxShadow: '0 10px 20px rgba(188, 64, 55, 0.3)',
                          '&::after': {
                            left: '100%',
                          }
                        },
                      }}
                    >
                      {submitStatus === 'loading' ? (
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'center', 
                            gap: 2,
                          }}
                        >
                          <Box 
                            component="span"
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              border: '3px solid rgba(255,255,255,0.3)',
                              borderTopColor: 'white',
                              animation: 'spin 1s infinite linear',
                              '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' },
                              }
                            }}
                          />
                          Sending...
                        </Box>
                      ) : (
                        'Send Message'
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </MotionBox>
          </Grid>
          
          {/* FAQ section */}
          <Grid item xs={12} lg={6}>
            <MotionBox
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 4,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                }}
              >
                Frequently Asked Questions
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                {faqItems.map((faq, index) => (
                  <Box
                    key={index}
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    sx={{
                      mb: 2.5,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                      backgroundColor: isDark ? 'rgba(30, 28, 28, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Box
                      onClick={() => toggleFaq(index)}
                      sx={{
                        p: 3,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: expandedFaq === index
                          ? isDark ? 'rgba(188, 64, 55, 0.1)' : 'rgba(188, 64, 55, 0.05)'
                          : 'transparent',
                      }}
                    >
                      <Typography 
                        variant="h6" 
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '1rem', md: '1.1rem' },
                          color: expandedFaq === index ? theme.palette.primary.main : 'inherit',
                        }}
                      >
                        {faq.question}
                      </Typography>
                      <Box
                        component={motion.div}
                        animate={{ rotate: expandedFaq === index ? 45 : 0 }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: expandedFaq === index
                            ? isDark ? 'rgba(188, 64, 55, 0.2)' : 'rgba(188, 64, 55, 0.1)'
                            : isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          color: expandedFaq === index ? theme.palette.primary.main : 'inherit',
                          transition: 'background-color 0.3s ease',
                          fontSize: '1.5rem',
                          fontWeight: 300,
                          transform: 'translateY(-2px)',
                        }}
                      >
                        +
                      </Box>
                    </Box>
                    
                    <Box
                      component={motion.div}
                      animate={{ 
                        height: expandedFaq === index ? 'auto' : 0,
                        opacity: expandedFaq === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      sx={{
                        overflow: 'hidden',
                        borderTop: expandedFaq === index 
                          ? `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`
                          : 'none',
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          p: 3,
                          pt: 2,
                          color: 'text.secondary',
                          lineHeight: 1.6,
                        }}
                      >
                        {faq.answer}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              
              {/* Social Media Links */}
              <Box>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Connect with us on social media
                </Typography>
                <Stack 
                  direction="row"
                  spacing={1.5}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.5,
                  }}
                >
                  {contactInfo.socialMedia.map((social, index) => (
                    <Tooltip title={social.name} key={social.name}>
                      <IconButton
                        component={motion.a}
                        whileHover={{ 
                          y: -5, 
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                        }}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          width: 48,
                          height: 48,
                          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          color: 'text.primary',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    </Tooltip>
                  ))}
                </Stack>
              </Box>
            </MotionBox>
          </Grid>
        </Grid>
      </Container>

      {/* Google Maps Embed */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        sx={{ 
          height: '400px', 
          width: '100%',
          position: 'relative',
          mt: 8,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            boxShadow: 'inset 0 -100px 100px -100px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
          }}
        />
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50740.71939576576!2d-122.08531224999999!3d37.38935994999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb7495bec0189%3A0x7c17d44a466baf9b!2sMountain%20View%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1620942256304!5m2!1sen!2sin"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Code-Quest Office Location"
        ></iframe>
      </Box>

      {/* Status Alert */}
      <Snackbar
        open={submitStatus === 'success' || submitStatus === 'error'}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={submitStatus === 'success' ? 'success' : 'error'}
          variant="filled"
          sx={{ 
            width: '100%', 
            alignItems: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
          }}
          iconMapping={{
            success: <CheckCircle fontSize="inherit" />,
          }}
        >
          {submitStatus === 'success' ? (
            'Your message has been sent! We\'ll get back to you soon.'
          ) : (
            'Please check the form for errors and try again.'
          )}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactPage;
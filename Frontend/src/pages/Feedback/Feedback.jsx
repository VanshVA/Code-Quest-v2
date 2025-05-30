import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Rating,
  Slider,
  Snackbar,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Home,
  NavigateNext,
  Verified,
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
  Star,
  Send,
  CheckCircle,
  ScreenshotMonitor,
  CloudUpload,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
// import Navbar from '../components/common/Navbar';
// import Footer from '../components/common/Footer';

// Current date and user info from global state
const CURRENT_DATE_TIME = "2025-05-30 03:40:48";
const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const FeedbackPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    feedbackType: '',
    subject: '',
    description: '',
    overallRating: 0,
    uiRating: 0,
    performanceRating: 0,
    featuresRating: 0,
    experienceRating: 3,
    recommendationScore: 7,
    improvementAreas: [],
    subscribeToUpdates: true,
  });
  
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  
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
  
  // Handle form input changes
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
  
  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  // Handle multiple checkbox group (improvement areas)
  const handleImprovementAreaChange = (area) => {
    const currentAreas = [...formData.improvementAreas];
    if (currentAreas.includes(area)) {
      setFormData({
        ...formData,
        improvementAreas: currentAreas.filter(item => item !== area),
      });
    } else {
      setFormData({
        ...formData,
        improvementAreas: [...currentAreas, area],
      });
    }
  };
  
  // Handle sliders
  const handleSliderChange = (name) => (event, newValue) => {
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };
  
  // Handle star ratings
  const handleRatingChange = (name) => (event, newValue) => {
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + attachedFiles.length > 3) {
      setErrors({
        ...errors,
        files: "Maximum 3 files can be attached",
      });
      return;
    }
    
    // Simple file validation
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          files: "Invalid file type. Only images and PDFs are allowed.",
        });
        return false;
      }
      
      if (file.size > maxSize) {
        setErrors({
          ...errors,
          files: "File size exceeds 5MB limit.",
        });
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      setAttachedFiles([...attachedFiles, ...validFiles]);
      setErrors({
        ...errors,
        files: null,
      });
    }
  };
  
  // Remove attached file
  const handleRemoveFile = (fileToRemove) => {
    setAttachedFiles(attachedFiles.filter(file => file !== fileToRemove));
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.feedbackType) {
      newErrors.feedbackType = 'Please select feedback type';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description should be at least 10 characters';
    }
    
    if (formData.overallRating === 0) {
      newErrors.overallRating = 'Please provide an overall rating';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate form submission - would be an API call in a real application
      console.log('Form submitted:', formData);
      console.log('Attached files:', attachedFiles);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        feedbackType: '',
        subject: '',
        description: '',
        overallRating: 0,
        uiRating: 0,
        performanceRating: 0,
        featuresRating: 0,
        experienceRating: 3,
        recommendationScore: 7,
        improvementAreas: [],
        subscribeToUpdates: true,
      });
      
      setAttachedFiles([]);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }
  };
  
  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
  };
  
  // Custom icon for experience rating
  const experienceIcons = {
    1: <SentimentVeryDissatisfied color="error" fontSize="large" />,
    2: <SentimentDissatisfied color="warning" fontSize="large" />,
    3: <SentimentNeutral color="action" fontSize="large" />,
    4: <SentimentSatisfied color="info" fontSize="large" />,
    5: <SentimentVerySatisfied color="success" fontSize="large" />,
  };
  
  // Experience labels
  const experienceLabels = {
    1: 'Very Dissatisfied',
    2: 'Dissatisfied',
    3: 'Neutral',
    4: 'Satisfied',
    5: 'Very Satisfied',
  };
  
  // Recommendation score marks
  const recommendationMarks = [
    { value: 0, label: '0' },
    { value: 1, label: '' },
    { value: 2, label: '' },
    { value: 3, label: '' },
    { value: 4, label: '4' },
    { value: 5, label: '' },
    { value: 6, label: '' },
    { value: 7, label: '' },
    { value: 8, label: '8' },
    { value: 9, label: '' },
    { value: 10, label: '10' },
  ];
  
  // Improvement areas options
  const improvementOptions = [
    { value: 'ui', label: 'User Interface' },
    { value: 'performance', label: 'Performance & Speed' },
    { value: 'features', label: 'Feature Availability' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'support', label: 'Customer Support' },
    { value: 'pricing', label: 'Pricing & Plans' },
    { value: 'accessibility', label: 'Accessibility' },
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
          pb: { xs: '40px', sm: '60px', md: '80px' },
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
          
          {/* Breadcrumbs */}
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mb: 4 }}
          >
            <Link 
              component={RouterLink} 
              to="/"
              underline="hover"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              <Home sx={{ mr: 0.5, fontSize: '1.1rem' }} />
              Home
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
              Feedback
            </Typography>
          </Breadcrumbs>
          
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
              mb: { xs: 2, md: 3 },
              letterSpacing: '-0.02em',
            }}
          >
            Share Your Feedback
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
            }}
          >
            Your feedback helps us improve our platform. Let us know what you think about
            Code-Quest and how we can make it better for you.
          </MotionTypography>
        </Container>
      </Box>
      
      {/* Feedback Form Section */}
      <Box 
        component="section"
        sx={{ 
          pb: { xs: 10, md: 15 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Main Form */}
            <Grid item xs={12} md={8}>
              <MotionPaper
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ 
                  p: { xs: 3, md: 5 }, 
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
                    mb: 4,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <FeedbackIcon 
                    sx={{ 
                      mr: 1.5, 
                      color: theme.palette.primary.main,
                    }}
                  />
                  Feedback Form
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    {/* Feedback Type */}
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.feedbackType}>
                        <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
                          Feedback Type*
                        </FormLabel>
                        <RadioGroup
                          row
                          name="feedbackType"
                          value={formData.feedbackType}
                          onChange={handleChange}
                        >
                          <FormControlLabel value="suggestion" control={<Radio />} label="Suggestion" />
                          <FormControlLabel value="bug" control={<Radio />} label="Bug Report" />
                          <FormControlLabel value="complaint" control={<Radio />} label="Complaint" />
                          <FormControlLabel value="compliment" control={<Radio />} label="Compliment" />
                          <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                        {errors.feedbackType && <FormHelperText>{errors.feedbackType}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    
                    {/* Subject */}
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.subject}>
                        <TextField
                          label="Subject*"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          variant="outlined"
                          placeholder="Briefly describe your feedback"
                          error={!!errors.subject}
                        />
                        {errors.subject && <FormHelperText>{errors.subject}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    
                    {/* Description */}
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.description}>
                        <TextField
                          label="Description*"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          variant="outlined"
                          multiline
                          rows={6}
                          placeholder="Please provide details about your feedback"
                          error={!!errors.description}
                        />
                        {errors.description && <FormHelperText>{errors.description}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    
                    {/* Overall Rating */}
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={!!errors.overallRating}>
                        <FormLabel sx={{ mb: 1, fontWeight: 600 }}>
                          Overall Rating*
                        </FormLabel>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating
                            name="overallRating"
                            value={formData.overallRating}
                            onChange={handleRatingChange('overallRating')}
                            size="large"
                            precision={0.5}
                            sx={{ 
                              fontSize: '2rem',
                              '& .MuiRating-iconFilled': {
                                color: theme.palette.primary.main,
                              },
                            }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                            {formData.overallRating > 0 ? `${formData.overallRating}/5` : ''}
                          </Typography>
                        </Box>
                        {errors.overallRating && <FormHelperText>{errors.overallRating}</FormHelperText>}
                      </FormControl>
                    </Grid>
                    
                    {/* Detailed Ratings */}
                    <Grid item xs={12}>
                      <Typography 
                        variant="subtitle1" 
                        gutterBottom
                        sx={{ fontWeight: 600, mt: 2 }}
                      >
                        Detailed Ratings (Optional)
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <FormLabel sx={{ display: 'block', mb: 1 }}>
                            User Interface
                          </FormLabel>
                          <Rating
                            name="uiRating"
                            value={formData.uiRating}
                            onChange={handleRatingChange('uiRating')}
                            size="medium"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormLabel sx={{ display: 'block', mb: 1 }}>
                            Performance
                          </FormLabel>
                          <Rating
                            name="performanceRating"
                            value={formData.performanceRating}
                            onChange={handleRatingChange('performanceRating')}
                            size="medium"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormLabel sx={{ display: 'block', mb: 1 }}>
                            Features
                          </FormLabel>
                          <Rating
                            name="featuresRating"
                            value={formData.featuresRating}
                            onChange={handleRatingChange('featuresRating')}
                            size="medium"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    
                    {/* Overall Experience */}
                    <Grid item xs={12}>
                      <Typography 
                        variant="subtitle1" 
                        gutterBottom
                        sx={{ fontWeight: 600, mt: 2 }}
                      >
                        Overall Experience
                      </Typography>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: '16px',
                          bgcolor: isDark ? 'rgba(20, 20, 20, 0.4)' : 'rgba(245, 245, 245, 0.7)',
                          mb: 3,
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Box sx={{ mb: 2 }}>
                            {experienceIcons[formData.experienceRating]}
                          </Box>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            {experienceLabels[formData.experienceRating]}
                          </Typography>
                          <Box sx={{ px: { xs: 0, sm: 6 }, mt: 3 }}>
                            <Slider
                              value={formData.experienceRating}
                              min={1}
                              max={5}
                              step={1}
                              onChange={handleSliderChange('experienceRating')}
                              marks={[
                                { value: 1, label: 'Very Dissatisfied' },
                                { value: 2, label: 'Dissatisfied' },
                                { value: 3, label: 'Neutral' },
                                { value: 4, label: 'Satisfied' },
                                { value: 5, label: 'Very Satisfied' },
                              ]}
                              sx={{
                                '& .MuiSlider-markLabel': {
                                  fontSize: '0.75rem',
                                  mt: 1.5,
                                  display: { xs: 'none', md: 'block' },
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    {/* Recommendation Score */}
                    <Grid item xs={12}>
                      <FormLabel sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                        How likely are you to recommend Code-Quest to a friend or colleague?
                      </FormLabel>
                      <Box sx={{ px: { xs: 1, sm: 4 }, py: 3 }}>
                        <Slider
                          value={formData.recommendationScore}
                          min={0}
                          max={10}
                          step={1}
                          onChange={handleSliderChange('recommendationScore')}
                          marks={recommendationMarks}
                          valueLabelDisplay="on"
                          sx={{
                            '& .MuiSlider-valueLabel': {
                              bgcolor: theme.palette.primary.main,
                            },
                          }}
                        />
                        
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            mt: 1,
                            px: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Not at all likely
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Extremely likely
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* Improvement Areas */}
                    <Grid item xs={12}>
                      <FormLabel sx={{ display: 'block', mb: 2, fontWeight: 600 }}>
                        What areas do you think we should improve? (Optional)
                      </FormLabel>
                      <Grid container spacing={2}>
                        {improvementOptions.map((option) => (
                          <Grid item xs={12} sm={6} md={4} key={option.value}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.improvementAreas.includes(option.value)}
                                  onChange={() => handleImprovementAreaChange(option.value)}
                                  color="primary"
                                />
                              }
                              label={option.label}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                    
                    {/* File Attachments */}
                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.files}>
                        <FormLabel sx={{ mb: 2, fontWeight: 600 }}>
                          Attach Screenshots or Documents (Optional)
                        </FormLabel>
                        <Box
                          sx={{
                            border: `1px dashed ${errors.files ? theme.palette.error.main : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
                            borderRadius: '16px',
                            p: 3,
                            textAlign: 'center',
                            bgcolor: isDark ? 'rgba(30, 28, 28, 0.4)' : 'rgba(245, 245, 245, 0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(245, 245, 245, 0.8)',
                            },
                          }}
                          onClick={() => fileInputRef.current.click()}
                        >
                          <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            accept=".jpg,.jpeg,.png,.gif,.pdf"
                          />
                          <CloudUpload 
                            sx={{ 
                              fontSize: '3rem', 
                              color: errors.files ? theme.palette.error.main : theme.palette.primary.main,
                              mb: 1,
                            }}
                          />
                          <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                            Drag & drop files here or click to browse
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Max 3 files. JPEG, PNG, GIF, PDF (5MB max each)
                          </Typography>
                          {errors.files && (
                            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                              {errors.files}
                            </Typography>
                          )}
                        </Box>
                        
                        {/* Display attached files */}
                        {attachedFiles.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Attached Files ({attachedFiles.length}/3)
                            </Typography>
                            <Stack spacing={1}>
                              {attachedFiles.map((file, index) => (
                                <Paper
                                  key={index}
                                  sx={{
                                    p: 1.5,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ScreenshotMonitor sx={{ mr: 1 }} />
                                    <Box>
                                      <Typography variant="body2" noWrap sx={{ maxWidth: '240px' }}>
                                        {file.name}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {(file.size / 1024).toFixed(1)} KB
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <IconButton 
                                    size="small"
                                    onClick={() => handleRemoveFile(file)}
                                    sx={{ color: theme.palette.error.main }}
                                  >
                                    ×
                                  </IconButton>
                                </Paper>
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </FormControl>
                    </Grid>
                    
                    {/* Subscribe to Updates */}
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={formData.subscribeToUpdates}
                            onChange={(e) => handleCheckboxChange({
                              target: {
                                name: 'subscribeToUpdates',
                                checked: e.target.checked,
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Keep me updated on changes made based on my feedback"
                      />
                    </Grid>
                    
                    {/* Submit Button */}
                    <Grid item xs={12}>
                      <Divider sx={{ mb: 3 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          sx={{ 
                            px: 6,
                            py: 1.5,
                            borderRadius: '50px',
                            background: theme.palette.gradients.primary,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                          }}
                          endIcon={<Send />}
                        >
                          Submit Feedback
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </MotionPaper>
            </Grid>
            
            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <MotionBox
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Why Feedback Matters */}
                <MotionPaper
                  sx={{ 
                    p: 4, 
                    borderRadius: '24px',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                    boxShadow: isDark ? '0 15px 35px rgba(0, 0, 0, 0.2)' : '0 15px 35px rgba(0, 0, 0, 0.05)',
                    mb: 4,
                  }}
                >
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      mb: 2,
                      color: theme.palette.primary.main,
                    }}
                  >
                    Why Your Feedback Matters
                  </Typography>
                  <Typography variant="body2" paragraph>
                    At Code-Quest, we're constantly striving to improve our platform. Your feedback
                    helps us understand what's working well and what could be better.
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Every suggestion is reviewed by our team, and many of our platform improvements
                    come directly from user feedback like yours.
                  </Typography>
                  <Box 
                    component={motion.div}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    sx={{ 
                      mt: 3,
                      p: 2,
                      borderRadius: '12px',
                      background: isDark ? 'rgba(20, 20, 20, 0.4)' : 'rgba(245, 245, 245, 0.7)',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                      All feedback submissions receive a response within 48 hours.
                    </Typography>
                  </Box>
                </MotionPaper>
                
                {/* Recently Implemented */}
                <MotionPaper
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
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      mb: 3,
                    }}
                  >
                    Recently Implemented
                  </Typography>
                  <Stack spacing={3}>
                    {[
                      {
                        title: "Dark Mode Support",
                        description: "Added system-wide dark mode to reduce eye strain during night coding sessions.",
                        date: "May 20, 2025"
                      },
                      {
                        title: "Collaborative Code Editing",
                        description: "Real-time code sharing and pair programming functionality for team projects.",
                        date: "April 15, 2025"
                      },
                      {
                        title: "Performance Optimization",
                        description: "Improved code execution speed by 40% for all supported languages.",
                        date: "March 30, 2025"
                      }
                    ].map((item, index) => (
                      <Box key={index} sx={{ position: 'relative' }}>
                        <Box 
                          sx={{ 
                            mb: 1.5, 
                            display: 'flex', 
                            alignItems: 'center',
                          }}
                        >
                          <CheckCircle 
                            color="success" 
                            sx={{ mr: 1, fontSize: '1.2rem' }} 
                          />
                          <Typography 
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                          >
                            {item.title}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ ml: 4 }}
                        >
                          {item.description}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="primary"
                          sx={{ 
                            display: 'block',
                            mt: 1,
                            ml: 4,
                          }}
                        >
                          Implemented: {item.date}
                        </Typography>
                        {index < 2 && (
                          <Divider sx={{ mt: 2 }} />
                        )}
                      </Box>
                    ))}
                  </Stack>
                  
                  <Button
                    component={RouterLink}
                    to="/changelog"
                    variant="text"
                    color="primary"
                    sx={{ 
                      mt: 3,
                      fontWeight: 600,
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    View Full Changelog
                  </Button>
                </MotionPaper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Success Snackbar */}
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
          Your feedback has been submitted successfully! Thank you for helping us improve.
        </Alert>
      </Snackbar>
      
     
    </>
  );
};

export default FeedbackPage;
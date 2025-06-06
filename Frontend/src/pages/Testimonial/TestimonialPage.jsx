import React, { useRef, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Skeleton,
  Alert,
  Pagination,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Badge,
} from '@mui/material';
import {
  ArrowForward,
  AutoAwesome,
  Check,
  FormatQuote,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LinkedIn,
  PlayArrow,
  Twitter,
  VerifiedUser,
  YouTube,
  Person,
  Email,
  Search,
  FilterList,
  TrendingUp,
  Star,
  Assessment,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';
import axios from 'axios';

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const TestimonialsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  
  // Refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // State
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 12,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFeedback, setActiveFeedback] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  // Fetch feedback from backend
  const fetchFeedback = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/general/feedback`);
      
      if (response.data.success) {
        setFeedbackList(response.data.data.feedback);
        setPagination(response.data.data.pagination);
        setError('');
      } else {
        setError('Failed to fetch feedback');
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Get feedback type color
  const getFeedbackTypeColor = (type) => {
    const colors = {
      'general': theme.palette.primary.main,
      'suggestion': theme.palette.info.main,
      'bug': theme.palette.error.main,
      'testimonial': theme.palette.success.main,
      'other': theme.palette.warning.main,
    };
    return colors[type] || colors.general;
  };

  // Get rating color
  const getRatingColor = (rating) => {
    if (rating >= 4) return theme.palette.success.main;
    if (rating >= 3) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Filter feedback based on search term
  const filteredFeedback = feedbackList.filter(feedback =>
    feedback.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.feedbackType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.occupation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get featured feedback (high ratings and testimonials)
  const featuredFeedback = feedbackList.filter(feedback => 
    (feedback.ratingGeneral >= 4 || feedback.feedbackType === 'testimonial') && 
    feedback.feedback?.length > 50
  ).slice(0, 5);

  // Navigate through featured feedback
  const nextFeedback = () => {
    setActiveFeedback((prev) => (prev + 1) % featuredFeedback.length);
  };
  
  const prevFeedback = () => {
    setActiveFeedback((prev) => (prev === 0 ? featuredFeedback.length - 1 : prev - 1));
  };

  // Auto rotation for featured feedback
  useEffect(() => {
    if (featuredFeedback.length > 0) {
      const interval = setInterval(() => {
        nextFeedback();
      }, 8000);
      
      return () => clearInterval(interval);
    }
  }, [featuredFeedback.length]);

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
        
        const colorSets = [
          { start: '#bc4037', end: '#f47061' },
          { start: '#9a342d', end: '#bd5c55' },
          { start: '#2C3E50', end: '#4A6572' },
          { start: '#3a47d5', end: '#00d2ff' },
        ];
        
        this.colors = colorSets[Math.floor(Math.random() * colorSets.length)];
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
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
    
    const orbCount = isMobile ? 6 : 10;
    const orbs = Array(orbCount).fill().map(() => new GradientOrb());
    
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

  // Statistics from feedback data
  const stats = [
    { value: pagination.total.toString(), label: "Total Feedback" },
    { 
      value: `${Math.round((feedbackList.filter(f => f.ratingGeneral >= 4).length / Math.max(feedbackList.length, 1)) * 100)}%`, 
      label: "Positive Reviews" 
    },
    { 
      value: feedbackList.filter(f => f.feedbackType === 'suggestion').length.toString(), 
      label: "Suggestions" 
    },
    { 
      value: `${feedbackList.reduce((acc, f) => acc + (f.ratingGeneral || 0), 0) / Math.max(feedbackList.length, 1) || 0}`.slice(0, 3), 
      label: "Avg Rating" 
    }
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
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: isDark ? 'rgba(30, 28, 28, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(30px)',
        }} />
      </Box>

      {/* Hero Section */}
      <Box component="section" sx={{ 
        position: 'relative',
        pt: { xs: '100px', sm: '120px', md: '120px' },
        pb: { xs: '40px', sm: '60px', md: '40px' },
        overflow: 'hidden',
      }}>
        <Container maxWidth="lg"> 
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={10} lg={8} sx={{ textAlign: 'center' }}>
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 3, display: 'inline-block' }}
              >
                <Chip 
                  label="USER FEEDBACK" 
                  color="primary"
                  size="small"
                  icon={<AutoAwesome sx={{ color: 'white !important', fontSize: '0.85rem' }} />}
                  sx={{ 
                    background: theme.palette.gradients?.primary || theme.palette.primary.main,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    letterSpacing: 1.2,
                    py: 2.2,
                    pl: 1,
                    pr: 2,
                    borderRadius: '100px',
                    boxShadow: '0 8px 16px rgba(188, 64, 55, 0.2)',
                  }}
                />
              </MotionBox> 
              
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
                What Our Users
                <Box component="span" sx={{
                  display: 'block',
                  background: theme.palette.gradients?.primary || `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Are Saying
                </Box>
              </MotionTypography>
              
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
                Real feedback from our community about their Code Quest experience
              </MotionTypography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Bar */}
      <Box component="section" sx={{ mb: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <MotionPaper
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            sx={{
              borderRadius: '20px',
              py: { xs: 3, md: 2.5 },
              px: { xs: 2, md: 4 },
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              alignItems: 'center',
              gap: 2,
              boxShadow: isDark ? '0 15px 35px rgba(0, 0, 0, 0.3)' : '0 15px 35px rgba(0, 0, 0, 0.1)',
              backgroundColor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {stats.map((stat, index) => (
              <Box key={index} sx={{
                px: 2,
                py: 1,
                textAlign: 'center',
                minWidth: { xs: '40%', sm: '22%' },
              }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 800, 
                  mb: 0.5,
                  color: theme.palette.primary.main,
                  fontSize: { xs: '2rem', sm: '2.5rem' },
                }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </MotionPaper>
        </Container>
      </Box>
      
      {/* Featured Feedback Slider */}
      {!loading && featuredFeedback.length > 0 && (
        <Box component="section" sx={{ mb: { xs: 8, md: 12 } }}>
          <Container maxWidth="lg">
            <Typography variant="h3" component="h2" sx={{ 
              fontWeight: 700, 
              mb: 4, 
              textAlign: 'center',
              color: theme.palette.primary.main,
            }}>
              Featured Testimonials
            </Typography>
            
            <MotionBox sx={{ position: 'relative', minHeight: { xs: 'auto', md: '400px' } }}>
              <AnimatePresence mode="wait">
                <MotionBox
                  key={activeFeedback}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper sx={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: isDark ? '0 20px 60px rgba(0, 0, 0, 0.4)' : '0 20px 60px rgba(0, 0, 0, 0.12)',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  }}>
                    <Grid container>
                      {/* Left Side - User Info */}
                      <Grid item xs={12} md={4} sx={{ 
                        bgcolor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.02)',
                        p: { xs: 3, md: 5 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'center', md: 'flex-start' },
                        justifyContent: 'center',
                        textAlign: { xs: 'center', md: 'left' },
                      }}>
                        <Avatar sx={{ 
                          width: 120, 
                          height: 120, 
                          border: '4px solid',
                          borderColor: theme.palette.primary.main,
                          mb: 3,
                          fontSize: '2rem',
                          fontWeight: 'bold',
                        }}>
                          {getInitials(featuredFeedback[activeFeedback]?.name)}
                        </Avatar>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h5" sx={{ 
                            fontWeight: 700, 
                            mb: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: { xs: 'center', md: 'flex-start' },
                          }}>
                            {featuredFeedback[activeFeedback]?.name}
                            <VerifiedUser sx={{ 
                              fontSize: '0.9rem', 
                              ml: 1, 
                              color: theme.palette.primary.main 
                            }} />
                          </Typography>
                          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                            {featuredFeedback[activeFeedback]?.occupation}
                          </Typography>
                          <Typography variant="subtitle2" fontWeight={600} color="primary">
                            Submitted: {formatDate(featuredFeedback[activeFeedback]?.submittedAt)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                          <Rating 
                            value={featuredFeedback[activeFeedback]?.ratingGeneral || 0} 
                            readOnly 
                            size="small"
                            sx={{ color: theme.palette.primary.main }}
                          />
                          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                            {featuredFeedback[activeFeedback]?.ratingGeneral || 'N/A'}
                          </Typography>
                        </Box>
                        
                        <Chip
                          label={featuredFeedback[activeFeedback]?.feedbackType}
                          sx={{
                            bgcolor: getFeedbackTypeColor(featuredFeedback[activeFeedback]?.feedbackType),
                            color: 'white',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                          }}
                        />
                      </Grid>
                      
                      {/* Right Side - Feedback */}
                      <Grid item xs={12} md={8}>
                        <Box sx={{ 
                          p: { xs: 4, md: 5 }, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          position: 'relative',
                        }}>
                          <FormatQuote sx={{ 
                            position: 'absolute',
                            fontSize: { xs: 60, md: 80 },
                            color: isDark ? 'rgba(188, 64, 55, 0.1)' : 'rgba(188, 64, 55, 0.07)',
                            top: { xs: 10, md: 20 },
                            left: { xs: 10, md: 20 },
                            transform: 'rotate(180deg)'
                          }} />
                          
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 500,
                              fontStyle: 'italic',
                              lineHeight: 1.6,
                              position: 'relative',
                              pl: 3,
                              zIndex: 1,
                              mb: 4,
                            }}
                          >
                            {featuredFeedback[activeFeedback]?.feedback}
                          </Typography>
                          
                          {/* Additional Ratings */}
                          <Box sx={{ display: 'flex', gap: 4, mt: 'auto' }}>
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                Ease of Use
                              </Typography>
                              <Rating 
                                value={featuredFeedback[activeFeedback]?.ratingEase || 0} 
                                readOnly 
                                size="small"
                              />
                            </Box>
                            <Box>
                              <Typography variant="caption" color="textSecondary">
                                Support
                              </Typography>
                              <Rating 
                                value={featuredFeedback[activeFeedback]?.ratingSupport || 0} 
                                readOnly 
                                size="small"
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </MotionBox>
              </AnimatePresence>
              
              {/* Navigation Controls */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
                <IconButton
                  onClick={prevFeedback}
                  sx={{
                    bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }
                  }}
                >
                  <KeyboardArrowLeft />
                </IconButton>
                
                {featuredFeedback.map((_, index) => (
                  <Box
                    key={index}
                    component="button"
                    onClick={() => setActiveFeedback(index)}
                    sx={{
                      width: 40,
                      height: 4,
                      border: 'none',
                      padding: 0,
                      backgroundColor: activeFeedback === index
                        ? theme.palette.primary.main
                        : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
                
                <IconButton
                  onClick={nextFeedback}
                  sx={{
                    bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }
                  }}
                >
                  <KeyboardArrowRight />
                </IconButton>
              </Box>
            </MotionBox>
          </Container>
        </Box>
      )}

      {/* All Feedback Section */}
      <Box component="section" sx={{ mb: { xs: 10, md: 15 } }}>
        <Container maxWidth="lg">
          {/* Header with Search */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold">
              All Feedback
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 250 }}
              />
              
              <Chip
                icon={<FeedbackIcon />}
                label={`${pagination.total} Total`}
                color="primary"
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Box>

          {/* Loading State */}
          {loading && (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card sx={{ borderRadius: 3, height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
                        <Box sx={{ flexGrow: 1 }}>
                          <Skeleton variant="text" height={24} sx={{ mb: 0.5 }} />
                          <Skeleton variant="text" height={20} width="70%" />
                        </Box>
                      </Box>
                      <Skeleton variant="rectangular" height={80} sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Skeleton variant="rounded" width={80} height={24} />
                        <Skeleton variant="rounded" width={100} height={24} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Feedback Grid */}
          {!loading && !error && (
            <>
              <Grid container spacing={3}>
                {filteredFeedback.map((feedback, index) => (
                  <Grid item xs={12} md={6} lg={4} key={feedback._id || index}>
                    <MotionCard
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -8 }}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '20px',
                        boxShadow: isDark ? '0 8px 30px rgba(0, 0, 0, 0.3)' : '0 8px 30px rgba(0, 0, 0, 0.06)',
                        backgroundColor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* User Info */}
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <Avatar sx={{ 
                            width: 56, 
                            height: 56, 
                            border: `2px solid ${getFeedbackTypeColor(feedback.feedbackType)}`,
                            mr: 2,
                            fontWeight: 'bold',
                          }}>
                            {getInitials(feedback.name)}
                          </Avatar>
                          
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              mb: 0.5,
                            }}>
                              {feedback.name}
                              <Check sx={{ 
                                ml: 0.5, 
                                fontSize: '0.875rem', 
                                color: theme.palette.success.main,
                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                borderRadius: '50%',
                                p: 0.2,
                              }} />
                            </Typography>
                            
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                              {feedback.occupation}
                            </Typography>
                            
                            <Typography variant="caption" color="textSecondary">
                              {formatDate(feedback.submittedAt)}
                            </Typography>
                          </Box>

                          <Chip
                            label={feedback.feedbackType}
                            size="small"
                            sx={{
                              bgcolor: getFeedbackTypeColor(feedback.feedbackType),
                              color: 'white',
                              fontWeight: 600,
                              textTransform: 'capitalize',
                            }}
                          />
                        </Box>
                        
                        {/* Quote */}
                        <Box sx={{
                          position: 'relative',
                          mb: 3,
                          pb: 3, 
                          borderBottom: '1px solid',
                          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                          flexGrow: 1,
                        }}>
                          <FormatQuote sx={{ 
                            position: 'absolute',
                            top: -10,
                            left: -10,
                            fontSize: 30,
                            color: theme.palette.primary.main,
                            opacity: 0.3,
                            transform: 'rotate(180deg)'
                          }} />
                          
                          <Typography
                            variant="body1"
                            sx={{
                              fontStyle: 'italic',
                              lineHeight: 1.6,
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {feedback.feedback}
                          </Typography>
                        </Box>
                        
                        {/* Ratings */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              Overall Rating
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Rating 
                                value={feedback.ratingGeneral || 0} 
                                readOnly 
                                size="small"
                                sx={{ color: getRatingColor(feedback.ratingGeneral || 0) }}
                              />
                              <Typography variant="body2" fontWeight="bold" sx={{ 
                                ml: 1,
                                color: getRatingColor(feedback.ratingGeneral || 0) 
                              }}>
                                {feedback.ratingGeneral || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>

                          {feedback.contactConsent && (
                            <Chip
                              icon={<Email />}
                              label="Open to contact"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Box>

                        {/* Additional ratings if available */}
                        {(feedback.ratingEase || feedback.ratingSupport) && (
                          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                            {feedback.ratingEase && (
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="caption" color="textSecondary">
                                  Ease
                                </Typography>
                                <Rating value={feedback.ratingEase} readOnly size="small" />
                              </Box>
                            )}
                            {feedback.ratingSupport && (
                              <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="caption" color="textSecondary">
                                  Support
                                </Typography>
                                <Rating value={feedback.ratingSupport} readOnly size="small" />
                              </Box>
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pagination.pages}
                    page={pagination.page}
                    onChange={(event, page) => fetchFeedback(page)}
                    color="primary"
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box component="section" sx={{ mb: { xs: 10, md: 15 } }}>
        <Container maxWidth="md">
          <MotionPaper
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            sx={{
              borderRadius: '24px',
              bgcolor: isDark ? 'rgba(30, 28, 28, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              boxShadow: isDark ? '0 20px 60px rgba(0, 0, 0, 0.4)' : '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              py: { xs: 6, md: 8 },
              px: { xs: 3, md: 8 },
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h3"
              component="h2"
              sx={{ 
                fontWeight: 800, 
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
                lineHeight: 1.3,
              }}
            >
              Share Your Experience
            </Typography>
            
            <Typography
              variant="h6"
              color="textSecondary"
              sx={{ 
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Help us improve Code Quest by sharing your feedback and experience with our platform.
            </Typography>
            
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
            }}>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/feedback"
                endIcon={<ArrowForward />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: theme.palette.gradients?.primary || theme.palette.primary.main,
                  boxShadow: '0 10px 20px rgba(188, 64, 55, 0.2)',
                  '&:hover': {
                    boxShadow: '0 14px 28px rgba(188, 64, 55, 0.3)',
                    transform: 'translateY(-2px)',
                  },
                  minWidth: 200,
                }}
              >
                Give Feedback
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                color="primary"
                component={RouterLink}
                to="/competitions"
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 },
                  minWidth: 200,
                }}
              >
                Try Code Quest
              </Button>
            </Box>
          </MotionPaper>
        </Container>
      </Box>
    </>
  );
};

export default TestimonialsPage;
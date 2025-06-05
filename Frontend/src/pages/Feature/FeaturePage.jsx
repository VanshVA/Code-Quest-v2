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
  Link,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  LinearProgress,
} from '@mui/material';
import {
  AccessTime,
  AutoAwesome,
  Check,
  CheckCircleOutline,
  Code,
  Dataset,
  DevicesOutlined,
  FileDownloadDone,
  GitHub,
  KeyboardArrowDown,
  KeyboardArrowRight,
  Layers,
  LockOutlined,
  QueryStats,
  Quiz,
  Search,
  Shield,
  Speed,
  StarOutline,
  Terminal,
  ViewInAr,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Current date and user info
const CURRENT_DATE_TIME = "2025-06-04 22:52:32";
const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);

// Sample feature data
const features = [
  {
    id: 'mcq-module',
    title: 'MCQ Test Module',
    subtitle: 'Comprehensive knowledge assessment',
    description: 'Our advanced multiple-choice question system evaluates theoretical understanding across all programming concepts with adaptive difficulty.',
    icon: <Quiz />,
    color: '#9c27b0',
    lightColor: 'rgba(156, 39, 176, 0.1)',
    highlights: [
      'Custom question bank with over 5,000 curated problems',
      'Real-time grading with detailed explanations',
      'Topic-based organization with difficulty levels',
      'Anti-cheating measures with randomized question sets'
    ],
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
  },
  {
    id: 'qa-module',
    title: 'Q&A Session Module',
    subtitle: 'Deep conceptual understanding',
    description: 'Test critical thinking with open-ended questions that require detailed explanations, demonstrating true comprehension of programming concepts.',
    icon: <Terminal />,
    color: '#2196f3',
    lightColor: 'rgba(33, 150, 243, 0.1)',
    highlights: [
      'AI-assisted grading with human verification',
      'Keyword detection for concept recognition',
      'Markdown support for formatting answers',
      'Plagiarism detection to ensure originality'
    ],
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998',
  },
  {
    id: 'coding-module',
    title: 'Coding Challenge Module',
    subtitle: 'Practical programming assessment',
    description: 'Our advanced coding environment supports multiple languages with real-time execution, testing, and performance analysis for comprehensive skill evaluation.',
    icon: <Code />,
    color: '#ff9800',
    lightColor: 'rgba(255, 152, 0, 0.1)',
    highlights: [
      'Support for 15+ programming languages',
      'Automated test cases with input/output validation',
      'Code quality and performance metrics',
      'Interactive debugging tools and syntax highlighting'
    ],
    image: 'https://images.unsplash.com/photo-1580894742597-87bc8789db3d',
  },
  {
    id: 'analytics-module',
    title: 'Advanced Analytics',
    subtitle: 'Comprehensive performance insights',
    description: 'Detailed performance analytics provide participants and organizers with insights into strengths, weaknesses, and improvement opportunities.',
    icon: <QueryStats />,
    color: '#4caf50',
    lightColor: 'rgba(76, 175, 80, 0.1)',
    highlights: [
      'Visual performance dashboards with historical trends',
      'Comparative analysis with peer benchmarking',
      'Topic-specific strength and weakness identification',
      'Exportable reports for personal development'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
  },
  {
    id: 'security-module',
    title: 'Enterprise-Grade Security',
    subtitle: 'Secure competition environment',
    description: 'Our platform employs industry-leading security measures to ensure fair competitions, protect participant data, and prevent cheating.',
    icon: <Shield />,
    color: '#f44336',
    lightColor: 'rgba(244, 67, 54, 0.1)',
    highlights: [
      'End-to-end encryption for all data transmission',
      'Advanced proctoring with AI-powered monitoring',
      'Browser lockdown options for critical assessments',
      'GDPR, FERPA, and SOC 2 compliant infrastructure'
    ],
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7',
  },
  {
    id: 'integration-module',
    title: 'Enterprise Integrations',
    subtitle: 'Seamless workflow connectivity',
    description: 'Connect Code Quest with your existing tools and systems through our extensive API and pre-built integrations with popular platforms.',
    icon: <Dataset />,
    color: '#3f51b5',
    lightColor: 'rgba(63, 81, 181, 0.1)',
    highlights: [
      'RESTful API with comprehensive documentation',
      'LMS integrations (Canvas, Moodle, Blackboard)',
      'Authentication with SSO providers',
      'Webhooks for custom event handling'
    ],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
  }
];

const FeaturePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  
  // Refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // State
  const [activeFeature, setActiveFeature] = useState(0);
  const [showAll, setShowAll] = useState(false);
  
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

  // Floating animation
  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  `;

  // Glow animation
  const glow = keyframes`
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  `;

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
                pt: { xs: '100px', sm: '120px', md: '120px' },
                pb: { xs: '60px', sm: '80px', md: '30px' },
                overflow: 'hidden',
              }}
            >
              <Container maxWidth="lg"> 
                <Grid 
                  container 
                  spacing={{ xs: 4, md: 8 }}
                  alignItems="center" 
                  justifyContent="center"
                >
                  <Grid item xs={12} md={10} lg={8} sx={{ textAlign: 'center' }}>
                    <MotionBox
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      sx={{ mb: 3, display: 'inline-block' }}
                    >
                      <Chip 
                        label="PLATFORM FEATURES" 
                        color="primary"
                        size="small"
                        icon={<AutoAwesome sx={{ color: 'white !important', fontSize: '0.85rem', }} />}
                        sx={{ 
                          background: theme.palette.gradients.primary,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          letterSpacing: 1.2,
                          py: 2.2,
                          pl: 1,
                          pr: 2,
                          borderRadius: '100px',
                          boxShadow: '0 8px 16px rgba(188, 64, 55, 0.2)',
                          '& .MuiChip-icon': { 
                            color: 'white',
                            mr: 0.5
                          }
                        }}
                      />
                    </MotionBox> 
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
                        Comprehensive Assessment
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
                          Features
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
                       Code Quest combines theoretical knowledge testing with practical programming challenges to provide the most comprehensive skill assessment platform for developers.
                      </MotionTypography>
                    </MotionBox>
                  
                  </Grid>
                </Grid>
              </Container>
            </Box>
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
          <Grid 
            container 
            spacing={{ xs: 4, md: 8 }}
            alignItems="center" 
            direction={isMobile ? 'column-reverse' : 'row'}
          >
            {/* Left Content */}
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 3 }}
              >
                <Chip 
                  label="PLATFORM FEATURES" 
                  color="primary"
                  size="small"
                  icon={<AutoAwesome sx={{ color: 'white !important', fontSize: '0.85rem', }} />}
                  sx={{ 
                    background: theme.palette.gradients.primary,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    letterSpacing: 1.2,
                    py: 2.2,
                    pl: 1,
                    pr: 2,
                    borderRadius: '100px',
                    boxShadow: '0 8px 16px rgba(188, 64, 55, 0.2)',
                    '& .MuiChip-icon': { 
                      color: 'white',
                      mr: 0.5
                    }
                  }}
                />
              </MotionBox> 
              
              <MotionTypography
                variant="h1"
                initial={{ opacity: 0, y: 20 }}
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
                Comprehensive
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
                  Assessment Features
                </Box>
              </MotionTypography>
              
              <MotionTypography
                variant="h5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                color="textSecondary"
                sx={{ 
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                }}
              >
                Code Quest combines theoretical knowledge testing with practical programming challenges to provide the most comprehensive skill assessment platform for developers.
              </MotionTypography>
              
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 3,
                  mb: { xs: 6, md: 0 }
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    background: theme.palette.gradients.primary,
                    boxShadow: '0 8px 16px rgba(188, 64, 55, 0.2)',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    minWidth: '180px',
                    '&:hover': {
                      boxShadow: '0 12px 20px rgba(188, 64, 55, 0.3)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  endIcon={<KeyboardArrowRight />}
                >
                  Get Started
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  color="primary"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderWidth: 2,
                    minWidth: '180px',
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  Request Demo
                </Button>
              </MotionBox>
            </Grid>
            
            {/* Right 3D Image */}
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                sx={{ 
                  position: 'relative',
                  textAlign: 'center',
                }}
              >
                {/* Main Feature Image */}
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                  alt="Code Quest Platform"
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '24px',
                    boxShadow: isDark 
                      ? '0 20px 80px rgba(0, 0, 0, 0.4)' 
                      : '0 20px 80px rgba(0, 0, 0, 0.15)',
                    transform: 'perspective(1000px) rotateY(-5deg) rotateX(5deg)',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    zIndex: 2,
                  }}
                />
                
                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: theme.palette.primary.main,
                    transform: 'rotate(30deg)',
                    opacity: 0.1,
                    animation: `${float} 5s infinite ease-in-out`,
                    zIndex: 1,
                  }}
                />
                
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    left: -20,
                    width: 60,
                    height: 60,
                    borderRadius: '15px',
                    background: theme.palette.secondary.main,
                    transform: 'rotate(15deg)',
                    opacity: 0.1,
                    animation: `${float} 4s infinite ease-in-out`,
                    animationDelay: '1s',
                    zIndex: 1,
                  }}
                />
                
                {/* Floating badges */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '15%',
                    left: -20,
                    zIndex: 3,
                    animation: `${float} 6s infinite ease-in-out`,
                    animationDelay: '0.5s',
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: '16px',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      background: theme.palette.background.paper,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        color: '#4caf50',
                      }}
                    >
                      <Speed fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Performance
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        Ultra-Fast Execution
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
                
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '20%',
                    right: -15,
                    zIndex: 3,
                    animation: `${float} 7s infinite ease-in-out`,
                    animationDelay: '1s',
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: '16px',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      background: theme.palette.background.paper,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                        color: '#f44336',
                      }}
                    >
                      <LockOutlined fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="caption" color="textSecondary">
                        Security
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        Enterprise-Grade
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
        
        {/* Stats Bar */}
        <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 10 } }}>
          <MotionPaper
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            sx={{
              borderRadius: '20px',
              boxShadow: isDark 
                ? '0 10px 40px rgba(0, 0, 0, 0.3)' 
                : '0 10px 40px rgba(0, 0, 0, 0.06)',
              backgroundColor: isDark 
                ? 'rgba(30, 28, 28, 0.7)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              py: { xs: 3, md: 2 },
              px: { xs: 2, md: 4 },
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    15+
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Supported Languages
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    5,000+
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Coding Challenges
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    99.9%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Platform Uptime
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    500+
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Enterprise Customers
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </MotionPaper>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box component="section" sx={{ py: { xs: 10, md: 15 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center" sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                All-in-one 
                <Box 
                  component="span" 
                  sx={{ 
                    color: theme.palette.primary.main,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: theme.palette.primary.main,
                      opacity: 0.3,
                      borderRadius: '2px',
                    }
                  }}
                > assessment
                </Box> platform
              </Typography>
              <Typography 
                variant="body1" 
                color="textSecondary"
                sx={{ 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  maxWidth: '600px',
                }}
              >
                Code Quest provides a complete solution for evaluating programming skills with multiple assessment methods that cover both theoretical knowledge and practical application.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <Stack direction="row" spacing={1}>
                {features.slice(0, 3).map((feature, index) => (
                  <Tooltip key={index} title={feature.title} placement="top">
                    <IconButton
                      sx={{
                        bgcolor: activeFeature === index 
                          ? feature.lightColor 
                          : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        color: activeFeature === index 
                          ? feature.color 
                          : 'inherit',
                        '&:hover': {
                          bgcolor: feature.lightColor,
                          color: feature.color,
                        },
                      }}
                      onClick={() => setActiveFeature(index)}
                    >
                      {feature.icon}
                    </IconButton>
                  </Tooltip>
                ))}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowAll(!showAll)}
                  endIcon={showAll ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
                  sx={{
                    ml: 1,
                    borderRadius: '8px',
                    textTransform: 'none',
                  }}
                >
                  {showAll ? 'Less' : 'All Features'}
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {/* Main Featured Module */}
          <AnimatePresence mode="wait">
            <MotionPaper
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              elevation={0}
              sx={{
                mb: 8,
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                boxShadow: isDark 
                  ? '0 20px 60px rgba(0, 0, 0, 0.3)' 
                  : '0 20px 60px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Grid container>
                {/* Left Content */}
                <Grid 
                  item 
                  xs={12} 
                  md={5} 
                  sx={{ 
                    p: { xs: 3, md: 6 },
                    position: 'relative',
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
                      opacity: 0.07,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundImage: `url(${features[activeFeature].image})`,
                      zIndex: 0,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${features[activeFeature].color}30, transparent)`,
                      }
                    }}
                  />
                  
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Avatar
                      sx={{
                        bgcolor: features[activeFeature].lightColor,
                        color: features[activeFeature].color,
                        width: 70,
                        height: 70,
                        mb: 3,
                        '& .MuiSvgIcon-root': {
                          fontSize: '2rem',
                        },
                      }}
                    >
                      {features[activeFeature].icon}
                    </Avatar>
                    
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        fontSize: { xs: '1.75rem', md: '2.25rem' },
                        color: features[activeFeature].color,
                      }}
                    >
                      {features[activeFeature].title}
                    </Typography>
                    
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      sx={{
                        mb: 3,
                        fontWeight: 500,
                      }}
                    >
                      {features[activeFeature].subtitle}
                    </Typography>
                    
                    <Typography
                      variant="body1"
                      paragraph
                      sx={{ mb: 4 }}
                    >
                      {features[activeFeature].description}
                    </Typography>
                    
                    <Button
                      variant="contained"
                      endIcon={<KeyboardArrowRight />}
                      sx={{
                        py: 1,
                        px: 3,
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 600,
                        bgcolor: features[activeFeature].color,
                        '&:hover': {
                          bgcolor: features[activeFeature].color,
                          filter: 'brightness(1.1)',
                        }
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Grid>
                
                {/* Right Feature Image */}
                <Grid 
                  item 
                  xs={12} 
                  md={7} 
                  sx={{ 
                    bgcolor: isDark 
                      ? 'rgba(0, 0, 0, 0.2)' 
                      : 'rgba(0, 0, 0, 0.02)',
                    position: 'relative',
                  }}
                >
                  {/* Feature Image */}
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 4,
                    }}
                  >
                    <Box
                      component="img"
                      src={features[activeFeature].image}
                      alt={features[activeFeature].title}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        boxShadow: isDark 
                          ? '0 10px 30px rgba(0, 0, 0, 0.5)' 
                          : '0 10px 30px rgba(0, 0, 0, 0.1)',
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      }}
                    />
                  </Box>
                  
                  {/* Feature Highlights */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: isDark 
                        ? 'rgba(0, 0, 0, 0.7)' 
                        : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      p: 3,
                      borderTop: '1px solid',
                      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Key Highlights:
                    </Typography>
                    <Grid container spacing={2}>
                      {features[activeFeature].highlights.map((highlight, i) => (
                        <Grid item xs={12} sm={6} key={i}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <CheckCircleOutline 
                              sx={{ 
                                color: features[activeFeature].color, 
                                mr: 1.5,
                                mt: 0.3,
                                fontSize: '1.1rem',
                              }} 
                            />
                            <Typography variant="body2">
                              {highlight}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </MotionPaper>
          </AnimatePresence>
          
          {/* Expanded Features Grid */}
          <AnimatePresence>
            {showAll && (
              <MotionGrid
                container
                spacing={3}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {features.slice(3).map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <MotionCard
                      whileHover={{ y: -8, boxShadow: '0 14px 28px rgba(0,0,0,0.2)' }}
                      transition={{ duration: 0.3 }}
                      sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '16px',
                        boxShadow: isDark 
                          ? '0 8px 16px rgba(0,0,0,0.3)' 
                          : '0 8px 16px rgba(0,0,0,0.08)',
                        backgroundColor: isDark 
                          ? 'rgba(30, 28, 28, 0.7)' 
                          : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: feature.lightColor,
                          color: feature.color,
                          width: 56,
                          height: 56,
                          mb: 2.5,
                        }}
                      >
                        {feature.icon}
                      </Avatar>
                      
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          mb: 3,
                        }}
                      >
                        {feature.description}
                      </Typography>
                      
                      <Box sx={{ flexGrow: 1 }} />
                      
                      <Button
                        variant="outlined"
                        endIcon={<KeyboardArrowRight />}
                        sx={{
                          alignSelf: 'flex-start',
                          mt: 2,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 600,
                          borderColor: feature.color,
                          color: feature.color,
                          '&:hover': {
                            borderColor: feature.color,
                            bgcolor: feature.lightColor,
                          }
                        }}
                      >
                        Learn More
                      </Button>
                    </MotionCard>
                  </Grid>
                ))}
              </MotionGrid>
            )}
          </AnimatePresence>
        </Container>
      </Box>
      
      {/* Platform Benefits */}
      <Box
        component="section"
        sx={{
          py: { xs: 10, md: 15 },
          bgcolor: isDark 
            ? 'rgba(0, 0, 0, 0.3)' 
            : 'rgba(0, 0, 0, 0.02)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: theme.palette.primary.main,
            opacity: 0.03,
            zIndex: 0,
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: theme.palette.secondary.main,
            opacity: 0.03,
            zIndex: 0,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="overline"
              component="span"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: 2,
                mb: 2,
                display: 'block',
              }}
            >
              WHY CHOOSE CODE QUEST
            </Typography>
            
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              Benefits for Competitions
            </Typography>
            
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              Code Quest provides a secure, scalable, and comprehensive platform for hosting coding competitions, assessments, and educational challenges.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {/* Left: Benefits List */}
            <Grid item xs={12} md={5}>
              <Stack spacing={3}>
                {[
                  {
                    icon: <CheckCircleOutline sx={{ color: '#4caf50' }} />,
                    title: "Fair & Secure Competitions",
                    description: "Advanced proctoring, plagiarism detection, and randomized questions ensure fair competition.",
                  },
                  {
                    icon: <DevicesOutlined sx={{ color: '#2196f3' }} />,
                    title: "Responsive Multi-device Platform",
                    description: "Seamless experience across desktop, tablet, and mobile devices with real-time synchronization.",
                  },
                  {
                    icon: <Layers sx={{ color: '#ff9800' }} />,
                    title: "Comprehensive Assessment",
                    description: "Multi-faceted evaluation using MCQs, written answers, and practical coding challenges.",
                  },
                  {
                    icon: <ViewInAr sx={{ color: '#9c27b0' }} />,
                    title: "Scalable Infrastructure",
                    description: "Handles competitions of any size from classroom assessments to global competitions with millions of participants.",
                  },
                  {
                    icon: <FileDownloadDone sx={{ color: '#f44336' }} />,
                    title: "Detailed Analytics",
                    description: "Comprehensive performance metrics and insights for participants and organizers.",
                  },
                ].map((benefit, index) => (
                  <MotionPaper
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      bgcolor: isDark 
                        ? 'rgba(255, 255, 255, 0.03)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid',
                      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2.5,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                        width: 42,
                        height: 42,
                      }}
                    >
                      {benefit.icon}
                    </Avatar>
                    
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {benefit.title}
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary">
                        {benefit.description}
                      </Typography>
                    </Box>
                  </MotionPaper>
                ))}
              </Stack>
            </Grid>
            
            {/* Right: Feature Showcase */}
            <Grid item xs={12} md={7}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7 }}
                sx={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Main Image */}
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1573164574230-db1d5e960238"
                  alt="Code Quest Dashboard"
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '24px',
                    boxShadow: isDark 
                      ? '0 20px 80px rgba(0, 0, 0, 0.4)' 
                      : '0 20px 80px rgba(0, 0, 0, 0.15)',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    zIndex: 2,
                  }}
                />
                
                {/* Feature Callouts */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '15%',
                    left: '-5%',
                    animation: `${float} 6s infinite ease-in-out`,
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: '50%',
                      width: 100,
                      height: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                      background: theme.palette.background.paper,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <StarOutline 
                      sx={{ 
                        color: '#ff9800',
                        mb: 0.5,
                        fontSize: '2rem',
                      }} 
                    />
                    <Typography variant="caption" fontWeight={600} textAlign="center">
                      Premium Features
                    </Typography>
                  </Paper>
                </Box>
                
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '20%',
                    right: '-5%',
                    animation: `${float} 7s infinite ease-in-out`,
                    animationDelay: '0.5s',
                  }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      borderRadius: '50%',
                      width: 100,
                      height: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                      background: theme.palette.background.paper,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <AccessTime 
                      sx={{ 
                        color: '#4caf50',
                        mb: 0.5,
                        fontSize: '2rem',
                      }} 
                    />
                    <Typography variant="caption" fontWeight={600} textAlign="center">
                      Real-time Monitoring
                    </Typography>
                  </Paper>
                </Box>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box component="section" sx={{ py: { xs: 10, md: 15 } }}>
        <Container maxWidth="lg">
          <MotionPaper
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            sx={{
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: isDark 
                ? '0 20px 60px rgba(0, 0, 0, 0.4)' 
                : '0 20px 60px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Background Image & Overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(https://images.unsplash.com/photo-1542831371-29b0f74f9713)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(188, 64, 55, 0.9), rgba(44, 62, 80, 0.9))',
                  zIndex: 1,
                }
              }}
            />
            
            {/* Content */}
            <Grid 
              container 
              sx={{ 
                position: 'relative',
                zIndex: 2,
                py: { xs: 6, md: 10 },
                px: { xs: 3, md: 6 },
              }}
              alignItems="center"
              spacing={4}
            >
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h2"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: '2rem', md: '2.75rem' },
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  }}
                >
                  Ready to transform your coding competitions?
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    mb: 4,
                    fontWeight: 400,
                    textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    maxWidth: '600px',
                  }}
                >
                  Join thousands of organizations using Code Quest to host high-quality, secure coding assessments and competitions.
                </Typography>
                
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                >
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      bgcolor: 'white',
                      color: 'rgb(188, 64, 55)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                      },
                    }}
                  >
                    Start Free Trial
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: '10px',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem',
                      borderColor: 'rgba(255,255,255,0.7)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Watch Demo
                  </Button>
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Box
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.3)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '16px',
                    p: 3,
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 3,
                    }}
                  >
                    Enterprise Solutions Include:
                  </Typography>
                  
                  <Stack spacing={2}>
                    {[
                      'Dedicated support and account management',
                      'Custom branding and white-labeling',
                      'Advanced analytics and reporting',
                      'Single sign-on (SSO) integration',
                      'Custom challenge development',
                    ].map((feature, index) => (
                      <Box 
                        key={index}
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Check 
                          sx={{ 
                            color: '#4caf50',
                            mr: 1.5,
                            fontSize: '1.2rem',
                            bgcolor: 'rgba(255,255,255,0.2)',
                            borderRadius: '50%',
                            p: 0.3,
                          }} 
                        />
                        <Typography 
                          variant="body1"
                          sx={{ 
                            color: 'rgba(255,255,255,0.9)',
                          }}
                        >
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </MotionPaper>
        </Container>
      </Box>
    </>
  );
};

export default FeaturePage;
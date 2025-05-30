import React, { useState, useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowForward,
  AutoAwesome,
  CheckCircleOutlined,
  Code,
  CodeOutlined,
  EmojiEvents,
  FlashOn,
  GitHub,
  KeyboardDoubleArrowDown,
  Leaderboard,
  LockOpen,
  Person,
  PlayArrow,
  School,
  Security,
  Settings,
  Speed,
  Star,
  Stars,
  Verified,
} from '@mui/icons-material';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';


// Motion components
const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

// Hardcoded current date and user info
const CURRENT_DATE_TIME = "2025-05-29 21:25:12";
const CURRENT_USER = "Anuj-prajapati-SDE";

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('xs'));
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { scrollYProgress } = useScroll();
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse movement for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas animation with gradient orbs and improved performance
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      // Set canvas dimensions with device pixel ratio for sharp rendering
      const width = window.innerWidth;
      const height = window.innerHeight * 2; // Extended height for scrolling
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
        // Create gradient with proper opacity
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        // Convert hex to rgba for better control
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
    const orbCount = isMobile ? 6 : 12;
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

  // Features with premium gradient icons
  const features = [
    {
      icon: <Code />,
      title: 'Advanced Code Editor',
      description: 'Professional multi-language IDE with syntax highlighting and real-time compilation for 30+ programming languages.',
      gradient: 'linear-gradient(135deg, #bc4037 0%, #f47061 100%)',
    },
    {
      icon: <Speed />,
      title: 'Performance Analytics',
      description: 'Comprehensive metrics on code performance with time complexity analysis and execution benchmarks.',
      gradient: 'linear-gradient(135deg, #3a47d5 0%, #00d2ff 100%)',
    },
    {
      icon: <EmojiEvents />,
      title: 'Competitive Challenges',
      description: 'Weekly coding competitions with real-time leaderboards and professional ranking systems.',
      gradient: 'linear-gradient(135deg, #2C3E50 0%, #4A6572 100%)',
    },
    {
      icon: <School />,
      title: 'Learning Resources',
      description: 'Extensive educational materials and interactive tutorials to master programming concepts.',
      gradient: 'linear-gradient(135deg, #9a342d 0%, #bd5c55 100%)',
    },
    {
      icon: <Security />,
      title: 'Advanced Security',
      description: 'Enterprise-grade proctoring system with AI-powered plagiarism detection for assessment integrity.',
      gradient: 'linear-gradient(135deg, #4A6572 0%, #2C3E50 100%)',
    },
    {
      icon: <FlashOn />,
      title: 'Real-time Collaboration',
      description: 'Seamless collaborative coding environment with synchronized editing and version control.',
      gradient: 'linear-gradient(135deg, #f47061 0%, #bc4037 100%)',
    },
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: "Aditya Sharma",
      role: "Computer Science Student",
      company: "IIT Delhi",
      avatar: "/assets/images/testimonial1.jpg",
      rating: 5,
      text: "Code-Quest transformed my coding journey. The platform's advanced features and interactive challenges helped me secure a top internship position."
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Full Stack Developer",
      company: "Microsoft",
      avatar: "/assets/images/testimonial2.jpg",
      rating: 5,
      text: "The competitive challenges and performance analytics gave me valuable insights to improve my algorithms. My interview success rate improved dramatically."
    },
    {
      id: 3,
      name: "Dr. Rajesh Kumar",
      role: "Professor",
      company: "BITS Pilani",
      avatar: "/assets/images/testimonial3.jpg",
      rating: 5,
      text: "As an educator, I find Code-Quest's assessment tools exceptional. The plagiarism detection and detailed analytics help me evaluate students effectively."
    }
  ];

  // Statistics with animated counters
  const stats = [
    { value: "500,000+", label: "Active Users" },
    { value: "10+ Million", label: "Code Submissions" },
    { value: "50,000+", label: "Coding Challenges" },
    { value: "2,500+", label: "Educational Institutions" },
  ];
  
  // Pricing plans
  const pricingPlans = [
    {
      title: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for beginners and casual learners",
      features: [
        "5 coding challenges per week",
        "Basic code editor",
        "Community support",
        "Limited performance analytics",
      ],
      cta: "Get Started",
      popular: false,
      gradient: "linear-gradient(135deg, #2C3E50 0%, #4A6572 100%)",
    },
    {
      title: "Premium",
      price: "$12",
      period: "per month",
      description: "For serious coders and professionals",
      features: [
        "Unlimited coding challenges",
        "Advanced IDE with all languages",
        "Detailed performance analytics",
        "Priority technical support",
        "Custom practice sessions",
      ],
      cta: "Try Premium",
      popular: true,
      gradient: theme.palette.gradients.primary,
    },
    {
      title: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For educational institutions and companies",
      features: [
        "Custom assessment creation",
        "Advanced plagiarism detection",
        "Team management features",
        "API access",
        "Dedicated support manager",
      ],
      cta: "Contact Sales",
      popular: false,
      gradient: "linear-gradient(135deg, #3a47d5 0%, #00d2ff 100%)",
    },
  ];

  // Language support
  const programmingLanguages = [
    { name: 'JavaScript', level: 95 },
    { name: 'Python', level: 92 },
    { name: 'Java', level: 88 },
    { name: 'C++', level: 85 },
    { name: 'Go', level: 80 },
    { name: 'Ruby', level: 78 },
    { name: 'TypeScript', level: 90 },
    { name: 'Swift', level: 82 },
  ];

  // Latest competitions
  const latestCompetitions = [
    {
      title: "Algorithm Masters Challenge",
      date: "June 15, 2025",
      participants: 1258,
      difficulty: "Advanced",
      prize: "$5,000",
      status: "Upcoming",
    },
    {
      title: "Web Development Hackathon",
      date: "June 5, 2025",
      participants: 876,
      difficulty: "Intermediate",
      prize: "$3,000",
      status: "Registration Open",
    },
    {
      title: "Machine Learning Marathon",
      date: "May 25, 2025",
      participants: 1542,
      difficulty: "Expert",
      prize: "$7,500",
      status: "Completed",
    },
  ];
  
  // Advanced animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.3,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.5,
      }
    }
  };
  
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // Scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // // Handle tab change
  // const handleTabChange = (event, newValue) => {
  //   setTabValue(newValue);
  // };

  return (
    <>
      
      
      {/* Progress indicator */}
      <MotionBox
        style={{ scaleX: scrollYProgress }}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: theme.palette.gradients.primary,
          transformOrigin: '0%',
          zIndex: 2000,
        }}
      />
      
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
          pt: { xs: '120px', sm: '140px', md: '180px' },
          pb: { xs: '80px', sm: '120px', md: '140px' },
          px: { xs: 2, sm: 4, md: 0 },
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">  
          <Grid 
            container 
            spacing={{ xs: 4, md: 8 }}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Left Column - Hero Content */}
            <Grid item xs={12} md={6}>
              <MotionBox
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                sx={{ 
                  maxWidth: { xs: '100%', md: '540px' },
                  mx: { xs: 'auto', md: 0 },
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                {/* Top Badge */}
                <MotionBox
                  variants={itemVariants}
                  sx={{ mb: 3, display: 'inline-block' }}
                >
                  <Chip 
                    label="NEXT-GEN CODING PLATFORM" 
                    color="primary"
                    size="small"
                    icon={<Stars sx={{ color: 'white !important', fontSize: '0.85rem' }} />}
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
                
                {/* Main Headline */}
                <MotionTypography
                  variant="h1"
                  variants={itemVariants}
                  sx={{ 
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.8rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: { xs: 3, md: 4 },
                    letterSpacing: '-0.02em',
                  }}
                >
                  <Box component="span" sx={{ display: 'block' }}>Elevate Your</Box>
                  <Box 
                    component="span" 
                    sx={{
                      background: theme.palette.gradients.primary,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textFillColor: 'transparent',
                    }}
                  >
                    Coding Experience
                  </Box>
                </MotionTypography>
                
                {/* Subheadline */}
                <MotionTypography
                  variant="h5"
                  variants={itemVariants}
                  color="textSecondary"
                  sx={{ 
                    mb: 4,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                  }}
                >
                  The ultimate platform for coding competitions, assessments, and skill development with professional tools.
                </MotionTypography>
                
                {/* CTA Buttons */}
                <MotionBox
                  variants={itemVariants}
                  sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 2, sm: 3 },
                    mb: 5,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                  }}
                >
                  <Button
                    component={RouterLink}
                    to="/dashboard"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ 
                      borderRadius: '50px',
                      px: 4,
                      py: 1.8,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      position: 'relative',
                      overflow: 'hidden',
                      background: theme.palette.gradients.primary,
                      boxShadow: '0 10px 20px rgba(188, 64, 55, 0.25)',
                      textTransform: 'none',
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
                        boxShadow: '0 15px 25px rgba(188, 64, 55, 0.3)',
                        transform: 'translateY(-3px)',
                        '&::after': {
                          left: '100%',
                        }
                      },
                      transition: 'all 0.3s ease',
                    }}
                    startIcon={<PlayArrow />}
                  >
                    Start Coding Now
                  </Button>
                  
                  <Button
                    component={RouterLink}
                    to="/features"
                    variant="outlined"
                    size="large"
                    sx={{ 
                      borderRadius: '50px',
                      px: 4,
                      py: 1.7,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderWidth: 2,
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        borderWidth: 2,
                        background: 'rgba(188, 64, 55, 0.04)',
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Explore Features
                  </Button>
                </MotionBox>
                
                {/* Stats Row */}
                <MotionBox
                  variants={containerVariants}
                  sx={{ 
                    mt: 4,
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                    gap: { xs: 3, md: 4 },
                  }}
                >
                  {stats.map((stat, index) => (
                    <MotionBox 
                      key={index} 
                      variants={itemVariants}
                      sx={{ textAlign: { xs: 'center', md: 'left' } }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '1.5rem', md: '1.8rem' },
                          mb: 0.5,
                          background: theme.palette.gradients.primary,
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textFillColor: 'transparent',
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {stat.label}
                      </Typography>
                    </MotionBox>
                  ))}
                </MotionBox>
                
                {/* User Badge */}
                <MotionBox
                  variants={itemVariants}
                  sx={{
                    mt: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    py: 1.5,
                    px: 2.5,
                    borderRadius: '100px',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    width: 'fit-content',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)',
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
              </MotionBox>
            </Grid>
            
            {/* Right Column - Animated Illustration */}
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.3,
                }}
                sx={{ 
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transform: !isMobile 
                    ? `perspective(1000px) 
                       rotateY(${mousePosition.x / window.innerWidth * 4 - 2}deg) 
                       rotateX(${-mousePosition.y / window.innerHeight * 4 + 2}deg)`
                    : 'none',
                  transition: 'transform 0.1s ease',
                }}
              >
                {/* Premium Glass Card */}
                <Box
                  sx={{
                    borderRadius: '28px',
                    overflow: 'hidden',
                    position: 'relative',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                    boxShadow: isDark 
                      ? '0 25px 70px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
                      : '0 25px 70px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05) inset',
                    p: { xs: 3, sm: 4, md: 6 },
                    mx: { xs: 2, sm: 4, md: 0 },
                    transform: 'translateZ(50px)',
                    height: '100%',
                    minHeight: { xs: '300px', sm: '400px', md: '480px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Code Editor Interface */}
                  <Box
                    component="img"
                    src="/assets/images/code-editor.svg"
                    alt="Code Editor Interface"
                    sx={{ 
                      width: '100%', 
                      maxWidth: '520px',
                      height: 'auto',
                      borderRadius: '16px',
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                      transform: 'translateZ(30px)',
                    }}
                  />
                  
                  {/* Top Project Badge */}
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    sx={{
                      position: 'absolute',
                      top: 24,
                      right: 24,
                      borderRadius: '12px',
                      py: 1,
                      px: 2,
                      background: isDark ? 'rgba(10, 10, 10, 0.7)' : 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                      transform: 'translateZ(70px)',
                    }}
                  >
                    <GitHub 
                      sx={{ 
                        color: isDark ? '#fff' : '#24292e', 
                        fontSize: '1.2rem', 
                        mr: 1 
                      }} 
                    />
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: isDark ? 'white' : 'text.primary',
                      }}
                    >
                      KITS Professional Project
                    </Typography>
                  </Box>
                  
                  {/* Bottom Status Badge */}
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    sx={{
                      position: 'absolute',
                      bottom: 24,
                      left: 24,
                      borderRadius: '100px',
                      py: 1,
                      px: 3,
                      background: theme.palette.gradients.primary,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      boxShadow: '0 10px 20px rgba(188, 64, 55, 0.25)',
                      transform: 'translateZ(70px)',
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Box 
                        component={motion.span}
                        animate={{ 
                          rotate: [0, 15, -15, 0],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                        sx={{ 
                          display: 'inline-flex',
                          mr: 1,
                        }}
                      >
                        🚀
                      </Box>
                      Ready to deploy
                    </Typography>
                  </Box>
                </Box>
                
                {/* Decorative Elements */}
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
                  animate={{ opacity: 0.7, scale: 1, rotate: -15 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  sx={{
                    position: 'absolute',
                    top: '-5%',
                    left: '-8%',
                    width: '150px',
                    height: '150px',
                    borderRadius: '30px',
                    background: 'linear-gradient(135deg, #bc4037 0%, #f47061 100%)',
                    zIndex: -1,
                    boxShadow: '0 20px 40px rgba(188, 64, 55, 0.3)',
                  }}
                />
                
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
                  animate={{ opacity: 0.6, scale: 1, rotate: 15 }}
                  transition={{ duration: 0.7, delay: 0.6 }}
                  sx={{
                    position: 'absolute',
                    bottom: '0%',
                    right: '-5%',
                    width: '120px',
                    height: '120px',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #3a47d5 0%, #00d2ff 100%)',
                    zIndex: -1,
                    boxShadow: '0 20px 40px rgba(58, 71, 213, 0.3)',
                  }}
                />
              </MotionBox>
            </Grid>
          </Grid>
          
          {/* Scroll Down Indicator */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: { xs: 20, md: 40 },
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Typography 
              variant="body2" 
              color="textSecondary" 
              sx={{ mb: 1, fontWeight: 500, opacity: 0.8 }}
            >
              Explore Features
            </Typography>
            <IconButton 
              onClick={scrollToFeatures}
              sx={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)',
                },
                animation: 'bounce 2s infinite',
                '@keyframes bounce': {
                  '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                  '40%': { transform: 'translateY(-10px)' },
                  '60%': { transform: 'translateY(-5px)' },
                },
              }}
            >
              <KeyboardDoubleArrowDown />
            </IconButton>
          </MotionBox>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box 
        id="features"
        component="section"
        sx={{ 
          py: { xs: 10, md: 15 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          {/* Section Header */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: '-100px' }}
            sx={{ 
              textAlign: 'center',
              mb: { xs: 6, md: 10 },
              mx: 'auto',
              maxWidth: '800px',
            }}
          >
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: 1.5,
                mb: 1,
              }}
            >
              PREMIUM CAPABILITIES
            </Typography>
            
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.2rem', md: '3rem' },
              }}
            >
              Advanced Features
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
              Our platform combines cutting-edge technology with professional-grade tools
              to elevate your coding and assessment experience.
            </Typography>
          </MotionBox>
          
          {/* Features Grid */}
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index} style={{ minWidth: '100%' }}>
                <MotionPaper
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  whileHover={{ 
                    y: -10, 
                    boxShadow: isDark 
                      ? '0 25px 50px rgba(0, 0, 0, 0.2)' 
                      : '0 25px 50px rgba(0, 0, 0, 0.1)' 
                  }}
                  sx={{ 
                    height: '100%',
                    p: 4,
                    borderRadius: '24px',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                    boxShadow: isDark 
                      ? '0 15px 35px rgba(0, 0, 0, 0.2)' 
                      : '0 15px 35px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease-in-out',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Feature Icon */}
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      background: feature.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mb: 3,
                      position: 'relative',
                      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Animated shine effect */}
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
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        zIndex: 1,
                      }}
                    />
                    <Box sx={{ fontSize: 30, zIndex: 2 }}>{feature.icon}</Box>
                  </Box>
                  
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Languages Support Section */}
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
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={5}>
              <MotionBox
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true, margin: '-100px' }}
              >
                <Typography
                  variant="overline"
                  component="div"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    letterSpacing: 1.5,
                    mb: 1,
                  }}
                >
                  COMPREHENSIVE SUPPORT
                </Typography>
                
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    mb: 3,
                    fontSize: { xs: '2.2rem', md: '2.8rem' },
                  }}
                >
                  Language Support
                </Typography>
                
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{
                    mb: 4,
                    fontSize: '1.1rem',
                  }}
                >
                  Our platform offers comprehensive support for all major programming languages, 
                  with specialized compiler optimizations and language-specific features.
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      borderRadius: '16px',
                      bgcolor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                      boxShadow: isDark 
                        ? '0 10px 30px rgba(0, 0, 0, 0.2)' 
                        : '0 10px 30px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                          <Box 
                            component="img" 
                            src="/assets/images/compiler-icon.svg" 
                            alt="Compiler" 
                            sx={{ 
                              width: '80%', 
                              maxWidth: 160,
                              filter: isDark ? 'brightness(0.9)' : 'none',
                            }} 
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          Advanced Compilers
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Optimized compilation with detailed error reporting and 
                          performance metrics.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
                
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ 
                    borderRadius: '50px',
                    px: 4,
                    py: 1.5,
                    background: theme.palette.gradients.primary,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  View All Languages
                </Button>
              </MotionBox>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <MotionBox
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true, margin: '-100px' }}
                sx={{ 
                  p: 4, 
                  borderRadius: '24px',
                  bgcolor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                  boxShadow: isDark 
                    ? '0 20px 40px rgba(0, 0, 0, 0.2)' 
                    : '0 20px 40px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Grid container spacing={3}>
                  {programmingLanguages.map((lang, index) => (
                    <Grid item xs={12} key={index}>
                      <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        sx={{ mb: 1 }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography fontWeight={600}>{lang.name}</Typography>
                          <Typography color="primary" fontWeight={600}>{lang.level}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={lang.level} 
                          sx={{ 
                            height: 8,
                            borderRadius: 4,
                            bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              background: theme.palette.gradients.primary,
                            }
                          }}
                        />
                      </MotionBox>
                    </Grid>
                  ))}
                </Grid>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Competitions Section */}
      <Box
        component="section"
        sx={{ 
          py: { xs: 10, md: 15 },
          position: 'relative',
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
              mb: { xs: 6, md: 10 },
              mx: 'auto',
              maxWidth: '800px',
            }}
          >
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: 1.5,
                mb: 1,
              }}
            >
              JOIN THE CHALLENGE
            </Typography>
            
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.2rem', md: '3rem' },
              }}
            >
              Upcoming Competitions
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
              Participate in our global coding competitions and challenge yourself
              against the best programmers worldwide.
            </Typography>
          </MotionBox>
          
          <Grid container spacing={4}>
            {latestCompetitions.map((competition, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  whileHover={{ 
                    y: -10, 
                    boxShadow: isDark 
                      ? '0 25px 50px rgba(0, 0, 0, 0.2)' 
                      : '0 25px 50px rgba(0, 0, 0, 0.1)' 
                  }}
                  sx={{ 
                    borderRadius: '24px',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                    boxShadow: isDark 
                      ? '0 15px 35px rgba(0, 0, 0, 0.2)' 
                      : '0 15px 35px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      background: index === 0 ? theme.palette.gradients.primary : 
                               (index === 1 ? 'linear-gradient(135deg, #3a47d5 0%, #00d2ff 100%)' :
                                'linear-gradient(135deg, #2C3E50 0%, #4A6572 100%)'),
                      color: 'white',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Animated shine effect */}
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
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        zIndex: 1,
                      }}
                    />
                    <Box sx={{ position: 'relative', zIndex: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" fontWeight={500}>
                          {competition.date}
                        </Typography>
                        <Chip 
                          label={competition.status}
                          size="small"
                          sx={{ 
                            bgcolor: competition.status === 'Upcoming' ? 'rgba(255,255,255,0.2)' : 
                                  (competition.status === 'Registration Open' ? 'rgba(0,255,0,0.2)' : 
                                   'rgba(255,255,255,0.1)'),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                      <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
                        {competition.title}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Difficulty
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {competition.difficulty}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Participants
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {competition.participants.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          Prize Pool
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                          }}
                        >
                          {competition.prize}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{ 
                        borderRadius: '50px',
                        py: 1.2,
                        fontWeight: 600,
                        borderWidth: 2,
                        textTransform: 'none',
                      }}
                    >
                      {competition.status === 'Completed' ? 'View Results' : 'Join Competition'}
                    </Button>
                  </Box>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
          
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: '-100px' }}
            sx={{ 
              mt: 6,
              textAlign: 'center',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ 
                borderRadius: '50px',
                px: 5,
                py: 1.8,
                fontWeight: 600,
                background: theme.palette.gradients.primary,
                boxShadow: '0 10px 20px rgba(188, 64, 55, 0.2)',
                textTransform: 'none',
              }}
            >
              View All Competitions
            </Button>
          </MotionBox>
        </Container>
      </Box>
      
      {/* Testimonials Section */}
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
              mb: { xs: 6, md: 10 },
              mx: 'auto',
              maxWidth: '800px',
            }}
          >
            <Typography
              variant="overline"
              component="div"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 600,
                letterSpacing: 1.5,
                mb: 1,
              }}
            >
              SUCCESS STORIES
            </Typography>
            
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2.2rem', md: '3rem' },
              }}
            >
              User Testimonials
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
              Hear from our users about how our platform has transformed their coding and assessment experience.
            </Typography>
          </MotionBox>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionPaper
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  whileHover={{ 
                    y: -10, 
                    boxShadow: isDark 
                      ? '0 25px 50px rgba(0, 0, 0, 0.2)' 
                      : '0 25px 50px rgba(0, 0, 0, 0.1)' 
                  }}
                  sx={{ 
                    p: 4,
                    borderRadius: '24px',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                    boxShadow: isDark 
                      ? '0 15px 35px rgba(0, 0, 0, 0.2)' 
                      : '0 15px 35px rgba(0, 0, 0, 0.05)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Avatar
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      sx={{
                        width: 64,
                        height: 64,
                        mb: 2,
                        boxShadow: isDark ? '0 10px 20px rgba(255,255,255,0.1)' : 'none',
                      }}
                    />
                    <Typography variant="h6" fontWeight={600}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {testimonial.role}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" sx={{ flexGrow: 1 }}>
                    {testimonial.feedback}
                  </Typography>
                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                    <Rating
                      name={`testimonial-rating-${index}`}
                      value={testimonial.rating}
                      readOnly
                      size="small"
                      sx={{ color: theme.palette.primary.main }}
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {testimonial.rating} / 5
                    </Typography>
                  </Box>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: '-100px' }}
            sx={{ 
              mt: 6,
              textAlign: 'center',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ 
                borderRadius: '50px',
                px: 5,
                py: 1.8,
                fontWeight: 600,
                background: theme.palette.gradients.primary,
                boxShadow: '0 10px 20px rgba(188, 64, 55, 0.2)',
                textTransform: 'none',
              }}
            >
              Share Your Experience
            </Button>
          </MotionBox>

        </Container>
      </Box>
   
  </>
  );
}
export default HomePage;
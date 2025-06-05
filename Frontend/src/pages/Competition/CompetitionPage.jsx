import React, { useRef, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  AvatarGroup,
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
  Link,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CardActions,
} from '@mui/material';
import {
  AccessTime,
  Add,
  AutoAwesome,
  CalendarToday,
  CheckCircle,
  Code,
  EmojiEvents,
  FilterList,
  Flag,
  Group,
  InfoOutlined,
  MoreVert,
  NavigateBefore,
  NavigateNext,
  NotificationsNone,
  Person,
  Public,
  QuestionAnswer,
  Quiz,
  Search,
  Share,
  Star,
  StarBorder,
  Timer,
  TrendingUp,
  Visibility,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Current date and user info
const CURRENT_DATE_TIME = "2025-06-04 22:29:40";
const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

// Sample competition data
const competitions = [
  {
    id: 'cq-2025-06',
    title: 'Summer Code Challenge 2025',
    subtitle: 'Advanced Full-Stack Development',
    description: 'Push your coding skills to the limit with our intensive summer competition focused on modern full-stack development. Tackle real-world challenges ranging from frontend design to backend architecture and database optimization.',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    startDate: '2025-06-10 09:00:00',
    endDate: '2025-06-17 18:00:00',
    difficulty: 'Advanced',
    participants: 248,
    maxParticipants: 300,
    registrationDeadline: '2025-06-09 23:59:59',
    categories: ['Web Development', 'Cloud Computing', 'Database Design'],
    status: 'upcoming',
    prizes: [
      { position: '1st Place', reward: '$3,000 + Internship Opportunity' },
      { position: '2nd Place', reward: '$1,500 + Premium Dev Bundle' },
      { position: '3rd Place', reward: '$750 + Premium Dev Bundle' }
    ],
    featured: true,
    languages: ['JavaScript', 'Python', 'Java'],
    modules: ['MCQ Test', 'Q&A Session', 'Coding Challenge'],
  },
  {
    id: 'cq-2025-05',
    title: 'AI & Machine Learning Hackathon',
    subtitle: 'Intelligent Systems Competition',
    description: 'Design and implement machine learning models to solve complex problems in image recognition, natural language processing, and predictive analytics.',
    bannerImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb',
    startDate: '2025-05-22 10:00:00',
    endDate: '2025-05-29 18:00:00',
    difficulty: 'Advanced',
    participants: 300,
    maxParticipants: 300,
    registrationDeadline: '2025-05-21 23:59:59',
    categories: ['Machine Learning', 'AI', 'Data Science'],
    status: 'active',
    prizes: [
      { position: '1st Place', reward: '$4,000 + GPU Cluster Access' },
      { position: '2nd Place', reward: '$2,000 + Cloud Credits' },
      { position: '3rd Place', reward: '$1,000 + Cloud Credits' }
    ],
    featured: true,
    languages: ['Python', 'R', 'Julia'],
    modules: ['MCQ Test', 'Q&A Session', 'ML Project Submission'],
  },
  {
    id: 'cq-2025-04',
    title: 'Cybersecurity Challenge',
    subtitle: 'Ethical Hacking Competition',
    description: 'Test your security skills by identifying vulnerabilities, securing systems, and performing ethical hacking challenges in a controlled environment.',
    bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    startDate: '2025-04-15 08:00:00',
    endDate: '2025-04-22 20:00:00',
    difficulty: 'Intermediate',
    participants: 185,
    maxParticipants: 200,
    registrationDeadline: '2025-04-14 23:59:59',
    categories: ['Cybersecurity', 'Penetration Testing', 'Network Security'],
    status: 'completed',
    prizes: [
      { position: '1st Place', reward: '$2,500 + Security Certification' },
      { position: '2nd Place', reward: '$1,200 + Security Software Bundle' },
      { position: '3rd Place', reward: '$600 + Security Software Bundle' }
    ],
    featured: false,
    languages: ['Python', 'Bash', 'C'],
    modules: ['MCQ Test', 'Q&A Session', 'CTF Challenges'],
  },
  {
    id: 'cq-2025-03',
    title: 'Frontend Masters Challenge',
    subtitle: 'UI/UX & Frontend Development',
    description: 'Create beautiful, responsive, and accessible web interfaces using modern frontend technologies and design principles.',
    bannerImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e',
    startDate: '2025-03-18 09:00:00',
    endDate: '2025-03-25 18:00:00',
    difficulty: 'Intermediate',
    participants: 275,
    maxParticipants: 300,
    registrationDeadline: '2025-03-17 23:59:59',
    categories: ['Frontend', 'UI/UX', 'Web Design'],
    status: 'completed',
    prizes: [
      { position: '1st Place', reward: '$2,000 + Design Software Bundle' },
      { position: '2nd Place', reward: '$1,000 + Premium Design Resources' },
      { position: '3rd Place', reward: '$500 + Premium Design Resources' }
    ],
    featured: false,
    languages: ['JavaScript', 'TypeScript', 'HTML/CSS'],
    modules: ['MCQ Test', 'Design Evaluation', 'Frontend Project'],
  },
];

// Sample user registration status
const userRegistrations = {
  'cq-2025-06': null, // not registered
  'cq-2025-05': {
    status: 'registered',
    registrationDate: '2025-05-18 14:22:31',
    completedModules: ['MCQ Test'],
    currentScore: 85.5,
    rank: 42,
  },
  'cq-2025-04': {
    status: 'completed',
    registrationDate: '2025-04-12 09:15:47',
    completedModules: ['MCQ Test', 'Q&A Session', 'CTF Challenges'],
    finalScore: 92.3,
    rank: 15,
  },
  'cq-2025-03': {
    status: 'completed',
    registrationDate: '2025-03-15 11:08:22',
    completedModules: ['MCQ Test', 'Design Evaluation', 'Frontend Project'],
    finalScore: 88.7,
    rank: 27,
  },
};

// Time remaining calculation
const getTimeRemaining = (endDate) => {
  const total = Date.parse(endDate) - Date.parse(CURRENT_DATE_TIME);
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
};

const CompetitionPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  
  // Refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // State
  const [tabValue, setTabValue] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    difficulty: 'all',
    registered: 'all'
  });
  
  const featuredCompetitions = competitions.filter(comp => comp.featured);
  
  // Next/Previous Featured Competition
  const handleNextFeatured = () => {
    setFeaturedIndex((prev) => 
      prev === featuredCompetitions.length - 1 ? 0 : prev + 1
    );
  };
  
  const handlePrevFeatured = () => {
    setFeaturedIndex((prev) => 
      prev === 0 ? featuredCompetitions.length - 1 : prev - 1
    );
  };
  
  // Filter Menu
  const handleOpenFilterMenu = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };
  
  const handleCloseFilterMenu = () => {
    setFilterMenuAnchor(null);
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    handleCloseFilterMenu();
  };
  
  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
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

  // Get status icon & color
  const getStatusInfo = (status) => {
    switch(status) {
      case 'upcoming':
        return { 
          icon: <CalendarToday fontSize="small" />, 
          color: 'info', 
          label: 'Upcoming' 
        };
      case 'active':
        return { 
          icon: <Timer fontSize="small" />, 
          color: 'success', 
          label: 'Active' 
        };
      case 'completed':
        return { 
          icon: <Flag fontSize="small" />, 
          color: 'default', 
          label: 'Completed' 
        };
      default:
        return { 
          icon: <InfoOutlined fontSize="small" />, 
          color: 'default', 
          label: status 
        };
    }
  };
  
  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner':
        return theme.palette.success.main;
      case 'Intermediate':
        return theme.palette.warning.main;
      case 'Advanced':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };
  
  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Filter competitions based on selected filters
  const filteredCompetitions = competitions.filter(competition => {
    if (filters.status !== 'all' && competition.status !== filters.status) return false;
    if (filters.difficulty !== 'all' && competition.difficulty !== filters.difficulty) return false;
    
    if (filters.registered !== 'all') {
      const isRegistered = userRegistrations[competition.id] !== null;
      if (filters.registered === 'registered' && !isRegistered) return false;
      if (filters.registered === 'not-registered' && isRegistered) return false;
    }
    
    return true;
  });
  
  // Animation for featured competition counter
  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
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
      
      {/* Page Header */}
      <Box 
        component="section" 
        sx={{ 
          position: 'relative',
          pt: { xs: '100px', sm: '120px', md: '120px' },
          pb: { xs: '40px', sm: '50px', md: '60px' },
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
                  label="COMPETE & WIN" 
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
                  Code Quest
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
                    Competitions
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
                  Challenge yourself, showcase your skills, and compete with the best developers from around the world
                </MotionTypography>
              </MotionBox>
              
              {/* Action Buttons */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: { xs: 2, sm: 3 },
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
                  startIcon={<EmojiEvents />}
                >
                  Join Competition
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
                  startIcon={<TrendingUp />}
                >
                  View Leaderboard
                </Button>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Featured Competition Section */}
      <Box
        component="section"
        sx={{
          mb: 10,
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs>
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1
                }}
              >
                Featured 
                <Box
                  component="span"
                  sx={{
                    color: theme.palette.primary.main,
                  }}
                >
                  Competitions
                </Box>
                <Chip
                  size="small"
                  label={`${featuredIndex + 1}/${featuredCompetitions.length}`}
                  sx={{ 
                    ml: 2,
                    fontWeight: 600,
                    animation: `${pulse} 2s infinite ease-in-out`,
                    bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  }}
                />
              </Typography>
            </Grid>
            
            <Grid item sx={{ display: 'flex' }}>
              <IconButton 
                onClick={handlePrevFeatured}
                sx={{
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  mr: 1,
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  }
                }}
              >
                <NavigateBefore />
              </IconButton>
              
              <IconButton 
                onClick={handleNextFeatured}
                sx={{
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  }
                }}
              >
                <NavigateNext />
              </IconButton>
            </Grid>
          </Grid>
          
          <AnimatePresence mode="wait">
            <MotionBox
              key={featuredCompetitions[featuredIndex].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Featured Competition Card */}
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: isDark 
                    ? '0 10px 40px rgba(0, 0, 0, 0.3)' 
                    : '0 10px 40px rgba(0, 0, 0, 0.1)',
                  backgroundColor: isDark 
                    ? 'rgba(30, 28, 28, 0.7)' 
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                }}
              >
                <Grid container>
                  {/* Banner Image */}
                  <Grid 
                    item 
                    xs={12} 
                    md={5} 
                    sx={{ 
                      height: { xs: '200px', md: 'auto' },
                      minHeight: { xs: '200px', md: '400px' },
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      component="img"
                      src={featuredCompetitions[featuredIndex].bannerImage}
                      alt={featuredCompetitions[featuredIndex].title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.4), rgba(0,0,0,0))',
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        justifyContent: 'center',
                        p: 4,
                      }}
                    >
                      <Chip 
                        label={getStatusInfo(featuredCompetitions[featuredIndex].status).label} 
                        color={getStatusInfo(featuredCompetitions[featuredIndex].status).color}
                        size="small"
                        icon={getStatusInfo(featuredCompetitions[featuredIndex].status).icon}
                        sx={{ 
                          alignSelf: 'flex-start',
                          mb: 2,
                          fontWeight: 600,
                        }}
                      />
                      
                      <Typography 
                        variant="h3" 
                        component="h2" 
                        sx={{ 
                          color: 'white',
                          fontWeight: 700,
                          mb: 1,
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        }}
                      >
                        {featuredCompetitions[featuredIndex].title}
                      </Typography>
                      
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.9)',
                          mb: 3,
                          textShadow: '0 2px 3px rgba(0,0,0,0.3)',
                        }}
                      >
                        {featuredCompetitions[featuredIndex].subtitle}
                      </Typography>
                      
                      <Box sx={{ maxWidth: '500px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarToday sx={{ color: 'white', fontSize: '1rem', mr: 1.5, opacity: 0.9 }} />
                          <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                            {formatDate(featuredCompetitions[featuredIndex].startDate)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Group sx={{ color: 'white', fontSize: '1rem', mr: 1.5, opacity: 0.9 }} />
                          <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                            {featuredCompetitions[featuredIndex].participants} participants registered
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Public sx={{ color: 'white', fontSize: '1rem', mr: 1.5, opacity: 0.9 }} />
                          <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
                            Open to all participants worldwide
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    {/* Mobile Status Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        display: { xs: 'block', md: 'none' },
                      }}
                    >
                      <Chip 
                        label={getStatusInfo(featuredCompetitions[featuredIndex].status).label} 
                        color={getStatusInfo(featuredCompetitions[featuredIndex].status).color}
                        size="small"
                        icon={getStatusInfo(featuredCompetitions[featuredIndex].status).icon}
                        sx={{ 
                          fontWeight: 600,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }}
                      />
                    </Box>
                  </Grid>
                  
                  {/* Competition Details */}
                  <Grid item xs={12} md={7}>
                    {/* Mobile Title Section */}
                    <Box 
                      sx={{ 
                        display: { xs: 'block', md: 'none' }, 
                        p: 3,
                        borderBottom: '1px solid',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      }}
                    >
                      <Typography 
                        variant="h5" 
                        component="h2" 
                        sx={{ 
                          fontWeight: 700,
                          mb: 1,
                        }}
                      >
                        {featuredCompetitions[featuredIndex].title}
                      </Typography>
                      
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {featuredCompetitions[featuredIndex].subtitle}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ p: 4 }}>
                      {/* Competition Description */}
                      <Typography
                        variant="body1"
                        paragraph
                        sx={{ mb: 3 }}
                      >
                        {featuredCompetitions[featuredIndex].description}
                      </Typography>
                      
                      {/* Competition Info Cards */}
                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              height: '100%',
                              backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                              Difficulty
                            </Typography>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700, 
                                color: getDifficultyColor(featuredCompetitions[featuredIndex].difficulty) 
                              }}
                            >
                              {featuredCompetitions[featuredIndex].difficulty}
                            </Typography>
                          </Paper>
                        </Grid>
                        
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              height: '100%',
                              backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                              Participants
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {featuredCompetitions[featuredIndex].participants}/{featuredCompetitions[featuredIndex].maxParticipants}
                            </Typography>
                          </Paper>
                        </Grid>
                        
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              height: '100%',
                              backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                              Duration
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              7 Days
                            </Typography>
                          </Paper>
                        </Grid>
                        
                        <Grid item xs={6} sm={3}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              height: '100%',
                              backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                              Languages
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {featuredCompetitions[featuredIndex].languages.length}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                      
                      {/* Category Tags */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Categories:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {featuredCompetitions[featuredIndex].categories.map((category, i) => (
                            <Chip
                              key={i}
                              label={category}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontWeight: 500,
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                      
                      {/* Module Icons */}
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                          Competition Modules:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                          {featuredCompetitions[featuredIndex].modules.map((module, i) => (
                            <Tooltip key={i} title={module} placement="top">
                              <Box 
                                sx={{ 
                                  display: 'flex', 
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                }}
                              >
                                {module.includes('MCQ') && (
                                  <Avatar
                                    sx={{
                                      bgcolor: isDark ? 'rgba(206, 147, 216, 0.2)' : 'rgba(206, 147, 216, 0.1)',
                                      color: '#9c27b0',
                                      width: 40,
                                      height: 40,
                                      mb: 0.5,
                                    }}
                                  >
                                    <Quiz fontSize="small" />
                                  </Avatar>
                                )}
                                {module.includes('Q&A') && (
                                  <Avatar
                                    sx={{
                                      bgcolor: isDark ? 'rgba(144, 202, 249, 0.2)' : 'rgba(144, 202, 249, 0.1)',
                                      color: '#2196f3',
                                      width: 40,
                                      height: 40,
                                      mb: 0.5,
                                    }}
                                  >
                                    <QuestionAnswer fontSize="small" />
                                  </Avatar>
                                )}
                                {module.includes('Coding') && (
                                  <Avatar
                                    sx={{
                                      bgcolor: isDark ? 'rgba(255, 167, 38, 0.2)' : 'rgba(255, 167, 38, 0.1)',
                                      color: '#ff9800',
                                      width: 40,
                                      height: 40,
                                      mb: 0.5,
                                    }}
                                  >
                                    <Code fontSize="small" />
                                  </Avatar>
                                )}
                                {module.includes('Design') && (
                                  <Avatar
                                    sx={{
                                      bgcolor: isDark ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
                                      color: '#4caf50',
                                      width: 40,
                                      height: 40,
                                      mb: 0.5,
                                    }}
                                  >
                                    <Visibility fontSize="small" />
                                  </Avatar>
                                )}
                                {module.includes('ML') || module.includes('CTF') && (
                                  <Avatar
                                    sx={{
                                      bgcolor: isDark ? 'rgba(239, 83, 80, 0.2)' : 'rgba(239, 83, 80, 0.1)',
                                      color: '#f44336',
                                      width: 40,
                                      height: 40,
                                      mb: 0.5,
                                    }}
                                  >
                                    <Code fontSize="small" />
                                  </Avatar>
                                )}
                                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                                  {module.split(' ')[0]}
                                </Typography>
                              </Box>
                            </Tooltip>
                          ))}
                        </Box>
                      </Box>
                      
                      {/* Registration Info & CTA */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                            Registration closes:
                          </Typography>
                          <Typography variant="body2" color="error" fontWeight={500}>
                            {formatDate(featuredCompetitions[featuredIndex].registrationDeadline)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button
                            variant="outlined"
                            startIcon={<InfoOutlined />}
                            sx={{
                              borderRadius: 2,
                              borderWidth: 2,
                              py: 1,
                              px: 3,
                              fontWeight: 600,
                              textTransform: 'none',
                              '&:hover': {
                                borderWidth: 2,
                              }
                            }}
                          >
                            Details
                          </Button>
                          
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Star />}
                            sx={{
                              borderRadius: 2,
                              py: 1,
                              px: 3,
                              fontWeight: 600,
                              textTransform: 'none',
                              background: theme.palette.gradients.primary,
                            }}
                          >
                            Register Now
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </MotionBox>
          </AnimatePresence>
        </Container>
      </Box>
      
      {/* All Competitions Section */}
      <Box component="section" sx={{ pb: 10 }}>
        <Container maxWidth="xl">
          {/* Section Header with Filters */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 4,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="h4" component="h2" fontWeight={700}>
              All Competitions
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Search on Desktop */}
              {!isMobile && (
                <Paper
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    p: 0.5,
                    pl: 2,
                    borderRadius: '100px',
                    maxWidth: '250px',
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  }}
                >
                  <Search sx={{ color: 'text.secondary', mr: 1, fontSize: '1.1rem' }} />
                  <Box
                    component="input"
                    placeholder="Search competitions..."
                    sx={{
                      border: 'none',
                      background: 'transparent',
                      flexGrow: 1,
                      fontSize: '0.9rem',
                      py: 1,
                      outline: 'none',
                      color: 'text.primary',
                      '&::placeholder': {
                        color: 'text.secondary',
                        opacity: 0.7,
                      },
                      fontFamily: theme.typography.fontFamily,
                    }}
                  />
                </Paper>
              )}
              
              {/* Filter Button */}
              <Button
                startIcon={<FilterList />}
                variant="outlined"
                onClick={handleOpenFilterMenu}
                sx={{
                  borderRadius: 2,
                  borderWidth: 1,
                  py: 1,
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    borderWidth: 1,
                  }
                }}
              >
                Filter
              </Button>
              
              {/* Filter Menu */}
              <Menu
                anchorEl={filterMenuAnchor}
                open={Boolean(filterMenuAnchor)}
                onClose={handleCloseFilterMenu}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    borderRadius: 2,
                    minWidth: 200,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                  Status
                </Typography>
                <MenuItem 
                  onClick={() => handleFilterChange('status', 'all')}
                  selected={filters.status === 'all'}
                >
                  <ListItemText>All</ListItemText>
                </MenuItem>
                <MenuItem 
                  onClick={() => handleFilterChange('status', 'upcoming')}
                  selected={filters.status === 'upcoming'}
                >
                  <ListItemIcon>
                    <CalendarToday fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Upcoming</ListItemText>
                </MenuItem>
                <MenuItem 
                  onClick={() => handleFilterChange('status', 'active')}
                  selected={filters.status === 'active'}
                >
                  <ListItemIcon>
                    <Timer fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Active</ListItemText>
                </MenuItem>
                <MenuItem 
                  onClick={() => handleFilterChange('status', 'completed')}
                  selected={filters.status === 'completed'}
                >
                  <ListItemIcon>
                    <Flag fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Completed</ListItemText>
                </MenuItem>
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                  Difficulty
                </Typography>
                <MenuItem 
                  onClick={() => handleFilterChange('difficulty', 'all')}
                  selected={filters.difficulty === 'all'}
                >
                  <ListItemText>All Levels</ListItemText>
                </MenuItem>
                <MenuItem 
                  onClick={() => handleFilterChange('difficulty', 'Beginner')}
                  selected={filters.difficulty === 'Beginner'}
                >
                  <ListItemText>Beginner</ListItemText>
                </MenuItem>
                <MenuItem 
                  onClick={() => handleFilterChange('difficulty', 'Intermediate')}
                  selected={filters.difficulty === 'Intermediate'}
                >
                  <ListItemText>Intermediate</ListItemText>
                </MenuItem>
                <MenuItem 
                  onClick={() => handleFilterChange('difficulty', 'Advanced')}
                  selected={filters.difficulty === 'Advanced'}
                >
                  <ListItemText>Advanced</ListItemText>
                </MenuItem>
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                  Registration
                </Typography>
                <MenuItem 
                  onClick={() => handleFilterChange('registered', 'all')}
                  selected={filters.registered === 'all'}
                >
                  <ListItemText>All</ListItemText>
                </MenuItem>
                <MenuItem 
                  onClick={() => handleFilterChange('registered', 'registered')}
                  selected={filters.registered === 'registered'}
                >
                  <ListItemText>Registered</ListItemText>
                </MenuItem>
                <MenuItem 
                  onClick={() => handleFilterChange('registered', 'not-registered')}
                  selected={filters.registered === 'not-registered'}
                >
                  <ListItemText>Not Registered</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          
          {/* Competitions Grid */}
          <Grid container spacing={3}>
            {filteredCompetitions.map((competition) => {
              const userRegistration = userRegistrations[competition.id];
              const isRegistered = userRegistration !== null;
              const timeRemaining = competition.status === 'active' 
                ? getTimeRemaining(competition.endDate)
                : null;
                
              return (
                <Grid item xs={12} sm={6} md={4} key={competition.id}>
                  <MotionCard
                    whileHover={{ 
                      y: -8,
                      boxShadow: isDark 
                        ? '0 14px 28px rgba(0,0,0,0.4)' 
                        : '0 14px 28px rgba(0,0,0,0.15)'
                    }}
                    transition={{ duration: 0.3 }}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      boxShadow: isDark 
                        ? '0 8px 16px rgba(0,0,0,0.3)' 
                        : '0 8px 16px rgba(0,0,0,0.08)',
                      backgroundColor: isDark 
                        ? 'rgba(30, 28, 28, 0.7)' 
                        : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {/* Card Top Section with Image */}
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        sx={{
                          height: '140px',
                          width: '100%',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          component="img"
                          src={competition.bannerImage}
                          alt={competition.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                      
                      {/* Status Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                        }}
                      >
                        <Chip 
                          label={getStatusInfo(competition.status).label} 
                          color={getStatusInfo(competition.status).color}
                          size="small"
                          icon={getStatusInfo(competition.status).icon}
                          sx={{ 
                            fontWeight: 600,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                      
                      {/* Difficulty Badge */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                        }}
                      >
                        <Chip 
                          label={competition.difficulty} 
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            bgcolor: getDifficultyColor(competition.difficulty),
                            color: 'white',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                      
                      {/* Registration Status */}
                      {isRegistered && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            bgcolor: theme.palette.success.dark,
                            color: 'white',
                            py: 0.5,
                            textAlign: 'center',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                          }}
                        >
                          {competition.status === 'active' ? "You're Participating" : "You Participated"}
                        </Box>
                      )}
                    </Box>
                    
                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Title & Categories */}
                      <Box sx={{ mb: 2 }}>
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 700,
                            mb: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.3,
                          }}
                        >
                          {competition.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {competition.categories.slice(0, 2).map((category, i) => (
                            <Chip
                              key={i}
                              label={category}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontWeight: 500,
                                fontSize: '0.65rem',
                                height: '20px',
                              }}
                            />
                          ))}
                          {competition.categories.length > 2 && (
                            <Chip
                              label={`+${competition.categories.length - 2}`}
                              size="small"
                              sx={{ 
                                fontWeight: 500,
                                fontSize: '0.65rem',
                                height: '20px',
                                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                      
                      {/* Competition Info */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarToday sx={{ fontSize: '0.9rem', mr: 1.5, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(competition.startDate).split(',')[0]}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Group sx={{ fontSize: '0.9rem', mr: 1.5, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" color="textSecondary">
                            {competition.participants}/{competition.maxParticipants} Participants
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTime sx={{ fontSize: '0.9rem', mr: 1.5, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" color="textSecondary">
                            7-Day Challenge
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Module Icons */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        {competition.modules.slice(0, 3).map((module, i) => (
                          <Chip
                            key={i}
                            label={module}
                            size="small"
                            sx={{ 
                              fontWeight: 500,
                              fontSize: '0.7rem',
                            }}
                          />
                        ))}
                      </Box>
                      
                      <Box sx={{ flexGrow: 1 }} />
                      
                      {/* Active Competition Timer or Registration Status */}
                      {competition.status === 'active' && timeRemaining && (
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="textSecondary">
                              Time Remaining:
                            </Typography>
                            <Typography variant="caption" fontWeight={600} color="error">
                              {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={75} 
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: theme.palette.error.main,
                              }
                            }}
                          />
                        </Box>
                      )}
                      
                      {/* Completed Competition Rank */}
                      {competition.status === 'completed' && isRegistered && (
                        <Paper
                          elevation={0}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1.5,
                            pl: 2,
                            borderRadius: 2,
                            mb: 2,
                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              Your Rank: #{userRegistration.rank}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Final Score: {userRegistration.finalScore}
                            </Typography>
                          </Box>
                          
                          <EmojiEvents 
                            sx={{ 
                              color: userRegistration.rank <= 3 ? '#FFD700' : 'inherit',
                              fontSize: '1.5rem'
                            }} 
                          />
                        </Paper>
                      )}
                      
                      {/* Active Competition Progress */}
                      {competition.status === 'active' && isRegistered && (
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            mb: 2,
                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                          }}
                        >
                            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                                Your Progress
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={userRegistration.progress}
                                sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: theme.palette.primary.main,
                                }
                                }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                <Typography variant="caption" color="textSecondary">
                                    {userRegistration.progress}% Completed
                                </Typography>
                                <Typography variant="caption" fontWeight={600} color="primary">
                                    {userRegistration.modulesCompleted}/{competition.modules.length} Modules
                                </Typography>
                            </Box>
                        </Paper>
                        )}
                    </CardContent>
                    <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<InfoOutlined />}
                        onClick={() => navigate(`/competitions/${competition.id}`)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                          }
                        }}
                      >
                        View Details
                      </Button>
                      
                      {isRegistered ? (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          startIcon={<CheckCircle />}
                          onClick={() => navigate(`/competitions/${competition.id}/dashboard`)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            backgroundColor: theme.palette.success.main,
                            '&:hover': {
                              backgroundColor: theme.palette.success.dark,
                            }
                          }}
                        >
                          Go to Dashboard
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          startIcon={<Star />}
                          onClick={() => navigate(`/competitions/${competition.id}/register`)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark,
                            }
                          }}
                        >
                          Register Now
                        </Button>
                      )}
                    </CardActions>
                    </MotionCard>
                    </Grid>
                );
            }
        )}
        </Grid>
        </Container>
        </Box>
      
      </>
      )}
       export default CompetitionPage;
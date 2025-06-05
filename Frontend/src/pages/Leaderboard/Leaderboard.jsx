import React, { useRef, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowDropDown,
  AutoAwesome,
  BarChart,
  Code,
  EmojiEvents,
  FilterList,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowUp,
  Language,
  MoreVert,
  People,
  PeopleAlt,
  Person,
  Search,
  Share,
  Star,
  StarOutline,
  Timeline,
  TrendingUp,
  Verified,
  Visibility,
  WorkspacePremium,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Current date and user info
const CURRENT_DATE_TIME = "2025-06-04 23:04:30";
const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

// Sample leaderboard data
const leaderboardData = [
  {
    rank: 1,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    username: 'techmaster_93',
    name: 'David Chen',
    country: 'Singapore',
    countryCode: 'SG',
    score: 9845,
    completionRate: 100,
    efficiency: 98,
    verified: true,
    badges: ['contest_winner', 'top_contributor', 'algorithm_master'],
    trend: 'stable',
    percentile: 99.9,
    contests: 27,
    wins: 8,
    languages: ['Python', 'C++', 'JavaScript'],
    lastActive: '2025-06-04 12:31:22',
    company: 'Google',
  },
  {
    rank: 2,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    username: 'codeartisan',
    name: 'Emma Wilson',
    country: 'United States',
    countryCode: 'US',
    score: 9812,
    completionRate: 100,
    efficiency: 97,
    verified: true,
    badges: ['top_contributor', 'algorithm_master'],
    trend: 'up',
    percentile: 99.8,
    contests: 23,
    wins: 5,
    languages: ['Java', 'C#', 'TypeScript'],
    lastActive: '2025-06-04 08:17:35',
    company: 'Microsoft',
  },
  {
    rank: 3,
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    username: 'devninja',
    name: 'Raj Patel',
    country: 'India',
    countryCode: 'IN',
    score: 9756,
    completionRate: 98,
    efficiency: 95,
    verified: true,
    badges: ['algorithm_master', 'frontend_expert'],
    trend: 'up',
    percentile: 99.7,
    contests: 19,
    wins: 4,
    languages: ['JavaScript', 'TypeScript', 'Python'],
    lastActive: '2025-06-04 14:22:07',
    company: 'Amazon',
  },
  {
    rank: 4,
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    username: 'codepoet',
    name: 'Sophia Rodriguez',
    country: 'Spain',
    countryCode: 'ES',
    score: 9701,
    completionRate: 100,
    efficiency: 96,
    verified: true,
    badges: ['ml_specialist', 'top_contributor'],
    trend: 'stable',
    percentile: 99.5,
    contests: 22,
    wins: 3,
    languages: ['Python', 'R', 'JavaScript'],
    lastActive: '2025-06-03 23:51:45',
    company: 'Netflix',
  },
  {
    rank: 5,
    avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
    username: 'algoking',
    name: 'Jun Kim',
    country: 'South Korea',
    countryCode: 'KR',
    score: 9684,
    completionRate: 99,
    efficiency: 98,
    verified: true,
    badges: ['backend_expert', 'database_guru'],
    trend: 'up',
    percentile: 99.4,
    contests: 25,
    wins: 5,
    languages: ['C++', 'Go', 'Rust'],
    lastActive: '2025-06-04 17:08:13',
    company: 'Samsung',
  },
  {
    rank: 6,
    avatar: 'https://randomuser.me/api/portraits/women/15.jpg',
    username: 'bytewizard',
    name: 'Olivia Taylor',
    country: 'Canada',
    countryCode: 'CA',
    score: 9629,
    completionRate: 98,
    efficiency: 94,
    verified: true,
    badges: ['ux_designer', 'frontend_expert'],
    trend: 'down',
    percentile: 99.3,
    contests: 18,
    wins: 2,
    languages: ['JavaScript', 'React', 'CSS'],
    lastActive: '2025-06-04 09:42:30',
    company: 'Shopify',
  },
  {
    rank: 7,
    avatar: 'https://randomuser.me/api/portraits/men/92.jpg',
    username: 'codesage',
    name: 'Alexander Wang',
    country: 'Australia',
    countryCode: 'AU',
    score: 9587,
    completionRate: 97,
    efficiency: 93,
    verified: true,
    badges: ['backend_expert', 'cloud_architect'],
    trend: 'up',
    percentile: 99.1,
    contests: 20,
    wins: 3,
    languages: ['Python', 'Java', 'AWS'],
    lastActive: '2025-06-04 05:24:51',
    company: 'Atlassian',
  },
  {
    rank: 8,
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    username: 'quantumcoder',
    name: 'Aisha Mahmood',
    country: 'UAE',
    countryCode: 'AE',
    score: 9553,
    completionRate: 99,
    efficiency: 95,
    verified: true,
    badges: ['algorithm_master', 'contest_winner'],
    trend: 'stable',
    percentile: 98.9,
    contests: 21,
    wins: 3,
    languages: ['Java', 'Kotlin', 'C++'],
    lastActive: '2025-06-04 11:17:42',
    company: 'Oracle',
  },
  {
    rank: 9,
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
    username: 'pixelperfect',
    name: 'Luca Rossi',
    country: 'Italy',
    countryCode: 'IT',
    score: 9524,
    completionRate: 97,
    efficiency: 92,
    verified: true,
    badges: ['ui_expert', 'frontend_expert'],
    trend: 'stable',
    percentile: 98.7,
    contests: 17,
    wins: 1,
    languages: ['JavaScript', 'Vue', 'CSS'],
    lastActive: '2025-06-03 16:08:35',
    company: 'Spotify',
  },
  {
    rank: 10,
    avatar: 'https://randomuser.me/api/portraits/women/54.jpg',
    username: 'Anuj-prajapati-SDE',
    name: 'Anuj Prajapati',
    country: 'India',
    countryCode: 'IN',
    score: 9498,
    completionRate: 96,
    efficiency: 94,
    verified: true,
    badges: ['backend_expert', 'database_guru'],
    trend: 'up',
    percentile: 98.5,
    contests: 19,
    wins: 2,
    languages: ['Java', 'Spring', 'PostgreSQL'],
    lastActive: '2025-06-04 22:52:10',
    company: 'Adobe',
  },
  {
    rank: 11,
    avatar: 'https://randomuser.me/api/portraits/men/57.jpg',
    username: 'cloudcrafter',
    name: 'Thomas Schmidt',
    country: 'Germany',
    countryCode: 'DE',
    score: 9462,
    completionRate: 96,
    efficiency: 93,
    verified: true,
    badges: ['devops_expert', 'cloud_architect'],
    trend: 'down',
    percentile: 98.2,
    contests: 18,
    wins: 1,
    languages: ['Python', 'AWS', 'Docker'],
    lastActive: '2025-06-04 06:15:22',
    company: 'SAP',
  },
  {
    rank: 12,
    avatar: 'https://randomuser.me/api/portraits/women/62.jpg',
    username: 'codehawk',
    name: 'Zoe Bennett',
    country: 'United Kingdom',
    countryCode: 'GB',
    score: 9437,
    completionRate: 95,
    efficiency: 91,
    verified: true,
    badges: ['security_expert', 'backend_expert'],
    trend: 'stable',
    percentile: 97.9,
    contests: 16,
    wins: 1,
    languages: ['Python', 'Go', 'C'],
    lastActive: '2025-06-04 13:33:47',
    company: 'Deloitte',
  },
];

// Badge information
const badgeInfo = {
  contest_winner: { color: '#FFD700', label: 'Contest Winner', icon: <EmojiEvents fontSize="small" /> },
  top_contributor: { color: '#9c27b0', label: 'Top Contributor', icon: <StarOutline fontSize="small" /> },
  algorithm_master: { color: '#2196f3', label: 'Algorithm Master', icon: <BarChart fontSize="small" /> },
  frontend_expert: { color: '#ff9800', label: 'Frontend Expert', icon: <Visibility fontSize="small" /> },
  backend_expert: { color: '#4caf50', label: 'Backend Expert', icon: <TrendingUp fontSize="small" /> },
  database_guru: { color: '#607d8b', label: 'Database Guru', icon: <Timeline fontSize="small" /> },
  ml_specialist: { color: '#e91e63', label: 'ML Specialist', icon: <Timeline fontSize="small" /> },
  ux_designer: { color: '#009688', label: 'UX Designer', icon: <Visibility fontSize="small" /> },
  cloud_architect: { color: '#3f51b5', label: 'Cloud Architect', icon: <BarChart fontSize="small" /> },
  devops_expert: { color: '#795548', label: 'DevOps Expert', icon: <TrendingUp fontSize="small" /> },
  security_expert: { color: '#f44336', label: 'Security Expert', icon: <Timeline fontSize="small" /> },
};

// Trophy glint animation
const glint = keyframes`
  0% {
    background-position: -500px 0;
  }
  100% {
    background-position: 500px 0;
  }
`;

const LeaderboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  
  // Refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // State
  const [competitionFilter, setCompetitionFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedUser, setExpandedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Current user data
  const currentUser = leaderboardData.find(user => user.username === CURRENT_USER) || leaderboardData[9]; // Default to 10th position
  
  // Handling pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  // Get trend icon and color
  const getTrendInfo = (trend) => {
    switch(trend) {
      case 'up':
        return { 
          icon: <KeyboardDoubleArrowUp fontSize="small" sx={{ transform: 'rotate(45deg)' }} />, 
          color: theme.palette.success.main 
        };
      case 'down':
        return { 
          icon: <KeyboardDoubleArrowUp fontSize="small" sx={{ transform: 'rotate(-135deg)' }} />, 
          color: theme.palette.error.main 
        };
      default:
        return { 
          icon: <KeyboardArrowRight fontSize="small" />, 
          color: theme.palette.info.main 
        };
    }
  };
  
  // Get badge with tooltip
  const getBadge = (badgeType) => {
    const badge = badgeInfo[badgeType];
    if (!badge) return null;
    
    return (
      <Tooltip title={badge.label} key={badgeType}>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            bgcolor: `${badge.color}20`,
            color: badge.color,
          }}
        >
          {badge.icon}
        </Avatar>
      </Tooltip>
    );
  };
  
  // Filter data based on search term
  const filteredData = leaderboardData.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          pb: { xs: '60px', sm: '80px', md: '60px' },
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
                  label="GLOBAL RANKINGS" 
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
                    Leaderboard
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
                  Top performers from coding competitions around the world
                </MotionTypography>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Top Performers Section */}
      <Box
        component="section"
        sx={{ 
          position: 'relative',
          mb: 10,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Top 3 Featured */}
            {leaderboardData.slice(0, 3).map((user, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  sx={{
                    borderRadius: '20px',
                    overflow: 'visible',
                    height: '100%',
                    backgroundColor: isDark 
                      ? 'rgba(30, 28, 28, 0.7)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    position: 'relative',
                  }}
                >
                  {/* Trophy for Top 3 */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -30,
                      left: 'calc(50% - 30px)',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: index === 0 
                        ? 'linear-gradient(45deg, #FFD700, #FFC400)' 
                        : index === 1 
                          ? 'linear-gradient(45deg, #C0C0C0, #E0E0E0)' 
                          : 'linear-gradient(45deg, #CD7F32, #B87333)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      zIndex: 2,
                      border: '4px solid',
                      borderColor: isDark ? '#121212' : 'white',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
                        backgroundSize: '1000px 100%',
                        animation: `${glint} 2s infinite linear`,
                        zIndex: -1,
                      },
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      component="span" 
                      sx={{ 
                        fontWeight: 800,
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      {index + 1}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ pt: 5, pb: 3, px: 3, textAlign: 'center' }}>
                    {/* User Avatar */}
                    <Box sx={{ mb: 2 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Box
                            component="img"
                            src={`https://flagcdn.com/w20/${user.countryCode.toLowerCase()}.png`}
                            alt={user.country}
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              border: '2px solid',
                              borderColor: isDark ? '#121212' : 'white',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            }}
                          />
                        }
                      >
                        <Avatar
                          src={user.avatar}
                          alt={user.name}
                          sx={{
                            width: 80,
                            height: 80,
                            border: '3px solid',
                            borderColor: index === 0 
                              ? '#FFD700' 
                              : index === 1 
                                ? '#C0C0C0' 
                                : '#CD7F32',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                          }}
                        />
                      </Badge>
                    </Box>
                    
                    {/* User Info */}
                    <Box sx={{ mb: 2 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                        }}
                      >
                        {user.name}
                        {user.verified && (
                          <Verified 
                            sx={{ 
                              fontSize: '1rem',
                              color: theme.palette.primary.main,
                              verticalAlign: 'middle',
                            }} 
                          />
                        )}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="textSecondary"
                      >
                        @{user.username}
                      </Typography>
                      
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block',
                          mt: 0.5
                        }}
                      >
                        {user.company}
                      </Typography>
                    </Box>
                    
                    {/* Score Section */}
                    <Box
                      sx={{
                        bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                        p: 2,
                        borderRadius: '12px',
                        mb: 2,
                      }}
                    >
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800,
                          color: index === 0 
                            ? '#FFD700' 
                            : index === 1 
                              ? '#C0C0C0' 
                              : '#CD7F32',
                          mb: 1,
                        }}
                      >
                        {user.score.toLocaleString()}
                      </Typography>
                      
                      <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                        Top {user.percentile}% of all participants
                      </Typography>
                      
                      <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                          <Typography variant="overline" display="block" sx={{ fontSize: '0.6rem' }}>
                            Contests Won
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {user.wins}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="overline" display="block" sx={{ fontSize: '0.6rem' }}>
                            Total Contests
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {user.contests}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    
                    {/* Badges */}
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                      {user.badges.map((badge) => getBadge(badge))}
                    </Box>
                    
                    {/* Languages */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                      {user.languages.map((language, i) => (
                        <Chip
                          key={i}
                          label={language}
                          size="small"
                          sx={{
                            fontSize: '0.7rem',
                            height: '22px',
                            bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* User's Position Section */}
      {currentUser && (
        <Box component="section" sx={{ mb: 6 }}>
          <Container maxWidth="lg">
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              sx={{
                p: 0,
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: isDark 
                  ? 'rgba(35, 33, 33, 0.7)' 
                  : 'rgba(245, 245, 245, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: theme.palette.gradients.primary,
                }}
              />
              
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} sm={7} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 800, 
                          minWidth: 40,
                          color: theme.palette.primary.main 
                        }}
                      >
                        #{currentUser.rank}
                      </Typography>
                      
                      <Avatar
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        sx={{
                          width: 50,
                          height: 50,
                          ml: 2,
                          mr: 3,
                          border: '2px solid',
                          borderColor: theme.palette.primary.main,
                        }}
                      />
                      
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6" fontWeight={700}>
                            {currentUser.name}
                          </Typography>
                          
                          <Tooltip title={currentUser.country}>
                            <Box
                              component="img"
                              src={`https://flagcdn.com/w20/${currentUser.countryCode.toLowerCase()}.png`}
                              alt={currentUser.country}
                              sx={{
                                width: 20,
                                height: 15,
                                objectFit: 'cover',
                                borderRadius: '2px',
                                ml: 1,
                              }}
                            />
                          </Tooltip>
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary">
                          @{currentUser.username} • {currentUser.company}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={5} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 3 }}>
                      <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                        <Typography variant="body2" color="textSecondary">
                          Your Score
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {currentUser.score.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: '30px',
                          textTransform: 'none',
                          background: theme.palette.gradients.primary,
                          px: 2,
                          py: 1,
                        }}
                      >
                        View Profile
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </MotionPaper>
          </Container>
        </Box>
      )}
      
      {/* Leaderboard Table Section */}
      <Box component="section" sx={{ mb: 8 }}>
        <Container maxWidth="lg">
          {/* Filters & Search */}
          <Grid 
            container 
            spacing={3} 
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Grid item xs={12} md={6}>
              <TextField
                placeholder="Search users, countries..."
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                    '& fieldset': { border: 'none' },
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl 
                  fullWidth 
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                      '& fieldset': { border: 'none' },
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  <Select
                    value={competitionFilter}
                    onChange={(e) => setCompetitionFilter(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterList fontSize="small" color="action" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="all">All Competitions</MenuItem>
                    <MenuItem value="recent">Recent Challenges</MenuItem>
                    <MenuItem value="hackathon">Hackathons</MenuItem>
                    <MenuItem value="weekly">Weekly Contests</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl 
                  fullWidth 
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                      '& fieldset': { border: 'none' },
                      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                    }
                  }}
                >
                  <Select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    displayEmpty
                    startAdornment={
                      <InputAdornment position="start">
                        <Language fontSize="small" color="action" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="all">Global Rankings</MenuItem>
                    <MenuItem value="country">By Country</MenuItem>
                    <MenuItem value="region">By Region</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </Grid>
          
          {/* Leaderboard Table */}
          <MotionPaper
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              backgroundColor: isDark 
                ? 'rgba(30, 28, 28, 0.7)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              boxShadow: isDark 
                ? '0 10px 40px rgba(0, 0, 0, 0.3)' 
                : '0 10px 40px rgba(0, 0, 0, 0.06)',
            }}
          >
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)',
                      '& th': {
                        fontWeight: 700,
                        py: 2,
                      }
                    }}
                  >
                    <TableCell align="center" sx={{ width: 70 }}>Rank</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell align="center">Score</TableCell>
                    <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Contests</TableCell>
                    <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Win Rate</TableCell>
                    <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Badges</TableCell>
                    <TableCell align="center" sx={{ width: 60 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                
                <TableBody>
                  {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => {
                    const isCurrentUser = user.username === CURRENT_USER;
                    const isExpanded = expandedUser === user.username;
                    const trendInfo = getTrendInfo(user.trend);
                    const winRate = Math.round((user.wins / user.contests) * 100);
                    
                    return (
                      <React.Fragment key={user.rank}>
                        <TableRow
                          hover
                          sx={{
                            bgcolor: isCurrentUser 
                              ? (isDark ? 'rgba(188, 64, 55, 0.1)' : 'rgba(188, 64, 55, 0.05)') 
                              : 'transparent',
                            '& td': { 
                              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            },
                            cursor: 'pointer',
                          }}
                          onClick={() => setExpandedUser(isExpanded ? null : user.username)}
                        >
                          <TableCell align="center">
                            <Box sx={{ 
                              fontWeight: 800,
                              color: user.rank <= 3 
                                ? user.rank === 1 
                                  ? '#FFD700' 
                                  : user.rank === 2 
                                    ? '#C0C0C0' 
                                    : '#CD7F32'
                                : 'inherit',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 0.5,
                            }}>
                              {user.rank}
                              <Box 
                                sx={{ 
                                  color: trendInfo.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                {trendInfo.icon}
                              </Box>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                  <Box
                                    component="img"
                                    src={`https://flagcdn.com/w20/${user.countryCode.toLowerCase()}.png`}
                                    alt={user.country}
                                    sx={{
                                      width: 16,
                                      height: 16,
                                      borderRadius: '50%',
                                      border: '1px solid',
                                      borderColor: isDark ? '#121212' : 'white',
                                      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                    }}
                                  />
                                }
                              >
                                <Avatar
                                  src={user.avatar}
                                  alt={user.name}
                                  sx={{ 
                                    width: 40,
                                    height: 40,
                                    mr: 2,
                                    border: isCurrentUser 
                                      ? `2px solid ${theme.palette.primary.main}` 
                                      : 'none',
                                  }}
                                />
                              </Badge>
                              
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="subtitle2" fontWeight={600}>
                                    {user.name}
                                  </Typography>
                                  
                                  {user.verified && (
                                    <Verified 
                                      sx={{ 
                                        fontSize: '0.85rem',
                                        color: theme.palette.primary.main,
                                        ml: 0.5,
                                      }} 
                                    />
                                  )}
                                </Box>
                                
                                <Typography variant="caption" color="textSecondary">
                                  @{user.username}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={700}>
                              {user.score.toLocaleString()}
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                            <Typography variant="body2">
                              {user.contests}
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={winRate}
                                sx={{
                                  width: 60,
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: winRate > 30 
                                      ? theme.palette.success.main 
                                      : winRate > 15 
                                        ? theme.palette.warning.main 
                                        : theme.palette.error.main,
                                  }
                                }}
                              />
                              <Typography variant="caption">
                                {winRate}%
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                            <AvatarGroup
                              max={3}
                              sx={{
                                justifyContent: 'center',
                                '& .MuiAvatar-root': {
                                  width: 24,
                                  height: 24,
                                  fontSize: '0.75rem',
                                },
                              }}
                            >
                              {user.badges.map((badge, i) => getBadge(badge))}
                            </AvatarGroup>
                          </TableCell>
                          
                          <TableCell align="center">
                            <IconButton size="small">
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        
                        {/* Expanded User Details */}
                        {isExpanded && (
                          <TableRow
                            sx={{
                              bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.015)',
                              '& td': { 
                                py: 2,
                                px: 3,
                                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                              },
                            }}
                          >
                            <TableCell colSpan={7}>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                  <Typography variant="overline" color="textSecondary" display="block">
                                    Performance Metrics
                                  </Typography>
                                  
                                  <Stack spacing={1} sx={{ mt: 1 }}>
                                    <Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" color="textSecondary">
                                          Completion Rate
                                        </Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                          {user.completionRate}%
                                        </Typography>
                                      </Box>
                                      <LinearProgress
                                        variant="determinate"
                                        value={user.completionRate}
                                        sx={{
                                          height: 6,
                                          borderRadius: 3,
                                          bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                                          '& .MuiLinearProgress-bar': {
                                            bgcolor: theme.palette.primary.main,
                                          }
                                        }}
                                      />
                                    </Box>
                                    
                                    <Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" color="textSecondary">
                                          Code Efficiency
                                        </Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                          {user.efficiency}%
                                        </Typography>
                                      </Box>
                                      <LinearProgress
                                        variant="determinate"
                                        value={user.efficiency}
                                        sx={{
                                          height: 6,
                                          borderRadius: 3,
                                          bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                                          '& .MuiLinearProgress-bar': {
                                            bgcolor: theme.palette.info.main,
                                          }
                                        }}
                                      />
                                    </Box>
                                    
                                    <Box>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" color="textSecondary">
                                          Win Rate
                                        </Typography>
                                        <Typography variant="caption" fontWeight={600}>
                                          {winRate}%
                                        </Typography>
                                      </Box>
                                      <LinearProgress
                                        variant="determinate"
                                        value={winRate}
                                        sx={{
                                          height: 6,
                                          borderRadius: 3,
                                          bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                                          '& .MuiLinearProgress-bar': {
                                            bgcolor: theme.palette.success.main,
                                          }
                                        }}
                                      />
                                    </Box>
                                  </Stack>
                                </Grid>
                                
                                <Grid item xs={12} sm={6} md={4}>
                                  <Typography variant="overline" color="textSecondary" display="block">
                                    Preferred Languages
                                  </Typography>
                                  
                                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {user.languages.map((language, i) => (
                                      <Chip
                                        key={i}
                                        label={language}
                                        size="small"
                                        sx={{
                                          fontSize: '0.7rem',
                                        }}
                                      />
                                    ))}
                                  </Box>
                                  
                                  <Typography variant="overline" color="textSecondary" display="block" sx={{ mt: 2 }}>
                                    Last Active
                                  </Typography>
                                  <Typography variant="body2">
                                    {new Date(user.lastActive).toLocaleString()}
                                  </Typography>
                                </Grid>
                                
                                <Grid item xs={12} md={4}>
                                  <Typography variant="overline" color="textSecondary" display="block">
                                    Achievements
                                  </Typography>
                                  
                                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {user.badges.map((badge) => (
                                      <Chip
                                        key={badge}
                                        label={badgeInfo[badge].label}
                                        size="small"
                                        icon={badgeInfo[badge].icon}
                                        sx={{
                                          bgcolor: `${badgeInfo[badge].color}20`,
                                          color: badgeInfo[badge].color,
                                          borderColor: badgeInfo[badge].color,
                                          fontSize: '0.7rem',
                                          '& .MuiChip-icon': {
                                            color: badgeInfo[badge].color,
                                          }
                                        }}
                                      />
                                    ))}
                                  </Box>
                                  
                                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                    <Button 
                                      variant="outlined"
                                      size="small"
                                      startIcon={<Person />}
                                      sx={{
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                      }}
                                    >
                                      Profile
                                    </Button>
                                    
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      startIcon={<Share />}
                                      sx={{
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                      }}
                                    >
                                      Share
                                    </Button>
                                  </Box>
                                </Grid>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Pagination */}
            <TablePagination
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </MotionPaper>
        </Container>
      </Box>
      
      {/* Statistics & Info Section */}
      <Box component="section" sx={{ mb: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Competition Info */}
            <Grid item xs={12} md={7}>
              <MotionPaper
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{
                  p: 4,
                  borderRadius: '20px',
                  backgroundColor: isDark 
                    ? 'rgba(30, 28, 28, 0.7)' 
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <WorkspacePremium
                    sx={{
                      fontSize: '2.5rem',
                      color: theme.palette.primary.main,
                      mr: 2,
                    }}
                  />
                  
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      About the Rankings
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Updated {new Date(CURRENT_DATE_TIME).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" paragraph>
                  The Code Quest Global Leaderboard showcases the top performers from our coding competitions worldwide. Rankings are based on a comprehensive scoring system that evaluates multiple aspects of programming proficiency.
                </Typography>
                
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Scoring Criteria:
                </Typography>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          minWidth: 36,
                          height: 36,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(244, 67, 54, 0.1)',
                          color: '#f44336',
                          mr: 2,
                          mt: 0.5,
                        }}
                      >
                        <TrendingUp fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Contest Performance
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Results from official competitions, weighted by difficulty and participation levels
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          minWidth: 36,
                          height: 36,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(33, 150, 243, 0.1)',
                          color: '#2196f3',
                          mr: 2,
                          mt: 0.5,
                        }}
                      >
                        <BarChart fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Code Quality
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Assessment of code efficiency, readability, and best practices
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          minWidth: 36,
                          height: 36,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4caf50',
                          mr: 2,
                          mt: 0.5,
                        }}
                      >
                        <Star fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Community Contributions
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Engagement in forums, mentoring, and open-source projects
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                 
              

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          minWidth: 36,
                          height: 36,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(255, 193, 7, 0.1)',
                          color: '#ffc107',
                          mr: 2,
                          mt: 0.5,
                        }}
                      >
                        <People fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Peer Reviews
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Feedback and ratings from fellow coders on submitted solutions
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          minWidth: 36,
                          height: 36,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(156, 39, 176, 0.1)',
                          color: '#9c27b0',
                          mr: 2,
                          mt: 0.5,
                        }}
                      >
                        <Code fontSize="small" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Innovation and Creativity
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Unique solutions and approaches to coding challenges
                        </Typography>
                      </Box>
                    </Box>

                  </Grid>
                </Grid>
                <Typography variant="body2" color="textSecondary">
                  Note: Rankings are updated weekly based on the latest competition results and community contributions.
                </Typography>
              </MotionPaper>
            </Grid>
            {/* Statistics Section */}

            <Grid item xs={12} md={5}>
              <MotionPaper
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                sx={{
                  p: 4,
                  borderRadius: '20px',
                  backgroundColor: isDark 
                    ? 'rgba(30, 28, 28, 0.7)' 
                    : 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  height: '100%',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <BarChart
                    sx={{
                      fontSize: '2.5rem',
                      color: theme.palette.primary.main,
                      mr: 2,
                    }}
                  />
                  
                  <Box>
                    <Typography variant="h5" fontWeight={700}>
                      Global Statistics
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Updated {new Date(CURRENT_DATE_TIME).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        <PeopleAlt />
                      </Avatar>
                      <Box>
                        {/* <Typography variant="h6" fontWeight={700}>
                          {totalUsers.toLocaleString()}
                        </Typography> */}
                        <Typography variant="body2" color="textSecondary">
                          Total Users
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.success.main,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        <Star />
                      </Avatar>
                      {/* <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {totalContests.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Total Contests
                        </Typography>
                      </Box> */}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.warning.main,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        <Code />
                      </Avatar>
                      <Box>
                        {/* <Typography variant="h6" fontWeight={700}>
                          {totalLanguages}
                        </Typography> */}
                        <Typography variant="body2" color="textSecondary">
                          Supported Languages
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.info.main,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        <TrendingUp />
                      </Avatar>
                      <Box>
                        {/* <Typography variant="h6" fontWeight={700}>
                          {totalChallenges.toLocaleString()}
                        </Typography> */}
                        <Typography variant="body2" color="textSecondary">
                          Total Challenges
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.error.main,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        <EmojiEvents />
                      </Avatar>
                      <Box>
                        {/* <Typography variant="h6" fontWeight={700}>
                          {totalBadges.toLocaleString()}
                        </Typography> */}
                        <Typography variant="body2" color="textSecondary">
                          Total Badges Earned
                        </Typography>
                      </Box>
                    </Box>

                  </Grid>
                </Grid>
              </MotionPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
export default LeaderboardPage;
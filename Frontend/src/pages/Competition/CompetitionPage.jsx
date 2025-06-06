import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  LinearProgress,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CardActions,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  AccessTime,
  AutoAwesome,
  CalendarToday,
  CheckCircle,
  Code,
  EmojiEvents,
  FilterList,
  Flag,
  Group,
  InfoOutlined,
  NavigateBefore,
  NavigateNext,
  Quiz,
  Star,
  Timer,
  TrendingUp,
  PlayArrow,
  Stop,
  Schedule,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';
import axios from 'axios';

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionCard = motion(Card);

const CompetitionPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';
  
  // Refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // State
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  // Fetch competitions from backend
  const fetchCompetitions = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/general/competitions/all`);
      
      if (response.data.success) {
        setCompetitions(response.data.data.competitions);
        setPagination(response.data.data.pagination);
        setError(null);
      } else {
        setError('Failed to fetch competitions');
      }
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  // Get competition status based on timing
  const getCompetitionStatus = (startTiming, endTiming, isLive) => {
    const now = new Date();
    const start = new Date(startTiming);
    const end = new Date(endTiming);
    
    if (isLive && now >= start && now <= end) {
      return { status: 'active', label: 'Live', color: 'success', icon: <PlayArrow /> };
    } else if (now < start) {
      return { status: 'upcoming', label: 'Upcoming', color: 'info', icon: <Schedule /> };
    } else if (now > end) {
      return { status: 'completed', label: 'Completed', color: 'default', icon: <Flag /> };
    } else {
      return { status: 'scheduled', label: 'Scheduled', color: 'warning', icon: <Timer /> };
    }
  };

  // Get competition type color
  const getTypeColor = (type) => {
    const colors = {
      'coding': theme.palette.primary.main,
      'quiz': theme.palette.secondary.main,
      'hackathon': theme.palette.error.main,
      'challenge': theme.palette.warning.main,
      'default': theme.palette.info.main,
    };
    return colors[type?.toLowerCase()] || colors.default;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate time remaining
  const getTimeRemaining = (endDate) => {
    const total = new Date(endDate) - new Date();
    if (total <= 0) return null;
    
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    
    return { days, hours, minutes };
  };

  // Filter handlers
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

  // Featured navigation
  const handleNextFeatured = () => {
    setFeaturedIndex((prev) => 
      prev === Math.min(competitions.length - 1, 2) ? 0 : prev + 1
    );
  };
  
  const handlePrevFeatured = () => {
    setFeaturedIndex((prev) => 
      prev === 0 ? Math.min(competitions.length - 1, 2) : prev - 1
    );
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

  // Filter competitions
  const filteredCompetitions = competitions.filter(competition => {
    const statusInfo = getCompetitionStatus(competition.startTiming, competition.endTiming, competition.isLive);
    
    if (filters.status !== 'all' && statusInfo.status !== filters.status) return false;
    if (filters.type !== 'all' && competition.competitionType !== filters.type) return false;
    
    return true;
  });

  // Animation keyframes
  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `;

  const featuredCompetitions = competitions.slice(0, 3);

  return (
    <>
      {/* Canvas Background */}
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
      
      {/* Page Header */}
      <Box component="section" sx={{ 
        position: 'relative',
        pt: { xs: '100px', sm: '120px', md: '120px' },
        pb: { xs: '40px', sm: '50px', md: '60px' },
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
                  label="COMPETE & WIN" 
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
                Code Quest
                <Box component="span" sx={{
                  display: 'block',
                  background: theme.palette.gradients?.primary || `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Competitions
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
                Challenge yourself, showcase your skills, and compete with the best developers from around the world
              </MotionTypography>
              
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
                    background: theme.palette.gradients?.primary || theme.palette.primary.main,
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
      {!loading && featuredCompetitions.length > 0 && (
        <Box component="section" sx={{ mb: 10, overflow: 'hidden' }}>
          <Container maxWidth="xl">
            <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Grid item xs>
                <Typography variant="h4" component="h2" sx={{ 
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1
                }}>
                  Featured 
                  <Box component="span" sx={{ color: theme.palette.primary.main }}>
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
                <IconButton onClick={handlePrevFeatured} sx={{
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  mr: 1,
                  '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                }}>
                  <NavigateBefore />
                </IconButton>
                
                <IconButton onClick={handleNextFeatured} sx={{
                  bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
                }}>
                  <NavigateNext />
                </IconButton>
              </Grid>
            </Grid>
            
            <AnimatePresence mode="wait">
              <MotionBox
                key={featuredCompetitions[featuredIndex]?.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                {featuredCompetitions[featuredIndex] && (
                  <Card sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: isDark ? '0 10px 40px rgba(0, 0, 0, 0.3)' : '0 10px 40px rgba(0, 0, 0, 0.1)',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    p: 4,
                  }}>
                    {/* Featured Competition Content */}
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={8}>
                        <Box sx={{ mb: 3 }}>
                          {(() => {
                            const statusInfo = getCompetitionStatus(
                              featuredCompetitions[featuredIndex].startTiming,
                              featuredCompetitions[featuredIndex].endTiming,
                              featuredCompetitions[featuredIndex].isLive
                            );
                            return (
                              <Chip 
                                label={statusInfo.label} 
                                color={statusInfo.color}
                                size="small"
                                icon={statusInfo.icon}
                                sx={{ fontWeight: 600, mb: 2 }}
                              />
                            );
                          })()}
                          
                          <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
                            {featuredCompetitions[featuredIndex].competitionName}
                          </Typography>
                          
                          <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
                            {featuredCompetitions[featuredIndex].competitionType}
                          </Typography>
                          
                          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                            {featuredCompetitions[featuredIndex].competitionDescription || 'Join this exciting competition and test your skills!'}
                          </Typography>
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={6} sm={3}>
                            <Paper elevation={0} sx={{
                              p: 2,
                              textAlign: 'center',
                              backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                              borderRadius: 2,
                            }}>
                              <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                                Questions
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {featuredCompetitions[featuredIndex].questionsCount}
                              </Typography>
                            </Paper>
                          </Grid>
                          
                          <Grid item xs={6} sm={3}>
                            <Paper elevation={0} sx={{
                              p: 2,
                              textAlign: 'center',
                              backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                              borderRadius: 2,
                            }}>
                              <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                                Duration
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {featuredCompetitions[featuredIndex].duration || 'N/A'}
                              </Typography>
                            </Paper>
                          </Grid>
                          
                          <Grid item xs={6} sm={3}>
                            <Paper elevation={0} sx={{
                              p: 2,
                              textAlign: 'center',
                              backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                              borderRadius: 2,
                            }}>
                              <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                                Type
                              </Typography>
                              <Typography variant="h6" sx={{ 
                                fontWeight: 700,
                                color: getTypeColor(featuredCompetitions[featuredIndex].competitionType)
                              }}>
                                {featuredCompetitions[featuredIndex].competitionType}
                              </Typography>
                            </Paper>
                          </Grid>
                          
                          <Grid item xs={6} sm={3}>
                            <Paper elevation={0} sx={{
                              p: 2,
                              textAlign: 'center',
                              backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                              borderRadius: 2,
                            }}>
                              <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                                Status
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                {featuredCompetitions[featuredIndex].isLive ? 'Live' : 'Scheduled'}
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column',
                          height: '100%',
                          justifyContent: 'space-between'
                        }}>
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                              Schedule:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <CalendarToday sx={{ fontSize: '0.9rem', mr: 1.5, color: theme.palette.text.secondary }} />
                              <Typography variant="body2" color="textSecondary">
                                Starts: {formatDate(featuredCompetitions[featuredIndex].startTiming)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Flag sx={{ fontSize: '0.9rem', mr: 1.5, color: theme.palette.text.secondary }} />
                              <Typography variant="body2" color="textSecondary">
                                Ends: {formatDate(featuredCompetitions[featuredIndex].endTiming)}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                            <Button
                              variant="outlined"
                              startIcon={<InfoOutlined />}
                              onClick={() => navigate(`/competitions/${featuredCompetitions[featuredIndex].id}`)}
                              sx={{
                                borderRadius: 2,
                                borderWidth: 2,
                                py: 1,
                                px: 3,
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': { borderWidth: 2 }
                              }}
                            >
                              View Details
                            </Button>
                            
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<Star />}
                              onClick={() => navigate(`/competitions/${featuredCompetitions[featuredIndex].id}/register`)}
                              sx={{
                                borderRadius: 2,
                                py: 1,
                                px: 3,
                                fontWeight: 600,
                                textTransform: 'none',
                                background: theme.palette.gradients?.primary || theme.palette.primary.main,
                              }}
                            >
                              Register Now
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                )}
              </MotionBox>
            </AnimatePresence>
          </Container>
        </Box>
      )}

      {/* All Competitions Section */}
      <Box component="section" sx={{ pb: 10 }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}>
            <Typography variant="h4" component="h2" fontWeight={700}>
              All Competitions
            </Typography>
            
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
                '&:hover': { borderWidth: 1 }
              }}
            >
              Filter
            </Button>
            
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
            >
              <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 600 }}>
                Status
              </Typography>
              {['all', 'active', 'upcoming', 'completed'].map((status) => (
                <MenuItem 
                  key={status}
                  onClick={() => handleFilterChange('status', status)}
                  selected={filters.status === status}
                >
                  <ListItemText>{status.charAt(0).toUpperCase() + status.slice(1)}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          {/* Loading State */}
          {loading && (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ borderRadius: 3, p: 3 }}>
                    <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
                    <Skeleton variant="text" height={30} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Skeleton variant="rounded" width={80} height={20} />
                      <Skeleton variant="rounded" width={60} height={20} />
                    </Box>
                    <Skeleton variant="rounded" height={36} />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* Error State */}
          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}
          
          {/* Competitions Grid */}
          {!loading && !error && (
            <Grid container spacing={3}>
              {filteredCompetitions.map((competition) => {
                const statusInfo = getCompetitionStatus(competition.startTiming, competition.endTiming, competition.isLive);
                const timeRemaining = statusInfo.status === 'active' ? getTimeRemaining(competition.endTiming) : null;
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={competition.id || competition._id}>
                    <MotionCard
                      whileHover={{ 
                        y: -8,
                        boxShadow: isDark ? '0 14px 28px rgba(0,0,0,0.4)' : '0 14px 28px rgba(0,0,0,0.15)'
                      }}
                      transition={{ duration: 0.3 }}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        boxShadow: isDark ? '0 8px 16px rgba(0,0,0,0.3)' : '0 8px 16px rgba(0,0,0,0.08)',
                        backgroundColor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {/* Premium Header with Gradient */}
                      <Box sx={{
                        height: '80px',
                        background: `linear-gradient(135deg, ${getTypeColor(competition.competitionType)}, ${getTypeColor(competition.competitionType)}40)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 3,
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>
                            {competition.competitionType}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {competition.questionsCount} Questions
                          </Typography>
                        </Box>
                        
                        <Avatar sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)',
                        }}>
                          {competition.competitionType === 'quiz' ? <Quiz /> : <Code />}
                        </Avatar>
                        
                        {/* Decorative Elements */}
                        <Box sx={{
                          position: 'absolute',
                          top: -20,
                          right: -20,
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.1)',
                        }} />
                      </Box>
                      
                      <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Status Badge */}
                        <Box sx={{ mb: 2 }}>
                          <Chip 
                            label={statusInfo.label} 
                            color={statusInfo.color}
                            size="small"
                            icon={statusInfo.icon}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        
                        {/* Title */}
                        <Typography variant="h6" component="h3" sx={{ 
                          fontWeight: 700,
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.3,
                        }}>
                          {competition.competitionName}
                        </Typography>
                        
                        {/* Description */}
                        <Typography variant="body2" color="textSecondary" sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {competition.competitionDescription || 'Test your skills in this exciting competition!'}
                        </Typography>
                        
                        {/* Competition Info */}
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday sx={{ fontSize: '0.9rem', mr: 1.5, color: theme.palette.text.secondary }} />
                            <Typography variant="body2" color="textSecondary">
                              {formatDate(competition.startTiming)}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccessTime sx={{ fontSize: '0.9rem', mr: 1.5, color: theme.palette.text.secondary }} />
                            <Typography variant="body2" color="textSecondary">
                              Duration: {competition.duration || 'Not specified'}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Quiz sx={{ fontSize: '0.9rem', mr: 1.5, color: theme.palette.text.secondary }} />
                            <Typography variant="body2" color="textSecondary">
                              {competition.questionsCount} Questions
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }} />
                        
                        {/* Active Competition Timer */}
                        {timeRemaining && (
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
                              variant="indeterminate"
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
                      </CardContent>
                      
                      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<InfoOutlined />}
                          onClick={() => navigate(`/competitions/${competition.id || competition._id}`)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Details
                        </Button>
                        
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          startIcon={<Star />}
                          onClick={() => navigate(`/competitions/${competition.id || competition._id}/register`)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            background: theme.palette.gradients?.primary || theme.palette.primary.main,
                          }}
                        >
                          Register
                        </Button>
                      </CardActions>
                    </MotionCard>
                  </Grid>
                );
              })}
            </Grid>
          )}
          
          {/* Load More Button */}
          {!loading && pagination.page < pagination.pages && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => fetchCompetitions(pagination.page + 1)}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Load More Competitions
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default CompetitionPage;
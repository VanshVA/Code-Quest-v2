import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  IconButton,
  LinearProgress,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  Badge,
  Tooltip
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarIcon,
  AccessTime,
  VerifiedUser,
  CheckCircle,
  Speed,
  Star,
  Assignment,
  DonutLarge,
  BarChart,
  Refresh,
  ArrowUpward,
  Dashboard,
  Bookmark,
  BookmarkBorder,
  Notifications,
  Search,
  Person,
  Code,
  QuestionAnswer,
  History,
  WorkspacePremium,
  Bolt
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import dashboardService from '../../services/dashboardService';

// Current date and user info
const CURRENT_DATE_TIME = "2025-06-01 20:57:53";


// Create motion variants for animations
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

const DashboardHome = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkedCompetitions, setBookmarkedCompetitions] = useState([]);
  const [stats, setStats] = useState({
    competitions: {
      total: 0,
      completed: 0,
      inProgress: 0
    },
    performance: {
      averageScore: 0,
      bestScore: 0
    },
    recentCompetitions: [],
    upcomingCompetitions: [],
    competitionResults: []
  });

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5
      }
    })
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (custom) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: custom * 0.1,
        duration: 0.4,
        type: "spring",
        stiffness: 100
      }
    }),
    hover: {
      y: -8,
      boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    // Initialize some bookmarked competitions for demo
    setBookmarkedCompetitions(['comp123', 'comp456']);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardStatistics();
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to fetch dashboard statistics');
      }
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats().then(() => {
      setTimeout(() => setRefreshing(false), 800);
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  const toggleBookmark = (compId) => {
    if (bookmarkedCompetitions.includes(compId)) {
      setBookmarkedCompetitions(bookmarkedCompetitions.filter(id => id !== compId));
    } else {
      setBookmarkedCompetitions([...bookmarkedCompetitions, compId]);
    }
  };

  // Skeleton Loading Screen
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* User Info Bar Skeleton */}
          <Paper 
            elevation={2}
            sx={{ 
              p: 2, 
              mb: 3, 
              borderRadius: 2,
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'grey.300' }} />
              <Box>
                <Box sx={{ width: 150, height: 18, bgcolor: 'grey.300', borderRadius: 1, mb: 1 }} />
                <Box sx={{ width: 100, height: 14, bgcolor: 'grey.200', borderRadius: 1 }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ width: 180, height: 20, bgcolor: 'grey.200', borderRadius: 1 }} />
            </Box>
          </Paper>

          {/* Header Skeleton */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ width: '60%' }}>
              <Box sx={{ width: '40%', height: 32, bgcolor: 'grey.300', borderRadius: 1, mb: 1 }} />
              <Box sx={{ width: '70%', height: 20, bgcolor: 'grey.200', borderRadius: 1 }} />
            </Box>
            <Box sx={{ 
              width: 120, 
              height: 36, 
              bgcolor: 'grey.200', 
              borderRadius: 8,
            }} />
          </Box>
          
          {/* Stats Cards Skeleton */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <Card sx={{ height: 200, borderRadius: 4 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Box sx={{ width: '30%', height: 24, bgcolor: 'grey.300', borderRadius: 1 }} />
                      <Box sx={{ width: 24, height: 24, bgcolor: 'grey.300', borderRadius: '50%' }} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 4 }}>
                      {[1, 2, 3].map((subItem) => (
                        <Box key={subItem} sx={{ textAlign: 'center' }}>
                          <Box sx={{ width: 60, height: 40, bgcolor: 'grey.300', borderRadius: 1, mx: 'auto', mb: 1 }} />
                          <Box sx={{ width: 40, height: 16, bgcolor: 'grey.200', borderRadius: 1, mx: 'auto' }} />
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ mt: 3 }}>
                      <Box sx={{ width: '100%', height: 8, bgcolor: 'grey.200', borderRadius: 1 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Activity Cards Skeleton */}
          <Grid container spacing={3}>
            {[1, 2].map((item) => (
              <Grid item xs={12} md={6} key={item}>
                <Card sx={{ borderRadius: 4, height: 400 }}>
                  <CardContent>
                    <Box sx={{ width: '40%', height: 24, bgcolor: 'grey.300', borderRadius: 1, mb: 2 }} />
                    <Divider sx={{ mb: 2 }} />
                    
                    {[1, 2, 3].map((subItem) => (
                      <Box key={subItem} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ width: '60%', height: 20, bgcolor: 'grey.300', borderRadius: 1 }} />
                          <Box sx={{ width: 70, height: 24, bgcolor: 'grey.200', borderRadius: 10 }} />
                        </Box>
                        <Box sx={{ width: '40%', height: 16, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                        <Box sx={{ width: 100, height: 20, bgcolor: 'grey.200', borderRadius: 1 }} />
                      </Box>
                    ))}
                    
                    <Box sx={{ width: '100%', height: 36, bgcolor: 'grey.200', borderRadius: 1, mt: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 0 , }}>
       

        {/* Welcome Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          sx={{ mb: 4,bgcolor: isDark ? 'rgba(9, 9, 9, 0.67)' : 'primary.main', borderRadius: 2, p: 5, boxShadow: isDark ? '0 4px 14px rgba(0,0,0,0.2)' : 'none' }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                sx={{ 
                  mb: 1,
                  color: isDark ? ' #f47061' : ' white',
                  
                }}
              >
                Welcome to CodeQuest Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track your progress, join competitions, and improve your coding skills.
              </Typography>
              
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button 
                  variant="contained" 
                  startIcon={<Assignment />}
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                  }}
                  onClick={() => navigate('/student/competitions')}
                >
                  Browse Competitions
                </Button>
                
                <Button 
                  variant="outlined" 
                  startIcon={<Refresh />}
                  sx={{ 
                    borderRadius: 2, 
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                  }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh Stats'}
                </Button>
              </Stack>
            </Grid>
            
    
        
          </Grid>
        </MotionBox>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Competitions Stats */}
          <Grid item xs={12} md={4}>
            <MotionCard 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={0}
              elevation={3}
              sx={{ 
                borderRadius: '16px', 
                height: '100%',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  height: 6, 
                  width: '100%', 
                  bgcolor: theme.palette.primary.main,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                }}
              />
              
              <CardContent sx={{ p: 3, pt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Your Competitions
                  </Typography>
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: '12px',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <TrophyIcon color="primary" sx={{ fontSize: 28 }} />
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Track your competition progress
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        color="primary"
                        sx={{ 
                          fontSize: { xs: '1.5rem', md: '2rem' },
                          mb: 0.5
                        }}
                      >
                        {stats.competitions.total}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        <DonutLarge sx={{ fontSize: 12, mr: 0.5 }} />
                        Total
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        color="success.main" 
                        sx={{ 
                          fontSize: { xs: '1.5rem', md: '2rem' },
                          mb: 0.5
                        }}
                      >
                        {stats.competitions.completed}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        <CheckCircle sx={{ fontSize: 12, mr: 0.5 }} />
                        Done
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        color="info.main"
                        sx={{ 
                          fontSize: { xs: '1.5rem', md: '2rem' },
                          mb: 0.5
                        }}
                      >
                        {stats.competitions.inProgress}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        <TimerIcon sx={{ fontSize: 12, mr: 0.5 }} />
                        Active
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Progress indicator */}
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Completion rate
                    </Typography>
                    <Typography variant="caption" fontWeight={600} color="primary">
                      {stats.competitions.total > 0 
                        ? Math.round((stats.competitions.completed / stats.competitions.total) * 100)
                        : 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.competitions.total > 0 
                      ? (stats.competitions.completed / stats.competitions.total) * 100
                      : 0
                    } 
                    sx={{ 
                      height: 6, 
                      borderRadius: 1,
                      bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    }} 
                  />
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Performance Stats */}
          <Grid item xs={12} md={4}>
            <MotionCard 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={1}
              elevation={3}
              sx={{ 
                borderRadius: '16px', 
                height: '100%',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  height: 6, 
                  width: '100%', 
                  bgcolor: theme.palette.secondary.main,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                }}
              />
              
              <CardContent sx={{ p: 3, pt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Performance
                  </Typography>
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: '12px',
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    }}
                  >
                    <Speed color="secondary" sx={{ fontSize: 28 }} />
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Your competition scores and rankings
                </Typography>
                
                <Grid container spacing={4} sx={{ mt: 2, px: 2 }}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        color="secondary" 
                        sx={{ 
                          fontSize: { xs: '1.5rem', md: '2rem' },
                          mb: 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {Math.round(stats.performance.averageScore)}%
                        {stats.performance.averageScore > stats.performance.bestScore * 0.8 && (
                          <ArrowUpward color="success" sx={{ ml: 0.5, fontSize: '1rem' }} />
                        )}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        <BarChart sx={{ fontSize: 12, mr: 0.5 }} />
                        Average
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography 
                        variant="h4" 
                        fontWeight="bold" 
                        color="secondary" 
                        sx={{ 
                          fontSize: { xs: '1.5rem', md: '2rem' },
                          mb: 0.5
                        }}
                      >
                        {stats.performance.bestScore}%
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        <Star sx={{ fontSize: 12, mr: 0.5 }} />
                        Best
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Score indicator */}
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Performance level
                    </Typography>
                    <Typography 
                      variant="caption" 
                      fontWeight={600}
                      color={stats.performance.averageScore > 70 ? 'success.main' : 'warning.main'}
                    >
                      {stats.performance.averageScore > 70 ? 'Excellent' : 'Good'}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(stats.performance.averageScore, 100)} 
                    color={stats.performance.averageScore > 70 ? 'success' : 'warning'}
                    sx={{ 
                      height: 6, 
                      borderRadius: 1,
                      bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    }} 
                  />
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Next Competition */}
          <Grid item xs={12} md={4}>
            <MotionCard 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              custom={2}
              elevation={3}
              sx={{ 
                borderRadius: '16px', 
                height: '100%',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <Box 
                sx={{ 
                  height: 6, 
                  width: '100%', 
                  bgcolor: theme.palette.info.main,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                }}
              />
              
              <CardContent sx={{ p: 3, pt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Next Competition
                  </Typography>
                  <Box 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: '12px',
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                    }}
                  >
                    <TimerIcon color="info" sx={{ fontSize: 28 }} />
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Your upcoming coding challenge
                </Typography>
                
                {stats.upcomingCompetitions && stats.upcomingCompetitions.length > 0 ? (
                  <MotionBox
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.info.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                      }}
                    >
                      <Typography variant="h6" fontWeight={600} noWrap>
                        {stats.upcomingCompetitions[0].competitionName}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                        <CalendarIcon fontSize="small" color="info" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(stats.upcomingCompetitions[0].startTiming)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                        <Bolt fontSize="small" color="info" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          Duration: {stats.upcomingCompetitions[0].duration || 60} minutes
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', mt: 2, gap: 1 }}>
                        <Button 
                          variant="contained" 
                          color="info" 
                          sx={{ 
                            flexGrow: 1,
                            borderRadius: 2,
                            py: 1,
                            fontWeight: 600,
                            textTransform: 'none',
                            boxShadow: 'none'
                          }}
                          onClick={() => navigate(`/student/competitions/${stats.upcomingCompetitions[0]._id}`)}
                        >
                          View Details
                        </Button>
                        
                        <IconButton 
                          onClick={() => toggleBookmark(stats.upcomingCompetitions[0]._id)}
                          sx={{ 
                            color: bookmarkedCompetitions.includes(stats.upcomingCompetitions[0]._id) ? 'warning.main' : 'action.active',
                            bgcolor: isDark ? alpha(theme.palette.background.paper, 0.2) : alpha(theme.palette.background.paper, 0.4),
                          }}
                        >
                          {bookmarkedCompetitions.includes(stats.upcomingCompetitions[0]._id) ? 
                            <Bookmark /> : 
                            <BookmarkBorder />
                          }
                        </IconButton>
                      </Box>
                    </Paper>
                  </MotionBox>
                ) : (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      minHeight: '150px',
                      p: 2,
                      textAlign: 'center',
                      border: `1px dashed ${alpha(theme.palette.text.secondary, 0.2)}`,
                      borderRadius: 3
                    }}
                  >
                    <CalendarIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      No upcoming competitions
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ 
                        mt: 1.5,
                        borderRadius: 2,
                        textTransform: 'none'
                      }}
                      onClick={() => navigate('/student/competitions')}
                    >
                      Browse Competitions
                    </Button>
                  </Box>
                )}
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Recent and Upcoming Competitions */}
        <Grid container spacing={3}>
          {/* Recent Competitions */}
          <Grid item xs={12} md={6}>
            <MotionBox
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <Card 
                elevation={3}
                sx={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  height: '100%',
                  position: 'relative'
                }}
              >
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #3a47d5 0%, #00d2ff 100%)'
                  }}
                />
                
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Recent Activities
                    </Typography>
                    <IconButton 
                      size="small"
                      sx={{ 
                        bgcolor: isDark ? alpha(theme.palette.background.default, 0.3) : alpha(theme.palette.background.default, 0.5),
                      }}
                    >
                      <History fontSize="small" />
                    </IconButton>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  {stats.recentCompetitions && stats.recentCompetitions.length > 0 ? (
                    <Stack spacing={2}>
                      {stats.recentCompetitions.map((comp, index) => (
                        <Paper
                          key={comp._id.toString()}
                          elevation={0}
                          sx={{ 
                            p: 2, 
                            borderRadius: 3,
                            bgcolor: isDark ? alpha(theme.palette.background.paper, 0.3) : alpha(theme.palette.background.paper, 0.7),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            position: 'relative',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : alpha(theme.palette.background.paper, 0.9),
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ maxWidth: 'calc(100% - 90px)' }}>
                              <Typography 
                                variant="subtitle1" 
                                fontWeight={600} 
                                sx={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  wordBreak: 'break-word'
                                }}
                              >
                                {comp.competitionName}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <CalendarIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  Joined: {new Date(comp.joinedOn).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip 
                              label={comp.completed ? 'Completed' : 'In Progress'} 
                              color={comp.completed ? 'success' : 'warning'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                            {comp.score && (
                              <Chip
                                icon={<BarChart fontSize="small" />}
                                label={`Score: ${comp.score.percentage || 0}%`}
                                variant="outlined"
                                size="small"
                                color={
                                  (comp.score.percentage || 0) >= 70 ? 'success' : 
                                  (comp.score.percentage || 0) >= 40 ? 'primary' : 'default'
                                }
                              />
                            )}
                            
                            <Button
                              variant="text"
                              endIcon={<ArrowForwardIcon />}
                              size="small"
                              sx={{ 
                                color: theme.palette.primary.main, 
                                fontWeight: 600,
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.05)
                                }
                              }}
                              onClick={() => navigate(`/student/competitions/${comp._id}`)}
                            >
                              {comp.completed ? 'View Results' : 'Continue'}
                            </Button>
                          </Box>
                          
                          {/* Bookmark button */}
                          <IconButton 
                            size="small"
                            onClick={() => toggleBookmark(comp._id)}
                            sx={{ 
                              position: 'absolute', 
                              top: 8, 
                              right: 8,
                              color: bookmarkedCompetitions.includes(comp._id) ? 'warning.main' : 'action.active',
                            }}
                          >
                            {bookmarkedCompetitions.includes(comp._id) ? 
                              <Bookmark fontSize="small" /> : 
                              <BookmarkBorder fontSize="small" />
                            }
                          </IconButton>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: '200px',
                        textAlign: 'center',
                        border: `1px dashed ${alpha(theme.palette.text.secondary, 0.2)}`,
                        borderRadius: 3,
                        p: 3
                      }}
                    >
                      <Assignment sx={{ fontSize: 40, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        No recent activities
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Join a competition to get started on your coding journey
                      </Typography>
                    </Box>
                  )}
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ 
                      mt: 3,
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                    onClick={() => navigate('/student/competitions')}
                  >
                    View All Competitions
                  </Button>
                </CardContent>
              </Card>
            </MotionBox>
          </Grid>
          
          {/* Upcoming Competitions */}
          <Grid item xs={12} md={6}>
            <MotionBox
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={4}
            >
              <Card 
                elevation={3}
                sx={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  height: '100%',
                  position: 'relative'
                }}
              >
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: 'linear-gradient(90deg, #00d2ff 0%, #3a47d5 100%)'
                  }}
                />
                
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Upcoming Competitions
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                        UTC: {CURRENT_DATE_TIME}
                      </Typography>
                      <IconButton 
                        size="small"
                        sx={{ 
                          bgcolor: isDark ? alpha(theme.palette.background.default, 0.3) : alpha(theme.palette.background.default, 0.5),
                        }}
                      >
                        <CalendarIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  
                  {stats.upcomingCompetitions && stats.upcomingCompetitions.length > 0 ? (
                    <Stack spacing={2}>
                      {stats.upcomingCompetitions.map((comp, index) => (
                        <Paper
                          key={comp._id}
                          elevation={0}
                          sx={{ 
                            borderRadius: 3,
                            overflow: 'hidden',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                            }
                          }}
                        >
                          <CardActionArea 
                            onClick={() => navigate(`/student/competitions/${comp._id}`)}
                          >
                            <Box 
                              sx={{ 
                                p: 2,
                                position: 'relative',
                                borderLeft: `4px solid ${theme.palette.primary.main}`,
                                bgcolor: isDark ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.main, 0.03),
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography 
                                  variant="h6" 
                                  fontWeight={600} 
                                  sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    wordBreak: 'break-word',
                                    pr: 4 // Space for bookmark
                                  }}
                                >
                                  {comp.competitionName}
                                </Typography>
                                
                                {index === 0 && (
                                  <Chip 
                                    label="NEXT" 
                                    color="primary" 
                                    size="small"
                                    sx={{ fontWeight: 700 }}
                                  />
                                )}
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <CalendarIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(comp.startTiming)}
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                                <Chip 
                                  label={`${comp.duration} mins`}
                                  size="small"
                                  icon={<TimerIcon fontSize="small" />}
                                  sx={{ mr: 1 }}
                                />
                                {comp.difficulty && (
                                  <Chip 
                                    label={comp.difficulty}
                                    size="small"
                                    color={
                                      comp.difficulty.toLowerCase() === 'easy' ? 'success' :
                                      comp.difficulty.toLowerCase() === 'medium' ? 'warning' :
                                      'error'
                                    }
                                  />
                                )}
                              </Box>
                              
                              {/* Bookmark button */}
                              <IconButton 
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(comp._id);
                                }}
                                sx={{ 
                                  position: 'absolute', 
                                  top: 8, 
                                  right: 8,
                                  color: bookmarkedCompetitions.includes(comp._id) ? 'warning.main' : 'action.active',
                                }}
                              >
                                {bookmarkedCompetitions.includes(comp._id) ? 
                                  <Bookmark fontSize="small" /> : 
                                  <BookmarkBorder fontSize="small" />
                                }
                              </IconButton>
                            </Box>
                          </CardActionArea>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        minHeight: '200px',
                        textAlign: 'center',
                        border: `1px dashed ${alpha(theme.palette.text.secondary, 0.2)}`,
                        borderRadius: 3,
                        p: 3
                      }}
                    >
                      <CalendarIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary" gutterBottom>
                        No upcoming competitions
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Check back later for new challenges
                      </Typography>
                    </Box>
                  )}
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ 
                      mt: 3,
                      borderRadius: 2,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                    onClick={() => navigate('/student/competitions')}
                  >
                    Browse All Competitions
                  </Button>
                </CardContent>
              </Card>
            </MotionBox>
          </Grid>
        </Grid>
        
       
      </Box>
    </Container>
  );
};

export default DashboardHome;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarIcon,
  AccessTime,
  CheckCircle,
  Speed,
  BarChart,
  Refresh,
  ArrowUpward,
  Bookmark,
  BookmarkBorder,
  History,
  Assignment,
  DonutLarge,
  Help,
  HelpOutline,
  QuestionAnswer,
  Info,
  School,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const DashboardHome = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isDark = theme.palette.mode === 'dark';

  // State for dashboard data
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkedCompetitions, setBookmarkedCompetitions] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    student: {},
    participation: {
      totalCompetitionsJoined: 0,
      competitionsCompleted: 0,
      competitionsPending: 0,
    },
    performance: {
      totalCompetitionsCompleted: 0,
      averageScore: 0,
      highestScore: 0,
      totalScore: 0,
    },
    recentActivity: {},
    upcomingCompetitions: [],
    recentResults: [],
  });

  // Animation variants
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/student/dashboard/stats');
      console.log('Dashboard data:', response.data);
      if (response.data.success) {
        setDashboardData(response.data.data);
        // Initialize bookmarks from upcoming competitions
        const bookmarks = response.data.data.upcomingCompetitions
          ? response.data.data.upcomingCompetitions
              .filter((_, index) => index % 2 === 0) // Just for demo purposes
              .map(comp => comp._id)
          : [];
        setBookmarkedCompetitions(bookmarks);
      } else {
        console.error('Failed to load dashboard data:', response.data.message);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const toggleBookmark = (compId) => {
    setBookmarkedCompetitions((prev) =>
      prev.includes(compId) ? prev.filter(id => id !== compId) : [...prev, compId]
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData().finally(() => {
      setTimeout(() => setRefreshing(false), 800);
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: isDark ? 'background.default' : '#f7f9fc',
        minHeight: '100vh',
        pb: 4
      }}
    >
      {loading ? (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ py: 0 }}>
          {/* Welcome Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{
              mb: 4,
              bgcolor: isDark ? 'rgba(9, 9, 9, 0.67)' : 'primary.main',
              borderRadius: 2,
              p: 5,
              boxShadow: isDark ? '0 4px 14px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    mb: 1,
                    color: isDark ? '#f47061' : 'white'
                  }}
                >
                  Welcome, {dashboardData.student.name || 'Student'}
                </Typography>
                <Typography variant="body1" color={isDark ? 'text.secondary' : 'rgba(255,255,255,0.9)'}>
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
                      color: isDark ? '#f47061' : 'white',
                      borderColor: isDark ? '#f47061' : 'white',
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
            <Grid item xs={12} md={4} padding={2}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={0}
                elevation={3}
                sx={{
                  minWidth: 350,
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
                          {dashboardData.participation.totalCompetitionsJoined}
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
                          {dashboardData.participation.competitionsCompleted}
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
                          {dashboardData.participation.competitionsPending}
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
                        {dashboardData.participation.totalCompetitionsJoined > 0
                          ? Math.round((dashboardData.participation.competitionsCompleted / dashboardData.participation.totalCompetitionsJoined) * 100)
                          : 0}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={dashboardData.participation.totalCompetitionsJoined > 0
                        ? (dashboardData.participation.competitionsCompleted / dashboardData.participation.totalCompetitionsJoined) * 100
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
            <Grid item xs={12} md={4} padding={2}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={1}
                elevation={3}
                sx={{
                  borderRadius: '16px',
                  minWidth: 350,
                  padding: 2,
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
                          {dashboardData.performance.averageScore}%
                          {dashboardData.performance.averageScore > 70 && (
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
                          {dashboardData.performance.highestScore}%
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
                          <ArrowUpward sx={{ fontSize: 12, mr: 0.5 }} />
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
                        color={dashboardData.performance.averageScore > 70 ? 'success.main' : 'warning.main'}
                      >
                        {dashboardData.performance.averageScore > 70 ? 'Excellent' : 'Good'}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(dashboardData.performance.averageScore, 100)}
                      color={dashboardData.performance.averageScore > 70 ? 'success' : 'warning'}
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

            {/* Help Section (replacing Next Competition) */}
            <Grid item xs={12} md={4} padding={2}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={2}
                elevation={3}
                sx={{
                  minWidth: 350,
                  borderRadius: '16px',
                  height: '100%',
                  padding: 2,
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
                      Help Center
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
                      <HelpOutline color="info" sx={{ fontSize: 28 }} />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Get help and learn more about CodeQuest
                  </Typography>

                  <Stack spacing={2}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.info.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <QuestionAnswer color="info" sx={{ mr: 1.5 }} />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Frequently Asked Questions
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {/* Find answers to common questions about competitions, grading, and more. */}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="info"
                        fullWidth
                        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                        onClick={() => navigate('/student/faq')}
                      >
                        View FAQs
                      </Button>
                    </Paper>
                  </Stack>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>

          {/* Recent Results and Recent Activity */}
          <Grid container spacing={3} padding={2}>
            {/* Recent Results */}
            <Grid item xs={12} md={6} sx={{ width: '45%' }}>
              <MotionBox
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={3}
                height={'100%'}
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
                        Recent Results
                      </Typography>
                      <IconButton
                        size="small"
                    sx={{color:isDark ? 'white' : 'black'}}
                      >
                        <History fontSize="small" />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    {dashboardData.recentResults && dashboardData.recentResults.length > 0 ? (
                      <Stack spacing={2} style={{ overflowY: 'auto', maxHeight: '400px' }}>
                        {dashboardData.recentResults.map((result, index) => (
                          <Paper
                            key={result._id.toString()}
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
                                  {result.competitionName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                  <CalendarIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                  <Typography variant="caption" color="text.secondary">
                                    Date: {formatDate(result.date)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Chip
                                label={result.competitionType}
                                color={result.competitionType === 'MCQ' ? 'info' : 'secondary'}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                              <Chip
                                icon={<BarChart fontSize="small" />}
                                label={`Score: ${result.score}%`}
                                variant="outlined"
                                size="small"
                                color={
                                  result.score >= 70 ? 'success' :
                                    result.score >= 40 ? 'primary' : 'default'
                                }
                              />

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
                                onClick={() => navigate(`/student/results/${result.competitionId}`)}
                              >
                                View Details
                              </Button>
                            </Box>

                            {/* Bookmark button */}
                            {/* <IconButton
                              size="small"
                              onClick={() => toggleBookmark(result.competitionId)}
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: bookmarkedCompetitions.includes(result.competitionId) ? 'warning.main' : 'action.active',
                              }}
                            >
                              {bookmarkedCompetitions.includes(result.competitionId) ?
                                <Bookmark fontSize="small" /> :
                                <BookmarkBorder fontSize="small" />
                              }
                            </IconButton> */}
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
                          No recent results
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
                      onClick={() => navigate('/student/results')}
                    >
                      View All Results
                    </Button>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12} md={6} sx={{ width: '45%' }}>
              <MotionBox
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={4}
                height={'100%'}
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
                        Recent Activity
                      </Typography>
                      <IconButton
                        size="small"
                         sx={{color:isDark ? 'white' : 'black'}}
                      >
                        <AccessTime fontSize="small" />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    {dashboardData.recentActivity && dashboardData.recentActivity.loginHistory && dashboardData.recentActivity.loginHistory.length > 0 ? (
                      <Stack spacing={2} style={{ overflowY: 'auto', maxHeight: '400px' }}>
                        {/* Registration Activity */}
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            bgcolor: isDark ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.success.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            position: 'relative',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ maxWidth: 'calc(100% - 40px)' }}>
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
                                Account Registration
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <CalendarIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  Date: {formatDate(dashboardData.recentActivity.registrationTime)}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip
                              label="Registered"
                              color="success"
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        </Paper>

                        {/* Last Login Activity */}
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            bgcolor: isDark ? alpha(theme.palette.info.main, 0.1) : alpha(theme.palette.info.main, 0.05),
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            position: 'relative',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ maxWidth: 'calc(100% - 40px)' }}>
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
                                Last Login
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <CalendarIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary">
                                  Date: {formatDate(dashboardData.recentActivity.lastLogin)}
                                </Typography>
                              </Box>
                            </Box>
                            <Chip
                              label="Login"
                              color="info"
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                        </Paper>

                        {/* Login History */}
                        <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mt: 2 }}>
                          Recent Login History
                        </Typography>
                        
                        {dashboardData.recentActivity.loginHistory.map((loginTime, index) => (
                          <Paper
                            key={index}
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              bgcolor: isDark ? alpha(theme.palette.background.paper, 0.3) : alpha(theme.palette.background.paper, 0.7),
                              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                              position: 'relative',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTime sx={{ color: 'text.secondary', fontSize: 16, mr: 1 }} />
                                <Typography variant="body2">
                                  {formatDate(loginTime)}
                                </Typography>
                              </Box>
                              <Chip
                                label={`Login ${index + 1}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                              />
                            </Box>
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
                        <AccessTime sx={{ fontSize: 40, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          No recent activity
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Your recent login history will appear here
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          </Grid>

          {/* Upcoming Competitions (Full Width) */}
          <Grid container spacing={3} padding={2}>
            <Grid item xs={12}>
              <MotionBox
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={5}
                minHeight={'100%'}
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
                        <IconButton
                          size="small"
                          sx={{color:isDark ? 'white' : 'black'}}
                        >
                          <CalendarIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    {dashboardData.upcomingCompetitions && dashboardData.upcomingCompetitions.length > 0 ? (
                      <Grid container spacing={2}>
                        {dashboardData.upcomingCompetitions.map((comp, index) => (
                          <Grid item xs={12} md={6} lg={4} key={comp._id.toString()}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 2,
                                borderRadius: 3,
                                bgcolor: isDark ? alpha(theme.palette.background.paper, 0.3) : alpha(theme.palette.background.paper, 0.7),
                                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                position: 'relative',
                                transition: 'all 0.2s ease',
                                height: '100%',
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
                                    {comp.name}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                    <CalendarIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary">
                                      Start: {formatDate(comp.startTime)}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Chip
                                  label={comp.type}
                                  color={comp.type === 'MCQ' ? 'info' : 'secondary'}
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                                <AccessTime sx={{ fontSize: 14, mr: 0.5, color: 'info.main' }} />
                                <Typography variant="body2" color="info.main" fontWeight={500}>
                                  Starts in {comp.timeUntilStart}
                                </Typography>
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 2 }}>
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
                                  View Competition
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
                          </Grid>
                        ))}
                      </Grid>
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
                          Check back later for new competitions
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
      )}
    </Box>
  );
};

export default DashboardHome;
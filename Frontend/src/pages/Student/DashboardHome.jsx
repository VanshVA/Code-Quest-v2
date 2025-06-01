import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
  Chip
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import dashboardService from '../../services/dashboardService';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
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

    fetchDashboardStats();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Welcome to CodeQuest
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access your competitions, track your progress, and view your results all in one place.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Competitions Stats */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: '16px', 
              border: '1px solid', 
              borderColor: 'divider',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(var(--primary-color-rgb), 0.05) 0%, rgba(var(--primary-color-rgb), 0.15) 100%)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Competitions
                </Typography>
                <TrophyIcon color="primary" />
              </Box>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={4}>
                  <Typography variant="h4" fontWeight="bold" color="primary" align="center">
                    {stats.competitions.total}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Total
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h4" fontWeight="bold" color="success.main" align="center">
                    {stats.competitions.completed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Completed
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h4" fontWeight="bold" color="info.main" align="center">
                    {stats.competitions.inProgress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    In Progress
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Stats */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: '16px', 
              border: '1px solid', 
              borderColor: 'divider',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(var(--secondary-color-rgb), 0.05) 0%, rgba(var(--secondary-color-rgb), 0.15) 100%)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Performance
                </Typography>
                <TrendingUpIcon color="secondary" />
              </Box>
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="h4" fontWeight="bold" color="secondary" align="center">
                    {Math.round(stats.performance.averageScore)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Average Score
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" fontWeight="bold" color="secondary" align="center">
                    {stats.performance.bestScore}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Best Score
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Next Competition */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: '16px', 
              border: '1px solid', 
              borderColor: 'divider',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(var(--info-color-rgb), 0.05) 0%, rgba(var(--info-color-rgb), 0.15) 100%)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Next Competition
                </Typography>
                <TimerIcon color="info" />
              </Box>
              
              {stats.upcomingCompetitions && stats.upcomingCompetitions.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" fontWeight="medium">
                    {stats.upcomingCompetitions[0].competitionName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <CalendarIcon fontSize="small" color="info" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(stats.upcomingCompetitions[0].startTiming)}
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="info" 
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/student/competitions/${stats.upcomingCompetitions[0]._id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100px' }}>
                  <Typography variant="body1" color="text.secondary">
                    No upcoming competitions
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent and Upcoming Competitions */}
      <Grid container spacing={3}>
        {/* Recent Competitions */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: '16px', 
              border: '1px solid', 
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activities
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {stats.recentCompetitions && stats.recentCompetitions.length > 0 ? (
                stats.recentCompetitions.map((comp, index) => (
                  <Box 
                    key={comp._id.toString()} 
                    sx={{ 
                      py: 1.5, 
                      borderBottom: index < stats.recentCompetitions.length - 1 ? '1px solid' : 'none',
                      borderColor: 'divider'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="medium">
                        {comp.competitionName}
                      </Typography>
                      <Chip 
                        label={comp.completed ? 'Completed' : 'In Progress'} 
                        color={comp.completed ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Joined: {new Date(comp.joinedOn).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant="text"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ mt: 1, px: 0 }}
                      onClick={() => navigate(`/student/competitions/${comp._id}`)}
                    >
                      {comp.completed ? 'View Results' : 'Continue'}
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                  No recent activities
                </Typography>
              )}
              
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/student/competitions')}
              >
                View All Competitions
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Upcoming Competitions */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: '16px', 
              border: '1px solid', 
              borderColor: 'divider',
              height: '100%'
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Upcoming Competitions
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {stats.upcomingCompetitions && stats.upcomingCompetitions.length > 0 ? (
                stats.upcomingCompetitions.map((comp, index) => (
                  <Card
                    key={comp._id}
                    variant="outlined"
                    sx={{ 
                      mb: 2, 
                      borderRadius: '12px',
                      '&:last-child': { mb: 0 }
                    }}
                  >
                    <CardActionArea 
                      onClick={() => navigate(`/student/competitions/${comp._id}`)}
                      sx={{ p: 2 }}
                    >
                      <Typography variant="h6" fontWeight="medium">
                        {comp.competitionName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <CalendarIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(comp.startTiming)}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                ))
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                  No upcoming competitions
                </Typography>
              )}
              
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/student/competitions')}
              >
                Browse All Competitions
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHome;
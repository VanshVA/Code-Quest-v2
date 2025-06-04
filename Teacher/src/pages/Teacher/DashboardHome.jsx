import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Avatar,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  CircularProgress,
  Tooltip,
  IconButton,
  useTheme
} from '@mui/material';
import {
  PieChart,
  BarChart,
  GroupAddOutlined,
  SchoolOutlined,
  EmojiEventsOutlined,
  PeopleOutlineOutlined,
  TrendingUpOutlined,
  InfoOutlined,
  Refresh,
  ArrowForward,
  CelebrationOutlined,
  FeedbackOutlined,
  LoginOutlined,
  AssignmentOutlined,
  AssignmentTurnedInOutlined,
  AccessTimeOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import axios from 'axios';

// Current date and time
const CURRENT_DATE_TIME = "2025-05-30 10:05:36";
// API base URL
const API_BASE_URL = "http://localhost:5000/api/teacher/dashboard";

const TeacherHome = () => {
  const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  // Loading state
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingCompetitions, setUpcomingCompetitions] = useState([]);
  const [recentCompetitions, setRecentCompetitions] = useState([]);
  const [gradingStats, setGradingStats] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Make API call to fetch dashboard statistics
        const response = await axios.get(`${API_BASE_URL}/dashboard-stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const { data } = response.data;
        console.log("Fetched Dashboard Data:", data);
        // Set state with fetched data
        setStats({
          totalCompetitions: data.counts.totalCompetitions,
          totalParticipatingStudents: data.counts.totalParticipatingStudents,
          totalSubmissions: data.counts.totalSubmissions,
          activeCompetitions: data.counts.activeCompetitions,
          pendingGrades: data.counts.pendingGrades
        });

        setRecentActivities(data.recentActivity);
        setUpcomingCompetitions(data.upcomingCompetitions);
        setRecentCompetitions(data.recentCompetitions);
        setGradingStats(data.gradingStats);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'login':
        return <LoginOutlined />;
      case 'submission':
        return <AssignmentTurnedInOutlined />;
      default:
        return <InfoOutlined />;
    }
  };

  // Helper function to get activity color
  const getActivityColor = (type) => {
    switch (type) {
      case 'login':
        return 'secondary.main';
      case 'submission':
        return isGraded => isGraded ? 'success.main' : 'warning.main';
      default:
        return 'info.main';
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  const convertToIST = (dateString) => {
    const utcDate = new Date(dateString);
    return utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  return (
    <Box>
      {/* Dashboard Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Teacher Dashboard
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
          sx={{ borderRadius: '8px' }}
        >
          Refresh
        </Button>
      </Box>

      {/* Key Stats Cards */}
      <Grid container spacing={3.4} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
               bgcolor:isDark ? '#312f2f' : 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Competitions
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalCompetitions.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    Active: {stats.activeCompetitions}
                  </Typography>
                </Box>
              </Box>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 40,
                  height: 40,
                  marginLeft:'20px'
                }}
              >
                <EmojiEventsOutlined />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
               bgcolor:isDark ? '#312f2f' : 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Participating Students
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalParticipatingStudents}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    Submissions: {stats.totalSubmissions}
                  </Typography>
                </Box>
              </Box>
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  width: 40,
                  height: 40,
                  marginLeft:'20px'
                }}
              >
                <PeopleOutlineOutlined />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
               bgcolor:isDark ? '#312f2f' : 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Grades
                </Typography>
                <Typography variant="h4" fontWeight="bold" color={stats.pendingGrades > 0 ? "warning.main" : "success.main"}>
                  {stats.pendingGrades}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {gradingStats?.completionRate || 0}% graded
                  </Typography>
                </Box>
              </Box>
              <Avatar
                sx={{
                  bgcolor: 'warning.main',
                  width: 40,
                  height: 40,
                  marginLeft:'20px'
                }}
              >
                <AssignmentOutlined />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4} >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
               bgcolor:isDark ? '#312f2f' : 'white',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Teacher Help
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                  Need assistance?
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  color="info"
                  onClick={() => navigate('/teacher/help')}
                  sx={{ 
                    borderRadius: '8px', 
                    textTransform: 'none',
                    mt: 0.5
                  }}
                >
                  Help Center
                </Button>
              </Box>
              <Avatar
                sx={{
                  bgcolor: 'info.main',
                  width: 40,
                  height: 40,
                  marginLeft:'20px'
                }}
              >
                <InfoOutlined />
              </Avatar>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts and Lists */}
      <Grid container spacing={3} sx={{ height: '100%', minHeight: '500px' }}>
        {/* Recent Activities */}
        <Grid item xs={12} md={7} sx={{ height: '55vh', mb: { xs: 3, md: 0 } }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
               bgcolor:isDark ? '#312f2f' : 'white',
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Activities
              </Typography>
            </Box>
            <List sx={{ p: 0, overflowY: 'auto', flexGrow: 1 }}>
              {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                <ListItem
                  key={index}
                  divider={index < recentActivities.length - 1}
                  disablePadding
                >
                  <ListItemButton sx={{ px: 2, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar sx={{
                        bgcolor: activity.type === 'submission' 
                          ? (activity.isGraded ? 'success.main' : 'warning.main') 
                          : 'secondary.main'
                      }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {activity.type === 'login' ? (
                            <><strong>{activity.user}</strong> logged in</>
                          ) : (
                            <><strong>{activity.user}</strong> submitted <strong>{activity.competitionName}</strong></>
                          )}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {activity.email} • {convertToIST(activity.formattedTime)}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              )) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body1" align="center" sx={{ py: 2 }}>
                        No recent activities to show.
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Recent Competitions */}
        <Grid item xs={12} md={7} sx={{ height: '55vh', mb: { xs: 3, md: 0 }  }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
               bgcolor:isDark ? '#312f2f' : 'white',
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Competitions
              </Typography>
            </Box>
            <List sx={{ p: 0, overflowY: 'auto', flexGrow: 1 }}>
              {recentCompetitions && recentCompetitions.length > 0 ? (
                recentCompetitions.map((comp, index) => (
                  <ListItem
                    key={comp._id || index}
                    divider={index < recentCompetitions.length - 1}
                    disablePadding
                  >
                    <ListItemButton sx={{ px: 2, py: 1.5 }}
                      onClick={() => navigate(`/teacher/competitions`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: comp.isLive ? 'success.main' : 'info.main' }}>
                          <EmojiEventsOutlined />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            {comp.competitionName}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            Last modified: {convertToIST(comp.lastSaved)}
                          </Typography>
                        }
                      />
                      {comp.isLive && 
                        <Tooltip title="Live Competition">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: 'success.main',
                                mr: 1
                              }}
                            />
                            <Typography variant="caption" color="success.main">Live</Typography>
                          </Box>
                        </Tooltip>
                      }
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body1" align="center" sx={{ py: 2 }}>
                        No competitions created yet.
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Upcoming Competitions */}
        <Grid item xs={12}  md={7} sx={{ height: '55vh' ,mb: { xs: 3, md: 0 } }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
               bgcolor:isDark ? '#312f2f' : 'white',
            }}
          >
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid', 
              borderColor: 'divider', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <Typography variant="h6" fontWeight="bold">
                Upcoming Competitions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => navigate('/teacher/competitions')}
                sx={{ borderRadius: '8px', textTransform: 'none', marginLeft:'16px' }}
              >
                Manage
              </Button>
            </Box>
            <List sx={{ p: 0, overflowY: 'auto', flexGrow: 1 }}>
              {upcomingCompetitions && upcomingCompetitions.length > 0 ? (
                upcomingCompetitions.map((comp, index) => (
                  <ListItem
                    key={comp._id || index}
                    divider={index < upcomingCompetitions.length - 1}
                    disablePadding
                  >
                    <ListItemButton
                      sx={{ px: 2, py: 1.5 }}
                      onClick={() => navigate(`/teacher/competitions`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <AccessTimeOutlined />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="medium">
                            {comp.competitionName}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Date: {new Date(comp.startTiming).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Type: {comp.competitionType} • Duration: {comp.duration} minutes
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="body1" align="center" sx={{ py: 2 }}>
                        No upcoming competitions at the moment.
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherHome;
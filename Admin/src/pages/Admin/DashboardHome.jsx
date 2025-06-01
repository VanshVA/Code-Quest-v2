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
  LoginOutlined
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import axios from 'axios';

// Current date and time
const CURRENT_DATE_TIME = "2025-05-30 10:05:36";
// API base URL
const API_BASE_URL = "http://localhost:5000/api/admin/dashboard";

const AdminHome = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Loading state
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingCompetitions, setUpcomingCompetitions] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Make API call to fetch dashboard statistics
        const response = await axios.get(`${API_BASE_URL}/statistics`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const { data } = response.data;
        // Set state with fetched data
        setStats({
          totalStudents: data.counts.totalStudents,
          totalTeachers: data.counts.totalTeachers,
          totalCompetitions: data.counts.totalCompetitions,
          feedbackCount: data.counts.feedbackCount,
          activeCompetitions: data.counts.activeCompetitions,
          userDistribution: data.userDistribution
        });

        setRecentActivities(data.recentActivity);
        setUpcomingCompetitions(data.upcomingCompetitions);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart options for user distribution
  const userDistributionOptions = {
    chart: {
      type: 'donut',
      fontFamily: theme.typography.fontFamily,
    },
    legend: {
      position: 'bottom',
      fontWeight: 500,
    },
    labels: ['Students', 'Teachers'],
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Users',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      }
    }
  };

  const userDistributionSeries = stats?.userDistribution
    ? [
      stats.userDistribution.students.percentage,
      stats.userDistribution.teachers.percentage
    ]
    : [0, 0];

  // Helper function to get activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'teacher_registration':
        return <SchoolOutlined />;
      case 'student_registration':
        return <PeopleOutlineOutlined />;
      case 'teacher_login':
        return <LoginOutlined />;
      case 'student_login':
        return <LoginOutlined />;
      default:
        return <InfoOutlined />;
    }
  };

  // Helper function to get activity color
  const getActivityColor = (type) => {
    switch (type) {
      case 'teacher_registration':
        return 'secondary.main';
      case 'student_registration':
        return 'primary.main';
      case 'teacher_login':
        return 'info.main';
      case 'student_login':
        return 'success.main';
      default:
        return 'warning.main';
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
          Dashboard Home
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
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Students
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalStudents.toLocaleString()}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {stats.userDistribution.students.percentage}% of users
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
                <PeopleOutlineOutlined />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Teachers
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalTeachers}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {stats.userDistribution.teachers.percentage}% of users
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
                <SchoolOutlined />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Competitions
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalCompetitions}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    Active: {stats.activeCompetitions} | Upcoming: {stats.upcomingCompetitions}
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
                <EmojiEventsOutlined />
              </Avatar>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Active Competitions
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {stats.activeCompetitions}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: 'success.main',
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

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Feedback Received
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.feedbackCount}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  bgcolor: 'primary.light',
                  width: 40,
                  height: 40,
                  marginLeft:'20px'
                }}
              >
                <FeedbackOutlined />
              </Avatar>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="bold">
                Recent Activities
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {recentActivities.map((activity, index) => (
                <ListItem
                  key={index}
                  divider={index < recentActivities.length - 1}
                  disablePadding
                >
                  <ListItemButton sx={{ px: 2, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar sx={{
                        bgcolor: getActivityColor(activity.type)
                      }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          <strong>{activity.user}</strong> {activity.type.includes('login') ? 'logged in' : 'registered'}
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
              ))}
            </List>
          </Paper>
        </Grid>

        {/* User Distribution Chart */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                User Distribution
              </Typography>
              <Tooltip title="This chart shows the distribution of users by type">
                <IconButton size="small">
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Chart
                options={userDistributionOptions}
                series={userDistributionSeries}
                type="donut"
                height={300}
                width="100%"
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" align="center">
                Total Users: {stats.totalStudents + stats.totalTeachers}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Competitions */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Upcoming Competitions
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => navigate('/admin/competitions')}
                sx={{ borderRadius: '8px', textTransform: 'none', marginLeft:'16px' }}
              >
                Manage
              </Button>
            </Box>
            <List sx={{ p: 0 }}>
              {upcomingCompetitions.length > 0 ? (
                upcomingCompetitions.map((comp, index) => (
                  <ListItem
                    key={comp.id || index}
                    divider={index < upcomingCompetitions.length - 1}
                    disablePadding
                  >
                    <ListItemButton
                      sx={{ px: 2, py: 1.5 }}
                      onClick={() => navigate(`/admin/competitions`)}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
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
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Date: {new Date(comp.startTiming).toLocaleDateString('en-In', { month: 'short', day: 'numeric', year: 'numeric' })}
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

export default AdminHome;
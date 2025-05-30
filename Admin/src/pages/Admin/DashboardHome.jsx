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
  WarningAmber
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';

// Current date and time
const CURRENT_DATE_TIME = "2025-05-30 10:05:36";

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
        // In a real app, these would be API calls
        // Simulating API response data
        const statsData = {
          totalStudents: 1256,
          totalTeachers: 89,
          totalCompetitions: 157,
          activeCompetitions: 12,
          pendingApprovals: 5,
          recentRegistrations: 32,
          studentsGrowth: 12, // percentage
          teachersGrowth: 8,   // percentage
          competitionsGrowth: 15 // percentage
        };
        
        const activities = [
          { id: 1, type: 'teacher_register', user: 'Emily Johnson', time: '2 hours ago', action: 'registered as a teacher' },
          { id: 2, type: 'competition_create', user: 'David Smith', time: '5 hours ago', action: 'created a new competition' },
          { id: 3, type: 'student_register', user: 'Michael Brown', time: '1 day ago', action: 'registered as a student' },
          { id: 4, type: 'competition_complete', user: 'Javascript Challenge', time: '2 days ago', action: 'competition completed' },
          { id: 5, type: 'student_award', user: 'Sarah Wilson', time: '3 days ago', action: 'won first place in Python Challenge' }
        ];
        
        const competitions = [
          { id: 101, title: 'Algorithm Challenge', date: '2025-06-02', participants: 45, creator: 'Prof. Alan Turing' },
          { id: 102, title: 'Web Development Contest', date: '2025-06-10', participants: 32, creator: 'Dr. Sara Johnson' },
          { id: 103, title: 'Data Structures 101', date: '2025-06-15', participants: 28, creator: 'Prof. Robert Miles' },
        ];
        
        // Set state with fetched data
        setStats(statsData);
        setRecentActivities(activities);
        setUpcomingCompetitions(competitions);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 1000);
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
    labels: ['Students', 'Teachers', 'Admins'],
    colors: [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.warning.main],
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
  
  const userDistributionSeries = [93.2, 6.5, 0.3]; // Students, Teachers, Admins
  
  // Chart options for competition statistics
  const competitionStatisticsOptions = {
    chart: {
      type: 'bar',
      fontFamily: theme.typography.fontFamily,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    },
    yaxis: {
      title: {
        text: 'Count'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " competitions";
        }
      }
    },
    legend: {
      position: 'top',
    },
    colors: [theme.palette.primary.main, theme.palette.success.main]
  };
  
  const competitionStatisticsSeries = [
    {
      name: 'Created',
      data: [12, 19, 10, 17, 23]
    },
    {
      name: 'Completed',
      data: [10, 15, 8, 15, 19]
    }
  ];
  
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
  
  return (
    <Box>
      {/* Dashboard Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, Admin! Here's what's happening with your platform.
          </Typography>
        </Box>
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
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
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
                  <TrendingUpOutlined sx={{ fontSize: '1rem', color: 'success.main', mr: 0.5 }} />
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 500 }}>
                    +{stats.studentsGrowth}% this month
                  </Typography>
                </Box>
              </Box>
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 40,
                  height: 40,
                }}
              >
                <PeopleOutlineOutlined />
              </Avatar>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
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
                  <TrendingUpOutlined sx={{ fontSize: '1rem', color: 'success.main', mr: 0.5 }} />
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 500 }}>
                    +{stats.teachersGrowth}% this month
                  </Typography>
                </Box>
              </Box>
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  width: 40,
                  height: 40,
                }}
              >
                <SchoolOutlined />
              </Avatar>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
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
                  <TrendingUpOutlined sx={{ fontSize: '1rem', color: 'success.main', mr: 0.5 }} />
                  <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 500 }}>
                    +{stats.competitionsGrowth}% this month
                  </Typography>
                </Box>
              </Box>
              <Avatar
                sx={{
                  bgcolor: 'warning.main',
                  width: 40,
                  height: 40,
                }}
              >
                <EmojiEventsOutlined />
              </Avatar>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: '100%',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 193, 7, 0.16)' : 'rgba(255, 193, 7, 0.08)',
              border: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 193, 7, 0.2)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Pending Approvals
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {stats.pendingApprovals}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/admin/dashboard/approvals')}
                    sx={{ p: 0, minWidth: 0, textTransform: 'none' }}
                  >
                    Review now
                  </Button>
                </Box>
              </Box>
              <Avatar
                sx={{
                  bgcolor: 'warning.main',
                  width: 40,
                  height: 40,
                }}
              >
                <WarningAmber />
              </Avatar>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Charts and Lists */}
      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
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
                Recent Activities
              </Typography>
              <Button
                endIcon={<ArrowForward />}
                size="small"
                onClick={() => navigate('/admin/dashboard/activities')}
                sx={{ textTransform: 'none' }}
              >
                View All
              </Button>
            </Box>
            <List sx={{ p: 0 }}>
              {recentActivities.map((activity) => (
                <ListItem 
                  key={activity.id}
                  divider
                  disablePadding
                >
                  <ListItemButton sx={{ px: 2, py: 1.5 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: activity.type === 'teacher_register' ? 'secondary.main' : 
                                 activity.type === 'student_register' ? 'primary.main' :
                                 activity.type === 'competition_create' ? 'warning.main' :
                                 activity.type === 'competition_complete' ? 'info.main' : 'success.main'
                      }}>
                        {activity.type === 'teacher_register' && <SchoolOutlined />}
                        {activity.type === 'student_register' && <PeopleOutlineOutlined />}
                        {activity.type === 'competition_create' && <EmojiEventsOutlined />}
                        {activity.type === 'competition_complete' && <EmojiEventsOutlined />}
                        {activity.type === 'student_award' && <CelebrationOutlined />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          <strong>{activity.user}</strong> {activity.action}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
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
        <Grid item xs={12} md={6}>
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
          </Paper>
        </Grid>
        
        {/* Competition Statistics Chart */}
        <Grid item xs={12} md={8}>
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
                Competition Statistics
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/admin/dashboard/analytics')}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: '8px',
                  }}
                >
                  Detailed Analytics
                </Button>
              </Box>
            </Box>
            <Chart 
              options={competitionStatisticsOptions} 
              series={competitionStatisticsSeries} 
              type="bar" 
              height={300}
            />
          </Paper>
        </Grid>
        
        {/* Upcoming Competitions */}
        <Grid item xs={12} md={4}>
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
                Upcoming Competitions
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {upcomingCompetitions.map((comp) => (
                <ListItem 
                  key={comp.id}
                  divider
                  disablePadding
                >
                  <ListItemButton 
                    sx={{ px: 2, py: 1.5 }}
                    onClick={() => navigate(`/admin/dashboard/competitions/${comp.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'warning.main' }}>
                        <EmojiEventsOutlined />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={
                        <Typography variant="body2" fontWeight="medium">
                          {comp.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Date: {new Date(comp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            Participants: {comp.participants} • Creator: {comp.creator}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Button
                variant="text"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/admin/dashboard/competitions')}
                sx={{ textTransform: 'none' }}
              >
                View All Competitions
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminHome;
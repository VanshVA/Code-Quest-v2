import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Avatar,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  IconButton,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarIcon,
  AccessTime,
  CheckCircle,
  ErrorOutline,
  FilterList,
  Search,
  Refresh,
  BarChart,
  Sort,
  Person,
  School,
  Leaderboard,
  Download,
  Print,
  DateRange,
  Score,
  Assignment,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Create motion variants for animations
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

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
    y: -5,
    boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  }
};

function CompetitionResultsPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  // State for results data
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('submissionTime');
  const [sortOrder, setSortOrder] = useState('desc');
  const [refreshing, setRefreshing] = useState(false);
  const resultsDemo = [
    {
      id: 1,
      title: "Test #1",
      subtitle: "Unit Testing",
      content: "All test cases passed successfully with 100% coverage.",
      status: "success",
      score: 100
    },
    {
      id: 2,
      title: "Test #2",
      subtitle: "Integration Testing",
      content: "2 test cases failed out of 15. Please check the logs for more details.",
      status: "error",
      score: 86
    },
    {
      id: 3,
      title: "Test #3",
      subtitle: "Performance Testing",
      content: "Response time is slightly above threshold. Optimization recommended.",
      status: "warning",
      score: 75
    }
  ];
  
  // Stats for summary cards
  const [stats, setStats] = useState({
    totalCompetitions: 0,
    averageScore: 0,
    bestScore: 0,
    recentCompetitionDate: null
  });

  useEffect(() => {
    fetchResults();
  }, [page, rowsPerPage, sortField, sortOrder]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/student/results/all`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          sort: sortField,
          order: sortOrder,
          search: searchTerm
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setResults(response.data.data.results);
        setTotalResults(response.data.data.pagination.total);
        setTotalPages(response.data.data.pagination.pages);
        calculateStats(response.data.data.results);
      } else {
        setError(response.data.message || 'Failed to fetch results');
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err.response?.data?.message || 'An error occurred while fetching results');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchResults().finally(() => {
      setTimeout(() => setRefreshing(false), 800);
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const calculateStats = (resultsData) => {
    if (!resultsData || resultsData.length === 0) {
      return;
    }

    const uniqueCompetitions = new Set(resultsData.map(r => r.competitionId));
    const scores = resultsData.map(r => parseFloat(r.percentageScore));
    const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const bestScore = Math.max(...scores);
    const latestDate = new Date(Math.max(...resultsData.map(r => new Date(r.submissionTime))));

    setStats({
      totalCompetitions: uniqueCompetitions.size,
      averageScore: avgScore.toFixed(2),
      bestScore: bestScore.toFixed(2),
      recentCompetitionDate: latestDate
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <Box sx={{
      backgroundColor: isDark ? 'background.default' : '#f7f9fc',
      minHeight: '100vh',
      pb: 4
    }}>
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
                      > Competition Results
                        
                      </Typography>
                      <Typography variant="body1" color={isDark ? 'text.secondary' : 'rgba(255,255,255,0.9)'}>
                             View your performance across all competitions
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
     <Box sx={{ py: 2, px: isMobile ? 2 : 4 }}>
      
          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {/* Total Competitions Card */}
            <Grid item xs={12} sm={6} md={3} minWidth={280}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={0}
                elevation={2}
                sx={{ borderRadius: 3, overflow: 'hidden' }}
              >
                <CardContent sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05)
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Total Competitions
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                        color: theme.palette.primary.main,
                        width: 32,
                        height: 32
                      }}
                    >
                      <TrophyIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                    {stats.totalCompetitions}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Competitions taken
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            
            {/* Average Score Card */}
            <Grid item xs={12} sm={6} md={3} minWidth={280}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={1}
                elevation={2}
                sx={{ borderRadius: 3, overflow: 'hidden' }}
              >
                <CardContent sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: isDark ? alpha(theme.palette.info.main, 0.1) : alpha(theme.palette.info.main, 0.05)
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Average Score
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.2),
                        color: theme.palette.info.main,
                        width: 32,
                        height: 32
                      }}
                    >
                      <BarChart fontSize="small" />
                    </Avatar>
                  </Box>
                  
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                    {stats.averageScore}%
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Overall performance
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            
            {/* Best Score Card */}
            <Grid item xs={12} sm={6} md={3} minWidth={280}> 
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={2}
                elevation={2}
                sx={{ borderRadius: 3, overflow: 'hidden' }}
              >
                <CardContent sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: isDark ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.success.main, 0.05)
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Best Score
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.2),
                        color: theme.palette.success.main,
                        width: 32,
                        height: 32
                      }}
                    >
                      <TrendingUpIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                    {stats.bestScore}%
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Your highest score
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            
            {/* Last Competition Card */}
            <Grid item xs={12} sm={6} md={3} minWidth={280}>
              <MotionCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                custom={3}
                elevation={2}
                sx={{ borderRadius: 3, overflow: 'hidden' }}
              >
                <CardContent sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: isDark ? alpha(theme.palette.warning.main, 0.1) : alpha(theme.palette.warning.main, 0.05)
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Last Competition
                    </Typography>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.warning.main, 0.2),
                        color: theme.palette.warning.main,
                        width: 32,
                        height: 32
                      }}
                    >
                      <CalendarIcon fontSize="small" />
                    </Avatar>
                  </Box>
                  
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, mb: 0.5 }}>
                    {stats.recentCompetitionDate 
                      ? formatDate(stats.recentCompetitionDate).split(',')[0] 
                      : 'No data'}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    {stats.recentCompetitionDate 
                      ? formatDate(stats.recentCompetitionDate).split(',')[1] 
                      : 'No competitions taken yet'}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
          
          {/* Results Table */}
          <MotionPaper 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={4}
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              mb: 4,
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
            
              {results.length > 0 ? (
          <>
           
          </> 
        )
            : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 8,
                  px: 2,
                  textAlign: 'center'
                }}
              >
                <TrophyIcon sx={{ fontSize: 70, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Results Found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mb: 3 }}>
                  You haven't completed any competitions yet or no results match your filters. 
                  Participate in competitions to see your results here.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Search />}
                  onClick={() => navigate('/student/competitions')}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  Browse Competitions
                </Button>
              </Box>
            )}
          </MotionPaper>
        </Box>
    </Box>
  );
}

export default CompetitionResultsPage;
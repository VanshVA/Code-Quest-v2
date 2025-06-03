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
      {loading && results.length === 0 ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ py: 2, px: isMobile ? 2 : 4 }}>
          {/* Header Section */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            sx={{ mb: 4 }}
          >
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Competition Results
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  View your performance across all competitions
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2 }}>
                <OutlinedInput
                  placeholder="Search competitions..."
                  size="small"
                  value={searchTerm}
                  onChange={handleSearch}
                  onKeyPress={(e) => e.key === 'Enter' && fetchResults()}
                  startAdornment={
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  }
                  sx={{ 
                    borderRadius: 2, 
                    backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.1) : alpha(theme.palette.background.paper, 0.7),
                    width: { xs: '100%', sm: 220 }
                  }}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Refresh />}
                  onClick={handleRefresh}
                  disabled={refreshing}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2
                  }}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </Grid>
            </Grid>
          </MotionBox>
          
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {/* Total Competitions Card */}
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
            <Grid item xs={12} sm={6} md={3}>
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
                <TableContainer sx={{ minHeight: 400 }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ 
                        backgroundColor: isDark ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
                        '& th': { 
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          fontSize: '0.875rem',
                          px: 2,
                          py: 1.5
                        }
                      }}>
                        <TableCell>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              cursor: 'pointer' 
                            }}
                            onClick={() => handleSort('competitionName')}
                          >
                            Competition
                            {sortField === 'competitionName' && (
                              <Sort 
                                fontSize="small" 
                                sx={{ 
                                  ml: 0.5,
                                  transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none' 
                                }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              cursor: 'pointer' 
                            }}
                            onClick={() => handleSort('competitionType')}
                          >
                            Type
                            {sortField === 'competitionType' && (
                              <Sort 
                                fontSize="small" 
                                sx={{ 
                                  ml: 0.5,
                                  transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none' 
                                }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              cursor: 'pointer' 
                            }}
                            onClick={() => handleSort('creatorName')}
                          >
                            Creator
                            {sortField === 'creatorName' && (
                              <Sort 
                                fontSize="small" 
                                sx={{ 
                                  ml: 0.5,
                                  transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none' 
                                }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              cursor: 'pointer' 
                            }}
                            onClick={() => handleSort('submissionTime')}
                          >
                            Submission Date
                            {sortField === 'submissionTime' && (
                              <Sort 
                                fontSize="small" 
                                sx={{ 
                                  ml: 0.5,
                                  transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none' 
                                }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              cursor: 'pointer' 
                            }}
                            onClick={() => handleSort('percentageScore')}
                          >
                            Score
                            {sortField === 'percentageScore' && (
                              <Sort 
                                fontSize="small" 
                                sx={{ 
                                  ml: 0.5,
                                  transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none' 
                                }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              cursor: 'pointer' 
                            }}
                            onClick={() => handleSort('rank')}
                          >
                            Rank
                            {sortField === 'rank' && (
                              <Sort 
                                fontSize="small" 
                                sx={{ 
                                  ml: 0.5,
                                  transform: sortOrder === 'asc' ? 'rotate(180deg)' : 'none' 
                                }} 
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{ '& td': { px: 2, py: 1.5 } }}>
                      {results.map((result) => (
                        <TableRow
                          key={result._id}
                          hover
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            transition: 'background-color 0.2s',
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: isDark ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
                            }
                          }}
                          onClick={() => navigate(`/student/competitions/${result.competitionId}/results/${result._id}`)}
                        >
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 200 }}>
                                {result.competitionName}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Tooltip title="Questions">
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mr: 1.5 }}>
                                    <CheckCircle fontSize="inherit" sx={{ mr: 0.5, fontSize: '0.75rem' }} />
                                    {result.correctAnswers}/{result.totalQuestions}
                                  </Typography>
                                </Tooltip>
                                <Tooltip title="Time Taken">
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTime fontSize="inherit" sx={{ mr: 0.5, fontSize: '0.75rem' }} />
                                    {formatDuration(result.timeTaken)}
                                  </Typography>
                                </Tooltip>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={result.competitionType || 'MCQ'} 
                              size="small"
                              color={result.competitionType === 'Coding' ? 'primary' : 'default'}
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Person fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1rem' }} />
                              <Typography variant="body2">{result.creatorName}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{formatDate(result.submissionTime)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography 
                                variant="body2" 
                                fontWeight={600} 
                                sx={{ 
                                  color: 
                                    parseFloat(result.percentageScore) >= 70 ? theme.palette.success.main :
                                    parseFloat(result.percentageScore) >= 40 ? theme.palette.warning.main :
                                    theme.palette.error.main
                                }}
                              >
                                {result.percentageScore}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            {result.rank ? (
                              <Chip 
                                label={`#${result.rank}`} 
                                size="small" 
                                color={
                                  result.rank <= 3 ? 'success' : 
                                  result.rank <= 10 ? 'primary' : 
                                  'default'
                                }
                                sx={{ fontWeight: 600 }}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                N/A
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              size="small"
                              endIcon={<ArrowForwardIcon />}
                              sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontSize: '0.8125rem',
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/student/competitions/${result.competitionId}/results/${result._id}`);
                              }}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {refreshing && (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <LinearProgress />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              
                <TablePagination
                  component="div"
                  count={totalResults}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Results per page:"
                  sx={{ 
                    borderTop: `1px solid ${theme.palette.divider}`,
                    '.MuiTablePagination-toolbar': {
                      px: 2
                    }
                  }}
                />
              </>
            ) : (
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
      )}
    </Box>
  );
}

export default CompetitionResultsPage;
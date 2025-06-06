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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  LinearProgress,
  Pagination,
  CardActions,
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
  MenuBook,
  WatchLater,
  Group,
  Close,
  Bookmark,
  BookmarkBorder,
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

// API URL
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

// Handle response and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject({ message });
  }
);

function CompetitionResultsPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  // State for joined competitions
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10
  });
  
  // State for sorting
  const [sortOption, setSortOption] = useState('newest');
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkedCompetitions, setBookmarkedCompetitions] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  
  // State for result dialog
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [resultLoading, setResultLoading] = useState(false);
  const [resultError, setResultError] = useState(null);

  useEffect(() => {
    fetchJoinedCompetitions();
    setBookmarkedCompetitions(['comp123', 'comp456']); // Example bookmarks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortOption]);

  const fetchJoinedCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch joined competitions using the joined endpoint
      const response = await api.get(`/student/dashboard/competitions/joined`, {
        params: {
          page,
          limit: 10,
          sort: sortOption
        }
      });
      
      if (response.data.success) {
        setCompetitions(response.data.data.competitions);
        setPagination(response.data.data.pagination);
      } else {
        setError(response.data.message || 'Failed to load competitions');
      }
    } catch (error) {
      setError(error.message || 'Error loading competitions. Please try again later.');
      console.error('Error fetching competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchJoinedCompetitions().then(() => {
      setTimeout(() => setRefreshing(false), 800);
    });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortSelect = (option) => {
    setSortOption(option);
  };

  const handleBookmarkToggle = (id, event) => {
    event.stopPropagation();
    if (bookmarkedCompetitions.includes(id)) {
      setBookmarkedCompetitions(bookmarkedCompetitions.filter(compId => compId !== id));
    } else {
      setBookmarkedCompetitions([...bookmarkedCompetitions, id]);
    }
  };

  const handleResultClick = async (competition) => {
    setSelectedCompetition(competition);
    setDialogOpen(true);
    
    try {
      setResultLoading(true);
      setResultError(null);
      
      // Fetch the competition result using the API endpoint with correct path
      const response = await api.get(`/student/dashboard/competitions/${competition._id}/results`);
      console.log('Result response:', response.data);
      if (response.data.success) {
        setResultData(response.data.data);
      } else {
        setResultError(response.data.message || 'Failed to load result details');
      }
    } catch (error) {
      setResultError(error.message || 'Error loading result. Please try again later.');
      console.error('Error fetching result:', error);
    } finally {
      setResultLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCompetition(null);
    setResultData(null);
    setResultError(null);
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

  // Render time status for competition card
  const renderTimeStatus = (timeStatus) => {
    if (!timeStatus) return null;

    const { type, formattedTime } = timeStatus;

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 1.5,
          py: 0.5,
          px: 1,
          borderRadius: '4px',
          bgcolor: type === 'startsIn'
            ? alpha(theme.palette.primary.main, 0.1)
            : type === 'endsIn'
              ? alpha(theme.palette.error.main, 0.1)
              : alpha(theme.palette.text.secondary, 0.05),
          width: 'fit-content'
        }}
      >
        {type === 'startsIn' && (
          <>
            <AccessTime fontSize="small" color="primary" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="primary" fontWeight={500}>
              Starts in {formattedTime}
            </Typography>
          </>
        )}
        {type === 'endsIn' && (
          <>
            <Timer fontSize="small" color="error" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="error" fontWeight={500}>
              Ends in {formattedTime}
            </Typography>
          </>
        )}
        {type === 'ended' && (
          <>
            <CheckCircle fontSize="small" color="text.secondary" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Ended
            </Typography>
          </>
        )}
      </Box>
    );
  };

  // Render competition card
  const renderCompetitionCard = (competition, index) => {
    // Handle the specific properties from your API data structure
    const isJoined = competition.participation?.isJoined;
    const isCompleted = competition.participation?.completed;
    const isSubmitted = competition.participation?.submissionStatus === 'submitted';
    const isActive = competition.status === 'active';
    const isEnded = competition.status === 'ended';
    const isUpcoming = competition.status === 'upcoming';
    const isBookmarked = bookmarkedCompetitions.includes(competition._id);
    const isLoading = loadingStates[competition._id];

    // Generate random values for the progress indicator and participants
    const progressPercent = 100;
    const participantCount = competition.studentsJoined?.length || 0;

    // Create a safe version of the competition object with fallbacks for potentially missing fields
    const safeCompetition = {
      _id: competition._id || `temp-${index}`,
      competitionName: competition.competitionName || 'Unnamed Competition',
      competitionDescription: competition.competitionDescription || 'No description available',
      competitionType: competition.competitionType || 'N/A',
      duration: competition.duration || 0,
      questions: competition.questions || [],
      totalQuestions: competition.questions?.length || competition.totalQuestions || 0,
      creatorName: competition.creatorName || 'Unknown Creator',
    };

    return (
      <MotionCard
        elevation={4}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        transition={{ delay: index * 0.05 }}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 3,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        {/* Top badge for status */}
        {(isActive || isUpcoming || isEnded) && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 1,
            }}
          >
            <Chip
              size="small"
              label={isActive ? 'Active' : isUpcoming ? 'Upcoming' : 'Ended'}
              color={isActive ? 'success' : isUpcoming ? 'primary' : 'default'}
              sx={{
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                height: 24
              }}
            />
          </Box>
        )}

        {/* Bookmark button */}
        <IconButton
          size="small"
          onClick={(e) => handleBookmarkToggle(competition._id, e)}
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1,
            // bgcolor: isDark ? alpha(theme.palette.background.paper, 0.7) : alpha(theme.palette.common.white, 0.8),
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              bgcolor: isDark ? alpha(theme.palette.background.paper, 0.9) : theme.palette.common.white,
            }
          }}
        >
          {isBookmarked ?
            <Bookmark fontSize="small" color="primary" /> :
            <BookmarkBorder fontSize="small" color="action" />
          }
        </IconButton>

        {/* Premium badge for featured competitions */}
        {index % 3 === 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 4,
            }}
          />
        )}

        <CardContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.3,
                }}
              >
                {safeCompetition.competitionName}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                {/* Competition Type Chip */}
                <Chip
                  size="small"
                  label={safeCompetition.competitionType}
                  sx={{
                    fontWeight: 600,
                    bgcolor: safeCompetition.competitionType === 'MCQ' ?
                      alpha(theme.palette.info.main, 0.2) :
                      alpha(theme.palette.secondary.main, 0.2),
                    color: safeCompetition.competitionType === 'MCQ' ?
                      theme.palette.info.main :
                      theme.palette.secondary.main,
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(safeCompetition.creatorName)}&background=random`}
                  sx={{ width: 28, height: 28, mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {safeCompetition.creatorName}
                </Typography>
              </Box>
            </Box>

            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Tooltip title="Number of questions">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenuBook fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1.1rem' }} />
                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                      {safeCompetition.totalQuestions}
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title="Duration in minutes">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WatchLater fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1.1rem' }} />
                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                      {safeCompetition.duration} min
                    </Typography>
                  </Box>
                </Tooltip>

                <Tooltip title="Participants">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Group fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1.1rem' }} />
                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                      {participantCount}
                    </Typography>
                  </Box>
                </Tooltip>
              </Box>

              {/* Tags */}
              {competition.tags && competition.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {competition.tags.slice(0, 3).map((tag, tagIndex) => (
                    <Chip
                      key={tagIndex}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.7rem',
                        height: 22,
                        '& .MuiChip-label': { px: 0.8 },
                      }}
                    />
                  ))}
                  {competition.tags.length > 3 && (
                    <Chip
                      label={`+${competition.tags.length - 3}`}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        height: 22,
                        '& .MuiChip-label': { px: 0.8 },
                      }}
                    />
                  )}
                </Box>
              )}

              {/* Time status */}
              {renderTimeStatus(competition.timeStatus)}

              {/* Progress bar for joined competitions */}
              {isJoined && (
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Your progress
                    </Typography>
                    <Typography variant="caption" fontWeight={500} color="primary">
                      {progressPercent}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progressPercent}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: theme.palette.primary.main,
                      },
                    }}
                  />
                </Box>
              )}
            </Stack>
          </Stack>
        </CardContent>

        <CardActions sx={{ pt: 0 }}>
          <Button
            variant="contained"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleResultClick(competition);
            }}
            sx={{
              width: '100%',
              borderRadius: 2,
              py: 1.2,
              fontSize: '0.875rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
              }
            }}
          >
            View Result
          </Button>
        </CardActions>
      </MotionCard>
    );
  };

  // Result Detail Dialog
  const renderResultDialog = () => {
    if (!selectedCompetition || !dialogOpen) return null;

    return (
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }
        }}
      >
        <DialogTitle sx={{
          pb: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 700,
          bgcolor: isDark ? 'primary.dark' : 'primary.main',
          color: 'white'
        }}>
          Competition Result: {selectedCompetition.competitionName}
          <IconButton onClick={handleDialogClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          {resultLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : resultError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {resultError}
            </Alert>
          ) : resultData ? (
            <Grid container spacing={3}>
              {/* Result Summary */}
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  variant="outlined" 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
                    mb: 3
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                          {resultData.percentageScore}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Your Score
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={8}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            Total Score
                          </Typography>
                          <Typography variant="h6" fontWeight={600} color="success.main">
                            {resultData.totalScore || 'N/A'}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            Competition
                          </Typography>
                          <Typography variant="h6" fontWeight={600}>
                            {resultData.competitionName}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            Created By
                          </Typography>
                          <Typography variant="h6" fontWeight={600} color="primary">
                            {resultData.creatorName}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            Result Date
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {formatDate(resultData.scoreAssignedTime || resultData.createdAt)}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={6} sm={4}>
                          <Typography variant="body2" color="text.secondary">
                            Competition Type
                          </Typography>
                          <Chip 
                            size="small" 
                            label={resultData.competitionType}
                            color={resultData.competitionType === 'MCQ' ? 'info' : 'secondary'} 
                            sx={{ fontWeight: 600 }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              {/* Detailed Results */}
              {resultData.results && resultData.results.length > 0 ? (
                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Question Results
                  </Typography>
                  
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Question</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Your Answer</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Correct Answer</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Score</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {resultData.results.map((result, index) => (
                          <TableRow 
                            key={index}
                            sx={{ bgcolor: result.isCorrect ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.error.main, 0.05) }}
                          >
                            <TableCell>{result.questionText || `Question ${index + 1}`}</TableCell>
                            <TableCell>{result.userAnswer || 'No answer'}</TableCell>
                            <TableCell>{result.correctAnswer || 'N/A'}</TableCell>
                            <TableCell>{result.score}</TableCell>
                            <TableCell>
                              {result.isCorrect ? (
                                <Chip 
                                  size="small" 
                                  label="Correct" 
                                  color="success"
                                  icon={<CheckCircle fontSize="small" />}
                                  sx={{ fontWeight: 600 }}
                                />
                              ) : (
                                <Chip 
                                  size="small" 
                                  label="Incorrect" 
                                  color="error"
                                  icon={<ErrorOutline fontSize="small" />}
                                  sx={{ fontWeight: 600 }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Alert severity="info">
                    No detailed results available for this competition.
                  </Alert>
                </Grid>
              )}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" align="center">
              No result data available for this competition.
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            variant="contained"
            onClick={handleDialogClose}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
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
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </MotionBox>
      
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Sort by options */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Typography variant="body1" fontWeight={500} sx={{ mr: 2 }}>
            Sort by:
          </Typography>
          <div style={{ display: 'flex', gap: "10px" }} >
            <Button
              variant={sortOption === 'newest' ? 'contained' : 'outlined'}
              onClick={() => handleSortSelect('newest')}
              size="small"
              sx={{
                borderRadius: 2,
                py: 1,
                px: 2,
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: sortOption === 'newest' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                '&:hover': {
                  boxShadow: sortOption === 'newest' ? '0 6px 18px rgba(0,0,0,0.15)' : 'none',
                }
              }}
            >
              Newest
            </Button>

            <Button
              variant={sortOption === 'oldest' ? 'contained' : 'outlined'}
              onClick={() => handleSortSelect('oldest')}
              size="small"
              sx={{
                borderRadius: 2,
                py: 1,
                px: 2,
                fontSize: '0.875rem',
                fontWeight: 600,
                boxShadow: sortOption === 'oldest' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                '&:hover': {
                  boxShadow: sortOption === 'oldest' ? '0 6px 18px rgba(0,0,0,0.15)' : 'none',
                }
              }}
            >
              Oldest
            </Button>
          </div>
        </Box> */}

        {/* Competition results container */}
        <Grid container spacing={4}>
          {loading ? (
            // Skeleton loaders
            Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
              </Grid>
            ))
          ) : (
            <>
              {competitions.length === 0 ? (
                <Grid item xs={12} width={"100%"}>
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
                      You haven't completed any competitions yet. 
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
                </Grid>
              ) : (
                competitions.map((competition, index) => (
                  <Grid item xs={12} sm={6} md={4} key={competition._id || index}>
                    {renderCompetitionCard(competition, index)}
                  </Grid>
                ))
              )}
            </>
          )}
        </Grid>
        
        {/* Pagination controls */}
        {competitions.length > 0 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={pagination.pages}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}
      </Container>
      
      {/* Result detail dialog */}
      {renderResultDialog()}
    </Box>
  );
}

export default CompetitionResultsPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Alert,
  Badge,
  alpha,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  AccessTime,
  School,
  CheckCircle,
  Timer,
  EmojiEvents,
  TrendingUp,
  FilterList,
  ArrowDropDown,
  Search,
  Sort,
  Star,
  StarBorder,
  ArrowForward,
  MoreVert,
  Person,
  Group,
  Bolt,
  MenuBook,
  Info,
  ArrowUpward,
  Refresh,
  Verified,
  Code,
  WatchLater,
  VerifiedUser,
  Bookmark,
  BookmarkBorder,
  Flag,
  Assignment,
  Close
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import axios from 'axios';

// Constants for UTC time and current user

// Custom styled components using motion

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

// Handle response and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject({ message });
  }
);

const CompetitionPage = ({
  activeOnly = false,
  completedOnly = false,
  resultsView = false
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState([]);
  const [filter, setFilter] = useState(
    completedOnly ? 'joined' : activeOnly ? 'active' : 'upcoming'
  );
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10
  });
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('newest');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [bookmarkedCompetitions, setBookmarkedCompetitions] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      y: -8,
      boxShadow: "0px 10px 30px rgba(0,0,0,0.15)",
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    fetchCompetitions();
    // Initialize some bookmarked competitions for UI demonstration
    setBookmarkedCompetitions(['comp123', 'comp456']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page, activeOnly, completedOnly, sortOption]);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Map filter values to API endpoints
      let endpoint;
      switch (filter) {
        case 'active':
          endpoint = `/student/dashboard/competitions/active`;
          break;
        case 'joined':
          endpoint = `/student/dashboard/competitions/joined`;
          break;
        case 'upcoming':
        default:
          endpoint = `/student/dashboard/competitions/upcoming`;
          break;
      }

      // Build query parameters
      const params = {
        page,
        limit: 10,
        sort: sortOption
      };

      // Add additional filters if needed
      if (activeOnly) {
        params.competitionStatus = 'active';
      } else if (completedOnly) {
        params.competitionStatus = 'ended';
      }

      const response = await api.get(endpoint, { params });
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

  const handleFilterChange = (event, newValue) => {
    setFilter(newValue);
    setPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompetitionClick = (competition) => {
    // Set the selected competition and open the dialog instead of navigating
    setSelectedCompetition(competition);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleJoinCompetition = (competitionId) => {
    // Navigate to the competition exam page and pass the competition data
    navigate(`/student/competition/${competitionId}/exam`, {
      state: { competition: selectedCompetition }
    });
    setDialogOpen(false);
  };

  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  const handleSortSelect = (option) => {
    setSortOption(option);
    setSortAnchorEl(null);
  };

  const handleBookmarkToggle = (id, event) => {
    event.stopPropagation();
    if (bookmarkedCompetitions.includes(id)) {
      setBookmarkedCompetitions(bookmarkedCompetitions.filter(compId => compId !== id));
    } else {
      setBookmarkedCompetitions([...bookmarkedCompetitions, id]);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchCompetitions().then(() => {
      setTimeout(() => setIsRefreshing(false), 800);
    });
  };

  // Format countdown or time remaining
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
      <>
   
              
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
          padding: 4,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          backgroundColor: isDark ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
        }}
        onClick={() => handleCompetitionClick(competition)}
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
            bgcolor: isDark ? alpha(theme.palette.background.paper, 0.7) : alpha(theme.palette.common.white, 0.8),
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
              handleCompetitionClick(competition);
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
            View Details
          </Button>
        </CardActions>
      </MotionCard>
        </>
    );
  };

  // Competition Detail Dialog
  const renderCompetitionDialog = () => {
    if (!selectedCompetition) return null;

    const isJoined = selectedCompetition.status === 'joined' || selectedCompetition.participation?.isJoined;
    const isCompleted = selectedCompetition.participation?.completed;
    const isActive = selectedCompetition.status === 'active';
    const isEnded = selectedCompetition.status === 'ended';
    const canJoin = isActive && !isJoined;
    const hasTags = selectedCompetition.tags && selectedCompetition.tags.length > 0;

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
          fontWeight: 700
        }}>
          {selectedCompetition.competitionName}
          <IconButton onClick={handleDialogClose}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Left column - Details */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>Description</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedCompetition.competitionDescription ||
                      "No description available for this competition."}
                  </Typography>
                </Box>

                {hasTags && (
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>Tags</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedCompetition.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {selectedCompetition.timeStatus && (
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Time Information
                    </Typography>
                    <Stack direction="row" spacing={4}>
                      {selectedCompetition.startTiming && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">Start Time</Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {new Date(selectedCompetition.startTiming).toLocaleString()}
                          </Typography>
                        </Box>
                      )}

                      {selectedCompetition.endTiming && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">End Time</Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {new Date(selectedCompetition.endTiming).toLocaleString()}
                          </Typography>
                        </Box>
                      )}
                    </Stack>

                    {selectedCompetition.timeStatus && renderTimeStatus(selectedCompetition.timeStatus)}
                  </Box>
                )}
              </Stack>
            </Grid>

            {/* Right column - Stats */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Grid item xs={6} sm={4} md={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Competition Type</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedCompetition.competitionType}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={4} md={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Duration</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedCompetition.duration} minutes
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={4} md={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Questions</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedCompetition.questions?.length || selectedCompetition.totalQuestions || 0}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={4} md={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Created by</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedCompetition.creatorName}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={4} md={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Participants</Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {selectedCompetition.studentsJoined?.length || 0}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={6} sm={4} md={4}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Status</Typography>
                        <Chip
                          size="small"
                          label={isActive ? 'Active' : isJoined ? 'Ended' : 'Upcoming'}
                          color={isActive ? 'success' : isJoined ? 'default' : 'primary'}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          {isJoined ? (
            <Button
              variant="outlined"
              startIcon={<CheckCircle />}
              disabled
            >
              Completed
            </Button>
          ) : canJoin ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleJoinCompetition(selectedCompetition._id)}
              startIcon={<ArrowForward />}
            >
              Join Competition
            </Button>
          ) : isEnded ? (
            <Button
              variant="outlined"
              disabled
              startIcon={<Timer />}
            >
              Competition Ended
            </Button>
          ) : (
            <Button
              variant="outlined"
              disabled
              startIcon={<AccessTime />}
            >
              Not Yet Available
            </Button>
          )}

          <Button onClick={handleDialogClose} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <>
     <Box sx={{
          backgroundColor: isDark ? 'background.default' : '#f7f9fc',
          minHeight: '100vh',
          pb: 4
        }}>

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
                        > Test Your Skills 
                          
                        </Typography>
                        <Typography variant="body1" color={isDark ? 'text.secondary' : 'rgba(255,255,255,0.9)'}>
                          Explore and participate in various coding competitions to enhance your skills and win exciting prizes!
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
                            
                          >
                            {'Refresh Stats'}
                          </Button>
                        </Stack>
                      </Grid>
                    </Grid>
        </MotionBox>   
    <Container maxWidth="lg" sx={{ py: 3 }}>


      {/* Filters and sort options */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
        <Button
          variant={filter === 'upcoming' ? 'contained' : 'outlined'}
          onClick={(e) => handleFilterChange(e, 'upcoming')}
          size="large"
          sx={{
            flex: 1,
            borderRadius: 2,
            py: 1.2,
            fontSize: '0.875rem',
            fontWeight: 600,
            boxShadow: filter === 'upcoming' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
            '&:hover': {
              boxShadow: filter === 'upcoming' ? '0 6px 18px rgba(0,0,0,0.15)' : 'none',
            }
          }}
        >
          Upcoming
        </Button>

        <Button
          variant={filter === 'active' ? 'contained' : 'outlined'}
          onClick={(e) => handleFilterChange(e, 'active')}
          size="large"
          sx={{
            flex: 1,
            borderRadius: 2,
            py: 1.2,
            fontSize: '0.875rem',
            fontWeight: 600,
            boxShadow: filter === 'active' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
            '&:hover': {
              boxShadow: filter === 'active' ? '0 6px 18px rgba(0,0,0,0.15)' : 'none',
            }
          }}
        >
          Active
        </Button>

        <Button
          variant={filter === 'joined' ? 'contained' : 'outlined'}
          onClick={(e) => handleFilterChange(e, 'joined')}
          size="large"
          sx={{
            flex: 1,
            borderRadius: 2,
            py: 1.2,
            fontSize: '0.875rem',
            fontWeight: 600,
            boxShadow: filter === 'joined' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
            '&:hover': {
              boxShadow: filter === 'joined' ? '0 6px 18px rgba(0,0,0,0.15)' : 'none',
            }
          }}
        >
          Joined
        </Button>
      </Box>

      {/* Sort by options */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" fontWeight={500} sx={{ mr: 2 }}>
          Sort by:
        </Typography>
<div style={{ display: 'flex',  gap:"10px"}} >

        <Button
          variant={sortOption === 'newest' ? 'contained' : 'outlined'}
          onClick={(e) => handleSortSelect('newest')}
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
          onClick={(e) => handleSortSelect('oldest')}
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
      </Box>

      {/* Competition cards container */}
      <Grid container spacing={4}>
        {loading ? (
          // Skeleton loaders
          Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
          ))
        ) : (
          <>
            {competitions.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" align="center">
                  No competitions found. Try adjusting your filters or check back later.
                </Typography>
              </Grid>
            ) : (
              competitions.map((competition, index) => (
                <Grid item xs={12} sm={6} md={4} key={competition._id}>
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

      {/* Add the dialog component */}
      {renderCompetitionDialog()}
    </Container>
        </Box>
     </>
  );
};

export default CompetitionPage;

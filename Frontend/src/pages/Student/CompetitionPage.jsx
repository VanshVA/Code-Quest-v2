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
  alpha
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
  Flag
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import dashboardService from '../../services/dashboardService';

// Constants for UTC time and current user

// Custom styled components using motion
const MotionCard = motion(Card);
const MotionBox = motion(Box);

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
    completedOnly ? 'joined' : activeOnly ? 'active' : 'all'
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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
      
      // Define query parameters based on filters
      const params = {
        page,
        limit: 10,
        status: filter === 'all' ? '' : filter === 'new' ? 'new' : 'joined',
        sort: sortOption
      };
      
      // Add competition status filter if activeOnly or completedOnly
      if (activeOnly) {
        params.competitionStatus = 'active';
      } else if (completedOnly) {
        params.competitionStatus = 'ended';
      }
      
      const response = await dashboardService.getAvailableCompetitions(params);
      
      if (response.success) {
        setCompetitions(response.data.competitions);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to load competitions');
      }
    } catch (error) {
      setError('Error loading competitions. Please try again later.');
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
    // Set loading state for the clicked competition
    setLoadingStates(prev => ({ ...prev, [competition._id]: true }));
    
    setTimeout(() => {
      if (resultsView) {
        navigate(`/student/results/${competition._id}`);
      } else {
        navigate(`/student/competitions/${competition._id}`);
      }
      // Clear loading state (in case navigation is prevented)
      setLoadingStates(prev => ({ ...prev, [competition._id]: false }));
    }, 500); // Small delay to show loading effect
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

  // Render difficulty badge with appropriate color
  const renderDifficultyBadge = (difficulty) => {
    const color = 
      difficulty === 'easy' ? '#4caf50' :
      difficulty === 'medium' ? '#ff9800' :
      difficulty === 'hard' ? '#f44336' : '#757575';
    
    return (
      <Chip 
        size="small" 
        label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} 
        sx={{ 
          ml: 1, 
          fontWeight: 600, 
          color: 'white',
          bgcolor: color,
          '& .MuiChip-label': { px: 1 },
        }}
      />
    );
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
    const isJoined = competition.participation?.isJoined;
    const isCompleted = competition.participation?.completed;
    const isSubmitted = competition.participation?.submissionStatus === 'submitted';
    const isActive = competition.competitionStatus === 'active';
    const isEnded = competition.competitionStatus === 'ended';
    const isUpcoming = competition.competitionStatus === 'upcoming';
    const isBookmarked = bookmarkedCompetitions.includes(competition._id);
    const isLoading = loadingStates[competition._id];
    
    // Generate random values for the progress indicator and participants
    const progressPercent = Math.floor(Math.random() * 100);
    const participantCount = Math.floor(Math.random() * 200) + 10;
    
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
          padding:4,
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
        
        <CardContent sx={{  pt: 2 }}>
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
                {competition.competitionName}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                {renderDifficultyBadge(competition.difficulty)}
                
                {/* Show premium tag for some competitions */}
                {index % 5 === 0 && (
                  <Chip 
                    icon={<Verified sx={{ fontSize: '1rem !important' }} />}
                    size="small" 
                    label="Premium" 
                    sx={{
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 215, 0, 0.15)' : 'rgba(255, 215, 0, 0.2)',
                      color: '#FFB700',
                      fontWeight: 600,
                      border: '1px solid rgba(255, 215, 0, 0.3)',
                      '& .MuiChip-label': { px: 0.5 },
                      '& .MuiChip-icon': { color: '#FFB700' }
                    }}
                  />
                )}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Avatar 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(competition.creatorInfo.name)}&background=random`}
                  sx={{ width: 28, height: 28, mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {competition.creatorInfo.name}
                </Typography>
              </Box>
            </Box>
            
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Tooltip title="Number of questions">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenuBook fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1.1rem' }} />
                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                      {competition.totalQuestions}
                    </Typography>
                  </Box>
                </Tooltip>
                
                <Tooltip title="Duration in minutes">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <WatchLater fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '1.1rem' }} />
                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                      {competition.duration} min
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
                      height: 6, 
                      borderRadius: 1,
                      bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    }} 
                  />
                </Box>
              )}
            </Stack>
          </Stack>
        </CardContent>
        
        <Divider />
        
        <CardActions 
          sx={{ 
            justifyContent: 'space-between', 
            px: 3, 
            py: 2, 
            bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'
          }}
        >
          {isEnded && isSubmitted ? (
            <Chip 
              icon={<CheckCircle fontSize="small" />}
              label="Submitted" 
              color="success" 
              variant="outlined"
              size="small"
            />
          ) : isActive && isJoined ? (
            <Chip 
              icon={<Timer fontSize="small" />}
              label="In Progress" 
              color="primary" 
              size="small"
              variant="outlined"
            />
          ) : isJoined ? (
            <Chip 
              icon={<Person fontSize="small" />}
              label="Joined" 
              color="primary" 
              size="small"
              variant="outlined"
            />
          ) : (
            <Chip 
              icon={<Info fontSize="small" />}
              label="Not Joined" 
              color="default" 
              size="small"
              variant="outlined"
            />
          )}
          
          <Button
            color="primary"
            size="small"
            variant={isActive && isJoined && !isCompleted ? "contained" : "outlined"}
            endIcon={<ArrowForward />}
            disabled={isLoading}
            sx={{ 
              fontWeight: 600,
              borderRadius: '20px',
              px: 2,
              '&.MuiButton-contained': {
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleCompetitionClick(competition);
            }}
          >
            {isLoading ? (
              <CircularProgress size={16} sx={{ mx: 1 }} />
            ) : isEnded && isSubmitted ? (
              "View Results"
            ) : isActive && isJoined && !isCompleted ? (
              "Continue"
            ) : isActive && isJoined && isCompleted && !isSubmitted ? (
              "Submit"
            ) : (
              "View Details"
            )}
          </Button>
        </CardActions>
      </MotionCard>
    );
  };

  // Generate page title based on props
  const getPageTitle = () => {
    if (resultsView) return "Competition Results";
    if (activeOnly) return "Active Competitions";
    if (completedOnly) return "Completed Competitions";
    return "Available Competitions";
  };
  
  // Skeleton loaders for cards
  const renderSkeletonCards = () => {
    return Array(6).fill().map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
        <Paper
          elevation={2}
          sx={{
            height: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            p: 3,
          }}
        >
          <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={24} sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={28} height={28} sx={{ mr: 1 }} />
            <Skeleton variant="text" width="50%" height={20} />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Skeleton variant="text" width="20%" height={20} />
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="text" width="25%" height={20} />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Skeleton variant="rectangular" width={60} height={22} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={70} height={22} sx={{ borderRadius: 1 }} />
          </Box>
          
          <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 1, mb: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 16 }} />
            <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 16 }} />
          </Box>
        </Paper>
      </Grid>
    ));
  };

  return (
    <Box 
      sx={{ 
        backgroundColor: isDark ? 'background.default' : '#f7f9fc',
        minHeight: '100vh',
        pb: 6
      }}
    >
      
      {/* Hero Section */}
      <Box 
        sx={{ 
          bgcolor: isDark ? 'rgba(9, 9, 9, 0.46)' : 'primary.main',
          py: { xs: 4, md: 6 },
          mb: 4,
          borderRadius: 2,
          color: isDark ? 'white' : ' white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background pattern */}
        {!isDark && (
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              // background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        )}
        
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 1,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    background: isDark ? 
                      'linear-gradient(15deg, #bc4037 10%, #f47061 90%)' : 
                      'none',
                    WebkitBackgroundClip: isDark ? 'text' : 'unset',
                    WebkitTextFillColor: isDark ? 'transparent' : 'unset',
                  }}
                >
                  {getPageTitle()}
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 400, 
                    mb: 3, 
                    color: isDark ? 'text.secondary' : 'rgba(255,255,255,0.9)',
                    maxWidth: 600
                  }}
                >
                  {resultsView ? 
                    "View and analyze your competition results and performance metrics." :
                    activeOnly ? 
                      "Join ongoing competitions to test your skills in real-time challenges." :
                      completedOnly ?
                        "Review your completed competitions and analyze your results." :
                        "Discover coding challenges and competitions to enhance your skills."
                  }
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)',
                   
                      px: 2,
                      py: 1,
                      borderRadius: '100px'
                    }}
                  >
                    <EmojiEvents sx={{ mr: 1, color: isDark ? theme.palette.primary.main : 'rgba(255,255,255,0.9)' }} />
                    <Typography variant="body2" fontWeight={500}  sx={{ mr: 1, color: isDark ? theme.palette.primary.main : 'rgba(255,255,255,0.9)' }}>
                      {pagination.total || 0} Competitions Available
                    </Typography>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.2)',
                      px: 2,
                      py: 1,
                      borderRadius: '100px'
                    }}
                  >
                    <Bolt sx={{ mr: 1, color: isDark ? theme.palette.primary.main : 'rgba(255,255,255,0.9)' }} />
                    <Typography variant="body2" fontWeight={500}  sx={{ mr: 1, color: isDark ? theme.palette.primary.main : 'rgba(255,255,255,0.9)' }}>
                      Active Challenges: {competitions.filter(c => c.competitionStatus === 'active').length}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </MotionBox>
        </Container>
      </Box>
      
      <Container maxWidth="lg">
        {/* Filter and Sort Controls */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            mb: 3
          }}
        >
          {!resultsView && !completedOnly && (
            <Paper 
              elevation={1} 
              sx={{ 
                borderRadius: '100px',
                overflow: 'hidden',
                bgcolor: isDark ? 'background.paper' : 'background.paper',
                boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.05)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
              }}
            >
              <Tabs
                value={filter}
                onChange={handleFilterChange}
                indicatorColor="primary"
                textColor="primary"
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
              >
                <Tab 
                  value="all" 
                  label="All Competitions" 
                  icon={<FilterList />} 
                  iconPosition="start"
                  sx={{ 
                    minHeight: 48,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3
                  }}
                />
                <Tab 
                  value="joined" 
                  label="Joined" 
                  icon={<Person />} 
                  iconPosition="start"
                  sx={{ 
                    minHeight: 48,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3
                  }}
                />
                <Tab 
                  value="new" 
                  label="New" 
                  icon={<TrendingUp />} 
                  iconPosition="start"
                  sx={{ 
                    minHeight: 48,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3
                  }}
                />
              </Tabs>
            </Paper>
          )}
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Sort />}
              endIcon={<ArrowDropDown />}
              onClick={handleSortClick}
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '8px',
                borderWidth: '1px',
                '&:hover': {
                  borderWidth: '1px'
                }
              }}
            >
              Sort by
            </Button>
            
            <IconButton 
              color="primary" 
              onClick={handleRefresh}
              sx={{ 
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }
              }}
            >
              <Refresh sx={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            </IconButton>
            
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={handleSortClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              sx={{ '& .MuiPaper-root': { width: 180, borderRadius: 2 } }}
            >
              <MenuItem 
                selected={sortOption === 'newest'} 
                onClick={() => handleSortSelect('newest')}
                sx={{ py: 1.5 }}
              >
                <ArrowUpward fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">Newest First</Typography>
              </MenuItem>
              <MenuItem 
                selected={sortOption === 'oldest'} 
                onClick={() => handleSortSelect('oldest')}
                sx={{ py: 1.5 }}
              >
                <ArrowUpward fontSize="small" sx={{ mr: 1, transform: 'rotate(180deg)', color: 'primary.main' }} />
                <Typography variant="body2">Oldest First</Typography>
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem 
                selected={sortOption === 'difficulty_asc'} 
                onClick={() => handleSortSelect('difficulty_asc')}
                sx={{ py: 1.5 }}
              >
                <Typography variant="body2">Easiest First</Typography>
              </MenuItem>
              <MenuItem 
                selected={sortOption === 'difficulty_desc'} 
                onClick={() => handleSortSelect('difficulty_desc')}
                sx={{ py: 1.5 }}
              >
                <Typography variant="body2">Hardest First</Typography>
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem 
                selected={sortOption === 'popular'} 
                onClick={() => handleSortSelect('popular')}
                sx={{ py: 1.5 }}
              >
                <Star fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                <Typography variant="body2">Most Popular</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        
        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              '& .MuiAlert-icon': { alignItems: 'center' }
            }}
          >
            {error}
          </Alert>
        )}
        
        {/* Competition Grid with Skeleton Loaders */}
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {loading ? renderSkeletonCards() : (
              competitions.map((competition, index) => (
                <Grid item xs={12} sm={6} md={4} key={competition._id || index}>
                  {renderCompetitionCard(competition, index)}
                </Grid>
              ))
            )}
          </Grid>
        </MotionBox>
        
        {/* Empty State */}
        {!loading && competitions.length === 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={2}
              sx={{
                py: 6,
                px: 3,
                borderRadius: 3,
                textAlign: 'center',
                bgcolor: isDark ? 'background.paper' : 'background.paper',
              }}
            >
              <Flag sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                No competitions found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                {filter === 'joined' 
                  ? "You haven't joined any competitions yet. Explore available competitions and join one to get started."
                  : filter === 'new'
                    ? "There are no new competitions available at the moment. Please check back later."
                    : "No competitions match the current filters. Try changing your filter settings or check back later."
                }
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1.2,
                  borderRadius: '8px'
                }}
              >
                Refresh
              </Button>
            </Paper>
          </MotionBox>
        )}
        
        {/* Pagination */}
        {!loading && competitions.length > 0 && pagination.pages > 1 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4,
              mb: 2
            }}
          >
            <Paper
              elevation={2}
              sx={{ 
                p: 1, 
                borderRadius: '100px',
                bgcolor: isDark ? 'background.paper' : 'background.paper',
              }}
            >
              <Pagination 
                count={pagination.pages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                size={isSmall ? "small" : "medium"}
                siblingCount={isSmall ? 0 : 1}
              />
            </Paper>
          </MotionBox>
        )}
        
        {/* Show current page stats */}
        {!loading && competitions.length > 0 && (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {competitions.length} of {pagination.total} competitions
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CompetitionPage;
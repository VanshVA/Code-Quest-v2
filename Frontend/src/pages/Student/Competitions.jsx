import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider, 
  IconButton, 
  TextField, 
  InputAdornment, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Chip, 
  Pagination, 
  Menu, 
  Tooltip,
  Skeleton,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  SortByAlpha, 
  DateRange, 
  AccessTime, 
  ArrowForward, 
  GroupWork, 
  MoreVert, 
  Code,
  Timer,
  EmojiEvents,
  School,
  Bolt,
  FilterAlt,
  Close
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';

// Motion components
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const Competitions = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState([]);
  const [filteredCompetitions, setFilteredCompetitions] = useState([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('upcoming');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  
  useEffect(() => {
    // Simulating API call to fetch competitions
    const fetchCompetitions = async () => {
      setTimeout(() => {
        const dummyCompetitions = [
          {
            id: 1,
            title: "Algorithm Challenge",
            description: "Test your algorithm skills with complex problems that require optimal solutions. This competition focuses on efficiency and correctness.",
            date: "2025-06-02",
            time: "14:00-16:00",
            status: "upcoming",
            participants: 128,
            maxParticipants: 200,
            difficulty: "Hard",
            category: "Algorithms",
            duration: 120, // minutes
            prizes: ["$500", "$250", "$100"],
            prerequisites: ["Algorithm fundamentals", "Data structures", "Problem-solving skills"],
            creator: "Prof. Alan Turing",
            image: "/static/images/competitions/algorithm.jpg"
          },
          {
            id: 2,
            title: "Data Structures 101",
            description: "Master fundamental data structures by solving problems related to arrays, linked lists, trees, and graphs.",
            date: "2025-06-05",
            time: "10:00-12:00",
            status: "upcoming",
            participants: 95,
            maxParticipants: 150,
            difficulty: "Medium",
            category: "Data Structures",
            duration: 120,
            prizes: ["$300", "$150", "$75"],
            prerequisites: ["Basic programming", "Knowledge of arrays", "Understanding of pointers"],
            creator: "Dr. Jane Smith",
            image: "/static/images/competitions/data-structures.jpg"
          },
          {
            id: 3,
            title: "Web Development Contest",
            description: "Create responsive web applications using modern frameworks and technologies within the time limit.",
            date: "2025-06-10",
            time: "15:00-17:30",
            status: "upcoming",
            participants: 76,
            maxParticipants: 100,
            difficulty: "Easy",
            category: "Web Development",
            duration: 150,
            prizes: ["$400", "$200", "$100"],
            prerequisites: ["HTML/CSS", "JavaScript", "React or Angular"],
            creator: "Tech Innovators",
            image: "/static/images/competitions/web-dev.jpg"
          },
          {
            id: 4,
            title: "Python Mastery",
            description: "Showcase your Python skills by solving challenges related to data analysis, automation, and algorithms.",
            date: "2025-05-28",
            time: "13:00-15:00",
            status: "completed",
            participants: 112,
            maxParticipants: 120,
            difficulty: "Medium",
            category: "Python",
            duration: 120,
            prizes: ["$400", "$200", "$100"],
            prerequisites: ["Python fundamentals", "Libraries knowledge", "Problem-solving skills"],
            creator: "Python Developers Association",
            image: "/static/images/competitions/python.jpg",
            userResult: {
              rank: 3,
              score: 92,
              timeSpent: 105, // minutes
            }
          },
          {
            id: 5,
            title: "JavaScript Fundamentals",
            description: "Test your knowledge of JavaScript core concepts, ES6 features, and DOM manipulation.",
            date: "2025-05-22",
            time: "14:00-15:30",
            status: "completed",
            participants: 87,
            maxParticipants: 100,
            difficulty: "Easy",
            category: "JavaScript",
            duration: 90,
            prizes: ["$300", "$150", "$75"],
            prerequisites: ["Basic JavaScript", "DOM knowledge", "ES6 features"],
            creator: "JS Enthusiasts",
            image: "/static/images/competitions/javascript.jpg",
            userResult: {
              rank: 12,
              score: 78,
              timeSpent: 85,
            }
          },
          {
            id: 6,
            title: "Machine Learning Challenge",
            description: "Develop models to solve real-world problems using machine learning algorithms and techniques.",
            date: "2025-06-15",
            time: "09:00-13:00",
            status: "upcoming",
            participants: 62,
            maxParticipants: 80,
            difficulty: "Hard",
            category: "Machine Learning",
            duration: 240,
            prizes: ["$1000", "$500", "$250"],
            prerequisites: ["Python", "ML libraries", "Data preprocessing"],
            creator: "AI Research Lab",
            image: "/static/images/competitions/ml.jpg"
          },
          {
            id: 7,
            title: "Database Design",
            description: "Create efficient database schemas and write complex SQL queries to solve business problems.",
            date: "2025-06-08",
            time: "11:00-13:00",
            status: "upcoming",
            participants: 45,
            maxParticipants: 60,
            difficulty: "Medium",
            category: "Databases",
            duration: 120,
            prizes: ["$350", "$175", "$75"],
            prerequisites: ["SQL fundamentals", "Database normalization", "Query optimization"],
            creator: "DB Masters",
            image: "/static/images/competitions/database.jpg"
          },
          {
            id: 8,
            title: "C++ Challenge",
            description: "Demonstrate your C++ programming skills by solving complex algorithmic problems efficiently.",
            date: "2025-05-15",
            time: "10:00-12:30",
            status: "completed",
            participants: 102,
            maxParticipants: 120,
            difficulty: "Hard",
            category: "C++",
            duration: 150,
            prizes: ["$500", "$250", "$100"],
            prerequisites: ["Advanced C++", "STL", "Problem-solving skills"],
            creator: "C++ Community",
            image: "/static/images/competitions/cpp.jpg",
            userResult: {
              rank: 25,
              score: 65,
              timeSpent: 148,
            }
          }
        ];
        
        setCompetitions(dummyCompetitions);
        setFilteredCompetitions(dummyCompetitions.filter(comp => comp.status === 'upcoming'));
        setLoading(false);
      }, 1500);
    };
    
    fetchCompetitions();
  }, []);
  
  // Filter competitions
  useEffect(() => {
    let filtered = [...competitions];
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(comp => comp.status === selectedStatus);
    }
    
    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(comp => comp.difficulty.toLowerCase() === selectedDifficulty);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(comp => comp.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(comp => 
        comp.title.toLowerCase().includes(query) || 
        comp.description.toLowerCase().includes(query) ||
        comp.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredCompetitions(filtered);
    setPage(1); // Reset to first page after filtering
  }, [selectedStatus, selectedDifficulty, selectedCategory, searchQuery, competitions]);
  
  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return theme.palette.success.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'hard':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };
  
  // Get status color and label
  const getStatusInfo = (status, date) => {
    const competitionDate = new Date(date);
    const today = new Date();
    
    // Calculate days remaining
    const diffTime = competitionDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch (status) {
      case 'upcoming':
        return {
          color: theme.palette.info.main,
          label: diffDays <= 3 ? `Starting in ${diffDays} day${diffDays === 1 ? '' : 's'}` : 'Upcoming',
          bgColor: 'rgba(25, 118, 210, 0.1)'
        };
      case 'live':
        return {
          color: theme.palette.error.main,
          label: 'Live Now',
          bgColor: 'rgba(244, 67, 54, 0.1)'
        };
      case 'completed':
        return {
          color: theme.palette.success.main,
          label: 'Completed',
          bgColor: 'rgba(76, 175, 80, 0.1)'
        };
      default:
        return {
          color: 'text.secondary',
          label: status,
          bgColor: 'rgba(0, 0, 0, 0.05)'
        };
    }
  };
  
  // Handle filter menu
  const handleOpenFilterMenu = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleCloseFilterMenu = () => {
    setFilterAnchorEl(null);
  };
  
  // Handle status change
  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    handleCloseFilterMenu();
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
    handleCloseFilterMenu();
  };
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    handleCloseFilterMenu();
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('upcoming');
    setSelectedDifficulty('all');
    setSelectedCategory('all');
    handleCloseFilterMenu();
  };
  
  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  
  // Handle join competition
  const handleJoinClick = (competition) => {
    setSelectedCompetition(competition);
    setJoinDialogOpen(true);
  };
  
  // Handle dialog close
  const handleCloseJoinDialog = () => {
    setJoinDialogOpen(false);
    setSelectedCompetition(null);
  };
  
  // Handle confirm join
  const handleConfirmJoin = () => {
    // In a real app, this would make an API call to join the competition
    navigate(`/dashboard/competition/waiting/${selectedCompetition.id}`);
  };
  
  // Get paginated competitions
  const getPaginatedCompetitions = () => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCompetitions.slice(startIndex, endIndex);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Get array of categories
  const categories = [...new Set(competitions.map(comp => comp.category))];

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        maxWidth: '1600px',
        mx: 'auto',
      }}
    >
      {/* Header with Filters */}
      <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="800" gutterBottom>
              Competitions
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Participate in coding challenges and test your skills against other students.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mt: { xs: 2, sm: 0 } }}>
            <Button
              variant={selectedStatus === 'upcoming' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleStatusChange('upcoming')}
              sx={{
                borderRadius: '20px',
                px: 2,
                ...(selectedStatus === 'upcoming' ? {
                  bgcolor: 'var(--theme-color)',
                  '&:hover': { bgcolor: 'var(--hover-color)' },
                } : {})
              }}
            >
              Upcoming
            </Button>
            <Button
              variant={selectedStatus === 'live' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleStatusChange('live')}
              sx={{
                borderRadius: '20px',
                px: 2,
                ...(selectedStatus === 'live' ? {
                  bgcolor: 'var(--theme-color)',
                  '&:hover': { bgcolor: 'var(--hover-color)' },
                } : {})
              }}
            >
              Live
            </Button>
            <Button
              variant={selectedStatus === 'completed' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleStatusChange('completed')}
              sx={{
                borderRadius: '20px',
                px: 2,
                ...(selectedStatus === 'completed' ? {
                  bgcolor: 'var(--theme-color)',
                  '&:hover': { bgcolor: 'var(--hover-color)' },
                } : {})
              }}
            >
              Completed
            </Button>
            <Button
              variant={selectedStatus === 'all' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => handleStatusChange('all')}
              sx={{
                borderRadius: '20px',
                px: 2,
                ...(selectedStatus === 'all' ? {
                  bgcolor: 'var(--theme-color)',
                  '&:hover': { bgcolor: 'var(--hover-color)' },
                } : {})
              }}
            >
              All
            </Button>
          </Box>
        </Box>
        
        {/* Search and Filter */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search competitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                sx: { borderRadius: '12px' }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(0,0,0,0.1)',
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterAlt />}
              onClick={handleOpenFilterMenu}
              sx={{ 
                borderRadius: '12px',
                borderColor: 'rgba(0,0,0,0.1)',
                '&:hover': {
                  borderColor: 'var(--theme-color)',
                  backgroundColor: 'rgba(var(--theme-color-rgb), 0.05)',
                },
              }}
            >
              Filter
              {(selectedDifficulty !== 'all' || selectedCategory !== 'all') && (
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    bgcolor: 'var(--theme-color)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {(selectedDifficulty !== 'all' ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0)}
                </Box>
              )}
            </Button>
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleCloseFilterMenu}
              PaperProps={{
                sx: {
                  width: 280,
                  p: 2,
                  borderRadius: '16px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Filter Competitions
                </Typography>
                <IconButton size="small" onClick={handleCloseFilterMenu}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {/* Difficulty filter */}
              <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                Difficulty
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label="All" 
                  onClick={() => handleDifficultyChange('all')}
                  color={selectedDifficulty === 'all' ? 'primary' : 'default'}
                  variant={selectedDifficulty === 'all' ? 'filled' : 'outlined'}
                  sx={{ borderRadius: '8px' }}
                />
                <Chip 
                  label="Easy" 
                  onClick={() => handleDifficultyChange('easy')}
                  color={selectedDifficulty === 'easy' ? 'success' : 'default'}
                  variant={selectedDifficulty === 'easy' ? 'filled' : 'outlined'}
                  sx={{ borderRadius: '8px' }}
                />
                <Chip 
                  label="Medium" 
                  onClick={() => handleDifficultyChange('medium')}
                  color={selectedDifficulty === 'medium' ? 'warning' : 'default'}
                  variant={selectedDifficulty === 'medium' ? 'filled' : 'outlined'}
                  sx={{ borderRadius: '8px' }}
                />
                <Chip 
                  label="Hard" 
                  onClick={() => handleDifficultyChange('hard')}
                  color={selectedDifficulty === 'hard' ? 'error' : 'default'}
                  variant={selectedDifficulty === 'hard' ? 'filled' : 'outlined'}
                  sx={{ borderRadius: '8px' }}
                />
              </Box>
              
              {/* Category filter */}
              <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                Category
              </Typography>
              <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  label="All" 
                  onClick={() => handleCategoryChange('all')}
                  color={selectedCategory === 'all' ? 'primary' : 'default'}
                  variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
                  sx={{ borderRadius: '8px' }}
                />
                {categories.map(category => (
                  <Chip 
                    key={category}
                    label={category} 
                    onClick={() => handleCategoryChange(category)}
                    color={selectedCategory === category ? 'primary' : 'default'}
                    variant={selectedCategory === category ? 'filled' : 'outlined'}
                    sx={{ borderRadius: '8px' }}
                  />
                ))}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="text"
                  onClick={handleResetFilters}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Reset Filters
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCloseFilterMenu}
                  size="small"
                  sx={{ 
                    bgcolor: 'var(--theme-color)', 
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'var(--hover-color)' },
                  }}
                >
                  Apply Filters
                </Button>
              </Box>
            </Menu>
            
            <Button
              variant="contained"
              startIcon={<SortByAlpha />}
              sx={{ 
                borderRadius: '12px',
                bgcolor: 'var(--theme-color)',
                '&:hover': { bgcolor: 'var(--hover-color)' },
              }}
            >
              Sort
            </Button>
          </Grid>
        </Grid>
        
        {/* Active filters */}
        {(searchQuery || selectedDifficulty !== 'all' || selectedCategory !== 'all') && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {searchQuery && (
              <Chip
                label={`Search: ${searchQuery}`}
                onDelete={() => setSearchQuery('')}
                sx={{ borderRadius: '8px' }}
              />
            )}
            {selectedDifficulty !== 'all' && (
              <Chip
                label={`Difficulty: ${selectedDifficulty}`}
                onDelete={() => setSelectedDifficulty('all')}
                sx={{ borderRadius: '8px' }}
              />
            )}
            {selectedCategory !== 'all' && (
              <Chip
                label={`Category: ${selectedCategory}`}
                onDelete={() => setSelectedCategory('all')}
                sx={{ borderRadius: '8px' }}
              />
            )}
            {(searchQuery || selectedDifficulty !== 'all' || selectedCategory !== 'all') && (
              <Chip
                label="Clear All"
                onClick={handleResetFilters}
                sx={{ borderRadius: '8px', fontWeight: 'bold' }}
              />
            )}
          </Box>
        )}
      </MotionBox>
      
      {/* Competition Cards */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '16px' }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredCompetitions.length === 0 ? (
        <MotionBox
          variants={itemVariants}
          sx={{ 
            textAlign: 'center',
            p: 8,
          }}
        >
          <Box 
            component="img"
            src="/static/illustrations/empty-search.svg"
            alt="No competitions found"
            sx={{
              width: '100%',
              maxWidth: 300,
              mb: 4,
              opacity: 0.6,
            }}
          />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            No competitions found
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Try adjusting your filters or search query to find competitions.
          </Typography>
          <Button
            variant="contained"
            onClick={handleResetFilters}
            sx={{
              bgcolor: 'var(--theme-color)',
              borderRadius: '12px',
              px: 3,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 8px 16px rgba(var(--theme-color-rgb), 0.2)',
              '&:hover': {
                bgcolor: 'var(--hover-color)',
              },
            }}
          >
            Reset Filters
          </Button>
        </MotionBox>
      ) : (
        <Box>
          <Grid container spacing={3}>
            {getPaginatedCompetitions().map((competition) => {
              const statusInfo = getStatusInfo(competition.status, competition.date);
              
              return (
                <Grid item xs={12} sm={6} md={4} key={competition.id}>
                  <MotionCard
                    variants={itemVariants}
                    whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                    sx={{ 
                      borderRadius: '16px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Status indicator */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '20px',
                        bgcolor: statusInfo.bgColor,
                        color: statusInfo.color,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        zIndex: 1,
                      }}
                    >
                      {statusInfo.label}
                    </Box>
                    
                    {/* Featured ribbon for top competitions */}
                    {competition.participants > 100 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 20,
                          left: -30,
                          width: 120,
                          textAlign: 'center',
                          transform: 'rotate(-45deg)',
                          bgcolor: theme.palette.warning.main,
                          color: 'white',
                          py: 0.5,
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          zIndex: 1,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      >
                        FEATURED
                      </Box>
                    )}
                    
                    {/* Competition image */}
                    <Box
                      sx={{
                        height: 160,
                        backgroundImage: competition.image ? 
                          `url(${competition.image})` : 
                          `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 2,
                          zIndex: 1,
                          color: 'white',
                          backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                        }}
                      >
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={competition.difficulty}
                            size="small"
                            sx={{
                              bgcolor: getDifficultyColor(competition.difficulty),
                              color: 'white',
                              fontWeight: 'bold',
                              height: 24,
                              fontSize: '0.675rem',
                            }}
                          />
                          <Chip
                            label={competition.category}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              fontWeight: 'bold',
                              height: 24,
                              fontSize: '0.675rem',
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                        {competition.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        color="textSecondary" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          overflow: 'hidden',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 3,
                          height: 60,
                        }}
                      >
                        {competition.description}
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DateRange fontSize="small" sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                            <Typography variant="body2">
                              {new Date(competition.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTime fontSize="small" sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                            <Typography variant="body2">
                              {competition.time.split('-')[0]}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <GroupWork fontSize="small" sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                            <Typography variant="body2">
                              {competition.participants}/{competition.maxParticipants}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Timer fontSize="small" sx={{ mr: 1, color: 'text.secondary', fontSize: '1rem' }} />
                            <Typography variant="body2">
                              {competition.duration} min
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      {competition.userResult && (
                        <Box 
                          sx={{ 
                            mt: 2, 
                            p: 1.5, 
                            borderRadius: '12px', 
                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography variant="body2" fontWeight="medium">
                            Your Result:
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              color={competition.userResult.rank <= 3 ? 'warning.main' : 'text.primary'}
                            >
                              Rank: #{competition.userResult.rank}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ ml: 2 }}
                              fontWeight="bold"
                              color={
                                competition.userResult.score >= 90 ? 'success.main' :
                                competition.userResult.score >= 70 ? 'primary.main' :
                                competition.userResult.score >= 50 ? 'warning.main' : 'error.main'
                              }
                            >
                              Score: {competition.userResult.score}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/dashboard/competition/${competition.id}`)}
                        sx={{ 
                          textTransform: 'none',
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.05)',
                          },
                        }}
                      >
                        View Details
                      </Button>
                      
                      <Box sx={{ flexGrow: 1 }} />
                      
                      {competition.status === 'upcoming' && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleJoinClick(competition)}
                          sx={{
                            bgcolor: 'var(--theme-color)',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 2,
                            '&:hover': { bgcolor: 'var(--hover-color)' },
                          }}
                        >
                          Join
                        </Button>
                      )}
                      
                      {competition.status === 'completed' && (
                        <Button
                          variant="outlined"
                          size="small"
                          endIcon={<ArrowForward fontSize="small" />}
                          onClick={() => navigate(`/dashboard/results/detail/${competition.id}`)}
                          sx={{
                            borderColor: 'var(--theme-color)',
                            color: 'var(--theme-color)',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                              borderColor: 'var(--hover-color)',
                              backgroundColor: 'rgba(var(--theme-color-rgb), 0.05)',
                            },
                          }}
                        >
                          See Results
                        </Button>
                      )}
                      
                      {competition.status === 'live' && (
                        <Button
                          variant="contained"
                          size="small"
                          color="error"
                          onClick={() => navigate(`/dashboard/competition/editor/${competition.id}`)}
                          sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 2,
                          }}
                        >
                          Start Now
                        </Button>
                      )}
                    </CardActions>
                  </MotionCard>
                </Grid>
              );
            })}
          </Grid>
          
          {/* Pagination */}
          {filteredCompetitions.length > itemsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={Math.ceil(filteredCompetitions.length / itemsPerPage)} 
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: '8px',
                  },
                  '& .Mui-selected': {
                    bgcolor: 'var(--theme-color) !important',
                    color: 'white',
                  },
                }}
              />
            </Box>
          )}
        </Box>
      )}
      
      {/* Join Competition Dialog */}
      <Dialog
        open={joinDialogOpen}
        onClose={handleCloseJoinDialog}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1,
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEvents sx={{ mr: 1, color: 'var(--theme-color)' }} />
            Join Competition
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to join <strong>{selectedCompetition?.title}</strong>. The competition will start on{' '}
            <strong>
              {selectedCompetition && new Date(selectedCompetition.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </strong>{' '}
            at <strong>{selectedCompetition?.time.split('-')[0]}</strong>.
          </DialogContentText>
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Competition Details:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Duration:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {selectedCompetition?.duration} minutes
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Difficulty:
                </Typography>
                <Typography 
                  variant="body2" 
                  fontWeight="medium"
                  sx={{ 
                    color: selectedCompetition && getDifficultyColor(selectedCompetition.difficulty)
                  }}
                >
                  {selectedCompetition?.difficulty}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Category:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {selectedCompetition?.category}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="textSecondary">
                  Participants:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {selectedCompetition?.participants}/{selectedCompetition?.maxParticipants}
                </Typography>
              </Grid>
            </Grid>
            
            {selectedCompetition?.prerequisites && selectedCompetition.prerequisites.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Prerequisites:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  {selectedCompetition.prerequisites.map((prereq, index) => (
                    <Typography component="li" variant="body2" key={index}>
                      {prereq}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}
            
            <Box sx={{ mb: 0 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Prizes:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {selectedCompetition?.prizes.map((prize, index) => (
                  <Chip 
                    key={index}
                    label={`${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'}: ${prize}`}
                    sx={{
                      borderRadius: '8px',
                      bgcolor: index === 0 ? 'warning.main' : index === 1 ? 'grey.400' : index === 2 ? '#cd7f32' : 'primary.main',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseJoinDialog}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmJoin}
            variant="contained"
            sx={{
              borderRadius: '8px',
              bgcolor: 'var(--theme-color)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: 'var(--hover-color)' },
            }}
          >
            Confirm & Join
          </Button>
        </DialogActions>
      </Dialog>
    </MotionBox>
  );
};

export default Competitions;
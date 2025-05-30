import React, { useState, useEffect } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search,
  FilterList,
  ArrowDropDown,
  EmojiEvents,
  Star,
  Code,
  BarChart,
  ArrowUpward,
  WorkspacePremium,
  Verified,
  Grade,
  Close,
  School,
  Public,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Sample data for the leaderboard
const leaderboardData = [
  {
    id: 1,
    username: 'CodeNinja',
    name: 'Sarah Chen',
    avatar: '/assets/avatars/user1.jpg',
    score: 9875,
    solved: 387,
    rank: 1,
    tier: 'Diamond',
    change: 0,
    streak: 65,
    country: 'United States',
    badges: ['contest_winner', 'algorithm_master', 'challenge_creator'],
    organization: 'Stanford University',
    isVerified: true,
  },
  {
    id: 2,
    username: 'AlgoWizard',
    name: 'Raj Patel',
    avatar: '/assets/avatars/user2.jpg',
    score: 9762,
    solved: 372,
    rank: 2,
    tier: 'Diamond',
    change: 1,
    streak: 78,
    country: 'India',
    badges: ['top_contributor', 'problem_solver'],
    organization: 'Google',
    isVerified: true,
  },
  {
    id: 3,
    username: 'ByteMaster',
    name: 'Elena Volkov',
    avatar: '/assets/avatars/user3.jpg',
    score: 9645,
    solved: 362,
    rank: 3,
    tier: 'Diamond',
    change: -1,
    streak: 42,
    country: 'Russia',
    badges: ['algorithm_master', 'challenge_champion'],
    organization: 'Yandex',
    isVerified: true,
  },
  {
    id: 4,
    username: 'DevGenius',
    name: 'Michael Johnson',
    avatar: '/assets/avatars/user4.jpg',
    score: 9521,
    solved: 347,
    rank: 4,
    tier: 'Diamond',
    change: 0,
    streak: 30,
    country: 'Canada',
    badges: ['problem_solver'],
    organization: 'University of Toronto',
    isVerified: true,
  },
  {
    id: 5,
    username: 'ProgramProdigy',
    name: 'Wei Zhang',
    avatar: '/assets/avatars/user5.jpg',
    score: 9489,
    solved: 341,
    rank: 5,
    tier: 'Diamond',
    change: 2,
    streak: 56,
    country: 'China',
    badges: ['challenge_creator', 'top_contributor'],
    organization: 'Tsinghua University',
    isVerified: false,
  },
  {
    id: 6,
    username: 'LogicLord',
    name: 'Johannes Weber',
    avatar: '/assets/avatars/user6.jpg',
    score: 9356,
    solved: 332,
    rank: 6,
    tier: 'Diamond',
    change: -1,
    streak: 29,
    country: 'Germany',
    badges: ['problem_solver'],
    organization: 'TU Munich',
    isVerified: true,
  },
  {
    id: 7,
    username: 'BugHunter',
    name: 'Sophia Martinez',
    avatar: '/assets/avatars/user7.jpg',
    score: 9287,
    solved: 325,
    rank: 7,
    tier: 'Diamond',
    change: 1,
    streak: 48,
    country: 'Spain',
    badges: ['top_contributor', 'algorithm_master'],
    organization: 'Microsoft',
    isVerified: true,
  },
  {
    id: 8,
    username: 'CodeCraftsman',
    name: 'Oliver Lee',
    avatar: '/assets/avatars/user8.jpg',
    score: 9145,
    solved: 313,
    rank: 8,
    tier: 'Diamond',
    change: -2,
    streak: 39,
    country: 'United Kingdom',
    badges: ['challenge_champion'],
    organization: 'Oxford University',
    isVerified: false,
  },
  {
    id: 9,
    username: 'SyntaxSavvy',
    name: 'Anuj Prajapati',
    avatar: '/assets/avatars/user9.jpg',
    score: 9089,
    solved: 307,
    rank: 9,
    tier: 'Diamond',
    change: 5,
    streak: 60,
    country: 'India',
    badges: ['contest_winner', 'top_contributor'],
    organization: 'Amazon',
    isVerified: true,
  },
  {
    id: 10,
    username: 'AlgorithmAce',
    name: 'Park Jiwon',
    avatar: '/assets/avatars/user10.jpg',
    score: 8975,
    solved: 298,
    rank: 10,
    tier: 'Diamond',
    change: 0,
    streak: 34,
    country: 'South Korea',
    badges: ['problem_solver', 'challenge_creator'],
    organization: 'Samsung',
    isVerified: true,
  },
  {
    id: 11,
    username: 'CrashOverride',
    name: 'David Miller',
    avatar: '/assets/avatars/user11.jpg',
    score: 8742,
    solved: 285,
    rank: 11,
    tier: 'Platinum',
    change: 2,
    streak: 22,
    country: 'Australia',
    badges: ['challenge_champion'],
    organization: 'University of Melbourne',
    isVerified: true,
  },
  {
    id: 12,
    username: 'ByteBaron',
    name: 'Fatima Al-Hassan',
    avatar: '/assets/avatars/user12.jpg',
    score: 8698,
    solved: 271,
    rank: 12,
    tier: 'Platinum',
    change: -1,
    streak: 17,
    country: 'United Arab Emirates',
    badges: ['problem_solver'],
    organization: 'Dubai Institute of Technology',
    isVerified: false,
  },
  {
    id: 13,
    username: 'DataDruid',
    name: 'Isabella Romano',
    avatar: '/assets/avatars/user13.jpg',
    score: 8621,
    solved: 263,
    rank: 13,
    tier: 'Platinum',
    change: 3,
    streak: 25,
    country: 'Italy',
    badges: ['algorithm_master'],
    organization: 'University of Rome',
    isVerified: true,
  },
  {
    id: 14,
    username: 'QuantumCoder',
    name: 'Gabriel Santos',
    avatar: '/assets/avatars/user14.jpg',
    score: 8512,
    solved: 259,
    rank: 14,
    tier: 'Platinum',
    change: 0,
    streak: 19,
    country: 'Brazil',
    badges: ['challenge_creator'],
    organization: 'Facebook',
    isVerified: true,
  },
  {
    id: 15,
    username: 'BinaryBard',
    name: 'Emma Wilson',
    avatar: '/assets/avatars/user15.jpg',
    score: 8375,
    solved: 247,
    rank: 15,
    tier: 'Platinum',
    change: -3,
    streak: 14,
    country: 'Canada',
    badges: ['top_contributor'],
    organization: 'University of British Columbia',
    isVerified: false,
  },
];

// Badge component with animations and tooltips
const Badge = ({ type }) => {
  const theme = useTheme();
  
  const badgeConfig = {
    contest_winner: {
      icon: <EmojiEvents fontSize="small" />,
      label: 'Contest Winner',
      color: '#FFD700',
      bgColor: 'rgba(255, 215, 0, 0.1)'
    },
    algorithm_master: {
      icon: <Code fontSize="small" />,
      label: 'Algorithm Master',
      color: '#9C27B0',
      bgColor: 'rgba(156, 39, 176, 0.1)'
    },
    challenge_champion: {
      icon: <Star fontSize="small" />,
      label: 'Challenge Champion',
      color: '#FF5722',
      bgColor: 'rgba(255, 87, 34, 0.1)'
    },
    problem_solver: {
      icon: <WorkspacePremium fontSize="small" />,
      label: 'Problem Solver',
      color: '#2196F3',
      bgColor: 'rgba(33, 150, 243, 0.1)'
    },
    top_contributor: {
      icon: <Grade fontSize="small" />,
      label: 'Top Contributor',
      color: '#4CAF50',
      bgColor: 'rgba(76, 175, 80, 0.1)'
    },
    challenge_creator: {
      icon: <BarChart fontSize="small" />,
      label: 'Challenge Creator',
      color: '#FF9800',
      bgColor: 'rgba(255, 152, 0, 0.1)'
    }
  };

  const config = badgeConfig[type];
  
  return (
    <Tooltip title={config.label}>
      <Box
        component={motion.div}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 28,
          height: 28,
          borderRadius: '50%',
          bgcolor: config.bgColor,
          color: config.color,
        }}
      >
        {config.icon}
      </Box>
    </Tooltip>
  );
};

// Tier badge component
const TierBadge = ({ tier }) => {
  const tierConfig = {
    'Diamond': {
      color: '#B9F2FF',
      borderColor: '#81D4FA',
      bgColor: 'rgba(3, 169, 244, 0.1)'
    },
    'Platinum': {
      color: '#E1BEE7',
      borderColor: '#CE93D8',
      bgColor: 'rgba(156, 39, 176, 0.1)'
    },
    'Gold': {
      color: '#FFD54F',
      borderColor: '#FFC107',
      bgColor: 'rgba(255, 193, 7, 0.1)'
    },
    'Silver': {
      color: '#B0BEC5',
      borderColor: '#78909C',
      bgColor: 'rgba(96, 125, 139, 0.1)'
    },
    'Bronze': {
      color: '#BCAAA4',
      borderColor: '#A1887F',
      bgColor: 'rgba(121, 85, 72, 0.1)'
    }
  };
  
  const config = tierConfig[tier] || tierConfig['Bronze'];
  
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.5,
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: config.color,
        border: `1px solid ${config.borderColor}`,
        bgcolor: config.bgColor,
      }}
    >
      {tier}
    </Box>
  );
};

// Rank change indicator component
const RankChange = ({ change }) => {
  if (change === 0) {
    return (
      <Typography 
        variant="body2" 
        component="span" 
        sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}
      >
        -
      </Typography>
    );
  }
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        color: change > 0 ? 'success.main' : 'error.main',
        fontSize: '0.75rem',
      }}
    >
      {change > 0 ? (
        <>
          <ArrowUpward fontSize="inherit" />
          <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
            {change}
          </Typography>
        </>
      ) : (
        <>
          <ArrowUpward 
            fontSize="inherit" 
            sx={{ 
              transform: 'rotate(180deg)'
            }}
          />
          <Typography variant="body2" component="span" sx={{ ml: 0.5 }}>
            {Math.abs(change)}
          </Typography>
        </>
      )}
    </Box>
  );
};

const Leaderboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tab, setTab] = useState(0);
  const [timeframe, setTimeframe] = useState('all_time');
  const [category, setCategory] = useState('overall');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle tab change for different leaderboard types
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Handle timeframe change
  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };
  
  // Handle category change
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  
  // Filter data based on search query
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Filter and sort data based on current selections
  useEffect(() => {
    setLoading(true);
    
    // Simulate API request delay
    const timer = setTimeout(() => {
      let data = [...leaderboardData];
      
      // Apply filters based on tab
      if (tab === 1) {
        // Weekly leaders (just a subset for demonstration)
        data = data.slice(0, 10).sort((a, b) => b.streak - a.streak);
      } else if (tab === 2) {
        // Organizations (sort by org name for demonstration)
        data = data.sort((a, b) => a.organization.localeCompare(b.organization));
      }
      
      // Apply search filter
      if (searchQuery) {
        data = data.filter(user => 
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.organization.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setFilteredData(data);
      setLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [tab, timeframe, category, searchQuery]);
  
  // Animation variants for list items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05
      } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Page header with gradient background
  const PageHeader = () => (
    <Box 
      sx={{
        py: { xs: 4, md: 6 },
        background: theme.palette.gradients.primary,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          pointerEvents: 'none',
        }}
      />
      
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                mb: { xs: 1, md: 2 }
              }}
            >
              Leaderboard
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, mb: 2, opacity: 0.9 }}>
              Compete with the best coders and rise through the ranks
            </Typography>
            
            {/* Key stats cards */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 3 }}
            >
              <Paper 
                sx={{ 
                  py: 1.5, 
                  px: 3,
                  bgcolor: 'rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 2
                }}
              >
                <EmojiEvents sx={{ mr: 1.5, fontSize: '1.25rem' }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Total Competitors
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    28,465
                  </Typography>
                </Box>
              </Paper>
              
              <Paper 
                sx={{ 
                  py: 1.5, 
                  px: 3,
                  bgcolor: 'rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 2
                }}
              >
                <Code sx={{ mr: 1.5, fontSize: '1.25rem' }} />
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Challenges Completed
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    746,289
                  </Typography>
                </Box>
              </Paper>
            </Stack>
          </Grid>
          
          {!isSmall && (
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box 
                component="img"
                src="/assets/leaderboard-illustration.svg" 
                alt="Leaderboard illustration"
                sx={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '200px',
                  filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.2))'
                }}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
  
  return (
    <>
      <PageHeader />
      
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Tabs and filters row */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item xs={12} md={7}>
              <Tabs 
                value={tab} 
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
              >
                <Tab label="Global Ranking" />
                <Tab label="Weekly Leaders" />
                <Tab label="Organizations" />
              </Tabs>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Stack 
                direction="row" 
                spacing={1} 
                alignItems="center"
                justifyContent={{ xs: 'space-between', md: 'flex-end' }}
              >
                <TextField
                  placeholder="Search users..."
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search fontSize="small" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: '100px' }
                  }}
                  sx={{
                    maxWidth: { xs: '100%', md: '200px' },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '100px',
                    }
                  }}
                />
                
                {/* Filter button */}
                <Tooltip title={showFilters ? "Hide filters" : "Show filters"}>
                  <IconButton 
                    onClick={toggleFilters}
                    color={showFilters ? "primary" : "default"}
                    sx={{ 
                      bgcolor: showFilters ? 'rgba(188, 64, 55, 0.1)' : 'transparent',
                    }}
                  >
                    {showFilters ? <Close /> : <FilterList />}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </Box>
        
        {/* Expandable filters section */}
        <Collapse in={showFilters}>
          <Paper
            sx={{
              p: 2,
              mb: 3,
              borderRadius: '12px',
              boxShadow: theme.shadows[2],
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.01)',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Timeframe
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={timeframe}
                    onChange={handleTimeframeChange}
                    IconComponent={ArrowDropDown}
                  >
                    <MenuItem value="all_time">All Time</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Category
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={category}
                    onChange={handleCategoryChange}
                    IconComponent={ArrowDropDown}
                  >
                    <MenuItem value="overall">Overall Score</MenuItem>
                    <MenuItem value="algorithms">Algorithms</MenuItem>
                    <MenuItem value="data_structures">Data Structures</MenuItem>
                    <MenuItem value="problem_solving">Problem Solving</MenuItem>
                    <MenuItem value="contests">Contests</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Region
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    defaultValue="all"
                    IconComponent={ArrowDropDown}
                  >
                    <MenuItem value="all">All Regions</MenuItem>
                    <MenuItem value="na">North America</MenuItem>
                    <MenuItem value="eu">Europe</MenuItem>
                    <MenuItem value="as">Asia</MenuItem>
                    <MenuItem value="sa">South America</MenuItem>
                    <MenuItem value="oc">Oceania</MenuItem>
                    <MenuItem value="af">Africa</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="subtitle2" gutterBottom>
                  Tier
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    defaultValue="all"
                    IconComponent={ArrowDropDown}
                  >
                    <MenuItem value="all">All Tiers</MenuItem>
                    <MenuItem value="diamond">Diamond</MenuItem>
                    <MenuItem value="platinum">Platinum</MenuItem>
                    <MenuItem value="gold">Gold</MenuItem>
                    <MenuItem value="silver">Silver</MenuItem>
                    <MenuItem value="bronze">Bronze</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                size="small" 
                onClick={toggleFilters}
                sx={{ borderRadius: '50px', px: 3 }}
              >
                Apply Filters
              </Button>
            </Box>
          </Paper>
        </Collapse>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <>
            {/* Top 3 users cards for larger screens */}
            {tab === 0 && !isMobile && (
              <Box sx={{ mb: 6 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ fontWeight: 700, mb: 3 }}
                >
                  Top Performers
                </Typography>
                
                <Grid 
                  container 
                  spacing={3}
                  component={motion.div}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredData.slice(0, 3).map((user, index) => (
                    <Grid item xs={12} md={4} key={user.id} component={motion.div} variants={itemVariants}>
                      <Card
                        sx={{
                          p: 3,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          borderRadius: '16px',
                          boxShadow: index === 0 
                            ? '0 8px 20px rgba(255, 215, 0, 0.2)'
                            : index === 1 
                              ? '0 8px 20px rgba(192, 192, 192, 0.2)' 
                              : '0 8px 20px rgba(205, 127, 50, 0.2)',
                          position: 'relative',
                          overflow: 'hidden',
                          border: index === 0 
                            ? '1px solid rgba(255, 215, 0, 0.3)'
                            : index === 1 
                              ? '1px solid rgba(192, 192, 192, 0.3)' 
                              : '1px solid rgba(205, 127, 50, 0.3)',
                        }}
                      >
                        {/* Crown or medal for top 3 */}
                        <Box 
                          sx={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            width: 30,
                            height: 30,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            backgroundColor: index === 0 
                              ? 'rgba(255, 215, 0, 0.9)'
                              : index === 1 
                                ? 'rgba(192, 192, 192, 0.9)' 
                                : 'rgba(205, 127, 50, 0.9)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            color: '#FFF',
                            fontWeight: 'bold'
                          }}
                        >
                          {index + 1}
                        </Box>
                        
                        {/* User avatar */}
                        <Box sx={{ position: 'relative', mb: 1 }}>
                          <Avatar 
                            src={user.avatar} 
                            alt={user.username}
                            sx={{ 
                              width: 80,
                              height: 80,
                              border: '3px solid',
                              borderColor: index === 0 
                                ? 'rgba(255, 215, 0, 0.7)'
                                : index === 1 
                                  ? 'rgba(192, 192, 192, 0.7)' 
                                  : 'rgba(205, 127, 50, 0.7)',
                            }}
                          />
                          {user.isVerified && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                bgcolor: theme.palette.primary.main,
                                borderRadius: '50%',
                                width: 22,
                                height: 22,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Verified sx={{ fontSize: 16, color: 'white' }} />
                            </Box>
                          )}
                        </Box>
                        
                        {/* User info */}
                        <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', mb: 0.5 }}>
                          {user.username}
                        </Typography>
                        
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Public fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem' }} />
                          {user.country}
                        </Typography>
                        
                        {/* Tier badge */}
                        <Box sx={{ mb: 2 }}>
                          <TierBadge tier={user.tier} />
                        </Box>
                        
                        <Divider sx={{ width: '100%', my: 2 }} />
                        
                        {/* Stats */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              Score
                            </Typography>
                            <Typography variant="h6" align="center" sx={{ fontWeight: 700 }}>
                              {user.score.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              Solved
                            </Typography>
                            <Typography variant="h6" align="center" sx={{ fontWeight: 700 }}>
                              {user.solved}
                            </Typography>
                          </Grid>
                        </Grid>
                        
                        {/* Badges */}
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, width: '100%' }}>
                          Badges
                        </Typography>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {user.badges.map(badge => (
                            <Badge key={badge} type={badge} />
                          ))}
                        </Stack>
                        
                        <Box sx={{ mt: 'auto', pt: 2, width: '100%' }}>
                          <Button 
                            fullWidth 
                            variant="outlined"
                            sx={{ borderRadius: '50px', mt: 2 }}
                          >
                            View Profile
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Main leaderboard table */}
            <Box 
              component={motion.div}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Paper
                sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: theme.shadows[isMobile ? 1 : 3],
                }}
              >
                {/* Table header */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: isMobile 
                      ? '70px 1fr 100px' 
                      : '70px minmax(200px, 1fr) 150px 150px 100px 150px',
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.03)' 
                      : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Rank</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>User</Typography>
                  {!isMobile && (
                    <>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Organization</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Tier</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Solved</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, textAlign: 'right' }}>Score</Typography>
                    </>
                  )}
                  {isMobile && (
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, textAlign: 'right' }}>Score</Typography>
                  )}
                </Box>
                
                {/* Table rows */}
                {filteredData.length > 0 ? (
                  filteredData.map((user) => (
                    <Box
                      key={user.id}
                      component={motion.div}
                      variants={itemVariants}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: isMobile 
                          ? '70px 1fr 100px' 
                          : '70px minmax(200px, 1fr) 150px 150px 100px 150px',
                        p: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(255,255,255,0.05)' 
                            : 'rgba(0,0,0,0.01)',
                          cursor: 'pointer'
                        },
                        // Highlight currently logged in user 
                        ...(user.username === "SyntaxSavvy" && {
                          bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(188, 64, 55, 0.1)' 
                            : 'rgba(188, 64, 55, 0.05)',
                        })
                      }}
                    >
                      {/* Rank column */}
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: user.rank <= 3 
                            ? user.rank === 1 
                              ? 'rgba(255, 215, 0, 0.1)'
                              : user.rank === 2 
                                ? 'rgba(192, 192, 192, 0.1)'
                                : 'rgba(205, 127, 50, 0.1)'
                            : 'transparent',
                          color: user.rank <= 3 
                            ? user.rank === 1 
                              ? 'rgba(255, 215, 0, 0.8)'
                              : user.rank === 2 
                                ? 'rgba(192, 192, 192, 0.8)'
                                : 'rgba(205, 127, 50, 0.8)'
                            : theme.palette.text.primary,
                          fontWeight: user.rank <= 3 ? 600 : 400,
                        }}>
                          {user.rank}
                        </Box>
                        <RankChange change={user.change} />
                      </Box>
                      
                      {/* User column */}
                      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                        <Avatar 
                          src={user.avatar} 
                          alt={user.username}
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 1.5,
                            border: user.isVerified ? `2px solid ${theme.palette.primary.main}` : 'none'
                          }}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 600,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {user.username}
                            </Typography>
                            {user.isVerified && !isMobile && (
                              <Verified sx={{ ml: 0.5, fontSize: 16, color: theme.palette.primary.main }} />
                            )}
                          </Box>
                          {!isSmall && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {user.name}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      {/* Additional columns for larger screens */}
                      {!isMobile && (
                        <>
                          {/* Organization column */}
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <School fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary, opacity: 0.7 }} />
                            <Typography 
                              variant="body2"
                              sx={{ 
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {user.organization}
                            </Typography>
                          </Box>
                          
                          {/* Tier column */}
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TierBadge tier={user.tier} />
                          </Box>
                          
                          {/* Solved column */}
                          <Box>
                            <Typography variant="body1">
                              {user.solved}
                            </Typography>
                          </Box>
                        </>
                      )}
                      
                      {/* Score column */}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 600,
                            color: user.rank <= 3 
                              ? theme.palette.primary.main
                              : theme.palette.text.primary
                          }}
                        >
                          {user.score.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      No users found matching your search.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Box>
            
            {/* Pagination */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="outlined" 
                color="primary"
                sx={{ 
                  borderRadius: '50px',
                  px: 4,
                }}
              >
                Load More
              </Button>
            </Box>
            
            {/* Call to action section */}
            <Paper
              sx={{
                mt: 6,
                p: { xs: 3, md: 5 },
                borderRadius: '16px',
                background: theme.palette.mode === 'dark' 
                  ? 'linear-gradient(45deg, rgba(76, 25, 25, 0.9) 0%, rgba(33, 33, 81, 0.9) 100%)'
                  : 'linear-gradient(45deg, rgba(255, 238, 238, 0.9) 0%, rgba(240, 240, 255, 0.9) 100%)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    Ready to climb the ranks?
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    Join thousands of programmers competing in challenges and improve your coding skills.
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="secondary"
                    sx={{ 
                      borderRadius: '50px',
                      px: 4,
                      py: 1.5
                    }}
                  >
                    Join the Competition
                  </Button>
                </Grid>
                
                {!isSmall && (
                  <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                    <EmojiEvents sx={{ fontSize: 160, opacity: 0.1, transform: 'rotate(15deg)' }} />
                  </Grid>
                )}
              </Grid>
              
              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -20,
                  right: -20,
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: -30,
                  left: '40%',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
                }}
              />
            </Paper>
          </>
        )}
      </Container>
    </>
  );
};

export default Leaderboard;
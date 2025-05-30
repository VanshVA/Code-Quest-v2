import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip, 
  Divider, 
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Tab,
  Tabs,
  CircularProgress,
  IconButton,
  Tooltip,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  AccessTime, 
  DateRange, 
  PeopleAlt, 
  School,
  EmojiEvents,
  Person,
  Code,
  Check,
  ArrowBack,
  Star,
  StarBorder,
  PlayArrow,
  CalendarToday,
  Description,
  Timeline,
  Groups,
  MenuBook,
  Warning,
  Info,
  Share,
  Cached,
  FlashOn
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Current date and time for display
const CURRENT_DATE_TIME = "2025-05-30 07:46:56";
const CURRENT_USER = "VanshSharmaSDE";

// Motion components
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);
const MotionContainer = motion(Container);

const CompetitionDetails = () => {
  const { id } = useParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(true);
  const [competition, setCompetition] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [favorited, setFavorited] = useState(false);
  
  useEffect(() => {
    // Simulate API call to fetch competition details
    setTimeout(() => {
      setCompetition({
        id: Number(id),
        title: "Algorithm Challenge",
        description: "Test your algorithm skills with complex problems that require optimal solutions. This competition focuses on efficiency and correctness.",
        longDescription: "This competition is designed to challenge your algorithmic thinking and problem-solving skills. You'll face a series of increasingly difficult problems that will test your ability to design efficient solutions. From array manipulations and string operations to graph algorithms and dynamic programming, this challenge covers a wide range of algorithmic concepts.\n\nSuccessful participants will demonstrate not only the ability to solve problems correctly but also to optimize their solutions for time and space complexity. This is a great opportunity to showcase your skills and compete with fellow coding enthusiasts.",
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
        creator: {
          name: "Prof. Alan Turing",
          avatar: "https://i.pravatar.cc/150?img=33",
          title: "Competition Creator",
          organization: "Tech University"
        },
        image: "/static/images/competitions/algorithm.jpg",
        rules: [
          "You must solve the problems independently without external help",
          "Plagiarism will result in disqualification",
          "You are allowed to use standard libraries",
          "You cannot use internet resources during the competition",
          "All submissions will be checked for code similarity"
        ],
        format: "The competition consists of 5 algorithmic problems of varying difficulty. You will have 2 hours to solve as many as you can. Problems are scored based on their difficulty level, with harder problems worth more points. The final ranking will be determined by total score, with time taken as a tiebreaker.",
        questions: [
          { type: "Easy", count: 1, points: 20 },
          { type: "Medium", count: 2, points: 25 },
          { type: "Hard", count: 2, points: 30 }
        ],
        languages: ["JavaScript", "Python", "Java", "C++", "C#"],
        pastWinners: [
          { name: "AlgoMaster", avatar: "https://i.pravatar.cc/150?img=12", rank: 1, score: 100 },
          { name: "CodeNinja", avatar: "https://i.pravatar.cc/150?img=23", rank: 2, score: 95 },
          { name: "ByteWizard", avatar: "https://i.pravatar.cc/150?img=58", rank: 3, score: 90 }
        ],
        similarCompetitions: [
          { id: 101, title: "Data Structures 101", date: "2025-06-15", difficulty: "Medium" },
          { id: 102, title: "Dynamic Programming Challenge", date: "2025-06-22", difficulty: "Hard" },
          { id: 103, title: "Graph Algorithms Contest", date: "2025-07-05", difficulty: "Hard" }
        ],
        learningResources: [
          { title: "Algorithm Design Manual", author: "Steven S. Skiena", type: "Book" },
          { title: "Introduction to Algorithms", author: "CLRS", type: "Book" },
          { title: "AlgoExpert", url: "https://www.algoexpert.io", type: "Platform" }
        ],
        faqs: [
          { 
            question: "What if I have technical issues during the competition?", 
            answer: "If you experience technical issues, please report them immediately using the Help button in the competition interface. Our support team will assist you as soon as possible."
          },
          { 
            question: "Can I use external libraries during the competition?", 
            answer: "You can use standard libraries that are built into the programming language. External libraries or frameworks are not allowed unless explicitly mentioned."
          },
          { 
            question: "How is the scoring calculated?", 
            answer: "Each problem has a predefined point value based on its difficulty. You earn points for each correct solution. The final score is the sum of points from all correctly solved problems."
          },
          { 
            question: "Can I participate if I miss the start time?", 
            answer: "Yes, you can join the competition at any time before it ends. However, the duration will remain the same, so you will have less time to complete the problems."
          }
        ],
      });
      setLoading(false);
    }, 1500);
  }, [id]);
  
  // Toggle favorite
  const handleToggleFavorite = () => {
    setFavorited(!favorited);
  };
  
  // Join competition
  const handleJoinCompetition = () => {
    navigate(`/dashboard/competition/waiting/${id}`);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
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
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return theme.palette.info.main;
      case 'live':
        return theme.palette.error.main;
      case 'completed':
        return theme.palette.success.main;
      default:
        return theme.palette.text.secondary;
    }
  };
  
  // Get time until competition
  const getTimeUntil = (dateStr, timeStr) => {
    const [startTime] = timeStr.split("-");
    const [hours, minutes] = startTime.split(":").map(Number);
    
    const competitionDate = new Date(dateStr);
    competitionDate.setHours(hours, minutes);
    
    const now = new Date();
    const diff = competitionDate - now;
    
    if (diff <= 0) return "Starting soon";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''} until start`;
    } else {
      const remainingMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return `${remainingHours} hour${remainingHours > 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} until start`;
    }
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
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={60} sx={{ color: 'var(--theme-color)' }} />
      </Box>
    );
  }

  return (
    <MotionContainer
      maxWidth="lg"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{ py: 4 }}
    >
      {/* Back button */}
      <MotionBox variants={itemVariants} sx={{ mb: 2 }}>
        <Button
          variant="text"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard/competitions')}
          sx={{
            color: 'text.secondary',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.03)',
            },
          }}
        >
          Back to Competitions
        </Button>
      </MotionBox>
      
      {/* Competition header */}
      <MotionBox
        variants={itemVariants}
        sx={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          height: { xs: 240, md: 320 },
          mb: 4,
          backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${competition.image || '/static/images/competitions/default.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            display: 'flex',
            gap: 1,
          }}
        >
          <Chip 
            label={competition.difficulty} 
            sx={{ 
              bgcolor: getDifficultyColor(competition.difficulty),
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '8px',
            }} 
          />
          <Chip 
            label={competition.status.toUpperCase()} 
            sx={{ 
              bgcolor: getStatusColor(competition.status),
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '8px',
            }} 
          />
        </Box>
        
        <Box sx={{ p: 4, width: '100%' }}>
          <Typography variant="h3" component="h1" fontWeight="bold" color="white">
            {competition.title}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 4 }, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <DateRange sx={{ color: 'white', mr: 1 }} />
              <Typography variant="body1" color="white">
                {new Date(competition.date).toLocaleDateString('en-US', { 
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ color: 'white', mr: 1 }} />
              <Typography variant="body1" color="white">
                {competition.time}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleAlt sx={{ color: 'white', mr: 1 }} />
              <Typography variant="body1" color="white">
                {competition.participants}/{competition.maxParticipants} participants
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ color: 'white', mr: 1 }} />
              <Typography variant="body1" color="white">
                {competition.category}
              </Typography>
            </Box>
          </Box>
        </Box>
      </MotionBox>
      
      {/* Time until competition */}
      {competition.status === 'upcoming' && (
        <MotionPaper
          variants={itemVariants}
          sx={{ 
            p: 3, 
            borderRadius: '16px',
            mb: 4,
            backgroundImage: 'linear-gradient(135deg, rgba(var(--theme-color-rgb), 0.1), rgba(var(--theme-color-rgb), 0.05))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <AccessTime sx={{ color: 'var(--theme-color)' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {getTimeUntil(competition.date, competition.time)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Competition duration: {competition.duration} minutes
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title={favorited ? "Remove from favorites" : "Add to favorites"}>
              <IconButton 
                onClick={handleToggleFavorite}
                sx={{ color: favorited ? theme.palette.warning.main : 'inherit' }}
              >
                {favorited ? <Star /> : <StarBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Share competition">
              <IconButton>
                <Share />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              onClick={handleJoinCompetition}
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: 'var(--theme-color)',
                '&:hover': {
                  bgcolor: 'var(--hover-color)',
                },
                px: 3,
              }}
            >
              Join Competition
            </Button>
          </Box>
        </MotionPaper>
      )}
      
      {/* Main content */}
      <Grid container spacing={3}>
        {/* Left column */}
        <Grid item xs={12} md={8}>
          {/* Tabs navigation */}
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              borderRadius: '16px',
              overflow: 'hidden',
              mb: 3,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 48,
                },
                '& .Mui-selected': {
                  color: 'var(--theme-color)',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: 'var(--theme-color)',
                },
              }}
            >
              <Tab icon={<Description sx={{ fontSize: 20 }} />} iconPosition="start" label="Overview" />
              <Tab icon={<MenuBook sx={{ fontSize: 20 }} />} iconPosition="start" label="Rules & Format" />
              <Tab icon={<EmojiEvents sx={{ fontSize: 20 }} />} iconPosition="start" label="Prizes" />
              <Tab icon={<Groups sx={{ fontSize: 20 }} />} iconPosition="start" label="Participants" />
              <Tab icon={<Info sx={{ fontSize: 20 }} />} iconPosition="start" label="FAQ" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {/* Overview Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Competition Overview
                  </Typography>
                  <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {competition.longDescription}
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Difficulty Level
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: `${getDifficultyColor(competition.difficulty)}15`,
                          color: getDifficultyColor(competition.difficulty),
                          py: 1,
                          px: 2,
                          borderRadius: '8px',
                          width: 'fit-content',
                        }}
                      >
                        <FlashOn sx={{ mr: 1 }} />
                        <Typography variant="body2" fontWeight="bold">
                          {competition.difficulty}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Competition Duration
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          bgcolor: 'rgba(25, 118, 210, 0.1)',
                          color: theme.palette.primary.main,
                          py: 1,
                          px: 2,
                          borderRadius: '8px',
                          width: 'fit-content',
                        }}
                      >
                        <AccessTime sx={{ mr: 1 }} />
                        <Typography variant="body2" fontWeight="bold">
                          {competition.duration} minutes
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 4, mb: 1 }}>
                    Question Types
                  </Typography>
                  <Paper sx={{ p: 2, borderRadius: '12px' }}>
                    <Grid container spacing={2}>
                      {competition.questions.map((q, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                          <Box 
                            sx={{ 
                              p: 2,
                              borderRadius: '12px',
                              border: '1px solid',
                              borderColor: 'divider',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textAlign: 'center',
                            }}
                          >
                            <Box 
                              sx={{ 
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                bgcolor: `${getDifficultyColor(q.type)}15`,
                                color: getDifficultyColor(q.type),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1,
                              }}
                            >
                              <Typography variant="h6" fontWeight="bold">
                                {q.count}
                              </Typography>
                            </Box>
                            <Typography variant="body1" fontWeight="medium">
                              {q.type} {q.count > 1 ? 'Questions' : 'Question'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {q.points} points each
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                  
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 4, mb: 1 }}>
                    Supported Programming Languages
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {competition.languages.map((lang, index) => (
                      <Chip 
                        key={index} 
                        label={lang} 
                        variant="outlined"
                        icon={<Code />}
                        sx={{ borderRadius: '8px' }}
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 4, mb: 1 }}>
                    Prerequisites
                  </Typography>
                  <List disablePadding>
                    {competition.prerequisites.map((prereq, index) => (
                      <ListItem 
                        key={index}
                        sx={{ 
                          py: 0.5,
                          pl: 0,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Check fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={prereq} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {/* Rules & Format Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Competition Format
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {competition.format}
                  </Typography>
                  
                  <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
                    Rules and Guidelines
                  </Typography>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: '12px',
                      bgcolor: 'rgba(245, 245, 245, 0.6)',
                      border: '1px dashed rgba(0, 0, 0, 0.12)',
                    }}
                  >
                    <List disablePadding>
                      {competition.rules.map((rule, index) => (
                        <React.Fragment key={index}>
                          <ListItem alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                  <Box
                                    component="span"
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: '50%',
                                      bgcolor: 'var(--theme-color)',
                                      color: 'white',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      mr: 2,
                                      flexShrink: 0,
                                      fontSize: '0.875rem',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {index + 1}
                                  </Box>
                                  <Typography variant="body1">{rule}</Typography>
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < competition.rules.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))}
                    </List>
                  </Paper>
                  
                  <Box 
                    sx={{ 
                      mt: 4, 
                      p: 3, 
                      borderRadius: '16px', 
                      bgcolor: 'rgba(255, 152, 0, 0.1)', 
                      border: '1px solid rgba(255, 152, 0, 0.2)',
                      display: 'flex',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Warning sx={{ color: theme.palette.warning.main, mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom color={theme.palette.warning.main}>
                        Important Note
                      </Typography>
                      <Typography variant="body2">
                        During the competition, you will not be able to switch tabs or use external resources. The competition interface will detect any attempts to leave the page and may result in disqualification. Make sure your environment is set up properly before starting the competition.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              
              {/* Prizes Tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Competition Prizes
                  </Typography>
                  
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {competition.prizes.map((prize, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <Paper
                          sx={{
                            p: 3,
                            borderRadius: '16px',
                            textAlign: 'center',
                            position: 'relative',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: index === 0 ? '0 10px 30px rgba(255, 152, 0, 0.2)' : 'none',
                            border: theme => `1px solid ${index === 0 ? theme.palette.warning.light : theme.palette.divider}`,
                            bgcolor: index === 0 ? 'rgba(255, 152, 0, 0.05)' : 'background.paper',
                          }}
                        >
                          {index === 0 && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: -10,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                bgcolor: theme.palette.warning.main,
                                color: 'white',
                                py: 0.5,
                                px: 2,
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                              }}
                            >
                              First Prize
                            </Box>
                          )}
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: '50%',
                              bgcolor: index === 0
                                ? 'rgba(255, 152, 0, 0.1)'
                                : index === 1
                                  ? 'rgba(158, 158, 158, 0.1)'
                                  : 'rgba(176, 141, 87, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="h4"
                              sx={{
                                fontWeight: 'bold',
                                color: index === 0
                                  ? theme.palette.warning.dark
                                  : index === 1
                                    ? theme.palette.grey[700]
                                    : '#b08d57',
                              }}
                            >
                              {index + 1}
                            </Typography>
                          </Box>
                          <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {prize}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                            }}
                          >
                            {index === 0 ? 'Gold' : index === 1 ? 'Silver' : 'Bronze'} Tier
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                    Past Winners
                  </Typography>
                  <Paper sx={{ p: 3, borderRadius: '16px' }}>
                    <Grid container spacing={2}>
                      {competition.pastWinners.map((winner, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                          <Box 
                            sx={{ 
                              p: 2, 
                              borderRadius: '12px',
                              border: '1px solid',
                              borderColor: 'divider',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              textAlign: 'center',
                            }}
                          >
                            <Box sx={{ position: 'relative' }}>
                              <Avatar
                                src={winner.avatar}
                                alt={winner.name}
                                sx={{ 
                                  width: 80, 
                                  height: 80, 
                                  mb: 2,
                                  border: '4px solid',
                                  borderColor: index === 0
                                    ? theme.palette.warning.light
                                    : index === 1
                                      ? theme.palette.grey[400]
                                      : '#cd7f32',
                                }}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 10,
                                  right: -10,
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  bgcolor: index === 0
                                    ? theme.palette.warning.main
                                    : index === 1
                                      ? theme.palette.grey[500]
                                      : '#cd7f32',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: 'bold',
                                  fontSize: '0.875rem',
                                  border: `2px solid ${theme.palette.background.paper}`,
                                }}
                              >
                                {winner.rank}
                              </Box>
                            </Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {winner.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Score: {winner.score}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                  
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
                    Additional Benefits
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: 'divider',
                          height: '100%',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Box 
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '10px',
                              bgcolor: 'rgba(76, 175, 80, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 1.5,
                              flexShrink: 0,
                            }}
                          >
                            <EmojiEvents sx={{ color: theme.palette.success.main }} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Digital Certificates
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              All participants will receive digital certificates of participation
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: 'divider',
                          height: '100%',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Box 
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '10px',
                              bgcolor: 'rgba(25, 118, 210, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 1.5,
                              flexShrink: 0,
                            }}
                          >
                            <GitHub sx={{ color: theme.palette.primary.main }} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              GitHub Badge
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Top performers will earn a special achievement badge for GitHub profile
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: 'divider',
                          height: '100%',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Box 
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '10px',
                              bgcolor: 'rgba(156, 39, 176, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mr: 1.5,
                              flexShrink: 0,
                            }}
                          >
                            <School sx={{ color: theme.palette.secondary.main }} />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Learning Credits
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Win premium course credits for top online learning platforms
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {/* Participants Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Competition Participants
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    There {competition.participants === 1 ? 'is' : 'are'} currently {competition.participants} participant{competition.participants !== 1 && 's'} registered for this competition. 
                    {competition.maxParticipants > competition.participants && ` There ${competition.maxParticipants - competition.participants === 1 ? 'is' : 'are'} still ${competition.maxParticipants - competition.participants} spot${competition.maxParticipants - competition.participants !== 1 && 's'} available.`}
                  </Typography>
                  
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: 'rgba(0, 0, 0, 0.02)',
                      mb: 3,
                    }}
                  >
                    <Typography variant="body2">
                      Due to privacy settings, the full list of participants will be available after the competition ends. Join now to see who you'll be competing against!
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Registration Progress
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        {competition.participants}/{competition.maxParticipants}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Math.round((competition.participants / competition.maxParticipants) * 100)}% full
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(competition.participants / competition.maxParticipants) * 100}
                      sx={{ 
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'var(--theme-color)',
                        }
                      }} 
                    />
                  </Box>
                  
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Geographic Distribution
                  </Typography>
                  <Typography variant="body2" paragraph>
                    This competition has participants from over 25 countries spanning 5 continents.
                  </Typography>
                  
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PlayArrow />}
                      onClick={handleJoinCompetition}
                      sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 700,
                        bgcolor: 'var(--theme-color)',
                        '&:hover': {
                          bgcolor: 'var(--hover-color)',
                        },
                        py: 1.5,
                        px: 4,
                      }}
                    >
                      Join Competition Now
                    </Button>
                  </Box>
                </Box>
              )}
              
              {/* FAQ Tab */}
              {activeTab === 4 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Frequently Asked Questions
                  </Typography>
                  
                  {competition.faqs.map((faq, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 3,
                        p: 3,
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {faq.question}
                      </Typography>
                      <Typography variant="body2">
                        {faq.answer}
                      </Typography>
                    </Box>
                  ))}
                  
                  <Box sx={{ 
                    p: 3, 
                    borderRadius: '16px', 
                    bgcolor: 'rgba(var(--theme-color-rgb), 0.05)', 
                    border: '1px dashed rgba(var(--theme-color-rgb), 0.2)',
                    mt: 4,
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}>
                    <Info sx={{ color: 'var(--theme-color)', mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Have More Questions?
                      </Typography>
                      <Typography variant="body2" paragraph>
                        If you have any additional questions about this competition, please contact the competition creator or check our detailed competition guidelines.
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 600,
                          borderColor: 'var(--theme-color)',
                          color: 'var(--theme-color)',
                          '&:hover': {
                            borderColor: 'var(--hover-color)',
                            bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                          },
                        }}
                      >
                        Contact Support
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </MotionPaper>
          
          {/* Similar Competitions */}
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 3, 
              borderRadius: '16px',
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Similar Competitions
            </Typography>
            <Grid container spacing={2}>
              {competition.similarCompetitions.map((sim, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box 
                    sx={{
                      p: 2,
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      height: '100%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'var(--theme-color)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      },
                    }}
                    onClick={() => navigate(`/dashboard/competition/${sim.id}`)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {sim.title}
                      </Typography>
                      <Chip
                        label={sim.difficulty}
                        size="small"
                        sx={{
                          bgcolor: `${getDifficultyColor(sim.difficulty)}15`,
                          color: getDifficultyColor(sim.difficulty),
                          fontWeight: 'bold',
                          fontSize: '0.625rem',
                          height: 20,
                          borderRadius: '4px',
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: '0.875rem' }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(sim.date).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </MotionPaper>
        </Grid>
        
        {/* Right column */}
        <Grid item xs={12} md={4}>
          {/* Competition Creator */}
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Competition Creator
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={competition.creator.avatar}
                alt={competition.creator.name}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {competition.creator.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {competition.creator.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {competition.creator.organization}
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                mt: 1,
                borderColor: 'rgba(0,0,0,0.1)',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'var(--theme-color)',
                  bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                },
              }}
            >
              View Profile
            </Button>
          </MotionPaper>
          
          {/* Competition Details */}
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Quick Details
            </Typography>
            <List disablePadding>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box 
                    sx={{ 
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DateRange fontSize="small" sx={{ color: theme.palette.success.main }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="medium">
                      Date
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {new Date(competition.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box 
                    sx={{ 
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      bgcolor: 'rgba(25, 118, 210, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <AccessTime fontSize="small" sx={{ color: theme.palette.primary.main }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="medium">
                      Time
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {competition.time} (Your local time)
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box 
                    sx={{ 
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      bgcolor: 'rgba(156, 39, 176, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Timeline fontSize="small" sx={{ color: theme.palette.secondary.main }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="medium">
                      Duration
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {competition.duration} minutes
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box 
                    sx={{ 
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <School fontSize="small" sx={{ color: 'var(--theme-color)' }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="medium">
                      Category
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {competition.category}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider />
              
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box 
                    sx={{ 
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      bgcolor: 'rgba(255, 152, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FlashOn fontSize="small" sx={{ color: theme.palette.warning.main }} />
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="medium">
                      Difficulty
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      {competition.difficulty}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<PlayArrow />}
                onClick={handleJoinCompetition}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.5,
                  bgcolor: 'var(--theme-color)',
                  '&:hover': {
                    bgcolor: 'var(--hover-color)',
                  },
                }}
              >
                Join Competition
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {competition.maxParticipants - competition.participants} spots left
              </Typography>
            </Box>
          </MotionPaper>
          
          {/* Learning Resources */}
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 3, 
              borderRadius: '16px',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Recommended Resources
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Prepare for this competition with these learning resources:
            </Typography>
            
            <List disablePadding>
              {competition.learningResources.map((resource, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box 
                        sx={{ 
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          bgcolor: resource.type === 'Book' 
                            ? 'rgba(156, 39, 176, 0.1)'
                            : 'rgba(25, 118, 210, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {resource.type === 'Book' ? (
                          <MenuBook fontSize="small" sx={{ color: theme.palette.secondary.main }} />
                        ) : (
                          <School fontSize="small" sx={{ color: theme.palette.primary.main }} />
                        )}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="bold">
                          {resource.title}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          {resource.author && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              by {resource.author}
                            </Typography>
                          )}
                          <Chip
                            label={resource.type}
                            size="small"
                            sx={{
                              mt: 0.5,
                              borderRadius: '4px',
                              height: 20,
                              fontSize: '0.625rem',
                              bgcolor: resource.type === 'Book' 
                                ? 'rgba(156, 39, 176, 0.1)'
                                : 'rgba(25, 118, 210, 0.1)',
                              color: resource.type === 'Book' 
                                ? theme.palette.secondary.main
                                : theme.palette.primary.main,
                            }}
                          />
                        </Box>
                      }
                    />
                    {resource.url && (
                      <Button
                        size="small"
                        variant="text"
                        sx={{
                          minWidth: 0,
                          p: 0.5,
                          color: 'var(--theme-color)',
                        }}
                      >
                        <ArrowForward fontSize="small" />
                      </Button>
                    )}
                  </ListItem>
                  {index < competition.learningResources.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Cached />}
              sx={{
                mt: 2,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                borderColor: 'rgba(0,0,0,0.1)',
                color: 'text.primary',
                '&:hover': {
                  borderColor: 'var(--theme-color)',
                  bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                },
              }}
            >
              Show More Resources
            </Button>
          </MotionPaper>
        </Grid>
      </Grid>
    </MotionContainer>
  );
};

export default CompetitionDetails;
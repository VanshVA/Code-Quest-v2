import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  ArrowBack as BackIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Create motion variants for animations
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);
const MotionGrid = motion(Grid);

const CompetitionResultsPage = ({ currentDateTime, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      y: -8,
      boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
      transition: { duration: 0.3 }
    }
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        // Use getCompetitionDetails endpoint to get full results
        const response = await dashboardService.getCompetitionDetails(id);
        
        if (response.success) {
          setCompetition(response.data.competition);
        } else {
          setError(response.message || 'Failed to fetch results');
        }
      } catch (err) {
        console.error('Error fetching competition results:', err);
        setError('Failed to load results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        backgroundColor: isDark ? 'background.default' : '#f7f9fc', 
        minHeight: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        backgroundColor: isDark ? 'background.default' : '#f7f9fc',
        minHeight: '100vh',
        py: 4,
        px: 3 
      }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
            <Button 
              sx={{ mt: 2 }} 
              variant="outlined" 
              onClick={() => navigate('/student/competitions')}
            >
              Back to Competitions
            </Button>
          </Alert>
        </MotionBox>
      </Box>
    );
  }

  if (!competition) {
    return (
      <Box sx={{ 
        backgroundColor: isDark ? 'background.default' : '#f7f9fc',
        minHeight: '100vh',
        py: 4,
        px: 3 
      }}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            Results not found
            <Button 
              sx={{ mt: 2 }} 
              variant="outlined" 
              onClick={() => navigate('/student/competitions')}
            >
              Back to Competitions
            </Button>
          </Alert>
        </MotionBox>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: isDark ? 'background.default' : '#f7f9fc',
      minHeight: '100vh',
      py: 4,
      px: { xs: 2, md: 4 }
    }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <Box>
          <MotionTypography 
            variant="h5" 
            fontWeight="bold" 
            gutterBottom
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {competition.competitionName} - Results
          </MotionTypography>
          <Typography variant="body1" color="text.secondary">
            Competition completed on {formatDate(competition.submissionTime)}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/student/competitions')}
          sx={{ 
            borderRadius: 2, 
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: isDark ? '0 4px 14px rgba(0,0,0,0.2)' : 'none'
          }}
        >
          Back to Competitions
        </Button>
      </MotionBox>

      <MotionGrid 
        container 
        spacing={3}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        initial="hidden"
        animate="visible"
      >
        {/* Score Card */}
        <Grid item xs={12} md={4}>
          <MotionCard 
            elevation={3}
            variants={cardVariants}
            custom={0}
            whileHover="hover"
            sx={{ 
              borderRadius: '16px',
              mb: { xs: 3, md: 0 },
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <Box
              sx={{
                height: 6,
                width: '100%',
                bgcolor: competition.isGraded ? 'success.main' : 'info.main',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              }}
            />
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <MotionBox
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100
                }}
              >
                <TrophyIcon sx={{ 
                  fontSize: 60, 
                  color: competition.isGraded ? 'success.main' : 'info.main', 
                  mb: 2 
                }} />
              </MotionBox>
              
              {competition.isGraded ? (
                <>
                  <MotionTypography 
                    variant="h3" 
                    fontWeight="bold" 
                    gutterBottom
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {Math.round(competition.scorePercentage || 0)}%
                  </MotionTypography>
                  <Typography variant="h6" gutterBottom>
                    Score: {competition.totalScore || 0}/{competition.maxPossibleScore || 0}
                  </Typography>
                  <Chip 
                    label="Graded" 
                    color="success" 
                    icon={<CheckIcon />}
                    sx={{ mt: 1 }}
                  />
                </>
              ) : (
                <>
                  <MotionTypography 
                    variant="h5" 
                    fontWeight="bold" 
                    gutterBottom
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Submitted Successfully
                  </MotionTypography>
                  <Typography variant="body1" paragraph>
                    Your answers are being reviewed
                  </Typography>
                  <Chip 
                    label="Pending Grade" 
                    color="info"
                    sx={{ mt: 1 }}
                  />
                </>
              )}
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Submitted on: {formatDate(competition.submissionTime)}
                </Typography>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>

        {/* Results Details */}
        <Grid item xs={12} md={8}>
          <MotionPaper 
            elevation={3}
            variants={cardVariants}
            custom={1}
            whileHover="hover"
            sx={{ 
              borderRadius: '16px', 
              p: 3,
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <Box
              sx={{
                height: 6,
                width: '100%',
                bgcolor: 'secondary.main',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
              }}
            />

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Competition Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Competition Type
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {competition.competitionType || 'Standard'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Questions
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {competition.questions?.length || 0}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {competition.duration || 60} minutes
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Time Taken
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {Math.floor((competition.timeSpent || 0) / 60)} minutes {(competition.timeSpent || 0) % 60} seconds
                </Typography>
              </Grid>
            </Grid>
            
            {competition.isGraded && competition.competitionType === 'MCQ' && competition.answers && (
              <MotionBox
                variants={fadeInUp}
                custom={2}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                  Question Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {competition.answers.map((answer, index) => (
                    <MotionBox
                      key={index}
                      variants={fadeInUp}
                      custom={index * 0.1 + 3}
                    >
                      <ListItem 
                        sx={{ 
                          mb: 1, 
                          bgcolor: answer.isCorrect ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                          borderRadius: 2,
                          border: `1px solid ${answer.isCorrect ? 
                            alpha(theme.palette.success.main, 0.3) : 
                            alpha(theme.palette.error.main, 0.3)}`
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body1" fontWeight="medium">
                                Question {index + 1}:
                              </Typography>
                              {answer.isCorrect ? 
                                <Chip 
                                  label="Correct" 
                                  size="small"
                                  color="success"
                                  icon={<CheckIcon />}
                                  sx={{ ml: 1 }}
                                /> : 
                                <Chip 
                                  label="Incorrect" 
                                  size="small"
                                  color="error"
                                  icon={<CancelIcon />}
                                  sx={{ ml: 1 }}
                                />
                              }
                            </Box>
                          }
                          secondary={
                            answer.isCorrect ? 
                              `Your answer: ${answer.answer}` :
                              `Your answer: ${answer.answer} | Correct answer: ${answer.correctAnswer}`
                          }
                        />
                      </ListItem>
                    </MotionBox>
                  ))}
                </List>
              </MotionBox>
            )}
            
            {(!competition.isGraded || competition.competitionType !== 'MCQ') && (
              <MotionBox
                variants={fadeInUp}
                custom={2}
              >
                <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                  {!competition.isGraded ?
                    'Your answers have been submitted and will be graded soon.' :
                    'Detailed results for this competition type are not available in this view.'
                  }
                </Alert>
              </MotionBox>
            )}
          </MotionPaper>
        </Grid>
      </MotionGrid>
    </Box>
  );
};

export default CompetitionResultsPage;

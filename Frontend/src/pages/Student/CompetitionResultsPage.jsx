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
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  ArrowBack as BackIcon,
  EmojiEvents as TrophyIcon
} from '@mui/icons-material';
import dashboardService from '../../services/dashboardService';

const CompetitionResultsPage = ({ currentDateTime, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
        <Button 
          sx={{ mt: 2 }} 
          variant="outlined" 
          onClick={() => navigate('/student/competitions')}
        >
          Back to Competitions
        </Button>
      </Alert>
    );
  }

  if (!competition) {
    return (
      <Alert severity="warning" sx={{ mb: 3 }}>
        Results not found
        <Button 
          sx={{ mt: 2 }} 
          variant="outlined" 
          onClick={() => navigate('/student/competitions')}
        >
          Back to Competitions
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {competition.competitionName} - Results
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Competition completed on {formatDate(competition.submissionTime)}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/student/competitions')}
        >
          Back to Competitions
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Score Card */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: '16px', 
              border: '1px solid', 
              borderColor: 'divider',
              mb: { xs: 3, md: 0 },
              bgcolor: competition.isGraded ? 'success.light' : 'info.light'
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <TrophyIcon sx={{ fontSize: 60, color: competition.isGraded ? 'success.main' : 'info.main', mb: 2 }} />
              
              {competition.isGraded ? (
                <>
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {Math.round(competition.scorePercentage || 0)}%
                  </Typography>
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
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Submitted Successfully
                  </Typography>
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
          </Card>
        </Grid>

        {/* Results Details */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: '16px', 
              border: '1px solid', 
              borderColor: 'divider',
              p: 3
            }}
          >
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
              <>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                  Question Summary
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <List>
                  {competition.answers.map((answer, index) => (
                    <ListItem 
                      key={index}
                      sx={{ 
                        mb: 1, 
                        bgcolor: answer.isCorrect ? 'success.light' : 'error.light',
                        borderRadius: 1
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
                  ))}
                </List>
              </>
            )}
            
            {(!competition.isGraded || competition.competitionType !== 'MCQ') && (
              <Alert severity="info" sx={{ mt: 3 }}>
                {!competition.isGraded ?
                  'Your answers have been submitted and will be graded soon.' :
                  'Detailed results for this competition type are not available in this view.'
                }
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompetitionResultsPage;
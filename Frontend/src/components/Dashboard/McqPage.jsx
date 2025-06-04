import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Container,
  Grid,
  AppBar,
  Toolbar,
  LinearProgress,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  alpha,
  Badge,
  Chip,
  Tooltip,
  useMediaQuery,
  IconButton
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Timer,
  Warning,
  Send as SendIcon,
  QuestionAnswer,
  Flag as FlagIcon,
  HelpOutline,
  BookmarkBorder,
  Bookmark,
} from '@mui/icons-material';
import { submitCompetitionAnswers } from '../../services/api';
import CompetitionSuccessPage from '../../pages/Student/CompetitionSuccessPage';

function McqPage({ questions = [], competition = {} }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for current question index, answers, and timer
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState({});
  const [timeLeft, setTimeLeft] = useState(competition.duration ? competition.duration * 60 : 600); // Default 10 min if not set
  const [openSummaryDialog, setOpenSummaryDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Set up timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update answered questions count when answers change
  useEffect(() => {
    setAnsweredQuestions(Object.keys(answers).length);
  }, [answers]);

  // Format time remaining
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerChange = (e) => {
    const question = questions[currentQuestion];
    if (!question || !question._id) return;
    
    const questionId = question._id;
    const selectedOption = e.target.value;
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  // Navigation between questions
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Toggle bookmark for current question
  const toggleBookmark = () => {
    const question = questions[currentQuestion];
    if (!question || !question._id) return;
    
    const questionId = question._id;
    setBookmarkedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Jump to specific question
  const jumpToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  // Open summary dialog before final submission
  const handleOpenSummary = () => {
    setOpenSummaryDialog(true);
  };

  // Submit answers
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Format answers for submission
      const questionIds = questions.map(q => q._id);
      const answersArray = questionIds.map(qId => answers[qId] || '');
      
      // Make API call to submit answers using the API service
      const response = await submitCompetitionAnswers(
        competition._id,
        questionIds,
        answersArray
      );
      
      setSnackbar({
        open: true,
        message: 'Your answers have been submitted successfully!',
        severity: 'success'
      });
      
      console.log("Submission response:", response.data);
      
      // Prepare submission details for success page
      setSubmissionDetails({
        submissionId: response.data?.submissionId || `SUB-${Date.now()}`,
        problem: competition.competitionName,
        submissionDate: new Date().toLocaleString(),
        completedIn: `${competition.duration - Math.floor(timeLeft/60)}m ${60 - (timeLeft % 60)}s`,
        score: response.data?.preliminaryScore || "Awaiting evaluation"
      });
      
      // Close dialog and set submission as complete
      setOpenSummaryDialog(false);
      setSubmissionComplete(true);
    } catch (error) {
      console.error('Error submitting answers:', error);
      
      setSnackbar({
        open: true,
        message: error.message || 'Failed to submit answers. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get badge color based on time remaining
  const getTimerColor = () => {
    const totalTime = competition.duration ? competition.duration * 60 : 600;
    const percentLeft = (timeLeft / totalTime) * 100;
    
    if (percentLeft < 10) return theme.palette.error.main;
    if (percentLeft < 25) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  // Determine if a question is answered
  const isQuestionAnswered = (questionId) => {
    return !!answers[questionId];
  };

  // Determine if a question is bookmarked
  const isQuestionBookmarked = (questionId) => {
    return !!bookmarkedQuestions[questionId];
  };

  // Render the current question
  const renderQuestion = () => {
    if (!questions || questions.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">No questions available for this competition.</Typography>
        </Box>
      );
    }

    const question = questions[currentQuestion];
    
    if (!question) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">Question not found.</Typography>
        </Box>
      );
    }

    const isBookmarked = isQuestionBookmarked(question._id);

    return (
      <Card elevation={3} sx={{ position: 'relative', borderRadius: 2 }}>
        <Box sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 16, 
          display: 'flex', 
          gap: 1 
        }}>
          <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark question"}>
            <IconButton 
              onClick={toggleBookmark} 
              color={isBookmarked ? "primary" : "default"}
            >
              {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Tooltip>
          
          <Chip 
            label={`Question ${currentQuestion + 1}/${questions.length}`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
        
        <CardContent sx={{ pt: 5 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontWeight: 600, 
              color: theme.palette.text.primary,
              pr: 8 // Space for the bookmark icon
            }}
          >
            {question.question}
          </Typography>
          
          {question.description && (
            <Typography 
              variant="body1" 
              color="textSecondary" 
              paragraph 
              sx={{ 
                mb: 3, 
                fontStyle: question.description.includes('Note:') ? 'italic' : 'normal'
              }}
            >
              {question.description}
            </Typography>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup 
              value={answers[question._id] || ''} 
              onChange={handleAnswerChange}
            >
              {question.options && question.options.map((option, index) => {
                const isSelected = answers[question._id] === option;
                
                return (
                  <Paper 
                    key={index}
                    elevation={1} 
                    sx={{ 
                      mb: 2, 
                      p: 0, 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: isSelected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.8),
                      bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.05) : 'background.paper',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.action.hover, 0.7),
                        transform: 'translateY(-2px)',
                        boxShadow: isSelected ? `0px 4px 8px ${alpha(theme.palette.primary.main, 0.25)}` : theme.shadows[2]
                      }
                    }}
                  >
                    <FormControlLabel
                      value={option}
                      control={
                        <Radio 
                          sx={{ 
                            color: isSelected ? theme.palette.primary.main : undefined,
                            '& .MuiSvgIcon-root': { fontSize: 22 }
                          }} 
                        />
                      }
                      label={
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: isSelected ? 600 : 400,
                            color: isSelected ? theme.palette.primary.main : theme.palette.text.primary
                          }}
                        >
                          {option}
                        </Typography>
                      }
                      sx={{ width: '100%', m: 0, p: 1.5 }}
                    />
                  </Paper>
                );
              })}
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>
    );
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  // If submission is complete, show the success page
  if (submissionComplete) {
    return <CompetitionSuccessPage submissionDetails={submissionDetails} />;
  }

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: alpha(theme.palette.background.default, 0.98)
    }}>
      {/* Top AppBar with Timer */}
      <AppBar 
        position="static" 
        color="default" 
        elevation={3}
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {competition.competitionName || 'MCQ Competition'}
            <Tooltip title="View instructions">
              <IconButton 
                size="small"
                color="primary"
                onClick={() => setShowInstructions(true)}
              >
                <HelpOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Chip
                icon={<QuestionAnswer fontSize="small" />}
                label={`${answeredQuestions}/${questions.length} Answered`}
                color="primary"
                variant="outlined"
              />
            </Box>
            
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: alpha(getTimerColor(), 0.1),
              border: `1px solid ${getTimerColor()}`,
              color: getTimerColor(),
              px: 2,
              py: 0.75,
              borderRadius: 2
            }}>
              <Timer sx={{ mr: 1, color: getTimerColor() }} />
              <Typography 
                variant="subtitle1" 
                fontFamily="monospace" 
                fontWeight="bold"
                sx={{ color: getTimerColor() }}
              >
                {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
        
        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={(answeredQuestions / questions.length) * 100}
          sx={{ 
            height: 4,
            '& .MuiLinearProgress-bar': {
              bgcolor: getTimerColor()
            }
          }}
        />
      </AppBar>

      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 3, 
          mb: 2, 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column'
        }}
      >
        <Grid container spacing={3}>
          {/* Left: Question Navigator - Hidden on mobile, shown in drawer */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <Card 
                elevation={2}
                sx={{ 
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 600,
                      color: theme.palette.text.primary
                    }}
                  >
                    <QuestionAnswer fontSize="small" sx={{ mr: 1 }} />
                    Question Navigator
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 3, textAlign: 'center' }}>
                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      Questions Answered: {answeredQuestions}/{questions.length}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(answeredQuestions / questions.length) * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        mb: 1
                      }}
                    />
                  </Box>
                  
                  <Grid container spacing={1}>
                    {questions.map((q, index) => {
                      const isAnswered = isQuestionAnswered(q._id);
                      const isBookmarked = isQuestionBookmarked(q._id);
                      const isCurrent = index === currentQuestion;
                      
                      return (
                        <Grid item xs={4} key={index}>
                          <Badge
                            color="primary"
                            variant="dot"
                            invisible={!isBookmarked}
                            overlap="circular"
                            sx={{
                              '.MuiBadge-badge': {
                                top: 5,
                                right: 5,
                                transform: 'scale(0.9) translate(50%, -50%)',
                              }
                            }}
                          >
                            <Button
                              variant={isAnswered ? "contained" : "outlined"}
                              color={isCurrent ? "primary" : isAnswered ? "success" : "inherit"}
                              onClick={() => jumpToQuestion(index)}
                              sx={{
                                minWidth: 0,
                                width: '100%',
                                height: '36px',
                                borderRadius: 1.5,
                                fontWeight: 'bold',
                                border: isCurrent ? `2px solid ${theme.palette.primary.main}` : undefined,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)'
                                }
                              }}
                            >
                              {index + 1}
                            </Button>
                          </Badge>
                        </Grid>
                      );
                    })}
                  </Grid>
                  
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Chip
                        size="small"
                        icon={<CheckCircle fontSize="small" />}
                        label="Answered" 
                        color="success"
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        icon={<BookmarkBorder fontSize="small" />} 
                        label="Bookmarked"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    startIcon={<SendIcon />}
                    onClick={handleOpenSummary}
                    sx={{ 
                      py: 1.25, 
                      fontWeight: 'bold',
                      borderRadius: 2,
                      boxShadow: theme.shadows[4],
                      '&:hover': {
                        boxShadow: theme.shadows[8],
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Submit Exam
                  </Button>
                </Box>
              </Card>
            </Grid>
          )}
          
          {/* Right: Question Display */}
          <Grid 
            item 
            xs={12} 
            md={isMobile ? 12 : 9} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column'
            }}
          >
            {renderQuestion()}
            
            {/* Compact Status Bar for Mobile */}
            {isMobile && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                bgcolor: 'background.paper',
                p: 2,
                mt: 2,
                borderRadius: 2,
                boxShadow: 1
              }}>
                <Typography variant="body2">
                  <strong>{answeredQuestions}/{questions.length}</strong> answered
                </Typography>
                
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  endIcon={<FlagIcon />}
                  onClick={() => setOpenSummaryDialog(true)}
                >
                  Finish
                </Button>
              </Box>
            )}
            
            {/* Navigation Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 3,
              alignItems: 'center' 
            }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                sx={{ 
                  borderRadius: 2,
                  px: 3
                }}
              >
                Previous
              </Button>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isMobile && (
                  <Chip
                    label={`${currentQuestion + 1}/${questions.length}`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                )}
                
                <Button
                  variant={
                    currentQuestion === questions.length - 1 
                      ? "contained" 
                      : "outlined"
                  }
                  color={
                    currentQuestion === questions.length - 1 
                      ? "primary" 
                      : "primary"
                  }
                  endIcon={
                    currentQuestion === questions.length - 1 
                      ? <SendIcon /> 
                      : <ArrowForward />
                  }
                  onClick={
                    currentQuestion === questions.length - 1 
                      ? handleOpenSummary 
                      : handleNextQuestion
                  }
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    ...(currentQuestion === questions.length - 1 && {
                      fontWeight: 'bold',
                      boxShadow: theme.shadows[4],
                      '&:hover': {
                        boxShadow: theme.shadows[8],
                      }
                    })
                  }}
                >
                  {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* Instructions Dialog */}
      <Dialog
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {competition.competitionName || 'Exam'} Instructions
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
              <ListItemText 
                primary="Answering Questions" 
                secondary="Select one option for each question. You can change your answers anytime before submission." 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><BookmarkBorder color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Bookmarking" 
                secondary="Use the bookmark icon to mark questions you want to review later." 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><Timer color="warning" /></ListItemIcon>
              <ListItemText 
                primary="Time Limit" 
                secondary={`The exam has a time limit of ${competition.duration || 10} minutes. Your answers will be automatically submitted when time expires.`} 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon><SendIcon color="error" /></ListItemIcon>
              <ListItemText 
                primary="Submission" 
                secondary="Click 'Submit Exam' when you're ready to finish. You cannot return to the exam after submission." 
              />
            </ListItem>
          </List>

          {competition.instructions && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Additional Instructions:
              </Typography>
              <Typography variant="body2">
                {competition.instructions}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInstructions(false)} variant="contained">
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Submission Summary Dialog */}
      <Dialog
        open={openSummaryDialog}
        onClose={() => !isSubmitting && setOpenSummaryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Confirm Submission
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            You are about to submit your answers. Once submitted, you cannot change them.
          </DialogContentText>
          
          <Card variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Summary:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        Questions Answered: 
                        <Typography 
                          component="span"
                          variant="body2"
                          fontWeight="bold" 
                          color="success.main"
                          sx={{ ml: 1 }}
                        >
                          {answeredQuestions} of {questions.length}
                        </Typography>
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Warning color={answeredQuestions < questions.length ? "error" : "disabled"} /></ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        Questions Unanswered:
                        <Typography 
                          component="span"
                          variant="body2"
                          fontWeight="bold" 
                          color={answeredQuestions < questions.length ? "error" : "text.secondary"}
                          sx={{ ml: 1 }}
                        >
                          {questions.length - answeredQuestions}
                        </Typography>
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Timer color="info" /></ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        Time Remaining: 
                        <Typography 
                          component="span"
                          variant="body2"
                          fontWeight="bold" 
                          color="info.main"
                          fontFamily="monospace"
                          sx={{ ml: 1 }}
                        >
                          {formatTime(timeLeft)}
                        </Typography>
                      </Typography>
                    } 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
          
          {answeredQuestions < questions.length && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              You still have {questions.length - answeredQuestions} unanswered questions. Are you sure you want to submit?
            </Alert>
          )}
          
          <Alert severity="info">
            Once submitted, you will not be able to return to this exam or change your answers.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setOpenSummaryDialog(false)} 
            disabled={isSubmitting}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Continue Exam
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            color="primary" 
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{ 
              borderRadius: 2, 
              px: 3,
              py: 1.25,
              fontWeight: 'bold'
            }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answers'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled" 
          sx={{ width: '100%', boxShadow: theme.shadows[3] }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default McqPage;
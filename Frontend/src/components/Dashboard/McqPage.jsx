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
  Stepper,
  Step,
  StepLabel,
  Container,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
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
  Alert
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  CheckCircle,
  Timer,
  Warning,
  Send as SendIcon,
  QuestionAnswer,
  PieChart
} from '@mui/icons-material';
import { submitCompetitionAnswers } from '../../services/api';
import CompetitionSuccessPage from '../../pages/Student/CompetitionSuccessPage';

function McqPage({ questions = [], competition = {} }) {
  // State for current question index, answers, and timer
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(competition.duration ? competition.duration * 60 : 600); // Default 10 min if not set
  const [openSummaryDialog, setOpenSummaryDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [submissionComplete, setSubmissionComplete] = useState(false);
  const [submissionDetails, setSubmissionDetails] = useState(null);
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

    return (
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Question {currentQuestion + 1}: {question.question}
          </Typography>
          
          {question.description && (
            <Typography variant="body1" color="textSecondary" paragraph sx={{ mb: 3 }}>
              {question.description}
            </Typography>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup 
              value={answers[question._id] || ''} 
              onChange={handleAnswerChange}
            >
              {question.options && question.options.map((option, index) => (
                <Paper 
                  key={index}
                  elevation={1} 
                  sx={{ 
                    mb: 2, 
                    p: 1, 
                    borderRadius: 2,
                    border: answers[question._id] === option ? '2px solid' : '1px solid',
                    borderColor: answers[question._id] === option ? 'primary.main' : 'divider',
                    bgcolor: answers[question._id] === option ? 'action.selected' : 'background.paper',
                    '&:hover': { bgcolor: 'action.hover' }
                  }}
                >
                  <FormControlLabel
                    value={option}
                    control={<Radio />}
                    label={option}
                    sx={{ width: '100%', m: 0, p: 1 }}
                  />
                </Paper>
              ))}
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
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top AppBar with Timer */}
      <AppBar position="static" color="default" elevation={2}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {competition.competitionName || 'MCQ Competition'}
          </Typography>
          
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: timeLeft < 300 ? 'error.light' : 'primary.main',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 2
          }}>
            <Timer sx={{ mr: 1 }} />
            <Typography variant="subtitle1" fontFamily="monospace" fontWeight="bold">
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Toolbar>
        
        {/* Progress Bar */}
        <LinearProgress
          variant="determinate"
          value={(answeredQuestions / questions.length) * 100}
          sx={{ height: 6 }}
        />
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 3, mb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={3}>
          {/* Left: Question Navigator */}
          <Grid item xs={12} md={3}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <QuestionAnswer fontSize="small" sx={{ mr: 1 }} />
                  Question Navigator
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={1}>
                  {questions.map((q, index) => (
                    <Grid item xs={3} sm={2} md={4} key={index}>
                      <Button
                        variant={answers[q._id] ? "contained" : "outlined"}
                        color={answers[q._id] ? "primary" : "inherit"}
                        onClick={() => jumpToQuestion(index)}
                        sx={{
                          minWidth: 0,
                          width: '100%',
                          height: '36px',
                          aspectRatio: '1',
                          borderRadius: 1,
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Questions Answered: {answeredQuestions}/{questions.length}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(answeredQuestions / questions.length) * 100}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              </CardContent>
            </Card>
            
            <Button
              variant="contained"
              color="error"
              fullWidth
              startIcon={<SendIcon />}
              onClick={handleOpenSummary}
              sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
            >
              Submit Exam
            </Button>
          </Grid>
          
          {/* Right: Question Display */}
          <Grid item xs={12} md={9} sx={{ display: 'flex', flexDirection: 'column' }}>
            {renderQuestion()}
            
            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1}
              >
                Next
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* Submission Summary Dialog */}
      <Dialog
        open={openSummaryDialog}
        onClose={() => !isSubmitting && setOpenSummaryDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to submit your answers. Once submitted, you cannot change them.
          </DialogContentText>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Summary:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><CheckCircle color="primary" /></ListItemIcon>
                <ListItemText primary={`Questions Answered: ${answeredQuestions} of ${questions.length}`} />
              </ListItem>
              <ListItem>
                <ListItemIcon><Warning color="error" /></ListItemIcon>
                <ListItemText 
                  primary={`Questions Unanswered: ${questions.length - answeredQuestions}`} 
                  secondary={answeredQuestions < questions.length ? "You still have unanswered questions." : ""}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Timer color="info" /></ListItemIcon>
                <ListItemText primary={`Time Remaining: ${formatTime(timeLeft)}`} />
              </ListItem>
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenSummaryDialog(false)} 
            disabled={isSubmitting}
          >
            Continue Exam
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            color="primary" 
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default McqPage;
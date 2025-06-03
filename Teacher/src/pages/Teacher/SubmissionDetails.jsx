import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider,
  Paper,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  useTheme,
  RadioGroup,
  FormControlLabel ,
    Radio,
    Snackbar
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Person,
  Email,
  School,
  Grade,
  Timer,
  EventNote
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';

// API base URL
const API_BASE_URL = "http://localhost:5000/api/teacher/dashboard";

const SubmissionDetails = ({ open, onClose, submission, competition }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detailedSubmission, setDetailedSubmission] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationSuccess, setEvaluationSuccess] = useState(false);
  
  useEffect(() => {
    if (open && submission && submission._id) {
      fetchSubmissionDetails();
    }
  }, [open, submission]);
  
  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/competitions/submissions/${submission._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Submission details response:', response.data);
      if (response.data.success) {
        setDetailedSubmission(response.data.data);
      } else {
        setError('Failed to load submission details');
      }
    } catch (err) {
      console.error('Error fetching submission details:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load submission details');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEvaluateSubmission = async () => {
    try {
      setEvaluating(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      // Directly try to evaluate the submission without checking first
      const response = await axios.get(
        `${API_BASE_URL}/competitions/${submission._id}/results`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            submissionId: submission._id
          }
        }
      );
      
      console.log('Evaluation response:', response.data);
      
      if (response.data.success) {
        // If it's a new evaluation or an existing one, update the UI
        if (response.data.data.isExisting) {
          // If result already existed, just update state silently
          setDetailedSubmission(prevState => ({
            ...prevState,
            result: {
              isGraded: true,
              totalScore: response.data.data.totalScore,
              maxPossibleScore: response.data.data.maxPossibleScore || prevState.submission.totalQuestions,
              percentageScore: response.data.data.percentageScore
            }
          }));
        } else {
          // New evaluation was created, show success message
          setEvaluationSuccess(true);
          
          // Refresh submission details to show updated result
          fetchSubmissionDetails();
          
          // Reset success message after 3 seconds
          setTimeout(() => {
            setEvaluationSuccess(false);
          }, 3000);
        }
      } else {
        throw new Error(response.data.message || 'Failed to evaluate submission');
      }
    } catch (err) {
      console.error('Error evaluating submission:', err);
      setError(err.response?.data?.message || err.message || 'Failed to evaluate submission');
    } finally {
      setEvaluating(false);
    }
  };
  
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm:ss');
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  // Render MCQ question with radio options
  const renderMcqQuestion = (answer, index) => {
    const questionText = answer.question ? answer.question.question : 'Unknown question';
    const correctAnswer = answer.question ? answer.question.answer : null;
    const studentAnswer = answer.studentAnswer || 'Not answered';
    const isCorrect = correctAnswer === studentAnswer;
    const options = answer.question ? answer.question.options || [] : [];
    
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: !studentAnswer || studentAnswer === 'Not answered'
            ? 'rgba(255, 152, 0, 0.05)'
            : isCorrect
              ? 'rgba(76, 175, 80, 0.05)'
              : 'rgba(244, 67, 54, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="subtitle2" fontWeight="medium">
            Question {index + 1}: {questionText}
          </Typography>
          
          {studentAnswer && studentAnswer !== 'Not answered' && (
            <Chip 
              icon={isCorrect ? <CheckCircle fontSize="small" /> : <Cancel fontSize="small" />}
              label={isCorrect ? "Correct" : "Incorrect"} 
              color={isCorrect ? "success" : "error"} 
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </Box>
        
        {options.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <RadioGroup
              value={studentAnswer}
              name={`question-${index}`}
            >
              {options.map((option, optIndex) => {
                const isStudentAnswer = studentAnswer === option;
                const isCorrectOption = correctAnswer === option;
                
                return (
                  <FormControlLabel
                    key={optIndex}
                    value={option}
                    control={
                      <Radio 
                        disabled 
                        color={isCorrectOption ? "success" : isStudentAnswer ? "error" : "default"}
                        checked={isStudentAnswer}
                      />
                    }
                    label={
                      <Box component="span" sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        color: isCorrectOption 
                          ? 'success.main' 
                          : isStudentAnswer && !isCorrectOption ? 'error.main' : 'text.primary',
                        fontWeight: isCorrectOption || isStudentAnswer ? 'medium' : 'regular'
                      }}>
                        {option}
                        {isCorrectOption && (
                          <Chip 
                            label="Correct Answer" 
                            size="small" 
                            color="success" 
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    }
                  />
                );
              })}
            </RadioGroup>
          </Box>
        )}
        
        {(!studentAnswer || studentAnswer === 'Not answered') && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            This question was not answered
          </Alert>
        )}
      </Paper>
    );
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6">Submission Details</Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        ) : detailedSubmission ? (
          <Box>
            {/* Student Information */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Student Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">Name:</Typography>
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                      {detailedSubmission.student.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">Email:</Typography>
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                      {detailedSubmission.student.email || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <School color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">Grade:</Typography>
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                      {detailedSubmission.student.grade || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <School color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">School:</Typography>
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                      {detailedSubmission.student.school || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Submission Summary */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                mb: 3, 
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Submission Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventNote color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">Competition:</Typography>
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                      {detailedSubmission.competition.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Grade color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">Status:</Typography>
                    <Chip
                      size="small"
                      label={detailedSubmission.result?.isGraded ? 'Graded' : 'Not Graded'}
                      color={detailedSubmission.result?.isGraded ? 'success' : 'warning'}
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Timer color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">Questions Answered:</Typography>
                    <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                      {detailedSubmission.submission.answeredQuestions} / {detailedSubmission.submission.totalQuestions}
                    </Typography>
                  </Box>
                  
                  {detailedSubmission.result && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Grade color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">Score:</Typography>
                      <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                        {detailedSubmission.result.totalScore} / {detailedSubmission.result.maxPossibleScore} 
                        ({Math.round(detailedSubmission.result.percentageScore)}%)
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Paper>
            
            {/* Answers */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Question Responses
                </Typography>
                
                {detailedSubmission.answers && detailedSubmission.answers.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Score:</Typography>
                    <Chip 
                      label={detailedSubmission.result ? 
                        `${detailedSubmission.result.totalScore}/${detailedSubmission.result.maxPossibleScore}` : 
                        `${detailedSubmission.answers.filter(a => a.question && a.question.answer === a.studentAnswer).length}/${detailedSubmission.answers.length}`
                      } 
                      color="primary" 
                      size="medium"
                    />
                  </Box>
                )}
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {detailedSubmission.answers && detailedSubmission.answers.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  {detailedSubmission.answers.map((answer, index) => (
                    renderMcqQuestion(answer, index)
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                  No question responses available.
                </Typography>
              )}
            </Paper>
            
            {/* Feedback Section - if available */}
            {detailedSubmission.result && detailedSubmission.result.overallFeedback && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2,
                  mt: 3,
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Teacher Feedback
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Typography variant="body2">
                  {detailedSubmission.result.overallFeedback}
                </Typography>
              </Paper>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            No submission details available.
          </Typography>
        )}
        
        {evaluationSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Submission evaluated successfully! The results have been updated.
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
          Close
        </Button>
        
        {detailedSubmission && 
         detailedSubmission.competition.type === 'MCQ' && 
         (!detailedSubmission.result || !detailedSubmission.result.isGraded) && (
          <Button 
            onClick={handleEvaluateSubmission}
            variant="contained"
            disabled={evaluating}
            startIcon={evaluating ? <CircularProgress size={20} /> : null}
            sx={{ 
              borderRadius: '8px',
              bgcolor: 'var(--theme-color)',
              '&:hover': {
                bgcolor: 'var(--hover-color)'
              }
            }}
          >
            {evaluating ? 'Evaluating...' : 'Evaluate Submission'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SubmissionDetails;

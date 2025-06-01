import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, CircularProgress,
  Alert, Stepper, Step, StepLabel, Radio, RadioGroup, 
  FormControlLabel, FormControl, TextField, Checkbox,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, AppBar, Toolbar, IconButton, LinearProgress,
  Chip, Grid, Snackbar, Card, CardContent, Divider
} from '@mui/material';
import {
  ArrowForward, ArrowBack, Check, Warning, Timer,
  Close, Save, ExitToApp, Fullscreen, FullscreenExit,
  Help, Info, QuestionAnswer, CheckCircle, Edit
} from '@mui/icons-material';
import dashboardService from '../../services/dashboardService';

// Import a code editor component
import Editor from '@monaco-editor/react';

const CompetitionExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const timerRef = useRef(null);
  const autoSaveRef = useRef(null);
  const fullscreenRef = useRef(null);
  
  // Current date/time and user
  const currentDateTime = "2025-06-01 09:18:42";
  const currentUser = "VanshSharmaSDEimport";

  // Fetch competition details
  useEffect(() => {
    fetchCompetitionDetails();
    
    // Set up full screen change event listener
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      // Clean up timers and event listeners
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoSaveRef.current) clearInterval(autoSaveRef.current);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [id]);

  const fetchCompetitionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getCompetitionDetails(id);
      console.log('Competition details response:', response);
      if (response.success) {
        const competitionData = response.data.competition;
        setCompetition(competitionData);
        
        // Initialize answers array
        const initialAnswers = competitionData.questions.map(question => ({
          questionId: question._id,
          questionType: question.questionType,
          answer: null
        }));
        
        // If there are saved answers, use them
        if (competitionData.savedAnswers) {
          const savedAnswers = competitionData.savedAnswers;
          savedAnswers.forEach(savedAnswer => {
            const index = initialAnswers.findIndex(a => a.questionId === savedAnswer.questionId);
            if (index !== -1) {
              initialAnswers[index].answer = savedAnswer.answer;
            }
          });
        }
        
        setAnswers(initialAnswers);
        
        // Calculate time remaining
        if (competitionData.endTiming) {
          const endTime = new Date(competitionData.endTiming).getTime();
          const now = new Date().getTime();
          const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
          setTimeRemaining(remaining);
        } else {
          // Use duration in minutes if no end timing
          setTimeRemaining(competitionData.duration * 60);
        }
        
        // Start timer
        startTimer();
        
        // Start auto-save timer (every 30 seconds)
        autoSaveRef.current = setInterval(() => {
          saveAnswers(false);
        }, 30000);
        
        // Enter full screen if not already
        if (!isFullScreen) {
          toggleFullScreen();
        }
      } else if (response.data && response.data.redirectToCompetition) {
        // Handle redirection to a specific competition
        navigate(`/student/competitions/${response.data.redirectToCompetition}/exam`);
      } else {
        setError(response.message || 'Failed to load competition');
      }
    } catch (error) {
      setError('Error loading competition. Please try again later.');
      console.error('Error fetching competition details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Start competition timer
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Auto-submit when time runs out
          submitAnswers();
          return 0;
        }
        return prev - 1;
      });
      
      setTimeSpent(prev => prev + 1);
    }, 1000);
  };

  // Format time remaining
  const formatTimeRemaining = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle answer change
  const handleAnswerChange = (value) => {
    const newAnswers = [...answers];
    newAnswers[activeStep].answer = value;
    setAnswers(newAnswers);
  };

  // Move to next question
  const handleNext = () => {
    const newActiveStep = activeStep + 1;
    setActiveStep(newActiveStep);
  };

  // Move to previous question
  const handleBack = () => {
    const newActiveStep = activeStep - 1;
    setActiveStep(newActiveStep);
  };

  // Save answers without submitting
  const saveAnswers = async (showNotification = true) => {
    if (!competition || isSaving) return;
    
    try {
      setIsSaving(true);
      
      const response = await dashboardService.saveCompetitionAnswers(id, {
        answers: answers.filter(a => a.answer !== null),
        timeSpent
      });
      
      if (response.success) {
        if (showNotification) {
          setSaveMessage('Answers saved successfully');
          setShowSaveMessage(true);
        }
      } else {
        setSaveMessage('Failed to save answers');
        setShowSaveMessage(true);
      }
    } catch (error) {
      console.error('Error saving answers:', error);
      setSaveMessage('Error saving answers');
      setShowSaveMessage(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Submit answers
  const submitAnswers = async () => {
    if (!competition || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setConfirmSubmit(false);
      
      const response = await dashboardService.submitCompetitionAnswers(id, {
        answers: answers.filter(a => a.answer !== null),
        timeSpent
      });
      
      if (response.success) {
        // Clean up timers
        if (timerRef.current) clearInterval(timerRef.current);
        if (autoSaveRef.current) clearInterval(autoSaveRef.current);
        
        // Exit fullscreen
        if (isFullScreen) {
          exitFullScreen();
        }
        
        // Navigate to results page
        navigate(`/student/competitions/${id}/results`);
      } else {
        setError(response.message || 'Failed to submit answers');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      setError('Error submitting answers. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Toggle full screen mode
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      enterFullScreen();
    } else {
      exitFullScreen();
    }
  };

  // Enter full screen
  const enterFullScreen = () => {
    const element = fullscreenRef.current || document.documentElement;
    
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  // Exit full screen
  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  // Handle fullscreen change
  const handleFullscreenChange = () => {
    setIsFullScreen(!!document.fullscreenElement);
  };

  // Handle competition exit
  const handleExit = () => {
    // Save answers before exiting
    saveAnswers(false);
    
    // Clean up timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (autoSaveRef.current) clearInterval(autoSaveRef.current);
    
    // Exit fullscreen
    if (isFullScreen) {
      exitFullScreen();
    }
    
    // Navigate back to competition details
    navigate(`/student/competitions/${id}`);
  };

  // Get total answered questions
  const getAnsweredCount = () => {
    return answers.filter(a => a.answer !== null && a.answer !== '').length;
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    return (getAnsweredCount() / answers.length) * 100;
  };

  // ======== ANSWER INTERFACES ========
  
  // Render MCQ question
  const renderMCQQuestion = (question) => {
    const currentAnswer = answers[activeStep]?.answer;
    
    return (
      <Card raised sx={{ mt: 4, border: '2px solid #3f51b5', borderRadius: 2 }}>
        <CardContent sx={{ bgcolor: '#f5f5f5', py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <QuestionAnswer color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6" color="primary" fontWeight="bold">
              CHOOSE ONE ANSWER
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select the correct option by clicking the radio button
          </Typography>
        </CardContent>
        
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            <RadioGroup
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
            >
              {question.options.map((option, index) => (
                <Paper 
                  key={option._id || option.id || index}
                  elevation={currentAnswer === (option._id || option.id) ? 3 : 1}
                  sx={{
                    mb: 2,
                    border: '2px solid',
                    borderColor: currentAnswer === (option._id || option.id) ? '#4caf50' : '#e0e0e0',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#bbdefb',
                      bgcolor: '#f5f5f5',
                    }
                  }}
                >
                  <FormControlLabel
                    value={option._id || option.id}
                    control={
                      <Radio 
                        sx={{ 
                          '&.Mui-checked': { color: '#4caf50' },
                          transform: 'scale(1.3)',
                          ml: 2
                        }}
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ py: 1 }}>
                        {option.text}
                      </Typography>
                    }
                    sx={{
                      width: '100%',
                      m: 0,
                      bgcolor: currentAnswer === (option._id || option.id) ? '#e8f5e9' : 'transparent',
                    }}
                  />
                </Paper>
              ))}
            </RadioGroup>
          </FormControl>
          
          {currentAnswer && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', color: 'success.main' }}>
              <CheckCircle sx={{ mr: 1 }} />
              <Typography variant="body2">
                Answer selected
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    );
  };

  // Render checkbox question (multiple select)
  const renderCheckboxQuestion = (question) => {
    const currentAnswer = Array.isArray(answers[activeStep]?.answer) ? 
      answers[activeStep].answer : 
      answers[activeStep]?.answer ? [answers[activeStep].answer] : [];
    
    const handleCheckboxChange = (optionId) => {
      const newSelection = [...currentAnswer];
      
      if (newSelection.includes(optionId)) {
        // Remove option if already selected
        const index = newSelection.indexOf(optionId);
        newSelection.splice(index, 1);
      } else {
        // Add option if not selected
        newSelection.push(optionId);
      }
      
      handleAnswerChange(newSelection);
    };
    
    return (
      <Card raised sx={{ mt: 4, border: '2px solid #ff9800', borderRadius: 2 }}>
        <CardContent sx={{ bgcolor: '#fff8e1', py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <QuestionAnswer color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6" color="warning.dark" fontWeight="bold">
              SELECT MULTIPLE ANSWERS
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Check all options that apply to this question
          </Typography>
        </CardContent>
        
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            {question.options.map((option, index) => {
              const isSelected = currentAnswer.includes(option._id || option.id);
              
              return (
                <Paper 
                  key={option._id || option.id || index}
                  elevation={isSelected ? 3 : 1}
                  sx={{
                    mb: 2,
                    border: '2px solid',
                    borderColor: isSelected ? '#ff9800' : '#e0e0e0',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#ffe0b2',
                      bgcolor: '#f5f5f5',
                    }
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => handleCheckboxChange(option._id || option.id)}
                        sx={{ 
                          '&.Mui-checked': { color: '#ff9800' },
                          transform: 'scale(1.3)',
                          ml: 2
                        }}
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ py: 1 }}>
                        {option.text}
                      </Typography>
                    }
                    sx={{
                      width: '100%',
                      m: 0,
                      bgcolor: isSelected ? '#fff8e1' : 'transparent',
                    }}
                  />
                </Paper>
              );
            })}
          </FormControl>
          
          {currentAnswer.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', color: 'warning.main' }}>
              <CheckCircle sx={{ mr: 1 }} />
              <Typography variant="body2">
                {currentAnswer.length} option{currentAnswer.length !== 1 ? 's' : ''} selected
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    );
  };

  // Render text question
  const renderTextQuestion = (question) => {
    const currentAnswer = answers[activeStep]?.answer || '';
    
    return (
      <Card raised sx={{ mt: 4, border: '2px solid #2196f3', borderRadius: 2 }}>
        <CardContent sx={{ bgcolor: '#e3f2fd', py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Edit color="info" sx={{ mr: 1 }} />
            <Typography variant="h6" color="info.dark" fontWeight="bold">
              TEXT ANSWER
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Write your answer in the text area below
          </Typography>
        </CardContent>
        
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <TextField
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            placeholder="Type your detailed answer here..."
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            sx={{ 
              bgcolor: 'white',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#2196f3',
                  borderWidth: 2,
                },
              }
            }}
          />
          
          {currentAnswer && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'info.main' }}>
                <Info sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Answer in progress
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {currentAnswer.length} characters written
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    );
  };

  // Render code question
  const renderCodeQuestion = (question) => {
    const currentAnswer = answers[activeStep]?.answer || '';
    const language = question.codeLanguage || 'javascript';
    
    const handleEditorChange = (value) => {
      handleAnswerChange(value);
    };
    
    // Map language to display name
    const getLanguageDisplay = (lang) => {
      const map = {
        javascript: 'JavaScript',
        java: 'Java',
        python: 'Python',
        csharp: 'C#',
        cpp: 'C++',
        php: 'PHP',
        html: 'HTML',
        css: 'CSS',
        typescript: 'TypeScript',
        sql: 'SQL'
      };
      return map[lang.toLowerCase()] || lang;
    };
    
    return (
      <Card raised sx={{ mt: 4, border: '2px solid #673ab7', borderRadius: 2 }}>
        <CardContent sx={{ bgcolor: '#ede7f6', py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Code color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6" color="secondary.dark" fontWeight="bold">
                CODE SOLUTION
              </Typography>
            </Box>
            
            <Chip
              label={getLanguageDisplay(language)}
              color="secondary"
              size="small"
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Write your code in the editor below
          </Typography>
        </CardContent>
        
        <Divider />
        
        <Box sx={{ p: 0 }}>
          <Box sx={{ border: '1px solid #ccc', bgcolor: '#1e1e1e', borderRadius: 1, overflow: 'hidden' }}>
            <Box sx={{ p: 1, bgcolor: '#333', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">
                Code Editor - {getLanguageDisplay(language)}
              </Typography>
              <Typography variant="caption">
                Auto-saving enabled
              </Typography>
            </Box>
            <Editor
              height="350px"
              language={language}
              theme="vs-dark"
              value={currentAnswer}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: 'on',
                automaticLayout: true,
                formatOnPaste: true,
                formatOnType: true
              }}
            />
          </Box>
          
          {currentAnswer && (
            <Box sx={{ mt: 2, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'secondary.main' }}>
                <Info sx={{ mr: 1 }} />
                <Typography variant="body2">
                  Code solution in progress
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                ~{currentAnswer.split('\n').length} lines of code
              </Typography>
            </Box>
          )}
        </Box>
      </Card>
    );
  };

  // Render current question
  const renderQuestion = () => {
    if (!competition || !competition.questions || activeStep >= competition.questions.length) {
      return null;
    }
    
    const question = competition.questions[activeStep];
    
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderTop: '5px solid #1976d2', borderRadius: '4px' }}>
        {/* Question header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Question {activeStep + 1}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                {question.questionType === 'MCQ' && 'Multiple Choice Question'}
                {question.questionType === 'checkbox' && 'Multiple Selection Question'}
                {question.questionType === 'text' && 'Text Answer Question'}
                {question.questionType === 'code' && 'Code Solution Question'}
              </Typography>
              
              {question.points && (
                <Chip 
                  label={`${question.points} point${question.points > 1 ? 's' : ''}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {activeStep + 1} / {competition.questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Question {activeStep + 1} of {competition.questions.length}
            </Typography>
          </Box>
        </Box>
        
        {/* Question content */}
        <Card sx={{ mb: 3, p: 3, bgcolor: '#f8f9fa' }}>
          <Typography variant="h6" sx={{ mb: 2, lineHeight: 1.6 }}>
            {question.question}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Help fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {question.questionType === 'MCQ' && 'Select one option below'}
              {question.questionType === 'checkbox' && 'Select all options that apply'}
              {question.questionType === 'text' && 'Provide a written answer below'}
              {question.questionType === 'code' && 'Write your code solution below'}
            </Typography>
          </Box>
        </Card>
        
        {/* Answer section */}
        {question.questionType === 'MCQ' && renderMCQQuestion(question)}
        {question.questionType === 'checkbox' && renderCheckboxQuestion(question)}
        {question.questionType === 'text' && renderTextQuestion(question)}
        {question.questionType === 'code' && renderCodeQuestion(question)}
      </Paper>
    );
  };

  // Question navigation stepper
  const renderStepper = () => {
    if (!competition || !competition.questions) return null;
    
    const handleStepClick = (index) => {
      setActiveStep(index);
    };
    
    return (
      <Box sx={{ width: '100%', mb: 3, overflow: 'auto', p: 2, bgcolor: 'white', borderRadius: 1, boxShadow: 1 }}>
        <Stepper 
          activeStep={-1}
          alternativeLabel 
          nonLinear
        >
          {competition.questions.map((question, index) => {
            // Check if this question has been answered
            const isAnswered = answers[index] && answers[index].answer !== null && answers[index].answer !== '';
            const isActive = index === activeStep;
            
            let icon;
            if (isAnswered) {
              icon = <CheckCircle />;
            } else {
              icon = index + 1;
            }
            
            return (
              <Step key={index}>
                <StepLabel
                  StepIconProps={{
                    icon,
                    active: isActive,
                    completed: isAnswered
                  }}
                  onClick={() => handleStepClick(index)}
                  sx={{
                    cursor: 'pointer',
                    '& .MuiStepLabel-labelContainer': {
                      color: isActive ? 'primary.main' : isAnswered ? 'success.main' : 'text.secondary',
                      fontWeight: isActive ? 'bold' : 'normal',
                    },
                    '& .MuiStepIcon-root': {
                      color: isActive ? 'primary.main' : isAnswered ? 'success.main' : 'text.secondary',
                    }
                  }}
                >
                  {question.questionType === 'MCQ' && 'MCQ'}
                  {question.questionType === 'checkbox' && 'Multi Select'}
                  {question.questionType === 'text' && 'Text Answer'}
                  {question.questionType === 'code' && 'Code Solution'}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Loading Exam...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(`/student/competitions/${id}`)}>
          Back to Competition
        </Button>
      </Box>
    );
  }

  if (!competition) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info" sx={{ my: 2 }}>
          Competition not found
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/student/competitions')}>
          Back to Competitions
        </Button>
      </Box>
    );
  }

  return (
    <Box ref={fullscreenRef} sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* App Bar with timer and controls */}
      <AppBar position="sticky" color="default" elevation={4}>
        <Toolbar>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs>
              <Typography variant="h6" noWrap>
                {competition.competitionName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {competition.competitionType} Exam • Current User: {currentUser}
              </Typography>
            </Grid>
            
            <Grid item>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                bgcolor: 'error.light',
                border: '2px solid',
                borderColor: 'error.main',
                px: 2,
                py: 0.5,
                borderRadius: 2
              }}>
                <Timer color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" component="div" color="error.main" fontWeight="bold">
                  {formatTimeRemaining(timeRemaining)}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<Save />}
                  variant="outlined"
                  onClick={() => saveAnswers(true)}
                  disabled={isSaving}
                  size="small"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                
                <Button
                  startIcon={<Check />}
                  variant="contained"
                  color="success"
                  onClick={() => setConfirmSubmit(true)}
                  disabled={isSubmitting}
                  size="small"
                >
                  Submit
                </Button>
                
                <IconButton 
                  onClick={toggleFullScreen}
                  color="inherit"
                  size="small"
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
                
                <IconButton 
                  onClick={() => setConfirmExit(true)} 
                  color="inherit"
                  size="small"
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  <ExitToApp />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
        
        {/* Progress bar showing completion */}
        <LinearProgress 
          variant="determinate" 
          value={getProgressPercentage()} 
          sx={{ height: 5 }}
        />
      </AppBar>
      
      <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
        {/* Answer progress indicator */}
        <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">
            <Box component="span" fontWeight="bold" color="primary.main">
              {getAnsweredCount()}
            </Box> of {answers.length} questions answered
          </Typography>
          
          <LinearProgress 
            variant="determinate" 
            value={getProgressPercentage()} 
            sx={{ width: '200px', height: 10, borderRadius: 5 }}
          />
        </Paper>
        
        {/* Question navigation steps */}
        {renderStepper()}
        
        {/* Current question */}
        {renderQuestion()}
        
        {/* Navigation buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBack />}
            variant="outlined"
            size="large"
          >
            Previous
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => saveAnswers(true)}
              disabled={isSaving}
              startIcon={<Save />}
            >
              Save Progress
            </Button>
            
            <Button
              variant="contained"
              color="success"
              onClick={() => setConfirmSubmit(true)}
              disabled={isSubmitting}
              startIcon={<Check />}
            >
              Submit All
            </Button>
          </Box>
          
          {activeStep < competition.questions.length - 1 ? (
            <Button
              onClick={handleNext}
              endIcon={<ArrowForward />}
              variant="contained"
              size="large"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={() => setConfirmSubmit(true)}
              endIcon={<Check />}
              variant="contained"
              color="success"
              size="large"
            >
              Finish
            </Button>
          )}
        </Box>
      </Box>
      
      {/* Submit confirmation dialog */}
      <Dialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
      >
        <DialogTitle>Submit Your Answers</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {getAnsweredCount() < answers.length ? (
              <>
                <Warning color="warning" sx={{ verticalAlign: 'middle', mr: 1 }} />
                You've only answered {getAnsweredCount()} out of {answers.length} questions.
              </>
            ) : (
              <>
                <Check color="success" sx={{ verticalAlign: 'middle', mr: 1 }} />
                You've answered all {answers.length} questions.
              </>
            )}
          </DialogContentText>
          <DialogContentText sx={{ mt: 2 }}>
            Are you sure you want to submit your answers? You will not be able to make changes after submission.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmSubmit(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={submitAnswers} 
            variant="contained" 
            color="primary" 
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} />}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Answers'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Exit confirmation dialog */}
      <Dialog
        open={confirmExit}
        onClose={() => setConfirmExit(false)}
      >
        <DialogTitle>Exit Competition?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Warning color="warning" sx={{ verticalAlign: 'middle', mr: 1 }} />
            Your progress will be saved, but you are leaving the competition without submitting.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2 }}>
            You can return later to continue, but make sure to submit before the deadline.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmExit(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleExit} 
            variant="outlined" 
            color="primary"
          >
            Exit Competition
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Save notification */}
      <Snackbar
        open={showSaveMessage}
        autoHideDuration={3000}
        onClose={() => setShowSaveMessage(false)}
        message={saveMessage}
      />
    </Box>
  );
};

export default CompetitionExamPage;
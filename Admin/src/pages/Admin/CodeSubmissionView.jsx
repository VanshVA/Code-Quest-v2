import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Alert,
  List,
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Chip,
  CircularProgress,
  TextField,
  Stack
} from '@mui/material';
import { ContentCopy, Check, Close, PlayArrow, Code } from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco, atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import axios from 'axios';

function CodeSubmissionView({ submission, onToggleCorrectness, questionGrades, gradingMode = false, resultDetails = null }) {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('dark');
  
  // State for code execution
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [executionError, setExecutionError] = useState(null);
  
  if (!submission) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        No submission data available
      </Alert>
    );
  }

  // Check if the submission has the new data structure (with questionAnswers)
  const isNewFormat = !!submission.questionAnswers;
  
  // Process the data based on the format
  let questionsWithAnswers = [];
  
  if (isNewFormat) {
    // New format with questionAnswers array
    questionsWithAnswers = submission.questionAnswers.map((qa) => {
      // Parse the student answer which is a JSON string containing code and language
      let codeData = { code: '', language: 'javascript' };
      
      try {
        if (qa.studentAnswer) {
          codeData = JSON.parse(qa.studentAnswer);
        }
      } catch (err) {
        console.error('Error parsing code data:', err);
      }
      
      // Check for result details to get the correct answer status
      let isCorrect = false;
      if (resultDetails && resultDetails.questionDetails) {
        const resultQuestion = resultDetails.questionDetails.find(
          q => q.questionId === qa.question._id
        );
        if (resultQuestion) {
          isCorrect = resultQuestion.isCorrect;
        }
      } else {
        // Find the corresponding grade if in grading mode
        const grade = questionGrades?.find(g => g.questionId === qa.question._id);
        isCorrect = grade?.isCorrect || qa.isCorrect || false;
      }
      
      return {
        question: qa.question,
        answer: {
          answer: codeData.code,
          questionId: qa.question._id
        },
        language: codeData.language || 'javascript',
        questionNumber: qa.questionNumber,
        isCorrect: isCorrect
      };
    });
  } else {
    // Old format with questions and answers arrays
    questionsWithAnswers = (submission.questions || []).map((question, index) => {
      const answer = (submission.answers || []).find(ans => ans.questionId === question._id || ans.questionId === question.id);
      
      // Check for result details to get the correct answer status
      let isCorrect = false;
      if (resultDetails && resultDetails.questionDetails) {
        const resultQuestion = resultDetails.questionDetails.find(
          q => q.questionId === question._id || q.questionId === question.id
        );
        if (resultQuestion) {
          isCorrect = resultQuestion.isCorrect;
        }
      } else {
        // Find the corresponding grade if in grading mode
        const grade = questionGrades?.find(g => g.questionId === question._id || g.questionId === question.id);
        isCorrect = grade?.isCorrect || false;
      }
      
      return {
        question,
        answer: answer || null,
        language: question.language || 'javascript',
        isCorrect: isCorrect
      };
    });
  }
  
  // Sort questions by question number if available
  if (isNewFormat) {
    questionsWithAnswers.sort((a, b) => a.questionNumber - b.questionNumber);
  }
  
  const handleChangeQuestion = (event, newValue) => {
    setActiveQuestionIndex(newValue);
    // Clear execution results when changing questions
    setExecutionResult(null);
    setExecutionError(null);
  };
  
  const handleCopyCode = () => {
    const currentAnswer = questionsWithAnswers[activeQuestionIndex]?.answer?.answer;
    if (currentAnswer) {
      navigator.clipboard.writeText(currentAnswer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'dark' ? 'light' : 'dark');
  };
  
  // Run code function
  const handleRunCode = async () => {
    const currentItem = questionsWithAnswers[activeQuestionIndex];
    if (!currentItem || !currentItem.answer?.answer) return;
    
    try {
      setExecuting(true);
      setExecutionError(null);
      
      const response = await axios.post('http://localhost:3000/run', {
        code: currentItem.answer.answer,
        language: currentItem.language
      });
      
      setExecutionResult(response.data);
    } catch (err) {
      console.error('Error executing code:', err);
      setExecutionError(err.response?.data?.message || err.message || 'Error executing code');
      setExecutionResult(null);
    } finally {
      setExecuting(false);
    }
  };
  
  if (questionsWithAnswers.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No code questions or answers found
      </Alert>
    );
  }

  // Get current question and answer
  const currentItem = questionsWithAnswers[activeQuestionIndex] || {};
  const questionText = isNewFormat 
    ? currentItem.question?.question
    : currentItem.question?.question || currentItem.question?.questionText;

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
        Code Solutions ({questionsWithAnswers.length} questions)
      </Typography>
      
      {/* Question tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={activeQuestionIndex} 
          onChange={handleChangeQuestion} 
          variant="scrollable"
          scrollButtons="auto"
          aria-label="coding questions"
        >
          {questionsWithAnswers.map((item, index) => (
            <Tab 
              key={index} 
              label={`Question ${isNewFormat ? item.questionNumber : index + 1}`} 
              icon={
                !item.answer?.answer 
                  ? <Alert severity="warning" sx={{ p: 0, minWidth: 'auto' }}>No Code</Alert>
                  : !gradingMode && (
                    <Chip 
                      icon={item.isCorrect ? <Check fontSize="small" /> : <Close fontSize="small" />}
                      label={item.isCorrect ? "Correct" : "Incorrect"}
                      color={item.isCorrect ? "success" : "error"}
                      size="small"
                    />
                  )
              }
              iconPosition="end"
            />
          ))}
        </Tabs>
      </Box>
      
      {/* Question content */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: !currentItem.answer?.answer 
            ? 'rgba(255, 152, 0, 0.05)'
            : !gradingMode
              ? currentItem.isCorrect
                ? 'rgba(76, 175, 80, 0.05)'
                : 'rgba(244, 67, 54, 0.05)'
              : 'inherit'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="subtitle2" fontWeight="medium">
            {questionText || 'No question text available'}
          </Typography>
          
          {!gradingMode && currentItem.answer?.answer && (
            <Chip 
              icon={currentItem.isCorrect ? <Check /> : <Close />}
              label={currentItem.isCorrect ? "Correct" : "Incorrect"}
              color={currentItem.isCorrect ? "success" : "error"}
              size="small"
            />
          )}
        </Box>
        
        {currentItem.question?.description && (
          <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
            {currentItem.question.description}
          </Typography>
        )}
        
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Language: {currentItem.language || 'javascript'}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={toggleViewMode}
              >
                {viewMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </Button>
              
              <Tooltip title={copied ? "Copied!" : "Copy Code"}>
                <IconButton 
                  size="small" 
                  onClick={handleCopyCode}
                  disabled={!currentItem.answer?.answer}
                >
                  {copied ? <Check color="success" /> : <ContentCopy />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          {currentItem.answer?.answer ? (
            <>
              <Box sx={{ position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
                <SyntaxHighlighter
                  language={currentItem.language || 'javascript'}
                  style={viewMode === 'dark' ? atomOneDark : docco}
                  showLineNumbers
                  customStyle={{
                    margin: 0,
                    padding: '16px',
                    borderRadius: '4px',
                    maxHeight: '400px',
                    fontSize: '14px'
                  }}
                >
                  {currentItem.answer.answer}
                </SyntaxHighlighter>
              </Box>
              
              {/* Run Code Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={executing ? <CircularProgress size={20} color="inherit" /> : <PlayArrow />}
                  onClick={handleRunCode}
                  disabled={executing || !currentItem.answer.answer}
                  sx={{ 
                    bgcolor: 'var(--theme-color)',
                    '&:hover': {
                      bgcolor: 'var(--hover-color)'
                    }
                  }}
                >
                  {executing ? 'Running...' : 'Run Code'}
                </Button>
              </Box>
              
              {/* Execution Results */}
              {(executionResult || executionError) && (
                <Box 
                  sx={{ 
                    mt: 2, 
                    p: 2, 
                    borderRadius: 1, 
                    bgcolor: viewMode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)', 
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    <Code fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Execution Results:
                  </Typography>
                  
                  {executionError && (
                    <Alert severity="error" sx={{ mb: 1 }}>
                      {executionError}
                    </Alert>
                  )}
                  
                  {executionResult && (
                    <>
                      {executionResult.error ? (
                        <Alert severity="error" sx={{ mb: 1 }}>
                          {executionResult.error}
                        </Alert>
                      ) : (
                        <Stack spacing={1}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">Output:</Typography>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1.5,
                                bgcolor: viewMode === 'dark' ? 'rgba(0,0,0,0.4)' : '#f5f5f5',
                                borderRadius: 1,
                                maxHeight: '200px',
                                overflow: 'auto',
                                fontFamily: 'monospace'
                              }}
                            >
                              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                                {executionResult.output || '(No output)'}
                              </pre>
                            </Paper>
                          </Box>
                          
                          {executionResult.time !== undefined && (
                            <Typography variant="body2">
                              Execution time: {executionResult.time}ms
                            </Typography>
                          )}
                        </Stack>
                      )}
                    </>
                  )}
                </Box>
              )}
            </>
          ) : (
            <Alert severity="warning">
              No code solution was provided for this question
            </Alert>
          )}
          
          {/* Grading controls - only show if in grading mode */}
          {gradingMode && currentItem.answer?.answer && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={currentItem.isCorrect}
                    onChange={(e) => onToggleCorrectness(currentItem.question._id, e.target.checked)}
                    color="success"
                  />
                }
                label="Mark as correct"
                sx={{ color: currentItem.isCorrect ? 'success.main' : 'text.secondary' }}
              />
              
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={!currentItem.isCorrect}
                    onChange={(e) => onToggleCorrectness(currentItem.question._id, !e.target.checked)}
                    color="error"
                  />
                }
                label="Mark as incorrect"
                sx={{ color: !currentItem.isCorrect ? 'error.main' : 'text.secondary' }}
              />
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default CodeSubmissionView;

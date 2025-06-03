import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Grid
} from '@mui/material';
import { Check, Clear } from '@mui/icons-material';

function McqSubmissionView({ submission, gradingResults, resultDetails = null }) {
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
    questionsWithAnswers = submission.questionAnswers.map((qa) => {
      // For MCQ submissions, check if we have result details
      let isCorrect = qa.isCorrect || false;
      
      if (resultDetails && resultDetails.questionDetails) {
        const resultQuestion = resultDetails.questionDetails.find(
          q => q.questionId === qa.question._id
        );
        if (resultQuestion) {
          isCorrect = resultQuestion.isCorrect;
        }
      }
      
      return {
        question: qa.question,
        answer: qa.studentAnswer ? { 
          answer: qa.studentAnswer,
          questionId: qa.question._id
        } : null,
        isCorrect,
        questionNumber: qa.questionNumber
      };
    }).sort((a, b) => a.questionNumber - b.questionNumber);
  } else {
    // Original format with questions and answers arrays
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
        // Use algorithm to determine correctness for MCQ if there's no result
        const correctOption = question.options && question.options.find(opt => opt.isCorrect);
        isCorrect = correctOption && answer && answer.answer === correctOption.text;
      }
      
      return {
        question,
        answer: answer || null,
        isCorrect
      };
    });
  }
  
  // Calculate score - use result details from API if available, otherwise use what we have
  const totalScore = resultDetails?.result?.totalScore ?? gradingResults?.totalScore ?? 
                     questionsWithAnswers.reduce((score, item) => score + (item.isCorrect ? 1 : 0), 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="medium">
          MCQ Responses ({questionsWithAnswers.filter(qa => qa.answer).length} of {questionsWithAnswers.length} answered)
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>Score:</Typography>
          <Chip 
            label={`${totalScore}/${questionsWithAnswers.length}`} 
            color={totalScore > questionsWithAnswers.length / 2 ? "success" : "warning"} 
            size="medium"
          />
        </Box>
      </Box>
      
      <List sx={{ width: '100%' }}>
        {questionsWithAnswers.map((item, index) => (
          <Paper
            key={index}
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: !item.answer 
                ? 'rgba(255, 152, 0, 0.05)'
                : item.isCorrect
                  ? 'rgba(76, 175, 80, 0.05)'
                  : 'rgba(244, 67, 54, 0.05)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="subtitle2" fontWeight="medium">
                Question {isNewFormat ? item.questionNumber : index + 1}: {item.question.question || item.question.questionText}
              </Typography>
              
              {item.answer && (
                <Chip 
                  icon={item.isCorrect ? <Check /> : <Clear />}
                  label={item.isCorrect ? "Correct" : "Incorrect"} 
                  color={item.isCorrect ? "success" : "error"} 
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
            
            {item.question.options && (
              <Box sx={{ mt: 2 }}>
                <RadioGroup
                  value={item.answer ? item.answer.answer : ''}
                  name={`question-${index}`}
                >
                  {item.question.options.map((option, optIndex) => {
                    const isStudentAnswer = item.answer && item.answer.answer === option.text;
                    const isCorrectOption = option.isCorrect;
                    
                    return (
                      <FormControlLabel
                        key={optIndex}
                        value={option.text}
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
                              : isStudentAnswer ? 'error.main' : 'text.primary',
                            fontWeight: isCorrectOption || isStudentAnswer ? 'medium' : 'regular'
                          }}>
                            {option.text}
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
            
            {!item.answer && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                This question was not answered
              </Alert>
            )}
          </Paper>
        ))}
      </List>
      
      {questionsWithAnswers.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No questions or answers found
        </Alert>
      )}
    </Box>
  );
}

export default McqSubmissionView;

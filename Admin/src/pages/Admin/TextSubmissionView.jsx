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
  FormControlLabel,
  Checkbox,
  Chip,
  useTheme
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';

function TextSubmissionView({ submission, onToggleCorrectness, questionGrades, gradingMode = false, resultDetails = null }) {
  const theme = useTheme();
  
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
      // Find the corresponding grade if in grading mode
      const grade = questionGrades?.find(g => g.questionId === qa.question._id);
      
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
        isCorrect = grade?.isCorrect || qa.isCorrect || false;
      }
      
      return {
        question: qa.question,
        answer: qa.studentAnswer ? { 
          answer: qa.studentAnswer,
          questionId: qa.question._id
        } : null,
        questionNumber: qa.questionNumber,
        isCorrect: isCorrect
      };
    }).sort((a, b) => a.questionNumber - b.questionNumber);
  } else {
    // Original format with questions and answers arrays
    questionsWithAnswers = (submission.questions || []).map((question, index) => {
      const answer = (submission.answers || []).find(ans => ans.questionId === question._id || ans.questionId === question.id);
      
      // Find the corresponding grade if in grading mode
      let isCorrect = false;
      if (resultDetails && resultDetails.questionDetails) {
        const resultQuestion = resultDetails.questionDetails.find(
          q => q.questionId === question._id || q.questionId === question.id
        );
        if (resultQuestion) {
          isCorrect = resultQuestion.isCorrect;
        }
      } else {
        const grade = questionGrades?.find(g => g.questionId === question._id || g.questionId === question.id);
        isCorrect = grade?.isCorrect || false;
      }
      
      return {
        question,
        answer: answer || null,
        isCorrect: isCorrect
      };
    });
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom fontWeight="medium">
        Text Responses ({questionsWithAnswers.filter(qa => qa.answer).length} of {questionsWithAnswers.length} answered)
      </Typography>
      
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
                : gradingMode 
                  ? 'inherit'
                  : item.isCorrect
                    ? 'rgba(76, 175, 80, 0.05)'
                    : 'rgba(244, 67, 54, 0.05)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="subtitle2" fontWeight="medium">
                Question {isNewFormat ? item.questionNumber : index + 1}: {item.question.question || item.question.questionText}
              </Typography>
              
              {!gradingMode && item.answer && (
                <Chip 
                  icon={item.isCorrect ? <Check /> : <Close />}
                  label={item.isCorrect ? "Correct" : "Incorrect"} 
                  color={item.isCorrect ? "success" : "error"} 
                  size="small"
                  sx={{ ml: 2 }}
                />
              )}
            </Box>
            
            {item.answer ? (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Answer:
                </Typography>
                <Typography variant="body1" sx={{ 
                  whiteSpace: 'pre-wrap',
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.03)',
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  {item.answer.answer || item.answer.answerText || '(No response)'}
                </Typography>
                
                {/* Grading controls - only show if in grading mode */}
                {gradingMode && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={item.isCorrect}
                          onChange={(e) => onToggleCorrectness(item.question._id, e.target.checked)}
                          color="success"
                        />
                      }
                      label="Mark as correct"
                      sx={{ color: item.isCorrect ? 'success.main' : 'text.secondary' }}
                    />
                    
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={!item.isCorrect}
                          onChange={(e) => onToggleCorrectness(item.question._id, !e.target.checked)}
                          color="error"
                        />
                      }
                      label="Mark as incorrect"
                      sx={{ color: !item.isCorrect ? 'error.main' : 'text.secondary' }}
                    />
                  </Box>
                )}
              </Box>
            ) : (
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

export default TextSubmissionView;

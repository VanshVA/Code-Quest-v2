import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  TextField,
  Switch,
  FormGroup,
  FormControlLabel,
  Box,
  Grid,
  Divider,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  useTheme
} from '@mui/material';
import {
  Save,
  Cancel,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const CompetitionForm = ({ open, onClose, onSubmit, competition, isCreating }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    competitionName: '',
    competitionType: 'TEXT',
    duration: 60,
    startTiming: '',
    isLive: false,
    competitionAvailableTiming: '', // Added new field
    questions: []
  });
  
  const [errors, setErrors] = useState({});
  
  // Initialize form data when competition changes
  useEffect(() => {
    if (open) {
      if (competition) {
        // Ensure we're working with a deep copy of the competition data
        setFormData({
          competitionName: competition.competitionName || '',
          competitionType: competition.competitionType || 'TEXT',
          duration: competition.duration || 60,
          startTiming: competition.startTiming || new Date().toISOString(),
          isLive: competition.isLive || false,
          competitionAvailableTiming: competition.competitionAvailableTiming || 
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to a week from now
          questions: competition.questions ? 
            JSON.parse(JSON.stringify(competition.questions)) : []
        });
        
        console.log('Loaded competition for editing:', competition);
        console.log('Questions loaded:', competition.questions ? competition.questions.length : 0);
      } else {
        // Default values for new competition
        setFormData({
          competitionName: '',
          competitionType: 'TEXT',
          duration: 60,
          startTiming: new Date().toISOString(),
          isLive: false,
          competitionAvailableTiming: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          questions: []
        });
      }
      
      setErrors({});
    }
  }, [competition, open]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'isLive' ? checked : value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Add a question
  const handleAddQuestion = () => {
    const newQuestion = {
      question: '',
      answer: '',
      options: []
    };
    
    // Add options for MCQ questions
    if (formData.competitionType === 'MCQ') {
      newQuestion.options = ['', '', '', ''];
    }
    
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };
  
  // Update a question
  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value
    };
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  
  // Update an option for an MCQ question
  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  
  // Delete a question
  const handleDeleteQuestion = (questionIndex) => {
    const updatedQuestions = formData.questions.filter(
      (_, i) => i !== questionIndex
    );
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };
  
  // Handle competition type change - reset questions if needed
  const handleCompetitionTypeChange = (e) => {
    const newType = e.target.value;
    let updatedQuestions = [];
    
    // If there are existing questions, convert them to new format
    if (formData.questions.length > 0) {
      updatedQuestions = formData.questions.map(q => {
        const newQuestion = { ...q };
        
        // Reset options for non-MCQ types
        if (newType !== 'MCQ') {
          newQuestion.options = [];
        } 
        // Add options if switching to MCQ
        else if (newType === 'MCQ' && (!q.options || q.options.length === 0)) {
          newQuestion.options = ['', '', '', ''];
        }
        
        return newQuestion;
      });
    }
    
    setFormData({
      ...formData,
      competitionType: newType,
      questions: updatedQuestions
    });
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.competitionName.trim()) {
      newErrors.competitionName = 'Competition name is required';
    }
    
    if (!formData.startTiming) {
      newErrors.startTiming = 'Start timing is required';
    }
    
    if (!formData.competitionType) {
      newErrors.competitionType = 'Competition type is required';
    }
    
    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }
    
    if (!formData.competitionAvailableTiming) {
      newErrors.competitionAvailableTiming = 'Activation expiry time is required';
    }
    
    // Validate questions if there are any
    if (formData.questions && formData.questions.length > 0) {
      formData.questions.forEach((question, questionIndex) => {
        if (!question.question || !question.question.trim()) {
          newErrors[`question_${questionIndex}`] = 'Question text is required';
        }
        
        if ((formData.competitionType === 'TEXT' || formData.competitionType === 'MCQ') && 
            (!question.answer || !question.answer.trim())) {
          newErrors[`question_${questionIndex}_answer`] = 'Answer is required';
        }
        
        if (formData.competitionType === 'MCQ' && question.options) {
          question.options.forEach((option, optionIndex) => {
            if (!option || !option.trim()) {
              newErrors[`question_${questionIndex}_option_${optionIndex}`] = 'Option cannot be empty';
            }
          });
        }
      });
    }
    
    console.log('Form validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        await onSubmit(formData);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {isCreating ? 'Create New Competition' : 'Edit Competition'}
      </DialogTitle>
      
      <DialogContent dividers>
        <Box component="form" noValidate>
          <Grid container spacing={3}>
            {/* Competition Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Competition Name"
                name="competitionName"
                value={formData.competitionName}
                onChange={handleChange}
                error={!!errors.competitionName}
                helperText={errors.competitionName}
                required
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            {/* Competition Type */}
            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth
                error={!!errors.competitionType}
                required
              >
                <InputLabel id="competition-type-label">Competition Type</InputLabel>
                <Select
                  labelId="competition-type-label"
                  name="competitionType"
                  value={formData.competitionType}
                  onChange={handleCompetitionTypeChange}
                  label="Competition Type"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                >
                  <MenuItem value="TEXT">Text Questions</MenuItem>
                  <MenuItem value="MCQ">Multiple Choice Questions</MenuItem>
                  <MenuItem value="CODE">Coding Challenge</MenuItem>
                </Select>
                {errors.competitionType && (
                  <FormHelperText>{errors.competitionType}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {/* Competition Duration */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                error={!!errors.duration}
                helperText={errors.duration}
                InputProps={{ inputProps: { min: 1 } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            {/* Start Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                name="startTiming"
                type="datetime-local"
                value={formData.startTiming ? format(new Date(formData.startTiming), "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={handleChange}
                error={!!errors.startTiming}
                helperText={errors.startTiming}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>
            
            {/* Live Status */}
            <Grid item xs={12} sm={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isLive}
                      onChange={handleChange}
                      name="isLive"
                      color="primary"
                    />
                  }
                  label="Make competition live immediately"
                />
                <Typography variant="caption" color="text.secondary">
                  {formData.isLive 
                    ? 'Competition will be available to participants immediately after creation' 
                    : 'Competition will be saved as draft'}
                </Typography>
              </FormGroup>
            </Grid>
            
            {/* Competition Activation Timing */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Competition Activation Expiry"
                name="competitionAvailableTiming"
                type="datetime-local"
                value={formData.competitionAvailableTiming ? format(new Date(formData.competitionAvailableTiming), "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={handleChange}
                error={!!errors.competitionAvailableTiming}
                helperText={errors.competitionAvailableTiming || "After this time, the competition can only be viewed (not edited)"}
                InputLabelProps={{ shrink: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
              <FormHelperText>
                Set a deadline after which the competition can no longer be edited
              </FormHelperText>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Questions Section */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Questions
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddQuestion}
                size="small"
                sx={{ 
                  borderRadius: '8px',
                  bgcolor: 'var(--theme-color)',
                  '&:hover': {
                    bgcolor: 'var(--hover-color)'
                  }
                }}
              >
                Add Question
              </Button>
            </Box>
            
            {formData.questions.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No questions added yet. Click "Add Question" to create your first question.
              </Typography>
            ) : (
              formData.questions.map((question, questionIndex) => (
                <Box 
                  key={`question-${questionIndex}`}
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: '8px',
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: 'background.paper'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      Question {questionIndex + 1}
                    </Typography>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDeleteQuestion(questionIndex)}
                      sx={{ border: `1px solid ${theme.palette.error.main}`, borderRadius: '8px' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Question Text"
                        multiline
                        rows={2}
                        value={question.question}
                        onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                        error={!!errors[`question_${questionIndex}`]}
                        helperText={errors[`question_${questionIndex}`]}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                      />
                    </Grid>
                    
                    {formData.competitionType !== 'CODE' && (
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Answer"
                          value={question.answer}
                          onChange={(e) => handleQuestionChange(questionIndex, 'answer', e.target.value)}
                          error={!!errors[`question_${questionIndex}_answer`]}
                          helperText={errors[`question_${questionIndex}_answer`]}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                      </Grid>
                    )}
                    
                    {formData.competitionType === 'MCQ' && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Options
                        </Typography>
                        <Grid container spacing={1}>
                          {question.options.map((option, optionIndex) => (
                            <Grid item xs={12} sm={6} key={`option-${optionIndex}`}>
                              <TextField
                                fullWidth
                                label={`Option ${optionIndex + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                                error={!!errors[`question_${questionIndex}_option_${optionIndex}`]}
                                helperText={errors[`question_${questionIndex}_option_${optionIndex}`]}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              ))
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={loading}
          startIcon={<Cancel />}
          sx={{ borderRadius: '8px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <Save />}
          sx={{ 
            borderRadius: '8px',
            bgcolor: 'var(--theme-color)',
            '&:hover': {
              bgcolor: 'var(--hover-color)'
            }
          }}
        >
          {loading ? 'Saving...' : isCreating ? 'Create Competition' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompetitionForm;
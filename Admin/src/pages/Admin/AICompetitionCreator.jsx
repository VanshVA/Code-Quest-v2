import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Chip,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Alert,
  Autocomplete,
  useTheme,
  Switch
} from '@mui/material';
import {
  Create,
  AutoAwesome,
  Edit as EditIcon,
  Save,
  Cancel,
  ArrowBack,
  ArrowForward,
  Refresh,
  CheckCircle,
  Close
} from '@mui/icons-material';
import axios from 'axios';

// Define subject areas and difficulty levels
const SUBJECT_AREAS = [
  'Computer Science', 
  'Mathematics', 
  'Physics', 
  'Chemistry', 
  'Biology',
  'Data Structures', 
  'Algorithms', 
  'Web Development', 
  'Database Systems',
  'Machine Learning',
  'Artificial Intelligence',
  'Operating Systems',
  'Software Engineering',
  'Network Security',
  'Cloud Computing'
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

const TARGET_AUDIENCES = [
  'High School Students',
  'College Freshmen',
  'College Sophomores',
  'Computer Science Majors',
  'Engineering Students',
  'Software Developers',
  'Data Science Enthusiasts',
  'Competitive Programmers',
  'Beginner Programmers'
];

// Gemini AI API for question generation
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
// Fix for Vite environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDTUU-VAViQ1ah3Qq_zv7LZOOvR_Dn4TxA"; // Replace with your API key or env variable

const AICompetitionCreator = ({ open, onClose, onSubmit }) => {
  const theme = useTheme();
  
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    competitionName: '',
    competitionDescription: '',
    competitionType: 'MCQ',
    targetAudience: [],
    subjects: [],
    difficultyLevel: 'medium',
    questionCount: 5,
    startTiming: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Default to tomorrow
    endTiming: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // Default to a week from now
    duration: 60, // Default duration in minutes
    isLive: false // Default to not live
  });
  
  // Generated competition data
  const [generatedCompetition, setGeneratedCompetition] = useState(null);
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  // Generation status
  const [generationStatus, setGenerationStatus] = useState({
    loading: false,
    success: false,
    error: null
  });
  
  // Reset form on open
  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setFormData({
        competitionName: '',
        competitionDescription: '',
        competitionType: 'MCQ',
        targetAudience: [],
        subjects: [],
        difficultyLevel: 'medium',
        questionCount: 5,
        startTiming: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        endTiming: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        duration: 60,
        isLive: false
      });
      setGeneratedCompetition(null);
      setErrors({});
      setGenerationStatus({
        loading: false,
        success: false,
        error: null
      });
    }
  }, [open]);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Handle multi-select changes
  const handleMultiSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form data for the current step
  const validateCurrentStep = () => {
    const newErrors = {};
    
    switch (activeStep) {
      case 0: // Basic info
        if (!formData.competitionName.trim()) {
          newErrors.competitionName = 'Competition name is required';
        }
        if (!formData.competitionDescription.trim()) {
          newErrors.competitionDescription = 'competitionDescription is required';
        }
        // Validate start time - must be in the future
        const startTime = new Date(formData.startTiming);
        if (isNaN(startTime) || !formData.startTiming) {
          newErrors.startTiming = 'Valid start time is required';
        } else if (startTime < new Date() && !formData.isLive) {
          newErrors.startTiming = 'Start time must be in the future';
        }
        
        // Validate end time - must be after start time
        const endTime = new Date(formData.endTiming);
        if (isNaN(endTime) || !formData.endTiming) {
          newErrors.endTiming = 'Valid end time is required';
        } else if (endTime <= startTime) {
          newErrors.endTiming = 'End time must be after start time';
        }
        
        // Validate duration
        if (!formData.duration || formData.duration < 5) {
          newErrors.duration = 'Duration must be at least 5 minutes';
        }
        break;
      case 1: // Audience and subjects
        if (formData.targetAudience.length === 0) {
          newErrors.targetAudience = 'Please select at least one target audience';
        }
        if (formData.subjects.length === 0) {
          newErrors.subjects = 'Please select at least one subject area';
        }
        break;
      case 2: // Difficulty and count
        if (!formData.difficultyLevel) {
          newErrors.difficultyLevel = 'Difficulty level is required';
        }
        if (formData.questionCount < 1 || formData.questionCount > 100) {
          newErrors.questionCount = 'Question count must be between 1 and 100';
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle step navigation
  const handleNext = () => {
    if (validateCurrentStep()) {
      if (activeStep === 2) {
        generateCompetition();
      } else {
        setActiveStep(activeStep + 1);
      }
    }
  };
  
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  
  // Generate competition using Google Gemini AI
  const generateCompetition = async () => {
    setGenerationStatus({
      loading: true,
      success: false,
      error: null
    });
    
    try {
      // Prepare prompt for Gemini
      const prompt = `Create a ${formData.competitionType} competition named "${formData.competitionName}" 
        with the following attributes:
        
        competitionDescription: ${formData.competitionDescription}
        Target Audience: ${formData.targetAudience.join(', ')}
        Subjects: ${formData.subjects.join(', ')}
        Difficulty Level: ${formData.difficultyLevel}
        Number of Questions: ${formData.questionCount}
        
        Please generate ${formData.questionCount} ${formData.competitionType} questions with answers. 
        If it's MCQ, include 4 options for each question with one correct answer.
        For coding questions, include a problem statement and expected input/output examples.
        For text questions, provide a clear and concise question with the expected answer.
        
        Format the response as a structured JSON object with the following format:
        {
          "competitionName": "Competition Name",
          "competitionType": "MCQ|TEXT|CODE",
          "duration": 60,
          "questions": [
            {
              "question": "Question text",
              "answer": "Answer text",
              "options": ["Option 1", "Option 2", "Option 3", "Option 4"]  // Only for MCQ
            },
            ...
          ]
        }`;
      
      // Call Gemini API
      const response = await axios.post(GEMINI_API_URL, {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8000
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        }
      });
      
      // Parse the response
      const textContent = response.data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response (the AI might wrap it in markdown code blocks)
      const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) || 
                        textContent.match(/{[\s\S]*}/);
      
      const jsonContent = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textContent;
      
      // Parse the JSON content
      const generatedData = JSON.parse(jsonContent);
      
      // Format for our application
      const formattedCompetition = {
        competitionName: generatedData.competitionName,
        competitionType: generatedData.competitionType,
        duration: formData.duration,
        competitionDescription: formData.competitionDescription,
        startTiming: formData.startTiming,
        endTiming: formData.endTiming,
        isLive: formData.isLive,
        questions: generatedData.questions
      };
      
      setGeneratedCompetition(formattedCompetition);
      setGenerationStatus({
        loading: false,
        success: true,
        error: null
      });
      
      // Move to review step
      setActiveStep(activeStep + 1);
      
    } catch (error) {
      console.error('Error generating competition with AI:', error);
      setGenerationStatus({
        loading: false,
        success: false,
        error: 'Failed to generate competition. Please try again or adjust your inputs.'
      });
    }
  };
  
  // Edit generated competition
  const handleEditQuestion = (index, field, value) => {
    const updatedCompetition = { ...generatedCompetition };
    updatedCompetition.questions[index][field] = value;
    setGeneratedCompetition(updatedCompetition);
  };
  
  const handleEditOption = (questionIndex, optionIndex, value) => {
    const updatedCompetition = { ...generatedCompetition };
    updatedCompetition.questions[questionIndex].options[optionIndex] = value;
    setGeneratedCompetition(updatedCompetition);
  };
  
  // Submit the generated competition
  const handleSubmit = () => {
    setLoading(true);
    onSubmit(generatedCompetition);
  };
  
  // Regenerate competition
  const handleRegenerate = () => {
    setActiveStep(0);
    setGeneratedCompetition(null);
  };
  
  // Steps content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Basic Competition Information
            </Typography>
            
            <TextField
              fullWidth
              label="Competition Name"
              name="competitionName"
              value={formData.competitionName}
              onChange={handleChange}
              error={!!errors.competitionName}
              helperText={errors.competitionName}
              margin="normal"
              required
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="competitionDescription"
              name="competitionDescription"
              value={formData.competitionDescription}
              onChange={handleChange}
              error={!!errors.competitionDescription}
              helperText={errors.competitionDescription || "Provide a detailed competitionDescription for the AI to understand what kind of competition to create"}
              margin="normal"
              required
              multiline
              rows={4}
              sx={{ mb: 3 }}
            />
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="competition-type-label">Competition Type</InputLabel>
                  <Select
                    labelId="competition-type-label"
                    name="competitionType"
                    value={formData.competitionType}
                    onChange={handleChange}
                    label="Competition Type"
                  >
                    <MenuItem value="MCQ">Multiple Choice Questions</MenuItem>
                    <MenuItem value="TEXT">Text Questions</MenuItem>
                    <MenuItem value="CODE">Coding Challenge</MenuItem>
                  </Select>
                  <FormHelperText>
                    Select the type of competition you want to create
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  error={!!errors.duration}
                  helperText={errors.duration || "How long participants have to complete the competition"}
                  margin="normal"
                  InputProps={{ inputProps: { min: 5 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Start Time"
                  name="startTiming"
                  type="datetime-local"
                  value={formData.startTiming}
                  onChange={handleChange}
                  error={!!errors.startTiming}
                  helperText={errors.startTiming || "When the competition will be available to participants"}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  disabled={formData.isLive}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="End Time"
                  name="endTiming"
                  type="datetime-local"
                  value={formData.endTiming}
                  onChange={handleChange}
                  error={!!errors.endTiming}
                  helperText={errors.endTiming || "When the competition will end"}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isLive}
                      onChange={(e) => {
                        const isLive = e.target.checked;
                        setFormData({
                          ...formData,
                          isLive,
                          // If setting to live, use current time
                          startTiming: isLive 
                            ? new Date().toISOString().slice(0, 16)
                            : formData.startTiming
                        });
                      }}
                      name="isLive"
                    />
                  }
                  label="Make competition available immediately"
                  sx={{ mt: 2 }}
                />
                <FormHelperText>
                  {formData.isLive 
                    ? "Competition will be available as soon as it's created" 
                    : "Competition will be available at the scheduled start time"}
                </FormHelperText>
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                AI will generate questions based on the information you provide. The more detailed your competitionDescription,
                the better the generated questions will be.
              </Typography>
            </Alert>
          </Box>
        );
        
      case 1:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Target Audience & Subject Areas
            </Typography>
            
            <Autocomplete
              multiple
              options={TARGET_AUDIENCES}
              value={formData.targetAudience}
              onChange={(e, newValue) => handleMultiSelectChange('targetAudience', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Target Audience"
                  error={!!errors.targetAudience}
                  helperText={errors.targetAudience}
                  margin="normal"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    sx={{ borderRadius: '4px' }}
                  />
                ))
              }
              sx={{ mb: 3 }}
            />
            
            <Autocomplete
              multiple
              options={SUBJECT_AREAS}
              value={formData.subjects}
              onChange={(e, newValue) => handleMultiSelectChange('subjects', newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Subject Areas"
                  error={!!errors.subjects}
                  helperText={errors.subjects}
                  margin="normal"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    sx={{ borderRadius: '4px' }}
                  />
                ))
              }
              sx={{ mb: 3 }}
            />
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                Selecting specific target audiences and subject areas helps the AI generate more relevant
                and appropriately challenging questions.
              </Typography>
            </Alert>
          </Box>
        );
        
      case 2:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Difficulty & Question Count
            </Typography>
            
            <FormControl component="fieldset" sx={{ mb: 4, width: '100%' }}>
              <FormLabel component="legend">Difficulty Level</FormLabel>
              <RadioGroup
                row
                name="difficultyLevel"
                value={formData.difficultyLevel}
                onChange={handleChange}
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <FormControlLabel 
                    key={level.value}
                    value={level.value} 
                    control={<Radio />} 
                    label={level.label} 
                  />
                ))}
              </RadioGroup>
              {errors.difficultyLevel && (
                <FormHelperText error>{errors.difficultyLevel}</FormHelperText>
              )}
            </FormControl>
            
            <Box sx={{ mb: 4 }}>
              <Typography id="question-count-slider" gutterBottom>
                Number of Questions: {formData.questionCount}
              </Typography>
              <Slider
                aria-labelledby="question-count-slider"
                value={formData.questionCount}
                onChange={(e, newValue) => handleMultiSelectChange('questionCount', newValue)}
                min={1}
                max={100}
                step={1}
                marks={[
                  { value: 1, label: '1' },
                  { value: 25, label: '25' },
                  { value: 50, label: '50' },
                  { value: 75, label: '75' },
                  { value: 100, label: '100' }
                ]}
                valueLabelDisplay="auto"
              />
              {errors.questionCount && (
                <FormHelperText error>{errors.questionCount}</FormHelperText>
              )}
            </Box>
            
            <Alert severity="warning" sx={{ mt: 3 }}>
              <Typography variant="body2">
                Generation time increases with the number of questions. For a large number of questions,
                the process may take longer to complete.
              </Typography>
            </Alert>
          </Box>
        );
        
      case 3:
        // Generation in progress
        if (generationStatus.loading) {
          return (
            <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" align="center">
                Generating Competition with AI...
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                This may take a few moments as we're creating {formData.questionCount} questions 
                for your competition.
              </Typography>
            </Box>
          );
        }
        
        // Generation error
        if (generationStatus.error) {
          return (
            <Box sx={{ py: 3 }}>
              <Alert severity="error" sx={{ mb: 3 }}>
                <Typography variant="body1" fontWeight="medium">
                  {generationStatus.error}
                </Typography>
              </Alert>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={generateCompetition}
                >
                  Try Again
                </Button>
              </Box>
            </Box>
          );
        }
        
        // Review generated competition
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle color="success" sx={{ mr: 1 }} /> 
              AI-Generated Competition
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
              <Typography variant="h5" gutterBottom>
                {generatedCompetition.competitionName}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {generatedCompetition.competitionDescription}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip 
                  label={`${generatedCompetition.competitionType}`}
                  color="primary" 
                  variant="outlined"
                  size="small"
                />
                <Chip 
                  label={`Duration: ${generatedCompetition.duration} mins`}
                  variant="outlined"
                  size="small"
                />
                <Chip 
                  label={`Questions: ${generatedCompetition.questions.length}`}
                  variant="outlined"
                  size="small"
                />
                <Chip 
                  label={`Level: ${formData.difficultyLevel}`}
                  variant="outlined"
                  size="small"
                />
                <Chip 
                  label={formData.isLive ? 'Available Immediately' : `Starts: ${new Date(formData.startTiming).toLocaleString()}`}
                  color={formData.isLive ? 'success' : 'default'}
                  variant="outlined"
                  size="small"
                />
                <Chip 
                  label={`Ends: ${new Date(formData.endTiming).toLocaleString()}`}
                  color="error"
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Paper>
            
            <Typography variant="subtitle1" gutterBottom>
              Questions (You can edit any question if needed)
            </Typography>
            
            {generatedCompetition.questions.map((question, index) => (
              <Paper
                key={index}
                sx={{
                  p: 3,
                  mb: 2,
                  borderLeft: '4px solid',
                  borderColor: 'primary.main'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Question {index + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => {
                      // Toggle edit mode for this question
                      question.editing = !question.editing;
                      setGeneratedCompetition({...generatedCompetition});
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                
                {question.editing ? (
                  // Edit mode
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Question"
                      value={question.question}
                      onChange={(e) => handleEditQuestion(index, 'question', e.target.value)}
                      multiline
                      rows={2}
                      sx={{ mb: 2 }}
                    />
                    
                    {generatedCompetition.competitionType !== 'CODE' && (
                      <TextField
                        fullWidth
                        label="Answer"
                        value={question.answer}
                        onChange={(e) => handleEditQuestion(index, 'answer', e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    )}
                    
                    {generatedCompetition.competitionType === 'MCQ' && (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Options:
                        </Typography>
                        {question.options.map((option, optIndex) => (
                          <TextField
                            key={optIndex}
                            fullWidth
                            label={`Option ${optIndex + 1}`}
                            value={option}
                            onChange={(e) => handleEditOption(index, optIndex, e.target.value)}
                            sx={{ mb: 1 }}
                            InputProps={{
                              startAdornment: option === question.answer && (
                                <Chip
                                  label="Correct"
                                  color="success"
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                              )
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        question.editing = false;
                        setGeneratedCompetition({...generatedCompetition});
                      }}
                      startIcon={<Save />}
                      sx={{ mt: 1 }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                ) : (
                  // View mode
                  <Box>
                    <Typography variant="body1" paragraph>
                      {question.question}
                    </Typography>
                    
                    {generatedCompetition.competitionType !== 'CODE' && (
                      <Typography variant="body2" fontWeight="medium" paragraph>
                        Answer: {question.answer}
                      </Typography>
                    )}
                    
                    {generatedCompetition.competitionType === 'MCQ' && (
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Options:
                        </Typography>
                        {question.options.map((option, optIndex) => (
                          <Typography
                            key={optIndex}
                            variant="body2"
                            sx={{
                              py: 0.5,
                              color: option === question.answer ? 'success.main' : 'text.primary',
                              fontWeight: option === question.answer ? 'bold' : 'regular'
                            }}
                          >
                            {optIndex + 1}. {option} {option === question.answer && '✓'}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={loading || generationStatus.loading ? null : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px' }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <AutoAwesome color="warning" />
        Create Competition with AI
      </DialogTitle>
      
      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ pt: 1, pb: 3 }}>
          <Step>
            <StepLabel>Basic Info</StepLabel>
          </Step>
          <Step>
            <StepLabel>Audience & Subjects</StepLabel>
          </Step>
          <Step>
            <StepLabel>Difficulty & Count</StepLabel>
          </Step>
          <Step>
            <StepLabel>Review & Edit</StepLabel>
          </Step>
        </Stepper>
        
        {renderStepContent()}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={loading || generationStatus.loading}
        >
          Cancel
        </Button>
        
        <Box>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              sx={{ mr: 1 }}
              disabled={loading || generationStatus.loading}
              startIcon={<ArrowBack />}
            >
              Back
            </Button>
          )}
          
          {activeStep === 3 && generationStatus.success ? (
            <>
              <Button
                onClick={handleRegenerate}
                sx={{ mr: 1 }}
                disabled={loading}
                startIcon={<Refresh />}
              >
                Regenerate
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading}
                color="primary"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
              >
                {loading ? 'Creating...' : 'Create Competition'}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={loading || generationStatus.loading}
              startIcon={activeStep === 2 && generationStatus.loading ? <CircularProgress size={20} color="inherit" /> : null}
              endIcon={activeStep < 2 ? <ArrowForward /> : !generationStatus.loading && <AutoAwesome />}
              color={activeStep < 2 ? 'primary' : 'secondary'}
            >
              {activeStep < 2 
                ? 'Next' 
                : generationStatus.loading 
                  ? 'Generating...' 
                  : 'Generate with AI'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AICompetitionCreator;

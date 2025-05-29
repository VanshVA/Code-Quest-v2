import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Breadcrumbs,
  TextField,
  Button,
  Grid,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar,
  Alert,
  Rating
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SendIcon from '@mui/icons-material/Send';
import FeedbackIcon from '@mui/icons-material/Feedback';
import { Link } from 'react-router-dom';

const Feedback = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    feedbackType: 'general',
    rating: 0,
    message: '',
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleRatingChange = (event, newValue) => {
    setFormValues({
      ...formValues,
      rating: newValue
    });
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formValues.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formValues.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formValues.message.trim()) {
      newErrors.message = 'Feedback message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Here you would typically send the form data to your backend
      console.log('Feedback submitted:', formValues);
      setSubmitted(true);
      
      // Reset form
      setFormValues({
        name: '',
        email: '',
        feedbackType: 'general',
        rating: 0,
        message: '',
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSubmitted(false);
  };
  
  return (
    <Box sx={{ 
      bgcolor: 'var(--background-color)', 
      color: 'var(--text-color)',
      minHeight: '100vh',
      pb: 8,
      pt: 12 // For navbar space
    }}>
      <Container maxWidth="lg">
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 4, color: 'var(--p-color)' }}
        >
          <Link to="/" style={{ color: 'var(--p-color)', textDecoration: 'none' }}>
            Home
          </Link>
          <Typography color="var(--theme-color)">Feedback</Typography>
        </Breadcrumbs>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h3" 
                component="h1" 
                gutterBottom
                sx={{ mb: 2 }}
              >
                Your Feedback Matters
              </Typography>
              
              <Typography variant="body1" sx={{ color: 'var(--p-color)', mb: 3 }}>
                We're constantly working to improve Code-Quest and your feedback is invaluable in helping us create the best possible platform for KITPS students and faculty.
              </Typography>
              
              <Paper sx={{ 
                p: 3, 
                bgcolor: 'var(--dashboard-bg)',
                boxShadow: '0 5px 15px var(--background-shadow)',
                mb: 3
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FeedbackIcon sx={{ color: 'var(--theme-color)', mr: 1 }} />
                  <Typography variant="h6" component="h2">
                    Why Share Feedback?
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'var(--p-color)' }}>
                  Your insights help us identify bugs, improve usability, and develop new features that meet your needs. As current students at KITPS, your perspective is especially valuable.
                </Typography>
              </Paper>
              
              <Typography variant="body1" sx={{ color: 'var(--p-color)' }}>
                Whether you've encountered an issue, have a suggestion for improvement, or just want to share your thoughts on the platform, we're eager to hear from you.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 4,
              bgcolor: 'var(--dashboard-bg)',
              boxShadow: '0 5px 15px var(--background-shadow)',
            }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Submit Feedback
              </Typography>
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      variant="outlined"
                      value={formValues.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'var(--p-color)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--theme-color)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--theme-color)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--p-color)',
                        },
                        '& .MuiInputBase-input': {
                          color: 'var(--text-color)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Your Email"
                      name="email"
                      variant="outlined"
                      value={formValues.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'var(--p-color)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--theme-color)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--theme-color)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--p-color)',
                        },
                        '& .MuiInputBase-input': {
                          color: 'var(--text-color)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend" sx={{ color: 'var(--text-color)' }}>
                        Feedback Type
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-label="feedback-type"
                        name="feedbackType"
                        value={formValues.feedbackType}
                        onChange={handleChange}
                      >
                        <FormControlLabel 
                          value="general" 
                          control={
                            <Radio 
                              sx={{
                                color: 'var(--p-color)',
                                '&.Mui-checked': {
                                  color: 'var(--theme-color)',
                                },
                              }}
                            />
                          } 
                          label="General" 
                        />
                        <FormControlLabel 
                          value="bug" 
                          control={
                            <Radio 
                              sx={{
                                color: 'var(--p-color)',
                                '&.Mui-checked': {
                                  color: 'var(--theme-color)',
                                },
                              }}
                            />
                          } 
                          label="Bug Report" 
                        />
                        <FormControlLabel 
                          value="feature" 
                          control={
                            <Radio 
                              sx={{
                                color: 'var(--p-color)',
                                '&.Mui-checked': {
                                  color: 'var(--theme-color)',
                                },
                              }}
                            />
                          } 
                          label="Feature Request" 
                        />
                        <FormControlLabel 
                          value="improvement" 
                          control={
                            <Radio 
                              sx={{
                                color: 'var(--p-color)',
                                '&.Mui-checked': {
                                  color: 'var(--theme-color)',
                                },
                              }}
                            />
                          } 
                          label="Improvement" 
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography component="legend" sx={{ mb: 1 }}>
                        Rate your experience
                      </Typography>
                      <Rating
                        name="rating"
                        value={formValues.rating}
                        onChange={handleRatingChange}
                        size="large"
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: 'var(--theme-color)',
                          },
                          '& .MuiRating-iconEmpty': {
                            color: 'var(--p-color)',
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Feedback"
                      name="message"
                      variant="outlined"
                      multiline
                      rows={6}
                      value={formValues.message}
                      onChange={handleChange}
                      error={!!errors.message}
                      helperText={errors.message}
                      placeholder="Please describe your feedback in detail. For bugs, include steps to reproduce and what you expected to happen."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'var(--p-color)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'var(--theme-color)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'var(--theme-color)',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--p-color)',
                        },
                        '& .MuiInputBase-input': {
                          color: 'var(--text-color)',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      endIcon={<SendIcon />}
                      sx={{ 
                        bgcolor: 'var(--theme-color)', 
                        '&:hover': { bgcolor: 'var(--hover-color)' },
                        px: 4,
                        py: 1.5
                      }}
                    >
                      Submit Feedback
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar 
        open={submitted} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Thank you! Your feedback has been submitted successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Feedback;
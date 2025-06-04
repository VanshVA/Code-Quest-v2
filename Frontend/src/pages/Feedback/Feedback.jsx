import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for API requests
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Rating,
  Divider,
  Chip,
  Checkbox,
  Stack,
  Snackbar,
  Alert,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  InputAdornment,
  Tooltip,
  Slide,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import SendIcon from '@mui/icons-material/Send';
import FeedbackIcon from '@mui/icons-material/Feedback';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import HomeIcon from '@mui/icons-material/Home';
import { color, motion } from 'framer-motion';
import { AccessTime, Apps, AutoAwesome, Category, CheckCircleOutline, CheckCircleOutlineOutlined, Comment, Email, EventNote, Extension, InfoOutlined, Person, Phone, Schedule, Star, SupportAgent, Update } from '@mui/icons-material';

// import { useAuth } from '../contexts/AuthContext';
// import PageHeader from '../components/common/PageHeader';

// Custom rating component with emojis
function CustomRating({ value, onChange }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const customIcons = {
    1: {
      icon: <SentimentVeryDissatisfiedIcon sx={{ fontSize: 40 }} />,
      label: 'Very Dissatisfied',
    },
    2: {
      icon: <SentimentDissatisfiedIcon sx={{ fontSize: 40 }} />,
      label: 'Dissatisfied',
    },
    3: {
      icon: <SentimentNeutralIcon sx={{ fontSize: 40 }} />,
      label: 'Neutral',
    },
    4: {
      icon: <SentimentSatisfiedIcon sx={{ fontSize: 40 }} />,
      label: 'Satisfied',
    },
    5: {
      icon: <SentimentVerySatisfiedIcon sx={{ fontSize: 40 }} />,
      label: 'Very Satisfied',
    },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Rating
        name="user-satisfaction"
        value={value}
        onChange={(event, newValue) => {
          onChange(newValue);
        }}
        getLabelText={(value) => customIcons[value].label}
        IconContainerComponent={({ value: ratingValue, ...props }) => {
          const isActive = ratingValue <= value;
          return (
            <Box
              {...props}
              sx={{
                px: 1.5,
                color: isActive ?
                  (ratingValue < 3 ?
                    theme.palette.error.main :
                    ratingValue === 3 ?
                      theme.palette.warning.main :
                      theme.palette.success.main
                  ) :
                  'text.disabled',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.2)',
                }
              }}
            >
              {customIcons[ratingValue].icon}
            </Box>
          );
        }}

      />
      <Typography variant="body2" sx={{ color: isDark ? 'white' : 'black' }} mt={1}>
        {value ? customIcons[value].label : 'Select your rating'}
      </Typography>
    </Box>
  );
}

const Feedback = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const MotionBox = motion(Box);
  const MotionTypography = motion(Typography);
  // const { currentUser } = useAuth();
  const currentUser = {
    name: '',
    email: ''
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const isDark = theme.palette.mode === 'dark';
  const [referenceId, setReferenceId] = useState('');
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    feedback: '',
    occupation: ''
  });

  // Form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    feedback: '',
    feedbackType: 'general',
    source: 'website',
    ratingGeneral: 0,
    ratingEase: 0,
    ratingSupport: 0,
    specificFeatures: [],
    contactConsent: currentUser ? true : false,
    occupation: ''
  });

  const feedbackTypes = [
    { value: 'general', label: 'General Feedback' },
    { value: 'suggestion', label: 'Feature Suggestion' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'testimonial', label: 'Testimonial' },
    { value: 'other', label: 'Other' },
  ];

  const sources = [
    { value: 'website', label: 'Website' },
    { value: 'mobile_app', label: 'Mobile App' },
    { value: 'customer_support', label: 'Customer Support' },
    { value: 'email', label: 'Email Communication' },
    { value: 'social_media', label: 'Social Media' },
  ];

  const features = [
    { value: 'search', label: 'Venue Search' },
    { value: 'booking', label: 'Booking Process' },
    { value: 'payment', label: 'Payment System' },
    { value: 'dashboard', label: 'Dashboard & Account' },
    { value: 'communication', label: 'Communication Tools' },
    { value: 'mobile', label: 'Mobile Experience' },
    { value: 'recommendations', label: 'Venue Recommendations' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRatingChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFeatureToggle = (feature) => {
    const updatedFeatures = formData.specificFeatures.includes(feature)
      ? formData.specificFeatures.filter(f => f !== feature)
      : [...formData.specificFeatures, feature];

    setFormData({
      ...formData,
      specificFeatures: updatedFeatures,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: '',
      email: '',
      feedback: '',
      occupation: ''
    };

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    // Feedback validation
    if (!formData.feedback.trim()) {
      errors.feedback = 'Feedback is required';
      isValid = false;
    }

    // Occupation validation
    if (!formData.occupation.trim()) {
      errors.occupation = 'Occupation is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Make API request to submit feedback
      const response = await axios.post('http://localhost:5000/api/general/feedback', formData);
      
      if (response.data.success) {
        setFeedbackSent(true);
        setSuccess(true);
        setReferenceId(response.data.data.reference);

        // Reset form after successful submission
        setFormData({
          ...formData,
          feedback: '',
          feedbackType: 'general',
          source: 'website',
          ratingGeneral: 0,
          ratingEase: 0,
          ratingSupport: 0,
          specificFeatures: [],
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(response.data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: 'relative',
          pt: { xs: '100px', sm: '120px', md: '120px' },
          pb: { xs: '60px', sm: '80px', md: '30px' },
          overflow: 'hidden',
        }}
      >
        {/* Top Badge */}

        <Container maxWidth="lg">

          <Grid
            container
            spacing={{ xs: 4, md: 8 }}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={10} lg={8} sx={{ textAlign: 'center' }}>
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 3, display: 'inline-block', }}
              >
                <Chip
                  label="Feedback CODE-QUEST"
                  color="primary"
                  size="small"
                  icon={<AutoAwesome sx={{ color: 'white !important', fontSize: '0.85rem', }} />}
                  sx={{
                    background: theme.palette.gradients.primary,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    letterSpacing: 1.2,
                    py: 2.2,
                    pl: 1,
                    pr: 2,
                    borderRadius: '100px',
                    boxShadow: '0 8px 16px rgba(188, 64, 55, 0.2)',
                    '& .MuiChip-icon': {
                      color: 'white',
                      mr: 0.5
                    }
                  }}
                />
              </MotionBox>
              <MotionBox>
                {/* Page Title */}
                <MotionTypography
                  variant="h1"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.8rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: { xs: 3, md: 4 },
                    letterSpacing: '-0.02em',
                  }}
                >
                  Tell Us What You Think
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      background: theme.palette.gradients.primary,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textFillColor: 'transparent',
                    }}
                  >
                    About Code-Quest
                  </Box>
                </MotionTypography>

                {/* Subheadline */}
                <MotionTypography
                  variant="h5"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  color="textSecondary"
                  sx={{
                    mb: 5,
                    fontWeight: 400,
                    lineHeight: 1.5,
                    fontSize: { xs: '1.1rem', md: '1.3rem' },
                    maxWidth: '800px',
                    mx: 'auto',
                  }}
                >
                  We appreciate your time and input. Your feedback helps us improve our services and provide you with the best possible experience. Let us know what we're doing well and where we can do better.
                </MotionTypography>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container maxWidth="lg" sx={{ py: 8 }}>

        {feedbackSent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              variant="outlined"
              sx={{
                p: { xs: 3, sm: 6 },
                textAlign: 'center',
                borderRadius: 4,
                maxWidth: 700,
                mx: 'auto',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative success gradient */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '5px',
                  background: theme => `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
                }}
              />

              {/* Confetti animation effect */}
              <Box
                component={motion.div}
                animate={{
                  y: [0, -20],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                sx={{
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  width: '80%',
                  height: '80%',
                  pointerEvents: 'none',
                  background: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234caf50' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E\")",
                  backgroundSize: '150px 150px',
                }}
              />

              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  bgcolor: theme => alpha(theme.palette.success.main, 0.1),
                  color: theme => theme.palette.success.main,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mx: 'auto',
                  mb: 3,
                  position: 'relative',
                }}
              >
                {/* Animated pulse effect */}
                <Box
                  component={motion.div}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '50%',
                    border: theme => `2px solid ${theme.palette.success.main}`,
                  }}
                />
                <VolunteerActivismIcon sx={{ fontSize: 48 }} />
              </Box>

              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Thank You for Your Feedback!
              </Typography>

              <Typography variant="body1" paragraph>
                Your input is invaluable to us. We carefully review all feedback to improve EventHub and make it better for everyone.
              </Typography>

              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                {formData.contactConsent ? 'A member of our team may reach out to you for more details if needed.' : 'If you have more to share, please don\'t hesitate to reach out again.'}
              </Typography>



              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/"
                    startIcon={<HomeIcon />}
                    sx={{
                      px: 3,
                      borderRadius: '8px',
                      background: theme => `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    Return to Home
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={() => setFeedbackSent(false)}
                    startIcon={<FeedbackIcon />}
                    sx={{
                      px: 3,
                      borderRadius: '8px',
                      borderWidth: '2px',
                    }}
                  >
                    Submit Another Feedback
                  </Button>
                </Grid>
              </Grid>

              {/* Reference ID for future tracking */}
              <Typography variant="caption" sx={{ display: 'block', mt: 4, color: 'text.secondary' }}>
                Reference ID: {referenceId}
              </Typography>
            </Paper>
          </motion.div>
        ) : (
          <Grid container spacing={4}>
            {/* Feedback Form */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}

              >
                <Paper
                  elevation={0}
                  variant="outlined"
                  sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    borderColor: isDark ? 'white' : 'black',
                    borderTop: 'none',
                  }}
                >
                  {/* Decorative accent gradient */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '5px',
                      background: theme => `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    }}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <FeedbackIcon color="primary" sx={{ mr: 2, fontSize: 28 }} />
                    <Typography variant="h5" fontWeight="bold">
                      Your Feedback Matters
                    </Typography>
                  </Box>

                  <Typography variant="body1" paragraph>
                    We value your feedback and suggestions to help us improve Code Quest. Please fill out the form below to share your thoughts, ideas, or report any issues you've encountered.
                  </Typography>

                  {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      {/* User Info */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          label="Name"
                          name="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          error={!!formErrors.name}
                          helperText={formErrors.name}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person fontSize="small" sx={{ color: isDark ? 'white' : 'black' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          type="email"
                          label="Email Address"
                          name="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleChange}
                          error={!!formErrors.email}
                          helperText={formErrors.email}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email fontSize="small" sx={{ color: isDark ? 'white' : 'black' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          label="Occupation"
                          name="occupation"
                          placeholder="e.g. Software Engineer, Student, etc."
                          value={formData.occupation}
                          onChange={handleChange}
                          error={!!formErrors.occupation}
                          helperText={formErrors.occupation}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person fontSize="small" sx={{ color: isDark ? 'white' : 'black' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      {/* Feedback Type */}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          required
                          select
                          label="Feedback Type"
                          name="feedbackType"
                          value={formData.feedbackType}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Category fontSize="small" sx={{ color: isDark ? 'white' : 'black' }} />
                              </InputAdornment>
                            ),
                          }}
                        >
                          {feedbackTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <div display="inline-flex" style={{ width: "93%" }}>
                        <Grid item xs={12}>
                          <Divider sx={{ mb: 2 }}>
                            <Chip
                              label="Ratings"
                              icon={<Star fontSize="small" sx={{ color: isDark ? 'white' : 'black' }} />}
                              sx={{ px: 1 }}
                            />
                          </Divider>
                        </Grid>
                      </div>
                      <Grid item xs={12}>

                        <Paper
                          variant="outlined"
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            // bgcolor: theme => alpha(theme.palette.primary.main, 0.03),
                            mb: 2,
                            borderColor: isDark ? 'white' : 'black',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          {/* Animated background */}
                          <Box
                            component={motion.div}
                            animate={{
                              x: [0, -10, 20, -5, 0],
                            }}
                            transition={{
                              duration: 20,
                              repeat: Infinity,
                              repeatType: 'mirror',
                            }}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,

                              right: 0,
                              bottom: 0,
                              opacity: 0.035,
                              pointerEvents: 'none',
                            }}
                          />

                          <Typography variant="subtitle1" fontWeight="bold" align="center" gutterBottom>
                            How would you rate your overall experience with Code Quest?
                          </Typography>
                          <Box sx={{ position: 'relative', zIndex: 2, }}>
                            <CustomRating
                              value={formData.ratingGeneral}
                              onChange={(value) => handleRatingChange('ratingGeneral', value)}
                              sx={{ color: isDark ? 'white' : 'black' }}
                            />
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            height: '100%',
                            borderColor: isDark ? 'white' : 'black',
                            transition: 'all 0.2s ease',
                            color: isDark ? 'white' : 'black',
                            '&:hover': {
                              boxShadow: '0 5px 15px rgba(0,0,0,0.07)',
                              borderColor: theme => theme.palette.primary.main,

                            },
                          }}
                        >
                          <Typography variant="subtitle1" align="center" gutterBottom>
                            Ease of Use
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Rating
                              value={formData.ratingEase}
                              onChange={(event, value) => handleRatingChange('ratingEase', value)}
                              size="large"
                            />
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 3,
                            borderColor: isDark ? 'white' : 'black',
                            borderRadius: 3,
                            height: '100%',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: '0 5px 15px rgba(0,0,0,0.07)',
                              borderColor: theme => theme.palette.primary.main,
                            },
                          }}
                        >
                          <Typography variant="subtitle1" align="center" gutterBottom>
                            Customer Support
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Rating
                              value={formData.ratingSupport}
                              onChange={(event, value) => handleRatingChange('ratingSupport', value)}
                              size="large"
                            />
                          </Box>
                        </Paper>
                      </Grid>


                      {/* Specific Features */}
                      <Grid item xs={12}>
                        <Divider sx={{ mb: 2 }}>
                          <Chip
                            label="Features"
                            icon={<Extension fontSize="small" />}
                            sx={{ px: 1 }}
                          />
                        </Divider>
                        <Typography variant="subtitle1" gutterBottom>
                          Which specific features are you providing feedback about? (Optional)
                        </Typography>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          {features.map((feature) => (
                            <Grid item key={feature.value}>
                              <Chip
                                component={motion.div}
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                label={feature.label}
                                onClick={() => handleFeatureToggle(feature.value)}
                                variant={formData.specificFeatures.includes(feature.value) ? 'filled' : 'outlined'}
                                color={formData.specificFeatures.includes(feature.value) ? 'primary' : 'default'}
                                sx={{
                                  py: 0.5,
                                  transition: 'all 0.2s ease',
                                }}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>

                      {/* Feedback Text */}
                      <Grid item xs={12} sx={{ width: "100%" }}>
                        <TextField
                          fullWidth
                          required
                          label="Your Feedback"
                          name="feedback"
                          value={formData.feedback}
                          onChange={handleChange}
                          error={!!formErrors.feedback}
                          helperText={formErrors.feedback}
                          multiline
                          rows={6}
                          placeholder="Please share your thoughts, ideas, suggestions, or report issues you've encountered..."
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ mt: 1.5, ml: 1 }}>
                                <Comment fontSize="small" sx={{ position: "relative", top: '-62px', color: isDark ? "white" : "black" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              pl: 0.5,

                            }
                          }}
                        />
                      </Grid>

                      {/* Contact Permission */}
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={formData.contactConsent}
                              onChange={handleCheckboxChange}
                              name="contactConsent"
                            />
                          }
                          label="I agree to be contacted regarding my feedback if necessary"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <LoadingButton
                          type="submit"
                          variant="contained"
                          size="large"
                          loading={loading}
                          startIcon={<SendIcon />}
                          sx={{
                            px: 4,
                            py: 1.2,
                            borderRadius: '8px',
                            background: theme => `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            '&:hover': {
                              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                            },
                          }}
                        >
                          Submit Feedback
                        </LoadingButton>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </motion.div>
            </Grid>

            {/* Enhanced Sidebar */}
            <Grid item xs={12} md={4} sx={{ width: "100%", }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Box sx={{ position: 'sticky', top: 24 }} >
                  {/* Why Feedback Matters */}
                  <Paper
                    elevation={0}
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      mb: 3,
                      borderColor: isDark ? 'white' : 'black',
                      borderLeft: "none",
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.07)',
                      },
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Decorative accent */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '4px',
                        height: '100%',
                        bgcolor: theme => theme.palette.primary.main,
                        borderRadius: '4px 0 0 4px',
                      }}
                    />

                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Why Your Feedback Matters
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Your feedback directly influences our product development roadmap and helps us prioritize features that matter most to our users.
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        p: 2,
                        bgcolor: theme => alpha(theme.palette.success.main, 0.05),
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        align="center"
                        sx={{
                          fontSize: '0.9rem',
                          fontWeight: 500,
                        }}
                      >
                        Last year, we implemented <strong>73%</strong> of user-suggested features and fixed <strong>94%</strong> of reported issues within 30 days.
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Recent Improvements */}
                  <Paper
                    elevation={0}
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 3,

                      borderColor: isDark ? 'white' : 'black',

                      mb: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.07)',
                      },
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Recent Improvements from User Feedback
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleOutline color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Enhanced Search Filtering"
                          secondary="Added more granular filters for venue amenities and features"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleOutline color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Streamlined Booking Process"
                          secondary="Reduced the booking steps from 5 to 3"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleOutline color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Mobile App Improvements"
                          secondary="Redesigned calendar interface for better usability"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleOutline color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Communication Tools"
                          secondary="Added in-app messaging between venue owners and event organizers"
                        />
                      </ListItem>
                    </List>
                  </Paper>

                  {/* Contact Support */}
                  <Paper
                    elevation={0}
                    variant="outlined"
                    sx={{
                      p: 3,
                      borderRadius: 3,

                      borderColor: isDark ? 'white' : 'black',

                      background: theme => `linear-gradient(135deg, ${alpha(theme.palette.background.default, 0.5)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
                      backdropFilter: 'blur(10px)',

                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Decorative elements */}
                    <Box
                      component={motion.div}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 120,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      sx={{
                        position: 'absolute',
                        right: -40,
                        bottom: -40,
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        border: theme => `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
                        opacity: 0.3,
                        pointerEvents: 'none',
                      }}
                    />

                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Need Immediate Assistance?
                    </Typography>
                    <Typography variant="body2" paragraph>
                      For urgent matters or technical support, please contact our support team directly:
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email fontSize="small" sx={{ mr: 1, color: theme => theme.palette.primary.main }} />
                        Email
                      </Typography>
                      <Typography
                        variant="body2"
                        component="a"
                        href="mailto:codequest.server@gmail.com"
                        sx={{
                          display: 'block',
                          color: theme => theme.palette.text.primary,
                          textDecoration: 'none',
                          ml: 3.5,
                          '&:hover': {
                            textDecoration: 'underline',
                            color: theme => theme.palette.primary.main,
                          }
                        }}
                      >
                        codequest.server@gmail.com
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone fontSize="small" sx={{ mr: 1, color: theme => theme.palette.primary.main }} />
                        Phone
                      </Typography>
                      <Typography
                        variant="body2"
                        component="a"
                        href="tel:18005551234"
                        sx={{
                          display: 'block',
                          color: theme => theme.palette.text.primary,
                          textDecoration: 'none',
                          ml: 3.5,
                          '&:hover': {
                            textDecoration: 'underline',
                            color: theme => theme.palette.primary.main,
                          }
                        }}
                      >
                        +91 9897868221
                      </Typography>
                    </Box>
                    <Button
                      fullWidth
                      variant="outlined"
                      component={RouterLink}
                      to="/contact"
                      sx={{
                        mt: 3,
                        borderRadius: '8px',
                        py: 1,
                        borderWidth: '2px',
                        '&:hover': {
                          borderWidth: '2px',
                          bgcolor: theme => alpha(theme.palette.primary.main, 0.04),
                        }
                      }}
                      startIcon={<SupportAgent />}
                    >
                      Contact Support
                    </Button>
                  </Paper>


                </Box>
              </motion.div>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Your feedback has been submitted successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Feedback;
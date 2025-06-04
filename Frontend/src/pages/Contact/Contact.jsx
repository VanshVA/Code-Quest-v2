import React, { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AccessTime,
  AutoAwesome,
  Call,
  CheckCircle,
  Email,
  Facebook,
  GitHub,
  Instagram,
  LinkedIn,
  LocationOn,
  MessageOutlined,
  Person,
  PhoneInTalk,
  Send,
  Twitter,
  VerifiedUser,
} from '@mui/icons-material';
import { motion } from 'framer-motion';



// Contact information
const contactInfo = {
  email: "codequest.server@gmail.com",
  phone: "+91 9897868221",
  address: "Pachokra, Haridwar Road, Moradabad",
  officeHours: "Monday - Friday: 9:00 AM - 6:00 PM (PST)",
  socialMedia: [
    { name: "LinkedIn", icon: <LinkedIn />, url: "https://linkedin.com/company/code-quest" },
    { name: "Twitter", icon: <Twitter />, url: "https://twitter.com/codequest" },
    { name: "GitHub", icon: <GitHub />, url: "https://github.com/VanshVA/Code-Quest-v2" },
  ]
};
const ContactPage = () => {
  const theme = useTheme();
  const MotionBox = motion(Box);
  const MotionTypography = motion(Typography);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
   
    message: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);

  // Add a form reference for EmailJS (not strictly needed for .send, but kept for your structure)
  const formRef = useRef();

  // Validate form
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.phone.trim() && !phoneRegex.test(formData.phone.trim())) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      errors.message = 'Message should be at least 20 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle form submission with EmailJS integration
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmitStatus('loading');

      // ====== REPLACE THESE WITH YOUR REAL VALUES FROM EMAILJS DASHBOARD ======
      const serviceId = 'service_nauuuy2';         // EmailJS service ID
      const templateId = 'template_vev11b5';       // EmailJS template ID
      const publicKey = 'MoEOsizhLlz0mBZix';// <-- MUST start with 'public_'
      // =======================================================================

      // Format current date and time
      const now = new Date();
      const formattedDateTime = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      // Prepare template parameters based on your form data
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        from_phone: formData.phone || 'Not provided',
        message: formData.message,
        submission_time: formattedDateTime
      };

      // Send email using EmailJS
      emailjs.send(serviceId, templateId, templateParams, publicKey)
        .then((response) => {
          console.log('SUCCESS!', response.status, response.text);
          setSubmitStatus('success');

          setFormData({
            name: '',
            email: '',
            phone: '',
   
            message: '',
          });

          setTimeout(() => {
            setSubmitStatus(null);
          }, 5000);
        })
        .catch((error) => {
          // Enhanced logging: show exact error from EmailJS
          if (error && error.text) {
            alert('EmailJS Error: ' + error.text);
          }
          console.error('EmailJS FAILED:', error);
          setSubmitStatus('error');
        });
    } else {
      setSubmitStatus('error');
    }
  };

  // Handle alert close
  const handleCloseAlert = () => {
    setSubmitStatus(null);
  };

  // The rest of your UI remains untouched...
  return (
   <Box sx={{ bgcolor: isDark ? 'background.default' : '#f8f9fa', minHeight: '100vh' }}>
      
       {/* Hero Section */}
            <Box 
              component="section" 
              sx={{ 
                position: 'relative',
                pt: { xs: '100px', sm: '120px', md: '140px' },
                pb: { xs: '60px', sm: '80px', md: '100px' },
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
                                sx={{ mb: 3, display: 'inline-block',}}
                              >
                                <Chip 
                                  label="Contact CODE-QUEST" 
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
                       Get in Touch with
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
                           Code-Quest
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
                        Have questions or want to learn more? Our team is here to help with any inquiries you might have.
                      </MotionTypography>
                    </MotionBox>
                  </Grid>
                </Grid>
              </Container>
            </Box>
      {/* Page Header */}
   
       
      {/* Contact Methods Cards */}
      <Container maxWidth="lg" sx={{ mt: { xs: -3, md: 0 }, mb: { xs: 4, md: 6 }, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  color: 'white',
                  width: 54,
                  height: 54,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  mr: 2
                }}>
                  <Email fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Email</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Get a response within 24 hours
                  </Typography>
                  <Link 
                    href={`mailto:${contactInfo.email}`}
                    sx={{ 
                      color: theme.palette.primary.main, 
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {contactInfo.email}
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  color: 'white',
                  width: 54,
                  height: 54,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  mr: 2
                }}>
                  <PhoneInTalk fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Phone</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {contactInfo.officeHours}
                  </Typography>
                  <Link 
                    href={`tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`}
                    sx={{ 
                      color: theme.palette.primary.main, 
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {contactInfo.phone}
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                },
              }}
            >
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  color: 'white',
                  width: 54,
                  height: 54,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  mr: 2
                }}>
                  <LocationOn fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>Office</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Visit our headquarters
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    {contactInfo.address}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={7} order={{ xs: 2, lg: 1 }}>
            <Paper 
              elevation={2}
              sx={{ 
                p: { xs: 3, md: 4 }, 
                borderRadius: '10px',
                height: '100%',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Send us a message
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary">
                Fill out the form below and our team will get back to you as soon as possible.
              </Typography>
              
              <Box 
                component="form" 
                onSubmit={handleSubmit}
                ref={formRef}
                sx={{ mt: 4 }}
                noValidate
              >
                <Grid container spacing={3} sx={{minWidth:"100%"}}>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!formErrors.name}> 
                      <TextField
                        label="Full Name"
                        name="name"
                        value={formData.name} 
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person    sx={{color:isDark ? 'white' : 'black'}} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '8px' }
                        }}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        variant="outlined"
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!formErrors.email}>
                      <TextField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email   sx={{color:isDark ? 'white' : 'black'}}/>
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '8px' }
                        }}
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                        variant="outlined"
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={!!formErrors.phone}>
                      <TextField
                        label="Phone Number (Optional)"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (123) 456-7890"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Call   sx={{color:isDark ? 'white' : 'black'}} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '8px' }
                        }}
                        error={!!formErrors.phone}
                        helperText={formErrors.phone}
                        variant="outlined"
                      />
                    </FormControl>
                  </Grid>

              
                  <Grid item xs={12}   sx={{minWidth:"100%"}}>
                    <FormControl  error={!!formErrors.message} sx={{minWidth:"100%"}}>
                      <TextField
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write your message here..."
                        required
                        multiline
                        rows={6}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5, mr: 1 }}>
                              <MessageOutlined   sx={{color:isDark ? 'white' : 'black', position:"relative", top:"-10px"}} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '8px' }
                        }}
                        error={!!formErrors.message}
                        helperText={formErrors.message || "Minimum 20 characters"}
                        variant="outlined"
                      />
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={submitStatus === 'loading'}
                      endIcon={submitStatus !== 'loading' && <Send />}
                      sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: '8px',
                        fontWeight: 600
                      }}
                    >
                      {submitStatus === 'loading' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            component="span"
                            sx={{
                              display: 'inline-block',
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              border: '2px solid rgba(255,255,255,0.3)',
                              borderTopColor: 'white',
                              animation: 'spin 1s infinite linear',
                              mr: 1,
                              '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' },
                              }
                            }}
                          />
                          Sending...
                        </Box>
                      ) : 'Send Message'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Success/Error Alert - Adding these to handle EmailJS responses */}
              {submitStatus === 'success' && (
                <Alert 
                  severity="success"
                  sx={{ mt: 3, borderRadius: '8px' }}
                  icon={<CheckCircle />}
                  onClose={handleCloseAlert}
                >
                  Your message has been sent successfully. We'll get back to you soon!
                </Alert>
              )}
              
              {submitStatus === 'error' && (
                <Alert 
                  severity="error"
                  sx={{ mt: 3, borderRadius: '8px' }}
                  onClose={handleCloseAlert}
                >
                  There was an error sending your message. Please try again later.
                </Alert>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} lg={5} order={{ xs: 1, lg: 2 }}>
            {/* Social Media & Map */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Connect with us
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                {contactInfo.socialMedia.map((social) => (
                  <IconButton
                    key={social.name}
                    component="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    sx={{
                      bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                      color:isDark ? 'white' : 'black',
                      '&:hover': {
                        bgcolor: theme.palette.primary.main,
                         color:isDark ? 'white' : 'black',
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
            
            {/* Map */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Our Location
              </Typography>
              <Paper 
                elevation={2}
                sx={{ borderRadius: '10px', overflow: 'hidden' }}
              >
                <iframe
                  title="Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50740.71939576576!2d-122.08531224999999!3d37.38935994999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb7495bec0189%3A0x7c17d44a466baf9b!2sMountain%20View%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1620942256304!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </Paper>
            </Box>
            
            {/* FAQs */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Common Questions
              </Typography>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3, 
                  borderRadius: '10px',
                }}
              >
                <Stack spacing={2}>
                  <FAQ 
                    question="How quickly will I get a response?"
                    answer="We typically respond to all inquiries within 24 hours during business days."
                  />
                  <Divider />
                  <FAQ 
                    question="What information should I include in my message?"
                    answer="Please include your account details (if applicable), a clear description of your question or issue, and any relevant screenshots or details that might help us assist you faster."
                  />
                  <Divider />
                  <FAQ 
                    question="Is there a phone support option?"
                    answer="Yes, we offer phone support during business hours. You can call us at the number listed above."
                  />
                </Stack>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// FAQ Component remains the same
const FAQ = ({ question, answer }) => {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {question}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {answer}
      </Typography>
    </Box>
  );
};

export default ContactPage;
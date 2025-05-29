import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  TextField, 
  Button, 
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SendIcon from '@mui/icons-material/Send';

const Contact = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    subject: '',
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
    
    if (!formValues.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formValues.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', formValues);
      setSubmitted(true);
      
      // Reset form
      setFormValues({
        name: '',
        email: '',
        subject: '',
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
      pb: 8
    }}>
      {/* Hero Section */}
      <Box sx={{ 
        py: 10, 
        background: 'var(--background-gradient-light)',
      }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="bold"
            align="center"
            sx={{ mb: 2 }}
          >
            Contact <span style={{color: 'var(--theme-color)'}}>Us</span>
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            align="center"
            sx={{ mb: 3, color: 'var(--p-color)', maxWidth: '800px', mx: 'auto' }}
          >
            Have questions about Code-Quest? We're here to help!
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Grid container spacing={6}>
            {/* Contact Information */}
            <Grid item xs={12} md={5}>
              <Typography variant="h4" component="h2" gutterBottom>
                Get In Touch
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: 'var(--p-color)' }}>
                We'd love to hear from you. Please use the contact form or reach out to us directly using the information below.
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Paper sx={{ 
                  p: 3, 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  bgcolor: 'var(--dashboard-bg)',
                  mb: 2
                }}>
                  <EmailIcon sx={{ color: 'var(--theme-color)', mr: 2, fontSize: 24 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--p-color)' }}>
                      info@codequest-kitps.edu
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--p-color)' }}>
                      support@codequest-kitps.edu
                    </Typography>
                  </Box>
                </Paper>
                
                <Paper sx={{ 
                  p: 3, 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  bgcolor: 'var(--dashboard-bg)',
                  mb: 2
                }}>
                  <PhoneIcon sx={{ color: 'var(--theme-color)', mr: 2, fontSize: 24 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Phone
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--p-color)' }}>
                      +91 1234 567890
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--p-color)' }}>
                      +91 9876 543210
                    </Typography>
                  </Box>
                </Paper>
                
                <Paper sx={{ 
                  p: 3, 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  bgcolor: 'var(--dashboard-bg)'
                }}>
                  <LocationOnIcon sx={{ color: 'var(--theme-color)', mr: 2, fontSize: 24 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Address
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--p-color)' }}>
                      Kothiwal Institute of Technology & Professional Studies
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--p-color)' }}>
                      Moradabad, Uttar Pradesh, India
                    </Typography>
                  </Box>
                </Paper>
              </Box>
              
              <Box sx={{ mt: 6 }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  Connect With Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Social Media Icons */}
                  {/* You can add actual icons and links here */}
                </Box>
              </Box>
            </Grid>
            
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ 
                p: 4,
                bgcolor: 'var(--dashboard-bg)',
                boxShadow: '0 5px 15px var(--background-shadow)'
              }}>
                <Typography variant="h5" component="h3" gutterBottom>
                  Send Us a Message
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
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        variant="outlined"
                        value={formValues.subject}
                        onChange={handleChange}
                        error={!!errors.subject}
                        helperText={errors.subject}
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
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        variant="outlined"
                        multiline
                        rows={6}
                        value={formValues.message}
                        onChange={handleChange}
                        error={!!errors.message}
                        helperText={errors.message}
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
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        {/* Map Section */}
        <Box sx={{ py: 4, mb: 6 }}>
          <Paper sx={{ 
            p: 2,
            bgcolor: 'var(--dashboard-bg)',
            borderRadius: 2,
            height: '400px',
            overflow: 'hidden'
          }}>
            {/* You would replace this with an actual Google Map integration */}
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'var(--dashboard-color)',
              color: 'var(--p-color)',
              border: '1px dashed var(--p-color)'
            }}>
              <Typography variant="h6">
                Google Map Integration Will Be Placed Here
              </Typography>
            </Box>
          </Paper>
        </Box>
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
          Thank you! Your message has been sent successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
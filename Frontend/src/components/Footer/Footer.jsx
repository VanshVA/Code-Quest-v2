import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  Button,
  TextField,
  InputAdornment,
  Tooltip,
  Zoom,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import SendIcon from '@mui/icons-material/Send';
import CodeIcon from '@mui/icons-material/Code';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add your subscription logic here
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setSnackbarMessage('Thank you for subscribing!');
      setSnackbarSeverity('success');
      setShowSnackbar(true);
      setEmail('');
    } else {
      setSnackbarMessage('Please enter a valid email address');
      setSnackbarSeverity('error');
      setShowSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Create animated links with consistent styling
  const FooterLink = ({ to, children }) => (
    <Link 
      component={RouterLink} 
      to={to} 
      sx={{ 
        color: 'var(--p-color)', 
        mb: 1.5, 
        textDecoration: 'none',
        position: 'relative',
        display: 'inline-block',
        transition: 'all 0.3s ease',
        '&:hover': { 
          color: 'var(--theme-color)',
          transform: 'translateX(5px)'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '0',
          height: '1px',
          bottom: 0,
          left: 0,
          background: 'var(--theme-color)',
          transition: 'width 0.3s ease',
        },
        '&:hover::after': {
          width: '100%',
        }
      }}
    >
      {children}
    </Link>
  );

  const SocialButton = ({ icon, label, href }) => (
    <Tooltip title={label} placement="top" TransitionComponent={Zoom} arrow>
      <IconButton 
        aria-label={label} 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ 
          mr: 1.5, 
          color: 'var(--text-color)', 
          bgcolor: 'rgba(var(--theme-color-rgb), 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': { 
            color: 'var(--theme-color)',
            bgcolor: 'rgba(var(--theme-color-rgb), 0.15)',
            transform: 'translateY(-3px)'
          },
          width: 40,
          height: 40,
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );

  return (
    <Box
      sx={{
        bgcolor: 'var(--background-color)',
        color: 'var(--text-color)',
        mt: 'auto',
        position: 'relative',
        boxShadow: '0 -5px 20px var(--background-shadow)',
      }}
    >
      {/* Newsletter Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(to right, rgba(var(--theme-color-rgb), 0.05), rgba(var(--theme-color-rgb), 0.1))',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background elements */}
        <Box sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--theme-color-rgb), 0.1) 0%, rgba(0,0,0,0) 70%)',
          top: '-150px',
          right: '10%',
          zIndex: 0,
        }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={5} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6} sx={{ 
              animation: 'fadeInLeft 1s ease-out',
              '@keyframes fadeInLeft': {
                '0%': { opacity: 0, transform: 'translateX(-20px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
              }
            }}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, var(--theme-color), #ff7366)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                Stay Updated
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'var(--p-color)', 
                  mb: 3, 
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  maxWidth: '90%'
                }}
              >
                Subscribe to our newsletter to get the latest updates on competitions, features, tutorials, and more delivered straight to your inbox.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ 
              animation: 'fadeInRight 1s ease-out',
              '@keyframes fadeInRight': {
                '0%': { opacity: 0, transform: 'translateX(20px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
              }
            }}>
              <Box 
                component="form" 
                onSubmit={handleSubscribe} 
                sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: 'center',
                  gap: { xs: 2, sm: 0 }
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Enter your email address"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    bgcolor: 'var(--dashboard-bg)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: 'var(--theme-color)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'var(--theme-color)',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'var(--text-color)',
                      py: 1.5,
                      px: 2,
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          type="submit"
                          variant="contained"
                          endIcon={<SendIcon />}
                          sx={{
                            bgcolor: 'var(--theme-color)',
                            '&:hover': { 
                              bgcolor: 'var(--hover-color)',
                              transform: 'translateX(3px)'
                            },
                            height: '100%',
                            borderRadius: '0 8px 8px 0',
                            px: 3,
                            py: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            transition: 'all 0.3s ease',
                            display: { xs: 'none', sm: 'flex' }
                          }}
                        >
                          Subscribe
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={<SendIcon />}
                  sx={{
                    bgcolor: 'var(--theme-color)',
                    '&:hover': { 
                      bgcolor: 'var(--hover-color)',
                    },
                    display: { xs: 'flex', sm: 'none' },
                    width: '100%',
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    borderRadius: '8px',
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Footer */}
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {/* Logo and Description */}
            <Grid item xs={12} md={4}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-3px)'
                }
              }}>
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                    borderRadius: '12px',
                    p: 1.2,
                    mr: 1.5
                  }}
                >
                  <CodeIcon sx={{ fontSize: 32, color: 'var(--theme-color)' }} />
                </Box>
                <Typography 
                  variant="h5" 
                  component="div" 
                  fontWeight="bold"
                  letterSpacing="0.5px"
                >
                  Code-Quest
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                paragraph 
                sx={{ 
                  color: 'var(--p-color)', 
                  mb: 4,
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                  maxWidth: '95%'
                }}
              >
                A comprehensive online coding assessment platform designed for KITPS to conduct coding competitions with role-based access control for students, teachers, and administrators.
              </Typography>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <SocialButton 
                  icon={<GitHubIcon />} 
                  label="GitHub" 
                  href="https://github.com" 
                />
                <SocialButton 
                  icon={<LinkedInIcon />} 
                  label="LinkedIn" 
                  href="https://linkedin.com" 
                />
                <SocialButton 
                  icon={<TwitterIcon />} 
                  label="Twitter" 
                  href="https://twitter.com" 
                />
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography 
                variant="h6" 
                component="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  position: 'relative',
                  mb: 3,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '30px',
                    height: '3px',
                    bottom: '-8px',
                    left: 0,
                    backgroundColor: 'var(--theme-color)',
                    borderRadius: '3px',
                  }
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/contact">Contact</FooterLink>
                <FooterLink to="/faq">FAQ</FooterLink>
              </Box>
            </Grid>

            {/* Resources */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography 
                variant="h6" 
                component="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  position: 'relative',
                  mb: 3,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '30px',
                    height: '3px',
                    bottom: '-8px',
                    left: 0,
                    backgroundColor: 'var(--theme-color)',
                    borderRadius: '3px',
                  }
                }}
              >
                Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FooterLink to="/competitions">Competitions</FooterLink>
                <FooterLink to="/practice">Practice Problems</FooterLink>
                <FooterLink to="/leaderboard">Leaderboard</FooterLink>
                <FooterLink to="/tutorials">Tutorials</FooterLink>
              </Box>
            </Grid>

            {/* Legal */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography 
                variant="h6" 
                component="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  position: 'relative',
                  mb: 3,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '30px',
                    height: '3px',
                    bottom: '-8px',
                    left: 0,
                    backgroundColor: 'var(--theme-color)',
                    borderRadius: '3px',
                  }
                }}
              >
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
                <FooterLink to="/terms-of-use">Terms of Use</FooterLink>
                <FooterLink to="/feedback">Feedback</FooterLink>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ 
          borderColor: 'rgba(var(--theme-color-rgb), 0.15)', 
          borderWidth: '1px',
          opacity: 0.5
        }} />

        {/* Bottom Footer - Enhanced with better styling */}
        <Box 
          sx={{ 
            py: 4, 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: 'center',
            position: 'relative'
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--p-color)', 
              mb: { xs: 2, md: 0 },
              fontWeight: 500
            }}
          >
            © {new Date().getFullYear()} <span style={{ color: 'var(--theme-color)', fontWeight: 600 }}>Code-Quest</span> | KITPS Final Year Project
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            position: { md: 'absolute' },
            left: { md: '50%' },
            transform: { md: 'translateX(-50%)' }
          }}>
            <FooterLink to="/sitemap">Sitemap</FooterLink>
            <Box 
              sx={{ 
                width: '4px', 
                height: '4px', 
                bgcolor: 'var(--p-color)', 
                borderRadius: '50%',
                display: { xs: 'none', md: 'block' }
              }} 
            />
            <FooterLink to="/accessibility">Accessibility</FooterLink>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--p-color)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            Developed with <span className="heart-icon" style={{ 
              color: 'var(--theme-color)',
              display: 'inline-flex',
              animation: 'heartbeat 1.5s infinite'
            }}>❤</span> by <Link 
              href="https://github.com/yourUsername" 
              target="_blank"
              rel="noopener noreferrer"
              sx={{ 
                color: 'var(--theme-color)', 
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Vansh Sharma
            </Link>
          </Typography>
        </Box>
      </Container>

      {/* Back to top button */}
      <Tooltip title="Back to top" placement="top" arrow>
        <Fab 
          color="primary" 
          size="medium" 
          aria-label="back to top"
          onClick={scrollToTop}
          sx={{
            position: 'absolute',
            right: 30,
            top: -25,
            bgcolor: 'var(--theme-color)',
            '&:hover': {
              bgcolor: 'var(--hover-color)',
              transform: 'translateY(-5px)'
            },
            transition: 'all 0.3s ease',
            zIndex: 2,
            boxShadow: '0 4px 16px rgba(var(--theme-color-rgb), 0.4)'
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Tooltip>

      {/* Notification for subscription */}
      <Snackbar 
        open={showSnackbar} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
      `}</style>
    </Box>
  );
};

export default Footer;
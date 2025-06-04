import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  LinkedIn,
  YouTube,
  GitHub,
  ArrowUpward,
  Send,
  LocationOn,
  Email,
  Phone,
  ArrowForward,
  DarkMode,
  LightMode,
  CheckCircle,
} from '@mui/icons-material';
import { useColorMode } from '../../context/ThemeContext';

const socialLinks = [
  { name: 'Facebook', icon: <Facebook />, url: 'https://facebook.com' },
  { name: 'LinkedIn', icon: <LinkedIn />, url: 'https://linkedin.com' },
  { name: 'GitHub', icon: <GitHub />, url: 'https://github.com/VanshVA/Code-Quest-v2' },
];

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { name: 'Features', path: '/features' },
      { name: 'Competitions', path: '/competitions' },
      { name: 'Leaderboard', path: '/leaderboard' },
      { name: 'Dashboard', path: '/student/dashboard' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', path: '/docs' },
  
      { name: 'FAQ', path: '/faq' },
      { name: 'Support', path: '/support' },
      { name: 'Refrences', path: '/Refrences' }
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Testimonial', path: '/Testimonial' },
      { name: 'Feedback', path: '/feedback' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Security', path: '/security' },
      // { name: 'Accessibility', path: '/accessibility' },
    ]
  }, 
];

const Footer = ({ isAuthenticated = false }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { toggleColorMode } = useColorMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Get formatted current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setCurrentDateTime(now.toLocaleString('en-US', options).replace(',', ''));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Here you would handle the actual subscription
      console.log('Subscribing email:', email);
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 3000);
    }
  };

  return (
    <Box component="footer">
      {/* Premium footer with gradient background */}
      <Box
        sx={{
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(20, 20, 20, 0.95)'
            : 'rgba(250, 250, 250, 0.98)',
          overflow: 'hidden',
          position: 'relative',
          pt: { xs: 8, md: 10 },
          pb: { xs: 6, md: 4 },
          borderTop: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.03)', // Added subtle shadow
        }}
      >
        {/* Subtle background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: `radial-gradient(${theme.palette.primary.main} 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            pointerEvents: 'none',
          }}
        />
        
        {/* Gradient accent */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px', // Slightly thicker accent
            background: 'linear-gradient(90deg, #f47061, #bc4037, #f47061)', // Modified gradient
            backgroundSize: '200% 100%',
            animation: 'gradientMove 10s ease infinite',
            '@keyframes gradientMove': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
          }}
        />

        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Brand section */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box 
                    component="span"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48, // Larger logo
                      height: 48,
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #f47061 0%, #bc4037 100%)',
                      boxShadow: '0 8px 16px rgba(188, 64, 55, 0.2)', // Enhanced shadow
                      mr: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '2rem', // Larger font
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      C
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1.2 }}> {/* Increased size and weight */}
                      CODE-QUEST
                    </Typography>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: theme.palette.text.secondary,
                        fontWeight: 600,
                        letterSpacing: 1.2,
                        fontSize: '0.7rem', // Slightly larger
                      }}
                    >
                      CODING PLATFORM
                    </Typography>
                  </Box>
                </Box>
                
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ 
                    mb: 2.5, // More space
                    lineHeight: 1.8, // Better readability
                    maxWidth: '90%' // Contained width
                  }}
                >
                  The ultimate platform for coding competitions and programming skill assessment.
                  Perfect for educational institutions, programming enthusiasts, and aspiring developers.
                </Typography>
                
                {/* Social links */}
                <Stack 
                  direction="row" 
                  spacing={1.5}
                >
                  {socialLinks.map((social, index) => ( 
                    <IconButton
                      key={social.name}
                      color="primary"
                      aria-label={social.name}
                      component="a"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ 
                           backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                          color:isDark ? 'white' : 'black',
                        '&:hover': { 
                          scale: 1.1,
                          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                         color:isDark ? 'white' : 'black',
                          transform: 'translateY(-3px)', // Added movement
                          transition: 'all 0.3s ease',
                        },
                        boxShadow: '0 3px 6px rgba(0,0,0,0.05)', // Subtle shadow
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Box>
              
              {/* Newsletter subscription - improved UI */}
              <Box 
                sx={{ 
                  width: '100%',
                  mb: { xs: 4, md: 0 },
                  p: 2.5, // Added padding
                  borderRadius: '16px',
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255,255,255,0.03)'  
                    : 'rgba(0,0,0,0.02)',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(0,0,0,0.05)',
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  sx={{ fontWeight: 700 }}
                >
                  Subscribe to Newsletter
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block', mb: 2 }}
                >
                  Get the latest updates and offers directly to your inbox
                </Typography>
                <Box 
                  component="form" 
                  onSubmit={handleSubscribe}
                  sx={{ 
                    position: 'relative',
                    maxWidth: '100%',
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={subscribed}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            type="submit" 
                            edge="end"
                            disabled={!email || subscribed}
                            sx={{ 
                              color: 'white',
                              bgcolor: theme.palette.primary.main,
                              borderRadius: '50%',
                              width: 36,
                              height: 36,
                              marginRight:"1px",
                              '&:hover': {
                                bgcolor: theme.palette.primary.dark,
                                transform: 'scale(1.05)',
                              },
                              '&.Mui-disabled': {
                                bgcolor: theme.palette.grey[400],
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Send fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { 
                        borderRadius: '50px',
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.07)'
                          : 'rgba(255,255,255,0.8)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
                        },
                      }
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',
                      }
                    }}
                  />
                  {subscribed && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '120%',
                        left: 0,
                        width: '100%',
                        color: theme.palette.success.main,
                        fontSize: '0.75rem',
                        mt: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <CheckCircle sx={{ fontSize: '0.875rem', mr: 0.5 }} />
                      Successfully subscribed! Thank you.
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>
            
            {/* Links sections - modified to use more space */}
            {!isSmall && (
              <Grid item xs={12} md={8}>
                <Grid container spacing={29}>
                  {footerLinks.map((section, index) => (
                    <Grid item xs={6} sm={3} key={section.title}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: 700 }}
                      >
                        {section.title}
                      </Typography>
                      <Box 
                        component="ul" 
                        sx={{ 
                          pl: 0, 
                          listStyle: 'none',
                          mb: 0
                        }}
                      >
                        {section.links.map((link, linkIndex) => (
                          <Box 
                            component="li" 
                            key={link.name}
                            sx={{ mb: 1.5 }} // Increased spacing between links
                          >
                            <Box
                              component={RouterLink}
                              to={link.path}
                              sx={{
                                color: 'text.secondary',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                position: 'relative',
                                fontSize: '0.95rem', // Slightly larger font
                                '&:hover': {
                                  color: theme.palette.primary.main,
                                  '& .arrow': {
                                    opacity: 1,
                                    transform: 'translateX(4px)',
                                  },
                                },
                              }}
                            >
                              {link.name}
                              <ArrowForward 
                                className="arrow"
                                sx={{ 
                                  fontSize: '0.8rem',
                                  ml: 0.5,
                                  opacity: 0,
                                  transition: 'all 0.2s ease',
                                }}
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

            {/* Collapsible link sections for mobile */}
            {isSmall && (
              <Grid item xs={12}>
                <Paper
                  sx={{ 
                    p: 2,
                    borderRadius: '16px',
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <Grid container spacing={2}>
                    {footerLinks.map((section) => (
                      <Grid item xs={6} key={section.title}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 700,
                            color: theme.palette.primary.main,
                            mb: 1,
                          }}
                        >
                          {section.title}
                        </Typography>
                        <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
                          {section.links.slice(0, 3).map((link) => (
                            <Box component="li" key={link.name} sx={{ mb: 1 }}>
                              <Link
                                component={RouterLink}
                                to={link.path}
                                color="text.secondary"
                                sx={{ 
                                  textDecoration: 'none',
                                  fontSize: '0.85rem',
                                  '&:hover': {
                                    color: theme.palette.primary.main,
                                  }
                                }}
                              >
                                {link.name}
                              </Link>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
          
        </Container>
      </Box>
      
      {/* Contact info strip - improved styling */}
      <Box
        sx={{
          py: 2.5, // More padding
          px: 3,
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(10, 10, 10, 0.95)'
            : 'rgba(240, 240, 240, 0.98)',
          borderTop: `1px solid ${theme.palette.divider}`,
          boxShadow: 'inset 0 5px 5px -5px rgba(0,0,0,0.1)', // Inset shadow
        }}
      >
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between"
            alignItems={{ xs: 'center', sm: 'flex-start' }}
            spacing={2}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 2, sm: 4 }} 
              alignItems="center"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent :"center"}}>
                <LocationOn 
                  fontSize="small" 
                  sx={{ color: theme.palette.primary.main, mr: 0.5 }} 
                />
                <Typography variant="body2" color="text.secondary">
                Pachokra, Haridwar Road, Moradabad - 244 001 (U.P.) INDIA
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email 
                  fontSize="small" 
                  sx={{ color: theme.palette.primary.main, mr: 0.5 }} 
                />
                <Typography variant="body2" color="text.secondary">
                  codequest.server@gmail.com
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone 
                  fontSize="small" 
                  sx={{ color: theme.palette.primary.main, mr: 0.5 }} 
                />
                <Typography variant="body2" color="text.secondary">
                  +91 9897868221
                </Typography>
              </Box>
            </Stack>
            
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button 
                variant="outlined" 
                color="primary"
                startIcon={<Email />}
                component={RouterLink}
                to="/contact"
                size="small"
                sx={{ borderRadius: '50px' }}
              >
                Contact Us
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
      
      {/* Scroll to top button - improved */}
      {showScrollTop && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 10,
          }}
        >
          <Tooltip title="Scroll to top">
            <IconButton
              onClick={scrollToTop}
              color="primary"
              aria-label="scroll to top"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                  transform: 'translateY(-5px)',
                },
                transition: 'transform 0.3s ease',
                width: 42, // Larger size
                height: 42,
              }}
            >
              <ArrowUpward />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default Footer;
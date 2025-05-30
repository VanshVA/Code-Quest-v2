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
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useColorMode } from '../../context/ThemeContext';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);
const MotionIconButton = motion(IconButton);

const socialLinks = [
  { name: 'Facebook', icon: <Facebook />, url: 'https://facebook.com' },
  { name: 'Twitter', icon: <Twitter />, url: 'https://twitter.com' },
  { name: 'LinkedIn', icon: <LinkedIn />, url: 'https://linkedin.com' },
  { name: 'YouTube', icon: <YouTube />, url: 'https://youtube.com' },
  { name: 'GitHub', icon: <GitHub />, url: 'https://github.com' },
];

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { name: 'Features', path: '/features' },
      { name: 'Competitions', path: '/competitions' },
      { name: 'Leaderboard', path: '/leaderboard' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Roadmap', path: '/roadmap' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', path: '/docs' },
      { name: 'Tutorials', path: '/tutorials' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Support', path: '/support' },
      { name: 'API Access', path: '/api' },
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '/careers' },
      { name: 'Blog', path: '/blog' },
      { name: 'Press Kit', path: '/press' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Security', path: '/security' },
      { name: 'Accessibility', path: '/accessibility' },
    ]
  },
];

const Footer = ({ isAuthenticated = false }) => {
  const theme = useTheme();
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
            height: '4px',
            background: theme.palette.gradients.primary,
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
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f47061 0%, #bc4037 100%)',
                      boxShadow: '0 4px 10px rgba(188, 64, 55, 0.3)',
                      mr: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: 'white',
                      }}
                    >
                      C
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                      CODE-QUEST
                    </Typography>
                    <Typography 
                      variant="caption"
                      sx={{ 
                        color: theme.palette.text.secondary,
                        fontWeight: 500,
                        letterSpacing: 1,
                      }}
                    >
                      CODING PLATFORM
                    </Typography>
                  </Box>
                </Box>
                
                <MotionTypography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  The ultimate platform for coding competitions and programming skill assessment.
                  Perfect for educational institutions, programming enthusiasts, and aspiring developers.
                </MotionTypography>
                
                {/* Social links */}
                <Stack 
                  direction="row" 
                  spacing={1}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  {socialLinks.map((social, index) => (
                    <MotionIconButton
                      key={social.name}
                      color="primary"
                      aria-label={social.name}
                      component="a"
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20, 
                        delay: 0.1 + index * 0.05 
                      }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        scale: 1.1,
                        backgroundColor: theme.palette.primary.main,
                        color: '#fff',
                      }}
                      sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.03)',
                      }}
                    >
                      {social.icon}
                    </MotionIconButton>
                  ))}
                </Stack>
              </Box>
              
              {/* Newsletter subscription */}
              <Box 
                component={motion.div}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                sx={{ mb: { xs: 4, md: 0 } }}
              >
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  sx={{ fontWeight: 600 }}
                >
                  Subscribe to Newsletter
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
                              '&:hover': {
                                bgcolor: theme.palette.primary.dark,
                              },
                              '&.Mui-disabled': {
                                bgcolor: theme.palette.grey[400],
                              }
                            }}
                          >
                            <Send fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { 
                        pr: 0.5,
                        borderRadius: '50px',
                        bgcolor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(0,0,0,0.02)',
                      }
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',
                      }
                    }}
                  />
                  <AnimatePresence>
                    {subscribed && (
                      <MotionBox
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        sx={{
                          position: 'absolute',
                          top: '120%',
                          left: 0,
                          width: '100%',
                          color: theme.palette.success.main,
                          fontSize: '0.75rem',
                          mt: 0.5,
                        }}
                      >
                        Successfully subscribed! Thank you.
                      </MotionBox>
                    )}
                  </AnimatePresence>
                </Box>
              </Box>
            </Grid>
            
            {/* Links sections */}
            {!isSmall && (
              <>
                {footerLinks.map((section, index) => (
                  <Grid item xs={6} md={2} key={section.title}>
                    <MotionTypography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 700 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.05 * index }}
                      viewport={{ once: true }}
                    >
                      {section.title}
                    </MotionTypography>
                    <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
                      {section.links.map((link, linkIndex) => (
                        <Box 
                          component="li" 
                          key={link.name}
                          sx={{ mb: 1 }}
                        >
                          <MotionBox
                            component={RouterLink}
                            to={link.path}
                            sx={{
                              color: 'text.secondary',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              position: 'relative',
                              '&:hover': {
                                color: theme.palette.primary.main,
                                '& .arrow': {
                                  opacity: 1,
                                  transform: 'translateX(4px)',
                                },
                              },
                            }}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 + (0.05 * index) + (0.03 * linkIndex) }}
                            viewport={{ once: true }}
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
                          </MotionBox>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                ))}
              </>
            )}

            {/* Collapsible link sections for mobile */}
            {isSmall && (
              <Grid item xs={12}>
                <MotionPaper
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
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
                </MotionPaper>
              </Grid>
            )}
          </Grid>
          
          <Divider sx={{ my: 4 }} />
          
          {/* Bottom section with user info, time, copyright */}
          <Grid 
            container 
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 2 }}
          >
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isAuthenticated && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    <Avatar 
                      alt="Anuj Prajapati" 
                      src="/assets/user-avatar.jpg"
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        mr: 1,
                        border: `2px solid ${theme.palette.primary.main}`,
                      }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Anuj-prajapati-SDE
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Active Session
                      </Typography>
                    </Box>
                  </Box>
                )}
                
                <Box 
                  sx={{ 
                    ml: isAuthenticated ? 2 : 0,
                    display: 'flex',
                    alignItems: 'center',
                    px: 1.5,
                    py: 0.7,
                    borderRadius: '8px',
                    bgcolor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                    UTC {currentDateTime}
                  </Typography>
                </Box>
                
                <IconButton 
                  onClick={toggleColorMode} 
                  size="small" 
                  sx={{ ml: 1 }}
                  color="primary"
                >
                  {theme.palette.mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
                </IconButton>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: { xs: 'center', sm: 'flex-end' },
                  alignItems: 'center', 
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  © {new Date().getFullYear()} Code-Quest. All rights reserved.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Made with ❤️ by{' '}
                  <Link href="#" color="inherit" sx={{ fontWeight: 600 }}>
                    Anuj Prajapati
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Contact info strip */}
      <Box
        sx={{
          py: 2,
          px: 3,
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(10, 10, 10, 0.95)'
            : 'rgba(240, 240, 240, 0.98)',
          borderTop: `1px solid ${theme.palette.divider}`,
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
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn 
                  fontSize="small" 
                  sx={{ color: theme.palette.primary.main, mr: 0.5 }} 
                />
                <Typography variant="body2" color="text.secondary">
                  123 Coding Street, Tech City, 10001
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email 
                  fontSize="small" 
                  sx={{ color: theme.palette.primary.main, mr: 0.5 }} 
                />
                <Typography variant="body2" color="text.secondary">
                  contact@code-quest.com
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone 
                  fontSize="small" 
                  sx={{ color: theme.palette.primary.main, mr: 0.5 }} 
                />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
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
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <MotionBox
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
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
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                  '&:hover': {
                    backgroundColor: theme.palette.background.paper,
                    transform: 'translateY(-5px)',
                  },
                  transition: 'transform 0.3s ease',
                }}
              >
                <ArrowUpward />
              </IconButton>
            </Tooltip>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Footer;
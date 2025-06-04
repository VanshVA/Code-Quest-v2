import React, { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AccessTime,
  ArrowForward,
  Article,
  Book,
  ContactSupport,
  DevicesOther,
  Email,
  FilterList,
  HelpOutline,
  LiveHelp,
  Person,
  SearchOutlined,
  Security,
  SettingsOutlined,
  Star,
  StarBorder,
  VerifiedUser,
  Payment,
  DeveloperMode,
  Refresh,
  Check,
  AutoAwesome
} from '@mui/icons-material';
import { motion } from 'framer-motion';


// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

// Support categories
const supportCategories = [
  { id: 'getting-started', title: 'Getting Started', icon: <Book color="primary" />, articles: 8 },
  { id: 'account', title: 'Account Management', icon: <Person color="primary" />, articles: 12 },
  { id: 'billing', title: 'Billing & Payments', icon: <Payment color="primary" />, articles: 10 },
  { id: 'technical', title: 'Technical Issues', icon: <DeveloperMode color="primary" />, articles: 15 },
  { id: 'platform', title: 'Platform Features', icon: <DevicesOther color="primary" />, articles: 18 },
  { id: 'security', title: 'Security & Privacy', icon: <Security color="primary" />, articles: 6 },
];

// Popular articles
const popularArticles = [
  { id: 1, title: 'How to reset your password', category: 'Account Management', views: 12549 },
  { id: 2, title: 'Subscription plan comparison', category: 'Billing & Payments', views: 9872 },
  { id: 3, title: 'Setting up two-factor authentication', category: 'Security & Privacy', views: 8741 },
  { id: 4, title: 'Connecting your GitHub account', category: 'Getting Started', views: 7563 },
  { id: 5, title: 'Using the code editor', category: 'Platform Features', views: 6329 },
];

// Recent articles
const recentArticles = [
  { id: 6, title: 'New collaboration features', category: 'Platform Features', date: '2025-05-25' },
  { id: 7, title: 'Mobile app update guide', category: 'Technical Issues', date: '2025-05-22' },
  { id: 8, title: 'Team billing options', category: 'Billing & Payments', date: '2025-05-18' },
  { id: 9, title: 'AI assistant best practices', category: 'Getting Started', date: '2025-05-15' },
];

const SupportPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  
  // State for active tab and other UI elements
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [favoriteArticles, setFavoriteArticles] = useState([1, 3]); // Example: Articles 1 and 3 are favorited
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  // Handle contact form submission
  const handleContactSubmit = (event) => {
    event.preventDefault();
    setSubmitStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setSubmitStatus('success');
      setContactEmail('');
      setContactMessage('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };
  
  // Handle favorite toggle
  const handleFavoriteToggle = (articleId) => {
    if (favoriteArticles.includes(articleId)) {
      setFavoriteArticles(favoriteArticles.filter(id => id !== articleId));
    } else {
      setFavoriteArticles([...favoriteArticles, articleId]);
    }
  };

  return (
    <Box sx={{ bgcolor: isDark ? 'background.default' : '#fff', minHeight: '90vh' }}>
      {/* Hero Section */}
       <Container maxWidth="100%">
          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={7}>
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
                            label="Support CODE-QUEST" 
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
                    How Can We
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
                   Help You?
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
                  Find answers to your questions and learn how to make the most of our platform.
                </MotionTypography>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
            
            </Grid>
            
           
          </Grid>
        </Container>
      
      {/* Categories Section */}
      <Box sx={{ mt: { xs: -4, md: -8 } }}>
        <Container  style={{minWidth: "100%",display: "flex", justifyContent: "center"} }>
          <Grid container spacing={3}>
            {supportCategories.map((category, index) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <MotionCard 
                  elevation={3}
                  component={RouterLink}
                  to={`/support/${category.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ 
                    y: -8,
                    boxShadow: 8,
                    transition: { duration: 0.2 }
                  }}
                  sx={{
                    bgcolor: 'background.paper',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 3,
                    textDecoration: 'none',
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
                    }
                  }}
                >
                  <Box sx={{ 
                    mb: 2, 
                    p: 1.5, 
                    borderRadius: '50%',
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)'
                  }}>
                    {React.cloneElement(category.icon, { sx: { fontSize: 36 } })}
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.articles} articles
                  </Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            aria-label="support content tabs"
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              }
            }}
          >
            <Tab 
              label="Popular Articles" 
              id="tab-0"
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                fontSize: '1rem',
                minWidth: 120,
              }} 
            />
            <Tab 
              label="Recent Updates" 
              id="tab-1"
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                fontSize: '1rem',
                minWidth: 120,
              }}
            />
            <Tab 
              label="Your Favorites" 
              id="tab-2" 
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600,
                fontSize: '1rem',
                minWidth: 120,
              }}
            />
          </Tabs>
        </Box>
        
        {/* Tab Content */}
        <Box>
          {/* Popular Articles */}
          {activeTab === 0 && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Grid container spacing={3}>
                {popularArticles.map((article) => (
                  <Grid item xs={12} md={6} key={article.id}>
                    <Card 
                      elevation={isDark ? 2 : 1}
                      sx={{ 
                        mb: 2, 
                        height: '100%',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: isDark ? 4 : 2,
                        }
                      }}
                    >
                      <CardContent sx={{ position: 'relative', p: 3 }}>
                     
                        <Typography 
                          variant="h6" 
                          component={Link} 
                          href={`/support/article/${article.id}`}
                          sx={{ 
                            fontWeight: 600, 
                            mb: 1,
                            color: 'text.primary',
                            textDecoration: 'none',
                            display: 'inline-block',
                            '&:hover': {
                              color: theme.palette.primary.main,
                            }
                          }}
                        >
                          {article.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Category: {article.category}
                        </Typography>
                        
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Article fontSize="small" color="action" sx={{color:isDark ? 'white' : 'black'}}/>
                          <Typography variant="body2" color="text.secondary">
                            {article.views.toLocaleString()} views
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </MotionBox>
          )}
          
          {/* Recent Updates */}
          {activeTab === 1 && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Grid container spacing={3}>
                {recentArticles.map((article) => (
                  <Grid item xs={12} md={6} key={article.id}>
                    <Card 
                      elevation={isDark ? 2 : 1}
                      sx={{ 
                        mb: 2, 
                        height: '100%',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: isDark ? 4 : 2,
                        }
                      }}
                    >
                      <CardContent sx={{ position: 'relative', p: 3 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleFavoriteToggle(article.id)}
                          sx={{ 
                            position: 'absolute', 
                            right: 16, 
                            top: 16,
                            color: favoriteArticles.includes(article.id) 
                              ? 'warning.main' 
                              : 'action.disabled'
                          }}
                        >
                          {favoriteArticles.includes(article.id) ? <Star /> : <StarBorder />}
                        </IconButton>
                        
                        <Typography 
                          variant="h6" 
                          component={Link} 
                          href={`/support/article/${article.id}`}
                          sx={{ 
                            fontWeight: 600, 
                            mb: 1,
                            color: 'text.primary',
                            textDecoration: 'none',
                            display: 'inline-block',
                            '&:hover': {
                              color: theme.palette.primary.main,
                            }
                          }}
                        >
                          {article.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Category: {article.category}
                        </Typography>
                        
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            borderRadius: 6,
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            px: 1.5,
                            py: 0.5,
                          }}
                        >
                          <Refresh sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Updated: {article.date}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </MotionBox>
          )}
          
          {/* Favorites */}
          {activeTab === 2 && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {favoriteArticles.length > 0 ? (
                <Grid container spacing={3}>
                  {[...popularArticles, ...recentArticles]
                    .filter(article => favoriteArticles.includes(article.id))
                    .map((article) => (
                      <Grid item xs={12} md={6} key={article.id}>
                        <Card 
                          elevation={isDark ? 2 : 1}
                          sx={{ 
                            mb: 2, 
                            height: '100%',
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              boxShadow: isDark ? 4 : 2,
                            }
                          }}
                        >
                          <CardContent sx={{ position: 'relative', p: 3 }}>
                            
                            
                            <Typography 
                              variant="h6" 
                              component={Link} 
                              href={`/support/article/${article.id}`}
                              sx={{ 
                                fontWeight: 600, 
                                mb: 1,
                                color: 'text.primary',
                                textDecoration: 'none',
                                display: 'inline-block',
                                '&:hover': {
                                  color: theme.palette.primary.main,
                                }
                              }}
                            >
                              {article.title}
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Category: {article.category}
                            </Typography>
                            
                            {'views' in article && (
                              <Stack direction="row" alignItems="center" spacing={1}>
                                <Article fontSize="small" color="action" sx={{color:isDark ? 'white' : 'black'}}/>
                                <Typography variant="body2" color="text.secondary">
                                  {article.views.toLocaleString()} views
                                </Typography>
                              </Stack>
                            )}
                            
                            {'date' in article && (
                              <Box
                                sx={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  borderRadius: 6,
                                  bgcolor: 'primary.light',
                                  color: 'primary.contrastText',
                                  px: 1.5,
                                  py: 0.5,
                                }}
                              >
                                <Refresh sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                  Updated: {article.date}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              ) : (
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    py: 8,
                    px: 2,
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
                    borderRadius: 2,
                  }}
                >
                  <StarBorder sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>No favorites yet</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
                    Click the star icon on any article to add it to your favorites for quick access.
                  </Typography>
                </Box>
              )}
            </MotionBox>
          )}
        </Box>
        
        {/* Contact Support Section */}
        <Box 
          sx={{ 
            mt: 8, 
            p: { xs: 3, md: 5 }, 
            bgcolor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
            borderRadius: 4,
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}`
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Can't find what you're looking for?
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'text.secondary', mb: 3 }}>
                Our support team is ready to help you with any questions or issues you might have.
              </Typography>
              
              <Box component="form" onSubmit={handleContactSubmit}>
                <TextField
                  fullWidth
                  label="Your Email Address"
                  variant="outlined"
                  margin="normal"
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{color:isDark ? 'white' : 'black'}}/>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="How can we help you?"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mt: 1.5 }}>
                        <HelpOutline sx={{color:isDark ? 'white' : 'black'}}/>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Button 
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{ 
                    mt: 2,
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                  disabled={submitStatus === 'loading'}
                >
                  {submitStatus === 'loading' ? (
                    <>
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
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </Box>
            </Grid>
            
            {/* <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="/assets/customer-support.svg"
                alt="Customer Support"
                sx={{
                  width: '100%',
                  maxWidth: '400px',
                  display: 'block',
                  mx: 'auto',
                }}
              />
            </Grid> */}
          </Grid>
        </Box>
      </Container>
      
     
      
      {/* Success Snackbar */}
     
    </Box>
  );
};

export default SupportPage;
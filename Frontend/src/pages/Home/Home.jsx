import React, { useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box, Avatar, Rating } from '@mui/material';
import { Link } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Home = () => {
  // Add subtle scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      document.querySelectorAll('.fade-in').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <Box sx={{ 
      bgcolor: 'var(--background-color)', 
      color: 'var(--text-color)',
      minHeight: '100vh',
      pb: 10,
      overflow: 'hidden',
    }}>
      {/* Hero Section - Enhanced with better spacing and animation */}
      <Box sx={{ 
        py: { xs: 8, md: 14 }, 
        background: 'var(--background-gradient-light)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid item xs={12} md={6} className="fade-in" sx={{ 
              animation: 'fadeInLeft 1s ease-out',
              '@keyframes fadeInLeft': {
                '0%': { opacity: 0, transform: 'translateX(-20px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
              }
            }}>
              <Typography 
                variant="h1" 
                component="h1" 
                fontWeight="800"
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  letterSpacing: '-0.5px',
                }}
              >
                Welcome to <span style={{color: 'var(--theme-color)', position: 'relative'}}>
                  Code-Quest
                  <Box sx={{
                    position: 'absolute',
                    height: '8px',
                    width: '100%',
                    bottom: '5px',
                    left: 0,
                    backgroundColor: 'rgba(var(--theme-color-rgb), 0.15)',
                    zIndex: -1,
                    borderRadius: '4px'
                  }} />
                </span>
              </Typography>
              <Typography 
                variant="h5" 
                component="p" 
                sx={{ 
                  mb: 3, 
                  color: 'var(--p-color)',
                  fontWeight: 500,
                  lineHeight: 1.5
                }}
              >
                KITPS's Premier Online Assessment Platform for Coding Competitions
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 5, 
                  color: 'var(--p-color)',
                  fontSize: '1.1rem',
                  maxWidth: '90%',
                  lineHeight: 1.7
                }}
              >
                Designed to transform the way coding assessments are conducted at Kothiwal Institute of Technology & Professional Studies
              </Typography>
              <Box sx={{ '& > :not(style)': { mr: 3 }, mb: { xs: 4, md: 0 } }}>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: 'var(--theme-color)', 
                    '&:hover': { 
                      bgcolor: 'var(--hover-color)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 12px rgba(var(--theme-color-rgb), 0.3)'
                    },
                    px: 4,
                    py: 1.5,
                    borderRadius: '8px',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    textTransform: 'none',
                    fontSize: '1.05rem',
                  }}
                  component={Link} 
                  to="/register"
                  endIcon={<ArrowForwardIcon />}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outlined"
                  size="large"
                  sx={{ 
                    color: 'var(--theme-color)', 
                    borderColor: 'var(--theme-color)',
                    borderWidth: '2px',
                    '&:hover': { 
                      borderColor: 'var(--hover-color)', 
                      color: 'var(--hover-color)',
                      borderWidth: '2px',
                      bgcolor: 'rgba(var(--theme-color-rgb), 0.05)'
                    },
                    px: 4,
                    py: 1.4,
                    borderRadius: '8px',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    textTransform: 'none',
                    fontSize: '1.05rem',
                  }}
                  component={Link} 
                  to="/about"
                >
                  Learn More
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} className="fade-in" sx={{ 
              animation: 'fadeInRight 1s ease-out',
              '@keyframes fadeInRight': {
                '0%': { opacity: 0, transform: 'translateX(20px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
              }
            }}>
              <Box sx={{ 
                textAlign: 'center',
                p: 4,
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                borderRadius: '16px',
                bgcolor: 'var(--dashboard-bg)',
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(var(--theme-color-rgb), 0.05), transparent)',
                  borderRadius: '16px',
                }
              }}>
                <img 
                  src="/assets/code-competition-illustration.svg" 
                  alt="Code Quest Illustration" 
                  style={{ 
                    width: '100%', 
                    maxHeight: '450px',
                    objectFit: 'contain',
                    transform: 'scale(1.05)',
                    filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.1))'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Decorative shapes */}
        <Box sx={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(var(--theme-color-rgb), 0.15), rgba(var(--theme-color-rgb), 0.05))',
          filter: 'blur(40px)',
          zIndex: 0
        }} />
      </Box>
      
      {/* Features Section - Improved cards and spacing */}
      <Box sx={{ 
        py: { xs: 8, md: 12 }, 
        bgcolor: 'var(--dashboard-color)',
        position: 'relative',
      }} className="fade-in">
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              mb: { xs: 6, md: 8 },
              fontWeight: 700,
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            Key Features
            <Box sx={{
              position: 'absolute',
              height: '4px',
              width: '60px',
              bottom: '-12px',
              left: 'calc(50% - 30px)',
              backgroundColor: 'var(--theme-color)',
              borderRadius: '2px'
            }} />
          </Typography>
          
          <Grid container spacing={4}>
            {/* Feature 1 */}
            <Grid item xs={12} sm={6} md={3} className="fade-in">
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                bgcolor: 'var(--dashboard-bg)',
                transition: 'all 0.4s ease',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 15px 35px var(--background-shadow)'
                }
              }}>
                <CardContent sx={{ 
                  flexGrow: 1, 
                  textAlign: 'center',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(var(--theme-color-rgb), 0.1)', 
                    borderRadius: '50%', 
                    p: 2, 
                    mb: 3,
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CodeIcon sx={{ fontSize: 40, color: 'var(--theme-color)' }} />
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                    Coding Competitions
                  </Typography>
                  <Typography variant="body2" color="var(--p-color)" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Host and participate in real-time coding challenges with automatic evaluation
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Feature 2 */}
            <Grid item xs={12} sm={6} md={3} className="fade-in">
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                bgcolor: 'var(--dashboard-bg)',
                transition: 'all 0.4s ease',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 15px 35px var(--background-shadow)'
                }
              }}>
                <CardContent sx={{ 
                  flexGrow: 1, 
                  textAlign: 'center',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(var(--theme-color-rgb), 0.1)', 
                    borderRadius: '50%', 
                    p: 2, 
                    mb: 3,
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PeopleIcon sx={{ fontSize: 40, color: 'var(--theme-color)' }} />
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                    Role-Based Access
                  </Typography>
                  <Typography variant="body2" color="var(--p-color)" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Dedicated interfaces for students, teachers, and administrators
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Feature 3 */}
            <Grid item xs={12} sm={6} md={3} className="fade-in">
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                bgcolor: 'var(--dashboard-bg)',
                transition: 'all 0.4s ease',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 15px 35px var(--background-shadow)'
                }
              }}>
                <CardContent sx={{ 
                  flexGrow: 1, 
                  textAlign: 'center',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(var(--theme-color-rgb), 0.1)', 
                    borderRadius: '50%', 
                    p: 2, 
                    mb: 3,
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <AssessmentIcon sx={{ fontSize: 40, color: 'var(--theme-color)' }} />
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                    Assessment Metrics
                  </Typography>
                  <Typography variant="body2" color="var(--p-color)" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Detailed performance analytics and progress tracking
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Feature 4 */}
            <Grid item xs={12} sm={6} md={3} className="fade-in">
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                bgcolor: 'var(--dashboard-bg)',
                transition: 'all 0.4s ease',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 15px 35px var(--background-shadow)'
                }
              }}>
                <CardContent sx={{ 
                  flexGrow: 1, 
                  textAlign: 'center',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <Box sx={{ 
                    bgcolor: 'rgba(var(--theme-color-rgb), 0.1)', 
                    borderRadius: '50%', 
                    p: 2, 
                    mb: 3,
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <SchoolIcon sx={{ fontSize: 40, color: 'var(--theme-color)' }} />
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2 }}>
                    Learning Resources
                  </Typography>
                  <Typography variant="body2" color="var(--p-color)" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Access to practice problems and educational materials
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section - New section as mentioned in the comments */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'var(--background-color)' }} className="fade-in">
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              mb: { xs: 6, md: 8 },
              fontWeight: 700,
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            Testimonials
            <Box sx={{
              position: 'absolute',
              height: '4px',
              width: '60px',
              bottom: '-12px',
              left: 'calc(50% - 30px)',
              backgroundColor: 'var(--theme-color)',
              borderRadius: '2px'
            }} />
          </Typography>
          
          <Typography 
            variant="h6" 
            component="p" 
            align="center" 
            sx={{ 
              maxWidth: '800px', 
              mx: 'auto', 
              mb: 6,
              color: 'var(--p-color)'
            }}
          >
            See what our users are saying about their experience with Code-Quest
          </Typography>
          
          <Grid container spacing={4}>
            {/* Testimonial 1 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 4, 
                height: '100%',
                bgcolor: 'var(--dashboard-bg)',
                borderRadius: '12px',
                position: 'relative',
                '&::before': {
                  content: '"""',
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  fontSize: '5rem',
                  opacity: 0.1,
                  fontFamily: 'Georgia, serif',
                  color: 'var(--theme-color)'
                }
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1" sx={{ mb: 3, pt: 3, fontStyle: 'italic', color: 'var(--p-color)' }}>
                    "Code-Quest has completely transformed how we conduct coding assessments in our department. The platform is intuitive and the analytics provide valuable insights into student performance."
                  </Typography>
                  <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'var(--theme-color)', mr: 2 }}>DP</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">Dr. Patel</Typography>
                      <Typography variant="body2" color="var(--p-color)">Computer Science Professor</Typography>
                    </Box>
                  </Box>
                  <Rating value={5} readOnly sx={{ mt: 2 }} />
                </Box>
              </Card>
            </Grid>
            
            {/* Testimonial 2 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 4, 
                height: '100%',
                bgcolor: 'var(--dashboard-bg)',
                borderRadius: '12px',
                position: 'relative',
                '&::before': {
                  content: '"""',
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  fontSize: '5rem',
                  opacity: 0.1,
                  fontFamily: 'Georgia, serif',
                  color: 'var(--theme-color)'
                }
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1" sx={{ mb: 3, pt: 3, fontStyle: 'italic', color: 'var(--p-color)' }}>
                    "As a student, I love how Code-Quest lets me practice coding challenges and compare my solutions with peers. The instant feedback system has greatly improved my problem-solving skills."
                  </Typography>
                  <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'var(--theme-color)', mr: 2 }}>RS</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">Rahul Singh</Typography>
                      <Typography variant="body2" color="var(--p-color)">B.Tech Student</Typography>
                    </Box>
                  </Box>
                  <Rating value={4.5} precision={0.5} readOnly sx={{ mt: 2 }} />
                </Box>
              </Card>
            </Grid>
            
            {/* Testimonial 3 */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 4, 
                height: '100%',
                bgcolor: 'var(--dashboard-bg)',
                borderRadius: '12px',
                position: 'relative',
                '&::before': {
                  content: '"""',
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  fontSize: '5rem',
                  opacity: 0.1,
                  fontFamily: 'Georgia, serif',
                  color: 'var(--theme-color)'
                }
              }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body1" sx={{ mb: 3, pt: 3, fontStyle: 'italic', color: 'var(--p-color)' }}>
                    "The ease of organizing coding competitions through Code-Quest has made our tech events much more streamlined. The system is robust and the support team is always helpful."
                  </Typography>
                  <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'var(--theme-color)', mr: 2 }}>AG</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">Anjali Gupta</Typography>
                      <Typography variant="body2" color="var(--p-color)">Event Coordinator</Typography>
                    </Box>
                  </Box>
                  <Rating value={5} readOnly sx={{ mt: 2 }} />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section - Enhanced with better styling and button */}
      <Box sx={{ 
        py: { xs: 10, md: 14 },
        bgcolor: 'var(--theme-color)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }} className="fade-in">
        {/* Decorative elements */}
        <Box sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: -50,
          left: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          zIndex: 0
        }} />
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              textShadow: '0 2px 10px rgba(0,0,0,0.1)',
              mb: 3
            }}
          >
            Ready to enhance your coding journey?
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              mb: 5,
              opacity: 0.9,
              fontWeight: 400,
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            Join Code-Quest today and experience the future of coding assessments at KITPS
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              bgcolor: 'white', 
              color: 'var(--theme-color)',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
              },
              px: 6,
              py: 1.5,
              borderRadius: '30px',
              fontWeight: 600,
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
            }}
            component={Link} 
            to="/register"
            endIcon={<ArrowForwardIcon />}
          >
            Join Now
          </Button>
        </Container>
      </Box>

      {/* Add CSS for animation */}
      <style jsx>{`
        .fade-in {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .fade-in.show {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </Box>
  );
};

export default Home;
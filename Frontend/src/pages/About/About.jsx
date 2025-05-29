import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Paper, 
  Divider, 
  Card, 
  CardContent,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import { Link } from 'react-router-dom';

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  // Add scroll animation
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
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Hero Section - Enhanced with better visuals and positioning */}
      <Box 
        sx={{ 
          position: 'relative',
          py: { xs: 12, md: 18 }, 
          background: 'linear-gradient(135deg, rgba(var(--theme-color-rgb), 0.05) 0%, rgba(var(--theme-color-rgb), 0.15) 100%)',
          overflow: 'hidden'
        }}
      >
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(var(--theme-color-rgb), 0.2) 0%, rgba(0,0,0,0) 70%)',
            top: '-250px',
            right: '-100px',
            zIndex: 0,
          }} 
        />
        
        <Box 
          sx={{ 
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(var(--theme-color-rgb), 0.1) 0%, rgba(0,0,0,0) 70%)',
            bottom: '-150px',
            left: '-100px',
            zIndex: 0,
          }} 
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box 
            className="fade-in"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Box 
                sx={{
                  bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                  borderRadius: '50%',
                  p: 2,
                  display: 'inline-flex',
                  boxShadow: '0 8px 32px rgba(var(--theme-color-rgb), 0.2)',
                }}
              >
                <CodeIcon sx={{ fontSize: 40, color: 'var(--theme-color)' }} />
              </Box>
            </Box>
            
            <Typography 
              variant="h1" 
              component="h1" 
              fontWeight="800"
              align="center"
              sx={{ 
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                letterSpacing: '-0.5px',
                position: 'relative',
              }}
            >
              About <span style={{
                color: 'var(--theme-color)',
                position: 'relative',
                display: 'inline-block'
              }}>
                Code-Quest
                <Box 
                  sx={{
                    position: 'absolute',
                    bottom: '0px',
                    left: 0,
                    width: '100%',
                    height: '8px',
                    background: 'rgba(var(--theme-color-rgb), 0.2)',
                    borderRadius: '4px',
                    zIndex: -1,
                  }}
                />
              </span>
            </Typography>
            
            <Typography 
              variant="h5" 
              component="p" 
              align="center"
              sx={{ 
                mb: 5, 
                color: 'var(--p-color)', 
                maxWidth: '800px', 
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              A final year project developed to address the need for a comprehensive coding assessment platform at Kothiwal Institute of Technology & Professional Studies (KITPS)
            </Typography>
            
            <Button
              variant="contained"
              component={Link}
              to="/contact"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'var(--theme-color)', 
                px: 4,
                py: 1.5,
                borderRadius: '30px',
                fontWeight: 600,
                fontSize: '1.05rem',
                textTransform: 'none',
                boxShadow: '0 8px 20px rgba(var(--theme-color-rgb), 0.3)',
                '&:hover': {
                  bgcolor: 'var(--hover-color)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 25px rgba(var(--theme-color-rgb), 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Get in Touch
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Our Story - Enhanced with modern card design and visual elements */}
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 },
            position: 'relative'
          }}
          className="fade-in"
        >
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="overline" 
                component="div" 
                sx={{ 
                  color: 'var(--theme-color)', 
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  mb: 2 
                }}
              >
                OUR JOURNEY
              </Typography>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  position: 'relative'
                }}
              >
                Our Story
                <Box 
                  sx={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '0',
                    width: '80px',
                    height: '4px',
                    background: 'var(--theme-color)',
                    borderRadius: '2px'
                  }}
                />
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    color: 'var(--p-color)',
                    fontSize: '1.1rem',
                    lineHeight: 1.7,
                    mb: 3
                  }}
                >
                  Code-Quest was born out of a clear need identified at KITPS - the lack of a dedicated software system for conducting coding competitions and assessments. As final year students, we observed the challenges faced by faculty and students in organizing and participating in coding events.
                </Typography>
                
                <List>
                  { [
                    'Streamlined coding assessment process',
                    'Enhanced student engagement in technical education',
                    'Created role-based access for different users',
                    'Developed a platform tailored for KITPS needs'
                  ].map((item, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleOutlineIcon sx={{ color: 'var(--theme-color)' }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={item} 
                        primaryTypographyProps={{ 
                          sx: { color: 'var(--text-color)', fontWeight: 500 } 
                        }}
                      />
                    </ListItem>
                  )) }
                </List>
              </Box>
              
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  color: 'var(--p-color)',
                  fontSize: '1.1rem',
                  lineHeight: 1.7
                }}
              >
                Under the guidance of our principal, Dr. Atul Rai, we set out to create a solution that would not only serve the immediate needs of our institution but also stand as a testament to the practical application of our learning journey at KITPS.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card 
                elevation={0} 
                sx={{ 
                  bgcolor: 'transparent',
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'visible'
                }}
              >
                <Box 
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    border: '2px solid rgba(var(--theme-color-rgb), 0.2)',
                    borderRadius: 4,
                    top: 20,
                    left: 20,
                    zIndex: 0
                  }}
                />
                <Box 
                  sx={{ 
                    overflow: 'hidden',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <img 
                    src="/assets/kitps-campus.jpg" 
                    alt="KITPS Campus" 
                    style={{ 
                      width: '100%', 
                      height: '450px', 
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
        
        {/* Custom divider */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: { xs: 3, md: 6 }
          }}
        >
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(var(--theme-color-rgb), 0.1)' }} />
          <Box 
            sx={{
              mx: 4,
              p: 1.5,
              borderRadius: '50%',
              bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CodeIcon sx={{ color: 'var(--theme-color)', fontSize: 24 }} />
          </Box>
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(var(--theme-color-rgb), 0.1)' }} />
        </Box>
        
        {/* Mission and Vision - Redesigned with cards and better layout */}
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 },
            position: 'relative'
          }}
          className="fade-in"
        >
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}
              >
                {/* Mission Card */}
                <Card 
                  elevation={0}
                  sx={{ 
                    bgcolor: 'var(--dashboard-bg)',
                    borderRadius: '16px',
                    p: 4,
                    border: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 30px var(--background-shadow)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                          borderRadius: '12px',
                          p: 1.2,
                          mr: 2,
                          display: 'flex'
                        }}
                      >
                        <CodeIcon sx={{ color: 'var(--theme-color)', fontSize: 24 }} />
                      </Box>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 700,
                          color: 'var(--theme-color)'
                        }}
                      >
                        Our Mission
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'var(--p-color)',
                        fontSize: '1.05rem',
                        lineHeight: 1.7
                      }}
                    >
                      To provide KITPS with a robust, user-friendly platform that streamlines the process of conducting coding assessments and competitions, fostering a culture of technical excellence and healthy competition among students.
                    </Typography>
                  </CardContent>
                </Card>
                
                {/* Vision Card */}
                <Card 
                  elevation={0}
                  sx={{ 
                    bgcolor: 'var(--dashboard-bg)',
                    borderRadius: '16px',
                    p: 4, 
                    border: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 15px 30px var(--background-shadow)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                          borderRadius: '12px',
                          p: 1.2,
                          mr: 2,
                          display: 'flex'
                        }}
                      >
                        <LightbulbIcon sx={{ color: 'var(--theme-color)', fontSize: 24 }} />
                      </Box>
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        sx={{ 
                          fontWeight: 700,
                          color: 'var(--theme-color)'
                        }}
                      >
                        Our Vision
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'var(--p-color)',
                        fontSize: '1.05rem',
                        lineHeight: 1.7
                      }}
                    >
                      To establish Code-Quest as an indispensable educational tool at KITPS that enhances the learning experience, provides valuable insights to educators, and prepares students for real-world coding challenges.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Typography 
                variant="overline" 
                component="div" 
                sx={{ 
                  color: 'var(--theme-color)', 
                  fontWeight: 600,
                  letterSpacing: 1.5,
                  mb: 2 
                }}
              >
                OUR PURPOSE
              </Typography>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  position: 'relative'
                }}
              >
                Mission & Vision
                <Box 
                  sx={{
                    position: 'absolute',
                    bottom: '-8px',
                    left: '0',
                    width: '80px',
                    height: '4px',
                    background: 'var(--theme-color)',
                    borderRadius: '2px'
                  }}
                />
              </Typography>
              
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  color: 'var(--p-color)',
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  mb: 4
                }}
              >
                At Code-Quest, we're driven by a clear purpose: to revolutionize how coding education and assessment are conducted at KITPS. Our mission and vision statements reflect our commitment to creating lasting value for students and educators alike.
              </Typography>
              
              <Box 
                sx={{ 
                  mt: 4, 
                  mb: { xs: 4, md: 0 },
                  display: { xs: 'flex', md: 'block' },
                  flexDirection: 'column',
                  alignItems: { xs: 'center', md: 'flex-start' }
                }}
              >
                <Box
                  component="img"
                  src="/assets/coding-mission.jpg"
                  alt="Our Mission and Vision"
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                    transform: { md: 'rotate(3deg)' },
                    transition: 'transform 0.5s ease',
                    '&:hover': {
                      transform: { md: 'rotate(0deg) scale(1.02)' }
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Custom divider */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: { xs: 3, md: 6 }
          }}
        >
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(var(--theme-color-rgb), 0.1)' }} />
          <Box 
            sx={{
              mx: 4,
              p: 1.5,
              borderRadius: '50%',
              bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CodeIcon sx={{ color: 'var(--theme-color)', fontSize: 24 }} />
          </Box>
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(var(--theme-color-rgb), 0.1)' }} />
        </Box>
        
        {/* Core Values - Enhanced with modern card design */}
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 },
            position: 'relative'
          }}
          className="fade-in"
        >
          <Typography 
            variant="overline" 
            component="div" 
            sx={{ 
              color: 'var(--theme-color)', 
              fontWeight: 600,
              letterSpacing: 1.5,
              mb: 2,
              textAlign: 'center'
            }}
          >
            WHAT WE STAND FOR
          </Typography>
          <Typography 
            variant="h3" 
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
            Our Core Values
            <Box 
              sx={{
                position: 'absolute',
                bottom: '-12px',
                left: 'calc(50% - 40px)',
                width: '80px',
                height: '4px',
                background: 'var(--theme-color)',
                borderRadius: '2px'
              }}
            />
          </Typography>
          
          <Grid container spacing={4}>
            { [
              {
                icon: <SchoolIcon sx={{ fontSize: 40, color: 'var(--theme-color)' }} />,
                title: "Educational Excellence",
                description: "Committed to enhancing the learning experience through practical application of coding skills and continuous improvement of educational methodologies."
              },
              {
                icon: <PeopleIcon sx={{ fontSize: 40, color: 'var(--theme-color)' }} />,
                title: "Inclusivity",
                description: "Designed with all users in mind - students, teachers, and administrators - ensuring a seamless experience for everyone regardless of their technical expertise."
              },
              {
                icon: <LightbulbIcon sx={{ fontSize: 40, color: 'var(--theme-color)' }} />,
                title: "Innovation",
                description: "Continuously evolving to incorporate new technologies and methodologies in coding education, staying ahead of industry trends."
              },
              {
                icon: <BuildIcon sx={{ fontSize: 40, color: 'var(--theme-color)' }} />,
                title: "Quality",
                description: "Built with high standards to ensure reliability, security, and a premium user experience through rigorous testing and attention to detail."
              }
            ].map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  elevation={0}
                  sx={{ 
                    height: '100%',
                    bgcolor: 'var(--dashboard-bg)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    border: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
                    },
                    position: 'relative'
                  }}
                >
                  <Box 
                    sx={{ 
                      height: '6px', 
                      bgcolor: 'var(--theme-color)',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0
                    }} 
                  />
                  <CardContent sx={{ p: 4, height: '100%' }}>
                    <Box 
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        p: 2,
                        bgcolor: 'rgba(var(--theme-color-rgb), 0.08)',
                        borderRadius: '16px',
                        width: '80px',
                        height: '80px'
                      }}
                    >
                      {value.icon}
                    </Box>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      gutterBottom
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      {value.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'var(--p-color)',
                        lineHeight: 1.7,
                        fontSize: '0.95rem'
                      }}
                    >
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )) }
          </Grid>
        </Box>
        
        {/* Custom divider */}
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            my: { xs: 3, md: 6 }
          }}
        >
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(var(--theme-color-rgb), 0.1)' }} />
          <Box 
            sx={{
              mx: 4,
              p: 1.5,
              borderRadius: '50%',
              bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CodeIcon sx={{ color: 'var(--theme-color)', fontSize: 24 }} />
          </Box>
          <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(var(--theme-color-rgb), 0.1)' }} />
        </Box>
        
        {/* Team Section - Enhanced with modern card design */}
        <Box 
          sx={{ 
            py: { xs: 8, md: 12 },
            position: 'relative'
          }}
          className="fade-in"
        >
          <Typography 
            variant="overline" 
            component="div" 
            sx={{ 
              color: 'var(--theme-color)', 
              fontWeight: 600,
              letterSpacing: 1.5,
              mb: 2,
              textAlign: 'center'
            }}
          >
            OUR LEADERSHIP
          </Typography>
          <Typography 
            variant="h3" 
            component="h2" 
            align="center"
            gutterBottom
            sx={{ 
              mb: 3,
              fontWeight: 700,
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            The Team Behind Code-Quest
            <Box 
              sx={{
                position: 'absolute',
                bottom: '-12px',
                left: 'calc(50% - 40px)',
                width: '80px',
                height: '4px',
                background: 'var(--theme-color)',
                borderRadius: '2px'
              }}
            />
          </Typography>
          <Typography 
            variant="body1" 
            align="center"
            sx={{ 
              mb: { xs: 6, md: 8 }, 
              color: 'var(--p-color)', 
              maxWidth: '700px', 
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.7
            }}
          >
            Code-Quest was developed as a final year project under the guidance of Dr. Atul Rai, Principal of KITPS
          </Typography>
          
          <Grid container spacing={6} justifyContent="center">
            <Grid item xs={12} md={8} lg={6}>
              <Card 
                elevation={0}
                sx={{ 
                  bgcolor: 'var(--dashboard-bg)',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <Grid container>
                  <Grid item xs={12} md={5}>
                    <Box 
                      sx={{ 
                        height: { xs: '250px', md: '100%' },
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <Box 
                        component="img"
                        src="/assets/team/dr-atul-rai.jpg" 
                        alt="Dr. Atul Rai"
                        sx={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          transition: 'transform 0.6s ease',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <CardContent sx={{ p: 4 }}>
                      <Typography 
                        variant="h4" 
                        component="h3" 
                        gutterBottom
                        sx={{ fontWeight: 700 }}
                      >
                        Dr. Atul Rai
                      </Typography>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          color: 'var(--theme-color)', 
                          mb: 3, 
                          fontWeight: 600,
                          fontSize: '1.1rem'
                        }}
                      >
                        Project Guide & Principal, KITPS
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'var(--p-color)', 
                          mb: 3,
                          lineHeight: 1.7
                        }}
                      >
                        Under Dr. Rai's visionary leadership, Code-Quest has transformed from a concept to a fully-functional platform that addresses a critical need at our institution. His expertise in educational technology and commitment to student success have been instrumental in shaping this project.
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{
                          color: 'var(--theme-color)',
                          borderColor: 'var(--theme-color)',
                          borderRadius: '8px',
                          px: 3,
                          py: 1,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            borderColor: 'var(--hover-color)',
                            bgcolor: 'rgba(var(--theme-color-rgb), 0.05)'
                          }
                        }}
                        component={Link}
                        to="/contact"
                      >
                        Contact
                      </Button>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>

          <Box 
            sx={{ 
              textAlign: 'center', 
              mt: { xs: 6, md: 10 },
            }}
          >
            <Button
              variant="contained"
              component={Link}
              to="/contact"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: 'var(--theme-color)', 
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1.05rem',
                textTransform: 'none',
                boxShadow: '0 8px 20px rgba(var(--theme-color-rgb), 0.3)',
                '&:hover': {
                  bgcolor: 'var(--hover-color)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 25px rgba(var(--theme-color-rgb), 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Join Our Community
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Add CSS for animations */}
      <style jsx global>{`
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

export default About;
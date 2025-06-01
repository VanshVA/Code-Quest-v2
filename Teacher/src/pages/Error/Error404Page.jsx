import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack,
  Home,
  Search,
  AccessTime,
  Verified,
  ErrorOutline,
  Send,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Current date and user info - updated as requested with your exact format
const CURRENT_DATE_TIME = "2025-05-30 08:50:33";
const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const Error404Page = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Animation for the glitch effect
  const [glitchInterval, setGlitchInterval] = useState(null);
  const [glitchActive, setGlitchActive] = useState(false);
  
  // Start countdown when returning home
  const [countdown, setCountdown] = useState(null);
  
  // Popular search suggestions
  const popularSearches = [
    'Coding challenges', 
    'Python tutorials',
    'React components',
    'Data structures',
    'Algorithm practice'
  ];
  
  // Premium Animation Background with YOUR color palette (reds)
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Create premium animation elements class - using your red theme colors
    class ErrorElement {
      constructor() {
        this.reset();
      }
      
      reset() {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * (isMobile ? 80 : 160) + 20;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.opacity = Math.random() * 0.12 + 0.03;
        
        // YOUR color palette - red theme
        const colorSets = [
          { start: '#bc4037', end: '#f47061' }, // Primary red
          { start: '#9a342d', end: '#bd5c55' }, // Dark red
          { start: '#d54c3f', end: '#f88379' }, // Light red
        ];
        
        this.colors = colorSets[Math.floor(Math.random() * colorSets.length)];
        
        this.glitchDelay = Math.random() * 3000;
        this.glitchDuration = Math.random() * 200 + 100;
        this.lastGlitchTime = -9999;
        this.isGlitching = false;
      }
      
      update(time, isGlobalGlitching) {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        // Decide if we should start glitching
        if (!this.isGlitching && 
            (isGlobalGlitching || time - this.lastGlitchTime > this.glitchDelay)) {
          this.isGlitching = true;
          this.lastGlitchTime = time;
          
          // Randomize position during glitch
          if (isGlobalGlitching) {
            this.x += (Math.random() - 0.5) * 50;
            this.y += (Math.random() - 0.5) * 50;
          }
        }
        
        // Stop glitching after duration
        if (this.isGlitching && time - this.lastGlitchTime > this.glitchDuration) {
          this.isGlitching = false;
          this.glitchDelay = Math.random() * 3000 + 500;
        }
        
        // Movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Wrap around screen
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
      }
      
      draw(ctx) {
        if (this.isGlitching) {
          // Draw glitching version - digital artifact effect
          const glitchOffsetX = (Math.random() - 0.5) * 15;
          const glitchOffsetY = (Math.random() - 0.5) * 15;
          
          // Create gradient for glitch effect
          const gradient = ctx.createRadialGradient(
            this.x + glitchOffsetX, this.y + glitchOffsetY, 0,
            this.x + glitchOffsetX, this.y + glitchOffsetY, this.size
          );
          
          gradient.addColorStop(0, this.hexToRgba(this.colors.start, this.opacity * 2));
          gradient.addColorStop(0.6, this.hexToRgba(this.colors.start, this.opacity));
          gradient.addColorStop(1, this.hexToRgba(this.colors.end, 0));
          
          ctx.beginPath();
          ctx.arc(this.x + glitchOffsetX, this.y + glitchOffsetY, this.size, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Add smaller glitch artifacts
          for (let i = 0; i < 3; i++) {
            const artifactSize = Math.random() * this.size / 3;
            const artifactX = this.x + Math.random() * this.size - artifactSize/2;
            const artifactY = this.y + Math.random() * this.size - artifactSize/2;
            
            ctx.beginPath();
            ctx.arc(artifactX, artifactY, artifactSize, 0, Math.PI * 2);
            ctx.fillStyle = this.hexToRgba(this.colors.start, this.opacity * 1.5);
            ctx.fill();
          }
        } else {
          // Draw normal gradient orb
          const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
          );
          
          gradient.addColorStop(0, this.hexToRgba(this.colors.start, this.opacity));
          gradient.addColorStop(0.6, this.hexToRgba(this.colors.start, this.opacity * 0.5));
          gradient.addColorStop(1, this.hexToRgba(this.colors.end, 0));
          
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }
      
      hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }
    
    // Create optimal number of elements
    const elementCount = isMobile ? 20 : 30;
    const elements = Array(elementCount).fill().map(() => new ErrorElement());
    
    // Animation loop with time parameter
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      elements.forEach(element => {
        element.update(elapsedTime, glitchActive);
        element.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate(startTime);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isMobile, isDark, glitchActive]);
  
  // Setup glitch interval when component mounts
  useEffect(() => {
    // Random glitch intervals
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), Math.random() * 200 + 50);
    };
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of glitch
        triggerGlitch();
      }
    }, 2000);
    
    setGlitchInterval(interval);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle go home
  const handleGoHome = () => {
    setCountdown(3);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Canvas Background for Premium Gradient Animation - using YOUR red theme */}
      <Box 
        sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      >
        <canvas 
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: isDark ? 'rgba(10, 10, 15, 0.9)' : 'rgba(246, 246, 250, 0.9)',
            backdropFilter: 'blur(20px)',
          }} 
        />
      </Box>
      
      
      
      {/* Main Content */}
      <Container 
        component={MotionBox}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        maxWidth="lg" 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          {/* Error Illustration */}
          <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.3,
                type: "spring", 
                stiffness: 100 
              }}
              sx={{ 
                position: 'relative',
                mx: 'auto',
                maxWidth: 450,
              }}
            >
              <ErrorOutline 
                component={motion.svg}
                animate={glitchActive ? {
                  x: [0, -5, 5, -3, 0],
                  y: [0, 3, -3, 2, 0],
                } : {}}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                sx={{ 
                  fontSize: { xs: '200px', md: '260px' },
                  color: theme.palette.primary.main,
                  opacity: 0.8,
                }}
              />
              
              <MotionTypography
                variant="h1"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontWeight: 900,
                  fontSize: { xs: '6rem', md: '8rem' },
                  color: isDark ? 'white' : 'text.primary',
                  textShadow: glitchActive ? 
                    `3px 3px 0 ${isDark ? '#f47061' : '#bc4037'}, -3px -3px 0 ${isDark ? '#9a342d' : '#d95a4e'}` : 
                    'none',
                  transition: 'text-shadow 0.2s ease',
                }}
                animate={glitchActive ? {
                  x: [0, -2, 2, 0],
                  textShadow: [
                    `3px 3px 0 ${isDark ? '#f47061' : '#bc4037'}, -3px -3px 0 ${isDark ? '#9a342d' : '#d95a4e'}`,
                    `0px -2px 0 ${isDark ? '#f47061' : '#bc4037'}, 2px 2px 0 ${isDark ? '#9a342d' : '#d95a4e'}`,
                    `1px -1px 0 ${isDark ? '#f47061' : '#bc4037'}, -3px 1px 0 ${isDark ? '#9a342d' : '#d95a4e'}`
                  ]
                } : {}}
                transition={{ duration: 0.1, ease: "easeInOut" }}
              >
                404
              </MotionTypography>
            </MotionBox>
          </Grid>
          
          {/* Error Content */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: '24px',
                backgroundColor: isDark ? 'rgba(18, 18, 25, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'}`,
                boxShadow: isDark ? 
                  '0 25px 50px rgba(0,0,0,0.3)' : 
                  '0 25px 50px rgba(0,0,0,0.06)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #bc4037, #f47061)',
                },
              }}
            >
              <MotionTypography
                variant="h3"
                sx={{ 
                  fontWeight: 800,
                  mb: 2,
                  color: theme.palette.primary.main,
                  position: 'relative',
                  display: 'inline-block',
                }}
                animate={glitchActive ? {
                  x: [0, -3, 3, 0],
                } : {}}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                Page Not Found
              </MotionTypography>
              
              <Typography
                variant="h6"
                sx={{ 
                  fontWeight: 400,
                  mb: 4,
                  color: 'text.secondary',
                  lineHeight: 1.6,
                }}
              >
                Oops! We couldn't find the page you were looking for. It might have been moved, deleted, or maybe never existed in the first place.
              </Typography>
              
              <Stack direction="column" spacing={3}>
                <Button
                  variant="contained"
                  startIcon={<Home />}
                  onClick={handleGoHome}
                  size="large"
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    px: 4,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: theme.palette.gradients.primary,
                    boxShadow: '0 10px 20px rgba(188, 64, 55, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transition: 'all 0.6s ease',
                    },
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 15px 30px rgba(188, 64, 55, 0.3)',
                      '&::after': {
                        left: '100%',
                      }
                    }
                  }}
                >
                  {countdown !== null ? `Redirecting in ${countdown}...` : 'Return to Homepage'}
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate(-1)}
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: 'rgba(188, 64, 55, 0.05)',
                    }
                  }}
                >
                  Go Back
                </Button>
              </Stack>
              
              {/* Popular searches */}
              <Box sx={{ mt: 5 }}>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Search sx={{ fontSize: '1.2rem', mr: 1 }} /> 
                  Popular searches
                </Typography>
                
                <Stack 
                  direction="row" 
                  spacing={1.5}
                  sx={{ 
                    flexWrap: 'wrap',
                    gap: 1.5,
                  }}
                >
                  {popularSearches.map((item, index) => (
                    <Chip
                      key={index}
                      component={motion.div}
                      whileHover={{ y: -3, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                      label={item}
                      clickable
                      variant={isDark ? "outlined" : "filled"}
                      sx={{
                        borderRadius: '50px',
                        fontWeight: 500,
                        py: 2,
                        backgroundColor: isDark ? 'rgba(188, 64, 55, 0.1)' : 'rgba(188, 64, 55, 0.06)',
                        color: theme.palette.primary.main,
                        borderColor: isDark ? 'rgba(188, 64, 55, 0.3)' : 'transparent',
                        mb: 1,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Footer */}
      <Box 
        component="footer"
        sx={{ 
          py: 3, 
          textAlign: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '20%',
            right: '20%',
            height: '1px',
            background: isDark 
              ? 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)' 
              : 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0) 100%)',
          }
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Code-Quest. All rights reserved.
          </Typography>
          <Stack 
            direction="row" 
            spacing={3}
            justifyContent="center"
            sx={{ mt: 1 }}
          >
            <Link 
              component={RouterLink} 
              to="/help"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Help Center
            </Link>
            <Link 
              component={RouterLink} 
              to="/support"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Support
            </Link>
            <Link 
              component={RouterLink} 
              to="/contact"
              variant="body2"
              color="text.secondary"
              underline="hover"
            >
              Contact
            </Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Error404Page;
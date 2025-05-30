import React, { useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
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
  CheckCircle,
  ChevronRight,
  Download,
  Home,
  NavigateNext,
  Verified,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
// import Navbar from '../components/common/Navbar';
// import Footer from '../components/common/Footer';

// Current date and user info from global state
const CURRENT_DATE_TIME = "2025-05-30 03:33:29";
const CURRENT_USER = "Anuj-prajapati-SDE";
const LAST_UPDATED = "February 15, 2025";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const TermsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Canvas animation for background
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight * 2;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Premium gradient orbs class with improved rendering
    class GradientOrb {
      constructor() {
        this.reset();
      }
      
      reset() {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * (isMobile ? 100 : 180) + (isMobile ? 30 : 50);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.12 + 0.04;
        
        // Premium color combinations
        const colorSets = [
          { start: '#bc4037', end: '#f47061' }, // Primary red
          { start: '#9a342d', end: '#bd5c55' }, // Dark red
          { start: '#2C3E50', end: '#4A6572' }, // Dark blue
          { start: '#3a47d5', end: '#00d2ff' }, // Blue
        ];
        
        this.colors = colorSets[Math.floor(Math.random() * colorSets.length)];
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        // Bounce effect at edges
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
      }
      
      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        const startColor = this.hexToRgba(this.colors.start, this.opacity);
        const endColor = this.hexToRgba(this.colors.end, 0);
        
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }
    
    // Create optimal number of orbs based on screen size
    const orbCount = isMobile ? 6 : 10;
    const orbs = Array(orbCount).fill().map(() => new GradientOrb());
    
    // Animation loop with performance optimization
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      orbs.forEach((orb) => {
        orb.update();
        orb.draw();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isMobile, isDark]);

  // Terms of Service sections
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: `
        Welcome to Code-Quest, an educational coding platform designed to help users improve their programming skills through interactive challenges, assessments, and competitions.
        
        These Terms and Conditions govern your use of the Code-Quest website and services located at www.code-quest.com (collectively referred to as the "Service").
        
        By accessing or using Code-Quest, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the Service.
      `
    },
    {
      id: "definitions",
      title: "Definitions",
      content: `
        "User," "You," and "Your" refers to you, the person accessing and using the Service.
        
        "Code-Quest," "Company," "We," "Us," and "Our" refers to Code-Quest, Inc.
        
        "Content" refers to code, text, information, graphics, images, and any other materials uploaded, downloaded, or appearing on the Service.
        
        "Subscription" refers to the payment plans offered by Code-Quest that provide access to premium features.
      `
    },
    {
      id: "account",
      title: "User Accounts",
      content: `
        To access certain features of the Service, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself.
        
        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
        
        We reserve the right to suspend or terminate accounts that violate these Terms and Conditions or for any other reason at our sole discretion.
        
        Users must be at least 13 years of age to create an account. Users under the age of 18 must have permission from a parent or legal guardian to use the Service.
      `
    },
    {
      id: "subscription",
      title: "Subscriptions and Payments",
      content: `
        Code-Quest offers free and paid subscription plans. By selecting a paid subscription, you agree to pay the applicable fees as they become due.
        
        All payments are processed through secure third-party payment processors. We do not store your full credit card information on our servers.
        
        Subscription fees are billed in advance on a recurring basis, depending on the billing cycle you select (monthly or annually). You can cancel your subscription at any time, but we do not provide refunds for partial or unused subscription periods.
        
        We reserve the right to change subscription fees upon reasonable notice. Any changes will be communicated to you and will apply to billing cycles starting after the notice.
      `
    },
    {
      id: "content",
      title: "User Content and Code",
      content: `
        You retain ownership of any Content you submit, post, or display on or through the Service. By submitting Content, you grant Code-Quest a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such Content for the purposes of providing and improving the Service.
        
        For code submitted as part of challenges or assessments, you understand that similar solutions may exist or be created by other users independently. Coincidental similarities between your code and that of other users does not constitute copyright infringement.
        
        You are solely responsible for your Content and the consequences of posting it. You represent and warrant that you own or have the necessary rights to the Content you submit and that its submission does not violate any third party's intellectual property or other rights.
        
        We reserve the right to remove any Content that violates these Terms or that we find objectionable for any reason, without prior notice.
      `
    },
    {
      id: "conduct",
      title: "Prohibited Conduct",
      content: `
        You agree not to engage in any of the following prohibited activities:
        
        • Copying, distributing, or disclosing any part of the Service in any medium
        • Using any automated system, such as "robots," to access the Service
        • Attempting to interfere with the proper functioning of the Service
        • Bypassing measures we may use to prevent or restrict access to the Service
        • Using the Service to send unsolicited communications
        • Attempting to access areas of the Service that you are not authorized to access
        • Using the Service for any illegal purpose or in violation of any local, state, national, or international law
        • Sharing solutions to active challenges or competitions
        • Engaging in any harassment, bullying, or other inappropriate behavior toward other users
        
        Violation of these prohibitions may result in termination of your access to the Service.
      `
    },
    {
      id: "intellectual",
      title: "Intellectual Property",
      content: `
        The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Code-Quest and its licensors.
        
        The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Code-Quest.
        
        Educational materials, challenge descriptions, and other instructional content provided as part of the Service are licensed to users solely for personal, non-commercial use during the subscription period.
      `
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      content: `
        Your use of Code-Quest is also governed by our Privacy Policy, which can be found at www.code-quest.com/privacy. By using the Service, you consent to the terms of our Privacy Policy.
        
        The Privacy Policy explains how we collect, use, and disclose information that pertains to your privacy, including personal information gathered when you use our Service.
      `
    },
    {
      id: "disclaimer",
      title: "Disclaimer of Warranties",
      content: `
        The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Code-Quest and its suppliers expressly disclaim all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, title, and non-infringement.
        
        Code-Quest makes no warranty that:
        
        • The Service will meet your requirements
        • The Service will be uninterrupted, timely, secure, or error-free
        • The results that may be obtained from the use of the Service will be accurate or reliable
        • The quality of any products, services, information, or other material purchased or obtained by you through the Service will meet your expectations
      `
    },
    {
      id: "limitation",
      title: "Limitation of Liability",
      content: `
        In no event shall Code-Quest, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        
        • Your access to or use of or inability to access or use the Service
        • Any conduct or content of any third party on the Service
        • Any content obtained from the Service
        • Unauthorized access, use, or alteration of your transmissions or content
        
        This limitation applies whether based in contract, tort (including negligence), strict liability or otherwise, and even if Code-Quest has been advised of the possibility of such damages.
      `
    },
    {
      id: "changes",
      title: "Changes to Terms",
      content: `
        We reserve the right to modify or replace these Terms at any time at our sole discretion. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        
        By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
      `
    },
    {
      id: "termination",
      title: "Termination",
      content: `
        We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
        
        If you wish to terminate your account, you may simply discontinue using the Service or contact our support team for account deletion.
        
        All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
      `
    },
    {
      id: "governing",
      title: "Governing Law",
      content: `
        These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
        
        Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
      `
    },
    {
      id: "contact",
      title: "Contact Information",
      content: `
        If you have any questions about these Terms, please contact us at:
        
        Code-Quest, Inc.
        123 Tech Park, Electronic City Phase 1
        Bangalore, 560100, India
        legal@code-quest.com
        +91 80 4567 8901
      `
    }
  ];

  return (
    <>
  
      
      {/* Canvas Background for Premium Gradient Animation */}
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
      }}>
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
        {/* Overlay for better text contrast */}
        <Box 
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: isDark ? 'rgba(30, 28, 28, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(30px)',
          }} 
        />
      </Box>
      
      {/* Hero Section */}
      <Box 
        component="section" 
        sx={{ 
          position: 'relative',
          pt: { xs: '100px', sm: '120px', md: '140px' },
          pb: { xs: '40px', sm: '60px', md: '80px' },
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          {/* Current Time Display */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              position: 'absolute',
              top: { xs: 65, sm: 80, md: 100 },
              right: { xs: '50%', md: 24 },
              transform: { xs: 'translateX(50%)', md: 'none' },
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              px: 2.5,
              py: 1,
              borderRadius: '100px',
              backdropFilter: 'blur(10px)',
              backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              variant="body2" 
              sx={{
                fontFamily: 'monospace',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                color: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)',
              }}
            >
              UTC: {CURRENT_DATE_TIME}
              <Box 
                component="span"
                sx={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.success.main,
                  ml: 1.5,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.6, transform: 'scale(0.9)' },
                    '50%': { opacity: 1, transform: 'scale(1.1)' },
                    '100%': { opacity: 0.6, transform: 'scale(0.9)' },
                  },
                }}
              />
            </Typography>
          </MotionBox>
          
          {/* User Badge */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            sx={{
              position: 'absolute',
              top: { xs: 110, sm: 80, md: 100 },
              left: { xs: '50%', md: 24 },
              transform: { xs: 'translateX(-50%)', md: 'none' },
              zIndex: 10,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              px: 2.5,
              py: 1,
              borderRadius: '100px',
              backdropFilter: 'blur(10px)',
              backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Avatar
              alt={CURRENT_USER}
              src="/assets/images/avatar.jpg"
              sx={{ 
                width: 32, 
                height: 32, 
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: '0 4px 8px rgba(188, 64, 55, 0.2)',
                mr: 1.5
              }}
            />
            <Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  color: isDark ? 'white' : 'text.primary',
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {CURRENT_USER}
                <Verified 
                  sx={{ 
                    fontSize: '0.9rem', 
                    color: theme.palette.primary.main,
                    ml: 0.7,
                  }} 
                />
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: isDark ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Box 
                  sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%',
                    bgcolor: theme.palette.success.main,
                    mr: 0.8,
                    display: 'inline-block',
                  }}
                />
                Premium Member
              </Typography>
            </Box>
          </MotionBox>
          
          {/* Breadcrumbs */}
          <Breadcrumbs 
            separator={<NavigateNext fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mb: 4 }}
          >
            <Link 
              component={RouterLink} 
              to="/"
              underline="hover"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: 'text.secondary',
              }}
            >
              <Home sx={{ mr: 0.5, fontSize: '1.1rem' }} />
              Home
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
              Terms & Conditions
            </Typography>
          </Breadcrumbs>
          
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
              mb: { xs: 2, md: 3 },
              letterSpacing: '-0.02em',
            }}
          >
            Terms and Conditions
          </MotionTypography>
          
          {/* Last Updated */}
          <MotionTypography
            variant="subtitle1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            color="text.secondary"
            gutterBottom
            sx={{ 
              mb: 5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <CheckCircle 
              sx={{ 
                mr: 1, 
                color: theme.palette.success.main,
                fontSize: '1.1rem',
              }} 
            />
            Last updated: {LAST_UPDATED}
          </MotionTypography>
        </Container>
      </Box>
      
      {/* Terms Content */}
      <Box 
        component="section"
        sx={{ 
          pb: { xs: 10, md: 15 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Table of Contents Sidebar */}
            <Grid item xs={12} md={3}>
              <MotionBox
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ 
                  position: { xs: 'static', md: 'sticky' },
                  top: 120,
                }}
              >
                <Paper
                  sx={{ 
                    p: 3, 
                    borderRadius: '24px',
                    backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                    boxShadow: isDark ? '0 15px 35px rgba(0, 0, 0, 0.2)' : '0 15px 35px rgba(0, 0, 0, 0.05)',
                    mb: { xs: 3, md: 0 },
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 700,
                      mb: 3,
                    }}
                  >
                    Table of Contents
                  </Typography>
                  
                  <Stack spacing={1}>
                    {sections.map((section, index) => (
                      <Button
                        key={index}
                        component="a"
                        href={`#${section.id}`}
                        variant="text"
                        color="inherit"
                        sx={{
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          px: 1,
                          py: 0.7,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                            color: theme.palette.primary.main,
                          },
                        }}
                        endIcon={<ChevronRight fontSize="small" />}
                      >
                        {section.title}
                      </Button>
                    ))}
                  </Stack>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<Download />}
                    sx={{
                      borderRadius: '8px',
                      py: 1,
                      background: theme.palette.gradients.primary,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Download PDF
                  </Button>
                </Paper>
              </MotionBox>
            </Grid>
            
            {/* Main Content */}
            <Grid item xs={12} md={9}>
              <MotionPaper
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ 
                  p: { xs: 3, md: 5 }, 
                  borderRadius: '24px',
                  backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                  boxShadow: isDark ? '0 15px 35px rgba(0, 0, 0, 0.2)' : '0 15px 35px rgba(0, 0, 0, 0.05)',
                }}
              >
                {sections.map((section, index) => (
                  <Box key={section.id} id={section.id} sx={{ mb: 5 }}>
                    <Typography 
                      variant="h4" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 700,
                        mb: 3,
                      }}
                    >
                      {index + 1}. {section.title}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        whiteSpace: 'pre-line',
                        lineHeight: 1.8,
                      }}
                    >
                      {section.content}
                    </Typography>
                    {index < sections.length - 1 && (
                      <Divider sx={{ mt: 5 }} />
                    )}
                  </Box>
                ))}
                
                {/* Agreement Section */}
                <Box sx={{ mt: 8, textAlign: 'center' }}>
                  <Typography 
                    variant="subtitle1"
                    sx={{ mb: 3, fontWeight: 500 }}
                  >
                    By using the Code-Quest platform, you acknowledge that you have read,
                    understood, and agree to be bound by these Terms and Conditions.
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/contact"
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderRadius: '8px',
                      px: 4,
                      py: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Questions? Contact Us
                  </Button>
                </Box>
              </MotionPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </>
  );
};

export default TermsPage;
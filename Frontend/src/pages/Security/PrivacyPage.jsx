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
  Shield,
  Verified,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
// import Navbar from '../components/common/Navbar';
// import Footer from '../components/common/Footer';

// Current date and user info from global state
const CURRENT_DATE_TIME = "2025-05-30 03:33:29";
const CURRENT_USER = "Anuj-prajapati-SDE";
const LAST_UPDATED = "March 20, 2025";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const PrivacyPage = () => {
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

  // Privacy Policy sections
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: `
        At Code-Quest, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
        
        By accessing or using Code-Quest, you agree to the collection and use of information in accordance with this policy. This Privacy Policy applies to all users of our platform, including registered users, visitors, and educational institutions.
      `
    },
    {
      id: "information",
      title: "Information We Collect",
      content: `
        We collect several types of information from and about users of our platform:
        
        Personal Information:
        • Name, email address, and contact details provided during registration
        • Profile information such as username, password, educational background, and professional experience
        • Payment information when subscribing to premium features (processed through secure third-party payment processors)
        • Profile pictures and other content you choose to upload
        
        Usage Information:
        • Code submissions and solutions to challenges
        • Performance metrics and assessment results
        • Learning progress and achievement data
        • Interaction with other users through comments or collaborative features
        
        Technical Information:
        • IP address, browser type and version, device information
        • Operating system and platform
        • Time spent on the platform and pages visited
        • Referral source and exit pages
        • Date and time stamps of each visit
      `
    },
    {
      id: "collection",
      title: "How We Collect Information",
      content: `
        We collect information through various methods:
        
        Direct Collection:
        • Information you provide when creating an account or updating your profile
        • Content you submit, including code, comments, and messages
        • Surveys, feedback forms, or direct communications
        
        Automated Collection:
        • Cookies and similar tracking technologies
        • Server logs and analytics tools
        • Performance monitoring of your code submissions
        
        Third-Party Sources:
        • Information from educational institutions you're affiliated with (with proper authorization)
        • OAuth providers if you choose to sign in through third-party services
        • API integrations with development tools you connect
      `
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      content: `
        Code-Quest uses cookies and similar technologies to enhance your experience on our platform:
        
        Types of Cookies We Use:
        • Essential cookies: Required for core functionality of the platform
        • Functional cookies: Remember your preferences and settings
        • Analytical/performance cookies: Help us understand how visitors use our website
        • Targeting cookies: Record your visit, pages visited, and links followed
        
        You can control cookies through your browser settings, though disabling certain cookies may limit functionality of the platform.
        
        We use analytics tools like Google Analytics to collect information about how you interact with our platform, which helps us improve our services.
      `
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      content: `
        We use your information for the following purposes:
        
        Providing and Improving Services:
        • Delivering the core functionality of our coding platform
        • Personalizing your experience and tailoring content to your needs
        • Developing new features and improving existing ones
        
        Communication:
        • Sending service announcements and administrative messages
        • Providing technical support and responding to inquiries
        • Sending marketing communications (with your consent)
        • Notifying you about changes to our platform or policies
        
        Analytics and Research:
        • Analyzing usage patterns to improve our platform
        • Conducting research on educational and coding performance metrics
        • Generating anonymized statistical data
        
        Security and Compliance:
        • Protecting against fraud, spam, and unauthorized access
        • Enforcing our Terms and Conditions
        • Complying with legal obligations
      `
    },
    {
      id: "sharing",
      title: "How We Share Information",
      content: `
        We may share your information with the following parties:
        
        Service Providers:
        • Cloud hosting and storage providers
        • Payment processors for subscription management
        • Analytics and monitoring services
        • Customer support tools
        
        Educational Institutions:
        • If you're participating through an educational institution, we may share your performance data with authorized representatives of that institution
        
        Other Users:
        • Public profile information visible to other users
        • Code submissions in collaborative features or competitions (as configured by your privacy settings)
        
        Legal Requirements:
        • In response to a subpoena, court order, or other legal process
        • To protect the rights, property, or safety of Code-Quest, our users, or others
        • To investigate potential violations of our Terms and Conditions
        
        Business Transfers:
        • In connection with a merger, acquisition, or sale of assets
      `
    },
    {
      id: "security",
      title: "Data Security",
      content: `
        We implement appropriate technical and organizational measures to protect your personal information:
        
        • Encryption of sensitive data in transit and at rest
        • Regular security assessments and penetration testing
        • Access controls and authentication mechanisms
        • Regular backups and disaster recovery procedures
        • Employee training on data security and privacy practices
        
        However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
      `
    },
    {
      id: "data-retention",
      title: "Data Retention",
      content: `
        We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.
        
        Account information is kept until you delete your account or request data deletion. After account deletion, we may retain certain information in anonymized or aggregated form.
        
        Inactive accounts may be subject to automatic deletion after extended periods of inactivity, with proper notification provided beforehand.
      `
    },
    {
      id: "rights",
      title: "Your Rights and Choices",
      content: `
        Depending on your location, you may have the following rights regarding your personal information:
        
        • Access: Request a copy of the personal information we hold about you
        • Rectification: Update or correct inaccurate information
        • Deletion: Request deletion of your personal information in certain circumstances
        • Restriction: Limit the processing of your data in specific scenarios
        • Data Portability: Receive your data in a structured, commonly used format
        • Objection: Object to the processing of your data for certain purposes
        
        To exercise these rights, please contact us at privacy@code-quest.com.
        
        You can also manage certain privacy settings directly through your account preferences, including:
        • Profile visibility options
        • Communication preferences
        • Code submission privacy settings
      `
    },
    {
      id: "children",
      title: "Children's Privacy",
      content: `
        Code-Quest may be used by children over the age of 13 with proper consent and supervision. We take additional measures to protect children's privacy in compliance with applicable laws, including the Children's Online Privacy Protection Act (COPPA).
        
        For users under 18, we collect only the minimum amount of personal information necessary to provide our services and require parental or guardian consent as required by law.
        
        If you believe we have inadvertently collected personal information from a child under 13 without appropriate consent, please contact us immediately at privacy@code-quest.com.
      `
    },
    {
      id: "international",
      title: "International Data Transfers",
      content: `
        Code-Quest operates globally, which means your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws than your own country.
        
        We ensure appropriate safeguards are in place when transferring data internationally, including:
        • Standard contractual clauses approved by relevant data protection authorities
        • Privacy Shield certification where applicable
        • Data processing agreements with third-party service providers
        
        By using our platform, you consent to the transfer of your information to countries where Code-Quest operates.
      `
    },
    {
      id: "changes",
      title: "Changes to This Privacy Policy",
      content: `
        We may update our Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
        
        We will notify you of any material changes by:
        • Posting the updated Privacy Policy on our website
        • Sending an email to the address associated with your account
        • Displaying a prominent notice within the platform
        
        Your continued use of the platform after such modifications constitutes your acknowledgment and acceptance of the updated Privacy Policy.
      `
    },
    {
      id: "contact",
      title: "Contact Information",
      content: `
        If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact our Privacy Officer at:
        
        Privacy Officer
        Code-Quest, Inc.
        123 Tech Park, Electronic City Phase 1
        Bangalore, 560100, India
        privacy@code-quest.com
        +91 80 4567 8901
        
        For users in the European Union, we have appointed a Data Protection Officer who can be contacted at dpo@code-quest.com.
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
          pt: { xs: '100px', sm: '120px', md: '50px' },
          pb: { xs: '40px', sm: '60px', md: '0px' },
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
        
          
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
              Privacy Policy
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
            Privacy Policy
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
      
      {/* Privacy Content */}
      <Box 
        component="section"
        sx={{ 
          pb: { xs: 10, md: 15 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg" sx={{ minWidth: { md: '100%' } }}>
          <Grid container spacing={4} sx={{
  display: { md: 'flex' },
  flexDirection: { md: 'row' },
  flexWrap: { md: 'nowrap' }
}}>
            {/* Table of Contents Sidebar */}
            <Grid item xs={12} md={3} sx={{ minWidth: { md: '300px' } }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Shield 
                      color="primary"
                      sx={{ 
                        mr: 1.5,
                        fontSize: '1.5rem',
                      }}
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                      }}
                    >
                      Contents
                    </Typography>
                  </Box>
                  
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
                
                {/* Privacy Commitment Section */}
                <Box 
                  sx={{ 
                    mt: 8, 
                    p: 4,
                    borderRadius: '16px',
                    background: isDark ? 'rgba(20, 20, 20, 0.4)' : 'rgba(245, 245, 245, 0.7)',
                    textAlign: 'center',
                  }}
                >
                  <Typography 
                    variant="h5"
                    sx={{ mb: 2, fontWeight: 700 }}
                  >
                    Our Commitment to Your Privacy
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ mb: 3 }}
                  >
                    At Code-Quest, we are dedicated to protecting your personal information and being transparent about our data practices.
                    If you have any questions or concerns about our Privacy Policy or data practices, please don't hesitate to contact us.
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
                    Contact Privacy Team
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

export default PrivacyPage;
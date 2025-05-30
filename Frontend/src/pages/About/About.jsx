import React, { useState, useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowForward,
  AutoAwesome,
  CheckCircle,
  Code,
  EmojiEvents,
  GitHub,
  Groups,
  LinkedIn,
  Mail,
  Person,
  School,
  Security,
  Speed,
  Twitter,
  Verified,
} from '@mui/icons-material';
import { motion, useScroll, useTransform } from 'framer-motion';


// Current date and user info from global state
const CURRENT_DATE_TIME = "2025-05-29 21:36:35";
const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionAvatar = motion(Avatar);

const AboutPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const [tabValue, setTabValue] = useState(0);
  const { scrollYProgress } = useScroll();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
        // Create gradient with proper opacity
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        // Convert hex to rgba for better control
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

  // About tabs content
  const aboutTabs = [
    { label: "Our Story", value: 0 },
    { label: "Mission & Vision", value: 1 },
    { label: "Our Team", value: 2 },
    { label: "Timeline", value: 3 },
  ];

  // Our story content
  const ourStory = (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        Code-Quest was founded in 2022 by a team of passionate educators and industry professionals who identified a gap in the technical education space. While many platforms offered basic coding challenges, none provided a comprehensive environment that simulated real-world coding scenarios with enterprise-grade tools.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        Our journey began in a small office in Bangalore, India, where our founding team of five developers and two educational experts started building the initial prototype. After six months of intensive development, we launched the beta version to select educational institutions for testing.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        The feedback was overwhelmingly positive, with students and teachers praising the platform's intuitive design and comprehensive features. This early success attracted initial funding from education-focused venture capital firms, allowing us to expand our team and enhance our technology infrastructure.
      </Typography>
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
        Today, Code-Quest has grown into a leading platform used by over 500,000 active users across more than 2,500 educational institutions worldwide. Our commitment to excellence in coding education continues to drive our innovation and growth.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 1, color: theme.palette.primary.main }} /> Educational Excellence
              </Typography>
              <Typography variant="body2" color="textSecondary">
                We partner with top universities and industry experts to ensure our platform delivers the highest quality educational content and the most relevant coding challenges.
              </Typography>
            </MotionPaper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                <Security sx={{ mr: 1, color: theme.palette.primary.main }} /> Industry Standards
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Our platform utilizes the same tools and standards used in professional development environments, preparing students for real-world coding scenarios and challenges.
              </Typography>
            </MotionPaper>
          </Grid>
        </Grid>
      </Box>
    </MotionBox>
  );
  
  // Mission & vision content
  const missionVision = (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Grid container spacing={5}>
        <Grid item xs={12} md={6}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            sx={{ 
              p: 4, 
              height: '100%',
              borderRadius: '16px',
              backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: 8,
                height: '100%',
                background: theme.palette.gradients.primary,
              }}
            />
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                color: theme.palette.primary.main,
              }}
            >
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              To democratize coding education by providing an accessible, comprehensive platform that empowers learners of all backgrounds to master programming skills through practical, industry-relevant challenges and assessments.
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              We aim to bridge the gap between theoretical knowledge and practical application, ensuring that every student can build the competencies needed to thrive in the technology-driven future.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label="Educational Access" 
                size="small" 
                sx={{ 
                  bgcolor: isDark ? 'rgba(188, 64, 55, 0.1)' : 'rgba(188, 64, 55, 0.05)',
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }} 
              />
              <Chip 
                label="Skill Development" 
                size="small" 
                sx={{ 
                  bgcolor: isDark ? 'rgba(188, 64, 55, 0.1)' : 'rgba(188, 64, 55, 0.05)',
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }} 
              />
              <Chip 
                label="Community Building" 
                size="small" 
                sx={{ 
                  bgcolor: isDark ? 'rgba(188, 64, 55, 0.1)' : 'rgba(188, 64, 55, 0.05)',
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                }} 
              />
            </Box>
          </MotionPaper>
        </Grid>
        <Grid item xs={12} md={6}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            sx={{ 
              p: 4, 
              height: '100%',
              borderRadius: '16px',
              backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: 8,
                height: '100%',
                background: 'linear-gradient(135deg, #3a47d5 0%, #00d2ff 100%)',
              }}
            />
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 800,
                color: '#3a47d5',
              }}
            >
              Our Vision
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              To become the world's leading platform for coding education and assessment, recognized for our innovative approach, technical excellence, and measurable impact on learners' career outcomes.
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              We envision a future where every aspiring programmer has equal access to world-class education tools, regardless of geographic location or socioeconomic background, and where Code-Quest certification is universally respected by educational institutions and employers.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label="Global Impact" 
                size="small" 
                sx={{ 
                  bgcolor: isDark ? 'rgba(58, 71, 213, 0.1)' : 'rgba(58, 71, 213, 0.05)',
                  color: '#3a47d5',
                  fontWeight: 600,
                }} 
              />
              <Chip 
                label="Educational Innovation" 
                size="small" 
                sx={{ 
                  bgcolor: isDark ? 'rgba(58, 71, 213, 0.1)' : 'rgba(58, 71, 213, 0.05)',
                  color: '#3a47d5',
                  fontWeight: 600,
                }} 
              />
              <Chip 
                label="Industry Recognition" 
                size="small" 
                sx={{ 
                  bgcolor: isDark ? 'rgba(58, 71, 213, 0.1)' : 'rgba(58, 71, 213, 0.05)',
                  color: '#3a47d5',
                  fontWeight: 600,
                }} 
              />
            </Box>
          </MotionPaper>
        </Grid>
        <Grid item xs={12}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            sx={{ 
              p: 4, 
              borderRadius: '16px',
              backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
              textAlign: 'center',
            }}
          >
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                mb: 3,
              }}
            >
              Our Core Values
            </Typography>
            <Grid container spacing={3} >
              {[
                {
                  title: "Excellence",
                  description: "We strive for technical perfection in everything we create, from our platform's code to our educational content."
                },
                {
                  title: "Innovation",
                  description: "We continuously push boundaries to develop new features and approaches that enhance the learning experience."
                },
                {
                  title: "Accessibility",
                  description: "We are committed to making high-quality coding education available to everyone, regardless of background."
                },
                {
                  title: "Community",
                  description: "We foster a supportive environment where learners can collaborate, compete, and grow together."
                }
              ].map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={index} style={{ minWidth:"100%" }}>
                  <MotionBox
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                  >
                    <Box
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Box 
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 2,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                          boxShadow: '0 8px 16px rgba(188, 64, 55, 0.2)',
                        }}
                      >
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                          {index + 1}
                        </Typography>
                      </Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                        {value.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {value.description}
                      </Typography>
                    </Box>
                  </MotionBox>
                </Grid>
              ))}
            </Grid>
          </MotionPaper>
        </Grid>
      </Grid>
    </MotionBox>
  );
  
  // Team members data
  const teamMembers = [
    {
      name: "Anuj Prajapati",
      role: "Founder & CEO",
      avatar: "/assets/images/team/anuj.jpg", // Placeholder image path
      bio: "Former Google engineer with 15+ years of experience in educational technology. Founded Code-Quest with a vision to revolutionize coding education.",
      social: {
        linkedin: "https://linkedin.com/in/anuj-prajapati",
        twitter: "https://twitter.com/anujprajapati",
        github: "https://github.com/anuj-prajapati"
      }
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      avatar: "/assets/images/team/priya.jpg", // Placeholder image path
      bio: "PhD in Computer Science with expertise in compiler design and educational technology. Led the development of Code-Quest's core assessment engine.",
      social: {
        linkedin: "https://linkedin.com/in/priya-sharma",
        github: "https://github.com/priya-sharma"
      }
    },
    {
      name: "Rajesh Kumar",
      role: "Head of Education",
      avatar: "/assets/images/team/rajesh.jpg", // Placeholder image path
      bio: "Former professor at IIT Delhi with 20+ years of experience in computer science education. Designs our curriculum and assessment methodology.",
      social: {
        linkedin: "https://linkedin.com/in/rajesh-kumar",
        twitter: "https://twitter.com/rajeshkumar"
      }
    },
    {
      name: "Neha Gupta",
      role: "Lead UX Designer",
      avatar: "/assets/images/team/neha.jpg", // Placeholder image path
      bio: "Award-winning designer focused on creating intuitive, accessible interfaces for educational platforms. Previously worked at Microsoft and Udacity.",
      social: {
        linkedin: "https://linkedin.com/in/neha-gupta",
        github: "https://github.com/neha-gupta"
      }
    },
    {
      name: "Vikram Singh",
      role: "VP of Operations",
      avatar: "/assets/images/team/vikram.jpg", // Placeholder image path
      bio: "Operations expert with experience scaling educational startups. Manages our partnerships with educational institutions worldwide.",
      social: {
        linkedin: "https://linkedin.com/in/vikram-singh",
        twitter: "https://twitter.com/vikramsingh"
      }
    },
    {
      name: "Aisha Khan",
      role: "Senior Software Architect",
      avatar: "/assets/images/team/aisha.jpg", // Placeholder image path
      bio: "Full-stack developer with expertise in distributed systems and real-time collaboration tools. Leads our platform infrastructure team.",
      social: {
        github: "https://github.com/aisha-khan",
        linkedin: "https://linkedin.com/in/aisha-khan"
      }
    }
  ];

  // Our team content
  const ourTeam = (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 4 }}>
        At Code-Quest, our diverse team brings together expertise from education, software development, and design. We're united by our passion for revolutionizing coding education and creating opportunities for learners worldwide.
      </Typography>
      
      <Grid container spacing={4}   >
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} style={{ minWidth: '100%' }}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
            
              sx={{ 
                height: '100%',
                borderRadius: '16px',
                backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Box 
                sx={{ 
                  height: 6, 
                  background: theme.palette.gradients.primary,
                }}
              />
              <CardContent sx={{ p: 3 }}  >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      mr: 2,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      border: `3px solid ${theme.palette.primary.main}`,
                    }}
                  />
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        lineHeight: 1.2,
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="primary"
                      sx={{ 
                        fontWeight: 600,
                      }}
                    >
                      {member.role}
                    </Typography>
                  </Box>
                </Box>
                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  {member.bio}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {member.social.linkedin && (
                    <IconButton 
                      size="small"
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: '#0077B5',
                        backgroundColor: isDark ? 'rgba(0, 119, 181, 0.1)' : 'rgba(0, 119, 181, 0.05)',
                      }}
                    >
                      <LinkedIn fontSize="small" />
                    </IconButton>
                  )}
                  {member.social.twitter && (
                    <IconButton 
                      size="small"
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: '#1DA1F2',
                        backgroundColor: isDark ? 'rgba(29, 161, 242, 0.1)' : 'rgba(29, 161, 242, 0.05)',
                      }}
                    >
                      <Twitter fontSize="small" />
                    </IconButton>
                  )}
                  {member.social.github && (
                    <IconButton 
                      size="small"
                      href={member.social.github}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: isDark ? '#ffffff' : '#24292e',
                        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(36, 41, 46, 0.05)',
                      }}
                    >
                      <GitHub fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        ))}
      </Grid>
      
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        sx={{ 
          mt: 6,
          p: 4, 
          borderRadius: '16px',
          backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
          textAlign: 'center',
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
          }}
        >
          Join Our Team
        </Typography>
        <Typography variant="body1" paragraph>
          We're always looking for talented individuals passionate about education and technology. 
          Check our careers page for current openings and opportunities.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={RouterLink}
          to="/careers"
          sx={{ 
            borderRadius: '50px',
            px: 4,
            py: 1.5,
            background: theme.palette.gradients.primary,
            fontWeight: 600,
            textTransform: 'none',
          }}
        >
          View Career Opportunities
        </Button>
      </MotionPaper>
    </MotionBox>
  );
  
  // Timeline milestones
  const milestones = [
    { 
      year: 2022, 
      quarter: 'Q1', 
      title: 'Founding',
      description: 'Code-Quest is founded by Anuj Prajapati and a team of five developers in Bangalore, India.'
    },
    { 
      year: 2022, 
      quarter: 'Q3', 
      title: 'Beta Launch',
      description: 'Initial beta version released to 10 educational institutions for testing and feedback.'
    },
    { 
      year: 2022, 
      quarter: 'Q4', 
      title: 'Seed Funding',
      description: 'Secured $2.5 million in seed funding from education-focused venture capital firms.'
    },
    { 
      year: 2023, 
      quarter: 'Q1', 
      title: 'Public Launch',
      description: 'Official platform launch with support for 15 programming languages and 1,000+ coding challenges.'
    },
    { 
      year: 2023, 
      quarter: 'Q3', 
      title: 'University Partnerships',
      description: 'Established partnerships with 50+ universities across India, USA, and Europe.'
    },
    { 
      year: 2024, 
      quarter: 'Q1', 
      title: 'Series A Funding',
      description: 'Raised $12 million in Series A funding to expand platform capabilities and global reach.'
    },
    { 
      year: 2024, 
      quarter: 'Q2', 
      title: 'Enterprise Features',
      description: 'Launched enterprise version with advanced plagiarism detection and custom assessment creation.'
    },
    { 
      year: 2024, 
      quarter: 'Q4', 
      title: 'Mobile App Launch',
      description: 'Released native mobile applications for iOS and Android platforms.'
    },
    { 
      year: 2025, 
      quarter: 'Q1', 
      title: 'Global Expansion',
      description: 'Expanded to support 30+ programming languages and launched localized versions in 10 languages.'
    },
    { 
      year: 2025, 
      quarter: 'Q2', 
      title: 'Industry Recognition',
      description: 'Named "Best EdTech Platform" at the Global Education Technology Awards.'
    }
  ];
  
  // Timeline content
  const timeline = (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, mb: 6 }}>
        Since our founding in 2022, Code-Quest has grown rapidly through continuous innovation and a commitment to educational excellence. 
        Our journey has been marked by significant milestones as we've expanded our platform capabilities and global reach.
      </Typography>
      
      <Box sx={{ 
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: { xs: 20, sm: '50%' },
          width: 4,
          backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          transform: { xs: 'translateX(0)', sm: 'translateX(-2px)' },
          zIndex: 1,
        }
      }}>
        {milestones.map((milestone, index) => (
          <MotionBox
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            sx={{ 
              position: 'relative',
              mb: 5,
              zIndex: 2,
            }}
          >
            <Grid container>
              <Grid 
                item 
                xs={12} sm={6}
                sx={{ 
                  textAlign: { xs: 'left', sm: index % 2 === 0 ? 'right' : 'left' },
                  pr: { xs: 0, sm: index % 2 === 0 ? 4 : 0 },
                  pl: { xs: 5, sm: index % 2 === 0 ? 0 : 4 },
                  order: { xs: 2, sm: index % 2 === 0 ? 1 : 2 },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: '16px',
                      backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
                      boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.2)' : '0 10px 30px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                      }}
                    >
                      {milestone.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {milestone.description}
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
              
              <Grid 
                item 
                xs={12} sm={6}
                sx={{ 
                  display: 'flex',
                  justifyContent: { xs: 'flex-start', sm: index % 2 === 0 ? 'flex-start' : 'flex-end' },
                  alignItems: 'center',
                  order: { xs: 1, sm: index % 2 === 0 ? 2 : 1 },
                }}
              >
                <Box sx={{ 
                  position: { xs: 'absolute', sm: 'static' },
                  left: { xs: 0, sm: 'auto' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: theme.palette.gradients.primary,
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 0 0 4px rgba(188, 64, 55, 0.1), 0 0 10px rgba(0, 0, 0, 0.2)',
                    zIndex: 3,
                  }}>
                    <CheckCircle />
                  </Box>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 700,
                      mt: 1,
                    }}
                  >
                    {milestone.year} {milestone.quarter}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </MotionBox>
        ))}
      </Box>
      
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 8,
        }}
      >
        <Card
          sx={{ 
            p: 3,
            borderRadius: '16px',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            textAlign: 'center',
            maxWidth: 500,
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            The journey continues...
          </Typography>
          <Typography variant="body2">
            We're just getting started! Our roadmap includes AI-powered personalized learning paths,
            expanded language support, and deeper integration with university curricula.
          </Typography>
        </Card>
      </MotionBox>
    </MotionBox>
  );

  return (
    <>
      {/* <Navbar isAuthenticated={true} /> */}
      
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
          pb: { xs: '60px', sm: '80px', md: '100px' },
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg"> 
          <Grid 
            container 
            spacing={{ xs: 4, md: 8 }}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={10} lg={8} sx={{ textAlign: 'center' }}>
              <MotionBox>
                {/* Top Badge */}
                <MotionBox
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  sx={{ mb: 3, display: 'inline-block' }}
                >
                  <Chip 
                    label="ABOUT CODE-QUEST" 
                    color="primary"
                    size="small"
                    icon={<AutoAwesome sx={{ color: 'white !important', fontSize: '0.85rem' }} />}
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
                
                {/* Main Headline */}
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
                  Our Mission to Elevate
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
                    Coding Education
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
                  Learn about our journey, our team, and the vision driving us to create 
                  the world's most comprehensive coding education platform.
                </MotionTypography>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Main Content Section */}
      <Box 
        component="section"
        sx={{ 
          pb: { xs: 10, md: 15 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          {/* Tabs for different content sections */}
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            sx={{ 
              p: 1, 
              mb: { xs: 4, md: 6 },
              borderRadius: '50px',
              backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
              boxShadow: isDark ? '0 10px 30px rgba(0, 0, 0, 0.2)' : '0 10px 30px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Tabs 
              value={tabValue}
              onChange={handleTabChange}
              
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
                '& .MuiTab-root': {
                  minWidth: '200px',
                  minHeight: 'auto',
                  py: 3,
                  px: 3,
                  borderRadius: '50px',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&.Mui-selected': {
                    color: 'white',
                    backgroundColor: theme.palette.primary.main,
                    // boxShadow: '0 4px 12px rgba(188, 64, 55, 0.3)',
                  },
                },
              }}
            >
              {aboutTabs.map((tab) => (
                <Tab 
                  key={tab.value}
                  label={tab.label} 
                  value={tab.value}
                  disableRipple
                />
              ))}
            </Tabs>
          </MotionPaper>
          
          {/* Tab panels */}
          <Box sx={{ py: 2 }}>
            {tabValue === 0 && ourStory}
            {tabValue === 1 && missionVision}
            {tabValue === 2 && ourTeam}
            {tabValue === 3 && timeline}
          </Box>
        </Container>
      </Box>
      
      {/* Contact Section */}
      <Box 
        component="section"
        sx={{ 
          py: { xs: 8, md: 12 },
          position: 'relative',
          bgcolor: isDark ? 'rgba(20, 20, 20, 0.5)' : 'rgba(245, 245, 245, 0.5)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="md">
          <MotionPaper
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            sx={{ 
              p: { xs: 4, md: 6 }, 
              borderRadius: '24px',
              backgroundColor: isDark ? 'rgba(30, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(16px)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}`,
              boxShadow: isDark ? '0 20px 40px rgba(0, 0, 0, 0.2)' : '0 20px 40px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <Typography 
              variant="h3" 
              gutterBottom
              sx={{ 
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Get in Touch
            </Typography>
            
            <Typography 
              variant="h6"
              color="textSecondary"
              sx={{ 
                mb: 5,
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 400,
              }}
            >
              Have questions about Code-Quest or interested in partnership opportunities? 
              We'd love to hear from you.
            </Typography>
            
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: theme.palette.gradients.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: 'white',
                    }}
                  >
                    <Mail fontSize="large" />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Email Us
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Our team is here to help
                  </Typography>
                  <Typography 
                    variant="body1"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  >
                    contact@code-quest.com
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3a47d5 0%, #00d2ff 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: 'white',
                    }}
                  >
                    <Person fontSize="large" />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Support
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Need technical assistance?
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ color: '#3a47d5', fontWeight: 600 }}
                  >
                    support@code-quest.com
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2C3E50 0%, #4A6572 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: 'white',
                    }}
                  >
                    <Groups fontSize="large" />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Partnerships
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Explore collaboration options
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ color: '#2C3E50', fontWeight: 600 }}
                  >
                    partners@code-quest.com
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 6 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={RouterLink}
                to="/contact"
                sx={{ 
                  borderRadius: '50px',
                  px: 5,
                  py: 1.5,
                  background: theme.palette.gradients.primary,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
                endIcon={<ArrowForward />}
              >
                Contact Us
              </Button>
            </Box>
          </MotionPaper>
        </Container>
      </Box>

    </>
  );
};

export default AboutPage;
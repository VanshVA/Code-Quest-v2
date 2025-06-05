import React, { useRef, useEffect, useState } from 'react';
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
  Paper,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowForward,
  AutoAwesome,
  Check,
  FormatQuote,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LinkedIn,
  PlayArrow,
  Twitter,
  VerifiedUser,
  YouTube,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Current date and user info
const CURRENT_DATE_TIME = "2025-06-04 23:36:56";
const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

// Sample testimonial data
const featuredTestimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Software Engineer",
    company: "Google",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "Code Quest transformed our hiring process. The comprehensive assessment modules helped us accurately evaluate candidates' skills beyond traditional interviews. We've seen a 40% improvement in new hire performance since implementing Code Quest in our recruitment pipeline.",
    rating: 5,
    tags: ["Enterprise", "Hiring"],
    featured: true,
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    social: {
      linkedin: "https://linkedin.com/in/sarahjohnson",
      twitter: "https://twitter.com/sarahj"
    }
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    title: "Computer Science Professor",
    company: "Stanford University",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "As an educator, I've tried numerous assessment platforms. None compare to Code Quest's depth and versatility. The platform's ability to evaluate theoretical knowledge alongside practical implementation has revolutionized how we assess student progress. The analytics provide invaluable insights into learning gaps.",
    rating: 5,
    tags: ["Education", "Assessment"],
    featured: true,
    social: {
      linkedin: "https://linkedin.com/in/michaelchen",
      twitter: "https://twitter.com/drmchen"
    }
  },
  {
    id: 3,
    name: "Aisha Patel",
    title: "VP of Engineering",
    company: "Microsoft",
    image: "https://randomuser.me/api/portraits/women/66.jpg",
    quote: "We use Code Quest for our quarterly skill assessments across 12 engineering teams. The platform scales effortlessly with our organization's growth and provides deep insights into team strengths and growth opportunities. The custom challenge development has helped us create assessments tailored to our specific technology stack.",
    rating: 5,
    tags: ["Enterprise", "Team Assessment"],
    featured: true,
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    social: {
      linkedin: "https://linkedin.com/in/aishapatel"
    }
  }
];

const testimonials = [
  {
    id: 4,
    name: "James Wilson",
    title: "Tech Lead",
    company: "Shopify",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    quote: "The depth of Code Quest's assessment capabilities is impressive. Our team's technical interview process is now much more objective and efficient, saving us countless hours while improving candidate quality.",
    rating: 5,
    tags: ["Recruitment", "Technical Interviews"],
    social: {
      linkedin: "https://linkedin.com/in/jameswilson"
    }
  },
  {
    id: 5,
    name: "Elena Rodriguez",
    title: "CTO",
    company: "TechStart Inc.",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    quote: "As a startup founder, I needed a reliable way to assess developer talent without a large HR team. Code Quest's platform let us create customized challenges that accurately reflect our work, helping us build a stellar engineering team despite our limited resources.",
    rating: 4,
    tags: ["Startup", "Recruitment"],
    social: {
      twitter: "https://twitter.com/elenacto"
    }
  },
  {
    id: 6,
    name: "David Kim",
    title: "Lead Developer",
    company: "Netflix",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    quote: "The real-time collaboration features in Code Quest have transformed our interview process. Being able to watch candidates solve problems and provide guidance has given us much deeper insights into their problem-solving approach and communication skills.",
    rating: 5,
    tags: ["Technical Interviews", "Collaboration"],
    social: {
      linkedin: "https://linkedin.com/in/davidkimdev",
      twitter: "https://twitter.com/davidkimdev"
    }
  },
  {
    id: 7,
    name: "Olivia Taylor",
    title: "HR Director",
    company: "Salesforce",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    quote: "Code Quest bridged the gap between our HR team and engineering managers. The intuitive reports help us understand technical assessment results without needing engineering expertise. This has streamlined our hiring process tremendously.",
    rating: 5,
    tags: ["HR", "Analytics"],
    social: {
      linkedin: "https://linkedin.com/in/oliviataylor"
    }
  },
  {
    id: 8,
    name: "Raj Patel",
    title: "Coding Bootcamp Director",
    company: "CodeBoost Academy",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    quote: "Our bootcamp graduates now leave with Code Quest certification, which has dramatically increased their employability. Employers trust the comprehensive assessment, and our placement rates have improved by over 30% since implementation.",
    rating: 5,
    tags: ["Education", "Certification"],
    social: {
      linkedin: "https://linkedin.com/in/rajpatel",
      twitter: "https://twitter.com/rajpatel"
    }
  },
  {
    id: 9,
    name: "Sophie Martinez",
    title: "Engineering Manager",
    company: "Adobe",
    image: "https://randomuser.me/api/portraits/women/15.jpg",
    quote: "Code Quest's extensive question bank and advanced anti-cheating measures give us confidence in our assessment results. We've implemented it across all our engineering departments worldwide with consistent success.",
    rating: 4,
    tags: ["Enterprise", "Global Teams"],
    social: {
      linkedin: "https://linkedin.com/in/sophiemartinez"
    }
  }
];

const companiesUsing = [
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" },
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png" },
  { name: "Salesforce", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png" },
  { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2048px-IBM_logo.svg.png" },
  { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Adobe_Photoshop_CC_icon.svg/2101px-Adobe_Photoshop_CC_icon.svg.png" },
  { name: "Oracle", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/2560px-Oracle_logo.svg.png" }
];

const stats = [
  { value: "3,500+", label: "Companies" },
  { value: "85%", label: "Improved Hiring" },
  { value: "62%", label: "Reduced Interview Time" },
  { value: "94%", label: "Customer Satisfaction" }
];

const TestimonialsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  
  // Refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const featuredSliderRef = useRef(null);
  
  // State
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState('');
  const [fadeDirection, setFadeDirection] = useState('next');
  
  // Navigate through featured testimonials
  const nextTestimonial = () => {
    setFadeDirection('next');
    setActiveTestimonial((prev) => (prev + 1) % featuredTestimonials.length);
  };
  
  const prevTestimonial = () => {
    setFadeDirection('prev');
    setActiveTestimonial((prev) => (prev === 0 ? featuredTestimonials.length - 1 : prev - 1));
  };
  
  // Open video modal
  const handleOpenVideo = (videoUrl) => {
    setActiveVideo(videoUrl);
    setVideoOpen(true);
  };
  
  // Auto rotation for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      if (!videoOpen) {
        nextTestimonial();
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [videoOpen]);
  
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
  
  // Animations
  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  `;

  const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  `;

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
          pt: { xs: '100px', sm: '120px', md: '120px' },
          pb: { xs: '40px', sm: '60px', md: '40px' },
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
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 3, display: 'inline-block' }}
              >
                <Chip 
                  label="SUCCESS STORIES" 
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
                  What Our Clients
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
                    Are Saying
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
                  Hear from our clients about how Code Quest has transformed their assessment processes
                </MotionTypography>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Bar */}
      <Box component="section" sx={{ mb: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <MotionPaper
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            sx={{
              borderRadius: '20px',
              py: { xs: 3, md: 2.5 },
              px: { xs: 2, md: 4 },
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              alignItems: 'center',
              gap: 2,
              boxShadow: isDark 
                ? '0 15px 35px rgba(0, 0, 0, 0.3)'
                : '0 15px 35px rgba(0, 0, 0, 0.1)',
              backgroundColor: isDark 
                ? 'rgba(30, 28, 28, 0.7)' 
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {stats.map((stat, index) => (
              <Box 
                key={index} 
                sx={{
                  px: 2,
                  py: 1,
                  textAlign: 'center',
                  minWidth: { xs: '40%', sm: '22%' },
                }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 0.5,
                    color: theme.palette.primary.main,
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </MotionPaper>
        </Container>
      </Box>
      
      {/* Featured Testimonials Slider */}
      <Box component="section" sx={{ mb: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            ref={featuredSliderRef}
            sx={{ 
              position: 'relative',
              minHeight: { xs: 'auto', md: '400px' },
            }}
          >
            <AnimatePresence mode="wait">
              <MotionBox
                key={activeTestimonial}
                initial={{ 
                  opacity: 0, 
                  x: fadeDirection === 'next' ? 100 : -100 
                }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ 
                  opacity: 0, 
                  x: fadeDirection === 'next' ? -100 : 100,
                  transition: { duration: 0.3 }
                }}
                transition={{ duration: 0.5 }}
              >
                <Paper
                  sx={{
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: isDark 
                      ? '0 20px 60px rgba(0, 0, 0, 0.4)'
                      : '0 20px 60px rgba(0, 0, 0, 0.12)',
                    backgroundColor: isDark 
                      ? 'rgba(30, 28, 28, 0.7)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  }}
                >
                  <Grid container>
                    {/* Left Side */}
                    <Grid 
                      item 
                      xs={12} 
                      md={4} 
                      sx={{ 
                        position: 'relative',
                        bgcolor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.02)',
                        p: { xs: 3, md: 5 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: { xs: 'center', md: 'flex-start' },
                        justifyContent: 'center',
                        textAlign: { xs: 'center', md: 'left' },
                      }}
                    >
                      {/* Avatar */}
                      <Avatar 
                        src={featuredTestimonials[activeTestimonial].image}
                        alt={featuredTestimonials[activeTestimonial].name}
                        sx={{ 
                          width: 120, 
                          height: 120, 
                          border: '4px solid',
                          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'white',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                          mb: 3,
                        }}
                      />
                      
                      {/* Name & Title */}
                      <Box sx={{ mb: 2 }}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700, 
                            mb: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: { xs: 'center', md: 'flex-start' },
                          }}
                        >
                          {featuredTestimonials[activeTestimonial].name}
                          <VerifiedUser 
                            sx={{ 
                              fontSize: '0.9rem', 
                              ml: 1, 
                              color: theme.palette.primary.main 
                            }}
                          />
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                          {featuredTestimonials[activeTestimonial].title}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600} color="primary">
                          {featuredTestimonials[activeTestimonial].company}
                        </Typography>
                      </Box>
                      
                      {/* Rating */}
                      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                        <Rating 
                          value={featuredTestimonials[activeTestimonial].rating} 
                          readOnly 
                          size="small"
                          sx={{ color: theme.palette.primary.main }}
                        />
                        <Typography 
                          variant="body2"
                          color="textSecondary" 
                          sx={{ ml: 1 }}
                        >
                          5.0
                        </Typography>
                      </Box>
                      
                      {/* Tags */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                        {featuredTestimonials[activeTestimonial].tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            sx={{
                              bgcolor: isDark 
                                ? 'rgba(255,255,255,0.08)' 
                                : 'rgba(0,0,0,0.05)',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                            }}
                          />
                        ))}
                      </Box>
                      
                      {/* Social Links */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {featuredTestimonials[activeTestimonial].social.linkedin && (
                          <IconButton
                            size="small"
                            href={featuredTestimonials[activeTestimonial].social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: '#0077B5',
                              bgcolor: 'rgba(0, 119, 181, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(0, 119, 181, 0.2)',
                              }
                            }}
                          >
                            <LinkedIn fontSize="small" />
                          </IconButton>
                        )}
                        
                        {featuredTestimonials[activeTestimonial].social.twitter && (
                          <IconButton
                            size="small"
                            href={featuredTestimonials[activeTestimonial].social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: '#1DA1F2',
                              bgcolor: 'rgba(29, 161, 242, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(29, 161, 242, 0.2)',
                              }
                            }}
                          >
                            <Twitter fontSize="small" />
                          </IconButton>
                        )}
                        
                        {featuredTestimonials[activeTestimonial].video && (
                          <IconButton
                            size="small"
                            onClick={() => handleOpenVideo(featuredTestimonials[activeTestimonial].video)}
                            sx={{
                              color: '#FF0000',
                              bgcolor: 'rgba(255, 0, 0, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(255, 0, 0, 0.2)',
                              }
                            }}
                          >
                            <YouTube fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Grid>
                    
                    {/* Right Side - Quote */}
                    <Grid item xs={12} md={8}>
                      <Box 
                        sx={{ 
                          p: { xs: 4, md: 5 }, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          position: 'relative',
                        }}
                      >
                        <FormatQuote 
                          sx={{ 
                            position: 'absolute',
                            fontSize: { xs: 60, md: 80 },
                            color: isDark 
                              ? 'rgba(188, 64, 55, 0.1)' 
                              : 'rgba(188, 64, 55, 0.07)',
                            top: { xs: 10, md: 20 },
                            left: { xs: 10, md: 20 },
                            transform: 'rotate(180deg)'
                          }} 
                        />
                        
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 500,
                            fontStyle: 'italic',
                            lineHeight: 1.6,
                            position: 'relative',
                            pl: 3,
                            zIndex: 1,
                            mb: 4,
                          }}
                        >
                          {featuredTestimonials[activeTestimonial].quote}
                        </Typography>
                        
                        {featuredTestimonials[activeTestimonial].video && (
                          <Box sx={{ mt: 'auto' }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              startIcon={<PlayArrow />}
                              onClick={() => handleOpenVideo(featuredTestimonials[activeTestimonial].video)}
                              sx={{
                                borderRadius: '30px',
                                py: 1,
                                px: 3,
                                borderWidth: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': {
                                  borderWidth: 2,
                                }
                              }}
                            >
                              Watch Video Testimonial
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </MotionBox>
            </AnimatePresence>
            
            {/* Navigation Controls */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4, 
              gap: 2,
            }}>
              <IconButton
                onClick={prevTestimonial}
                sx={{
                  bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                  }
                }}
              >
                <KeyboardArrowLeft />
              </IconButton>
              
              {featuredTestimonials.map((_, index) => (
                <Box
                  key={index}
                  component="button"
                  onClick={() => {
                    setFadeDirection(index > activeTestimonial ? 'next' : 'prev');
                    setActiveTestimonial(index);
                  }}
                  sx={{
                    width: 40,
                    height: 4,
                    border: 'none',
                    padding: 0,
                    backgroundColor: activeTestimonial === index
                      ? theme.palette.primary.main
                      : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: activeTestimonial === index
                        ? theme.palette.primary.main
                        : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                    }
                  }}
                />
              ))}
              
              <IconButton
                onClick={nextTestimonial}
                sx={{
                  bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                  }
                }}
              >
                <KeyboardArrowRight />
              </IconButton>
            </Box>
          </MotionBox>
        </Container>
      </Box>
      

      {/* Grid of Other Testimonials */}
      <Box component="section" sx={{ mb: { xs: 10, md: 15 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '20px',
                    boxShadow: isDark 
                      ? '0 8px 30px rgba(0, 0, 0, 0.3)'
                      : '0 8px 30px rgba(0, 0, 0, 0.06)',
                    backgroundColor: isDark 
                      ? 'rgba(30, 28, 28, 0.7)' 
                      : 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    overflow: 'visible',
                    position: 'relative',
                  }}
                >
                  <CardContent sx={{ p: 3.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Quote */}
                    <Box
                      sx={{
                        position: 'relative',
                        mb: 3,
                        pb: 3, 
                        borderBottom: '1px solid',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      }}
                    >
                      <FormatQuote 
                        sx={{ 
                          position: 'absolute',
                          top: -10,
                          left: -10,
                          fontSize: 30,
                          color: theme.palette.primary.main,
                          opacity: 0.3,
                          transform: 'rotate(180deg)'
                        }} 
                      />
                      <Typography
                        variant="body1"
                        sx={{
                          fontStyle: 'italic',
                          lineHeight: 1.6,
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 6,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {testimonial.quote}
                      </Typography>
                    </Box>
                    
                    {/* Avatar and Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        src={testimonial.image}
                        alt={testimonial.name}
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          border: '2px solid',
                          borderColor: theme.palette.primary.main,
                          mr: 2,
                        }}
                      />
                      
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ display: 'flex', alignItems: 'center' }}>
                          {testimonial.name}
                          <Check 
                            sx={{ 
                              ml: 0.5, 
                              fontSize: '0.875rem', 
                              color: theme.palette.success.main,
                              bgcolor: 'rgba(76, 175, 80, 0.1)',
                              borderRadius: '50%',
                              p: 0.2,
                            }} 
                          />
                        </Typography>
                        
                        <Typography variant="body2" color="textSecondary">
                          {testimonial.title}, {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Rating and Tags */}
                    <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Rating 
                        value={testimonial.rating} 
                        readOnly 
                        size="small"
                        sx={{ color: theme.palette.primary.main }}
                      />
                      
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {testimonial.social.linkedin && (
                          <IconButton
                            size="small"
                            href={testimonial.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: '#0077B5',
                              fontSize: '0.875rem',
                            }}
                          >
                            <LinkedIn fontSize="inherit" />
                          </IconButton>
                        )}
                        
                        {testimonial.social.twitter && (
                          <IconButton
                            size="small"
                            href={testimonial.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: '#1DA1F2',
                              fontSize: '0.875rem',
                            }}
                          >
                            <Twitter fontSize="inherit" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* CTA Section */}
      <Box component="section" sx={{ mb: { xs: 10, md: 15 } }}>
        <Container maxWidth="md">
          <MotionPaper
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            sx={{
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative',
              bgcolor: isDark ? 'rgba(30, 28, 28, 0.8)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              boxShadow: isDark 
                ? '0 20px 60px rgba(0, 0, 0, 0.4)'
                : '0 20px 60px rgba(0, 0, 0, 0.1)',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              py: { xs: 6, md: 8 },
              px: { xs: 3, md: 8 },
              textAlign: 'center',
            }}
          >
            {/* Decorative Elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -40,
                left: -40,
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: theme.palette.primary.main,
                opacity: 0.04,
                zIndex: 0,
              }}
            />
            
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: theme.palette.primary.main,
                opacity: 0.06,
                zIndex: 0,
              }}
            />
            
            <MotionTypography
              variant="h3"
              component="h2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              sx={{ 
                fontWeight: 800, 
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
                lineHeight: 1.3,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Ready to Transform Your Assessment Process?
            </MotionTypography>
            
            <MotionTypography
              variant="h6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              color="textSecondary"
              sx={{ 
                mb: 4,
                maxWidth: '700px',
                mx: 'auto',
                fontWeight: 400,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Join thousands of companies using Code Quest to evaluate, identify, and develop top programming talent.
            </MotionTypography>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: theme.palette.gradients.primary,
                  boxShadow: '0 10px 20px rgba(188, 64, 55, 0.2)',
                  '&:hover': {
                    boxShadow: '0 14px 28px rgba(188, 64, 55, 0.3)',
                    transform: 'translateY(-2px)',
                  },
                  minWidth: 200,
                }}
              >
                Request Demo
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                color="primary"
                sx={{
                  py: 1.5,
                  px: 4,
                  borderRadius: '30px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                  },
                  minWidth: 200,
                }}
              >
                View Pricing
              </Button>
            </MotionBox>
          </MotionPaper>
        </Container>
      </Box>
      
      {/* Video Modal */}
      {/* Note: In a real implementation, you would use a modal component */}
      {videoOpen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0,0,0,0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
          onClick={() => setVideoOpen(false)}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: '900px',
              aspectRatio: '16/9',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box
              component="iframe"
              src={`${activeVideo}?autoplay=1`}
              title="Video Testimonial"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '12px',
              }}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default TestimonialsPage;
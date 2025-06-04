import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  AvatarGroup,
  Badge,
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
  Paper,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccessTime,
  ArrowForward,
  AutoAwesome,
  CheckCircle,
  CheckCircleOutlined,
  Code,
  CodeOutlined,
  Countertops,
  EmojiEvents,
  FlashOn,
  FormatQuote,
  GitHub,
  KeyboardDoubleArrowDown,
  Leaderboard,
  LockOpen,
  MoreVert,
  NewReleasesOutlined,
  People,
  Person,
  PlayArrow,
  RateReview,
  School,
  Security,
  Settings,
  Speed,
  Star,
  StarRate,
  Stars,
  Update,
  Verified,
} from "@mui/icons-material";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// Motion components
const MotionBox = motion(Box);
const MotionContainer = motion(Container);
const MotionTypography = motion(Typography);
const MotionButton = motion(Button);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

// Hardcoded current date and user info
const CURRENT_DATE_TIME = "2025-05-29 21:25:12";
const CURRENT_USER = "Anuj-prajapati-SDE";

const HomePage = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isExtraSmall = useMediaQuery(theme.breakpoints.down("xs"));
  const isDark = theme.palette.mode === "dark";
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const { scrollYProgress } = useScroll();
  const scrollProgress = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track mouse movement for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Canvas animation with gradient orbs and improved performance
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    const resizeCanvas = () => {
      // Set canvas dimensions with device pixel ratio for sharp rendering
      const width = window.innerWidth;
      const height = window.innerHeight * 2; // Extended height for scrolling
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener("resize", resizeCanvas);
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
        this.size =
          Math.random() * (isMobile ? 100 : 180) + (isMobile ? 30 : 50);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.12 + 0.04;

        // Premium color combinations
        const colorSets = [
          { start: "#bc4037", end: "#f47061" }, // Primary red
          { start: "#9a342d", end: "#bd5c55" }, // Dark red
          { start: "#2C3E50", end: "#4A6572" }, // Dark blue
          { start: "#3a47d5", end: "#00d2ff" }, // Blue
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
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
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
    const orbCount = isMobile ? 6 : 12;
    const orbs = Array(orbCount)
      .fill()
      .map(() => new GradientOrb());

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
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isMobile, isDark]);

  // Features with premium gradient icons
  const features = [
    {
      icon: <Code />,
      title: "Advanced Code Editor",
      description:
        "Professional multi-language IDE with syntax highlighting and real-time compilation for 30+ programming languages.",
      gradient: "linear-gradient(135deg, #bc4037 0%, #f47061 100%)",
    },
    {
      icon: <Speed />,
      title: "Performance Analytics",
      description:
        "Comprehensive metrics on code performance with time complexity analysis and execution benchmarks.",
      gradient: "linear-gradient(135deg, #3a47d5 0%, #00d2ff 100%)",
    },
    {
      icon: <EmojiEvents />,
      title: "Competitive Challenges",
      description:
        "Weekly coding competitions with real-time leaderboards and professional ranking systems.",
      gradient: "linear-gradient(135deg, #2C3E50 0%, #4A6572 100%)",
    },
    {
      icon: <School />,
      title: "Learning Resources",
      description:
        "Extensive educational materials and interactive tutorials to master programming concepts.",
      gradient: "linear-gradient(135deg, #9a342d 0%, #bd5c55 100%)",
    },
    {
      icon: <Security />,
      title: "Advanced Security",
      description:
        "Enterprise-grade proctoring system with AI-powered plagiarism detection for assessment integrity.",
      gradient: "linear-gradient(135deg, #4A6572 0%, #2C3E50 100%)",
    },
    {
      icon: <FlashOn />,
      title: "Real-time Collaboration",
      description:
        "Seamless collaborative coding environment with synchronized editing and version control.",
      gradient: "linear-gradient(135deg, #f47061 0%, #bc4037 100%)",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      id: 1,
      name: "Aditya Sharma",
      role: "Computer Science Student",
      company: "IIT Delhi",
      avatar: "/assets/images/testimonial1.jpg",
      rating: 5,
      text: "Code-Quest transformed my coding journey. The platform's advanced features and interactive challenges helped me secure a top internship position.",
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Full Stack Developer",
      company: "Microsoft",
      avatar: "/assets/images/testimonial2.jpg",
      rating: 5,
      text: "The competitive challenges and performance analytics gave me valuable insights to improve my algorithms. My interview success rate improved dramatically.",
    },
    {
      id: 3,
      name: "Dr. Rajesh Kumar",
      role: "Professor",
      company: "BITS Pilani",
      avatar: "/assets/images/testimonial3.jpg",
      rating: 5,
      text: "As an educator, I find Code-Quest's assessment tools exceptional. The plagiarism detection and detailed analytics help me evaluate students effectively.",
    },
  ];

  // Statistics with animated counters
  const stats = [
    { value: "500,000+", label: "Active Users" },
    { value: "10+ Million", label: "Code Submissions" },
    { value: "50,000+", label: "Coding Challenges" },
    { value: "2,500+", label: "Educational Institutions" },
  ];

  // Pricing plans
  const pricingPlans = [
    {
      title: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for beginners and casual learners",
      features: [
        "5 coding challenges per week",
        "Basic code editor",
        "Community support",
        "Limited performance analytics",
      ],
      cta: "Get Started",
      popular: false,
      gradient: "linear-gradient(135deg, #2C3E50 0%, #4A6572 100%)",
    },
    {
      title: "Premium",
      price: "$12",
      period: "per month",
      description: "For serious coders and professionals",
      features: [
        "Unlimited coding challenges",
        "Advanced IDE with all languages",
        "Detailed performance analytics",
        "Priority technical support",
        "Custom practice sessions",
      ],
      cta: "Try Premium",
      popular: true,
      gradient: theme.palette.gradients.primary,
    },
    {
      title: "Enterprise",
      price: "Custom",
      period: "pricing",
      description: "For educational institutions and companies",
      features: [
        "Custom assessment creation",
        "Advanced plagiarism detection",
        "Team management features",
        "API access",
        "Dedicated support manager",
      ],
      cta: "Contact Sales",
      popular: false,
      gradient: "linear-gradient(135deg, #3a47d5 0%, #00d2ff 100%)",
    },
  ];

  // Language support
  const programmingLanguages = [
    { name: "JavaScript", level: 95 },
    { name: "Python", level: 92 },
    { name: "Java", level: 88 },
    { name: "C++", level: 85 },
    { name: "Go", level: 80 },
    { name: "Ruby", level: 78 },
    { name: "TypeScript", level: 90 },
    { name: "Swift", level: 82 },
  ];

  // Latest competitions
  const latestCompetitions = [
    {
      title: "Algorithm Masters Challenge",
      date: "June 15, 2025",
      participants: 1258,
      difficulty: "Advanced",
      prize: "$5,000",
      status: "Upcoming",
    },
    {
      title: "Web Development Hackathon",
      date: "June 5, 2025",
      participants: 876,
      difficulty: "Intermediate",
      prize: "$3,000",
      status: "Registration Open",
    },
    {
      title: "Machine Learning Marathon",
      date: "May 25, 2025",
      participants: 1542,
      difficulty: "Expert",
      prize: "$7,500",
      status: "Completed",
    },
  ];

  // Advanced animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        duration: 0.5,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Scroll to features section
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // // Handle tab change
  // const handleTabChange = (event, newValue) => {
  //   setTabValue(newValue);
  // };

  return (
    <>
      {/* Progress indicator */}
      <MotionBox
        style={{ scaleX: scrollYProgress }}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: theme.palette.gradients.primary,
          transformOrigin: "0%",
          zIndex: 2000,
        }}
      />

    {/* Hero Section with Advanced Features */}
<Box
  component="section"
  sx={{
    position: "relative",
    pt: { xs: "120px", sm: "140px", md: "50px" },
    pb: { xs: "80px", sm: "120px", md: "100px" },
    px: { xs: 2, sm: 4, md: 0 },
    overflow: "hidden",
  }}
>
  {/* Background elements */}
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "100%",
      overflow: "hidden",
      zIndex: -2,
    }}
  >
    {/* Animated gradient background */}
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDark
          ? "radial-gradient(circle at 15% 50%, rgba(188, 64, 55, 0.15) 0%, rgba(0,0,0,0) 35%), radial-gradient(circle at 85% 30%, rgba(89, 88, 230, 0.15) 0%, rgba(0,0,0,0) 35%)"
          : "radial-gradient(circle at 15% 50%, rgba(247, 112, 98, 0.15) 0%, rgba(0,0,0,0) 35%), radial-gradient(circle at 85% 30%, rgba(89, 88, 230, 0.08) 0%, rgba(0,0,0,0) 35%)",
        opacity: 0.8,
      }}
    />

    {/* Subtle grid pattern */}
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: isDark
          ? `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
             linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`
          : `linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), 
             linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />
  </Box>

  <Container maxWidth="lg">
    <Grid
      container
      spacing={{ xs: 4, md: 8 }}
      alignItems="center"
      justifyContent="space-between"
    >
      {/* Left Column - Hero Content */}
      <Grid item xs={12} md={6}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            maxWidth: { xs: "100%", md: "540px" },
            mx: { xs: "auto", md: 0 },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          {/* Top Badge */}
          <MotionBox
            variants={itemVariants}
            sx={{ mb: 3, display: "inline-block" }}
          >
            <Chip
              label="NEXT-GEN CODING PLATFORM"
              color="primary"
              size="small"
              icon={
                <Stars
                  sx={{ color: "white !important", fontSize: "0.85rem" }}
                />
              }
              sx={{
                background: theme.palette.gradients.primary,
                color: "white",
                fontWeight: 600,
                fontSize: "0.7rem",
                letterSpacing: 1.2,
                py: 2.2,
                pl: 1,
                pr: 2,
                borderRadius: "100px",
                boxShadow: "0 8px 16px rgba(188, 64, 55, 0.2)",
                "& .MuiChip-icon": {
                  color: "white",
                  mr: 0.5,
                },
              }}
            />
          </MotionBox>

          {/* Main Headline */}
          <MotionTypography
            variant="h1"
            variants={itemVariants}
            sx={{
              fontSize: { xs: "2.5rem", sm: "3rem", md: "3.8rem" },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: { xs: 3, md: 4 },
              letterSpacing: "-0.02em",
            }}
          >
            <Box component="span" sx={{ display: "block" }}>
              Elevate Your
            </Box>
            <Box
              component="span"
              sx={{
                background: theme.palette.gradients.primary,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textFillColor: "transparent",
                position: "relative",
              }}
            >
              Coding Experience
              {/* Animated underline */}
              
            </Box>
          </MotionTypography>

          {/* Subheadline */}
          <MotionTypography
            variant="h5"
            variants={itemVariants}
            color="textSecondary"
            sx={{
              mb: 4,
              fontWeight: 400,
              lineHeight: 1.5,
              fontSize: { xs: "1.1rem", md: "1.3rem" },
            }}
          >
            The ultimate platform for coding competitions, assessments, and skill 
            development with cutting-edge tools and real-time collaboration.
          </MotionTypography>

          {/* CTA Buttons with Enhanced Animation */}
          <MotionBox
            variants={itemVariants}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 3 },
              mb: 4,
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 1.8,
                fontSize: "1.1rem",
                fontWeight: 600,
                position: "relative",
                overflow: "hidden",
                background: theme.palette.gradients.primary,
                boxShadow: "0 10px 20px rgba(188, 64, 55, 0.25)",
                textTransform: "none",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                  transition: "all 0.5s ease",
                },
                "&:hover": {
                  boxShadow: "0 15px 25px rgba(188, 64, 55, 0.3)",
                  color: "white",
                  transform: "translateY(-3px)",
                  "&::after": {
                    left: "100%",
                  },
                },
                transition: "all 0.3s ease",
              }}
              startIcon={
                <Box
                  component={motion.div}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  sx={{top:'4px', position: 'relative' }}
                >
                  <PlayArrow />
                </Box>
              }
            >
              Start Coding Now
            </Button>

            <Button
              component={RouterLink}
              to="/features"
              variant="outlined"
              size="large"
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 1.7,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                borderWidth: 2,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  borderWidth: 2,
                      borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  background: "rgba(188, 64, 55, 0.04)",
                  transform: "translateY(-3px)",
                },
                transition: "all 0.3s ease",
              }}
              endIcon={<ArrowForward fontSize="small" />}
            >
              Explore Features
            </Button>
          </MotionBox>

          {/* Activity Stats */}
          <MotionBox
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              mt: 4,
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            {/* Live users indicator */}
            <MotionBox
              variants={itemVariants}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1,
                borderRadius: "100px",
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                border: "1px solid",
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              }}
            >
              <AvatarGroup 
                max={3}
                sx={{
                  '& .MuiAvatar-root': { 
                    width: 26, 
                    height: 26, 
                    fontSize: '0.8rem',
                    border: isDark ? '1px solid rgba(0,0,0,0.3)' : '1px solid #fff',
                  }
                }}
              >
                <Avatar alt="User 1" src="https://randomuser.me/api/portraits/women/32.jpg" />
                <Avatar alt="User 2" src="https://randomuser.me/api/portraits/men/44.jpg" />
                <Avatar alt="User 3" src="https://randomuser.me/api/portraits/women/60.jpg" />
                <Avatar alt="User 4" src="https://randomuser.me/api/portraits/men/33.jpg" />
              </AvatarGroup>
              <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#4caf50',
                    mr: 1,
                    animation: 'pulse 1.5s infinite',
                    '@keyframes pulse': {
                      '0%': {
                        boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)',
                      },
                      '70%': {
                        boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)',
                      },
                      '100%': {
                        boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)',
                      },
                    },
                  }}
                />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  <Countertops end={1458} duration={2.5} separator="," /> active users
                </Typography>
              </Box>
            </MotionBox>
            
            {/* Current challenge indicator */}
            <MotionBox
              variants={itemVariants}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1,
                borderRadius: "100px",
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                border: "1px solid",
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
              }}
            >
              <Box 
                sx={{ 
                  mr: 1,
                  color: '#ff9800',
                  display: 'flex',
                  alignItems: 'center' 
                }}
              >
                <EmojiEvents fontSize="small" />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                Weekly Challenge: <Box component="span" sx={{ color: 'primary.main' }}>Graph Algorithms</Box>
              </Typography>
            </MotionBox>
            
            {/* Platform status indicator */}
            <MotionBox
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 1,
                borderRadius: "100px",
                bgcolor: "rgba(76, 175, 80, 0.1)",
                border: "1px solid",
                borderColor: "rgba(76, 175, 80, 0.2)",
              }}
            >
              <Box 
                sx={{ 
                  mr: 1,
                  color: '#4caf50',
                  display: 'flex',
                  alignItems: 'center' 
                }}
              >
                <CheckCircle fontSize="small" />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#4caf50' }}>
                All Systems Operational
              </Typography>
            </MotionBox>
          </MotionBox>
        </MotionBox>
      </Grid>

      {/* Right Column - Advanced Animated Illustration */}
      <Grid item xs={12} md={6}>
        <MotionBox
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.3,
          }}
          sx={{
            position: "relative",
            transformStyle: "preserve-3d",
            transform: !isMobile
              ? `perspective(1000px) 
                 rotateY(${
                   (mousePosition.x / window.innerWidth) * 4 - 2
                 }deg) 
                 rotateX(${
                   (-mousePosition.y / window.innerHeight) * 4 + 2
                 }deg)`
              : "none",
            transition: "transform 0.1s ease",
            zIndex: 2,
          }}
        >
          {/* Premium Glass Card with Enhanced Effects */}
          <Box
            sx={{
              borderRadius: "28px",
              overflow: "hidden",
              position: "relative",
              backgroundColor: isDark
                ? "rgba(30, 28, 28, 0.7)"
                : "rgba(255, 255, 255, 0.7)",
              backdropFilter: "blur(16px)",
              border: `1px solid ${
                isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
              }`,
              boxShadow: isDark
                ? "0 25px 70px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
                : "0 25px 70px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05) inset",
              p: { xs: 3, sm: 4, md: 1 },
              mx: { xs: 2, sm: 4, md: 0 },
              transform: "translateZ(50px)",
              height: "100%",
              minHeight: { xs: "300px", sm: "400px", md: "480px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Code Editor Interface with Animation */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 1, md: 3 },
              }}
            >
              {/* Code Editor Frame with User Interface */}
              <Box
                component={motion.div}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                sx={{
                  width: "100%",
                  maxWidth: "520px",
                  height: "auto",
                  maxHeight: "380px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
                  transform: "translateZ(30px)",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid",
                  borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
                }}
              >
                {/* Editor Header */}
                <Box
                  sx={{
                    bgcolor: isDark ? "#1E1E1E" : "#f7f7f7",
                    py: 1.5,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid",
                    borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.1)",
                  }}
                >
                  {/* Left controls */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                      }}
                    >
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: "#FF5F56",
                        }}
                      />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: "#FFBD2E",
                        }}
                      />
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: "#27C93F",
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        ml: 1,
                        color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                      }}
                    >
                      main.js
                    </Typography>
                  </Box>

                  {/* Right info */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Chip
                      label="JavaScript"
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: "0.65rem",
                        bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>

                {/* Code Content */}
                <Box
                  sx={{
                    bgcolor: isDark ? "#1E1E1E" : "#f7f7f7",
                    p: 2,
                    height: "300px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  {/* Line numbers */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 30,
                      py: 2,
                      bgcolor: isDark ? "#252525" : "#e8e8e8",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      pr: 1,
                    }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <Typography
                        key={i}
                        variant="caption"
                        sx={{
                          fontSize: "0.7rem",
                          color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                          lineHeight: 1.8,
                        }}
                      >
                        {i + 1}
                      </Typography>
                    ))}
                  </Box>

                  {/* Code text */}
                  <Box
                    sx={{
                      pl: 4,
                      fontFamily: "Roboto Mono, monospace",
                      fontSize: "0.8rem",
                      color: isDark ? "#D4D4D4" : "#333",
                      lineHeight: 1.8,
                      position: "relative",
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        color: isDark ? "#569CD6" : "#0000FF",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      import React, &#123; useState, useEffect &#125; from 'react';
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        color: isDark ? "#4EC9B0" : "#267F99",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      const CodeEditor = () =&gt; &#123;
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        color: isDark ? "#9CDCFE" : "#0070C1",
                        whiteSpace: "pre-wrap",
                        pl: 2,
                      }}
                    >
                      const [code, setCode] = useState('');
                    </Typography>
                    
                    <Box 
                      component={motion.div} 
                      sx={{ 
                        position: 'relative',
                        display: 'inline-block',
                        pl: 2 
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ 
                        delay: 1,
                        duration: 0.3,
                        repeat: Infinity,
                        repeatType: 'reverse'
                      }}
                    >
                      {/* Typing cursor animation */}
                      <Box 
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: -10,
                          width: 2,
                          height: 16,
                          bgcolor: theme.palette.primary.main,
                          animation: 'blink 1s step-start infinite',
                          '@keyframes blink': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0 }
                          }
                        }}
                      />
                    </Box>

                    <Typography
                      component="div"
                      sx={{
                        color: isDark ? "#6A9955" : "#008000",
                        whiteSpace: "pre-wrap",
                        mt: 1,
                        pl: 2,
                      }}
                    >
                      // Current user: Code-Quest Pro
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        color: isDark ? "#6A9955" : "#008000",
                        whiteSpace: "pre-wrap",
                        pl: 2,
                      }}
                    >
                      // Timestamp: 2025-05-30 11:22:50
                    </Typography>

                    <Typography
                      component="div"
                      sx={{
                        color: isDark ? "#C586C0" : "#AF00DB",
                        whiteSpace: "pre-wrap",
                        mt: 1,
                        pl: 2,
                      }}
                    >
                      useEffect(() =&gt; &#123;
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        color: isDark ? "#D4D4D4" : "#333",
                        whiteSpace: "pre-wrap",
                        pl: 4,
                      }}
                    >
                      console.log('Code editor initialized');
                    </Typography>
                    <Typography
                      component="div"
                      sx={{
                        color: isDark ? "#C586C0" : "#AF00DB",
                        whiteSpace: "pre-wrap",
                        pl: 2,
                      }}
                    >
                      &#125;, []);
                    </Typography>

                    <Typography
                      component="div"
                      sx={{
                        color: isDark ? "#D4D4D4" : "#333",
                        whiteSpace: "pre-wrap",
                        mt: 1,
                      }}
                    >
                      &#125;;
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Top Status Badge */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                sx={{
                  position: "absolute",
                  top: 30,
                 
                  left: "50%",
                  transform: "translateX(-50%)",
                  borderRadius: "12px",
                  py: 1,
                  px: 2,
                  background: isDark
                    ? "rgba(10, 10, 10, 0.8)"
                    : "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
                  border: `1px solid ${
                    isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
                  }`,
                  zIndex: 5,
                }}
              >
                <Box 
                  component={motion.div}
                  animate={{
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatDelay: 5,
                  }}
                  sx={{ mr: 1, fontSize: '1.2rem' }}
                >
                  👨‍💻
                </Box>
               
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isDark ? "white" : "text.primary",
                  }}
                >
                 
                   
                  CODE-QUEST Professional Edition
                  
                </Typography>
              
              </Box>

              {/* Activity Status Badge */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                sx={{
                  position: "absolute",
                  top: 100,
                  right: 20,
                  borderRadius: "12px",
                  py: 1,
                  px: 2,
                  background: isDark
                    ? "rgba(10, 10, 10, 0.7)"
                    : "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                  border: `1px solid ${
                    isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
                  }`,
                  zIndex: 5,
                }}
              >
                <GitHub
                  sx={{
                    color: isDark ? "#fff" : "#24292e",
                    fontSize: "1.2rem",
                    mr: 1,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isDark ? "white" : "text.primary",
                  }}
                >
                   <a href="https://github.com/VanshVA/Code-Quest-v2"style={{ color: isDark ? "white" : "#3B5966",}} target="_blank" rel="noopener noreferrer">
                   
                  Connected to GitHub
                   </a>
                </Typography>
              </Box>

              {/* Bottom Status Badge */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                sx={{
                  position: "absolute",
                  bottom: 50,
                  left: "50%",
                  transform: "translateX(-50%)",
                  borderRadius: "100px",
                  py: 1,
                  px: 3,
                  background: theme.palette.gradients.primary,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 10px 20px rgba(188, 64, 55, 0.25)",
                  zIndex: 5,
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    color: "white",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component={motion.span}
                    animate={{
                      rotate: [0, 15, -15, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    sx={{
                      display: "inline-flex",
                      mr: 1,
                    }}
                  >
                    🚀
                  </Box>
                  Ready to deploy
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Decorative Elements with Enhanced Effects */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
            animate={{ opacity: 0.8, scale: 1, rotate: -15 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            sx={{
              position: "absolute",
              top: "-5%",
              left: "-8%",
              width: "150px",
              height: "150px",
              borderRadius: "30px",
              background: "linear-gradient(135deg, #bc4037 0%, #f47061 100%)",
              zIndex: -1,
              boxShadow: "0 20px 40px rgba(188, 64, 55, 0.3)",
              filter: "blur(5px)",
            }}
          />

          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.8, rotate: 15 }}
            animate={{ opacity: 0.6, scale: 1, rotate: 15 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            sx={{
              position: "absolute",
              bottom: "0%",
              right: "-5%",
              width: "120px",
              height: "120px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #3a47d5 0%, #00d2ff 100%)",
              zIndex: -1,
              boxShadow: "0 20px 40px rgba(58, 71, 213, 0.3)",
              filter: "blur(5px)",
            }}
          />

          {/* New floating dot animation */}
          <Box
            component={motion.div}
            initial={{ opacity: 0.7, x: -20 }}
            animate={{ opacity: [0.7, 0.4, 0.7], x: [-20, 20, -20] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            sx={{
              position: "absolute",
              top: "20%",
              left: "10%",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(89, 88, 230, 0.2)",
              zIndex: -1,
              filter: "blur(20px)",
            }}
          />

          <Box
            component={motion.div}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.2, 0.5], y: [0, 30, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            sx={{
              position: "absolute",
              bottom: "15%",
              right: "15%",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(188, 64, 55, 0.2)",
              zIndex: -1,
              filter: "blur(15px)",
            }}
          />
        </MotionBox>
      </Grid>
    </Grid>

    {/* Enhanced Scroll Down Indicator */}
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        bottom: { xs: 20, md: 30 },
        left: "50%",
        right:"50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{
          mb: 1,
          fontWeight: 500,
          opacity: 0.8,
          width: "150px",
          textAlign: "center",
        }}
      >
        Explore Features
      </Typography>
      <IconButton
        onClick={scrollToFeatures}
        component={motion.div}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        sx={{
          backgroundColor: isDark
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(0, 0, 0, 0.05)",
            color: isDark ? "#fff" : "#3B5966",
          "&:hover": {
            backgroundColor: isDark
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        <KeyboardDoubleArrowDown 
          sx={{
            animation: "bounce 2s infinite",
            "@keyframes bounce": {
              "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
              "40%": { transform: "translateY(10px)" },
              "60%": { transform: "translateY(5px)" },
            },
          }}
        />
      </IconButton>
    </MotionBox>
  </Container>
</Box>

      {/* Features Section */}
      <Box
        id="features"
        component="section"
        sx={{
          py: { xs: 10, md: 15 },
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          {/* Section Header */}
        
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
      sx={{
        textAlign: "center",
        mb: { xs: 8, md: 12 },
        mx: "auto",
        maxWidth: "800px",
        position: "relative"
      }}
    >
      {/* Decorative dots */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          left: { xs: "5%", md: "15%" },
          display: "flex",
          gap: 1,
        }}
      >
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4, type: "spring" }}
            viewport={{ once: true }}
            sx={{
              width: (i + 1) * 4,
              height: (i + 1) * 4,
              borderRadius: "50%",
              backgroundColor: theme.palette.primary.main,
              opacity: 0.7 - i * 0.2
            }}
          />
        ))}
      </Box>

      {/* Animated overline with line */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box
          component={motion.div}
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          sx={{
            height: 3,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 3,
            mr: 2,
          }}
        />
        <Typography
          variant="overline"
          component={motion.div}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 700,
            letterSpacing: 2,
            fontSize: "0.9rem",
          }}
        >
          PREMIUM CAPABILITIES
        </Typography>
        <Box
          component={motion.div}
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          sx={{
            height: 3,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 3,
            ml: 2,
          }}
        />
      </Box>

      <Typography
        variant="h2"
        component={motion.h2}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        sx={{
          fontWeight: 800,
          mb: 3,
          fontSize: { xs: "2.2rem", md: "3.5rem" },
          background: isDark
            ? "linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)"
            : "linear-gradient(135deg, #1a1a2e 0%, #4a4a6a 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.5px",
          position: "relative",
        }}
      >
        Advanced Features
    
      </Typography>

      <Typography
        variant="h6"
        color="textSecondary"
        component={motion.p}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        sx={{
          fontWeight: 400,
          mb: 5,
          mx: "auto",
          maxWidth: "650px",
          lineHeight: 1.6,
        }}
      >
        Our platform combines cutting-edge technology with professional-grade tools 
        to elevate your coding and assessment experience. Updated for Code Quest's 
        with the latest features as of {/* Current date - formatted nicely */}May 30th, 2025.
      </Typography>
      
      
    </MotionBox>

          {/* Features Grid */}
          <Grid
            container
            spacing={5}
            style={{
              display: "flex",
              justifyContent: "center",
              minWeight: "100%",
            }}
          >
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  minWeight: "300px",
                  maxWidth: "400px",
                }}
              >
                <MotionPaper
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{
                    y: -10,
                    boxShadow: isDark
                      ? "0 25px 50px rgba(0, 0, 0, 0.2)"
                      : "0 25px 50px rgba(0, 0, 0, 0.1)",
                  }}
                  sx={{
                    height: "100%",
                    p: 4,
                    borderRadius: "24px",
                    backgroundColor: isDark
                      ? "rgba(30, 28, 28, 0.6)"
                      : "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(16px)",
                    border: `1px solid ${
                      isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"
                    }`,
                    boxShadow: isDark
                      ? "0 15px 35px rgba(0, 0, 0, 0.2)"
                      : "0 15px 35px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.3s ease-in-out",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Feature Icon */}
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "16px",
                      background: feature.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      mb: 3,
                      position: "relative",
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Animated shine effect */}
                    <Box
                      component={motion.div}
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        zIndex: 1,
                      }}
                    />
                    <Box sx={{ fontSize: 30, zIndex: 2 }}>{feature.icon}</Box>
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                    }}
                  >
                    {feature.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
  {/* CTA Section */}
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true, margin: "-100px" }}
      sx={{
        mt: { xs: 8, md: 0 },
        mb: { xs: 8, md: 5 },
        textAlign: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -60,
          right: { xs: "5%", md: "15%" },
          display: "flex",
          gap: 1,
        }}
      >
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4, type: "spring" }}
            viewport={{ once: true }}
            sx={{
              width: (3 - i) * 4,
              height: (3 - i) * 4,
              borderRadius: "50%",
              backgroundColor: theme.palette.primary.main,
              opacity: 0.3 + i * 0.2
            }}
          />
        ))}
      </Box>
      
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          mb: 3,
          mx: "auto",
          maxWidth: "800px",
          background: isDark
            ? "linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)"
            : "linear-gradient(135deg, #1a1a2e 0%, #4a4a6a 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Ready to Experience the Difference?
      </Typography>
      
      <Typography
        variant="h6"
        color="textSecondary"
        sx={{
          fontWeight: 400,
          mb: 4,
          mx: "auto",
          maxWidth: "700px",
        }}
      >
        Join thousands of developers who are already using our premium platform. 
        Start your coding journey today with a personalized experience.
      </Typography>
      
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
      >
        <Button
          variant="contained"
          size="large"
          sx={{
            borderRadius: "50px",
            py: 1.5,
            px: 4,
            background: theme.palette.gradients.primary,
            fontWeight: 700,
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 10px 20px rgba(188, 64, 55, 0.25)",
            '&:hover': {
              boxShadow: "0 15px 25px rgba(188, 64, 55, 0.35)",
              transform: "translateY(-3px)",
            },
            transition: "all 0.3s ease",
          }}
          startIcon={<PlayArrow />}
        >
          Get Started Free
        </Button>
        
        <Button
          variant="outlined"
          size="large"
          sx={{
            borderRadius: "50px",
            py: 1.5,
            px: 4,
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
            color: theme.palette.primary.main,
            fontWeight: 700,
            textTransform: "none",
            fontSize: "1rem",
            '&:hover': {
              borderWidth: 2,
              background: "rgba(188, 64, 55, 0.04)",
              transform: "translateY(-3px)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Compare Plans
        </Button>
      </Stack>
    </Box>
      {/* Languages Support Section */}
      <Box
  component="section"
  sx={{
    py: { xs: 10, md: 12 },
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* Enhanced background with gradient and pattern */}
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -2,
      background: isDark
        ? "linear-gradient(135deg, rgba(116, 116, 116, 0.16) 10%, rgb(9, 9, 9) 90%)"
        : "linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)",
    }}
  />
  
  {/* Subtle animated background pattern */}
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      opacity: 0.03,
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isDark ? 'ffffff' : '000000'}' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      backgroundSize: '40px 40px',
      animation: 'patternShift 120s linear infinite',
      "@keyframes patternShift": {
        "0%": { backgroundPosition: "0 0" },
        "100%": { backgroundPosition: "40px 40px" }
      }
    }}
  />

  <Container maxWidth="lg">

    <Grid container spacing={6} alignItems="center">
      {/* Left Column - Text Content */}
      <Grid item xs={12} md={5} minWidth={"100%"}>

         <MotionBox
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true, margin: "-100px" }}
      sx={{
        textAlign: "center",
        mb: { xs: 8, md: 3 },
        mx: "auto",
        maxWidth: "800px",
        position: "relative"
      }}
    >
      {/* Decorative dots */}
      <Box
        sx={{
          position: "absolute",
          top: -60,
          left: { xs: "5%", md: "15%" },
          display: "flex",
          gap: 1,
        }}
      >
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4, type: "spring" }}
            viewport={{ once: true }}
            sx={{
              width: (i + 1) * 4,
              height: (i + 1) * 4,
              borderRadius: "50%",
              backgroundColor: theme.palette.primary.main,
              opacity: 0.7 - i * 0.2
            }}
          />
        ))}
      </Box>

      {/* Animated overline with line */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box
          component={motion.div}
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          sx={{
            height: 3,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 3,
            mr: 2,
          }}
        />
        <Typography
          variant="overline"
          component={motion.div}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 700,
            letterSpacing: 2,
            fontSize: "0.9rem",
          }}
        >
          COMPREHENSIVE SUPPORT
        </Typography>
        <Box
          component={motion.div}
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          sx={{
            height: 3,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 3,
            ml: 2,
          }}
        />
      </Box>

      <Typography
        variant="h2"
        component={motion.h2}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        sx={{
          fontWeight: 800,
          mb: 3,
          fontSize: { xs: "2.2rem", md: "3.5rem" },
          background: isDark
            ? "linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)"
            : "linear-gradient(135deg, #1a1a2e 0%, #4a4a6a 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.5px",
          position: "relative",
        }}
      >
     Language Support
    
      </Typography>

      <Typography
        variant="h6"
        color="textSecondary"
        component={motion.p}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        sx={{
          fontWeight: 400,
          mb: 5,
          mx: "auto",
          maxWidth: "650px",
          lineHeight: 1.6,
        }}
      >
         
            Our platform offers comprehensive support for all major
            programming languages, with specialized compiler optimizations
            and language-specific features. Our team continuously updates and expands
            language capabilities to support your development needs.
      </Typography>
      <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Stack direction="row"  spacing={3} sx={{ mb: 5,justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{  textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: theme.palette.primary.main, 
                    fontWeight: 800 
                  }}
                >
                  <Countertops end={30} duration={2} />+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Languages
                </Typography>
              </Box>
              
              <Divider orientation="vertical" flexItem />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: theme.palette.primary.main, 
                    fontWeight: 800 
                  }}
                >
                  <Countertops end={240} duration={2.5} />+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Frameworks
                </Typography>
              </Box>
              
              <Divider orientation="vertical" flexItem />
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: theme.palette.primary.main, 
                    fontWeight: 800 
                  }}
                >
                  <Countertops end={99.9} duration={3} decimals={1} suffix="%" />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Uptime
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Button
            component={motion.button}
            whileHover={{ 
              scale: 1.03,
              boxShadow: '0 10px 25px rgba(188, 64, 55, 0.35)'
            }}
            whileTap={{ scale: 0.98 }}
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: "50px",
              px: 4,
              py: 1.5,
              background: theme.palette.gradients.primary,
              fontWeight: 600,
              mt: 2,
              textTransform: "none",
              boxShadow: '0 8px 20px rgba(188, 64, 55, 0.25)',
              transition: 'all 0.3s ease'
            }}
          >
            View All Languages
          </Button>
      
    </MotionBox>
        
      </Grid>
      
      {/* Right Column - Language Cards Grid */}
      <Grid item xs={12} md={7}>
        <MotionBox
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Language stats dashboard */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "24px",
              bgcolor: isDark
                ? "rgba(0, 0, 0, 0.15)"
                : "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${
                isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"
              }`,
              boxShadow: isDark
                ? "0 20px 40px rgba(0, 0, 0, 0.25)"
                : "0 20px 40px rgba(0, 0, 0, 0.12)",
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Header with dashboard title */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Code sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Language Support Dashboard
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Runtime optimization level and feature coverage
                </Typography>
              </Box>
             
            </Box>

            {/* Language progress bars */}
            <Grid container spacing={3}>
              {/* JavaScript */}
              <Grid item xs={12}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                  sx={{ mb: 1 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        component="img" 
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1.5
                        }}
                      />
                      <Typography fontWeight={700}>JavaScript</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="primary" fontWeight={700} mr={1}>
                        98%
                      </Typography>
                      <Chip 
                        label="Full Support" 
                        size="small" 
                        sx={{
                          bgcolor: 'success.main',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ position: 'relative', height: 12, mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={98}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.04)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                          background: 'linear-gradient(90deg, #F0DB4F 0%, #F0C000 100%)',
                        },
                      }}
                    />
                  </Box>
                </MotionBox>
              </Grid>

              {/* Python */}
              <Grid item xs={12}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                  sx={{ mb: 1 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        component="img" 
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1.5
                        }}
                      />
                      <Typography fontWeight={700}>Python</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="primary" fontWeight={700} mr={1}>
                        95%
                      </Typography>
                      <Chip 
                        label="Full Support" 
                        size="small" 
                        sx={{
                          bgcolor: 'success.main',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ position: 'relative', height: 12, mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={95}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.04)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                          background: 'linear-gradient(90deg, #4B8BBE 0%, #306998 100%)',
                        },
                      }}
                    />
                  </Box>
                </MotionBox>
              </Grid>

              {/* Java */}
              <Grid item xs={12}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  viewport={{ once: true }}
                  sx={{ mb: 1 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        component="img" 
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1.5
                        }}
                      />
                      <Typography fontWeight={700}>Java</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="primary" fontWeight={700} mr={1}>
                        92%
                      </Typography>
                      <Chip 
                        label="Full Support" 
                        size="small" 
                        sx={{
                          bgcolor: 'success.main',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ position: 'relative', height: 12, mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={92}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.04)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                          background: 'linear-gradient(90deg, #f89820 0%, #E76F00 100%)',
                        },
                      }}
                    />
                  </Box>
                </MotionBox>
              </Grid>

              {/* C++ */}
              <Grid item xs={12}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  viewport={{ once: true }}
                  sx={{ mb: 1 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        component="img" 
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1.5
                        }}
                      />
                      <Typography fontWeight={700}>C++</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="primary" fontWeight={700} mr={1}>
                        90%
                      </Typography>
                      <Chip 
                        label="Full Support" 
                        size="small" 
                        sx={{
                          bgcolor: 'success.main',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ position: 'relative', height: 12, mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={90}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.04)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                          background: 'linear-gradient(90deg, #659BD3 0%, #004482 100%)',
                        },
                      }}
                    />
                  </Box>
                </MotionBox>
              </Grid>

              {/* Go */}
              <Grid item xs={12}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  viewport={{ once: true }}
                  sx={{ mb: 1 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        component="img" 
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg"
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1.5
                        }}
                      />
                      <Typography fontWeight={700}>Go</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="primary" fontWeight={700} mr={1}>
                        86%
                      </Typography>
                      <Chip 
                        label="Beta Support" 
                        size="small" 
                        sx={{
                          bgcolor: 'warning.main',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ position: 'relative', height: 12, mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={86}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.04)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                          background: 'linear-gradient(90deg, #00ACD7 0%, #007d9c 100%)',
                        },
                      }}
                    />
                  </Box>
                </MotionBox>
              </Grid>

              {/* Ruby */}
              <Grid item xs={12}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  viewport={{ once: true }}
                  sx={{ mb: 1 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        component="img" 
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg"
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1.5
                        }}
                      />
                      <Typography fontWeight={700}>Ruby</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography color="primary" fontWeight={700} mr={1}>
                        84%
                      </Typography>
                      <Chip 
                        label="Beta Support" 
                        size="small" 
                        sx={{
                          bgcolor: 'warning.main',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ position: 'relative', height: 12, mb: 0 }}>
                    <LinearProgress
                      variant="determinate"
                      value={84}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.04)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 6,
                          background: 'linear-gradient(90deg, #CC342D 0%, #9a0c08 100%)',
                        },
                      }}
                    />
                  </Box>
                </MotionBox>
              </Grid>
            </Grid>

            {/* Footer with recent update info */}
            
          </Paper>
        </MotionBox>
      </Grid>
    </Grid>

    {/* Additional runtime features section */}
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      viewport={{ once: true, margin: "-100px" }}
      sx={{
        mt: 8,
        textAlign: "center",
        p: 3,
        borderRadius: '16px',
        border: '1px dashed',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ fontWeight: 700, mb: 3 }}
      >
        Runtime Features Coming Soon
      </Typography>
      
      <Grid container spacing={2} justifyContent="center">
        {['Rust', 'Swift', 'Kotlin', 'TypeScript'].map((lang, index) => (
          <Grid item key={index}>
            <Chip
              label={lang}
              icon={<NewReleasesOutlined />}
              sx={{
                bgcolor: isDark ? 'rgba(0, 0, 0, 0.65)' : 'rgba(0,0,0,0.02)',
                border: '1px solid',
                borderColor: theme.palette.primary.main + '40',
                px: 1,
                '& .MuiChip-label': { fontWeight: 600 },
                '& .MuiChip-icon': { color: theme.palette.primary.main }
              }}
            />
          </Grid>
        ))}
      </Grid>
      
     
    </Box>
  </Container>
</Box>

      {/* Competitions Section */}
      <Box
        component="section"
        sx={{
          py: { xs: 10, md: 10 },
          position: "relative",
        }}
      >
         {/* Enhanced background with gradient and pattern */}
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -2,
      background: isDark
        ? "linear-gradient(135deg, rgba(9, 9, 9, 0.83) 10%,  rgba(116, 116, 116, 0.16) 90%)"
        : "linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 90%)",
    }}
  />
        <Container maxWidth="lg">
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            sx={{
              textAlign: "center",
              mb: { xs: 6, md: 5 },
              mx: "auto",
              maxWidth: "800px",
            }}
          >
          {/* Animated overline with line */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
        }}
      >
        <Box
          component={motion.div}
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          sx={{
            height: 3,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 3,
            mr: 2,
          }}
        />
        <Typography
          variant="overline"
          component={motion.div}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 700,
            letterSpacing: 2,
            fontSize: "0.9rem",
          }}
        > 
          JOIN THE CHALLENGE
        </Typography>
        <Box
          component={motion.div}
          initial={{ width: 0 }}
          whileInView={{ width: 40 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          sx={{
            height: 3,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 3,
            ml: 2,
          }}
        />
      </Box>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                mb: 3,
                fontSize: { xs: "2.2rem", md: "3rem" },
              }}
            >
              Upcoming Competitions
            </Typography>

            <Typography
              variant="h6"
              color="textSecondary"
              sx={{
                fontWeight: 400,
                mb: 3,
                mx: "auto",
                maxWidth: "650px",
              }}
            >
              Participate in our global coding competitions and challenge
              yourself against the best programmers worldwide.
            </Typography>
          </MotionBox>

          <Grid container spacing={4}>
            {latestCompetitions.map((competition, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{
                    y: -10,
                    boxShadow: isDark
                      ? "0 25px 50px rgba(0, 0, 0, 0.2)"
                      : "0 25px 50px rgba(0, 0, 0, 0.1)",
                  }}
                  sx={{
                    borderRadius: "24px",
                    backgroundColor: isDark
                      ? "rgba(30, 28, 28, 0.6)"
                      : "rgba(255, 255, 255, 0.6)",
                    backdropFilter: "blur(16px)",
                    border: `1px solid ${
                      isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"
                    }`,
                    boxShadow: isDark
                      ? "0 15px 35px rgba(0, 0, 0, 0.2)"
                      : "0 15px 35px rgba(0, 0, 0, 0.05)",
                    overflow: "hidden",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      background:
                        index === 0
                          ? theme.palette.gradients.primary
                          : index === 1
                          ? "linear-gradient(135deg, #3a47d5 0%, #00d2ff 100%)"
                          : "linear-gradient(135deg, #2C3E50 0%, #4A6572 100%)",
                      color: "white",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Animated shine effect */}
                    <Box
                      component={motion.div}
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                        zIndex: 1,
                      }}
                    />
                    <Box sx={{ position: "relative", zIndex: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {competition.date}
                        </Typography>
                        <Chip
                          label={competition.status}
                          size="small"
                          sx={{
                            bgcolor:
                              competition.status === "Upcoming"
                                ? "rgba(255,255,255,0.2)"
                                : competition.status === "Registration Open"
                                ? "rgba(0,255,0,0.2)"
                                : "rgba(255,255,255,0.1)",
                            color: "white",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>
                      <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
                        {competition.title}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 7, flexGrow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Difficulty
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {competition.difficulty}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="textSecondary">
                          Participants
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {competition.participants.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          Prize Pool
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                          }}
                        >
                          {competition.prize}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{
                        borderRadius: "50px",
                        py: 1.2,
                        fontWeight: 600,
                        borderWidth: 2,
                        textTransform: "none",
                      }}
                    >
                      {competition.status === "Completed"
                        ? "View Results"
                        : "Join Competition"}
                    </Button>
                  </Box>
                </MotionCard>
              </Grid>
            ))}
          </Grid>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            sx={{
              mt: 6,
              textAlign: "center",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                borderRadius: "50px",
                px: 5,
                py: 1.8,
                fontWeight: 600,
                background: theme.palette.gradients.primary,
                boxShadow: "0 10px 20px rgba(188, 64, 55, 0.2)",
                textTransform: "none",
              }}
            >
              View All Competitions
            </Button>
          </MotionBox>
        </Container>
      </Box>

      {/* Testimonials Section - Enhanced Version */}
      <Box
        component="section"
        sx={{
          py: { xs: 10, md: 5 },
          position: "relative",
          overflow: "hidden",
          backgroundColor: "transparent",
        }}
      >
        {/* Advanced Background with Gradient & Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -2,
            background: isDark
              ? "linear-gradient(135deg, rgba(126, 126, 126, 0.4) 0%, rgba(10, 10, 10, 0.08)0%)"
              : "linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(251, 251, 251) 100%)",
          }}
        />

        {/* Animated Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='${
              isDark ? "%23ffffff" : "%23000000"
            }' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "150px 150px",
            animation: "patternMove 100s linear infinite",
            "@keyframes patternMove": {
              "0%": { backgroundPosition: "0 0" },
              "100%": { backgroundPosition: "1000px 1000px" },
            },
          }}
        />

        {/* Section Content */}
        <Container maxWidth="lg">
          {/* Section Header */}
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
            sx={{
              textAlign: "center",
              mb: { xs: 6, md: 10 },
              mx: "auto",
              maxWidth: "800px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 3,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 3,
                  mr: 1.5,
                }}
              />
              <Typography
                variant="overline"
                component="div"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  letterSpacing: 2,
                  fontSize: "0.9rem",
                }}
              >
                SUCCESS STORIES
              </Typography>
              <Box
                sx={{
                  width: 50,
                  height: 3,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 3,
                  ml: 1.5,
                }}
              />
            </Box>

            <Typography
              variant="h2"
              component={motion.h2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              sx={{
                fontWeight: 800,
                mb: 2.5,
                fontSize: { xs: "2.2rem", md: "3.5rem" },
                background: isDark
                  ? "linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)"
                  : "linear-gradient(135deg, #111111 0%, #555555 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-1px",
              }}
            >
              User Testimonials
            </Typography>

            <Typography
              variant="h6"
              color="textSecondary"
              sx={{
                fontWeight: 400,
                mb: 3,
                mx: "auto",
                maxWidth: "650px",
                lineHeight: 1.6,
              }}
            >
              Hear from our users about how our platform has transformed their
              coding and assessment experience. Real stories from real
              developers who've taken their skills to the next level.
            </Typography>

            {/* Testimonial Stats */}
            <Grid
              container
              spacing={2}
              justifyContent="center"
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              sx={{ mt: 2, mb: 6 }}
            >
              <Grid item>
                <Paper
                  elevation={0}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: "50px",
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.04)"
                      : "rgba(0, 0, 0, 0.02)",
                    border: "1px solid",
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.03)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <StarRate sx={{ color: "#FFD700", mr: 1 }} />
                  <Typography variant="body2" fontWeight={700}>
                    4.9/5 Average Rating
                  </Typography>
                </Paper>
              </Grid>
              <Grid item>
                <Paper
                  elevation={0}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: "50px",
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.04)"
                      : "rgba(0, 0, 0, 0.02)",
                    border: "1px solid",
                    borderColor: isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.03)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <People sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="body2" fontWeight={700}>
                    10,000+ Happy Users
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </MotionBox>

          {/* Testimonial Cards - Enhanced with 3D Effect */}
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionBox
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{
                    y: -15,
                    rotateY: 5,
                    rotateX: 5,
                  }}
                  sx={{
                    transformStyle: "preserve-3d",
                    height: "100%",
                    perspective: 1000,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 6,
                      borderRadius: "24px",
                      backgroundColor: isDark
                        ? "rgba(30, 28, 28, 0.7)"
                        : "rgb(255, 255, 255)",
                      backdropFilter: "blur(30px)",
                      border: `1px solid ${
                        isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"
                      }`,
                      boxShadow: isDark
                        ? "0 20px 40px rgba(0, 0, 0, 0.3)"
                        : "0 20px 40px rgba(0, 0, 0, 0.07)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Decorative quotation mark */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 20,
                        right: 20,
                        fontSize: "6rem",
                        lineHeight: 1,
                        fontFamily: "Georgia, serif",
                        color: isDark
                          ? "rgba(255,255,255,0.03)"
                          : "rgba(0,0,0,0.03)",
                        pointerEvents: "none",
                      }}
                    >
                    </Box>

                    {/* Gradient line */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "4px",
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      }}
                    />

                    {/* User info */}
                    <Box sx={{ mb: 3, display: "flex" }}>
                      <Box
                        sx={{
                          position: "relative",
                          mr: 2,
                        }}
                      >
                        <Avatar
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          sx={{
                            width: 70,
                            height: 70,
                            border: "3px solid",
                            borderColor: isDark
                              ? "rgba(255,255,255,0.1)"
                              : theme.palette.primary.main + "30",
                            boxShadow: isDark
                              ? "0 10px 20px rgba(0,0,0,0.2)"
                              : "0 10px 20px rgba(0,0,0,0.05)",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor: "#4CAF50",
                            border: "2px solid",
                            borderColor: isDark
                              ? "rgba(30, 28, 28, 0.7)"
                              : "rgb(255, 255, 255)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <CheckCircle
                            sx={{ fontSize: "0.9rem", color: "white" }}
                          />
                        </Box>
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ mb: 0.5 }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {testimonial.role}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        >
                          <Rating
                            name={`testimonial-rating-${index}`}
                            value={testimonial.rating}
                            readOnly
                            precision={0.5}
                            size="small"
                            sx={{
                              color: "#FFD700",
                              "& .MuiRating-iconEmpty": {
                                color: isDark
                                  ? "rgb(255, 255, 255)"
                                  : "rgba(0,0,0,0.2)",
                              },
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ ml: 1, fontWeight: 600 }}
                          >
                            {testimonial.rating.toFixed(1)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Testimonial text */}
                    <Typography
                      variant="body1"
                      sx={{
                        flexGrow: 1,
                        position: "relative",
                        fontStyle: "italic",
                        color: isDark
                          ? "rgba(255,255,255,0.85)"
                          : "rgba(0,0,0,0.75)",
                        lineHeight: 1.7,
                      }}
                    >
                      "{testimonial.feedback}"
                    </Typography>

                    {/* Additional details */}
                    <Box
                      sx={{
                        mt: 3,
                        pt: 2,
                        borderTop: "1px solid",
                        borderColor: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Chip
                        size="small"
                        label={testimonial.platform || "Code-Quest Platform"}
                        sx={{
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.04)",
                          fontWeight: 600,
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                      <Typography variant="caption" color="textSecondary">
                        {testimonial.date || "May 2025"}
                      </Typography>
                    </Box>
                  </Paper>
                </MotionBox>
              </Grid>
            ))}
          </Grid>

          {/* Testimonial Actions */}
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, margin: "-100px" }}
            sx={{
              mt: 8,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<RateReview />}
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 1.8,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 10px 20px ${theme.palette.primary.main}30`,
                textTransform: "none",
                fontSize: "1rem",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: `0 15px 30px ${theme.palette.primary.main}40`,
                  transform: "translateY(-3px)",
                },
              }}
            >
              Share Your Experience
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<FormatQuote />}
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 1.8,
                fontWeight: 700,
                borderColor: theme.palette.primary.main,
                borderWidth: "2px",
                textTransform: "none",
                fontSize: "1rem",
                "&:hover": {
                  borderWidth: "2px",
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)",
                },
              }}
            >
              View All Testimonials
            </Button>
          </MotionBox>
        </Container>
      </Box>
    </>
  );
};
export default HomePage;

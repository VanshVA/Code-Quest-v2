import React, { useState, useRef, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  Add,
  ContactSupport,
  ExpandMore,
  FilterList,
  Payment,
  QuestionAnswer,
  School,
  Search,
  Settings,
  Verified,
  ThumbUp,
  ThumbDown,
  AutoAwesome,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Current date and user info from global state
const CURRENT_DATE_TIME = "2025-05-29 21:58:16";
const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const FAQPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const [categoryValue, setCategoryValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPanel, setExpandedPanel] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState({});

  // Canvas animation for background
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size
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

  // Tabs for different FAQ categories
  const faqCategories = [
    { label: "All FAQs", value: 0, icon: <FilterList /> },
    { label: "Getting Started", value: 1, icon: <School /> },
    { label: "Account & Settings", value: 2, icon: <Settings /> },
    { label: "Billing & Payments", value: 3, icon: <Payment /> },
    { label: "Technical Support", value: 4, icon: <ContactSupport /> },
  ];

  // FAQ data
  const faqData = [
    {
      category: 1,
      question: "How do I get started with Code-Quest?",
      answer:
        "To get started with Code-Quest, simply create an account by clicking the 'Sign Up' button on our homepage. Once registered, you'll have access to our free tier which includes basic coding challenges and assessments. You can upgrade to premium plans anytime to unlock all features.",
    },
    {
      category: 1,
      question: "What programming languages does Code-Quest support?",
      answer:
        "Code-Quest currently supports over 30 programming languages, including JavaScript, Python, Java, C++, Ruby, Go, TypeScript, Swift, PHP, Kotlin, Rust, C#, and more. Our compiler infrastructure is regularly updated to support the latest language versions and features.",
    },
    {
      category: 1,
      question: "Are there beginner-friendly resources available?",
      answer:
        "Yes! We offer specialized tracks for beginners that include tutorials, guided challenges, and step-by-step learning paths. Our beginner resources cover fundamentals of programming, data structures, algorithms, and language-specific features.",
    },
    {
      category: 2,
      question: "How do I reset my password?",
      answer:
        "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to create a new password. For security reasons, password reset links expire after 24 hours.",
    },
    {
      category: 2,
      question: "Can I change my username?",
      answer:
        "Username changes are allowed once every 30 days. To change your username, go to Account Settings > Profile Information and click on the 'Edit Username' option. Note that if you change your username, your profile URL will also change.",
    },
    {
      category: 2,
      question: "How do I enable two-factor authentication?",
      answer:
        "We highly recommend enabling two-factor authentication (2FA) for additional account security. Navigate to Account Settings > Security, and click 'Enable 2FA'. You can choose between app-based authentication (like Google Authenticator) or SMS verification.",
    },
    {
      category: 3,
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit and debit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual subscriptions. For enterprise customers, we also offer invoice-based payment options with net-30 terms.",
    },
    {
      category: 3,
      question: "How do I upgrade my subscription?",
      answer:
        "To upgrade your subscription, go to Account Settings > Subscription and select 'Upgrade Plan'. You'll see all available plans and their features. Your new plan will be effective immediately, and we'll prorate any charges based on your current subscription.",
    },
    {
      category: 3,
      question: "Do you offer educational discounts?",
      answer:
        "Yes, we offer significant discounts for educational institutions and students. Educational institutions can receive up to 50% off on bulk licenses, while students with a valid .edu email address qualify for a 30% discount on Premium plans.",
    },
    {
      category: 4,
      question: "My code isn't executing properly. What should I do?",
      answer:
        "If your code isn't running as expected, first check for syntax errors and ensure you're using the correct language version. Our system logs provide detailed error messages. If problems persist, try clearing your browser cache or using a different browser. For further assistance, contact our technical support team.",
    },
    {
      category: 4,
      question: "How do I report a bug in the platform?",
      answer:
        "To report a bug, go to Help > Report a Bug. Please provide as much detail as possible including steps to reproduce the issue, expected vs. actual behavior, your browser and operating system, and screenshots if relevant. Our development team reviews all bug reports and prioritizes fixes accordingly.",
    },
    {
      category: 4,
      question: "What browser do you recommend for the best experience?",
      answer:
        "Code-Quest is optimized for modern browsers. We recommend using the latest versions of Chrome, Firefox, Safari, or Edge for the best experience. Our code editor and interactive features rely on modern web technologies that may not be fully supported in older browsers.",
    },
  ];

  // Handle tab change
  const handleCategoryChange = (event, newValue) => {
    setCategoryValue(newValue);
  };

  // Handle accordion expansion
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Handle feedback
  const handleFeedback = (questionId, isHelpful) => {
    setFeedbackGiven({
      ...feedbackGiven,
      [questionId]: isHelpful ? "helpful" : "not-helpful",
    });
  };

  // Filter FAQs based on category and search query
  const filteredFaqs = faqData.filter((faq) => {
    // Category filter
    if (categoryValue !== 0 && faq.category !== categoryValue) {
      return false;
    }

    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <>
      {/* Canvas Background for Premium Gradient Animation */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          overflow: "hidden",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        {/* Overlay for better text contrast */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: isDark
              ? "rgba(30, 28, 28, 0.8)"
              : "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(30px)",
          }}
        />
      </Box>

      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          position: "relative",
          pt: { xs: "100px", sm: "120px", md: "140px" },
          pb: { xs: "60px", sm: "80px", md: "100px" },
          overflow: "hidden",
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
            <Grid item xs={12} md={10} lg={8} sx={{ textAlign: "center" }}>
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 3, display: "inline-block" }}
              >
                <Chip
                  label="FAQ CODE-QUEST"
                  color="primary"
                  size="small"
                  icon={
                    <AutoAwesome
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
              <MotionBox>
                {/* Page Title */}
                <MotionTypography
                  variant="h1"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  sx={{
                    fontSize: { xs: "2.5rem", sm: "3rem", md: "3.8rem" },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: { xs: 3, md: 4 },
                    letterSpacing: "-0.02em",
                  }}
                >
                  Frequently Asked
                  <Box
                    component="span"
                    sx={{
                      display: "block",
                      background: theme.palette.gradients.primary,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textFillColor: "transparent",
                    }}
                  >
                    Questions
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
                    fontSize: { xs: "1.1rem", md: "1.3rem" },
                    maxWidth: "800px",
                    mx: "auto",
                  }}
                >
                  Find answers to our most commonly asked questions about
                  Code-Quest platform features, billing, and technical support.
                </MotionTypography>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box
        component="section"
        sx={{
          pb: { xs: 10, md: 15 },
          position: "relative",
        }}
      >
        <Container maxWidth="lg" style={{ minWidth: "100%" }}>
          <Grid
            container
            spacing={4}
            sx={{
              display: { md: "flex" },
              flexDirection: { md: "row" },
              flexWrap: { md: "nowrap" },
            }}
          >
            {/* Sidebar */}
            <Grid
              item
              xs={12}
              md={4}
              lg={3}
              sx={{ minWidth: { md: "300px" }, maxWidth: { md: "300px" } }}
            >
              <MotionBox
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Search */}
           

                {/* Categories */}
                <Paper
                  sx={{
                    p: 3,
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
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Categories
                  </Typography>

                  <Stack spacing={1}>
                    {faqCategories.map((category, index) => (
                      <Button
                        key={index}
                        variant={
                          categoryValue === category.value
                            ? "contained"
                            : "outlined"
                        }
                        color="primary"
                        onClick={(e) => handleCategoryChange(e, category.value)}
                        startIcon={category.icon}
                        sx={{
                          justifyContent: "flex-start",
                          px: 2,
                          py: 1,
                          borderRadius: "50px",
                          minWidth: "100%",
                          textTransform: "none",
                          backgroundColor:
                            categoryValue === category.value
                              ? theme.palette.primary.main
                              : "transparent",
                          "&:hover": {
                            backgroundColor:
                              categoryValue === category.value
                                ? theme.palette.primary.dark
                                : "rgba(188, 64, 55, 0.04)",
                          },
                          color:
                            categoryValue === category.value
                              ? "white"
                              : theme.palette.text.primary,
                          borderColor: theme.palette.primary.main,
                          fontWeight: 600,
                        }}
                      >
                        {category.label}
                      </Button>
                    ))}
                  </Stack>

                  {/* Contact Support Box */}
                  <Box
                    sx={{
                      mt: 4,
                      p: 3,
                      borderRadius: "16px",
                      backgroundColor: isDark
                        ? "rgba(20, 20, 20, 0.4)"
                        : "rgba(245, 245, 245, 0.7)",
                      textAlign: "center",
                    }}
                  >
                    <QuestionAnswer
                      color="primary"
                      sx={{
                        fontSize: "2.5rem",
                        mb: 1,
                      }}
                    />
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 700 }}
                    >
                      Still have questions?
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      Can't find what you're looking for? Contact our support
                      team for assistance.
                    </Typography>
                    <Button
                      component={RouterLink}
                      to="/contact"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      sx={{
                        borderRadius: "50px",
                        py: 1.2,
                        background: theme.palette.gradients.primary,
                      }}
                    >
                      Contact Support
                    </Button>
                  </Box>
                </Paper>
              </MotionBox>
            </Grid>

            {/* FAQs */}
            <Grid item xs={12} md={8} lg={9}>
              <MotionBox
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* FAQs Header */}

                <Paper
                  sx={{
                    p: 3,
                    mb: 3,
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {categoryValue === 0
                      ? "All Frequently Asked Questions"
                      : `${
                          faqCategories.find((c) => c.value === categoryValue)
                            ?.label
                        } FAQs`}
                  </Typography>
                  <Chip
                    label={`${filteredFaqs.length} Questions`}
                    color="primary"
                    size="small"
                  />
                </Paper>

                {/* FAQ Accordions */}
                <Stack spacing={2}>
                  {filteredFaqs.map((faq, index) => (
                    <MotionPaper
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
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
                          ? "0 10px 30px rgba(0, 0, 0, 0.15)"
                          : "0 10px 30px rgba(0, 0, 0, 0.05)",
                        overflow: "hidden",
                      }}
                    >
                      <Accordion
                        expanded={expandedPanel === `panel${index}`}
                        onChange={handleAccordionChange(`panel${index}`)}
                        disableGutters
                        elevation={0}
                        sx={{
                          backgroundColor: "transparent",
                          "&:before": {
                            display: "none",
                          },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMore
                              sx={{ color: isDark ? "white" : "black" }}
                            />
                          }
                          sx={{
                            px: 3,
                            py: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              pr: 2,
                            }}
                          >
                            {faq.question}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 3,
                              lineHeight: 1.7,
                            }}
                          >
                            {faq.answer}
                          </Typography>

                          {/* Was this helpful? */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              pt: 2,
                              borderTop: `1px solid ${
                                isDark
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.05)"
                              }`,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Was this answer helpful?
                            </Typography>
                            <Box>
                              <Tooltip title="Yes, this was helpful">
                                <IconButton
                                  size="small"
                                  color={
                                    feedbackGiven[`panel${index}`] === "helpful"
                                      ? "success"
                                      : "default"
                                  }
                                  disabled={
                                    feedbackGiven[`panel${index}`] ===
                                    "not-helpful"
                                  }
                                  onClick={() =>
                                    handleFeedback(`panel${index}`, true)
                                  }
                                >
                                  <ThumbUp
                                    fontSize="small"
                                    sx={{ color: isDark ? "white" : "black" }}
                                  />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="No, this wasn't helpful">
                                <IconButton
                                  size="small"
                                  color={
                                    feedbackGiven[`panel${index}`] ===
                                    "not-helpful"
                                      ? "error"
                                      : "default"
                                  }
                                  disabled={
                                    feedbackGiven[`panel${index}`] === "helpful"
                                  }
                                  onClick={() =>
                                    handleFeedback(`panel${index}`, false)
                                  }
                                  sx={{ ml: 1 }}
                                >
                                  <ThumbDown
                                    fontSize="small"
                                    sx={{ color: isDark ? "white" : "black" }}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </MotionPaper>
                  ))}
                </Stack>

                {filteredFaqs.length === 0 && (
                  <Paper
                    sx={{
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
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      No results found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      We couldn't find any FAQs matching your criteria. Try
                      adjusting your search or category filter.
                    </Typography>
                  </Paper>
                )}
              </MotionBox>
            </Grid>
          </Grid>

          {/* Submit a Question Box */}
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            sx={{
              p: 4,
              mt: 5,
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
              textAlign: "center",
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              Can't find what you're looking for?
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: "600px",
                mx: "auto",
              }}
            >
              If you couldn't find an answer to your question in our FAQs, you
              can submit your question or contact our support team for
              assistance.
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={5}>
                <Button
                  component={RouterLink}
                  to="/contact"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<Add />}
                  sx={{
                    py: 1.5,
                    borderRadius: "50px",
                    background: theme.palette.gradients.primary,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      color: "white",
                      transform: "translateY(-3px)",
                      "&::after": {
                        left: "100%",
                      },
                    },
                  }}
                >
                  Ask a Question
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <Button
                  component={RouterLink}
                  to="/feedback"
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: "50px",
                    fontWeight: 600,
                    textTransform: "none",
                  }}
                >
                  Give Feedback
                </Button>
              </Grid>
            </Grid>
          </MotionPaper>
        </Container>
      </Box>
    </>
  );
};

export default FAQPage;

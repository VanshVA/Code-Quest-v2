import React, { useRef, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  AutoAwesome,
  ArrowForward,
  Home,
  NavigateNext,
  Search,
  MenuBook,
  Code,
  SportsScore,
  QuestionAnswer,
  Quiz,
  GitHub,
  Bookmarks,
  ContentCopy,
  Check,
  Download,
  ChevronRight,
  Terminal,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Current date and user info from global state
const CURRENT_DATE_TIME = "2025-06-04 22:09:43";
const CURRENT_USER = "Anuj-prajapati-SDE";
const LAST_UPDATED = "June 1, 2025";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);

const DocumentationPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // State for tab navigation
  const [tabValue, setTabValue] = useState(0);
  const [activeSection, setActiveSection] = useState("introduction");
  
  // State for code copy functionality
  const [copiedStates, setCopiedStates] = useState({});
  
  // State for expandable sections
  const [expandedSections, setExpandedSections] = useState({
    "getting-started": true,
    "mcq-test": true,
    "qa-test": true,
    "coding-test": true,
    "results": true,
    "api": false,
    "advanced": false,
    "contributing": false
  });
  
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

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Toggle section expansion
  const toggleExpand = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Handle code copy
  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedStates({ ...copiedStates, [id]: true });
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [id]: false });
    }, 2000);
  };
  
  // Code samples
  const codeSamples = {
    mcqTest: `// Example of accessing MCQ Test data
import { getMCQQuestions } from 'code-quest/api';

// Get all questions for a specific difficulty
const easyQuestions = await getMCQQuestions({ difficulty: 'easy' });

// Submit answers
const submitAnswers = async (answers) => {
  try {
    const result = await api.submitMCQAnswers({
      answers: answers,
      timeSpent: timer.getTimeSpent()
    });
    return result.score;
  } catch (error) {
    console.error("Error submitting answers:", error);
  }
};`,
    qaTest: `// Example of Q&A Test functionality
import { getQAQuestions, submitQAAnswer } from 'code-quest/api';

// Load questions
const questions = await getQAQuestions({
  topic: 'dataStructures',
  limit: 5
});

// Submit a specific answer
const submitAnswer = async (questionId, answerText) => {
  try {
    const result = await submitQAAnswer({
      questionId: questionId,
      answer: answerText,
      timeSpent: calculateTimeSpent()
    });
    return result.feedback;
  } catch (error) {
    console.error("Error submitting answer:", error);
  }
};`,
    codingTest: `// Example of Coding Test implementation
import { CodeEditor, TestRunner } from 'code-quest/components';

const CodingChallenge = ({ challenge }) => {
  const [code, setCode] = useState(challenge.starterCode);
  const [testResults, setTestResults] = useState(null);
  
  const runTests = async () => {
    const results = await TestRunner.runTests({
      code: code,
      tests: challenge.tests,
      language: 'javascript'
    });
    setTestResults(results);
  };
  
  return (
    <>
      <CodeEditor 
        code={code} 
        onChange={setCode} 
        language="javascript" 
      />
      <Button onClick={runTests}>Run Tests</Button>
      {testResults && <TestResults results={testResults} />}
    </>
  );
};`,
    api: `// API Integration Example
import { CodeQuestAPI } from 'code-quest/api';

// Initialize the API with your authentication token
const api = new CodeQuestAPI({
  authToken: 'YOUR_AUTH_TOKEN',
  baseURL: 'https://api.codequest.edu'
});

// Get user progress across all challenges
const getUserProgress = async (userId) => {
  try {
    const progress = await api.getUserProgress(userId);
    return {
      mcqCompletion: progress.mcqCompletion,
      qaCompletion: progress.qaCompletion,
      codingCompletion: progress.codingCompletion,
      overallScore: progress.overallScore
    };
  } catch (error) {
    console.error("Failed to get user progress:", error);
    return null;
  }
};`
  };

  // Documentation sections
  const documentationSections = {
    introduction: {
      id: "introduction",
      title: "Introduction to Code Quest",
      icon: <MenuBook />,
      content: `
        Code Quest is a comprehensive coding competition platform designed to assess and enhance programming skills through multiple challenge formats. The platform features a three-tiered assessment approach: Multiple Choice Questions (MCQ), Question & Answer (Q&A), and Practical Coding Challenges. This documentation provides detailed guidance on using the platform, whether you're a participant, educator, or administrator.
        
        Key features of Code Quest include:
        
        • Comprehensive skill assessment across theoretical knowledge and practical coding
        • Real-time performance tracking and detailed feedback
        • Customizable competitions for different skill levels and goals
        • Secure testing environment with anti-cheating measures
        • Detailed analytics and result visualization
        
        This documentation will guide you through setting up, configuring, and utilizing all aspects of the Code Quest platform to create engaging coding competitions and assessments.
      `
    },
    "getting-started": {
      id: "getting-started",
      title: "Getting Started",
      icon: <SportsScore />,
      content: `
        ## Platform Requirements
        
        Code Quest is a web-based platform that works on any modern browser. For optimal performance, we recommend:
        
        • Latest Chrome, Firefox, Safari, or Edge browser
        • Minimum 4GB RAM
        • Stable internet connection (minimum 1Mbps)
        • Screen resolution of 1280×720 or higher
        
        ## Account Setup
        
        1. Navigate to [codequest.edu](https://codequest.edu) and click "Sign Up"
        2. Choose your account type: Participant, Educator, or Administrator
        3. Complete the registration form with your details
        4. Verify your email address through the confirmation link
        5. Set up your profile with professional information
        
        ## Dashboard Overview
        
        After logging in, you'll be directed to your dashboard which provides:
        
        • Available competitions and challenges
        • Your progress and performance metrics
        • Upcoming events and deadlines
        • Quick access to settings and profile management
        
        ## Creating Your First Competition
        
        For educators and administrators:
        
        1. Navigate to "Create Competition" in the dashboard
        2. Select the competition format (MCQ, Q&A, Coding, or Combined)
        3. Set the competition parameters (duration, difficulty, topic)
        4. Add participants through email invitations or group codes
        5. Review and launch your competition
      `
    },
    "mcq-test": {
      id: "mcq-test",
      title: "MCQ Test Module",
      icon: <Quiz />,
      content: `
        ## Overview
        
        The Multiple Choice Questions (MCQ) module tests theoretical knowledge across various programming concepts. Questions can range from language syntax to algorithm complexity analysis.
        
        ## Features
        
        • Configurable time limits for each question or the entire test
        • Support for code snippets within questions
        • Ability to flag questions for review
        • Question randomization to prevent cheating
        • Immediate or delayed scoring options
        
        ## Implementation Guide
        
        To implement MCQ tests in your competition:
        
        1. Access the MCQ Configuration panel
        2. Select questions from the question bank or create custom questions
        3. Set time limits and scoring parameters
        4. Configure review options and result display preferences
        5. Save and add to your competition flow
        
        ## Best Practices
        
        • Use a mix of easy, medium, and difficult questions
        • Include visual elements like code snippets or diagrams
        • Set reasonable time limits based on question complexity
        • Provide clear instructions about the scoring mechanism
      `
    },
    "qa-test": {
      id: "qa-test",
      title: "Q&A Test Module",
      icon: <QuestionAnswer />,
      content: `
        ## Overview
        
        The Question & Answer (Q&A) module assesses deeper understanding through free-text responses to programming scenarios and concepts.
        
        ## Features
        
        • Rich text editor for formatted answers
        • Support for code input with syntax highlighting
        • Auto-save functionality to prevent work loss
        • AI-assisted grading options for objectivity
        • Manual review capabilities with rubric guidance
        
        ## Implementation Guide
        
        To implement Q&A tests in your competition:
        
        1. Access the Q&A Configuration panel
        2. Create scenario-based questions or conceptual prompts
        3. Define grading rubrics for consistent evaluation
        4. Set word or character limits for responses
        5. Configure AI grading assistance if desired
        
        ## Best Practices
        
        • Ask questions that require critical thinking rather than memorization
        • Provide clear context for scenario-based questions
        • Create detailed rubrics for consistent scoring
        • Consider time requirements for thorough responses
      `
    },
    "coding-test": {
      id: "coding-test",
      title: "Coding Test Module",
      icon: <Code />,
      content: `
        ## Overview
        
        The Coding Test module evaluates practical programming skills through real-world challenges requiring working code solutions.
        
        ## Features
        
        • Integrated Monaco Editor with syntax highlighting
        • Multiple language support (JavaScript, Python, Java, C++, etc.)
        • Automated test case execution
        • Performance metrics tracking
        • Plagiarism detection
        
        ## Implementation Guide
        
        To implement Coding tests in your competition:
        
        1. Access the Coding Challenge Configuration panel
        2. Select or create programming challenges
        3. Define test cases for automated evaluation
        4. Configure execution environment settings
        5. Set time and memory limits for solutions
        
        ## Best Practices
        
        • Provide clear problem statements with example inputs/outputs
        • Include a mix of basic and edge case test scenarios
        • Set appropriate time limits for the complexity of challenges
        • Consider offering starter code for complex problems
        • Ensure test cases cover all essential functionality
      `
    },
    "results": {
      id: "results",
      title: "Results & Analytics",
      icon: <SportsScore />,
      content: `
        ## Overview
        
        The Results & Analytics module provides comprehensive insights into participant performance across all test modules.
        
        ## Features
        
        • Detailed scoring breakdown by test section
        • Performance comparison with peers
        • Time utilization analytics
        • Strength and weakness identification
        • Exportable reports in multiple formats
        
        ## Implementation Guide
        
        To configure results display for your competition:
        
        1. Access the Results Configuration panel
        2. Select metrics to display to participants
        3. Configure leaderboard settings if applicable
        4. Set up automated feedback based on performance
        5. Define report formats for download
        
        ## Best Practices
        
        • Balance competition through anonymized leaderboards
        • Provide constructive feedback on incorrect answers
        • Include improvement recommendations based on performance
        • Consider progressive result revelation for long competitions
      `
    },
    "api": {
      id: "api",
      title: "API Reference",
      icon: <Terminal />,
      content: `
        ## Overview
        
        Code Quest provides a comprehensive API for integrating the platform with your existing systems and extending functionality.
        
        ## Authentication
        
        All API requests require authentication using an API key or OAuth token:
        
        \`\`\`
        GET /api/v1/resources
        Authorization: Bearer YOUR_API_TOKEN
        \`\`\`
        
        ## Available Endpoints
        
        Core endpoints include:
        
        • \`/api/v1/competitions\` - Create and manage competitions
        • \`/api/v1/questions\` - Access and manage question banks
        • \`/api/v1/users\` - User management and progress tracking
        • \`/api/v1/results\` - Access and analyze competition results
        
        ## Rate Limiting
        
        API requests are limited to:
        
        • Standard tier: 1000 requests per day
        • Premium tier: 10,000 requests per day
        
        ## Webhook Integration
        
        Subscribe to events with webhooks:
        
        \`\`\`
        POST /api/v1/webhooks
        {
          "event": "competition.completed",
          "endpoint_url": "https://your-server.com/webhook",
          "secret_key": "your_signing_secret"
        }
        \`\`\`
      `
    },
    "advanced": {
      id: "advanced",
      title: "Advanced Configuration",
      icon: <Code />,
      content: `
        ## Custom Scoring Algorithms
        
        Create custom scoring formulas based on:
        
        • Time efficiency
        • Code quality metrics
        • Test case coverage
        • Solution optimality
        
        Example configuration:
        
        \`\`\`json
        {
          "scoring": {
            "correctness": 0.6,
            "efficiency": 0.3,
            "codeQuality": 0.1,
            "timePenalty": {
              "enabled": true,
              "factor": 0.05
            }
          }
        }
        \`\`\`
        
        ## Pluggable Grading Engines
        
        Integrate custom grading engines for specialized assessments:
        
        1. Implement the Grader interface
        2. Register your grader plugin in the system
        3. Configure grading parameters
        4. Associate with specific challenges
        
        ## Custom Test Environments
        
        For specific language or framework testing:
        
        1. Create a Docker container with required dependencies
        2. Configure the execution environment settings
        3. Define resource limits and security policies
        4. Upload to your Code Quest instance
        
        ## Integration with LMS Platforms
        
        Code Quest supports integration with popular Learning Management Systems:
        
        • Canvas
        • Moodle
        • Blackboard
        • Google Classroom
        
        Setup requires configuration of LTI parameters and API keys.
      `
    },
    "contributing": {
      id: "contributing",
      title: "Contributing to Code Quest",
      icon: <GitHub />,
      content: `
        ## Development Setup
        
        To set up a development environment:
        
        1. Fork the repository from [GitHub](https://github.com/code-quest/platform)
        2. Clone your fork: \`git clone https://github.com/YOUR-USERNAME/platform.git\`
        3. Install dependencies: \`npm install\`
        4. Start the development server: \`npm run dev\`
        
        ## Architecture Overview
        
        Code Quest is built with:
        
        • React frontend with Material UI
        • Node.js backend with Express
        • MongoDB database
        • Redis for caching
        • Docker for containerization
        
        ## Pull Request Guidelines
        
        When submitting contributions:
        
        1. Create a feature branch from \`develop\`
        2. Follow the code style guide
        3. Include unit tests for new features
        4. Update documentation as needed
        5. Submit PR against the \`develop\` branch
        
        ## Testing
        
        Run tests with:
        
        \`\`\`bash
        # Run unit tests
        npm run test
        
        # Run integration tests
        npm run test:integration
        
        # Run e2e tests
        npm run test:e2e
        \`\`\`
      `
    }
  };

  const sidebarSections = [
    {
      title: "Fundamentals",
      items: [
        documentationSections.introduction,
        documentationSections["getting-started"],
      ]
    },
    {
      title: "Core Modules",
      items: [
        documentationSections["mcq-test"],
        documentationSections["qa-test"],
        documentationSections["coding-test"],
        documentationSections["results"],
      ]
    },
    {
      title: "Advanced Topics",
      items: [
        documentationSections["api"],
        documentationSections["advanced"],
        documentationSections["contributing"],
      ]
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
          pt: { xs: '100px', sm: '120px', md: '120px' },
          pb: { xs: '60px', sm: '80px', md: '30px' },
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
                  label="DOCUMENTATION" 
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
                  Code Quest
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
                    Developer Documentation
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
                  Complete guide to implementing, customizing, and extending the Code Quest coding competition platform
                </MotionTypography>
              </MotionBox>
              
              {/* Search Bar */}
              <MotionPaper
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  p: 1,
                  pl: 2,
                  maxWidth: '600px',
                  mx: 'auto',
                  borderRadius: '100px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                  border: '1px solid',
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }}
              >
                <Search sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography
                  component="input"
                  sx={{
                    border: 'none',
                    background: 'transparent',
                    flexGrow: 1,
                    fontSize: '1rem',
                    py: 1,
                    outline: 'none',
                    color: 'text.primary',
                    '&::placeholder': {
                      color: 'text.secondary',
                      opacity: 0.7,
                    },
                    fontFamily: theme.typography.fontFamily,
                  }}
                  placeholder="Search documentation..."
                />
                <Chip 
                  label="Ctrl K" 
                  size="small" 
                  sx={{ 
                    bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    color: 'text.secondary',
                  }}
                />
              </MotionPaper>
              
              {/* Version Badge */}
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                sx={{ 
                  mt: 4,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2,
                  flexWrap: 'wrap'
                }}
              >
                <Chip 
                  label="Current Version: v2.5.0" 
                  size="small" 
                  color="primary"
                  variant="outlined"
                  sx={{ 
                    fontWeight: 500,
                    borderColor: isDark ? 'rgba(255,255,255,0.3)' : undefined,
                  }}
                />
                
                <Chip 
                  label={`Updated: ${LAST_UPDATED}`} 
                  size="small"
                  sx={{ 
                    bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                    fontWeight: 500,
                  }}
                />
                
                <Chip 
                  icon={<GitHub sx={{ fontSize: '1rem' }} />}
                  label="View on GitHub" 
                  component="a"
                  href="https://github.com/code-quest/platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  clickable
                  size="small"
                  sx={{ 
                    bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                    }
                  }}
                />
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Documentation Content */}
      <Box 
        component="section"
        sx={{ 
          pb: { xs: 10, md: 15 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          {/* Mobile Tabs Navigation */}
          {isMobile && (
            <Box sx={{ mb: 4 }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                  },
                  borderBottom: 1,
                  borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                }}
              >
                <Tab label="Fundamentals" />
                <Tab label="Core Modules" />
                <Tab label="Advanced" />
              </Tabs>
            </Box>
          )}
          
          <Grid container spacing={4} sx={{
            display: { md: 'flex' },
            flexDirection: { md: 'row' },
            flexWrap: { md: 'nowrap' }
          }}>
            {/* Sidebar Navigation */}
            {!isMobile && (
              <Grid item xs={12} md={3} sx={{ minWidth: { md: '280px' } }}>
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
                      <MenuBook 
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
                        Documentation
                      </Typography>
                    </Box>
                    
                    {/* Sidebar Navigation */}
                    <Stack spacing={2}>
                      {sidebarSections.map((section, sectionIndex) => (
                        <Box key={sectionIndex}>
                          <Typography
                            variant="overline"
                            sx={{
                              color: theme.palette.text.secondary,
                              fontWeight: 600,
                              display: 'block',
                              mb: 1,
                            }}
                          >
                            {section.title}
                          </Typography>
                          
                          <Stack spacing={0.5}>
                            {section.items.map((item) => (
                              <Button
                                key={item.id}
                                component="a"
                                href={`#${item.id}`}
                                variant="text"
                                color={activeSection === item.id ? "primary" : "inherit"}
                                onClick={() => setActiveSection(item.id)}
                                sx={{
                                  justifyContent: 'flex-start',
                                  textAlign: 'left',
                                  px: 1.5,
                                  py: 1,
                                  borderRadius: '8px',
                                  textTransform: 'none',
                                  fontWeight: activeSection === item.id ? 600 : 400,
                                  bgcolor: activeSection === item.id 
                                    ? (isDark ? 'rgba(188, 64, 55, 0.1)' : 'rgba(188, 64, 55, 0.05)')
                                    : 'transparent',
                                  '&:hover': {
                                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                  },
                                  fontSize: '0.95rem',
                                }}
                                startIcon={item.icon}
                              >
                                {item.title}
                              </Button>
                            ))}
                          </Stack>
                        </Box>
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
                    
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      startIcon={<GitHub />}
                      sx={{
                        borderRadius: '8px',
                        py: 1,
                        mt: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                    >
                      View Source
                    </Button>
                  </Paper>
                </MotionBox>
              </Grid>
            )}
            
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
                {Object.keys(documentationSections).map((sectionKey, index) => {
                  const section = documentationSections[sectionKey];
                  const contentLines = section.content.trim().split('\n');
                  
                  // Check if the first line is a ## heading
                  const hasSubheading = contentLines[0].startsWith('##');
                  const mainContent = hasSubheading ? contentLines.join('\n') : section.content;
                  
                  // Is this section in an expandable category? (not introduction)
                  const isExpandable = sectionKey !== 'introduction';
                  const isExpanded = expandedSections[sectionKey];
                  
                  return (
                    <Box key={section.id} id={section.id} sx={{ mb: 6 }}>
                      {/* Section Header with Icon */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Avatar
                          sx={{
                            bgcolor: isDark ? 'rgba(188, 64, 55, 0.2)' : 'rgba(188, 64, 55, 0.1)',
                            color: theme.palette.primary.main,
                            width: 48,
                            height: 48,
                            mr: 2,
                          }}
                        >
                          {section.icon}
                        </Avatar>
                        
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 700,
                              fontSize: { xs: '1.75rem', md: '2rem' },
                            }}
                          >
                            {section.title}
                          </Typography>
                        </Box>
                        
                        {/* Expand/Collapse button for non-intro sections */}
                        {isExpandable && (
                          <IconButton 
                            onClick={() => toggleExpand(sectionKey)}
                            size="small"
                            sx={{ 
                              bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                              ml: 1,
                            }}
                          >
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        )}
                      </Box>
                      
                      {/* Section Content */}
                      <Box
                        sx={{ 
                          maxHeight: isExpandable && !isExpanded ? '0px' : '10000px',
                          overflow: 'hidden',
                          transition: 'max-height 0.3s ease-in-out',
                        }}
                      >
                        {/* Render markdown-like content */}
                        {mainContent.split('\n\n').map((paragraph, pIndex) => {
                          // Check for headings
                          if (paragraph.startsWith('##')) {
                            const headingText = paragraph.replace(/^## /, '');
                            return (
                              <Typography 
                                key={`${section.id}-p-${pIndex}`}
                                variant="h5" 
                                sx={{ 
                                  fontWeight: 600,
                                  mt: 4,
                                  mb: 2,
                                }}
                              >
                                {headingText}
                              </Typography>
                            );
                          }
                          
                          // Check for lists
                          if (paragraph.includes('\n•')) {
                            const listItems = paragraph.split('\n• ');
                            const listTitle = listItems.shift();
                            
                            return (
                              <Box key={`${section.id}-p-${pIndex}`} sx={{ mt: 2, mb: 3 }}>
                                {listTitle && listTitle !== '• ' && (
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      mb: 1,
                                      fontWeight: 500,
                                    }}
                                  >
                                    {listTitle.replace('• ', '')}
                                  </Typography>
                                )}
                                
                                <Paper
                                  elevation={0}
                                  sx={{
                                    bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid',
                                    borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                  }}
                                >
                                  <Stack spacing={1}>
                                    {listItems.map((item, itemIndex) => (
                                      <Box 
                                        key={`${section.id}-list-${pIndex}-${itemIndex}`}
                                        sx={{ 
                                          display: 'flex',
                                          alignItems: 'flex-start',
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: '50%',
                                            bgcolor: theme.palette.primary.main,
                                            mt: 1,
                                            mr: 2,
                                          }}
                                        />
                                        <Typography variant="body1">
                                          {item}
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Stack>
                                </Paper>
                              </Box>
                            );
                          }
                          
                          // Regular paragraph
                          return (
                            <Typography 
                              key={`${section.id}-p-${pIndex}`}
                              variant="body1" 
                              paragraph
                              sx={{ 
                                lineHeight: 1.8,
                              }}
                            >
                              {paragraph}
                            </Typography>
                          );
                        })}
                        
                        {/* Code Samples for specific sections */}
                        {sectionKey === 'mcq-test' && (
                          <Paper
                            elevation={0}
                            sx={{
                              mt: 4,
                              mb: 3,
                              borderRadius: 2,
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                          >
                            <Box
                              sx={{
                                p: 1.5,
                                bgcolor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography variant="caption" fontWeight={600} sx={{ pl: 1 }}>
                                MCQ Test Implementation
                              </Typography>
                              
                              <IconButton
                                size="small"
                                onClick={() => handleCopyCode(codeSamples.mcqTest, 'mcqTest')}
                                sx={{
                                  color: theme.palette.text.secondary,
                                  '&:hover': {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                              >
                                {copiedStates['mcqTest'] ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                              </IconButton>
                            </Box>
                            
                            <SyntaxHighlighter
                              language="javascript"
                              style={isDark ? vscDarkPlus : prism}
                              customStyle={{
                                margin: 0,
                                padding: '16px',
                                fontSize: '0.9rem',
                                borderRadius: 0,
                                backgroundColor: isDark ? '#1E1E1E' : '#F8F8F8',
                              }}
                            >
                              {codeSamples.mcqTest}
                            </SyntaxHighlighter>
                          </Paper>
                        )}
                        
                        {sectionKey === 'qa-test' && (
                          <Paper
                            elevation={0}
                            sx={{
                              mt: 4,
                              mb: 3,
                              borderRadius: 2,
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                          >
                            <Box
                              sx={{
                                p: 1.5,
                                bgcolor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography variant="caption" fontWeight={600} sx={{ pl: 1 }}>
                                Q&A Test Implementation
                              </Typography>
                              
                              <IconButton
                                size="small"
                                onClick={() => handleCopyCode(codeSamples.qaTest, 'qaTest')}
                                sx={{
                                  color: theme.palette.text.secondary,
                                  '&:hover': {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                              >
                                {copiedStates['qaTest'] ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                              </IconButton>
                            </Box>
                            
                            <SyntaxHighlighter
                              language="javascript"
                              style={isDark ? vscDarkPlus : prism}
                              customStyle={{
                                margin: 0,
                                padding: '16px',
                                fontSize: '0.9rem',
                                borderRadius: 0,
                                backgroundColor: isDark ? '#1E1E1E' : '#F8F8F8',
                              }}
                            >
                              {codeSamples.qaTest}
                            </SyntaxHighlighter>
                          </Paper>
                        )}
                        
                        {sectionKey === 'coding-test' && (
                          <Paper
                            elevation={0}
                            sx={{
                              mt: 4,
                              mb: 3,
                              borderRadius: 2,
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                          >
                            <Box
                              sx={{
                                p: 1.5,
                                bgcolor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography variant="caption" fontWeight={600} sx={{ pl: 1 }}>
                                Coding Test Implementation
                              </Typography>
                              
                              <IconButton
                                size="small"
                                onClick={() => handleCopyCode(codeSamples.codingTest, 'codingTest')}
                                sx={{
                                  color: theme.palette.text.secondary,
                                  '&:hover': {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                              >
                                {copiedStates['codingTest'] ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                              </IconButton>
                            </Box>
                            
                            <SyntaxHighlighter
                              language="javascript"
                              style={isDark ? vscDarkPlus : prism}
                              customStyle={{
                                margin: 0,
                                padding: '16px',
                                fontSize: '0.9rem',
                                borderRadius: 0,
                                backgroundColor: isDark ? '#1E1E1E' : '#F8F8F8',
                              }}
                            >
                              {codeSamples.codingTest}
                            </SyntaxHighlighter>
                          </Paper>
                        )}
                        
                        {sectionKey === 'api' && (
                          <Paper
                            elevation={0}
                            sx={{
                              mt: 4,
                              mb: 3,
                              borderRadius: 2,
                              overflow: 'hidden',
                              position: 'relative',
                            }}
                          >
                            <Box
                              sx={{
                                p: 1.5,
                                bgcolor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography variant="caption" fontWeight={600} sx={{ pl: 1 }}>
                                API Integration Example
                              </Typography>
                              
                              <IconButton
                                size="small"
                                onClick={() => handleCopyCode(codeSamples.api, 'api')}
                                sx={{
                                  color: theme.palette.text.secondary,
                                  '&:hover': {
                                    color: theme.palette.primary.main,
                                  },
                                }}
                              >
                                {copiedStates['api'] ? <Check fontSize="small" /> : <ContentCopy fontSize="small" />}
                              </IconButton>
                            </Box>
                            
                            <SyntaxHighlighter
                              language="javascript"
                              style={isDark ? vscDarkPlus : prism}
                              customStyle={{
                                margin: 0,
                                padding: '16px',
                                fontSize: '0.9rem',
                                borderRadius: 0,
                                backgroundColor: isDark ? '#1E1E1E' : '#F8F8F8',
                              }}
                            >
                              {codeSamples.api}
                            </SyntaxHighlighter>
                          </Paper>
                        )}
                      </Box>
                      
                      {/* Divider at end of section */}
                      {index < Object.keys(documentationSections).length - 1 && (
                        <Divider sx={{ mt: 5 }} />
                      )}
                    </Box>
                  );
                })}
                
                {/* Documentation Feedback Section */}
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
                    Was this documentation helpful?
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ mb: 3 }}
                  >
                    We're continuously improving our documentation. If you have suggestions or found issues,
                    please let us know or contribute directly on GitHub.
                  </Typography>
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2}
                    justifyContent="center"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        borderRadius: '8px',
                        px: 4,
                        py: 1,
                        background: theme.palette.gradients.primary,
                        textTransform: 'none',
                        fontWeight: 600,
                      }}
                      startIcon={<GitHub />}
                    >
                      Contribute
                    </Button>
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
                      Report Issue
                    </Button>
                  </Stack>
                </Box>
                
                {/* Page Navigation - Next/Previous */}
                <Grid container spacing={2} sx={{ mt: 6 }}>
                  <Grid item xs={6}>
                    <Button
                      component={RouterLink}
                      to="/getting-started"
                      variant="outlined"
                      color="primary"
                      fullWidth
                      startIcon={<ArrowForward sx={{ transform: 'rotate(180deg)' }} />}
                      sx={{
                        justifyContent: 'flex-start',
                        p: 2,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        height: '100%',
                      }}
                    >
                      <Box textAlign="left">
                        <Typography variant="caption" display="block" color="text.secondary">
                          Previous
                        </Typography>
                        <Typography variant="subtitle2">
                          Getting Started
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Button
                      component={RouterLink}
                      to="/api-reference"
                      variant="outlined"
                      color="primary"
                      fullWidth
                      endIcon={<ArrowForward />}
                      sx={{
                        justifyContent: 'flex-end',
                        p: 2,
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        height: '100%',
                      }}
                    >
                      <Box textAlign="right">
                        <Typography variant="caption" display="block" color="text.secondary">
                          Next
                        </Typography>
                        <Typography variant="subtitle2">
                          API Reference
                        </Typography>
                      </Box>
                    </Button>
                  </Grid>
                </Grid>
                
                {/* Last Updated Info */}
                <Box sx={{ mt: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Last updated: {LAST_UPDATED}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current version: v2.5.0
                  </Typography>
                </Box>
              </MotionPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default DocumentationPage;
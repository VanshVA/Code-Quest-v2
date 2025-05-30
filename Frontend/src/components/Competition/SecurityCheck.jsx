import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent, 
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  AlertTitle,
  useTheme,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  LockOutlined,
  DesktopMac,
  Security,
  WebAsset,
  FitnessCenter,
  Close,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const SecurityCheck = ({ onComplete }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [checks, setChecks] = useState({
    browser: { status: 'checking', message: '' },
    screenSize: { status: 'checking', message: '' },
    fullscreen: { status: 'checking', message: '' },
    notifications: { status: 'checking', message: '' },
    performance: { status: 'checking', message: '' },
  });
  const [allChecksComplete, setAllChecksComplete] = useState(false);
  const [securityWarnings, setSecurityWarnings] = useState([]);
  
  // Run checks in sequence
  useEffect(() => {
    const runSecurityChecks = async () => {
      // Step 1: Browser compatibility
      await checkBrowser();
      
      // Step 2: Screen size check
      await checkScreenSize();
      
      // Step 3: Fullscreen capability
      await checkFullscreenSupport();
      
      // Step 4: Notification permissions
      await checkNotificationsPermission();
      
      // Step 5: Performance benchmark
      await checkPerformance();
      
      // All checks complete
      setAllChecksComplete(true);
    };
    
    runSecurityChecks();
  }, []);
  
  // Browser compatibility check
  const checkBrowser = async () => {
    await simulateCheck();
    
    const userAgent = navigator.userAgent.toLowerCase();
    let browserOk = false;
    let message = '';
    
    // Check browser
    if (userAgent.indexOf('chrome') > -1 || userAgent.indexOf('firefox') > -1 || userAgent.indexOf('safari') > -1) {
      browserOk = true;
      message = 'Your browser is compatible.';
    } else {
      browserOk = false;
      message = 'Your browser may not be fully compatible. We recommend using Chrome, Firefox, or Safari.';
      setSecurityWarnings(prev => [...prev, 'Browser compatibility issues detected']);
    }
    
    setChecks(prev => ({
      ...prev,
      browser: { 
        status: browserOk ? 'passed' : 'warning', 
        message
      }
    }));
    
    setActiveStep(1);
  };
  
  // Screen size check
  const checkScreenSize = async () => {
    await simulateCheck();
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const minWidth = 768;
    const minHeight = 600;
    
    let screenSizeOk = width >= minWidth && height >= minHeight;
    let message = screenSizeOk 
      ? `Your screen size (${width}x${height}) is adequate.`
      : `Your screen size (${width}x${height}) is smaller than recommended (${minWidth}x${minHeight}).`;
    
    if (!screenSizeOk) {
      setSecurityWarnings(prev => [...prev, 'Screen size is smaller than recommended']);
    }
    
    setChecks(prev => ({
      ...prev,
      screenSize: { 
        status: screenSizeOk ? 'passed' : 'warning', 
        message
      }
    }));
    
    setActiveStep(2);
  };
  
  // Fullscreen support check
  const checkFullscreenSupport = async () => {
    await simulateCheck();
    
    const fullscreenEnabled = document.fullscreenEnabled || 
      document.webkitFullscreenEnabled || 
      document.mozFullScreenEnabled || 
      document.msFullscreenEnabled;
    
    let message = fullscreenEnabled 
      ? 'Fullscreen mode is supported.'
      : 'Fullscreen mode is not supported in your browser.';
    
    if (!fullscreenEnabled) {
      setSecurityWarnings(prev => [...prev, 'Fullscreen mode not supported']);
    }
    
    setChecks(prev => ({
      ...prev,
      fullscreen: { 
        status: fullscreenEnabled ? 'passed' : 'warning', 
        message
      }
    }));
    
    setActiveStep(3);
  };
  
  // Notifications permission check
  const checkNotificationsPermission = async () => {
    await simulateCheck();
    
    let status = 'warning';
    let message = 'Notification permission not granted.';
    
    // Check if Notification API is supported
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        status = 'passed';
        message = 'Notification permission granted.';
      } else if (Notification.permission !== 'denied') {
        // Ask for permission
        try {
          const permission = await Notification.requestPermission();
          status = permission === 'granted' ? 'passed' : 'warning';
          message = permission === 'granted' 
            ? 'Notification permission granted.'
            : 'Notification permission not granted.';
        } catch (error) {
          status = 'warning';
          message = 'Could not request notification permission.';
        }
      }
    } else {
      message = 'Notifications not supported in your browser.';
    }
    
    if (status === 'warning') {
      setSecurityWarnings(prev => [...prev, 'Notifications not enabled']);
    }
    
    setChecks(prev => ({
      ...prev,
      notifications: { status, message }
    }));
    
    setActiveStep(4);
  };
  
  // Performance benchmark
  const checkPerformance = async () => {
    await simulateCheck();
    
    // Simple performance test
    const startTime = performance.now();
    let counter = 0;
    const iterations = 10000000; // 10 million iterations
    
    for (let i = 0; i < iterations; i++) {
      counter++;
    }
    
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    
    // Threshold in milliseconds
    const threshold = 100;
    const performanceOk = timeTaken < threshold;
    let message = performanceOk
      ? `Performance check passed. Completed in ${timeTaken.toFixed(2)}ms.`
      : `Performance may be slower than optimal. Completed in ${timeTaken.toFixed(2)}ms.`;
    
    if (!performanceOk) {
      setSecurityWarnings(prev => [...prev, 'System performance below optimal levels']);
    }
    
    setChecks(prev => ({
      ...prev,
      performance: { 
        status: performanceOk ? 'passed' : 'warning', 
        message
      }
    }));
    
    setActiveStep(5);
  };
  
  // Simulate delay for checks
  const simulateCheck = () => {
    return new Promise(resolve => setTimeout(resolve, 800));
  };
  
  // Get icon based on check status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'failed':
        return <Error color="error" />;
      case 'checking':
      default:
        return <CircularProgress size={20} />;
    }
  };
  
  // Handle completion
  const handleComplete = () => {
    onComplete();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Security and Compatibility Check
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        We need to run some checks to ensure your system is ready for the competition.
        This helps prevent technical issues during the contest.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel
            StepIconComponent={() => getStatusIcon(checks.browser.status)}
          >
            Browser Compatibility
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary">
              Checking if your browser is compatible with our code editor...
            </Typography>
            {checks.browser.status !== 'checking' && (
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                {checks.browser.message}
              </Typography>
            )}
          </StepContent>
        </Step>
        
        <Step>
          <StepLabel
            StepIconComponent={() => getStatusIcon(checks.screenSize.status)}
          >
            Screen Size Check
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary">
              Checking if your screen size is suitable for coding...
            </Typography>
            {checks.screenSize.status !== 'checking' && (
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                {checks.screenSize.message}
              </Typography>
            )}
          </StepContent>
        </Step>
        
        <Step>
          <StepLabel
            StepIconComponent={() => getStatusIcon(checks.fullscreen.status)}
          >
            Fullscreen Capability
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary">
              Checking if fullscreen mode is supported...
            </Typography>
            {checks.fullscreen.status !== 'checking' && (
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                {checks.fullscreen.message}
              </Typography>
            )}
          </StepContent>
        </Step>
        
        <Step>
          <StepLabel
            StepIconComponent={() => getStatusIcon(checks.notifications.status)}
          >
            Notification Permissions
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary">
              Checking notification permissions for important alerts...
            </Typography>
            {checks.notifications.status !== 'checking' && (
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                {checks.notifications.message}
              </Typography>
            )}
          </StepContent>
        </Step>
        
        <Step>
          <StepLabel
            StepIconComponent={() => getStatusIcon(checks.performance.status)}
          >
            Performance Benchmark
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary">
              Testing system performance...
            </Typography>
            {checks.performance.status !== 'checking' && (
              <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                {checks.performance.message}
              </Typography>
            )}
          </StepContent>
        </Step>
      </Stepper>
      
      {allChecksComplete && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{ mt: 3 }}
        >
          <Divider sx={{ my: 2 }} />
          
          {securityWarnings.length > 0 && (
            <Alert 
              severity="warning" 
              variant="outlined"
              sx={{ mb: 3, borderRadius: '12px' }}
            >
              <AlertTitle>Some checks have warnings</AlertTitle>
              <Typography variant="body2">
                You can continue, but you might experience some issues during the competition:
              </Typography>
              <List dense disablePadding sx={{ mt: 1 }}>
                {securityWarnings.map((warning, index) => (
                  <ListItem key={index} sx={{ py: 0.25 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Warning fontSize="small" color="warning" />
                    </ListItemIcon>
                    <ListItemText primary={warning} />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Security Rules:
              </Typography>
              <List dense disablePadding>
                <ListItem sx={{ p: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Security fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="No tab switching allowed during the competition" 
                    secondary="Switching tabs may result in disqualification"
                  />
                </ListItem>
                <ListItem sx={{ p: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <WebAsset fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="External resources not allowed" 
                    secondary="You may only use the provided editor and documentation"
                  />
                </ListItem>
                <ListItem sx={{ p: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <LockOutlined fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Your work will be submitted automatically" 
                    secondary="When time expires or if you submit manually"
                  />
                </ListItem>
              </List>
            </Box>
          </Box>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleComplete}
              sx={{
                borderRadius: '12px',
                py: 1.2,
                px: 4,
                fontWeight: 'bold',
                bgcolor: 'var(--theme-color)',
                '&:hover': {
                  bgcolor: 'var(--hover-color)',
                },
              }}
            >
              I Understand and Accept
            </Button>
          </Box>
        </MotionBox>
      )}
    </Box>
  );
};

export default SecurityCheck;
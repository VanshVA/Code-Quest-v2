import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  CircularProgress
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import RuleIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Timer from '@mui/icons-material/Timer';
import TabIcon from '@mui/icons-material/Tab';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import QuizIcon from '@mui/icons-material/Quiz';
import PersonIcon from '@mui/icons-material/Person';
import axios from 'axios';

// Import competition component types
import Code from '../../components/Dashboard/CodePage';
import Mcq from '../../components/Dashboard/McqPage';
import Text from '../../components/Dashboard/TextPage';
import CompetitionDisqualifyPage from './CompetitonDisqualifyPage';
import { reportStudentDisqualification } from '../../services/api';

function CompetitionExamPage() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(true); // Changed to true by default
  const [joinLoading, setJoinLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const [violationsCount, setViolationsCount] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const MAX_VIOLATIONS = 2; // Number of warnings before disqualification

  const navigate = useNavigate();
  const location = useLocation();
  const { competitionId } = useParams();

  // Access the competition data passed through navigation state
  const [competition, setCompetition] = useState(location.state?.competition);

  // API URL from environment variable or default to localhost
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Create axios instance with default config
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add token to requests if available
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle response and errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.message || 'Something went wrong';
      return Promise.reject({ message });
    }
  );
  // Check if user is already disqualified (from API only)
  useEffect(() => {
    const StudentDisqualificationStatus = async () => {
      setLoading(true);

      try {
        if (!competition?._id) {
          console.error("Competition ID not available");
          return;
        }
        
        // Verify with the server using POST and sending competitionId in the body
        const response = await api.post(`${API_URL}/student/dashboard/competitions/disqualified`, {
            competitionId: competition._id
        });
        
        console.log('Disqualification status response:', response);

        if (response.data?.data?.disqualification) {
          const disqualificationInfo = response.data.data.disqualification;
          // Update local state
          setLoading(false);
          setIsDisqualified(true);
          setDisqualificationReason(disqualificationInfo.reason || 'Disqualified by competition administrator');
          
          // Immediately render the disqualification page without waiting for the next render cycle
          return;
        }
      } catch (error) {
        console.error("Error checking disqualification status:", error);
        // Don't set error state to avoid confusing the student
        // If this fails, we'll assume they're not disqualified
      } finally {
        setLoading(false);
      }
    };

    if (competition?._id) {
      StudentDisqualificationStatus();
    }
  }, [competition]);
  
  // Disqualify function
  const disqualifyUser = async (reason) => {
    // Set disqualification state
    setIsDisqualified(true);
    setDisqualificationReason(reason);
    // Report to backend
    try {
      console.log('Reporting disqualification to server:', competition._id, reason);
      const response = await reportStudentDisqualification(competition._id, reason);
    } catch (error) {
      console.error('Failed to report disqualification to server:', error);
    }
  };

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (examStarted && document.visibilityState === 'hidden') {
        handleSecurityViolation('Tab or window switching detected');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examStarted]);

  // Handle security violation
  const handleSecurityViolation = (reason) => {
    // Show warning for first violations
    if (violationsCount < MAX_VIOLATIONS) {
      setViolationsCount(prev => prev + 1);
      setShowViolationWarning(true);
      toast.error(`Security violation: ${reason}. Warning ${violationsCount + 1}/${MAX_VIOLATIONS}`);
    } else {
      // Pass to the current component (MCQ/Code/Text) to handle disqualification
      setIsDisqualified(true);
      setDisqualificationReason(reason);
    }
  };

  // Disable keyboard shortcuts
  useEffect(() => {
    if (!examStarted) return;

    const handleKeyDown = (e) => {
      // Detect keyboard combinations for dev tools, tab switching, copy/paste
      const isCtrlKey = e.ctrlKey || e.metaKey; // metaKey for Mac

      // Prevent F12, Ctrl+Shift+I (Inspect)
      if (e.key === 'F12' || (isCtrlKey && e.shiftKey && (e.key === 'i' || e.key === 'I'))) {
        e.preventDefault();
        handleSecurityViolation('Attempt to open developer tools');
        return;
      }

      // Prevent Alt+Tab, Ctrl+Tab (tab switching)
      if ((e.altKey && e.key === 'Tab') || (isCtrlKey && e.key === 'Tab')) {
        e.preventDefault();
        handleSecurityViolation('Attempt to switch tabs');
        return;
      }

      // Prevent copy/paste operations
      if (isCtrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' ||
        e.key === 'C' || e.key === 'V' || e.key === 'X')) {
        e.preventDefault();
        handleSecurityViolation('Attempt to copy or paste content');
        return;
      }

      // Prevent printing
      if (isCtrlKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        handleSecurityViolation('Attempt to print page');
        return;
      }

      // Prevent saving page
      if (isCtrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSecurityViolation('Attempt to save page');
        return;
      }

      // Prevent new window/tab
      if (isCtrlKey && (e.key === 't' || e.key === 'T' || e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        handleSecurityViolation('Attempt to open new tab/window');
        return;
      }
    };

    // Prevent right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      handleSecurityViolation('Attempt to use context menu');
      return false;
    };

    // Prevent copying
    const handleCopy = (e) => {
      if (examStarted) {
        e.preventDefault();
        handleSecurityViolation('Attempt to copy content');
        return false;
      }
    };

    // Prevent pasting
    const handlePaste = (e) => {
      if (examStarted) {
        e.preventDefault();
        handleSecurityViolation('Attempt to paste content');
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('cut', handleCopy);

    // Clean up event listeners
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('cut', handleCopy);
    };
  }, [examStarted, violationsCount]);

  // Request full screen when component mounts
  useEffect(() => {
    const enterFullScreen = async () => {
      try {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          await element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          await element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          await element.msRequestFullscreen();
        }
        setIsFullScreen(true);
      } catch (err) {
        console.error('Failed to enter fullscreen:', err);
      }
    };

    enterFullScreen();

    // Check fullscreen status
    const checkFullScreen = () => {
      const isCurrentlyFullScreen = !!(
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );

      setIsFullScreen(isCurrentlyFullScreen);
      if (!isCurrentlyFullScreen && examStarted) {
        // Disqualify immediately if exiting fullscreen during exam
        disqualifyUser('Exited fullscreen mode during examination');
      } else if (!isCurrentlyFullScreen) {
        setOpenWarningDialog(true);
      }
    };

    // Add event listeners for fullscreen changes
    document.addEventListener('fullscreenchange', checkFullScreen);
    document.addEventListener('webkitfullscreenchange', checkFullScreen);
    document.addEventListener('mozfullscreenchange', checkFullScreen);
    document.addEventListener('MSFullscreenChange', checkFullScreen);

    return () => {
      // Remove event listeners on cleanup
      document.removeEventListener('fullscreenchange', checkFullScreen);
      document.removeEventListener('webkitfullscreenchange', checkFullScreen);
      document.removeEventListener('mozfullscreenchange', checkFullScreen);
      document.removeEventListener('MSFullscreenChange', checkFullScreen);
    };
  }, [examStarted]);

  const handleEnterFullScreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      setIsFullScreen(true);
      setOpenWarningDialog(false);
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
    }
  };

  const handleJoinCompetition = async () => {
    if (!competition?._id) {
      toast.error('Competition details not available');
      return;
    }

    setJoinLoading(true);
    setError(null);

    try {
      // Call the join competition API
      const response = await api.post(`/student/dashboard/competitions/${competition._id}/join`);

      if (response.data.success) {
        toast.success('Successfully joined the competition');

        // Start the exam - small delay for user to see success message
        setTimeout(() => {
          setExamStarted(true);
        }, 1000);

      } else {
        toast.error(response.data.message || 'Failed to join competition');
      }
    } catch (error) {
      toast.error(error.message || 'Error joining competition');
      console.error('Error joining competition:', error);
    } finally {
      setJoinLoading(false);
    }
  };

  // Format time for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleString();
  };

  // Render the appropriate competition component based on type
  const renderCompetitionContent = () => {
    if (!competition || !examStarted) return null;

    const questions = competition.questions || [];

    switch (competition.competitionType) {
      case 'MCQ':
        return <Mcq
          questions={questions}
          competition={competition}
          isDisqualified={isDisqualified}
          disqualificationReason={disqualificationReason}
        />;
      case 'CODE':
        return <Code
          questions={questions}
          competition={competition}
          isDisqualified={isDisqualified}
          disqualificationReason={disqualificationReason}
        />;
      case 'TEXT':
        return <Text
          questions={questions}
          competition={competition}
          isDisqualified={isDisqualified}
          disqualificationReason={disqualificationReason}
        />;
      default:
        return (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h5" color="error">
              Unsupported competition type: {competition.competitionType}
            </Typography>
          </Box>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        bgcolor: '#f5f5f5'
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Preparing Competition Environment...
        </Typography>
      </Box>
    );
  }

  // If user is disqualified, show the disqualification page
  if (isDisqualified) {
    return (
      <CompetitionDisqualifyPage
        reason={disqualificationReason}
        competition={competition}
      />
    );
  }

  // If exam has started, render the competition component
  if (examStarted) {
    return (
      <Box sx={{ height: '100vh', width: '100vw' }}>
        {/* Warning Dialog for Fullscreen */}
        <Dialog
          open={openWarningDialog}
          sx={{ zIndex: 2000 }}
        >
          <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
            <Box display="flex" alignItems="center">
              <WarningIcon sx={{ mr: 1 }} />
              Warning: Fullscreen Required
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mt: 2 }}>
              You must remain in fullscreen mode during the entire competition. Exiting fullscreen mode may lead to disqualification.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEnterFullScreen}
              autoFocus
            >
              Return to Fullscreen
            </Button>
          </DialogActions>
        </Dialog>

        {/* Violation Warning Dialog */}
        <Dialog
          open={showViolationWarning}
          onClose={() => setShowViolationWarning(false)}
          sx={{ zIndex: 2000 }}
        >
          <DialogTitle sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <Box display="flex" alignItems="center">
              <WarningIcon sx={{ mr: 1 }} />
              Security Violation Warning
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mt: 2 }}>
              A security violation has been detected. This is warning {violationsCount}/{MAX_VIOLATIONS}.
              Further violations will result in disqualification.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowViolationWarning(false)}
              autoFocus
            >
              I Understand
            </Button>
          </DialogActions>
        </Dialog>

        {/* Render the competition component */}
        {renderCompetitionContent()}
      </Box>
    );
  }

  return (
    <Container maxWidth={false} disableGutters sx={{ height: '100vh', overflow: 'auto', padding: 3, backgroundColor: '#f5f5f5' }}>
      {/* Warning Dialog for Fullscreen */}
      <Dialog
        open={openWarningDialog}
        sx={{ zIndex: 2000 }}
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          <Box display="flex" alignItems="center">
            <WarningIcon sx={{ mr: 1 }} />
            Warning: Fullscreen Required
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mt: 2 }}>
            You must remain in fullscreen mode during the entire competition. Exiting fullscreen mode may lead to disqualification.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEnterFullScreen}
            autoFocus
          >
            Return to Fullscreen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {competition?.competitionName || 'Competition Instructions'}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Please read all instructions carefully before joining the competition
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3} sx={{ display: 'flex', alignItems: 'stretch' , justifyContent: 'center'}}>
        {/* Competition Information */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <InfoIcon sx={{ mr: 1 }} /> Competition Information
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>Description</Typography>
                <Typography variant="body1" paragraph>{competition?.competitionDescription || 'No description available'}</Typography>

                <Grid container spacing={2} sx={{ mt: 2 }} width={"500px"}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <QuizIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">
                        <strong>Type:</strong> {competition?.competitionType || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MenuBookIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">
                        <strong>Questions:</strong> {competition?.totalQuestions || 0}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Timer sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">
                        <strong>Duration:</strong> {competition?.duration || 0} minutes
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">
                        <strong>Creator:</strong> {competition?.creatorName || 'Unknown'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>Schedule</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle2">Start Time:</Typography>
                    <Typography variant="body1">{formatDateTime(competition?.startTiming)}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2">End Time:</Typography>
                    <Typography variant="body1">{formatDateTime(competition?.endTiming)}</Typography>
                  </Box>

                  {competition?.timeStatus && (
                    <Paper elevation={0} sx={{
                      p: 1.5,
                      mt: 1,
                      bgcolor: competition.timeStatus.type === 'endsIn' ? 'error.light' : 'primary.light',
                      borderRadius: 1
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.contrastText' }}>
                        {competition.timeStatus.type === 'endsIn'
                          ? `Competition ends in ${competition.timeStatus.formattedTime}`
                          : `Competition starts in ${competition.timeStatus.formattedTime}`
                        }
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Rules and Regulations */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <RuleIcon sx={{ mr: 1 }} /> Rules and Regulations
              </Typography>
              <Divider sx={{ my: 2 }} />

              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Do NOT exit fullscreen mode"
                    secondary="Exiting fullscreen may result in disqualification"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Timer color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Adhere to time restrictions"
                    secondary="The competition will automatically end when the time limit is reached"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <KeyboardIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Avoid prohibited keyboard shortcuts"
                    secondary="Do not use Alt+Tab, Win key, or other shortcuts that allow leaving the competition window"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TabIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Do not switch tabs or open new windows"
                    secondary="Any attempt to navigate away from the competition page may be flagged"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="No external resources"
                    secondary="Using search engines, code repositories, or communication tools is strictly prohibited"
                  />
                </ListItem>
              </List>

              <Typography variant="body1" sx={{ mt: 2, fontWeight: 'bold', color: 'error.main' }}>
                Any violation of these rules may result in immediate disqualification and removal from the competition.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Agreement and Join Button */}
      <Paper elevation={3} sx={{ mt: 4, p: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                color="primary"
              />
            }
            label="I have read and agree to follow all instructions and rules"
          />

          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={!agreedToTerms || joinLoading}
            onClick={handleJoinCompetition}
            sx={{
              minWidth: 200,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            {joinLoading ? <CircularProgress size={24} color="inherit" /> : 'Join Competition'}
          </Button>

          {!isFullScreen && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleEnterFullScreen}
              sx={{ mt: 1 }}
            >
              Enter Fullscreen Mode
            </Button>
          )}
        </Box>
      </Paper>

      {/* Toast Container */}
      <Toaster position="top-center" />
    </Container>
  );
}

export default CompetitionExamPage;
import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Menu,
  MenuItem,
  Badge,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack,
  Language,
  Timer,
  CheckCircleOutline,
  ErrorOutline,
  MoreVert,
  NotificationsOutlined,
  Settings,
  CloudUploadOutlined,
  CheckCircle,
  Save,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const CodeEditorHeader = ({ 
  competitionName = "Algorithm Challenge", 
  problemTitle = "Problem 1: Two Sum", 
  timeLeft = 7200, // seconds
  language = "javascript",
  onChangeLanguage,
  testsPassed = 5,
  totalTests = 8,
  onSubmit,
  onSave,
  saved = true,
  showSolution = false,
  onToggleSolution
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for language menu
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);
  
  // Mock notifications
  const notifications = [
    { id: 1, text: "You passed test case #3", read: false, time: "2 min ago" },
    { id: 2, text: "Your solution was saved", read: true, time: "5 min ago" },
    { id: 3, text: "15 minutes remaining in the competition", read: false, time: "15 min ago" },
  ];
  
  // Available languages
  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'cpp', name: 'C++' },
  ];
  
  // Format time remaining
  const formatTimeRemaining = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };
  
  // Handle language menu
  const handleOpenLanguageMenu = (event) => {
    setLanguageMenuAnchor(event.currentTarget);
  };
  
  const handleCloseLanguageMenu = () => {
    setLanguageMenuAnchor(null);
  };
  
  const handleLanguageChange = (lang) => {
    if (onChangeLanguage) {
      onChangeLanguage(lang);
    }
    handleCloseLanguageMenu();
  };
  
  // Handle notifications menu
  const handleOpenNotificationsMenu = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };
  
  const handleCloseNotificationsMenu = () => {
    setNotificationsAnchor(null);
  };
  
  // Handle more menu
  const handleOpenMoreMenu = (event) => {
    setMoreMenuAnchor(event.currentTarget);
  };
  
  const handleCloseMoreMenu = () => {
    setMoreMenuAnchor(null);
  };
  
  // Go back to competition
  const handleBack = () => {
    navigate(`/dashboard/competition/${id}`);
  };
  
  // Handle submission
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };
  
  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };
  
  // Toggle solution visibility
  const handleToggleSolution = () => {
    if (onToggleSolution) {
      onToggleSolution();
    }
  };
  
  // Calculate test status color
  const getTestStatusColor = () => {
    if (testsPassed === totalTests) {
      return theme.palette.success.main;
    } else if (testsPassed >= totalTests / 2) {
      return theme.palette.warning.main;
    }
    return theme.palette.error.main;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Box
      component={motion.div}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        flexGrow: 1,
        position: 'relative',
        zIndex: 10,
      }}
    >
      <AppBar 
        position="static" 
        color="default" 
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: 0.5,
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
          {/* Back button and Competition name */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: { xs: 1, md: 0 } }}>
            <Tooltip title="Back to competition">
              <IconButton 
                edge="start" 
                color="inherit" 
                sx={{ mr: 1 }}
                onClick={handleBack}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography 
                variant="subtitle2" 
                noWrap
                color="textSecondary"
              >
                {competitionName}
              </Typography>
              <Typography 
                variant="subtitle1" 
                noWrap
                sx={{ fontWeight: 600 }}
              >
                {problemTitle}
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <Typography 
                variant="subtitle1" 
                noWrap
                sx={{ fontWeight: 600 }}
              >
                {problemTitle}
              </Typography>
            </Box>
          </Box>

          {/* Time remaining */}
          <Chip 
            icon={<Timer fontSize="small" />}
            label={formatTimeRemaining(timeLeft)} 
            color="primary"
            sx={{ 
              ml: { xs: 0, md: 3 }, 
              mr: { xs: 'auto', md: 0 },
              display: { xs: 'none', sm: 'flex' },
              fontWeight: 600,
              fontSize: '0.85rem',
              height: 32,
            }}
          />

          {/* Spacer */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />

          {/* Test status */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mx: { xs: 0.5, md: 2 },
              px: 1.5,
              py: 0.7,
              borderRadius: '20px',
              bgcolor: `${getTestStatusColor()}15`,
            }}
          >
            {testsPassed === totalTests ? (
              <CheckCircleOutline fontSize="small" color="success" sx={{ mr: 0.8 }} />
            ) : (
              <ErrorOutline fontSize="small" color="warning" sx={{ mr: 0.8 }} />
            )}
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600, 
                display: { xs: 'none', sm: 'block' },
                color: getTestStatusColor()
              }}
            >
              Tests: {testsPassed}/{totalTests}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600, 
                display: { xs: 'block', sm: 'none' },
                color: getTestStatusColor()
              }}
            >
              {testsPassed}/{totalTests}
            </Typography>
          </Box>

          {/* Language selector */}
          <Tooltip title="Change language">
            <Button
              onClick={handleOpenLanguageMenu}
              startIcon={<Language />}
              color="inherit"
              sx={{
                textTransform: 'none',
                display: { xs: 'none', sm: 'flex' },
                mr: 1,
              }}
            >
              {languages.find(lang => lang.id === language)?.name || 'JavaScript'}
            </Button>
          </Tooltip>

          <Tooltip title="Change language">
            <IconButton 
              color="inherit"
              onClick={handleOpenLanguageMenu} 
              sx={{ display: { xs: 'flex', sm: 'none' }, mr: 1 }}
            >
              <Language />
            </IconButton>
          </Tooltip>

          {/* Language menu */}
          <Menu
            anchorEl={languageMenuAnchor}
            open={Boolean(languageMenuAnchor)}
            onClose={handleCloseLanguageMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 2,
              sx: { 
                mt: 1,
                width: 180,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }
            }}
          >
            {languages.map(lang => (
              <MenuItem
                key={lang.id}
                onClick={() => handleLanguageChange(lang.id)}
                sx={{
                  py: 1.2,
                  '&.Mui-selected': {
                    bgcolor: `${theme.palette.primary.main}15`,
                    '&:hover': {
                      bgcolor: `${theme.palette.primary.main}25`,
                    }
                  }
                }}
                selected={language === lang.id}
              >
                <Typography variant="body2">{lang.name}</Typography>
                {language === lang.id && <CheckCircle sx={{ ml: 'auto', fontSize: 16, color: 'primary.main' }} />}
              </MenuItem>
            ))}
          </Menu>

          {/* Notifications */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleOpenNotificationsMenu}>
                <Badge badgeContent={notifications.filter(n => !n.read).length} color="error">
                  <NotificationsOutlined />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>

          {/* Notifications menu */}
          <Menu
            anchorEl={notificationsAnchor}
            open={Boolean(notificationsAnchor)}
            onClose={handleCloseNotificationsMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 2,
              sx: { 
                mt: 1,
                width: 320,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }
            }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight="bold">Notifications</Typography>
              <Button size="small" sx={{ textTransform: 'none' }}>Mark all as read</Button>
            </Box>
            <Divider />
            {notifications.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">No notifications</Typography>
              </Box>
            ) : (
              notifications.map((notification) => (
                <MenuItem 
                  key={notification.id} 
                  sx={{ 
                    py: 1.5, 
                    px: 2,
                    borderLeft: notification.read ? 'none' : '3px solid',
                    borderColor: 'primary.main',
                    bgcolor: notification.read ? 'transparent' : 'rgba(0, 0, 0, 0.02)'
                  }}
                  onClick={handleCloseNotificationsMenu}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                      {notification.text}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {notification.time}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
            <Divider />
            <Box sx={{ p: 1 }}>
              <Button 
                fullWidth 
                size="small" 
                onClick={handleCloseNotificationsMenu}
                sx={{ textTransform: 'none' }}
              >
                View all
              </Button>
            </Box>
          </Menu>

          {/* Save button */}
          <Tooltip title={saved ? "Saved" : "Save"}>
            <IconButton 
              color="inherit" 
              onClick={handleSave}
              disabled={saved}
            >
              <Save sx={{ color: saved ? 'success.main' : 'inherit' }} />
            </IconButton>
          </Tooltip>

          {/* Toggle solution button (if available) */}
          {onToggleSolution && (
            <Tooltip title={showSolution ? "Hide solution" : "Show solution"}>
              <IconButton 
                color="inherit" 
                onClick={handleToggleSolution}
              >
                {showSolution ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Tooltip>
          )}

          {/* Submit button */}
          <Button
            variant="contained"
            startIcon={<CloudUploadOutlined />}
            onClick={handleSubmit}
            sx={{
              ml: 1,
              textTransform: 'none',
              fontWeight: 600,
              display: { xs: 'none', sm: 'flex' },
            }}
          >
            Submit
          </Button>

          <IconButton 
            color="primary" 
            onClick={handleSubmit}
            sx={{ 
              ml: 1,
              display: { xs: 'flex', sm: 'none' } 
            }}
          >
            <CloudUploadOutlined />
          </IconButton>

          {/* More menu for mobile */}
          <IconButton 
            color="inherit" 
            sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}
            onClick={handleOpenMoreMenu}
          >
            <MoreVert />
          </IconButton>

          <Menu
            anchorEl={moreMenuAnchor}
            open={Boolean(moreMenuAnchor)}
            onClose={handleCloseMoreMenu}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 2,
              sx: { 
                mt: 1,
                width: 200,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider'
              }
            }}
          >
            <MenuItem onClick={handleCloseMoreMenu}>
              <Badge badgeContent={notifications.filter(n => !n.read).length} color="error" sx={{ mr: 1.5 }}>
                <NotificationsOutlined fontSize="small" />
              </Badge>
              <Typography variant="body2">Notifications</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseMoreMenu}>
              <Settings fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">Settings</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleBack}>
              <ArrowBack fontSize="small" sx={{ mr: 1.5 }} />
              <Typography variant="body2">Back to competition</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default CodeEditorHeader;

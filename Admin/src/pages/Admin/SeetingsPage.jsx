import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  DarkMode,
  Notifications,
  Security,
  Language,
  Palette,
  Save,
  DataObject,
  AccessTime,
  Email,
  Info
} from '@mui/icons-material';
import authService from '../../services/authService';

// Current date and time
const CURRENT_DATE_TIME = "2025-05-30 12:13:42";
const CURRENT_USER = "VanshSharmaSDENow";

const SettingsPage = () => {
  const theme = useTheme();
  
  // Settings state
  const [settings, setSettings] = useState({
    darkMode: theme.palette.mode === 'dark',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      teacherRegistrations: true,
      competitionEvents: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 60, // minutes
      autoLogout: true
    },
    appearance: {
      colorScheme: 'default',
      compactView: false,
      animationsEnabled: true
    }
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    message: ''
  });
  
  // Handle settings changes
  const handleSettingChange = (section, name, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };
  
  // Handle simple setting change
  const handleSimpleSettingChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle save settings
  const handleSaveSettings = async () => {
    setLoading(true);
    
    try {
      // In a real app, this would call an API
      // await authService.updateSettings(settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success notification
      setNotification({
        open: true,
        type: 'success',
        message: 'Settings saved successfully'
      });
      
      // Apply theme changes if needed
      if (settings.darkMode && theme.palette.mode !== 'dark') {
        // This would be handled by your theme context
        console.log('Switch to dark mode');
      } else if (!settings.darkMode && theme.palette.mode === 'dark') {
        // This would be handled by your theme context
        console.log('Switch to light mode');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification({
        open: true,
        type: 'error',
        message: 'Failed to save settings. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  // Reset settings to defaults
  const handleResetSettings = () => {
    setSettings({
      darkMode: false,
      language: 'en',
      notifications: {
        email: true,
        push: true,
        teacherRegistrations: true,
        competitionEvents: true
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 60, // minutes
        autoLogout: true
      },
      appearance: {
        colorScheme: 'default',
        compactView: false,
        animationsEnabled: true
      }
    });
    
    setNotification({
      open: true,
      type: 'info',
      message: 'Settings reset to defaults'
    });
  };

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure your admin dashboard preferences
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            onClick={handleResetSettings}
            sx={{ mr: 2, borderRadius: '8px' }}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            sx={{ 
              borderRadius: '8px',
              bgcolor: 'var(--theme-color)',
              '&:hover': {
                bgcolor: 'var(--hover-color)'
              }
            }}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Palette sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Appearance
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List disablePadding>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Dark Mode"
                  secondary="Enable dark theme for the dashboard"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.darkMode}
                    onChange={(e) => handleSimpleSettingChange('darkMode', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem sx={{ px: 0, mt: 1 }}>
                <ListItemText 
                  primary="Color Scheme"
                  secondary="Select the primary color scheme"
                />
                <ListItemSecondaryAction>
                  <FormControl variant="outlined" size="small" sx={{ width: 120 }}>
                    <Select
                      value={settings.appearance.colorScheme}
                      onChange={(e) => handleSettingChange('appearance', 'colorScheme', e.target.value)}
                    >
                      <MenuItem value="default">Red</MenuItem>
                      <MenuItem value="blue">Blue</MenuItem>
                      <MenuItem value="green">Green</MenuItem>
                      <MenuItem value="purple">Purple</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem sx={{ px: 0, mt: 1 }}>
                <ListItemText 
                  primary="Compact View"
                  secondary="Reduce spacing in lists and tables"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.appearance.compactView}
                    onChange={(e) => handleSettingChange('appearance', 'compactView', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem sx={{ px: 0, mt: 1 }}>
                <ListItemText 
                  primary="Animations"
                  secondary="Enable UI animations and transitions"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.appearance.animationsEnabled}
                    onChange={(e) => handleSettingChange('appearance', 'animationsEnabled', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Notifications sx={{ mr: 1, color: 'secondary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Notifications
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List disablePadding>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Email Notifications"
                  secondary="Receive notifications via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem sx={{ px: 0, mt: 1 }}>
                <ListItemText 
                  primary="Push Notifications"
                  secondary="Receive push notifications in browser"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem sx={{ px: 0, mt: 1 }}>
                <ListItemText 
                  primary="Teacher Registration Alerts"
                  secondary="Get notified when teachers register"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.notifications.teacherRegistrations}
                    onChange={(e) => handleSettingChange('notifications', 'teacherRegistrations', e.target.checked)}
                    disabled={!settings.notifications.email && !settings.notifications.push}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem sx={{ px: 0, mt: 1 }}>
                <ListItemText 
                  primary="Competition Events"
                  secondary="Get notified about competition changes"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.notifications.competitionEvents}
                    onChange={(e) => handleSettingChange('notifications', 'competitionEvents', e.target.checked)}
                    disabled={!settings.notifications.email && !settings.notifications.push}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Security sx={{ mr: 1, color: 'error.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Security
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List disablePadding>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Two-Factor Authentication"
                  secondary="Require an additional verification step when logging in"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem sx={{ px: 0, mt: 1 }}>
                <ListItemText 
                  primary="Session Timeout"
                  secondary="Automatically log out after period of inactivity"
                />
                <ListItemSecondaryAction>
                  <FormControl variant="outlined" size="small" sx={{ width: 120 }}>
                    <Select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
                    >
                      <MenuItem value={15}>15 minutes</MenuItem>
                      <MenuItem value={30}>30 minutes</MenuItem>
                      <MenuItem value={60}>1 hour</MenuItem>
                      <MenuItem value={120}>2 hours</MenuItem>
                      <MenuItem value={240}>4 hours</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>
              
              <ListItem sx={{ px: 0, mt: 1 }}>
                <ListItemText 
                  primary="Auto Logout"
                  secondary="Automatically log out when browser is closed"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={settings.security.autoLogout}
                    onChange={(e) => handleSettingChange('security', 'autoLogout', e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>
        
        {/* Language Settings */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Language sx={{ mr: 1, color: 'info.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Language & Region
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <List disablePadding>
              <ListItem sx={{ px: 0 }}>
                <ListItemText 
                  primary="Dashboard Language"
                  secondary="Set the display language for the admin dashboard"
                />
                <ListItemSecondaryAction>
                  <FormControl variant="outlined" size="small" sx={{ width: 120 }}>
                    <Select
                      value={settings.language}
                      onChange={(e) => handleSimpleSettingChange('language', e.target.value)}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                      <MenuItem value="zh">Chinese</MenuItem>
                    </Select>
                  </FormControl>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
          
          {/* System Information Card */}
          <Card 
            variant="outlined" 
            sx={{ 
              mt: 3, 
              borderRadius: '16px',
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.02)'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Info sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  System Information
                </Typography>
              </Box>
              
              <List dense disablePadding>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <DataObject fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Version"
                    secondary="Code-Quest Admin v1.2.5"
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AccessTime fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Last Updated"
                    secondary={CURRENT_DATE_TIME}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Email fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Support"
                    secondary="admin-support@codequest.com"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification}
          severity={notification.type}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage;
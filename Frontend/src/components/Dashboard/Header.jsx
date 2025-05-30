import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Badge, 
  Tooltip, 
  Divider,
  useTheme,
  Chip
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Notifications, 
  Person, 
  Logout, 
  Settings,
  History
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../../services/authService';

// Motion components
const MotionBox = motion(Box);

const Header = ({ toggleSidebar, sidebarOpen, isMobile, currentDateTime, currentUser }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };
  
  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  // User menu options
  const userOptions = [
    { label: 'Profile', icon: <Person sx={{ mr: 1 }} />, action: () => navigate('/dashboard/profile') },
    { label: 'Settings', icon: <Settings sx={{ mr: 1 }} />, action: () => navigate('/settings') },
    { label: 'Activity Log', icon: <History sx={{ mr: 1 }} />, action: () => navigate('/activity-log') },
    { label: 'Logout', icon: <Logout sx={{ mr: 1 }} />, action: handleLogout },
  ];
  
  // Dummy notifications
  const notifications = [
    { id: 1, title: 'New Competition', message: 'A new competition has been added: "Algorithms Challenge"', time: '10 min ago', isRead: false },
    { id: 2, title: 'Results Published', message: 'Results for "Data Structures 101" are now available', time: '1 hour ago', isRead: false },
    { id: 3, title: 'Competition Reminder', message: '"Python Challenge" starts in 2 hours', time: '2 hours ago', isRead: true },
  ];

  return (
    <AppBar 
    //   position="fixed"
      color="transparent"
      sx={{ 
        boxShadow: 'none',
        backdropFilter: 'blur(10px)',
        bgcolor: 'rgba(var(--background-color-rgb), 0.7)',
        borderBottom: '1px solid var(--background-shadow)',
        // zIndex: (theme) => theme.zIndex.drawer + 1,
        marginBottom:"10vh"
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{
            mr: 2,
            ...(sidebarOpen && !isMobile && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', fontWeight: 600 }}
        >
          Code-Quest
        </Typography> */}
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Current Time Display */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            mr: 2,
            px: 2,
            py: 0.5,
            borderRadius: '100px',
            backdropFilter: 'blur(8px)',
            bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
            border: '1px solid rgba(var(--theme-color-rgb), 0.2)',
          }}
        >
          <Typography
            variant="body2" 
            sx={{
              fontFamily: 'monospace',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            UTC: {currentDateTime}
            <Box 
              component="span"
              sx={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'success.main',
                ml: 1.5,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 0.6, transform: 'scale(0.9)' },
                  '50%': { opacity: 1, transform: 'scale(1.1)' },
                  '100%': { opacity: 0.6, transform: 'scale(0.9)' },
                },
              }}
            />
          </Typography>
        </MotionBox>
        
        {/* Notifications */}
        <Box sx={{ display: 'flex', mr: 2 }}>
          <Tooltip title="Notifications">
            <IconButton 
              onClick={handleOpenNotificationsMenu}
              sx={{ p: 1 }}
            >
              <Badge badgeContent={notifications.filter(n => !n.isRead).length} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            id="notifications-menu"
            anchorEl={anchorElNotifications}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotificationsMenu}
            sx={{
              mt: 1,
              '& .MuiPaper-root': {
                width: 320,
                maxHeight: 400,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                borderRadius: '12px',
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Notifications
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <MenuItem 
                    key={notification.id}
                    onClick={handleCloseNotificationsMenu}
                    sx={{ 
                      py: 2, 
                      px: 2,
                      borderLeft: notification.isRead ? 'none' : '3px solid var(--theme-color)',
                      bgcolor: notification.isRead ? 'transparent' : 'rgba(var(--theme-color-rgb), 0.05)',
                    }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {notification.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notification.time}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No notifications yet
                  </Typography>
                </Box>
              )}
            </Box>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'primary.main', 
                  cursor: 'pointer',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                View All Notifications
              </Typography>
            </Box>
          </Menu>
        </Box>
        
        {/* User menu */}
        <Box sx={{ flexShrink: 0 }}>
          <Tooltip title="Open settings">
            <Box 
              onClick={handleOpenUserMenu}
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                p: 0.5,
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <Avatar 
                alt="User Avatar" 
                src="/static/images/avatar/2.jpg" 
                sx={{ width: 32, height: 32 }}
              />
              <Box 
                sx={{ 
                  ml: 1.5, 
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  {currentUser}
                </Typography>
                <Chip 
                  label="Student" 
                  size="small" 
                  color="primary" 
                  sx={{ 
                    height: 20, 
                    fontSize: '0.625rem',
                    fontWeight: 'bold',
                    bgcolor: 'var(--theme-color)',
                  }} 
                />
              </Box>
            </Box>
          </Tooltip>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            sx={{
              mt: 1,
              '& .MuiPaper-root': {
                minWidth: 180,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                overflow: 'visible',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -8,
                  right: 18,
                  width: 16,
                  height: 16,
                  bgcolor: 'background.paper',
                  transform: 'rotate(45deg)',
                }
              },
            }}
          >
            <Box sx={{ px: 2, pt: 1, pb: 2, textAlign: 'center' }}>
              <Avatar 
                alt="User Avatar" 
                src="/static/images/avatar/2.jpg" 
                sx={{ width: 56, height: 56, mx: 'auto', mb: 1, border: '2px solid var(--theme-color)' }}
              />
              <Typography variant="subtitle1" fontWeight="bold">
                {currentUser}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                student@example.com
              </Typography>
            </Box>
            <Divider />
            {userOptions.map((option) => (
              <MenuItem 
                key={option.label} 
                onClick={() => {
                  handleCloseUserMenu();
                  option.action();
                }}
                sx={{ 
                  py: 1.5,
                  px: 2
                }}
              >
                {option.icon}
                <Typography variant="body2">
                  {option.label}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
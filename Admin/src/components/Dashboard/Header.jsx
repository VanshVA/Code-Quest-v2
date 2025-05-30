import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Divider,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  useScrollTrigger
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
  PersonOutlined,
  DarkMode,
  LightMode,
  ChevronLeft,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../../services/authService';
import { useColorMode } from '../../context/ThemeContext';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const DashboardHeader = ({ title, onToggleSidebar, isSidebarOpen, currentDateTime, currentUser }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleColorMode, setColorMode } = useColorMode();
  
  // State for user menu and notifications
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  
  // Scroll effects
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });
  
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle user menu open/close
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  // Handle notifications menu open/close
  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };
  
  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };
  
  // Handle user menu options
  const handleUserMenuOption = (option) => {
    handleCloseUserMenu();
    if (option === 'profile') {
      navigate('/admin/profile');
    } else if (option === 'settings') {
      navigate('/admin/settings');
    } else if (option === 'logout') {
      // Show logout confirmation or directly logout
      authService.logout();
      navigate('/login');
    }
  };

  // Animation variants
  const logoVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const iconVariants = {
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.2 } },
    tap: { scale: 0.95 }
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={scrolled ? 2 : 0}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: scrolled 
          ? theme.palette.mode === 'dark' 
            ? 'rgba(25, 25, 25, 0.8)'
            : 'rgba(255, 255, 255, 0.85)'
          : 'background.paper',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        height: scrolled ? 64 : 70, 
        transition: 'height 0.3s ease'
      }}>
        {/* Left side - Title and Menu Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <MotionBox
            component={IconButton}
            color="inherit"
            aria-label="open/close sidebar"
            onClick={onToggleSidebar}
            edge="start"
            variants={iconVariants}
            whileHover="hover"
            whileTap="tap"
            sx={{ mr: 1 }}
          >
            {isMobile || !isSidebarOpen ? <MenuIcon /> : <ChevronLeft />}
          </MotionBox>
          
          <MotionBox 
            sx={{ display: 'flex', alignItems: 'center' }}
            initial="hidden"
            animate="visible"
            variants={logoVariants}
          >
            <AdminPanelSettings sx={{ mr: 1, color: 'primary.main' }} />
            <MotionTypography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ fontWeight: 'bold' }}
              animate={{ 
                color: scrolled 
                  ? (theme.palette.mode === 'dark' ? '#fff' : theme.palette.text.primary) 
                  : theme.palette.text.primary
              }}
              transition={{ duration: 0.5 }}
            >
              {isMobile ? 'Admin' : title}
            </MotionTypography>
          </MotionBox>
        </Box>
        
        {/* Right side - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Current Date and Time */}
          {!isMobile && (
            <MotionTypography
              variant="body2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              sx={{
                mr: 2,
                fontFamily: 'monospace',
                color: 'text.secondary',
              }}
            >
              {currentDateTime}
            </MotionTypography>
          )}
          
          {/* Theme Toggle */}
          <Tooltip title={theme.palette.mode === 'dark' ? "Light mode" : "Dark mode"}>
            <MotionBox
              component={IconButton}
              onClick={toggleColorMode}
              sx={{ mx: 1 }}
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
            </MotionBox>
          </Tooltip>
          
          {/* Notifications */}
          <Tooltip title="Notifications">
            <MotionBox
              component={IconButton}
              onClick={handleOpenNotificationsMenu}
              sx={{ mx: 1 }}
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </MotionBox>
          </Tooltip>
          
          {/* Notifications Menu */}
          <Menu
            anchorEl={anchorElNotifications}
            id="notifications-menu"
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotificationsMenu}
            onClick={handleCloseNotificationsMenu}
            PaperProps={{
              sx: {
                width: 320,
                maxHeight: 480,
                overflow: 'auto',
                mt: 1.5,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                borderRadius: '12px',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Notifications
              </Typography>
            </Box>
            
            <MenuItem onClick={() => navigate('/dashboard/notifications/1')}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" fontWeight="medium">
                  New teacher registration request
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  A new teacher has registered and requires approval
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  10 minutes ago
                </Typography>
              </Box>
            </MenuItem>
            
            <MenuItem onClick={() => navigate('/dashboard/notifications/2')}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" fontWeight="medium">
                  Competition completed
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Algorithm Challenge competition has ended
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  1 hour ago
                </Typography>
              </Box>
            </MenuItem>
            
            <MenuItem onClick={() => navigate('/dashboard/notifications/3')}>
              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" fontWeight="medium">
                  System update completed
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  The system has been updated to version 2.3.1
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  1 day ago
                </Typography>
              </Box>
            </MenuItem>
            
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                color="primary" 
                sx={{ cursor: 'pointer', fontWeight: 'medium' }}
                onClick={() => navigate('/dashboard/notifications')}
              >
                View all notifications
              </Typography>
            </Box>
          </Menu>
          
          {/* User Menu */}
          <Box sx={{ ml: 1 }}>
            <Tooltip title="Account settings">
              <MotionBox
                component={IconButton}
                onClick={handleOpenUserMenu}
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <Avatar
                  alt={currentUser}
                  src="/static/images/avatar/1.jpg"
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: 'primary.main',
                    border: '2px solid',
                    borderColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,255,255,0.2)' 
                      : 'rgba(0,0,0,0.1)',
                  }}
                >
                  {currentUser?.charAt(0) || 'A'}
                </Avatar>
              </MotionBox>
            </Tooltip>
            
            <Menu
              anchorEl={anchorElUser}
              id="account-menu"
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              onClick={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  width: 220,
                  overflow: 'visible',
                  mt: 1.5,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    borderTop: '1px solid',
                    borderLeft: '1px solid',
                    borderColor: theme.palette.divider,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" noWrap fontWeight="bold">
                  {currentUser}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  Administrator
                </Typography>
              </Box>
              
              <Divider />
              
              <MenuItem onClick={() => handleUserMenuOption('profile')}>
                <ListItemIcon>
                  <PersonOutlined fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              
              <MenuItem onClick={() => handleUserMenuOption('settings')}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={() => handleUserMenuOption('logout')}>
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: 'error.main' }} />
                </ListItemIcon>
                <Typography color="error.main">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
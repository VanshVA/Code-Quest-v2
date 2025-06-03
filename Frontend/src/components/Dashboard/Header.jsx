import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Avatar,
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
  Logout,
  PersonOutlined,
  DarkMode,
  LightMode,
  ChevronLeft,
  AdminPanelSettings as TeacherPanelSettings
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import authService from '../../services/authService';
import { useColorMode } from '../../context/ThemeContext';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const DashboardHeader = ({ title, onToggleSidebar, isSidebarOpen, currentDateTime }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleColorMode, setColorMode } = useColorMode();

  // Get user data from localStorage
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObj = JSON.parse(userString);
        setUserData({
          firstName: userObj.firstName || '',
          lastName: userObj.lastName || '',
          email: userObj.email || '',
          role: userObj.role || ''
        });
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  // State for user menu only
  const [anchorElUser, setAnchorElUser] = useState(null);

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

  // Handle user menu options
  const handleUserMenuOption = (option) => {
    handleCloseUserMenu();
    if (option === 'profile') {
      navigate('/student/profile');
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
          {isMobile && (
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
              <MenuIcon />
            </MotionBox>
          )}

          <MotionBox
            sx={{ display: 'flex', alignItems: 'center' }}
            initial="hidden"
            animate="visible"
            variants={logoVariants}
          >
            <TeacherPanelSettings sx={{ mr: 1, color: 'primary.main' }} />
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
              {isMobile ? 'Teacher' : title}
            </MotionTypography>
          </MotionBox>
        </Box>

        {/* Right side - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                  alt={userData.firstName}
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
                  {userData.firstName?.charAt(0) || 'A'}
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
                  {`${userData.firstName} ${userData.lastName}`}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {userData.role}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                  {userData.email}
                </Typography>
              </Box>

              <Divider />

              <MenuItem onClick={() => handleUserMenuOption('profile')}>
                <ListItemIcon>
                  <PersonOutlined fontSize="small" />
                </ListItemIcon>
                Profile
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
import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Collapse,
  Divider,
  Drawer,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close,
  DarkMode,
  LightMode,
  Home,
  Code,
  Leaderboard,
  EmojiEvents,
  Info,
  ContactSupport,
  Notifications,
  Search,
  AccountCircle,
  ExpandMore,
  KeyboardArrowRight,
  Settings,
  Help,
  Logout,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useColorMode } from '../../context/ThemeContext';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

// Logo component with animation
const Logo = () => {
  return (
    <MotionBox
      component={RouterLink}
      to="/"
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        textDecoration: 'none'
      }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Box 
        component="span"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f47061 0%, #bc4037 100%)',
          // boxShadow: '0 4px 12px rgba(188, 64, 55, 0.3)',
          mr: 1.5,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <MotionBox
          component="span"
          animate={{ 
            y: [0, -5, 0],
            opacity: [1, 0.8, 1], 
          }}
          transition={{ 
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          sx={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          C
        </MotionBox>
        <Box
          component="span"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '20%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
          }}
        />
      </Box>
      <Box>
        <MotionTypography
          variant="h6"
          noWrap
          sx={{ 
            fontWeight: 800,
            letterSpacing: '.1rem',
            color: 'white',
            display: { xs: 'none', sm: 'block' }
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          CODE-QUEST
              </MotionTypography>
        <Typography 
          variant="caption"
          sx={{ 
            display: { xs: 'none', sm: 'block' },
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 500,
            letterSpacing: 1,
            lineHeight: 1,
          }}
        >
          CODING PLATFORM
        </Typography>
      </Box>
    </MotionBox>
  );
};

// Main navigation items with mega menu
const navItems = [
  { 
    name: 'Home', 
    path: '/', 
    icon: <Home />,
    megaMenu: false
  },
   { 
    name: 'About', 
    path: '/about', 
    icon: <Info />,
    megaMenu: false
  },
  { 
    name: 'Features', 
    path: '/features', 
    icon: <Code />,
    megaMenu: true,
    items: [
      {
        title: 'Coding Environment',
        options: [
          { name: 'Code Editor', path: '/features/code-editor', description: 'Multi-language editor with real-time execution' },
          { name: 'Challenges', path: '/features/challenges', description: 'Algorithmic problems with difficulty levels' },
          { name: 'Sandbox', path: '/features/sandbox', description: 'Experimental coding space for testing' },
        ]
      },
      {
        title: 'Assessment Tools',
        options: [
          { name: 'MCQ Tests', path: '/features/mcq', description: 'Multiple-choice testing system' },
          { name: 'Performance Analytics', path: '/features/analytics', description: 'Detailed reports and insights' },
          { name: 'Proctoring', path: '/features/proctoring', description: 'Secure test monitoring features' },
        ]
      },
      {
        title: 'Collaboration',
        options: [
          { name: 'Team Projects', path: '/features/teams', description: 'Collaborative coding environments' },
          { name: 'Discussion Forums', path: '/features/forums', description: 'Community interaction space' },
          { name: 'Code Reviews', path: '/features/reviews', description: 'Peer feedback system' },
        ]
      },
    ]
  },
  { 
    name: 'Competitions', 
    path: '/competitions', 
    icon: <EmojiEvents />,
    megaMenu: false
  },
  { 
    name: 'Leaderboard', 
    path: '/leaderboard', 
    icon: <Leaderboard />,
    megaMenu: false
  },
 
  { 
    name: 'Contact', 
    path: '/contact', 
    icon: <ContactSupport />,
    megaMenu: false
  },
];

const Navbar = ({ isAuthenticated = false }) => {
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeMenu, setActiveMenu] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuTimeout, setMegaMenuTimeout] = useState(null);
  
  // Scrolling effect
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
  });

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
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  // FIX 1: Reduce timeout delay for mega menu closing to make it more responsive
  const handleMenuEnter = (index) => {
    clearTimeout(megaMenuTimeout);
    setActiveMenu(index);
  };
  
  const handleMenuLeave = () => {
    // Reduced timeout from 300ms to 100ms for quicker closing
    const timeout = setTimeout(() => {
      setActiveMenu(null);
    }, 100);
    setMegaMenuTimeout(timeout);
  };

  const handleMegaMenuEnter = () => {
    clearTimeout(megaMenuTimeout);
  };

  const handleMegaMenuLeave = () => {
    handleMenuLeave();
  };

  // Handle link click to immediately close mega menu
  const handleLinkClick = () => {
    setActiveMenu(null);
  };

  const currentDate = new Date();
  const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
  
  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280, height: '100%', overflow: 'auto' }}>
      {/* Drawer header */}
      <Box 
        sx={{ 
          p: 2,
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            component="span"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f47061 0%, #bc4037 100%)',
              // boxShadow: '0 4px 8px rgba(188, 64, 55, 0.3)',
              mr: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              C
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            CODE-QUEST
          </Typography>
        </Box>
        <IconButton 
          onClick={handleDrawerToggle} 
          sx={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.04)', 
            borderRadius: '12px' 
          }}
        >
          <Close />
        </IconButton>
      </Box>

      {/* Drawer user section */}
      {isAuthenticated ? (
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
          <Avatar 
            alt="Anuj Prajapati" 
            src="/assets/user-avatar.jpg"
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Anuj Prajapati
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Student
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/login"
            sx={{ mb: 1 }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="outlined"
            component={RouterLink}
            to="/register"
          >
            Sign Up
          </Button>
        </Box>
      )}
      
      <Divider />

      {/* Nav items */}
      <List>
        {navItems.map((item, index) => (
          <React.Fragment key={item.name}>
            {item.megaMenu ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                    sx={{
                      backgroundColor: activeMenu === index ? 'rgba(188, 64, 55, 0.08)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(188, 64, 55, 0.04)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: activeMenu === index ? theme.palette.primary.main : 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                    {activeMenu === index ? <ExpandMore /> : <KeyboardArrowRight />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={activeMenu === index} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.items.map((category, catIndex) => (
                      <React.Fragment key={category.title}>
                        <ListItem sx={{ pl: 4 }}>
                          <ListItemText 
                            primary={category.title} 
                            primaryTypographyProps={{ 
                              variant: 'subtitle2', 
                              color: 'text.secondary',
                              fontWeight: 600,
                            }} 
                          />
                        </ListItem>
                        {category.options.map((option, optIndex) => (
                          <ListItem disablePadding key={option.name}>
                            <ListItemButton
                              component={RouterLink}
                              to={option.path}
                              sx={{ pl: 6 }}
                            >
                              <ListItemText 
                                primary={option.name} 
                                secondary={option.description}
                                primaryTypographyProps={{ variant: 'body2' }}
                                secondaryTypographyProps={{ 
                                  variant: 'caption',
                                  sx: { display: 'block', mt: 0.5 }
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                        {catIndex < item.items.length - 1 && (
                          <Divider sx={{ ml: 4, mr: 2 }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(188, 64, 55, 0.08)',
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                      pl: 1.5,
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(188, 64, 55, 0.04)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: location.pathname === item.path ? theme.palette.primary.main : 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {`${currentDate.toLocaleDateString()} · ${formattedTime}`}
          </Typography>
          <IconButton onClick={toggleColorMode} size="small" sx={{ ml: 1 }}>
            {theme.palette.mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
  
  const buttonVariants = {
    initial: { opacity: 0, y: -5 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.98 },
  };

  return (
    <>
      <AppBar 
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          background: scrolled 
            ? theme.palette.mode === 'dark' 
              ? 'rgba(25, 25, 25, 0.8)'
              : 'rgba(255, 255, 255, 0.85)'
            : theme.palette.gradients.primary,
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? `1px solid ${theme.palette.divider}` : 'none',
          color: scrolled ? theme.palette.text.primary : '#fff',
          transition: 'all 0.3s ease',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: scrolled ? 64 : 80, transition: 'height 0.3s ease' }}>
            {/* Logo - moved to the left */}
            <Logo />
            
            {/* Desktop Navigation */}
            {!isMobile && (
              <Box 
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{ 
                  display: 'flex', 
                  flexGrow: 1,
                  mx: 4,
                  justifyContent: 'center',
                }}
              >
                {navItems.map((item, index) => (
                  <Box 
                    key={item.name}
                    onMouseEnter={() => item.megaMenu && handleMenuEnter(index)} 
                    onMouseLeave={item.megaMenu && handleMenuLeave}
                  >
                    <Button
                      component={RouterLink}
                      to={item.megaMenu ? undefined : item.path}
                      color={scrolled ? "inherit" : "inherit"}
                      onClick={handleLinkClick} // FIX 1: Close menu on click
                      sx={{ 
                        mx: 0.5,
                        py: scrolled ? 1.5 : 2,
                        px: 1.5,
                        position: 'relative',
                        fontWeight: (location.pathname === item.path || activeMenu === index) ? 600 : 400,
                        // FIX 3: Removed box-shadow from navbar links
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          bottom: scrolled ? 5 : 10,
                          left: '50%',
                          width: (location.pathname === item.path || activeMenu === index) ? '50%' : '0%',
                          height: '3px',
                          bgcolor: scrolled ? theme.palette.primary.main : 'white',
                          transform: 'translateX(-50%)',
                          transition: 'width 0.3s ease',
                          borderRadius: '2px',
                        },
                        '&:hover:after': {
                          width: '50%',
                        },
                      }}
                      endIcon={item.megaMenu && (
                        <ExpandMore 
                          fontSize="small" 
                          sx={{ 
                            transition: 'transform 0.3s ease',
                            transform: activeMenu === index ? 'rotate(180deg)' : 'none',
                          }}
                        />
                      )}
                    >
                      {item.name}
                    </Button>
                    
                    {/* Mega Menu */}
                    {item.megaMenu && (
                      <Popover
                        open={activeMenu === index}
                        anchorEl={document.getElementById('root')}
                        onMouseEnter={handleMegaMenuEnter}
                        onMouseLeave={handleMegaMenuLeave}
                        onClick={() => setActiveMenu(null)} // FIX 1: Close on click anywhere in menu
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                        slotProps={{
                          paper: {
                            sx: {
                              mt: scrolled ? 8 : 10,
                              borderRadius: '16px',
                              // FIX 3: Reduced box-shadow for mega menu
                              // boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                              overflow: 'hidden',
                              width: '100%',
                              maxWidth: 900,
                              border: `1px solid ${theme.palette.divider}`,
                            }
                          }
                        }}
                        disableScrollLock
                      >
                        <Box
                          sx={{ 
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: 2,
                            p: 3,
                          }}
                        >
                          {item.items.map((category, catIndex) => (
                            <Box key={category.title}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: 700, 
                                  color: theme.palette.primary.main,
                                  mb: 2 
                                }}
                              >
                                {category.title}
                              </Typography>
                              
                              <Stack spacing={1.5}>
                                {category.options.map((option) => (
                                  <Box
                                    component={RouterLink}
                                    to={option.path}
                                    key={option.name}
                                    sx={{
                                      textDecoration: 'none',
                                      color: 'inherit',
                                      p: 1.5,
                                      borderRadius: '8px',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        backgroundColor: theme.palette.mode === 'dark' 
                                          ? 'rgba(255,255,255,0.05)'
                                          : 'rgba(0,0,0,0.02)',
                                        transform: 'translateX(5px)',
                                      }
                                    }}
                                  >
                                    <Typography variant="body2" fontWeight={600}>
                                      {option.name}
                                    </Typography>
                                    <Typography 
                                      variant="caption" 
                                      color="text.secondary"
                                      sx={{ display: 'block', mt: 0.5 }}
                                    >
                                      {option.description}
                                    </Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </Box>
                          ))}
                        </Box>
                      </Popover>
                    )}
                  </Box>
                ))}
              </Box>
            )}
            
            {/* Search button, notifications & user profile */}
            <Box 
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                ml: 'auto'
              }}
            >
              {!isSmall && (
                <>
              
                  
                  <IconButton 
                    onClick={toggleColorMode} 
                    color="inherit"
                    sx={{ 
                      mr: 1,
                      backgroundColor: scrolled ? 'transparent' : 'rgba(255,255,255,0.1)',
                      '&:hover': {
                        backgroundColor: scrolled ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.2)',
                      }
                    }}
                  >
                    {theme.palette.mode === 'dark' ? <LightMode /> : <DarkMode />}
                  </IconButton>
                </>
              )}

              {isAuthenticated ? (
                <>
                  {!isSmall && (
                    <Tooltip title="Notifications">
                      <IconButton 
                        color="inherit"
                        sx={{ 
                          mr: 2,
                          backgroundColor: scrolled ? 'transparent' : 'rgba(255,255,255,0.1)',
                          '&:hover': {
                            backgroundColor: scrolled ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        <Badge badgeContent={3} color="error">
                          <Notifications />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  )}
                  
                  <Box sx={{ position: 'relative' }}>
                    <Tooltip title="Account settings">
                      <IconButton
                        onClick={handleOpenUserMenu}
                        sx={{
                          p: 0,
                          border: `2px solid ${scrolled ? theme.palette.primary.main : 'rgba(255,255,255,0.7)'}`,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Avatar 
                          alt="Anuj Prajapati" 
                          src="/assets/user-avatar.jpg"
                          sx={{ width: 36, height: 36 }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      sx={{ mt: '45px' }}
                      id="menu-appbar"
                      anchorEl={anchorElUser}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                      slotProps={{
                        paper: {
                          elevation: 3,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                            borderRadius: '12px',
                            mt: 1.5,
                            width: 250,
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
                        }
                      }}
                    >
                      <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          Anuj Prajapati
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          anuj@example.com
                        </Typography>
                      </Box>
                      <Divider sx={{ mx: 2 }} />
                      <MenuItem component={RouterLink} to="/dashboard">
                        <ListItemIcon>
                          <Home fontSize="small" />
                        </ListItemIcon>
                        <Typography textAlign="left">Dashboard</Typography>
                      </MenuItem>
                      <MenuItem component={RouterLink} to="/profile">
                        <ListItemIcon>
                          <AccountCircle fontSize="small" />
                        </ListItemIcon>
                        <Typography textAlign="left">Profile</Typography>
                      </MenuItem>
                      <MenuItem component={RouterLink} to="/settings">
                        <ListItemIcon>
                          <Settings fontSize="small" />
                        </ListItemIcon>
                        <Typography textAlign="left">Settings</Typography>
                      </MenuItem>
                      <MenuItem component={RouterLink} to="/help">
                        <ListItemIcon>
                          <Help fontSize="small" />
                        </ListItemIcon>
                        <Typography textAlign="left">Help</Typography>
                      </MenuItem>
                      <Divider sx={{ mx: 2 }} />
                      <MenuItem component={RouterLink} to="/login" sx={{ color: theme.palette.error.main }}>
                        <ListItemIcon sx={{ color: theme.palette.error.main }}>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        <Typography textAlign="left">Logout</Typography>
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              ) : (
                <>
                  {!isMobile && (
                    <Stack direction="row" spacing={1}>
                      <MotionBox
                        component={RouterLink}
                        to="/login"
                        variants={buttonVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        whileTap="tap"
                        transition={{ duration: 0.2 }}
                        sx={{
                          py: 1,
                          px: 3,
                          color: scrolled ? theme.palette.primary.main : '#fff',
                          border: `2px solid ${scrolled ? theme.palette.primary.main : '#fff'}`,
                          borderRadius: '50px',
                          textDecoration: 'none',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: scrolled ? 'rgba(188, 64, 55, 0.04)' : 'rgba(255, 255, 255, 0.1)',
                          }
                        }}
                      >
                        Login
                      </MotionBox>
                      
                      <MotionBox
                        component={RouterLink}
                        to="/register"
                        variants={buttonVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="hover"
                        whileTap="tap"
                        transition={{ duration: 0.2, delay: 0.1 }}
                        sx={{
                          py: 1,
                          px: 3,
                          backgroundColor: theme.palette.secondary.main,
                          color: '#fff',
                          borderRadius: '50px',
                          textDecoration: 'none',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          // FIX 3: Reduced box-shadow for Sign Up button
                          // boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        Sign Up
                      </MotionBox>
                    </Stack>
                  )}
                  
                  {isMobile && !isSmall && (
                    <Button 
                      variant="contained" 
                      color="secondary"
                      component={RouterLink} 
                      to="/login"
                      size="small"
                      sx={{ borderRadius: '50px', px: 2 }}
                    >
                      Login
                    </Button>
                  )}
                </>
              )}
              
              {/* FIX 2: Menu button moved to the right side for mobile */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{ 
                    ml: 1, 
                    backgroundColor: scrolled ? 'transparent' : 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      backgroundColor: scrolled ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.2)',
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Mobile drawer - FIX 2: Changed to open from right side */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            borderTopLeftRadius: '16px',
            borderBottomLeftRadius: '16px',
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Space to prevent content from hiding under navbar */}
      <Toolbar sx={{ height: scrolled ? 64 : 80 }} />
    </>
  );
};

export default Navbar;
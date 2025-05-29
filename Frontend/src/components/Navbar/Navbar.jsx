import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Switch,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CodeIcon from '@mui/icons-material/Code';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ darkMode, setDarkMode }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'FAQ', path: '/faq' }
  ];

  const settings = isLoggedIn 
    ? [
        { name: 'Dashboard', action: () => navigate('/dashboard') },
        { name: 'Profile', action: () => navigate('/profile') },
        { name: 'Log Out', action: handleLogout }
      ]
    : [
        { name: 'Sign In', action: () => navigate('/login') },
        { name: 'Register', action: () => navigate('/register') }
      ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleLogout() {
    // Handle logout logic here
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/');
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setMobileDrawerOpen(open);
  };

  const navbarStyles = {
    appBar: {
      backgroundColor: scrolled ? 'var(--dashboard-bg)' : 'transparent',
      boxShadow: scrolled ? '0 8px 24px rgba(0, 0, 0, 0.12)' : 'none',
      transition: 'all 0.4s ease',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(var(--theme-color-rgb), 0.1)' : 'none',
    },
    logo: {
      fontFamily: '"Poppins", "Roboto", sans-serif',
      fontWeight: 700,
      letterSpacing: '.15rem',
      color: 'var(--text-color)',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      transition: 'color 0.3s ease',
      '&:hover': {
        color: 'var(--theme-color)',
      }
    },
    logoIcon: {
      marginRight: 1.2,
      color: 'var(--theme-color)',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'rotate(20deg) scale(1.1)',
      },
    },
    navButton: {
      my: 0, 
      color: 'var(--text-color)',
      fontWeight: 600,
      position: 'relative',
      px: 2,
      mx: 0.5,
      transition: 'all 0.3s ease',
      textTransform: 'none',
      fontSize: '1rem',
      letterSpacing: '0.3px',
      borderRadius: '10px',
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '0%',
        height: '3px',
        bottom: '6px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--theme-color)',
        transition: 'width 0.4s cubic-bezier(0.65, 0, 0.35, 1)',
        borderRadius: '4px',
      },
      '&:hover': {
        bgcolor: 'transparent',
        color: 'var(--theme-color)',
        '&::after': {
          width: '70%',
        },
      },
    },
    activeNavButton: {
      color: 'var(--theme-color)',
      fontWeight: 700,
      '&::after': {
        content: '""',
        position: 'absolute',
        width: '70%',
        height: '3px',
        bottom: '6px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'var(--theme-color)',
        borderRadius: '4px',
      },
    },
    switchBase: {
      '&.Mui-checked': {
        color: 'var(--theme-color)',
        '& + .MuiSwitch-track': {
          backgroundColor: 'var(--theme-color)',
          opacity: 0.5,
        },
      },
      transition: 'transform 0.3s cubic-bezier(0.65, 0, 0.35, 1)',
      '&:hover': {
        transform: 'scale(1.05)',
      }
    },
    iconButton: {
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.1)',
        bgcolor: 'transparent',
      },
    },
    userAvatar: {
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      border: '2px solid transparent',
      '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: '0 0 0 2px var(--theme-color)',
      }
    },
  };

  const drawerList = (
    <Box
      sx={{ 
        width: 280,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        p: 3,
        mb: 2,
        borderBottom: '1px solid rgba(var(--theme-color-rgb), 0.1)' 
      }}>
        <CodeIcon sx={{ 
          fontSize: 34, 
          color: 'var(--theme-color)', 
          mr: 1.5 
        }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: '1px' }}>
          Code-Quest
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1, px: 2 }}>
        {pages.map((page) => (
          <ListItem 
            key={page.name} 
            component={Link} 
            to={page.path}
            disablePadding
            sx={{ 
              color: location.pathname === page.path ? 'var(--theme-color)' : 'var(--text-color)',
              bgcolor: location.pathname === page.path ? 'rgba(var(--theme-color-rgb), 0.08)' : 'transparent',
              borderRadius: '8px',
              mb: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                transform: 'translateX(5px)'
              }
            }}
          >
            <ListItemText 
              primary={page.name} 
              sx={{ 
                py: 1, 
                px: 2,
                '& .MuiTypography-root': {
                  fontWeight: location.pathname === page.path ? 600 : 400,
                }
              }} 
            />
            {location.pathname === page.path && (
              <Box 
                sx={{ 
                  width: '4px', 
                  height: '70%', 
                  bgcolor: 'var(--theme-color)', 
                  borderRadius: '4px',
                  mr: 1
                }} 
              />
            )}
          </ListItem>
        ))}
      </List>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 3,
        mt: 'auto',
        borderTop: '1px solid rgba(var(--theme-color-rgb), 0.1)'
      }}>
        <Brightness4Icon sx={{ 
          mr: 1.5, 
          color: darkMode ? 'var(--text-color)' : 'var(--p-color)',
          opacity: darkMode ? 0.5 : 1
        }} />
        <Switch
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          sx={{
            '& .MuiSwitch-switchBase': navbarStyles.switchBase,
          }}
        />
        <Brightness7Icon sx={{ 
          ml: 1.5, 
          color: darkMode ? 'var(--p-color)' : 'var(--text-color)',
          opacity: darkMode ? 1 : 0.5
        }} />
      </Box>
    </Box>
  );

  return (
    <AppBar 
      position="fixed" 
      sx={navbarStyles.appBar}
      elevation={0}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: scrolled ? 0.8 : 1.2, transition: 'padding 0.3s ease' }}>
          {/* Logo for desktop */}
          <CodeIcon sx={{ 
            ...navbarStyles.logoIcon,
            display: { xs: 'none', md: 'flex' }, 
            fontSize: 36 
          }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              ...navbarStyles.logo,
              display: { xs: 'none', md: 'flex' },
              fontSize: '1.5rem',
            }}
          >
            Code-Quest
          </Typography>

          {/* Mobile menu icon and drawer */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="mobile-menu"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
              sx={navbarStyles.iconButton}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={mobileDrawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  bgcolor: 'var(--background-color)',
                  color: 'var(--text-color)',
                  borderRight: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                },
              }}
              transitionDuration={400}
            >
              {drawerList}
            </Drawer>
          </Box>

          {/* Logo for mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <CodeIcon sx={{ 
              ...navbarStyles.logoIcon, 
              display: { xs: 'flex', md: 'none' }, 
              fontSize: 30,
              ml: 0.5
            }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                ...navbarStyles.logo,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontSize: '1.3rem',
              }}
            >
              Code-Quest
            </Typography>
          </Box>

          {/* Desktop navigation links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 5, gap: 1 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  ...navbarStyles.navButton,
                  ...(location.pathname === page.path && navbarStyles.activeNavButton),
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Dark mode toggle for desktop */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            mr: 3,
            borderRadius: '30px',
            bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
            px: 1.5,
            py: 0.5
          }}>
            <Brightness4Icon sx={{ 
              color: darkMode ? 'var(--text-color)' : 'var(--p-color)',
              opacity: darkMode ? 0.7 : 0.3,
              fontSize: 22
            }} />
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              size="small"
              sx={{
                mx: 1,
                '& .MuiSwitch-switchBase': navbarStyles.switchBase,
              }}
            />
            <Brightness7Icon sx={{ 
              color: darkMode ? 'var(--p-color)' : 'var(--text-color)',
              opacity: darkMode ? 0.3 : 0.7,
              fontSize: 22
            }} />
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Account settings" arrow>
              <IconButton 
                onClick={handleOpenUserMenu} 
                sx={{ 
                  p: 0.5,
                  bgcolor: isLoggedIn ? 'transparent' : 'rgba(var(--theme-color-rgb), 0.08)',
                  '&:hover': {
                    bgcolor: 'rgba(var(--theme-color-rgb), 0.12)',
                  }
                }}
              >
                {isLoggedIn ? (
                  <Avatar 
                    alt="User Avatar" 
                    src="/static/images/avatar/2.jpg" 
                    sx={{ 
                      bgcolor: 'var(--theme-color)',
                      width: 40,
                      height: 40,
                      ...navbarStyles.userAvatar
                    }}
                  />
                ) : (
                  <AccountCircleIcon sx={{ 
                    fontSize: 36, 
                    color: 'var(--text-color)',
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'var(--theme-color)',
                    }
                  }} />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '50px' }}
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
              PaperProps={{
                elevation: 8,
                sx: {
                  bgcolor: 'var(--dashboard-bg)',
                  color: 'var(--text-color)',
                  minWidth: '180px',
                  overflow: 'visible',
                  mt: 1.5,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  borderRadius: '10px',
                  border: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: -6,
                    right: 14,
                    width: 12,
                    height: 12,
                    bgcolor: 'var(--dashboard-bg)',
                    transform: 'rotate(45deg)',
                    zIndex: 0,
                    borderTop: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                    borderLeft: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                  },
                },
              }}
              transitionDuration={300}
            >
              {settings.map((setting) => (
                <MenuItem 
                  key={setting.name} 
                  onClick={() => {
                    setting.action();
                    handleCloseUserMenu();
                  }}
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    mx: 1,
                    my: 0.5,
                    borderRadius: '6px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(var(--theme-color-rgb), 0.08)',
                      transform: 'translateX(5px)'
                    },
                  }}
                >
                  <Typography textAlign="center" sx={{ fontWeight: 500 }}>{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
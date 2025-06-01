import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Avatar,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School,
  People,
  EmojiEvents,
  Assessment,
  Settings,
  Person,
  Logout,
  AdminPanelSettings
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService'; // Adjust the import based on your project structure
// Sidebar width
const DRAWER_WIDTH = 240;

// Navigation items for admin dashboard
const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
  { name: 'Teachers', path: '/admin/teachers', icon: <School /> },
  { name: 'Students', path: '/admin/students', icon: <People /> },
  { name: 'Competitions', path: '/admin/competitions', icon: <EmojiEvents /> },
  { name: 'Results', path: '/admin/results', icon: <Assessment /> },
  { name: 'Profile', path: '/admin/profile', icon: <Person /> },
  { name: 'Settings', path: '/admin/settings', icon: <Settings /> }
];

const DashboardSidebar = ({ isOpen, onToggle, currentUser }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Check if path is active
  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === path || location.pathname === '/admin';
    }
    return location.pathname === path;
  };

  // Handle logout
  const handleLogout = () => {
    // Show confirmation dialog or directly logout
    authService.logout();
    navigate('/login');
  };

  // Sidebar content
  const sidebarContent = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* App Logo and Title */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          mb: 1
        }}
      >
        <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
          <AdminPanelSettings />
        </Avatar>
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          Code-Quest Admin
        </Typography>
      </Box>

      <Divider />

      {/* Navigation Links */}
      <List sx={{ flexGrow: 1, px: 1.5 }}>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '8px',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(var(--primary-color-rgb), 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(var(--primary-color-rgb), 0.12)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiTypography-root': {
                    fontWeight: 'bold',
                    color: 'primary.main',
                  },
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mt: 'auto' }} />

      {/* Logout Button */}
      <List sx={{ px: 1.5, pb: 1.5 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '8px',
              color: 'error.main',
              '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: isOpen ? DRAWER_WIDTH : 0 }, flexShrink: 0 }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={isOpen}
          onClose={onToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Drawer
          variant="persistent"
          open={isOpen}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              border: 'none',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Toolbar /> {/* Spacer for AppBar */}
          {sidebarContent}
        </Drawer>
      )}
    </Box>
  );
};

export default DashboardSidebar;
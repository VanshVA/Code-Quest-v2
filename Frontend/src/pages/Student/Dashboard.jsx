import React, { useState, useEffect } from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Dashboard Components
import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import PageLoader from '../../components/common/PageLoader';

// Dashboard Pages
import DashboardHome from './DashboardHome';
import Competitions from './Competitions';
import Results from './Results';
import Profile from './Profile';
import CompetitionDetails from './CompetitionDetails';
import CompetitionWaiting from './CompetitionWaiting';
import CodeEditorScreen from './CodeEditorScreen';
import CompetitionResult from './CompetitionResult';

// Current date and time for status display
const CURRENT_DATE_TIME = "2025-05-30 06:43:29";
const CURRENT_USER = "VanshSharmaSDE";

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  // Check if in full-screen mode (competition or code editor)
  const isFullScreenMode = 
    location.pathname.includes('/competition/participate') ||
    location.pathname.includes('/competition/editor');
  
  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  if (loading) {
    return <PageLoader />;
  }

  return (
    <Box 
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'var(--background-color)',
        color: 'var(--text-color)',
      }}
    >
      {/* Sidebar - Hidden in full-screen mode */}
      {!isFullScreenMode && (
        <Sidebar 
          open={sidebarOpen} 
          onClose={toggleSidebar}
          currentPath={location.pathname} 
          isMobile={isMobile} 
        />
      )}
      
      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(sidebarOpen && !isMobile && !isFullScreenMode && {
            width: `calc(100% - 260px)`,
            // marginLeft: '260px',
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
          ...(isFullScreenMode && {
            width: '100%',
            marginLeft: 0,
          })
        }}
      >
        {/* Header - Hidden in full-screen mode */}
        {!isFullScreenMode && (
          <Header 
            toggleSidebar={toggleSidebar} 
            sidebarOpen={sidebarOpen}
            isMobile={isMobile}
            currentDateTime={CURRENT_DATE_TIME}
            currentUser={CURRENT_USER}
          />
        )}
        
        {/* Page Content */}
        <Box 
          component="div"
          sx={{ 
            p: isFullScreenMode ? 0 : { xs: 2, md: 3 }, 
            mt: isFullScreenMode ? 0 : '70px',
            minHeight: isFullScreenMode ? '100vh' : 'calc(100vh - 70px)',
          }}
        >
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/competitions" element={<Competitions />} />
              <Route path="/results" element={<Results />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/competition/:id" element={<CompetitionDetails />} />
              <Route path="/competition/waiting/:id" element={<CompetitionWaiting />} />
              <Route path="/competition/editor/:id" element={<CodeEditorScreen />} />
              <Route path="/competition/result/:id" element={<CompetitionResult />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
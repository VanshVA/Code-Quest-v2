import React, { Suspense, lazy, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

// Import theme provider
import { ThemeProvider } from './context/ThemeContext';
import authService from './services/authService';

// PageLoader component for suspense fallback
const PageLoader = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      width: '100%'
    }}
  >
    <img src="/assets/loader.svg" alt="Loading..." style={{ width: '60px', height: '60px' }} />
  </Box>
);

// ScrollToTop component to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// AppLayout component to conditionally render dashboard layout
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isTeacherDashboardRoute = location.pathname.startsWith('/teacher/dashboard');
  
  return (
    <Box
      className="App"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--background-color)',
        color: 'var(--text-color)',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {children}
    </Box>
  );
};

// Lazy load pages for better performance
const TeacherLogin = lazy(() => import('./pages/auth/LoginPage'));
const TeacherForgotPassword = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const TeacherResetPassword = lazy(() => import('./pages/auth/ResetPasswordPage'));
const TeacherDashboard = lazy(() => import('./pages/Teacher/Dashboard'));
const Error404 = lazy(() => import('./pages/Error/Error404Page'));

// Protected route component for teacher
const ProtectedTeacherRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = 'teacher';
  return isAuthenticated && userRole === 'teacher' ? children : <Navigate to="/login" />;
};

// Auth route to redirect authenticated users away from login pages
const TeacherAuthRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const userRole = 'teacher';
  return !isAuthenticated || userRole !== 'teacher' ? children : <Navigate to="/teacher/dashboard" />;
};

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <Suspense fallback={<PageLoader />}>
          <ScrollToTop />
          <AppLayout>
            <Routes>
              {/* Root route - Redirect to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Teacher Authentication Routes */}
              <Route path="/login" element={
                <TeacherAuthRoute>
                  <TeacherLogin />
                </TeacherAuthRoute>
              } />
              <Route path="/forgot-password" element={<TeacherForgotPassword />} />
              <Route path="/reset-password/:token" element={<TeacherResetPassword />} />
              
              {/* Teacher Dashboard Routes */}
              <Route path="/teacher/*" element={
                <ProtectedTeacherRoute>
                  <TeacherDashboard />
                </ProtectedTeacherRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<Error404 />} />
            </Routes>
          </AppLayout>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
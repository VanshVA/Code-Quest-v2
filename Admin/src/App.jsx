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
  const isDashboardRoute = location.pathname.startsWith('/admin/dashboard');
  
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
const AdminLogin = lazy(() => import('./pages/Auth/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminError404 = lazy(() => import('./pages/Error/Error404Page'));

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Auth route to redirect authenticated users away from login page
const AuthRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return !isAuthenticated ? children : <Navigate to="/admin/dashboard" />;
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
              {/* Make login page the home page */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              
              {/* Auth route (redirect to dashboard if already logged in) */}
              <Route path="/login" element={
                <AuthRoute>
                  <AdminLogin />
                </AuthRoute>
              } />
              
              {/* Protected dashboard routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<AdminError404 />} />
            </Routes>
          </AppLayout>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
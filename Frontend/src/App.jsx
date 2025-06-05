import React, { Suspense, lazy, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

// Import theme provider
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import authService from './services/authService';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import SupportPage from './pages/Security/SupportPage';
import CookiePolicy from './pages/Security/CookiePolicy';
import SecurityPage from './pages/Security/SecurityPage';
import FeaturePage from './pages/Feature/FeaturePage';
import DocumentationPage from './pages/Documentation/DocumentationPage';
import CompetitionPage from './pages/Competition/CompetitionPage';
import ReferencesPage from './pages/References/ReferencesPage';
import TestimonialsPage from './pages/Testimonial/TestimonialPage';

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

// AppLayout component to conditionally render Navbar and Footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/student');

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
      {/* Only show Navbar if not on dashboard routes */}
      {!isDashboardRoute && <Navbar />}

      <Box sx={{ flex: 1 }}>
        {children}
      </Box>

      {/* Only show Footer if not on dashboard routes */}
      {!isDashboardRoute && <Footer />}
    </Box>
  );
};

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home/Home'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const FAQ = lazy(() => import('./pages/FAQ/Faq'));
const TermsOfUse = lazy(() => import('./pages/Security/TermsPage'));
const PrivacyPolicy = lazy(() => import('./pages/Security/PrivacyPage'));
const Feedback = lazy(() => import('./pages/Feedback/Feedback'));
const Login = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));
const OTPVerificationPage = lazy(() => import('./components/OTPVerificationPage/OTPVerificationPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const StudentDashboard = lazy(() => import('./pages/Student/Dashboard'));
const Error404Page = lazy(() => import('./pages/Error404/Error404Page'));

// Protected route component
const ProtectedStudentRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Auth route to redirect authenticated users away from auth pages
const AuthRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) return children;
  return <Navigate to="/student/dashboard" />;
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
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/features" element={<FeaturePage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="/docs" element={<DocumentationPage />} />
              <Route path="/competitions" element={<CompetitionPage />} />
              <Route path="/Refrences" element={<ReferencesPage />} />
              <Route path="/testimonial" element={<TestimonialsPage />} />

  
              {/* Auth routes (redirect to dashboard if already logged in) */}
              <Route path="/login" element={
                <AuthRoute>
                  <Login />
                </AuthRoute>
              } />
              <Route path="/signup" element={
                <AuthRoute>
                  <SignupPage />
                </AuthRoute>
              } />
              <Route path="/verify-otp" element={<OTPVerificationPage />} />
              <Route path="/forgot-password" element={
                <AuthRoute>
                  <ForgotPasswordPage />
                </AuthRoute>
              } />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

              {/* Student protected routes */}
              <Route path="/student/*" element={
                <ProtectedStudentRoute>
                  <StudentDashboard />
                </ProtectedStudentRoute>
              } />

              {/* For backward compatibility */}
              <Route path="/dashboard/*" element={
                <ProtectedStudentRoute>
                  <StudentDashboard />
                </ProtectedStudentRoute>
              } />
              <Route path="/profile" element={
                <ProtectedStudentRoute>
                  <StudentDashboard />
                </ProtectedStudentRoute>
              } />

              {/* Catch-all route */}
              <Route path="*" element={<Error404Page />} />
            </Routes>
          </AppLayout>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
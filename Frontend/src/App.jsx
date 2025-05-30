import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import theme provider
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AboutPage from './pages/About/About';
import ContactPage from './pages/Contact/Contact';
import FAQPage from './pages/FAQ/Faq';
import TermsPage from './pages/Security/TermsPage';
import PrivacyPage from './pages/Security/PrivacyPage';
import FeedbackPage from './pages/Feedback/Feedback';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import OTPVerificationPage from './components/OTPVerificationPage/OTPVerificationPage';

// Import pages
// import LandingPage from './pages/LandingPage';
// import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import CodeEditor from './pages/CodeEditor';
// import MCQTest from './pages/MCQTest';
// import AdminPanel from './pages/admin/AdminPanel';
// import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/contact" element={<ContactPage/>} />
          <Route path="/faqs" element={<FAQPage/>} />
          <Route path="/terms" element={<TermsPage/>} />
          <Route path="/privacy-policy" element={<PrivacyPage/>} />
          <Route path="/feedback" element={<FeedbackPage/>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/otp-verification" element={<OTPVerificationPage />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/code-editor/:testId" element={<CodeEditor />} /> */}
          {/* <Route path="/mcq-test/:testId" element={<MCQTest />} /> */}
          {/* <Route path="/admin/*" element={<AdminPanel />} /> */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
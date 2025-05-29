import React from 'react';
import { Container, Typography, Box, Paper, Divider, Breadcrumbs } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <Box sx={{ 
      bgcolor: 'var(--background-color)', 
      color: 'var(--text-color)',
      minHeight: '100vh',
      pb: 8,
      pt: 12 // For navbar space
    }}>
      <Container maxWidth="lg">
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 4, color: 'var(--p-color)' }}
        >
          <Link to="/" style={{ color: 'var(--p-color)', textDecoration: 'none' }}>
            Home
          </Link>
          <Typography color="var(--theme-color)">Privacy Policy</Typography>
        </Breadcrumbs>
        
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ mb: 3 }}
        >
          Privacy Policy
        </Typography>
        
        <Typography 
          variant="body2" 
          color="var(--p-color)"
          sx={{ mb: 4 }}
        >
          Last Updated: May 29, 2025
        </Typography>
        
        <Paper sx={{ 
          p: 4,
          bgcolor: 'var(--dashboard-bg)',
          boxShadow: '0 5px 15px var(--background-shadow)',
          mb: 4
        }}>
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            This Privacy Policy describes how your personal information is collected, used, and shared when you visit or use Code-Quest, the online assessment platform for Kothiwal Institute of Technology & Professional Studies (KITPS).
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Information We Collect
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            When you visit the platform, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            Additionally, when you use the platform, we collect the following types of information:
          </Typography>
          
          <Box component="ul" sx={{ color: 'var(--p-color)', pl: 4 }}>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                <strong>Personal Information:</strong> We collect personal information that you provide to us, such as your name, email address, password, and role (student, teacher, or administrator).
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                <strong>Usage Data:</strong> We collect data about how you interact with the platform, including the competitions you participate in, your submissions, scores, and other performance metrics.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                <strong>Code Submissions:</strong> We collect and store the code you submit as part of competitions or practice exercises.
              </Typography>
            </li>
          </Box>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            How We Use Your Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            We use the information we collect to:
          </Typography>
          
          <Box component="ul" sx={{ color: 'var(--p-color)', pl: 4 }}>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Provide, maintain, and improve the platform
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Process and evaluate your code submissions
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Generate performance metrics and analytics
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Communicate with you, including sending notifications about competitions, results, and platform updates
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Monitor and analyze trends, usage, and activities in connection with the platform
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Detect, investigate, and prevent fraudulent transactions and other illegal activities and protect the rights and property of Code-Quest and others
              </Typography>
            </li>
          </Box>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Sharing Your Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            We share your information with third parties as follows:
          </Typography>
          
          <Box component="ul" sx={{ color: 'var(--p-color)', pl: 4 }}>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                <strong>Within the Institution:</strong> Your information is shared with authorized personnel at KITPS, including teachers and administrators, for educational and administrative purposes.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                <strong>Service Providers:</strong> We share your information with service providers who provide services on our behalf, such as hosting, database management, and analytics.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                <strong>Competition Results:</strong> Competition results, including participant names and rankings, may be publicly displayed on leaderboards within the platform.
              </Typography>
            </li>
          </Box>
          
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)', mt: 2 }}>
            We may also share your information as necessary to comply with applicable law, enforce our policies, or protect our or others' rights, property, or safety.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Data Security
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            We take reasonable measures to protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Your Rights
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            You have the right to:
          </Typography>
          
          <Box component="ul" sx={{ color: 'var(--p-color)', pl: 4 }}>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Access and update your personal information
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Request deletion of your personal information
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Object to the processing of your personal information
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Export your data in a portable format
              </Typography>
            </li>
          </Box>
          
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)', mt: 2 }}>
            To exercise these rights, please contact us at privacy@codequest-kitps.edu.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Changes to This Privacy Policy
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Contact Us
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'var(--p-color)' }}>
            Email: privacy@codequest-kitps.edu
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--p-color)' }}>
            Address: Kothiwal Institute of Technology & Professional Studies, Moradabad, Uttar Pradesh, India
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
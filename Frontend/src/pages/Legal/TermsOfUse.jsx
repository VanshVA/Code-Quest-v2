import React from 'react';
import { Container, Typography, Box, Paper, Divider, Breadcrumbs } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link } from 'react-router-dom';

const TermsOfUse = () => {
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
          <Typography color="var(--theme-color)">Terms of Use</Typography>
        </Breadcrumbs>
        
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{ mb: 3 }}
        >
          Terms of Use
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
            Welcome to Code-Quest, the online assessment platform for Kothiwal Institute of Technology & Professional Studies (KITPS). By accessing or using our platform, you agree to be bound by these Terms of Use and our Privacy Policy.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            1. Acceptance of Terms
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            By accessing or using Code-Quest, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the platform.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            2. User Accounts
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            2.1. To use certain features of the platform, you must create an account. You are responsible for maintaining the confidentiality of your account information, including your password.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            2.2. You are responsible for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            2.3. You must provide accurate and complete information when creating your account and keep your account information updated.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            3. User Roles and Access
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            3.1. Code-Quest provides different levels of access based on user roles:
          </Typography>
          
          <Box component="ul" sx={{ color: 'var(--p-color)', pl: 4 }}>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                <strong>Students:</strong> Can participate in competitions, submit code, view results, and access practice materials.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                <strong>Teachers:</strong> Can create assessments, review submissions, manage student access, and view analytics.
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                <strong>Administrators:</strong> Have full platform access, including user management, system configuration, and comprehensive analytics.
              </Typography>
            </li>
          </Box>
          
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            3.2. Users must not attempt to access features or areas of the platform that are outside their designated role permissions.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            4. Code Submissions and Intellectual Property
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            4.1. By submitting code to the platform, you retain ownership of your code.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            4.2. You grant Code-Quest and KITPS a non-exclusive, royalty-free license to use, store, display, and analyze your submissions for educational purposes and platform functionality.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            4.3. You must not submit code or content that infringes on the intellectual property rights of others.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            5. Prohibited Conduct
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            You agree not to:
          </Typography>
          
          <Box component="ul" sx={{ color: 'var(--p-color)', pl: 4 }}>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Use the platform to cheat, plagiarize, or engage in academic dishonesty
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Attempt to gain unauthorized access to other users' accounts or restricted areas of the platform
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Upload malicious code or content intended to disrupt the platform
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Submit code designed to bypass the platform's security or evaluation mechanisms
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Share your account credentials with others or allow others to use your account
              </Typography>
            </li>
            <li>
              <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
                Harass, bully, or intimidate other users
              </Typography>
            </li>
          </Box>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            6. Academic Integrity
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            6.1. Code-Quest is designed to support learning and fair assessment. All submissions are subject to plagiarism detection.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            6.2. Violations of academic integrity may result in penalties, including but not limited to disqualification from competitions, reduced scores, and account suspension.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            6.3. Serious violations may be reported to KITPS administration for additional disciplinary action.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            7. Modifications to the Platform and Terms
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            7.1. We reserve the right to modify or discontinue, temporarily or permanently, the platform or any features or portions thereof without prior notice.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            7.2. We may update these Terms of Use from time to time. The revised terms will be posted on this page with an updated "Last Updated" date.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            8. Limitation of Liability
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            8.1. Code-Quest is provided "as is" without warranties of any kind, either express or implied.
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            8.2. We will not be liable for any indirect, incidental, special, consequential or punitive damages, including loss of profits, data, or goodwill, service interruption, or computer damage.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            9. Governing Law
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            These Terms of Use shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
          </Typography>
          
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            10. Contact Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph sx={{ color: 'var(--p-color)' }}>
            If you have any questions about these Terms of Use, please contact us at:
          </Typography>
          
          <Typography variant="body1" sx={{ color: 'var(--p-color)' }}>
            Email: terms@codequest-kitps.edu
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--p-color)' }}>
            Address: Kothiwal Institute of Technology & Professional Studies, Moradabad, Uttar Pradesh, India
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfUse;
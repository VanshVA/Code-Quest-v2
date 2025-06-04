import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AccessTime,
  ArrowForward,
  AutoAwesome,
  Check,
  ContentCopy,
  Download,
  ErrorOutline,
  Fingerprint,
  HomeOutlined,
  LockOutlined,
  NavigateNext,
  PhishingOutlined,
  PublicOutlined,
  SecurityOutlined,
  ShieldOutlined,
  VerifiedOutlined,
  VerifiedUser,
  VpnKeyOutlined,
  WarningAmber,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Current date and user info as specified
// const CURRENT_DATE_TIME = "2025-05-30 18:59:16";
// const CURRENT_USER = "Anuj-prajapati-SDE";

// Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

// Security certifications
const securityCertifications = [
  { name: 'ISO 27001', description: 'Information security management', icon: <ShieldOutlined /> },
  { name: 'SOC 2 Type II', description: 'Service organization control', icon: <VerifiedOutlined /> },
  { name: 'GDPR Compliant', description: 'EU data protection regulation', icon: <PublicOutlined /> },
  { name: 'PCI DSS', description: 'Payment card security standard', icon: <LockOutlined /> },
];

// Security features
const securityFeatures = [
  { 
    title: 'Two-Factor Authentication (2FA)', 
    description: 'Add an extra layer of security by requiring a second form of verification beyond your password.',
    icon: <VpnKeyOutlined />,
    link: '/security/2fa'
  },
  { 
    title: 'End-to-End Encryption', 
    description: 'All sensitive data and communications are encrypted both in transit and at rest using industry-leading encryption standards.',
    icon: <LockOutlined />,
    link: '/security/encryption'
  },
  { 
    title: 'Biometric Authentication', 
    description: 'Enable fingerprint or face recognition for a more secure and convenient login experience.',
    icon: <Fingerprint />,
    link: '/security/biometric'
  },
  { 
    title: 'Phishing Protection', 
    description: 'Advanced detection systems to identify and block suspicious login attempts and phishing attacks.',
    icon: <PhishingOutlined />,
    link: '/security/phishing-protection'
  },
];

// Security bulletins
const securityBulletins = [
  {
    id: 'SB-2025-05',
    title: 'Important Security Update for Desktop App',
    date: '2025-05-28',
    severity: 'high',
    description: 'A critical security update has been released for our desktop application addressing a remote code execution vulnerability. All users should update to version 4.8.3 immediately.'
  },
  {
    id: 'SB-2025-04',
    title: 'Enhanced Password Policy Implementation',
    date: '2025-05-15',
    severity: 'medium',
    description: 'We are strengthening our password requirements to improve account security. All users will be prompted to update their passwords within the next 30 days.'
  },
  {
    id: 'SB-2025-03',
    title: 'New Security Features Release',
    date: '2025-05-02',
    severity: 'low',
    description: 'We have added new security features including enhanced login alerts, improved session management, and additional account recovery options.'
  }
];

const SecurityPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';
  const [activeTab, setActiveTab] = useState(0);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Could add a snackbar/toast notification here
  };

  return (
    <Box sx={{ bgcolor: isDark ? 'background.default' : '#f8f9fa', minHeight: '100vh' }}>
    

        {/* Hero Section */}
                <Box 
                  component="section" 
                  sx={{ 
                    position: 'relative',
                    pt: { xs: '100px', sm: '120px', md: '120px' },
                    pb: { xs: '60px', sm: '80px', md: '100px' },
                    overflow: 'hidden',
                  }}
                >
                   {/* Top Badge */}
                                 
                  <Container maxWidth="lg"> 
                           
                    <Grid 
                      container 
                      spacing={{ xs: 4, md: 8 }}
                      alignItems="center" 
                      justifyContent="center"
                    >
                      <Grid item xs={12} md={10} lg={8} sx={{ textAlign: 'center' }}>
                        <MotionBox
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    sx={{ mb: 3, display: 'inline-block',}}
                                  >
                                    <Chip 
                                      label="Security Center CODE-QUEST" 
                                      color="primary"
                                      size="small"
                                      icon={<AutoAwesome sx={{ color: 'white !important', fontSize: '0.85rem', }} />}
                                      sx={{ 
                                        background: theme.palette.gradients.primary,
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                        letterSpacing: 1.2,
                                        py: 2.2,
                                        pl: 1,
                                        pr: 2,
                                        borderRadius: '100px',
                                        boxShadow: '0 8px 16px rgba(188, 64, 55, 0.2)',
                                        '& .MuiChip-icon': { 
                                          color: 'white',
                                          mr: 0.5
                                        }
                                      }}
                                    />
                                  </MotionBox> 
                        <MotionBox>
                          {/* Page Title */}
                          <MotionTypography
                            variant="h1"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            sx={{ 
                              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.8rem' },
                              fontWeight: 800,
                              lineHeight: 1.1,
                              mb: { xs: 3, md: 4 },
                              letterSpacing: '-0.02em',
                            }}
                          >
                        Security Center
                            <Box 
                              component="span" 
                              sx={{
                                display: 'block',
                                background: theme.palette.gradients.primary,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textFillColor: 'transparent',
                              }}
                            >
                              Protecting Your Code, Your Data, Your Trust
                            </Box>
                          </MotionTypography>
                          
                          {/* Subheadline */}
                          <MotionTypography
                            variant="h5"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            color="textSecondary"
                            sx={{ 
                              mb: 5,
                              fontWeight: 400,
                              lineHeight: 1.5,
                              fontSize: { xs: '1.1rem', md: '1.3rem' },
                              maxWidth: '800px',
                              mx: 'auto',
                            }}
                          >
                            Welcome to Code-Quest! By using our platform, you agree to our terms and conditions. Please read them carefully to understand your rights and responsibilities.
                          </MotionTypography>
                        </MotionBox>
                      </Grid>
                    </Grid>
                  </Container>
                </Box>
      

      {/* Certification Cards */}
      <Box sx={{ mt: { xs: -4, md: 0 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {securityCertifications.map((cert, index) => (
              <Grid item xs={6} md={3} key={cert.name}>
                <MotionCard 
                  elevation={3}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  sx={{
                    height: '100%',
                    borderRadius: 2,
                    textAlign: 'center',
                    p: { xs: 2, md: 3 },
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Box 
                    sx={{ 
                      mb: 2,
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    {React.cloneElement(cert.icon, { 
                      sx: { 
                        fontSize: 48, 
                        color: theme.palette.primary.main 
                      } 
                    })}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {cert.description}
                  </Typography>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 8 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            aria-label="security tabs"
            sx={{ 
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                minWidth: 120,
              }
            }}
          >
            <Tab label="Security Features" id="tab-0" />
            <Tab label="Security Bulletins" id="tab-1" />
            <Tab label="Compliance" id="tab-2" />
          </Tabs>
        </Box>
        
        {/* Tab Content */}
        <Box sx={{ mb: 6 }}>
          {/* Security Features */}
          {activeTab === 0 && (
            <Box>
              <Grid container spacing={3}>
                {securityFeatures.map((feature, index) => (
                  <Grid item xs={12} md={6} key={feature.title} sx={{minWidth:"100%"}}>
                    <MotionCard 
                      elevation={1}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      sx={{ 
                        p: 3, 
                        borderRadius: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Box sx={{ display: 'flex', mb: 2, alignItems: 'flex-start' }}>
                        <Box
                          sx={{ 
                            mr: 2,
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: isDark 
                              ? 'rgba(255, 255, 255, 0.04)' 
                              : theme.palette.primary.light + '20',
                          }}
                        >
                          {React.cloneElement(feature.icon, { 
                            sx: { 
                              fontSize: 28,
                              color: theme.palette.primary.main,
                            }
                          })}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 'auto' }}>
                        <Button 
                          variant="text" 
                          component={RouterLink}
                          to={feature.link}
                          endIcon={<ArrowForward />}
                          sx={{ 
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                        >
                          Learn more
                        </Button>
                      </Box>
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          {/* Security Bulletins */}
          {activeTab === 1 && (
            <Box>
              <Stack spacing={3}>
                {securityBulletins.map((bulletin) => (
                  <Paper 
                    key={bulletin.id} 
                    elevation={1} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      borderLeft: `4px solid ${
                        bulletin.severity === 'high' ? theme.palette.error.main : 
                        bulletin.severity === 'medium' ? theme.palette.warning.main :
                        theme.palette.success.main
                      }`,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {bulletin.title}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            ID: {bulletin.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Released: {bulletin.date}
                          </Typography>
                          <Chip 
                            size="small"
                            label={bulletin.severity.charAt(0).toUpperCase() + bulletin.severity.slice(1)}
                            color={
                              bulletin.severity === 'high' ? 'error' : 
                              bulletin.severity === 'medium' ? 'warning' : 
                              'success'
                            }
                            icon={
                              bulletin.severity === 'high' ? <ErrorOutline fontSize="small" /> : 
                              bulletin.severity === 'medium' ? <WarningAmber fontSize="small" /> : 
                              <Check fontSize="small" />
                            }
                          />
                        </Stack>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={() => handleCopy(bulletin.id)}
                        sx={{ 
                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                          '&:hover': {
                            bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                          }
                        }}
                        title="Copy bulletin ID"
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2">
                      {bulletin.description}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ textTransform: 'none' }}
                        component={RouterLink}
                        to={`/security/bulletins/${bulletin.id}`}
                      >
                        View details
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Stack>
              
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Button 
                  variant="outlined" 
                  component={RouterLink}
                  to="/security/bulletins"
                  startIcon={<ArrowForward />}
                  sx={{ textTransform: 'none' }}
                >
                  View all security bulletins
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Compliance */}
          {activeTab === 2 && (
            <Box>
              <Alert 
                severity="info"
                variant="outlined"
                sx={{ mb: 4 }}
              >
                Our platform is designed with security and compliance in mind. Below you can find information about our compliance certifications and download relevant documentation.
              </Alert>
              
              <Grid container spacing={4} sx={{  minWidth: '100%' }}>
                <Grid item xs={12} md={6} sx={{ justifyContent: 'center', display: 'flex', alignItems:"center",  }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Compliance Certifications
                  </Typography>
                  <List disablePadding>
                    <ComplianceItem 
                      title="ISO 27001:2022"
                      description="Information Security Management System (ISMS)"
                      date="Valid until December 2025"
                    />
                    <ComplianceItem 
                      title="SOC 2 Type II"
                      description="Service Organization Control for Security, Availability, and Confidentiality"
                      date="Audited annually"
                    />
                    <ComplianceItem 
                      title="GDPR Compliance"
                      description="General Data Protection Regulation"
                      date="Continuous compliance"
                    />
                    <ComplianceItem 
                      title="HIPAA"
                      description="Health Insurance Portability and Accountability Act"
                      date="For healthcare customers"
                      last
                    />
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Documentation
                  </Typography>
                  
                  <Stack spacing={2}>
                    <Paper 
                      elevation={1}
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SecurityOutlined sx={{ mr: 2, color: 'primary.main' }} />
                        <Typography variant="body1">Security Whitepaper</Typography>
                      </Box>
                      <Button
                        startIcon={<Download />}
                        size="small"
                        sx={{ textTransform: 'none' }}
                      >
                        PDF
                      </Button>
                    </Paper>
                    
                    <Paper 
                      elevation={1}
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ShieldOutlined sx={{ mr: 2, color: 'primary.main' }} />
                        <Typography variant="body1">Data Processing Addendum</Typography>
                      </Box>
                      <Button
                        startIcon={<Download />}
                        size="small"
                        sx={{ textTransform: 'none' }}
                      >
                        DOC
                      </Button>
                    </Paper>
                    
                    <Paper 
                      elevation={1}
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <VpnKeyOutlined sx={{ mr: 2, color: 'primary.main' }} />
                        <Typography variant="body1">Code Quest Trust Center</Typography>
                      </Box>
                      <Button
                        endIcon={<ArrowForward />}
                        size="small"
                        component={RouterLink}
                        to="/trust"
                        sx={{ textTransform: 'none' }}
                      >
                        Visit
                      </Button>
                    </Paper>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
        
        {/* Security Status Panel */}
        <Box 
          sx={{ 
            mb: 6, 
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center' }}>
                <VerifiedOutlined sx={{ mr: 1, color: 'success.main' }} />
                All Systems Operational
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our platform is currently up and running without any known security incidents.
                We continuously monitor for threats and vulnerabilities.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/security/status"
                endIcon={<ArrowForward />}
                sx={{ textTransform: 'none' }}
              >
                View Status History
              </Button>
            </Grid>
          </Grid>
        </Box>
        
       
      </Container>
      
    </Box>
  );
};

// Compliance item component
const ComplianceItem = ({ title, description, date, last = false }) => (
  <ListItem 
    sx={{ 
      px: 0, 
      py: 2,
      borderBottom: !last ? '1px solid' : 'none',
      borderBottomColor: 'divider'
    }}
  >
    <ListItemIcon>
      <VerifiedOutlined color="primary" />
    </ListItemIcon>
    <ListItemText
      primary={title}
      secondary={
        <>
          <Typography variant="body2" color="text.secondary" component="span">
            {description}
          </Typography>
          <Typography 
            variant="body2" 
            component="div"
            sx={{ 
              color: 'text.secondary',
              mt: 0.5,
              fontSize: '0.8rem',
              opacity: 0.8
            }}
          >
            {date}
          </Typography>
        </>
      }
    />
  </ListItem>
);

// Resource card component
const ResourceCard = ({ title, description, link, color }) => {
  const theme = useTheme();
  
  return (
    <MotionCard 
      component={RouterLink}
      to={link}
      elevation={1}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box sx={{ height: 8, bgcolor: color }} />
      <CardContent sx={{ px: 3, py: 2.5, flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {description}
        </Typography>
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            color: color,
            mt: 'auto',
            fontWeight: 600
          }}
        >
          Learn more <ArrowForward sx={{ ml: 1, fontSize: '1rem' }} />
        </Box>
      </CardContent>
    </MotionCard>
  );
};

export default SecurityPage;
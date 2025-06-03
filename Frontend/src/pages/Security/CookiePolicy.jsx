import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  AccessTime,
  ArrowRight,
  AutoAwesome,
  CheckCircle,
  Cookie,
  ExpandMore,
  Home,
  NavigateNext,
  Security,
  Shield,
  VerifiedUser,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// Current date and user info as specified
const CURRENT_DATE_TIME = "2025-05-30 18:42:15";

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

// Cookie types data
const cookieCategories = [
  {
    name: "Essential Cookies",
    description:
      "These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.",
    required: true,
    examples: [
      {
        name: "session_id",
        purpose: "Maintains your session across page requests",
        duration: "Session",
      },
      {
        name: "csrf_token",
        purpose: "Protects against Cross-Site Request Forgery attacks",
        duration: "Session",
      },
      {
        name: "auth_token",
        purpose: "Authenticates logged-in users",
        duration: "30 days",
      },
    ],
  },
  {
    name: "Functionality Cookies",
    description:
      "These cookies enhance the functionality and personalization of the website. They may be set by us or by third-party providers whose services we have added to our pages.",
    required: false,
    examples: [
      {
        name: "language",
        purpose: "Remembers your preferred language",
        duration: "1 year",
      },
      {
        name: "theme",
        purpose: "Stores your theme preference (light/dark)",
        duration: "1 year",
      },
      {
        name: "ui_settings",
        purpose: "Saves your interface customizations",
        duration: "1 year",
      },
    ],
  },
  {
    name: "Analytics Cookies",
    description:
      "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and your experience.",
    required: false,
    examples: [
      {
        name: "_ga",
        purpose: "Google Analytics - Distinguishes users",
        duration: "2 years",
      },
      {
        name: "_gid",
        purpose: "Google Analytics - Registers a unique ID for tracking",
        duration: "24 hours",
      },
      {
        name: "_gat",
        purpose: "Google Analytics - Throttles request rate",
        duration: "1 minute",
      },
    ],
  },
  {
    name: "Marketing Cookies",
    description:
      "These cookies track your browsing habits to enable us and third-party advertising partners to deliver ads that may be of interest to you. They are also used to limit the number of times you see an ad and help measure the effectiveness of ad campaigns.",
    required: false,
    examples: [
      {
        name: "ads_id",
        purpose: "Used to identify you to ad networks",
        duration: "3 months",
      },
      {
        name: "campaign_ref",
        purpose: "Tracks referral source for marketing campaigns",
        duration: "30 days",
      },
      {
        name: "conversion_tracking",
        purpose: "Measures ad conversions",
        duration: "90 days",
      },
    ],
  },
];

// Last updated date
const lastUpdated = "May 15, 2025";

const CookiePolicy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDark = theme.palette.mode === "dark";

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    essential: true,
    functionality: false,
    analytics: false,
    marketing: false,
  });

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  return (
    <Box
      sx={{
        bgcolor: isDark ? "background.default" : "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Page Header */}
        {/* Hero Section */}
                <Box 
                  component="section" 
                  sx={{ 
                    position: 'relative',
                    pt: { xs: '100px', sm: '120px', md: '120px' },
                    pb: { xs: '60px', sm: '80px', md: '30px' },
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
                                      label=" Cookie Policy CODE-QUEST" 
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
                       Cookie Policy
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
                              Your Privacy Matters
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
                            We use cookies to enhance your experience, analyze site traffic, and serve personalized content. By using our site, you agree to our use of cookies as outlined in our Cookie Policy.
                          </MotionTypography>
                        </MotionBox>
                      </Grid>
                    </Grid>
                  </Container>
                </Box>
      

      {/* Main Content */}
      <Container maxWidth="100%" sx={{ py: { xs: 4, md: 6 } }} >
        <Grid container spacing={4}   sx={{
  display: { md: 'flex' },
  flexDirection: { md: 'row' },
  flexWrap: { md: 'nowrap' }
}}>
          {/* Sidebar */}
          <Grid item xs={12} md={3} sx={{ minWidth: { md: '300px' } }}>
            <Paper
              elevation={1}
              sx={{
                p: 3,
                borderRadius: 2,
                position: { md: "sticky" },
                top: { md: 24 },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                On this page
              </Typography>
              <List>
                <ListItemLink href="#introduction" text="Introduction" />
                <ListItemLink
                  href="#what-are-cookies"
                  text="What are cookies?"
                />
                <ListItemLink
                  href="#how-we-use-cookies"
                  text="How we use cookies"
                />
                <ListItemLink
                  href="#types-of-cookies"
                  text="Types of cookies"
                />
                <ListItemLink
                  href="#managing-cookies"
                  text="Managing cookies"
                />
                <ListItemLink href="#updates" text="Policy updates" />
                <ListItemLink href="#contact" text="Contact us" />
              </List>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" color="text.secondary">
                Last updated: {lastUpdated}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<Shield />}
                  component={RouterLink}
                  to="/privacy-policy"
                  fullWidth
                  sx={{ mb: 2, textTransform: "none" }}
                >
                  Privacy Policy
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Security />}
                  component={RouterLink}
                  to="/terms-of-service"
                  fullWidth
                  sx={{ textTransform: "none" }}
                >
                  Terms of Service
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Content */}
          <Grid item xs={12} md={6} style={{minWeight:"70%"}}>
            <Paper
              elevation={1}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 2,
              }}
            >
              <section id="introduction">
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Introduction
                </Typography>
                <Typography variant="body1" paragraph>
                  This Cookie Policy explains how Code Quest ("we", "us", "our")
                  uses cookies and similar technologies to recognize you when
                  you visit our website and use our services. It explains what
                  these technologies are and why we use them, as well as your
                  rights to control our use of them.
                </Typography>
                <Typography variant="body1" paragraph>
                  By continuing to browse or use our website, you are agreeing
                  to our use of cookies as described in this Cookie Policy.
                </Typography>
              </section>

              <Divider sx={{ my: 4 }} />

              <section id="what-are-cookies">
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  What are cookies?
                </Typography>
                <Typography variant="body1" paragraph>
                  Cookies are small data files that are placed on your computer
                  or mobile device when you visit a website. They are widely
                  used by website owners to help their websites work
                  efficiently, provide analytical information, and deliver a
                  personalized experience.
                </Typography>
                <Typography variant="body1" paragraph>
                  Cookies set by the website owner (in this case, Code Quest)
                  are called "first-party cookies". Cookies set by parties other
                  than the website owner are called "third-party cookies".
                  Third-party cookies enable features or functionality to be
                  provided on or through the website (such as advertising,
                  interactive content, and analytics).
                </Typography>
                <Typography variant="body1" paragraph>
                  Cookies can remain on your computer or mobile device for
                  different periods of time. Some cookies are "session cookies",
                  which are deleted when you close your browser. Others are
                  "persistent cookies", which remain on your device for a set
                  period of time or until you delete them manually.
                </Typography>
              </section>

              <Divider sx={{ my: 4 }} />

              <section id="how-we-use-cookies">
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  How we use cookies
                </Typography>
                <Typography variant="body1" paragraph>
                  We use cookies for several reasons. Some cookies are required
                  for technical reasons for our website to operate, and we refer
                  to these as "essential" or "necessary" cookies. Other cookies
                  enable us to track and target the interests of our users to
                  enhance the experience on our website. Third parties may also
                  serve cookies through our website for advertising, analytics,
                  and other purposes.
                </Typography>
                <Typography variant="body1" paragraph>
                  The specific types of first and third-party cookies served
                  through our website and the purposes they perform are
                  described in detail below.
                </Typography>
              </section>

              <Divider sx={{ my: 4 }} />

              <section id="types-of-cookies">
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Types of cookies we use
                </Typography>

                {cookieCategories.map((category, index) => {
                  const sectionKey = category.name
                    .toLowerCase()
                    .replace(/\s+/g, "");
                  const isExpanded = expandedSections[sectionKey];

                  return (
                    <Box
                      key={sectionKey}
                      sx={{
                        mb: 4,
                        border: `1px solid ${
                          isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"
                        }`,
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          p: 3,
                          bgcolor: isDark
                            ? "rgba(255,255,255,0.03)"
                            : "rgba(0,0,0,0.01)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleSection(sectionKey)}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {category.name}
                            {category.required && (
                              <Typography
                                variant="caption"
                                sx={{
                                  ml: 2,
                                  bgcolor: theme.palette.primary.main,
                                  color: "white",
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  fontWeight: 600,
                                }}
                              >
                                Required
                              </Typography>
                            )}
                          </Typography>
                        </Box>
                        <ExpandMore
                          sx={{
                            transform: isExpanded
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </Box>

                      {isExpanded && (
                        <Box sx={{ p: 3 }}>
                          <Typography variant="body1" paragraph>
                            {category.description}
                          </Typography>

                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, mt: 2, mb: 1 }}
                          >
                            Examples:
                          </Typography>

                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 600 }}>
                                    Cookie Name
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>
                                    Purpose
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: 600 }}>
                                    Duration
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {category.examples.map((cookie) => (
                                  <TableRow key={cookie.name}>
                                    <TableCell
                                      sx={{
                                        fontFamily: "monospace",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {cookie.name}
                                    </TableCell>
                                    <TableCell>{cookie.purpose}</TableCell>
                                    <TableCell>{cookie.duration}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </section>

              <Divider sx={{ my: 4 }} />

              <section id="managing-cookies">
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Managing cookies
                </Typography>
                <Typography variant="body1" paragraph>
                  You can manage your cookie preferences by adjusting your
                  browser settings. Most web browsers allow you to control
                  cookies through their settings. You can set your browser to
                  refuse all or some cookies, or to alert you when websites set
                  or access cookies. If you disable or refuse cookies, please
                  note that some parts of our website may not function properly.
                </Typography>
                <Typography variant="body1" paragraph>
                  The methods for managing cookies vary by browser. You can find
                  information on how to manage cookies in your particular
                  browser by visiting its help pages:
                </Typography>

                <Box component="ul" sx={{ mb: 3, pl: 4 }}>
                  <li>
                    <Link
                      href="https://support.google.com/chrome/answer/95647"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Chrome
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Mozilla Firefox
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Safari
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Microsoft Edge
                    </Link>
                  </li>
                </Box>

                <Typography variant="body1" paragraph>
                  In addition to the browser settings, you can also manage
                  third-party cookies by visiting:
                </Typography>

                <Box component="ul" sx={{ mb: 3, pl: 4 }}>
                  <li>
                    <Link
                      href="http://optout.aboutads.info/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Digital Advertising Alliance
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="http://www.youronlinechoices.eu/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Your Online Choices (EU)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="http://www.networkadvertising.org/managing/opt_out.asp"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Network Advertising Initiative
                    </Link>
                  </li>
                </Box>
              </section>

              <Divider sx={{ my: 4 }} />

              <section id="updates">
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Updates to this Cookie Policy
                </Typography>
                <Typography variant="body1" paragraph>
                  We may update this Cookie Policy from time to time to reflect
                  changes in technology, regulation, our business practices, or
                  for other reasons. If we do, we will post the updated policy
                  on our website and update the "last updated" date at the top
                  of this policy. In some cases, we may also provide additional
                  notice to you, such as by displaying a prominent notice on our
                  website or by sending you an email.
                </Typography>
                <Typography variant="body1" paragraph>
                  We encourage you to check this page periodically to stay
                  informed about our use of cookies and related technologies.
                </Typography>
              </section>

              <Divider sx={{ my: 4 }} />

              <section id="contact">
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                  Contact us
                </Typography>
                <Typography variant="body1" paragraph>
                  If you have any questions about our use of cookies or this
                  Cookie Policy, please contact us at:
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Email:{" "}
                  <Link href="mailto:privacy@codequest.com">
                    privacy@codequest.com
                  </Link>
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Postal Address: 88 Tech Boulevard, Silicon Valley, CA 94043,
                  USA
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                  Phone: +1 (555) 234-5678
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/contact"
                  startIcon={<ArrowRight />}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  Contact Our Privacy Team
                </Button>
              </section>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Cookie Consent Banner (Example) */}
      {/* <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "background.paper",
          boxShadow: "0px -2px 15px rgba(0,0,0,0.1)",
          zIndex: 1000,
          p: { xs: 2, md: 3 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="body1" sx={{ mb: { xs: 2, md: 0 } }}>
                We use cookies to enhance your browsing experience, serve
                personalized content, and analyze our traffic. By clicking
                "Accept All", you consent to our use of cookies.
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={5}
              sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
            >
              <Button
                variant="outlined"
                color="inherit"
                sx={{
                  flexGrow: { xs: 1, md: 0 },
                  flexBasis: { xs: "45%", md: "auto" },
                }}
              >
                Cookie Settings
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                sx={{
                  flexGrow: { xs: 1, md: 0 },
                  flexBasis: { xs: "45%", md: "auto" },
                }}
              >
                Accept Necessary
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  flexGrow: { xs: 1, md: 0 },
                  flexBasis: { xs: "100%", md: "auto" },
                }}
              >
                Accept All
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box> */}
    </Box>
  );
};

// Helper component for sidebar links
const ListItemLink = ({ href, text }) => (
  <Box
    component="li"
    sx={{
      listStyleType: "none",
      mb: 1.5,
    }}
  >
    <Link
      href={href}
      underline="hover"
      sx={{
        display: "flex",
        alignItems: "center",
        color: "text.primary",
        fontWeight: 500,
        "&:hover": {
          color: "primary.main",
        },
      }}
    >
      <ArrowRight fontSize="small" sx={{ mr: 1 }} />
      {text}
    </Link>
  </Box>
);

const List = ({ children }) => (
  <Box component="ul" sx={{ pl: 0, m: 0 }}>
    {children}
  </Box>
);

export default CookiePolicy;

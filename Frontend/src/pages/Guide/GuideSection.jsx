import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  FormatQuote,
  LinkedIn,
  Twitter,
  Email,
  ArrowForward,
  VerifiedUser,
  School
} from '@mui/icons-material';
import Director from '../../assets/menu_director.jpg';
import Principal from '../../assets/menu_principal.jpg';
import HOD from '../../assets/Salman Sir.jpg'


const GuideSection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const MotionBox = motion(Box);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Leaders data
  const leaders = [
    {
      id: 1,
      name: "KK Mishra Sir",
      title: "Director",
      organization: "KITPS",
      image: Director,
      message: "At KITPS, we believe in providing students with cutting-edge opportunities to develop their technical skills. Code Quest represents our commitment to fostering innovation and problem-solving abilities among our bright young minds.",
      vision: "Our vision is to create a learning environment where students can explore their potential through practical challenges that mirror real-world scenarios.",
      linkedIn: "https://linkedin.com",
      email: "robert.williams@kitps.edu"
    },
    {
      id: 2,
      name: "Dr. Atul Rai Sir",
      title: "Principal",
      organization: "KITPS",
      image: Principal,
      message: "Code Quest is designed to provide our students with a platform to showcase their programming talents and problem-solving abilities. This competition encourages creative thinking and technical excellence, which are crucial skills for future innovators.",
      vision: "We aim to inspire a culture of computational thinking and algorithmic problem-solving that prepares our students for the challenges of tomorrow's technology landscape.",
      linkedIn: "https://linkedin.com",
      email: "atul.rai@kitps.edu"
    },
    {
      id: 3,
      name: "Mr Salmaan Siddiqui",
      title: "HOD (CS & IT)",
      organization: "KITPS",
      image: HOD,
      message: "Code Quest is designed to challenge students to think beyond the conventional and push their boundaries in programming. Through this initiative, we aim to nurture analytical thinking and collaborative problem-solving skills that are essential in today's digital world.",
      vision: "I believe that learning happens best when students are engaged in meaningful challenges. The three-tiered approach creates a comprehensive experience.",
      linkedIn: "https://www.linkedin.com/in/mohd-salman-siddique-97a281117",
      email: "jennifer.martinez@kitps.edu"
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundImage: `linear-gradient(0deg, 
          ${theme.palette.background.default} 0%, 
          ${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.64)'} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Glass-like decorative circle */}
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: theme.palette.primary.main,
          opacity: 0.04,
          filter: 'blur(60px)',
        }}
      />

      <Container maxWidth="lg">
        {/* Section Header */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
          sx={{
            textAlign: "center",
            mb: { xs: 8, md: 12 },
            mx: "auto",
            maxWidth: "800px",
            position: "relative"
          }}
        >
          {/* Decorative dots */}
          <Box
            sx={{
              position: "absolute",
              top: -60,
              left: { xs: "5%", md: "15%" },
              display: "flex",
              gap: 1,
            }}
          >
            {[...Array(3)].map((_, i) => (
              <Box
                key={i}
                component={motion.div}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4, type: "spring" }}
                viewport={{ once: true }}
                sx={{
                  width: (i + 1) * 4,
                  height: (i + 1) * 4,
                  borderRadius: "50%",
                  backgroundColor: theme.palette.primary.main,
                  opacity: 0.7 - i * 0.2
                }}
              />
            ))}
          </Box>

          {/* Animated overline with line */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Box
              component={motion.div}
              initial={{ width: 0 }}
              whileInView={{ width: 40 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{
                height: 3,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 3,
                mr: 2,
              }}
            />
            <Typography
              variant="overline"
              component={motion.div}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                letterSpacing: 2,
                fontSize: "0.9rem",
              }}
            >
              ACADEMIC LEADERSHIP
            </Typography>
            <Box
              component={motion.div}
              initial={{ width: 0 }}
              whileInView={{ width: 40 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{
                height: 3,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 3,
                ml: 2,
              }}
            />
          </Box>

          <Typography
            variant="h2"
            component={motion.h2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            sx={{
              fontWeight: 800,
              mb: 3,
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              background: isDark
                ? "linear-gradient(135deg, #ffffff 0%, #b0b0b0 100%)"
                : "linear-gradient(135deg, #1a1a2e 0%, #4a4a6a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
              position: "relative",
            }}
          >
            Guiding Our Vision

          </Typography>

          <Typography
            variant="h6"
            color="textSecondary"
            component={motion.p}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            sx={{
              fontWeight: 400,
              mb: 5,
              mx: "auto",
              maxWidth: "650px",
              lineHeight: 1.6,
            }}
          >
            Meet the visionary leaders behind Code Quest, our flagship coding competition designed to challenge and inspire the next generation of developers.
          </Typography>


        </MotionBox>


        {/* Leaders Section - Premium Card Style */}
        <Grid container spacing={4}>
          {leaders.map((leader, index) => (
            <Grid item xs={12} md={6} key={leader.id}>
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: theme.shadows[10],
                  },
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    height: '4px',
                    top: 0,
                    left: 0,
                    right: 0,
                    background: theme.palette.gradients.primary,
                  },
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Leader Header */}
                <Box sx={{ p: 3, pb: 0, display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={leader.image}
                    alt={leader.name}
                    sx={{
                      width: 70,
                      height: 70,
                      border: '3px solid white',
                      boxShadow: theme.shadows[3],
                    }}
                  />

                  <Box sx={{ ml: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6" fontWeight={600}>
                        {leader.name}
                      </Typography>
                      <VerifiedUser
                        color="primary"
                        sx={{
                          ml: 1,
                          fontSize: 16,
                          opacity: 0.8
                        }}
                      />
                    </Box>

                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 500
                      }}
                    >
                      {leader.title}, {leader.organization}
                    </Typography>
                  </Box>
                </Box>

                <CardContent sx={{ pt: 3, pb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Message */}
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      position: 'relative',
                      pl: 3,
                      '&:before': {
                        content: '"\\201C"',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        fontSize: '1.5rem',
                        color: theme.palette.primary.main,
                        opacity: 0.6,
                        fontFamily: 'Georgia, serif',
                      }
                    }}
                  >
                    {leader.message}
                  </Typography>

                  {/* Vision */}
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      fontStyle: 'italic',
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 500
                      }}
                    >
                      Vision:
                    </Box>{' '}
                    {leader.vision}
                  </Typography>

                  <Box sx={{ flexGrow: 1 }} />

                  {/* Social and Contact */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {leader.linkedIn && (
                        <Tooltip title="LinkedIn Profile">
                          <IconButton
                            size="small"
                            href={leader.linkedIn}
                            target="_blank"
                            sx={{
                              bgcolor: 'rgba(0, 119, 181, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(0, 119, 181, 0.2)',
                              }
                            }}
                          >
                            <LinkedIn fontSize="small" sx={{ color: '#0077B5' }} />
                          </IconButton>
                        </Tooltip>
                      )}

                      {leader.twitter && (
                        <Tooltip title="Twitter Profile">
                          <IconButton
                            size="small"
                            href={leader.twitter}
                            target="_blank"
                            sx={{
                              bgcolor: 'rgba(29, 161, 242, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(29, 161, 242, 0.2)',
                              }
                            }}
                          >
                            <Twitter fontSize="small" sx={{ color: '#1DA1F2' }} />
                          </IconButton>
                        </Tooltip>
                      )}

                      {leader.email && (
                        <Tooltip title="Send Email">
                          <IconButton
                            size="small"
                            href={`mailto:${leader.email}`}
                            sx={{
                              bgcolor: 'rgba(234, 67, 53, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(234, 67, 53, 0.2)',
                              }
                            }}
                          >
                            <Email fontSize="small" sx={{ color: '#EA4335' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Vision Highlight */}
        <Box
          sx={{
            mt: 6,
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: theme.palette.mode === 'dark'
              ? 'rgba(154, 52, 45, 0.1)'
              : 'rgba(188, 64, 55, 0.05)',
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
          }}
        >
          <FormatQuote
            sx={{
              position: 'absolute',
              top: { xs: -20, md: -30 },
              left: { xs: 0, md: 20 },
              fontSize: { xs: 80, md: 120 },
              color: theme.palette.primary.main,
              opacity: 0.1,
              transform: 'rotate(180deg)'
            }}
          />

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography
                variant="h4"
                component="blockquote"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                  lineHeight: 1.3,
                }}
              >
                "Code Quest is where passion meets proficiency, challenging students to transform theoretical knowledge into practical solutions."
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                The Academic Leadership Team, KITPS
              </Typography>
            </Grid>

            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Box
                component="img"
                src="https://i.imgur.com/vdC5DD3.png"
                alt="Code Quest Logo"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 100,
                  filter: theme.palette.mode === 'dark' ? 'brightness(0.9)' : 'none',
                }}
              />

              <Button
                variant="contained"
                color="primary"
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  px: 3,
                  backgroundImage: theme.palette.gradients.primary,
                  boxShadow: theme.shadows[4],
                }}
              >
                Learn About Code Quest
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default GuideSection;
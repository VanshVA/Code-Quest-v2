import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';

const PageLoader = () => {
  // Animation variants for the container
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  // Animation variants for the logo
  const logoVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for the text
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5
      }
    }
  };

  // Animation variants for the progress indicator
  const progressVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        delay: 0.5,
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={containerVariants}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          width: '100%',
          bgcolor: 'var(--background-color)',
        }}
      >
        <motion.div variants={logoVariants}>
          <Box 
            sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: '16px', 
              bgcolor: 'var(--theme-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(var(--theme-color-rgb), 0.3)',
              mb: 3,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Shine effect animation */}
            <Box 
              component={motion.div}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                zIndex: 1,
              }}
            />
            <CodeIcon sx={{ color: 'white', fontSize: '3rem', zIndex: 2 }} />
          </Box>
        </motion.div>

        <motion.div variants={textVariants}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3, 
              fontWeight: 700,
              background: 'linear-gradient(45deg, var(--theme-color) 10%, #ff7366 90%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Code-Quest
          </Typography>
        </motion.div>

        <motion.div variants={progressVariants}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress 
              size={50} 
              thickness={4} 
              sx={{ 
                color: 'var(--theme-color)',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component={motion.div}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'var(--theme-color)',
                }}
              />
            </Box>
          </Box>
        </motion.div>

        <motion.div variants={textVariants}>
          <Typography 
            variant="body2" 
            color="textSecondary"
            sx={{ mt: 2, opacity: 0.7 }}
          >
            Loading...
          </Typography>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default PageLoader;

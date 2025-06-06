import React, { useRef, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Skeleton,
  Alert,
} from '@mui/material';
import {
  AutoAwesome,
  BarChart,
  EmojiEvents,
  FilterList,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  KeyboardDoubleArrowUp,
  MoreVert,
  Search,
  Star,
  Timeline,
  TrendingUp,
  Verified,
  WorkspacePremium,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';
import axios from 'axios';

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

// Trophy glint animation
const glint = keyframes`
  0% { background-position: -500px 0; }
  100% { background-position: 500px 0; }
`;

const LeaderboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  
  // Refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // State
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);

  // Fetch results from backend
  const fetchResults = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/general/results?page=${pageNum}&limit=${rowsPerPage}`);
      
      if (response.data.success) {
        // Sort by totalScore descending and add ranks
        const sortedResults = response.data.data.results
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((result, index) => ({
            ...result,
            rank: index + 1,
            trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down' // Random for demo
          }));
        
        setResults(sortedResults);
        setPagination(response.data.data.pagination);
        setError('');
      } else {
        setError('Failed to fetch results');
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [rowsPerPage]);

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Get trend icon and color
  const getTrendInfo = (trend) => {
    switch(trend) {
      case 'up':
        return { 
          icon: <KeyboardDoubleArrowUp fontSize="small" sx={{ transform: 'rotate(45deg)' }} />, 
          color: theme.palette.success.main 
        };
      case 'down':
        return { 
          icon: <KeyboardDoubleArrowUp fontSize="small" sx={{ transform: 'rotate(-135deg)' }} />, 
          color: theme.palette.error.main 
        };
      default:
        return { 
          icon: <KeyboardArrowRight fontSize="small" />, 
          color: theme.palette.info.main 
        };
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchResults(newPage + 1);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter data based on search term
  const filteredData = results.filter(result => 
    result.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.competition?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get top 3 performers
  const topPerformers = filteredData.slice(0, 3);

  // Canvas animation for background
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight * 2;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class GradientOrb {
      constructor() {
        this.reset();
      }
      
      reset() {
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * (isMobile ? 100 : 180) + (isMobile ? 30 : 50);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.12 + 0.04;
        
        const colorSets = [
          { start: '#bc4037', end: '#f47061' },
          { start: '#9a342d', end: '#bd5c55' },
          { start: '#2C3E50', end: '#4A6572' },
          { start: '#3a47d5', end: '#00d2ff' },
        ];
        
        this.colors = colorSets[Math.floor(Math.random() * colorSets.length)];
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;
        
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
      }
      
      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        
        const startColor = this.hexToRgba(this.colors.start, this.opacity);
        const endColor = this.hexToRgba(this.colors.end, 0);
        
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }
    
    const orbCount = isMobile ? 6 : 10;
    const orbs = Array(orbCount).fill().map(() => new GradientOrb());
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      
      orbs.forEach((orb) => {
        orb.update();
        orb.draw();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isMobile, isDark]);

  return (
    <>
      {/* Canvas Background */}
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden',
      }}>
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: isDark ? 'rgba(30, 28, 28, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(30px)',
        }} />
      </Box>

      {/* Hero Section */}
      <Box component="section" sx={{ 
        position: 'relative',
        pt: { xs: '100px', sm: '120px', md: '120px' },
        pb: { xs: '60px', sm: '80px', md: '60px' },
        overflow: 'hidden',
      }}>
        <Container maxWidth="lg"> 
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={10} lg={8} sx={{ textAlign: 'center' }}>
              <MotionBox
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ mb: 3, display: 'inline-block' }}
              >
                <Chip 
                  label="GLOBAL RANKINGS" 
                  color="primary"
                  size="small"
                  icon={<AutoAwesome sx={{ color: 'white !important', fontSize: '0.85rem' }} />}
                  sx={{ 
                    background: theme.palette.gradients?.primary || theme.palette.primary.main,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    letterSpacing: 1.2,
                    py: 2.2,
                    pl: 1,
                    pr: 2,
                    borderRadius: '100px',
                    boxShadow: '0 8px 16px rgba(188, 64, 55, 0.2)',
                  }}
                />
              </MotionBox> 
              
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
                Code Quest
                <Box component="span" sx={{
                  display: 'block',
                  background: theme.palette.gradients?.primary || `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Leaderboard
                </Box>
              </MotionTypography>
              
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
                Top performers from coding competitions around the world
              </MotionTypography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Top Performers Section */}
      {!loading && topPerformers.length > 0 && (
        <Box component="section" sx={{ position: 'relative', mb: 10 }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {topPerformers.map((result, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <MotionCard
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    sx={{
                      borderRadius: '20px',
                      overflow: 'visible',
                      height: '100%',
                      backgroundColor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      position: 'relative',
                    }}
                  >
                    {/* Trophy */}
                    <Box sx={{
                      position: 'absolute',
                      top: -30,
                      left: 'calc(50% - 30px)',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: index === 0 
                        ? 'linear-gradient(45deg, #FFD700, #FFC400)' 
                        : index === 1 
                          ? 'linear-gradient(45deg, #C0C0C0, #E0E0E0)' 
                          : 'linear-gradient(45deg, #CD7F32, #B87333)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                      zIndex: 2,
                      border: '4px solid',
                      borderColor: isDark ? '#121212' : 'white',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
                        backgroundSize: '1000px 100%',
                        animation: `${glint} 2s infinite linear`,
                        zIndex: -1,
                      },
                    }}>
                      <Typography variant="h4" component="span" sx={{ 
                        fontWeight: 800,
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}>
                        {index + 1}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ pt: 5, pb: 3, px: 3, textAlign: 'center' }}>
                      {/* User Avatar */}
                      <Avatar sx={{
                        width: 80,
                        height: 80,
                        border: '3px solid',
                        borderColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        mx: 'auto',
                        mb: 2,
                        fontSize: '2rem',
                        fontWeight: 'bold',
                      }}>
                        {getInitials(result.student?.name)}
                      </Avatar>
                      
                      {/* User Info */}
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {result.student?.name || 'Unknown'}
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        {result.competition?.name || 'Unknown Competition'}
                      </Typography>
                      
                      {/* Score Section */}
                      <Box sx={{
                        bgcolor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                        p: 2,
                        borderRadius: '12px',
                        mb: 2,
                      }}>
                        <Typography variant="h3" sx={{ 
                          fontWeight: 800,
                          color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                          mb: 1,
                        }}>
                          {result.totalScore}
                        </Typography>
                        
                        <Typography variant="caption" component="div" sx={{ mb: 1 }}>
                          {result.percentageScore}% accuracy
                        </Typography>
                        
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                          <Grid item xs={6}>
                            <Typography variant="overline" display="block" sx={{ fontSize: '0.6rem' }}>
                              Correct
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {result.correctAnswers}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="overline" display="block" sx={{ fontSize: '0.6rem' }}>
                              Total
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {result.questionsCount}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                      
                      <Chip
                        label={result.competition?.type || 'Competition'}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          height: '22px',
                          bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        }}
                      />
                    </Box>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
      
      {/* Leaderboard Table Section */}
      <Box component="section" sx={{ mb: 8 }}>
        <Container maxWidth="lg">
          {/* Search */}
          <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={8}>
              <TextField
                placeholder="Search students, competitions..."
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
                    '& fieldset': { border: 'none' },
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Chip
                icon={<BarChart />}
                label={`${pagination.total} Total Results`}
                color="primary"
                sx={{ fontWeight: 600 }}
              />
            </Grid>
          </Grid>
          
          {/* Loading State */}
          {loading && (
            <MotionPaper sx={{ borderRadius: '20px', overflow: 'hidden', p: 4 }}>
              <Grid container spacing={2}>
                {[...Array(5)].map((_, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Skeleton variant="text" width={40} />
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton variant="text" width={200} />
                      <Skeleton variant="text" width={100} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </MotionPaper>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Leaderboard Table */}
          {!loading && !error && (
            <MotionPaper
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                boxShadow: isDark ? '0 10px 40px rgba(0, 0, 0, 0.3)' : '0 10px 40px rgba(0, 0, 0, 0.06)',
              }}
            >
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow sx={{
                      bgcolor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)',
                      '& th': { fontWeight: 700, py: 2 }
                    }}>
                      <TableCell align="center" sx={{ width: 70 }}>Rank</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>Competition</TableCell>
                      <TableCell align="center">Score</TableCell>
                      <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Accuracy</TableCell>
                      <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Correct/Total</TableCell>
                      <TableCell align="center" sx={{ width: 60 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  
                  <TableBody>
                    {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((result, index) => {
                      const trendInfo = getTrendInfo(result.trend);
                      
                      return (
                        <TableRow
                          key={result._id}
                          hover
                          sx={{
                            '& td': { 
                              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            },
                            cursor: 'pointer',
                          }}
                        >
                          <TableCell align="center">
                            <Box sx={{ 
                              fontWeight: 800,
                              color: result.rank <= 3 
                                ? result.rank === 1 ? '#FFD700' 
                                  : result.rank === 2 ? '#C0C0C0' 
                                    : '#CD7F32'
                                : 'inherit',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 0.5,
                            }}>
                              {result.rank}
                              <Box sx={{ color: trendInfo.color, display: 'flex', alignItems: 'center' }}>
                                {trendInfo.icon}
                              </Box>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar sx={{ 
                                width: 40,
                                height: 40,
                                mr: 2,
                                fontSize: '1rem',
                                fontWeight: 'bold',
                              }}>
                                {getInitials(result.student?.name)}
                              </Avatar>
                              
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {result.student?.name || 'Unknown'}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {result.student?.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {result.competition?.name || 'Unknown Competition'}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {result.competition?.type}
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={700}>
                              {result.totalScore}
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="center" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                            <Typography variant="body2" fontWeight={600}>
                              {result.percentageScore}%
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                            <Typography variant="body2">
                              {result.correctAnswers}/{result.questionsCount}
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="center">
                            <IconButton size="small">
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {/* Pagination */}
              <TablePagination
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </MotionPaper>
          )}
        </Container>
      </Box>
      
      {/* Statistics Section */}
      <Box component="section" sx={{ mb: 10 }}>
        <Container maxWidth="lg">
          <MotionPaper
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            sx={{
              p: 4,
              borderRadius: '20px',
              backgroundColor: isDark ? 'rgba(30, 28, 28, 0.7)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <WorkspacePremium sx={{
                fontSize: '2.5rem',
                color: theme.palette.primary.main,
                mr: 2,
              }} />
              
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  About the Rankings
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Updated with latest competition results
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="body1" paragraph>
              The Code Quest Leaderboard showcases top performers from our coding competitions. 
              Rankings are based on total scores achieved in various competitions.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight={800} color="primary">
                    {results.length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Active Participants
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight={800} color="success.main">
                    {Math.round(results.reduce((acc, r) => acc + parseFloat(r.percentageScore), 0) / Math.max(results.length, 1)) || 0}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Average Score
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" fontWeight={800} color="warning.main">
                    {Math.max(...results.map(r => r.totalScore || 0))}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Highest Score
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </MotionPaper>
        </Container>
      </Box>
    </>
  );
};

export default LeaderboardPage;
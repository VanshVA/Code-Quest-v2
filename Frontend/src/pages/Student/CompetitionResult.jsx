import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography,
  Paper, 
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Container,
  CircularProgress,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  ArrowBack,
  EmojiEvents,
  CheckCircle,
  AccessTime,
  Memory,
  Leaderboard,
  PieChart,
  Feed,
  Code,
  ArrowForward,
  GitHub
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';

// Motion components
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionPaper = motion(Paper);
const MotionContainer = motion(Container);

// Current date and time for display
const CURRENT_DATE_TIME = "2025-05-30 07:07:39";

const CompetitionResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    // Simulate API call to fetch results
    setTimeout(() => {
      setResult({
        competition: {
          id: Number(id),
          title: "Algorithm Challenge",
          date: "2025-05-30",
          participants: 128,
          maxParticipants: 200,
        },
        user: {
          rank: 5,
          score: 87,
          totalProblems: 5,
          solvedProblems: 4,
          completionTime: '01:47:23',
          username: 'VanshSharmaSDE',
          avatar: 'https://i.pravatar.cc/150?img=3'
        },
        questions: [
          {
            id: 1,
            title: "Two Sum",
            difficulty: "Easy",
            status: "correct",
            score: 20,
            timeSpent: 18 * 60, // 18 minutes in seconds
          },
          {
            id: 2,
            title: "Valid Parentheses",
            difficulty: "Medium",
            status: "correct",
            score: 25,
            timeSpent: 22 * 60, // 22 minutes
          },
          {
            id: 3,
            title: "Merge Two Sorted Lists",
            difficulty: "Medium",
            status: "correct",
            score: 25,
            timeSpent: 25 * 60, // 25 minutes
          },
          {
            id: 4,
            title: "Maximum Subarray",
            difficulty: "Hard",
            status: "correct",
            score: 30,
            timeSpent: 35 * 60, // 35 minutes
          },
          {
            id: 5,
            title: "Binary Tree Level Order Traversal",
            difficulty: "Hard",
            status: "incorrect",
            score: 0,
            timeSpent: 27 * 60, // 27 minutes
          }
        ],
        topPerformers: [
          { rank: 1, username: "CodeNinja42", avatar: "https://i.pravatar.cc/150?img=11", score: 100, completionTime: '01:22:47' },
          { rank: 2, username: "AlgoWhiz", avatar: "https://i.pravatar.cc/150?img=12", score: 95, completionTime: '01:30:13' },
          { rank: 3, username: "ByteMaster", avatar: "https://i.pravatar.cc/150?img=13", score: 90, completionTime: '01:35:22' },
        ],
        chartData: {
          scoreDistribution: {
            categories: ['0-20', '21-40', '41-60', '61-80', '81-100'],
            series: [
              {
                name: 'Participants',
                data: [5, 18, 42, 35, 28],
              }
            ],
          },
          timeTaken: {
            categories: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
            series: [
              {
                name: 'Your Time (minutes)',
                data: [18, 22, 25, 35, 27],
              },
              {
                name: 'Average Time (minutes)',
                data: [15, 25, 22, 30, 32],
              }
            ],
          },
          performanceByDifficulty: {
            labels: ['Easy', 'Medium', 'Hard'],
            series: [100, 100, 50],
          }
        }
      });
      setLoading(false);
    }, 1500);
  }, [id]);
  
  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return theme.palette.success.main;
      case 'Medium':
        return theme.palette.warning.main;
      case 'Hard':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };
  
  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };
  
  // Chart options
  const getChartOptions = (title) => ({
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      fontFamily: theme.typography.fontFamily,
      foreColor: theme.palette.text.secondary,
    },
    xaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
      axisBorder: {
        color: theme.palette.divider,
      },
      axisTicks: {
        color: theme.palette.divider,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 3,
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -25,
      labels: {
        colors: theme.palette.text.secondary,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  });
  
  const pieChartOptions = {
    labels: ['Easy', 'Medium', 'Hard'],
    chart: {
      fontFamily: theme.typography.fontFamily,
      foreColor: theme.palette.text.secondary,
    },
    colors: [theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main],
    legend: {
      position: 'bottom',
      labels: {
        colors: theme.palette.text.secondary,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
    title: {
      text: 'Performance by Difficulty',
      align: 'left',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
      },
    },
    dataLabels: {
      formatter: function (val) {
        return val.toFixed(0) + '%';
      },
    },
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };
  
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={60} sx={{ color: 'var(--theme-color)', mb: 3 }} />
        <Typography variant="h6">
          Generating your results...
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Please wait while we evaluate your solutions
        </Typography>
      </Box>
    );
  }

  return (
    <MotionContainer
      maxWidth="lg"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{ py: 4 }}
    >
      {/* Header with Back Button */}
      <MotionBox variants={itemVariants} sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard/competitions')}
          sx={{ 
            mr: 2,
            borderRadius: '12px',
            borderColor: 'rgba(0,0,0,0.1)',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'var(--theme-color)',
              bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
            },
          }}
        >
          Back to Competitions
        </Button>
        <Typography variant="h4" component="h1" fontWeight="800">
          Competition Results
        </Typography>
      </MotionBox>
      
      {/* Results Overview */}
      <MotionPaper
        variants={itemVariants}
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          mb: 4,
          backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(var(--theme-color-rgb), 0.1), transparent 70%)',
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {/* Competition Info */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {result.competition.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Date: {new Date(result.competition.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Chip 
                label={`Participants: ${result.competition.participants}/${result.competition.maxParticipants}`}
                variant="outlined"
                sx={{ borderRadius: '8px' }}
              />
              <Chip 
                label={`Your Rank: ${result.user.rank}/${result.competition.participants}`}
                variant="outlined"
                sx={{ 
                  borderRadius: '8px',
                  borderColor: result.user.rank <= 10 ? theme.palette.warning.main : undefined,
                  color: result.user.rank <= 10 ? theme.palette.warning.main : undefined,
                  fontWeight: result.user.rank <= 10 ? 'bold' : undefined,
                }}
              />
              <Chip 
                label={`Your Score: ${result.user.score}/100`}
                variant="outlined"
                sx={{ 
                  borderRadius: '8px',
                  borderColor: getScoreColor(result.user.score),
                  color: getScoreColor(result.user.score),
                  fontWeight: 'bold',
                }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  src={result.user.avatar}
                  alt={result.user.username}
                  sx={{ width: 40, height: 40, mr: 1.5 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {result.user.username}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Completion Time: {result.user.completionTime}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ flexGrow: 1 }} />
              
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="textSecondary">
                  Problems Solved: {result.user.solvedProblems}/{result.user.totalProblems}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(result.user.solvedProblems / result.user.totalProblems) * 100}
                  sx={{ 
                    mt: 0.5,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'var(--theme-color)',
                    }
                  }} 
                />
              </Box>
            </Box>
          </Grid>
          
          {/* Top 3 Participants */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Top Performers
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Grid container spacing={1}>
                {result.topPerformers.map((performer) => (
                  <Grid item xs={4} key={performer.rank}>
                    <Box sx={{ 
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: -10,
                          left: 'calc(50% - 15px)',
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          bgcolor: performer.rank === 1 ? theme.palette.warning.main : 
                                  performer.rank === 2 ? 'rgba(0,0,0,0.2)' : 
                                  '#cd7f32',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          color: 'white',
                          fontSize: '0.875rem',
                        }}
                      >
                        {performer.rank}
                      </Box>
                      <Avatar 
                        src={performer.avatar}
                        alt={performer.username}
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          mt: 1.5,
                          mb: 1,
                          border: `3px solid ${
                            performer.rank === 1 ? theme.palette.warning.main : 
                            performer.rank === 2 ? 'rgba(0,0,0,0.2)' : 
                            '#cd7f32'
                          }`,
                        }}
                      />
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        noWrap
                        sx={{ maxWidth: '100%' }}
                      >
                        {performer.username}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Score: {performer.score}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Time: {performer.completionTime}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </MotionPaper>
      
      {/* Question Performance */}
      <MotionPaper
        variants={itemVariants}
        sx={{ 
          p: 3, 
          borderRadius: '16px',
          mb: 4,
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Question Performance
        </Typography>
        
        <TableContainer sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Question</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Difficulty</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Time Spent</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.questions.map((question, index) => (
                <TableRow key={question.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                          color: 'var(--theme-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          mr: 1.5,
                          fontSize: '0.875rem',
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="body2" fontWeight="medium">
                        {question.title}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={question.difficulty} 
                      size="small"
                      sx={{ 
                        borderRadius: '8px',
                        bgcolor: `${getDifficultyColor(question.difficulty)}15`,
                        color: getDifficultyColor(question.difficulty),
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {question.status === 'correct' ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.success.main }}>
                        <CheckCircle fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" fontWeight="medium">
                          Correct
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: theme.palette.error.main }}>
                        <Close fontSize="small" sx={{ mr: 0.5 }} />
                        <Typography variant="body2" fontWeight="medium">
                          Incorrect
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatTime(question.timeSpent)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {question.score}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<Code />}
            sx={{
              borderRadius: '8px',
              borderColor: 'rgba(0,0,0,0.1)',
              color: 'text.primary',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: 'var(--theme-color)',
                bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
              },
            }}
          >
            View Your Solutions
          </Button>
        </Box>
      </MotionPaper>
      
      {/* Charts */}
      <Grid container spacing={3}>
        {/* Time Comparison */}
        <Grid item xs={12} md={8}>
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              height: '100%',
            }}
          >
            <Chart
              options={getChartOptions('Time Spent on Each Question')}
              series={result.chartData.timeTaken.series}
              type="bar"
              height={300}
            />
          </MotionPaper>
        </Grid>
        
        {/* Performance by Difficulty */}
        <Grid item xs={12} md={4}>
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 3, 
              borderRadius: '16px',
              height: '100%',
            }}
          >
            <Chart
              options={pieChartOptions}
              series={result.chartData.performanceByDifficulty.series}
              type="pie"
              height={300}
            />
          </MotionPaper>
        </Grid>
        
        {/* Score Distribution */}
        <Grid item xs={12}>
          <MotionPaper
            variants={itemVariants}
            sx={{ 
              p: 3, 
              borderRadius: '16px',
            }}
          >
            <Chart
              options={getChartOptions('Score Distribution Among Participants')}
              series={result.chartData.scoreDistribution.series}
              type="bar"
              height={300}
            />
          </MotionPaper>
        </Grid>
      </Grid>
      
      {/* Actions */}
      <MotionBox
        variants={itemVariants}
        sx={{ 
          mt: 4,
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate('/dashboard/competitions')}
          startIcon={<ArrowBack />}
          sx={{ 
            borderRadius: '12px',
            borderColor: 'rgba(0,0,0,0.1)',
            color: 'text.primary',
            py: 1.2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              borderColor: 'var(--theme-color)',
              bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
            },
          }}
        >
          Back to Competitions
        </Button>
        
        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          endIcon={<ArrowForward />}
          sx={{ 
            borderRadius: '12px',
            bgcolor: 'var(--theme-color)',
            color: 'white',
            py: 1.2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              bgcolor: 'var(--hover-color)',
            },
          }}
        >
          Go to Dashboard
        </Button>
        
        <Button
          variant="contained"
          startIcon={<GitHub />}
          sx={{ 
            borderRadius: '12px',
            bgcolor: theme.palette.mode === 'dark' ? '#333' : '#24292e',
            color: 'white',
            py: 1.2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              bgcolor: theme.palette.mode === 'dark' ? '#444' : '#2c3338',
            },
          }}
        >
          Share on GitHub
        </Button>
      </MotionBox>
    </MotionContainer>
  );
};

export default CompetitionResult;
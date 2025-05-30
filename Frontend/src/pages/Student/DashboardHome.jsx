import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    Avatar,
    Divider,
    LinearProgress,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Chip,
    Skeleton,
    useTheme,
    useMediaQuery,
    Tooltip,
} from '@mui/material';
import {
    Visibility,
    AccessTime,
    EmojiEvents,
    DateRange,
    TrendingUp,
    GroupWork,
    Code,
    ArrowForward,
    MoreVert,
    Search,
    FilterList,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';

// Motion components
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);

const DashboardHome = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        // Simulate fetching dashboard data
        const timer = setTimeout(() => {
            setDashboardData({
                stats: {
                    participatedCompetitions: 12,
                    averageScore: 78,
                    ranking: 42,
                    contestsWon: 3,
                },
                upcomingCompetitions: [
                    {
                        id: 1,
                        title: "Algorithm Challenge",
                        date: "2025-06-02",
                        time: "14:00-16:00",
                        participants: 128,
                        difficulty: "Hard",
                    },
                    {
                        id: 2,
                        title: "Data Structures 101",
                        date: "2025-06-05",
                        time: "10:00-12:00",
                        participants: 95,
                        difficulty: "Medium",
                    },
                    {
                        id: 3,
                        title: "Web Development Contest",
                        date: "2025-06-10",
                        time: "15:00-17:30",
                        participants: 76,
                        difficulty: "Easy",
                    },
                ],
                recentResults: [
                    {
                        id: 101,
                        title: "Python Mastery",
                        date: "2025-05-28",
                        score: 92,
                        rank: 3,
                        total: 87,
                    },
                    {
                        id: 102,
                        title: "JavaScript Fundamentals",
                        date: "2025-05-22",
                        score: 78,
                        rank: 12,
                        total: 64,
                    },
                    {
                        id: 103,
                        title: "C++ Challenge",
                        date: "2025-05-15",
                        score: 65,
                        rank: 25,
                        total: 102,
                    },
                ],
                performanceData: {
                    categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
                    series: [
                        {
                            name: 'Score',
                            data: [70, 82, 75, 88, 92],
                        },
                        {
                            name: 'Average',
                            data: [68, 72, 75, 76, 78],
                        },
                    ],
                },
                skillsData: {
                    algorithms: 82,
                    dataStructures: 74,
                    problemSolving: 88,
                    webDevelopment: 65,
                    databases: 58,
                },
            });
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Get difficulty color
    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy':
                return theme.palette.success.main;
            case 'medium':
                return theme.palette.warning.main;
            case 'hard':
                return theme.palette.error.main;
            default:
                return theme.palette.info.main;
        }
    };

    // Get rank class color
    const getRankColor = (rank) => {
        if (rank <= 3) return theme.palette.warning.main;
        if (rank <= 10) return theme.palette.success.main;
        if (rank <= 25) return theme.palette.info.main;
        return theme.palette.text.secondary;
    };

    // Chart options
    const chartOptions = {
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
        colors: ['var(--theme-color)', theme.palette.info.main],
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        markers: {
            size: 5,
            hover: {
                size: 8,
            },
        },
        xaxis: {
            categories: dashboardData?.performanceData.categories || [],
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
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            offsetY: -30,
            labels: {
                colors: theme.palette.text.secondary,
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
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

    return (
        <MotionBox
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            sx={{
                maxWidth: '1600px',
                mx: 'auto',
            }}
        >
            {/* Welcome Header */}
            <MotionBox
                variants={itemVariants}
                sx={{ mb: 4 }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight="800" gutterBottom>
                            Welcome back, VanshSharma!
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Track your progress, join competitions, and enhance your coding skills.
                        </Typography>
                    </Box>
                    <Box sx={{ mt: { xs: 2, sm: 0 } }}>
                        <Button
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('/dashboard/competitions')}
                            sx={{
                                bgcolor: 'var(--theme-color)',
                                borderRadius: '12px',
                                px: 3,
                                py: 1.2,
                                textTransform: 'none',
                                fontWeight: 600,
                                boxShadow: '0 8px 16px rgba(var(--theme-color-rgb), 0.2)',
                                '&:hover': {
                                    bgcolor: 'var(--hover-color)',
                                    boxShadow: '0 12px 20px rgba(var(--theme-color-rgb), 0.3)',
                                },
                            }}
                        >
                            Join Competition
                        </Button>
                    </Box>
                </Box>
            </MotionBox>

            {/* Stats Section */}
            <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                    {loading ? (
                        // Skeleton loading
                        [...Array(4)].map((_, index) => (
                            <Grid item xs={6} sm={6} md={3} key={index}>
                                <Skeleton variant="rounded" height={120} />
                            </Grid>
                        ))
                    ) : (
                        // Stats cards
                        <>
                            <Grid item xs={6} sm={6} md={3}>
                                <MotionPaper
                                    whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '16px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '14px',
                                            bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2,
                                            color: 'var(--theme-color)',
                                        }}
                                    >
                                        <Code fontSize="medium" />
                                    </Box>
                                    <Typography variant="h3" fontWeight="bold">
                                        {dashboardData.stats.participatedCompetitions}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Competitions Joined
                                    </Typography>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -30,
                                            right: -30,
                                            width: 120,
                                            height: 120,
                                            borderRadius: '50%',
                                            bgcolor: 'var(--theme-color)',
                                            opacity: 0.05,
                                        }}
                                    />
                                </MotionPaper>
                            </Grid>

                            <Grid item xs={6} sm={6} md={3}>
                                <MotionPaper
                                    whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '16px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '14px',
                                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2,
                                            color: 'primary.main',
                                        }}
                                    >
                                        <TrendingUp fontSize="medium" />
                                    </Box>
                                    <Typography variant="h3" fontWeight="bold">
                                        {dashboardData.stats.averageScore}%
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Average Score
                                    </Typography>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -30,
                                            right: -30,
                                            width: 120,
                                            height: 120,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            opacity: 0.05,
                                        }}
                                    />
                                </MotionPaper>
                            </Grid>

                            <Grid item xs={6} sm={6} md={3}>
                                <MotionPaper
                                    whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '16px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '14px',
                                            bgcolor: 'rgba(255, 152, 0, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2,
                                            color: 'warning.main',
                                        }}
                                    >
                                        <GroupWork fontSize="medium" />
                                    </Box>
                                    <Typography variant="h3" fontWeight="bold">
                                        #{dashboardData.stats.ranking}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Current Ranking
                                    </Typography>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -30,
                                            right: -30,
                                            width: 120,
                                            height: 120,
                                            borderRadius: '50%',
                                            bgcolor: 'warning.main',
                                            opacity: 0.05,
                                        }}
                                    />
                                </MotionPaper>
                            </Grid>

                            <Grid item xs={6} sm={6} md={3}>
                                <MotionPaper
                                    whileHover={{ y: -5, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '16px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '14px',
                                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mb: 2,
                                            color: 'success.main',
                                        }}
                                    >
                                        <EmojiEvents fontSize="medium" />
                                    </Box>
                                    <Typography variant="h3" fontWeight="bold">
                                        {dashboardData.stats.contestsWon}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Contests Won
                                    </Typography>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: -30,
                                            right: -30,
                                            width: 120,
                                            height: 120,
                                            borderRadius: '50%',
                                            bgcolor: 'success.main',
                                            opacity: 0.05,
                                        }}
                                    />
                                </MotionPaper>
                            </Grid>
                        </>
                    )}
                </Grid>
            </MotionBox>

            {/* Performance Chart and Skills */}
            <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Performance Chart */}
                    <Grid item xs={12} md={8}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                height: '100%',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Performance Analysis
                                </Typography>
                                <IconButton size="small">
                                    <MoreVert fontSize="small" />
                                </IconButton>
                            </Box>

                            {loading ? (
                                <Skeleton variant="rectangular" height={300} />
                            ) : (
                                <Chart
                                    options={chartOptions}
                                    series={dashboardData.performanceData.series}
                                    type="line"
                                    height={300}
                                />
                            )}
                        </Paper>
                    </Grid>

                    {/* Skills Progress */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                height: '100%',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Skills Analysis
                                </Typography>
                                <IconButton size="small">
                                    <MoreVert fontSize="small" />
                                </IconButton>
                            </Box>

                            {loading ? (
                                [...Array(5)].map((_, index) => (
                                    <Box key={index} sx={{ mb: 3 }}>
                                        <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
                                        <Skeleton variant="rounded" height={10} />
                                    </Box>
                                ))
                            ) : (
                                <>
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" fontWeight="medium">Algorithms</Typography>
                                            <Typography variant="body2" color="textSecondary">{dashboardData.skillsData.algorithms}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={dashboardData.skillsData.algorithms}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: 'var(--theme-color)',
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" fontWeight="medium">Data Structures</Typography>
                                            <Typography variant="body2" color="textSecondary">{dashboardData.skillsData.dataStructures}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={dashboardData.skillsData.dataStructures}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: 'rgba(25, 118, 210, 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: theme.palette.primary.main,
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" fontWeight="medium">Problem Solving</Typography>
                                            <Typography variant="body2" color="textSecondary">{dashboardData.skillsData.problemSolving}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={dashboardData.skillsData.problemSolving}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: theme.palette.success.main,
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" fontWeight="medium">Web Development</Typography>
                                            <Typography variant="body2" color="textSecondary">{dashboardData.skillsData.webDevelopment}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={dashboardData.skillsData.webDevelopment}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: 'rgba(255, 152, 0, 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: theme.palette.warning.main,
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2" fontWeight="medium">Databases</Typography>
                                            <Typography variant="body2" color="textSecondary">{dashboardData.skillsData.databases}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={dashboardData.skillsData.databases}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: 'rgba(156, 39, 176, 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: theme.palette.secondary.main,
                                                }
                                            }}
                                        />
                                    </Box>
                                </>
                            )}

                            <Box sx={{ textAlign: 'center', mt: 4 }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                        borderRadius: '8px',
                                        borderColor: 'var(--theme-color)',
                                        color: 'var(--theme-color)',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            borderColor: 'var(--hover-color)',
                                            backgroundColor: 'rgba(var(--theme-color-rgb), 0.05)',
                                        },
                                    }}
                                >
                                    View Detailed Analysis
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </MotionBox>

            {/* Upcoming Competitions and Recent Results */}
            <MotionBox variants={itemVariants}>
                <Grid container spacing={3}>
                    {/* Upcoming Competitions */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                height: '100%',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Upcoming Competitions
                                </Typography>
                                <Box>
                                    <Tooltip title="Filter">
                                        <IconButton size="small" sx={{ mr: 1 }}>
                                            <FilterList fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="View All">
                                        <IconButton
                                            size="small"
                                            onClick={() => navigate('/dashboard/competitions')}
                                        >
                                            <ArrowForward fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            {loading ? (
                                [...Array(3)].map((_, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Skeleton variant="rounded" height={80} />
                                    </Box>
                                ))
                            ) : (
                                dashboardData.upcomingCompetitions.map((competition) => (
                                    <MotionPaper
                                        key={competition.id}
                                        whileHover={{ scale: 1.01, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            border: '1px solid rgba(0,0,0,0.05)',
                                        }}
                                        onClick={() => navigate(`/dashboard/competition/${competition.id}`)}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {competition.title}
                                            </Typography>
                                            <Chip
                                                label={competition.difficulty}
                                                size="small"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    bgcolor: getDifficultyColor(competition.difficulty),
                                                    color: 'white',
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            <Box
                                                component="span"
                                                sx={{ display: 'inline-flex', alignItems: 'center' }}
                                            >
                                                <DateRange fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                                                {new Date(competition.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </Box>
                                            <Box
                                                component="span"
                                                sx={{ display: 'inline-flex', alignItems: 'center', ml: 2 }}
                                            >
                                                <AccessTime fontSize="small" sx={{ mr: 0.5, fontSize: '1rem' }} />
                                                {competition.time}
                                            </Box>
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <GroupWork fontSize="small" sx={{ mr: 0.5, opacity: 0.7 }} />
                                                <Typography variant="caption" color="textSecondary">
                                                    {competition.participants} participants
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    bgcolor: 'var(--theme-color)',
                                                    borderRadius: '8px',
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        bgcolor: 'var(--hover-color)',
                                                    },
                                                }}
                                            >
                                                Join
                                            </Button>
                                        </Box>
                                    </MotionPaper>
                                ))
                            )}

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Button
                                    variant="text"
                                    onClick={() => navigate('/dashboard/competitions')}
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        color: 'var(--theme-color)',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: 'rgba(var(--theme-color-rgb), 0.05)',
                                        },
                                    }}
                                >
                                    View All Competitions
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Recent Results */}
                    <Grid item xs={12} md={6}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                height: '100%',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    Recent Results
                                </Typography>
                                <Box>
                                    <Tooltip title="Search">
                                        <IconButton size="small" sx={{ mr: 1 }}>
                                            <Search fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="View All">
                                        <IconButton
                                            size="small"
                                            onClick={() => navigate('/dashboard/results')}
                                        >
                                            <ArrowForward fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>

                            {loading ? (
                                [...Array(3)].map((_, index) => (
                                    <Box key={index} sx={{ mb: 2 }}>
                                        <Skeleton variant="rounded" height={80} />
                                    </Box>
                                ))
                            ) : (
                                dashboardData.recentResults.map((result) => (
                                    <MotionPaper
                                        key={result.id}
                                        whileHover={{ scale: 1.01, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            border: '1px solid rgba(0,0,0,0.05)',
                                            position: 'relative',
                                            overflow: 'hidden',
                                        }}
                                        onClick={() => navigate(`/dashboard/results/detail/${result.id}`)}
                                    >
                                        {result.rank <= 3 && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    bgcolor: theme.palette.warning.main,
                                                    color: 'white',
                                                    py: 0.5,
                                                    px: 2,
                                                    borderBottomLeftRadius: '12px',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.75rem',
                                                }}
                                            >
                                                TOP {result.rank}
                                            </Box>
                                        )}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {result.title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        color: getRankColor(result.rank)
                                                    }}
                                                >
                                                    Rank: {result.rank}/{result.total}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="textSecondary">
                                                <DateRange fontSize="small" sx={{ mr: 0.5, fontSize: '1rem', verticalAlign: 'text-bottom' }} />
                                                {new Date(result.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Box
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: result.score >= 80
                                                            ? 'rgba(76, 175, 80, 0.1)'
                                                            : result.score >= 60
                                                                ? 'rgba(255, 152, 0, 0.1)'
                                                                : 'rgba(244, 67, 54, 0.1)',
                                                        color: result.score >= 80
                                                            ? theme.palette.success.main
                                                            : result.score >= 60
                                                                ? theme.palette.warning.main
                                                                : theme.palette.error.main,
                                                        fontWeight: 'bold',
                                                    }}
                                                >
                                                    {result.score}
                                                </Box>
                                                <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                                                    Score
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Button
                                            variant="text"
                                            size="small"
                                            endIcon={<Visibility fontSize="small" />}
                                            sx={{
                                                mt: 1,
                                                color: 'var(--theme-color)',
                                                p: 0,
                                                textTransform: 'none',
                                                fontWeight: 500,
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </MotionPaper>
                                ))
                            )}

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Button
                                    variant="text"
                                    onClick={() => navigate('/dashboard/results')}
                                    endIcon={<ArrowForward />}
                                    sx={{
                                        color: 'var(--theme-color)',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        '&:hover': {
                                            backgroundColor: 'rgba(var(--theme-color-rgb), 0.05)',
                                        },
                                    }}
                                >
                                    View All Results
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </MotionBox>
        </MotionBox>
    );
};

export default DashboardHome;

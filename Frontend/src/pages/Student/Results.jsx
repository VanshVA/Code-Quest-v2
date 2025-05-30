import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Grid,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    Chip,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    CircularProgress,
    LinearProgress,
    IconButton,
    InputBase,
    Select,
    MenuItem,
    FormControl,
    TextField,
    InputAdornment,
    Card,
    CardContent,
    Menu,
    Tooltip,
    useTheme,
    TableSortLabel
} from '@mui/material';
import {
    Sort,
    Search,
    FilterList,
    ArrowUpward,
    ArrowDownward,
    DateRange,
    CheckCircle,
    Cancel,
    AccessTime,
    School,
    EmojiEvents,
    Timeline,
    TrendingUp,
    MoreVert,
    Download,
    Share,
    Visibility,
    KeyboardArrowRight,
    Code,
    CalendarToday,
    Badge,
    
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';

// Current date and time
const CURRENT_DATE_TIME = "2025-05-30 07:46:56";
const CURRENT_USER = "VanshSharmaSDE";

// Motion components
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);

const Results = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedTimeFrame, setSelectedTimeFrame] = useState('all');

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Sort
    const [orderBy, setOrderBy] = useState('date');
    const [order, setOrder] = useState('desc');

    useEffect(() => {
        // Simulate API call to fetch all results
        setTimeout(() => {
            const dummyResults = [
                {
                    id: 101,
                    competitionId: 1,
                    title: "Python Mastery",
                    date: "2025-05-28",
                    category: "Python",
                    difficulty: "Medium",
                    status: "passed",
                    score: 92,
                    rank: 3,
                    totalParticipants: 87,
                    solvedProblems: 5,
                    totalProblems: 5,
                    completionTime: '1:47:23',
                },
                {
                    id: 102,
                    competitionId: 2,
                    title: "JavaScript Fundamentals",
                    date: "2025-05-22",
                    category: "JavaScript",
                    difficulty: "Easy",
                    status: "passed",
                    score: 78,
                    rank: 12,
                    totalParticipants: 64,
                    solvedProblems: 4,
                    totalProblems: 5,
                    completionTime: '1:36:40',
                },
                {
                    id: 103,
                    competitionId: 3,
                    title: "C++ Challenge",
                    date: "2025-05-15",
                    category: "C++",
                    difficulty: "Hard",
                    status: "failed",
                    score: 65,
                    rank: 25,
                    totalParticipants: 102,
                    solvedProblems: 2,
                    totalProblems: 5,
                    completionTime: '1:58:17',
                },
                {
                    id: 104,
                    competitionId: 4,
                    title: "Web Development Contest",
                    date: "2025-05-08",
                    category: "Web Development",
                    difficulty: "Medium",
                    status: "passed",
                    score: 88,
                    rank: 7,
                    totalParticipants: 73,
                    solvedProblems: 4,
                    totalProblems: 5,
                    completionTime: '1:52:10',
                },
                {
                    id: 105,
                    competitionId: 5,
                    title: "Algorithm Challenge",
                    date: "2025-04-30",
                    category: "Algorithms",
                    difficulty: "Hard",
                    status: "passed",
                    score: 71,
                    rank: 18,
                    totalParticipants: 94,
                    solvedProblems: 3,
                    totalProblems: 5,
                    completionTime: '1:48:55',
                },
                {
                    id: 106,
                    competitionId: 6,
                    title: "Database Design Contest",
                    date: "2025-04-22",
                    category: "Databases",
                    difficulty: "Medium",
                    status: "failed",
                    score: 55,
                    rank: 32,
                    totalParticipants: 68,
                    solvedProblems: 2,
                    totalProblems: 4,
                    completionTime: '1:28:36',
                },
                {
                    id: 107,
                    competitionId: 7,
                    title: "React Framework Challenge",
                    date: "2025-04-15",
                    category: "Web Development",
                    difficulty: "Medium",
                    status: "passed",
                    score: 82,
                    rank: 11,
                    totalParticipants: 79,
                    solvedProblems: 4,
                    totalProblems: 5,
                    completionTime: '1:40:22',
                },
                {
                    id: 108,
                    competitionId: 8,
                    title: "Data Structures 101",
                    date: "2025-04-08",
                    category: "Data Structures",
                    difficulty: "Easy",
                    status: "passed",
                    score: 95,
                    rank: 2,
                    totalParticipants: 85,
                    solvedProblems: 5,
                    totalProblems: 5,
                    completionTime: '1:22:07',
                },
            ];

            setResults(dummyResults);
            setFilteredResults(dummyResults);

            // Set statistics
            setStatistics({
                totalCompetitions: dummyResults.length,
                averageScore: Math.round(dummyResults.reduce((sum, result) => sum + result.score, 0) / dummyResults.length),
                bestRank: Math.min(...dummyResults.map(result => result.rank)),
                passRate: Math.round((dummyResults.filter(result => result.status === 'passed').length / dummyResults.length) * 100),
                categories: [...new Set(dummyResults.map(result => result.category))],
                scoreByCategory: {
                    labels: ["Python", "JavaScript", "C++", "Web Development", "Algorithms", "Databases", "Data Structures"],
                    series: [
                        {
                            name: "Average Score",
                            data: [92, 78, 65, 85, 71, 55, 95],
                        }
                    ]
                },
                progressOverTime: {
                    categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
                    series: [
                        {
                            name: "Your Score",
                            data: [65, 78, 82, 88, 92],
                        },
                        {
                            name: "Average Score",
                            data: [62, 68, 72, 76, 80],
                        }
                    ]
                }
            });

            setLoading(false);
        }, 1500);
    }, []);

    // Filter results
    useEffect(() => {
        let filtered = [...results];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(result =>
                result.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(result => result.category === selectedCategory);
        }

        // Filter by difficulty
        if (selectedDifficulty !== 'all') {
            filtered = filtered.filter(result => result.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());
        }

        // Filter by status
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(result => result.status === selectedStatus);
        }

        // Filter by time frame
        if (selectedTimeFrame !== 'all') {
            const now = new Date();
            const cutoffDate = new Date();

            switch (selectedTimeFrame) {
                case 'week':
                    cutoffDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    cutoffDate.setMonth(now.getMonth() - 1);
                    break;
                case 'quarter':
                    cutoffDate.setMonth(now.getMonth() - 3);
                    break;
                default:
                    break;
            }

            filtered = filtered.filter(result => new Date(result.date) >= cutoffDate);
        }

        // Sort results
        filtered = filtered.sort((a, b) => {
            let comparison = 0;

            switch (orderBy) {
                case 'date':
                    comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'score':
                    comparison = a.score - b.score;
                    break;
                case 'rank':
                    comparison = a.rank - b.rank;
                    break;
                default:
                    comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            }

            return order === 'asc' ? comparison : -comparison;
        });

        setFilteredResults(filtered);
        setPage(0); // Reset to first page when filters change
    }, [results, searchTerm, selectedCategory, selectedDifficulty, selectedStatus, selectedTimeFrame, orderBy, order]);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Handle filter menu
    const handleOpenFilterMenu = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleCloseFilterMenu = () => {
        setFilterAnchorEl(null);
    };

    // Handle sort request
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Handle pagination
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Reset all filters
    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedDifficulty('all');
        setSelectedStatus('all');
        setSelectedTimeFrame('all');
        setOrderBy('date');
        setOrder('desc');
        handleCloseFilterMenu();
    };

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

    // Get status color and icon
    const getStatusInfo = (status) => {
        switch (status) {
            case 'passed':
                return {
                    color: theme.palette.success.main,
                    icon: <CheckCircle fontSize="small" />
                };
            case 'failed':
                return {
                    color: theme.palette.error.main,
                    icon: <Cancel fontSize="small" />
                };
            default:
                return {
                    color: theme.palette.text.secondary,
                    icon: <AccessTime fontSize="small" />
                };
        }
    };

    // Get chart options
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
            {/* Header */}
            <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    <Box>
                        <Typography variant="h4" component="h1" fontWeight="800" gutterBottom>
                            Your Competition Results
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Track your performance in past competitions and analyze your progress.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Download />}
                        sx={{
                            bgcolor: 'var(--theme-color)',
                            borderRadius: '12px',
                            py: 1.2,
                            px: 3,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 8px 16px rgba(var(--theme-color-rgb), 0.2)',
                            '&:hover': {
                                bgcolor: 'var(--hover-color)',
                                boxShadow: '0 12px 20px rgba(var(--theme-color-rgb), 0.3)',
                            },
                            mt: { xs: 2, sm: 0 },
                        }}
                    >
                        Export Results
                    </Button>
                </Box>
            </MotionBox>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress size={60} sx={{ color: 'var(--theme-color)' }} />
                </Box>
            ) : (
                <>
                    {/* Stats Cards */}
                    <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                        height: '100%',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Total Competitions
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold">
                                                {statistics.totalCompetitions}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(var(--theme-color-rgb), 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--theme-color)',
                                            }}
                                        >
                                            <School fontSize="medium" />
                                        </Box>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 2,
                                            color: theme.palette.success.main,
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontWeight: 'medium',
                                        }}
                                    >
                                        <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                                        Completed this month
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                        height: '100%',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Average Score
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold">
                                                {statistics.averageScore}%
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(25, 118, 210, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: theme.palette.primary.main,
                                            }}
                                        >
                                            <Timeline fontSize="medium" />
                                        </Box>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            component="div"
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                mb: 0.5
                                            }}
                                        >
                                            <span>Progress</span>
                                            <span>{statistics.averageScore}%</span>
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={statistics.averageScore}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: 'rgba(25, 118, 210, 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: theme.palette.primary.main,
                                                }
                                            }}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                        height: '100%',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Best Ranking
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold">
                                                #{statistics.bestRank}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(255, 152, 0, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: theme.palette.warning.main,
                                            }}
                                        >
                                            <EmojiEvents fontSize="medium" />
                                        </Box>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 2,
                                            color: statistics.bestRank <= 3 ? theme.palette.warning.main : theme.palette.info.main,
                                            display: 'flex',
                                            alignItems: 'center',
                                            fontWeight: 'medium',
                                        }}
                                    >
                                        {statistics.bestRank <= 3 ? (
                                            <>
                                                <EmojiEvents fontSize="small" sx={{ mr: 0.5 }} />
                                                Top 3 achievement
                                            </>
                                        ) : (
                                            <>
                                                <Badge fontSize="small" sx={{ mr: 0.5 }} />
                                                Keep improving!
                                            </>
                                        )}
                                    </Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                        height: '100%',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Pass Rate
                                            </Typography>
                                            <Typography variant="h4" fontWeight="bold">
                                                {statistics.passRate}%
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: theme.palette.success.main,
                                            }}
                                        >
                                            <CheckCircle fontSize="medium" />
                                        </Box>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            component="div"
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                mb: 0.5
                                            }}
                                        >
                                            <span>Success Rate</span>
                                            <span>{statistics.passRate}%</span>
                                        </Typography>
                                        <LinearProgress
                                            variant="determinate"
                                            value={statistics.passRate}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: theme.palette.success.main,
                                                }
                                            }}
                                        />
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </MotionBox>

                    {/* Tabs Navigation */}
                    <MotionPaper
                        variants={itemVariants}
                        sx={{
                            borderRadius: '16px',
                            overflow: 'hidden',
                            mb: 3,
                        }}
                    >
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    minHeight: 48,
                                },
                                '& .Mui-selected': {
                                    color: 'var(--theme-color)',
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: 'var(--theme-color)',
                                },
                            }}
                        >
                            <Tab label="Results" />
                            <Tab label="Analytics" />
                            <Tab label="Certificates" />
                            <Tab label="Badges" />
                        </Tabs>
                    </MotionPaper>

                    {/* Tab Content */}
                    {activeTab === 0 ? (
                        /* Results Tab */
                        <MotionPaper
                            variants={itemVariants}
                            sx={{
                                borderRadius: '16px',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Search and Filters */}
                            <Box
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <TextField
                                    placeholder="Search competitions..."
                                    variant="outlined"
                                    size="small"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: '8px' }
                                    }}
                                    sx={{
                                        minWidth: { xs: '100%', sm: 220 },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'rgba(0,0,0,0.1)',
                                            },
                                        },
                                    }}
                                />

                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<FilterList />}
                                        size="small"
                                        onClick={handleOpenFilterMenu}
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderColor: 'rgba(0,0,0,0.1)',
                                            color: 'text.primary',
                                            '&:hover': {
                                                borderColor: 'var(--theme-color)',
                                                bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                                            },
                                        }}
                                    >
                                        Filter
                                        {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedStatus !== 'all' || selectedTimeFrame !== 'all') && (
                                            <Box
                                                component="span"
                                                sx={{
                                                    ml: 1,
                                                    width: 18,
                                                    height: 18,
                                                    borderRadius: '50%',
                                                    bgcolor: 'var(--theme-color)',
                                                    color: 'white',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {[selectedCategory, selectedDifficulty, selectedStatus, selectedTimeFrame].filter(filter => filter !== 'all').length}
                                            </Box>
                                        )}
                                    </Button>
                                    <Menu
                                        anchorEl={filterAnchorEl}
                                        open={Boolean(filterAnchorEl)}
                                        onClose={handleCloseFilterMenu}
                                        PaperProps={{
                                            sx: {
                                                width: 280,
                                                p: 2,
                                                borderRadius: '16px',
                                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                            },
                                        }}
                                    >
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Filter Results
                                        </Typography>
                                        <Divider sx={{ my: 1.5 }} />

                                        <Typography variant="body2" fontWeight="medium" gutterBottom>
                                            Category
                                        </Typography>
                                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                            <Select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                displayEmpty
                                                sx={{
                                                    '&.MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            borderColor: 'rgba(0,0,0,0.1)',
                                                        },
                                                    },
                                                }}
                                            >
                                                <MenuItem value="all">All Categories</MenuItem>
                                                {statistics.categories.map(category => (
                                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <Typography variant="body2" fontWeight="medium" gutterBottom>
                                            Difficulty
                                        </Typography>
                                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                            <Select
                                                value={selectedDifficulty}
                                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                                displayEmpty
                                                sx={{
                                                    '&.MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            borderColor: 'rgba(0,0,0,0.1)',
                                                        },
                                                    },
                                                }}
                                            >
                                                <MenuItem value="all">All Difficulties</MenuItem>
                                                <MenuItem value="easy">Easy</MenuItem>
                                                <MenuItem value="medium">Medium</MenuItem>
                                                <MenuItem value="hard">Hard</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Typography variant="body2" fontWeight="medium" gutterBottom>
                                            Status
                                        </Typography>
                                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                                            <Select
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                displayEmpty
                                                sx={{
                                                    '&.MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            borderColor: 'rgba(0,0,0,0.1)',
                                                        },
                                                    },
                                                }}
                                            >
                                                <MenuItem value="all">All Status</MenuItem>
                                                <MenuItem value="passed">Passed</MenuItem>
                                                <MenuItem value="failed">Failed</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Typography variant="body2" fontWeight="medium" gutterBottom>
                                            Time Frame
                                        </Typography>
                                        <FormControl fullWidth size="small" sx={{ mb: 3 }}>
                                            <Select
                                                value={selectedTimeFrame}
                                                onChange={(e) => setSelectedTimeFrame(e.target.value)}
                                                displayEmpty
                                                sx={{
                                                    '&.MuiOutlinedInput-root': {
                                                        borderRadius: '8px',
                                                        '& fieldset': {
                                                            borderColor: 'rgba(0,0,0,0.1)',
                                                        },
                                                    },
                                                }}
                                            >
                                                <MenuItem value="all">All Time</MenuItem>
                                                <MenuItem value="week">Last 7 days</MenuItem>
                                                <MenuItem value="month">Last 30 days</MenuItem>
                                                <MenuItem value="quarter">Last 3 months</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <Divider sx={{ my: 1.5 }} />

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Button
                                                variant="text"
                                                onClick={handleResetFilters}
                                                sx={{
                                                    textTransform: 'none',
                                                }}
                                            >
                                                Reset All
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={handleCloseFilterMenu}
                                                sx={{
                                                    borderRadius: '8px',
                                                    textTransform: 'none',
                                                    bgcolor: 'var(--theme-color)',
                                                    '&:hover': {
                                                        bgcolor: 'var(--hover-color)',
                                                    },
                                                }}
                                            >
                                                Apply Filters
                                            </Button>
                                        </Box>
                                    </Menu>

                                    <Button
                                        variant="outlined"
                                        startIcon={<Sort />}
                                        size="small"
                                        onClick={() => handleRequestSort('date')}
                                        sx={{
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderColor: 'rgba(0,0,0,0.1)',
                                            color: 'text.primary',
                                            '&:hover': {
                                                borderColor: 'var(--theme-color)',
                                                bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                                            },
                                        }}
                                    >
                                        Sort
                                        {order === 'asc' ? <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} /> : <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />}
                                    </Button>
                                </Box>
                            </Box>

                            {/* Results Table */}
                            {filteredResults.length === 0 ? (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="h6" gutterBottom>
                                        No results found
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Try adjusting your filters or search criteria
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={handleResetFilters}
                                        sx={{
                                            mt: 2,
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Reset Filters
                                    </Button>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table sx={{ minWidth: 650 }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    sortDirection={orderBy === 'title' ? order : false}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    <TableSortLabel
                                                        active={orderBy === 'title'}
                                                        direction={orderBy === 'title' ? order : 'asc'}
                                                        onClick={() => handleRequestSort('title')}
                                                    >
                                                        Competition
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell
                                                    sortDirection={orderBy === 'date' ? order : false}
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    <TableSortLabel
                                                        active={orderBy === 'date'}
                                                        direction={orderBy === 'date' ? order : 'asc'}
                                                        onClick={() => handleRequestSort('date')}
                                                    >
                                                        Date
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Difficulty</TableCell>
                                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                                <TableCell
                                                    sortDirection={orderBy === 'score' ? order : false}
                                                    align="center"
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    <TableSortLabel
                                                        active={orderBy === 'score'}
                                                        direction={orderBy === 'score' ? order : 'asc'}
                                                        onClick={() => handleRequestSort('score')}
                                                    >
                                                        Score
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell
                                                    sortDirection={orderBy === 'rank' ? order : false}
                                                    align="center"
                                                    sx={{ fontWeight: 'bold' }}
                                                >
                                                    <TableSortLabel
                                                        active={orderBy === 'rank'}
                                                        direction={orderBy === 'rank' ? order : 'asc'}
                                                        onClick={() => handleRequestSort('rank')}
                                                    >
                                                        Rank
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredResults
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((result) => {
                                                    const statusInfo = getStatusInfo(result.status);

                                                    return (
                                                        <TableRow
                                                            key={result.id}
                                                            hover
                                                            sx={{
                                                                '&:last-child td, &:last-child th': { border: 0 },
                                                                cursor: 'pointer',
                                                                '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                                                            }}
                                                            onClick={() => navigate(`/dashboard/competition/result/${result.competitionId}`)}
                                                        >
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Code sx={{ mr: 1, color: 'var(--theme-color)' }} />
                                                                    <Typography variant="body2" fontWeight="medium">
                                                                        {result.title}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <CalendarToday fontSize="small" sx={{ mr: 0.75, color: 'text.secondary', fontSize: '1rem' }} />
                                                                    <Typography variant="body2">
                                                                        {new Date(result.date).toLocaleDateString('en-US', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={result.category}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        borderRadius: '8px',
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Chip
                                                                    label={result.difficulty}
                                                                    size="small"
                                                                    sx={{
                                                                        borderRadius: '8px',
                                                                        bgcolor: `${getDifficultyColor(result.difficulty)}15`,
                                                                        color: getDifficultyColor(result.difficulty),
                                                                        fontWeight: 'bold',
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Box
                                                                        sx={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            color: statusInfo.color,
                                                                            fontWeight: 'medium',
                                                                            fontSize: '0.875rem',
                                                                        }}
                                                                    >
                                                                        {statusInfo.icon}
                                                                        <Box component="span" sx={{ ml: 0.5 }}>
                                                                            {result.status === 'passed' ? 'Passed' : 'Failed'}
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={`${result.score}%`}
                                                                    size="small"
                                                                    sx={{
                                                                        fontWeight: 'bold',
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
                                                                    }}
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}
                                                                >
                                                                    <Box
                                                                        sx={{
                                                                            fontWeight: 'bold',
                                                                            color: result.rank <= 3 ? theme.palette.warning.main : 'inherit',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                        }}
                                                                    >
                                                                        #{result.rank}
                                                                        {result.rank <= 3 && (
                                                                            <EmojiEvents
                                                                                fontSize="small"
                                                                                sx={{
                                                                                    ml: 0.5,
                                                                                    color: theme.palette.warning.main,
                                                                                    fontSize: '1rem',
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                        sx={{
                                                                            ml: 0.5,
                                                                        }}
                                                                    >
                                                                        of {result.totalParticipants}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                    <Tooltip title="View Details">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                navigate(`/dashboard/competition/result/${result.competitionId}`);
                                                                            }}
                                                                        >
                                                                            <Visibility fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Tooltip title="Share Result">
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                // Handle share
                                                                            }}
                                                                        >
                                                                            <Share fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {/* Pagination */}
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={filteredResults.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </MotionPaper>
                    ) : activeTab === 1 ? (
                        /* Analytics Tab */
                        <Box>
                            <Grid container spacing={3}>
                                {/* Score by Category */}
                                <Grid item xs={12}>
                                    <MotionPaper
                                        variants={itemVariants}
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                        }}
                                    >
                                        <Chart
                                            options={getChartOptions('Score by Category')}
                                            series={statistics.scoreByCategory.series}
                                            type="bar"
                                            height={350}
                                        />
                                    </MotionPaper>
                                </Grid>

                                {/* Progress Over Time */}
                                <Grid item xs={12}>
                                    <MotionPaper
                                        variants={itemVariants}
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                        }}
                                    >
                                        <Chart
                                            options={getChartOptions('Progress Over Time')}
                                            series={statistics.progressOverTime.series}
                                            type="line"
                                            height={350}
                                        />
                                    </MotionPaper>
                                </Grid>

                                {/* Problem Solving Statistics */}
                                <Grid item xs={12} md={6}>
                                    <MotionPaper
                                        variants={itemVariants}
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            Problem Solving Statistics
                                        </Typography>
                                        <List>
                                            <ListItem sx={{ px: 0 }}>
                                                <ListItemText
                                                    primary="Total Problems Attempted"
                                                    secondary={`${results.reduce((sum, result) => sum + result.totalProblems, 0)} problems across ${results.length} competitions`}
                                                />
                                                <Typography variant="h6" fontWeight="bold">
                                                    {results.reduce((sum, result) => sum + result.solvedProblems, 0)}
                                                </Typography>
                                            </ListItem>
                                            <Divider />
                                            <ListItem sx={{ px: 0 }}>
                                                <ListItemText
                                                    primary="Problem Solving Rate"
                                                    secondary="Percentage of problems solved correctly"
                                                />
                                                <Typography variant="h6" fontWeight="bold">
                                                    {Math.round((results.reduce((sum, result) => sum + result.solvedProblems, 0) / results.reduce((sum, result) => sum + result.totalProblems, 0)) * 100)}%
                                                </Typography>
                                            </ListItem>
                                            <Divider />
                                            <ListItem sx={{ px: 0 }}>
                                                <ListItemText
                                                    primary="Average Time per Problem"
                                                    secondary="Based on total competition time"
                                                />
                                                <Typography variant="h6" fontWeight="bold">
                                                    22 min
                                                </Typography>
                                            </ListItem>
                                        </List>
                                    </MotionPaper>
                                </Grid>

                                {/* Strengths and Areas for Improvement */}
                                <Grid item xs={12} md={6}>
                                    <MotionPaper
                                        variants={itemVariants}
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                            height: '100%',
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            Strengths & Areas for Improvement
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '12px',
                                                        bgcolor: 'rgba(76, 175, 80, 0.05)',
                                                        border: '1px solid',
                                                        borderColor: 'rgba(76, 175, 80, 0.1)',
                                                        height: '100%',
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" color={theme.palette.success.main} gutterBottom>
                                                        Strengths
                                                    </Typography>
                                                    <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                                                        <Typography component="li" variant="body2" paragraph>
                                                            <Box component="span" sx={{ fontWeight: 'bold' }}>
                                                                Data Structures:
                                                            </Box>{' '}
                                                            95% success rate
                                                        </Typography>
                                                        <Typography component="li" variant="body2" paragraph>
                                                            <Box component="span" sx={{ fontWeight: 'bold' }}>
                                                                Python:
                                                            </Box>{' '}
                                                            92% success rate
                                                        </Typography>
                                                        <Typography component="li" variant="body2">
                                                            <Box component="span" sx={{ fontWeight: 'bold' }}>
                                                                Web Development:
                                                            </Box>{' '}
                                                            85% success rate
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '12px',
                                                        bgcolor: 'rgba(255, 152, 0, 0.05)',
                                                        border: '1px solid',
                                                        borderColor: 'rgba(255, 152, 0, 0.1)',
                                                        height: '100%',
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" color={theme.palette.warning.main} gutterBottom>
                                                        Areas for Improvement
                                                    </Typography>
                                                    <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                                                        <Typography component="li" variant="body2" paragraph>
                                                            <Box component="span" sx={{ fontWeight: 'bold' }}>
                                                                Databases:
                                                            </Box>{' '}
                                                            55% success rate
                                                        </Typography>
                                                        <Typography component="li" variant="body2" paragraph>
                                                            <Box component="span" sx={{ fontWeight: 'bold' }}>
                                                                C++:
                                                            </Box>{' '}
                                                            65% success rate
                                                        </Typography>
                                                        <Typography component="li" variant="body2">
                                                            <Box component="span" sx={{ fontWeight: 'bold' }}>
                                                                Algorithms:
                                                            </Box>{' '}
                                                            71% success rate
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            sx={{
                                                mt: 2,
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                borderColor: 'rgba(0,0,0,0.1)',
                                                color: 'text.primary',
                                                '&:hover': {
                                                    borderColor: 'var(--theme-color)',
                                                    bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                                                },
                                            }}
                                        >
                                            View Detailed Analytics
                                        </Button>
                                    </MotionPaper>
                                </Grid>
                            </Grid>
                        </Box>
                    ) : activeTab === 2 ? (
                        /* Certificates Tab */
                        <Grid container spacing={3}>
                            {results
                                .filter(result => result.status === 'passed')
                                .map((result) => (
                                    <Grid item xs={12} md={6} lg={4} key={result.id}>
                                        <MotionPaper
                                            variants={itemVariants}
                                            sx={{
                                                borderRadius: '16px',
                                                overflow: 'hidden',
                                                position: 'relative',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: 180,
                                                    bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        width: '80%',
                                                        height: '80%',
                                                        border: '2px solid',
                                                        borderColor: 'rgba(var(--theme-color-rgb), 0.2)',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        padding: 2,
                                                        textAlign: 'center',
                                                        backgroundColor: 'white',
                                                        boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="overline"
                                                        sx={{
                                                            letterSpacing: 2,
                                                            color: 'text.secondary',
                                                            fontSize: '0.7rem',
                                                        }}
                                                    >
                                                        CERTIFICATE OF COMPLETION
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {result.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(result.date).toLocaleDateString('en-US', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ p: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {result.title} Certificate
                                                    </Typography>
                                                    {result.score >= 90 && (
                                                        <Chip
                                                            label="Distinction"
                                                            size="small"
                                                            sx={{
                                                                bgcolor: theme.palette.warning.main,
                                                                color: 'white',
                                                                fontWeight: 'bold',
                                                                borderRadius: '4px',
                                                                height: 20,
                                                                fontSize: '0.7rem',
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Score: {result.score}% | Rank: #{result.rank} of {result.totalParticipants}
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<Visibility />}
                                                        sx={{
                                                            borderRadius: '8px',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            borderColor: 'rgba(0,0,0,0.1)',
                                                            color: 'text.primary',
                                                            '&:hover': {
                                                                borderColor: 'var(--theme-color)',
                                                                bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                                                            },
                                                        }}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<Download />}
                                                        sx={{
                                                            borderRadius: '8px',
                                                            textTransform: 'none',
                                                            fontWeight: 600,
                                                            borderColor: 'rgba(var(--theme-color-rgb), 0.2)',
                                                            color: 'var(--theme-color)',
                                                            '&:hover': {
                                                                bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                                                            },
                                                        }}
                                                    >
                                                        Download
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </MotionPaper>
                                    </Grid>
                                ))}
                        </Grid>
                    ) : (
                        /* Badges Tab */
                        <Grid container spacing={3}>
                            {/* Achievement Badges */}
                            <Grid item xs={12} md={4}>
                                <MotionPaper
                                    variants={itemVariants}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Achievement Badges
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Badges earned through outstanding performance in competitions.
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: 'rgba(255, 152, 0, 0.9)',
                                                        border: '3px solid',
                                                        borderColor: theme.palette.warning.light,
                                                    }}
                                                >
                                                    <EmojiEvents />
                                                </Avatar>
                                                <Typography variant="caption" align="center">
                                                    Top Performer
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: 'rgba(var(--theme-color-rgb), 0.9)',
                                                        border: '3px solid',
                                                        borderColor: 'rgba(var(--theme-color-rgb), 0.4)',
                                                    }}
                                                >
                                                    <Code />
                                                </Avatar>
                                                <Typography variant="caption" align="center">
                                                    Code Master
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    opacity: 0.5,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: 'rgba(156, 39, 176, 0.3)',
                                                        border: '3px solid',
                                                        borderColor: 'rgba(156, 39, 176, 0.2)',
                                                    }}
                                                >
                                                    <School />
                                                </Avatar>
                                                <Typography variant="caption" align="center">
                                                    Scholar
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            color: 'var(--theme-color)',
                                            mt: 2,
                                        }}
                                    >
                                        View All Badges
                                    </Button>
                                </MotionPaper>
                            </Grid>

                            {/* Language Proficiency */}
                            <Grid item xs={12} md={4}>
                                <MotionPaper
                                    variants={itemVariants}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Language Proficiency
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Badges based on your programming language expertise.
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: 'rgba(76, 175, 80, 0.9)',
                                                        border: '3px solid',
                                                        borderColor: theme.palette.success.light,
                                                    }}
                                                >
                                                    <Typography variant="subtitle1" fontWeight="bold">Py</Typography>
                                                </Avatar>
                                                <Typography variant="caption" align="center">
                                                    Python Expert
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: 'rgba(25, 118, 210, 0.9)',
                                                        border: '3px solid',
                                                        borderColor: theme.palette.primary.light,
                                                    }}
                                                >
                                                    <Typography variant="subtitle1" fontWeight="bold">JS</Typography>
                                                </Avatar>
                                                <Typography variant="caption" align="center">
                                                    JS Proficient
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    opacity: 0.5,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: 'rgba(244, 67, 54, 0.3)',
                                                        border: '3px solid',
                                                        borderColor: 'rgba(244, 67, 54, 0.2)',
                                                    }}
                                                >
                                                    <Typography variant="subtitle1" fontWeight="bold">C++</Typography>
                                                </Avatar>
                                                <Typography variant="caption" align="center">
                                                    C++ Beginner
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            color: 'var(--theme-color)',
                                            mt: 2,
                                        }}
                                    >
                                        View All Languages
                                    </Button>
                                </MotionPaper>
                            </Grid>

                            {/* Topic Mastery */}
                            <Grid item xs={12} md={4}>
                                <MotionPaper
                                    variants={itemVariants}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Topic Mastery
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Badges awarded for mastering specific programming topics.
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: 'rgba(156, 39, 176, 0.9)',
                                                        border: '3px solid',
                                                        borderColor: theme.palette.secondary.light,
                                                    }}
                                                >
                                                    <Code />
                                                </Avatar>
                                                <Typography variant="caption" align="center">
                                                    Data Structures
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: 'rgba(3, 169, 244, 0.9)',
                                                        border: '3px solid',
                                                        borderColor: 'rgba(3, 169, 244, 0.4)',
                                                    }}
                                                >
                                                    <School />
                                                </Avatar>
                                                <Typography variant="caption" align="center">
                                                    Web Dev
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    opacity: 0.5,
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: 'rgba(0, 150, 136, 0.3)',
                                                        border: '3px solid',
                                                        borderColor: 'rgba(0, 150, 136, 0.2)',
                                                    }}
                                                >
                                                    <Timeline />
                                                </Avatar>
                                                <Typography variant="caption" align="center">
                                                    Algorithms
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            color: 'var(--theme-color)',
                                            mt: 2,
                                        }}
                                    >
                                        View All Topics
                                    </Button>
                                </MotionPaper>
                            </Grid>

                            {/* Badge Progress */}
                            <Grid item xs={12}>
                                <MotionPaper
                                    variants={itemVariants}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                        Badge Progress
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        Badges you can earn by completing more competitions.
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            bgcolor: 'rgba(255, 152, 0, 0.2)',
                                                            color: theme.palette.warning.main,
                                                            mr: 2,
                                                        }}
                                                    >
                                                        <EmojiEvents />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold">
                                                            Competition Master
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Complete 10 competitions
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Progress
                                                        </Typography>
                                                        <Typography variant="caption" fontWeight="bold">
                                                            {results.length}/10
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(results.length / 10) * 100}
                                                        sx={{
                                                            height: 6,
                                                            borderRadius: 3,
                                                            bgcolor: 'rgba(255, 152, 0, 0.1)',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: theme.palette.warning.main,
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            bgcolor: 'rgba(76, 175, 80, 0.2)',
                                                            color: theme.palette.success.main,
                                                            mr: 2,
                                                        }}
                                                    >
                                                        <CheckCircle />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold">
                                                            Perfect Score
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Score 100% in any competition
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Progress
                                                        </Typography>
                                                        <Typography variant="caption" fontWeight="bold">
                                                            {Math.max(...results.map(r => r.score))}/100
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={Math.max(...results.map(r => r.score))}
                                                        sx={{
                                                            height: 6,
                                                            borderRadius: 3,
                                                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: theme.palette.success.main,
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar
                                                        sx={{
                                                            width: 48,
                                                            height: 48,
                                                            bgcolor: 'rgba(25, 118, 210, 0.2)',
                                                            color: theme.palette.primary.main,
                                                            mr: 2,
                                                        }}
                                                    >
                                                        <School />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight="bold">
                                                            Language Polyglot
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Use 5 different languages
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Progress
                                                        </Typography>
                                                        <Typography variant="caption" fontWeight="bold">
                                                            3/5
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={(3 / 5) * 100}
                                                        sx={{
                                                            height: 6,
                                                            borderRadius: 3,
                                                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: theme.palette.primary.main,
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </MotionPaper>
                            </Grid>
                        </Grid>
                    )}
                </>
            )}
        </MotionBox>
    );
};

export default Results;
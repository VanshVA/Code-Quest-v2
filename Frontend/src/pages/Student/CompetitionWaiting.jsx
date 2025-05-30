import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Grid,
    Avatar,
    Chip,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Alert,
    IconButton,
    Tooltip,
    useTheme
} from '@mui/material';
import {
    AccessTime,
    People,
    EventNote,
    School,
    Logout,
    PeopleAlt,
    SignalCellularAlt,
    NotificationsActive,
    Info,
    Check,
    HighlightOff,
    ArrowBack,
    Visibility
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Countdown from 'react-countdown';

// Motion components
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);

const CompetitionWaiting = () => {
    const { id } = useParams();
    const theme = useTheme();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [competition, setCompetition] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [systemChecks, setSystemChecks] = useState({
        internet: 'checking',
        browser: 'checking',
        screenSize: 'checking',
        permissions: 'checking'
    });
    const [startingIn, setStartingIn] = useState(null);

    // Ref for participants list auto-scroll
    const participantsEndRef = useRef(null);

    // Fetch competition data
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setCompetition({
                id: Number(id),
                title: "Algorithm Challenge",
                description: "Test your algorithm skills with complex problems that require optimal solutions. This competition focuses on efficiency and correctness.",
                date: "2025-06-02",
                time: "14:00-16:00",
                startTime: Date.now() + 60000, // 1 minute from now for demo
                status: "upcoming",
                participants: 128,
                maxParticipants: 200,
                difficulty: "Hard",
                category: "Algorithms",
                duration: 120, // minutes
                prizes: ["$500", "$250", "$100"],
                prerequisites: ["Algorithm fundamentals", "Data structures", "Problem-solving skills"],
                creator: "Prof. Alan Turing",
                image: "/static/images/competitions/algorithm.jpg",
                rules: [
                    "You must solve the problems independently without external help",
                    "Plagiarism will result in disqualification",
                    "You are allowed to use standard libraries",
                    "You cannot use internet resources during the competition",
                    "All submissions will be checked for code similarity"
                ]
            });

            // Generate random participants
            const randomParticipants = Array(50).fill().map((_, i) => ({
                id: i + 1,
                name: `Participant ${i + 1}`,
                avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
                joinedAt: new Date(Date.now() - Math.floor(Math.random() * 3600000)),
            }));

            setParticipants(randomParticipants);

            // Set announcements
            setAnnouncements([
                {
                    id: 1,
                    message: "Welcome to the Algorithm Challenge! The competition will start shortly. Make sure your system is ready.",
                    timestamp: new Date(Date.now() - 600000),
                    type: "info"
                },
                {
                    id: 2,
                    message: "The competition will include 5 algorithmic problems of varying difficulty levels. You'll have 120 minutes to complete them.",
                    timestamp: new Date(Date.now() - 300000),
                    type: "info"
                },
                {
                    id: 3,
                    message: "Important: Make sure your browser is up to date and you have a stable internet connection.",
                    timestamp: new Date(Date.now() - 120000),
                    type: "warning"
                },
            ]);

            // Set starting time
            setStartingIn(Date.now() + 60000); // 1 minute from now for demo

            setLoading(false);

            // Run system checks
            runSystemChecks();
        }, 1500);
    }, [id]);

    // Auto-scroll to the bottom of participants list when new ones join
    useEffect(() => {
        if (participantsEndRef.current) {
            participantsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [participants]);

    // Run system checks
    const runSystemChecks = () => {
        // Check internet connection
        setTimeout(() => {
            setSystemChecks(prev => ({ ...prev, internet: 'passed' }));

            // Check browser
            setTimeout(() => {
                setSystemChecks(prev => ({ ...prev, browser: 'passed' }));

                // Check screen size
                setTimeout(() => {
                    const screenCheck = window.innerWidth > 768 && window.innerHeight > 600;
                    setSystemChecks(prev => ({ ...prev, screenSize: screenCheck ? 'passed' : 'failed' }));

                    // Check permissions
                    setTimeout(() => {
                        setSystemChecks(prev => ({ ...prev, permissions: 'passed' }));
                    }, 800);
                }, 800);
            }, 800);
        }, 800);
    };

    // Handle leave competition
    const handleLeave = () => {
        // In a real app, this would make an API call to leave the competition
        navigate('/dashboard/competitions');
    };

    // Handle competition start
    const handleStartCompetition = () => {
        navigate(`/dashboard/competition/editor/${id}`);
    };

    // Format time remaining
    const formatTimeRemaining = () => {
        if (!startingIn) return '';

        const now = Date.now();
        const diff = startingIn - now;

        if (diff <= 0) return 'Starting now...';

        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Get status color for system checks
    const getStatusColor = (status) => {
        switch (status) {
            case 'passed':
                return theme.palette.success.main;
            case 'failed':
                return theme.palette.error.main;
            case 'checking':
            default:
                return theme.palette.info.main;
        }
    };

    // Get status icon for system checks
    const getStatusIcon = (status) => {
        switch (status) {
            case 'passed':
                return <Check />;
            case 'failed':
                return <HighlightOff />;
            case 'checking':
            default:
                return <CircularProgress size={20} />;
        }
    };

    // Countdown renderer
    const countdownRenderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            // When countdown completes, start the competition
            setTimeout(() => {
                handleStartCompetition();
            }, 1000);

            return <Typography variant="h3" fontWeight="bold" color="error.main">Starting now...</Typography>;
        }

        return (
            <Typography variant="h3" fontWeight="bold" color="primary.main">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Typography>
        );
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
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress size={60} sx={{ color: 'var(--theme-color)' }} />
            </Box>
        );
    }

    return (
        <MotionBox
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            sx={{
                maxWidth: '1600px',
                mx: 'auto',
                height: '100%',
            }}
        >
            <Grid container spacing={3} sx={{ height: '100%' }}>
                {/* Left Column - Competition Info */}
                <Grid item xs={12} md={7} lg={8}>
                    <MotionPaper
                        variants={itemVariants}
                        sx={{
                            p: 3,
                            borderRadius: '16px',
                            height: '100%',
                        }}
                    >
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 2
                            }}>
                                <Typography variant="h4" component="h1" fontWeight="800">
                                    {competition.title}
                                </Typography>
                                <Chip
                                    label={competition.difficulty}
                                    sx={{
                                        bgcolor: competition.difficulty === 'Easy' ? theme.palette.success.main :
                                            competition.difficulty === 'Medium' ? theme.palette.warning.main : theme.palette.error.main,
                                        color: 'white',
                                        fontWeight: 'bold',
                                    }}
                                />
                            </Box>
                            <Typography variant="body1" color="textSecondary" paragraph>
                                {competition.description}
                            </Typography>
                        </Box>

                        {/* Countdown */}
                        <Box
                            sx={{
                                mb: 4,
                                p: 3,
                                borderRadius: '16px',
                                bgcolor: 'rgba(var(--theme-color-rgb), 0.05)',
                                border: '1px solid rgba(var(--theme-color-rgb), 0.1)',
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Competition Starts In
                            </Typography>
                            <Box sx={{ my: 3 }}>
                                {startingIn && <Countdown date={startingIn} renderer={countdownRenderer} />}
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                                Please complete the system checks and be ready when the timer reaches zero
                            </Typography>
                        </Box>

                        {/* System Checks */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                System Checks
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '10px',
                                                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                }}
                                            >
                                                <SignalCellularAlt sx={{ color: theme.palette.primary.main }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    Internet Connection
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Stable connection required
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                bgcolor: `${getStatusColor(systemChecks.internet)}15`,
                                                color: getStatusColor(systemChecks.internet),
                                            }}
                                        >
                                            {getStatusIcon(systemChecks.internet)}
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '10px',
                                                    bgcolor: 'rgba(76, 175, 80, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                }}
                                            >
                                                <Visibility sx={{ color: theme.palette.success.main }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    Browser Compatibility
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Modern browser required
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                bgcolor: `${getStatusColor(systemChecks.browser)}15`,
                                                color: getStatusColor(systemChecks.browser),
                                            }}
                                        >
                                            {getStatusIcon(systemChecks.browser)}
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '10px',
                                                    bgcolor: 'rgba(255, 152, 0, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                }}
                                            >
                                                <School sx={{ color: theme.palette.warning.main }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    Screen Size
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Minimum 768x600 required
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                bgcolor: `${getStatusColor(systemChecks.screenSize)}15`,
                                                color: getStatusColor(systemChecks.screenSize),
                                            }}
                                        >
                                            {getStatusIcon(systemChecks.screenSize)}
                                        </Box>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '10px',
                                                    bgcolor: 'rgba(156, 39, 176, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                }}
                                            >
                                                <NotificationsActive sx={{ color: theme.palette.secondary.main }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="body1" fontWeight="medium">
                                                    Permissions
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Notifications enabled
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                bgcolor: `${getStatusColor(systemChecks.permissions)}15`,
                                                color: getStatusColor(systemChecks.permissions),
                                            }}
                                        >
                                            {getStatusIcon(systemChecks.permissions)}
                                        </Box>
                                    </Paper>
                                </Grid>
                            </Grid>

                            {Object.values(systemChecks).includes('failed') && (
                                <Alert
                                    severity="error"
                                    sx={{ mt: 2, borderRadius: '8px' }}
                                    icon={<ErrorOutline fontSize="inherit" />}
                                >
                                    Some system checks have failed. Please resolve these issues before the competition starts.
                                </Alert>
                            )}
                        </Box>

                        {/* Competition Details */}
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Competition Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <AccessTime fontSize="large" color="primary" sx={{ mb: 1 }} />
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Duration
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {competition.duration} min
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <People fontSize="large" color="primary" sx={{ mb: 1 }} />
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Participants
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {competition.participants}/{competition.maxParticipants}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <EventNote fontSize="large" color="primary" sx={{ mb: 1 }} />
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Date
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {new Date(competition.date).toLocaleDateString('en-US', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} sm={6} md={3}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderRadius: '12px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <School fontSize="large" color="primary" sx={{ mb: 1 }} />
                                        <Typography variant="body2" color="textSecondary" gutterBottom>
                                            Category
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {competition.category}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Competition Rules */}
                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Rules & Guidelines
                            </Typography>
                            <Paper
                                sx={{
                                    p: 3,
                                    borderRadius: '12px',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                }}
                            >
                                <List sx={{ p: 0 }}>
                                    {competition.rules.map((rule, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                                                <ListItemText
                                                    primary={
                                                        <Box component="span" sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    width: 20,
                                                                    height: 20,
                                                                    borderRadius: '50%',
                                                                    bgcolor: 'var(--theme-color)',
                                                                    color: 'white',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    mr: 2,
                                                                    mt: 0.5,
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 'bold',
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                {index + 1}
                                                            </Box>
                                                            <Typography variant="body1">{rule}</Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                            {index < competition.rules.length - 1 && <Divider component="li" />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Paper>

                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleLeave}
                                    startIcon={<Logout />}
                                    sx={{
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Leave Competition
                                </Button>
                            </Box>
                        </Box>
                    </MotionPaper>
                </Grid>

                {/* Right Column - Announcements and Participants */}
                <Grid item xs={12} md={5} lg={4}>
                    <Grid container spacing={3} direction="column" sx={{ height: '100%' }}>
                        {/* Announcements */}
                        <Grid item xs>
                            <MotionPaper
                                variants={itemVariants}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Announcements
                                </Typography>

                                <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
                                    {announcements.length === 0 ? (
                                        <Box sx={{ textAlign: 'center', py: 4, opacity: 0.6 }}>
                                            <Info fontSize="large" color="disabled" sx={{ mb: 1 }} />
                                            <Typography variant="body2" color="textSecondary">
                                                No announcements yet
                                            </Typography>
                                        </Box>
                                    ) : (
                                        announcements.map((announcement) => (
                                            <Box
                                                key={announcement.id}
                                                sx={{
                                                    mb: 2,
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    bgcolor: announcement.type === 'warning'
                                                        ? 'rgba(255, 152, 0, 0.05)'
                                                        : announcement.type === 'error'
                                                            ? 'rgba(244, 67, 54, 0.05)'
                                                            : 'rgba(25, 118, 210, 0.05)',
                                                    border: `1px solid ${announcement.type === 'warning'
                                                        ? 'rgba(255, 152, 0, 0.1)'
                                                        : announcement.type === 'error'
                                                            ? 'rgba(244, 67, 54, 0.1)'
                                                            : 'rgba(25, 118, 210, 0.1)'}`,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: announcement.type === 'warning'
                                                                ? theme.palette.warning.main
                                                                : announcement.type === 'error'
                                                                    ? theme.palette.error.main
                                                                    : theme.palette.primary.main,
                                                            fontWeight: 'bold',
                                                            textTransform: 'uppercase',
                                                        }}
                                                    >
                                                        {announcement.type === 'info' ? 'Information' : announcement.type}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {announcement.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2">
                                                    {announcement.message}
                                                </Typography>
                                            </Box>
                                        ))
                                    )}
                                </Box>
                            </MotionPaper>
                        </Grid>

                        {/* Participants */}
                        <Grid item xs>
                            <MotionPaper
                                variants={itemVariants}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        Participants
                                    </Typography>
                                    <Chip
                                        icon={<PeopleAlt fontSize="small" />}
                                        label={`${participants.length}/${competition.maxParticipants}`}
                                        sx={{ borderRadius: '8px' }}
                                    />
                                </Box>

                                <Box
                                    sx={{
                                        overflow: 'auto',
                                        flexGrow: 1,
                                        maxHeight: '300px',
                                        '&::-webkit-scrollbar': {
                                            width: '6px',
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                            borderRadius: '3px',
                                        },
                                    }}
                                >
                                    <List dense disablePadding>
                                        {participants.map((participant) => (
                                            <ListItem
                                                key={participant.id}
                                                sx={{
                                                    borderRadius: '8px',
                                                    mb: 0.5,
                                                    '&:hover': {
                                                        bgcolor: 'rgba(0,0,0,0.03)',
                                                    },
                                                }}
                                            >
                                                <ListItemAvatar sx={{ minWidth: 40 }}>
                                                    <Avatar
                                                        src={participant.avatar}
                                                        alt={participant.name}
                                                        sx={{ width: 30, height: 30 }}
                                                    />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={participant.name}
                                                    secondary={`Joined ${new Date(participant.joinedAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}`}
                                                    primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                                                    secondaryTypographyProps={{ variant: 'caption' }}
                                                />
                                            </ListItem>
                                        ))}
                                        <div ref={participantsEndRef} />
                                    </List>
                                </Box>
                            </MotionPaper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </MotionBox >
  );
};

export default CompetitionWaiting;
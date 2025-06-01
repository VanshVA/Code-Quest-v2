import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Chip,
    Divider,
    CircularProgress,
    Tab,
    Tabs,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Paper,
    IconButton,
    Card,
    CardContent,
    useTheme
} from '@mui/material';
import {
    Close,
    Person,
    Grade,
    Alarm,
    Info,
    Check,
    AccessTime,
    EmojiEvents,
    Edit,
    ArrowForward,
    School
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

// API base URL
const API_BASE_URL = "http://localhost:5000/api/teacher/dashboard";

// Tab panel component
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`competition-tabpanel-${index}`}
            aria-labelledby={`competition-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const CompetitionDetail = ({ open, onClose, competitionId }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [competition, setCompetition] = useState(null);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [stats, setStats] = useState(null);

    // Fetch competition details
    useEffect(() => {
        if (open && competitionId) {
            fetchCompetitionDetails();
        }
    }, [open, competitionId]);

    // Update the fetchCompetitionDetails function to align with the API structure
    const fetchCompetitionDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching competition details for ID:', competitionId);
            const token = localStorage.getItem('token');
            
            // Fetch competition details
            const competitionResponse = await axios.get(`${API_BASE_URL}/competitions/${competitionId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (competitionResponse.data.success) {
                const competitionData = competitionResponse.data.data.competition;
                
                // Ensure creator object exists to avoid undefined errors
                if (!competitionData.creator) {
                    competitionData.creator = {
                        name: 'Unknown Creator',
                        email: 'N/A',
                        id: 'N/A'
                    };
                }
                
                console.log('Competition data loaded:', competitionData);
                
                // Check if we have questions in the new structure
                if (competitionData.questions) {
                    console.log('Questions loaded:', competitionData.questions.length);
                }
                
                setCompetition(competitionData);
                
                // Fetch competition statistics if available
                try {
                    const statsResponse = await axios.get(`${API_BASE_URL}/competitions/${competitionId}/stats`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (statsResponse.data.success) {
                        setStats(statsResponse.data.data);
                    }
                } catch (statsError) {
                    console.error('Error fetching competition stats:', statsError);
                    // Set default empty stats
                    setStats({
                        totalParticipants: 0,
                        completedCount: 0,
                        inProgressCount: 0,
                        participants: []
                    });
                }
            } else {
                setError('Failed to load competition details');
            }
        } catch (err) {
            console.error('Error fetching competition details:', err);
            setError('Failed to load competition details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';

        try {
            return format(new Date(dateString), 'MMM d, yyyy HH:mm');
        } catch (err) {
            return 'Invalid date';
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: '16px' }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Competition Details</Typography>
                    <IconButton onClick={onClose} size="small">
                        <Close fontSize="small" />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box sx={{ py: 2 }}>
                        <Typography color="error" align="center">{error}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Button variant="outlined" onClick={fetchCompetitionDetails}>
                                Try Again
                            </Button>
                        </Box>
                    </Box>
                ) : competition ? (
                    <Box>
                        {/* Competition Header */}
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h5" fontWeight="bold">
                                            {competition.competitionName}
                                        </Typography>
                                        <Chip
                                            label={competition.isLive ? 'Live' : 'Draft'}
                                            color={competition.isLive ? 'success' : 'default'}
                                            size="small"
                                            sx={{ borderRadius: '4px', fontWeight: 500, ml: 1 }}
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Competition ID: {competition.id}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Person fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            Created by: <strong>{competition.creator?.name || 'Unknown Creator'}</strong>
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTime fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            Last updated: <strong>{formatDate(competition.lastSaved)}</strong>
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Alarm fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            Starts on: <strong>{formatDate(competition.startTiming)}</strong>
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Grade fontSize="small" color="action" />
                                        <Typography variant="body2">
                                            Questions: <strong>{competition.questions ? competition.questions.length : 0}</strong>
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Tabs for Different Sections */}
                        <Box>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                variant="scrollable"
                                scrollButtons="auto"
                                sx={{
                                    '& .MuiTab-root': {
                                        textTransform: 'none',
                                        minWidth: 100,
                                    },
                                    borderBottom: 1,
                                    borderColor: 'divider'
                                }}
                            >
                                <Tab label="Overview" />
                                <Tab label="Questions" />
                                <Tab label="Participants" />
                                {competition.previousCompetition && <Tab label="Results" />}
                            </Tabs>

                            {/* Overview Tab */}
                            <TabPanel value={tabValue} index={0}>
                                <Grid container spacing={3}>
                                    {/* Competition Stats */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" sx={{ mb: 2 }}>
                                            Statistics
                                        </Typography>
                                        {stats ? (
                                            <Grid container spacing={2}>
                                                <Grid item xs={6} sm={3}>
                                                    <Card variant="outlined" sx={{ borderRadius: '8px' }}>
                                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                                Participants
                                                            </Typography>
                                                            <Typography variant="h4" color="primary.main" fontWeight="bold">
                                                                {stats.totalParticipants}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Card variant="outlined" sx={{ borderRadius: '8px' }}>
                                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                                Completed
                                                            </Typography>
                                                            <Typography variant="h4" color="success.main" fontWeight="bold">
                                                                {stats.completedCount}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Card variant="outlined" sx={{ borderRadius: '8px' }}>
                                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                                In Progress
                                                            </Typography>
                                                            <Typography variant="h4" color="warning.main" fontWeight="bold">
                                                                {stats.inProgressCount}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                                <Grid item xs={6} sm={3}>
                                                    <Card variant="outlined" sx={{ borderRadius: '8px' }}>
                                                        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                                Completion Rate
                                                            </Typography>
                                                            <Typography variant="h4" color="info.main" fontWeight="bold">
                                                                {stats.totalParticipants > 0
                                                                    ? `${Math.round((stats.completedCount / stats.totalParticipants) * 100)}%`
                                                                    : '0%'}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                No statistics available yet.
                                            </Typography>
                                        )}
                                    </Grid>

                                    {/* Competition Status */}
                                    <Grid item xs={12} md={6}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: '8px',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                            }}
                                        >
                                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                                Competition Status
                                            </Typography>
                                            <List dense disablePadding>
                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemText
                                                        primary="Status"
                                                        secondary={competition.isLive ? 'Live' : 'Draft'}
                                                    />
                                                    <Chip
                                                        label={competition.isLive ? 'Live' : 'Draft'}
                                                        color={competition.isLive ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </ListItem>
                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemText
                                                        primary="Type"
                                                        secondary={competition.previousCompetition ? 'Archived' : 'Current'}
                                                    />
                                                </ListItem>
                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemText
                                                        primary="Start Time"
                                                        secondary={formatDate(competition.startTiming)}
                                                    />
                                                </ListItem>
                                                <ListItem sx={{ px: 0 }}>
                                                    <ListItemText
                                                        primary="Last Updated"
                                                        secondary={formatDate(competition.lastSaved)}
                                                    />
                                                </ListItem>
                                            </List>
                                        </Paper>
                                    </Grid>

                                    {/* Creator Info */}
                                    <Grid item xs={12} md={6}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: '8px',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                            }}
                                        >
                                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                                Creator Information
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: 'secondary.main',
                                                        width: 56,
                                                        height: 56
                                                    }}
                                                >
                                                    <School />
                                                </Avatar>
                                                <Box sx={{ ml: 2 }}>
                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                        {competition.creator?.name || 'Unknown Creator'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {competition.creator?.email || 'No email available'}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        Teacher ID: {competition.creator?.id || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Grid>

                                    {/* Winner Info (if applicable) */}
                                    {competition.previousCompetition && (
                                        <Grid item xs={12}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '8px',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <EmojiEvents color="warning" sx={{ mr: 1 }} />
                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                        Competition Results
                                                    </Typography>
                                                </Box>

                                                {competition.winners.winner ? (
                                                    <Grid container spacing={2}>
                                                        {/* Winner */}
                                                        <Grid item xs={12} sm={4}>
                                                            <Box
                                                                sx={{
                                                                    p: 2,
                                                                    textAlign: 'center',
                                                                    bgcolor: 'warning.main',
                                                                    color: 'warning.contrastText',
                                                                    borderRadius: '8px',
                                                                }}
                                                            >
                                                                <Typography variant="body2" fontWeight="bold">
                                                                    Winner
                                                                </Typography>
                                                                <Avatar
                                                                    sx={{ width: 60, height: 60, mx: 'auto', my: 1, bgcolor: 'warning.light' }}
                                                                >
                                                                    <EmojiEvents />
                                                                </Avatar>
                                                                <Typography variant="subtitle1" fontWeight="medium">
                                                                    {competition.winners.winner.name}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ display: 'block' }}>
                                                                    {competition.winners.winner.email}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>

                                                        {/* Runner Up */}
                                                        {competition.winners.runnerUp && (
                                                            <Grid item xs={12} sm={4}>
                                                                <Box
                                                                    sx={{
                                                                        p: 2,
                                                                        textAlign: 'center',
                                                                        bgcolor: 'grey.300',
                                                                        color: 'text.primary',
                                                                        borderRadius: '8px',
                                                                    }}
                                                                >
                                                                    <Typography variant="body2" fontWeight="bold">
                                                                        Runner Up
                                                                    </Typography>
                                                                    <Avatar
                                                                        sx={{ width: 50, height: 50, mx: 'auto', my: 1, bgcolor: 'grey.400' }}
                                                                    >
                                                                        <EmojiEvents />
                                                                    </Avatar>
                                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                                        {competition.winners.runnerUp.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ display: 'block' }}>
                                                                        {competition.winners.runnerUp.email}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        )}

                                                        {/* Second Runner Up */}
                                                        {competition.winners.secondRunnerUp && (
                                                            <Grid item xs={12} sm={4}>
                                                                <Box
                                                                    sx={{
                                                                        p: 2,
                                                                        textAlign: 'center',
                                                                        bgcolor: 'orange.100',
                                                                        color: 'text.primary',
                                                                        borderRadius: '8px',
                                                                    }}
                                                                >
                                                                    <Typography variant="body2" fontWeight="bold">
                                                                        Second Runner Up
                                                                    </Typography>
                                                                    <Avatar
                                                                        sx={{ width: 40, height: 40, mx: 'auto', my: 1, bgcolor: 'orange.200' }}
                                                                    >
                                                                        <EmojiEvents />
                                                                    </Avatar>
                                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                                        {competition.winners.secondRunnerUp.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" sx={{ display: 'block' }}>
                                                                        {competition.winners.secondRunnerUp.email}
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                                                        No winners have been declared yet.
                                                    </Typography>
                                                )}
                                            </Paper>
                                        </Grid>
                                    )}
                                </Grid>
                            </TabPanel>

                            {/* Rounds Tab */}
                            <TabPanel value={tabValue} index={1}>
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Competition Questions
                                    </Typography>

                                    {competition.questions && competition.questions.length > 0 ? (
                                        competition.questions.map((question, index) => (
                                            <Paper
                                                key={index}
                                                elevation={0}
                                                sx={{
                                                    mb: 3,
                                                    p: 3,
                                                    borderRadius: '8px',
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                    <Box>
                                                        <Typography variant="h6">
                                                            Question {index + 1}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Divider sx={{ mb: 2 }} />

                                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                                    {question.question}
                                                </Typography>

                                                {competition.competitionType !== 'CODE' && (
                                                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                                        Answer: {question.answer}
                                                    </Typography>
                                                )}

                                                {competition.competitionType === 'MCQ' && question.options && question.options.length > 0 && (
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                            Options:
                                                        </Typography>
                                                        <Grid container spacing={1}>
                                                            {question.options.map((option, optionIndex) => (
                                                                <Grid item xs={12} sm={6} key={optionIndex}>
                                                                    <Box
                                                                        sx={{
                                                                            p: 1,
                                                                            borderRadius: '4px',
                                                                            bgcolor: option === question.answer ? 'success.light' : 'background.paper',
                                                                            border: '1px solid',
                                                                            borderColor: option === question.answer ? 'success.main' : 'divider',
                                                                            display: 'flex',
                                                                            alignItems: 'center'
                                                                        }}
                                                                    >
                                                                        {option === question.answer && (
                                                                            <Check
                                                                                sx={{
                                                                                    color: 'success.main',
                                                                                    mr: 1,
                                                                                    fontSize: '0.875rem'
                                                                                }}
                                                                            />
                                                                        )}
                                                                        <Typography variant="body2">
                                                                            {option}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </Box>
                                                )}
                                            </Paper>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No questions have been defined for this competition.
                                        </Typography>
                                    )}
                                </Box>
                            </TabPanel>

                            {/* Participants Tab */}
                            <TabPanel value={tabValue} index={2}>
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Participants
                                    </Typography>

                                    {stats && stats.participants && stats.participants.length > 0 ? (
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: '8px',
                                                        overflow: 'hidden',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                    }}
                                                >
                                                    <List>
                                                        {stats.participants.map((participant, index) => (
                                                            <React.Fragment key={participant._id || index}>
                                                                <ListItem
                                                                    secondaryAction={
                                                                        <Button
                                                                            size="small"
                                                                            endIcon={<ArrowForward />}
                                                                            sx={{
                                                                                textTransform: 'none',
                                                                                borderRadius: '8px'
                                                                            }}
                                                                        >
                                                                            View Progress
                                                                        </Button>
                                                                    }
                                                                >
                                                                    <ListItemAvatar>
                                                                        <Avatar>
                                                                            {participant.name?.charAt(0) || '?'}
                                                                        </Avatar>
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={participant.name || 'Unknown'}
                                                                        secondary={
                                                                            <Box component="span">
                                                                                {participant.email || 'No email'} • Grade {participant.grade || 'N/A'} • {participant.school || 'N/A'}
                                                                            </Box>
                                                                        }
                                                                    />
                                                                </ListItem>
                                                                {index < stats.participants.length - 1 && <Divider />}
                                                            </React.Fragment>
                                                        ))}
                                                    </List>
                                                </Paper>
                                            </Grid>
                                        </Grid>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No participants have registered for this competition yet.
                                        </Typography>
                                    )}
                                </Box>
                            </TabPanel>

                            {/* Results Tab */}
                            {competition.previousCompetition && (
                                <TabPanel value={tabValue} index={3}>
                                    <Box>
                                        <Typography variant="h6" gutterBottom>
                                            Competition Results
                                        </Typography>

                                        {competition.winners.winner ? (
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            p: 3,
                                                            borderRadius: '8px',
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            height: '100%'
                                                        }}
                                                    >
                                                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                                            Winners
                                                        </Typography>
                                                        <List>
                                                            <ListItem>
                                                                <ListItemAvatar>
                                                                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                                                                        <EmojiEvents />
                                                                    </Avatar>
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={competition.winners.winner.name}
                                                                    secondary={competition.winners.winner.email}
                                                                />
                                                            </ListItem>

                                                            {competition.winners.runnerUp && (
                                                                <ListItem>
                                                                    <ListItemAvatar>
                                                                        <Avatar sx={{ bgcolor: 'grey.400' }}>
                                                                            <EmojiEvents />
                                                                        </Avatar>
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={competition.winners.runnerUp.name}
                                                                        secondary={competition.winners.runnerUp.email}
                                                                    />
                                                                </ListItem>
                                                            )}

                                                            {competition.winners.secondRunnerUp && (
                                                                <ListItem>
                                                                    <ListItemAvatar>
                                                                        <Avatar sx={{ bgcolor: 'orange.200' }}>
                                                                            <EmojiEvents />
                                                                        </Avatar>
                                                                    </ListItemAvatar>
                                                                    <ListItemText
                                                                        primary={competition.winners.secondRunnerUp.name}
                                                                        secondary={competition.winners.secondRunnerUp.email}
                                                                    />
                                                                </ListItem>
                                                            )}
                                                        </List>
                                                    </Paper>
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            p: 3,
                                                            borderRadius: '8px',
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            height: '100%'
                                                        }}
                                                    >
                                                        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                                            Competition Summary
                                                        </Typography>
                                                        <List dense>
                                                            <ListItem>
                                                                <ListItemText
                                                                    primary="Total Participants"
                                                                    secondary={stats ? stats.totalParticipants : 'N/A'}
                                                                />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemText
                                                                    primary="Completion Rate"
                                                                    secondary={
                                                                        stats && stats.totalParticipants > 0
                                                                            ? `${Math.round((stats.completedCount / stats.totalParticipants) * 100)}%`
                                                                            : 'N/A'
                                                                    }
                                                                />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemText
                                                                    primary="Competition Date"
                                                                    secondary={formatDate(competition.startTiming)}
                                                                />
                                                            </ListItem>
                                                            <ListItem>
                                                                <ListItemText
                                                                    primary="Total Rounds"
                                                                    secondary={competition.rounds.length}
                                                                />
                                                            </ListItem>
                                                        </List>
                                                    </Paper>
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Results have not been published yet for this competition.
                                            </Typography>
                                        )}
                                    </Box>
                                </TabPanel>
                            )}
                        </Box>
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary" align="center">
                        No competition data found.
                    </Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    sx={{ borderRadius: '8px' }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CompetitionDetail;
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Tabs,
    Tab,
    Avatar,
    Tooltip,
    CircularProgress,
    LinearProgress,
    Divider,
    Chip,
    Alert,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    useTheme
} from '@mui/material';
import {
    EmojiEvents as EmojiEventsIcon,
    School as SchoolIcon,
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
    Check as CheckIcon,
    DoNotDisturb as DoNotDisturbIcon
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// import NoDataIllustration from '../../../components/NoDataIllustration';

// Current date and time
const CURRENT_DATE_TIME = "2025-05-30 17:00:25";
const CURRENT_USER = "VanshSharmaSDECreate";

// Helper component for student result row
const StudentResultRow = ({ student, index, onSelectWinner }) => {
    const theme = useTheme();

    return (
        <TableRow hover>
            <TableCell>
                <Typography variant="body2">{index + 1}</Typography>
            </TableCell>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                        src={student.student?.image}
                        alt={student.student?.name}
                        sx={{ width: 36, height: 36 }}
                    >
                        {student.student?.name?.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" fontWeight="medium">
                            {student.student?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {student.student?.email}
                        </Typography>
                    </Box>
                </Box>
            </TableCell>
            <TableCell>
                <Typography variant="body2">{student.student?.grade || 'N/A'}</Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2">{student.student?.school || 'N/A'}</Typography>
            </TableCell>
            <TableCell align="center">
                <Typography variant="body2" fontWeight="medium">
                    {student.roundsCompleted}/{student.totalRounds}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1 }}>
                        <CircularProgress
                            variant="determinate"
                            value={student.scorePercentage || 0}
                            size={38}
                            thickness={4}
                            sx={{
                                color: student.scorePercentage >= 80
                                    ? 'success.main'
                                    : student.scorePercentage >= 50
                                        ? 'warning.main'
                                        : 'error.main'
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
                            <Typography
                                variant="caption"
                                component="div"
                                fontWeight="bold"
                            >
                                {`${Math.round(student.scorePercentage || 0)}%`}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                        {student.totalScore}/{student.maxPossibleScore}
                    </Typography>
                </Box>
            </TableCell>
            <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: '8px' }}
                        component={Link}
                        to={`student/${student.studentId}`}
                    >
                        Details
                    </Button>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={() => onSelectWinner(student.studentId, student.student?.name)}
                        sx={{
                            borderRadius: '8px',
                            bgcolor: theme.palette.mode === 'dark' ? 'amber.800' : 'warning.main',
                            '&:hover': {
                                bgcolor: theme.palette.mode === 'dark' ? 'amber.700' : 'warning.dark',
                            }
                        }}
                    >
                        <EmojiEventsIcon sx={{ fontSize: '1.25rem' }} />
                    </Button>
                </Box>
            </TableCell>
        </TableRow>
    );
};

// Results Card Component
const ResultsCard = ({ title, subtitle, position, student, onRemove, color }) => {
    const theme = useTheme();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: '16px',
                border: '2px solid',
                borderColor: student ? `${color}.main` : 'divider',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                bgcolor: student ? `${color}.${theme.palette.mode === 'dark' ? '900' : '50'}` : 'transparent',
                transition: 'all 0.3s ease'
            }}
        >
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
                {title}
            </Typography>
            <Typography variant="caption" color="text.secondary" gutterBottom>
                {subtitle}
            </Typography>

            {student ? (
                <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
                    <Avatar
                        src={student.image}
                        alt={student.name}
                        sx={{
                            width: 80,
                            height: 80,
                            mx: 'auto',
                            mb: 2,
                            border: '3px solid',
                            borderColor: `${color}.main`
                        }}
                    >
                        {student.name.charAt(0)}
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {student.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        {student.email}
                    </Typography>

                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={onRemove}
                        startIcon={<DoNotDisturbIcon />}
                        sx={{ mt: 1, borderRadius: '8px' }}
                    >
                        Remove
                    </Button>
                </Box>
            ) : (
                <Box
                    sx={{
                        width: '100%',
                        mt: 2,
                        py: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px dashed',
                        borderColor: 'divider',
                        borderRadius: '8px'
                    }}
                >
                    <EmojiEventsIcon
                        sx={{
                            fontSize: '3rem',
                            color: 'text.disabled',
                            mb: 1
                        }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        No student selected
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Select a student from the results table
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

const ResultsPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();

    // Tab state
    const [tabValue, setTabValue] = useState(0);

    // Competition data and results
    const [competition, setCompetition] = useState(null);
    const [results, setResults] = useState([]);
    const [stats, setStats] = useState(null);

    // Winners state
    const [winners, setWinners] = useState({
        winner: null,
        runnerUp: null,
        secondRunnerUp: null
    });

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // UI state
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [winnerDialogOpen, setWinnerDialogOpen] = useState(false);
    const [selectedWinner, setSelectedWinner] = useState({ id: null, name: null, position: null });

    // Notification state
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        type: 'success'
    });

    // Fetch competition results
    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('userToken');

                const response = await axios.get(`/api/teacher/competitions/${id}/results`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    // Set competition data
                    setCompetition(response.data.data.competition);

                    // Set results
                    setResults(response.data.data.results);

                    // Set statistics
                    setStats(response.data.data.stats);

                    // Set winners if they exist
                    if (response.data.data?.topPerformers?.length > 0) {
                        // Set existing winners if available in the competition
                        const competitionData = response.data.data.competition;
                        const studentData = response.data.data.results;

                        if (competitionData.winner) {
                            const winnerStudent = studentData.find(student => student.studentId === competitionData.winner);
                            if (winnerStudent) {
                                setWinners(prev => ({
                                    ...prev,
                                    winner: {
                                        id: winnerStudent.studentId,
                                        name: winnerStudent.student.name,
                                        email: winnerStudent.student.email,
                                        image: winnerStudent.student.image
                                    }
                                }));
                            }
                        }

                        if (competitionData.runnerUp) {
                            const runnerUpStudent = studentData.find(student => student.studentId === competitionData.runnerUp);
                            if (runnerUpStudent) {
                                setWinners(prev => ({
                                    ...prev,
                                    runnerUp: {
                                        id: runnerUpStudent.studentId,
                                        name: runnerUpStudent.student.name,
                                        email: runnerUpStudent.student.email,
                                        image: runnerUpStudent.student.image
                                    }
                                }));
                            }
                        }

                        if (competitionData.secondRunnerUp) {
                            const secondRunnerUpStudent = studentData.find(student => student.studentId === competitionData.secondRunnerUp);
                            if (secondRunnerUpStudent) {
                                setWinners(prev => ({
                                    ...prev,
                                    secondRunnerUp: {
                                        id: secondRunnerUpStudent.studentId,
                                        name: secondRunnerUpStudent.student.name,
                                        email: secondRunnerUpStudent.student.email,
                                        image: secondRunnerUpStudent.student.image
                                    }
                                }));
                            }
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching competition results:', err);
                setError('Failed to load competition results. Please try again.');

                // If unauthorized, redirect to login
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    localStorage.removeItem('userToken');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [id, navigate]);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle winner selection
    const handleSelectWinner = (studentId, studentName) => {
        // First determine which position is available
        let position = null;

        if (!winners.winner) {
            position = 'winner';
        } else if (!winners.runnerUp) {
            position = 'runnerUp';
        } else if (!winners.secondRunnerUp) {
            position = 'secondRunnerUp';
        } else {
            // All positions filled, show dialog to replace
            setWinnerDialogOpen(true);
            setSelectedWinner({ id: studentId, name: studentName, position: 'winner' });
            return;
        }

        if (position) {
            // Open dialog with the determined position
            setWinnerDialogOpen(true);
            setSelectedWinner({ id: studentId, name: studentName, position });
        }
    };

    // Handle confirm winner selection
    const handleConfirmWinner = () => {
        if (!selectedWinner.id || !selectedWinner.position) return;

        // Find student data
        const student = results.find(r => r.studentId === selectedWinner.id);
        if (!student) return;

        // Set winner in state
        setWinners(prev => ({
            ...prev,
            [selectedWinner.position]: {
                id: student.studentId,
                name: student.student.name,
                email: student.student.email,
                image: student.student.image
            }
        }));

        setWinnerDialogOpen(false);
    };

    // Handle remove winner
    const handleRemoveWinner = (position) => {
        setWinners(prev => ({
            ...prev,
            [position]: null
        }));
    };

    // Save winners to the competition
    const handleSaveWinners = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('userToken');

            const winnersData = {
                winner: winners.winner?.id || null,
                runnerUp: winners.runnerUp?.id || null,
                secondRunnerUp: winners.secondRunnerUp?.id || null
            };

            const response = await axios.put(`/api/teacher/competitions/${id}/winners`, winnersData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setNotification({
                    open: true,
                    message: 'Competition winners saved successfully',
                    type: 'success'
                });
            }
        } catch (err) {
            console.error('Error saving winners:', err);

            setNotification({
                open: true,
                message: err.response?.data?.message || 'Failed to save winners',
                type: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    // Close notification
    const handleCloseNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    // Render results table
    const renderResultsTable = () => {
        const displayedResults = results.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        );

        return (
            <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'background.default' }}>
                        <TableRow>
                            <TableCell width={50}>Rank</TableCell>
                            <TableCell>Student</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>School</TableCell>
                            <TableCell align="center">Rounds</TableCell>
                            <TableCell align="center">Score</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedResults.map((student, index) => (
                            <StudentResultRow
                                key={student.studentId}
                                student={student}
                                index={page * rowsPerPage + index}
                                onSelectWinner={handleSelectWinner}
                            />
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={results.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </TableContainer>
        );
    };

    // Render podium - winners section
    const renderWinners = () => (
        <Box>
            <Grid container spacing={3}>
                {/* Runner-up */}
                <Grid item xs={12} sm={4}>
                    <ResultsCard
                        title="Runner-up"
                        subtitle="2nd Place"
                        position="runnerUp"
                        student={winners.runnerUp}
                        onRemove={() => handleRemoveWinner('runnerUp')}
                        color="secondary"
                    />
                </Grid>

                {/* Winner */}
                <Grid item xs={12} sm={4}>
                    <ResultsCard
                        title="Winner"
                        subtitle="1st Place"
                        position="winner"
                        student={winners.winner}
                        onRemove={() => handleRemoveWinner('winner')}
                        color="warning"
                    />
                </Grid>

                {/* Second Runner-up */}
                <Grid item xs={12} sm={4}>
                    <ResultsCard
                        title="2nd Runner-up"
                        subtitle="3rd Place"
                        position="secondRunnerUp"
                        student={winners.secondRunnerUp}
                        onRemove={() => handleRemoveWinner('secondRunnerUp')}
                        color="info"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    onClick={handleSaveWinners}
                    disabled={saving}
                    sx={{
                        px: 4,
                        py: 1,
                        borderRadius: '8px',
                        bgcolor: 'var(--theme-color)',
                        '&:hover': {
                            bgcolor: 'var(--hover-color)'
                        }
                    }}
                >
                    {saving ? 'Saving...' : 'Save Winners & Finalize Competition'}
                </Button>
            </Box>
        </Box>
    );

    return (
        <
            
            // subtitle={competition ? competition.competitionName : ''}
            // backButton={{
            //     show: true,
            //     label: 'Back to Competitions',
            //     onClick: () => navigate('/teacher/competitions')
            // }}
        >
            <Container maxWidth="xl">
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                ) : results.length === 0 ? (
                    // <NoDataIllustration
                    //     title="No results available"
                    //     description="This competition doesn't have any participants or submissions yet"
                    //     buttonText="Back to Competitions"
                    //     buttonAction={() => navigate('/teacher/competitions')}
                    // />
                    "No Data Available"
                ) : (
                    <Box>
                        {/* Competition overview */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={8}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        height: '100%'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            Results Overview
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<DownloadIcon />}
                                            size="small"
                                            sx={{ borderRadius: '8px' }}
                                        >
                                            Export Results
                                        </Button>
                                    </Box>

                                    <Divider sx={{ mb: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={6} sm={3}>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Participants
                                                </Typography>
                                                <Typography variant="h4" fontWeight="bold" color="primary.main">
                                                    {stats?.totalStudents || 0}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={6} sm={3}>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Average Score
                                                </Typography>
                                                <Typography variant="h4" fontWeight="bold" color="secondary.main">
                                                    {stats?.averageScore || 0}%
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={6} sm={3}>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Highest Score
                                                </Typography>
                                                <Typography variant="h4" fontWeight="bold" color="success.main">
                                                    {stats?.highestScore || 0}%
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={6} sm={3}>
                                            <Box>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Completed All
                                                </Typography>
                                                <Typography variant="h4" fontWeight="bold" color="info.main">
                                                    {stats?.studentsCompletedAll || 0}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        borderRadius: '16px',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Competition Status
                                    </Typography>

                                    <Divider sx={{ mb: 2 }} />

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Status
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Chip
                                                label={competition?.isLive ? "Live" : "Draft"}
                                                color={competition?.isLive ? "success" : "default"}
                                                size="small"
                                            />
                                            <Chip
                                                label={competition?.previousCompetition ? "Archived" : "Active"}
                                                color={competition?.previousCompetition ? "secondary" : "primary"}
                                                size="small"
                                            />
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Rounds
                                        </Typography>
                                        <Typography variant="body1">
                                            {competition?.rounds?.length || 0} rounds configured
                                        </Typography>
                                    </Box>

                                    <Box sx={{ mt: 'auto' }}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={<ArrowBackIcon />}
                                            component={Link}
                                            to={`/teacher/competitions/${id}/view`}
                                            sx={{ borderRadius: '8px' }}
                                        >
                                            View Competition Details
                                        </Button>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Results Tabs */}
                        <Box sx={{ mb: 2 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderBottom: 1,
                                    borderColor: 'divider',
                                    borderRadius: '12px 12px 0 0',
                                    overflow: 'hidden'
                                }}
                            >
                                <Tabs
                                    value={tabValue}
                                    onChange={handleTabChange}
                                    variant="fullWidth"
                                >
                                    <Tab
                                        label="Results Table"
                                        icon={<SchoolIcon />}
                                        iconPosition="start"
                                    />
                                    <Tab
                                        label="Winners Selection"
                                        icon={<EmojiEventsIcon />}
                                        iconPosition="start"
                                    />
                                </Tabs>
                            </Paper>
                        </Box>

                        <Box sx={{ py: 3 }}>
                            {tabValue === 0 ? renderResultsTable() : renderWinners()}
                        </Box>
                    </Box>
                )}
            </Container>

            {/* Winner Selection Dialog */}
            <Dialog
                open={winnerDialogOpen}
                onClose={() => setWinnerDialogOpen(false)}
            >
                <DialogTitle>
                    {selectedWinner.position === 'winner'
                        ? 'Set Competition Winner'
                        : selectedWinner.position === 'runnerUp'
                            ? 'Set Runner-up'
                            : 'Set Second Runner-up'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 1 }}>
                        <Typography variant="body1" gutterBottom>
                            Are you sure you want to set <strong>{selectedWinner.name}</strong> as the{' '}
                            {selectedWinner.position === 'winner'
                                ? 'winner'
                                : selectedWinner.position === 'runnerUp'
                                    ? 'runner-up'
                                    : 'second runner-up'}?
                        </Typography>

                        {winners[selectedWinner.position] && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                This will replace the current {selectedWinner.position === 'winner'
                                    ? 'winner'
                                    : selectedWinner.position === 'runnerUp'
                                        ? 'runner-up'
                                        : 'second runner-up'}: <strong>{winners[selectedWinner.position].name}</strong>.
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setWinnerDialogOpen(false)}
                        color="inherit"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmWinner}
                        variant="contained"
                        startIcon={<CheckIcon />}
                        sx={{
                            borderRadius: '8px',
                            bgcolor: 'var(--theme-color)',
                            '&:hover': {
                                bgcolor: 'var(--hover-color)'
                            }
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification */}
            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.type}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ResultsPage;
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Grid,
  Paper,
  Alert,
  IconButton,
  Snackbar,
  Backdrop,
  Fade,
  Chip
} from '@mui/material';
import { Close, CheckCircle, GradeOutlined } from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { format } from 'date-fns';

// Import submission type components
import TextSubmissionView from './TextSubmissionView';
import McqSubmissionView from './McqSubmissionView';
import CodeSubmissionView from './CodeSubmissionView';

// API base URL
const API_BASE_URL = "http://localhost:5000/api/admin/dashboard";

function SubmissionDetails({ open, onClose, submission, competition }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [detailedSubmission, setDetailedSubmission] = useState(null);
    const [activeTab, setActiveTab] = useState(0);
    
    // State for grading
    const [gradingInProgress, setGradingInProgress] = useState(false);
    const [gradingResults, setGradingResults] = useState(null);
    const [gradingError, setGradingError] = useState(null);
    const [questionGrades, setQuestionGrades] = useState([]);
    
    // State for existing results
    const [existingResult, setExistingResult] = useState(null);
    const [checkingResults, setCheckingResults] = useState(true);
    
    // Fetch detailed submission on open
    useEffect(() => {
        if (open && submission) {
            fetchSubmissionDetails();
            checkForExistingResults();
        }
    }, [open, submission]);

    // Fetch detailed submission with answers
    const fetchSubmissionDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Make API request to get detailed submission
            const response = await axios.get(`${API_BASE_URL}/competitions/submission/${submission.submissionId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.data.success) {
                setDetailedSubmission(response.data.data);
                
                // Initialize question grades for TEXT or CODE submissions
                if (competition.type !== 'MCQ' && response.data.data.questionAnswers) {
                    const initialGrades = response.data.data.questionAnswers.map(qa => ({
                        questionId: qa.question._id,
                        isCorrect: qa.isCorrect || false,
                        studentAnswer: qa.studentAnswer,
                        questionNumber: qa.questionNumber
                    }));
                    
                    setQuestionGrades(initialGrades);
                }
            } else {
                setError('Failed to load submission details. Please try again.');
            }

        } catch (err) {
            console.error('Error fetching submission details:', err);
            setError('Failed to load submission details. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Check if this submission already has results
    const checkForExistingResults = async () => {
        try {
            setCheckingResults(true);
            
            // Call the API to get result details by submissionId
            const response = await axios.get(
                `${API_BASE_URL}/competitions/${submission.submissionId}/result-details`, 
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (response.data.success) {
                setExistingResult(response.data.data);
                setGradingResults(response.data.data.result);
            }
        } catch (err) {
            // If we get a 404, it means no results exist yet, which is fine
            if (err.response && err.response.status === 404) {
                setExistingResult(null);
            } else {
                console.error('Error checking for results:', err);
            }
        } finally {
            setCheckingResults(false);
        }
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Format date
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), 'MMM d, yyyy HH:mm');
        } catch (err) {
            return 'Invalid date';
        }
    };
    
    // Toggle question grade correct/incorrect
    const handleToggleQuestionCorrectness = (questionId, isCorrect) => {
        setQuestionGrades(prev => 
            prev.map(q => 
                q.questionId === questionId ? { ...q, isCorrect } : q
            )
        );
    };
    
    // Calculate and assign results for MCQ submission
    const handleCalculateResults = async () => {
        try {
            setGradingInProgress(true);
            setGradingError(null);
            
            const loadingToast = toast.loading('Calculating results...');
            
            const response = await axios.post(
                `${API_BASE_URL}/competitions/${submission.submissionId}/assign-results`, 
                {}, // No body needed for MCQ auto-grading
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (response.data.success) {
                setGradingResults(response.data.data);
                toast.success(response.data.data.isExisting 
                  ? 'Results were already calculated. Displaying existing results.' 
                  : 'Results calculated and assigned successfully!',
                  { id: loadingToast }
                );
                
                // After grading, fetch the full result details
                checkForExistingResults();
            } else {
                throw new Error(response.data.message || 'Failed to calculate results');
            }
        } catch (err) {
            console.error('Error calculating results:', err);
            setGradingError(err.response?.data?.message || err.message || 'An error occurred while calculating results');
            toast.error('Failed to calculate results. Please try again.');
        } finally {
            setGradingInProgress(false);
        }
    };
    
    // Submit grades for TEXT or CODE submission
    const handleSubmitGrades = async () => {
        try {
            setGradingInProgress(true);
            setGradingError(null);
            
            const loadingToast = toast.loading('Submitting grades...');
            
            const response = await axios.post(
                `${API_BASE_URL}/competitions/${submission.submissionId}/grade-text-or-code-submission`,
                { questionScores: questionGrades },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            
            if (response.data.success) {
                setGradingResults(response.data.data);
                toast.success('Submission graded successfully!', { id: loadingToast });
                
                // After grading, fetch the full result details
                checkForExistingResults();
            } else {
                throw new Error(response.data.message || 'Failed to submit grades');
            }
        } catch (err) {
            console.error('Error submitting grades:', err);
            setGradingError(err.response?.data?.message || err.message || 'An error occurred while submitting grades');
            toast.error('Failed to submit grades. Please try again.');
        } finally {
            setGradingInProgress(false);
        }
    };
    
    // Close notification
    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };
    
    // Reset grading state when closing dialog
    const handleDialogClose = () => {
        setGradingResults(null);
        setGradingError(null);
        setQuestionGrades([]);
        setExistingResult(null);
        onClose();
    };

    // Render appropriate submission view based on competition type
    const renderSubmissionContent = () => {
        if (!detailedSubmission) return null;

        switch (competition.type) {
            case 'TEXT':
                return <TextSubmissionView 
                    submission={detailedSubmission}
                    onToggleCorrectness={handleToggleQuestionCorrectness}
                    questionGrades={questionGrades}
                    gradingMode={!existingResult && !gradingResults}
                    resultDetails={existingResult}
                />;
            case 'MCQ':
                return <McqSubmissionView 
                    submission={detailedSubmission} 
                    gradingResults={gradingResults}
                    resultDetails={existingResult}
                />;
            case 'CODE':
                return <CodeSubmissionView 
                    submission={detailedSubmission}
                    onToggleCorrectness={handleToggleQuestionCorrectness}
                    questionGrades={questionGrades}
                    gradingMode={!existingResult && !gradingResults}
                    resultDetails={existingResult}
                />;
            default:
                return (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        Unknown competition type: {competition.type}
                    </Alert>
                );
        }
    };
    
    // Render grading results summary
    const renderGradingResults = () => {
        // Use existing result data if available, otherwise use grading results
        const resultData = existingResult?.result || gradingResults;
        
        if (!resultData) return null;
        
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    bgcolor: 'success.light',
                    color: 'success.contrastText',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'success.main',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckCircle sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                        Grading Complete
                    </Typography>
                </Box>
                
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2" fontWeight="medium">
                            Score: {resultData.totalScore} / {existingResult?.competition?.totalQuestions || '?'}
                        </Typography>
                        <Typography variant="body2">
                            Percentage: {resultData.percentageScore}%
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body2">
                            Result ID: {resultData._id && resultData._id.substring(0, 8)}...
                        </Typography>
                        <Typography variant="body2">
                            Graded: {resultData.scoreAssignedTime ? formatDate(resultData.scoreAssignedTime) : 'Just now'}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        );
    };

    // Determine if we can grade this submission
    const canGradeSubmission = () => {
        // If we already have results, we can't grade again
        if (existingResult || gradingResults) return false;
        
        // Can't grade if we don't have detailed submission data
        if (!detailedSubmission) return false;
        
        // Can't grade if we're still loading
        if (loading || checkingResults) return false;
        
        // Can grade MCQ automatically
        if (competition.type === 'MCQ') return true;
        
        // For TEXT and CODE, check if we have answers to grade
        if (competition.type === 'TEXT' || competition.type === 'CODE') {
            return detailedSubmission.questionAnswers && 
                   detailedSubmission.questionAnswers.length > 0;
        }
        
        return false;
    };
    
    // Show loading state while checking for results
    if ((loading || checkingResults) && !error) {
        return (
            <Dialog
                open={open}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    <Typography variant="h6">Loading Submission Details</Typography>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress sx={{ mb: 2 }} />
                        <Typography>Please wait...</Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
            aria-labelledby="submission-details-dialog-title"
        >
            <DialogTitle id="submission-details-dialog-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6">Submission Details</Typography>
                    {(existingResult || gradingResults) && (
                        <Chip 
                            icon={<GradeOutlined />} 
                            label="Graded" 
                            color="success" 
                            size="small" 
                            sx={{ ml: 1 }}
                        />
                    )}
                </Box>
                <IconButton edge="end" onClick={handleDialogClose} aria-label="close">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {error ? (
                    <Alert severity="error">{error}</Alert>
                ) : detailedSubmission ? (
                    <Box sx={{ mt: 1 }}>
                        {/* Grading Results (if available) */}
                        {renderGradingResults()}
                    
                        {/* Grading Button (if applicable) */}
                        {canGradeSubmission() && (
                            <Box sx={{ 
                                mb: 3, 
                                display: 'flex', 
                                justifyContent: 'center',
                                position: 'sticky',
                                top: 0,
                                zIndex: 10,
                                pt: 1,
                                pb: 1,
                                bgcolor: theme => theme.palette.background.paper,
                                borderRadius: 1,
                                borderBottom: '1px solid',
                                borderColor: 'divider'
                            }}>
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    disabled={gradingInProgress}
                                    onClick={competition.type === 'MCQ' ? handleCalculateResults : handleSubmitGrades}
                                    startIcon={gradingInProgress && <CircularProgress size={20} color="inherit" />}
                                    sx={{ 
                                        minWidth: 200,
                                        bgcolor: 'var(--theme-color)',
                                        '&:hover': {
                                            bgcolor: 'var(--hover-color)'
                                        }
                                    }}
                                >
                                    {gradingInProgress
                                        ? 'Processing...'
                                        : competition.type === 'MCQ'
                                            ? 'Calculate Results'
                                            : 'Submit Grades'}
                                </Button>
                            </Box>
                        )}

                        {/* Grading Error (if any) */}
                        {gradingError && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {gradingError}
                            </Alert>
                        )}

                        {/* Student & Submission Info */}
                        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Student</Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {existingResult?.student?.name || 
                                             detailedSubmission.student?.name || 
                                             submission.student.name}
                                        </Typography>
                                        <Typography variant="body2">
                                            {existingResult?.student?.email || 
                                             detailedSubmission.student?.email || 
                                             submission.student.email}
                                        </Typography>
                                        {existingResult?.student?.grade && existingResult.student.grade !== 'N/A' && (
                                            <Typography variant="body2">
                                                Grade: {existingResult.student.grade}
                                            </Typography>
                                        )}
                                        {existingResult?.student?.school && existingResult.student.school !== 'N/A' && (
                                            <Typography variant="body2">
                                                School: {existingResult.student.school}
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Submission Info</Typography>
                                        <Typography variant="body2">
                                            Time: {formatDate(detailedSubmission.submission?.submissionTime || submission.submissionTime)}
                                        </Typography>
                                        <Typography variant="body2">
                                            Status: {submission.answeredAll ? 'Complete' : 'Incomplete'} 
                                            ({submission.answers}/{submission.questions} questions answered)
                                        </Typography>
                                        
                                        {detailedSubmission.performance && 
                                         detailedSubmission.performance.score !== 'N/A' && (
                                            <>
                                                <Typography variant="body2">
                                                    Score: {detailedSubmission.performance.score}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Time Spent: {detailedSubmission.performance.timeSpent}
                                                </Typography>
                                            </>
                                        )}
                                        
                                        {(existingResult || gradingResults) && (
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main', mt: 1 }}>
                                                This submission has been graded
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Submission Content */}
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                            <Tabs value={activeTab} onChange={handleTabChange} aria-label="submission tabs">
                                <Tab label="Answers" />
                                <Tab label="Raw Data" />
                            </Tabs>
                        </Box>

                        <Box hidden={activeTab !== 0}>
                            {renderSubmissionContent()}
                        </Box>

                        <Box hidden={activeTab !== 1} sx={{ mt: 2 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    maxHeight: '400px',
                                    overflow: 'auto',
                                }}
                            >
                                <Tabs value={0} sx={{ mb: 2 }}>
                                    <Tab label="Submission Data" />
                                    {existingResult && <Tab label="Result Data" disabled />}
                                </Tabs>
                                <pre style={{ margin: 0, overflow: 'auto' }}>
                                    {JSON.stringify(detailedSubmission, null, 2)}
                                </pre>
                                
                                {existingResult && (
                                    <Box sx={{ mt: 3, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}>
                                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Result Data:</Typography>
                                        <pre style={{ margin: 0, overflow: 'auto' }}>
                                            {JSON.stringify(existingResult, null, 2)}
                                        </pre>
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    </Box>
                ) : (
                    <Alert severity="info">No submission data available</Alert>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleDialogClose}>Close</Button>
            </DialogActions>
            
            {/* Processing Backdrop */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={gradingInProgress}
            >
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3
                }}>
                    <CircularProgress color="primary" sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.primary">
                        {competition.type === 'MCQ' ? 'Calculating results...' : 'Submitting grades...'}
                    </Typography>
                </Box>
            </Backdrop>
            
            {/* Toast Container - Removed margin adjustment */}
            <Toaster 
                position="top-right"
                toastOptions={{
                  style: {
                    marginRight: '15px',
                    zIndex: 9999
                  },
                }}
            />
        </Dialog>
    );
}

export default SubmissionDetails;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Box, Paper, List, ListItem, ListItemIcon, ListItemText, Button, Divider, CircularProgress } from '@mui/material';
import { Error as ErrorIcon, CheckCircle as CheckCircleIcon, Dashboard as DashboardIcon, Help as HelpIcon } from '@mui/icons-material';

const CompetitionDisqualifyPage = ({ reason, competition }) => {
    const navigate = useNavigate();
    const { competitionId: urlCompetitionId } = useParams();
    const [loading, setLoading] = useState(true);
    const [disqualificationDetails, setDisqualificationDetails] = useState(null);
    const [error, setError] = useState(null);

    // Get competition ID from props, URL or location
    const competitionId = competition?._id || urlCompetitionId || window.location.pathname.split('/').pop();

    // Fetch disqualification details from API
    useEffect(() => {
        const fetchDisqualificationDetails = async () => {
            if (!competitionId) {
                setLoading(false);
                return;
            }
            try {
                // If reason is provided via props, we can skip API call
                if (!reason) {

                    const localDisqualificationStatus = localStorage.getItem(`disqualified_${competitionId}`);

                    if (localDisqualificationStatus) {
                        try {
                            const { isDisqualified, reason: localReason } = JSON.parse(localDisqualificationStatus);
                            if (isDisqualified && localReason) {
                                setDisqualificationDetails({
                                    reason: localReason,
                                    disqualifiedAt: new Date().toISOString()
                                });
                            } else {
                                setError("No disqualification details found.");
                            }
                        } catch (err) {
                            console.error('Error parsing local disqualification status:', err);
                            setError("Could not retrieve disqualification details.");
                        }
                    } else {
                        setError("No disqualification details found.");
                    }
                }
            } catch (error) {
                console.error("Error fetching disqualification details:", error);
                setError("Failed to fetch disqualification details.");
            } finally {
                setLoading(false);
            }
        };

        fetchDisqualificationDetails();
    }, [competitionId, reason]);

    // Rules violations based on reason or fetched details
    const brokenRules = reason ?
        [reason] :
        disqualificationDetails?.reason ?
            [disqualificationDetails.reason] :
            [
                "Unauthorized exit from fullscreen mode",
                "Tab switching or window minimization detected",
                "Attempt to use prohibited keyboard shortcuts"
            ];

    // Submission status information
    const submissionStatus = {
        submitted: true,
        submissionDate: disqualificationDetails?.disqualifiedAt ?
            new Date(disqualificationDetails.disqualifiedAt).toLocaleString() :
            new Date().toLocaleString(),
        submissionId: disqualificationDetails?.id || `SUB-${Date.now()}`,
        problem: disqualificationDetails?.competitionInfo?.name ||
            competition?.competitionName ||
            "Competition",
        disqualifiedOn: disqualificationDetails?.disqualifiedAt ?
            new Date(disqualificationDetails.disqualifiedAt).toLocaleString() :
            new Date().toLocaleString()
    };

    const finalReason = reason || disqualificationDetails?.reason || "Security violation detected";

    const allRules = [
        { rule: "Remain in fullscreen mode during the entire exam", broken: finalReason.includes('fullscreen') || false },
        { rule: "Do not switch tabs or minimize the browser", broken: finalReason.includes('Tab') || finalReason.includes('window') || false },
        { rule: "Do not use keyboard shortcuts (Ctrl+C, Ctrl+V, etc.)", broken: finalReason.includes('keyboard') || finalReason.includes('copy') || finalReason.includes('paste') || false },
        { rule: "Do not attempt to access developer tools", broken: finalReason.includes('developer') || false },
        { rule: "Do not use the context menu (right-click)", broken: finalReason.includes('context menu') || false },
        { rule: "Take the exam without external assistance", broken: false }
    ];

    const handleDashboardClick = () => {
        navigate('/student/dashboard');
    };

    const handleHelpClick = () => {
        navigate('/student/help');
    };

    // Show loading state
    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress size={50} />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading disqualification details...</Typography>
            </Box>
        );
    }

    // Show error state
    if (error && !finalReason) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderTop: '5px solid #F44336' }}>
                    <Box display="flex" alignItems="center" mb={3}>
                        <ErrorIcon color="error" fontSize="large" sx={{ mr: 2 }} />
                        <Typography variant="h4" component="h1" color="error">
                            Error Loading Disqualification
                        </Typography>
                    </Box>
                    <Typography variant="body1" paragraph>
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDashboardClick}
                    >
                        Return to Dashboard
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Regular disqualification page
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderTop: '5px solid #F44336' }}>
                <Box display="flex" alignItems="center" mb={3}>
                    <ErrorIcon color="error" fontSize="large" sx={{ mr: 2 }} />
                    <Typography variant="h4" component="h1" color="error">
                        Submission Disqualified
                    </Typography>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Typography variant="h5" gutterBottom>
                    Rules Violations:
                </Typography>

                <List>
                    {brokenRules.map((rule, index) => (
                        <ListItem key={index} sx={{ bgcolor: 'rgba(244, 67, 54, 0.1)', mb: 1, borderRadius: 1 }}>
                            <ListItemIcon>
                                <ErrorIcon color="error" />
                            </ListItemIcon>
                            <ListItemText primary={rule} />
                        </ListItem>
                    ))}
                </List>

                <Box my={4}>
                    <Typography variant="h5" gutterBottom>
                        Competition Rules & Regulations
                    </Typography>
                    <List>
                        {allRules.map((item, index) => (
                            <ListItem key={index} sx={{ bgcolor: item.broken ? 'rgba(244, 67, 54, 0.1)' : 'transparent' }}>
                                <ListItemIcon>
                                    {item.broken ? (
                                        <ErrorIcon color="error" />
                                    ) : (
                                        <CheckCircleIcon color="success" />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.rule}
                                    primaryTypographyProps={{
                                        fontWeight: item.broken ? 'bold' : 'regular'
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box my={4} p={3} bgcolor="rgba(0, 0, 0, 0.05)" borderRadius={1}>
                    <Typography variant="h5" gutterBottom>
                        Your Submission Status
                    </Typography>
                    <Box mt={2} display="flex" flexDirection="column" gap={1}>
                        <Typography><strong>Problem:</strong> {submissionStatus.problem}</Typography>
                        <Typography><strong>Submission ID:</strong> {submissionStatus.submissionId}</Typography>
                        <Typography><strong>Submitted on:</strong> {submissionStatus.submissionDate}</Typography>
                        <Typography><strong>Disqualified on:</strong> {submissionStatus.disqualifiedOn}</Typography>
                        <Typography sx={{ mt: 1 }}>
                            Your submission has been preserved in its current state and will not be evaluated further.
                        </Typography>
                    </Box>
                </Box>

                <Box mt={4} display="flex" gap={2} justifyContent="center">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<DashboardIcon />}
                        onClick={handleDashboardClick}
                    >
                        Go to Dashboard
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        startIcon={<HelpIcon />}
                        onClick={handleHelpClick}
                    >
                        Get Help
                    </Button>
                </Box>

                <Box mt={3} textAlign="center">
                    <Typography variant="body2" color="textSecondary">
                        If you believe this is an error, please contact the competition administrators.
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default CompetitionDisqualifyPage;

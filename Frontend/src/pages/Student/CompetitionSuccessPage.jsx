import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Divider, Button, Chip, Grid } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Dashboard as DashboardIcon, Assessment as AssessmentIcon, Celebration as CelebrationIcon } from '@mui/icons-material';

const CompetitionSuccessPage = () => {
  const navigate = useNavigate();

  // Mock data - in real application, this would come from props or a context/state
  const submissionDetails = {
    submissionId: "SUB78912345",
    problem: "Algorithm Optimization Challenge",
    submissionDate: "2023-10-15 14:30:22",
    completedIn: "1h 48m 32s",
    score: "92/100"
  };

  const handleDashboardClick = () => {
    navigate('/student/dashboard');
  };

  const handleResultsClick = () => {
    navigate('/student/results');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderTop: '5px solid #4CAF50' }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <CheckCircleIcon color="success" sx={{ fontSize: 70, mb: 2 }} />
          <Typography variant="h4" component="h1" color="success.main" textAlign="center">
            Competition Successfully Completed!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" textAlign="center" mt={1}>
            Your solution has been successfully submitted and recorded.
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box
          sx={{
            bgcolor: 'rgba(76, 175, 80, 0.1)',
            p: 3,
            borderRadius: 2,
            mb: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <CelebrationIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h5" gutterBottom textAlign="center">
            Congratulations!
          </Typography>
          <Typography variant="body1" textAlign="center">
            You have successfully completed the competition challenge.
            Your submission is now awaiting final evaluation.
          </Typography>
        </Box>

        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            Submission Details
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary">Competition</Typography>
                <Typography variant="body1" fontWeight="bold">{submissionDetails.problem}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary">Submission ID</Typography>
                <Typography variant="body1" fontWeight="bold">{submissionDetails.submissionId}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary">Submission Date</Typography>
                <Typography variant="body1">{submissionDetails.submissionDate}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary">Completed In</Typography>
                <Typography variant="body1">{submissionDetails.completedIn}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary">Preliminary Score</Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">
                  {submissionDetails.score}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box my={4}>
          <Typography variant="h5" gutterBottom>
            What's Next?
          </Typography>
          <Box mt={2} sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
            <Typography variant="body1" paragraph>
              Your submission has been recorded in its current state. Our system will now:
            </Typography>
            <ul>
              <li>
                <Typography variant="body1" paragraph>
                  Evaluate your solution against all test cases
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Check for code quality and optimization
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Compare your performance with other participants
                </Typography>
              </li>
            </ul>
            <Typography variant="body1">
              Final results will be available once all submissions have been evaluated.
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box display="flex" gap={2} justifyContent="center">
          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<AssessmentIcon />}
            onClick={handleResultsClick}
          >
            View Results
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<DashboardIcon />}
            onClick={handleDashboardClick}
          >
            Return to Dashboard
          </Button>
        </Box>

        <Box mt={3} textAlign="center">
          <Chip
            label="Don't forget to share your achievement on social media!"
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default CompetitionSuccessPage;

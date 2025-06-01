import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Paper, Grid, Chip, Divider,
  CircularProgress, Alert, Card, CardContent, List, ListItem,
  ListItemIcon, ListItemText
} from '@mui/material';
import {
  AccessTime, Timer, School, Event, EmojiEvents,
  CheckCircle, CalendarToday, Description, Category,
  Person, Leaderboard
} from '@mui/icons-material';
import dashboardService from '../../services/dashboardService';

const CompetitionDetailPage = ({ 
  currentDateTime = "2025-06-01 08:30:31", 
  currentUser = "VanshSharmaSDEAdd" 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    fetchCompetitionDetails();
  }, [id]);

  const fetchCompetitionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getCompetitionOverview(id);
      
      if (response.success) {
        console.log("Competition data:", response.data.competition);
        setCompetition(response.data.competition);
      } else {
        setError(response.message || 'Failed to load competition details');
      }
    } catch (error) {
      setError('Error loading competition details. Please try again later.');
      console.error('Error fetching competition details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCompetition = async () => {
    try {
      setJoining(true);
      setError(null);
      const response = await dashboardService.joinCompetition(id);
      
      if (response.success) {
        // Show join success message
        setJoinSuccess(true);
        
        // In the updated API, after joining we should fetch updated competition details
        await fetchCompetitionDetails();
        
        // Automatically navigate to the exam page after successful join
        setTimeout(() => {
          navigate(`/student/competitions/${id}/exam`);
        }, 1000); // Wait 1 second before redirecting to give feedback
      } else {
        setError(response.message || 'Failed to join competition');
      }
    } catch (error) {
      setError('Error joining competition. Please try again.');
      console.error('Error joining competition:', error);
    } finally {
      setJoining(false);
    }
  };

  const handleStartCompetition = () => {
    navigate(`/student/competitions/${id}/exam`);
  };

  const handleViewResults = () => {
    navigate(`/student/competitions/${id}/results`);
  };

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render difficulty badge with appropriate color
  const renderDifficultyBadge = (difficulty) => {
    const color = 
      difficulty.toLowerCase() === 'easy' ? 'success' :
      difficulty.toLowerCase() === 'medium' ? 'warning' :
      difficulty.toLowerCase() === 'hard' ? 'error' : 'default';
    
    return (
      <Chip 
        label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} 
        color={color} 
        variant="outlined" 
      />
    );
  };

  // Determine competition status and appropriate buttons
  const renderActionButtons = () => {
    if (!competition) return null;
    
    const isJoined = competition.participation?.isJoined;
    const isSubmitted = competition.participation?.isSubmitted;
    const canJoin = competition.permissions?.canJoin;
    const canSubmit = competition.permissions?.canSubmit;
    const canViewResults = competition.permissions?.canViewResults;
    const status = competition.status;
    
    return (
      <Box sx={{ mt: { xs: 2, md: 0 }, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        {/* Join Button */}
        {!isJoined && canJoin && (
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={handleJoinCompetition}
            disabled={joining}
            startIcon={joining && <CircularProgress size={20} color="inherit" />}
            fullWidth={window.innerWidth < 600}
          >
            {joining ? 'Joining...' : 'Join Competition'}
          </Button>
        )}
        
        {/* Start/Continue Competition Button */}
        {isJoined && !isSubmitted && canSubmit && (
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleStartCompetition}
            fullWidth={window.innerWidth < 600}
          >
            {status === 'active' ? 'Enter Competition' : 'Continue Competition'}
          </Button>
        )}
        
        {/* View Results Button */}
        {(isSubmitted || canViewResults) && (
          <Button 
            variant="outlined" 
            color="primary" 
            size="large"
            onClick={handleViewResults}
            startIcon={<CheckCircle />}
            fullWidth={window.innerWidth < 600}
          >
            View Results
            {competition.score?.percentage !== undefined && (
              <Chip 
                label={`${competition.score.percentage}%`} 
                color={competition.score.percentage >= 70 ? "success" : "default"} 
                size="small" 
                sx={{ ml: 1 }} 
              />
            )}
          </Button>
        )}
        
        {/* Upcoming message */}
        {status === 'upcoming' && !canJoin && (
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'info.light', px: 2, py: 1, borderRadius: 1 }}>
            <Event sx={{ mr: 1, color: 'info.main' }} />
            <Typography color="info.main" variant="body2">
              Available from {formatDateTime(competition.competitionAvailableTiming)}
            </Typography>
          </Box>
        )}
        
        {/* Ended message */}
        {status === 'ended' && !isJoined && (
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'action.disabledBackground', px: 2, py: 1, borderRadius: 1 }}>
            <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography color="text.secondary" variant="body2">
              This competition has ended
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!competition) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Competition not found
      </Alert>
    );
  }

  return (
    <Box>
      {/* Join success message */}
      {joinSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Successfully joined the competition! Redirecting to exam page...
        </Alert>
      )}
    
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4">
            {competition.competitionName}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, flexWrap: 'wrap', gap: { xs: 1, md: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <School fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Created by {competition.creatorInfo?.name || 'Unknown'}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Category fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {competition.competitionType || 'General'}
              </Typography>
            </Box>
            
            {competition.difficulty && renderDifficultyBadge(competition.difficulty)}
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Logged in as {currentUser}
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {renderActionButtons()}
      </Box>
      
      {/* Competition status banner */}
      {competition.status === 'active' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1">
              This competition is currently active
            </Typography>
            {competition.endTiming && (
              <Typography variant="subtitle1" fontWeight="bold">
                Ends at {formatDateTime(competition.endTiming)}
              </Typography>
            )}
          </Box>
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Left column with competition details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>About This Competition</Typography>
            
            {competition.description ? (
              <Typography variant="body1" paragraph>
                {competition.description}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" paragraph>
                No description provided.
              </Typography>
            )}
            
            {competition.tags && competition.tags.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Tags:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {competition.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
          
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Competition Structure</Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText 
                  primary={`${competition.totalQuestions} Questions`}
                  secondary={`Competition Type: ${competition.competitionType || 'General'}`}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Timer />
                </ListItemIcon>
                <ListItemText 
                  primary={`${competition.duration} Minutes Duration`}
                  secondary="Complete all questions within the time limit"
                />
              </ListItem>
              
              {competition.status === 'active' && (
                <ListItem>
                  <ListItemIcon>
                    <AccessTime color="error" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography color="error" fontWeight="medium">
                        Competition in Progress
                      </Typography>
                    }
                    secondary={
                      competition.endTiming ? 
                      `Ends at ${formatDateTime(competition.endTiming)}` : 
                      `${competition.duration} minutes from start`
                    }
                  />
                </ListItem>
              )}
              
              {competition.status === 'upcoming' && (
                <ListItem>
                  <ListItemIcon>
                    <Event color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography color="primary" fontWeight="medium">
                        Upcoming Competition
                      </Typography>
                    }
                    secondary={`Opens at ${formatDateTime(competition.competitionAvailableTiming)}`}
                  />
                </ListItem>
              )}
              
              {competition.status === 'ended' && (
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="text.secondary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Competition Ended"
                    secondary={`Ended at ${formatDateTime(competition.endTiming)}`}
                  />
                </ListItem>
              )}

              {/* Show ranking info if available */}
              {competition.score?.rank && (
                <ListItem>
                  <ListItemIcon>
                    <Leaderboard color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography fontWeight="medium">
                        Your Rank: #{competition.score.rank}
                      </Typography>
                    }
                    secondary={`Score: ${competition.score.totalScore}/${competition.score.maxPossibleScore}`}
                  />
                </ListItem>
              )}
            </List>
            
            {/* Call-to-action button */}
            {!competition.participation?.isJoined && competition.status !== 'ended' && competition.permissions?.canJoin && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleJoinCompetition}
                  disabled={joining}
                  startIcon={joining && <CircularProgress size={20} color="inherit" />}
                >
                  {joining ? 'Joining...' : 'Join Now'}
                </Button>
              </Box>
            )}
          </Paper>
          
          {/* Join Now prominent section */}
          {!competition.participation?.isJoined && competition.status === 'active' && competition.permissions?.canJoin && (
            <Paper elevation={3} sx={{ p: 3, mt: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ mb: { xs: 2, md: 0 } }}>
                  <Typography variant="h6">Ready to Test Your Skills?</Typography>
                  <Typography variant="body2">
                    This competition is active right now! Join now to participate.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleJoinCompetition}
                  disabled={joining}
                  sx={{ fontWeight: 'bold' }}
                >
                  Join Competition
                </Button>
              </Box>
            </Paper>
          )}
        </Grid>
        
        {/* Right column with timing and status */}
        <Grid item xs={12} md={4} >
          <Card elevation={2} >
            <CardContent >
              <Typography variant="h6" gutterBottom>Competition Status</Typography>
              <Box sx={{ p: 1 }} >
                <Chip 
                  label={competition.status.toUpperCase()}
                  color={
                    competition.status === 'active' ? 'success' :
                    competition.status === 'upcoming' ? 'primary' : 'default'
                  }
                  sx={{ px: 2, py: 2, fontSize: '1rem' }}
                  icon={
                    competition.status === 'active' ? <AccessTime /> :
                    competition.status === 'upcoming' ? <Event /> : <CheckCircle />
                  }
                />
              </Box>
              
              {competition.participation?.isJoined && (
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label="JOINED" 
                    color="success" 
                    variant="outlined"
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Joined on {formatDateTime(competition.participation.joinedOn)}
                  </Typography>
                </Box>
              )}
              
              {competition.participation?.isSubmitted && (
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label="SUBMITTED" 
                    color="info" 
                    variant="outlined"
                    size="small"
                  />
                </Box>
              )}
              
              {/* Display time information */}
              {competition.timeInfo && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">
                    {competition.timeInfo.type === 'startsIn' && 'Starting in:'}
                    {competition.timeInfo.type === 'endsIn' && 'Ending in:'}
                    {competition.timeInfo.type === 'ended' && 'Competition has ended'}
                  </Typography>
                  
                  {(competition.timeInfo.type === 'startsIn' || competition.timeInfo.type === 'endsIn') && (
                    <Typography variant="h6" color={competition.timeInfo.type === 'endsIn' ? 'error.main' : 'text.primary'}>
                      {competition.timeInfo.formattedTime}
                    </Typography>
                  )}
                </Box>
              )}
              
              {/* Current time display */}
              <Box sx={{ mt: 3, p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Time:
                </Typography>
                <Typography variant="body1">
                  {formatDateTime(currentDateTime)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Timeline</Typography>
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CalendarToday fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Available From" 
                    secondary={formatDateTime(competition.competitionAvailableTiming)} 
                  />
                </ListItem>
                
                <Divider sx={{ my: 1 }} />
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Event fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Deadline" 
                    secondary={formatDateTime(competition.endTiming)} 
                  />
                </ListItem>
                
                <Divider sx={{ my: 1 }} />
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Timer fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Duration" 
                    secondary={`${competition.duration} minutes`} 
                  />
                </ListItem>
              </List>
              
              {/* Join button in timeline card */}
              {!competition.participation?.isJoined && competition.permissions?.canJoin && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleJoinCompetition}
                    disabled={joining}
                    fullWidth
                    startIcon={joining && <CircularProgress size={20} color="inherit" />}
                  >
                    {joining ? 'Joining...' : 'Join Competition'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
          
          {/* Display score card if available */}
          {competition.score && (
            <Card elevation={2} sx={{ mt: 3, bgcolor: 'success.light' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Your Score</Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                  <Box sx={{ 
                    width: 100, 
                    height: 100, 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: 'white'
                  }}>
                    <Typography variant="h4" color={
                      competition.score.percentage >= 70 ? 'success.main' :
                      competition.score.percentage >= 50 ? 'warning.main' : 'error.main'
                    }>
                      {competition.score.percentage}%
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" align="center">
                  Score: {competition.score.totalScore}/{competition.score.maxPossibleScore}
                </Typography>
                
                {competition.score.rank && (
                  <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                    Rank: #{competition.score.rank}
                  </Typography>
                )}
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleViewResults}
                  >
                    View Detailed Results
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompetitionDetailPage;
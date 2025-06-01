import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Grid, Typography, Button, Tabs, Tab, Card, CardContent,
  CardActions, Chip, CircularProgress, Pagination, Alert, Stack
} from '@mui/material';
import { AccessTime, School, CheckCircle, Timer } from '@mui/icons-material';
import dashboardService from '../../services/dashboardService';

const CompetitionPage = ({ 
  activeOnly = false, 
  completedOnly = false,
  resultsView = false
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState([]);
  const [filter, setFilter] = useState(
    completedOnly ? 'joined' : activeOnly ? 'active' : 'all'
  );
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompetitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page, activeOnly, completedOnly]);

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Define query parameters based on filters
      const params = {
        page,
        limit: 10,
        status: filter === 'all' ? '' : filter === 'new' ? 'new' : 'joined'
      };
      
      // Add competition status filter if activeOnly or completedOnly
      if (activeOnly) {
        params.competitionStatus = 'active';
      } else if (completedOnly) {
        params.competitionStatus = 'ended';
      }
      
      const response = await dashboardService.getAvailableCompetitions(params);
      
      if (response.success) {
        setCompetitions(response.data.competitions);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to load competitions');
      }
    } catch (error) {
      setError('Error loading competitions. Please try again later.');
      console.error('Error fetching competitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event, newValue) => {
    setFilter(newValue);
    setPage(1); // Reset to first page when filter changes
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleCompetitionClick = (competition) => {
    if (resultsView) {
      navigate(`/student/results/${competition._id}`);
    } else {
      navigate(`/student/competitions/${competition._id}`);
    }
  };

  // Render difficulty badge with appropriate color
  const renderDifficultyBadge = (difficulty) => {
    const color = 
      difficulty === 'easy' ? 'success' :
      difficulty === 'medium' ? 'warning' :
      difficulty === 'hard' ? 'error' : 'default';
    
    return (
      <Chip 
        size="small" 
        label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} 
        color={color} 
        variant="outlined" 
        sx={{ ml: 1 }}
      />
    );
  };

  // Format countdown or time remaining
  const renderTimeStatus = (timeStatus) => {
    if (!timeStatus) return null;
    
    const { type, formattedTime } = timeStatus;
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        {type === 'startsIn' && (
          <>
            <AccessTime fontSize="small" color="primary" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="primary">
              Starts in {formattedTime}
            </Typography>
          </>
        )}
        {type === 'endsIn' && (
          <>
            <Timer fontSize="small" color="error" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="error">
              Ends in {formattedTime}
            </Typography>
          </>
        )}
        {type === 'ended' && (
          <>
            <CheckCircle fontSize="small" color="text.secondary" sx={{ mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              Ended
            </Typography>
          </>
        )}
      </Box>
    );
  };

  // Render competition card
  const renderCompetitionCard = (competition) => {
    const isJoined = competition.participation?.isJoined;
    const isCompleted = competition.participation?.completed;
    const isSubmitted = competition.participation?.submissionStatus === 'submitted';
    const isActive = competition.competitionStatus === 'active';
    const isEnded = competition.competitionStatus === 'ended';
    const isUpcoming = competition.competitionStatus === 'upcoming';
    
    return (
      <Card 
        elevation={3} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" gutterBottom>
              {competition.competitionName}
              {renderDifficultyBadge(competition.difficulty)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <School fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {competition.creatorInfo.name}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Questions: {competition.totalQuestions} · Duration: {competition.duration} mins
          </Typography>
          
          {competition.tags && competition.tags.length > 0 && (
            <Box sx={{ mb: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {competition.tags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small"
                  sx={{ fontSize: '0.7rem' }}
                />
              ))}
            </Box>
          )}
          
          {renderTimeStatus(competition.timeStatus)}
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
          {isEnded && isSubmitted && (
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => handleCompetitionClick(competition)}
            >
              View Results
            </Button>
          )}
          
          {isEnded && !isSubmitted && isJoined && (
            <Typography variant="body2" color="error">
              Not submitted
            </Typography>
          )}
          
          {isActive && isJoined && !isCompleted && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleCompetitionClick(competition)}
            >
              Continue
            </Button>
          )}
          
          {isActive && !isJoined && (
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => handleCompetitionClick(competition)}
            >
              View Details
            </Button>
          )}
          
          {isActive && isJoined && isCompleted && !isSubmitted && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => handleCompetitionClick(competition)}
            >
              Submit
            </Button>
          )}
          
          {isUpcoming && (
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => handleCompetitionClick(competition)}
            >
              View Details
            </Button>
          )}
        </CardActions>
      </Card>
    );
  };

  // Generate page title based on props
  const getPageTitle = () => {
    if (resultsView) return "Competition Results";
    if (activeOnly) return "Active Competitions";
    if (completedOnly) return "Completed Competitions";
    return "Available Competitions";
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {getPageTitle()}
      </Typography>
      
      {!resultsView && !completedOnly && (
        <Tabs
          value={filter}
          onChange={handleFilterChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 3 }}
        >
          <Tab value="all" label="All Competitions" />
          <Tab value="joined" label="Joined" />
          <Tab value="new" label="New" />
        </Tabs>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : competitions.length === 0 ? (
        <Alert severity="info">
          No competitions found.
        </Alert>
      ) : (
        <React.Fragment>
          <Grid container spacing={3}>
            {competitions.map((competition) => (
              <Grid item xs={12} sm={6} md={4} key={competition._id}>
                {renderCompetitionCard(competition)}
              </Grid>
            ))}
          </Grid>
          
          {pagination.pages > 1 && (
            <Stack alignItems="center" sx={{ mt: 4 }}>
              <Pagination 
                count={pagination.pages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          )}
        </React.Fragment>
      )}
    </Box>
  );
};

export default CompetitionPage;
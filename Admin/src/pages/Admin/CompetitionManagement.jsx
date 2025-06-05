import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Tooltip,
  CircularProgress,
  useTheme,
  LinearProgress
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  MoreVert,
  Edit,
  Delete,
  ContentCopy,
  Archive,
  Visibility,
  PlayArrow,
  Pause,
  Refresh,
  EmojiEvents,
  History,
  AutoAwesome
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

// Import competition management components
import CompetitionForm from './CompetitionForm';
import CompetitionDetail from './CompetitionDetail';
import CompetitionDeleteDialog from './CompetitionDeleteDialog';
// Import the new AI Competition Creator component
import AICompetitionCreator from './AICompetitionCreator';

// API base URL
const API_BASE_URL = "http://localhost:5000/api/admin/dashboard";

const CompetitionManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // State for competitions list
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCompetitions, setTotalCompetitions] = useState(0);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  
  // Action menu state
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  
  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Add new state for AI competition creator dialog
  const [aiCreatorOpen, setAiCreatorOpen] = useState(false);
  
  // Fetch competitions on component mount and when filters change
  useEffect(() => {
    fetchCompetitions();
  }, [page, rowsPerPage, searchTerm, statusFilter, timeFilter]);
  
  // Fetch competitions with filtering and pagination
  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page + 1, // API uses 1-indexed pages
        limit: rowsPerPage,
      });
      
      if (searchTerm) {
        params.append('name', searchTerm);
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      // Apply time filter
      if (timeFilter === 'past') {
        params.append('isPrevious', 'true');
      } else if (timeFilter === 'current') {
        params.append('isPrevious', 'false');
      }
      
      // Make API request
      const response = await axios.get(`${API_BASE_URL}/competitions?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setCompetitions(response.data.data.competitions);
        setTotalCompetitions(response.data.data.pagination.total);
      } else {
        setError('Failed to load competitions. Please try again.');
      }
      
    } catch (err) {
      console.error('Error fetching competitions:', err);
      setError('Failed to load competitions. Please try again.');
    } finally {
      setLoading(false);
    }
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
  
  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(0);
  };
  
  // Handle time filter change
  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
    setPage(0);
  };
  
  // Handle filter menu open
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };
  
  // Handle filter menu close
  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null);
  };
  
  // Handle action menu open - modified to remove activation status
  const handleActionMenuOpen = (event, competition) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedCompetition(competition);
  };
  
  // Handle action menu close
  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
  };
  
  // Handle competition creation
  const handleCreateCompetition = () => {
    setIsCreating(true);
    setSelectedCompetition(null);
    setFormDialogOpen(true);
  };
  
  // Check if competition is expired (now based on status or end time)
  const isCompetitionExpired = (competition) => {
    // If status is explicitly set, use it
    if (competition.status) {
      return competition.status === 'ended';
    }
    
    // Check if endTiming has passed
    if (competition.endTiming) {
      return new Date(competition.endTiming) < new Date();
    }
    
    return false;
  };
  
  // Update canEditCompetition to use status and end time
  const canEditCompetition = (competition) => {
    // Check status field first
    if (competition.status) {
      return competition.status !== 'ended';
    }
    
    // Check if endTiming has passed
    if (competition.endTiming && new Date(competition.endTiming) < new Date()) {
      return false;
    }
    
    return true; // Can edit if no status is set and end time hasn't passed
  };
  
  // Handle competition edit - updated to no longer check activation timing
  const handleEditCompetition = async () => {
    if (!canEditCompetition(selectedCompetition)) {
      showNotification('This competition has ended and cannot be edited', 'error');
      handleActionMenuClose();
      return;
    }

    try {
      setLoading(true);
      // Fetch the full competition details before editing
      const response = await axios.get(
        `${API_BASE_URL}/competitions/${selectedCompetition._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        // Use the detailed competition data for editing
        setSelectedCompetition(response.data.data.competition);
        setIsCreating(false);
        setFormDialogOpen(true);
      } else {
        throw new Error(response.data.message || 'Failed to load competition details');
      }
    } catch (err) {
      console.error('Error loading competition details:', err);
      showNotification(err.response?.data?.message || err.message || 'Failed to load competition details', 'error');
    } finally {
      setLoading(false);
      handleActionMenuClose();
    }
  };
  
  // Handle competition view
  const handleViewCompetition = () => {
    setDetailDialogOpen(true);
    handleActionMenuClose();
  };
  
  // Handle competition delete
  const handleDeleteCompetition = () => {
    setDeleteDialogOpen(true);
    handleActionMenuClose();
  };
  
  // Handle competition clone
  const handleCloneCompetition = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${API_BASE_URL}/competitions/${selectedCompetition._id}/clone`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        // Show success notification
        showNotification(`Competition "${selectedCompetition.competitionName}" cloned successfully`);
        
        // Refresh the competitions list
        fetchCompetitions();
      } else {
        throw new Error(response.data.message || 'Failed to clone competition');
      }
      
      handleActionMenuClose();
    } catch (err) {
      console.error('Error cloning competition:', err);
      showNotification(err.response?.data?.message || err.message || 'Failed to clone competition', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle competition toggle status
  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      
      const response = await axios.put(
        `${API_BASE_URL}/competitions/${selectedCompetition._id}/toggle-status`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        // Update the competition in the local state
        const newStatus = response.data.data.isLive;
        setCompetitions(competitions.map(comp => 
          comp._id === selectedCompetition._id ? { ...comp, isLive: newStatus } : comp
        ));
        
        // Show success notification
        const statusText = newStatus ? 'live' : 'draft';
        showNotification(`Competition set to ${statusText} mode successfully`);
      } else {
        throw new Error(response.data.message || 'Failed to update competition status');
      }
      
      handleActionMenuClose();
    } catch (err) {
      console.error('Error toggling competition status:', err);
      showNotification(err.response?.data?.message || err.message || 'Failed to update competition status', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle competition archive/unarchive
  const handleArchiveCompetition = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post(
        `${API_BASE_URL}/competitions/${selectedCompetition._id}/archive`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        // Update the competition in the local state
        const isCurrentlyArchived = selectedCompetition.previousCompetition;
        setCompetitions(competitions.map(comp => 
          comp._id === selectedCompetition._id ? 
            { 
              ...comp, 
              previousCompetition: !isCurrentlyArchived, 
              isLive: isCurrentlyArchived // Make it live again if unarchiving
            } : comp
        ));
        
        // Show success notification
        showNotification(isCurrentlyArchived 
            ? `Competition "${selectedCompetition.competitionName}" unarchived successfully` 
            : `Competition "${selectedCompetition.competitionName}" archived successfully`
        );
      } else {
        throw new Error(response.data.message || 'Failed to update archive status');
      }
      
      handleActionMenuClose();
    } catch (err) {
      console.error('Error updating archive status:', err);
      showNotification(err.response?.data?.message || err.message || 'Failed to update archive status', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle competition form submit
  const handleCompetitionFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      let response;
      
      if (isCreating) {
        // Create new competition
        response = await axios.post(
          `${API_BASE_URL}/competitions`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          showNotification('Competition created successfully');
        }
      } else {
        // Update existing competition
        response = await axios.put(
          `${API_BASE_URL}/competitions/${selectedCompetition._id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          showNotification('Competition updated successfully');
        }
      }
      
      // Refresh the competitions list
      fetchCompetitions();
      
      setFormDialogOpen(false);
    } catch (err) {
      console.error('Error saving competition:', err);
      showNotification(err.response?.data?.message || err.message || 'Failed to save competition', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle competition deletion
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      
      const response = await axios.delete(
        `${API_BASE_URL}/competitions/${selectedCompetition._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        setDeleteDialogOpen(false);
        
        // Show success notification
        showNotification(`Competition "${selectedCompetition.competitionName}" deleted successfully`);
        
        // Refresh the competitions list
        fetchCompetitions();
      } else {
        throw new Error(response.data.message || 'Failed to delete competition');
      }
    } catch (err) {
      console.error('Error deleting competition:', err);
      showNotification(err.response?.data?.message || err.message || 'Failed to delete competition', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle opening AI competition creator
  const handleOpenAICreator = () => {
    setAiCreatorOpen(true);
  };
  
  // Handle AI-generated competition submission
  const handleAICompetitionSubmit = async (generatedCompetition) => {
    try {
      setLoading(true);
      
      // Create new competition with AI-generated data
      const response = await axios.post(
        `${API_BASE_URL}/competitions`,
        generatedCompetition,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        showNotification('AI-generated competition created successfully');
        
        // Refresh the competitions list
        fetchCompetitions();
        setAiCreatorOpen(false);
      } else {
        throw new Error(response.data.message || 'Failed to create AI competition');
      }
    } catch (err) {
      console.error('Error creating AI competition:', err);
      showNotification(err.response?.data?.message || err.message || 'Failed to create AI competition', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch (err) {
      return 'Invalid date';
    }
  };
  
  return (
    <Box>
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
      
      {/* Page header - modify button layout */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Competition Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateCompetition}
            sx={{ 
              borderRadius: '8px',
              bgcolor: 'var(--theme-color)',
              '&:hover': {
                bgcolor: 'var(--hover-color)'
              }
            }}
          >
            Create Competition
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AutoAwesome />}
            onClick={handleOpenAICreator}
            sx={{ 
              borderRadius: '8px',
            }}
          >
            Create by AI
          </Button>
        </Box>
      </Box>
      
      {/* Filters and search */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <TextField
          placeholder="Search competitions..."
          value={searchTerm}
          onChange={handleSearchChange}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            sx: { borderRadius: '8px' }
          }}
          sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 'auto' } }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={handleFilterMenuOpen}
            size="medium"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
            }}
          >
            Filter
            {(statusFilter !== 'all' || timeFilter !== 'all') && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}
              >
                {(statusFilter !== 'all' ? 1 : 0) + (timeFilter !== 'all' ? 1 : 0)}
              </Box>
            )}
          </Button>
          
          <Menu
            anchorEl={filterMenuAnchorEl}
            open={Boolean(filterMenuAnchorEl)}
            onClose={handleFilterMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: { 
                width: 220,
                p: 1,
                mt: 0.5,
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Status
            </Typography>
            <MenuItem selected={statusFilter === 'all'} onClick={() => handleStatusFilterChange('all')}>
              All Status
            </MenuItem>
            <MenuItem selected={statusFilter === 'live'} onClick={() => handleStatusFilterChange('live')}>
              Live
            </MenuItem>
            <MenuItem selected={statusFilter === 'draft'} onClick={() => handleStatusFilterChange('draft')}>
              Draft
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Time
            </Typography>
            <MenuItem selected={timeFilter === 'all'} onClick={() => handleTimeFilterChange('all')}>
              All Time
            </MenuItem>
            <MenuItem selected={timeFilter === 'current'} onClick={() => handleTimeFilterChange('current')}>
              Current Competitions
            </MenuItem>
            <MenuItem selected={timeFilter === 'past'} onClick={() => handleTimeFilterChange('past')}>
              Past Competitions
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
              <Button
                size="small"
                onClick={() => {
                  handleStatusFilterChange('all');
                  handleTimeFilterChange('all');
                  handleFilterMenuClose();
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Menu>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchCompetitions}
            size="medium"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
            }}
          >
            Refresh
          </Button>
        </Box>
      </Paper>
      
      {/* Competitions table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {loading && (
          <Box sx={{ width: '100%' }}>
            <LinearProgress />
          </Box>
        )}
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Competition Name</TableCell>
                <TableCell>Live Status</TableCell>
                <TableCell>Active Status</TableCell>
                <TableCell>Creator</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {competitions.length > 0 ? (
                competitions.map((competition) => {
                  const isExpired = isCompetitionExpired(competition);
                  return (
                    <TableRow 
                      key={competition._id}
                      hover
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        // Add slight background for expired competitions
                        ...(isExpired && { 
                          bgcolor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(0, 0, 0, 0.02)' 
                        })
                      }}
                    >
                      <TableCell>{competition.id}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {competition.competitionName}
                        </Typography>
                        {competition.hasWinner && (
                          <Chip
                            icon={<EmojiEvents sx={{ fontSize: '0.75rem !important' }} />}
                            label="Has Winners"
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ ml: 1, height: 24 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={competition.isLive ? 'Live' : 'Draft'}
                          color={competition.isLive ? 'success' : 'default'}
                          size="small"
                          sx={{ borderRadius: '4px', fontWeight: 500 }}
                        />
                        {competition.previousCompetition && (
                          <Chip
                            icon={<History sx={{ fontSize: '0.75rem !important' }} />}
                            label="Archived"
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ ml: 1, height: 24 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {competition.status && (
                          <Chip
                            label={competition.status}
                            color={
                              competition.status === 'active' ? 'success' :
                              competition.status === 'upcoming' ? 'info' :
                              competition.status === 'ended' ? 'error' : 'default'
                            }
                            size="small"
                            sx={{ borderRadius: '4px', fontWeight: 500 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>{competition.creatorName}</TableCell>
                      <TableCell>
                        <Chip
                          label={competition.competitionType}
                          color={
                            competition.competitionType === 'TEXT' ? 'primary' :
                            competition.competitionType === 'MCQ' ? 'secondary' : 
                            'warning'
                          }
                          size="small"
                          sx={{ borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell>{competition.duration} mins</TableCell>
                      <TableCell>{formatDate(competition.startTiming)}</TableCell>
                      <TableCell>{formatDate(competition.endTiming)}</TableCell>
                      <TableCell>{formatDate(competition.lastSaved)}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Actions">
                          <IconButton
                            aria-label="actions"
                            onClick={(e) => handleActionMenuOpen(e, competition)}
                            size="small"
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    {loading ? (
                      <Typography variant="body2" color="text.secondary">
                        Loading competitions...
                      </Typography>
                    ) : error ? (
                      <Typography variant="body2" color="error">
                        {error}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No competitions found. Try adjusting your search or filters.
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCompetitions}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Action Menu - conditionally show options based on competition status */}
      <Menu
        anchorEl={actionMenuAnchorEl}
        open={Boolean(actionMenuAnchorEl)}
        onClose={handleActionMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleViewCompetition}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        
        {/* Only show Edit for non-archived competitions that aren't ended */}
        {selectedCompetition && 
          !selectedCompetition.previousCompetition && 
          (!selectedCompetition.status || selectedCompetition.status !== 'ended') && (
          <MenuItem onClick={handleEditCompetition}>
            <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
          </MenuItem>
        )}
        
        {/* Only show status toggle for non-archived competitions that aren't ended */}
        {selectedCompetition && 
          !selectedCompetition.previousCompetition && 
          (!selectedCompetition.status || selectedCompetition.status !== 'ended') && (
          <MenuItem onClick={handleToggleStatus}>
            {selectedCompetition?.isLive ? (
              <>
                <Pause fontSize="small" sx={{ mr: 1 }} /> Set to Draft
              </>
            ) : (
              <>
                <PlayArrow fontSize="small" sx={{ mr: 1 }} /> Set to Live
              </>
            )}
          </MenuItem>
        )}
        
        {/* Clone option for non-expired competitions */}
        {selectedCompetition && !selectedCompetition.isExpired && (
          <MenuItem onClick={handleCloneCompetition}>
            <ContentCopy fontSize="small" sx={{ mr: 1 }} /> Clone
          </MenuItem>
        )}
        
        {/* Archive/Unarchive option - toggle based on current archive status */}
        {selectedCompetition && (
          <MenuItem onClick={handleArchiveCompetition}>
            {selectedCompetition.previousCompetition ? (
              <>
                <Archive fontSize="small" sx={{ mr: 1, transform: 'rotate(180deg)' }} /> Unarchive
              </>
            ) : (
              /* Only show Archive for non-expired competitions */
              !selectedCompetition.isExpired && (
                <>
                  <Archive fontSize="small" sx={{ mr: 1 }} /> Archive
                </>
              )
            )}
          </MenuItem>
        )}
        
        <Divider />
        <MenuItem onClick={handleDeleteCompetition} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
      
      {/* Competition Form Dialog */}
      <CompetitionForm
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        onSubmit={handleCompetitionFormSubmit}
        competition={isCreating ? null : selectedCompetition}
        isCreating={isCreating}
      />
      
      {/* Competition Detail Dialog */}
      <CompetitionDetail 
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        competitionId={selectedCompetition?._id}
      />
      
      {/* Delete Confirmation Dialog */}
      <CompetitionDeleteDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        competition={selectedCompetition}
        loading={loading}
      />
      
      {/* AI Competition Creator Dialog */}
      <AICompetitionCreator
        open={aiCreatorOpen}
        onClose={() => setAiCreatorOpen(false)}
        onSubmit={handleAICompetitionSubmit}
      />
    </Box>
  );
};

export default CompetitionManagement;
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
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  History
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';

// Import competition management components
import CompetitionForm from './CompetitionForm';
import CompetitionDetail from './CompetitionDetail';
import CompetitionDeleteDialog from './CompetitionDeleteDialog';

// API base URL
const API_BASE_URL = "http://localhost:5000/api/teacher/dashboard";

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
  
  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    message: ''
  });
  
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
      
      // Make API request with auth token
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/competitions?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
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
  
  // Handle action menu open
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
  
  // Handle competition edit
  const handleEditCompetition = async () => {
    try {
      setLoading(true);
      // Fetch the full competition details before editing
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/competitions/${selectedCompetition._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
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
      setNotification({
        open: true,
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to load competition details'
      });
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
        setNotification({
          open: true,
          type: 'success',
          message: `Competition "${selectedCompetition.competitionName}" cloned successfully`
        });
        
        // Refresh the competitions list
        fetchCompetitions();
      } else {
        throw new Error(response.data.message || 'Failed to clone competition');
      }
      
      handleActionMenuClose();
    } catch (err) {
      console.error('Error cloning competition:', err);
      setNotification({
        open: true,
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to clone competition'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle competition toggle status
  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post(
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
        setNotification({
          open: true,
          type: 'success',
          message: `Competition set to ${statusText} mode successfully`
        });
      } else {
        throw new Error(response.data.message || 'Failed to update competition status');
      }
      
      handleActionMenuClose();
    } catch (err) {
      console.error('Error toggling competition status:', err);
      setNotification({
        open: true,
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to update competition status'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle competition archive
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
        setCompetitions(competitions.map(comp => 
          comp._id === selectedCompetition._id ? 
            { ...comp, previousCompetition: true, isLive: false } : comp
        ));
        
        // Show success notification
        setNotification({
          open: true,
          type: 'success',
          message: `Competition "${selectedCompetition.competitionName}" archived successfully`
        });
      } else {
        throw new Error(response.data.message || 'Failed to archive competition');
      }
      
      handleActionMenuClose();
    } catch (err) {
      console.error('Error archiving competition:', err);
      setNotification({
        open: true,
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to archive competition'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle competition form submit
  const handleCompetitionFormSubmit = async (formData) => {
    try {
      setLoading(true);
      
      // Prepare the data in the format expected by the API
      const competitionData = {
        competitionName: formData.competitionName,
        competitionType: formData.competitionType,
        duration: formData.duration,
        startTiming: formData.startTiming,
        isLive: formData.isLive,
        questions: formData.questions.map(q => ({
          question: q.question,
          answer: q.answer || "",
          options: q.options || []
        }))
      };
      
      const token = localStorage.getItem('token');
      let response;
      
      if (isCreating) {
        // Create new competition
        response = await axios.post(
          `${API_BASE_URL}/competitions`,
          competitionData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          setNotification({
            open: true,
            type: 'success',
            message: 'Competition created successfully'
          });
        }
      } else {
        // Update existing competition
        response = await axios.put(
          `${API_BASE_URL}/competitions/${selectedCompetition._id}`,
          competitionData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (response.data.success) {
          setNotification({
            open: true,
            type: 'success',
            message: 'Competition updated successfully'
          });
        }
      }
      
      // Refresh the competitions list
      fetchCompetitions();
      
      setFormDialogOpen(false);
    } catch (err) {
      console.error('Error saving competition:', err);
      setNotification({
        open: true,
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to save competition'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle competition deletion
  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `${API_BASE_URL}/competitions/${selectedCompetition._id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setDeleteDialogOpen(false);
        
        // Show success notification
        setNotification({
          open: true,
          type: 'success',
          message: `Competition "${selectedCompetition.competitionName}" deleted successfully`
        });
        
        // Refresh the competitions list
        fetchCompetitions();
      } else {
        throw new Error(response.data.message || 'Failed to delete competition');
      }
    } catch (err) {
      console.error('Error deleting competition:', err);
      setNotification({
        open: true,
        type: 'error',
        message: err.response?.data?.message || err.message || 'Failed to delete competition'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
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
      {/* Page header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Competition Management
        </Typography>
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
                <TableCell>Status</TableCell>
                <TableCell>Creator</TableCell>
                <TableCell>Rounds</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {competitions.length > 0 ? (
                competitions.map((competition) => (
                  <TableRow 
                    key={competition._id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
                    <TableCell>{competition.creatorName}</TableCell>
                    <TableCell>{competition.roundsCount}</TableCell>
                    <TableCell>{formatDate(competition.startTiming)}</TableCell>
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
                ))
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
      
      {/* Action Menu */}
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
        <MenuItem onClick={handleEditCompetition}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        {selectedCompetition && !selectedCompetition.previousCompetition && (
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
        <MenuItem onClick={handleCloneCompetition}>
          <ContentCopy fontSize="small" sx={{ mr: 1 }} /> Clone
        </MenuItem>
        {selectedCompetition && !selectedCompetition.previousCompetition && (
          <MenuItem onClick={handleArchiveCompetition}>
            <Archive fontSize="small" sx={{ mr: 1 }} /> Archive
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
      
      {/* Notifications */}
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
    </Box>
  );
};

export default CompetitionManagement;
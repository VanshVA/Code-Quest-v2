import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TablePagination,
  Tooltip,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Rating,
  Divider,
  FormControl,
  InputLabel,
  Select,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress,
  Skeleton,
  Stack,
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Delete,
  Refresh,
  Visibility,
  Email,
  PersonOutline,
  DateRange,
  Warning,
  Cancel,
  InsertComment,
  Category,
  Source,
  Star,
  StarBorder,
  Check,
  Close,
} from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';

// API base URL
const API_BASE_URL = "http://localhost:5000/api/admin/dashboard";

// Current date and time
const CURRENT_DATE_TIME = new Date().toISOString();

const FeedbackPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // State variables
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [feedbackStats, setFeedbackStats] = useState(null);

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams({
        page: page + 1, // API uses 1-indexed pages
        limit: rowsPerPage
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (typeFilter !== 'all') {
        params.append('type', typeFilter);
      }

      if (sourceFilter !== 'all') {
        params.append('source', sourceFilter);
      }

      if (ratingFilter) {
        params.append('minRating', ratingFilter);
      }

      if (startDate && endDate) {
        params.append('startDate', startDate.toISOString());
        params.append('endDate', endDate.toISOString());
      }

      // Make API call
      const response = await axios.get(`${API_BASE_URL}/feedback?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setFeedbacks(response.data.data.feedback);
        setTotalFeedbacks(response.data.data.pagination.total);
      } else {
        setError('Failed to load feedbacks');
        console.error('API error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Failed to load feedbacks. Please try again.');

      // Show error with toast
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedback statistics
  const fetchFeedbackStats = async () => {
    try {
      setStatsLoading(true);

      const response = await axios.get(`${API_BASE_URL}/feedback/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setFeedbackStats(response.data.data.stats);
      } else {
        console.error('Failed to load feedback statistics');
      }
    } catch (error) {
      console.error('Error fetching feedback statistics:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Load feedbacks on initial render and when filters change
  useEffect(() => {
    fetchFeedbacks();
  }, [page, rowsPerPage, searchTerm, typeFilter, sourceFilter, ratingFilter, startDate, endDate]);

  // Load statistics on initial render
  useEffect(() => {
    fetchFeedbackStats();
  }, []);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when search changes
  };

  // Handle feedback type filter change
  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  // Handle source filter change
  const handleSourceFilterChange = (event) => {
    setSourceFilter(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  // Handle rating filter change
  const handleRatingFilterChange = (event) => {
    setRatingFilter(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  // Handle date range filter change
  const handleDateRangeChange = (type, value) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    setPage(0); // Reset to first page when filter changes
  };

  // Reset all filters
  const handleResetFilters = () => {
    setTypeFilter('all');
    setSourceFilter('all');
    setRatingFilter('');
    setStartDate(null);
    setEndDate(null);
    setSearchTerm('');
    setPage(0);
    setFilterMenuAnchorEl(null);
  };

  // Handle opening action menu
  const handleOpenActionMenu = (event, feedback) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedFeedback(feedback);
  };

  // Handle closing action menu
  const handleCloseActionMenu = () => {
    setActionMenuAnchorEl(null);
  };

  // Handle opening filter menu
  const handleOpenFilterMenu = (event) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };

  // Handle closing filter menu
  const handleCloseFilterMenu = () => {
    setFilterMenuAnchorEl(null);
  };

  // Handle view feedback details
  const handleViewFeedbackDetails = () => {
    setDetailDialogOpen(true);
    handleCloseActionMenu();
  };

  // Handle delete feedback action
  const handleDeleteFeedback = () => {
    setDeleteDialogOpen(true);
    handleCloseActionMenu();
  };

  // Get feedback by ID
  const getFeedbackById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/feedback/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setSelectedFeedback(response.data.data.feedback);
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to load feedback details',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching feedback details:', error);
      setSnackbar({
        open: true,
        message: `Error: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle feedback deletion
  const handleFeedbackDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/feedback/${selectedFeedback._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Feedback deleted successfully');

        setDeleteDialogOpen(false);
        fetchFeedbacks(); // Refresh the feedback list
        fetchFeedbackStats(); // Refresh the statistics
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error(error.response?.data?.message || 'Failed to delete feedback');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Get feedback type display properties
  const getFeedbackTypeDisplay = (type) => {
    switch (type?.toLowerCase()) {
      case 'bug':
        return { label: 'Bug', color: 'error' };
      case 'feature':
        return { label: 'Feature Request', color: 'secondary' };
      case 'general':
        return { label: 'General', color: 'primary' };
      case 'improvement':
        return { label: 'Improvement', color: 'info' };
      case 'support':
        return { label: 'Support', color: 'warning' };
      default:
        return { label: type || 'Unknown', color: 'default' };
    }
  };

  // Get feedback source display properties
  const getFeedbackSourceDisplay = (source) => {
    switch (source?.toLowerCase()) {
      case 'website':
        return { label: 'Website', color: 'primary' };
      case 'app':
        return { label: 'Mobile App', color: 'secondary' };
      case 'email':
        return { label: 'Email', color: 'info' };
      case 'phone':
        return { label: 'Phone', color: 'success' };
      default:
        return { label: source || 'Unknown', color: 'default' };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM dd, yyyy hh:mm a');
  };

  // Close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Calculate active filters count (for filter badge)
  const getActiveFiltersCount = () => {
    let count = 0;
    if (typeFilter !== 'all') count++;
    if (sourceFilter !== 'all') count++;
    if (ratingFilter) count++;
    if (startDate && endDate) count++;
    return count;
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
      
      {/* Page header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h5" fontWeight="bold">
          Feedback Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            fetchFeedbacks();
            fetchFeedbackStats();
          }}
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
          }}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ mb: 4 }}>
        {statsLoading ? (
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '16px' }} />
              </Grid>
            ))}
          </Grid>
        ) : feedbackStats ? (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: '16px', height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Total Feedback
                  </Typography>
                  <Typography variant="h4" color="primary.main" fontWeight="bold">
                    {feedbackStats.totalCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feedbackStats.recentCount} in last 30 days
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: '16px', height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Average Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {feedbackStats.averageRating ? feedbackStats.averageRating.toFixed(1) : 'N/A'}
                    </Typography>
                    <Rating 
                      value={feedbackStats.averageRating || 0} 
                      precision={0.5} 
                      readOnly 
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    From {feedbackStats.ratedFeedbackCount || 0} rated submissions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: '16px', height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Top Feedback Type
                  </Typography>
                  <Typography variant="h5" color="secondary.main" fontWeight="bold">
                    {feedbackStats.topFeedbackType || 'General'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feedbackStats.topFeedbackTypeCount || 0} submissions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined" sx={{ borderRadius: '16px', height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Contact Consent
                  </Typography>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {feedbackStats.contactConsentCount || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Users allowing follow-up contact
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info">No statistics available at this time.</Alert>
        )}
      </Box>

      {/* Search and filters */}
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
          placeholder="Search feedbacks..."
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
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={handleOpenFilterMenu}
            size="medium"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
            }}
          >
            Filters
            {getActiveFiltersCount() > 0 && (
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
                {getActiveFiltersCount()}
              </Box>
            )}
          </Button>
          <Menu
            anchorEl={filterMenuAnchorEl}
            open={Boolean(filterMenuAnchorEl)}
            onClose={handleCloseFilterMenu}
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
                width: 320,
                p: 2,
                mt: 0.5,
              }
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
              Filter Feedbacks
            </Typography>
            
            <Grid container spacing={2}>
              {/* Feedback Type Filter */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="feedback-type-filter-label">Feedback Type</InputLabel>
                  <Select
                    labelId="feedback-type-filter-label"
                    value={typeFilter}
                    label="Feedback Type"
                    onChange={handleTypeFilterChange}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="bug">Bug Report</MenuItem>
                    <MenuItem value="feature">Feature Request</MenuItem>
                    <MenuItem value="improvement">Improvement</MenuItem>
                    <MenuItem value="support">Support</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Source Filter */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="source-filter-label">Source</InputLabel>
                  <Select
                    labelId="source-filter-label"
                    value={sourceFilter}
                    label="Source"
                    onChange={handleSourceFilterChange}
                  >
                    <MenuItem value="all">All Sources</MenuItem>
                    <MenuItem value="website">Website</MenuItem>
                    <MenuItem value="app">Mobile App</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="phone">Phone</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Rating Filter */}
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel id="rating-filter-label">Minimum Rating</InputLabel>
                  <Select
                    labelId="rating-filter-label"
                    value={ratingFilter}
                    label="Minimum Rating"
                    onChange={handleRatingFilterChange}
                  >
                    <MenuItem value="">Any Rating</MenuItem>
                    <MenuItem value="1">★ and above</MenuItem>
                    <MenuItem value="2">★★ and above</MenuItem>
                    <MenuItem value="3">★★★ and above</MenuItem>
                    <MenuItem value="4">★★★★ and above</MenuItem>
                    <MenuItem value="5">★★★★★ only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Date Range Filter */}
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Date Range
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => handleDateRangeChange('start', newValue)}
                    slotProps={{ 
                      textField: { 
                        size: 'small',
                        fullWidth: true,
                        error: startDate && endDate && startDate > endDate
                      } 
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => handleDateRangeChange('end', newValue)}
                    slotProps={{ 
                      textField: { 
                        size: 'small',
                        fullWidth: true,
                        error: startDate && endDate && startDate > endDate
                      } 
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                size="small"
                onClick={handleResetFilters}
                sx={{ borderRadius: '8px' }}
              >
                Reset All
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={handleCloseFilterMenu}
                sx={{ 
                  borderRadius: '8px',
                  bgcolor: 'var(--theme-color)',
                  '&:hover': { bgcolor: 'var(--hover-color)' }
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </Menu>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchFeedbacks}
          size="medium"
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
          }}
        >
          Refresh
        </Button>
      </Paper>
      
      {/* Feedback table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {loading && <LinearProgress />}
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Submitter</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Submission Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback) => {
                  const typeInfo = getFeedbackTypeDisplay(feedback.feedbackType);
                  const sourceInfo = getFeedbackSourceDisplay(feedback.source);
                  
                  return (
                    <TableRow 
                      key={feedback._id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body2" fontWeight="medium">
                            {feedback.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {feedback.email}
                          </Typography>
                          {feedback.contactConsent && (
                            <Chip 
                              label="Contact Allowed" 
                              size="small" 
                              color="success" 
                              variant="outlined"
                              icon={<Check fontSize="small" />}
                              sx={{ mt: 0.5, height: 20, fontSize: '0.625rem', maxWidth: 'fit-content' }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={typeInfo.label} 
                          color={typeInfo.color} 
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={sourceInfo.label} 
                          color={sourceInfo.color} 
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell>
                        {feedback.ratingGeneral ? (
                          <Rating 
                            value={feedback.ratingGeneral} 
                            readOnly 
                            size="small"
                            precision={0.5} 
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Not rated
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(feedback.createdAt || feedback.submittedAt)}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Actions">
                          <IconButton
                            aria-label="actions"
                            onClick={(e) => handleOpenActionMenu(e, feedback)}
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
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    {loading ? (
                      <Typography variant="body2" color="text.secondary">
                        Loading feedbacks...
                      </Typography>
                    ) : error ? (
                      <Typography variant="body2" color="error">
                        {error}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No feedbacks found. Try adjusting your search or filters.
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalFeedbacks}
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
        onClose={handleCloseActionMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleViewFeedbackDetails}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
        <MenuItem onClick={handleDeleteFeedback} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
      
      {/* Feedback Detail Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        {selectedFeedback && (
          <>
            <DialogTitle sx={{ 
              pb: 1, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h6">
                  Feedback Details
                </Typography>
                <Chip 
                  label={getFeedbackTypeDisplay(selectedFeedback.feedbackType).label}
                  color={getFeedbackTypeDisplay(selectedFeedback.feedbackType).color}
                  size="small"
                />
              </Box>
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setDetailDialogOpen(false)}
                aria-label="close"
              >
                <Close />
              </IconButton>
            </DialogTitle>
            
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Submitter Information */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: '12px', height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonOutline />
                        Submitter Information
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Name
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedFeedback.name}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {selectedFeedback.email}
                            {selectedFeedback.contactConsent && (
                              <Chip 
                                label="Follow-up Allowed" 
                                color="success" 
                                size="small" 
                                variant="outlined"
                                sx={{ borderRadius: '8px', height: 24 }}
                              />
                            )}
                          </Typography>
                        </Box>
                        
                        {selectedFeedback.occupation && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Occupation
                            </Typography>
                            <Typography variant="body1">
                              {selectedFeedback.occupation}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Submission Details */}
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ borderRadius: '12px', height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <InsertComment />
                        Submission Details
                      </Typography>
                      
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Type
                            </Typography>
                            <Chip 
                              label={getFeedbackTypeDisplay(selectedFeedback.feedbackType).label}
                              color={getFeedbackTypeDisplay(selectedFeedback.feedbackType).color}
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                          
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Source
                            </Typography>
                            <Chip 
                              label={getFeedbackSourceDisplay(selectedFeedback.source).label}
                              color={getFeedbackSourceDisplay(selectedFeedback.source).color}
                              size="small"
                              sx={{ mt: 0.5 }}
                            />
                          </Box>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Submitted On
                          </Typography>
                          <Typography variant="body1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DateRange fontSize="small" />
                            {formatDate(selectedFeedback.createdAt || selectedFeedback.submittedAt)}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Reference ID
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedFeedback._id}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Feedback Message */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ borderRadius: '12px' }}>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                        Feedback Message
                      </Typography>
                      
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: '8px', 
                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        whiteSpace: 'pre-wrap'
                      }}>
                        <Typography variant="body1">
                          {selectedFeedback.feedback}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Ratings Section - Only show if any ratings exist */}
                {(selectedFeedback.ratingGeneral || 
                  selectedFeedback.ratingEase || 
                  selectedFeedback.ratingSupport) && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ borderRadius: '12px' }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Star />
                          User Ratings
                        </Typography>
                        
                        <Grid container spacing={2}>
                          {selectedFeedback.ratingGeneral !== undefined && (
                            <Grid item xs={12} sm={4}>
                              <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Overall Experience
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                  <Rating 
                                    value={selectedFeedback.ratingGeneral} 
                                    readOnly 
                                    precision={0.5}
                                  />
                                </Box>
                                <Typography variant="h5" color="warning.main" fontWeight="bold">
                                  {selectedFeedback.ratingGeneral.toFixed(1)}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          
                          {selectedFeedback.ratingEase !== undefined && (
                            <Grid item xs={12} sm={4}>
                              <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Ease of Use
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                  <Rating 
                                    value={selectedFeedback.ratingEase} 
                                    readOnly 
                                    precision={0.5}
                                  />
                                </Box>
                                <Typography variant="h5" color="warning.main" fontWeight="bold">
                                  {selectedFeedback.ratingEase.toFixed(1)}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                          
                          {selectedFeedback.ratingSupport !== undefined && (
                            <Grid item xs={12} sm={4}>
                              <Box sx={{ textAlign: 'center', p: 1 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Support Quality
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                                  <Rating 
                                    value={selectedFeedback.ratingSupport} 
                                    readOnly 
                                    precision={0.5}
                                  />
                                </Box>
                                <Typography variant="h5" color="warning.main" fontWeight="bold">
                                  {selectedFeedback.ratingSupport.toFixed(1)}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
                
                {/* Specific Features Section - Only show if available */}
                {selectedFeedback.specificFeatures && 
                  selectedFeedback.specificFeatures.length > 0 && (
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ borderRadius: '12px' }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                          Specific Features Mentioned
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {selectedFeedback.specificFeatures.map((feature, index) => (
                            <Chip 
                              key={index}
                              label={feature}
                              variant="outlined"
                              size="small"
                              color="primary"
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button
                onClick={() => setDetailDialogOpen(false)}
                color="primary"
                variant="outlined"
                sx={{ borderRadius: '8px' }}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setDetailDialogOpen(false);
                  setDeleteDialogOpen(true);
                }}
                variant="contained"
                color="error"
                startIcon={<Delete />}
                sx={{ borderRadius: '8px' }}
              >
                Delete Feedback
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Feedback Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={deleteLoading ? null : () => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" sx={{ fontSize: 24 }} />
          Confirm Feedback Deletion
        </DialogTitle>
        
        <DialogContent>
          {selectedFeedback && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Feedback from {selectedFeedback.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedFeedback.email}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                Submitted on: {formatDate(selectedFeedback.createdAt || selectedFeedback.submittedAt)}
              </Typography>
            </Box>
          )}
          
          <DialogContentText color="error.main">
            Are you sure you want to delete this feedback? This action cannot be undone, and all associated data will be permanently removed.
          </DialogContentText>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="inherit"
            disabled={deleteLoading}
            startIcon={<Cancel />}
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFeedbackDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
            sx={{ borderRadius: '8px' }}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Feedback'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeedbackPage;
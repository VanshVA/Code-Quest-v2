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
  Divider,
  Tooltip,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  useTheme,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Search,
  FilterList,
  MoreVert,
  Visibility,
  Refresh,
  EmojiEvents,
  History,
  Assessment,
  Download
} from '@mui/icons-material';
import { format } from 'date-fns';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // Import toast
import SubmissionDetails from './SubmissionDetails';

// API base URL
const API_BASE_URL = "http://localhost:5000/api/teacher/dashboard";

function ResultsManagement() {
  const theme = useTheme();

  // State for competitions list
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state for competitions
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCompetitions, setTotalCompetitions] = useState(0);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);

  // Selected competition and view state
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionStats, setSubmissionStats] = useState(null);

  // Pagination state for submissions
  const [submissionsPage, setSubmissionsPage] = useState(0);
  const [submissionsRowsPerPage, setSubmissionsRowsPerPage] = useState(10);

  // Submissions search with debounce
  const [submissionSearchTerm, setSubmissionSearchTerm] = useState('');
  const [debouncedSubmissionSearchTerm, setDebouncedSubmissionSearchTerm] = useState('');
  const [submissionFilterMenuAnchorEl, setSubmissionFilterMenuAnchorEl] = useState(null);
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState('all');

  // Selected submission for detailed view
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionDetailOpen, setSubmissionDetailOpen] = useState(false);

  // Action menu state
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    message: ''
  });

  // Debounce search terms
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSubmissionSearchTerm(submissionSearchTerm);
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(timerId);
    };
  }, [submissionSearchTerm]);

  // Fetch competitions on component mount and when filters change
  useEffect(() => {
    fetchCompetitions();
  }, [page, rowsPerPage, debouncedSearchTerm, statusFilter, timeFilter]);

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

      if (debouncedSearchTerm) {
        params.append('search', debouncedSearchTerm);
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

  // Fetch submissions for a selected competition
  const fetchSubmissions = async (competitionId) => {
    try {
      setSubmissionsLoading(true);
      setSubmissionError(null);

      // Make API request
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/competitions/${competitionId}/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSubmissions(response.data.data.submissions);
        setSubmissionStats(response.data.data.stats);
        setSelectedCompetition(response.data.data.competition);
      } else {
        setSubmissionError('Failed to load submissions. Please try again.');
      }

    } catch (err) {
      console.error('Error fetching submissions:', err);
      setSubmissionError('Failed to load submissions. Please try again.');
    } finally {
      setSubmissionsLoading(false);
    }
  };

  // Handle page change for competitions
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change for competitions
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle page change for submissions
  const handleSubmissionsChangePage = (event, newPage) => {
    setSubmissionsPage(newPage);
  };

  // Handle rows per page change for submissions
  const handleSubmissionsChangeRowsPerPage = (event) => {
    setSubmissionsRowsPerPage(parseInt(event.target.value, 10));
    setSubmissionsPage(0);
  };

  // Handle search input change for competitions
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle search by Enter key
  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      setDebouncedSearchTerm(searchTerm);
    }
  };

  // Handle search input change for submissions
  const handleSubmissionSearchChange = (event) => {
    setSubmissionSearchTerm(event.target.value);
  };
  
  // Handle submission search by Enter key
  const handleSubmissionSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      setDebouncedSubmissionSearchTerm(submissionSearchTerm);
    }
  };

  // Handle status filter change for competitions
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(0);
  };

  // Handle submission status filter change
  const handleSubmissionStatusFilterChange = (value) => {
    setSubmissionStatusFilter(value);
    setSubmissionsPage(0);
  };

  // Handle time filter change
  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
    setPage(0);
  };

  // Handle filter menu open for competitions
  const handleFilterMenuOpen = (event) => {
    setFilterMenuAnchorEl(event.currentTarget);
  };

  // Handle filter menu close for competitions
  const handleFilterMenuClose = () => {
    setFilterMenuAnchorEl(null);
  };

  // Handle filter menu open for submissions
  const handleSubmissionFilterMenuOpen = (event) => {
    setSubmissionFilterMenuAnchorEl(event.currentTarget);
  };

  // Handle filter menu close for submissions
  const handleSubmissionFilterMenuClose = () => {
    setSubmissionFilterMenuAnchorEl(null);
  };

  // Handle click on a competition row
  const handleCompetitionClick = (competition) => {
    fetchSubmissions(competition._id);
  };

  // Handle view submission details
  const handleViewSubmissionDetails = () => {
    setSubmissionDetailOpen(true);
    handleActionMenuClose();
  };

  // Handle action menu open
  const handleActionMenuOpen = (event, submission) => {
    event.stopPropagation();
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedSubmission(submission);
  };

  // Handle action menu close
  const handleActionMenuClose = () => {
    setActionMenuAnchorEl(null);
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

  // Fetch competitions on component mount and when filters change
  useEffect(() => {
    fetchCompetitions();
  }, [page, rowsPerPage, searchTerm, statusFilter, timeFilter]);

  // Filter submissions based on search term and status filter
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.student.name.toLowerCase().includes(debouncedSubmissionSearchTerm.toLowerCase()) ||
      (submission.student.email && submission.student.email.toLowerCase().includes(debouncedSubmissionSearchTerm.toLowerCase()));

    if (submissionStatusFilter === 'all') return matchesSearch;
    if (submissionStatusFilter === 'graded') return matchesSearch && submission.result && submission.result.isGraded;
    if (submissionStatusFilter === 'ungraded') return matchesSearch && (!submission.result || !submission.result.isGraded);

    return matchesSearch;
  });

  // Handle back button click to return to competitions list
  const handleBackToCompetitions = () => {
    setSelectedCompetition(null);
    setSubmissions([]);
    setSubmissionStats(null);
  };

  // Export submissions as CSV
  const handleExportSubmissions = () => {
    if (!submissions.length) return;

    try {
      // Create CSV header
      let csvContent = "Submission ID,Student Name,Student Email,Submission Time,Questions Answered,Total Questions,Score,Status\n";

      // Add each submission as a row
      submissions.forEach(submission => {
        const scoreInfo = submission.result
          ? `${submission.result.totalScore}/${submission.result.maxPossibleScore}`
          : 'Not graded';

        csvContent += `${submission._id},${submission.student.name},${submission.student.email || 'N/A'},${formatDate(submission.submissionDate)},${submission.answeredCount},${submission.questionCount},${scoreInfo},${submission.result?.isGraded ? 'Graded' : 'Ungraded'}\n`;
      });

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${selectedCompetition.name}_submissions.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success notification with toast
      toast.success('Submissions exported successfully', {
        duration: 3000,
        position: 'top-center',
      });

    } catch (err) {
      console.error('Error exporting submissions:', err);
      // Show error notification with toast
      toast.error('Failed to export submissions', {
        duration: 4000,
        position: 'top-center',
      });
    }
  };

  return (
    <Box>
      {/* Toast Container */}
      <Toaster position="top-center" />
      
      {/* Page header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          {selectedCompetition ? `Results: ${selectedCompetition.name}` : 'Results Management'}
        </Typography>

        {selectedCompetition && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExportSubmissions}
              disabled={!submissions.length}
              sx={{ borderRadius: '8px' }}
            >
              Export Results
            </Button>
            <Button
              variant="contained"
              onClick={handleBackToCompetitions}
              sx={{
                borderRadius: '8px',
                bgcolor: 'var(--theme-color)',
                '&:hover': {
                  bgcolor: 'var(--hover-color)'
                }
              }}
            >
              Back to Competitions
            </Button>
          </Box>
        )}
      </Box>

      {!selectedCompetition ? (
        /* Competitions View */
        <>
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
              onKeyDown={handleSearchKeyDown}
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
                    <TableCell>Type</TableCell>
                    <TableCell>Questions</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Submissions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {competitions.length > 0 ? (
                    competitions.map((competition) => {
                      const isEnded = new Date(competition.endTiming) < new Date();
                      return (
                        <TableRow
                          key={competition._id}
                          hover
                          sx={{
                            cursor: 'pointer',
                            '&:last-child td, &:last-child th': { border: 0 },
                            ...(isEnded && {
                              bgcolor: theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.02)'
                            })
                          }}
                        >
                          <TableCell>{competition.id || competition._id.substring(0, 8)}</TableCell>
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
                              label={competition.status || (isExpired ? 'ended' : 'active')}
                              color={
                                competition.status === 'active' || (!competition.status && !isExpired) ? 'success' :
                                  competition.status === 'upcoming' ? 'info' : 'error'
                              }
                              size="small"
                              sx={{ borderRadius: '4px', fontWeight: 500 }}
                            />
                          </TableCell>
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
                          <TableCell>{competition.questions?.length || '—'}</TableCell>
                          <TableCell>{formatDate(competition.startTiming)}</TableCell>
                          <TableCell>{formatDate(competition.endTiming)}</TableCell>
                          <TableCell>
                            <Chip
                              icon={<Assessment fontSize="small" />}
                              startIcon={<Assessment />}
                              label="View Results"
                              color="primary"
                              variant="outlined"
                              onClick={() => handleCompetitionClick(competition)}
                              size="small"
                            >
                            </Chip>
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
        </>
      ) : (
        /* Submissions View */
        <>
          {/* Competition Stats */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Typography variant="h6" gutterBottom>Competition Details</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Competition Type</Typography>
                    <Chip
                      label="MCQ"
                      color="secondary"
                      size="small"
                      sx={{ mt: 0.5, borderRadius: '4px' }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Questions</Typography>
                    <Typography variant="body1">{selectedCompetition.totalQuestions || '—'}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Duration</Typography>
                    <Typography variant="body1">{selectedCompetition.duration || '—'} minutes</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Period</Typography>
                    <Typography variant="body1">
                      {formatDate(selectedCompetition.startTiming)} — {formatDate(selectedCompetition.endTiming)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  border: '1px solid',
                  borderColor: 'divider',
                  height: '100%',
                }}
              >
                <Typography variant="h6" gutterBottom>Submission Statistics</Typography>
                <Divider sx={{ mb: 2 }} />
                {submissionStats ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="h3" fontWeight="bold" color="primary">
                          {submissionStats.totalSubmissions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Total Submissions</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="h3" fontWeight="bold" color="success.main">
                          {submissionStats.gradedSubmissions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Graded Submissions</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ width: '100%', mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">Grading Rate</Typography>
                          <Typography variant="body2">
                            {submissionStats.totalSubmissions > 0
                              ? Math.round((submissionStats.gradedSubmissions / submissionStats.totalSubmissions) * 100)
                              : 0}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={submissionStats.totalSubmissions > 0
                            ? (submissionStats.gradedSubmissions / submissionStats.totalSubmissions) * 100
                            : 0}
                          sx={{ height: 10, borderRadius: 5, mt: 1 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', py: 4 }}>
                    {submissionsLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Typography color="text.secondary">No statistics available</Typography>
                    )}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Submissions filters and search */}
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
              placeholder="Search by student name or email..."
              value={submissionSearchTerm}
              onChange={handleSubmissionSearchChange}
              onKeyDown={handleSubmissionSearchKeyDown}
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
                onClick={handleSubmissionFilterMenuOpen}
                size="medium"
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                }}
              >
                Filter
                {submissionStatusFilter !== 'all' && (
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
                    1
                  </Box>
                )}
              </Button>

              <Menu
                anchorEl={submissionFilterMenuAnchorEl}
                open={Boolean(submissionFilterMenuAnchorEl)}
                onClose={handleSubmissionFilterMenuClose}
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
                  Submission Status
                </Typography>
                <MenuItem selected={submissionStatusFilter === 'all'} onClick={() => handleSubmissionStatusFilterChange('all')}>
                  All Submissions
                </MenuItem>
                <MenuItem selected={submissionStatusFilter === 'graded'} onClick={() => handleSubmissionStatusFilterChange('graded')}>
                  Graded Submissions
                </MenuItem>
                <MenuItem selected={submissionStatusFilter === 'ungraded'} onClick={() => handleSubmissionStatusFilterChange('ungraded')}>
                  Ungraded Submissions
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                  <Button
                    size="small"
                    onClick={() => {
                      handleSubmissionStatusFilterChange('all');
                      handleSubmissionFilterMenuClose();
                    }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </Menu>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => fetchSubmissions(selectedCompetition._id)}
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

          {/* Submissions table */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {submissionsLoading && (
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
              </Box>
            )}

            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Submission ID</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Student Email</TableCell>
                    <TableCell>Submission Date</TableCell>
                    <TableCell>Questions Answered</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions
                      .slice(submissionsPage * submissionsRowsPerPage, submissionsPage * submissionsRowsPerPage + submissionsRowsPerPage)
                      .map((submission) => (
                        <TableRow
                          key={submission._id}
                          hover
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell>{submission._id.substring(0, 8)}...</TableCell>
                          <TableCell>{submission.student.name}</TableCell>
                          <TableCell>{submission.student.email || 'N/A'}</TableCell>
                          <TableCell>{formatDate(submission.submissionDate)}</TableCell>
                          <TableCell>{`${submission.answeredCount}/${submission.questionCount}`}</TableCell>
                          <TableCell>
                            {submission.result ?
                              `${submission.result.totalScore}/${submission.result.maxPossibleScore}` :
                              'Not graded'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={submission.result && submission.result.isGraded ? 'Graded' : 'Ungraded'}
                              color={submission.result && submission.result.isGraded ? 'success' : 'warning'}
                              size="small"
                              sx={{ borderRadius: '4px' }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Actions">
                              <IconButton
                                aria-label="actions"
                                onClick={(e) => handleActionMenuOpen(e, submission)}
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
                        {submissionsLoading ? (
                          <Typography variant="body2" color="text.secondary">
                            Loading submissions...
                          </Typography>
                        ) : submissionError ? (
                          <Typography variant="body2" color="error">
                            {submissionError}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No submissions found. Try adjusting your search or filters.
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
              count={filteredSubmissions.length}
              rowsPerPage={submissionsRowsPerPage}
              page={submissionsPage}
              onPageChange={handleSubmissionsChangePage}
              onRowsPerPageChange={handleSubmissionsChangeRowsPerPage}
            />
          </Paper>
        </>
      )}

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
        <MenuItem onClick={handleViewSubmissionDetails}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
        </MenuItem>
      </Menu>

      {/* Submission Detail Dialog */}
      {selectedSubmission && selectedCompetition && (
        <SubmissionDetails
          open={submissionDetailOpen}
          onClose={() => setSubmissionDetailOpen(false)}
          submission={selectedSubmission}
          competition={selectedCompetition}
        />
      )}
    </Box>
  );
}

export default ResultsManagement;
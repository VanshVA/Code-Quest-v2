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
  Avatar,
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
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Grid,
  CircularProgress,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  MoreVert,
  School,
  FilterList,
  Refresh,
  PersonAdd,
  Close,
  Visibility,
  VisibilityOff,
  Warning,
  Cancel,
  Save
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Current date and time
const CURRENT_DATE_TIME = "2025-05-30 11:17:00";
const CURRENT_USER = "VanshSharmaSDEintegrate";

// API base URL
const API_BASE_URL = "http://localhost:5000/api"; // Adjust as needed

const StudentManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State variables
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  const [gradeFilter, setGradeFilter] = useState('all');
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Form state
  const [formData, setFormData] = useState({
    studentFirstName: '',
    studentLastName: '',
    studentEmail: '',
    studentPassword: '',
    studentImage: '',
    grade: '9',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch students
  const fetchStudents = async () => {
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
      
      if (gradeFilter !== 'all') {
        params.append('grade', gradeFilter);
      }
      
      // Make API call
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/students?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setStudents(response.data.data.students);
        setTotalStudents(response.data.data.pagination.total);
      } else {
        setError('Failed to load students');
        console.error('API error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please try again.');
      
      // Show more detailed error in snackbar
      setSnackbar({
        open: true,
        message: `Error: ${error.response?.data?.message || error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load students on initial render and when filters change
  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage, searchTerm, gradeFilter]);
  
  // Initialize form data when student or isCreating changes
  useEffect(() => {
    if (isCreating) {
      setFormData({
        studentFirstName: '',
        studentLastName: '',
        studentEmail: '',
        studentPassword: '',
        studentImage: '',
        grade: '9',
      });
    } else if (selectedStudent) {
      setFormData({
        studentFirstName: selectedStudent.studentFirstName || '',
        studentLastName: selectedStudent.studentLastName || '',
        studentEmail: selectedStudent.studentEmail || '',
        studentPassword: '', // Don't populate password for security
        studentImage: selectedStudent.studentImage || '',
        grade: selectedStudent.grade || '9',
      });
    }
    
    setFormErrors({}); // Clear errors on init
  }, [selectedStudent, isCreating, formDialogOpen]);
  
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
  
  // Handle grade filter change
  const handleGradeFilterChange = (event) => {
    setGradeFilter(event.target.value);
    setPage(0); // Reset to first page when filter changes
    setFilterMenuAnchorEl(null);
  };
  
  // Handle opening action menu
  const handleOpenActionMenu = (event, student) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedStudent(student);
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
  
  // Handle edit student action
  const handleEditStudent = () => {
    setIsCreating(false);
    setFormDialogOpen(true);
    handleCloseActionMenu();
  };
  
  // Handle delete student action
  const handleDeleteStudent = () => {
    setDeleteDialogOpen(true);
    handleCloseActionMenu();
  };
  
  // Handle adding new student
  const handleAddStudent = () => {
    setSelectedStudent(null); // Clear selection for new student form
    setIsCreating(true);
    setFormDialogOpen(true);
  };
  
  // Form input change handler
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.studentFirstName.trim()) {
      newErrors.studentFirstName = 'First name is required';
    }
    
    if (!formData.studentLastName.trim()) {
      newErrors.studentLastName = 'Last name is required';
    }
    
    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = 'Email is required';
    } else {
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.studentEmail)) {
        newErrors.studentEmail = 'Invalid email format';
      }
    }
    
    // Only validate password if creating new student or password field is not empty
    if (isCreating && !formData.studentPassword) {
      newErrors.studentPassword = 'Password is required for new student';
    } else if (formData.studentPassword && formData.studentPassword.length < 6) {
      newErrors.studentPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.grade) {
      newErrors.grade = 'Grade is required';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle student form submission
  const handleStudentFormSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (validateForm()) {
      setFormLoading(true);
      try {
        // Create submitData object, omitting password if not needed
        const submitData = { ...formData };
        
        if (!isCreating && !submitData.studentPassword) {
          delete submitData.studentPassword;
        }
        
        let response;
        
        if (isCreating) {
          // Create new student
          response = await axios.post(
            `${API_BASE_URL}/admin/dashboard/students`, 
            submitData,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.data.success) {
            setSnackbar({
              open: true,
              message: 'Student created successfully',
              severity: 'success'
            });
          }
        } else {
          // Update existing student
          response = await axios.put(
            `${API_BASE_URL}/admin/dashboard/students/${selectedStudent._id}`,
            submitData,
            {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (response.data.success) {
            setSnackbar({
              open: true,
              message: 'Student updated successfully',
              severity: 'success'
            });
          }
        }
        
        setFormDialogOpen(false);
        fetchStudents(); // Refresh the student list
      } catch (error) {
        console.error('Error saving student:', error);
        
        const errorMessage = error.response?.data?.message || 'An error occurred while saving student data';
        
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
        
        // Set specific field errors if returned from API
        if (error.response?.data?.errors) {
          setFormErrors(error.response.data.errors);
        }
      } finally {
        setFormLoading(false);
      }
    }
  };
  
  // Handle student deletion
  const handleStudentDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/dashboard/students/${selectedStudent._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Student deleted successfully',
          severity: 'success'
        });
        
        setDeleteDialogOpen(false);
        fetchStudents(); // Refresh the student list
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete student',
        severity: 'error'
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Get grade display text and color
  const getGradeDisplay = (grade) => {
    // Convert grade to number for comparison
    const gradeNum = parseInt(grade, 10);
    
    if (gradeNum <= 8) {
      return { label: `Grade ${grade}`, color: 'info' };
    } else if (gradeNum <= 10) {
      return { label: `Grade ${grade}`, color: 'primary' };
    } else {
      return { label: `Grade ${grade}`, color: 'secondary' };
    }
  };

  // Close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h5" fontWeight="bold">
          Student Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAdd />}
          onClick={handleAddStudent}
          sx={{ 
            borderRadius: '8px',
            bgcolor: 'var(--theme-color)',
            '&:hover': { bgcolor: 'var(--hover-color)' },
          }}
        >
          Add New Student
        </Button>
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
          placeholder="Search students..."
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
            Filter
            {gradeFilter !== 'all' && (
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
                width: 200,
                p: 1,
                mt: 0.5,
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
              Filter by Grade
            </Typography>
            
            <MenuItem selected={gradeFilter === 'all'} onClick={() => handleGradeFilterChange({ target: { value: 'all' } })}>
              All Grades
            </MenuItem>
            <MenuItem selected={gradeFilter === '9'} onClick={() => handleGradeFilterChange({ target: { value: '9' } })}>
              Grade 9
            </MenuItem>
            <MenuItem selected={gradeFilter === '10'} onClick={() => handleGradeFilterChange({ target: { value: '10' } })}>
              Grade 10
            </MenuItem>
            <MenuItem selected={gradeFilter === '11'} onClick={() => handleGradeFilterChange({ target: { value: '11' } })}>
              Grade 11
            </MenuItem>
            <MenuItem selected={gradeFilter === '12'} onClick={() => handleGradeFilterChange({ target: { value: '12' } })}>
              Grade 12
            </MenuItem>
            
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 1, pt: 1, display: 'flex', justifyContent: 'flex-end', px: 1 }}>
              <Button
                size="small"
                onClick={() => {
                  setGradeFilter('all');
                  setFilterMenuAnchorEl(null);
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Menu>
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchStudents}
          size="medium"
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
          }}
        >
          Refresh
        </Button>
      </Paper>
      
      {/* Students table */}
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
                <TableCell>Student</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length > 0 ? (
                students.map((student) => {
                  const gradeInfo = getGradeDisplay(student.grade);
                  const lastLogin = student.loginTime?.length > 0 
                    ? new Date(student.loginTime[student.loginTime.length - 1])
                    : null;
                    
                  return (
                    <TableRow 
                      key={student._id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={student.studentImage} 
                            alt={`${student.studentFirstName} ${student.studentLastName}`}
                            sx={{ mr: 2, width: 40, height: 40 }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {student.studentFirstName} {student.studentLastName}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{student.studentEmail}</TableCell>
                      <TableCell>
                        <Chip 
                          label={gradeInfo.label} 
                          color={gradeInfo.color} 
                          size="small"
                          variant="outlined"
                          sx={{ borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell>
                        {lastLogin ? (
                          lastLogin.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                          })
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Never
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Actions">
                          <IconButton
                            aria-label="actions"
                            onClick={(e) => handleOpenActionMenu(e, student)}
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
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    {loading ? (
                      <Typography variant="body2" color="text.secondary">
                        Loading students...
                      </Typography>
                    ) : error ? (
                      <Typography variant="body2" color="error">
                        {error}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No students found. Try adjusting your search or filters.
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
          count={totalStudents}
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
        <MenuItem onClick={handleEditStudent}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteStudent} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
      
      {/* Student Form Dialog */}
      <Dialog
        open={formDialogOpen}
        onClose={formLoading ? null : () => setFormDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle>
          {isCreating ? 'Add New Student' : 'Edit Student'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Box component="form" noValidate onSubmit={handleStudentFormSubmit}>
            <Grid container spacing={3}>
              {/* Student Image Preview */}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
                <Avatar
                  src={formData.studentImage || undefined}
                  sx={{ width: 100, height: 100 }}
                  alt="Student profile"
                >
                  {formData.studentFirstName && formData.studentFirstName.charAt(0)}
                </Avatar>
              </Grid>
              
              {/* Student Image URL */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Profile Image URL"
                  name="studentImage"
                  value={formData.studentImage}
                  onChange={handleFormChange}
                  variant="outlined"
                  placeholder="https://example.com/image.jpg"
                  error={!!formErrors.studentImage}
                  helperText={formErrors.studentImage}
                />
              </Grid>
              
              {/* First Name and Last Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="studentFirstName"
                  value={formData.studentFirstName}
                  onChange={handleFormChange}
                  variant="outlined"
                  error={!!formErrors.studentFirstName}
                  helperText={formErrors.studentFirstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="studentLastName"
                  value={formData.studentLastName}
                  onChange={handleFormChange}
                  variant="outlined"
                  error={!!formErrors.studentLastName}
                  helperText={formErrors.studentLastName}
                />
              </Grid>
              
              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="studentEmail"
                  type="email"
                  value={formData.studentEmail}
                  onChange={handleFormChange}
                  variant="outlined"
                  error={!!formErrors.studentEmail}
                  helperText={formErrors.studentEmail}
                />
              </Grid>
              
              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={isCreating ? "Password" : "New Password (leave blank to keep current)"}
                  name="studentPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.studentPassword}
                  onChange={handleFormChange}
                  variant="outlined"
                  required={isCreating}
                  error={!!formErrors.studentPassword}
                  helperText={formErrors.studentPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              {/* Grade */}
              <Grid item xs={12}>
                <FormControl fullWidth required error={!!formErrors.grade}>
                  <InputLabel>Grade</InputLabel>
                  <Select
                    name="grade"
                    value={formData.grade}
                    onChange={handleFormChange}
                    label="Grade"
                  >
                    <MenuItem value="8">Grade 8</MenuItem>
                    <MenuItem value="9">Grade 9</MenuItem>
                    <MenuItem value="10">Grade 10</MenuItem>
                    <MenuItem value="11">Grade 11</MenuItem>
                    <MenuItem value="12">Grade 12</MenuItem>
                  </Select>
                  {formErrors.grade && <FormHelperText>{formErrors.grade}</FormHelperText>}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setFormDialogOpen(false)}
            color="inherit"
            disabled={formLoading}
            startIcon={<Cancel />}
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStudentFormSubmit}
            variant="contained"
            color="primary"
            disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={20} /> : <Save />}
            sx={{ 
              borderRadius: '8px',
              bgcolor: 'var(--theme-color)',
              '&:hover': { bgcolor: 'var(--hover-color)' },
            }}
          >
            {formLoading ? 'Saving...' : 'Save Student'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Student Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={deleteLoading ? null : () => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" sx={{ fontSize: 24 }} />
          Confirm Student Deletion
        </DialogTitle>
        
        <DialogContent>
          {selectedStudent && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                src={selectedStudent.studentImage}
                sx={{ width: 60, height: 60 }}
                alt={`${selectedStudent.studentFirstName} ${selectedStudent.studentLastName}`}
              >
                {selectedStudent.studentFirstName?.charAt(0)}
              </Avatar>
              
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {selectedStudent.studentFirstName} {selectedStudent.studentLastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedStudent.studentEmail}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Grade: {selectedStudent.grade}
                </Typography>
              </Box>
            </Box>
          )}
          
          <DialogContentText color="error.main">
            Are you sure you want to delete this student? This action cannot be undone, and all associated data will be permanently removed.
          </DialogContentText>
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'error.main', color: 'white', borderRadius: '8px' }}>
            <Typography variant="subtitle2">
              Warning: This will:
            </Typography>
            <ul style={{ margin: '8px 0', paddingLeft: 24 }}>
              <li>Remove the student's account</li>
              <li>Delete all their submissions and progress</li>
              <li>Remove them from all classes and competitions</li>
            </ul>
          </Box>
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
            onClick={handleStudentDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
            sx={{ borderRadius: '8px' }}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Student'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentManagement;
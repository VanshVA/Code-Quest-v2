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

const TeacherManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State variables
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const [filterMenuAnchorEl, setFilterMenuAnchorEl] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');
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
    teacherFirstName: '',
    teacherLastName: '',
    teacherEmail: '',
    teacherPassword: '',
    teacherImage: '',
    role: 'teacher',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch teachers
  const fetchTeachers = async () => {
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
      
      if (roleFilter !== 'all') {
        params.append('role', roleFilter);
      }
      
      // Make API call
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/teachers?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setTeachers(response.data.data.teachers);
        setTotalTeachers(response.data.data.pagination.total);
      } else {
        setError('Failed to load teachers');
        console.error('API error:', response.data);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError('Failed to load teachers. Please try again.');
      
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
  
  // Load teachers on initial render and when filters change
  useEffect(() => {
    fetchTeachers();
  }, [page, rowsPerPage, searchTerm, roleFilter]);
  
  // Initialize form data when teacher or isCreating changes
  useEffect(() => {
    if (isCreating) {
      setFormData({
        teacherFirstName: '',
        teacherLastName: '',
        teacherEmail: '',
        teacherPassword: '',
        teacherImage: '',
        role: 'teacher',
      });
    } else if (selectedTeacher) {
      setFormData({
        teacherFirstName: selectedTeacher.teacherFirstName || '',
        teacherLastName: selectedTeacher.teacherLastName || '',
        teacherEmail: selectedTeacher.teacherEmail || '',
        teacherPassword: '', // Don't populate password for security
        teacherImage: selectedTeacher.teacherImage || '',
        role: selectedTeacher.role || 'teacher',
      });
    }
    
    setFormErrors({}); // Clear errors on init
  }, [selectedTeacher, isCreating, formDialogOpen]);
  
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
  
  // Handle role filter change
  const handleRoleFilterChange = (event) => {
    setRoleFilter(event.target.value);
    setPage(0); // Reset to first page when filter changes
    setFilterMenuAnchorEl(null);
  };
  
  // Handle opening action menu
  const handleOpenActionMenu = (event, teacher) => {
    setActionMenuAnchorEl(event.currentTarget);
    setSelectedTeacher(teacher);
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
  
  // Handle edit teacher action
  const handleEditTeacher = () => {
    setIsCreating(false);
    setFormDialogOpen(true);
    handleCloseActionMenu();
  };
  
  // Handle delete teacher action
  const handleDeleteTeacher = () => {
    setDeleteDialogOpen(true);
    handleCloseActionMenu();
  };
  
  // Handle adding new teacher
  const handleAddTeacher = () => {
    setSelectedTeacher(null); // Clear selection for new teacher form
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
    
    if (!formData.teacherFirstName.trim()) {
      newErrors.teacherFirstName = 'First name is required';
    }
    
    if (!formData.teacherLastName.trim()) {
      newErrors.teacherLastName = 'Last name is required';
    }
    
    if (!formData.teacherEmail.trim()) {
      newErrors.teacherEmail = 'Email is required';
    } else {
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.teacherEmail)) {
        newErrors.teacherEmail = 'Invalid email format';
      }
    }
    
    // Only validate password if creating new teacher or password field is not empty
    if (isCreating && !formData.teacherPassword) {
      newErrors.teacherPassword = 'Password is required for new teacher';
    } else if (formData.teacherPassword && formData.teacherPassword.length < 6) {
      newErrors.teacherPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle teacher form submission
  const handleTeacherFormSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (validateForm()) {
      setFormLoading(true);
      try {
        // Create submitData object, omitting password if not needed
        const submitData = { ...formData };
        
        if (!isCreating && !submitData.teacherPassword) {
          delete submitData.teacherPassword;
        }
        
        let response;
        
        if (isCreating) {
          // Create new teacher
          response = await axios.post(
            `${API_BASE_URL}/admin/dashboard/teachers`, 
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
              message: 'Teacher created successfully',
              severity: 'success'
            });
          }
        } else {
          // Update existing teacher
          response = await axios.put(
            `${API_BASE_URL}/admin/dashboard/teachers/${selectedTeacher._id}`,
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
              message: 'Teacher updated successfully',
              severity: 'success'
            });
          }
        }
        
        setFormDialogOpen(false);
        fetchTeachers(); // Refresh the teacher list
      } catch (error) {
        console.error('Error saving teacher:', error);
        
        const errorMessage = error.response?.data?.message || 'An error occurred while saving teacher data';
        
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
  
  // Handle teacher deletion
  const handleTeacherDelete = async () => {
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/admin/dashboard/teachers/${selectedTeacher._id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Teacher deleted successfully',
          severity: 'success'
        });
        
        setDeleteDialogOpen(false);
        fetchTeachers(); // Refresh the teacher list
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to delete teacher',
        severity: 'error'
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  
  // Get role display text and color
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'senior_teacher':
        return { label: 'Senior Teacher', color: 'secondary' };
      case 'teacher':
        return { label: 'Teacher', color: 'primary' };
      default:
        return { label: role, color: 'default' };
    }
  };

  // Close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const convertToIST = (dateString) => {
    const utcDate = new Date(dateString);
    return utcDate.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  };

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h5" fontWeight="bold">
          Teacher Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAdd />}
          onClick={handleAddTeacher}
          sx={{ 
            borderRadius: '8px',
            bgcolor: 'var(--theme-color)',
            '&:hover': { bgcolor: 'var(--hover-color)' },
          }}
        >
          Add New Teacher
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
          placeholder="Search teachers..."
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
            {roleFilter !== 'all' && (
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
              Filter by Role
            </Typography>
            
            <MenuItem selected={roleFilter === 'all'} onClick={() => handleRoleFilterChange({ target: { value: 'all' } })}>
              All Roles
            </MenuItem>
            <MenuItem selected={roleFilter === 'teacher'} onClick={() => handleRoleFilterChange({ target: { value: 'teacher' } })}>
              Teachers
            </MenuItem>
            <MenuItem selected={roleFilter === 'senior_teacher'} onClick={() => handleRoleFilterChange({ target: { value: 'senior_teacher' } })}>
              Senior Teachers
            </MenuItem>
            
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 1, pt: 1, display: 'flex', justifyContent: 'flex-end', px: 1 }}>
              <Button
                size="small"
                onClick={() => {
                  setRoleFilter('all');
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
          onClick={fetchTeachers}
          size="medium"
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none',
          }}
        >
          Refresh
        </Button>
      </Paper>
      
      {/* Teachers table */}
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
                <TableCell>Teacher</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachers.length > 0 ? (
                teachers.map((teacher) => {
                  const roleInfo = getRoleDisplay(teacher.role);
                  // const lastLogin = teacher.loginTime?.length > 0 
                  //   ? new Date(teacher.loginTime[teacher.loginTime.length - 1])
                  //   : null;
                  const lastLogin = convertToIST(teacher.loginTime || "Never logged in");
                  return (
                    <TableRow 
                      key={teacher._id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={teacher.teacherImage} 
                            alt={`${teacher.teacherFirstName} ${teacher.teacherLastName}`}
                            sx={{ mr: 2, width: 40, height: 40 }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {teacher.teacherFirstName} {teacher.teacherLastName}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{teacher.teacherEmail}</TableCell>
                      <TableCell>
                        <Chip 
                          label={roleInfo.label} 
                          color={roleInfo.color} 
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
                            onClick={(e) => handleOpenActionMenu(e, teacher)}
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
                        Loading teachers...
                      </Typography>
                    ) : error ? (
                      <Typography variant="body2" color="error">
                        {error}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No teachers found. Try adjusting your search or filters.
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
          count={totalTeachers}
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
        <MenuItem onClick={handleEditTeacher}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteTeacher} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
      
      {/* Teacher Form Dialog */}
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
          {isCreating ? 'Add New Teacher' : 'Edit Teacher'}
        </DialogTitle>
        
        <DialogContent dividers>
          <Box component="form" noValidate onSubmit={handleTeacherFormSubmit}>
            <Grid container spacing={3}>
              {/* Teacher Image Preview */}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
                <Avatar
                  src={formData.teacherImage || undefined}
                  sx={{ width: 100, height: 100 }}
                  alt="Teacher profile"
                >
                  {formData.teacherFirstName && formData.teacherFirstName.charAt(0)}
                </Avatar>
              </Grid>
              
              {/* Teacher Image URL */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Profile Image URL"
                  name="teacherImage"
                  value={formData.teacherImage}
                  onChange={handleFormChange}
                  variant="outlined"
                  placeholder="https://example.com/image.jpg"
                  error={!!formErrors.teacherImage}
                  helperText={formErrors.teacherImage}
                />
              </Grid>
              
              {/* First Name and Last Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="teacherFirstName"
                  value={formData.teacherFirstName}
                  onChange={handleFormChange}
                  variant="outlined"
                  error={!!formErrors.teacherFirstName}
                  helperText={formErrors.teacherFirstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="teacherLastName"
                  value={formData.teacherLastName}
                  onChange={handleFormChange}
                  variant="outlined"
                  error={!!formErrors.teacherLastName}
                  helperText={formErrors.teacherLastName}
                />
              </Grid>
              
              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="teacherEmail"
                  type="email"
                  value={formData.teacherEmail}
                  onChange={handleFormChange}
                  variant="outlined"
                  error={!!formErrors.teacherEmail}
                  helperText={formErrors.teacherEmail}
                />
              </Grid>
              
              {/* Password */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={isCreating ? "Password" : "New Password (leave blank to keep current)"}
                  name="teacherPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.teacherPassword}
                  onChange={handleFormChange}
                  variant="outlined"
                  required={isCreating}
                  error={!!formErrors.teacherPassword}
                  helperText={formErrors.teacherPassword}
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
              
              {/* Role */}
              <Grid item xs={12}>
                <FormControl fullWidth required error={!!formErrors.role}>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    label="Role"
                  >
                    <MenuItem value="teacher">Teacher</MenuItem>
                    <MenuItem value="senior_teacher">Senior Teacher</MenuItem>
                  </Select>
                  {formErrors.role && <FormHelperText>{formErrors.role}</FormHelperText>}
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
            onClick={handleTeacherFormSubmit}
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
            {formLoading ? 'Saving...' : 'Save Teacher'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Teacher Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={deleteLoading ? null : () => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="error" sx={{ fontSize: 24 }} />
          Confirm Teacher Deletion
        </DialogTitle>
        
        <DialogContent>
          {selectedTeacher && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                src={selectedTeacher.teacherImage}
                sx={{ width: 60, height: 60 }}
                alt={`${selectedTeacher.teacherFirstName} ${selectedTeacher.teacherLastName}`}
              >
                {selectedTeacher.teacherFirstName?.charAt(0)}
              </Avatar>
              
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {selectedTeacher.teacherFirstName} {selectedTeacher.teacherLastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTeacher.teacherEmail}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Role: {selectedTeacher.role === 'senior_teacher' ? 'Senior Teacher' : 'Teacher'}
                </Typography>
              </Box>
            </Box>
          )}
          
          <DialogContentText color="error.main">
            Are you sure you want to delete this teacher? This action cannot be undone, and all associated data will be permanently removed.
          </DialogContentText>
          
          <Box sx={{ mt: 2, p: 2, bgcolor: 'error.main', color: 'white', borderRadius: '8px' }}>
            <Typography variant="subtitle2">
              Warning: This will:
            </Typography>
            <ul style={{ margin: '8px 0', paddingLeft: 24 }}>
              <li>Remove the teacher's account</li>
              <li>Delete all assigned classes and competitions</li>
              <li>Remove access to all platform features</li>
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
            onClick={handleTeacherDelete}
            variant="contained"
            color="error"
            disabled={deleteLoading}
            startIcon={deleteLoading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
            sx={{ borderRadius: '8px' }}
          >
            {deleteLoading ? 'Deleting...' : 'Delete Teacher'}
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

export default TeacherManagement;
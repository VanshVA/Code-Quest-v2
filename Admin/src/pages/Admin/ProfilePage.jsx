import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  Card,
  CardContent,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Skeleton,
  useTheme,
  Chip,
  Stack
} from '@mui/material';
import {
  Save,
  Edit,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  History as HistoryIcon,
  PhotoCamera,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Refresh,
  EmojiEvents as EmojiEventsIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// API service for admin
const adminService = {
  getProfile: async () => {
    const response = await axios.get('http://localhost:5000/api/admin/dashboard/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axios.put('http://localhost:5000/api/admin/dashboard/profile', profileData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  updatePassword: async (passwordData) => {
    const response = await axios.put('http://localhost:5000/api/admin/dashboard/password', passwordData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  }
};



const ProfilePage = () => {
  const theme = useTheme();

  // Profile data state
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: ''
  });

  // Password change state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Load admin profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Call the API to get profile data
        const response = await adminService.getProfile();

        if (response.success) {
          const adminData = response.data.admin;
          setProfile(adminData);
          setFormData({
            name: adminData.name,
            email: adminData.email,
            profileImage: adminData.profileImage || ''
          });
        } else {
          setError(response.message || 'Failed to load profile');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });

    // Clear error for this field if any
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: null
      });
    }
  };

  // Start editing profile
  const handleStartEditing = () => {
    setFormData({
      name: profile.name,
      email: profile.email,
      profileImage: profile.profileImage || ''
    });
    setIsEditing(true);
  };

  // Cancel editing profile
  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      // Call API to update profile
      const response = await adminService.updateProfile({
        name: formData.name,
        email: formData.email,
        profileImage: formData.profileImage
      });

      if (response.success) {
        // Update local profile state with the changes
        setProfile({
          ...profile,
          name: response.data.admin.name,
          email: response.data.admin.email,
          profileImage: response.data.admin.profileImage
        });

        setIsEditing(false);
        toast.success(response.message || 'Profile updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Open password change dialog
  const handleOpenPasswordDialog = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
    setPasswordDialogOpen(true);
  };

  // Close password change dialog
  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save password changes
  const handleSavePassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    try {
      setLoading(true);

      // Call API to update password
      const response = await adminService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success) {
        handleClosePasswordDialog();
        toast.success(response.message || 'Password updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update password');
      }
    } catch (err) {
      console.error('Error updating password:', err);

      // Handle specific error for incorrect current password
      if (err.response?.status === 401) {
        setPasswordErrors({
          ...passwordErrors,
          currentPassword: 'Current password is incorrect'
        });
      } else if (err.response?.status === 400) {
        // Handle validation errors
        setPasswordErrors({
          ...passwordErrors,
          newPassword: err.response.data.message || 'Invalid password'
        });
      } else {
        toast.error(err.response?.data?.message || err.message || 'Failed to update password');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return moment(dateString).format('MMMM D, YYYY [at] h:mm A');
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
      
      {/* Page title and header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Profile Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => window.location.reload()}
          sx={{ borderRadius: '8px' }}
        >
          Refresh
        </Button>
      </Box>
      {loading && !profile ? (
        <ProfileSkeleton />
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>
      ) : (
        <Grid container spacing={3} direction={{ xs: 'column-reverse', md: 'row' }}>
          {/* Profile Card - Enhanced styling */}
          <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: '20px',
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                background: `linear-gradient(180deg, 
                  ${theme.palette.background.paper} 0%, 
                  ${theme.palette.mode === 'dark' ? 'rgba(66, 66, 66, 0.8)' : 'rgba(246, 246, 246, 0.8)'} 100%)`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >
              {/* Profile Image with animation */}
              <Box
                sx={{
                  position: 'relative',
                  mb: 3,
                  '&:hover .edit-overlay': {
                    opacity: 1
                  }
                }}
              >
                <Avatar
                  src={profile.profileImage}
                  sx={{
                    width: 150,
                    height: 150,
                    border: '5px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 8px 24px rgba(var(--primary-color-rgb), 0.3)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                  alt={profile.name}
                >
                  {profile.name?.charAt(0)}
                </Avatar>
                {!isEditing && (
                  <IconButton
                    className="edit-overlay"
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 5,
                      right: 5,
                      backgroundColor: 'primary.main',
                      color: '#fff',
                      opacity: 0,
                      transition: 'opacity 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }}
                    onClick={handleStartEditing}
                  >
                    <PhotoCamera fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {profile.name}
              </Typography>

              <Chip
                label={profile.role === 'admin' ? 'Administrator' : profile.role}
                color="primary"
                sx={{
                  mb: 2,
                  textTransform: 'capitalize',
                  borderRadius: '20px',
                  fontWeight: 'bold',
                  px: 1
                }}
              />

              <Typography variant="body1" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" />
                {profile.email}
              </Typography>

              {profile.lastLogin && (
                <Box sx={{
                  mt: 1,
                  mb: 2,
                  py: 1,
                  px: 2,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}>
                  <HistoryIcon fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Last login: <b>{formatDate(profile.lastLogin)}</b>
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 3, width: '100%' }} />

              <Box sx={{ width: '100%' }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Edit />}
                  onClick={handleStartEditing}
                  sx={{
                    mb: 2,
                    borderRadius: '12px',
                    py: 1.2,
                    boxShadow: '0 6px 16px rgba(var(--primary-color-rgb), 0.3)',
                    // background: 'linear-gradient(45deg, var(--primary-main-color))',
                    '&:hover': {
                      boxShadow: '0 6px 16px rgba(var(--primary-color-rgb), 0.3)',
                    }
                  }}
                >
                  Edit Profile
                </Button>

                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<LockIcon />}
                  onClick={handleOpenPasswordDialog}
                  sx={{
                    borderRadius: '12px',
                    py: 1.2,
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px'
                    }
                  }}
                >
                  Change Password
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Profile Details and Quick Actions side by side with vertical inner content */}
          <Grid item xs={12} md={8} order={{ xs: 1, md: 2 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 3 },
                height: '100%',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: 'divider',
                background: `linear-gradient(180deg, 
                  ${theme.palette.background.paper} 0%, 
                  ${theme.palette.mode === 'dark' ? 'rgba(66, 66, 66, 0.8)' : 'rgba(246, 246, 246, 0.8)'} 100%)`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
              }}
            >

              {/* Main content area with Profile Details and Quick Actions side by side */}
              <Grid container spacing={3}>
                {/* Profile Details - Left side with vertical layout */}
                <Grid item xs={12} md={6}>
                  {isEditing ? (
                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        label="Profile Image URL"
                        name="profileImage"
                        value={formData.profileImage}
                        onChange={handleProfileChange}
                        variant="filled"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhotoCamera />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '12px' }
                        }}
                      />
                      {formData.profileImage && (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Avatar
                            src={formData.profileImage}
                            alt="Preview"
                            sx={{
                              width: 80,
                              height: 80,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                            }}
                          />
                        </Box>
                      )}
                      <TextField
                        fullWidth
                        required
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleProfileChange}
                        variant="filled"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '12px' }
                        }}
                      />
                      <TextField
                        fullWidth
                        required
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleProfileChange}
                        variant="filled"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: '12px' }
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                          variant="outlined"
                          onClick={handleCancelEditing}
                          disabled={loading}
                          sx={{
                            borderRadius: '12px',
                            px: 3
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          onClick={handleSaveProfile}
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                          sx={{
                            borderRadius: '12px',
                            px: 3,
                            boxShadow: '0 4px 12px rgba(var(--primary-color-rgb), 0.2)',
                            '&:hover': {
                              boxShadow: '0 6px 16px rgba(var(--primary-color-rgb), 0.3)',
                            }
                          }}
                        >
                          {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </Box>
                    </Stack>
                  ) : (
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2 }}>Profile Details</Typography>
                      <Stack spacing={3}>
                        <Card
                          elevation={0}
                          sx={{
                            borderRadius: '16px',
                            border: '1px solid',
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              {/* Name field */}
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{
                                  bgcolor: 'primary.main',
                                  mr: 2,
                                  width: 36,
                                  height: 36
                                }}>
                                  <PersonIcon fontSize="small" />
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                    Full Name
                                  </Typography>
                                  <Typography variant="h6" sx={{ mt: 0.25, fontWeight: 'bold', fontSize: '1rem' }}>
                                    {profile.name}
                                  </Typography>
                                </Box>
                              </Box>

                              {/* Email field */}
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{
                                  bgcolor: 'secondary.main',
                                  mr: 2,
                                  width: 36,
                                  height: 36
                                }}>
                                  <EmailIcon fontSize="small" />
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                    Email Address
                                  </Typography>
                                  <Typography variant="h6" sx={{ mt: 0.25, fontWeight: 'bold', fontSize: '1rem' }}>
                                    {profile.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>

                        <Card
                          elevation={0}
                          sx={{
                            borderRadius: '16px',
                            border: '1px solid',
                            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                            background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(var(--primary-color-rgb), 0.02)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 2.5 }}>
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'flex-start'
                            }}>
                              <Avatar sx={{
                                mr: 2,
                                width: 36,
                                height: 36,
                                background: 'linear-gradient(45deg, var(--theme-color), var(--hover-color))'
                              }}>
                                <LockIcon fontSize="small" />
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" color="text.secondary" fontWeight="medium">
                                  Role & Permissions
                                </Typography>
                                <Typography variant="subtitle1" sx={{ mt: 0.25, mb: 1.5, fontWeight: 'bold', textTransform: 'capitalize' }}>
                                  {profile.role}
                                </Typography>

                                {/* Permissions layout */}
                                <Box sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 1
                                }}>
                                  {profile.permissions?.map((permission, index) => (
                                    <Chip
                                      key={index}
                                      label={permission.replace(/_/g, ' ')}
                                      size="small"
                                      sx={{
                                        textTransform: 'capitalize',
                                        borderRadius: '8px',
                                        fontWeight: 'medium',
                                        height: '28px',
                                        fontSize: '0.75rem',
                                        justifyContent: 'flex-start',
                                        backgroundColor: theme.palette.mode === 'dark'
                                          ? 'rgba(var(--primary-color-rgb), 0.2)'
                                          : 'rgba(var(--primary-color-rgb), 0.08)',
                                        color: 'primary.main',
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Stack>
                    </Box>
                  )}
                </Grid>

                {/* Quick Actions - Right side with vertical layout */}
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
                    <Stack spacing={2}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        startIcon={<DashboardIcon />}
                        onClick={() => navigate('/admin/competitions')}
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          justifyContent: 'flex-start',
                          borderWidth: '2px',
                          height: '100%'
                        }}
                      >
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Manage Competitions
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Create, edit and track your competitions
                          </Typography>
                        </Box>
                      </Button>

                      <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        startIcon={<EmojiEventsIcon />}
                        onClick={() => navigate('/admin/results')}
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          justifyContent: 'flex-start',
                          borderWidth: '2px',
                          height: '100%'
                        }}
                      >
                        <Box sx={{ textAlign: 'left' }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            View Results
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            See student performance and grades
                          </Typography>
                        </Box>
                      </Button>

                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={loading ? null : handleClosePasswordDialog}
        PaperProps={{
          sx: { borderRadius: '16px' }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>Change Password</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="currentPassword"
              label="Current Password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: '8px' }
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: '8px' }
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: '8px' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClosePasswordDialog}
            disabled={loading}
            sx={{ borderRadius: '8px' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSavePassword}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            sx={{
              borderRadius: '8px',
              bgcolor: 'var(--theme-color)',
              '&:hover': {
                bgcolor: 'var(--hover-color)'
              }
            }}
          >
            {loading ? 'Saving...' : 'Update Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Profile loading skeleton
const ProfileSkeleton = () => {
  return (
    <Grid container spacing={3} direction={{ xs: 'column-reverse', md: 'row' }}>
      <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Skeleton variant="circular" width={120} height={120} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="60%" sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width={100} height={32} sx={{ mb: 2, borderRadius: '16px' }} />
          <Skeleton variant="text" width="80%" sx={{ mb: 1 }} />
          <Skeleton variant="text" width="60%" sx={{ mb: 2 }} />

          <Divider sx={{ my: 2, width: '100%' }} />

          <Skeleton variant="rectangular" width="100%" height={36} sx={{ mb: 2, borderRadius: '8px' }} />
          <Skeleton variant="rectangular" width="100%" height={36} sx={{ borderRadius: '8px' }} />
        </Paper>
      </Grid>

      <Grid item xs={12} md={8} order={{ xs: 1, md: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '16px',
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Skeleton variant="text" width="30%" sx={{ mb: 2 }} />
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '8px', mb: 2 }} />
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: '8px' }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '8px', mb: 2 }} />
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '8px', mb: 2 }} />
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: '8px' }} />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProfilePage;
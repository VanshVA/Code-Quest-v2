import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    Avatar,
    CircularProgress,
    Divider,
    Alert,
    Snackbar,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    IconButton,
    useTheme,
    Stack,
    Chip,
    Skeleton
} from '@mui/material';
import {
    Person as PersonIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Lock as LockIcon,
    School as SchoolIcon,
    Dashboard as DashboardIcon,
    EmojiEvents as EmojiEventsIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Email as EmailIcon,
    History as HistoryIcon,
    PhotoCamera,
    Settings as SettingsIcon,
    Refresh
} from '@mui/icons-material';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Current date and time
const CURRENT_DATE_TIME = "2025-05-31 14:18:14"; // Using provided UTC time
const CURRENT_USER = "VanshSharmaSDE"; // Using provided user login

const ProfilePage = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const navigate = useNavigate();

    // Profile state
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        teacherFirstName: '',
        teacherLastName: '',
        teacherEmail: '',
        teacherImage: ''
    });

    // UI state
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Password dialog state
    const [passwordDialog, setPasswordDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordErrors, setPasswordErrors] = useState({});
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Notification state
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        type: 'success'
    });

    // Fetch teacher profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                
                // Use authService to fetch profile data
                const response = await authService.getProfile();
                
                if (response) {
                    // Get the teacher data from the response
                    // The data structure might be one of these options:
                    const teacherData = response.teacher || response.data?.teacher || response;
                    
                    setProfile(teacherData);
                    setFormData({
                        teacherFirstName: teacherData.teacherFirstName || '',
                        teacherLastName: teacherData.teacherLastName || '',
                        teacherEmail: teacherData.teacherEmail || '',
                        teacherImage: teacherData.teacherImage || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to load profile. Please refresh and try again.');

                // If unauthorized, redirect to login
                if (err.status === 401 || err.status === 403) {
                    authService.logout();
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle password input change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prevData => ({
            ...prevData,
            [name]: value
        }));

        // Clear error for this field if any
        if (passwordErrors[name]) {
            setPasswordErrors(prevErrors => ({
                ...prevErrors,
                [name]: null
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setSaving(true);
            
            // Use authService to update profile
            const response = await authService.updateProfile(formData);

            // Extract teacher data from response, checking various possible structures
            const updatedTeacherData = response?.teacher || response?.data?.teacher || response;
            
            if (response.success || updatedTeacherData) {
                // Update profile state with new data - keeping existing data that wasn't updated
                setProfile(prevProfile => ({
                    ...prevProfile,
                    ...updatedTeacherData,
                    teacherFirstName: formData.teacherFirstName,
                    teacherLastName: formData.teacherLastName,
                    teacherEmail: formData.teacherEmail,
                    teacherImage: formData.teacherImage
                }));

                // Show success notification
                setNotification({
                    open: true,
                    message: 'Profile updated successfully',
                    type: 'success'
                });

                // Exit edit mode
                setIsEditing(false);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);

            setNotification({
                open: true,
                message: err.message || 'Failed to update profile',
                type: 'error'
            });
        } finally {
            setSaving(false);
        }
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

    // Handle password update
    const handlePasswordUpdate = async () => {
        if (!validatePasswordForm()) {
            return;
        }

        try {
            setSaving(true);
            
            // Use authService to update password
            const response = await authService.updatePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );

            if (response.success) {
                // Close dialog and reset form
                setPasswordDialog(false);
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });

                // Show success notification
                setNotification({
                    open: true,
                    message: 'Password updated successfully',
                    type: 'success'
                });
            }
        } catch (err) {
            console.error('Error updating password:', err);

            // Handle common errors
            if (err.message?.includes('incorrect')) {
                setPasswordErrors({
                    ...passwordErrors,
                    currentPassword: 'Current password is incorrect'
                });
            } else {
                setNotification({
                    open: true,
                    message: err.message || 'Failed to update password',
                    type: 'error'
                });
            }
        } finally {
            setSaving(false);
        }
    };

    // Close notification
    const handleCloseNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };
    
    // Format date helper
    const formatDate = (dateString) => {
        return moment(dateString).format('MMMM D, YYYY [at] h:mm A');
    };

    return (
        <Box>
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
                    {/* Profile Card */}
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
                                    ${isDark ? 'rgba(66, 66, 66, 0.8)' : 'rgba(246, 246, 246, 0.8)'} 100%)`,
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
                                    src={profile?.teacherImage}
                                    alt={profile?.teacherFirstName}
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
                                >
                                    {profile?.teacherFirstName?.charAt(0)}
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
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <PhotoCamera fontSize="small" />
                                    </IconButton>
                                )}
                            </Box>

                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {profile?.teacherFirstName} {profile?.teacherLastName}
                            </Typography>

                            <Chip
                                label={profile?.role || 'Teacher'}
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
                                {profile?.teacherEmail}
                            </Typography>

                            <Divider sx={{ my: 3, width: '100%' }} />

                            <Box sx={{ width: '100%' }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    startIcon={<EditIcon />}
                                    onClick={() => setIsEditing(true)}
                                    sx={{
                                        mb: 2,
                                        borderRadius: '12px',
                                        py: 1.2,
                                        boxShadow: '0 6px 16px rgba(var(--primary-color-rgb), 0.3)',
                                        bgcolor: 'var(--theme-color)',
                                        '&:hover': {
                                            boxShadow: '0 6px 16px rgba(var(--primary-color-rgb), 0.3)',
                                            bgcolor: 'var(--hover-color)'
                                        }
                                    }}
                                >
                                    Edit Profile
                                </Button>

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<LockIcon />}
                                    onClick={() => setPasswordDialog(true)}
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

                    {/* Profile Details and Quick Actions */}
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
                                    ${isDark ? 'rgba(66, 66, 66, 0.8)' : 'rgba(246, 246, 246, 0.8)'} 100%)`,
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
                                                name="teacherImage"
                                                value={formData.teacherImage}
                                                onChange={handleChange}
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
                                            {formData.teacherImage && (
                                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Avatar
                                                        src={formData.teacherImage}
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
                                                label="First Name"
                                                name="teacherFirstName"
                                                value={formData.teacherFirstName}
                                                onChange={handleChange}
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
                                                label="Last Name"
                                                name="teacherLastName"
                                                value={formData.teacherLastName}
                                                onChange={handleChange}
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
                                                name="teacherEmail"
                                                type="email"
                                                value={formData.teacherEmail}
                                                onChange={handleChange}
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
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        setFormData({
                                                            teacherFirstName: profile?.teacherFirstName || '',
                                                            teacherLastName: profile?.teacherLastName || '',
                                                            teacherEmail: profile?.teacherEmail || '',
                                                            teacherImage: profile?.teacherImage || ''
                                                        });
                                                    }}
                                                    disabled={saving}
                                                    sx={{
                                                        borderRadius: '12px',
                                                        px: 3
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleSubmit}
                                                    disabled={saving}
                                                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                                    sx={{
                                                        borderRadius: '12px',
                                                        px: 3,
                                                        boxShadow: '0 4px 12px rgba(var(--primary-color-rgb), 0.2)',
                                                        bgcolor: 'var(--theme-color)',
                                                        '&:hover': {
                                                            boxShadow: '0 6px 16px rgba(var(--primary-color-rgb), 0.3)',
                                                            bgcolor: 'var(--hover-color)'
                                                        }
                                                    }}
                                                >
                                                    {saving ? 'Saving...' : 'Save Changes'}
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
                                                            {/* First Name field */}
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
                                                                        First Name
                                                                    </Typography>
                                                                    <Typography variant="h6" sx={{ mt: 0.25, fontWeight: 'bold', fontSize: '1rem' }}>
                                                                        {profile?.teacherFirstName}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>

                                                            {/* Last Name field */}
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
                                                                        Last Name
                                                                    </Typography>
                                                                    <Typography variant="h6" sx={{ mt: 0.25, fontWeight: 'bold', fontSize: '1rem' }}>
                                                                        {profile?.teacherLastName}
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
                                                                        {profile?.teacherEmail}
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
                                                                    Role & Account Status
                                                                </Typography>
                                                                <Typography variant="subtitle1" sx={{ mt: 0.25, mb: 1.5, fontWeight: 'bold', textTransform: 'capitalize' }}>
                                                                    {profile?.role || 'Teacher'}
                                                                </Typography>
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
                                                onClick={() => navigate('/teacher/competitions')}
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
                                                onClick={() => navigate('/teacher/results')}
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
                open={passwordDialog}
                onClose={() => !saving && setPasswordDialog(false)}
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
                                            {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                                            {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                        onClick={() => setPasswordDialog(false)}
                        disabled={saving}
                        sx={{ borderRadius: '8px' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePasswordUpdate}
                        variant="contained"
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                        sx={{
                            borderRadius: '8px',
                            bgcolor: 'var(--theme-color)',
                            '&:hover': {
                                bgcolor: 'var(--hover-color)'
                            }
                        }}
                    >
                        {saving ? 'Updating...' : 'Update Password'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
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
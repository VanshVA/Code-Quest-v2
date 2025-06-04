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
    Stack
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
    VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

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

    return (
        <>
            <Container maxWidth="xl">
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {/* Profile Card */}
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    border: '1px solid',
                                
                                     bgcolor:isDark ? '#312f2f' : 'white',
                                }}
                            >
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Avatar
                                        src={profile?.teacherImage}
                                        alt={profile?.teacherFirstName}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            mx: 'auto',
                                            mb: 2,
                                            border: '4px solid',
                                            borderColor: 'primary.main'
                                        }}
                                    >
                                        {profile?.teacherFirstName?.charAt(0)}
                                    </Avatar>
                                    <Typography variant="h5" fontWeight="bold">
                                        {profile?.teacherFirstName} {profile?.teacherLastName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {profile?.teacherEmail}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'inline-block',
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: '4px',
                                            mt: 1
                                        }}
                                    >
                                        {profile?.role || 'Teacher'}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Profile Stats */}
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Statistics
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: '8px',
                                                    height: '100%'
                                                }}
                                            >
                                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <DashboardIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1rem' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Competitions
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="h5" fontWeight="bold">
                                                        {profile?.stats?.competitionsCount || 0}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Card
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: '8px',
                                                    height: '100%'
                                                }}
                                            >
                                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <SchoolIcon sx={{ color: 'secondary.main', mr: 1, fontSize: '1rem' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Students
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="h5" fontWeight="bold">
                                                        {profile?.stats?.studentsCount || 0}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Action Buttons */}
                                <Box>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<EditIcon />}
                                        onClick={() => setIsEditing(true)}
                                        sx={{
                                            borderRadius: '8px',
                                            mb: 2,
                                            bgcolor: 'var(--theme-color)',
                                            '&:hover': {
                                                bgcolor: 'var(--hover-color)'
                                            }
                                        }}
                                    >
                                        Edit Profile
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<LockIcon />}
                                        onClick={() => setPasswordDialog(true)}
                                        sx={{
                                            borderRadius: '8px',
                                        }}
                                    >
                                        Change Password
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Profile Details and Quick Actions side by side, with vertical inner content */}
                        <Grid item xs={12} md={8}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    bgcolor:isDark ? '#312f2f' : 'white',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {isEditing ? 'Edit Profile' : 'Profile Information'}
                                    </Typography>

                                    {isEditing && (
                                        <Button
                                            variant="outlined"
                                            color="inherit"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({
                                                    teacherFirstName: profile?.teacherFirstName || '',
                                                    teacherLastName: profile?.teacherLastName || '',
                                                    teacherEmail: profile?.teacherEmail || '',
                                                    teacherImage: profile?.teacherImage || ''
                                                });
                                            }}
                                            sx={{ borderRadius: '8px' }}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </Box>

                                <Divider sx={{ mb: 3 }} />
                                
                                {/* Main content area with Profile Details and Quick Actions side by side */}
                                <Grid container spacing={3}>
                                    {/* Profile Details */}
                                    <Grid item xs={12} md={6}>
                                        {isEditing ? (
                                            // Edit Form - Vertical layout
                                            <Box component="form">
                                                <Stack spacing={3}>
                                                    <TextField
                                                        fullWidth
                                                        label="First Name"
                                                        name="teacherFirstName"
                                                        value={formData.teacherFirstName}
                                                        onChange={handleChange}
                                                        required
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PersonIcon color="action" />
                                                                </InputAdornment>
                                                            ),
                                                            sx: { borderRadius: '8px' }
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Last Name"
                                                        name="teacherLastName"
                                                        value={formData.teacherLastName}
                                                        onChange={handleChange}
                                                        required
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PersonIcon color="action" />
                                                                </InputAdornment>
                                                            ),
                                                            sx: { borderRadius: '8px' }
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Email Address"
                                                        name="teacherEmail"
                                                        type="email"
                                                        value={formData.teacherEmail}
                                                        onChange={handleChange}
                                                        required
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <PersonIcon color="action" />
                                                                </InputAdornment>
                                                            ),
                                                            sx: { borderRadius: '8px' }
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Profile Image URL"
                                                        name="teacherImage"
                                                        value={formData.teacherImage}
                                                        onChange={handleChange}
                                                        placeholder="Enter URL to your profile image"
                                                        helperText="Leave blank to use default avatar"
                                                        InputProps={{
                                                            sx: { borderRadius: '8px' }
                                                        }}
                                                    />
                                                    {formData.teacherImage && (
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Avatar
                                                                src={formData.teacherImage}
                                                                alt="Preview"
                                                                sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
                                                            />
                                                            <Typography variant="caption" color="text.secondary">
                                                                Image Preview
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                                                            onClick={handleSubmit}
                                                            disabled={saving}
                                                            sx={{
                                                                borderRadius: '8px',
                                                                px: 4,
                                                                bgcolor: 'var(--theme-color)',
                                                                '&:hover': {
                                                                    bgcolor: 'var(--hover-color)'
                                                                }
                                                            }}
                                                        >
                                                            {saving ? 'Saving...' : 'Save Changes'}
                                                        </Button>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        ) : (
                                            // Display Profile - Vertical layout
                                            <Box>
                                                <Typography variant="h6" sx={{ mb: 2 }}>Profile Details</Typography>
                                                <Stack spacing={2.5}>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            First Name
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {profile?.teacherFirstName}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Last Name
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {profile?.teacherLastName}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Email Address
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {profile?.teacherEmail}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Role
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                display: 'inline-block',
                                                                bgcolor: 'primary.main',
                                                                color: 'primary.contrastText',
                                                                px: 2,
                                                                py: 0.5,
                                                                borderRadius: '16px',
                                                                fontWeight: 'medium',
                                                                textTransform: 'capitalize'
                                                            }}
                                                        >
                                                            {profile?.role || 'Teacher'}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Account Created
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {new Date(profile?.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Last Activity
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {profile?.loginTime && profile.loginTime.length > 0
                                                                ? new Date(profile.loginTime[profile.loginTime.length - 1]).toLocaleString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })
                                                                : 'No activity recorded'}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        )}
                                    </Grid>

                                    {/* Quick Actions - Vertical layout */}
                                    <Grid item xs={12} md={6}>
                                        <Box>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
                                            <Stack spacing={2}>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    color="primary"
                                                    startIcon={<DashboardIcon />}
                                                    onClick={() => navigate('/teacher/dashboard/competitions')}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '8px',
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
                                                    onClick={() => navigate('/teacher/dashboard/results')}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '8px',
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
                                                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Card
                                                        variant="outlined"
                                                        sx={{
                                                            borderRadius: '8px',
                                                            p: 2,
                                                            width: '100%'
                                                        }}
                                                    >
                                                        <CardContent sx={{ p: 0 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                                <Typography variant="subtitle1" fontWeight="bold">
                                                                    Current Session
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                Current User: {CURRENT_USER}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Login Time: {CURRENT_DATE_TIME}
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                )}
            </Container>

            {/* Password Change Dialog */}
            <Dialog
                open={passwordDialog}
                onClose={() => !saving && setPasswordDialog(false)}
                PaperProps={{
                    sx: { borderRadius: '12px' }
                }}
            >
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, width: { sm: '400px' } }}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Current Password"
                            name="currentPassword"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            error={!!passwordErrors.currentPassword}
                            helperText={passwordErrors.currentPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle current password visibility"
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
                            fullWidth
                            margin="normal"
                            label="New Password"
                            name="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            error={!!passwordErrors.newPassword}
                            helperText={passwordErrors.newPassword || "Password must be at least 6 characters"}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle new password visibility"
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
                            fullWidth
                            margin="normal"
                            label="Confirm New Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            error={!!passwordErrors.confirmPassword}
                            helperText={passwordErrors.confirmPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
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
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        onClick={() => setPasswordDialog(false)}
                        color="inherit"
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePasswordUpdate}
                        variant="contained"
                        color="primary"
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
        </>
    );
};

export default ProfilePage;
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
    VisibilityOff as VisibilityOffIcon,
    Assignment as AssignmentIcon
} from '@mui/icons-material';
import dashboardService from '../../services/dashboardService';
import { useNavigate } from 'react-router-dom';

// Current date and time
const CURRENT_DATE_TIME = "2025-05-31 14:23:14";
const CURRENT_USER = "VanshSharmaSDE";

const ProfilePage = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Profile state
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        studentFirstName: '',
        studentLastName: '',
        studentEmail: '',
        studentImage: '',
        grade: '',
        school: ''
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

    // Fetch student profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                
                // Use dashboardService to fetch profile data
                const response = await dashboardService.getProfile();
                
                if (response.success) {
                    // Get the student data from the response
                    const studentData = response.data.student;
                    
                    setProfile(studentData);
                    setFormData({
                        studentFirstName: studentData.studentFirstName || '',
                        studentLastName: studentData.studentLastName || '',
                        studentEmail: studentData.studentEmail || '',
                        studentImage: studentData.studentImage || '',
                        grade: studentData.grade || '',
                        school: studentData.school || ''
                    });
                } else {
                    throw new Error(response.message || 'Failed to load profile');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to load profile. Please refresh and try again.');

                // If unauthorized, redirect to login
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.removeItem('token');
                    navigate('/login');
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
            
            // Use dashboardService to update profile
            const response = await dashboardService.updateProfile(formData);

            if (response.success) {
                const updatedStudentData = response.data.student;
                
                // Update profile state with new data
                setProfile(prevProfile => ({
                    ...prevProfile,
                    ...updatedStudentData
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
                throw new Error(response.message || 'Failed to update profile');
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
            
            // Use dashboardService to update password
            const response = await dashboardService.updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

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
            } else {
                throw new Error(response.message || 'Failed to update password');
            }
        } catch (err) {
            console.error('Error updating password:', err);

            // Handle common errors
            if (err.message?.includes('incorrect') || err.response?.data?.message?.includes('incorrect')) {
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
                                    borderColor: 'divider',
                                }}
                            >
                                <Box sx={{ textAlign: 'center', mb: 3 }}>
                                    <Avatar
                                        src={profile?.studentImage}
                                        alt={profile?.studentFirstName}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            mx: 'auto',
                                            mb: 2,
                                            border: '4px solid',
                                            borderColor: 'primary.main'
                                        }}
                                    >
                                        {profile?.studentFirstName?.charAt(0)}
                                    </Avatar>
                                    <Typography variant="h5" fontWeight="bold">
                                        {profile?.studentFirstName} {profile?.studentLastName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {profile?.studentEmail}
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
                                        Student
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
                                                        <EmojiEventsIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1rem' }} />
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
                                                        <AssignmentIcon sx={{ color: 'secondary.main', mr: 1, fontSize: '1rem' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Completed
                                                        </Typography>
                                                    </Box>
                                                    <Typography variant="h5" fontWeight="bold">
                                                        {profile?.stats?.completedCompetitionsCount || 0}
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

                        {/* Profile Details and Quick Actions side by side */}
                        <Grid item xs={12} md={8}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    borderColor: 'divider',
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
                                                    studentFirstName: profile?.studentFirstName || '',
                                                    studentLastName: profile?.studentLastName || '',
                                                    studentEmail: profile?.studentEmail || '',
                                                    studentImage: profile?.studentImage || '',
                                                    grade: profile?.grade || '',
                                                    school: profile?.school || ''
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
                                    {/* Profile Details - Vertical layout */}
                                    <Grid item xs={12} md={6}>
                                        {isEditing ? (
                                            // Edit Form - Vertical layout
                                            <Box component="form">
                                                <Stack spacing={3}>
                                                    <TextField
                                                        fullWidth
                                                        label="First Name"
                                                        name="studentFirstName"
                                                        value={formData.studentFirstName}
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
                                                        name="studentLastName"
                                                        value={formData.studentLastName}
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
                                                        name="studentEmail"
                                                        type="email"
                                                        value={formData.studentEmail}
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
                                                        label="Grade"
                                                        name="grade"
                                                        value={formData.grade}
                                                        onChange={handleChange}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SchoolIcon color="action" />
                                                                </InputAdornment>
                                                            ),
                                                            sx: { borderRadius: '8px' }
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="School"
                                                        name="school"
                                                        value={formData.school}
                                                        onChange={handleChange}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SchoolIcon color="action" />
                                                                </InputAdornment>
                                                            ),
                                                            sx: { borderRadius: '8px' }
                                                        }}
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Profile Image URL"
                                                        name="studentImage"
                                                        value={formData.studentImage}
                                                        onChange={handleChange}
                                                        placeholder="Enter URL to your profile image"
                                                        helperText="Leave blank to use default avatar"
                                                        InputProps={{
                                                            sx: { borderRadius: '8px' }
                                                        }}
                                                    />
                                                    {formData.studentImage && (
                                                        <Box sx={{ textAlign: 'center' }}>
                                                            <Avatar
                                                                src={formData.studentImage}
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
                                                            {profile?.studentFirstName}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Last Name
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {profile?.studentLastName}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Email Address
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {profile?.studentEmail}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            Grade
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {profile?.grade || 'Not specified'}
                                                        </Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                            School
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {profile?.school || 'Not specified'}
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
                                                    startIcon={<EmojiEventsIcon />}
                                                    onClick={() => navigate('/student/competitions')}
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
                                                            Join Competitions
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Browse and join available competitions
                                                        </Typography>
                                                    </Box>
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    color="secondary"
                                                    startIcon={<AssignmentIcon />}
                                                    onClick={() => navigate('/student/results')}
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
                                                            See your competition results
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
import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Avatar,
    TextField,
    Grid,
    Chip,
    Divider,
    Badge,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tab,
    Tabs,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Switch,
    InputAdornment,
    FormControlLabel,
    Checkbox,
    CircularProgress,
    Menu,
    MenuItem,
    Tooltip,
    Alert,
    Snackbar,
    useTheme,
    Container,
    Link, 
    FormControl,
    Select
} from '@mui/material';
import {
    Edit,
    Cancel,
    Save,
    PhotoCamera,
    GitHub,
    LinkedIn,
    Language,
    Twitter,
    Email,
    Phone,
    LocationOn,
    School,
    Work,
    Code,
    Visibility,
    VisibilityOff,
    Security,
    Notifications,
    Settings,
    PersonOutline,
    Lock,
    Badge as BadgeIcon,
    AddAPhoto,
    Delete,
    FileUpload,
    MoreVert,
    CheckCircle,
    Error,
    HelpOutline,
    StarOutline,
    CalendarToday,
    EmojiEvents,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Current date and time for display
const CURRENT_DATE_TIME = "2025-05-30 08:17:43";
const CURRENT_USER = "VanshSharmaSDEcontinue";

// Motion components
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);

const Profile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
    const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Form data for editing profile
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        education: '',
        work: '',
        githubUrl: '',
        linkedinUrl: '',
        websiteUrl: '',
        twitterUrl: '',
        skills: [],
        profileVisibility: true,
        emailNotifications: true,
    });

    // Notifications settings
    const [notificationSettings, setNotificationSettings] = useState({
        newCompetitions: true,
        resultPublished: true,
        reminders: true,
        systemUpdates: false,
        weeklyNewsletter: true,
        marketingEmails: false,
    });

    useEffect(() => {
        // Simulate API call to fetch profile data
        setTimeout(() => {
            const dummyProfile = {
                id: '123456',
                firstName: 'Vansh',
                lastName: 'Sharma',
                username: 'VanshSharmaSDEcontinue',
                email: 'vansh.sharma@example.com',
                phone: '+91 9876543210',
                location: 'Bengaluru, India',
                bio: 'Software Developer Enthusiast | Competitive Programmer | AI/ML Hobbyist',
                profileImage: 'https://i.pravatar.cc/300?img=11',
                coverImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8Y29kZXx8fHx8fDE2MTc3MjE4ODk&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1200',
                joinDate: '2025-01-15',
                membershipLevel: 'Premium',
                education: 'B.Tech in Computer Science, Indian Institute of Technology',
                work: 'Student Developer at Tech University',
                githubUrl: 'https://github.com/vanshdeveloper',
                linkedinUrl: 'https://linkedin.com/in/vanshsharma',
                websiteUrl: 'https://vanshsharma.dev',
                twitterUrl: 'https://twitter.com/vanshsharma',
                skills: ['JavaScript', 'Python', 'React', 'Node.js', 'Java', 'Data Structures', 'Algorithms'],
                badges: [
                    { id: 1, name: 'Top Performer', description: 'Achieved top 3 rank in competitions', icon: 'EmojiEvents', date: '2025-05-01' },
                    { id: 2, name: 'Python Expert', description: 'Demonstrated excellence in Python competitions', icon: 'Code', date: '2025-04-15' },
                    { id: 3, name: 'Data Structures Master', description: 'Solved advanced data structures problems', icon: 'School', date: '2025-03-22' },
                ],
                statistics: {
                    totalCompetitions: 8,
                    competitionsWon: 1,
                    averageScore: 82,
                    bestRank: 2,
                },
                activityLog: [
                    { id: 1, type: 'competition', action: 'Participated in Python Mastery', date: '2025-05-28' },
                    { id: 2, type: 'badge', action: 'Earned Top Performer badge', date: '2025-05-01' },
                    { id: 3, type: 'competition', action: 'Participated in JavaScript Fundamentals', date: '2025-04-22' },
                    { id: 4, type: 'badge', action: 'Earned Python Expert badge', date: '2025-04-15' },
                    { id: 5, type: 'competition', action: 'Participated in Web Development Contest', date: '2025-04-08' },
                    { id: 6, type: 'competition', action: 'Participated in C++ Challenge', date: '2025-03-15' },
                    { id: 7, type: 'badge', action: 'Earned Data Structures Master badge', date: '2025-03-22' },
                    { id: 8, type: 'profile', action: 'Joined Code Quest', date: '2025-01-15' },
                ],
                profileVisibility: true,
                emailNotifications: true,
            };

            setProfile(dummyProfile);
            setFormData({
                firstName: dummyProfile.firstName,
                lastName: dummyProfile.lastName,
                email: dummyProfile.email,
                phone: dummyProfile.phone || '',
                location: dummyProfile.location || '',
                bio: dummyProfile.bio || '',
                education: dummyProfile.education || '',
                work: dummyProfile.work || '',
                githubUrl: dummyProfile.githubUrl || '',
                linkedinUrl: dummyProfile.linkedinUrl || '',
                websiteUrl: dummyProfile.websiteUrl || '',
                twitterUrl: dummyProfile.twitterUrl || '',
                skills: dummyProfile.skills || [],
                profileVisibility: dummyProfile.profileVisibility,
                emailNotifications: dummyProfile.emailNotifications,
            });

            setLoading(false);
        }, 1500);
    }, []);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Handle edit profile
    const handleEditProfile = () => {
        setIsEditing(true);
    };

    // Handle cancel edit
    const handleCancelEdit = () => {
        // Reset form data to original profile data
        setFormData({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            phone: profile.phone || '',
            location: profile.location || '',
            bio: profile.bio || '',
            education: profile.education || '',
            work: profile.work || '',
            githubUrl: profile.githubUrl || '',
            linkedinUrl: profile.linkedinUrl || '',
            websiteUrl: profile.websiteUrl || '',
            twitterUrl: profile.twitterUrl || '',
            skills: profile.skills || [],
            profileVisibility: profile.profileVisibility,
            emailNotifications: profile.emailNotifications,
        });
        setIsEditing(false);
    };

    // Handle save profile
    const handleSaveProfile = () => {
        // In a real app, this would make an API call to update the profile
        setProfile({
            ...profile,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            bio: formData.bio,
            education: formData.education,
            work: formData.work,
            githubUrl: formData.githubUrl,
            linkedinUrl: formData.linkedinUrl,
            websiteUrl: formData.websiteUrl,
            twitterUrl: formData.twitterUrl,
            skills: formData.skills,
            profileVisibility: formData.profileVisibility,
            emailNotifications: formData.emailNotifications,
        });

        setIsEditing(false);
        setSnackbar({
            open: true,
            message: 'Profile updated successfully!',
            severity: 'success'
        });
    };

    // Handle form changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle toggle changes
    const handleToggleChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked,
        });
    };

    // Handle notification settings change
    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setNotificationSettings({
            ...notificationSettings,
            [name]: checked,
        });
    };

    // Handle skill addition
    const handleAddSkill = (skill) => {
        if (skill && !formData.skills.includes(skill)) {
            setFormData({
                ...formData,
                skills: [...formData.skills, skill],
            });
        }
    };

    // Handle skill removal
    const handleRemoveSkill = (skill) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((s) => s !== skill),
        });
    };

    // Handle profile image change
    const handleProfileImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfile({
                    ...profile,
                    profileImage: e.target.result,
                });
            };
            reader.readAsDataURL(event.target.files[0]);

            setSnackbar({
                open: true,
                message: 'Profile picture updated successfully!',
                severity: 'success'
            });
        }
    };

    // Handle cover image change
    const handleCoverImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfile({
                    ...profile,
                    coverImage: e.target.result,
                });
            };
            reader.readAsDataURL(event.target.files[0]);

            setSnackbar({
                open: true,
                message: 'Cover image updated successfully!',
                severity: 'success'
            });
        }
    };

    // Handle change password form data change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value,
        });

        // Clear error for this field
        setPasswordError({
            ...passwordError,
            [name]: '',
        });
    };

    // Handle change password submit
    const handleChangePasswordSubmit = () => {
        const errors = {};

        // Validate current password
        if (!passwordData.currentPassword) {
            errors.currentPassword = 'Current password is required';
        }

        // Validate new password
        if (!passwordData.newPassword) {
            errors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 8) {
            errors.newPassword = 'Password must be at least 8 characters';
        }

        // Validate confirm password
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(errors).length > 0) {
            setPasswordError(errors);
            return;
        }

        // In a real app, this would make an API call to change the password
        // For now, just simulate success
        setChangePasswordDialogOpen(false);
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });

        setSnackbar({
            open: true,
            message: 'Password changed successfully!',
            severity: 'success'
        });
    };

    // Handle delete account confirmation
    const handleDeleteAccountConfirm = () => {
        // In a real app, this would make an API call to delete the account
        // For now, just simulate success and redirect to login page
        setDeleteAccountDialogOpen(false);

        setSnackbar({
            open: true,
            message: 'Account deleted successfully!',
            severity: 'info'
        });

        // Redirect to login after a delay
        setTimeout(() => {
            navigate('/login');
        }, 2000);
    };

    // Handle snackbar close
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    // Get random badge icon
    const getBadgeIcon = (iconName) => {
        switch (iconName) {
            case 'EmojiEvents':
                return <EmojiEvents />;
            case 'Code':
                return <Code />;
            case 'School':
                return <School />;
            default:
                return <StarOutline />;
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress size={60} sx={{ color: 'var(--theme-color)' }} />
            </Box>
        );
    }

    return (
        <MotionBox
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            sx={{
                maxWidth: '1600px',
                mx: 'auto',
            }}
        >
            {/* Profile header with cover image */}
            <MotionBox
                variants={itemVariants}
                sx={{
                    position: 'relative',
                    height: 200,
                    borderRadius: '24px',
                    overflow: 'hidden',
                    mb: 7,
                }}
            >
                {/* Cover Image */}
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${profile.coverImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                    }}
                >
                    {/* Cover image overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        }}
                    />

                    {/* Cover image edit button */}
                    {isEditing && (
                        <IconButton
                            color="primary"
                            aria-label="change cover image"
                            component="label"
                            sx={{
                                position: 'absolute',
                                bottom: 16,
                                right: 16,
                                bgcolor: 'white',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                },
                            }}
                        >
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={handleCoverImageChange}
                            />
                            <PhotoCamera />
                        </IconButton>
                    )}
                </Box>

                {/* Profile Image */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -50,
                        left: 32,
                        zIndex: 2,
                    }}
                >
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            isEditing ? (
                                <IconButton
                                    color="primary"
                                    aria-label="change profile picture"
                                    component="label"
                                    sx={{
                                        bgcolor: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        },
                                    }}
                                >
                                    <input
                                        hidden
                                        accept="image/*"
                                        type="file"
                                        onChange={handleProfileImageChange}
                                        ref={fileInputRef}
                                    />
                                    <AddAPhoto />
                                </IconButton>
                            ) : null
                        }
                    >
                        <Avatar
                            alt={`${profile.firstName} ${profile.lastName}`}
                            src={profile.profileImage}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '4px solid white',
                            }}
                        />
                    </Badge>
                </Box>

                {/* User Name and Membership */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -60,
                        left: 180,
                        zIndex: 1,
                    }}
                >
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                        {profile.firstName} {profile.lastName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            @{profile.username}
                        </Typography>
                        <Chip
                            label={profile.membershipLevel}
                            size="small"
                            sx={{
                                borderRadius: '4px',
                                bgcolor: theme.palette.warning.main,
                                color: 'white',
                                fontWeight: 'bold',
                            }}
                        />
                    </Box>
                </Box>

                {/* Actions */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -60,
                        right: 16,
                        zIndex: 1,
                    }}
                >
                    {!isEditing ? (
                        <Button
                            variant="contained"
                            startIcon={<Edit />}
                            onClick={handleEditProfile}
                            sx={{
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                                bgcolor: 'var(--theme-color)',
                                '&:hover': {
                                    bgcolor: 'var(--hover-color)',
                                },
                            }}
                        >
                            Edit Profile
                        </Button>
                    ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<Cancel />}
                                onClick={handleCancelEdit}
                                sx={{
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                onClick={handleSaveProfile}
                                sx={{
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    bgcolor: 'var(--theme-color)',
                                    '&:hover': {
                                        bgcolor: 'var(--hover-color)',
                                    },
                                }}
                            >
                                Save
                            </Button>
                        </Box>
                    )}
                </Box>
            </MotionBox>

            {/* Profile content with tabs */}
            <MotionPaper
                variants={itemVariants}
                sx={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    mb: 3,
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            minHeight: 48,
                        },
                        '& .Mui-selected': {
                            color: 'var(--theme-color)',
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'var(--theme-color)',
                        },
                    }}
                >
                    <Tab icon={<PersonOutline />} iconPosition="start" label="Profile" />
                    <Tab icon={<BadgeIcon />} iconPosition="start" label="Badges & Activity" />
                    <Tab icon={<Security />} iconPosition="start" label="Security" />
                    <Tab icon={<Notifications />} iconPosition="start" label="Notifications" />
                    <Tab icon={<Settings />} iconPosition="start" label="Settings" />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {/* Profile Tab */}
                    {activeTab === 0 && (
                        <Grid container spacing={3}>
                            {/* Left column - Basic Information */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Basic Information
                                </Typography>

                                {isEditing ? (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleFormChange}
                                                variant="outlined"
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Last Name"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleFormChange}
                                                variant="outlined"
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleFormChange}
                                                variant="outlined"
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleFormChange}
                                                variant="outlined"
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Location"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleFormChange}
                                                variant="outlined"
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={4}
                                                label="Bio"
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleFormChange}
                                                variant="outlined"
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <List disablePadding>
                                        <ListItem sx={{ px: 0, py: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <Email fontSize="small" color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2" fontWeight="medium">
                                                        Email
                                                    </Typography>
                                                }
                                                secondary={profile.email}
                                            />
                                        </ListItem>

                                        {profile.phone && (
                                            <ListItem sx={{ px: 0, py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <Phone fontSize="small" color="action" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2" fontWeight="medium">
                                                            Phone
                                                        </Typography>
                                                    }
                                                    secondary={profile.phone}
                                                />
                                            </ListItem>
                                        )}

                                        {profile.location && (
                                            <ListItem sx={{ px: 0, py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <LocationOn fontSize="small" color="action" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2" fontWeight="medium">
                                                            Location
                                                        </Typography>
                                                    }
                                                    secondary={profile.location}
                                                />
                                            </ListItem>
                                        )}

                                        <ListItem sx={{ px: 0, py: 1 }}>
                                            <ListItemIcon sx={{ minWidth: 36 }}>
                                                <CalendarToday fontSize="small" color="action" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body2" fontWeight="medium">
                                                        Joined
                                                    </Typography>
                                                }
                                                secondary={new Date(profile.joinDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            />
                                        </ListItem>

                                        {profile.bio && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                    Bio
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    {profile.bio}
                                                </Typography>
                                            </Box>
                                        )}
                                    </List>
                                )}

                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
                                    Background
                                </Typography>

                                {isEditing ? (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Education"
                                                name="education"
                                                value={formData.education}
                                                onChange={handleFormChange}
                                                variant="outlined"
                                                size="small"
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Work"
                                                name="work"
                                                value={formData.work}
                                                onChange={handleFormChange}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <List disablePadding>
                                        {profile.education && (
                                            <ListItem sx={{ px: 0, py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <School fontSize="small" color="action" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2" fontWeight="medium">
                                                            Education
                                                        </Typography>
                                                    }
                                                    secondary={profile.education}
                                                />
                                            </ListItem>
                                        )}

                                        {profile.work && (
                                            <ListItem sx={{ px: 0, py: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <Work fontSize="small" color="action" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2" fontWeight="medium">
                                                            Work
                                                        </Typography>
                                                    }
                                                    secondary={profile.work}
                                                />
                                            </ListItem>
                                        )}
                                    </List>
                                )}
                            </Grid>

                            {/* Right column - Social Links, Skills and Statistics */}
                            <Grid item xs={12} md={8}>
                                {/* Social Links */}
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Social Links
                                </Typography>

                                {isEditing ? (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="GitHub"
                                                name="githubUrl"
                                                value={formData.githubUrl}
                                                onChange={handleFormChange}
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <GitHub fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="LinkedIn"
                                                name="linkedinUrl"
                                                value={formData.linkedinUrl}
                                                onChange={handleFormChange}
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <LinkedIn fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Website"
                                                name="websiteUrl"
                                                value={formData.websiteUrl}
                                                onChange={handleFormChange}
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Language fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ mb: 2 }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Twitter"
                                                name="twitterUrl"
                                                value={formData.twitterUrl}
                                                onChange={handleFormChange}
                                                variant="outlined"
                                                size="small"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Twitter fontSize="small" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Grid container spacing={2}>
                                        {profile.githubUrl && (
                                            <Grid item xs={12} sm={6}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '12px',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            bgcolor: 'rgba(0, 0, 0, 0.8)',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <GitHub fontSize="small" />
                                                    </Avatar>
                                                    <Box sx={{ overflow: 'hidden' }}>
                                                        <Typography variant="body2" fontWeight="bold" noWrap>
                                                            GitHub
                                                        </Typography>
                                                        <Link
                                                            href={profile.githubUrl}
                                                            target="_blank"
                                                            rel="noopener"
                                                            color="primary"
                                                            sx={{
                                                                display: 'block',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                fontSize: '0.875rem',
                                                            }}
                                                        >
                                                            {profile.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}
                                                        </Link>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        )}

                                        {profile.linkedinUrl && (
                                            <Grid item xs={12} sm={6}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '12px',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            bgcolor: '#0077B5',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <LinkedIn fontSize="small" />
                                                    </Avatar>
                                                    <Box sx={{ overflow: 'hidden' }}>
                                                        <Typography variant="body2" fontWeight="bold" noWrap>
                                                            LinkedIn
                                                        </Typography>
                                                        <Link
                                                            href={profile.linkedinUrl}
                                                            target="_blank"
                                                            rel="noopener"
                                                            color="primary"
                                                            sx={{
                                                                display: 'block',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                fontSize: '0.875rem',
                                                            }}
                                                        >
                                                            {profile.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}
                                                        </Link>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        )}

                                        {profile.websiteUrl && (
                                            <Grid item xs={12} sm={6}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '12px',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            bgcolor: 'var(--theme-color)',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <Language fontSize="small" />
                                                    </Avatar>
                                                    <Box sx={{ overflow: 'hidden' }}>
                                                        <Typography variant="body2" fontWeight="bold" noWrap>
                                                            Website
                                                        </Typography>
                                                        <Link
                                                            href={profile.websiteUrl}
                                                            target="_blank"
                                                            rel="noopener"
                                                            color="primary"
                                                            sx={{
                                                                display: 'block',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                fontSize: '0.875rem',
                                                            }}
                                                        >
                                                            {profile.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')}
                                                        </Link>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        )}

                                        {profile.twitterUrl && (
                                            <Grid item xs={12} sm={6}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '12px',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            bgcolor: '#1DA1F2',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <Twitter fontSize="small" />
                                                    </Avatar>
                                                    <Box sx={{ overflow: 'hidden' }}>
                                                        <Typography variant="body2" fontWeight="bold" noWrap>
                                                            Twitter
                                                        </Typography>
                                                        <Link
                                                            href={profile.twitterUrl}
                                                            target="_blank"
                                                            rel="noopener"
                                                            color="primary"
                                                            sx={{
                                                                display: 'block',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                fontSize: '0.875rem',
                                                            }}
                                                        >
                                                            {profile.twitterUrl.replace(/^https?:\/\/(www\.)?/, '')}
                                                        </Link>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}

                                {/* Skills */}
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
                                    Skills
                                </Typography>

                                {isEditing ? (
                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                            {formData.skills.map((skill, index) => (
                                                <Chip
                                                    key={index}
                                                    label={skill}
                                                    onDelete={() => handleRemoveSkill(skill)}
                                                    sx={{ borderRadius: '8px' }}
                                                />
                                            ))}
                                        </Box>
                                        <TextField
                                            fullWidth
                                            label="Add a skill"
                                            variant="outlined"
                                            size="small"
                                            placeholder="Type a skill and press Enter"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAddSkill(e.target.value);
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {profile.skills.map((skill, index) => (
                                            <Chip
                                                key={index}
                                                label={skill}
                                                variant="outlined"
                                                sx={{ borderRadius: '8px' }}
                                            />
                                        ))}
                                    </Box>
                                )}

                                {/* Statistics */}
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
                                    Competition Statistics
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={6} sm={3}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                textAlign: 'center',
                                                height: '100%',
                                            }}
                                        >
                                            <Typography variant="h4" fontWeight="bold" color="var(--theme-color)">
                                                {profile.statistics.totalCompetitions}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Competitions
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                textAlign: 'center',
                                                height: '100%',
                                            }}
                                        >
                                            <Typography variant="h4" fontWeight="bold" color="var(--theme-color)">
                                                {profile.statistics.competitionsWon}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Wins
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                textAlign: 'center',
                                                height: '100%',
                                            }}
                                        >
                                            <Typography variant="h4" fontWeight="bold" color="var(--theme-color)">
                                                {profile.statistics.averageScore}%
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Avg. Score
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={6} sm={3}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: '12px',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                textAlign: 'center',
                                                height: '100%',
                                            }}
                                        >
                                            <Typography variant="h4" fontWeight="bold" color="var(--theme-color)">
                                                #{profile.statistics.bestRank}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Best Rank
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                    {/* Badges & Activity Tab */}
                    {activeTab === 1 && (
                        <Grid container spacing={3}>
                            {/* Badges */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Earned Badges
                                </Typography>

                                {profile.badges.length === 0 ? (
                                    <Box
                                        sx={{
                                            p: 4,
                                            borderRadius: '12px',
                                            border: '1px dashed',
                                            borderColor: 'divider',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Typography variant="body1" color="text.secondary">
                                            You haven't earned any badges yet.
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            Participate in competitions to earn badges!
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}>
                                        {profile.badges.map((badge) => (
                                            <Grid item xs={12} key={badge.id}>
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: '12px',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                bgcolor: 'var(--theme-color)',
                                                                mr: 2,
                                                            }}
                                                        >
                                                            {getBadgeIcon(badge.icon)}
                                                        </Avatar>
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography variant="subtitle1" fontWeight="bold">
                                                                {badge.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {badge.description}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(badge.date).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })}
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Grid>

                            {/* Activity Log */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Activity Log
                                </Typography>

                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        maxHeight: 400,
                                        overflow: 'auto',
                                    }}
                                >
                                    {profile.activityLog.map((activity, index) => (
                                        <Box
                                            key={activity.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                mb: index < profile.activityLog.length - 1 ? 3 : 0,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mr: 2,
                                                    bgcolor: activity.type === 'competition'
                                                        ? 'rgba(var(--theme-color-rgb), 0.1)'
                                                        : activity.type === 'badge'
                                                            ? 'rgba(255, 152, 0, 0.1)'
                                                            : 'rgba(25, 118, 210, 0.1)',
                                                    color: activity.type === 'competition'
                                                        ? 'var(--theme-color)'
                                                        : activity.type === 'badge'
                                                            ? theme.palette.warning.main
                                                            : theme.palette.primary.main,
                                                }}
                                            >
                                                {activity.type === 'competition' && <Code fontSize="small" />}
                                                {activity.type === 'badge' && <EmojiEvents fontSize="small" />}
                                                {activity.type === 'profile' && <PersonOutline fontSize="small" />}
                                            </Box>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="body2" fontWeight="medium">
                                                    {activity.action}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(activity.date).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>

                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Button
                                        variant="text"
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            color: 'var(--theme-color)',
                                        }}
                                    >
                                        View Full Activity Log
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    {/* Security Tab */}
                    {activeTab === 2 && (
                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Account Security
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            mb: 3,
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            Password
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            It's a good idea to use a strong password that you're not using elsewhere
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<Lock />}
                                            onClick={() => setChangePasswordDialogOpen(true)}
                                            sx={{
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                bgcolor: 'var(--theme-color)',
                                                '&:hover': {
                                                    bgcolor: 'var(--hover-color)',
                                                },
                                            }}
                                        >
                                            Change Password
                                        </Button>
                                    </Paper>

                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            Two-Factor Authentication
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            Add an extra layer of security to your account by requiring a verification code
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<Security />}
                                            sx={{
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Enable 2FA
                                        </Button>
                                    </Paper>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            mb: 3,
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                            Login Sessions
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            These are devices that have logged into your account
                                        </Typography>
                                        <List disablePadding>
                                            <ListItem sx={{ px: 0, py: 1 }}>
                                                <ListItemText
                                                    primary="Current Device"
                                                    secondary="Windows 10 • Chrome • Delhi, India"
                                                />
                                                <Chip
                                                    label="Current"
                                                    size="small"
                                                    color="success"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </ListItem>
                                            <Divider component="li" />
                                            <ListItem sx={{ px: 0, py: 1 }}>
                                                <ListItemText
                                                    primary="Mobile Device"
                                                    secondary="iOS 15 • Safari • Delhi, India"
                                                />
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    sx={{ textTransform: 'none', fontWeight: 600 }}
                                                >
                                                    Logout
                                                </Button>
                                            </ListItem>
                                        </List>
                                    </Paper>

                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }}
                                    >
                                        <Typography variant="subtitle1" fontWeight="bold" color="error" gutterBottom>
                                            Danger Zone
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            Permanently delete your account and all of your content
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<Delete />}
                                            onClick={() => setDeleteAccountDialogOpen(true)}
                                            sx={{
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Delete Account
                                        </Button>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 3 && (
                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Notification Settings
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Manage how you receive notifications from Code-Quest
                            </Typography>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    mb: 3,
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Email Notifications
                                </Typography>

                                <List disablePadding>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="New Competitions"
                                            secondary="Get notified when new competitions are available"
                                        />
                                        <Switch
                                            checked={notificationSettings.newCompetitions}
                                            onChange={(e) => handleNotificationChange(e)}
                                            name="newCompetitions"
                                            color="primary"
                                        />
                                    </ListItem>
                                    <Divider component="li" />

                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Results Published"
                                            secondary="Get notified when competition results are published"
                                        />
                                        <Switch
                                            checked={notificationSettings.resultPublished}
                                            onChange={(e) => handleNotificationChange(e)}
                                            name="resultPublished"
                                            color="primary"
                                        />
                                    </ListItem>
                                    <Divider component="li" />

                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Competition Reminders"
                                            secondary="Get reminded before competitions you've joined"
                                        />
                                        <Switch
                                            checked={notificationSettings.reminders}
                                            onChange={(e) => handleNotificationChange(e)}
                                            name="reminders"
                                            color="primary"
                                        />
                                    </ListItem>
                                    <Divider component="li" />

                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="System Updates"
                                            secondary="Get notified about platform updates and maintenance"
                                        />
                                        <Switch
                                            checked={notificationSettings.systemUpdates}
                                            onChange={(e) => handleNotificationChange(e)}
                                            name="systemUpdates"
                                            color="primary"
                                        />
                                    </ListItem>
                                </List>
                            </Paper>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Marketing Communications
                                </Typography>

                                <List disablePadding>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Weekly Newsletter"
                                            secondary="Receive our weekly newsletter with programming tips"
                                        />
                                        <Switch
                                            checked={notificationSettings.weeklyNewsletter}
                                            onChange={(e) => handleNotificationChange(e)}
                                            name="weeklyNewsletter"
                                            color="primary"
                                        />
                                    </ListItem>
                                    <Divider component="li" />

                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Promotional Emails"
                                            secondary="Receive emails about special offers and promotions"
                                        />
                                        <Switch
                                            checked={notificationSettings.marketingEmails}
                                            onChange={(e) => handleNotificationChange(e)}
                                            name="marketingEmails"
                                            color="primary"
                                        />
                                    </ListItem>
                                </List>
                            </Paper>

                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setSnackbar({
                                            open: true,
                                            message: 'Notification settings saved successfully!',
                                            severity: 'success'
                                        });
                                    }}
                                    sx={{
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        bgcolor: 'var(--theme-color)',
                                        '&:hover': {
                                            bgcolor: 'var(--hover-color)',
                                        },
                                        px: 4,
                                    }}
                                >
                                    Save Notification Settings
                                </Button>
                            </Box>
                        </Box>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 4 && (
                        <Box>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Account Settings
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Manage your account settings and privacy preferences
                            </Typography>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    mb: 3,
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Privacy Settings
                                </Typography>

                                <List disablePadding>
                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Profile Visibility"
                                            secondary="Make your profile visible to other users"
                                        />
                                        <Switch
                                            checked={formData.profileVisibility}
                                            onChange={handleToggleChange}
                                            name="profileVisibility"
                                            color="primary"
                                        />
                                    </ListItem>
                                    <Divider component="li" />

                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Show Results on Leaderboards"
                                            secondary="Display your results on public leaderboards"
                                        />
                                        <Switch
                                            defaultChecked
                                            color="primary"
                                        />
                                    </ListItem>
                                    <Divider component="li" />

                                    <ListItem sx={{ px: 0, py: 1 }}>
                                        <ListItemText
                                            primary="Show Activity Status"
                                            secondary="Show when you're active on the platform"
                                        />
                                        <Switch
                                            defaultChecked
                                            color="primary"
                                        />
                                    </ListItem>
                                </List>
                            </Paper>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    mb: 3,
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Preferences
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                Theme
                                            </Typography>
                                            <Select
                                                defaultValue="system"
                                                sx={{
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: 'rgba(0,0,0,0.1)',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="light">Light</MenuItem>
                                                <MenuItem value="dark">Dark</MenuItem>
                                                <MenuItem value="system">System Default</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                Language
                                            </Typography>
                                            <Select
                                                defaultValue="en"
                                                sx={{
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: 'rgba(0,0,0,0.1)',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="en">English</MenuItem>
                                                <MenuItem value="hi">Hindi</MenuItem>
                                                <MenuItem value="es">Spanish</MenuItem>
                                                <MenuItem value="fr">French</MenuItem>
                                                <MenuItem value="zh">Chinese</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                Time Zone
                                            </Typography>
                                            <Select
                                                defaultValue="IST"
                                                sx={{
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: 'rgba(0,0,0,0.1)',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="UTC">UTC (Coordinated Universal Time)</MenuItem>
                                                <MenuItem value="IST">IST (India Standard Time)</MenuItem>
                                                <MenuItem value="PST">PST (Pacific Standard Time)</MenuItem>
                                                <MenuItem value="EST">EST (Eastern Standard Time)</MenuItem>
                                                <MenuItem value="GMT">GMT (Greenwich Mean Time)</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: '16px',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Editor Preferences
                                </Typography>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                Default Editor Theme
                                            </Typography>
                                            <Select
                                                defaultValue="vs-dark"
                                                sx={{
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: 'rgba(0,0,0,0.1)',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="vs-dark">Dark</MenuItem>
                                                <MenuItem value="vs-light">Light</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                Default Programming Language
                                            </Typography>
                                            <Select
                                                defaultValue="javascript"
                                                sx={{
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: 'rgba(0,0,0,0.1)',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="javascript">JavaScript</MenuItem>
                                                <MenuItem value="python">Python</MenuItem>
                                                <MenuItem value="java">Java</MenuItem>
                                                <MenuItem value="cpp">C++</MenuItem>
                                                <MenuItem value="csharp">C#</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth variant="outlined" size="small">
                                            <Typography variant="body2" fontWeight="medium" gutterBottom>
                                                Font Size
                                            </Typography>
                                            <Select
                                                defaultValue="14"
                                                sx={{
                                                    borderRadius: '8px',
                                                    '& fieldset': {
                                                        borderColor: 'rgba(0,0,0,0.1)',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="12">12px</MenuItem>
                                                <MenuItem value="14">14px</MenuItem>
                                                <MenuItem value="16">16px</MenuItem>
                                                <MenuItem value="18">18px</MenuItem>
                                                <MenuItem value="20">20px</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body2" fontWeight="medium" gutterBottom>
                                            Code Editor Settings
                                        </Typography>
                                        <FormControlLabel
                                            control={<Checkbox defaultChecked color="primary" />}
                                            label="Enable line numbers"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox defaultChecked color="primary" />}
                                            label="Enable code auto-completion"
                                        />
                                        <FormControlLabel
                                            control={<Checkbox defaultChecked color="primary" />}
                                            label="Word wrap"
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        setSnackbar({
                                            open: true,
                                            message: 'Settings saved successfully!',
                                            severity: 'success'
                                        });
                                    }}
                                    sx={{
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        bgcolor: 'var(--theme-color)',
                                        '&:hover': {
                                            bgcolor: 'var(--hover-color)',
                                        },
                                        px: 4,
                                    }}
                                >
                                    Save Settings
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </MotionPaper>

            {/* Change Password Dialog */}
            <Dialog
                open={changePasswordDialogOpen}
                onClose={() => setChangePasswordDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        maxWidth: 480,
                    },
                }}
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Lock sx={{ mr: 1, color: 'var(--theme-color)' }} />
                        Change Password
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 3 }}>
                        Please enter your current password and a new password to update your account security.
                    </DialogContentText>

                    <TextField
                        fullWidth
                        margin="dense"
                        label="Current Password"
                        name="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        error={!!passwordError.currentPassword}
                        helperText={passwordError.currentPassword}
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
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        margin="dense"
                        label="New Password"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        error={!!passwordError.newPassword}
                        helperText={passwordError.newPassword}
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
                        sx={{ mb: 2 }}
                    />

                    <TextField
                        fullWidth
                        margin="dense"
                        label="Confirm New Password"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        error={!!passwordError.confirmPassword}
                        helperText={passwordError.confirmPassword}
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

                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Password requirements:
                        </Typography>
                        <Typography variant="body2">
                            • Minimum 8 characters<br />
                            • At least one uppercase letter<br />
                            • At least one number<br />
                            • At least one special character
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setChangePasswordDialogOpen(false)}
                        variant="outlined"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleChangePasswordSubmit}
                        variant="contained"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            bgcolor: 'var(--theme-color)',
                            '&:hover': {
                                bgcolor: 'var(--hover-color)',
                            },
                        }}
                    >
                        Update Password
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Account Dialog */}
            <Dialog
                open={deleteAccountDialogOpen}
                onClose={() => setDeleteAccountDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                    },
                }}
            >
                <DialogTitle sx={{ color: theme.palette.error.main }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Error sx={{ mr: 1 }} />
                        Delete Account
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data will be permanently deleted.
                    </DialogContentText>
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: '8px',
                            bgcolor: 'rgba(244, 67, 54, 0.05)',
                            border: '1px solid rgba(244, 67, 54, 0.1)'
                        }}
                    >
                        <Typography variant="subtitle2" color="error" gutterBottom>
                            You will lose:
                        </Typography>
                        <Typography variant="body2">
                            • All your competition history and results<br />
                            • Badges and achievements<br />
                            • Profile information<br />
                            • Access to any premium content
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => setDeleteAccountDialogOpen(false)}
                        variant="outlined"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteAccountConfirm}
                        variant="contained"
                        color="error"
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Delete Account
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success/Error Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MotionBox>
    );
};

export default Profile;

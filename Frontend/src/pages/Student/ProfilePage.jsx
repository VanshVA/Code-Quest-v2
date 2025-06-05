import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
  useTheme,
  Stack,
  Chip,
  alpha,
  Tooltip,
  useMediaQuery,
  Badge,
  LinearProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  EmojiEvents as TrophyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Assignment as AssignmentIcon,
  AccessTime as ClockIcon,
  VerifiedUser as VerifiedIcon,
  Grade as GradeIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowIcon,
  History as HistoryIcon,
  Sync as SyncIcon,
  Assignment,
  Refresh,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dashboardService from '../../services/dashboardService';
import toast, { Toaster } from 'react-hot-toast';

// Create motion variants for animations
const MotionContainer = motion(Container);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);
const MotionBox = motion(Box);
const MotionAvatar = motion(Avatar);

const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDark = theme.palette.mode === "dark";

  // Profile state
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    studentFirstName: "",
    studentLastName: "",
    studentEmail: "",
    studentImage: "",
    grade: "",
    school: "",
  });

  // Stats state
  const [stats, setStats] = useState({
    competitionsCount: 0,
    completedCompetitionsCount: 0,
    bestPerformance: 0,
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Password dialog state
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const popIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, delay: 0.1 },
    },
    hover: {
      y: -8,
      boxShadow: "0px 10px 25px rgba(0,0,0,0.15)",
      transition: { duration: 0.3 },
    },
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  // Fetch student profile
  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // Use dashboardService to fetch profile data
      const response = await dashboardService.getProfile();
      
      if (response.success) {
        // Get the student data from the response
        const studentData = response.data;
        console.log("Fetched student data:", studentData);
        setProfile(studentData);
        setFormData({
          studentFirstName: studentData.studentFirstName || "",
          studentLastName: studentData.studentLastName || "",
          studentEmail: studentData.studentEmail || "",
          studentImage: studentData.studentImage || "",
          grade: studentData.grade || "",
          school: studentData.school || "",
        });

        // Set statistics if available
        if (studentData.stats) {
          setStats({
            competitionsCount: studentData.stats.competitionsCount || 0,
            completedCompetitionsCount: studentData.stats.completedCompetitionsCount || 0,
            bestPerformance: studentData.stats.bestPerformance || 0,
          });
        }
      } else {
        throw new Error(response.message || "Failed to load profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please refresh and try again.");

      // If unauthorized, redirect to login
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfile().then(() => {
      setTimeout(() => {
        setRefreshing(false);
        toast.success("Profile refreshed");
      }, 800);
    });
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle password input change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error for this field if any
    if (passwordErrors[name]) {
      setPasswordErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
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
        setProfile((prevProfile) => ({
          ...prevProfile,
          ...updatedStudentData,
        }));

        // Show success notification
        toast.success("Profile updated successfully");

        // Exit edit mode
        setIsEditing(false);
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);

      toast.error(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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
        newPassword: passwordData.newPassword,
      });

      if (response.success) {
        // Close dialog and reset form
        setPasswordDialog(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Show success notification
        toast.success("Password updated successfully");
      } else {
        throw new Error(response.message || "Failed to update password");
      }
    } catch (err) {
      console.error("Error updating password:", err);

      // Handle common errors
      if (
        err.response?.data?.message?.includes("incorrect") ||
        err.message?.includes("incorrect")
      ) {
        setPasswordErrors({
          ...passwordErrors,
          currentPassword: "Current password is incorrect",
        });
      } else {
        toast.error(err.response?.data?.message || err.message || "Failed to update password");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{
      backgroundColor: isDark ? 'background.default' : '#f7f9fc',
      minHeight: '100vh',
      pb: 4
    }}

    >
      {/* Toast Container */}
      <Toaster position="top-center" />
      
      <Box sx={{ py: 0 }}>
        {/* Welcome Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          sx={{
            mb: 4,
            bgcolor: isDark ? "rgba(9, 9, 9, 0.67)" : "primary.main",
            borderRadius: 2,
            p: 5,
            boxShadow: isDark ? "0 4px 14px rgba(0,0,0,0.2)" : "none",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  mb: 1,
                  color: isDark ? " #f47061" : " white",
                }}
              >
                Welcome to Profile Page
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track your progress, join competitions, and improve your coding
                skills.
              </Typography>

              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Assignment />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                  }}
                  onClick={() => navigate("/student/competitions")}
                >
                  Browse Competitions
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    color: " white",
                    borderColor: " white",
                    px: 3,
                    py: 1.2,
                  }}
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </MotionBox>

        {error ? (
          <Alert
            severity="error"
            variant="filled"
            sx={{
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {/* Profile Card */}
            <Grid item xs={12} md={4}>
              <MotionCard
                elevation={3}
                variants={popIn}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Header accent color */}
                <Box
                  sx={{
                    height: 6,
                    width: "100%",
                    bgcolor: "primary.main",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                />

                <CardContent sx={{ p: 4, pt: 5 }}>
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <MotionAvatar
                      src={profile?.studentImage}
                      alt={profile?.studentFirstName}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 100,
                      }}
                      sx={{
                        width: 130,
                        height: 130,
                        mx: "auto",
                        mb: 2,
                        border: "4px solid",
                        borderColor: "primary.main",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                      }}
                    >
                      {profile?.studentFirstName?.charAt(0)}
                    </MotionAvatar>
                    <MotionTypography
                      variant="h5"
                      fontWeight="bold"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {profile?.studentFirstName} {profile?.studentLastName}
                    </MotionTypography>
                    <MotionTypography
                      variant="body2"
                      color="text.secondary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {profile?.studentEmail}
                    </MotionTypography>
                    <MotionBox
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Chip
                        label="Student"
                        color="primary"
                        size="small"
                        icon={<SchoolIcon />}
                        sx={{
                          mt: 1,
                          fontWeight: 600,
                          px: 1,
                        }}
                      />
                    </MotionBox>
                  </Box>

                  <Divider sx={{ mb: 3 }} />
                  {/* Action Buttons */}
                  <Box>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => setIsEditing(true)}
                      disabled={isEditing}
                      sx={{
                        borderRadius: 2,
                        mb: 2,
                        py: 1.2,
                        fontWeight: 600,
                        boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
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
                        borderRadius: 2,
                        py: 1.2,
                        fontWeight: 600,
                        borderWidth: 2,
                        "&:hover": {
                          borderWidth: 2,
                        },
                      }}
                    >
                      Change Password
                    </Button>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>

            {/* Profile Details and Quick Actions side by side */}
            <Grid item xs={12} md={8}>
              <MotionCard
                elevation={3}
                variants={popIn}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 0.1 }}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "relative",
                  height: "100%",
                }}
              >
                {/* Header accent color */}
                <Box
                  sx={{
                    height: 6,
                    width: "100%",
                    bgcolor: "secondary.main",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  }}
                />

                <CardContent sx={{ p: 4, pt: 5, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold">
                      {isEditing ? "Edit Profile" : "Profile Information"}
                    </Typography>

                    {isEditing && (
                      <Button
                        variant="outlined"
                        color="inherit"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            studentFirstName: profile?.studentFirstName || "",
                            studentLastName: profile?.studentLastName || "",
                            studentEmail: profile?.studentEmail || "",
                            studentImage: profile?.studentImage || "",
                          });
                        }}
                        sx={{
                          borderRadius: 2,
                          fontWeight: 500,
                          textTransform: "none",
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Main content area with Profile Details and Quick Actions side by side */}
                  <Grid container spacing={4}>
                    {/* Profile Details - Vertical layout */}
                    <Grid item xs={12} md={7}>
                      {isEditing ? (
                        // Edit Form - Vertical layout
                        <MotionBox
                          component="form"
                          variants={staggerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Stack spacing={3}>
                            <MotionBox variants={listItemVariants}>
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
                                  sx: { borderRadius: 2 },
                                }}
                              />
                            </MotionBox>
                            <MotionBox variants={listItemVariants}>
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
                                  sx: { borderRadius: 2 },
                                }}
                              />
                            </MotionBox>
                            <MotionBox variants={listItemVariants}>
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
                                      <EmailIcon color="action" />
                                    </InputAdornment>
                                  ),
                                  sx: { borderRadius: 2 },
                                }}
                              />
                            </MotionBox>
                            <MotionBox variants={listItemVariants}>
                              <TextField
                                fullWidth
                                label="Profile Image URL"
                                name="studentImage"
                                value={formData.studentImage}
                                onChange={handleChange}
                                placeholder="Enter URL to your profile image"
                                helperText="Leave blank to use default avatar"
                                InputProps={{
                                  sx: { borderRadius: 2 },
                                }}
                              />
                            </MotionBox>
                            {formData.studentImage && (
                              <MotionBox
                                variants={listItemVariants}
                                sx={{ textAlign: "center" }}
                              >
                                <Avatar
                                  src={formData.studentImage}
                                  alt="Preview"
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    mx: "auto",
                                    mb: 1,
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Image Preview
                                </Typography>
                              </MotionBox>
                            )}
                            <MotionBox
                              variants={listItemVariants}
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={
                                  saving ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    <SaveIcon />
                                  )
                                }
                                onClick={handleSubmit}
                                disabled={saving}
                                sx={{
                                  borderRadius: 2,
                                  px: 4,
                                  py: 1.2,
                                  fontWeight: 600,
                                  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                                }}
                              >
                                {saving ? "Saving..." : "Save Changes"}
                              </Button>
                            </MotionBox>
                          </Stack>
                        </MotionBox>
                      ) : (
                        // Display Profile - Vertical layout
                        <MotionBox
                          variants={staggerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <Stack spacing={3}>
                            <MotionBox variants={listItemVariants}>
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: isDark
                                    ? alpha(
                                      theme.palette.background.default,
                                      0.3
                                    )
                                    : alpha(
                                      theme.palette.background.default,
                                      0.5
                                    ),
                                  border: `1px solid ${isDark
                                    ? alpha(theme.palette.common.white, 0.05)
                                    : alpha(theme.palette.common.black, 0.05)
                                    }`,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  First Name
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {profile?.studentFirstName || "Not specified"}
                                </Typography>
                              </Box>
                            </MotionBox>
                            <MotionBox variants={listItemVariants}>
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: isDark
                                    ? alpha(
                                      theme.palette.background.default,
                                      0.3
                                    )
                                    : alpha(
                                      theme.palette.background.default,
                                      0.5
                                    ),
                                  border: `1px solid ${isDark
                                    ? alpha(theme.palette.common.white, 0.05)
                                    : alpha(theme.palette.common.black, 0.05)
                                    }`,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  Last Name
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {profile?.studentLastName || "Not specified"}
                                </Typography>
                              </Box>
                            </MotionBox>
                            <MotionBox variants={listItemVariants}>
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: isDark
                                    ? alpha(
                                      theme.palette.background.default,
                                      0.3
                                    )
                                    : alpha(
                                      theme.palette.background.default,
                                      0.5
                                    ),
                                  border: `1px solid ${isDark
                                    ? alpha(theme.palette.common.white, 0.05)
                                    : alpha(theme.palette.common.black, 0.05)
                                    }`,
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  Email Address
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                  {profile?.studentEmail || "Not specified"}
                                </Typography>
                              </Box>
                            </MotionBox>
                            <MotionBox variants={listItemVariants}>
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  bgcolor: isDark
                                    ? alpha(
                                      theme.palette.background.default,
                                      0.3
                                    )
                                    : alpha(
                                      theme.palette.background.default,
                                      0.5
                                    ),
                                  border: `1px solid ${isDark
                                    ? alpha(theme.palette.common.white, 0.05)
                                    : alpha(theme.palette.common.black, 0.05)
                                    }`,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Box sx={{ flexGrow: 1 }}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    Account Created
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    fontWeight="medium"
                                  >
                                    {new Date(
                                      profile?.registerTime
                                    ).toLocaleDateString("en-IN", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </Typography>
                                </Box>
                                <CalendarIcon color="action" />
                              </Box>
                            </MotionBox>
                          </Stack>
                        </MotionBox>
                      )}
                    </Grid>

                    {/* Quick Actions - Vertical layout */}
                    <Grid item xs={12} md={5}>
                      <MotionBox
                        variants={staggerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ mb: 2 }}
                        >
                          Quick Actions
                        </Typography>
                        <Stack spacing={2}>
                          <MotionBox variants={listItemVariants}>
                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              startIcon={<TrophyIcon />}
                              onClick={() => navigate("/student/competitions")}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                justifyContent: "flex-start",
                                height: "100%",
                                textTransform: "none",
                                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                                fontWeight: 600,
                              }}
                            >
                              <Box sx={{ textAlign: "left" }}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  Join Competitions
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ opacity: 0.9, mt: 0.5 }}
                                >
                                  Browse and join available competitions
                                </Typography>
                              </Box>
                            </Button>
                          </MotionBox>
                          <MotionBox variants={listItemVariants}>
                            <Button
                              fullWidth
                              variant="outlined"
                              color="secondary"
                              startIcon={<AssignmentIcon />}
                              onClick={() => navigate("/student/results")}
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                justifyContent: "flex-start",
                                borderWidth: 2,
                                height: "100%",
                                textTransform: "none",
                                fontWeight: 600,
                              }}
                            >
                              <Box sx={{ textAlign: "left" }}>
                                <Typography
                                  variant="subtitle1"
                                  fontWeight="bold"
                                >
                                  View Results
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mt: 0.5 }}
                                >
                                  See your competition results
                                </Typography>
                              </Box>
                            </Button>
                          </MotionBox>
                        </Stack>
                      </MotionBox>
                    </Grid>
                  </Grid>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialog}
        onClose={() => !saving && setPasswordDialog(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Change Password</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, width: { sm: "400px" } }}>
            <TextField
              fullWidth
              margin="normal"
              label="Current Password"
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.currentPassword}
              helperText={passwordErrors.currentPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle current password visibility"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      edge="end"
                    >
                      {showCurrentPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="New Password"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.newPassword}
              helperText={
                passwordErrors.newPassword ||
                "Password must be at least 6 characters"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm New Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setPasswordDialog(false)}
            color="inherit"
            disabled={saving}
            sx={{
              textTransform: "none",
              fontWeight: 500,
            }}
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
              borderRadius: 2,
              py: 1,
              px: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {saving ? "Updating..." : "Update Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfilePage;

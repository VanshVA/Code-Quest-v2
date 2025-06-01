import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
  Alert,
  alpha,
  Skeleton,
} from "@mui/material";
import {
  AccessTime,
  Timer,
  School,
  Event,
  EmojiEvents,
  CheckCircle,
  CalendarToday,
  Description,
  Category,
  Person,
  Leaderboard,
  PlayArrow,
  ArrowBack,
  Star,
  Flag,
  Info,
  InfoOutlined,
  VerifiedUser,
  SportsScore,
  MenuBook,
  PeopleOutline,
  QueryStats,
  TrendingUp,
  LightbulbOutlined,
  Share,
  BookmarkBorder,
  Bookmark,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import dashboardService from "../../services/dashboardService";

// Constants for current UTC time and user login

// Motion components
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionTypography = motion(Typography);
const MotionCard = motion(Card);

const CompetitionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [competition, setCompetition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scoreVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  useEffect(() => {
    fetchCompetitionDetails();

    // When component mounts, trigger score animation after a delay
    const timer = setTimeout(() => {
      setAnimateScore(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  const fetchCompetitionDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getCompetitionOverview(id);

      if (response.success) {
        console.log("Competition data:", response.data.competition);
        setCompetition(response.data.competition);
      } else {
        setError(response.message || "Failed to load competition details");
      }
    } catch (error) {
      setError("Error loading competition details. Please try again later.");
      console.error("Error fetching competition details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCompetition = async () => {
    try {
      setJoining(true);
      setError(null);
      const response = await dashboardService.joinCompetition(id);

      if (response.success) {
        // Show join success message
        setJoinSuccess(true);

        // In the updated API, after joining we should fetch updated competition details
        await fetchCompetitionDetails();

        // Automatically navigate to the exam page after successful join
        setTimeout(() => {
          navigate(`/student/competitions/${id}/exam`);
        }, 1500); // Wait 1.5 seconds before redirecting to give feedback
      } else {
        setError(response.message || "Failed to join competition");
      }
    } catch (error) {
      setError("Error joining competition. Please try again.");
      console.error("Error joining competition:", error);
    } finally {
      setJoining(false);
    }
  };

  const handleStartCompetition = () => {
    navigate(`/student/competitions/${id}/exam`);
  };

  const handleViewResults = () => {
    navigate(`/student/competitions/${id}/results`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you would call an API to save this preference
  };

  // Format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";

    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format remaining time in a more readable format
  const formatTimeRemaining = (timeInfo) => {
    if (!timeInfo || !timeInfo.formattedTime) return null;

    const parts = timeInfo.formattedTime.split(":");
    if (parts.length !== 3) return timeInfo.formattedTime;

    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseInt(parts[2]);

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s remaining`;
    } else {
      return `${seconds}s remaining`;
    }
  };

  // Render difficulty badge with appropriate color
  const renderDifficultyBadge = (difficulty) => {
    if (!difficulty) return null;

    const color =
      difficulty.toLowerCase() === "easy"
        ? "#4caf50"
        : difficulty.toLowerCase() === "medium"
        ? "#ff9800"
        : difficulty.toLowerCase() === "hard"
        ? "#f44336"
        : "#757575";

    return (
      <Chip
        label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        sx={{
          fontWeight: 600,
          color: "white",
          bgcolor: color,
          "& .MuiChip-label": { px: 1 },
        }}
      />
    );
  };

  // Determine competition status and appropriate buttons
  const renderActionButtons = () => {
    if (!competition) return null;

    const isJoined = competition.participation?.isJoined;
    const isSubmitted = competition.participation?.isSubmitted;
    const canJoin = competition.permissions?.canJoin;
    const canSubmit = competition.permissions?.canSubmit;
    const canViewResults = competition.permissions?.canViewResults;
    const status = competition.status;

    return (
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mt: { xs: 2, md: 0 }, width: { xs: "100%", sm: "auto" } }}
      >
        {/* Join Button */}
        {!isJoined && canJoin && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleJoinCompetition}
            disabled={joining}
            startIcon={
              joining ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <PlayArrow />
              )
            }
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: "8px",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {joining ? "Joining..." : "Join Competition"}
          </Button>
        )}

        {/* Start/Continue Competition Button */}
        {isJoined && !isSubmitted && canSubmit && (
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStartCompetition}
            startIcon={<PlayArrow />}
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: "8px",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {status === "active" ? "Enter Competition" : "Continue Competition"}
          </Button>
        )}

        {/* View Results Button */}
        {(isSubmitted || canViewResults) && (
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleViewResults}
            startIcon={<QueryStats />}
            sx={{
              py: 1.2,
              px: 3,
              borderRadius: "8px",
              fontWeight: 600,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
                transform: "translateY(-2px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            View Results
            {competition.score?.percentage !== undefined && (
              <Chip
                label={`${competition.score.percentage}%`}
                color={
                  competition.score.percentage >= 70 ? "success" : "default"
                }
                size="small"
                sx={{ ml: 1, fontWeight: 600 }}
              />
            )}
          </Button>
        )}
      </Stack>
    );
  };

  // Calculate and render time status
  const renderTimeStatus = () => {
    if (!competition) return null;

    const status = competition.status;
    const timeInfo = competition.timeInfo;

    if (status === "upcoming") {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            px: 2,
            py: 1,
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          <Event sx={{ mr: 1 }} />
          <Typography variant="body2">
            Starts{" "}
            {formatTimeRemaining(timeInfo) ||
              `on ${formatDateTime(competition.competitionAvailableTiming)}`}
          </Typography>
        </Box>
      );
    } else if (status === "active") {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: alpha(theme.palette.error.main, 0.1),
            color: theme.palette.error.main,
            px: 2,
            py: 1,
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          <Timer sx={{ mr: 1 }} />
          <Typography variant="body2">
            Ends{" "}
            {formatTimeRemaining(timeInfo) ||
              `at ${formatDateTime(competition.endTiming)}`}
          </Typography>
        </Box>
      );
    } else if (status === "ended") {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: alpha(theme.palette.text.secondary, 0.1),
            color: theme.palette.text.secondary,
            px: 2,
            py: 1,
            borderRadius: 2,
            fontWeight: 500,
          }}
        >
          <CheckCircle sx={{ mr: 1 }} />
          <Typography variant="body2">
            Ended on {formatDateTime(competition.endTiming)}
          </Typography>
        </Box>
      );
    }

    return null;
  };

  // Render skeleton loader while fetching data
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            variant="text"
            sx={{ mr: 2 }}
            disabled
          >
            Back
          </Button>
          <Skeleton variant="text" width={300} height={60} />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 1, mb: 2 }}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={32}
                  sx={{ borderRadius: 16 }}
                />
                <Skeleton
                  variant="rectangular"
                  width={90}
                  height={32}
                  sx={{ borderRadius: 16 }}
                />
                <Skeleton
                  variant="rectangular"
                  width={70}
                  height={32}
                  sx={{ borderRadius: 16 }}
                />
              </Box>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", mb: 2 }}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ mr: 2 }}
                />
                <Skeleton variant="text" width="80%" height={40} />
              </Box>
              <Box sx={{ display: "flex", mb: 2 }}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ mr: 2 }}
                />
                <Skeleton variant="text" width="60%" height={40} />
              </Box>
              <Box sx={{ display: "flex" }}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                  sx={{ mr: 2 }}
                />
                <Skeleton variant="text" width="70%" height={40} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
              <Skeleton
                variant="rectangular"
                height={100}
                sx={{ borderRadius: 1, mb: 2 }}
              />
              <Skeleton variant="text" width="80%" height={30} />
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", mb: 2 }}>
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  sx={{ mr: 2 }}
                />
                <Skeleton variant="text" width="80%" height={30} />
              </Box>
              <Box sx={{ display: "flex", mb: 2 }}>
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  sx={{ mr: 2 }}
                />
                <Skeleton variant="text" width="70%" height={30} />
              </Box>
              <Box sx={{ display: "flex" }}>
                <Skeleton
                  variant="circular"
                  width={24}
                  height={24}
                  sx={{ mr: 2 }}
                />
                <Skeleton variant="text" width="60%" height={30} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          onClick={handleGoBack}
          sx={{ mb: 3 }}
        >
          Back to Competitions
        </Button>

        <Alert
          severity="error"
          variant="filled"
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {error}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Please try refreshing the page or contact support if the issue
            persists.
          </Typography>
        </Alert>
      </Container>
    );
  }

  if (!competition) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          onClick={handleGoBack}
          sx={{ mb: 3 }}
        >
          Back to Competitions
        </Button>

        <Alert
          severity="info"
          variant="filled"
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Competition not found
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            The competition you're looking for may have been removed or is not
            available.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with navigation */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
        <Button
          startIcon={<ArrowBack />}
          variant="text"
          onClick={handleGoBack}
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
            },
          }}
        >
          Back
        </Button>
      </Stack>

      {/* Join success message */}
      <AnimatePresence>
        {joinSuccess && (
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              severity="success"
              variant="filled"
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              }}
            >
              <Typography variant="subtitle1" fontWeight={600}>
                Successfully joined the competition!
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Redirecting to the competition page...
              </Typography>
              <LinearProgress sx={{ mt: 1.5, borderRadius: 1, height: 6 }} />
            </Alert>
          </MotionBox>
        )}
      </AnimatePresence>

      {/* Competition Header */}
      <MotionPaper
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        elevation={3}
        sx={{
          p: { xs: 3, md: 4 },
          mb: 3,
          borderRadius: 3,
          backgroundImage: isDark
            ? "linear-gradient(to right, rgba(25, 29, 43, 0.8), rgba(25, 29, 43, 0.6))"
            : "linear-gradient(to right, rgba(57, 71, 213, 0.05), rgba(0, 210, 255, 0.05))",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background pattern for premium look */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${
              isDark ? "ffffff" : "000000"
            }' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            zIndex: 0,
          }}
        />

        <Grid
          container
          spacing={3}
          alignItems="center"
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <MotionTypography
                variant="h4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  background: isDark
                    ? "linear-gradient(45deg, #bc4037 30%, #f47061 90%)"
                    : undefined,
                  WebkitBackgroundClip: isDark ? "text" : undefined,
                  WebkitTextFillColor: isDark ? "transparent" : undefined,
                }}
              >
                {competition.competitionName}
              </MotionTypography>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip
                  title={
                    isBookmarked ? "Remove bookmark" : "Bookmark competition"
                  }
                >
                  <IconButton
                    onClick={toggleBookmark}
                    size="small"
                    sx={{
                      color: isBookmarked ? "warning.main" : "action.active",
                      bgcolor: isDark
                        ? alpha(theme.palette.background.paper, 0.2)
                        : alpha(theme.palette.background.paper, 0.6),
                      "&:hover": {
                        bgcolor: isDark
                          ? alpha(theme.palette.background.paper, 0.3)
                          : alpha(theme.palette.background.paper, 0.8),
                      },
                    }}
                  >
                    {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Share competition">
                  <IconButton
                    size="small"
                    sx={{
                      color: "action.active",
                      bgcolor: isDark
                        ? alpha(theme.palette.background.paper, 0.2)
                        : alpha(theme.palette.background.paper, 0.6),
                      "&:hover": {
                        bgcolor: isDark
                          ? alpha(theme.palette.background.paper, 0.3)
                          : alpha(theme.palette.background.paper, 0.8),
                      },
                    }}
                  >
                    <Share />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    competition.creatorInfo?.name || "Unknown"
                  )}&background=random`}
                  sx={{ width: 28, height: 28, mr: 1 }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Created by {competition.creatorInfo?.name || "Unknown"}
                </Typography>
              </Box>

              {competition.competitionType && (
                <Chip
                  icon={<Category fontSize="small" />}
                  label={competition.competitionType}
                  size="small"
                  sx={{
                    bgcolor: isDark
                      ? alpha(theme.palette.background.paper, 0.2)
                      : alpha(theme.palette.background.paper, 0.6),
                    backdropFilter: "blur(8px)",
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
              )}

              {competition.difficulty &&
                renderDifficultyBadge(competition.difficulty)}

              {renderTimeStatus()}
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
                mt: 3,
                "& > div": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <Box>
                <MenuBook sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="body2" fontWeight={600}>
                  {competition.totalQuestions} Questions
                </Typography>
              </Box>

              <Box>
                <Timer sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="body2" fontWeight={600}>
                  {competition.duration} Minutes
                </Typography>
              </Box>

              <Box>
                <PeopleOutline
                  sx={{ color: theme.palette.primary.main, mr: 1 }}
                />
                <Typography variant="body2" fontWeight={600}>
                  {Math.floor(Math.random() * 200) + 20} Participants
                </Typography>
              </Box>

              {competition.score?.rank && (
                <Box>
                  <Leaderboard
                    sx={{ color: theme.palette.primary.main, mr: 1 }}
                  />
                  <Typography variant="body2" fontWeight={600}>
                    Your Rank: #{competition.score.rank}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
              }}
            >
              {renderActionButtons()}
            </Box>
          </Grid>
        </Grid>
      </MotionPaper>

      {/* Competition status banner */}
      {competition.status === "active" && (
        <MotionPaper
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          elevation={2}
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: "hidden",
            border: `1px solid ${theme.palette.warning.main}`,
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.warning.main, 0.1),
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Timer color="warning" sx={{ fontSize: 28, mr: 1.5 }} />
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="warning.main"
                  >
                    Competition in Progress
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete all questions before the deadline to submit your
                    answers.
                  </Typography>
                </Box>
              </Box>

              {competition.endTiming && (
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.2),
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    color="warning.main"
                  >
                    Ends at {formatDateTime(competition.endTiming)}
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </MotionPaper>
      )}

      <MotionBox
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {/* Left column with competition details */}
          <Grid item xs={12} md={8} style={{ minWidth: "100%" }}>
            <MotionCard
              variants={fadeIn}
              transition={{ delay: 0.15 }}
              elevation={2}
              sx={{
                mb: 3,

                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Description
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  />
                  About This Competition
                </Typography>

                {competition.description ? (
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                    {competition.description}
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <InfoOutlined
                      color="primary"
                      sx={{ mr: 1.5, fontSize: 20 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      No detailed description provided for this competition.
                    </Typography>
                  </Box>
                )}

                {competition.tags && competition.tags.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ mb: 1.5, display: "flex", alignItems: "center" }}
                    >
                      <LightbulbOutlined
                        sx={{
                          mr: 1,
                          fontSize: 18,
                          color: theme.palette.primary.main,
                        }}
                      />
                      Topics Covered:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {competition.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderRadius: "6px",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </MotionCard>

            <MotionCard
              variants={fadeIn}
              transition={{ delay: 0.2 }}
              elevation={2}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <EmojiEvents
                    sx={{ mr: 1, color: theme.palette.primary.main }}
                  />
                  Competition Structure
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <List>
                      <ListItem
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          borderRadius: 2,
                          mb: 2,
                          px: 2,
                          py: 1.5,
                        }}
                      >
                        <ListItemIcon>
                          <MenuBook color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography fontWeight={600}>
                              {competition.totalQuestions} Questions
                            </Typography>
                          }
                          secondary={`Competition Type: ${
                            competition.competitionType || "General"
                          }`}
                        />
                      </ListItem>

                      <ListItem
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          borderRadius: 2,
                          mb: 2,
                          px: 2,
                          py: 1.5,
                        }}
                      >
                        <ListItemIcon>
                          <Timer color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography fontWeight={600}>
                              {competition.duration} Minutes Duration
                            </Typography>
                          }
                          secondary="Complete all questions within the time limit"
                        />
                      </ListItem>
                    </List>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <List>
                      {competition.status === "active" && (
                        <ListItem
                          sx={{
                            bgcolor: alpha(theme.palette.error.main, 0.05),
                            borderRadius: 2,
                            mb: 2,
                            px: 2,
                            py: 1.5,
                          }}
                        >
                          <ListItemIcon>
                            <AccessTime color="error" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography fontWeight={600} color="error.main">
                                Competition in Progress
                              </Typography>
                            }
                            secondary={
                              competition.endTiming
                                ? `Ends at ${formatDateTime(
                                    competition.endTiming
                                  )}`
                                : `${competition.duration} minutes from start`
                            }
                          />
                        </ListItem>
                      )}

                      {competition.status === "upcoming" && (
                        <ListItem
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: 2,
                            mb: 2,
                            px: 2,
                            py: 1.5,
                          }}
                        >
                          <ListItemIcon>
                            <Event color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography fontWeight={600} color="primary.main">
                                Upcoming Competition
                              </Typography>
                            }
                            secondary={`Opens at ${formatDateTime(
                              competition.competitionAvailableTiming
                            )}`}
                          />
                        </ListItem>
                      )}

                      {competition.status === "ended" && (
                        <ListItem
                          sx={{
                            bgcolor: alpha(theme.palette.text.secondary, 0.05),
                            borderRadius: 2,
                            mb: 2,
                            px: 2,
                            py: 1.5,
                          }}
                        >
                          <ListItemIcon>
                            <CheckCircle color="action" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                fontWeight={600}
                                color="text.secondary"
                              >
                                Competition Ended
                              </Typography>
                            }
                            secondary={`Ended at ${formatDateTime(
                              competition.endTiming
                            )}`}
                          />
                        </ListItem>
                      )}

                      {/* Show ranking info if available */}
                      {competition.score?.rank && (
                        <ListItem
                          sx={{
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                            borderRadius: 2,
                            mb: 2,
                            px: 2,
                            py: 1.5,
                          }}
                        >
                          <ListItemIcon>
                            <Leaderboard color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography fontWeight={600} color="success.main">
                                Your Rank: #{competition.score.rank}
                              </Typography>
                            }
                            secondary={`Score: ${competition.score.totalScore}/${competition.score.maxPossibleScore}`}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                </Grid>

                {/* Call-to-action button */}
                {!competition.participation?.isJoined &&
                  competition.status !== "ended" &&
                  competition.permissions?.canJoin && (
                    <Box
                      sx={{
                        mt: 3,
                        pt: 3,
                        display: "flex",
                        justifyContent: "center",
                        borderTop: `1px solid ${alpha(
                          theme.palette.divider,
                          0.5
                        )}`,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleJoinCompetition}
                        disabled={joining}
                        startIcon={
                          joining ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <PlayArrow />
                          )
                        }
                        sx={{
                          py: 1.5,
                          px: 5,
                          borderRadius: 2,
                          fontWeight: 600,
                          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        {joining ? "Joining..." : "Join Now"}
                      </Button>
                    </Box>
                  )}
              </CardContent>
            </MotionCard>

            {/* Join Now prominent section */}
            {!competition.participation?.isJoined &&
              competition.status === "active" &&
              competition.permissions?.canJoin && (
                <MotionPaper
                  variants={fadeIn}
                  transition={{ delay: 0.25 }}
                  elevation={3}
                  sx={{
                    p: 3,
                    mt: 3,
                    borderRadius: 3,
                    background:
                      "linear-gradient(45deg, #bc4037 30%, #f47061 90%)",
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Background pattern */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      opacity: 0.1,
                      background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      zIndex: 0,
                    }}
                  />

                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={3}
                    >
                      <Box>
                        <Typography
                          variant="h5"
                          fontWeight={700}
                          sx={{ mb: 1 }}
                        >
                          Ready to Test Your Skills?
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          This competition is active right now! Join now to
                          participate and compete with others.
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleJoinCompetition}
                        disabled={joining}
                        startIcon={
                          joining ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <PlayArrow />
                          )
                        }
                        sx={{
                          py: 1.2,
                          px: 3,
                          borderRadius: "8px",
                          fontWeight: 600,
                          boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        {joining ? "Joining..." : "Join Competition"}
                      </Button>
                    </Stack>
                  </Box>
                </MotionPaper>
              )}
          </Grid>
        </Grid>
      </MotionBox>
    </Container>
  );
};
export default CompetitionDetailPage;

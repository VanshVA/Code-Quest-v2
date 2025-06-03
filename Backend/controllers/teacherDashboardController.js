const Teacher = require('../models/teacher');
const Competition = require('../models/competition');
const Student = require('../models/student');
const CompetitionResult = require('../models/result');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Current date and time
const CURRENT_DATE_TIME = "2025-05-30 15:22:01";
const CURRENT_USER = "VanshSharmaSDEin";

const teacherDashboardController = {
    //========================= TEACHER PROFILE ================================//

    // Get teacher profile
    getProfile: async (req, res) => {
        try {
            const teacherId = req.teacher._id;

            // Find teacher by ID, excluding password
            const teacher = await Teacher.findById(teacherId)
                .select('-teacherPassword');

            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: 'Teacher profile not found'
                });
            }

            // Get count of competitions created by this teacher
            const competitionsCount = await Competition.countDocuments({ creatorId: teacherId });

            // Get count of unique students who've participated in teacher's competitions
            const studentIds = await CompetitionResult.find({ creatorId: teacherId })
                .distinct('studentId');
            const studentsCount = studentIds.length;

            // Get count of results that need grading
            const pendingGradesCount = await CompetitionResult.countDocuments({
                creatorId: teacherId,
                isSubmitted: true,
                isGraded: false
            });

            res.status(200).json({
                success: true,
                data: {
                    teacher: {
                        ...teacher.toObject(),
                        stats: {
                            competitionsCount,
                            studentsCount,
                            pendingGradesCount
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error in getProfile:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve teacher profile',
                error: error.message
            });
        }
    },

    // Update teacher profile
    updateProfile: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { teacherFirstName, teacherLastName, teacherEmail, teacherImage } = req.body;

            // Find teacher by ID
            const teacher = await Teacher.findById(teacherId);

            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: 'Teacher profile not found'
                });
            }

            // Update fields if provided
            if (teacherFirstName) teacher.teacherFirstName = teacherFirstName;
            if (teacherLastName) teacher.teacherLastName = teacherLastName;

            // If email is being updated, check if it's already in use by another user
            if (teacherEmail && teacherEmail !== teacher.teacherEmail) {
                const emailExists = await Teacher.findOne({ teacherEmail, _id: { $ne: teacherId } });
                if (emailExists) {
                    return res.status(409).json({
                        success: false,
                        message: 'Email already in use by another teacher'
                    });
                }
                teacher.teacherEmail = teacherEmail;
            }

            if (teacherImage) teacher.teacherImage = teacherImage;

            // Record login time
            teacher.loginTime.push(new Date());

            await teacher.save();

            // Return updated teacher data without password
            const updatedTeacher = { ...teacher.toObject() };
            delete updatedTeacher.teacherPassword;

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: { teacher: updatedTeacher }
            });
        } catch (error) {
            console.error('Error in updateProfile:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update profile',
                error: error.message
            });
        }
    },

    // Update teacher password
    updatePassword: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { currentPassword, newPassword } = req.body;

            // Validate request data
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password and new password are required'
                });
            }

            // Find teacher by ID
            const teacher = await Teacher.findById(teacherId);

            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    message: 'Teacher profile not found'
                });
            }

            // Verify current password
            const isPasswordValid = await bcrypt.compare(currentPassword, teacher.teacherPassword);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password
            teacher.teacherPassword = hashedPassword;
            await teacher.save();

            res.status(200).json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            console.error('Error in updatePassword:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update password',
                error: error.message
            });
        }
    },

    //========================= COMPETITION MANAGEMENT ================================//

    // Create new competition
    createCompetition: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const {
                competitionName,
                competitionDescription,  // Add description with default empty string
                competitionType,
                questions = [],
                duration = 60,
                isLive = false,
                startTiming = '',
                endTiming = ''  // Add end timing with default empty string
            } = req.body;
            // Validate input
            if (!competitionName) {
                return res.status(400).json({
                    success: false,
                    message: 'Competition name is required'
                });
            }

            if (!competitionType || !['TEXT', 'MCQ', 'CODE'].includes(competitionType)) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid competition type (TEXT, MCQ, or CODE) is required'
                });
            }

            // Find the highest existing ID and increment by 1
            const highestIdCompetition = await Competition.findOne().sort('-id');
            const nextId = highestIdCompetition ? highestIdCompetition.id + 1 : 1;

            // Create competition
            const newCompetition = new Competition({
                competitionName,
                competitionDescription,  // Add description to the competition object
                competitionType,
                questions,
                duration,
                creatorId: teacherId,
                isLive,
                startTiming,
                endTiming,  // Add end timing to the competition object
                id: nextId,
                lastSaved: new Date().toISOString(),
                previousCompetition: false
            });

            await newCompetition.save();

            res.status(201).json({
                success: true,
                message: 'Competition created successfully',
                data: { competition: newCompetition }
            });
        } catch (error) {
            console.error('Error in createCompetition:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create competition',
                error: error.message
            });
        }
    },

    // Update competition
    updateCompetition: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { id } = req.params;
            const {
                competitionName,
                competitionDescription,  // Add competitionDescription
                competitionType,
                questions,
                duration,
                isLive,
                startTiming,
                endTiming,  // Add endTiming
                previousCompetition,
                winner,
                runnerUp,
                secondRunnerUp
            } = req.body;

            // Find competition by ID and verify it belongs to the teacher
            const competition = await Competition.findOne({
                _id: id,
                creatorId: teacherId
            });

            if (!competition) {
                return res.status(404).json({
                    success: false,
                    message: 'Competition not found or you do not have permission to modify it'
                });
            }

            // Update fields if provided
            if (competitionName !== undefined) competition.competitionName = competitionName;
            if (competitionDescription !== undefined) competition.competitionDescription = competitionDescription;  // Update description
            if (competitionType !== undefined && ['TEXT', 'MCQ', 'CODE'].includes(competitionType)) {
                competition.competitionType = competitionType;
            }
            if (questions !== undefined) competition.questions = questions;
            if (duration !== undefined) competition.duration = duration;
            if (isLive !== undefined) competition.isLive = isLive;
            if (startTiming !== undefined) competition.startTiming = startTiming;
            if (endTiming !== undefined) competition.endTiming = endTiming;  // Update end timing
            if (previousCompetition !== undefined) competition.previousCompetition = previousCompetition;
            if (winner !== undefined) competition.winner = winner;
            if (runnerUp !== undefined) competition.runnerUp = runnerUp;
            if (secondRunnerUp !== undefined) competition.secondRunnerUp = secondRunnerUp;

            // Update lastSaved timestamp
            competition.lastSaved = new Date().toISOString();

            await competition.save();

            res.status(200).json({
                success: true,
                message: 'Competition updated successfully',
                data: { competition }
            });
        } catch (error) {
            console.error('Error in updateCompetition:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update competition',
                error: error.message
            });
        }
    },

    // Get all competitions created by teacher
    getCompetitions: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { status, search, sortBy = 'lastSaved', sortOrder = -1 } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // Build filter
            const filter = { creatorId: teacherId };

            // Filter by status
            if (status === 'live') {
                filter.isLive = true;
            } else if (status === 'draft') {
                filter.isLive = false;
            } else if (status === 'archived') {
                filter.previousCompetition = true;
            } else if (status === 'current') {
                filter.previousCompetition = false;
            }

            // Filter by search term
            if (search) {
                filter.competitionName = { $regex: search, $options: 'i' };
            }

            // Get total count
            const total = await Competition.countDocuments(filter);

            // Get competitions with pagination and sorting
            const competitions = await Competition.find(filter)
                .sort({ [sortBy]: parseInt(sortOrder) })
                .skip(skip)
                .limit(limit);

            // Get teacher information once for all competitions
            const teacher = await Teacher.findById(teacherId)
                .select('teacherFirstName teacherLastName teacherEmail');

            const creatorName = teacher ?
                `${teacher.teacherFirstName} ${teacher.teacherLastName}` :
                'Unknown Teacher';

            // Add statistics to each competition
            const competitionsWithStats = await Promise.all(competitions.map(async (competition) => {
                // Get participation stats
                const participantsCount = await CompetitionResult.distinct('studentId', {
                    competitionId: competition._id
                }).countDocuments();

                // Get pending grades count
                const pendingGradesCount = await CompetitionResult.countDocuments({
                    competitionId: competition._id,
                    isSubmitted: true,
                    isGraded: false
                });

                return {
                    ...competition.toObject(),
                    creatorName: creatorName, // Add teacher name instead of just ID
                    stats: {
                        participantsCount,
                        pendingGradesCount,
                        questionsCount: competition.questions.length
                    }
                };
            }));

            res.status(200).json({
                success: true,
                data: {
                    competitions: competitionsWithStats,
                    pagination: {
                        total,
                        page,
                        pages: Math.ceil(total / limit),
                        limit
                    }
                }
            });
        } catch (error) {
            console.error('Error in getCompetitions:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve competitions',
                error: error.message
            });
        }
    },

    // Get competition by ID
    getCompetitionById: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { id } = req.params;

            // Find competition by ID and verify it belongs to the teacher
            const competition = await Competition.findOne({
                _id: id,
                creatorId: teacherId
            });

            if (!competition) {
                return res.status(404).json({
                    success: false,
                    message: 'Competition not found or you do not have permission to access it'
                });
            }

            // Get creator information (should be the current teacher)
            let creator = { name: 'Unknown' };
            try {
                const teacher = await Teacher.findById(competition.creatorId)
                    .select('teacherFirstName teacherLastName teacherEmail');

                if (teacher) {
                    creator = {
                        id: teacher._id,
                        name: `${teacher.teacherFirstName} ${teacher.teacherLastName}`,
                        email: teacher.teacherEmail
                    };
                }
            } catch (err) {
                console.error('Error fetching creator info:', err);
            }

            // If competition has winners, get their info
            let winnerInfo = null;
            let runnerUpInfo = null;
            let secondRunnerUpInfo = null;

            if (competition.winner) {
                try {
                    const winner = await Student.findById(competition.winner)
                        .select('studentFirstName studentLastName studentEmail studentImage');

                    if (winner) {
                        winnerInfo = {
                            id: winner._id,
                            name: `${winner.studentFirstName} ${winner.studentLastName}`,
                            email: winner.studentEmail,
                            image: winner.studentImage
                        };
                    }
                } catch (err) {
                    console.error('Error fetching winner info:', err);
                }
            }

            if (competition.runnerUp) {
                try {
                    const runnerUp = await Student.findById(competition.runnerUp)
                        .select('studentFirstName studentLastName studentEmail studentImage');

                    if (runnerUp) {
                        runnerUpInfo = {
                            id: runnerUp._id,
                            name: `${runnerUp.studentFirstName} ${runnerUp.studentLastName}`,
                            email: runnerUp.studentEmail,
                            image: runnerUp.studentImage
                        };
                    }
                } catch (err) {
                    console.error('Error fetching runner-up info:', err);
                }
            }

            if (competition.secondRunnerUp) {
                try {
                    const secondRunnerUp = await Student.findById(competition.secondRunnerUp)
                        .select('studentFirstName studentLastName studentEmail studentImage');

                    if (secondRunnerUp) {
                        secondRunnerUpInfo = {
                            id: secondRunnerUp._id,
                            name: `${secondRunnerUp.studentFirstName} ${secondRunnerUp.studentLastName}`,
                            email: secondRunnerUp.studentEmail,
                            image: secondRunnerUp.studentImage
                        };
                    }
                } catch (err) {
                    console.error('Error fetching second runner-up info:', err);
                }
            }

            // Get participation statistics
            const participantsCount = await CompetitionResult.distinct('studentId', {
                competitionId: id
            }).length;

            // Calculate submission statistics for this competition
            const submissionsCount = await CompetitionResult.countDocuments({
                competitionId: id
            });

            const gradedCount = await CompetitionResult.countDocuments({
                competitionId: id,
                isGraded: true
            });

            // Calculate average score for this competition
            const scoreData = await CompetitionResult.aggregate([
                {
                    $match: {
                        competitionId: new mongoose.Types.ObjectId(id),
                        isGraded: true
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgScore: { $avg: '$totalScore' },
                        avgPercentage: { $avg: { $divide: ['$totalScore', '$maxPossibleScore'] } }
                    }
                }
            ]);

            const avgScore = scoreData.length > 0 ? scoreData[0].avgScore : 0;
            const avgPercentage = scoreData.length > 0 ? Math.round(scoreData[0].avgPercentage * 100) : 0;

            // Get top performers in this competition
            const topPerformers = await CompetitionResult.aggregate([
                { $match: { competitionId: new mongoose.Types.ObjectId(id), isGraded: true } },
                {
                    $group: {
                        _id: '$studentId',
                        totalScore: { $sum: '$totalScore' },
                        maxPossibleScore: { $sum: '$maxPossibleScore' }
                    }
                },
                { $sort: { totalScore: -1 } },
                { $limit: 5 }
            ]);

            // Get student details for top performers
            const topPerformersWithDetails = await Promise.all(topPerformers.map(async (performer) => {
                const student = await Student.findById(performer._id)
                    .select('studentFirstName studentLastName studentEmail studentImage');

                if (!student) return null;

                return {
                    studentId: performer._id,
                    name: `${student.studentFirstName} ${student.studentLastName}`,
                    email: student.studentEmail,
                    image: student.studentImage,
                    totalScore: performer.totalScore,
                    maxPossibleScore: performer.maxPossibleScore,
                    percentage: performer.maxPossibleScore > 0
                        ? Math.round((performer.totalScore / performer.maxPossibleScore) * 100)
                        : 0
                };
            }));

            // Format the response
            const formattedCompetition = {
                ...competition.toObject(),
                creator,
                winners: {
                    winner: winnerInfo,
                    runnerUp: runnerUpInfo,
                    secondRunnerUp: secondRunnerUpInfo
                },
                stats: {
                    participantsCount,
                    submissionsCount,
                    gradedCount,
                    avgScore,
                    avgPercentage,
                    topPerformers: topPerformersWithDetails.filter(Boolean)
                }
            };

            // Log the action
            console.log(`[${CURRENT_DATE_TIME}] Teacher ${CURRENT_USER} viewed competition: ${competition.competitionName} (ID: ${competition._id})`);

            res.status(200).json({
                success: true,
                data: { competition: formattedCompetition }
            });
        } catch (error) {
            console.error('Error in getCompetitionById:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve competition details',
                error: error.message
            });
        }
    },

    // Toggle competition status (live/draft)
    toggleCompetitionStatus: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { id } = req.params;

            // Find competition by ID and verify it belongs to the teacher
            const competition = await Competition.findOne({
                _id: id,
                creatorId: teacherId
            });

            if (!competition) {
                return res.status(404).json({
                    success: false,
                    message: 'Competition not found or you do not have permission to modify it'
                });
            }

            // Toggle isLive status
            competition.isLive = !competition.isLive;

            // If setting to live, ensure startTiming is set
            if (competition.isLive && !competition.startTiming) {
                competition.startTiming = new Date().toISOString();
            }

            // Update lastSaved timestamp
            competition.lastSaved = new Date().toISOString();

            await competition.save();

            res.status(200).json({
                success: true,
                message: `Competition set to ${competition.isLive ? 'live' : 'draft'} mode successfully`,
                data: {
                    competition: {
                        _id: competition._id,
                        competitionName: competition.competitionName,
                        isLive: competition.isLive
                    }
                }
            });
        } catch (error) {
            console.error('Error in toggleCompetitionStatus:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update competition status',
                error: error.message
            });
        }
    },

    // Clone competition
    cloneCompetition: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { id } = req.params;

            // Find competition by ID and verify it belongs to the teacher
            const competition = await Competition.findOne({
                _id: id,
                creatorId: teacherId
            });

            if (!competition) {
                return res.status(404).json({
                    success: false,
                    message: 'Competition not found or you do not have permission to access it'
                });
            }

            // Find the highest existing ID and increment by 1
            const highestIdCompetition = await Competition.findOne().sort('-id');
            const nextId = highestIdCompetition ? highestIdCompetition.id + 1 : 1;

            // Create a new competition based on the existing one
            const clonedCompetition = new Competition({
                competitionName: `${competition.competitionName} (Copy)`,
                competitionDescription: competition.competitionDescription,  // Copy the description
                competitionType: competition.competitionType,
                questions: competition.questions,
                duration: competition.duration,
                creatorId: teacherId,
                isLive: false,
                startTiming: '',
                endTiming: '',  // Reset end timing in the clone
                id: nextId,
                lastSaved: new Date().toISOString(),
                previousCompetition: false
            });

            await clonedCompetition.save();

            res.status(201).json({
                success: true,
                message: 'Competition cloned successfully',
                data: { competition: clonedCompetition }
            });
        } catch (error) {
            console.error('Error in cloneCompetition:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to clone competition',
                error: error.message
            });
        }
    },

    // Toggle competition archive status (archived/unarchived)
    toggleArchiveStatus: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { id } = req.params;

            // Find competition by ID and verify it belongs to the teacher
            const competition = await Competition.findOne({
                _id: id,
                creatorId: teacherId
            });

            if (!competition) {
                return res.status(404).json({
                    success: false,
                    message: 'Competition not found or you do not have permission to modify it'
                });
            }

            // Toggle archive status
            competition.previousCompetition = !competition.previousCompetition;

            // If unarchiving, keep isLive as false
            // If archive status is being set to true, ensure isLive is false
            if (competition.previousCompetition) {
                competition.isLive = false;
            }

            await competition.save();

            const status = competition.previousCompetition ? 'archived' : 'unarchived';

            res.status(200).json({
                success: true,
                message: `Competition ${status} successfully`,
                data: {
                    competition,
                    isArchived: competition.previousCompetition
                }
            });
        } catch (error) {
            console.error('Error in toggleArchiveStatus:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update competition archive status',
                error: error.message
            });
        }
    },

    // Delete competition
    deleteCompetition: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { id } = req.params;

            // Find competition by ID and verify it belongs to the teacher
            const competition = await Competition.findOne({
                _id: id,
                creatorId: teacherId
            });

            if (!competition) {
                return res.status(404).json({
                    success: false,
                    message: 'Competition not found or you do not have permission to delete it'
                });
            }

            // Check if competition has participants
            const hasParticipants = await CompetitionResult.exists({
                competitionId: competition._id
            });

            if (hasParticipants) {
                // Instead of deleting, archive the competition
                competition.previousCompetition = true;
                competition.isLive = false;
                await competition.save();

                return res.status(200).json({
                    success: true,
                    message: 'Competition has participants and has been archived instead of deleted',
                    isArchived: true
                });
            }

            // Delete the competition if no participants
            await Competition.deleteOne({ _id: id });

            res.status(200).json({
                success: true,
                message: 'Competition deleted successfully',
                isDeleted: true
            });
        } catch (error) {
            console.error('Error in deleteCompetition:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to delete competition',
                error: error.message
            });
        }
    },

    //========================= COMPETITION RESULTS ================================//

    // Get all submissions for a specific competition
    getCompetitionSubmissions: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { competitionId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const skip = (page - 1) * limit;
            const { status } = req.query; // Optional filter by status: 'all', 'graded', 'ungraded'

            // Verify that the competition belongs to this teacher
            const competition = await Competition.findOne({
                _id: competitionId,
                creatorId: teacherId
            });

            if (!competition) {
                return res.status(403).json({
                    success: false,
                    message: 'Competition not found or you do not have permission to access it'
                });
            }

            // Build query for submissions
            const Submission = require('../models/submission');

            // Find all submissions for this competition
            const query = { competitionId };

            // Get total count
            const total = await Submission.countDocuments(query);

            // Get submissions with pagination
            const submissions = await Submission.find(query)
                .sort({ submissionDate: -1 }) // Most recent first
                .skip(skip)
                .limit(limit);

            // Get associated results data (for grading status)
            const Result = require('../models/result');

            // Format submission data with student information
            const submissionsWithDetails = await Promise.all(submissions.map(async (submission) => {
                // Get student details
                const student = await Student.findById(submission.studentId)
                    .select('studentFirstName studentLastName studentEmail studentImage grade school');

                // Check if submission has been graded
                const result = await Result.findOne({
                    competitionId,
                    studentId: submission.studentId
                }).select('isGraded totalScore maxPossibleScore percentageScore');

                return {
                    _id: submission._id,
                    submissionDate: submission.submissionDate,
                    student: student ? {
                        _id: student._id,
                        name: `${student.studentFirstName} ${student.studentLastName}`,
                        email: student.studentEmail,
                        image: student.studentImage,
                        grade: student.grade || 'N/A',
                        school: student.school || 'N/A'
                    } : { name: 'Unknown Student' },
                    questionCount: submission.questions.length,
                    answeredCount: submission.answers.filter(answer => answer && answer.trim().length > 0).length,
                    result: result ? {
                        isGraded: result.isGraded,
                        totalScore: result.totalScore,
                        maxPossibleScore: result.maxPossibleScore,
                        percentageScore: result.percentageScore
                    } : null
                };
            }));

            // Filter if status parameter is provided
            let filteredSubmissions = submissionsWithDetails;
            if (status === 'graded') {
                filteredSubmissions = submissionsWithDetails.filter(s => s.result && s.result.isGraded);
            } else if (status === 'ungraded') {
                filteredSubmissions = submissionsWithDetails.filter(s => !s.result || !s.result.isGraded);
            }

            // Get summary statistics
            const stats = {
                totalSubmissions: submissionsWithDetails.length,
                gradedSubmissions: submissionsWithDetails.filter(s => s.result && s.result.isGraded).length,
                ungradedSubmissions: submissionsWithDetails.filter(s => !s.result || !s.result.isGraded).length,
                averageScore: submissionsWithDetails
                    .filter(s => s.result && s.result.isGraded)
                    .reduce((sum, s) => sum + (s.result.percentageScore || 0), 0) /
                    (submissionsWithDetails.filter(s => s.result && s.result.isGraded).length || 1)
            };

            // Log the action
            console.log(`[${CURRENT_DATE_TIME}] Teacher ${req.teacher.teacherEmail} retrieved submissions for competition: ${competition.competitionName}`);

            res.status(200).json({
                success: true,
                data: {
                    competition: {
                        _id: competition._id,
                        name: competition.competitionName,
                        type: competition.competitionType,
                        totalQuestions: competition.questions.length,
                        isLive: competition.isLive,
                        isArchived: competition.previousCompetition
                    },
                    submissions: filteredSubmissions,
                    stats,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit)
                    }
                }
            });
        } catch (error) {
            console.error('Error in getCompetitionSubmissions:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve competition submissions',
                error: error.message
            });
        }
    },

    // Get a specific submission detail
    getSubmissionDetail: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { submissionId } = req.params;
            // Find the submission
            const Submission = require('../models/submission');

            const submission = await Submission.findById(submissionId);

            if (!submission) {
                return res.status(404).json({
                    success: false,
                    message: 'Submission not found'
                });
            }

            // Get the competition
            const competition = await Competition.findById(submission.competitionId);

            if (!competition) {
                return res.status(404).json({
                    success: false,
                    message: 'Associated competition not found'
                });
            }

            // Verify the teacher owns this competition
            if (competition.creatorId.toString() !== teacherId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this submission'
                });
            }

            // Get student details
            const student = await Student.findById(submission.studentId)
                .select('studentFirstName studentLastName studentEmail studentImage grade school');

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student information not found'
                });
            }

            // Get result if available
            const Result = require('../models/result');
            const result = await Result.findOne({
                competitionId: submission.competitionId,
                studentId: submission.studentId
            });

            // Format answers with full question details
            const answers = [];
            for (let i = 0; i < submission.questions.length; i++) {
                const questionId = submission.questions[i];
                const answer = submission.answers[i] || '';

                // Find the question details - get the complete question object
                const questionDetail = competition.questions.find(q => q._id.toString() === questionId);

                if (questionDetail) {
                    // Include the complete question details
                    let answerInfo = {
                        questionId,
                        question: questionDetail, // Include the full question object
                        questionType: competition.competitionType,
                        studentAnswer: answer,
                    };

                    // Add grading information if result exists
                    if (result) {
                        const resultItem = result.results.find(r => r.questionId.toString() === questionId);
                        if (resultItem) {
                            answerInfo.isCorrect = resultItem.isCorrect;
                            answerInfo.teacherFeedback = resultItem.teacherFeedback;
                        }
                    }

                    answers.push(answerInfo);
                }
            }

            // Log the action
            console.log(`[${CURRENT_DATE_TIME}] Teacher ${req.teacher.teacherEmail} viewed submission detail (ID: ${submissionId}) from student: ${student.studentEmail}`);

            res.status(200).json({
                success: true,
                data: {
                    submission: {
                        _id: submission._id,
                        submissionDate: submission.submissionDate,
                        totalQuestions: submission.questions.length,
                        answeredQuestions: submission.answers.filter(a => a && a.trim().length > 0).length
                    },
                    student: {
                        _id: student._id,
                        name: `${student.studentFirstName} ${student.studentLastName}`,
                        email: student.studentEmail,
                        image: student.studentImage,
                        grade: student.grade || 'N/A',
                        school: student.school || 'N/A'
                    },
                    competition: {
                        _id: competition._id,
                        name: competition.competitionName,
                        type: competition.competitionType,
                        questionsCount: competition.questions.length
                    },
                    result: result ? {
                        _id: result._id,
                        isGraded: result.isGraded,
                        totalScore: result.totalScore,
                        maxPossibleScore: result.maxPossibleScore,
                        percentageScore: result.percentageScore
                    } : null,
                    answers
                }
            });
        } catch (error) {
            console.error('Error in getSubmissionDetail:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve submission details',
                error: error.message
            });
        }
    },

    // Evaluate submission and assign results (for teachers)
    evaluateSubmission: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { submissionId } = req.params;

            // Find the submission
            const Submission = require('../models/submission');
            const Result = require('../models/result');

            const submission = await Submission.findById(submissionId);

            if (!submission) {
                return res.status(404).json({
                    success: false,
                    message: 'Submission not found'
                });
            }

            // Get the competition details
            const competition = await Competition.findById(submission.competitionId);
            if (!competition) {
                return res.status(404).json({
                    success: false,
                    message: 'Associated competition not found'
                });
            }

            // Verify that the teacher owns this competition
            if (competition.creatorId.toString() !== teacherId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to evaluate this submission'
                });
            }

            // Check if result already exists
            const existingResult = await Result.findOne({
                studentId: submission.studentId,
                competitionId: submission.competitionId
            });

            if (existingResult) {
                // Return existing result instead of error
                return res.status(200).json({
                    success: true,
                    message: 'Results already exist for this submission',
                    data: {
                        submissionId: submissionId,
                        resultId: existingResult._id,
                        totalScore: existingResult.totalScore,
                        percentageScore: existingResult.percentageScore,
                        isExisting: true
                    }
                });
            }

            // Calculate results
            const results = [];
            let totalCorrect = 0;
            let gradableQuestions = 0;

            for (let i = 0; i < submission.questions.length; i++) {
                const questionId = submission.questions[i];
                const studentAnswer = submission.answers[i] || '';

                // Find the original question from the competition
                const originalQuestion = competition.questions.find(q => q._id.toString() === questionId);

                if (!originalQuestion) continue;

                // Determine correctness based on competition type
                let isCorrect = false;

                if (competition.competitionType === 'MCQ') {
                    // For MCQ, we can automatically check answer
                    isCorrect = originalQuestion.answer === studentAnswer;
                    if (isCorrect) totalCorrect++;
                    gradableQuestions++;
                } else {
                    // For TEXT or CODE, set as false initially (requires manual grading)
                    isCorrect = false;
                    // Only count as gradable if student provided an answer
                    if (studentAnswer.trim().length > 0) {
                        gradableQuestions++;
                    }
                }

                results.push({
                    questionId: questionId,
                    questionType: competition.competitionType,
                    studentAnswer: studentAnswer,
                    correctAnswer: competition.competitionType === 'MCQ' ? originalQuestion.answer : undefined,
                    isCorrect: isCorrect
                });
            }

            const totalQuestions = results.length;
            const percentageScore = gradableQuestions > 0 ? (totalCorrect / gradableQuestions) * 100 : 0;

            // Create and save the result
            const newResult = new Result({
                studentId: submission.studentId,
                competitionId: submission.competitionId,
                creatorId: teacherId, // Add teacher ID as creator
                results: results,
                totalScore: totalCorrect,
                percentageScore: percentageScore,
                scoreAssignedTime: new Date(),
                submissionId: submissionId,
                maxPossibleScore: gradableQuestions, // Add max possible score
                isGraded: competition.competitionType === 'MCQ', // Auto-grade MCQs
                isSubmitted: true,
                submissionTime: submission.submissionDate || new Date()
            });

            await newResult.save();

            // Get student information for response
            const student = await Student.findById(submission.studentId)
                .select('studentFirstName studentLastName studentEmail');

            // Log the action
            console.log(`[${CURRENT_DATE_TIME}] Teacher ${req.teacher.teacherEmail} evaluated submission (ID: ${submission._id}), student: ${student ? student.studentEmail : submission.studentId}, score: ${totalCorrect}/${totalQuestions}`);

            // Return appropriate data based on competition type
            const responseData = {
                submissionId: submission._id,
                resultId: newResult._id,
                studentId: submission.studentId,
                studentInfo: student ? {
                    name: `${student.studentFirstName} ${student.studentLastName}`,
                    email: student.studentEmail
                } : { name: 'Unknown Student' },
                competitionId: submission.competitionId,
                competitionInfo: {
                    name: competition.competitionName,
                    type: competition.competitionType
                },
                totalScore: totalCorrect,
                totalQuestions: totalQuestions,
                percentageScore: percentageScore,
                requiresManualGrading: competition.competitionType !== 'MCQ',
                isAutoGraded: competition.competitionType === 'MCQ'
            };

            // Add question details for MCQ type
            if (competition.competitionType === 'MCQ') {
                responseData.questions = results.map(r => {
                    const question = competition.questions.find(q => q._id.toString() === r.questionId.toString());
                    return {
                        questionId: r.questionId,
                        questionText: question ? question.questionText : 'Question not found',
                        studentAnswer: r.studentAnswer,
                        correctAnswer: r.correctAnswer,
                        isCorrect: r.isCorrect,
                        options: question ? question.options : []
                    };
                });
            }

            res.status(201).json({
                success: true,
                message: 'Submission evaluation completed successfully',
                data: responseData
            });
        } catch (error) {
            console.error('Error in evaluateSubmission:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to evaluate submission',
                error: error.message
            });
        }
    },

    // Get detailed result for a specific submission
    getResultDetails: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { resultId } = req.params;
            const { submissionId } = req.params; // Get submissionId from query parameters

            const Result = require('../models/result');

            // Find result by resultId or by submissionId
            let result;
            if (submissionId) {
                // If submissionId is provided, search by submissionId field
                result = await Result.findOne({ submissionId: submissionId });
                if (!result) {
                    // Try to find by resultId as fallback
                    result = await Result.findById(resultId);
                }
            } else {
                // If no submissionId, use standard resultId search
                result = await Result.findById(resultId);
            }

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'Result not found'
                });
            }

            // Get competition and student details
            const competition = await Competition.findById(result.competitionId);
            
            // Verify that the teacher owns this competition
            if (!competition || competition.creatorId.toString() !== teacherId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Competition not found or you do not have permission to access this result'
                });
            }
            
            const student = await Student.findById(result.studentId)
                .select('studentFirstName studentLastName studentEmail grade school');

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Associated student not found'
                });
            }

            // Format detailed question and answer data
            const questionDetails = await Promise.all(result.results.map(async (item) => {
                // Find the original question
                const originalQuestion = competition.questions.find(
                    q => q._id.toString() === item.questionId.toString()
                );

                return {
                    questionId: item.questionId,
                    questionType: item.questionType,
                    questionText: originalQuestion ? originalQuestion.questionText : 'Question not found',
                    studentAnswer: item.studentAnswer,
                    correctAnswer: item.correctAnswer,
                    isCorrect: item.isCorrect,
                    teacherFeedback: item.teacherFeedback, // Include teacher feedback
                    options: originalQuestion && originalQuestion.options ? originalQuestion.options : [],
                };
            }));

            // Log the action
            console.log(`[${CURRENT_DATE_TIME}] Teacher ${req.teacher.teacherEmail} viewed result details (ID: ${result._id}) for student: ${student.studentEmail}`);

            res.status(200).json({
                success: true,
                data: {
                    result: {
                        _id: result._id,
                        submissionId: result.submissionId,
                        totalScore: result.totalScore,
                        percentageScore: result.percentageScore,
                        maxPossibleScore: result.maxPossibleScore,
                        isGraded: result.isGraded,
                        scoreAssignedTime: result.scoreAssignedTime,
                        submissionTime: result.submissionTime,
                        overallFeedback: result.overallFeedback,
                        createdAt: result.createdAt,
                        updatedAt: result.updatedAt
                    },
                    competition: {
                        _id: competition._id,
                        name: competition.competitionName,
                        type: competition.competitionType,
                        totalQuestions: competition.questions.length,
                        isArchived: competition.previousCompetition
                    },
                    student: {
                        _id: student._id,
                        name: `${student.studentFirstName} ${student.studentLastName}`,
                        email: student.studentEmail,
                        grade: student.grade || 'N/A',
                        school: student.school || 'N/A'
                    },
                    questionDetails
                }
            });
        } catch (error) {
            console.error('Error in getResultDetails:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve result details',
                error: error.message
            });
        }
    },

    //========================== DASHBOARD STATISTICS ================================//

    // Get teacher dashboard statistics
    getDashboardStats: async (req, res) => {
        try {
            const teacherId = req.teacher._id;

            // Get basic counts for this teacher
            const totalCompetitions = await Competition.countDocuments({ creatorId: teacherId });

            // Get participating students count (unique students who've participated in teacher's competitions)
            // Count unique students across all competitions by this teacher
            const teacherCompetitions = await Competition.find({ creatorId: teacherId });

            // Create a Set to track unique student IDs
            const uniqueStudentIds = new Set();

            // Add all student IDs from all competitions' studentJoined arrays
            teacherCompetitions.forEach(competition => {
                if (competition.studentsJoined && Array.isArray(competition.studentJoined)) {
                    competition.studentsJoined.forEach(studentId => {
                        uniqueStudentIds.add(studentId.toString());
                    });
                }
            });

            const participatingStudentIds = Array.from(uniqueStudentIds);
            const totalParticipatingStudents = participatingStudentIds.length;

            // Get submissions count
            const totalSubmissions = await CompetitionResult.countDocuments({ creatorId: teacherId });

            // Get active competitions count
            const activeCompetitions = await Competition.countDocuments({
                creatorId: teacherId,
                isLive: true,
                previousCompetition: false
            });

            // Get pending grades count
            const pendingGrades = await CompetitionResult.countDocuments({
                creatorId: teacherId,
            });

            // Get upcoming competitions with details
            const upcomingCompetitions = await Competition.find({
                creatorId: teacherId,
                status: 'upcoming',
            })
                .select('competitionName startTiming competitionType duration')
                .sort({ startTiming: 1 })
                .limit(5);

            // Get recent competitions
            const recentCompetitions = await Competition.find({
                creatorId: teacherId
            })
                .select('competitionName lastSaved isLive')
                .sort({ lastSaved: -1 })
                .limit(5);

            // Get teacher's login history
            const teacher = await Teacher.findById(teacherId);

            // Format both login and registration times for recent activity
            const recentActivity = [];

            if (teacher) {
                // Add registration time if available
                if (teacher.registerTime) {
                    recentActivity.push({
                        type: 'registration',
                        action: 'Account created',
                        user: `${teacher.teacherFirstName} ${teacher.teacherLastName}`,
                        email: teacher.teacherEmail,
                        timestamp: teacher.registerTime,
                        formattedTime: new Date(teacher.registerTime).toLocaleString()
                    });
                }

                // Add login times if available - using loginTimeArray instead of loginTime
                if (teacher.loginTimeArray && teacher.loginTimeArray.length > 0) {
                    // Get last 10 logins
                    const logins = teacher.loginTimeArray.slice(-10).reverse();

                    logins.forEach((loginTime) => {
                        recentActivity.push({
                            type: 'login',
                            action: 'Logged in to platform',
                            user: `${teacher.teacherFirstName} ${teacher.teacherLastName}`,
                            email: teacher.teacherEmail,
                            timestamp: loginTime,
                            formattedTime: new Date(loginTime).toLocaleString()
                        });
                    });
                }
            }

            // Sort all activities by timestamp (newest first)
            recentActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


            // Prepare response
            const dashboardStats = {
                counts: {
                    totalCompetitions,
                    totalParticipatingStudents,
                    totalSubmissions,
                    activeCompetitions,
                    pendingGrades
                },
                upcomingCompetitions,
                recentCompetitions,
                recentActivity: recentActivity.slice(0, 10) // Take only top 10 activities
            };

            // Log the action
            console.log(`[${CURRENT_DATE_TIME}] Teacher ${req.teacher.teacherEmail} accessed dashboard statistics`);

            res.status(200).json({
                success: true,
                data: dashboardStats
            });

        } catch (error) {
            console.error('Error in getDashboardStats:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve dashboard statistics',
                error: error.message
            });
        }
    }
};

module.exports = teacherDashboardController;
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
                competitionType, 
                questions = [], 
                duration = 60,
                isLive = false, 
                startTiming = '' 
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
                competitionType,
                questions,
                duration,
                creatorId: teacherId,
                isLive,
                startTiming,
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
                competitionType,
                questions,
                duration,
                isLive,
                startTiming,
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
            if (competitionType !== undefined && ['TEXT', 'MCQ', 'CODE'].includes(competitionType)) {
                competition.competitionType = competitionType;
            }
            if (questions !== undefined) competition.questions = questions;
            if (duration !== undefined) competition.duration = duration;
            if (isLive !== undefined) competition.isLive = isLive;
            if (startTiming !== undefined) competition.startTiming = startTiming;
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
                competitionType: competition.competitionType,
                questions: competition.questions,
                duration: competition.duration,
                creatorId: teacherId,
                isLive: false,
                startTiming: '',
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

    // Get competition results summary
    getCompetitionResults: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { competitionId } = req.params;

            // Verify the teacher created this competition
            const competition = await Competition.findOne({
                _id: competitionId,
                creatorId: teacherId
            });

            if (!competition) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this competition'
                });
            }

            // Get all student results for this competition
            const studentResults = await CompetitionResult.aggregate([
                { $match: { competitionId: new mongoose.Types.ObjectId(competitionId) } },
                {
                    $group: {
                        _id: '$studentId',
                        totalScore: { $sum: '$totalScore' },
                        maxPossibleScore: { $sum: '$maxPossibleScore' },
                        isSubmitted: { $first: '$isSubmitted' },
                        isGraded: { $first: '$isGraded' },
                        submissionTime: { $first: '$submissionTime' }
                    }
                },
                { $sort: { totalScore: -1 } }
            ]);

            // Get student details for each result
            const resultsWithDetails = await Promise.all(studentResults.map(async (result) => {
                const student = await Student.findById(result._id)
                    .select('studentFirstName studentLastName studentEmail studentImage grade school');

                return {
                    studentId: result._id,
                    student: student ? {
                        name: `${student.studentFirstName} ${student.studentLastName}`,
                        email: student.studentEmail,
                        image: student.studentImage,
                        grade: student.grade,
                        school: student.school
                    } : { name: 'Unknown Student' },
                    totalScore: result.totalScore,
                    maxPossibleScore: result.maxPossibleScore,
                    scorePercentage: result.maxPossibleScore > 0
                        ? Math.round((result.totalScore / result.maxPossibleScore) * 100)
                        : 0,
                    isSubmitted: result.isSubmitted,
                    isGraded: result.isGraded,
                    submissionTime: result.submissionTime
                };
            }));

            // Overall competition stats
            const competitionStats = {
                totalStudents: resultsWithDetails.length,
                averageScore: resultsWithDetails.length > 0
                    ? Math.round(resultsWithDetails.reduce((acc, r) => acc + r.scorePercentage, 0) / resultsWithDetails.length)
                    : 0,
                highestScore: resultsWithDetails.length > 0
                    ? Math.max(...resultsWithDetails.map(r => r.scorePercentage))
                    : 0,
                studentsCompleted: resultsWithDetails.filter(r => r.isSubmitted).length,
                studentsGraded: resultsWithDetails.filter(r => r.isGraded).length
            };

            // Top performers (top 3)
            const topPerformers = resultsWithDetails.slice(0, 3).map((result, index) => ({
                rank: index + 1,
                ...result
            }));

            res.status(200).json({
                success: true,
                data: {
                    results: resultsWithDetails,
                    stats: competitionStats,
                    topPerformers,
                    competition: {
                        _id: competition._id,
                        id: competition.id,
                        competitionName: competition.competitionName,
                        competitionType: competition.competitionType,
                        duration: competition.duration,
                        questionsCount: competition.questions.length
                    }
                }
            });
        } catch (error) {
            console.error('Error in getCompetitionResults:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve competition results',
                error: error.message
            });
        }
    },

    // Get student submissions for a competition
    getStudentSubmission: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { competitionId, studentId } = req.params;

            // Verify the teacher created this competition
            const competition = await Competition.findOne({
                _id: competitionId,
                creatorId: teacherId
            });

            if (!competition) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this competition'
                });
            }

            // Find result for this student in this competition
            const result = await CompetitionResult.findOne({
                competitionId,
                studentId,
                creatorId: teacherId
            });

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'No submission found for this student in this competition'
                });
            }

            // Get student info
            const student = await Student.findById(studentId)
                .select('studentFirstName studentLastName studentEmail studentImage grade school');

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Student not found'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    submission: result,
                    student: {
                        _id: student._id,
                        name: `${student.studentFirstName} ${student.studentLastName}`,
                        email: student.studentEmail,
                        image: student.studentImage,
                        grade: student.grade,
                        school: student.school
                    },
                    competition: {
                        _id: competition._id,
                        competitionType: competition.competitionType,
                        competitionName: competition.competitionName,
                        questions: competition.questions
                    }
                }
            });
        } catch (error) {
            console.error('Error in getStudentSubmission:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve student submission',
                error: error.message
            });
        }
    },

    // Get all submissions for a competition
    getAllSubmissionsForCompetition: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { competitionId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const { filter = 'all' } = req.query; // 'all', 'graded', 'ungraded'

            // Verify the teacher created this competition
            const competition = await Competition.findOne({
                _id: competitionId,
                creatorId: teacherId
            });

            if (!competition) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this competition'
                });
            }

            // Build query
            const query = {
                competitionId,
                creatorId: teacherId
            };

            // Apply filter
            if (filter === 'graded') {
                query.isGraded = true;
            } else if (filter === 'ungraded') {
                query.isGraded = false;
                query.isSubmitted = true;
            }

            // Get total count
            const total = await CompetitionResult.countDocuments(query);

            // Find submissions with pagination
            const submissions = await CompetitionResult.find(query)
                .sort({ submissionTime: -1 })
                .skip(skip)
                .limit(limit);

            // Get student details for each submission
            const submissionsWithDetails = await Promise.all(submissions.map(async (submission) => {
                const student = await Student.findById(submission.studentId)
                    .select('studentFirstName studentLastName studentEmail studentImage grade school');

                return {
                    _id: submission._id,
                    competitionId: submission.competitionId,
                    studentId: submission.studentId,
                    student: student ? {
                        name: `${student.studentFirstName} ${student.studentLastName}`,
                        email: student.studentEmail,
                        image: student.studentImage,
                        grade: student.grade,
                        school: student.school
                    } : { name: 'Unknown Student' },
                    submissionTime: submission.submissionTime,
                    isGraded: submission.isGraded,
                    totalScore: submission.totalScore,
                    maxPossibleScore: submission.maxPossibleScore,
                    scorePercentage: submission.scorePercentage,
                    answersCount: submission.answers.length
                };
            }));

            res.status(200).json({
                success: true,
                data: {
                    competition: {
                        _id: competition._id,
                        competitionName: competition.competitionName,
                        competitionType: competition.competitionType
                    },
                    submissions: submissionsWithDetails,
                    pagination: {
                        total,
                        page,
                        pages: Math.ceil(total / limit),
                        limit
                    }
                }
            });
        } catch (error) {
            console.error('Error in getAllSubmissionsForCompetition:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve submissions',
                error: error.message
            });
        }
    },

    // Get student list for a competition
    getCompetitionStudents: async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { competitionId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            // Verify the teacher created this competition
            const competition = await Competition.findOne({
                _id: competitionId,
                creatorId: teacherId
            });

            if (!competition) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this competition'
                });
            }

            // Find students who have participated in this competition
            const studentIds = await CompetitionResult.distinct('studentId', {
                competitionId
            });

            // Get total count
            const total = studentIds.length;

            // Get paginated student details
            const students = await Student.find({
                _id: { $in: studentIds }
            })
                .select('studentFirstName studentLastName studentEmail studentImage grade school')
                .sort({ studentFirstName: 1 })
                .skip(skip)
                .limit(limit);

            // Get participation details and results for each student
            const studentsWithDetails = await Promise.all(students.map(async (student) => {
                // Get result for this student for this competition
                const result = await CompetitionResult.findOne({
                    competitionId,
                    studentId: student._id
                });

                // Calculate overall stats
                const totalScore = result ? result.totalScore : 0;
                const maxPossibleScore = result ? result.maxPossibleScore : 0;
                const isCompleted = result ? result.isSubmitted : false;
                const isGraded = result ? result.isGraded : false;

                return {
                    _id: student._id,
                    name: `${student.studentFirstName} ${student.studentLastName}`,
                    email: student.studentEmail,
                    image: student.studentImage,
                    grade: student.grade,
                    school: student.school,
                    stats: {
                        totalScore,
                        maxPossibleScore,
                        scorePercentage: maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0,
                        isCompleted,
                        isGraded
                    },
                    submission: result ? {
                        submissionTime: result.submissionTime,
                        gradedTime: result.gradedTime
                    } : null
                };
            }));

            res.status(200).json({
                success: true,
                data: {
                    students: studentsWithDetails,
                    competition: {
                        _id: competition._id,
                        competitionName: competition.competitionName,
                        competitionType: competition.competitionType
                    },
                    pagination: {
                        total,
                        page,
                        pages: Math.ceil(total / limit),
                        limit
                    }
                }
            });
        } catch (error) {
            console.error('Error in getCompetitionStudents:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve competition students',
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

    // Archive competition
    archiveCompetition: async (req, res) => {
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

            // Update competition to archived state
            competition.previousCompetition = true;
            competition.isLive = false;
            await competition.save();

            res.status(200).json({
                success: true,
                message: 'Competition archived successfully',
                data: { competition }
            });
        } catch (error) {
            console.error('Error in archiveCompetition:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to archive competition',
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

    // Get dashboard statistics
    getDashboardStatistics: async (req, res) => {
        try {
            const teacherId = req.teacher._id;

            // Get competitions stats
            const totalCompetitions = await Competition.countDocuments({ creatorId: teacherId });
            const activeCompetitions = await Competition.countDocuments({
                creatorId: teacherId,
                isLive: true,
                previousCompetition: false
            });
            const archivedCompetitions = await Competition.countDocuments({
                creatorId: teacherId,
                previousCompetition: true
            });
            const draftCompetitions = await Competition.countDocuments({
                creatorId: teacherId,
                isLive: false,
                previousCompetition: false
            });

            // Get competition type distribution
            const competitionTypeStats = await Competition.aggregate([
                { $match: { creatorId: teacherId.toString() } },
                { $group: {
                    _id: '$competitionType',
                    count: { $sum: 1 }
                  }
                }
            ]);

            // Format competition type data
            const typeStats = {
                MCQ: 0,
                TEXT: 0,
                CODE: 0
            };
            
            competitionTypeStats.forEach(stat => {
                if (stat._id) {
                    typeStats[stat._id] = stat.count;
                }
            });

            // Get student stats
            const uniqueStudentIds = await CompetitionResult.distinct('studentId', {
                creatorId: teacherId
            });
            const totalStudents = uniqueStudentIds.length;

            // Get average student performance
            const studentPerformance = await CompetitionResult.aggregate([
                { $match: { 
                    creatorId: teacherId.toString(),
                    isGraded: true
                }},
                { $group: {
                    _id: '$studentId',
                    avgScore: { $avg: { $divide: ['$totalScore', '$maxPossibleScore'] } }
                  }
                },
                { $group: {
                    _id: null,
                    overallAvg: { $avg: '$avgScore' }
                  }
                }
            ]);

            const averagePerformance = studentPerformance.length > 0 
                ? Math.round(studentPerformance[0].overallAvg * 100) 
                : 0;

            // Get submission stats
            const totalSubmissions = await CompetitionResult.countDocuments({
                creatorId: teacherId
            });
            const ungradedSubmissions = await CompetitionResult.countDocuments({
                creatorId: teacherId,
                isSubmitted: true,
                isGraded: false
            });
            const gradedSubmissions = await CompetitionResult.countDocuments({
                creatorId: teacherId,
                isGraded: true
            });

            // Get recent competitions
            const recentCompetitions = await Competition.find({ creatorId: teacherId })
                .sort({ lastSaved: -1 })
                .limit(5);

            // Get recent submissions
            const recentSubmissions = await CompetitionResult.find({ creatorId: teacherId })
                .sort({ submissionTime: -1 })
                .limit(5);

            // Get submission details
            const recentSubmissionsWithDetails = await Promise.all(recentSubmissions.map(async (submission) => {
                const student = await Student.findById(submission.studentId)
                    .select('studentFirstName studentLastName');

                const competitionName = await Competition.findById(submission.competitionId)
                    .select('competitionName competitionType');

                return {
                    _id: submission._id,
                    studentId: submission.studentId,
                    studentName: student ? `${student.studentFirstName} ${student.studentLastName}` : 'Unknown Student',
                    competitionId: submission.competitionId,
                    competitionName: competitionName ? competitionName.competitionName : 'Unknown Competition',
                    competitionType: competitionName ? competitionName.competitionType : 'Unknown',
                    submissionTime: submission.submissionTime,
                    isGraded: submission.isGraded,
                    totalScore: submission.totalScore,
                    maxPossibleScore: submission.maxPossibleScore,
                    scorePercentage: submission.maxPossibleScore > 0 
                        ? Math.round((submission.totalScore / submission.maxPossibleScore) * 100) 
                        : 0
                };
            }));

            // Get top performing students
            const topStudents = await CompetitionResult.aggregate([
                { $match: { 
                    creatorId: teacherId.toString(),
                    isGraded: true
                }},
                { $group: {
                    _id: '$studentId',
                    totalScore: { $sum: '$totalScore' },
                    totalMaxScore: { $sum: '$maxPossibleScore' },
                    submissionsCount: { $sum: 1 }
                  }
                },
                { $project: {
                    _id: 1,
                    totalScore: 1,
                    totalMaxScore: 1,
                    submissionsCount: 1,
                    scorePercentage: { 
                        $multiply: [
                            { $divide: ['$totalScore', { $max: ['$totalMaxScore', 1] }] },
                            100
                        ]
                    }
                  }
                },
                { $sort: { scorePercentage: -1 } },
                { $limit: 5 }
            ]);

            // Get student details for top performers
            const topStudentsWithDetails = await Promise.all(topStudents.map(async (student) => {
                const studentInfo = await Student.findById(student._id)
                    .select('studentFirstName studentLastName studentEmail studentImage');
                
                if (!studentInfo) return null;

                return {
                    studentId: student._id,
                    name: `${studentInfo.studentFirstName} ${studentInfo.studentLastName}`,
                    email: studentInfo.studentEmail,
                    image: studentInfo.studentImage,
                    totalScore: student.totalScore,
                    totalMaxScore: student.totalMaxScore,
                    submissionsCount: student.submissionsCount,
                    scorePercentage: Math.round(student.scorePercentage)
                };
            }));

            res.status(200).json({
                success: true,
                data: {
                    competitions: {
                        total: totalCompetitions,
                        active: activeCompetitions,
                        archived: archivedCompetitions,
                        draft: draftCompetitions,
                        byType: typeStats
                    },
                    students: {
                        total: totalStudents,
                        averagePerformance
                    },
                    submissions: {
                        total: totalSubmissions,
                        graded: gradedSubmissions,
                        ungraded: ungradedSubmissions
                    },
                    recent: {
                        competitions: recentCompetitions.map(comp => ({
                            _id: comp._id,
                            id: comp.id,
                            competitionName: comp.competitionName,
                            competitionType: comp.competitionType,
                            isLive: comp.isLive,
                            previousCompetition: comp.previousCompetition,
                            lastSaved: comp.lastSaved,
                            questionsCount: comp.questions.length
                        })),
                        submissions: recentSubmissionsWithDetails
                    },
                    topStudents: topStudentsWithDetails.filter(Boolean)
                }
            });
        } catch (error) {
            console.error('Error in getDashboardStatistics:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve dashboard statistics',
                error: error.message
            });
        }
    }
};

module.exports = teacherDashboardController;
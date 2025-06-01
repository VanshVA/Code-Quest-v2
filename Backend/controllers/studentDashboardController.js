const mongoose = require('mongoose');
const Student = require('../models/student');
const Competition = require('../models/competition');
const CompetitionResult = require('../models/result');
const bcrypt = require('bcrypt');

// Helper function to format time remaining for competitions
function formatTimeRemaining(milliseconds) {
  if (milliseconds <= 0) return 'Ended';

  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
}

const studentDashboardController = {
  //========================= STUDENT PROFILE ================================//

  // Get student profile
  getProfile: async (req, res) => {
    try {
      const studentId = req.student._id;

      // Find student by ID, excluding password
      const student = await Student.findById(studentId)
        .select('-studentPassword');

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found'
        });
      }

      // Get count of competitions this student has participated in
      const competitionsCount = student.competitions ? student.competitions.length : 0;

      // Count completed competitions
      const completedCompetitionsCount = student.competitions ? student.competitions.filter(comp => comp.completed).length : 0;

      // Get student's best performance
      const bestScore = await CompetitionResult.aggregate([
        { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
        {
          $group: {
            _id: '$competitionId',
            totalScore: { $sum: '$totalScore' },
            maxPossible: { $sum: '$maxPossibleScore' }
          }
        },
        {
          $project: {
            _id: 1,
            percentage: {
              $cond: [
                { $eq: ['$maxPossible', 0] },
                0,
                { $multiply: [{ $divide: ['$totalScore', '$maxPossible'] }, 100] }
              ]
            }
          }
        },
        { $sort: { percentage: -1 } },
        { $limit: 1 }
      ]);

      const bestPerformance = bestScore.length > 0 ? Math.round(bestScore[0].percentage) : 0;

      res.status(200).json({
        success: true,
        data: {
          student: {
            ...student.toObject(),
            stats: {
              competitionsCount,
              completedCompetitionsCount,
              bestPerformance
            }
          }
        }
      });
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve student profile',
        error: error.message
      });
    }
  },

  // Update student profile
  updateProfile: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { studentFirstName, studentLastName, studentEmail, studentImage, grade, school } = req.body;

      // Find student by ID
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found'
        });
      }

      // Update fields if provided
      if (studentFirstName) student.studentFirstName = studentFirstName;
      if (studentLastName) student.studentLastName = studentLastName;

      // If email is being updated, check if it's already in use by another user
      if (studentEmail && studentEmail !== student.studentEmail) {
        const emailExists = await Student.findOne({ studentEmail, _id: { $ne: studentId } });
        if (emailExists) {
          return res.status(409).json({
            success: false,
            message: 'Email already in use by another student'
          });
        }
        student.studentEmail = studentEmail;
      }

      if (studentImage) student.studentImage = studentImage;
      if (grade) student.grade = grade;
      if (school) student.school = school;

      // Record login time
      student.loginTime.push(new Date());

      await student.save();

      // Return updated student data without password
      const updatedStudent = { ...student.toObject() };
      delete updatedStudent.studentPassword;

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { student: updatedStudent }
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

  // Update student password
  updatePassword: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { currentPassword, newPassword } = req.body;

      // Validate request data
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required'
        });
      }

      // Find student by ID
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found'
        });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, student.studentPassword);
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
      student.studentPassword = hashedPassword;
      await student.save();

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
  //========================= COMPETITIONS ================================//

  // Get available competitions for student (modified to return all competitions with status)
  getAvailableCompetitions: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { status } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Get student's joined competition IDs
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Get IDs of competitions the student has already joined
      const joinedCompetitionIds = student.competitions
        ? student.competitions.map(comp => comp.competitionId)
        : [];

      // Current time for status calculation
      const currentTime = new Date();

      // Build base filter for competition query (all live competitions)
      const filter = {
        isLive: true,
        previousCompetition: false
      };

      // Add competition status filter if specified
      if (req.query.competitionStatus) {
        if (req.query.competitionStatus === 'active') {
          filter.competitionAvailableTiming = { $lte: currentTime };
          filter.endTiming = { $gte: currentTime };
        } else if (req.query.competitionStatus === 'upcoming') {
          filter.competitionAvailableTiming = { $gt: currentTime };
        } else if (req.query.competitionStatus === 'ended') {
          filter.endTiming = { $lt: currentTime };
        }
      }

      // Add joined status filter if specified
      if (status === 'joined') {
        // Get competitions student has joined
        filter._id = { $in: joinedCompetitionIds };
      } else if (status === 'new') {
        // Get competitions student has not joined yet
        filter._id = { $nin: joinedCompetitionIds };
      }

      // Count total matching competitions
      const totalCompetitions = await Competition.countDocuments(filter);

      // Get paginated competitions with comprehensive fields
      const competitions = await Competition.find(filter)
        .select('competitionName competitionType description questions startTiming endTiming competitionAvailableTiming duration difficulty creatorId tags lastSaved status')
        .sort({ competitionAvailableTiming: -1 }) // Sort by availability date (newest first)
        .skip(skip)
        .limit(limit)
        .populate('creatorId', 'teacherFirstName teacherLastName teacherEmail');

      // Add participation status and calculate current status for each competition
      const competitionsWithStatus = competitions.map(competition => {
        const joinedCompetition = student.competitions?.find(comp =>
          comp.competitionId.toString() === competition._id.toString()
        );

        // Calculate competition status based on timing
        let competitionStatus = competition.status || 'upcoming'; // Use stored status if available

        // Recalculate status to ensure it's current
        if (currentTime >= new Date(competition.competitionAvailableTiming) &&
          (!competition.endTiming || currentTime <= new Date(competition.endTiming))) {
          competitionStatus = 'active';
        } else if (competition.endTiming && currentTime > new Date(competition.endTiming)) {
          competitionStatus = 'ended';
        } else if (currentTime < new Date(competition.competitionAvailableTiming)) {
          competitionStatus = 'upcoming';
        }

        // Get any existing results if the student has joined
        let submissionStatus = null;
        let score = null;

        // If student has completed the competition, add submission status
        if (joinedCompetition && joinedCompetition.completed) {
          submissionStatus = 'submitted';
        } else if (joinedCompetition) {
          submissionStatus = 'joined';
        }

        // Calculate time remaining or time until competition starts
        let timeStatus = {};
        const now = new Date();

        if (competitionStatus === 'upcoming') {
          const timeToStart = new Date(competition.competitionAvailableTiming) - now;
          timeStatus = {
            type: 'startsIn',
            milliseconds: timeToStart > 0 ? timeToStart : 0,
            formattedTime: formatTimeRemaining(timeToStart)
          };
        } else if (competitionStatus === 'active') {
          const timeRemaining = competition.endTiming ? (new Date(competition.endTiming) - now) : (competition.duration * 60 * 1000);
          timeStatus = {
            type: 'endsIn',
            milliseconds: timeRemaining > 0 ? timeRemaining : 0,
            formattedTime: formatTimeRemaining(timeRemaining)
          };
        } else {
          timeStatus = {
            type: 'ended',
            milliseconds: 0,
            formattedTime: 'Ended'
          };
        }

        // Format competition object with all necessary info
        return {
          _id: competition._id,
          competitionName: competition.competitionName,
          competitionType: competition.competitionType,
          description: competition.description,
          difficulty: competition.difficulty || 'medium',
          startTiming: competition.startTiming,
          competitionAvailableTiming: competition.competitionAvailableTiming,
          endTiming: competition.endTiming,
          duration: competition.duration,
          totalQuestions: competition.questions?.length || 0,
          creatorInfo: competition.creatorId ? {
            _id: competition.creatorId._id,
            name: `${competition.creatorId.teacherFirstName || ''} ${competition.creatorId.teacherLastName || ''}`.trim(),
            email: competition.creatorId.teacherEmail
          } : { name: 'Unknown Creator' },
          tags: competition.tags || [],
          timeStatus,
          competitionStatus,
          participation: {
            isJoined: !!joinedCompetition,
            joinedOn: joinedCompetition?.joinedOn || null,
            completed: joinedCompetition?.completed || false,
            submissionStatus
          }
        };
      });

      res.status(200).json({
        success: true,
        data: {
          competitions: competitionsWithStatus,
          pagination: {
            total: totalCompetitions,
            page,
            pages: Math.ceil(totalCompetitions / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error('Error in getAvailableCompetitions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve available competitions',
        error: error.message
      });
    }
  },

  // Get competition details (overview without questions)
  getCompetitionOverview: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { id } = req.params;

      // Check if ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid competition ID format'
        });
      }

      // Get competition details without full question content
      const competition = await Competition.findOne({
        _id: id,
        isLive: true
      })
        .select('competitionName competitionType description creatorId startTiming endTiming competitionAvailableTiming duration status lastSaved totalQuestions difficulty tags')
        .populate('creatorId', 'teacherFirstName teacherLastName teacherEmail');

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found or not available'
        });
      }

      // Get student participation details
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      const participationInfo = student.competitions?.find(comp =>
        comp.competitionId.toString() === competition._id.toString()
      );

      // Calculate current competition status based on time
      const now = new Date();
      const availableFrom = new Date(competition.competitionAvailableTiming || competition.startTiming);
      const endTime = competition.endTiming ? new Date(competition.endTiming) :
        (availableFrom && competition.duration ?
          new Date(availableFrom.getTime() + (competition.duration * 60000)) : null);

      let competitionStatus = competition.status || 'upcoming';
      // Recalculate to ensure the status is current
      if (now < availableFrom) {
        competitionStatus = 'upcoming';
      } else if (now >= availableFrom && (!endTime || now <= endTime)) {
        competitionStatus = 'active';
      } else {
        competitionStatus = 'ended';
      }

      let canJoin = competitionStatus === 'active' && !competition.previousCompetition;
      let canSubmit = !!participationInfo && competitionStatus === 'active';
      let canViewResults = !!participationInfo && participationInfo.completed;

      // Get any existing results
      const result = await CompetitionResult.findOne({
        competitionId: competition._id,
        studentId
      }).select('isSubmitted submissionTime isGraded totalScore maxPossibleScore timeSpent').lean();

      // Calculate time information
      let timeInfo = {};
      if (competitionStatus === 'upcoming') {
        const timeToStart = availableFrom - now;
        timeInfo = {
          type: 'startsIn',
          milliseconds: timeToStart > 0 ? timeToStart : 0,
          formattedTime: formatTimeRemaining(timeToStart)
        };
      } else if (competitionStatus === 'active' && endTime) {
        const timeRemaining = endTime - now;
        timeInfo = {
          type: 'endsIn',
          milliseconds: timeRemaining > 0 ? timeRemaining : 0,
          formattedTime: formatTimeRemaining(timeRemaining)
        };
      } else {
        timeInfo = {
          type: 'ended',
          milliseconds: 0,
          formattedTime: 'Ended'
        };
      }

      // Get question count
      const questionsCount = await Competition.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        { $project: { count: { $size: "$questions" } } }
      ]);

      const totalQuestions = questionsCount.length > 0 ? questionsCount[0].count : 0;

      // Add participation status to competition response
      const competitionWithStatus = {
        _id: competition._id,
        competitionName: competition.competitionName,
        competitionType: competition.competitionType,
        description: competition.description || '',
        creatorInfo: competition.creatorId ? {
          _id: competition.creatorId._id,
          name: `${competition.creatorId.teacherFirstName || ''} ${competition.creatorId.teacherLastName || ''}`.trim(),
          email: competition.creatorId.teacherEmail
        } : { name: 'Unknown Creator' },
        startTiming: competition.startTiming,
        competitionAvailableTiming: competition.competitionAvailableTiming,
        endTiming: competition.endTiming || (endTime ? endTime.toISOString() : null),
        lastSaved: competition.lastSaved,
        duration: competition.duration,
        difficulty: competition.difficulty || 'medium',
        tags: competition.tags || [],
        status: competitionStatus,
        timeInfo,
        totalQuestions,
        participation: {
          isJoined: !!participationInfo,
          joinedOn: participationInfo?.joinedOn || null,
          completed: participationInfo?.completed || false,
          isSubmitted: result?.isSubmitted || false,
          timeSpent: result?.timeSpent || 0
        },
        permissions: {
          canJoin,
          canSubmit,
          canViewResults
        }
      };

      // Add scores if graded
      if (result?.isGraded) {
        competitionWithStatus.score = {
          totalScore: result.totalScore,
          maxPossibleScore: result.maxPossibleScore,
          percentage: result.maxPossibleScore > 0
            ? Math.round((result.totalScore / result.maxPossibleScore) * 100)
            : 0,
          isGraded: true,
          gradedTime: result.gradedTime
        };

        // Get position/rank if available
        if (result.totalScore > 0) {
          // Count students with higher scores
          const betterResults = await CompetitionResult.countDocuments({
            competitionId: competition._id,
            isGraded: true,
            totalScore: { $gt: result.totalScore }
          });

          competitionWithStatus.score.rank = betterResults + 1;
        }
      }

      res.status(200).json({
        success: true,
        data: {
          competition: competitionWithStatus
        }
      });
    } catch (error) {
      console.error('Error in getCompetitionOverview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve competition overview',
        error: error.message
      });
    }
  },

  // Get competition details with questions for participation
  getCompetitionDetails: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { id } = req.params;

      // Check if ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        // Handle non-ObjectId values like "active"
        if (id === "active") {
          // Fetch the most recent active competition the student has joined
          const student = await Student.findById(studentId);

          if (!student || !student.competitions || student.competitions.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'No active competitions found for this student'
            });
          }

          // Sort competitions by join date (most recent first)
          const sortedCompetitions = [...student.competitions]
            .sort((a, b) => new Date(b.joinedOn) - new Date(a.joinedOn));

          // Find the most recent active competition
          for (const comp of sortedCompetitions) {
            const competition = await Competition.findOne({
              _id: comp.competitionId,
              isLive: true
            });

            if (competition) {
              // Redirect to the regular competition details with the actual ID
              return res.status(200).json({
                success: true,
                data: {
                  redirectToCompetition: competition._id
                }
              });
            }
          }

          return res.status(404).json({
            success: false,
            message: 'No active competitions found for this student'
          });
        } else {
          return res.status(400).json({
            success: false,
            message: 'Invalid competition ID format'
          });
        }
      }

      // Get competition details (now with valid ObjectId)
      const competition = await Competition.findOne({
        _id: id,
        isLive: true
      }).populate('creatorId', 'teacherFirstName teacherLastName teacherEmail');

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found or not available'
        });
      }

      // Get student participation details
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      const participationInfo = student.competitions?.find(comp =>
        comp.competitionId.toString() === competition._id.toString()
      );

      // Check if the student has joined this competition
      if (!participationInfo) {
        // Instead of returning 403, just send competition without questions
        return res.status(200).json({
          success: true,
          data: {
            competition: {
              _id: competition._id,
              competitionName: competition.competitionName,
              competitionType: competition.competitionType,
              description: competition.description || '',
              creatorId: competition.creatorId,
              startTiming: competition.startTiming,
              endTiming: competition.endTiming,
              isLive: competition.isLive,
              questions: competition.questions,
              competitionAvailableTiming: competition.competitionAvailableTiming,
              status: competition.status,
              isJoined: false,
              totalQuestions: competition.questions?.length || 0
            }
          }
        });
      }

      // Safely check competition timing
      const now = new Date();
      const availableFrom = competition.competitionAvailableTiming ? new Date(competition.competitionAvailableTiming) : null;
      const endTime = competition.endTiming ? new Date(competition.endTiming) : null;

      // Allow access to questions even if outside of time window, but mark as not active
      let isActive = true;
      if (availableFrom && now < availableFrom) {
        isActive = false;
      } else if (endTime && now > endTime) {
        isActive = false;
      }

      // Get any existing results
      const result = await CompetitionResult.findOne({
        competitionId: competition._id,
        studentId
      }).lean();

      // Check if result is already submitted
      const isSubmitted = result?.isSubmitted || false;
      const isGraded = result?.isGraded || false;

      // Prepare competition response
      let competitionWithStatus = {
        ...competition.toObject(),
        isJoined: true,
        joinedOn: participationInfo?.joinedOn || null,
        completed: participationInfo?.completed || false,
        isSubmitted,
        isGraded,
        isActive
      };

      // Add timing info
      if (availableFrom && endTime) {
        competitionWithStatus.timeInfo = {
          isActive,
          availableFrom: availableFrom.toISOString(),
          endTime: endTime.toISOString(),
          currentTime: now.toISOString(),
          remainingTime: isActive ? Math.max(0, endTime - now) : 0
        };
      }

      // Handle questions based on submission state
      if (isSubmitted && result) {
        // For submitted competitions, include user's answers
        competitionWithStatus.questions = competition.questions.map((question, index) => {
          // Only include answer if competition is completed
          if (participationInfo.completed) {
            return question;
          } else {
            // Otherwise remove answers
            const { answer, ...questionWithoutAnswer } = question.toObject();
            return questionWithoutAnswer;
          }
        });

        // Include student's answers
        competitionWithStatus.studentAnswers = result.answers || [];

        // Include scores if the competition is graded
        if (isGraded) {
          competitionWithStatus.totalScore = result.totalScore;
          competitionWithStatus.maxPossibleScore = result.maxPossibleScore;
          competitionWithStatus.scorePercentage = result.maxPossibleScore > 0
            ? (result.totalScore / result.maxPossibleScore) * 100
            : 0;
        }
      } else {
        try {
          // For competitions not yet submitted, include questions without answers
          competitionWithStatus.questions = competition.questions.map(question => {
            // Handle case where question might not be a valid object
            try {
              if (question && typeof question.toObject === 'function') {
                const questionObj = question.toObject();
                const { answer, ...questionWithoutAnswer } = questionObj;
                return questionWithoutAnswer;
              } else {
                // Handle case where question is already a plain object
                const { answer, ...questionWithoutAnswer } = question;
                return questionWithoutAnswer;
              }
            } catch (err) {
              console.error('Error processing question:', err);
              // Return a safe version of the question
              return {
                _id: question._id,
                question: question.question || 'Question unavailable',
                options: question.options || []
              };
            }
          });

          // If there's a previously saved but not submitted answer, include it
          if (result && result.answers && !result.isSubmitted) {
            competitionWithStatus.savedAnswers = result.answers;
          }
        } catch (err) {
          console.error('Error processing questions:', err);
          // Provide a safe fallback
          competitionWithStatus.questions = [];
          competitionWithStatus.errorProcessingQuestions = true;
        }
      }

      // Return competition details
      res.status(200).json({
        success: true,
        data: {
          competition: competitionWithStatus
        }
      });
    } catch (error) {
      console.error('Error in getCompetitionDetails:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve competition details',
        error: error.message
      });
    }
  },

  // Join competition
  joinCompetition: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { id } = req.params;

      // Check if competition exists and is live
      const competition = await Competition.findOne({
        _id: id,
        isLive: true,
        previousCompetition: false
      });

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found or not available for joining'
        });
      }

      // Check if competition is available based on timing
      const now = new Date();
      if (now < competition.competitionAvailableTiming || now > competition.endTiming) {
        return res.status(403).json({
          success: false,
          message: 'This competition is not available at this time',
          competitionTimings: {
            availableFrom: competition.competitionAvailableTiming,
            availableTo: competition.endTiming,
            currentTime: now
          }
        });
      }

      // Find student
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Check if student has already joined this competition
      const alreadyJoined = student.competitions?.some(comp =>
        comp.competitionId.toString() === competition._id.toString()
      );

      if (alreadyJoined) {
        return res.status(400).json({
          success: false,
          message: 'You have already joined this competition'
        });
      }

      // Add competition to student's competitions array
      if (!student.competitions) {
        student.competitions = [];
      }

      student.competitions.push({
        competitionId: competition._id,
        joinedOn: new Date(),
        completedRounds: [],
        completed: false
      });

      // Also maintain the competitionsJoined array for backward compatibility
      if (!student.competitionsJoined) {
        student.competitionsJoined = [];
      }

      if (!student.competitionsJoined.includes(competition._id)) {
        student.competitionsJoined.push(competition._id);
      }

      await student.save();

      res.status(200).json({
        success: true,
        message: 'Successfully joined the competition',
        data: {
          competition: {
            _id: competition._id,
            competitionName: competition.competitionName,
            competitionType: competition.competitionType,
            joinedOn: new Date(),
            totalQuestions: competition.questions.length,
            duration: competition.duration
          }
        }
      });
    } catch (error) {
      console.error('Error in joinCompetition:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to join competition',
        error: error.message
      });
    }
  },

  // Save competition answers (without submitting)
  saveCompetitionAnswers: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { id } = req.params;
      const { answers, timeSpent } = req.body;

      // Validate input
      if (!Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message: 'Answers must be provided as an array'
        });
      }

      // Check if competition exists and is live
      const competition = await Competition.findOne({
        _id: id,
        isLive: true
      });

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found or not available'
        });
      }

      // Check if student has joined this competition
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      const participationInfo = student.competitions?.find(comp =>
        comp.competitionId.toString() === competition._id.toString()
      );

      if (!participationInfo) {
        return res.status(403).json({
          success: false,
          message: 'You have not joined this competition'
        });
      }

      // Find existing submission or create new one
      let submission = await CompetitionResult.findOne({
        competitionId: id,
        studentId
      });

      if (submission && submission.isSubmitted) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted answers for this competition'
        });
      }

      if (submission) {
        // Update existing saved answers
        submission.answers = answers;
        submission.timeSpent = timeSpent || submission.timeSpent;
        submission.lastSavedTime = new Date();
      } else {
        // Create new draft submission
        submission = new CompetitionResult({
          competitionId: id,
          studentId,
          creatorId: competition.creatorId,
          answers,
          isSubmitted: false,
          lastSavedTime: new Date(),
          competitionType: competition.competitionType,
          timeSpent: timeSpent || 0
        });
      }

      await submission.save();

      res.status(200).json({
        success: true,
        message: 'Answers saved successfully',
        data: {
          lastSavedTime: submission.lastSavedTime
        }
      });
    } catch (error) {
      console.error('Error in saveCompetitionAnswers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save answers',
        error: error.message
      });
    }
  },

  // Submit competition answers
  submitCompetitionAnswers: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { id } = req.params;
      const { answers, timeSpent } = req.body;

      // Validate input
      if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Answers must be provided as a non-empty array'
        });
      }

      // Check if competition exists and is live
      const competition = await Competition.findOne({
        _id: id,
        isLive: true
      });

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found or not available'
        });
      }

      // Check if competition is still active
      const now = new Date();
      if (now > competition.endTiming) {
        return res.status(403).json({
          success: false,
          message: 'This competition has ended and is no longer accepting submissions',
        });
      }

      // Check if student has joined this competition
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Find student's participation record
      const participationIndex = student.competitions?.findIndex(comp =>
        comp.competitionId.toString() === competition._id.toString()
      );

      if (participationIndex === -1) {
        return res.status(403).json({
          success: false,
          message: 'You have not joined this competition'
        });
      }

      // Check if student has already submitted for this competition
      const existingSubmission = await CompetitionResult.findOne({
        competitionId: id,
        studentId,
        isSubmitted: true
      });

      if (existingSubmission) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted answers for this competition'
        });
      }

      // Find existing draft or create new submission
      let submission = await CompetitionResult.findOne({
        competitionId: id,
        studentId,
        isSubmitted: false
      });

      if (submission) {
        // Update existing submission
        submission.answers = answers;
        submission.timeSpent = timeSpent || submission.timeSpent;
        submission.isSubmitted = true;
        submission.submissionTime = new Date();
      } else {
        // Create new submission
        submission = new CompetitionResult({
          competitionId: id,
          studentId,
          creatorId: competition.creatorId,
          answers,
          isSubmitted: true,
          submissionTime: new Date(),
          competitionType: competition.competitionType,
          timeSpent: timeSpent || 0
        });
      }

      // For MCQ questions, we can auto-grade
      if (competition.competitionType === 'MCQ') {
        // Make sure competition has questions and answers array is the right length
        if (competition.questions && competition.questions.length === answers.length) {
          const gradedAnswers = answers.map((answer, index) => {
            const question = competition.questions[index];
            const correctAnswer = question?.answer;

            // Compare student answer to correct answer
            let isCorrect = false;

            // Only mark as correct if there is a valid answer to check against
            if (correctAnswer && answer.answer !== undefined && answer.answer !== null) {
              isCorrect = answer.answer.toString() === correctAnswer.toString();
            }

            return {
              ...answer,
              isCorrect,
              score: isCorrect ? (question.points || 1) : 0,
              correctAnswer: isCorrect ? undefined : correctAnswer // Only include correct answer if wrong
            };
          });

          submission.answers = gradedAnswers;
          submission.isGraded = true;
          submission.gradedTime = new Date();

          // Calculate total score and max possible score
          let totalScore = 0;
          let maxPossibleScore = 0;

          gradedAnswers.forEach((answer, index) => {
            const points = competition.questions[index].points || 1;
            maxPossibleScore += points;
            if (answer.isCorrect) {
              totalScore += points;
            }
          });

          submission.totalScore = totalScore;
          submission.maxPossibleScore = maxPossibleScore;
          submission.scorePercentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
        }
      } else {
        // For text or code-based questions, mark as not graded
        submission.isGraded = false;
      }

      await submission.save();

      // Update student's competition record to mark as completed
      student.competitions[participationIndex].completed = true;
      await student.save();

      const responseData = {
        submission: {
          _id: submission._id,
          submissionTime: submission.submissionTime,
          isGraded: submission.isGraded
        }
      };

      // Include score info if graded
      if (submission.isGraded) {
        responseData.submission.totalScore = submission.totalScore;
        responseData.submission.maxPossibleScore = submission.maxPossibleScore;
        responseData.submission.scorePercentage = submission.scorePercentage;
      }

      res.status(200).json({
        success: true,
        message: 'Answers submitted successfully',
        data: responseData
      });
    } catch (error) {
      console.error('Error in submitCompetitionAnswers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to submit answers',
        error: error.message
      });
    }
  },

  // Get competition results
  getCompetitionResults: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { competitionId } = req.params;

      // Check if competition exists
      const competition = await Competition.findById(competitionId);

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Check if student has joined this competition
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      const participation = student.competitions?.find(comp =>
        comp.competitionId.toString() === competitionId
      );

      if (!participation) {
        return res.status(403).json({
          success: false,
          message: 'You have not joined this competition'
        });
      }

      // Get result
      const result = await CompetitionResult.findOne({
        competitionId,
        studentId,
        isSubmitted: true
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'No submission found for this competition'
        });
      }

      // Prepare data for response
      const resultData = {
        _id: result._id,
        submissionTime: result.submissionTime,
        isGraded: result.isGraded,
        timeSpent: result.timeSpent
      };

      // Include score info if graded
      if (result.isGraded) {
        resultData.totalScore = result.totalScore;
        resultData.maxPossibleScore = result.maxPossibleScore;
        resultData.scorePercentage = result.scorePercentage;

        // Include detailed answers for MCQ with correct/incorrect status
        resultData.answers = result.answers.map(answer => ({
          questionId: answer.questionId,
          answer: answer.answer,
          isCorrect: answer.isCorrect,
          score: answer.score,
          correctAnswer: answer.correctAnswer
        }));
      }

      // Add questions with correct answers if competition is completed and graded
      if (participation.completed && result.isGraded) {
        resultData.questions = competition.questions.map(q => ({
          _id: q._id,
          question: q.question,
          questionType: q.questionType,
          options: q.options,
          answer: q.answer,
          points: q.points || 1
        }));
      }

      // Check if winners are set
      const isWinner = competition.winner && competition.winner.toString() === studentId.toString();
      const isRunnerUp = competition.runnerUp && competition.runnerUp.toString() === studentId.toString();
      const isSecondRunnerUp = competition.secondRunnerUp && competition.secondRunnerUp.toString() === studentId.toString();

      // Get position
      let position = null;
      if (isWinner) position = 1;
      else if (isRunnerUp) position = 2;
      else if (isSecondRunnerUp) position = 3;

      // Get leaderboard position if not in top 3
      let leaderboardPosition = null;
      if (!position && result.isGraded) {
        // Get all graded results for this competition
        const allResults = await CompetitionResult.find({
          competitionId,
          isGraded: true
        }).sort({ totalScore: -1, timeSpent: 1 });

        // Find student's position in leaderboard
        leaderboardPosition = allResults.findIndex(r =>
          r.studentId.toString() === studentId.toString()
        ) + 1; // Add 1 because array is 0-indexed
      }

      res.status(200).json({
        success: true,
        data: {
          competitionName: competition.competitionName,
          competitionType: competition.competitionType,
          isCompleted: participation.completed,
          isGraded: result.isGraded,
          result: resultData,
          position: position || leaderboardPosition,
          totalParticipants: competition.participantsCount || 0
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

  // Get leaderboard for a competition
  getCompetitionLeaderboard: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { competitionId } = req.params;
      const limit = parseInt(req.query.limit) || 10;

      // Check if competition exists
      const competition = await Competition.findById(competitionId);

      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Get all graded results for this competition
      const results = await CompetitionResult.find({
        competitionId,
        isGraded: true
      })
        .sort({ totalScore: -1, timeSpent: 1 })
        .limit(limit)
        .populate('studentId', 'firstName lastName email profilePicture');

      // Format leaderboard data
      const leaderboard = results.map((result, index) => {
        // Handle case when studentId might be null (deleted student)
        const student = result.studentId || { firstName: 'Unknown', lastName: 'User' };

        return {
          position: index + 1,
          student: {
            _id: student._id,
            name: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
            profilePicture: student.profilePicture
          },
          score: result.totalScore,
          maxScore: result.maxPossibleScore,
          percentage: result.scorePercentage,
          timeSpent: result.timeSpent,
          isCurrentUser: student._id && student._id.toString() === studentId.toString()
        };
      });

      // Get student's own position if not in top results
      let currentUserPosition = leaderboard.findIndex(item => item.isCurrentUser);
      let currentUserEntry = null;

      // If student is not in the top results, find their position
      if (currentUserPosition === -1) {
        const allResults = await CompetitionResult.find({
          competitionId,
          isGraded: true
        }).sort({ totalScore: -1, timeSpent: 1 });

        currentUserPosition = allResults.findIndex(r =>
          r.studentId && r.studentId.toString() === studentId.toString()
        );

        if (currentUserPosition !== -1) {
          const userResult = allResults[currentUserPosition];
          const student = await Student.findById(studentId);

          if (student && userResult) {
            currentUserEntry = {
              position: currentUserPosition + 1,
              student: {
                _id: student._id,
                name: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
                profilePicture: student.profilePicture
              },
              score: userResult.totalScore,
              maxScore: userResult.maxPossibleScore,
              percentage: userResult.scorePercentage,
              timeSpent: userResult.timeSpent,
              isCurrentUser: true
            };
          }
        }
      }

      res.status(200).json({
        success: true,
        data: {
          competitionName: competition.competitionName,
          leaderboard,
          currentUserPosition: currentUserPosition !== -1 ? currentUserPosition + 1 : null,
          currentUserEntry,
          totalParticipants: competition.participantsCount || 0
        }
      });
    } catch (error) {
      console.error('Error in getCompetitionLeaderboard:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve competition leaderboard',
        error: error.message
      });
    }
  },

  // Get dashboard statistics
  getDashboardStatistics: async (req, res) => {
    try {
      const studentId = req.student._id;

      // Find student
      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Get count of competitions
      const totalCompetitions = student.competitions ? student.competitions.length : 0;
      const completedCompetitions = student.competitions ? student.competitions.filter(comp => comp.completed).length : 0;
      const inProgressCompetitions = totalCompetitions - completedCompetitions;

      // Get participation dates for recent activity
      const recentActivity = student.competitions
        ? student.competitions
          .sort((a, b) => new Date(b.joinedOn) - new Date(a.joinedOn))
          .slice(0, 5)
        : [];

      // Get recent competition details
      const recentCompetitions = [];
      for (const activity of recentActivity) {
        const competition = await Competition.findById(activity.competitionId)
          .select('competitionName isLive previousCompetition');

        if (competition) {
          recentCompetitions.push({
            _id: competition._id,
            competitionName: competition.competitionName,
            isLive: competition.isLive,
            isPrevious: competition.previousCompetition,
            joinedOn: activity.joinedOn,
            completed: activity.completed,
            completedRounds: activity.completedRounds
          });
        }
      }

      // Get upcoming competitions
      const upcomingCompetitions = await Competition.find({
        isLive: true,
        previousCompetition: false,
        startTiming: { $gt: new Date() }
      })
        .sort({ startTiming: 1 })
        .limit(3)
        .select('competitionName startTiming');

      // Get competition performance (scores)
      const competitionResults = await CompetitionResult.aggregate([
        {
          $match: {
            studentId: new mongoose.Types.ObjectId(studentId),
            isGraded: true
          }
        },
        {
          $group: {
            _id: '$competitionId',
            totalScore: { $sum: '$totalScore' },
            maxPossibleScore: { $sum: '$maxPossibleScore' }
          }
        },
        {
          $project: {
            _id: 1,
            totalScore: 1,
            maxPossibleScore: 1,
            percentage: {
              $cond: [
                { $eq: ['$maxPossibleScore', 0] },
                0,
                { $multiply: [{ $divide: ['$totalScore', '$maxPossibleScore'] }, 100] }
              ]
            }
          }
        },
        { $sort: { percentage: -1 } }
      ]);

      // Get competition names
      for (const result of competitionResults) {
        const competition = await Competition.findById(result._id)
          .select('competitionName');

        if (competition) {
          result.competitionName = competition.competitionName;
        } else {
          result.competitionName = 'Unknown Competition';
        }
      }

      // Calculate average score
      const totalPercentage = competitionResults.reduce((sum, result) => sum + result.percentage, 0);
      const averageScore = competitionResults.length > 0 ? totalPercentage / competitionResults.length : 0;

      res.status(200).json({
        success: true,
        data: {
          competitions: {
            total: totalCompetitions,
            completed: completedCompetitions,
            inProgress: inProgressCompetitions
          },
          performance: {
            averageScore,
            bestScore: competitionResults.length > 0 ? Math.round(competitionResults[0].percentage) : 0
          },
          recentCompetitions,
          upcomingCompetitions,
          competitionResults: competitionResults.map(result => ({
            competitionId: result._id,
            competitionName: result.competitionName,
            totalScore: result.totalScore,
            maxPossibleScore: result.maxPossibleScore,
            scorePercentage: Math.round(result.percentage)
          }))
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
  },

};

module.exports = studentDashboardController;
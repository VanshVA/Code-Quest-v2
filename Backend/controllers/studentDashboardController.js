const mongoose = require('mongoose');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Admin = require('../models/admin');
const Competition = require('../models/competition');
const CompetitionResult = require('../models/result');
const Submission = require('../models/submission');
const DisqualifiedStudent = require('../models/disqualifiedStudents'); // Add this import
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


      res.status(200).json({
        success: true,
        data: student
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

  // Get upcoming competitions (not yet started)
  getUpcomingCompetitions: async (req, res) => {
    try {
      const studentId = req.student._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Fetch competitions where status is 'upcoming', student is NOT joined
      const filter = {
        status: 'upcoming',
        previousCompetition: false,
        startTiming: { $ne: "" },
        studentsJoined: { $ne: studentId },
        isLive: true
      };

      const totalCompetitions = await Competition.countDocuments(filter);

      const competitions = await Competition.find(filter)
        .select('competitionName competitionType competitionDescription questions startTiming creatorId endTiming duration status studentsJoined')
        .sort({ startTiming: 1 })
        .skip(skip)
        .limit(limit);

      const processedCompetitions = await Promise.all(competitions.map(async (competition) => {
        // Creator info
        let creatorInfo = { name: 'Unknown Creator' };

        try {
          const Teacher = mongoose.model('teacher');
          const teacher = await Teacher.findById(competition.creatorId).select('teacherFirstName teacherLastName');

          if (teacher) {
            creatorInfo = {
              _id: teacher._id,
              name: `${teacher.teacherFirstName || ''} ${teacher.teacherLastName || ''}`.trim()
            };
          } else {
            const Admin = mongoose.model('admin');
            const admin = await Admin.findById(competition.creatorId).select('adminName');
            if (admin) {
              creatorInfo = {
                _id: admin._id,
                name: admin.adminName || 'Unknown Admin',
              };
            }
          }
        } catch (error) {
          console.error('Error fetching creator info:', error);
        }

        return {
          _id: competition._id,
          competitionName: competition.competitionName,
          competitionType: competition.competitionType,
          competitionDescription: competition.competitionDescription || '',
          startTiming: competition.startTiming,
          endTiming: competition.endTiming,
          duration: competition.duration,
          status: competition.status,
          studentsJoined: competition.studentsJoined || [],
          totalQuestions: competition.questions?.length || 0,
          creatorName: creatorInfo.name,
          competitionStatus: competition.status,
          participation: {
            isJoined: false,
            joinedOn: null,
            completed: false,
            submissionStatus: null
          }
        };
      }));

      res.status(200).json({
        success: true,
        data: {
          competitions: processedCompetitions,
          pagination: {
            total: totalCompetitions,
            page,
            pages: Math.ceil(totalCompetitions / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error('Error in getUpcomingCompetitions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve upcoming competitions',
        error: error.message
      });
    }
  },

  // Get currently active competitions
  getActiveCompetitions: async (req, res) => {
    try {
      const studentId = req.student._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found',
        });
      }

      // Get a list of competition IDs that the student has already joined
      const joinedCompetitionIds = student.competitionsJoined || [];

      const filter = {
        isLive: true,
        previousCompetition: false,
        status: 'active',
        // Exclude competitions that the student has already joined
        _id: { $nin: joinedCompetitionIds }
      };

      const totalCompetitions = await Competition.countDocuments(filter);

      const competitions = await Competition.find(filter)
        .select('competitionName competitionType competitionDescription questions startTiming creatorId endTiming duration status studentsJoined')
        .sort({ endTiming: 1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const now = new Date();

      const processedCompetitions = await Promise.all(
        competitions.map(async (competition) => {
          // We know the student hasn't joined these competitions based on our filter
          const isJoined = false;

          // Get creator info
          let creatorInfo = { name: 'Unknown Creator' };
          try {
            const teacher = await Teacher.findById(competition.creatorId).select('teacherFirstName teacherLastName');
            if (teacher) {
              creatorInfo = {
                _id: teacher._id,
                name: `${teacher.teacherFirstName || ''} ${teacher.teacherLastName || ''}`.trim(),
                email: teacher.teacherEmail,
              };
            } else {
              const admin = await Admin.findById(competition.creatorId).select('adminName');
              if (admin) {
                creatorInfo = {
                  _id: admin._id,
                  name: admin.adminName || 'Unknown Admin',
                };
              }
            }
          } catch (err) {
            console.error('Error fetching creator info:', err);
          }

          // Calculate time remaining
          let timeStatus = {};
          const endTime = competition.endTiming ? new Date(competition.endTiming) : null;
          const timeRemaining = endTime ? endTime - now : competition.duration * 60 * 1000;

          if (now < new Date(competition.competitionAvailableTiming)) {
            const timeToStart = new Date(competition.competitionAvailableTiming) - now;
            timeStatus = {
              type: 'startsIn',
              milliseconds: timeToStart > 0 ? timeToStart : 0,
              formattedTime: formatTimeRemaining(timeToStart),
            };
          } else if (timeRemaining > 0) {
            timeStatus = {
              type: 'endsIn',
              milliseconds: timeRemaining,
              formattedTime: formatTimeRemaining(timeRemaining),
            };
          } else {
            timeStatus = {
              type: 'ended',
              milliseconds: 0,
              formattedTime: 'Ended',
            };
          }

          return {
            _id: competition._id,
            competitionName: competition.competitionName,
            competitionType: competition.competitionType,
            competitionDescription: competition.competitionDescription || '',
            questions: competition.questions || [],
            startTiming: competition.startTiming,
            endTiming: competition.endTiming,
            duration: competition.duration,
            status: competition.status,
            studentsJoined: competition.studentsJoined || [],
            totalQuestions: competition.questions?.length || 0,
            creatorName: creatorInfo.name,
            timeStatus,
            competitionStatus: competition.status,
            participation: {
              isJoined: isJoined,
              joinedOn: null,
              completed: false,
              submissionStatus: null,
            },
          };
        })
      );

      res.status(200).json({
        success: true,
        data: {
          competitions: processedCompetitions,
          pagination: {
            total: totalCompetitions,
            page,
            pages: Math.ceil(totalCompetitions / limit),
            limit,
          },
        },
      });
    } catch (error) {
      console.error('Error in getActiveCompetitions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve active competitions',
        error: error.message,
      });
    }
  },

  // Get competitions joined by the student
  getJoinedCompetitions: async (req, res) => {
    try {
      const studentId = req.student._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const student = await Student.findById(studentId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Use competitionsJoined array directly
      const joinedCompetitionIds = student.competitionsJoined || [];

      if (joinedCompetitionIds.length === 0) {
        return res.status(200).json({
          success: true,
          data: {
            competitions: [],
            pagination: {
              total: 0,
              page,
              pages: 0,
              limit
            }
          }
        });
      }

      // Only filter by joined competition IDs and live status
      const filter = {
        _id: { $in: joinedCompetitionIds },
        // isLive: true
      };

      const totalCompetitions = await Competition.countDocuments(filter);

      const competitions = await Competition.find(filter)
        .select('competitionName competitionType competitionDescription questions startTiming creatorId endTiming duration studentsJoined')
        .sort({ lastSaved: -1 })
        .skip(skip)
        .limit(limit);

      const now = new Date();

      const processedCompetitions = await Promise.all(competitions.map(async competition => {
        // Find the corresponding competition entry in student's competitions array
        const joinedCompetition = student.competitions?.find(comp =>
          comp.competitionId.toString() === competition._id.toString()
        );

        // Resolve creator info (Teacher or Admin)
        let creatorInfo = { name: 'Unknown Creator' };
        try {
          const Teacher = mongoose.model('teacher');
          const teacher = await Teacher.findById(competition.creatorId)
            .select('teacherFirstName teacherLastName');
          if (teacher) {
            creatorInfo = {
              _id: teacher._id,
              name: `${teacher.teacherFirstName || ''} ${teacher.teacherLastName || ''}`.trim(),
              email: teacher.teacherEmail
            };
          } else {
            const Admin = mongoose.model('admin');
            const admin = await Admin.findById(competition.creatorId).select('adminName');
            if (admin) {
              creatorInfo = {
                _id: admin._id,
                name: admin.adminName
              };
            }
          }
        } catch (err) {
          console.error('Error fetching creator info:', err);
        }

        // Determine submission status based only on joined status
        let submissionStatus = joinedCompetition?.completed ? 'submitted' : 'joined';

        return {
          _id: competition._id,
          competitionName: competition.competitionName,
          competitionType: competition.competitionType,
          competitionDescription: competition.competitionDescription || '',
          startTiming: competition.startTiming,
          endTiming: competition.endTiming,
          duration: competition.duration,
          studentsJoined: competition.studentsJoined || [],
          status: competition.status || 'joined',
          totalQuestions: competition.questions?.length || 0,
          creatorName: creatorInfo.name,
          participation: {
            isJoined: true,
            joinedOn: joinedCompetition?.joinedOn || null,
            completed: joinedCompetition?.completed || false,
            submissionStatus
          }
        };
      }));

      res.status(200).json({
        success: true,
        data: {
          competitions: processedCompetitions,
          pagination: {
            total: totalCompetitions,
            page,
            pages: Math.ceil(totalCompetitions / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error('Error in getJoinedCompetitions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve joined competitions',
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

      // Check if student already joined using student.competitions
      const alreadyJoined = student.competitions?.some(comp =>
        comp.competitionId.toString() === competition._id.toString()
      );

      // Additional check to see if student ID exists in competition's studentsJoined array
      const alreadyInCompetition = competition.studentsJoined.some(id =>
        id.toString() === studentId.toString()
      );

      // Check if student ID is in competitionsJoined array
      const alreadyInJoinedList = student.competitionsJoined.some(id =>
        id.toString() === competition._id.toString()
      );

      if (alreadyJoined || alreadyInCompetition || alreadyInJoinedList) {
        return res.status(400).json({
          success: false,
          message: 'You have already joined this competition and cannot join it again'
        });
      }

      // Add competition to student's data
      if (!student.competitionsJoined.includes(competition._id)) {
        student.competitionsJoined.push(competition._id);
      }

      // Add student to competition's studentsJoined array
      if (!competition.studentsJoined.includes(studentId)) {
        competition.studentsJoined.push(studentId);
      }

      // Save both documents concurrently
      await Promise.all([student.save(), competition.save()]);

      res.status(200).json({
        success: true,
        message: 'Successfully joined the competition',
        data: {
          competition: {
            _id: competition._id,
            competitionName: competition.competitionName,
            competitionType: competition.competitionType,
            joinedOn: now,
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

  // Submit competition answers
  submitCompetitionAnswers: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { competitionId, questions, answers } = req.body;

      // Basic validation
      if (!competitionId || !questions || !answers) {
        return res.status(400).json({
          success: false,
          message: 'Competition ID, questions and answers are required'
        });
      }

      if (!Array.isArray(questions) || !Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message: 'Questions and answers must be arrays'
        });
      }

      if (questions.length !== answers.length) {
        return res.status(400).json({
          success: false,
          message: 'Questions and answers arrays must be of the same length'
        });
      }

      // Check if the competition exists
      const competition = await Competition.findById(competitionId);
      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Find the student
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Check if student has already submitted answers for this competition
      const existingSubmission = await Submission.findOne({
        competitionId: competitionId,
        studentId: studentId
      });

      if (existingSubmission) {
        return res.status(409).json({
          success: false,
          message: 'You have already submitted answers for this competition'
        });
      }

      // Create new submission
      const submission = new Submission({
        competitionId: competitionId,
        studentId: studentId,
        questions: questions,
        answers: answers,
        submissionTime: new Date()
      });

      // Save the submission
      await submission.save();

      res.status(201).json({
        success: true,
        message: 'Competition answers submitted successfully',
        data: {
          submissionId: submission._id,
          submittedOn: submission.submissionTime
        }
      });
    } catch (error) {
      console.error('Error in submitCompetitionAnswers:', error);

      // Handle duplicate key error (student already submitted for this competition)
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'You have already submitted answers for this competition'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to submit competition answers',
        error: error.message
      });
    }
  },

  // Disqualify student from competition
  disqualifyStudent: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { competitionId, reason } = req.body;

      // Basic validation
      if (!competitionId || !studentId || !reason) {
        return res.status(400).json({
          success: false,
          message: 'Competition ID, student ID and reason are required'
        });
      }

      // Check if the competition exists
      const competition = await Competition.findById(competitionId);
      if (!competition) {
        return res.status(404).json({
          success: false,
          message: 'Competition not found'
        });
      }

      // Find the student
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Check if student has joined the competition
      const isJoined = student.competitionsJoined?.some(compId =>
        compId.toString() === competitionId.toString()
      );

      if (!isJoined) {
        return res.status(400).json({
          success: false,
          message: 'Student has not joined this competition'
        });
      }

      // Check if student has already been disqualified
      const existingDisqualification = await DisqualifiedStudent.findOne({
        competitionId,
        studentId
      });

      if (existingDisqualification) {
        return res.status(409).json({
          success: false,
          message: 'Student has already been disqualified from this competition'
        });
      }

      // Create new disqualification record
      const disqualification = new DisqualifiedStudent({
        studentId,
        competitionId,
        disqualifiedStatus: true,
        disqualificationReason: reason,
        disqualifiedAt: new Date()
      });

      // Save the disqualification record
      await disqualification.save();

      res.status(200).json({
        success: true,
        message: 'Student has been disqualified from the competition',
        data: {
          disqualificationInfo: {
            id: disqualification._id,
            studentId: student._id,
            competitionId: competition._id,
            reason: reason,
            disqualifiedAt: disqualification.disqualifiedAt
          }
        }
      });
    } catch (error) {
      console.error('Error in disqualifyStudent:', error);

      // Handle duplicate key error (student already disqualified)
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Student has already been disqualified from this competition'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to disqualify student',
        error: error.message
      });
    }
  },

  // Get all results for a student
  getAllResults: async (req, res) => {
    try {
      const studentId = req.student._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Find all results for this student
      const totalResults = await CompetitionResult.countDocuments({ studentId });

      const results = await CompetitionResult.find({ studentId })
        .populate({
          path: 'competitionId',
          select: 'competitionName competitionType startTiming endTiming duration creatorId'
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      if (results.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No results found for this student',
          data: {
            results: [],
            pagination: {
              total: 0,
              page,
              pages: 0,
              limit
            }
          }
        });
      }

      // Process the results to include competition details and creator information
      const processedResults = await Promise.all(results.map(async (result) => {
        let creatorInfo = { name: 'Unknown Creator' };

        if (result.competitionId && result.competitionId.creatorId) {
          try {
            const teacher = await Teacher.findById(result.competitionId.creatorId)
              .select('teacherFirstName teacherLastName');

            if (teacher) {
              creatorInfo = {
                _id: teacher._id,
                name: `${teacher.teacherFirstName || ''} ${teacher.teacherLastName || ''}`.trim()
              };
            } else {
              const admin = await Admin.findById(result.competitionId.creatorId)
                .select('adminName');

              if (admin) {
                creatorInfo = {
                  _id: admin._id,
                  name: admin.adminName || 'Unknown Admin'
                };
              }
            }
          } catch (err) {
            console.error('Error fetching creator info:', err);
          }
        }

        return {
          _id: result._id,
          studentId: result.studentId,
          competitionId: result.competitionId?._id || null,
          competitionName: result.competitionId?.competitionName || 'Unknown Competition',
          competitionType: result.competitionId?.competitionType || 'Unknown Type',
          score: result.score,
          rank: result.rank,
          timeTaken: result.timeTaken,
          submissionTime: result.submissionTime,
          correctAnswers: result.correctAnswers,
          totalQuestions: result.totalQuestions,
          percentageScore: ((result.correctAnswers / result.totalQuestions) * 100).toFixed(2),
          creatorName: creatorInfo.name
        };
      }));

      res.status(200).json({
        success: true,
        data: {
          results: processedResults,
          pagination: {
            total: totalResults,
            page,
            pages: Math.ceil(totalResults / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error('Error in getAllResults:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve results',
        error: error.message
      });
    }
  },

  // Get result for a specific competition
  getResultByCompetitionId: async (req, res) => {
    try {
      const studentId = req.student._id;
      const { competitionId } = req.params;

      // Validate competitionId format
      if (!mongoose.Types.ObjectId.isValid(competitionId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid competition ID format'
        });
      }

      // Find the result for this student and competition with more detailed population
      const result = await CompetitionResult.findOne({
        studentId,
        competitionId
      })
      .populate({
        path: 'competitionId',
        select: 'competitionName competitionType startTiming endTiming duration creatorId'
      })
      .populate({
        path: 'submissionId',
        select: 'questions answers submissionTime'
      });

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'No result found for this student and competition'
        });
      }

      // Get creator information
      let creatorName = 'Unknown Creator';
      if (result.competitionId?.creatorId) {
        try {
          const teacher = await Teacher.findById(result.competitionId.creatorId)
            .select('teacherFirstName teacherLastName');

          if (teacher) {
            creatorName = `${teacher.teacherFirstName || ''} ${teacher.teacherLastName || ''}`.trim();
          } else {
            const admin = await Admin.findById(result.competitionId.creatorId)
              .select('adminName');
            
            if (admin) {
              creatorName = admin.adminName || 'Unknown Admin';
            }
          }
        } catch (err) {
          console.error('Error fetching creator info:', err);
        }
      }

      // Format the response to include the result data directly
      const responseData = {
        _id: result._id,
        studentId: result.studentId,
        competitionId: result.competitionId?._id,
        competitionName: result.competitionId?.competitionName || 'Unknown Competition',
        competitionType: result.competitionId?.competitionType || 'Unknown Type',
        submissionId: result.submissionId?._id,
        results: result.results || [],
        totalScore: result.totalScore,
        percentageScore: result.percentageScore,
        scoreAssignedTime: result.scoreAssignedTime,
        creatorName: creatorName,
        // Include any additional fields needed from result or competition
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      };

      res.status(200).json({
        success: true,
        data: responseData
      });
    } catch (error) {
      console.error('Error in getResultByCompetitionId:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve result',
        error: error.message
      });
    }
  },

  //========================== DASHBOARD STATISTICS ================================//
  
  // Get student dashboard summary
  getStudentDashboardStats: async (req, res) => {
    try {
      const studentId = req.student._id;

      // Get student details
      const student = await Student.findById(studentId)
        .select('-studentPassword')
        .lean();

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found'
        });
      }

      // Get total competitions joined
      const totalCompetitionsJoined = student.competitionsJoined?.length || 0;

      // Get performance metrics from results
      const results = await CompetitionResult.find({ studentId })
        .select('percentageScore totalScore')
        .lean();

      let performanceMetrics = {
        totalCompetitionsCompleted: results.length,
        averageScore: 0,
        highestScore: 0,
        totalScore: 0
      };

      if (results.length > 0) {
        const scores = results.map(result => result.percentageScore);
        performanceMetrics.averageScore = +(scores.reduce((acc, val) => acc + val, 0) / scores.length).toFixed(2);
        performanceMetrics.highestScore = Math.max(...scores);
        performanceMetrics.totalScore = results.reduce((acc, result) => acc + result.totalScore, 0);
      }

      // Get recent activity
      const recentActivity = {
        registrationTime: student.registerTime,
        lastLogin: student.loginTimeArray?.length > 0 
          ? student.loginTimeArray[student.loginTimeArray.length - 1] 
          : student.loginTime || null,
        loginHistory: student.loginTimeArray?.slice(-5) || []  // Get last 5 logins
      };

      // Get upcoming competitions
      const now = new Date();
      const upcomingCompetitions = await Competition.find({
        isLive: true,
        previousCompetition: false,
        startTiming: { $gt: now },
        _id: { $nin: student.competitionsJoined || [] }  // Exclude joined competitions
      })
      .select('competitionName startTiming endTiming competitionType')
      .sort({ startTiming: 1 })
      .limit(5)
      .lean();

      // Format upcoming competitions
      const formattedUpcomingCompetitions = upcomingCompetitions.map(comp => ({
        _id: comp._id,
        name: comp.competitionName,
        type: comp.competitionType,
        startTime: comp.startTiming,
        endTime: comp.endTiming,
        timeUntilStart: formatTimeRemaining(new Date(comp.startTiming) - now)
      }));

      // Get recent results
      const recentResults = await CompetitionResult.find({ studentId })
        .populate({
          path: 'competitionId',
          select: 'competitionName competitionType'
        })
        .select('percentageScore totalScore scoreAssignedTime')
        .sort({ scoreAssignedTime: -1 })
        .limit(5)
        .lean();

      // Format recent results
      const formattedRecentResults = recentResults.map(result => ({
        _id: result._id,
        competitionId: result.competitionId?._id,
        competitionName: result.competitionId?.competitionName || 'Unknown Competition',
        competitionType: result.competitionId?.competitionType || 'Unknown Type',
        score: result.percentageScore,
        totalPoints: result.totalScore,
        date: result.scoreAssignedTime
      }));

      res.status(200).json({
        success: true,
        data: {
          student: {
            _id: student._id,
            name: `${student.studentFirstName} ${student.studentLastName}`,
            email: student.studentEmail,
            image: student.studentImage,
            role: student.role
          },
          participation: {
            totalCompetitionsJoined,
            competitionsCompleted: performanceMetrics.totalCompetitionsCompleted,
            competitionsPending: totalCompetitionsJoined - performanceMetrics.totalCompetitionsCompleted
          },
          performance: performanceMetrics,
          recentActivity,
          upcomingCompetitions: formattedUpcomingCompetitions,
          recentResults: formattedRecentResults
        }
      });
    } catch (error) {
      console.error('Error in getStudentDashboardSummary:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve student dashboard summary',
        error: error.message
      });
    }
  },

};

module.exports = studentDashboardController;
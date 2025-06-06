const Competition = require('../models/competition');
const Feedback = require('../models/feedback');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const Result = require('../models/result');

// Helper function to format time remaining
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

const generalController = {
  
  // Get platform statistics
  getStatistics: async (req, res) => {
    try {
      // Get current time
      const now = new Date();

      // Get total students count
      const totalStudents = await Student.countDocuments();

      // Get total competitions count
      const totalCompetitions = await Competition.countDocuments();

      // Get active competitions count
      const activeCompetitions = await Competition.countDocuments({
        status: 'active',
      });

      // Get upcoming competitions count
      const upcomingCompetitions = await Competition.countDocuments({
        isLive: true,
        previousCompetition: false,
        startTiming: { $gt: now }
      });

      // Get recently ended competitions count (last 30 days)
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentlyEndedCompetitions = await Competition.countDocuments({
        endTiming: { 
          $lt: now,
          $gte: thirtyDaysAgo
        }
      });

      // Get total participants count (students who have participated in at least one competition)
      const participatingStudents = await Student.countDocuments({
        'competitions.0': { $exists: true } // Has at least one competition in the array
      });

      // Get total teachers count (optional)
      const totalTeachers = await Teacher.countDocuments();

      // Return statistics
      res.status(200).json({
        success: true,
        data: {
          totalStudents,
          totalCompetitions,
          activeCompetitions,
          upcomingCompetitions,
          recentlyEndedCompetitions,
          participatingStudents,
          totalTeachers,
          lastUpdated: new Date()
        }
      });
    } catch (error) {
      console.error('Error in getStatistics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve platform statistics',
        error: error.message
      });
    }
  },

  // Get all feedback without filtering
  getAllFeedback: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Get total count of all feedback entries
      const totalCount = await Feedback.countDocuments();
      
      // Get all feedback with pagination
      const feedbackList = await Feedback.find()
        .sort({ submittedAt: -1 }) // Sort by newest first
        .skip(skip)
        .limit(limit);
      
      res.status(200).json({
        success: true,
        data: {
          feedback: feedbackList,
          pagination: {
            total: totalCount,
            page,
            pages: Math.ceil(totalCount / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error('Error in getAllFeedback:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve feedback',
        error: error.message
      });
    }
  },
  
  // Get all competitions without filtering
  getAllCompetitions: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Get total count of all competitions
      const totalCount = await Competition.countDocuments();
      
      // Get all competitions with pagination
      const competitionsList = await Competition.find()
        .sort({ lastSaved: -1 }) // Sort by newest/last updated first
        .skip(skip)
        .limit(limit);
      
      // Format the competitions (with minimal processing)
      const formattedCompetitions = competitionsList.map(comp => ({
        _id: comp._id,
        id: comp.id,
        competitionName: comp.competitionName,
        competitionDescription: comp.competitionDescription || '',
        competitionType: comp.competitionType,
        creatorId: comp.creatorId,
        isLive: comp.isLive,
        previousCompetition: comp.previousCompetition,
        startTiming: comp.startTiming,
        endTiming: comp.endTiming,
        lastSaved: comp.lastSaved,
        duration: comp.duration,
        status: comp.status,
        questionsCount: comp.questions?.length || 0
      }));
      
      res.status(200).json({
        success: true,
        data: {
          competitions: formattedCompetitions,
          pagination: {
            total: totalCount,
            page,
            pages: Math.ceil(totalCount / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error('Error in getAllCompetitions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve competitions',
        error: error.message
      });
    }
  },

  // Get all results without filtering
  getAllResults: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Get total count of all results
      const totalCount = await Result.countDocuments();
      
      // Get all results with pagination
      const resultsList = await Result.find()
        .sort({ scoreAssignedTime: -1 }) // Sort by most recent first
        .skip(skip)
        .limit(limit);
        
      // Enhance results with student and competition information
      const enhancedResults = await Promise.all(resultsList.map(async (result) => {
        // Get student information
        const student = await Student.findById(result.studentId)
          .select('studentFirstName studentLastName studentEmail');
          
        // Get competition information
        const competition = await Competition.findById(result.competitionId)
          .select('competitionName competitionType');
          
        return {
          _id: result._id,
          submissionId: result.submissionId,
          student: student ? {
            _id: student._id,
            name: `${student.studentFirstName} ${student.studentLastName}`,
            email: student.studentEmail
          } : { name: 'Unknown Student' },
          competition: competition ? {
            _id: competition._id,
            name: competition.competitionName,
            type: competition.competitionType
          } : { name: 'Unknown Competition' },
          totalScore: result.totalScore,
          percentageScore: result.percentageScore.toFixed(2),
          scoreAssignedTime: result.scoreAssignedTime,
          questionsCount: result.results.length,
          correctAnswers: result.results.filter(r => r.isCorrect).length,
          createdAt: result.createdAt
        };
      }));
      
      res.status(200).json({
        success: true,
        data: {
          results: enhancedResults,
          pagination: {
            total: totalCount,
            page,
            pages: Math.ceil(totalCount / limit),
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
  }
};

module.exports = generalController;

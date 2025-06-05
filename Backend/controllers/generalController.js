const Competition = require('../models/competition');
const Feedback = require('../models/feedback');
const Student = require('../models/student');
const Teacher = require('../models/teacher');

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

// Helper function to validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const generalController = {
  // Get upcoming and active competitions
  fetchCompetitions: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Get current time
      const now = new Date();
      
      // Build filter
      const filter = {
        isLive: true,  // Only get live competitions
        previousCompetition: false // Not archived competitions
      };
      
      // Filter by type if provided
      if (req.query.type && ['TEXT', 'MCQ', 'CODE'].includes(req.query.type.toUpperCase())) {
        filter.competitionType = req.query.type.toUpperCase();
      }
      
      // Filter by status
      const status = req.query.status;
      if (status === 'upcoming') {
        filter.startTiming = { $gt: now }; // Start time is in the future
      } else if (status === 'active') {
        filter.startTiming = { $lte: now }; // Start time has passed
        filter.$or = [
          { endTiming: { $gte: now } }, // End time is in the future
          { endTiming: { $exists: false } } // Or no end time set
        ];
      } else if (status === 'ended') {
        filter.endTiming = { $lt: now }; // End time has passed
      }
      
      // Get total count
      const totalCount = await Competition.countDocuments(filter);
      
      // Get competitions
      const competitions = await Competition.find(filter)
        .sort({ startTiming: 1 }) // Sort by start time (soonest first)
        .skip(skip)
        .limit(limit);
      
      // Format response with additional information
      const formattedCompetitions = await Promise.all(competitions.map(async (comp) => {
        // Get creator info
        let creatorName = 'Unknown';
        let creatorType = 'unknown';

        try {
          // Check if creator is a teacher
          const teacher = await Teacher.findById(comp.creatorId)
            .select('teacherFirstName teacherLastName');

          if (teacher) {
            creatorName = `${teacher.teacherFirstName} ${teacher.teacherLastName}`;
            creatorType = 'teacher';
          } else {
            // If not a teacher, check if creator is an admin
            const admin = await Admin.findById(comp.creatorId)
              .select('adminName');

            if (admin) {
              creatorName = admin.adminName;
              creatorType = 'admin';
            }
          }
        } catch (err) {
          console.error('Error fetching creator info:', err);
        }
        
        // Calculate competition status
        const availableFrom = new Date(comp.startTiming || comp.lastSaved);
        const endTime = comp.endTiming ? new Date(comp.endTiming) :
          (availableFrom && comp.duration ? new Date(availableFrom.getTime() + (comp.duration * 60000)) : null);
        
        let competitionStatus = 'upcoming';
        if (availableFrom && endTime) {
          if (now < availableFrom) {
            competitionStatus = 'upcoming';
          } else if (now >= availableFrom && now <= endTime) {
            competitionStatus = 'active';
          } else {
            competitionStatus = 'ended';
          }
        }
        
        // Calculate time info
        let timeInfo = {};
        if (competitionStatus === 'upcoming' && availableFrom) {
          const timeToStart = availableFrom - now;
          timeInfo = {
            startsIn: timeToStart,
            formattedStartsIn: formatTimeRemaining(timeToStart)
          };
        } else if (competitionStatus === 'active' && endTime) {
          const timeRemaining = endTime - now;
          timeInfo = {
            endsIn: timeRemaining,
            formattedEndsIn: formatTimeRemaining(timeRemaining)
          };
        }
        
        // Get participant count
        const participantCount = await Student.countDocuments({
          'competitions.competitionId': comp._id
        });
        
        return {
          _id: comp._id,
          id: comp.id,
          competitionName: comp.competitionName,
          competitionDescription: comp.competitionDescription || '',
          competitionType: comp.competitionType,
          creatorName,
          startTiming: comp.startTiming,
          endTiming: comp.endTiming || (endTime ? endTime.toISOString() : null),
          duration: comp.duration,
          status: competitionStatus,
          timeInfo,
          questionsCount: comp.questions?.length || 0,
          participantCount
        };
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
      console.error('Error in fetchCompetitions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve competitions',
        error: error.message
      });
    }
  },
  
  // Get public feedback submissions
  fetchFeedbacks: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      
      // Filter for testimonials that are approved for public display
      const filter = {
        feedbackType: 'testimonial', // Only get testimonials
        status: 'approved', // Only get approved testimonials
      };
      
      // Filter by rating if provided
      if (req.query.minRating) {
        filter.ratingGeneral = { $gte: parseInt(req.query.minRating) };
      }
      
      // Total count
      const totalCount = await Feedback.countDocuments(filter);
      
      // Get testimonials
      const testimonials = await Feedback.find(filter)
        .select('name feedback ratingGeneral ratingEase ratingSupport occupation submittedAt')
        .sort({ ratingGeneral: -1, submittedAt: -1 }) // Sort by rating (highest first) then date
        .skip(skip)
        .limit(limit);
        
      // Format for public display
      const formattedTestimonials = testimonials.map(t => ({
        _id: t._id,
        name: t.name,
        occupation: t.occupation || 'Student',
        feedback: t.feedback,
        rating: t.ratingGeneral,
        easeRating: t.ratingEase,
        supportRating: t.ratingSupport,
        submittedAt: t.submittedAt
      }));
      
      res.status(200).json({
        success: true,
        data: {
          testimonials: formattedTestimonials,
          pagination: {
            total: totalCount,
            page,
            pages: Math.ceil(totalCount / limit),
            limit
          }
        }
      });
    } catch (error) {
      console.error('Error in fetchFeedbacks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve testimonials',
        error: error.message
      });
    }
  },

};

module.exports = generalController;

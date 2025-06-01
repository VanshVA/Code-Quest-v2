const Competition = require('../models/competition');

/**
 * Updates the status of all competitions based on their timing fields
 */
const updateCompetitionStatuses = async () => {
  try {
    console.log('Running scheduled competition status update...');
    const now = new Date();
    
    // Find all competitions
    const competitions = await Competition.find();
    
    // Counter for status changes
    let statusChanges = 0;
    
    // Update each competition's status
    for (const competition of competitions) {
      const originalStatus = competition.status;
      
      // Skip if no timing info available
      if (!competition.competitionAvailableTiming) {
        continue;
      }
      
      const availableFrom = new Date(competition.competitionAvailableTiming);
      
      // Calculate or use end time
      let endTime;
      if (competition.endTiming) {
        endTime = new Date(competition.endTiming);
      } else if (competition.duration) {
        // Calculate end time from available time + duration
        endTime = new Date(availableFrom.getTime() + (competition.duration * 60000));
        competition.endTiming = endTime.toISOString();
      } else {
        // Default to 60 minutes
        endTime = new Date(availableFrom.getTime() + (60 * 60000));
        competition.endTiming = endTime.toISOString();
      }
      
      // Determine status based on current time
      if (now < availableFrom) {
        competition.status = 'upcoming';
      } else if (now >= availableFrom && now <= endTime) {
        competition.status = 'active';
      } else {
        competition.status = 'ended';
        
        // If competition has ended and is still live, mark it as not live
        if (competition.isLive && !competition.previousCompetition) {
          competition.previousCompetition = true;
        }
      }
      
      // Save if status has changed
      if (competition.status !== originalStatus) {
        console.log(`Competition ${competition.competitionName} status changed from ${originalStatus} to ${competition.status}`);
        await competition.save();
        statusChanges++;
      }
    }
    
    console.log(`Competition status update completed. ${statusChanges} competitions updated.`);
  } catch (error) {
    console.error('Error updating competition statuses:', error);
  }
};

module.exports = {
  updateCompetitionStatuses
};

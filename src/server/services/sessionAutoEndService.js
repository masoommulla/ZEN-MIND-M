import cron from 'node-cron';
import Appointment from '../models/Appointment.js';
import TherapistAuth from '../models/TherapistAuth.js';

/**
 * Auto-end sessions that have exceeded their duration
 * Runs every minute to check for expired sessions
 */
export const startSessionAutoEndService = () => {
  console.log('🔄 Session Auto-End Service started');

  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();

      // Find all active appointments that should have ended
      const expiredSessions = await Appointment.find({
        status: 'scheduled',
        date: { $lte: now }
      });

      for (const session of expiredSessions) {
        // Calculate session end time
        const sessionDate = new Date(session.date);
        const [hours, minutes] = session.startTime.split(':').map(Number);
        sessionDate.setHours(hours, minutes, 0, 0);
        
        const sessionEndTime = new Date(sessionDate.getTime() + session.duration * 60000);

        // If session has ended, mark as completed
        if (now > sessionEndTime) {
          console.log(`⏰ Auto-ending session ${session._id}`);
          
          session.status = 'completed';
          await session.save();

          // Clear therapist's current session
          const therapist = await TherapistAuth.findById(session.therapistId);
          if (therapist && therapist.currentSession && therapist.currentSession.isActive) {
            if (therapist.currentSession.appointmentId.toString() === session._id.toString()) {
              therapist.currentSession = {
                isActive: false,
                appointmentId: null,
                startedAt: null,
                endsAt: null
              };
              await therapist.save();
              console.log(`✅ Therapist ${therapist.name} is now available`);
            }
          }
        }
      }

      // Also clear therapist sessions that have expired (session end + 10 minutes)
      const therapists = await TherapistAuth.find({
        'currentSession.isActive': true
      });

      for (const therapist of therapists) {
        const sessionEndsAt = new Date(therapist.currentSession.endsAt);
        sessionEndsAt.setMinutes(sessionEndsAt.getMinutes() + 10); // Add 10 min buffer

        if (now > sessionEndsAt) {
          console.log(`⏰ Clearing expired session for therapist ${therapist.name}`);
          therapist.currentSession = {
            isActive: false,
            appointmentId: null,
            startedAt: null,
            endsAt: null
          };
          await therapist.save();
        }
      }
    } catch (error) {
      console.error('❌ Session auto-end service error:', error);
    }
  });

  console.log('✅ Session Auto-End Service is running (every minute)');
};
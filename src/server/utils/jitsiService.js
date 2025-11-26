import crypto from 'crypto';

/**
 * Generate Jitsi Meet link for video sessions
 * Jitsi is free, open-source, and doesn't require API keys
 * 
 * @param {string} appointmentId - Unique appointment ID
 * @param {string} therapistName - Therapist's name
 * @param {string} userName - User's name
 * @returns {string} - Jitsi meeting link
 */
export function generateJitsiLink(appointmentId, therapistName, userName) {
  // Use custom Jitsi domain (can be configured via env var)
  const jitsiDomain = process.env.JITSI_DOMAIN || 'meet.jit.si';
  
  // Create unique room name using appointment ID and hash
  const roomHash = crypto
    .createHash('md5')
    .update(`${appointmentId}-${Date.now()}`)
    .digest('hex')
    .substring(0, 12);
  
  const roomName = `ZenMind-Session-${roomHash}`;
  
  // Construct Jitsi URL with configuration
  const meetingLink = `https://${jitsiDomain}/${roomName}`;
  
  return {
    meetingLink,
    roomName,
    jitsiDomain
  };
}

/**
 * Validate if a meeting can be joined
 * 
 * @param {Object} appointment - Appointment document
 * @param {string} userId - User ID trying to join
 * @param {string} therapistId - Therapist ID (optional)
 * @returns {Object} - Validation result
 */
export function validateMeetingAccess(appointment, userId, therapistId = null) {
  // Check if user is authorized (either the patient or the therapist)
  const isPatient = appointment.userId.toString() === userId;
  const isTherapist = therapistId && appointment.therapistId.toString() === therapistId;
  
  if (!isPatient && !isTherapist) {
    return {
      valid: false,
      message: 'You are not authorized to join this session'
    };
  }
  
  // Check if appointment is confirmed
  if (appointment.status !== 'confirmed' && appointment.status !== 'scheduled') {
    return {
      valid: false,
      message: 'This session is not active'
    };
  }
  
  // Check if payment is completed
  if (appointment.payment.status !== 'completed') {
    return {
      valid: false,
      message: 'Payment not completed for this session'
    };
  }
  
  // Check if session time is valid (can join 10 minutes before and up to 1 hour after start time)
  const appointmentDate = new Date(appointment.date);
  const [hours, minutes] = appointment.startTime.split(':').map(Number);
  appointmentDate.setHours(hours, minutes, 0, 0);
  
  const now = new Date();
  const tenMinutesBefore = new Date(appointmentDate.getTime() - 10 * 60 * 1000);
  const oneHourAfter = new Date(appointmentDate.getTime() + 60 * 60 * 1000);
  
  if (now < tenMinutesBefore) {
    const minutesUntilStart = Math.ceil((appointmentDate - now) / (60 * 1000));
    return {
      valid: false,
      message: `Session starts in ${minutesUntilStart} minutes. You can join 10 minutes before the scheduled time.`
    };
  }
  
  if (now > oneHourAfter) {
    return {
      valid: false,
      message: 'This session has expired'
    };
  }
  
  return {
    valid: true,
    message: 'Access granted'
  };
}

/**
 * Generate meeting link and store in appointment
 * 
 * @param {Object} appointment - Appointment document
 * @returns {Object} - Meeting details
 */
export async function createMeetingForAppointment(appointment) {
  // Generate Jitsi link if not already created
  if (!appointment.meetingLink) {
    const { meetingLink, roomName } = generateJitsiLink(
      appointment._id.toString(),
      appointment.therapistName,
      'Patient' // We don't store patient name in appointment for privacy
    );
    
    appointment.meetingLink = meetingLink;
    await appointment.save();
    
    return {
      meetingLink,
      roomName,
      created: true
    };
  }
  
  return {
    meetingLink: appointment.meetingLink,
    created: false
  };
}

/**
 * Get Jitsi configuration for embedding
 * 
 * @param {string} roomName - Jitsi room name
 * @param {string} displayName - User's display name
 * @returns {Object} - Jitsi configuration
 */
export function getJitsiConfig(roomName, displayName) {
  return {
    roomName,
    width: '100%',
    height: '100%',
    parentNode: undefined, // Will be set by frontend
    configOverwrite: {
      startWithAudioMuted: false,
      startWithVideoMuted: false,
      enableWelcomePage: false,
      prejoinPageEnabled: true,
      disableDeepLinking: true,
      toolbarButtons: [
        'microphone',
        'camera',
        'closedcaptions',
        'desktop',
        'fullscreen',
        'fodeviceselection',
        'hangup',
        'chat',
        'recording',
        'settings',
        'raisehand',
        'videoquality',
        'filmstrip',
        'stats',
        'shortcuts',
        'tileview'
      ]
    },
    interfaceConfigOverwrite: {
      DISPLAY_WELCOME_PAGE_CONTENT: false,
      SHOW_JITSI_WATERMARK: true,
      SHOW_WATERMARK_FOR_GUESTS: true,
      SHOW_BRAND_WATERMARK: false,
      BRAND_WATERMARK_LINK: '',
      SHOW_POWERED_BY: false,
      GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
      MOBILE_APP_PROMO: false
    },
    userInfo: {
      displayName: displayName
    }
  };
}

export default {
  generateJitsiLink,
  validateMeetingAccess,
  createMeetingForAppointment,
  getJitsiConfig
};

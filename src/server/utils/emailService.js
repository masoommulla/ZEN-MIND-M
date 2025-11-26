import SibApiV3Sdk from '@getbrevo/brevo';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Configure API key from environment variables
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Get sender configuration from environment variables
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@zenmind.app';
const SENDER_NAME = process.env.BREVO_SENDER_NAME || 'ZenMind Team';

/**
 * Send Welcome Email to new users
 * 
 * IMPORTANT: Before this works, you MUST:
 * 1. Add your Brevo API key to .env file as BREVO_API_KEY
 * 2. Verify your sender email in Brevo Dashboard: https://app.brevo.com/settings/senders
 * 3. Update BREVO_SENDER_EMAIL in .env to match your verified email
 */
export async function sendWelcomeEmail(userEmail, userName) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "Welcome to ZenMind 🌿 - Your Mental Wellness Journey Starts Here!";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f7faff; border: 1px solid #e2e8f0;">

        <h2 style="color: #3b82f6; text-align: center;">Welcome to ZenMind, ${userName} 🌿</h2>

        <p>
          We're truly glad to have you join <strong>ZenMind</strong> — a supportive space created to help teens understand,
          manage, and improve their mental well-being.  
        </p>

        <p>
          Your journey toward clarity, emotional balance, and peace starts here. With ZenMind, you now have access to:
        </p>

        <ul>
          <li>💬 A confidential AI-powered chatbot to support you 24/7</li>
          <li>🧠 Mood tracking to understand emotional patterns</li>
          <li>📝 Journaling tools to express your thoughts safely</li>
          <li>📌 Personalized mental health suggestions</li>
          <li>👩‍⚕️ Access to licensed therapists for private therapy sessions</li>
        </ul>

        <p>
          Remember, taking care of your mental health is a strength — and we're here to help you at every step.  
        </p>

        <h3 style="color: #3b82f6;">Need support?</h3>
        <p>
          📧 Email: <a href="mailto:support@zenmind.com">support@zenmind.com</a><br>
          📞 Contact: +91 0123456789
        </p>

        <p>
          Feel free to explore, learn, and grow. We're excited to be part of your journey.
        </p>

        <p style="margin-top: 30px; font-weight: bold; color: #0f172a;">
          Warm regards,<br>
          <span style="color: #3b82f6;">Team ZenMind</span>
        </p>

      </div>
    </div>
  `;
  
  // Sender configuration from environment variables
  sendSmtpEmail.sender = { 
    name: SENDER_NAME, 
    email: SENDER_EMAIL
  };
  
  sendSmtpEmail.to = [{ email: userEmail, name: userName }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Welcome email sent successfully to:', userEmail);
    console.log('📧 Message ID:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    if (error.response?.body) {
      console.error('🔍 Error details:', JSON.stringify(error.response.body, null, 2));
    }
    return { success: false, error: error.message, details: error.response?.body };
  }
}

/**
 * Send OTP Email for Password Reset
 */
export async function sendOtpEmail(userEmail, userName, otp) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "Your ZenMind Password Reset OTP 🔐";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f7faff; border: 1px solid #e2e8f0;">

        <h2 style="color: #3b82f6; text-align: center;">Password Reset Request 🔐</h2>

        <p>Hi ${userName},</p>

        <p>
          We received a request to reset your ZenMind password. Use the following OTP to proceed:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <h1 style="color: #3b82f6; background: #e0f2fe; padding: 20px; border-radius: 10px; display: inline-block; letter-spacing: 5px;">
            ${otp}
          </h1>
        </div>

        <p style="color: #dc2626; font-weight: bold;">
          ⏰ This OTP is valid for <strong>10 minutes</strong> only.
        </p>

        <p>
          If you didn't request a password reset, please ignore this email or contact us immediately.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">

        <p style="font-size: 12px; color: #64748b;">
          For security reasons, never share your OTP with anyone. ZenMind will never ask for your OTP via phone or social media.
        </p>

        <p style="margin-top: 30px; font-weight: bold; color: #0f172a;">
          Stay safe,<br>
          <span style="color: #3b82f6;">Team ZenMind</span>
        </p>

      </div>
    </div>
  `;
  
  // CRITICAL: You MUST verify this sender email in Brevo Dashboard
  sendSmtpEmail.sender = { 
    name: "ZenMind Security", 
    email: SENDER_EMAIL
  };
  
  sendSmtpEmail.to = [{ email: userEmail, name: userName }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ OTP email sent successfully to:', userEmail);
    console.log('📧 Message ID:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    if (error.response?.body) {
      console.error('🔍 Error details:', JSON.stringify(error.response.body, null, 2));
    }
    return { success: false, error: error.message, details: error.response?.body };
  }
}

/**
 * Send Appointment Confirmation Email
 */
export async function sendAppointmentEmail(userEmail, userName, appointmentDetails) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "✅ ZenMind Therapy Session Confirmed";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f7faff; border: 1px solid #e2e8f0;">

        <h2 style="color: #3b82f6; text-align: center;">🌿 Your Therapy Session is Confirmed!</h2>

        <p>Hi ${userName},</p>

        <p>
          Great news! Your therapy session has been successfully booked. We're here to support you on your mental wellness journey.
        </p>

        <div style="background: #e0f2fe; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #0c4a6e; margin-top: 0;">📅 Session Details</h3>
          <p style="margin: 8px 0;"><strong>Therapist:</strong> ${appointmentDetails.therapistName}</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${appointmentDetails.date}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${appointmentDetails.startTime} - ${appointmentDetails.endTime}</p>
          <p style="margin: 8px 0;"><strong>Duration:</strong> ${appointmentDetails.duration} minutes</p>
          <p style="margin: 8px 0;"><strong>Amount Paid:</strong> ₹${appointmentDetails.amount}</p>
          <p style="margin: 8px 0;"><strong>Session Type:</strong> Video Call (Anonymous)</p>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>⏰ Important:</strong> You can join the session 30 minutes before the scheduled time. The session link will be available in your Appointments page.
          </p>
        </div>

        <div style="background: #ddd6fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #5b21b6;">
            <strong>🔒 Privacy Note:</strong> All therapy sessions are completely anonymous. Your therapist will not see your real name or personal information during the session. Your privacy is our priority.
          </p>
        </div>

        <h3 style="color: #3b82f6;">How to Join Your Session:</h3>
        <ol>
          <li>Go to your ZenMind dashboard</li>
          <li>Navigate to "Appointments"</li>
          <li>Click "Join Session" on the scheduled appointment</li>
          <li>You'll be connected to a secure, anonymous video call</li>
        </ol>

        <p>
          If you need to reschedule or have any questions, please contact us or cancel through the app at least 2 hours before your session.
        </p>

        <h3 style="color: #3b82f6;">Need Help?</h3>
        <p>
          📧 Email: <a href="mailto:support@zenmind.com">support@zenmind.com</a><br>
          📞 Contact: +91 0123456789
        </p>

        <p style="margin-top: 30px; font-weight: bold; color: #0f172a;">
          We're proud of you for taking this step,<br>
          <span style="color: #3b82f6;">Team ZenMind 🌿</span>
        </p>

      </div>
    </div>
  `;
  
  sendSmtpEmail.sender = { 
    name: SENDER_NAME, 
    email: SENDER_EMAIL
  };
  
  sendSmtpEmail.to = [{ email: userEmail, name: userName }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Appointment email sent successfully to:', userEmail);
    console.log('📧 Message ID:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('❌ Error sending appointment email:', error);
    if (error.response?.body) {
      console.error('🔍 Error details:', JSON.stringify(error.response.body, null, 2));
    }
    return { success: false, error: error.message, details: error.response?.body };
  }
}

/**
 * Send Appointment Notification to Therapist
 */
export async function sendTherapistAppointmentEmail(therapistEmail, therapistName, appointmentDetails) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "📅 New Session Booked - ZenMind";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f7faff; border: 1px solid #e2e8f0;">

        <h2 style="color: #3b82f6; text-align: center;">📅 New Session Booked</h2>

        <p>Hi ${therapistName},</p>

        <p>
          A new therapy session has been booked with you on ZenMind. Here are the details:
        </p>

        <div style="background: #e0f2fe; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #0c4a6e; margin-top: 0;">📋 Session Details</h3>
          <p style="margin: 8px 0;"><strong>Client:</strong> ${appointmentDetails.teenName} (Identity Protected)</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${appointmentDetails.date}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${appointmentDetails.startTime} - ${appointmentDetails.endTime}</p>
          <p style="margin: 8px 0;"><strong>Duration:</strong> ${appointmentDetails.duration} minutes</p>
          <p style="margin: 8px 0;"><strong>Session Fee:</strong> ₹${appointmentDetails.amount}</p>
          <p style="margin: 8px 0;"><strong>Session Type:</strong> Video Call (Anonymous)</p>
        </div>

        <div style="background: #ddd6fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #5b21b6;">
            <strong>🔒 Privacy & Anonymity:</strong> This client will join as "Anonymous Teen" to protect their identity. Please maintain professional boundaries and confidentiality at all times.
          </p>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>⏰ Session Window:</strong> The client can join 30 minutes before the scheduled time. Please be available during this window.
          </p>
        </div>

        <h3 style="color: #3b82f6;">How to Join:</h3>
        <ol>
          <li>Log in to your ZenMind therapist dashboard</li>
          <li>Navigate to "Appointments"</li>
          <li>Click "Join Session" when ready (available 30 min before session time)</li>
          <li>You'll be connected to a secure, HIPAA-compliant video call</li>
        </ol>

        <h3 style="color: #3b82f6;">Session Preparation:</h3>
        <ul>
          <li>Review any notes or intake forms (if available)</li>
          <li>Ensure your video and audio equipment is working</li>
          <li>Find a quiet, professional environment</li>
          <li>Have your session notes ready</li>
        </ul>

        <h3 style="color: #3b82f6;">Need Support?</h3>
        <p>
          📧 Email: <a href="mailto:therapist-support@zenmind.com">therapist-support@zenmind.com</a><br>
          📞 Contact: +91 0123456789
        </p>

        <p style="margin-top: 30px; font-weight: bold; color: #0f172a;">
          Thank you for your dedication to mental health,<br>
          <span style="color: #3b82f6;">ZenMind Team 🌿</span>
        </p>

      </div>
    </div>
  `;
  
  sendSmtpEmail.sender = { 
    name: "ZenMind Professional Services", 
    email: SENDER_EMAIL
  };
  
  sendSmtpEmail.to = [{ email: therapistEmail, name: therapistName }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Therapist notification email sent successfully to:', therapistEmail);
    console.log('📧 Message ID:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('❌ Error sending therapist notification email:', error);
    if (error.response?.body) {
      console.error('🔍 Error details:', JSON.stringify(error.response.body, null, 2));
    }
    return { success: false, error: error.message, details: error.response?.body };
  }
}

/**
 * Send Refund Confirmation Email
 */
export async function sendRefundEmail(userEmail, userName, refundDetails) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "💰 ZenMind Refund Processed";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f7faff; border: 1px solid #e2e8f0;">

        <h2 style="color: #3b82f6; text-align: center;">💰 Refund Processed</h2>

        <p>Hi ${userName},</p>

        <p>
          Your appointment cancellation has been processed, and your refund has been initiated.
        </p>

        <div style="background: #e0f2fe; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="color: #0c4a6e; margin-top: 0;">📋 Cancellation Details</h3>
          <p style="margin: 8px 0;"><strong>Therapist:</strong> ${refundDetails.therapistName}</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${refundDetails.date}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${refundDetails.startTime}</p>
          <p style="margin: 8px 0;"><strong>Cancellation Reason:</strong> ${refundDetails.cancellationReason}</p>
        </div>

        <div style="background: #dcfce7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3 style="color: #15803d; margin-top: 0;">💵 Refund Breakdown</h3>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Original Payment:</strong> ₹${refundDetails.originalAmount}</p>
          <p style="margin: 8px 0; font-size: 14px; color: #dc2626;"><strong>Platform Fee (${refundDetails.platformFeePercentage}%):</strong> - ₹${refundDetails.platformFee}</p>
          <hr style="border: none; border-top: 1px dashed #94a3b8; margin: 12px 0;">
          <p style="margin: 8px 0; font-size: 18px; color: #16a34a;"><strong>Refund Amount:</strong> ₹${refundDetails.refundAmount}</p>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>📋 Refund Policy:</strong> As per our platform policy, a ${refundDetails.platformFeePercentage}% platform fee is deducted from all refunds to cover operational costs, payment processing, and platform maintenance.
          </p>
        </div>

        <div style="background: #ddd6fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #5b21b6;">
            <strong>⏰ Refund Timeline:</strong> Your refund of ₹${refundDetails.refundAmount} has been processed instantly (demo system). In production, it would typically take 5-7 business days to appear in your original payment method.
          </p>
        </div>

        <h3 style="color: #3b82f6;">Need Another Session?</h3>
        <p>
          We understand plans change. You can book another session anytime that works better for your schedule. We're here to support you whenever you're ready.
        </p>

        <h3 style="color: #3b82f6;">Questions?</h3>
        <p>
          If you have any questions about this refund or need assistance, please contact us:
        </p>
        <p>
          📧 Email: <a href="mailto:support@zenmind.com">support@zenmind.com</a><br>
          📞 Contact: +91 0123456789
        </p>

        <p style="margin-top: 30px; font-weight: bold; color: #0f172a;">
          Thank you for your understanding,<br>
          <span style="color: #3b82f6;">Team ZenMind 🌿</span>
        </p>

      </div>
    </div>
  `;
  
  sendSmtpEmail.sender = { 
    name: SENDER_NAME, 
    email: SENDER_EMAIL
  };
  
  sendSmtpEmail.to = [{ email: userEmail, name: userName }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Refund email sent successfully to:', userEmail);
    console.log('📧 Message ID:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('❌ Error sending refund email:', error);
    if (error.response?.body) {
      console.error('🔍 Error details:', JSON.stringify(error.response.body, null, 2));
    }
    return { success: false, error: error.message, details: error.response?.body };
  }
}

/**
 * Send Cancellation Email to User
 */
export async function sendCancellationEmailToUser(userEmail, userName, cancellationDetails) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "❌ Session Cancelled - ZenMind";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f7faff; border: 1px solid #e2e8f0;">

        <h2 style="color: #dc2626; text-align: center;">❌ Session Cancelled</h2>

        <p>Hi ${userName},</p>

        <p>
          Your therapy session has been successfully cancelled. We're sorry we won't be meeting this time.
        </p>

        <div style="background: #fee2e2; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="color: #7f1d1d; margin-top: 0;">📋 Cancelled Session Details</h3>
          <p style="margin: 8px 0;"><strong>Therapist:</strong> ${cancellationDetails.therapistName}</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${cancellationDetails.date}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${cancellationDetails.startTime} - ${cancellationDetails.endTime}</p>
          <p style="margin: 8px 0;"><strong>Duration:</strong> ${cancellationDetails.duration} minutes</p>
          <p style="margin: 8px 0;"><strong>Reason:</strong> ${cancellationDetails.reason || 'No reason provided'}</p>
        </div>

        <div style="background: #dcfce7; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #16a34a;">
          <h3 style="color: #15803d; margin-top: 0;">💵 Refund Details</h3>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Original Payment:</strong> ₹${cancellationDetails.originalAmount}</p>
          <p style="margin: 8px 0; font-size: 14px; color: #dc2626;"><strong>Platform Fee (10%):</strong> - ₹${cancellationDetails.platformFee}</p>
          <hr style="border: none; border-top: 1px dashed #94a3b8; margin: 12px 0;">
          <p style="margin: 8px 0; font-size: 18px; color: #16a34a;"><strong>Refund Amount:</strong> ₹${cancellationDetails.refundAmount}</p>
        </div>

        <div style="background: #ddd6fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #5b21b6;">
            <strong>⏰ Refund Timeline:</strong> Your refund of ₹${cancellationDetails.refundAmount} will be processed within 5-7 business days to your original payment method.
          </p>
        </div>

        <h3 style="color: #3b82f6;">Ready to Book Again?</h3>
        <p>
          We understand that schedules change. You can book another session anytime through your ZenMind dashboard. We're here whenever you need support.
        </p>

        <h3 style="color: #3b82f6;">Need Help?</h3>
        <p>
          📧 Email: <a href="mailto:support@zenmind.com">support@zenmind.com</a><br>
          📞 Contact: +91 0123456789
        </p>

        <p style="margin-top: 30px; font-weight: bold; color: #0f172a;">
          Take care,<br>
          <span style="color: #3b82f6;">Team ZenMind 🌿</span>
        </p>

      </div>
    </div>
  `;
  
  sendSmtpEmail.sender = { 
    name: SENDER_NAME, 
    email: SENDER_EMAIL
  };
  
  sendSmtpEmail.to = [{ email: userEmail, name: userName }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Cancellation email sent successfully to user:', userEmail);
    console.log('📧 Message ID:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('❌ Error sending cancellation email to user:', error);
    if (error.response?.body) {
      console.error('🔍 Error details:', JSON.stringify(error.response.body, null, 2));
    }
    return { success: false, error: error.message, details: error.response?.body };
  }
}

/**
 * Send Cancellation Email to Therapist
 */
export async function sendCancellationEmailToTherapist(therapistEmail, therapistName, cancellationDetails) {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = "❌ Session Cancelled - ZenMind";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <div style="max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f7faff; border: 1px solid #e2e8f0;">

        <h2 style="color: #dc2626; text-align: center;">❌ Session Cancelled</h2>

        <p>Hi ${therapistName},</p>

        <p>
          A therapy session scheduled with you has been cancelled by the client. Here are the details:
        </p>

        <div style="background: #fee2e2; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3 style="color: #7f1d1d; margin-top: 0;">📋 Cancelled Session Details</h3>
          <p style="margin: 8px 0;"><strong>Client:</strong> Anonymous Teen (Identity Protected)</p>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${cancellationDetails.date}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${cancellationDetails.startTime} - ${cancellationDetails.endTime}</p>
          <p style="margin: 8px 0;"><strong>Duration:</strong> ${cancellationDetails.duration} minutes</p>
          <p style="margin: 8px 0;"><strong>Session Fee:</strong> ₹${cancellationDetails.originalAmount}</p>
          <p style="margin: 8px 0;"><strong>Cancellation Reason:</strong> ${cancellationDetails.reason || 'No reason provided'}</p>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>📅 Availability Update:</strong> This time slot has been automatically released and is now available for new bookings in your schedule.
          </p>
        </div>

        <div style="background: #ddd6fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #5b21b6;">
            <strong>💰 Payment Note:</strong> The client has been refunded 90% of the session fee (₹${cancellationDetails.refundAmount}). A 10% platform fee was deducted as per policy. No payment will be transferred to you for this cancelled session.
          </p>
        </div>

        <h3 style="color: #3b82f6;">What's Next?</h3>
        <p>
          Your calendar has been updated, and this time slot is now open for other clients to book. You can view your updated schedule in the therapist dashboard.
        </p>

        <h3 style="color: #3b82f6;">Need Support?</h3>
        <p>
          If you have any questions about this cancellation, please contact us:
        </p>
        <p>
          📧 Email: <a href="mailto:therapist-support@zenmind.com">therapist-support@zenmind.com</a><br>
          📞 Contact: +91 0123456789
        </p>

        <p style="margin-top: 30px; font-weight: bold; color: #0f172a;">
          Thank you for your understanding,<br>
          <span style="color: #3b82f6;">ZenMind Team 🌿</span>
        </p>

      </div>
    </div>
  `;
  
  sendSmtpEmail.sender = { 
    name: "ZenMind Professional Services", 
    email: SENDER_EMAIL
  };
  
  sendSmtpEmail.to = [{ email: therapistEmail, name: therapistName }];

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Cancellation email sent successfully to therapist:', therapistEmail);
    console.log('📧 Message ID:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('❌ Error sending cancellation email to therapist:', error);
    if (error.response?.body) {
      console.error('🔍 Error details:', JSON.stringify(error.response.body, null, 2));
    }
    return { success: false, error: error.message, details: error.response?.body };
  }
}
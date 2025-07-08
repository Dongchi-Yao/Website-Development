import nodemailer from 'nodemailer';

// Create transporter (you'll need to configure this with your email service)
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in your .env file.');
  }

  // For development, you can use Gmail or other services
  // For production, consider using services like SendGrid, AWS SES, etc.
  
  return nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Changed from EMAIL_PASSWORD to EMAIL_PASS
    },
  });
};

// Send OTP email
export const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  try {
    const transporter = createTransporter();
    
    const subject = purpose === 'verification' 
      ? 'Email Verification - Cyber Risk Dashboard'
      : 'Password Reset - Cyber Risk Dashboard';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Cyber Risk Dashboard</h2>
        <p>Hello,</p>
        <p>Your verification code is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #4F46E5; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <p>Best regards,<br>Cyber Risk Dashboard Team</p>
      </div>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html,
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to Cyber Risk Dashboard!</h2>
        <p>Hello ${name},</p>
        <p>Thank you for joining our platform. Your account has been created successfully!</p>
        <p>You can now:</p>
        <ul>
          <li>Access your personalized dashboard</li>
          <li>Create and manage risk assessments</li>
          <li>Generate comprehensive reports</li>
          <li>Track your cyber risk metrics</li>
        </ul>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>Cyber Risk Dashboard Team</p>
      </div>
    `;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Cyber Risk Dashboard!',
      html,
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error('Welcome email sending failed:', error);
    return false;
  }
}; 
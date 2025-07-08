import dotenv from 'dotenv';
import { sendOTPEmail } from './utils/emailService.js';

// Load environment variables
dotenv.config();

console.log('Testing email configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

async function testEmail() {
  try {
    console.log('Attempting to send test email...');
    const result = await sendOTPEmail('test@example.com', '123456', 'test');
    console.log('Email test result:', result);
  } catch (error) {
    console.error('Email test failed:', error);
  }
}

testEmail(); 
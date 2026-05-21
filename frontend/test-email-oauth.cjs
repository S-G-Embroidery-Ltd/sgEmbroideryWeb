// Test OAuth2 Nodemailer functionality
// Run with: node test-email-oauth.cjs

require('dotenv').config();
const sendEmail = require('./api/Sample/email_service.cjs');

async function testOAuth2Email() {
  console.log('🧪 Testing OAuth2 Nodemailer configuration...');
  
  try {
    const testEmailOptions = {
      from: process.env.EMAIL || 'test@gmail.com',
      to: process.env.BUSINESS_NOTIFY_EMAIL || 'sgembroideryltd@gmail.com',
      subject: '🧪 OAuth2 Test Email from Nodemailer',
      text: 'This is a test email to verify the OAuth2 Nodemailer implementation is working correctly.',
      html: '<p>This is a <strong>test email</strong> to verify the OAuth2 Nodemailer implementation is working correctly.</p>',
    };
    
    console.log('📧 Sending test email...');
    await sendEmail(testEmailOptions);
    console.log('✅ Test email sent successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('CLIENT_ID') || error.message.includes('CLIENT_SECRET')) {
      console.error('💡 Solution: Set up OAuth2 credentials in .env.local');
      console.error('   Follow the instructions in OAUTH2_SETUP.txt');
    } else if (error.message.includes('REFRESH_TOKEN')) {
      console.error('💡 Solution: Generate refresh token from OAuth2 Playground');
      console.error('   Follow the instructions in OAUTH2_SETUP.txt');
    } else if (error.message.includes('EMAIL')) {
      console.error('💡 Solution: Set your Gmail address in .env.local');
    }
  }
}

testEmail();

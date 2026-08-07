const nodemailer = require('nodemailer');
require('dotenv').config();

async function runTest() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  console.log(`[Diagnostic] EMAIL_USER: "${user}"`);
  console.log(`[Diagnostic] EMAIL_PASS: "${pass}"`);

  if (!user || !pass) {
    console.error('❌ EMAIL_USER or EMAIL_PASS missing in backend/.env!');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });

  try {
    const info = await transporter.sendMail({
      from: `"JanSetu Test" <${user}>`,
      to: 'prashantsharma851112@gmail.com',
      subject: 'Test Email from JanSetu Platform 🚀',
      text: 'Hello Prashant! If you receive this email, your JanSetu SMTP Email system is 100% WORKING!',
    });
    console.log('✅ SUCCESS! Email sent to prashantsharma851112@gmail.com');
    console.log('Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ GMAIL DISPATCH ERROR:', err.message);
    if (err.response) console.error('Server Response:', err.response);
  }
}

runTest();

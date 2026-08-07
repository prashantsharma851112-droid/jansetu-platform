const nodemailer = require('nodemailer');

const createTransporter = () => {
  const user = (process.env.EMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  if (!user || !pass) return null;

  if (user.endsWith('@gmail.com')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: { user, pass },
  });
};

exports.sendInquiryReplyEmail = async ({ toEmail, recipientName, citizenMessage, adminReply }) => {
  const senderEmail = (process.env.EMAIL_USER || 'noreply.jansetu@gmail.com').trim();

  const mailOptions = {
    from: `"JanSetu Municipal Desk" <${senderEmail}>`,
    to: toEmail,
    subject: `Official Response from JanSetu Municipal Desk — Inquiry Resolved`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #14b8a6; margin-bottom: 8px;">JanSetu Civic Tech Help Desk</h2>
        <p style="font-size: 14px; color: #94a3b8;">Dear <strong>${recipientName || 'Citizen'}</strong>,</p>
        
        <p style="font-size: 14px; color: #e2e8f0; line-height: 1.6;">
          Thank you for reaching out to the Municipal Help Desk regarding your inquiry:
        </p>
        
        <div style="background-color: #1e293b; padding: 12px 16px; border-radius: 8px; font-style: italic; color: #cbd5e1; margin: 12px 0;">
          "${citizenMessage}"
        </div>
        
        <h3 style="color: #6366f1; margin-top: 16px;">Official Municipal Response:</h3>
        <div style="background-color: #312e81; padding: 16px; border-radius: 12px; border-left: 4px solid #6366f1; color: #e0e7ff; font-size: 14px; line-height: 1.6;">
          ${adminReply}
        </div>
        
        <p style="font-size: 12px; color: #64748b; margin-top: 24px;">
          JanSetu Civic Tech Platform © 2026 — Bridging Citizens & Municipal Governance.
        </p>
      </div>
    `,
  };

  try {
    const transporter = createTransporter();
    if (transporter) {
      const info = await transporter.sendMail(mailOptions);
      console.log(`✉️ Email reply sent successfully to ${toEmail}: ${info.messageId}`);
    } else {
      console.log(`✉️ [Simulated Email Output] EMAIL_PASS or EMAIL_USER missing in env. Sent to: ${toEmail}\nSubject: ${mailOptions.subject}\nReply: ${adminReply}`);
    }
    return true;
  } catch (err) {
    console.error('❌ Email Dispatch Error:', err.message);
    return false;
  }
};

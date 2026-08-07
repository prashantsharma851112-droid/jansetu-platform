const nodemailer = require('nodemailer');

// Optional Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  connectionTimeout: 4000,
  socketTimeout: 4000,
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
});

exports.sendInquiryReplyEmail = async ({ toEmail, recipientName, citizenMessage, adminReply }) => {
  const mailOptions = {
    from: `"JanSetu Municipal Care" <${process.env.EMAIL_USER || 'noreply.jansetu@gmail.com'}>`,
    to: toEmail,
    subject: `Official Response from JanSetu Municipal Desk — Inquiry Resolved`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 24px; borderRadius: 16px;">
        <h2 style="color: #14b8a6; margin-bottom: 8px;">JanSetu Civic Tech Support</h2>
        <p style="font-size: 14px; color: #94a3b8;">Dear <strong>${recipientName}</strong>,</p>
        
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
    if (process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log(`✉️ Email reply sent successfully to ${toEmail}`);
    } else {
      console.log(`✉️ [Simulated Email Output] Sent to: ${toEmail}\nSubject: ${mailOptions.subject}\nReply: ${adminReply}`);
    }
    return true;
  } catch (err) {
    console.error('Email Dispatch Error:', err.message);
    return false;
  }
};

const nodemailer = require('nodemailer');

exports.sendInquiryReplyEmail = async ({ toEmail, recipientName, citizenMessage, adminReply }) => {
  const user = (process.env.EMAIL_USER || '').trim();
  const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

  console.log(`✉️ [sendInquiryReplyEmail] Target: "${toEmail}", Sender: "${user}"`);

  if (!user || !pass) {
    console.log(`✉️ [Simulated Email] EMAIL_USER or EMAIL_PASS missing in env. Target: ${toEmail}\nReply: ${adminReply}`);
    return false;
  }

  const mailOptions = {
    from: user,
    to: (toEmail || '').trim(),
    subject: `Official Response from JanSetu Municipal Desk — Inquiry Resolved`,
    text: `Dear ${recipientName || 'Citizen'},\n\nThank you for reaching out to the JanSetu Help Desk.\n\nYour Inquiry:\n"${citizenMessage}"\n\nOfficial Municipal Response:\n${adminReply}\n\nBest regards,\nJanSetu Civic Resolution Desk`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 24px; border-radius: 16px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #14b8a6; margin-bottom: 8px;">JanSetu Civic Tech Support</h2>
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
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email reply sent successfully to ${toEmail}: ${info.messageId}`);
    return true;
  } catch (primaryErr) {
    console.error('❌ Gmail Service Error:', primaryErr.message);

    try {
      const sslTransporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
      });
      const sslInfo = await sslTransporter.sendMail(mailOptions);
      console.log(`✅ SSL Email reply sent successfully to ${toEmail}: ${sslInfo.messageId}`);
      return true;
    } catch (sslErr) {
      console.error('❌ SSL Fallback Email Error:', sslErr.message);
      return false;
    }
  }
};

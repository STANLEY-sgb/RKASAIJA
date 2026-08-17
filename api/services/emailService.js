import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Retrieves configured dual admin recipient email addresses from environment
 */
export const getAdminRecipients = () => {
  const primary1 = process.env.ADMIN_EMAIL_1 || 'musinguzialituhastanley@gmail.com';
  const primary2 = process.env.ADMIN_EMAIL_2 || 'musinguzialituhastanley1@gmail.com';
  
  const recipients = [primary1, primary2].filter(Boolean);
  return Array.from(new Set(recipients));
};

let cachedTransporter = null;

/**
 * Creates Nodemailer SMTP transporter using backend environment variables
 */
export const getTransporter = () => {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const user = process.env.SMTP_USER;
  const rawPass = process.env.SMTP_PASS;
  const pass = rawPass ? rawPass.replace(/\s+/g, '') : undefined;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';

  if (!user || !pass) {
    console.error('[SMTP TRANSPORTER ERROR] Missing SMTP_USER or SMTP_PASS in .env');
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: secure, // false for port 587, true for port 465
    auth: {
      user: user,
      pass: pass,
    },
    tls: {
      rejectUnauthorized: false
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 25000,
  });

  return cachedTransporter;
};

/**
 * Sends HTML contact enquiry notification email to both dual admin recipients
 */
export async function sendEnquiryNotification(data) {
  const { refId, name, email, phone, area, message, submittedAt, customRecipients } = data;
  let recipients = getAdminRecipients();

  if (customRecipients) {
    const list = Array.isArray(customRecipients) ? customRecipients : String(customRecipients).split(',').map(s => s.trim()).filter(Boolean);
    if (list.length > 0) {
      recipients = list;
    }
  }

  console.log(`[EMAIL SEND INITIATED] Target Recipients: ${recipients.join(', ')}`);

  const transporter = getTransporter();

  if (!transporter) {
    const configError = 'SMTP_USER or SMTP_PASS missing in environment (.env). Configure a Google App Password to enable live delivery.';
    console.error(`[EMAIL SEND FAILED] ${configError}`);
    return { 
      success: false, 
      error: configError,
      configurationRequired: 'SMTP_USER and SMTP_PASS must be set in .env'
    };
  }

  // Use authenticated SMTP_USER as sender to comply strictly with Gmail SMTP policies
  const authenticatedSender = process.env.SMTP_USER;
  const fromHeader = `"R. Kasaija & Partners Web System" <${authenticatedSender}>`;
  const referenceCode = refId ? `REF-${String(refId).padStart(5, '0')}` : `REF-${Date.now()}`;
  const timestampStr = submittedAt || new Date().toLocaleString('en-GB', { timeZone: 'Africa/Kampala' }) + ' (EAT)';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; background-color: #f4f4f6; margin: 0; padding: 20px; color: #2A1D10; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: #2A1D10; padding: 24px; text-align: center; border-bottom: 3px solid #B8956A; }
        .header h1 { font-family: Georgia, serif; color: #FDFBF7; margin: 0; font-size: 22px; font-weight: normal; }
        .header p { color: #B8956A; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; }
        .badge { display: inline-block; background: #f6edda; color: #9E7F5A; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: bold; margin-bottom: 16px; border: 1px solid #B8956A; }
        .content { padding: 30px; }
        .field-group { margin-bottom: 14px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
        .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: bold; margin-bottom: 4px; }
        .field-value { font-size: 15px; color: #0f172a; font-weight: 500; }
        .message-box { background: #fdfbf7; border-left: 4px solid #B8956A; padding: 16px; margin-top: 20px; border-radius: 4px; }
        .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>R. KASAIJA &amp; PARTNERS ADVOCATES</h1>
          <p>NEW WEBSITE CONTACT ENQUIRY</p>
        </div>
        <div class="content">
          <div style="text-align: right;">
            <span class="badge">${referenceCode}</span>
          </div>

          <div class="field-group">
            <div class="field-label">Client Name</div>
            <div class="field-value">${name}</div>
          </div>

          <div class="field-group">
            <div class="field-label">Email Address</div>
            <div class="field-value"><a href="mailto:${email}" style="color: #9E7F5A; text-decoration: none;">${email}</a></div>
          </div>

          <div class="field-group">
            <div class="field-label">Phone Number</div>
            <div class="field-value">${phone || 'Not provided'}</div>
          </div>

          <div class="field-group">
            <div class="field-label">Practice Area</div>
            <div class="field-value">${area || 'General Legal Enquiry'}</div>
          </div>

          <div class="field-group">
            <div class="field-label">Submission Date &amp; Time</div>
            <div class="field-value">${timestampStr}</div>
          </div>

          <div class="message-box">
            <div class="field-label">Client Message</div>
            <div style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-top: 6px;">${message}</div>
          </div>
        </div>
        <div class="footer">
          Automated delivery to: ${recipients.join(' &bull; ')}<br />
          R. Kasaija &amp; Partners Advocates &bull; Plot 75 Kampala Road, E-Tower Suite D-06
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: fromHeader,
    to: recipients.join(', '),
    replyTo: email,
    subject: `New Website Enquiry: ${name} (${area || 'General'}) — ${referenceCode}`,
    text: `
R. KASAIJA & PARTNERS ADVOCATES
NEW CONTACT ENQUIRY
=================================
Reference ID: ${referenceCode}
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Practice Area: ${area || 'General Legal Enquiry'}
Date/Time: ${timestampStr}

Message:
${message}
=================================
Reply directly to client at: ${email}
`,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SENT SUCCESSFULLY] MessageId: ${info.messageId} | Delivered to: ${recipients.join(', ')}`);
    return { 
      success: true, 
      messageId: info.messageId, 
      accepted: info.accepted || recipients 
    };
  } catch (err) {
    console.error(`[EMAIL SEND ERROR] ${err.message}`);
    return { 
      success: false, 
      error: err.message 
    };
  }
}

/**
 * Sends HTML appointment booking notification email to both dual admin recipients
 */
export async function sendAppointmentNotification(data) {
  const { client_name, client_email, client_phone, practice_area, preferred_lawyer, preferred_date, preferred_time, message, customRecipients } = data;
  let recipients = getAdminRecipients();

  if (customRecipients) {
    const list = Array.isArray(customRecipients) ? customRecipients : String(customRecipients).split(',').map(s => s.trim()).filter(Boolean);
    if (list.length > 0) {
      recipients = list;
    }
  }

  console.log(`[APPOINTMENT EMAIL INITIATED] Target Recipients: ${recipients.join(', ')}`);

  const transporter = getTransporter();

  if (!transporter) {
    const configError = 'SMTP_USER or SMTP_PASS missing in environment (.env). Configure a Google App Password to enable live delivery.';
    console.error(`[APPOINTMENT EMAIL FAILED] ${configError}`);
    return { success: false, error: configError };
  }

  const authenticatedSender = process.env.SMTP_USER;
  const fromHeader = `"R. Kasaija Appointment Request" <${authenticatedSender}>`;
  const referenceCode = `BOOK-${Date.now()}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f6; margin: 0; padding: 20px; color: #2A1D10; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
        .header { background: #2A1D10; padding: 24px; text-align: center; border-bottom: 3px solid #B8956A; }
        .header h1 { font-family: Georgia, serif; color: #FDFBF7; margin: 0; font-size: 20px; }
        .header p { color: #B8956A; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 30px; }
        .field-group { margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
        .field-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
        .field-value { font-size: 15px; color: #0f172a; font-weight: 500; margin-top: 2px; }
        .message-box { background: #fdfbf7; border-left: 4px solid #B8956A; padding: 16px; margin-top: 16px; border-radius: 4px; }
        .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>R. KASAIJA &amp; PARTNERS ADVOCATES</h1>
          <p>NEW APPOINTMENT BOOKING REQUEST</p>
        </div>
        <div class="content">
          <div class="field-group">
            <div class="field-label">Client Name</div>
            <div class="field-value">${client_name}</div>
          </div>
          <div class="field-group">
            <div class="field-label">Client Email</div>
            <div class="field-value"><a href="mailto:${client_email}" style="color: #9E7F5A;">${client_email}</a></div>
          </div>
          <div class="field-group">
            <div class="field-label">Client Phone</div>
            <div class="field-value">${client_phone || 'Not provided'}</div>
          </div>
          <div class="field-group">
            <div class="field-label">Practice Area</div>
            <div class="field-value">${practice_area || 'General Legal Consultation'}</div>
          </div>
          <div class="field-group">
            <div class="field-label">Requested Advocate</div>
            <div class="field-value">${preferred_lawyer || 'Any Senior Advocate'}</div>
          </div>
          <div class="field-group">
            <div class="field-label">Requested Date &amp; Time</div>
            <div class="field-value">${preferred_date || 'Flexible Date'} (${preferred_time || 'Flexible Time'})</div>
          </div>
          ${message ? `
          <div class="message-box">
            <div class="field-label">Case Summary / Client Message</div>
            <div style="font-size: 14px; color: #334155; white-space: pre-wrap; margin-top: 4px;">${message}</div>
          </div>
          ` : ''}
        </div>
        <div class="footer">
          Notification sent to dual recipients: ${recipients.join(' &bull; ')}
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: fromHeader,
    to: recipients.join(', '),
    replyTo: client_email,
    subject: `[Appointment Request] ${client_name} — ${preferred_date || 'Flexible Date'}`,
    text: `
NEW APPOINTMENT BOOKING REQUEST
=================================
Client: ${client_name}
Email: ${client_email}
Phone: ${client_phone || 'Not provided'}
Practice Area: ${practice_area || 'General Consultation'}
Preferred Lawyer: ${preferred_lawyer || 'Any Advocate'}
Requested Date/Time: ${preferred_date || 'Flexible'} ${preferred_time || ''}

Message:
${message || 'None'}
=================================
Reply directly to client at: ${client_email}
`,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[APPOINTMENT EMAIL SENT SUCCESSFULLY] MessageId: ${info.messageId} | Delivered to: ${recipients.join(', ')}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[APPOINTMENT EMAIL SEND ERROR] ${err.message}`);
    return { success: false, error: err.message };
  }
}

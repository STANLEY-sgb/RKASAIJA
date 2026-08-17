import express from 'express';
import { promisePool as db } from '../_db.js';
import { sendEnquiryNotification, getTransporter, getAdminRecipients } from '../services/emailService.js';

const router = express.Router();

// ─── DEVELOPMENT EMAIL TEST ENDPOINT (GET & POST) ──────────────────────────────
const handleEmailTest = async (req, res) => {
  const targetEmail = req.query.to || req.body?.to || req.body?.customRecipients;
  const recipients = targetEmail ? [targetEmail] : getAdminRecipients();
  const transporter = getTransporter();

  if (!transporter) {
    return res.status(400).json({
      success: false,
      smtpConnected: false,
      error: 'SMTP_USER or SMTP_PASS missing in environment (.env). Configure a Google App Password to enable live delivery.',
      recipients: recipients,
      instruction: 'Add SMTP_USER and SMTP_PASS (Google App Password) to your .env file.'
    });
  }

  try {
    // Verify SMTP connection
    await transporter.verify();
    
    // Send test email to target recipient(s)
    const testResult = await sendEnquiryNotification({
      refId: Math.floor(10000 + Math.random() * 90000),
      name: req.body?.name || 'Email Delivery Diagnostic Test',
      email: recipients[0],
      phone: '+256 772 418 707',
      area: 'System Verification',
      message: req.body?.message || `This is an automated test email confirming live delivery to target inbox: ${recipients.join(', ')}`,
      submittedAt: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Kampala' }) + ' (EAT)',
      customRecipients: recipients
    });

    if (testResult.success) {
      return res.json({
        success: true,
        smtpConnected: true,
        message: `SMTP connection verified. Test email accepted by SMTP provider for: ${recipients.join(', ')}`,
        targetRecipients: recipients,
        messageId: testResult.messageId
      });
    } else {
      return res.status(500).json({
        success: false,
        smtpConnected: true,
        error: testResult.error,
        targetRecipients: recipients
      });
    }
  } catch (err) {
    console.error('[SMTP TEST ERROR]', err.message);
    return res.status(500).json({
      success: false,
      smtpConnected: false,
      error: err.message,
      targetRecipients: recipients
    });
  }
};

router.get('/email/test', handleEmailTest);
router.post('/email/test', handleEmailTest);

// ─── CONTACT ENQUIRY ENDPOINT ──────────────────────────────────────────────────
router.post('/contact', async (req, res) => {
  const { name, email, phone, area, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }

  // 1. CONTACT RECEIVED
  console.log(`[CONTACT RECEIVED] Name: ${name} | Email: ${email} | Phone: ${phone || 'N/A'} | Area: ${area || 'General'}`);

  let dbSaved = false;
  let insertId = Date.now();

  try {
    try {
      const [resDb] = await db.execute(
        'INSERT INTO contact_submissions (name, email, phone, practice_area, message) VALUES (?, ?, ?, ?, ?)',
        [name, email, phone || null, area || null, message]
      );
      insertId = resDb.insertId;
      dbSaved = true;

      await db.execute(
        'INSERT INTO activity_log (action, details) VALUES (?, ?)',
        ['New Contact Enquiry', `From: ${name} | Email: ${email} | Area: ${area || 'General'}`]
      ).catch(() => {});

      // 2. DATABASE SAVE SUCCESSFUL
      console.log(`[DATABASE SAVE SUCCESSFUL] Enquiry #${insertId} saved to MySQL.`);
    } catch (err) {
      console.warn(`[DATABASE WARNING] Database save bypassed (offline DB): ${err.message}`);
    }

    // 3. EMAIL SEND STARTED & SENT
    const emailResult = await sendEnquiryNotification({ 
      refId: insertId,
      name, 
      email, 
      phone, 
      area, 
      message,
      submittedAt: new Date().toLocaleString('en-GB', { timeZone: 'Africa/Kampala' }) + ' (EAT)'
    });

    return res.json({ 
      success: true, 
      refId: insertId,
      dbSaved,
      emailSent: emailResult.success,
      emailStatus: emailResult.success ? 'EMAIL SENT SUCCESSFULLY' : `EMAIL SEND FAILED: ${emailResult.error}`,
      message: 'Your enquiry has been received. An advocate will be in touch within one business day.' 
    });

  } catch (error) {
    console.error(`[CONTACT API ERROR] ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      error: 'Could not submit enquiry. Please call +256 772 418 707 directly.' 
    });
  }
});

export default router;

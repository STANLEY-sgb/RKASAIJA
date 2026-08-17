import express from 'express';
import { promisePool as db } from '../_db.js';

const router = express.Router();

router.post('/contact', async (req, res) => {
  const { name, email, phone, area, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }

  try {
    await db.execute(
      'INSERT INTO contact_submissions (name, email, phone, practice_area, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, area, message]
    );

    await db.execute(
      'INSERT INTO activity_log (action, details) VALUES (?, ?)',
      ['New Contact Enquiry', `From: ${name} | Email: ${email} | Area: ${area}`]
    );

    return res.json({ 
      success: true, 
      message: 'Your enquiry has been received. An advocate will be in touch within one business day.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Could not submit. Please email us directly.' 
    });
  }
});

export default router;

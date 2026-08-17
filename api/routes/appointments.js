import express from 'express';
import { promisePool as db } from '../_db.js';

const router = express.Router();

router.post('/book', async (req, res) => {
  const { 
    client_name, 
    client_email, 
    client_phone, 
    practice_area, 
    preferred_lawyer, 
    preferred_date, 
    preferred_time, 
    message 
  } = req.body;

  if (!client_name || !client_email) {
    return res.status(400).json({ success: false, error: 'Name and email are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(client_email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO appointments 
       (client_name, client_email, client_phone, practice_area, preferred_lawyer, preferred_date, preferred_time, message) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client_name, 
        client_email, 
        client_phone, 
        practice_area, 
        preferred_lawyer, 
        preferred_date || null, 
        preferred_time, 
        message
      ]
    );

    const appointmentId = result.insertId;

    await db.execute(
      'INSERT INTO activity_log (action, details) VALUES (?, ?)',
      [
        'New Appointment', 
        `Client: ${client_name} | Area: ${practice_area} | Lawyer: ${preferred_lawyer} | Date: ${preferred_date} ${preferred_time}`
      ]
    );

    return res.json({ 
      success: true, 
      id: appointmentId,
      message: 'Your appointment request has been received. We will confirm within one business day.' 
    });

  } catch (error) {
    console.error('Appointment booking error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Could not save appointment. Please call us directly.' 
    });
  }
});

export default router;

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS?.replace(/\s+/g, '')
  }
});

async function sendTest() {
  console.log(`Connecting to ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}...`);
  try {
    await transporter.verify();
    console.log('✅ SMTP Server Connection Verified!');

    const mailOptions = {
      from: `"R. Kasaija & Partners Advocates" <${process.env.SMTP_USER}>`,
      to: 'musinguzialituhastanley@gmail.com, musinguzialituhastanley1@gmail.com',
      subject: 'Live Website Contact System Verification — R. Kasaija & Partners',
      html: `
        <div style="font-family: Georgia, serif; padding: 24px; background: #fdfbf7; border: 1px solid #e5e7eb; max-width: 600px; color: #2A1D10;">
          <h2 style="color: #2A1D10; border-bottom: 2px solid #B8956A; padding-bottom: 8px;">✅ Live Email Delivery Verified</h2>
          <p>This live notification confirms that website contact submissions and appointment bookings are actively delivered to both administrator email addresses:</p>
          <ul>
            <li><strong>musinguzialituhastanley@gmail.com</strong></li>
            <li><strong>musinguzialituhastanley1@gmail.com</strong></li>
          </ul>
          <p style="font-size: 12px; color: #777; margin-top: 24px;">R. Kasaija &amp; Partners Advocates — Automatic System Verification</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('🎉 LIVE EMAIL DELIVERED SUCCESSFULLY!');
    console.log('MessageId:', info.messageId);
    console.log('Accepted Recipients:', info.accepted);
  } catch (err) {
    console.error('❌ LIVE EMAIL SEND ERROR:', err.message);
  }
}

sendTest();

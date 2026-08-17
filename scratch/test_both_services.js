import { sendEnquiryNotification as send1 } from '../api/services/email.js';
import { sendEnquiryNotification as send2 } from '../api/services/emailService.js';

async function runTest() {
  console.log('--- TESTING EMAIL.JS ---');
  const res1 = await send1({
    name: 'Test Email.js',
    email: 'musinguzialituhastanley@gmail.com',
    phone: '123456789',
    area: 'Test',
    message: 'Testing email.js'
  });
  console.log('Result 1:', res1);

  console.log('\n--- TESTING EMAILSERVICE.JS ---');
  const res2 = await send2({
    refId: 101,
    name: 'Test EmailService.js',
    email: 'musinguzialituhastanley@gmail.com',
    phone: '123456789',
    area: 'Test',
    message: 'Testing emailService.js'
  });
  console.log('Result 2:', res2);
}

runTest();

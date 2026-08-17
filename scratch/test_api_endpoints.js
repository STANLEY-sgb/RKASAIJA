import app from '../api/index.js';
import http from 'http';

async function testApiEndpoints() {
  const server = http.createServer(app);
  
  server.listen(5099, async () => {
    console.log('Test server listening on port 5099...');

    // Test Contact Endpoint
    console.log('\n--- 1. TESTING /api/contact ---');
    try {
      const res1 = await fetch('http://localhost:5099/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Live Client Verification',
          email: 'musinguzialituhastanley@gmail.com',
          phone: '+256 772 418 707',
          area: 'Corporate Law',
          message: 'This is an automated test confirming HTTP POST to /api/contact triggers real email delivery to both admin addresses.'
        })
      });
      const data1 = await res1.json();
      console.log('HTTP Status:', res1.status);
      console.log('Response Payload:', data1);
    } catch (e) {
      console.error('Contact test failed:', e);
    }

    // Test Book Endpoint
    console.log('\n--- 2. TESTING /api/book ---');
    try {
      const res2 = await fetch('http://localhost:5099/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: 'Live Appointment Client',
          client_email: 'musinguzialituhastanley1@gmail.com',
          client_phone: '+256 776 044 004',
          practice_area: 'Land & Property Disputes',
          preferred_lawyer: 'Robert Kasaija Senior Advocate',
          preferred_date: '2026-08-25',
          preferred_time: '10:00 AM',
          message: 'Testing appointment booking email trigger via HTTP API.'
        })
      });
      const data2 = await res2.json();
      console.log('HTTP Status:', res2.status);
      console.log('Response Payload:', data2);
    } catch (e) {
      console.error('Book test failed:', e);
    }

    server.close(() => {
      console.log('\nTest completed. Server closed.');
      process.exit(0);
    });
  });
}

testApiEndpoints();

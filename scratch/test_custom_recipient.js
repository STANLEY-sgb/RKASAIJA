import app from '../api/index.js';
import http from 'http';

async function testCustomRecipient() {
  const server = http.createServer(app);
  
  server.listen(5098, async () => {
    console.log('Testing custom email recipient feature...');

    try {
      // Test sending email to recipient 1
      const target1 = 'musinguzialituhastanley@gmail.com';
      console.log(`\n--- Sending test email to: ${target1} ---`);
      const res1 = await fetch(`http://localhost:5098/api/email/test?to=${encodeURIComponent(target1)}`);
      const data1 = await res1.json();
      console.log('Response:', data1);

      // Test sending email to recipient 2
      const target2 = 'musinguzialituhastanley1@gmail.com';
      console.log(`\n--- Sending test email to: ${target2} ---`);
      const res2 = await fetch(`http://localhost:5098/api/email/test?to=${encodeURIComponent(target2)}`);
      const data2 = await res2.json();
      console.log('Response:', data2);
    } catch (err) {
      console.error('Test error:', err);
    }

    server.close(() => {
      console.log('\nTest complete.');
      process.exit(0);
    });
  });
}

testCustomRecipient();

async function testLiveServer() {
  console.log('--- 1. TESTING EXISTING RUNNING SERVER AT http://localhost:5000/api/contact ---');
  try {
    const res1 = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Live Client Verification',
        email: 'musinguzialituhastanley@gmail.com',
        phone: '+256 772 418 707',
        area: 'Corporate Law',
        message: 'Testing HTTP POST to live running server on port 5000.'
      })
    });
    const data1 = await res1.json();
    console.log('HTTP Status:', res1.status);
    console.log('Response Payload:', data1);
  } catch (e) {
    console.error('Contact test failed:', e.message);
  }

  console.log('\n--- 2. TESTING EXISTING RUNNING SERVER AT http://localhost:5000/api/book ---');
  try {
    const res2 = await fetch('http://localhost:5000/api/book', {
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
        message: 'Testing appointment booking HTTP POST to port 5000.'
      })
    });
    const data2 = await res2.json();
    console.log('HTTP Status:', res2.status);
    console.log('Response Payload:', data2);
  } catch (e) {
    console.error('Book test failed:', e.message);
  }
}

testLiveServer();

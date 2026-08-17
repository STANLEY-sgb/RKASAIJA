import app from '../api/index.js';
import http from 'http';

async function testAiAssistant() {
  const server = http.createServer(app);
  
  server.listen(5097, async () => {
    console.log('Testing Kasaija AI Assistant reliability across test questions...');

    const testQuestions = [
      "Hello",
      "What is this website about?",
      "What legal services do you provide?",
      "What areas of law do you practice?",
      "Who are your lawyers?",
      "I want to book an appointment.",
      "How can I contact you?",
      "Tell me about the firm.",
      "Where can I find your team?",
      "I need help with corporate legal matters."
    ];

    for (let i = 0; i < testQuestions.length; i++) {
      const q = testQuestions[i];
      console.log(`\n--- [Test ${i + 1}/${testQuestions.length}] Query: "${q}" ---`);
      try {
        const res = await fetch('http://localhost:5097/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: q })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Source:', data.source);
        console.log('Response Snippet:', data.text?.substring(0, 120) + '...');
        console.log('Actions:', data.actions?.map(a => a.label));
      } catch (err) {
        console.error(`Test ${i + 1} failed:`, err.message);
      }
    }

    server.close(() => {
      console.log('\nAI Assistant reliability test completed successfully.');
      process.exit(0);
    });
  });
}

testAiAssistant();

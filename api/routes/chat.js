import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { getKnowledgeResponse } from '../services/knowledgeEngine.js';

dotenv.config();

const router = express.Router();

// Helper to check if a valid Gemini API key is configured
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_GEMINI_API_KEY')) {
    return null;
  }
  try {
    return new GoogleGenerativeAI(apiKey);
  } catch (e) {
    console.error('[GEMINI INIT ERROR]', e.message);
    return null;
  }
};

const SYSTEM_PROMPT = `You are Kasaija AI — an advanced AI legal intake assistant for R. Kasaija & Partners Advocates in Kampala, Uganda.
Your primary job is to answer client questions about the firm, its 12 practice areas, advocates, legal services, location, working hours, and how to book a consultation.

FIRM DETAILS:
Name: R. Kasaija & Partners Advocates
Location: Plot 75 Kampala Road, E-Tower Building, 4th Floor, Suite D-06, P.O. Box 70643, Kampala, Uganda
Phone: +256 772 418 707 | +256 776 044 004
WhatsApp: +256 776 044 004
Email: kasaijaandpartners@gmail.com
Hours: Mon–Fri, 8:00 AM – 5:00 PM EAT

PRACTICE AREAS (12):
1. Banking & Finance (Robert Kasaija)
2. Corporate & Commercial (Justin Joseph Kasaija)
3. Debt Recovery (Sharon Murungi)
4. Land & Conveyancing (Joseph Kwesiga)
5. Intellectual Property (Sharon Murungi)
6. Family & Probate (Sharon Murungi)
7. Employment & Labour (Sharon Murungi)
8. Criminal Law (Robert Kasaija)
9. Arbitration & ADR (Robert Kasaija — ICAMEK accredited)
10. Revenue Law & Taxation (Robert Kasaija)
11. Non-Profit & NGO Law (Joseph Kwesiga)
12. Governance & Compliance (Justin Joseph Kasaija)

ADVOCATES (7):
Robert Kasaija (Managing Partner), Sharon Murungi (Partner & Head of Litigation), Joseph Kwesiga (Partner), Justin Joseph Kasaija (Associate), Christopher Baluku (Associate), Fred Asiimwe (Associate), Oscar Musiime (Associate).

RULES:
- Answer naturally, helpfully, and concisely (2–4 short sentences).
- If asked about legal advice, give general info and include: "This is general information only; consult our qualified advocates for specific advice."
- Encourage users to book a consultation or call +256 772 418 707.`;

// ─── STANDARD POST CHAT ENDPOINT (ROBUST JSON FALLBACK & TIMEOUT SAFE) ───
router.post('/chat', async (req, res) => {
  const { messages, message } = req.body;
  const userMessage = message || (Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].content : '');

  if (!userMessage) {
    return res.status(400).json({ success: false, error: 'Message text is required.' });
  }

  console.log(`[AI CHAT RECEIVED] Query: "${userMessage.substring(0, 60)}..."`);

  const genAI = getGeminiClient();

  if (!genAI) {
    console.log('[AI CHAT KNOWLEDGE ENGINE FALLBACK] Gemini API key missing or default placeholder.');
    const fallback = getKnowledgeResponse(userMessage);
    return res.json({
      success: true,
      source: 'knowledge_engine',
      text: fallback.text,
      actions: fallback.actions
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT
    });

    const history = (messages || []).slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const chat = model.startChat({
      history: history,
      generationConfig: { maxOutputTokens: 500 }
    });

    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    console.log('[AI CHAT SUCCESS] Gemini response generated.');

    // Attach contextual action buttons based on query
    const fallbackActions = getKnowledgeResponse(userMessage).actions;

    return res.json({
      success: true,
      source: 'gemini_api',
      text: responseText,
      actions: fallbackActions
    });

  } catch (err) {
    console.warn(`[GEMINI API WARNING] ${err.message}. Engaging local Knowledge Engine fallback.`);
    const fallback = getKnowledgeResponse(userMessage);
    return res.json({
      success: true,
      source: 'knowledge_engine_fallback',
      text: fallback.text,
      actions: fallback.actions
    });
  }
});

// ─── SSE STREAM CHAT ENDPOINT ──────────────────────────────────────────────────
router.post('/chat/stream', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const userMessage = messages[messages.length - 1].content;

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const genAI = getGeminiClient();

  if (!genAI) {
    console.log('[AI STREAM FALLBACK] Serving via local Knowledge Engine.');
    const fallback = getKnowledgeResponse(userMessage);
    res.write(`data: ${JSON.stringify({ type: 'content', content: fallback.text, actions: fallback.actions })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'done', actions: fallback.actions })}\n\n`);
    return res.end();
  }

  try {
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT
    });

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const chat = model.startChat({
      history: history,
      generationConfig: { maxOutputTokens: 600 }
    });

    const result = await chat.sendMessageStream(userMessage);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      res.write(`data: ${JSON.stringify({ type: 'content', content: chunkText })}\n\n`);
    }

    const fallbackActions = getKnowledgeResponse(userMessage).actions;
    res.write(`data: ${JSON.stringify({ type: 'done', actions: fallbackActions })}\n\n`);
    return res.end();

  } catch (error) {
    console.warn('[AI STREAM ERROR]', error.message);
    const fallback = getKnowledgeResponse(userMessage);
    res.write(`data: ${JSON.stringify({ type: 'content', content: fallback.text, actions: fallback.actions })}\n\n`);
    res.write(`data: ${JSON.stringify({ type: 'done', actions: fallback.actions })}\n\n`);
    return res.end();
  }
});

export default router;

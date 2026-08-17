import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectMysqlSession from 'express-mysql-session';
import db from './_db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
let sessionStore;

try {
  const MySQLStore = connectMysqlSession(session);
  sessionStore = new MySQLStore({}, db);
} catch (e) {
  console.warn('MySQL session store initialization bypassed:', e.message);
  sessionStore = new session.MemoryStore();
}

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  key: 'rkp_session',
  secret: process.env.SESSION_SECRET || 'kasaija_secret_key_2024_secure',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));

// Routes
import contactRoutes from './routes/contact.js';
import appointmentRoutes from './routes/appointments.js';
import adminRoutes from './routes/admin.js';
import chatRoutes from './routes/chat.js';

app.use('/api', contactRoutes);
app.use('/api', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', chatRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`RK&P API Server running on http://localhost:${PORT}`);
  });
}

export default app;

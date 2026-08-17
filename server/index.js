const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Session store configuration
const sessionStore = new MySQLStore({}, db);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  key: 'rkp_session',
  secret: process.env.SESSION_SECRET || 'kasaija_secret_key_2024',
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
const contactRoutes = require('./routes/contact');
const appointmentRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');

app.use('/api', contactRoutes);
app.use('/api', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', chatRoutes);

app.get('/', (req, res) => {
  res.send('RK&P API Server is running...');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

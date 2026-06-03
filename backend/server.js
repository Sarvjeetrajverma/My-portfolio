require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Allowed origins (NEVER use wildcard in production) ──────────────────────
const ALLOWED_ORIGINS = [
  'https://sarvjeet.vercel.app',     // your production domain
  'https://www.sarvjeet.vercel.app',
  'http://localhost:5173',            // local dev
  'http://localhost:4173',            // local preview
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server (no origin) or whitelisted origins
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS: Origin not allowed'));
    }
  },
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
}));

app.use(express.json({ limit: '10kb' })); // Limit payload size to prevent DoS

// ─── Simple in-memory rate limiter (per IP, 3 submissions per 15 min) ───────
const rateLimitMap = new Map();
const RATE_LIMIT = 3;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function rateLimit(req, res, next) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, resetAt: now + WINDOW_MS };

  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + WINDOW_MS;
  }

  entry.count++;
  rateLimitMap.set(ip, entry);

  if (entry.count > RATE_LIMIT) {
    return res.status(429).json({ message: 'Too many submissions. Try again in 15 minutes.' });
  }
  next();
}

// ─── Input sanitiser ────────────────────────────────────────────────────────
function sanitize(str = '') {
  return str.replace(/[<>&"'`]/g, '').slice(0, 2000);
}

// ─── Email transporter ──────────────────────────────────────────────────────
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.error('[server] WARNING: EMAIL_USER or EMAIL_PASS not set in backend/.env');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: emailUser, pass: emailPass },
});

// ─── Contact form endpoint ──────────────────────────────────────────────────
app.post('/api/contact', rateLimit, async (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Invalid email address.' });
  }
  if (name.length > 100 || message.length > 2000) {
    return res.status(400).json({ message: 'Input too long.' });
  }

  const safeName = sanitize(name);
  const safeEmail = sanitize(email);
  const safeMessage = sanitize(message);

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${emailUser}>`,
      to: emailUser,
      replyTo: safeEmail,
      subject: `New message from ${safeName}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\nMessage:\n${safeMessage}`,
      html: `<p><b>Name:</b> ${safeName}</p><p><b>Email:</b> ${safeEmail}</p><p><b>Message:</b><br>${safeMessage.replace(/\n/g,'<br>')}</p>`,
    });
    res.status(200).json({ message: 'Message sent!' });
  } catch (err) {
    // Don't expose error details to client
    console.error('[mailer] send failed:', err.code || err.message);
    res.status(500).json({ message: 'Failed to send message. Try again later.' });
  }
});

// ─── Health check only ──────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

// ─── Block all other routes ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Not found.' });
});

app.listen(PORT, 'localhost', () => {
  console.log(`[server] Running on port ${PORT}`);
});

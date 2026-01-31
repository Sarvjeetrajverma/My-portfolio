require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email configuration
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

console.log('Email User:', emailUser ? 'Set' : 'NOT SET');
console.log('Email Pass:', emailPass ? 'Set' : 'NOT SET');

if (!emailUser || !emailPass) {
  console.error('ERROR: EMAIL_USER or EMAIL_PASS environment variables are not set!');
  console.error('Please check your .env file in the backend directory.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

// In-memory storage for messages (in a real app, you'd use a database)
let messages = [];

// Contact form endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Store the message
  const newMessage = {
    id: Date.now(),
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  };

  messages.push(newMessage);

  // Send email
  const mailOptions = {
    from: 'sarvjeetrajverma@gmail.com',
    to: 'sarvjeetrajverma@gmail.com',
    subject: `New Contact Form Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nTimestamp: ${newMessage.timestamp}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p><p><strong>Timestamp:</strong> ${newMessage.timestamp}</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      console.error('Error details:', {
        code: error.code,
        response: error.response,
        responseCode: error.responseCode
      });
      return res.status(500).json({ message: 'Failed to send message.' });
    }
    console.log('Email sent successfully:', info.response);
    console.log('Message ID:', info.messageId);
  });

  console.log('New message received:', newMessage);

  res.status(200).json({
    message: 'Message sent successfully!',
    id: newMessage.id
  });
});

// Get all messages (for admin purposes)
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', messageCount: messages.length });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Messages endpoint: http://localhost:${PORT}/api/messages`);
});

import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  console.log('Received contact form submission:', { name, email, message });
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address.' });
  }

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: 'sarvjeetrajverma@gmail.com', // Your email address
      pass: 'YOUR_16_DIGIT_APP_PASSWORD' // Replace this with your generated App Password
    }
  });

  const mailOptions = {
    from: 'sarvjeetrajverma@gmail.com',
    to: 'sarvjeetrajverma@gmail.com', // Where you want to receive the emails
    replyTo: email,
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send message.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
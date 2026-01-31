import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

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

  try {
    // Email configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || process.env.GMAIL_USER,
        pass: process.env.EMAIL_PASS || process.env.GMAIL_PASS
      }
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log('Transporter verified successfully');

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER || process.env.GMAIL_USER,
      to: process.env.EMAIL_USER || process.env.GMAIL_USER,
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nTimestamp: ${new Date().toISOString()}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p><p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    res.status(200).json({
      message: 'Message sent successfully!'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    res.status(500).json({
      message: 'Failed to send message.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

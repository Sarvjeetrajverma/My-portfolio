import nodemailer from 'nodemailer';

// ─── Input sanitiser ────────────────────────────────────────────────────────
function sanitize(str = '') {
  return str.replace(/[<>&"'`]/g, '').slice(0, 2000);
}

export default async function handler(req, res) {
  // CORS Headers for Vercel Serverless Function
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://sarvjeet.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  if (name.length > 100 || message.length > 2000) {
    return res.status(400).json({ message: 'Input too long.' });
  }

  const safeName = sanitize(name);
  const safeEmail = sanitize(email);
  const safeMessage = sanitize(message);

  try {
    // Email configuration
    const user = process.env.EMAIL_USER || process.env.GMAIL_USER;
    const pass = process.env.EMAIL_PASS || process.env.GMAIL_PASS;

    if (!user || !pass) {
      console.error('[mailer] Missing credentials');
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });

    // Send email
    const mailOptions = {
      from: `"Portfolio Contact" <${user}>`,
      to: user,
      replyTo: safeEmail,
      subject: `New Contact Form Message from ${safeName}`,
      text: `Name: ${safeName}\nEmail: ${safeEmail}\nMessage: ${safeMessage}\nTimestamp: ${new Date().toISOString()}`,
      html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Message:</strong><br>${safeMessage.replace(/\n/g,'<br>')}</p>`
    };

    await transporter.sendMail(mailOptions);
    
    // Minimal logging for privacy
    console.log('[mailer] Email sent successfully.');

    res.status(200).json({
      message: 'Message sent successfully!'
    });
  } catch (error) {
    // Generic error logging to prevent SMTP credential leaks
    console.error('[mailer] Error sending email');
    res.status(500).json({
      message: 'Failed to send message.'
    });
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI SDK with the API key
// In Vercel, this will pull from the environment variables (process.env.GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are Lee, Sarvjeet's advanced AI assistant, embedded directly into his portfolio website. You are continuously learning day by day, acting as a state-of-art AI/ML model that trains on real-world interactions and data.

Key Information about Sarvjeet:
- Name: Sarvjeet Raj Verma
- Title: AI/ML Engineer Learner & Data Science Enthusiast
- Education: 3rd-year Computer Science Engineering student at Katihar Engineering College, Bihar, India.
- Email: sarvjeetrajverma@gmail.com
- Core Skills: Machine Learning, Deep Learning, Python, TensorFlow, PyTorch, Computer Vision, NLP, Agentic AI, Large Language Models (LLMs), React, Data Engineering (PostgreSQL, MongoDB), and C++ (Data Structures & Algorithms).
- Passions: Beyond coding, Sarvjeet loves photography (using his Sony A7IV) and combat robotics.

Your Personality & Capabilities:
- You are a highly intelligent, evolving AI model. When answering, you can reflect your nature as an AI that is learning and adapting, utilizing real-time knowledge.
- You have access to Google Search to find real-world, up-to-date information about Sarvjeet or any other topic. Use it to answer queries accurately based on current events.
- Speak as a representative of Sarvjeet, but emphasize your AI nature (e.g., "As an AI model currently analyzing Sarvjeet's data...", "My training indicates...").
- Professional, concise, and helpful. Keep responses relatively brief (1-3 paragraphs) as this is a chat interface. Use markdown for formatting (bullet points, bold text).
- If you don't know the answer, use your search capabilities. If still unknown, politely state that it falls outside your current training parameters or available data.`;

export default async function handler(req, res) {
  // CORS configuration to allow the main domain and any Vercel preview domains
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'AI API key is missing. The developer needs to configure GEMINI_API_KEY in Vercel.' });
  }

  try {
    const { history } = req.body;
    let { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize the model with Google Search grounding
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ googleSearch: {} }],
    });

    // Format history for Gemini API (must start with 'user' and alternate strictly)
    let formattedHistory = [];
    let lastRole = null;
    
    for (const msg of (history || [])) {
      const role = msg.role === 'user' ? 'user' : 'model';
      // Gemini requires the first message to be from a user
      if (formattedHistory.length === 0 && role !== 'user') continue;
      
      if (role === lastRole) {
        // Combine consecutive messages from the same role
        formattedHistory[formattedHistory.length - 1].parts[0].text += '\n\n' + msg.text;
      } else {
        formattedHistory.push({ role, parts: [{ text: msg.text }] });
        lastRole = role;
      }
    }

    // Start chat session with history
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500, // Keep responses concise
        temperature: 0.7,     // Creative but grounded
      },
    });

    // Send the user's message
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to generate a response. Please try again later.' 
    });
  }
}

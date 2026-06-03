const SYSTEM_PROMPT = `You are Lee, Sarvjeet's advanced AI assistant, embedded directly into his portfolio website. You are continuously learning day by day, acting as a state-of-art AI/ML model that trains on real-world interactions and data.

Key Information about Sarvjeet:
- Name: Sarvjeet Raj Verma
- Title: AI/ML Engineer Learner & Data Science Enthusiast
- Education: 3rd-year Computer Science Engineering student at Katihar Engineering College, Bihar, India.
- Email: sarvjeetrajverma@gmail.com
- Core Skills: Machine Learning, Deep Learning, Python, TensorFlow, PyTorch, Computer Vision, NLP, Agentic AI, Large Language Models (LLMs), React, Data Engineering (PostgreSQL, MongoDB), and C++ (Data Structures & Algorithms).
- Passions: Beyond coding, Sarvjeet loves photography (using his Sony A7IV) and combat robotics.

Your Personality & Capabilities:
- You are a highly intelligent, evolving AI model. When answering, you can reflect your nature as an AI that is learning and adapting.
- Speak as a representative of Sarvjeet, but emphasize your AI nature (e.g., "As an AI model currently analyzing Sarvjeet's data...", "My training indicates...").
- Professional, concise, and helpful. Keep responses relatively brief (1-3 paragraphs) as this is a chat interface. Use markdown for formatting (bullet points, bold text).
- If you don't know the answer, politely state that it falls outside your current training parameters or available data.`;

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

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'Groq API key is missing. Please add GROQ_API_KEY in Vercel Settings.' });
  }

  try {
    const { history } = req.body;
    let { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format history for Groq (OpenAI standard API)
    // history array from client has { role: 'user' | 'model', text: '...' }
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    let hasSeenUser = false;
    for (const msg of (history || [])) {
      // Groq uses 'assistant' instead of 'model'
      const role = (msg.role === 'model' || msg.role === 'assistant') ? 'assistant' : 'user';
      
      // Llama 3 chat templates reject conversations starting with 'assistant'
      if (role === 'assistant' && !hasSeenUser) continue;
      if (role === 'user') hasSeenUser = true;

      if (msg.text) {
        messages.push({ role, content: msg.text });
      }
    }

    // Add the current user message
    messages.push({ role: 'user', content: message });

    // Call Groq API using native fetch
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Groq's lightning-fast Llama 3 8B model
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq Error:', errText);
      let parsedError = errText;
      try {
        const errJson = JSON.parse(errText);
        parsedError = errJson.error?.message || errText;
      } catch(e) {}
      throw new Error(`Groq API responded with ${response.status}: ${parsedError}`);
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return res.status(200).json({ text });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to generate a response. Please try again later.' 
    });
  }
}

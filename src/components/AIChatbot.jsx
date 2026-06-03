import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaMagic } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { collection, addDoc, serverTimestamp, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ 
    role: 'model', 
    text: "Hello! I'm Sarvjeet's AI Assistant. How can I help you explore his portfolio today?" 
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Load or generate session ID and fetch history from Firebase
  useEffect(() => {
    const initSession = async () => {
      let localSession = localStorage.getItem('ai_chat_session');
      if (!localSession) {
        localSession = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('ai_chat_session', localSession);
      }
      setSessionId(localSession);

      // Attempt to load past memory from Firebase
      try {
        if (db) {
          const sessionRef = doc(db, 'chat_sessions', localSession);
          const docSnap = await getDoc(sessionRef);
          if (docSnap.exists() && docSnap.data().history) {
             setMessages(docSnap.data().history);
          }
        }
      } catch (err) {
        console.error("Firebase Memory Load Error:", err);
      }
    };
    initSession();
  }, []);

  // Save conversation memory to Firebase
  const saveMemoryToFirebase = async (newHistory) => {
    if (!sessionId || !db) return;
    try {
      const sessionRef = doc(db, 'chat_sessions', sessionId);
      await setDoc(sessionRef, {
        history: newHistory,
        lastUpdated: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error("Firebase Memory Save Error:", err);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    const newMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);

    try {
      // Determine the API URL (works locally and in production)
      const apiUrl = import.meta.env.DEV ? 'http://localhost:3000/api/chat' : '/api/chat';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          message: userMessage,
          // Send previous context (excluding the very first greeting if desired, but good for context)
          history: newMessages.slice(0, -1) 
        }),
      });

      if (!response.ok) {
        throw new Error('API Error');
      }

      const data = await response.json();
      
      const updatedHistory = [...newMessages, { role: 'model', text: data.text }];
      setMessages(updatedHistory);
      
      // Save the day-to-day learning memory
      saveMemoryToFirebase(updatedHistory);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Sorry, my connection was interrupted. Please check your internet or try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <FaRobot className="text-2xl" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-[#0f0f13] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <FaRobot />
                  </div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0f0f13]"></div>
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm flex items-center gap-2">
                    Sarvjeet AI <FaMagic className="text-emerald-400 text-xs" />
                  </h3>
                  <p className="text-emerald-500/70 text-[10px] uppercase tracking-wider font-mono">Online & Learning</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-emerald-500 text-white rounded-br-sm' 
                        : 'bg-white/10 text-slate-200 rounded-bl-sm border border-white/5'
                    }`}
                  >
                    {msg.role === 'model' ? (
                      <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-p:my-1 text-sm">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="leading-relaxed">{msg.text}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 text-emerald-400 rounded-2xl rounded-bl-sm px-4 py-3 text-sm flex items-center gap-1.5 border border-white/5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/[0.02]">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1.5 p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors"
                >
                  <FaPaperPlane className="text-xs" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

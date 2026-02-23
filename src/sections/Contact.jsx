import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaTerminal } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('https://formspree.io/f/mwvbgqwv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Message delivered_');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Error: Message failed.');
      }
    } catch (error) {
      setStatus('Error: Connection failed.');
    }
  };

  return (
    <section id="contact" className="w-full py-8 md:py-16 text-gray-300 overflow-hidden font-mono relative">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        
        {/* Transparent Glass Window Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-black/30 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Mac/Linux Window Header */}
          <div className="bg-white/5 px-3 py-2 md:px-6 md:py-3 flex items-center justify-between border-b border-white/10 backdrop-blur-md">
            <div className="flex gap-1.5 md:gap-2.5">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-[10px] md:text-sm tracking-wider">
              <FaTerminal size={10} className="md:w-3.5 md:h-3.5" />
              <span>contact.jsx</span>
            </div>
            <div className="w-10 md:w-16"></div> {/* Spacer */}
          </div>

          <div className="flex flex-col md:flex-row">
            
            {/* LEFT SIDE: "Code" Contact Info */}
            <div className="md:w-5/12 lg:w-4/12 p-4 md:p-6 lg:px-10 lg:py-6 border-b md:border-b-0 md:border-r border-white/10 bg-transparent text-[11px] md:text-sm lg:text-sm leading-relaxed md:leading-loose">
              <div className="flex gap-2 md:gap-6">
                {/* Line Numbers */}
                <div className="text-gray-600 text-right select-none hidden sm:flex flex-col">
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
                </div>
                {/* Code Snippet */}
                <div className="overflow-x-auto whitespace-nowrap md:whitespace-normal pb-1 md:pb-0">
                  <p><span className="text-[#c678dd]">const</span> <span className="text-[#61afef]">developer</span> <span className="text-[#56b6c2]">=</span> {'{'}</p>
                  <p className="ml-3 md:ml-4 lg:ml-6">
                    <span className="text-[#e06c75]">name:</span> <span className="text-[#98c379]">'Sarvjeet Raj Verma'</span>,
                  </p>
                  <p className="ml-3 md:ml-4 lg:ml-6">
                    <span className="text-[#e06c75]">email:</span>{' '}
                    <a href="mailto:sarvjeetrajverma@gmail.com" className="text-[#98c379] hover:text-white transition-colors underline-offset-4">
                      <span className="md:hidden">'sarvjeetrajverma@gma...'</span>
                      <span className="hidden md:inline">'sarvjeetrajverma@gmail.com'</span>
                    </a>,
                  </p>
                  <p className="ml-3 md:ml-4 lg:ml-6">
                    <span className="text-[#e06c75]">location:</span> <span className="text-[#98c379]">'India'</span>,
                  </p>
                  <p className="ml-3 md:ml-4 lg:ml-6">
                    <span className="text-[#e06c75]">openForWork:</span> <span className="text-[#d19a66]">true</span>
                  </p>
                  <p>{'};'}</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: The Form */}
            <div className="md:w-7/12 lg:w-8/12 p-4 md:p-6 lg:px-12 lg:py-6 bg-black/20 relative flex flex-col justify-center">
              <div className="mb-3 md:mb-5 lg:mb-4">
                <p className="text-gray-500 text-[10px] md:text-sm mb-1">{`// Send a direct message`}</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4 lg:gap-5">
                
                {/* Minimalist Input: Name */}
                <div className="relative flex items-center bg-black/30 rounded-lg border border-white/10 focus-within:border-[#61afef]/50 focus-within:bg-black/50 transition-all duration-300 overflow-hidden shadow-inner">
                  <span className="pl-3 md:pl-5 text-[#c678dd] text-xs md:text-sm font-medium hidden sm:inline">const</span>
                  <span className="pl-3 sm:pl-2 md:pl-3 text-[#e06c75] text-[11px] md:text-sm font-medium">name</span>
                  <span className="px-1.5 md:px-3 text-[#56b6c2] text-[11px] md:text-sm font-medium">=</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent py-1.5 md:py-2.5 pr-3 md:pr-5 text-[#98c379] text-[11px] md:text-sm focus:outline-none placeholder-gray-600"
                    placeholder="'Your Name'"
                    required
                  />
                </div>

                {/* Minimalist Input: Email */}
                <div className="relative flex items-center bg-black/30 rounded-lg border border-white/10 focus-within:border-[#61afef]/50 focus-within:bg-black/50 transition-all duration-300 overflow-hidden shadow-inner">
                  <span className="pl-3 md:pl-5 text-[#c678dd] text-xs md:text-sm font-medium hidden sm:inline">const</span>
                  <span className="pl-3 sm:pl-2 md:pl-3 text-[#e06c75] text-[11px] md:text-sm font-medium">email</span>
                  <span className="px-1.5 md:px-3 text-[#56b6c2] text-[11px] md:text-sm font-medium">=</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent py-1.5 md:py-2.5 pr-3 md:pr-5 text-[#98c379] text-[11px] md:text-sm focus:outline-none placeholder-gray-600"
                    placeholder="'you@example.com'"
                    required
                  />
                </div>

                {/* Minimalist Textarea: Message */}
                <div className="relative bg-black/30 rounded-lg border border-white/10 focus-within:border-[#61afef]/50 focus-within:bg-black/50 transition-all duration-300 p-2.5 md:p-4 shadow-inner">
                  <div className="flex gap-1.5 md:gap-3 text-[11px] md:text-sm mb-1.5 md:mb-2 font-medium">
                    <span className="text-[#c678dd]">let</span>
                    <span className="text-[#e06c75]">msg</span>
                    <span className="text-[#56b6c2]">=</span>
                    <span className="text-[#98c379]">`</span>
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full h-12 md:h-16 lg:h-20 bg-transparent text-[#98c379] text-[11px] md:text-sm focus:outline-none resize-none placeholder-gray-600"
                    placeholder="Type your message..."
                    required
                  />
                  <div className="text-[#98c379] text-[11px] md:text-sm font-medium">`</div>
                </div>

                {/* Command Line Submit Button */}
                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === 'Sending...'}
                  className="mt-1 w-full border border-white/20 text-[#61afef] hover:border-[#61afef]/70 font-bold py-2 md:py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 hover:text-white disabled:opacity-50 group backdrop-blur-sm text-[11px] md:text-sm shadow-lg"
                >
                  {status === 'Sending...' ? 'Executing...' : (
                    <>
                      <span className="text-[10px] md:text-sm text-gray-500 group-hover:text-gray-300 transition-colors">{`> `}</span> run.sendMessage()
                      <FaPaperPlane size={10} className="md:w-3.5 md:h-3.5 ml-1 md:ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
                    </>
                  )}
                </motion.button>

                {/* Console Output for Status */}
                {status && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-black/40 border border-white/10 backdrop-blur-md p-2 md:p-3 rounded-lg mt-1"
                  >
                    <p className={`text-[10px] md:text-sm ${status.includes('delivered') ? 'text-[#98c379]' : 'text-[#e06c75]'}`}>
                      <span className="text-gray-500 mr-1.5 md:mr-3">console.log(status):</span> 
                      {status}
                    </p>
                  </motion.div>
                )}

              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

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
        setStatus('Message delivered successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Error: Message failed to send.');
      }
    } catch (error) {
      setStatus('Error: Connection failed.');
    }
  };

  return (
    <section id="contact" className="w-full py-10 md:py-16 bg-transparent text-gray-300 relative">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8 relative z-10">
        
        {/* Simple, lightweight animation to prevent mobile lag */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
        >
          {/* LEFT SIDE: Contact Information */}
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Let's build something <span className="text-indigo-400">great.</span>
            </h2>
            <p className="text-gray-400 mb-8 text-sm md:text-base leading-relaxed max-w-sm">
              Have a project idea or want to discuss tech? My inbox is always open. Let's connect!
            </p>

            <div className="space-y-5">
              {/* Email Block */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-black/20 border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <FaEnvelope size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</h3>
                  <a 
                    href="mailto:sarvjeetrajverma@gmail.com" 
                    className="text-gray-200 hover:text-indigo-400 transition-colors text-sm md:text-base font-medium"
                  >
                    sarvjeetrajverma@gmail.com
                  </a>
                </div>
              </div>

              {/* Location Block */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-black/20 border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <FaMapMarkerAlt size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</h3>
                  <p className="text-gray-200 text-sm md:text-base font-medium">India</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: The Form */}
          {/* Using a very light backdrop-blur and black/10 to keep it transparent but readable without lagging */}
          <div className="bg-black/10 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Name Input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-medium text-gray-400">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 md:py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:bg-black/40 transition-colors"
                  placeholder="sarvjeet raj verma"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-gray-400">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 md:py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:bg-black/40 transition-colors"
                  placeholder="sarvjeet45@gmail.com"
                  required
                />
              </div>

              {/* Message Textarea - Reduced rows to 4 to save space */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-medium text-gray-400">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 md:py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:bg-black/40 transition-colors resize-none"
                  placeholder="How can I help you?"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'Sending...'}
                className="mt-2 w-full bg-indigo-500/80 hover:bg-indigo-500 border border-indigo-500/50 text-white font-medium py-2.5 md:py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
              >
                {status === 'Sending...' ? 'Sending...' : (
                  <>
                    Send Message
                    <FaPaperPlane className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Status Message */}
              {status && status !== 'Sending...' && (
                <div 
                  className={`mt-2 p-3 rounded-lg text-xs font-medium text-center ${
                    status.includes('successfully') 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {status}
                </div>
              )}

            </form>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
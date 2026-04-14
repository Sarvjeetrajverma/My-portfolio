import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ease = [0.22, 1, 0.36, 1];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
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
    } catch {
      setStatus('Error: Connection failed.');
    }
  };

  return (
    <section id="contact" className="relative w-full bg-transparent text-white overflow-hidden py-5 md:py-8 lg:py-10">

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-[1100px] mx-auto px-6 md:px-10 relative z-10">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-10 md:mb-14"
        >
          Contact
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] leading-[0.95] font-medium tracking-tighter text-white mb-12 md:mb-16"
        >
          Let's build something <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>great.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.85, ease }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start"
        >
          {/* Contact info */}
          <div className="flex flex-col justify-start gap-10">
            <p className="text-slate-400 text-base sm:text-lg md:text-xl leading-relaxed font-light max-w-sm">
              Have a project idea or want to discuss tech? My inbox is always open. Let's connect!
            </p>

            <div className="space-y-6 divide-y divide-white/[0.05]">
              {/* Email */}
              <div className="flex items-start gap-5 pt-6 first:pt-0">
                <div className="w-9 h-9 border border-white/[0.08] rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                  <FaEnvelope size={14} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-widest mb-1.5">Email</h3>
                  <a href="mailto:sarvjeetrajverma@gmail.com" className="text-slate-200 hover:text-white transition-colors text-base sm:text-lg font-light">
                    sarvjeetrajverma@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-5 pt-6">
                <div className="w-9 h-9 border border-white/[0.08] rounded-xl flex items-center justify-center text-slate-500 shrink-0">
                  <FaMapMarkerAlt size={14} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-slate-600 uppercase tracking-widest mb-1.5">Location</h3>
                  <p className="text-slate-200 text-base sm:text-lg font-light">India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-widest">Your Name</label>
                <input
                  type="text" id="name" name="name"
                  value={formData.name} onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/[0.08] py-4 text-base sm:text-lg text-white placeholder-slate-700 focus:outline-none focus:border-white/30 transition-colors duration-300"
                  placeholder="sarvjeet raj verma"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-widest">Email Address</label>
                <input
                  type="email" id="email" name="email"
                  value={formData.email} onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/[0.08] py-4 text-base sm:text-lg text-white placeholder-slate-700 focus:outline-none focus:border-white/30 transition-colors duration-300"
                  placeholder="sarvjeet45@gmail.com"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-widest">Message</label>
                <textarea
                  id="message" name="message"
                  value={formData.message} onChange={handleChange}
                  rows="4"
                  className="w-full bg-transparent border-b border-white/[0.08] py-4 text-base sm:text-lg text-white placeholder-slate-700 focus:outline-none focus:border-white/30 transition-colors duration-300 resize-none"
                  placeholder="How can I help you?"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={status === 'Sending...'}
                className="mt-2 flex items-center gap-2 text-base sm:text-lg font-medium text-white border-b border-white/30 pb-0.5 w-fit hover:text-slate-300 hover:border-slate-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'Sending...' ? 'Sending...' : <><FaPaperPlane size={12} /> Send Message</>}
              </button>

              {status && status !== 'Sending...' && (
                <div className={`text-xs font-medium py-3 px-4 border rounded-lg ${
                  status.includes('successfully')
                    ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/[0.04]'
                    : 'border-red-500/20 text-red-400 bg-red-500/[0.04]'
                }`}>
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
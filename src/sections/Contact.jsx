import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPaperPlane, FaMapMarkerAlt } from 'react-icons/fa';

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
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      setStatus('Error sending message.');
    }
  };

  return (
    <section id="contact" className="w-full py-12 text-white overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-4">
        
        <div className="text-center mb-8">
            <p className="text-teal-400 font-bold uppercase tracking-wider text-xs">Get in Touch</p>
            <h2 className="text-3xl font-bold">Contact Me</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* LEFT SIDE: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 h-full flex flex-col justify-center"
          >
            <h3 className="text-xl font-bold mb-4 text-white">Let's Connect</h3>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              I am currently looking for internships and new opportunities. 
              Whether you have a question or just want to say hi, my inbox is always open!
            </p>

            <div className="space-y-4">
              {/* Email Item */}
              <motion.a 
                href="mailto:sarvjeetrajverma@gmail.com"
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 group p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <div className="bg-teal-500/10 p-3 rounded-full text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                  <FaEnvelope size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Email Me</p>
                  <p className="text-sm font-medium text-gray-200 group-hover:text-teal-400 transition-colors">
                    sarvjeetrajverma@gmail.com
                  </p>
                </div>
              </motion.a>

              {/* Location Item (Optional extra detail) */}
              <div className="flex items-center gap-4 p-3">
                <div className="bg-gray-700/50 p-3 rounded-full text-gray-400">
                  <FaMapMarkerAlt size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
                  <p className="text-sm font-medium text-gray-200">Indian, India</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-1 ml-1">NAME</label>
                <input
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm transition-all"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold mb-1 ml-1">EMAIL</label>
                <input
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm transition-all"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold mb-1 ml-1">MESSAGE</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-sm transition-all resize-none"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message..."
                  rows="4"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
                disabled={status === 'Sending...'}
              >
                {status === 'Sending...' ? 'Sending...' : (
                  <>
                    Send Message <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Status Feedback */}
            {status && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-3 text-center text-xs font-bold ${status.includes('success') ? 'text-green-400' : 'text-red-400'}`}
              >
                {status}
              </motion.p>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;

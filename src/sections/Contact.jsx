import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Email sent successfully');
        setStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        console.error('Error sending email:', data);
        setStatus('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div id="contact" className="w-full py-16 px-4 gradient">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Get In Touch</h2>
          <p className="text-lg text-gray-200">Send me a message!</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-black text-sm font-medium mb-2">Name</label>
              <input
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-gray-300 rounded-md text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                disabled={status === 'Sending...'}
              />
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-2">Email</label>
              <input
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-gray-300 rounded-md text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                disabled={status === 'Sending...'}
              />
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-2">Message</label>
              <textarea
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-gray-300 rounded-md text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project or just say hi! I'm excited to connect with fellow developers."
                required
                disabled={status === 'Sending...'}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={status === 'Sending...'}
            >
              {status === 'Sending...' ? 'Sending...' : 'Send Message'}
            </button>

            {status && status !== 'Sending...' && (
              <p className={`text-center text-sm ${status.includes('successfully') ? 'text-green-300' : 'text-red-300'}`}>
                {status}
              </p>
            )}
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-300">Your message will be sent directly to my email!</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

import React from 'react';

const Contact = () => {
  return (
    <div id="contact" className="w-full py-16 px-4 bg-gray-100">
      
      {/* Container for the form box */}
      <div className="max-w-[600px] mx-auto bg-white p-8 rounded-lg shadow-lg">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Contact Me</h2>
          <p className="text-gray-600 mt-2">I'd love to hear from you!</p>
        </div>

        {/* Form */}
        <form action="https://getform.io/f/your-id-here" method="POST" className="flex flex-col gap-4">
          
          {/* Name Input */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Name</label>
            <input 
              className="border-2 border-gray-300 p-2 rounded-md focus:outline-blue-500" 
              type="text" 
              name="name" 
              placeholder="Your Name" 
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Email</label>
            <input 
              className="border-2 border-gray-300 p-2 rounded-md focus:outline-blue-500" 
              type="email" 
              name="email" 
              placeholder="your@email.com" 
            />
          </div>

          {/* Message Input */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-600 mb-1">Message</label>
            <textarea 
              className="border-2 border-gray-300 p-2 rounded-md focus:outline-blue-500" 
              rows="5" 
              name="message" 
              placeholder="Write your message here..."
            ></textarea>
          </div>

          {/* Button */}
          <button className="bg-blue-600 text-white font-bold py-3 rounded-md mt-4 hover:bg-blue-700 transition duration-300">
            Send Message
          </button>

        </form>
      </div>
    </div>
  );
};

export default Contact;
import React from 'react';

const About = () => {
  return (
    <div id="about" className="w-full py-16 px-4 bg-gray-900 text-white">
      <div className="max-w-[1240px] mx-auto grid md:grid-cols-2 gap-10 items-center">
        
        {/* Image Side */}
        <div className="w-full relative group">
           {/* Decorative Border Effect */}
           <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-teal-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
           <img 
             className="relative rounded-lg shadow-2xl w-full object-cover h-[400px]" 
             src="https://images.unsplash.com/photo-1531297425163-436e18e583aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80" 
             alt="Coding setup" 
           />
        </div>

        {/* Text Side */}
        <div className="flex flex-col justify-center">
          <p className="text-teal-400 font-bold uppercase tracking-wider mb-2">
            About Our Mission
          </p>
          <h1 className="md:text-4xl text-3xl font-bold py-2 mb-4">
            Creating Digital Experiences
          </h1>
          <p className="mb-4 text-gray-300 leading-7">
            We are a team of dedicated developers and designers focused on creating intuitive, dynamic, and beautiful user interfaces. 
          </p>
          <p className="mb-8 text-gray-300 leading-7">
            With over 5 years of experience in React and modern CSS frameworks, we ensure your website not only looks good but performs flawlessly across all devices.
          </p>
          
          <button className="w-[200px] bg-teal-400 text-black font-bold py-3 px-6 rounded-md hover:bg-teal-300 transition duration-300">
            Get In Touch
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default About;
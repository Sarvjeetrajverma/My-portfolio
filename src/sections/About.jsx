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
             src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1364&q=80"
             alt="My photo"
           />
        </div>

        {/* Text Side */}
        <div className="flex flex-col justify-center">
          <p className="text-teal-400 font-bold uppercase tracking-wider mb-2">
            About Me
          </p>
          <h1 className="md:text-4xl text-3xl font-bold py-2 mb-4">
            My Journey in Web Development
          </h1>
          <p className="mb-4 text-gray-300 leading-7">
            I am a passionate beginner in web development, eager to learn and create amazing digital experiences.
          </p>
          <p className="mb-4 text-gray-300 leading-7">
            With a background in Computer Science, I have developed a strong understanding of programming fundamentals and problem-solving strategies.
          </p>
          <p className="mb-8 text-gray-300 leading-7">
            Currently learning React, JavaScript, and modern CSS frameworks, I am building my skills to create intuitive and beautiful user interfaces.
          </p>

          <a href="#projects" className="w-[200px] bg-teal-400 text-black font-bold py-3 px-6 rounded-md hover:bg-teal-300 transition duration-300 text-center">
            View My Work
          </a>
        </div>
        
      </div>
    </div>
  );
};

export default About;
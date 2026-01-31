import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: "prof. sneha kumari",
    role: "Professor of Computer Science",
    feedback: "Sarvjeet is an exceptionally quick learner. During our web development course, he not only mastered the MERN stack concepts rapidly but also helped his peers understand complex backend logic. His final project was one of the best in the class."
  },
  {
    name: "Dr. ranjana sinha ",
    role: "Senior Developer at Tech Startup",
    feedback: "I mentored Sarvjeet during his summer internship. I was impressed by his ability to jump into a new codebase and start contributing immediately. He has a great eye for detail in frontend design and writes clean, maintainable code."
  },
  {
    name: "Amrit raj",
    role: "Project Teammate",
    feedback: "Working with Sarvjeet on our capstone project was a great experience. He handled the API integration seamlessly and was always available to debug issues. A true team player who is passionate about full-stack development."
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="w-full py-20 bg-gray-900 text-white">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-teal-400 font-bold uppercase tracking-wider">Feedback</p>
          <h2 className="text-3xl md:text-4xl font-bold py-4">Testimonials</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-8 rounded-xl shadow-xl relative hover:bg-gray-700 transition-colors duration-300"
            >
              <FaQuoteLeft className="text-teal-400 text-4xl mb-4 opacity-50" />
              <p className="text-gray-300 mb-6 leading-relaxed italic">
                "{testimonial.feedback}"
              </p>
              <div className="flex items-center">
                <div>
                  <h4 className="font-bold text-lg text-white">{testimonial.name}</h4>
                  <p className="text-teal-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

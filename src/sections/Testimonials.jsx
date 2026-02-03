import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaRobot, FaUserFriends, FaLaptopCode } from 'react-icons/fa';

const testimonials = [
  {
    name: "Robotics Club Lead",
    role: "Senior Year Student",
    feedback: "His dedication during the Robo War & Robo Soccer events was outstanding. He is a quick learner who isn't afraid to get his hands dirty with hardware and logic.",
    icon: <FaRobot />
  },
  {
    name: "TechFusion Secretary",
    role: "Event Organizing Committee",
    feedback: "As a Core Coordinator, he handled the pressure of the 4-day fest amazingly well. A reliable team player who ensured the technical events ran smoothly.",
    icon: <FaUserFriends />
  },
  {
    name: "Project Teammate",
    role: "Web Development Group",
    feedback: "Great problem-solving skills! He built the frontend for our group project efficiently and helped us debug issues in the React code. Always ready to learn.",
    icon: <FaLaptopCode />
  }
];

// --- VARIANTS ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Stagger cards appearing one by one
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const Testimonials = () => {
  return (
    <section id="testimonials" className="w-full py-24 bg-transparent text-white relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal-500/5 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ width: 0 }} 
            whileInView={{ width: "40px" }} 
            className="h-1 bg-teal-500 mx-auto mb-4 rounded-full" 
          />
          <h2 className="text-3xl md:text-5xl font-bold mb-4">What Peers Say</h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base">
            Feedback received from seniors and teammates during college events and collaborative projects.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="relative h-full"
            >
              {/* Floating Wrapper */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4 + index, // Different durations for organic feel
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
                className="h-full"
              >
                <div className="h-full bg-gray-800/40 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/5 hover:border-teal-500/50 hover:bg-gray-800/60 transition-all duration-300 group flex flex-col hover:shadow-[0_10px_40px_-10px_rgba(20,184,166,0.3)]">
                  
                  {/* Icon & Quote Mark */}
                  <div className="flex justify-between items-start mb-6">
                    <motion.div 
                      className="p-3 bg-gray-900/80 rounded-full text-teal-400 text-xl border border-gray-700 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.icon}
                    </motion.div>
                    
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                       <FaQuoteLeft className="text-gray-500 text-4xl" />
                    </motion.div>
                  </div>

                  {/* Feedback Text */}
                  <p className="text-gray-300 mb-6 leading-relaxed text-sm italic flex-grow relative z-10">
                    "{item.feedback}"
                  </p>

                  {/* Author Info */}
                  <div className="border-t border-gray-700/50 pt-4 mt-auto flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {item.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-white group-hover:text-teal-400 transition-colors">
                        {item.name}
                        </h4>
                        <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">
                        {item.role}
                        </p>
                    </div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaRobot, FaUserFriends, FaLaptopCode, FaCheckCircle } from 'react-icons/fa';

const testimonials = [
  {
    id: "robo-lead",
    name: "Robotics Lead",
    role: "Senior Student",
    feedback: "His dedication during the Robo War & Robo Soccer events was outstanding. He is a quick learner who isn't afraid to get his hands dirty with hardware and logic.",
    icon: <FaRobot />
  },
  {
    id: "tech-fusion",
    name: "TechFusion",
    role: "Core Committee",
    feedback: "As a Core Coordinator, he handled the pressure of the 4-day fest amazingly well. A reliable team player who ensured the technical events ran smoothly.",
    icon: <FaUserFriends />
  },
  {
    id: "web-dev",
    name: "Project Peer",
    role: "Web Dev Group",
    feedback: "Great problem-solving skills! He built the frontend for our group project efficiently and helped us debug issues in the React code. Always ready to learn.",
    icon: <FaLaptopCode />
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    // Strictly transparent background
    <section id="testimonials" className="w-full py-12 md:py-24 bg-transparent text-white z-0 overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">
            Peer <span className="text-teal-400 font-light italic">Perspectives.</span>
          </h2>
          <div className="w-12 md:w-16 h-[2px] bg-teal-500/50 rounded-full" />
        </motion.div>

        {/* Main Interactive Container */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          
          {/* --- MOBILE: Swipeable Pills | DESKTOP: Vertical List --- */}
          <div className="w-full md:w-1/3 flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x">
            {testimonials.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(index)}
                  // touch-manipulation ensures fast tap response on mobile
                  className="relative group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl text-left transition-colors duration-300 min-w-max md:min-w-0 touch-manipulation"
                >
                  {/* Fluid Active Background (Adapts perfectly to mobile pill vs desktop card) */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-white/[0.04] border border-teal-400/30 rounded-xl md:shadow-[0_0_15px_rgba(20,184,166,0.05)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Subtle hover background for inactive tabs */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/[0.02] border border-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}

                  <div className={`relative z-10 text-lg md:text-xl transition-colors duration-300 ${isActive ? 'text-teal-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                    {item.icon}
                  </div>
                  
                  <div className="relative z-10 pr-2 md:pr-0">
                    <h4 className={`font-semibold text-[15px] md:text-base whitespace-nowrap md:whitespace-normal transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                      {item.name}
                    </h4>
                    {/* Hidden on mobile to save space, visible on desktop */}
                    <p className="hidden md:block text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
                      {item.role}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* --- ACTIVE CONTENT DISPLAY --- */}
          <div className="w-full md:w-2/3 relative flex flex-col justify-center mt-2 md:mt-0">
            {/* Large Decorative Quote - Scaled down slightly for mobile */}
            <FaQuoteLeft className="absolute -top-4 -left-2 md:-top-6 md:-left-4 text-6xl md:text-7xl text-white/[0.03] z-0 pointer-events-none" />
            
            <div className="relative z-10 w-full min-h-[160px] md:min-h-[200px] border-l border-white/10 pl-5 md:pl-10 py-2 md:py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col h-full justify-center"
                >
                  {/* Mobile-only role display (since we hid it from the pills) */}
                  <div className="md:hidden text-teal-400/80 text-xs tracking-widest uppercase font-semibold mb-3">
                    {testimonials[activeIndex].role}
                  </div>

                  <p className="text-lg md:text-2xl font-light leading-relaxed text-gray-300 mb-6 md:mb-8">
                    "{testimonials[activeIndex].feedback}"
                  </p>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-xs md:text-sm font-medium tracking-wide">
                    <FaCheckCircle className="text-teal-500/80 text-sm" />
                    <span>Verified Teammate / Peer</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
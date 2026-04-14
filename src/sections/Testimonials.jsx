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

const ease = [0.22, 1, 0.36, 1];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="testimonials" className="relative w-full bg-transparent text-white overflow-hidden py-5 md:py-8 lg:py-10">

      {/* Ambient glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-[1100px] mx-auto px-6 md:px-10 relative z-10">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-10 md:mb-14"
        >
          Peer Perspectives
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] leading-[0.95] font-medium tracking-tighter text-white mb-12 md:mb-16"
        >
          Peer <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Perspectives.</span>
        </motion.h2>

        {/* Selector tabs + quote area */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">

          {/* Left: selector list */}
          <div className="w-full md:w-1/3 flex md:flex-col gap-2 md:gap-0 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide divide-y-0 md:divide-y divide-white/[0.05]">
            {testimonials.map((item, i) => {
              const isActive = activeIndex === i;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(i)}
                  className="relative group flex items-center gap-4 py-5 px-3 md:px-0 text-left transition-colors duration-300 min-w-max md:min-w-0 shrink-0"
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 top-0 bottom-0 w-px bg-white/40 hidden md:block"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={`text-base transition-colors duration-300 md:ml-4 ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className={`text-base sm:text-lg font-medium whitespace-nowrap md:whitespace-normal transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {item.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 uppercase tracking-wider font-medium mt-1">{item.role}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: active quote */}
          <div className="w-full md:w-2/3 relative flex flex-col justify-center">
            <FaQuoteLeft className="absolute -top-4 -left-2 text-5xl md:text-6xl text-white/[0.03] pointer-events-none" />

            <div className="relative border-l border-white/[0.08] pl-8 md:pl-12 py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.35, ease }}
                >
                  <div className="text-teal-500/70 text-[10px] tracking-widest uppercase font-medium mb-4 md:hidden">
                    {testimonials[activeIndex].role}
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-slate-300 mb-8">
                    "{testimonials[activeIndex].feedback}"
                  </p>
                  <div className="flex items-center gap-2 text-slate-600 text-xs font-medium tracking-wide">
                    <FaCheckCircle className="text-teal-600/80" />
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
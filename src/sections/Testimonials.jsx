import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuoteLeft, FaRobot, FaUserFriends, FaLaptopCode, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

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
    id: "ml-project",
    name: "Project Peer",
    role: "Data Science Group",
    feedback: "Great analytical skills! He built the data pipeline for our group project efficiently and helped us debug issues in the PyTorch models. Always ready to learn.",
    icon: <FaLaptopCode />
  }
];

const ease = [0.22, 1, 0.36, 1];

const Testimonials = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const scrollRef = React.useRef(null);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  return (
    <section id="testimonials" className="relative w-full bg-transparent text-white overflow-hidden py-5 md:py-8 lg:py-10">

      {/* Ambient glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none md:blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)' }} />

      <div className="max-w-[1100px] mx-auto px-6 md:px-10 relative z-10">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-4 md:mb-6"
        >
          Peer Perspectives
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] leading-[0.95] font-medium tracking-tighter text-white mb-6 md:mb-10"
        >
          Peer <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--theme-stroke)' }}>Perspectives.</span>
        </motion.h2>

        {/* Horizontal Carousel Wrapper */}
        <motion.div 
          whileHover="hover"
          initial="initial"
          whileInView="inView"
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          className="relative w-full"
        >
          
          {/* Swipe Hint */}
          <motion.div 
            variants={{
              initial: { opacity: 0, x: 30, scale: 0.9, filter: "blur(4px)" },
              inView: { 
                opacity: [0, 1, 1, 0], x: [30, 0, 0, -20], scale: [0.9, 1, 1, 0.95], filter: ["blur(4px)", "blur(0px)", "blur(0px)", "blur(4px)"],
                transition: { duration: 3.5, times: [0, 0.15, 0.85, 1], ease: "easeOut" } 
              },
              hover: { 
                opacity: [0, 1, 1, 0], x: [20, 0, 0, -20], scale: [0.95, 1, 1, 0.95], filter: ["blur(2px)", "blur(0px)", "blur(0px)", "blur(4px)"],
                transition: { duration: 2.5, times: [0, 0.15, 0.8, 1], ease: "easeOut" } 
              }
            }}
            className="absolute right-0 md:-right-10 lg:-right-16 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-[54px] h-[54px] bg-black/40 backdrop-blur-xl rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-none"
          >
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            >
              <FaArrowRight size={20} className="text-white/80" />
            </motion.div>
          </motion.div>

          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex gap-6 overflow-x-auto pb-8 pt-4 px-6 -mx-6 md:px-0 md:mx-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] ${isDragging ? 'cursor-grabbing !scroll-auto !snap-none' : 'cursor-grab'}`}
          >
            {testimonials.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, ease, delay: i * 0.1 }}
                className="w-[85vw] sm:w-[380px] lg:w-[450px] snap-center flex-none group relative card-frosted p-8 sm:p-10 transition-colors duration-500 bg-black rounded-2xl border border-white/[0.08] flex flex-col"
              >
                <FaQuoteLeft className="text-4xl sm:text-5xl text-white/[0.05] mb-6" />

                <p className="text-lg sm:text-xl font-light leading-relaxed text-slate-300 mb-10 flex-1">
                  "{item.feedback}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-white/[0.05]">
                  <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-white/20 transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-base sm:text-lg">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider">{item.role}</p>
                      <FaCheckCircle className="text-emerald-500/80 text-[10px]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Testimonials;
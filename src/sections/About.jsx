import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTerminal, FaFileDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { SiReact, SiNodedotjs, SiCplusplus, SiLeetcode } from 'react-icons/si';

// Import all profile images
import pf5 from '../assets/pf5.webp';
import pf from '../assets/pf.jpeg';
import pf7 from '../assets/pf7.webp';
import pf8 from '../assets/pf8.webp';
import srvprofile from '../assets/srvprofile.jpeg';
// Profile images array
const profileImages = [
  pf,
  pf5,
  pf7,
  pf8,
  srvprofile,
]

// Generate stars once
const generateStars = () => [...Array(50)].map(() => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 1 + 'px',
  opacity: Math.random(),
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 5,
}));

const About = () => {
  const stars = generateStars();
  
  // State for profile image carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0); 
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Helper function to change image
  const changeImage = (newDirection) => {
    setDirection(newDirection);
    setCurrentImageIndex((prev) => {
      let nextIndex = prev + newDirection;
      if (nextIndex < 0) return profileImages.length - 1; 
      if (nextIndex >= profileImages.length) return 0;
      return nextIndex;
    });
  };

  // Auto-change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      changeImage(1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle click to change image
  const handleImageClick = () => {
    changeImage(1);
  };

  // Handle previous/next buttons
  const handlePrev = (e) => {
    e.stopPropagation();
    changeImage(-1);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    changeImage(1);
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        changeImage(1);
      } else {
        changeImage(-1);
      }
    }
    setIsSwiping(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  // --- SIMPLE FADE VARIANTS ---
  const fadeVariants = {
    enter: {
      opacity: 0,
      zIndex: 0,
    },
    center: {
      zIndex: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    exit: {
      zIndex: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
  };

  return (
    // Minimal vertical padding (py-4 md:py-8) for maximum vertical space saving
    <section id="about" className="w-full py-4 md:py-8 relative overflow-hidden text-white bg-transparent">
      
      {/* Background Layers */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none"></div>
      
      {/* Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{ 
              top: star.top, 
              left: star.left, 
              width: star.size, 
              height: star.size,
              opacity: star.opacity 
            }}
            animate={{ opacity: [star.opacity, 1, star.opacity] }}
            transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
          />
        ))}
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative z-10">
        
        {/* Main Panel - Ultra-slim vertical padding */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 md:p-6 lg:px-10 lg:py-6 overflow-hidden shadow-2xl"
        >
          {/* Tech Lines */}
          <div className="absolute top-0 left-10 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 right-10 w-32 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

          <div className="flex flex-col md:flex-row items-center gap-6 lg:gap-12">
            
            {/* --- LEFT: PROFILE IMAGES (Compact Size) --- */}
            <motion.div 
              variants={itemVariants}
              className="relative flex-shrink-0"
            >
                <div className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] flex items-center justify-center">
                  
                  {/* Rotating Rings */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border border-cyan-500/20 rounded-full border-dashed"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-3 border border-purple-500/20 rounded-full border-t-2 border-transparent"
                  />

                  {/* Profile Image Container */}
                  <div 
                    className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gray-800/80 shadow-[0_0_30px_rgba(6,182,212,0.1)] z-10 bg-black group cursor-pointer"
                    onClick={handleImageClick}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                  {/* ANIMATED IMAGE - SIMPLE FADE */}
                    <AnimatePresence initial={false} mode="sync">
                      <motion.img
                        key={currentImageIndex}
                        variants={fadeVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        src={profileImages[currentImageIndex]}
                        alt="Sarvjeet Raj Verma"
                      />
                    </AnimatePresence>

                    {/* {/* --- HOLOGRAPHIC SWEEP ANIMATION --- */}
                   {/* <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-full">
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent"
                      />
                    </div> */}
                    {/* ------------------------------------------- */}

                    {/* Vertical Scanner Line */}
                    <motion.div 
                     animate={{ top: ['0%', '100%', '0%'] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                     className="absolute left-0 w-full h-[1.5px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20 opacity-40 pointer-events-none"
                    />
                    {/* ------------------------------------------- */}
                    
                    {/* Glow Border */}
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          '0 0 15px rgba(6,182,212,0.2)',
                          '0 0 30px rgba(168,85,247,0.2)',
                          '0 0 15px rgba(6,182,212,0.2)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full border-2 border-transparent pointer-events-none z-20"
                    />
                    
                    {/* Static Cyan Overlay */}
                    <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay pointer-events-none z-20"></div>
                  </div>

                  {/* Navigation Arrows */}
                  <button onClick={handlePrev} className="absolute left-[-15px] md:left-0 top-1/2 -translate-y-1/2 z-30 p-1 bg-gray-900/80 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all md:opacity-0 md:group-hover:opacity-100"><FaChevronLeft size={10} /></button>
                  <button onClick={handleNext} className="absolute right-[-15px] md:right-0 top-1/2 -translate-y-1/2 z-30 p-1 bg-gray-900/80 rounded-full text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all md:opacity-0 md:group-hover:opacity-100"><FaChevronRight size={10} /></button>
               </div>
            </motion.div>

            {/* --- RIGHT: TEXT CONTENT (Horizontal Focus) --- */}
            <div className="flex-grow w-full flex flex-col justify-center space-y-4">
              
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between border-b border-gray-700/40 pb-3">
                <motion.div variants={itemVariants} className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 text-cyan-400 mb-0.5">
                    <FaTerminal className="text-[10px]" />
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase">Identity Card</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-none">
                    Sarvjeet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Raj Verma</span>
                  </h1>
                </motion.div>
                
                <motion.div variants={itemVariants} className="mt-2 lg:mt-0 text-center md:text-left lg:text-right">
                  <p className="text-gray-400 text-xs md:text-sm font-medium">Full Stack Developer & Tech Enthusiast</p>
                  <p className="text-gray-500 text-[10px] md:text-xs">Merging logic with creativity for digital excellence.</p>
                </motion.div>
              </div>

              {/* Core Systems Row - Spans horizontally */}
              <div className="flex flex-wrap items-center gap-3">
                 <motion.div variants={itemVariants} className="flex-1 min-w-[140px] flex items-center gap-3 p-2.5 rounded-2xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-all">
                    <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400"><SiReact size={18}/></div>
                    <div>
                      <p className="text-[8px] text-gray-500 font-mono uppercase leading-none mb-1">Frontend</p>
                      <h4 className="text-[11px] font-bold text-white">Next.js / React</h4>
                    </div>
                 </motion.div>
                 
                 <motion.div variants={itemVariants} className="flex-1 min-w-[140px] flex items-center gap-3 p-2.5 rounded-2xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-all">
                    <div className="p-2 bg-green-500/10 rounded-xl text-green-400"><SiNodedotjs size={18}/></div>
                    <div>
                      <p className="text-[8px] text-gray-500 font-mono uppercase leading-none mb-1">Backend</p>
                      <h4 className="text-[11px] font-bold text-white">Node / Express</h4>
                    </div>
                 </motion.div>

                 <motion.div variants={itemVariants} className="flex-1 min-w-[140px] flex items-center gap-3 p-2.5 rounded-2xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-all">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400"><SiCplusplus size={18}/></div>
                    <div>
                      <p className="text-[8px] text-gray-500 font-mono uppercase leading-none mb-1">Logic</p>
                      <h4 className="text-[11px] font-bold text-white">DSA Core</h4>
                    </div>
                 </motion.div>
              </div>

              {/* Simple Footer Row */}
              <motion.div variants={itemVariants} className="flex items-center justify-between pt-2">
                <a href="/sarvjeetrajverma_resume.pdf" download className="flex items-center gap-2 px-6 py-2 bg-cyan-600/10 border border-cyan-500/40 text-cyan-400 font-bold rounded-xl hover:bg-cyan-500 hover:text-black transition-all text-[10px] group">
                  <FaFileDownload className="group-hover:animate-bounce" /> DOWNLOAD DATA
                </a>
                
                <div className="hidden md:flex items-center gap-4 text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em]">
                   <span>System.Status: Active</span>
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                </div>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
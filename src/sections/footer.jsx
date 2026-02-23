import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const [bursts, setBursts] = useState([]);

  const handleTrigger = () => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const emojis = ['🌼', '🏵️', '✨', '🚀'];

    const newBurst = {
      id: Date.now(),
      flowers: [...Array(25)].map((_, i) => ({
        x: (Math.random() - 0.5) * (screenWidth * 0.6),
        y: (Math.random() - 1.2) * (screenHeight * 0.6),
        rotate: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5,
        duration: 2 + Math.random() * 1.5,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      }))
    };

    setBursts((prev) => [...prev, newBurst]);

    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
    }, 3500);
  };

  return (
    <footer className="w-full bg-transparent pt-8 pb-6 px-4 md:px-8 relative overflow-visible">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Top Row: Brand & Developer Data */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          
          {/* Brand Logo & Short Title */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-white tracking-tight">SRV.</span>
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-700 hidden sm:block"></span>
            <span className="text-neutral-400 text-sm tracking-wide">Creative Developer</span>
          </div>

          {/* Professional Data Points */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            
            {/* Live Availability Status with Pulsing Dot */}
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-neutral-300 font-medium tracking-wide">Available for work</span>
            </div>

            {/* Location Data */}
            <div className="hidden sm:flex items-center gap-1.5 text-neutral-400">
              <span className="text-neutral-500">Based in:</span>
              <span className="text-neutral-300">India</span>
            </div>

            {/* Portfolio Version */}
            <div className="hidden lg:flex items-center gap-1.5 text-neutral-400 border-l border-white/10 pl-6">
              <span className="text-neutral-500">System:</span>
              <span className="font-mono text-neutral-300">v2.0.{new Date().getFullYear().toString().slice(-2)}</span>
            </div>

          </div>
        </div>

        {/* Bottom Row: Copyright & Interactive Easter Egg */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-neutral-500">
          
          <p>© {new Date().getFullYear()} Sarvjeet. All rights reserved.</p>
          
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            
            <div className="relative flex items-center justify-center">
              <AnimatePresence>
                {bursts.map((burst) => (
                  <React.Fragment key={burst.id}>
                    {burst.flowers.map((flower, i) => (
                      <FlowerParticle key={i} {...flower} />
                    ))}
                  </React.Fragment>
                ))}
              </AnimatePresence>

              <motion.span 
                role="img" 
                aria-label="magic" 
                className="cursor-pointer text-base sm:text-lg select-none z-20 relative mx-0.5 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.2, rotate: 180 }}
                whileTap={{ scale: 0.8 }}
                onClick={handleTrigger}
              >
                🏵️
              </motion.span>
            </div>

            <span>and caffeine.</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

// Sub-component for individual flying particles
const FlowerParticle = ({ x, y, rotate, scale, duration, emoji }) => {
  return (
    <motion.span
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x: x,
        y: y,
        opacity: [0, 1, 1, 0], 
        scale: scale,
        rotate: rotate
      }}
      transition={{ 
        duration: duration, 
        ease: [0.22, 1, 0.36, 1], 
        times: [0, 0.1, 0.7, 1] 
      }}
      className="absolute text-xl pointer-events-none select-none z-50 will-change-transform"
    >
      {emoji}
    </motion.span>
  );
};

export default Footer;
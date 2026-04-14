import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const [bursts, setBursts] = useState([]);

  const handleTrigger = () => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const emojis = ['🌼', '🏵️', '✨', '🌸'];

    const newBurst = {
      id: Date.now(),
      flowers: [...Array(25)].map(() => ({
        x: (Math.random() - 0.5) * (screenWidth * 0.6),
        y: (Math.random() - 1.2) * (screenHeight * 0.6),
        rotate: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5,
        duration: 2 + Math.random() * 1.5,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      }))
    };

    setBursts(prev => [...prev, newBurst]);
    setTimeout(() => setBursts(prev => prev.filter(b => b.id !== newBurst.id)), 3500);
  };

  return (
    <footer className="w-full bg-transparent border-t border-white/[0.06] pt-5 pb-4 px-6 md:px-10 relative overflow-visible">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-8">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">

          {/* Brand */}
          <div>
            <span className="text-white text-lg font-medium tracking-tight">SARVJEET.</span>
            <p className="text-slate-600 text-xs mt-1 tracking-wide font-light">Creative Developer</p>
          </div>

          {/* Availability & location */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 border border-white/[0.06] px-3 py-1.5 rounded-full">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400 text-xs font-medium tracking-wide">Available for work</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-600 text-xs">
              <span>Based in:</span>
              <span className="text-slate-500">India</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.05] w-full" />

        {/* Bottom row */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Sarvjeet. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span>Built with</span>
            <div className="relative flex items-center justify-center">
              <AnimatePresence>
                {bursts.map(burst => (
                  <React.Fragment key={burst.id}>
                    {burst.flowers.map((flower, i) => (
                      <FlowerParticle key={i} {...flower} />
                    ))}
                  </React.Fragment>
                ))}
              </AnimatePresence>
              <motion.span
                role="img" aria-label="magic"
                className="cursor-pointer text-base select-none z-20 relative mx-0.5 hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.2, rotate: 180 }}
                whileTap={{ scale: 0.8 }}
                onClick={handleTrigger}
              >
                🏵️
              </motion.span>
            </div>
            <span>by srv</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FlowerParticle = ({ x, y, rotate, scale, duration, emoji }) => (
  <motion.span
    initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
    animate={{ x, y, opacity: [0, 1, 1, 0], scale, rotate }}
    transition={{ duration, ease: [0.22, 1, 0.36, 1], times: [0, 0.1, 0.7, 1] }}
    className="absolute text-xl pointer-events-none select-none z-50 will-change-transform"
  >
    {emoji}
  </motion.span>
);

export default Footer;
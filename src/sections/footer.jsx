import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const [bursts, setBursts] = useState([]);

  const handleTrigger = () => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    const newBurst = {
      id: Date.now(),
      flowers: [...Array(30)].map((_, i) => ({
        // Spread X: 60% of screen width
        x: (Math.random() - 0.5) * (screenWidth * 0.6),
        // Spread Y: Fly UP 60% of screen height
        y: (Math.random() - 1.2) * (screenHeight * 0.6),
        rotate: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5,
        // Slightly longer duration for smoother floating
        duration: 2 + Math.random() * 1.5, 
      }))
    };

    setBursts((prev) => [...prev, newBurst]);

    // Cleanup after animation (3.5s to be safe)
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
    }, 3500);
  };

  return (
    <footer className='w-full py-8 relative overflow-visible bg-transparent'>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className='max-w-[1240px] mx-auto flex flex-col items-center justify-center'>
        
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-white tracking-wider'>SRV PORTFOLIO.</h2>
            
            <div className='py-4 text-sm text-gray-500 space-y-2'>
              <div className='flex items-center justify-center gap-2 relative'>
                <span>Made with</span>
                
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
                    aria-label="flower" 
                    className="cursor-pointer text-2xl select-none z-20 relative"
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    whileTap={{ scale: 0.8 }}
                    onMouseEnter={handleTrigger}
                    onClick={handleTrigger}
                  >
                  🏵️
                  </motion.span>
                </div>

                <span>by Sarvjeet</span>
              </div>
              <p>© {new Date().getFullYear()} All rights reserved.</p>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  )
}

// Sub-component for individual flying flowers
const FlowerParticle = ({ x, y, rotate, scale, duration }) => {
  return (
    <motion.span
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x: x,
        y: y,
        // Opacity: Fade in fast -> Stay visible -> Fade out at end
        opacity: [0, 1, 1, 0], 
        scale: scale,
        rotate: rotate
      }}
      transition={{ 
        duration: duration, 
        // Custom Bezier for "Pop & Glide" effect
        ease: [0.22, 1, 0.36, 1], 
        // Control exactly when opacity changes occur (0%, 10%, 70%, 100%)
        times: [0, 0.1, 0.7, 1] 
      }}
      // 'will-change' improves performance significantly
      className="absolute text-xl pointer-events-none select-none z-50 will-change-transform"
    >
      🌼 🏵️ 🌸
    </motion.span>
  );
};

export default Footer;
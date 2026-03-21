import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

export default function IntroAnimation({ onfinish }) {
  const [visible, setVisible] = useState(true);
  const greetings = ["Hello", "नमस्ते", "Welcome"];

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onfinish}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
        >
          {greetings.map((word, i) => (
            <motion.h1
              key={word}
              className="absolute text-6xl md:text-9xl font-black text-transparent"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.5)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.8, 1, 1.1, 1.2],
                WebkitTextStroke: ["1px rgba(255,255,255,0.5)", "1px rgba(255,255,255,1)", "1px rgba(255,255,255,1)", "1px rgba(255,255,255,0)"]
              }}
              transition={{
                duration: 1,
                delay: i * 0.9,
                times: [0, 0.2, 0.8, 1],
                ease: "easeOut"
              }}
            >
              {word}
            </motion.h1>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
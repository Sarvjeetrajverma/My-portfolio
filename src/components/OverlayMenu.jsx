import { AnimatePresence, motion } from "framer-motion";
import { FiX } from "react-icons/fi";

export default function OverlayMenu({ isopen, onclose }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 1024;
  const origin = isMobile ? "90% 10%" : "50% 10%";
  return (
    <AnimatePresence>
      {isopen && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center z-50 backdrop-blur-3xl bg-black/90"
          initial={{ clipPath: `circle(0% at ${origin})` }}
          animate={{ clipPath: `circle(150% at ${origin})` }}
          exit={{ clipPath: `circle(0% at ${origin})`, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={onclose}
            className="absolute top-6 right-8 w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white/80 text-xl hover:text-white hover:bg-white/10 hover:scale-105 transition-all z-10 focus:outline-none backdrop-blur-md"
            aria-label="Close Menu"
          >
            <FiX />
          </button>
          <ul className="space-y-6 sm:space-y-8 text-center mt-8">
            {['home', 'about', 'skills', 'projects', 'experience', 'testimonials', 'travel', 'contact'].map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.05, duration: 0.4, ease: "easeOut" }}
              >
                <a
                  href={`#${item}`}
                  onClick={onclose}
                  className="text-4xl sm:text-5xl lg:text-6xl text-white/50 font-medium tracking-tight hover:text-white transition-colors duration-400 capitalize block p-2"
                >
                  {item}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

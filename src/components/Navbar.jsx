import { useState, useRef, useEffect } from "react";
import OverlayMenu from "./OverlayMenu";
import logo from "../assets/logo.png"; // Adjust the path as needed
import { FiMenu } from "react-icons/fi";
import { FaTerminal } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ forceHidden }) {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHello, setShowHello] = useState(false);

  const lastscrollY = useRef(0);
  const timerId = useRef(null);

  // Smooth Hide/Show on Scroll Logic (Matches Original)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastscrollY.current && currentScrollY > 50) {
        setVisible(false);
      } else {
        setVisible(true);

        if (timerId.current) clearTimeout(timerId.current);
        timerId.current = setTimeout(() => {
          if (window.scrollY > 50) setVisible(false);
        }, 3000);
      }
      lastscrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, []);

  // --- HANDLER FOR LOGO CLICK ---
  const handleLogoClick = () => {
    setShowHello(true);
    
    // Wait 1.5 seconds for sci-fi animation, then redirect
    setTimeout(() => {
      window.location.href = "/";
    }, 1500);
  };

  const navLinks = ['about', 'skills', 'projects', 'experience', 'testimonials', 'travel'];

  return (
    <>
      {/* Full-Width Top Navbar (100% Fully Transparent) */}
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-50 transition-transform duration-500 ease-in-out ${
          visible && !forceHidden ? "translate-y-0" : "-translate-y-full"
        } bg-transparent`}
      >
        {/* LOGO CONTAINER */}
        <div className="flex items-center gap-3">
          <motion.img
            src={logo}
            alt="logo"
            className="w-12 h-12 md:w-14 md:h-14 cursor-pointer object-contain hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all duration-300"
            onClick={handleLogoClick}
            whileTap={{ scale: 0.9 }}
          />
          
          <div 
            className="hidden sm:flex flex-col cursor-pointer group"
            onClick={handleLogoClick}
          >
            <span className="w-1 h-4 text-xl font-black text-gray-100 tracking-widest group-hover:text-cyan-400 transition-colors uppercase leading-tight drop-shadow-md">
              SARVJEET
            </span>
            <span className="text-[9px] font-mono text-cyan-500 tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity leading-tight drop-shadow-sm">
              // SYS_ROOT
            </span>
          </div>
        </div>

        {/* DESKTOP LINKS (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((item) => (
            <a
              key={item}
              href={`/#${item}`}
              className="relative px-2 py-1 text-xs font-mono font-bold text-gray-300 uppercase tracking-widest hover:text-cyan-400 transition-colors duration-300 group drop-shadow-md"
            >
              {item}
              {/* Sci-Fi Hover Target Brackets */}
              <span className="absolute inset-0 border border-transparent group-hover:border-cyan-500/50 rounded transition-all duration-300 scale-90 group-hover:scale-100"></span>
            </a>
          ))}
          
          {/* Action Button */}
          <a
            href="#contact"
            className="flex items-center gap-2 bg-cyan-500/10 backdrop-blur-sm border border-cyan-500/50 text-cyan-400 px-5 py-2 rounded font-mono text-xs font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-300"
          >
            <FaTerminal /> Exec_Contact
          </a>
        </div>

        {/* MOBILE HAMBURGER MENU */}
        <div className="block lg:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-gray-200 hover:text-cyan-400 text-3xl focus:outline-none transition-colors duration-300 drop-shadow-md"
            aria-label="open Menu"
          >
            <FiMenu />
          </button>
        </div>
      </nav>

      <OverlayMenu isopen={menuOpen} onclose={() => setMenuOpen(false)} />

      {/* --- ADVANCED SCI-FI GREETING POPUP --- */}
      <AnimatePresence>
        {showHello && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]/90 overflow-hidden"
          >
            {/* Background Tech Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#06b6d4 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center relative z-10 flex flex-col items-center"
            >
              {/* Terminal Prefix */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-cyan-500 font-mono text-sm tracking-[0.3em] mb-6 flex items-center gap-2"
              >
                <FaTerminal /> // INITIATING_ROOT_REDIRECT.SH
              </motion.div>

              {/* Main Greeting */}
              <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tighter drop-shadow-2xl">
                Hii!
              </h1>
              
              {/* The Big Animated Emoji */}
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  rotate: [0, 8, -8, 0],
                  filter: ["drop-shadow(0px 0px 0px rgba(6,182,212,0))", "drop-shadow(0px 0px 40px rgba(6,182,212,0.6))", "drop-shadow(0px 0px 0px rgba(6,182,212,0))"]
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="text-[120px] md:text-[180px] mt-4"
              >
                🙏
              </motion.div>

              {/* Loading Bar Simulator */}
              <div className="w-64 h-1 bg-gray-800 rounded-full mt-12 overflow-hidden relative">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.4, ease: "linear" }}
                  className="absolute top-0 left-0 h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
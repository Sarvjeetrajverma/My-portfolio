import { useState, useRef, useEffect } from "react";
import OverlayMenu from "./OverlayMenu";
import logo from "../assets/logo.png"; // Adjust the path as needed
import { FiMenu } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ forceHidden }) {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHello, setShowHello] = useState(false); // State for the popup

  const lastscrollY = useRef(0);
  const timerId = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastscrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);

        if (timerId.current) clearTimeout(timerId.current);
        timerId.current = setTimeout(() => {
          setVisible(false);
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
    setShowHello(true); // Show the popup
    
    // Wait 1.5 seconds for animation, then redirect
    setTimeout(() => {
      window.location.href = "/"; // Redirects to Home/Root
    }, 1500);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-50 transition-transform duration-300 ${
          visible && !forceHidden ? "translate-y-0" : "-translate-y-full"
        } bg-transparent`}
      >
        {/* LOGO CONTAINER */}
        <div className="flex items-center space-x-2">
          {/* Added onClick to the logo image */}
          <motion.img
            src={logo}
            alt="logo"
            className="w-16 h-16 cursor-pointer hover:scale-110 transition-transform"
            onClick={handleLogoClick}
            whileTap={{ scale: 0.9 }}
          />
          
          <div 
            className="text-2xl font-bold text-white hidden sm:block cursor-pointer"
            onClick={handleLogoClick}
          >
            SARVJEET
          </div>

          <div className="block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-white text-3xl focus:outline-none"
              aria-label="open Menu"
            >
              <FiMenu />
            </button>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {['about', 'skills', 'projects', 'experience', 'testimonials', 'travel'].map((item) => (
            <a
              key={item}
              href={`/#${item}`}
              className="text-white hover:text-blue-400 transition-colors duration-300 capitalize text-sm font-medium"
            >
              {item}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-5 py-2 rounded-full font-medium shadow-lg hover:opacity-90 transition-opacity duration-300"
          >
            Reach out
          </a>
        </div>
      </nav>

      <OverlayMenu isopen={menuOpen} onclose={() => setMenuOpen(false)} />

      {/* --- BIG EMOJI POPUP --- */}
      <AnimatePresence>
        {showHello && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="text-center"
            >
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
                Hii!
              </h1>
              {/* The Big Animated Emoji */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0] 
                }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="text-[100px] md:text-[150px]"
              >
                🙏
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
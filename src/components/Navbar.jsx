import { useState, useRef, useEffect } from "react";
import OverlayMenu from "./OverlayMenu";
import logo from "../assets/logo.png";
import { FiMenu, FiMoon, FiSun, FiBook, FiCode } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ forceHidden }) {
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  const lastscrollY = useRef(0);
  const timerId = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    const themes = ['dark', 'light', 'read', 'green'];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <FiSun className="text-lg" />;
    if (theme === 'read') return <FiBook className="text-lg" />;
    if (theme === 'green') return <FiCode className="text-lg" />;
    return <FiMoon className="text-lg" />;
  };

  // Smooth Hide/Show on Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      // Hide navbar when scrolling down past 50px
      if (currentScrollY > lastscrollY.current && currentScrollY > 50) {
        setVisible(false);
      } else {
        setVisible(true);

        if (timerId.current) clearTimeout(timerId.current);
        timerId.current = setTimeout(() => {
          if (window.scrollY > 50) setVisible(false);
        }, 4000); // 4 seconds before auto-hiding
      }
      lastscrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, []);

  // Sleek navigation to home
  const handleLogoClick = () => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = "/";
    }
  };

  const navLinks = ['about', 'skills', 'projects', 'experience', 'testimonials', 'travel'];

  return (
    <>
      <nav
        className={`fixed top-0 sm:top-5 left-1/2 w-full sm:w-[98%] max-w-[1400px] -translate-x-1/2 flex items-center justify-between px-6 sm:px-12 py-1 sm:py-2 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible && !forceHidden ? "translate-y-0 opacity-100" : "-translate-y-[150%] opacity-0"
          } ${isScrolled ? 'bg-black/70 backdrop-blur-2xl border border-white/5 sm:rounded-full shadow-2xl shadow-black/50' : 'bg-transparent border-transparent sm:rounded-none'}`}
      >
        {/* LOGO CONTAINER */}
        <div className="flex items-center gap-3">
          <motion.img
            src={logo}
            alt="logo"
            className="w-9 h-9 md:w-11 md:h-11 cursor-pointer object-contain hover:opacity-80 transition-opacity duration-300"
            onClick={handleLogoClick}
            whileTap={{ scale: 0.95 }}
          />

          <div
            className="hidden lg:flex flex-col cursor-pointer"
            onClick={handleLogoClick}
          >
            <span className="text-xl font-semibold tracking-tight text-white/90 hover:text-white transition-colors duration-300">
              Sarvjeet
            </span>
          </div>
        </div>

        {/* DESKTOP LINKS (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
          {navLinks.map((item) => (
            <a
              key={item}
              href={`/#${item}`}
              className="px-6 py-1.5 text-[15px] font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 capitalize"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button
            onClick={cycleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
            aria-label="Toggle Theme"
          >
            {getThemeIcon()}
          </button>
          {/* Action Button */}
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-2 text-[15px] font-semibold text-black bg-white rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Let's Talk
          </a>
        </div>

        {/* MOBILE HAMBURGER MENU */}
        <div className="block lg:hidden flex gap-2">
          <button
            onClick={cycleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-300"
            aria-label="Toggle Theme"
          >
            {getThemeIcon()}
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/10 focus:outline-none transition-all duration-300"
            aria-label="Open Menu"
          >
            <FiMenu className="text-xl" />
          </button>
        </div>
      </nav>

      <OverlayMenu isopen={menuOpen} onclose={() => setMenuOpen(false)} />
    </>
  );
}
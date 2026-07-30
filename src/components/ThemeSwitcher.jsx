import React, { useState, useRef, useEffect } from 'react';
import { FiMoon, FiSun, FiBook, FiCode } from 'react-icons/fi';

const themes = [
  { id: 'dark', name: 'Dark Mode', icon: FiMoon, color: 'bg-zinc-900', ring: 'ring-zinc-500' },
  { id: 'light', name: 'Light Mode', icon: FiSun, color: 'bg-zinc-200', ring: 'ring-zinc-400' },
  { id: 'read', name: 'Reading', icon: FiBook, color: 'bg-[#f4ecd8]', ring: 'ring-[#d4c8b0]' },
  { id: 'green', name: 'Terminal', icon: FiCode, color: 'bg-[#0a1f14]', ring: 'ring-emerald-500' }
];

export default function ThemeSwitcher({ currentTheme, onThemeChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const activeTheme = themes.find(t => t.id === currentTheme) || themes[0];
  const ActiveIcon = activeTheme.icon;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
      className={`relative flex items-center bg-white/5 border border-white/10 backdrop-blur-md rounded-full h-9 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden cursor-pointer ${isOpen ? 'w-[136px]' : 'w-9'}`}
    >
      {/* Current Theme Icon */}
      <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-300 pointer-events-none">
        <ActiveIcon className="text-lg" />
      </div>

      {/* Swatches Container */}
      <div className={`flex items-center gap-2.5 pr-3 pl-1 transition-opacity duration-300 ${isOpen ? 'opacity-100 delay-100' : 'opacity-0'}`}>
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={(e) => {
              e.stopPropagation();
              onThemeChange(theme.id);
              setIsOpen(false);
            }}
            title={theme.name}
            aria-label={`Switch to ${theme.name} theme`}
            className={`flex-shrink-0 w-3.5 h-3.5 rounded-full ${theme.color} border border-white/20 transition-all duration-200 ${
              currentTheme === theme.id 
                ? `ring-1 ring-offset-2 ring-offset-[#111] ${theme.ring} scale-110` 
                : 'hover:scale-125 opacity-60 hover:opacity-100'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

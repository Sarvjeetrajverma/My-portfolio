// src/components/CommandPalette.jsx
// Spotlight Command Palette (Ctrl+K / Cmd+K)

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiCode, FiGrid, FiSmile, FiCompass, FiMapPin, FiSend, FiMoon, FiSun, FiBook, FiFileText, FiGithub, FiLinkedin, FiCompass as FiCompassIcon } from 'react-icons/fi';

const COMMANDS = [
  // Navigation Sections
  { id: 'sec-about', title: 'Go to About Section', category: 'Navigation', shortcut: 'G A', icon: <FiSmile />, action: 'scroll', target: 'about' },
  { id: 'sec-skills', title: 'Go to Skills Section', category: 'Navigation', shortcut: 'G S', icon: <FiGrid />, action: 'scroll', target: 'skills' },
  { id: 'sec-projects', title: 'Go to Projects Section', category: 'Navigation', shortcut: 'G P', icon: <FiCode />, action: 'scroll', target: 'projects' },
  { id: 'sec-experience', title: 'Go to Experience Section', category: 'Navigation', shortcut: 'G E', icon: <FiBook />, action: 'scroll', target: 'experience' },
  { id: 'sec-certs', title: 'Go to Certifications Section', category: 'Navigation', shortcut: 'G C', icon: <FiCompass />, action: 'scroll', target: 'certifications' },
  { id: 'sec-travel', title: 'Go to Travel Gallery', category: 'Navigation', shortcut: 'G T', icon: <FiMapPin />, action: 'scroll', target: 'travel' },
  { id: 'sec-contact', title: 'Go to Contact Section', category: 'Navigation', shortcut: 'G M', icon: <FiSend />, action: 'scroll', target: 'contact' },

  // Themes
  { id: 'theme-dark', title: 'Switch to Dark Mode', category: 'Theme', shortcut: 'T D', icon: <FiMoon />, action: 'theme', target: 'dark' },
  { id: 'theme-light', title: 'Switch to Frosted Light Mode', category: 'Theme', shortcut: 'T L', icon: <FiSun />, action: 'theme', target: 'light' },
  { id: 'theme-read', title: 'Switch to Warm Read Mode', category: 'Theme', shortcut: 'T R', icon: <FiBook className="text-amber-500" />, action: 'theme', target: 'read' },
  { id: 'theme-green', title: 'Switch to Deep Green Mode', category: 'Theme', shortcut: 'T G', icon: <FiCode className="text-emerald-500" />, action: 'theme', target: 'green' },

  // Quick Links
  { id: 'link-resume', title: 'Open Interactive Resume', category: 'Actions', shortcut: 'R', icon: <FiFileText />, action: 'route', target: '/resume' },
  { id: 'link-github', title: 'View GitHub Profile', category: 'Actions', shortcut: 'G H', icon: <FiGithub />, action: 'link', target: 'https://www.github.com/sarvjeetrajverma' },
  { id: 'link-linkedin', title: 'Connect on LinkedIn', category: 'Actions', shortcut: 'L I', icon: <FiLinkedin />, action: 'link', target: 'https://www.linkedin.com/in/sarvjeetrajverma/' }
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Toggle state listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleCustomToggle = () => setOpen((o) => !o);
    window.addEventListener('toggle-command-palette', handleCustomToggle);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-command-palette', handleCustomToggle);
    };
  }, []);

  // Reset index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
  }, [open]);

  // Filter commands
  const filtered = COMMANDS.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard navigation inside menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((idx) => (idx + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((idx) => (idx - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          executeCommand(filtered[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, filtered]);

  // Autoscroll items into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Action Executor
  const executeCommand = (cmd) => {
    setOpen(false);

    if (cmd.action === 'scroll') {
      const section = document.getElementById(cmd.target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If not on main page, navigate back first
        navigate(`/#${cmd.target}`);
      }
    } else if (cmd.action === 'theme') {
      document.documentElement.setAttribute('data-theme', cmd.target);
      localStorage.setItem('theme', cmd.target);
    } else if (cmd.action === 'route') {
      navigate(cmd.target);
    } else if (cmd.action === 'link') {
      window.open(cmd.target, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Spotlight Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c0e] shadow-2xl"
          >
            {/* Search Input Area */}
            <div className="flex items-center px-4 border-b border-white/[0.05] h-14">
              <FiSearch className="text-slate-600 mr-3 text-lg" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-white text-base focus:outline-none placeholder:text-slate-700 font-sans"
              />
              <span className="text-[10px] font-mono text-slate-700 bg-white/[0.03] px-2 py-0.5 border border-white/[0.05] rounded">ESC</span>
            </div>

            {/* Commands List */}
            <div
              ref={listRef}
              className="max-h-[320px] overflow-y-auto p-2 space-y-0.5 scrollbar-hide font-sans"
            >
              {filtered.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-left transition-all ${
                      isSelected
                        ? 'bg-white/[0.05] text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-base ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`}>
                        {cmd.icon}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium tracking-tight">{cmd.title}</span>
                        <span className="text-[9px] font-mono text-slate-700 tracking-wider uppercase mt-0.5">{cmd.category}</span>
                      </div>
                    </div>
                    {cmd.shortcut && (
                      <span className="text-[9px] font-mono text-slate-700 tracking-widest">{cmd.shortcut}</span>
                    )}
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div className="text-center py-10 text-xs font-mono text-slate-700">
                  No commands match your query.
                </div>
              )}
            </div>

            {/* Footer Help hints */}
            <div className="flex justify-between items-center px-4 py-3 border-t border-white/[0.04] bg-[#09090b] text-[10px] font-mono text-slate-700">
              <div className="flex gap-4">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
              </div>
              <span>⌘K / ⌃K to toggle</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

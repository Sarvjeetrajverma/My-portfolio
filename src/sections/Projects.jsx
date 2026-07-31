import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode, FaBrain, FaTerminal } from 'react-icons/fa';
import project1Image from '../assets/project1.png';
import project2Image from '../assets/project2.png';
import project3Image from '../assets/project3.png';
import project4Image from '../assets/project4.png';

import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const ease = [0.22, 1, 0.36, 1];

const fallbackImages = {
  dark: project1Image,
  light: project2Image,
  read: project3Image,
  green: project4Image
};

const Projects = () => {
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');
  const [projects, setProjects] = useState({ active: [], upcoming: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial check
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    if (theme !== currentTheme) setTheme(currentTheme);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    
    // Fetch projects
    const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
      let activeList = [];
      let upcomingList = [];
      snapshot.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        if (data.category === 'upcoming') {
          upcomingList.push(data);
        } else {
          activeList.push(data);
        }
      });
      activeList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      upcomingList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      
      setProjects({ active: activeList, upcoming: upcomingList });
      setLoading(false);
    });

    return () => {
      observer.disconnect();
      unsub();
    };
  }, [theme]);

  return (
    <section id="projects" className="relative w-full bg-transparent text-white overflow-hidden py-5 md:py-8 lg:py-10">

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-[1100px] mx-auto px-6 md:px-10 relative z-10">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-10 md:mb-14"
        >
          Research & Implementations
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] leading-[0.95] font-medium tracking-tighter text-white mb-12 md:mb-18"
        >
          Model <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--theme-stroke)' }}>Index.</span>
        </motion.h2>

        {/* Carousel */}
        <div className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

          {/* Active project cards */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[420px] w-full bg-black rounded-2xl">
              <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          ) : projects.active.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex-none w-[80vw] sm:w-[320px] md:w-[360px] lg:w-[400px] snap-center group relative card-frosted overflow-hidden transition-colors duration-500 bg-black rounded-2xl border border-white/[0.08]"
            >
              {/* Image */}
              <div className="relative h-32 sm:h-40 overflow-hidden">
                <motion.img
                  key={theme}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.8, ease }}
                  src={project.images?.[theme] || fallbackImages[theme]}
                  alt={project.title}
                  loading="lazy" decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                {/* Status badge */}
                {project.status && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono text-emerald-400 border border-emerald-500/20 rounded-full bg-black/60 backdrop-blur">
                    <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                    {project.status}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="text-white text-xl sm:text-2xl font-medium tracking-tight mb-2">{project.title}</h3>
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-4 font-light line-clamp-3">{project.description}</p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {(project.tech || []).slice(0, 4).map((tech, j) => (
                    <span key={j} className="text-[10px] sm:text-xs font-mono uppercase text-slate-400 border border-white/[0.08] px-2 py-1 rounded-full tracking-wider">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-5 pt-4 border-t border-white/[0.05]">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm sm:text-base text-slate-400 hover:text-white transition-colors tracking-wide font-medium">
                      <FaGithub /> Codebase
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm sm:text-base text-slate-400 hover:text-white transition-colors tracking-wide font-medium">
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* UPCOMING PROJECTS SECTION */}
        {projects.upcoming.length > 0 && (
          <div className="mt-16 md:mt-24">
            {/* Section label */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="flex items-center gap-4 mb-10"
            >
              <p className="text-[10px] tracking-[0.35em] text-emerald-500/70 uppercase font-medium">In Training / Upcoming</p>
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent"></div>
            </motion.div>

            <div className="flex overflow-x-auto gap-6 pb-8 pt-4 snap-x snap-mandatory scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {projects.upcoming.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.85, ease, delay: idx * 0.1 }}
                  className="flex-none w-[80vw] sm:w-[320px] md:w-[360px] lg:w-[400px] snap-center group relative card-frosted flex flex-col p-5 md:p-6 min-h-[300px] transition-colors duration-500 overflow-hidden bg-black/60 border border-emerald-500/10 hover:border-emerald-500/30 rounded-2xl"
                >
                  {/* Scanning line */}
                  <motion.div
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none z-10"
                  />

                  {/* Terminal Window Mockup */}
                  <div className="w-full rounded-lg border border-white/[0.08] bg-black/80 overflow-hidden mb-5 shadow-2xl z-20">
                    {/* Terminal Header */}
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.05] bg-white/[0.02]">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                      </div>
                      <span className="ml-2 text-[9px] font-mono text-emerald-500 uppercase tracking-widest">{project.title.toLowerCase().replace(/\s+/g, '_')}.py</span>
                    </div>
                    {/* Terminal Body */}
                    <div className="p-3 font-mono text-[9px] sm:text-[10px] text-slate-400 text-left space-y-1.5 h-[100px] overflow-hidden relative">
                      <p><span className="text-emerald-400">root@ai-cluster:~#</span> initialize_project --target "{project.title}"</p>
                      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }}>Loading core dependencies... [OK]</motion.p>
                      
                      {project.tech && project.tech.length > 0 && (
                        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                          Installing stack: <span className="text-amber-400">{project.tech.join(', ')}</span>...
                        </motion.p>
                      )}
                      
                      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 2.0 }} className="text-slate-500">
                        {project.description.slice(0, 60)}...
                      </motion.p>
                      
                      <motion.p 
                        animate={{ opacity: [0, 1, 0] }} 
                        transition={{ duration: 1.5, repeat: Infinity }} 
                        className="mt-2 text-emerald-500"
                      >
                        _
                      </motion.p>
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
                    </div>
                  </div>

                  <div className="mt-auto z-20">
                    <h3 className="text-slate-200 text-lg font-medium tracking-tight mb-2">
                      [ {project.title} ]
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-light mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500/70 rounded-full animate-pulse" />
                        <span className="text-[11px] font-mono text-emerald-500 tracking-widest">{project.status || 'IN DEVELOPMENT...'}</span>
                      </div>
                      
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-white transition-colors">
                          <FaGithub /> View Source
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}


      </div>
    </section>
  );
};

export default Projects;
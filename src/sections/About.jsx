import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronLeft, FaChevronRight, FaCode, FaBolt, FaMagic,
  FaRocket, FaRobot, FaCamera, FaGraduationCap, FaTrophy, FaRoute,
  FaTerminal, FaNetworkWired, FaServer, FaCodeBranch, FaBrain,
  FaGithub, FaClock, FaCube, FaLaptopCode, FaDatabase, FaAws, FaJava
} from 'react-icons/fa';
import {
  SiReact, SiNodedotjs, SiCplusplus, SiNextdotjs, SiTailwindcss, SiMongodb,
  SiTypescript, SiFramer, SiRedux, SiExpress, SiPython, SiGraphql,
  SiPostgresql, SiMysql, SiRedis, SiSupabase, SiGithubactions,
  SiDocker, SiLinux, SiVercel
} from 'react-icons/si';

import pf5 from '../assets/pf5.webp';
import pf from '../assets/pf.jpeg';
import pf7 from '../assets/pf7.webp';
import pf8 from '../assets/pf8.webp';
import srvprofile from '../assets/srvprofile.jpeg';

const profileImages = [pf, pf5, pf7, pf8, srvprofile];

const systemModules = [
  {
    id: 'frontend', title: 'Frontend', color: 'cyan', icon: <FaNetworkWired />,
    content: [
      { name: "React.js", level: 60, logo: <SiReact />, meta: "UI Architecture", brand: "#61DAFB" },
      { name: "Next.js", level: 10, logo: <SiNextdotjs />, meta: "Full-Stack React", brand: "#FFFFFF" },
      { name: "TypeScript", level: 10, logo: <SiTypescript />, meta: "Static Typing", brand: "#3178C6" },
      { name: "Tailwind CSS", level: 30, logo: <SiTailwindcss />, meta: "Utility Styling", brand: "#06B6D4" },
      { name: "Framer Motion", level: 20, logo: <SiFramer />, meta: "Animations", brand: "#0055FF" },
      { name: "Redux", level: 10, logo: <SiRedux />, meta: "State Control", brand: "#764ABC" },
    ]
  },
  {
    id: 'backend', title: 'Backend', color: 'green', icon: <FaServer />,
    content: [
      { name: "Node.js", level: 10, logo: <SiNodedotjs />, meta: "V8 Runtime", brand: "#339933" },
      { name: "Express.js", level: 10, logo: <SiExpress />, meta: "Web Framework", brand: "#FFFFFF" },
      { name: "Python", level: 80, logo: <SiPython />, meta: "Data Processing", brand: "#3776AB" },
      { name: "GraphQL", level: 10, logo: <SiGraphql />, meta: "Query Language", brand: "#E10098" },
      { name: "REST APIs", level: 10, logo: <FaServer />, meta: "Architecture", brand: "#00FFCC" },
      { name: "Java", level: 10, logo: <FaJava />, meta: "OOP Engine", brand: "#ED8B00" },
    ]
  },
  {
    id: 'database', title: 'Database', color: 'yellow', icon: <FaDatabase />,
    content: [
      { name: "PostgreSQL", level: 35, logo: <SiPostgresql />, meta: "Relational DB", brand: "#4169E1" },
      { name: "MySQL", level: 90, logo: <SiMysql />, meta: "Structured DB", brand: "#4479A1" },
      { name: "MongoDB", level: 50, logo: <SiMongodb />, meta: "NoSQL DB", brand: "#47A248" },
      { name: "Redis", level: 10, logo: <SiRedis />, meta: "In-Memory Cache", brand: "#DC382D" },
      { name: "Supabase", level: 10, logo: <SiSupabase />, meta: "BaaS Platform", brand: "#3ECF8E" },
      { name: "SQL Server", level: 20, logo: <FaDatabase />, meta: "Enterprise DB", brand: "#CC292B" },
    ]
  },
  {
    id: 'devops', title: 'DevOps', color: 'purple', icon: <FaCodeBranch />,
    content: [
      { name: "Git & GitHub", level: 90, logo: <FaGithub />, meta: "Version Control", brand: "#FFFFFF" },
      { name: "Docker", level: 10, logo: <SiDocker />, meta: "Containers", brand: "#2496ED" },
      { name: "Linux CLI", level: 10, logo: <SiLinux />, meta: "Sys Administrations", brand: "#FCC624" },
      { name: "AWS", level: 10, logo: <FaAws />, meta: "Cloud Services", brand: "#FF9900" },
      { name: "CI/CD", level: 1, logo: <SiGithubactions />, meta: "Automated Pipelines", brand: "#2088FF" },
      { name: "Vercel", level: 90, logo: <SiVercel />, meta: "Edge Network", brand: "#FFFFFF" },
    ]
  },
  {
    id: 'dsa', title: 'Core DSA', color: 'blue', icon: <FaBrain />,
    content: [
      { name: "C++", level: 60, logo: <SiCplusplus />, meta: "System Programming", brand: "#00599C" },
      { name: "Data Strucs", level: 80, logo: <FaBrain />, meta: "Memory Layouts", brand: "#FF00FF" },
      { name: "Graph Algos", level: 70, logo: <FaNetworkWired />, meta: "Pathfinding", brand: "#00FFFF" },
      { name: "Complexity", level: 75, logo: <FaClock />, meta: "Operations Limit", brand: "#FFD700" },
      { name: "OOP", level: 80, logo: <FaCube />, meta: "Software Design", brand: "#FF4500" },
      { name: "Logic", level: 90, logo: <FaLaptopCode />, meta: "Problem Solving", brand: "#00FF00" },
    ]
  }
];

// Apple easing
const ease = [0.22, 1, 0.36, 1];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.85, ease, delay }
});

const About = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activeTab, setActiveTab] = useState(systemModules[0].id);
  const activeData = systemModules.find(m => m.id === activeTab);

  const changeImage = (dir) => {
    setDirection(dir);
    setCurrentImageIndex(prev => {
      let n = prev + dir;
      if (n < 0) return profileImages.length - 1;
      if (n >= profileImages.length) return 0;
      return n;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => changeImage(1), 5000);
    return () => clearInterval(interval);
  }, []);

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? '60%' : '-60%', opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.6, ease } },
    exit: (d) => ({ x: d < 0 ? '60%' : '-60%', opacity: 0, transition: { duration: 0.5, ease } }),
  };

  return (
    <section id="about" className="relative w-full bg-transparent text-white overflow-hidden py-5 md:py-8 lg:py-10">

      {/* Single ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10">

        {/* Section label */}
        <motion.p {...fadeUp()} className="text-xs sm:text-sm tracking-[0.35em] text-slate-600 uppercase font-medium mb-8 md:mb-10">
          About
        </motion.p>

        {/* Massive headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="text-[2.8rem] leading-[1.02] sm:text-[5rem] md:text-[7rem] lg:text-[9rem] lg:leading-[0.9] font-medium tracking-tighter text-white mb-6 md:mb-8"
        >
          Developer <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Identity.</span>
        </motion.h2>

        {/* ── Profile + Bio row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 md:gap-12 items-start mb-10 md:mb-14">

          {/* Profile image */}
          <motion.div {...fadeUp(0.1)}>
            <div className="relative w-full max-w-[300px] mx-auto lg:mx-0 aspect-square rounded-2xl overflow-hidden" style={{ background: 'rgba(13,5,20,0.7)' }}>
              <AnimatePresence custom={direction} initial={false}>
                <motion.img
                  key={currentImageIndex}
                  src={profileImages[currentImageIndex]}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter" animate="center" exit="exit"
                  alt="Sarvjeet Profile"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </AnimatePresence>
              {/* Nav arrows */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-3 pb-3 opacity-0 hover:opacity-100 transition-opacity">
                <button onClick={() => changeImage(-1)} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white/70 hover:text-white transition-colors"><FaChevronLeft size={12} /></button>
                <div className="flex gap-1.5">
                  {profileImages.map((_, i) => (
                    <button key={i} onClick={() => { setDirection(i > currentImageIndex ? 1 : -1); setCurrentImageIndex(i); }}
                      className="w-1 h-1 rounded-full transition-all duration-300"
                      style={{ background: i === currentImageIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)', transform: i === currentImageIndex ? 'scale(1.6)' : 'scale(1)' }}
                    />
                  ))}
                </div>
                <button onClick={() => changeImage(1)} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white/70 hover:text-white transition-colors"><FaChevronRight size={12} /></button>
              </div>
            </div>
            <div className="mt-5 text-center lg:text-left">
              <p className="text-white text-lg font-medium tracking-tight">Sarvjeet</p>
              <p className="text-slate-400 text-base mt-1">Full-Stack Engineer & AI Explorer</p>
            </div>
          </motion.div>

          {/* Bio text */}
          <motion.div {...fadeUp(0.15)} className="flex flex-col justify-center">
            <div className="space-y-6 text-slate-400 text-lg sm:text-xl md:text-2xl leading-relaxed font-light mb-10">
              <p>
                I bridge the gap between heavy-lifting backend logic and pixel-perfect interfaces. As a 3rd-year CS student at <span className="text-white font-normal">Katihar Engineering College</span>, my foundation is built on the MERN stack, Tailwind, and Framer Motion.
              </p>
              <p>
                I am deeply invested in the future of computation — <span className="text-slate-300">Generative & Agentic AI systems</span>.
              </p>
              <p className="text-slate-500 text-base sm:text-lg">
                Beyond the IDE, I thrive in hands-on environments—from leading technical execution for <span className="text-slate-300">TechFusion</span> and designing combat models for Robo War events, to analyzing exposure histograms while photographing the landscapes of Sikkim.
              </p>
            </div>

            {/* Tags — minimal pill style */}
            <div className="flex flex-wrap gap-2.5">
              {[
                { icon: <FaCode size={13} />, label: 'MERN Stack' },
                { icon: <FaBolt size={13} />, label: 'Agentic AI' },
                { icon: <FaRobot size={13} />, label: 'Combat Robotics' },
                { icon: <FaCamera size={13} />, label: 'Photography' },
              ].map(tag => (
                <span key={tag.label} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-400 border border-white/[0.08] rounded-full tracking-wide hover:text-white hover:border-white/20 transition-colors duration-300 cursor-default">
                  {tag.icon} {tag.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Tech Skills ── */}
        <div id="skills" className="mb-10 md:mb-14">
          <motion.p {...fadeUp()} className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-8">
            Tech Skills
          </motion.p>

          {/* Tab pills */}
          <motion.div {...fadeUp(0.05)} className="flex flex-wrap gap-2 mb-8">
            {systemModules.map(m => (
              <button
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                className={`px-4 py-2 text-xs font-medium rounded-full border tracking-wide transition-all duration-300 ${activeTab === m.id
                    ? 'border-white/30 text-white bg-white/[0.06]'
                    : 'border-white/[0.06] text-slate-500 hover:text-slate-300 hover:border-white/15'
                  }`}
              >
                {m.title}
              </button>
            ))}
          </motion.div>

          {/* Skills grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
            >
              {activeData.content.map((skill, i) => (
                <div key={skill.name} className="flex flex-col gap-2.5 p-4 border border-white/[0.06] rounded-xl hover:border-white/15 transition-colors duration-300">
                  <div className="flex items-center gap-2">
                    <div className="text-base" style={{ color: skill.brand }}>{skill.logo}</div>
                    <span className="text-sm font-medium text-slate-300 truncate">{skill.name}</span>
                  </div>
                  <div className="h-px w-full bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                      transition={{ duration: 0.9, delay: i * 0.05, ease }}
                      className="h-full origin-left bg-white/20"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{skill.level}%</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Current Trajectory ── */}
        <div className="mb-10 md:mb-14">
          <motion.p {...fadeUp()} className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-8">
            Current Trajectory
          </motion.p>
          <div className="space-y-0 divide-y divide-white/[0.05]">
            {[
              { icon: <FaGraduationCap />, label: 'Education', title: 'B.Tech CSE (3rd Year)', sub: 'Katihar Engineering College · 7.92 CGPA', year: '2023 — Present' },
              { icon: <FaTrophy />, label: 'Role', title: 'Tech Team Lead', sub: "Core Coordinator @ TechFusion'26", year: '2025 — 2026' },
              { icon: <FaRoute />, label: 'Focus', title: 'Agentic AI Mastery', sub: 'Executing a 10-month advanced roadmap', year: 'Ongoing' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, ease, delay: i * 0.08 }}
                className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-7 -mx-4 px-4 hover:bg-white/[0.02] rounded-xl transition-colors duration-300"
              >
                <div className="flex items-start sm:items-center gap-5">
                  <span className="text-slate-500 mt-0.5 shrink-0 text-lg">{item.icon}</span>
                  <div>
                    <h3 className="text-white text-base sm:text-xl font-medium tracking-tight">{item.title}</h3>
                    <p className="text-slate-400 text-sm sm:text-base mt-1 font-light">{item.sub}</p>
                  </div>
                </div>
                <span className="text-xs tracking-widest text-slate-600 uppercase font-medium pl-10 sm:pl-0 shrink-0">{item.year}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Development Workflow ── */}
        {/* <div>
          <motion.p {...fadeUp()} className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-8">
            Development Workflow
          </motion.p>
          <motion.p {...fadeUp(0.05)} className="text-slate-400 text-base sm:text-lg mb-10">A systematic approach to engineering web applications.</motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05]">
            {[
              { icon: <FaMagic />, step: '01', title: 'Interface Architecture', desc: 'Designing intuitive, motion-rich user experiences with React and Framer Motion.' },
              { icon: <FaCode />, step: '02', title: 'Full-Stack Implementation', desc: 'Building robust server-side logic and database schemas using Node.js and MongoDB.' },
              { icon: <FaRocket />, step: '03', title: 'Optimization & Delivery', desc: 'Ensuring cross-device scalability, clean state management, and optimized web vitals.' },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, ease, delay: i * 0.1 }}
                className="card-frosted p-8 md:p-10 hover:bg-white/[0.04] transition-colors duration-300 group"
              >
                <div className="text-xs tracking-[0.3em] text-slate-600 uppercase mb-5">{step.step}</div>
                <div className="text-slate-500 mb-5 group-hover:text-slate-400 transition-colors text-2xl">{step.icon}</div>
                <h4 className="text-white text-base sm:text-lg font-medium mb-3 tracking-tight">{step.title}</h4>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
              */}
      </div>
    </section>
  );
};

export default About;
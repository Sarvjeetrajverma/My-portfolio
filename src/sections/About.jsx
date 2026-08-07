import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  FaChevronLeft, FaChevronRight, FaCode, FaBolt, FaMagic,
  FaRocket, FaRobot, FaCamera, FaGraduationCap, FaTrophy, FaRoute,
  FaTerminal, FaNetworkWired, FaServer, FaCodeBranch, FaBrain,
  FaGithub, FaClock, FaCube, FaLaptopCode, FaDatabase, FaAws, FaJava, FaChartLine
} from 'react-icons/fa';
import {
  SiReact, SiNodedotjs, SiCplusplus, SiNextdotjs, SiTailwindcss, SiMongodb,
  SiTypescript, SiFramer, SiRedux, SiExpress, SiPython, SiGraphql,
  SiPostgresql, SiMysql, SiRedis, SiSupabase, SiGithubactions,
  SiDocker, SiLinux, SiVercel, SiScikitlearn, SiPandas, SiNumpy, SiJupyter,
  SiTensorflow, SiPytorch, SiHuggingface, SiKeras, SiOpencv
} from 'react-icons/si';

import pf5 from '../assets/pf5.webp';
import pf from '../assets/pf.jpeg';
import pf7 from '../assets/pf7.webp';
import pf8 from '../assets/pf8.webp';
import srvprofile from '../assets/srvprofile.jpeg';

const defaultProfileImages = [pf, pf5, pf7, pf8, srvprofile];

const systemModules = [
  {
    id: 'machine-learning', title: 'Machine Learning', color: 'cyan', icon: <FaBrain />,
    content: [
      { name: "Python", level: 90, logo: <SiPython />, meta: "Core Language", brand: "#3776AB" },
      { name: "Scikit-Learn", level: 80, logo: <SiScikitlearn />, meta: "Classical ML", brand: "#F7931E" },
      { name: "Pandas", level: 85, logo: <SiPandas />, meta: "Data Analysis", brand: "#150458" },
      { name: "NumPy", level: 85, logo: <SiNumpy />, meta: "Numerical Comp", brand: "#013243" },
      { name: "Jupyter", level: 90, logo: <SiJupyter />, meta: "Notebooks", brand: "#F37626" },
      { name: "Math & Stats", level: 75, logo: <FaChartLine />, meta: "Probability", brand: "#00FFCC" },
    ]
  },
  {
    id: 'deep-learning', title: 'Deep Learning', color: 'purple', icon: <FaRobot />,
    content: [
      { name: "TensorFlow", level: 70, logo: <SiTensorflow />, meta: "Neural Nets", brand: "#FF6F00" },
      { name: "PyTorch", level: 60, logo: <SiPytorch />, meta: "Research DL", brand: "#EE4C2C" },
      { name: "Keras", level: 75, logo: <SiKeras />, meta: "High-level API", brand: "#D00000" },
      { name: "HuggingFace", level: 65, logo: <SiHuggingface />, meta: "Transformers", brand: "#FFD21E" },
      { name: "OpenCV", level: 60, logo: <SiOpencv />, meta: "Computer Vision", brand: "#5C3EE8" },
      { name: "GenAI", level: 50, logo: <FaMagic />, meta: "LLMs & Diffusion", brand: "#FF00FF" },
    ]
  },
  {
    id: 'data-engineering', title: 'Data Eng', color: 'yellow', icon: <FaDatabase />,
    content: [
      { name: "PostgreSQL", level: 65, logo: <SiPostgresql />, meta: "Relational DB", brand: "#4169E1" },
      { name: "MySQL", level: 80, logo: <SiMysql />, meta: "Structured DB", brand: "#4479A1" },
      { name: "MongoDB", level: 50, logo: <SiMongodb />, meta: "NoSQL DB", brand: "#47A248" },
      { name: "Web Scraping", level: 70, logo: <FaCode />, meta: "Data Collection", brand: "#FFFFFF" },
      { name: "ETL Pipelines", level: 50, logo: <FaRoute />, meta: "Data Workflows", brand: "#00FFCC" },
      { name: "Redis", level: 20, logo: <SiRedis />, meta: "Caching", brand: "#DC382D" },
    ]
  },
  {
    id: 'mlops', title: 'MLOps', color: 'green', icon: <FaCodeBranch />,
    content: [
      { name: "Git & GitHub", level: 90, logo: <FaGithub />, meta: "Version Control", brand: "#FFFFFF" },
      { name: "Docker", level: 30, logo: <SiDocker />, meta: "Containers", brand: "#2496ED" },
      { name: "Linux CLI", level: 50, logo: <SiLinux />, meta: "Sys Admin", brand: "#FCC624" },
      { name: "AWS", level: 20, logo: <FaAws />, meta: "Cloud Services", brand: "#FF9900" },
      { name: "Web Dashboards", level: 80, logo: <SiReact />, meta: "React / Streamlit", brand: "#61DAFB" },
      { name: "CI/CD", level: 10, logo: <SiGithubactions />, meta: "Automated Pipes", brand: "#2088FF" },
    ]
  },
  {
    id: 'dsa', title: 'Core DSA', color: 'blue', icon: <FaTerminal />,
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
  const [activeTab, setActiveTab] = useState(systemModules[0].id);
  const [profileImages, setProfileImages] = useState(defaultProfileImages);
  const activeData = systemModules.find(m => m.id === activeTab);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_settings', 'about'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().profileImages?.length > 0) {
        setProfileImages(docSnap.data().profileImages);
      } else {
        setProfileImages(defaultProfileImages);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="about" className="relative w-full bg-transparent text-white overflow-hidden py-5 md:py-8 lg:py-10">

      {/* Single ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none md:blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />

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
          Engineer <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--theme-stroke)' }}>Identity.</span>
        </motion.h2>

        {/* ── Profile + Bio row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 md:gap-12 items-start mb-10 md:mb-14">

          {/* Profile image */}
          <motion.div {...fadeUp(0.1)}>
            <div className="relative w-full max-w-[300px] mx-auto lg:mx-0 aspect-square rounded-2xl overflow-hidden" style={{ background: 'rgba(13,5,20,0.7)' }}>
              <img
                src={profileImages[0]}
                alt="Sarvjeet Profile"
                loading="lazy" decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </div>
            <div className="mt-5 text-center lg:text-left">
              <p className="text-white text-lg font-medium tracking-tight">Sarvjeet</p>
              <p className="text-slate-400 text-base mt-1">AI/ML Engineer</p>
            </div>
          </motion.div>

          {/* Bio text */}
          <motion.div {...fadeUp(0.15)} className="flex flex-col justify-center">
            <div className="space-y-6 text-slate-400 text-lg sm:text-xl md:text-2xl leading-relaxed font-light mb-10">
              <p>
                I engineer intelligent systems that learn, adapt, and scale. As a Final-year CS student at <span className="text-white font-normal">Katihar Engineering College</span>, my foundation is deeply rooted in Data Science, Neural Networks, and mathematical optimization.
              </p>
              <p>
                My core research and development focus is on <span className="text-slate-300">Large Language Models, Computer Vision, and Agentic AI workflows</span>. I bridge the gap between raw data and predictive intelligence.
              </p>
              <p className="text-slate-500 text-base sm:text-lg">
                Beyond the Jupyter notebook, I thrive in hands-on environments—from leading technical execution for <span className="text-slate-300">TechFusion</span> and writing autonomous algorithms for Robo War events, to analyzing exposure histograms while photographing the landscapes of Sikkim.
              </p>
            </div>

            {/* Tags — minimal pill style */}
            <div className="flex flex-wrap gap-2.5">
              {[
                { icon: <FaCode size={13} />, label: 'Data Science' },
                { icon: <FaBolt size={13} />, label: 'Agentic AI' },
                { icon: <FaRobot size={13} />, label: 'Combat Robotics' },
                { icon: <FaCamera size={13} />, label: 'Photography' },
              ].map(tag => (
                <span key={tag.label} className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-slate-400 tracking-wide hover:text-white transition-colors duration-300 cursor-default">
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
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>


        {/* ── Machine Learning Pipeline ── */}
        <div>
          <motion.p {...fadeUp()} className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-8">
            Machine Learning Pipeline
          </motion.p>
          <motion.p {...fadeUp(0.05)} className="text-slate-400 text-base sm:text-lg mb-10">A systematic approach to designing intelligent systems.</motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.05]">
            {[
              {
                icon: <FaDatabase />, step: '01', title: 'Data Engineering',
                desc: 'Gathering, cleaning, and transforming raw datasets into high-quality features ready for model ingestion.',
                tools: ['Pandas', 'NumPy', 'SQL']
              },
              {
                icon: <FaBrain />, step: '02', title: 'Model Architecture',
                desc: 'Designing neural networks and training machine learning algorithms using state-of-the-art frameworks.',
                tools: ['PyTorch', 'TensorFlow', 'Scikit-Learn']
              },
              {
                icon: <FaRocket />, step: '03', title: 'Deployment & MLOps',
                desc: 'Optimizing hyperparameters, testing model accuracy, and deploying models to scalable cloud environments.',
                tools: ['Docker', 'AWS', 'FastAPI']
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, ease, delay: i * 0.1 }}
                className="relative card-frosted p-8 md:p-10 hover:bg-white/[0.04] transition-colors duration-300 group overflow-hidden flex flex-col"
              >
                {/* Subtle gradient blob on hover */}
                <div className="absolute -inset-x-10 -inset-y-10 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="text-xs tracking-[0.3em] text-slate-600 uppercase font-medium">{step.step}</div>
                    <div className="text-slate-500 group-hover:text-white transition-colors duration-500 text-2xl">{step.icon}</div>
                  </div>

                  <h4 className="text-white text-xl sm:text-2xl font-medium mb-4 tracking-tight">{step.title}</h4>
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-light mb-8 flex-grow">{step.desc}</p>

                  <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-white/[0.05]">
                    {step.tools.map(tool => (
                      <span key={tool} className="text-[10px] uppercase tracking-widest font-medium text-slate-400 bg-white/[0.02] border border-white/[0.08] px-3 py-1.5 rounded-full group-hover:border-white/[0.15] group-hover:text-slate-200 transition-colors duration-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
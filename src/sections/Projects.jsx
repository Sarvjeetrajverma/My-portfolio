import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode, FaBrain, FaTerminal } from 'react-icons/fa';
import project1Image from '../assets/project1.png';

const projects = [
  {
    title: "Portfolio Launchpad",
    description: "A highly optimized digital environment built to showcase my machine learning models and research. Engineered from scratch to ensure a high-performance, seamless user experience.",
    tech: ["React", "Tailwind CSS", "Framer Motion"],
    github: "#",
    demo: "#",
    image: project1Image,
    status: "v1.0 Online"
  }
];

const ease = [0.22, 1, 0.36, 1];

const Projects = () => {
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

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-px bg-white/[0.05]">

          {/* Active project card */}
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.85, ease }}
              className="group relative card-frosted overflow-hidden transition-colors duration-500 bg-black"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.8, ease }}
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                {/* Status badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono text-emerald-400 border border-emerald-500/20 rounded-full bg-black/60 backdrop-blur">
                  <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
                  {project.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <h3 className="text-white text-2xl sm:text-3xl font-medium tracking-tight mb-3">{project.title}</h3>
                <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-6 font-light">{project.description}</p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.map((tech, j) => (
                    <span key={j} className="text-xs sm:text-sm font-mono uppercase text-slate-400 border border-white/[0.08] px-3 py-1.5 rounded-full tracking-wider">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-6 pt-6 border-t border-white/[0.05]">
                  <a href={project.github} className="flex items-center gap-2 text-sm sm:text-base text-slate-400 hover:text-white transition-colors tracking-wide font-medium">
                    <FaGithub /> Codebase
                  </a>
                  <a href={project.demo} className="flex items-center gap-2 text-sm sm:text-base text-slate-400 hover:text-white transition-colors tracking-wide font-medium">
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Model Training block */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.85, ease, delay: 0.1 }}
            className="group relative card-frosted flex flex-col justify-center items-center p-12 min-h-[420px] transition-colors duration-500 overflow-hidden bg-black"
          >
            {/* Scanning line */}
            <motion.div
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent pointer-events-none"
            />

            {/* Terminal Window Mockup */}
            <div className="w-full max-w-sm rounded-lg border border-white/[0.08] bg-black/80 overflow-hidden mb-8 shadow-2xl">
              {/* Terminal Header */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.05] bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700"></span>
                </div>
                <span className="ml-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest">train_model.py</span>
              </div>
              {/* Terminal Body */}
              <div className="p-4 font-mono text-[10px] sm:text-xs text-slate-400 text-left space-y-1.5 h-[120px] overflow-hidden relative">
                <p><span className="text-emerald-400">root@ai-cluster:~#</span> python train_model.py</p>
                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }}>Loading dataset (1.2M rows)... [OK]</motion.p>
                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.2 }}>Initializing Transformer architecture...</motion.p>
                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 2.0 }} className="text-amber-400">Epoch 1/100: loss=2.4154, val_loss=1.9842</motion.p>
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

            <h3 className="text-slate-200 text-2xl sm:text-3xl font-medium tracking-tight mb-4 text-center">
              [ Training Future Models ]
            </h3>
            <p className="text-slate-600 max-w-xs text-base sm:text-lg leading-relaxed font-light mb-8 text-center">
              I am actively training behind the scenes. This space is reserved for my upcoming projects as I master{' '}
              <span className="text-slate-300">Neural Networks</span>,{' '}
              <span className="text-slate-300">Computer Vision</span>, and{' '}
              <span className="text-slate-300">Generative AI</span>.
            </p>

            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500/70 rounded-full animate-pulse" />
              <span className="text-[11px] font-mono text-emerald-500 tracking-widest">Model convergence in progress...</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
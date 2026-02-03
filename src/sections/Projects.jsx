import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaHammer, FaCode } from 'react-icons/fa'; // Changed icons to Hammer/Code
import project1Image from '../assets/project1.png';

const projects = [
  {
    title: "Portfolio Launchpad",
    description: "My first step into the digital frontier. This site was built to apply my learning of React components, responsive design, and modern CSS animations.",
    tech: ["React Basics", "Tailwind CSS", "JSX"],
    github: "#",
    demo: "#",
    image: project1Image,
    status: "v1.0 Online"
  }
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9, 
    filter: "blur(10px)",
    y: 20
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] 
    }
  }
};

const Projects = () => {
  return (
    <section id="projects" className="w-full py-24 text-white relative overflow-hidden">
      
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="max-w-[1240px] mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-col items-center"
        >
          <div className="flex items-center gap-2 mb-3">
             <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
             <span className="text-cyan-400 font-mono text-xs tracking-[0.2em] uppercase">Student_Log: Active</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
            Project Index
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 gap-8"
        >
          
          {/* --- 1. ACTIVE PROJECT CARD (Your Portfolio) --- */}
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-gray-900/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-cyan-500/50 transition-colors duration-500"
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur border border-white/10 px-3 py-1 rounded-full text-xs font-mono text-green-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  {project.status}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 relative -mt-12">
                <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-2xl relative overflow-hidden group-hover:border-cyan-500/30 transition-colors">
                  
                  {/* Subtle Glow */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-500/20 blur-2xl rounded-full group-hover:bg-cyan-500/30 transition-colors"></div>

                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="text-[11px] font-mono uppercase bg-white/5 border border-white/10 text-gray-300 px-2 py-1 rounded hover:bg-white/10 transition-colors">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-2 border-t border-white/5">
                    <a href={project.github} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 duration-300">
                      <FaGithub /> <span className="font-mono">Codebase</span>
                    </a>
                    <a href={project.demo} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors hover:translate-x-1 duration-300">
                      <FaExternalLinkAlt /> <span className="font-mono">Live_Demo</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* --- 2. COMING SOON BLOCK (Student Focus) --- */}
          <motion.div 
            variants={itemVariants}
            className="relative h-full min-h-[400px] bg-black/20 border border-white/5 border-dashed rounded-2xl p-8 flex flex-col justify-center items-center text-center overflow-hidden group"
          >
            {/* Animated Scanning Line */}
            <motion.div 
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent w-full opacity-50 pointer-events-none"
            />

            {/* Background Noise */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Icon Animation */}
            <motion.div 
              whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="relative z-10 w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center border border-white/10 mb-6 group-hover:border-cyan-500/50 group-hover:text-cyan-400 transition-colors"
            >
              <FaCode className="text-3xl text-gray-500 group-hover:text-cyan-400 transition-colors" />
              <div className="absolute inset-0 rounded-full border border-white/5 animate-ping opacity-20"></div>
            </motion.div>

            <h3 className="relative z-10 text-xl font-bold text-gray-300 mb-2 font-mono">
              [ Loading_Future_Builds ]
            </h3>
            
            <p className="relative z-10 text-gray-500 max-w-sm text-sm leading-relaxed">
              I am actively coding behind the scenes. This space is reserved for my upcoming projects as I master 
              <span className="text-gray-300"> Backend Logic</span>, 
              <span className="text-gray-300"> Databases</span>, and 
              <span className="text-gray-300"> Complex Algorithms</span>.
            </p>

            <div className="mt-6 flex items-center gap-2 relative z-10">
               <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
               <span className="text-xs font-mono text-yellow-500">Learning_in_progress...</span>
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gray-600"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gray-600"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gray-600"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gray-600"></div>

          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
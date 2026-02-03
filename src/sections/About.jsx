import React from 'react';
import srvprofile from '../assets/srvprofile5.png'; // Ensure path is correct
import { motion } from 'framer-motion';
import { FaTerminal, FaFileDownload, FaEnvelope, FaGlobe, FaRobot, FaBrain } from 'react-icons/fa';
import { SiReact, SiNodedotjs, SiCplusplus, SiLeetcode } from 'react-icons/si';

// Generate stars once at module level (avoids impure function calls during render)
const generateStars = () => [...Array(50)].map(() => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2 + 1 + 'px',
  opacity: Math.random(),
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 5,
}));

const About = () => {
  const stars = generateStars();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="w-full py-24 relative overflow-hidden text-white bg-transparent">
      
      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Twinkling Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{ 
              top: star.top, 
              left: star.left, 
              width: star.size, 
              height: star.size,
              opacity: star.opacity 
            }}
            animate={{ opacity: [star.opacity, 1, star.opacity] }}
            transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- UNIFIED HOLOGRAPHIC PANEL --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl"
        >
          {/* Tech Decor: Glowing Lines */}
          <div className="absolute top-0 left-10 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 right-10 w-32 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

          <div className="flex flex-col lg:flex-row items-start gap-16">
            
            {/* --- LEFT: PROFILE SCANNER --- */}
            <motion.div 
              variants={itemVariants}
              className="relative flex-shrink-0 w-full lg:w-auto flex justify-center lg:block"
            >
               <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] flex items-center justify-center">
                 
                 {/* Rotating HUD Rings */}
                 <motion.div 
                   animate={{ rotate: 360 }}
                   transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-0 border border-cyan-500/20 rounded-full border-dashed"
                 />
                 <motion.div 
                   animate={{ rotate: -360 }}
                   transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                   className="absolute inset-4 border border-purple-500/20 rounded-full border-t-2 border-transparent"
                 />

                 {/* Profile Image Container */}
                 <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-gray-800/80 shadow-[0_0_50px_rgba(6,182,212,0.15)] z-10 bg-black group">
                   <img
                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                     src={srvprofile}
                     alt="Sarvjeet Raj Verma"
                   />
                   
                   {/* SCANNER EFFECT */}
                   <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20 opacity-50 pointer-events-none"
                   />
                   <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay pointer-events-none"></div>
                 </div>

                 {/* Status Badge */}
                 <motion.div 
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   transition={{ delay: 1, type: "spring" }}
                   className="absolute bottom-0 right-4 z-20 bg-gray-900 border border-cyan-500/50 px-3 py-1 rounded-full flex items-center gap-2 shadow-lg"
                 >
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                   <span className="text-[10px] font-mono text-cyan-400 font-bold">ONLINE</span>
                 </motion.div>
               </div>
            </motion.div>


            {/* --- RIGHT: CONTENT DATA --- */}
            <div className="flex-grow w-full space-y-8">
              
              {/* Header */}
              <motion.div variants={itemVariants} className="border-b border-gray-700/50 pb-6">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <FaTerminal className="text-sm" />
                  <span className="font-mono text-xs tracking-[0.2em] uppercase">System Identity</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
                  Sarvjeet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Raj Verma</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                  Full Stack Developer & Tech Enthusiast. Merging logic with creativity to build seamless digital experiences.
                </p>
              </motion.div>

              {/* --- MISSION LOG (TechFusion) --- */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-l-4 border-purple-500 rounded-r-xl p-5 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors duration-500"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-purple-300 font-bold font-mono flex items-center gap-2">
                            <FaGlobe className="animate-spin-slow" /> MISSION LOG: ORGANIZER
                        </h3>
                        <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded border border-purple-500/30">
                            Jan 10-14, 2026
                        </span>
                    </div>
                    <h4 className="text-xl text-white font-bold mb-1">TechFusion'26</h4>
                    <p className="text-sm text-gray-300">
                        Orchestrating a massive 4-day technical convergence. Managing event logistics, 
                        web infrastructure, and leading a team of student developers.
                    </p>
                </div>
              </motion.div>

              {/* --- SKILLS & SIDE QUESTS GRID --- */}
              {/* Changed grid-cols to support 3 items on large screens */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                 
                 {/* 1. Core Systems */}
                 <motion.div variants={itemVariants} className="space-y-4">
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Core Systems</p>
                    <div className="flex flex-col gap-3 h-full">
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/40 border border-gray-700 hover:border-cyan-500/50 transition-colors">
                            <div className="p-2 bg-cyan-500/10 rounded text-cyan-400"><SiReact size={20}/></div>
                            <div>
                                <h4 className="text-sm font-bold">Frontend</h4>
                                <p className="text-xs text-gray-400">Next.js / React</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/40 border border-gray-700 hover:border-green-500/50 transition-colors">
                            <div className="p-2 bg-green-500/10 rounded text-green-400"><SiNodedotjs size={20}/></div>
                            <div>
                                <h4 className="text-sm font-bold">Backend</h4>
                                <p className="text-xs text-gray-400">Node / Mongo</p>
                            </div>
                        </div>
                    </div>
                 </motion.div>

                 {/* 2. Logic & Algo (The requested addition) */}
                 <motion.div variants={itemVariants} className="space-y-4">
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Logic & Algo</p>
                    <div className="p-4 rounded-lg bg-gray-800/40 border border-gray-700 hover:border-blue-500/50 transition-colors h-full">
                        <div className="flex items-center gap-2 mb-3 text-blue-400">
                            <FaBrain size={20} />
                            <h4 className="text-sm font-bold">Problem Solving</h4>
                        </div>
                        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                            Passionate about optimizing algorithms and data structures.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="flex items-center gap-1 text-[10px] bg-blue-400/10 text-blue-200 px-2 py-1 rounded border border-blue-400/20">
                                <SiCplusplus size={10} /> C++
                            </span>
                            <span className="flex items-center gap-1 text-[10px] bg-blue-400/10 text-blue-200 px-2 py-1 rounded border border-blue-400/20">
                                DSA
                            </span>
                             <span className="flex items-center gap-1 text-[10px] bg-blue-400/10 text-blue-200 px-2 py-1 rounded border border-blue-400/20">
                                <SiLeetcode size={10} /> Logic
                            </span>
                        </div>
                    </div>
                 </motion.div>

                 {/* 3. Side Quests (Robotics) */}
                 <motion.div variants={itemVariants} className="space-y-4">
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Side Quests</p>
                    <div className="p-4 rounded-lg bg-gray-800/40 border border-gray-700 hover:border-yellow-500/50 transition-colors h-full">
                        <div className="flex items-center gap-2 mb-3 text-yellow-400">
                            <FaRobot size={20} />
                            <h4 className="text-sm font-bold">Robotics</h4>
                        </div>
                        <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                            Active participant in autonomous and manual bot competitions.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['Robo War', 'Robo Soccer', 'Robo Race'].map(tag => (
                                <span key={tag} className="text-[10px] bg-yellow-400/10 text-yellow-200 px-2 py-1 rounded border border-yellow-400/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                 </motion.div>

              </div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
                <a 
                  href="/sarvjeetrajverma_resume.pdf" 
                  download
                  className="flex items-center gap-2 px-6 py-3 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 font-bold rounded-lg hover:bg-cyan-500 hover:text-black transition-all text-sm group"
                >
                  <FaFileDownload className="group-hover:animate-bounce" />
                  DOWNLOAD DATA
                </a>
                
                <a 
                  href="#contact"
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-lg hover:bg-white/10 transition-all text-sm"
                >
                  <FaEnvelope />
                  INITIATE COMMS
                </a>
              </motion.div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default About;
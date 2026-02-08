import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaReact, FaNodeJs, FaGitAlt, FaChevronDown, FaRegFolderOpen
} from 'react-icons/fa';
import {
  SiJavascript, SiTypescript, SiMongodb, SiTailwindcss, SiNextdotjs,
  SiExpress, SiPostman, SiCplusplus, SiPrisma, SiRedux
} from 'react-icons/si';
import { VscCode, VscTerminalBash } from "react-icons/vsc";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.1 }
  },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};

const lineVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
};

const BlinkingCursor = () => (
  <motion.span
    animate={{ opacity: [0, 1, 0] }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    className="inline-block w-[2px] h-4 bg-blue-400 ml-1 align-sub"
  />
);

const skillFiles = [
  {
    id: 'frontend',
    filename: 'Frontend.tsx',
    icon: <FaReact className="text-blue-400"/>,
    language: 'typescript',
    content: [
      { name: "React.js", level: 90, color: "text-blue-400" },
      { name: "Next.js (App Router)", level: 85, color: "text-white" },
      { name: "TypeScript", level: 80, color: "text-blue-400" },
      { name: "Tailwind CSS", level: 80, color: "text-teal-400" },
      { name: "Framer Motion", level: 75, color: "text-blue-400" },
      { name: "State (Zustand/Redux)", level: 50, color: "text-white" },
      { name: "Testing (Jest/Vitest)", level: 30, color: "text-green-400" },
    ]
  },
  {
    id: 'backend',
    filename: 'Backend.ts',
    icon: <FaNodeJs className="text-green-500" />,
    language: 'typescript',
    content: [
      { name: "Node.js Runtime", level: 10, color: "text-green-500" },
      { name: "Express.js", level: 10, color: "text-blue-400" },
      { name: "REST API Design", level: 30, color: "text-white" },
      { name: "MongoDB & Mongoose", level: 40, color: "text-green-400" },
      { name: "PostgreSQL & Prisma", level: 10, color: "text-blue-400" },
      { name: "Auth (JWT/NextAuth)", level: 10, color: "text-white" },
      { name: "Validation (Zod)", level: 10, color: "text-blue-400" },
    ]
  },
  {
    id: 'devops',
    filename: 'pipeline.yml',
    icon: <VscTerminalBash className="text-purple-400" />,
    language: 'yaml',
    content: [
      { name: "Git Version Control", level: 90, color: "text-white" },
      { name: "GitHub Actions (CI/CD)", level: 65, color: "text-blue-400" },
      { name: "Docker Basics", level: 10, color: "text-green-400" },
      { name: "Linux Command Line", level: 30, color: "text-blue-400" },
      { name: "Deployment (Vercel)", level: 92, color: "text-white" },
      { name: "Package Mgrs (npm)", level: 85, color: "text-green-400" },
    ]
  },
  {
    id: 'dsa',
    filename: 'algorithms.cpp',
    icon: <SiCplusplus className="text-blue-400" />,
    language: 'cpp',
    content: [
      { name: "C++ Fundamentals", level: 85, color: "text-blue-400" },
      { name: "Arrays & Strings", level: 80, color: "text-green-400" },
      { name: "Linked Lists", level: 75, color: "text-white" },
      { name: "Trees & Graphs", level: 60, color: "text-green-400" },
      { name: "Sorting & Searching", level: 75, color: "text-blue-400" },
      { name: "Time Complexity", level: 65, color: "text-green-400" },
    ]
  }
];

const Skills = () => {
  const [activeTab, setActiveTab] = useState('frontend');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const activeData = skillFiles.find(f => f.id === activeTab);
  const totalLines = activeData.content.length + 6;

  return (
    // Top-level Section is FULLY TRANSPARENT
    <section id="skills" className="w-full py-16 bg-transparent text-slate-300 font-mono overflow-hidden relative">
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-sm"
          >
            DEVELOPMENT ENVIRONMENT
          </motion.div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            <span className="text-purple-400">const</span> stack <span className="text-blue-400">=</span> <span className="text-green-400">await</span> <span className="text-yellow-300">fetchSkills</span>();
          </h2>
          <p className="text-slate-400 drop-shadow-md">Browse the project files to view technical proficiency.</p>
        </div>

        {/* IDE Container - GLASSMORPHISM EFFECT */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative"
        >
          
          {/* Title Bar - Transparent */}
          <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 justify-between select-none">
            <div className="flex gap-2 items-center">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
            </div>
            <div className="text-xs text-slate-400 font-sans flex items-center gap-2">
               <VscCode className="text-blue-400" /> portfolio-v2 [SSH: student-dev]
            </div>
            <div className="w-10" /> 
          </div>

          <div className="flex h-[400px] md:h-[500px]">
            
            {/* Sidebar - Transparent */}
            <div className={`${isSidebarOpen ? 'w-16 md:w-64' : 'w-0'} transition-all duration-300 border-r border-white/10 bg-white/5 flex-shrink-0 overflow-hidden hidden md:flex flex-col`}>
              <div className="p-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center">
                <span>Explorer</span>
                <button className="hover:text-white">•••</button>
              </div>
              <div className="px-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                <div className="flex items-center gap-1 text-slate-200 mb-1 cursor-pointer p-1 hover:bg-white/10 rounded transition-colors" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                  <FaChevronDown className="text-[10px]" />
                  <FaRegFolderOpen className="text-blue-400/80 text-sm" />
                  <span className="font-bold text-sm truncate">PROJECT-ROOT</span>
                </div>
                
                <div className="pl-3">
                   <div className="flex items-center gap-1 text-slate-400 p-1 hover:bg-white/10 rounded cursor-pointer transition-colors">
                      <FaChevronDown className="text-[10px]" />
                      <FaRegFolderOpen className="text-yellow-400/80 text-sm" />
                      <span className="text-sm">src</span>
                   </div>
                   <div className="pl-4 space-y-0.5 font-sans">
                    {skillFiles.map((file) => (
                      <div 
                        key={file.id}
                        onClick={() => setActiveTab(file.id)}
                        className={`
                          flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-[13px] transition-colors group
                          ${activeTab === file.id ? 'bg-white/10 text-white font-medium' : 'text-slate-500 hover:text-white hover:bg-white/5'}
                        `}
                      >
                        <span className="group-hover:scale-110 transition-transform">{file.icon}</span>
                        <span className="truncate">{file.filename}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Editor - Transparent */}
            <div className="flex-1 flex flex-col min-w-0 bg-transparent">
              
              {/* Tabs */}
              <div className="flex bg-transparent overflow-x-auto border-b border-white/10 scrollbar-hide">
                {skillFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setActiveTab(file.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2 text-sm border-r border-white/10 min-w-fit transition-all relative
                      ${activeTab === file.id ? 'bg-white/10 text-white' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}
                    `}
                  >
                    {activeTab === file.id && <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400"></div>}
                    {file.icon}
                    <span>{file.filename}</span>
                  </button>
                ))}
              </div>

              {/* Code Content Area */}
              <div className="flex-1 overflow-y-auto font-mono text-[13px] md:text-[14px] leading-7 relative custom-scrollbar bg-transparent">
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={activeTab}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex h-full"
                  >
                    {/* Line Numbers - Semi-Transparent */}
                    <div className="text-slate-400 text-right select-none py-4 pr-4 pl-2 border-r border-white/10 bg-white/5 w-[50px] flex-shrink-0">
                      {Array.from({ length: totalLines }).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>

                    {/* Code Text */}
                    <div className="p-4 w-full overflow-x-auto scrollbar-hide">
                      
                      <motion.div variants={lineVariants} className="text-slate-500 italic">
                        {activeData.language === 'cpp' ? '// Core concepts & logic' : 
                         activeData.language === 'yaml' ? '# CI/CD pipelines & infrastructure' : 
                         '// Tech stack proficiency definition'}
                      </motion.div>

                      <motion.div variants={lineVariants}>
                        {activeData.language === 'cpp' ? (
                          <>
                            <div><span className="text-purple-400">#include</span> <span className="text-orange-300">&lt;iostream&gt;</span></div>
                            <div className="mt-2"><span className="text-blue-400">int</span> <span className="text-yellow-300">main</span>() {'{'}</div>
                            <div className="pl-4"><span className="text-green-400">auto</span> skills = {'{'}</div>
                          </>
                        ) : activeData.language === 'yaml' ? (
                           <div><span className="text-blue-400">jobs</span>:</div>
                        ) : (
                          <div>
                            <span className="text-purple-400">export const</span> <span className="text-blue-300">{activeTab}Stack</span> <span className="text-blue-400">=</span> <span className="text-yellow-300">{'['}</span>
                          </div>
                        )}
                      </motion.div>

                      {/* Code Loop */}
                      <div className={`pl-${activeData.language === 'yaml' ? '2' : '4'} py-1`}>
                        {activeData.content.map((skill, index) => (
                          <motion.div 
                            key={skill.name} 
                            variants={lineVariants}
                            className="group flex items-center hover:bg-white/5 rounded px-2 -mx-2 transition-colors relative"
                          >
                            <div className="whitespace-nowrap flex-shrink-0">
                              {activeData.language === 'cpp' ? (
                                <span>{'{'} <span className="text-orange-300">"{skill.name}"</span>, <span className="text-green-300">{skill.level}</span> {'},'}</span>
                              ) : activeData.language === 'yaml' ? (
                                <span>- <span className="text-blue-300">name</span>: <span className="text-green-300">{skill.name}</span></span>
                              ) : (
                                <span>{'{'} name: <span className="text-orange-300">'{skill.name}'</span>, level: <span className="text-green-300">{skill.level}</span> {'},'}</span>
                              )}
                            </div>
                            
                            {/* Dotted Line */}
                             <div className="hidden md:block flex-1 mx-4 border-b border-dashed border-slate-400/30 h-1 opacity-20 group-hover:opacity-50 transition-opacity"></div>

                            {/* Progress Bar */}
                            <div className="hidden md:flex items-center gap-2">
                               <span className="text-xs text-slate-500 pr-2">{skill.level}%</span>
                                <div className="h-1.5 w-24 bg-white/10 rounded-full overflow-hidden flex-shrink-0">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${skill.level}%` }}
                                    transition={{ duration: 1, delay: 0.5 + (index * 0.1), type: "spring" }}
                                    className={`h-full ${skill.color.replace('text-', 'bg-')} opacity-80 group-hover:opacity-100 transition-opacity`} 
                                  />
                                </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                       <motion.div variants={lineVariants}>
                        {activeData.language === 'cpp' ? (
                           <div className="pl-4">{'};'}</div>
                        ) : activeData.language === 'yaml' ? (
                          <br />
                        ) : (
                          <div><span className="text-yellow-300">{']'}</span>;</div>
                        )}
                      </motion.div>
                      
                       {activeData.language === 'cpp' && <motion.div variants={lineVariants}>{'}'}</motion.div>}

                      <motion.div variants={lineVariants} className="mt-2">
                        <BlinkingCursor />
                      </motion.div>

                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
          
          {/* Status Bar - Transparent */}
          <div className="h-6 border-t border-white/10 bg-white/5 text-slate-400 text-[11px] flex items-center px-3 justify-between select-none relative z-20">
            <div className="flex gap-4">
              <span className="flex items-center gap-1 text-blue-400 font-bold px-2 h-full"><FaGitAlt /> main*</span>
              <span className="flex items-center gap-1"><VscCode /> Ready</span>
            </div>
            <div className="flex gap-4 md:pr-4">
              <span>Ln {totalLines}, Col 1</span>
              <span>UTF-8</span>
              <span>{activeData.language.toUpperCase()}</span>
               <span className="hidden md:inline">Prettier</span>
            </div>
          </div>

        </motion.div>
      </div>
      
      {/* Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 5px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
      `}</style>
    </section>
  );
};

export default Skills;
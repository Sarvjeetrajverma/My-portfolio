import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTerminal, FaNetworkWired, FaServer, FaCodeBranch, FaBrain, 
  FaGithub, FaClock, FaCube, FaLaptopCode, FaDatabase, FaAws, FaJava
} from 'react-icons/fa';
import { 
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer, SiRedux,
  SiNodedotjs, SiExpress, SiPython, SiGraphql, 
  SiPostgresql, SiMysql, SiMongodb, SiRedis, SiSupabase,
  SiGithubactions, SiDocker, SiLinux, SiVercel, SiCplusplus 
} from 'react-icons/si';

// System Modules with Fixed Imports
const systemModules = [
  {
    id: 'frontend',
    title: 'CLIENT_SIDE',
    color: 'cyan',
    icon: <FaNetworkWired />,
    content: [
      { name: "React.js", level: 90, logo: <SiReact />, meta: "SYS_GUI_CORE", brand: "#61DAFB" },
      { name: "Next.js", level: 85, logo: <SiNextdotjs />, meta: "APP_ROUTER_V14", brand: "#FFFFFF" },
      { name: "TypeScript", level: 80, logo: <SiTypescript />, meta: "STATIC_TYPING", brand: "#3178C6" },
      { name: "Tailwind CSS", level: 85, logo: <SiTailwindcss />, meta: "STYLE_ENGINE", brand: "#06B6D4" },
      { name: "Framer Motion", level: 75, logo: <SiFramer />, meta: "PHYSICS_ANIM", brand: "#0055FF" },
      { name: "Redux", level: 60, logo: <SiRedux />, meta: "STATE_MGMT", brand: "#764ABC" },
    ]
  },
  {
    id: 'backend',
    title: 'SERVER_OPS',
    color: 'green',
    icon: <FaServer />,
    content: [
      { name: "Node.js", level: 85, logo: <SiNodedotjs />, meta: "V8_RUNTIME", brand: "#339933" },
      { name: "Express.js", level: 85, logo: <SiExpress />, meta: "HTTP_SERVER", brand: "#FFFFFF" },
      { name: "Python", level: 75, logo: <SiPython />, meta: "DATA_PROCESS", brand: "#3776AB" },
      { name: "GraphQL", level: 70, logo: <SiGraphql />, meta: "QUERY_LANG", brand: "#E10098" },
      { name: "REST APIs", level: 90, logo: <FaServer />, meta: "ENDPOINT_CTRL", brand: "#00FFCC" },
      { name: "Java", level: 65, logo: <FaJava />, meta: "JVM_RUNTIME", brand: "#ED8B00" },
    ]
  },
  {
    id: 'database',
    title: 'DATA_LAYER',
    color: 'yellow',
    icon: <FaDatabase />,
    content: [
      { name: "PostgreSQL", level: 85, logo: <SiPostgresql />, meta: "RELATIONAL_DB", brand: "#4169E1" },
      { name: "MySQL", level: 80, logo: <SiMysql />, meta: "STRUCTURED_SQL", brand: "#4479A1" },
      { name: "SQL Server", level: 70, logo: <FaDatabase />, meta: "T-SQL_ENGINE", brand: "#CC292B" },
      { name: "MongoDB", level: 85, logo: <SiMongodb />, meta: "NOSQL_DATA", brand: "#47A248" },
      { name: "Redis", level: 75, logo: <SiRedis />, meta: "IN_MEMORY_CACHE", brand: "#DC382D" },
      { name: "Supabase", level: 80, logo: <SiSupabase />, meta: "BAAS_PLATFORM", brand: "#3ECF8E" },
    ]
  },
  {
    id: 'devops',
    title: 'PIPELINE',
    color: 'purple',
    icon: <FaCodeBranch />,
    content: [
      { name: "Git / GitHub", level: 90, logo: <FaGithub />, meta: "VERSION_CTRL", brand: "#FFFFFF" },
      { name: "Docker", level: 50, logo: <SiDocker />, meta: "CONTAINERS", brand: "#2496ED" },
      { name: "Linux CLI", level: 70, logo: <SiLinux />, meta: "SYS_ADMIN", brand: "#FCC624" },
      { name: "AWS", level: 60, logo: <FaAws />, meta: "CLOUD_HOST", brand: "#FF9900" },
      { name: "CI/CD Actions", level: 65, logo: <SiGithubactions />, meta: "AUTO_DEPLOY", brand: "#2088FF" },
      { name: "Vercel", level: 92, logo: <SiVercel />, meta: "EDGE_NETWORK", brand: "#FFFFFF" },
    ]
  },
  {
    id: 'dsa',
    title: 'CORE_LOGIC',
    color: 'blue',
    icon: <FaBrain />,
    content: [
      { name: "C++", level: 85, logo: <SiCplusplus />, meta: "LOW_LEVEL_MEM", brand: "#00599C" },
      { name: "Data Structures", level: 80, logo: <FaBrain />, meta: "MEM_ALLOCATION", brand: "#FF00FF" },
      { name: "Graph Algos", level: 60, logo: <FaNetworkWired />, meta: "PATHFINDING", brand: "#00FFFF" },
      { name: "Time Complexity", level: 75, logo: <FaClock />, meta: "BIG_O_OPTIMIZE", brand: "#FFD700" },
      { name: "Object Oriented", level: 85, logo: <FaCube />, meta: "ENCAPSULATION", brand: "#FF4500" },
      { name: "Problem Solving", level: 90, logo: <FaLaptopCode />, meta: "LOGIC_GATES", brand: "#00FF00" },
    ]
  }
];

// Tailwind safely compiled theme strings
const themeColors = {
  cyan: { 
    text: "text-cyan-400", bg: "bg-cyan-400", glow: "shadow-[0_0_15px_rgba(6,182,212,0.5)]", 
    border: "border-cyan-500/30", hoverBorder: "hover:border-cyan-500/50", hoverPanel: "hover:bg-cyan-950/30" 
  },
  green: { 
    text: "text-green-400", bg: "bg-green-400", glow: "shadow-[0_0_15px_rgba(34,197,94,0.5)]", 
    border: "border-green-500/30", hoverBorder: "hover:border-green-500/50", hoverPanel: "hover:bg-green-950/30" 
  },
  yellow: { 
    text: "text-yellow-400", bg: "bg-yellow-400", glow: "shadow-[0_0_15px_rgba(250,204,21,0.5)]", 
    border: "border-yellow-500/30", hoverBorder: "hover:border-yellow-500/50", hoverPanel: "hover:bg-yellow-950/30" 
  },
  purple: { 
    text: "text-purple-400", bg: "bg-purple-400", glow: "shadow-[0_0_15px_rgba(168,85,247,0.5)]", 
    border: "border-purple-500/30", hoverBorder: "hover:border-purple-500/50", hoverPanel: "hover:bg-purple-950/30" 
  },
  blue: { 
    text: "text-blue-400", bg: "bg-blue-400", glow: "shadow-[0_0_15px_rgba(59,130,246,0.5)]", 
    border: "border-blue-500/30", hoverBorder: "hover:border-blue-500/50", hoverPanel: "hover:bg-blue-950/30" 
  }
};

const Skills = () => {
  const [activeTab, setActiveTab] = useState(systemModules[0].id);
  const activeData = systemModules.find(m => m.id === activeTab);
  const activeTheme = themeColors[activeData.color];

  return (
    <section id="skills" className="w-full py-12 bg-transparent text-white font-mono relative overflow-hidden flex justify-center">
      
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-4xl w-full px-6 relative z-10">
        
        {/* Compact Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaTerminal className="text-gray-500 text-sm" />
            <h2 className="text-2xl font-black uppercase tracking-widest text-gray-200">
              Tech <span className={`transition-colors duration-500 ${activeTheme.text}`}>Stack</span>
            </h2>
          </div>
          <span className="text-[10px] text-gray-500 tracking-[0.2em] uppercase hidden md:block animate-pulse">
            System_Optimized
          </span>
        </div>

        {/* The Main "Data Core" Glass Panel */}
        <div className={`relative bg-black/40 backdrop-blur-2xl border transition-colors duration-500 rounded-2xl overflow-hidden ${activeTheme.border}`}>
          
          {/* Navigation "Ribbon" */}
          <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-800/50 p-2 relative z-20 bg-black/40">
            {systemModules.map((module) => {
              const isActive = activeTab === module.id;
              return (
                <button
                  key={module.id}
                  onClick={() => setActiveTab(module.id)}
                  className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors duration-300 z-10 whitespace-nowrap ${
                    isActive ? 'text-black' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {/* The Buttery Smooth Sliding Pill Animation */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className={`absolute inset-0 rounded-xl ${themeColors[module.color].bg} ${themeColors[module.color].glow}`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  <span className={`text-sm ${isActive ? 'text-black' : 'text-gray-500'}`}>{module.icon}</span>
                  {module.title}
                </button>
              );
            })}
          </div>

          {/* Fixed Height Content Area */}
          <div className="min-h-[320px] p-6 md:p-8 relative">
            
            {/* Faint Background Icon */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`icon-${activeData.id}`}
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 0.04, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                transition={{ duration: 0.5 }}
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[240px] pointer-events-none ${activeTheme.text}`}
              >
                {activeData.icon}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, staggerChildren: 0.05 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 relative z-10"
              >
                {activeData.content.map((skill, index) => (
                  <motion.div 
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 300 }}
                    className={`flex flex-col gap-2 group p-2 rounded-lg border border-transparent ${activeTheme.hoverBorder} ${activeTheme.hoverPanel} transition-all duration-300`}
                  >
                    
                    <div className="flex items-center gap-3">
                      {/* REAL BRAND COLOR Logo Box */}
                      <div 
                        className={`p-2.5 rounded-md bg-black/60 border border-gray-800 transition-all duration-300 text-lg group-hover:scale-110`}
                        style={{ 
                          color: skill.brand, 
                          boxShadow: `inset 0 0 10px rgba(0,0,0,0.5)`,
                          filter: `drop-shadow(0 0 6px ${skill.brand}40)` 
                        }}
                      >
                        {skill.logo}
                      </div>
                      
                      {/* Skill Name & Meta Data */}
                      <div className="flex-1 flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-gray-200 text-sm font-bold tracking-wide group-hover:text-white transition-colors">
                            {skill.name}
                          </span>
                          <span className="text-[9px] text-gray-500 tracking-[0.15em] mt-0.5 group-hover:text-gray-400 transition-colors">
                            {skill.meta}
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${activeTheme.text} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}>
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Ultra-sleek "Data Packet" Progress Line */}
                    <div className="h-[3px] w-full bg-gray-800/60 rounded-full overflow-hidden relative flex items-center mt-1">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2 + (index * 0.1), type: "spring", stiffness: 100 }}
                        className={`absolute left-0 h-full rounded-full ${activeTheme.bg}`}
                      >
                        {/* Glowing "Head" of the data line */}
                        <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#fff]`}></div>
                      </motion.div>
                    </div>

                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Skills;

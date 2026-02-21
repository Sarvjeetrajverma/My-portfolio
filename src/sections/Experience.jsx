import React from 'react';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaGraduationCap, FaSchool, FaAtom, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const experiences = [
  {
    id: "01",
    role: "B.Tech (CSE)",
    institution: "Katihar Engineering College",
    period: "2023 - Present",
    status: "SYS_ACTIVE",
    color: "cyan",
    icon: <FaLaptopCode />,
    details: [
      { label: "Performance", value: "8.03 CGPA (Aggregate)" },
      { label: "Leadership", value: "Lead Coordinator - TechFusion'26" },
      { label: "Roles", value: "Core Team & Technical Team Lead" },
      { label: "Focus", value: "Full Stack Dev" }
    ]
  },
  {
    id: "02",
    role: "JEE Scholar",
    institution: "Magadh Super 30, Gaya",
    period: "2020 - 2022",
    status: "ARCHIVED",
    color: "orange",
    icon: <FaAtom />,
    details: [
      { label: "Mentorship", value: "Under Ex-DGP Abhiyanand Sir" },
      { label: "Program", value: "Residential Coaching" },
      { label: "Focus", value: "Advanced Physics & Math" }
    ]
  },
  {
    id: "03",
    role: "Intermediate (Science)",
    institution: "S.S. College Jehanabad",
    period: "2020 - 2022",
    status: "ARCHIVED",
    color: "purple",
    icon: <FaGraduationCap />,
    details: [
      { label: "Stream", value: "Physics, Chemistry, Math" },
      { label: "Focus", value: "Engineering Entrance Prep" },
      { label: "Skills", value: "Analytical Problem Solving" }
    ]
  },
  {
    id: "04",
    role: "High School",
    institution: "+2 High School,Ghosi",
    period: "2019 - 2020",
    status: "ARCHIVED",
    color: "blue",
    icon: <FaSchool />,
    details: [
      { label: "Grade", value: "Distinction Achieved" },
      { label: "Extra", value: "School Sports Captain" },
      { label: "Events", value: "Science Exhibition Winner" }
    ]
  }
];

// Tech "Boot-up" Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20, filter: "brightness(0) contrast(200%)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    filter: "brightness(1) contrast(100%)",
    transition: { type: "spring", stiffness: 200, damping: 15 }
  }
};

// Color mapping for dynamic neon glows
const neonColors = {
  cyan: "text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
  orange: "text-orange-400 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.3)]",
  purple: "text-purple-400 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]",
  blue: "text-blue-400 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
};

const hoverGlow = {
  cyan: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] group-hover:border-cyan-400",
  orange: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] group-hover:border-orange-400",
  purple: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] group-hover:border-purple-400",
  blue: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] group-hover:border-blue-400"
};

// Fixed bar heights to avoid re-render issues
const barHeights = [8, 12, 6, 10];

const Experience = () => {
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth * 0.85;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="experience" className="w-full py-20 bg-transparent text-white relative overflow-hidden font-sans">
      
      {/* HUD Dot Matrix Background - Kept the dots for the tech vibe, but no solid background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* REMOVED: The black/30 gradient fade has been entirely removed 
        so it doesn't darken your custom background. 
      */}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Terminal Header */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-800/50 pb-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 text-cyan-500 font-mono text-sm tracking-widest">
              <span className="w-2 h-2 bg-cyan-500 animate-pulse"></span>
              <span>// -- ACADEMICS TIMELINES :</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-100 flex items-center gap-3 drop-shadow-md">
              Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Logs</span>
              <span className="animate-pulse text-cyan-500">_</span>
            </h2>
          </div>

          <div className="flex gap-2">
            {/* REMOVED: bg-black/50 and backdrop-blur. Now 100% transparent */}
            <button onClick={() => scroll('left')} className="p-3 bg-transparent border border-gray-700/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all font-mono">
              <FaChevronLeft />
            </button>
            <button onClick={() => scroll('right')} className="p-3 bg-transparent border border-gray-700/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all font-mono">
              <FaChevronRight />
            </button>
          </div>
        </motion.div>

        {/* HUD Grid Container */}
        <motion.div 
          ref={scrollContainerRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide"
        >
          {experiences.map((exp) => (
            <motion.div
              key={exp.id}
              variants={cardVariants}
              className={`min-w-[85vw] md:min-w-0 snap-center flex-shrink-0 group relative bg-transparent border ${neonColors[exp.color]} ${hoverGlow[exp.color]} transition-all duration-500 ease-out`}
            >
              {/* HUD Brackets (Corners) */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/30 group-hover:border-white transition-colors"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/30 group-hover:border-white transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/30 group-hover:border-white transition-colors"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/30 group-hover:border-white transition-colors"></div>

              {/* Top Status Bar */}
              <div className="flex justify-between items-center px-4 py-2 border-b border-gray-800/50 bg-transparent">
                <span className="text-[10px] font-mono text-gray-400 tracking-widest">ID: {exp.id}</span>
                <span className={`text-[10px] font-mono font-bold tracking-widest flex items-center gap-1.5 ${exp.status === 'SYS_ACTIVE' ? 'text-green-400' : 'text-gray-500'}`}>
                  {exp.status === 'SYS_ACTIVE' && <span className="w-1.5 h-1.5 bg-green-400 animate-pulse"></span>}
                  [{exp.status}]
                </span>
              </div>

              <div className="p-6">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`text-3xl ${neonColors[exp.color].split(' ')[0]} drop-shadow-[0_0_8px_currentColor]`}>
                    {exp.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-100 leading-tight drop-shadow-md">
                      {exp.role}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono mt-1 flex items-center gap-1">
                      <span className="text-gray-500">@</span> {exp.institution}
                    </p>
                  </div>
                </div>

                {/* Data List (Terminal Style) */}
                <div className="space-y-3 font-mono text-xs">
                  {exp.details.map((detail, i) => (
                    <div key={i} className="flex flex-col gap-1 border-l border-gray-700/50 pl-3 group-hover:border-gray-400 transition-colors">
                      <span className="text-gray-400 uppercase flex items-center gap-2">
                        <span className="text-gray-600">{'>'}</span> {detail.label}
                      </span>
                      <span className="text-gray-200 font-medium tracking-wide drop-shadow-sm">{detail.value}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Timeline */}
                <div className="mt-8 flex justify-between items-end">
                  <div className="flex space-x-1">
                    {barHeights.map((height, i) => (
                      <div key={i} className="w-1 bg-gray-700/50 group-hover:bg-cyan-400 transition-all" style={{ height: `${height}px` }}></div>
                    ))}
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 bg-transparent border border-gray-700/50 ${neonColors[exp.color].split(' ')[0]}`}>
                    {exp.period}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Experience;
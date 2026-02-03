import React from 'react';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaGraduationCap, FaSchool, FaTrophy, FaUsers, FaMicrochip } from 'react-icons/fa';

const experiences = [
  {
    id: "01",
    role: "B.Tech (CSE)",
    institution: "Katihar Engineering College",
    period: "2023 - Present",
    status: "Current",
    color: "cyan",
    icon: <FaLaptopCode />,
    details: [
      { label: "Performance", value: "8.03 CGPA (Aggregate)" },
      { label: "Leadership", value: "Lead Coordinator - TechFusion'26" },
      { label: "Roles", value: "Core Team & Technical Team Lead" },
      { label: "Focus", value: "Full Stack Dev " }
    ]
  },
  {
    id: "02",
    role: "Intermediate (Science)",
    institution: "S.S. College Jehanabad",
    period: "2020 - 2022",
    status: "Completed",
    color: "purple",
    icon: <FaGraduationCap />,
    details: [
      { label: "Stream", value: "Physics, Chemistry, Math" },
      { label: "Focus", value: "Engineering Entrance Prep" },
      { label: "Skills", value: "Analytical Problem Solving" }
    ]
  },
  {
    id: "03",
    role: "High School",
    institution: "+2 High School,Ghosi",
    period: "2019 - 2020",
    status: "Completed",
    color: "blue",
    icon: <FaSchool />,
    details: [
      { label: "Grade", value: "Distinction Achieved" },
      { label: "Extra", value: "School Sports Captain" },
      { label: "Events", value: "Science Exhibition Winner" }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const Experience = () => {
  return (
    <section id="experience" className="w-full py-20 text-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex items-center gap-4"
        >
          <div className="h-1 w-12 bg-cyan-500 rounded-full"></div>
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">
            Academic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Timeline</span>
          </h2>
        </motion.div>

        {/* Grid Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {experiences.map((exp) => (
            <motion.div
              key={exp.id}
              variants={cardVariants}
              className="group relative bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
            >
              {/* Top Colored Bar */}
              <div className={`h-1 w-full bg-gradient-to-r ${
                exp.color === 'cyan' ? 'from-cyan-500 to-blue-500' : 
                exp.color === 'purple' ? 'from-purple-500 to-pink-500' : 
                'from-blue-500 to-indigo-500'
              }`} />

              <div className="p-6">
                
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-xl bg-gray-800 border border-gray-700 text-xl ${
                    exp.color === 'cyan' ? 'text-cyan-400' : 
                    exp.color === 'purple' ? 'text-purple-400' : 'text-blue-400'
                  }`}>
                    {exp.icon}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-4xl font-black text-gray-800 group-hover:text-gray-700 transition-colors select-none">
                      {exp.id}
                    </span>
                    {/* Status Badge */}
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      exp.status === 'Current' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                        : 'bg-gray-700/30 text-gray-400 border-gray-600'
                    }`}>
                      {exp.status === 'Current' && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>}
                      {exp.status}
                    </div>
                  </div>
                </div>

                {/* Role Title */}
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {exp.role}
                </h3>
                <p className="text-sm text-gray-400 font-mono mb-6 flex items-center gap-2">
                  <span className="text-gray-500">@</span> {exp.institution}
                </p>

                {/* Details List (Mini Data Grid) */}
                <div className="space-y-3 bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
                  {exp.details.map((detail, i) => (
                    <div key={i} className="flex justify-between items-start text-sm border-b border-gray-700/30 last:border-0 pb-2 last:pb-0 gap-4">
                      <span className="text-gray-500 font-mono text-xs uppercase pt-0.5">{detail.label}</span>
                      <span className="text-gray-200 text-right font-medium">{detail.value}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Date */}
                <div className="mt-6 pt-4 border-t border-gray-700/30 flex justify-between items-center text-xs text-gray-500 font-mono">
                  <span>TIMELINE</span>
                  <span className="text-cyan-500/80">{exp.period}</span>
                </div>

              </div>

              {/* Decorative Corner Cut (Cyberpunk Style) */}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-800/50 rotate-45 translate-x-4 translate-y-4 group-hover:bg-cyan-500/20 transition-colors"></div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Experience;
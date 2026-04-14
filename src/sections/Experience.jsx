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
      { label: "Performance", value: "7.92 CGPA (Aggregate)" },
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
    institution: "+2 High School, Ghosi",
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

const ease = [0.22, 1, 0.36, 1];

const Experience = () => {
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -(window.innerWidth * 0.85) : window.innerWidth * 0.85,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="experience" className="relative w-full bg-transparent text-white overflow-hidden py-5 md:py-8 lg:py-10 font-sans">

      {/* Ambient glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/2" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="max-w-[1100px] mx-auto px-6 md:px-10 relative z-10">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-8 md:mb-10"
        >
          Academics Timeline
        </motion.p>

        {/* Headline */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] leading-[0.95] font-medium tracking-tighter text-white mb-10 md:mb-14"
          >
            Data <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Logs.</span>
          </motion.h2>

          {/* Scroll nav */}
          <div className="flex md:hidden gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-white/[0.08] text-slate-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center">
              <FaChevronLeft size={12} />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-white/[0.08] text-slate-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center">
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Cards grid */}
        <motion.div
          ref={scrollContainerRef}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05] overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide"
        >
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className="min-w-[85vw] md:min-w-0 snap-center flex-shrink-0 group relative card-frosted p-8 hover:bg-white/[0.05] transition-colors duration-500"
            >
              {/* ID & Status */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-mono text-slate-700 tracking-widest">ID: {exp.id}</span>
                <span className={`text-[10px] font-mono tracking-widest flex items-center gap-1.5 ${exp.status === 'SYS_ACTIVE' ? 'text-emerald-500' : 'text-slate-700'}`}>
                  {exp.status === 'SYS_ACTIVE' && <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />}
                  [{exp.status}]
                </span>
              </div>

              {/* Icon & Title */}
              <div className="mb-8">
                <div className="text-slate-500 mb-4 group-hover:text-slate-300 transition-colors text-2xl">{exp.icon}</div>
                <h3 className="text-white text-2xl font-medium tracking-tight leading-tight mb-2">{exp.role}</h3>
                <p className="text-slate-400 text-sm font-light">@ {exp.institution}</p>
              </div>

              {/* Details list */}
              <div className="space-y-5 border-t border-white/[0.05] pt-6">
                {exp.details.map((detail, j) => (
                  <div key={j}>
                    <span className="text-[11px] tracking-widest text-slate-600 uppercase font-medium">{detail.label}</span>
                    <p className="text-slate-200 text-base font-light mt-1">{detail.value}</p>
                  </div>
                ))}
              </div>

              {/* Period */}
              <div className="mt-8 pt-6 border-t border-white/[0.05]">
                <span className="text-sm font-mono text-slate-500">{exp.period}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Experience;
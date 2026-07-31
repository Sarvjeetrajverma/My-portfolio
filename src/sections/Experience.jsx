import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaGraduationCap, FaSchool, FaAtom, FaChevronLeft, FaChevronRight, FaBrain, FaArrowRight, FaBriefcase, FaCode, FaRocket } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

const iconMap = {
  FaLaptopCode: <FaLaptopCode />,
  FaGraduationCap: <FaGraduationCap />,
  FaSchool: <FaSchool />,
  FaAtom: <FaAtom />,
  FaBrain: <FaBrain />,
  FaBriefcase: <FaBriefcase />,
  FaCode: <FaCode />,
  FaRocket: <FaRocket />
};

const ease = [0.22, 1, 0.36, 1];

const Experience = () => {
  const scrollContainerRef = React.useRef(null);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'experiences'), (snapshot) => {
      let data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      data.sort((a, b) => (b.order || 0) - (a.order || 0));
      setExperiences(data);
    });
    return () => unsub();
  }, []);

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

      {/* Ambient glow & Data Grid */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/2 md:blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 w-full h-full bg-grid pointer-events-none opacity-[0.15]" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }} />

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
            Data <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--theme-stroke)' }}>Logs.</span>
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

        {/* Cards grid wrapper for cinematic edge masking on mobile */}
        <div className="relative w-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] md:[mask-image:none]">
          
          {/* Mobile Swipe Hint */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: [0, 1, 1, 1, 0], x: [20, 0, 0, 0, 10] }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            transition={{ duration: 4, times: [0, 0.1, 0.7, 0.9, 1] }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 md:hidden flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-2xl pointer-events-none"
          >
            <span className="text-white/80 text-[11px] font-bold tracking-widest uppercase">Swipe</span>
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            >
              <FaArrowRight size={14} className="text-white" />
            </motion.div>
          </motion.div>

          <motion.div
            ref={scrollContainerRef}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05] overflow-x-auto md:overflow-visible pb-8 pt-4 px-6 -mx-6 md:px-0 md:mx-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className="min-w-[85vw] md:min-w-0 snap-center flex-shrink-0 group relative card-frosted p-8 transition-colors duration-500 bg-black"
            >
              {/* ID & Status */}
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-mono text-slate-700 tracking-widest">ID: {String(i + 1).padStart(2, '0')}</span>
                <span className={`text-[10px] font-mono tracking-widest flex items-center gap-1.5 ${exp.status === 'SYS_ACTIVE' ? 'text-emerald-500' : 'text-slate-700'}`}>
                  {exp.status === 'SYS_ACTIVE' && <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />}
                  [{exp.status}]
                </span>
              </div>

              {/* Icon & Title */}
              <div className="mb-8">
                <div className="text-slate-500 mb-4 group-hover:text-slate-300 transition-colors text-2xl">
                  {iconMap[exp.iconString] || <FaBriefcase />}
                </div>
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

      </div>
    </section>
  );
};

export default Experience;
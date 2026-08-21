import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'experiences'), (snapshot) => {
      let data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      data.sort((a, b) => (b.order || 0) - (a.order || 0));
      setExperiences(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
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
          Experience Timeline
        </motion.p>

        {/* Headline */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] leading-[0.95] font-medium tracking-tighter text-white mb-10 md:mb-14"
          >
            Work <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--theme-stroke)' }}>Experience.</span>
          </motion.h2>
        </div>

        {/* Vertical Timeline */}
        <div ref={containerRef} className="relative ml-4 md:ml-8 pl-8 md:pl-12 py-4 space-y-12">
          
          {/* Static Background Line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
          
          {/* Animated Tracking Line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-[-1px] top-0 w-[3px] bg-gradient-to-b from-emerald-400 via-emerald-500 to-transparent shadow-[0_0_15px_3px_rgba(16,185,129,0.5)] origin-top z-0 rounded-full"
          />

          {loading ? (
            /* Skeleton Loading State */
            [1, 2, 3].map(i => (
              <div key={i} className="relative">
                <div className="absolute -left-[41px] md:-left-[57px] top-6 w-4 h-4 rounded-full bg-white/5 border border-white/10" />
                <div className="w-full max-w-3xl bg-white/[0.02] border border-white/[0.05] rounded-[2rem] p-6 md:p-8 animate-pulse flex items-start gap-4 md:gap-6">
                  <div className="w-8 h-8 bg-white/5 rounded-full shrink-0" />
                  <div className="flex-1">
                    <div className="h-6 bg-white/5 rounded w-1/2 mb-3" />
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, ease, delay: i * 0.08 }}
                className="relative group"
              >
                {/* Timeline Node */}
                <div className={`absolute -left-[41px] md:-left-[57px] top-6 w-4 h-4 rounded-full border-2 transition-colors duration-500 ${exp.status === 'SYS_ACTIVE' ? 'border-emerald-500 bg-emerald-500/20' : 'border-white/20 bg-black group-hover:border-emerald-500/50'} z-10`} />
                
                {/* Expandable Card */}
                <div 
                  onClick={() => toggleExpand(exp.id)}
                  className={`w-full max-w-3xl rounded-[2rem] transition-all duration-500 cursor-pointer overflow-hidden border backdrop-blur-xl ${
                    expandedId === exp.id 
                      ? 'bg-white/[0.04] border-white/20 shadow-xl' 
                      : 'bg-transparent border-white/[0.08] hover:border-white/15 hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Header (Always Visible) */}
                  <div className="p-6 md:p-8 flex items-start gap-4 md:gap-6">
                    <div className="text-slate-500 group-hover:text-slate-300 transition-colors duration-500 text-3xl shrink-0 mt-1">
                      {iconMap[exp.iconString] || <FaBriefcase />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-xl md:text-2xl font-medium tracking-tight mb-1.5">{exp.role}</h3>
                      <p className="text-slate-400 text-sm font-light">{exp.institution} • {exp.period}</p>
                    </div>
                    {/* Status indicator */}
                    <div className={`text-[10px] font-mono tracking-widest hidden md:flex items-center gap-1.5 ${exp.status === 'SYS_ACTIVE' ? 'text-emerald-500' : 'text-slate-600'}`}>
                      {exp.status === 'SYS_ACTIVE' && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                      [{exp.status}]
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <AnimatePresence>
                    {expandedId === exp.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="px-6 md:px-8 pb-6 md:pb-8 border-t border-white/[0.05] pt-6"
                      >
                        <div className="space-y-6">
                          {exp.details.map((detail, j) => (
                            <div key={j}>
                              <span className="text-[11px] tracking-widest text-slate-500 uppercase font-medium">{detail.label}</span>
                              <p className="text-slate-200 text-sm md:text-base font-light mt-1.5 leading-relaxed">{detail.value}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default Experience;
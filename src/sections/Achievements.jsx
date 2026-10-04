import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FaLaptopCode, FaGraduationCap, FaSchool, FaAtom, FaChevronLeft, FaChevronRight, FaBrain, FaArrowRight, FaBriefcase, FaCode, FaRocket, FaExternalLinkAlt, FaImage } from 'react-icons/fa';
import ImageModal from '../components/ImageModal';

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



const Achievements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'achievements'), (snapshot) => {
      let data = [];
      snapshot.forEach(doc => {
        data.push({ ...doc.data(), id: doc.id });
      });
      data.sort((a, b) => (b.order || 0) - (a.order || 0));
      setItems(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching achievements:", error);
      setItems([]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <section id="achievements" className="relative w-full bg-transparent text-white overflow-hidden py-5 md:py-8 lg:py-10 font-sans">
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/2 md:blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />
      <div className="max-w-[1100px] mx-auto px-6 md:px-10 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-8 md:mb-10"
        >
          Trophies & Accolades
        </motion.p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] leading-[0.95] font-medium tracking-tighter text-white mb-8 md:mb-10"
          >
            My <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--theme-stroke)' }}>Achievements.</span>
          </motion.h2>
        </div>
        <div ref={containerRef} className="relative ml-4 md:ml-6 pl-6 md:pl-8 py-2 space-y-5">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-[-1px] top-0 w-[3px] bg-gradient-to-b from-emerald-400 via-emerald-500 to-transparent shadow-[0_0_15px_3px_rgba(16,185,129,0.5)] origin-top z-0 rounded-full"
          />
          {loading ? (
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
            items.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30, scale: 0.95 }} 
                whileInView={{ opacity: 1, x: 0, scale: 1 }} 
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.4, delay: i * 0.1 }}
                whileHover={{ x: 6 }}
                className="relative group"
              >
                <div className={`absolute -left-[33px] md:-left-[41px] top-6 w-3.5 h-3.5 rounded-full border-2 transition-colors duration-500 ${exp.status === 'SYS_ACTIVE' ? 'border-emerald-500 bg-emerald-500/20' : 'border-white/20 bg-black group-hover:border-emerald-500/50'} z-10`} />
                <div 
                  onClick={() => toggleExpand(exp.id)}
                  className={`w-full max-w-3xl rounded-[1.25rem] transition-all duration-500 cursor-pointer overflow-hidden border backdrop-blur-xl ${
                    expandedId === exp.id 
                      ? 'bg-white/[0.04] border-white/20 shadow-md' 
                      : 'bg-transparent border-white/[0.08] hover:border-white/15 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="p-5 md:p-6 flex items-start gap-3 md:gap-4">
                    <div className="text-slate-500 group-hover:text-slate-300 transition-colors duration-500 text-2xl shrink-0 mt-0.5">
                      {iconMap[exp.iconString] || <FaRocket />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white text-lg md:text-xl font-medium tracking-tight mb-1">{exp.role}</h3>
                      <p className="text-slate-400 text-xs md:text-sm font-light">{exp.institution} • {exp.period}</p>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedId === exp.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="px-5 md:px-6 pb-5 md:pb-6 border-t border-white/[0.05] pt-4"
                      >
                        <div className="space-y-4">
                          {exp.details && exp.details.map((detail, j) => (
                            <div key={j}>
                              <span className="text-[10px] tracking-widest text-slate-500 uppercase font-medium">{detail.label}</span>
                              <p className="text-slate-200 text-sm md:text-sm font-light mt-1 leading-relaxed">{detail.value}</p>
                            </div>
                          ))}

                          {(exp.certificateImage || exp.link) && (
                            <div className="pt-4 mt-4 border-t border-white/[0.05] flex flex-wrap gap-3">
                              {exp.certificateImage && (
                                <button 
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setSelectedImage(exp.certificateImage); }}
                                  className="flex items-center gap-2 text-xs md:text-sm bg-white/5 hover:bg-white/10 text-emerald-400 px-4 py-2 rounded-lg transition-colors border border-white/5 cursor-pointer"
                                >
                                  <FaImage /> View Certificate
                                </button>
                              )}
                              {exp.link && (
                                <a 
                                  href={exp.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="flex items-center gap-2 text-xs md:text-sm bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-lg transition-colors border border-emerald-500/20"
                                >
                                  <FaExternalLinkAlt /> Open Link
                                </a>
                              )}
                            </div>
                          )}
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

      <ImageModal 
        src={selectedImage} 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
      />
    </section>
  );
};

export default Achievements;
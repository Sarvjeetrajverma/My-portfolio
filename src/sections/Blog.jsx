import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiFileText } from 'react-icons/fi';

const ease = [0.22, 1, 0.36, 1];

export default function Blog() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), where('published', '==', true));
    const unsub = onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setBlogs(data.slice(0, 3)); // Only show latest 3 on homepage
    });
    return () => unsub();
  }, []);

  // Removed the empty check so the UI always shows at least placeholders.

  return (
    <section id="notes" className="relative w-full bg-transparent text-white py-20 lg:py-32 overflow-hidden font-sans">
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full pointer-events-none -translate-y-1/2 md:blur-[80px]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.03) 0%, transparent 70%)' }} />

      <div className="max-w-[1100px] mx-auto px-6 md:px-10 relative z-10">
        
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-4 md:mb-6"
        >
          Technical Notes
        </motion.p>

        {/* Headline */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6 md:mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 1, ease }}
            className="text-[3rem] sm:text-[4.5rem] md:text-[5rem] lg:text-[6rem] leading-[0.95] font-medium tracking-tighter text-white"
          >
            Deep <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--theme-stroke)' }}>Dives.</span>
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
          >
            <Link to="/blog" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors border border-white/10 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10">
              View all notes <FiArrowRight />
            </Link>
          </motion.div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex overflow-x-auto gap-6 pb-8 pt-4 px-6 -mx-6 md:px-0 md:mx-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {blogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex-none w-[80vw] sm:w-[320px] md:w-[360px] lg:w-[400px] snap-center h-full group bg-black/40 border border-white/10 border-dashed rounded-2xl overflow-hidden flex flex-col items-center justify-center p-10 min-h-[350px] transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.02]"
            >
              <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mb-6 border border-white/[0.05] group-hover:border-emerald-500/20 group-hover:bg-emerald-500/10 transition-colors duration-500">
                <FiFileText className="text-2xl text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">No Notes Yet</h3>
              <p className="text-sm text-slate-400 font-light text-center leading-relaxed">Your published deep dives will appear here. Head to the admin panel to create your first technical note.</p>
            </motion.div>
          ) : (
            blogs.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, ease, delay: idx * 0.1 }}
                className="flex-none w-[80vw] sm:w-[320px] md:w-[360px] lg:w-[400px] snap-center group relative card-frosted overflow-hidden transition-colors duration-500 bg-black rounded-2xl border border-white/[0.08]"
              >
                <Link to={`/blog/${blog.slug}`} className="block h-full flex flex-col">
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-black/60">
                    {blog.coverImage ? (
                      <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FiFileText className="text-4xl text-white/10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-2">
                        {(blog.tags || []).slice(0, 3).map(tag => (
                          <span key={tag} className="text-[9px] sm:text-[10px] font-mono uppercase text-emerald-400 border border-emerald-500/20 bg-black/60 backdrop-blur px-2 py-1 rounded-full tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-transparent to-white/[0.02]">
                    <h3 className="text-xl sm:text-2xl font-medium text-white mb-3 group-hover:text-emerald-400 transition-colors leading-tight tracking-tight">{blog.title}</h3>
                    <p className="text-sm sm:text-base text-slate-400 font-light line-clamp-3 mb-6 leading-relaxed">{blog.excerpt || (blog.content && blog.content.substring(0, 120) + '...')}</p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-white/[0.05] pt-5">
                      <span className="text-[11px] text-slate-500 font-mono tracking-widest uppercase">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-emerald-500 text-sm group-hover:translate-x-1 transition-transform flex items-center gap-2 font-medium"><span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">READ</span> <FiArrowRight /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

      </div>
    </section>
  );
}

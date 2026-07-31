import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiFileText, FiArrowLeft } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import CustomCursor from '../components/CustomCursor';
import ScrollToTop from '../components/ScrollToTop';

const ease = [0.22, 1, 0.36, 1];

export default function BlogIndex() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'blogs'), where('published', '==', true));
    const unsub = onSnapshot(q, (snapshot) => {
      let data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setBlogs(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <div className="relative min-h-screen bg-transparent text-white overflow-hidden font-sans">
      <CustomCursor />
      <Navbar />
      <ScrollToTop />
      
      <div className="absolute top-1/4 left-1/2 w-[800px] h-[800px] rounded-full pointer-events-none -translate-x-1/2" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 60%)', filter: 'blur(100px)' }} />

      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-32 relative z-10">
        
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-12">
          <FiArrowLeft /> Back to Home
        </Link>

        {/* Headline */}
        <div className="mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-white mb-6"
          >
            Technical <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--theme-stroke)' }}>Notes.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl font-light"
          >
            Deep dives, learnings, and thoughts on AI, software engineering, and robotics.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border border-white/10 border-dashed rounded-2xl bg-black/40">
            <FiFileText className="text-4xl text-white/10 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Notes Yet</h3>
            <p className="text-sm text-slate-400">Check back later for new articles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: idx * 0.1 }}
                className="group relative card-frosted overflow-hidden transition-colors duration-500 bg-black rounded-2xl border border-white/[0.08]"
              >
                <Link to={`/blog/${blog.slug}`} className="block h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden bg-black/60">
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
                          <span key={tag} className="text-[10px] font-mono uppercase text-emerald-400 border border-emerald-500/20 bg-black/60 backdrop-blur px-2 py-1 rounded-full tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-transparent to-white/[0.02]">
                    <h3 className="text-xl sm:text-2xl font-medium text-white mb-3 group-hover:text-emerald-400 transition-colors leading-tight tracking-tight">{blog.title}</h3>
                    <p className="text-sm text-slate-400 font-light line-clamp-3 mb-6 leading-relaxed">{blog.excerpt || (blog.content && blog.content.substring(0, 120) + '...')}</p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-white/[0.05] pt-5">
                      <span className="text-[11px] text-slate-500 font-mono tracking-widest uppercase">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="text-emerald-500 text-sm group-hover:translate-x-1 transition-transform flex items-center gap-2 font-medium"><span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">READ</span> <FiArrowRight /></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

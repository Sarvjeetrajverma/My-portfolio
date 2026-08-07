import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaXTwitter, FaArrowRight } from 'react-icons/fa6';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { InstagramEmbed, XEmbed } from 'react-social-media-embed';

const socialLinks = [
  { name: 'GitHub', icon: FaGithub, url: 'https://github.com/sarvjeetrajverma', action: 'Follow', color: 'group-hover:text-white' },
  { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com/in/sarvjeetrajverma', action: 'Connect', color: 'group-hover:text-[#0077b5]' },
  { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com/sarvjeetrajverma', action: 'Follow', color: 'group-hover:text-[#e4405f]' },
  { name: 'YouTube', icon: FaYoutube, url: 'https://youtube.com/@sarvjeetrajverma', action: 'Subscribe', color: 'group-hover:text-[#ff0000]' },
  { name: 'X', icon: FaXTwitter, url: 'https://twitter.com/itssarvjeet', action: 'Follow', color: 'group-hover:text-white' }
];

const ease = [0.22, 1, 0.36, 1];

const SocialMedia = () => {
  const [highlights, setHighlights] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const scrollRef = React.useRef(null);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'site_settings', 'social_highlights'), (docSnap) => {
      if (docSnap.exists()) {
        setHighlights(docSnap.data().posts || []);
      }
    });
    return () => unsub();
  }, []);

  return (
    <section id="social-media" className="relative w-full bg-transparent text-white py-5 md:py-8 border-t border-white/[0.06]">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12">

          {/* Left: label + headline */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-4"
            >
              Connect
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.05 }}
              className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tighter text-white leading-tight"
            >
              Follow the <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--theme-stroke)' }}>journey.</span>
            </motion.h2>
          </div>

          {/* Right: social links row */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.6, ease, delay: 0.1 }}
            className="flex flex-wrap gap-3"
          >
            {socialLinks.map((social, i) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.55, ease }}
                whileHover={{ y: -3 }}
                className="group flex items-center gap-3 px-5 py-3.5 border border-white/[0.08] hover:border-white/25 rounded-full transition-all duration-300 hover:bg-white/[0.04]"
              >
                <social.icon size={18} className={`text-slate-500 ${social.color} transition-colors duration-300 shrink-0`} />
                <span className={`text-sm sm:text-base font-medium text-slate-400 ${social.color} transition-colors duration-300`}>{social.action}</span>
                <span className="text-xs text-slate-700 tracking-wider font-light hidden sm:inline">{social.name}</span>
              </motion.a>
            ))}
          </motion.div>

        </div>

        {/* System online indicator */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center gap-2 mt-10"
        >
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] tracking-widest text-slate-700 font-mono uppercase">System Online</span>
        </motion.div>

        {/* Highlights Grid */}
        {highlights.length > 0 && (
          <div className="mt-20 pt-16 relative">
            {/* Elegant Divider */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent"></div>

            {/* Subtle Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/[0.02] rounded-full md:blur-[120px] pointer-events-none"></div>

            <motion.h3
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-[11px] tracking-[0.4em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 uppercase font-semibold mb-12 text-center relative z-10"
            >
              Featured Highlights
            </motion.h3>

            <motion.div 
              whileHover="hover"
              initial="initial"
              whileInView="inView"
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              className="relative w-full"
            >
              
              {/* Swipe Hint */}
              <motion.div 
                variants={{
                  initial: { opacity: 0, x: 30, scale: 0.9, filter: "blur(4px)" },
                  inView: { 
                    opacity: [0, 1, 1, 0], x: [30, 0, 0, -20], scale: [0.9, 1, 1, 0.95], filter: ["blur(4px)", "blur(0px)", "blur(0px)", "blur(4px)"],
                    transition: { duration: 3.5, times: [0, 0.15, 0.85, 1], ease: "easeOut" } 
                  },
                  hover: { 
                    opacity: [0, 1, 1, 0], x: [20, 0, 0, -20], scale: [0.95, 1, 1, 0.95], filter: ["blur(2px)", "blur(0px)", "blur(0px)", "blur(4px)"],
                    transition: { duration: 2.5, times: [0, 0.15, 0.8, 1], ease: "easeOut" } 
                  }
                }}
                className="absolute right-0 md:-right-10 lg:-right-16 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center w-[54px] h-[54px] bg-black/40 backdrop-blur-xl rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.5)] pointer-events-none"
              >
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                >
                  <FaArrowRight size={20} className="text-white/80" />
                </motion.div>
              </motion.div>

              <div 
                ref={scrollRef}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className={`flex overflow-x-auto gap-6 items-start relative z-10 pb-8 px-6 md:px-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] ${isDragging ? 'cursor-grabbing !scroll-auto !snap-none' : 'cursor-grab'}`}
              >
                {highlights.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -8, scale: 1.01 }}
                    className="group min-w-[85vw] sm:min-w-[400px] snap-center bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] hover:border-emerald-500/30 rounded-[2rem] p-5 md:p-7 transition-all duration-500 shadow-xl hover:shadow-emerald-500/10 backdrop-blur-xl shrink-0"
                  >
                    <div className="flex items-center gap-3 mb-7">
                      <div className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/[0.1] group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors duration-500 shadow-inner">
                        {post.platform === 'twitter' ? <FaXTwitter className="text-slate-300 group-hover:text-emerald-400 transition-colors" size={14} /> : <FiInstagram className="text-slate-300 group-hover:text-emerald-400 transition-colors" size={14} />}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-400 uppercase tracking-[0.25em] transition-colors duration-500">{post.platform}</span>
                    </div>

                    <div className="flex justify-center w-full relative">
                      {post.platform === 'twitter' && (
                        <div className="w-full overflow-hidden rounded-[1.25rem] bg-black/30 border border-white/[0.04] p-1.5 shadow-inner">
                          <XEmbed url={post.url.replace('twitter.com/x/status/', 'twitter.com/twitter/status/')} width="100%" />
                        </div>
                      )}
                      {post.platform === 'instagram' && (
                        <div className="w-full overflow-hidden rounded-[1.25rem] bg-black/30 border border-white/[0.04] p-1.5 shadow-inner">
                          <InstagramEmbed url={post.url} width="100%" style={{ background: 'transparent' }} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </section>
  );
};

export default SocialMedia;

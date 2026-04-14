import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';

const socialLinks = [
  { name: 'GitHub', icon: FaGithub, url: 'https://github.com/sarvjeetrajverma', action: 'Follow' },
  { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com/in/sarvjeetrajverma', action: 'Connect' },
  { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com/sarvjeetrajverma', action: 'Follow' },
  { name: 'YouTube', icon: FaYoutube, url: 'https://youtube.com/@sarvjeetrajverma', action: 'Subscribe' },
  { name: 'X', icon: FaXTwitter, url: 'https://twitter.com/itssarvjeet', action: 'Follow' }
];

const ease = [0.22, 1, 0.36, 1];

const SocialMedia = () => {
  return (
    <section id="social-media" className="relative w-full bg-transparent text-white py-5 md:py-8 border-t border-white/[0.06]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">

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
              Follow the <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>journey.</span>
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
                <social.icon size={18} className="text-slate-500 group-hover:text-white transition-colors duration-300 shrink-0" />
                <span className="text-sm sm:text-base font-medium text-slate-400 group-hover:text-white transition-colors duration-300">{social.action}</span>
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

      </div>
    </section>
  );
};

export default SocialMedia;

import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';

const socialLinks = [
  { name: 'GitHub', icon: FaGithub, url: 'https://github.com/sarvjeetrajverma', color: '#ffffff', action: 'FOLLOW' },
  { name: 'LinkedIn', icon: FaLinkedin, url: 'https://linkedin.com/in/sarvjeetrajverma', color: '#0077b5', action: 'CONNECT' },
  { name: 'Instagram', icon: FaInstagram, url: 'https://instagram.com/sarvjeetrajverma', color: '#e4405f', action: 'FOLLOW' },
  { name: 'YouTube', icon: FaYoutube, url: 'https://youtube.com/@sarvjeetrajverma', color: '#ff0000', action: 'SUBSCRIBE' },
  { name: 'X', icon: FaXTwitter, url: 'https://twitter.com/itssarvjeet', color: '#ffffff', action: 'FOLLOW' }
];

const SocialButton = ({ social, index }) => {
  return (
    <motion.a
      href={social.url}
      target="_blank"
      rel="noreferrer"
      className="relative flex items-center gap-2 px-3 py-1.5 rounded overflow-hidden group"
      style={{ 
        backgroundColor: `${social.color}10`,
        border: `1px solid ${social.color}40`
      }}
      initial={{ opacity: 0, x: -20, rotate: -2 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring" }}
      whileHover={{ 
        scale: 1.08, 
        borderColor: social.color,
        boxShadow: `0 0 15px ${social.color}60`,
        rotate: 1
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: social.color }}
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.5, opacity: 0.15 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Icon */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          scale: { duration: 2, repeat: Infinity },
          rotate: { duration: 3, repeat: Infinity }
        }}
      >
        <social.icon className="text-sm relative z-10" style={{ color: social.color }} />
      </motion.div>
      
      {/* Action text */}
      <span className="text-xs font-mono font-bold relative z-10" style={{ color: social.color }}>
        {social.action}
      </span>
      
      {/* Corner accents */}
      <motion.div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-current" style={{ color: social.color }} />
      <motion.div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-current" style={{ color: social.color }} />
    </motion.a>
  );
};

const SocialMedia = () => {
  return (
    <section id="social-media" className="w-full py-6 text-white">

      <div className="max-w-sm mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <motion.div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div key={i} className="w-1 h-1 bg-teal-400 rounded-full" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }} />
            ))}
          </motion.div>
          <span className="text-xs font-mono text-teal-400">CONNECT</span>
        </div>

        {/* Buttons Row */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          {socialLinks.map((social, index) => (
            <SocialButton key={social.name} social={social} index={index} />
          ))}
        </motion.div>

        {/* Status */}
        <div className="text-center mt-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            SYSTEM_ONLINE
          </span>
        </div>
      </div>
    </section>
  );
};

export default SocialMedia;

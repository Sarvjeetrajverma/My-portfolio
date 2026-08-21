import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaXTwitter, FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa6";
import { trackEvent } from '../hooks/useGlobalAnalytics';

const socials = [
  { icon: FaXTwitter, label: "X", link: "https://twitter.com/itssarvjeet", colorClass: "text-white" },
  { icon: FaLinkedinIn, label: "LinkedIn", link: "https://www.linkedin.com/in/sarvjeetrajverma/", colorClass: "text-[#0A66C2]" },
  { icon: FaGithub, label: "GitHub", link: "https://www.github.com/sarvjeetrajverma", colorClass: "text-white" },
  { icon: FaInstagram, label: "Instagram", link: "https://www.instagram.com/sarvjeetrajverma", colorClass: "text-[#E1306C]" }
];

const Icons = {
  ArrowRight: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>,
  Download: ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
};

export default function Home() {
  const roles = useMemo(
    () => ["AI/ML ENGINEER", "DATA SCIENCE ENTHUSIAST", "TECH EXPLORER"],
    []
  );
  const [index, setIndex] = useState(0);
  const [subindex, setSubindex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // --- Real Time Clock ---
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).split(' ')[0];
  const minutes = currentTime.toLocaleTimeString('en-US', { minute: '2-digit' });
  const ampm = currentTime.toLocaleTimeString('en-US', { hour12: true }).split(' ')[1];

  // --- Typewriter Effect ---
  useEffect(() => {
    const current = roles[index];
    const timeout = setTimeout(() => {
      if (!deleting && subindex < current.length) {
        setSubindex((v) => v + 1);
      } else if (!deleting && subindex === current.length) {
        setTimeout(() => setDeleting(true), 1200);
      } else if (deleting && subindex > 0) {
        setSubindex((v) => v - 1);
      } else if (deleting && subindex === 0) {
        setDeleting(false);
        setIndex((p) => (p + 1) % roles.length);
      }
    }, deleting ? 40 : 60);
    return () => clearTimeout(timeout);
  }, [subindex, deleting, index, roles]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // --- Mouse parallax for name ---
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const onMouseMove = (e) => {
    mouseX.set(e.clientX / window.innerWidth);
    mouseY.set(e.clientY / window.innerHeight);
  };
  const springX = useSpring(mouseX, { damping: 20, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 200 });
  const nameX = useTransform(springX, [0, 1], [-12, 12]);
  const nameY = useTransform(springY, [0, 1], [-12, 12]);

  // --- Canvas starfield ---
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.75);
    let width = (canvas.width = canvas.clientWidth * dpr);
    let height = (canvas.height = canvas.clientHeight * dpr);
    const particleCount = isMobile ? 35 : 85;
    const connectionDistance = (isMobile ? 100 : 160) * dpr;
    const particles = [];

    // Initialize neural nodes
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: (Math.random() * 1.5 + 0.5) * dpr,
        baseAlpha: Math.random() * 0.4 + 0.2
      });
    }

    const onResize = () => { width = (canvas.width = canvas.clientWidth * dpr); height = (canvas.height = canvas.clientHeight * dpr); };
    window.addEventListener("resize", onResize);
    const onMove = (e) => { const r = canvas.getBoundingClientRect(); pointerRef.current.x = (e.clientX - r.left) * dpr; pointerRef.current.y = (e.clientY - r.top) * dpr; };
    canvas.addEventListener("pointermove", onMove);

    const render = (now) => {
      ctx.clearRect(0, 0, width, height);

      const px = pointerRef.current.x || -1000;
      const py = pointerRef.current.y || -1000;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${p.baseAlpha})`;
        ctx.fill();

        // Connect nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 1 - (dist / connectionDistance);
            ctx.strokeStyle = `rgba(129, 140, 248, ${opacity * 0.25})`;
            ctx.lineWidth = 0.6 * dpr;
            ctx.stroke();
          }
        }

        // Connect to pointer (interactive AI field)
        const mouseDx = p.x - px;
        const mouseDy = p.y - py;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        if (mouseDist < connectionDistance * 1.5) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(px, py);
          const opacity = 1 - (mouseDist / (connectionDistance * 1.5));
          ctx.strokeStyle = `rgba(248, 250, 252, ${opacity * 0.35})`;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", onResize); canvas.removeEventListener("pointermove", onMove); };
  }, [isMobile]);

  return (
    <motion.section
      id="home"
      onMouseMove={!isMobile ? onMouseMove : undefined}
      className="relative w-full overflow-hidden bg-transparent text-white min-h-[100dvh]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      {/* Starfield canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-40 mix-blend-screen" />

      {/* Single ambient glow — Apple-style single soft orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none md:blur-[90px]" style={{ background: 'radial-gradient(circle, rgba(120,119,198,0.15) 0%, rgba(99,80,180,0.06) 50%, transparent 70%)' }} />

      <div className="relative z-10 w-full h-full max-w-[1100px] mx-auto px-6 md:px-10 flex flex-col items-center justify-center text-center pt-[290px] md:pt-[180px] pb-4">

        {/* STATUS PILL + TYPEWRITER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
          className="flex flex-row flex-wrap justify-center items-center gap-2.5 mb-4"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">
              IST {hours}:{minutes} {ampm}
            </span>
          </div>
          <div className="text-xs tracking-[0.2em] text-slate-600 uppercase">
            {roles[index].substring(0, subindex)}<span className="animate-pulse">|</span>
          </div>
        </motion.div>

        {/* MASSIVE NAME */}
        <motion.div
          className="w-full mb-4"
          style={!isMobile ? { x: nameX, y: nameY } : {}}
        >
          <h1 className="font-medium tracking-tighter text-white">
            <span className="block text-slate-500 text-xs font-light mb-1.5 tracking-[0.4em] uppercase">I am</span>
            <span className="block" style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)', lineHeight: '1.0' }}>Sarvjeet Raj</span>
            <span className="block text-transparent" style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)', lineHeight: '1.02', WebkitTextStroke: '1px var(--theme-stroke)' }}>Verma</span>
          </h1>
        </motion.div>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="text-slate-400 text-sm sm:text-sm md:text-base max-w-md mx-auto leading-relaxed mb-4 font-light tracking-wide"
        >
          Architecting intelligent systems. Bridging raw data with predictive intelligence and scalable machine learning workflows.
        </motion.p>

        {/* ACTION BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
          className="flex flex-row items-center gap-6 sm:gap-9 mb-4"
        >
          <motion.a
            href="#projects"
            className="flex items-center gap-1.5 text-white border-b border-white/40 pb-0.5 text-base sm:text-base font-medium tracking-wide hover:text-slate-300 hover:border-slate-400 transition-colors"
            whileHover={{ y: -2 }}
          >
            Explore Work <Icons.ArrowRight size={14} />
          </motion.a>

          {/* Resume Button with Tooltip */}
          <div className="relative group flex items-center">
            <a
              href="/sarvjeetrajverma_resume.pdf"
              download="Sarvjeet_Raj_Verma_Resume.pdf"
              onClick={() => trackEvent('resume_download')}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-200 transition-colors text-base sm:text-base font-medium tracking-wide"
            >
              <motion.span className="flex items-center gap-1.5" whileHover={{ y: -2 }}>
                Resume <Icons.Download size={13} />
              </motion.span>
            </a>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 whitespace-nowrap group-hover:-translate-y-1">
              <div className="bg-black/90 backdrop-blur-md border border-white/10 text-slate-200 text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-xl flex items-center gap-2">
                <span>📄</span> Download PDF
              </div>
            </div>
          </div>
        </motion.div>

        {/* SOCIALS — horizontal row */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center gap-6 sm:gap-7"
        >
          {socials.map((s) => (
            <motion.a
              key={s.label} href={s.link} target="_blank" rel="noreferrer"
              className={`${s.colorClass} hover:scale-110 hover:brightness-125 transition-all duration-300 opacity-90 hover:opacity-100`}
              whileHover={{ y: -3 }}
            >
              <s.icon size={26} />
              <span className="sr-only">{s.label}</span>
            </motion.a>
          ))}
        </motion.div>


      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 pointer-events-none"
      >
        <span className="text-[10px] tracking-widest uppercase font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
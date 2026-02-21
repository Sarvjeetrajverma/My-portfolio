import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaXTwitter, FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa6";

const socials = [
  { icon: FaXTwitter, label: "X", link: "https://twitter.com/itssarvjeet", color: "#aeeea2" },
  { icon: FaLinkedinIn, label: "LinkedIn", link: "https://www.linkedin.com/in/sarvjeetrajverma/", color: "#0ea5e9" },
  { icon: FaGithub, label: "GitHub", link: "https://www.github.com/sarvjeetrajverma", color: "#dfefba" },
  { icon: FaInstagram, label: "Instagram", link: "https://www.instagram.com/sarvjeetrajverma", color: "#e55c87" }
];

const sectionVariants = {
  initial: { opacity: 0, scale: 0.97, y: 24 },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" }
  }
};

const textBlockVariants = {
  initial: { opacity: 0, x: -40 },
  enter: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: "easeOut", delay: 0.2 }
  }
};

const rightSideVariants = {
  initial: { opacity: 0, x: 40, rotateX: -15, rotateY: 15 },
  enter: {
    opacity: 1,
    x: 0,
    rotateX: 0,
    rotateY: 0,
    transition: { duration: 1.0, ease: "easeOut", delay: 0.3 }
  }
};

const particleData = [...Array(8)].map(() => ({
  top: 25 + Math.random() * 50,
  left: 25 + Math.random() * 50,
  duration: 3 + Math.random() * 3
}));

export default function Home() {
  const roles = useMemo(
    () => ["WEB DEVELOPER", "MERN STACK DEVELOPER", "UI/UX ENTHUSIAST"],
    []
  );
  const [index, setIndex] = useState(0);
  const [subindex, setSubindex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // --- Real Time Clock & Date ---
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

  const [prefersReducedMotion, setPrm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrm(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- Mouse Movement Logic for Name Animation ---
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth);
    mouseY.set(clientY / innerHeight);
  };

  const springConfig = { damping: 20, stiffness: 200 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Map mouse position to transforms
  const nameX = useTransform(springX, [0, 1], [-20, 20]);
  const nameY = useTransform(springY, [0, 1], [-20, 20]);
  const nameRotateX = useTransform(springY, [0, 1], [10, -10]);
  const nameRotateY = useTransform(springX, [0, 1], [-10, 10]);

  // --- Canvas Logic ---
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Reduce DPR on mobile for better performance
    let dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    if (isMobile || prefersReducedMotion) {
      dpr = Math.min(dpr, 1);
    } else {
      dpr = Math.min(dpr, 1.75);
    }

    let width = (canvas.width = canvas.clientWidth * dpr);
    let height = (canvas.height = canvas.clientHeight * dpr);

    // Reduce star count on mobile for better performance
    const layers = isMobile || prefersReducedMotion
      ? [
          { count: 15, speed: 0.02, size: [0.7, 1.0], color: "rgba(248,250,252,0.3)" },
          { count: 10, speed: 0.03, size: [1.0, 1.5], color: "rgba(129,140,248,0.3)" }
        ]
      : [
          { count: 35, speed: 0.03, size: [0.7, 1.3], color: "rgba(248,250,252,0.4)" },
          { count: 20, speed: 0.05, size: [1.0, 2.0], color: "rgba(129,140,248,0.45)" }
        ];

    const stars = [];

    layers.forEach((layer, li) => {
      for (let i = 0; i < layer.count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 0.6 + 0.4,
          r: (Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0]) * dpr,
          baseAlpha: Math.random() * 0.3 + 0.2,
          twinkle: Math.random() * 0.004 + 0.001,
          layer: li
        });
      }
    });

    const onResize = () => {
      let newDpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      newDpr = Math.min(newDpr, 1.75);
      dpr = newDpr;
      width = (canvas.width = canvas.clientWidth * dpr);
      height = (canvas.height = canvas.clientHeight * dpr);
    };
    window.addEventListener("resize", onResize);

    const onCanvasMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = (e.clientX - rect.left) / rect.width;
      pointerRef.current.y = (e.clientY - rect.top) / rect.height;
    };
    // Reusing the same handler for canvas specific if needed, but we use window mainly now
    canvas.addEventListener("pointermove", onCanvasMove);

    let last = performance.now();

    const render = (now) => {
      const dt = Math.min(40, now - last);
      last = now;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const centerX = width / 2;
      const centerY = height / 2;
      const warpIntensity = prefersReducedMotion ? 0.06 : 0.22;
      const pointerShiftX = (pointerRef.current.x - 0.5) * 20 * dpr;
      const pointerShiftY = (pointerRef.current.y - 0.5) * 20 * dpr;

      layers.forEach((layer, li) => {
        ctx.fillStyle = layer.color;
        for (let i = 0; i < stars.length; i++) {
          const s = stars[i];
          if (s.layer !== li) continue;
          const dirX = s.x - centerX;
          const dirY = s.y - centerY;
          const dist = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
          const normX = dirX / dist;
          const normY = dirY / dist;

          s.x += normX * layer.speed * dt * warpIntensity;
          s.y += normY * layer.speed * dt * warpIntensity;

          if (s.x < -40 || s.x > width + 40 || s.y < -40 || s.y > height + 40) {
            s.x = centerX + (Math.random() - 0.5) * 80;
            s.y = centerY + (Math.random() - 0.5) * 80;
            s.z = Math.random() * 0.6 + 0.4;
          }

          const twinkleAlpha = s.baseAlpha + Math.sin(now * s.twinkle + i) * 0.16 * (li + 1);
          const screenX = (s.x + pointerShiftX * (1 - s.z)) / dpr;
          const screenY = (s.y + pointerShiftY * (1 - s.z)) / dpr;

          ctx.beginPath();
          ctx.globalAlpha = Math.max(0.04, Math.min(0.55, twinkleAlpha));
          ctx.arc(screenX, screenY, (s.r / dpr) * s.z, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      });

      ctx.restore();
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onCanvasMove);
    };
  }, [prefersReducedMotion, isMobile]);

  return (
    <motion.section
      id="home"
      onMouseMove={onMouseMove}
      className="relative w-full overflow-hidden bg-transparent text-white flex items-center lg:min-h-screen perspective-[1000px]"
      variants={sectionVariants}
      initial="initial"
      animate="enter"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 lg:py-0 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16">
        
        {/* TEXT SIDE */}
        <motion.div
          className="order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left"
          variants={textBlockVariants}
        >
          <div className="inline-flex items-center justify-center lg:justify-start px-3 py-1 mb-4 rounded-full border border-cyan-400/20 bg-cyan-500/5 backdrop-blur-md gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400/90 animate-pulse" />
            <span className="text-cyan-100 font-mono text-[11px] tracking-[0.28em]">
              {roles[index].substring(0, subindex)}
              <span className="animate-pulse">|</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 tracking-tight perspective-[500px]">
            <span className="block text-slate-100 text-lg sm:text-2xl font-light mb-1">
              Hello, I'm
            </span>
            {/* ANIMATED NAME COMPONENT */}
            <motion.span
              style={{ 
                x: nameX, 
                y: nameY,
                rotateX: nameRotateX,
                rotateY: nameRotateY,
                transformStyle: "preserve-3d"
              }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-50 via-cyan-200 to-indigo-200 drop-shadow-[0_0_14px_rgba(34,211,238,0.3)] cursor-default inline-block"
            >
              Sarvjeet Raj Verma
            </motion.span>
          </h1>

          <p className="text-slate-50/80 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6">
            Crafting immersive web universes where clean engineering meets
            cinematic experiences. Constellations of components, galaxies
            of micro‑interactions, and one seamless digital journey.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-7">
            <motion.a
              href="#projects"
              className="relative inline-flex items-center justify-center px-7 py-3 rounded-full bg-sky-100/85 text-slate-900 text-sm sm:text-base font-semibold shadow-[0_0_14px_rgba(56,189,248,0.35)] overflow-hidden"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10">View Projects</span>
              <span className="pointer-events-none absolute inset-[1px] rounded-full bg-gradient-to-r from-sky-200 via-cyan-100 to-amber-100 opacity-55" />
            </motion.a>

            <motion.a
              href="/sarvjeetrajverma_resume.pdf"
              download="SarvjeetRajVerma_Resume.pdf"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-slate-200/60 text-slate-100 text-sm sm:text-base bg-slate-900/20 hover:bg-slate-900/45 backdrop-blur-md transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <span>Download Resume</span>
              <span className="text-lg leading-none">↓</span>
            </motion.a>
          </div>

          <div className="flex gap-5 justify-center lg:justify-start">
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.link}
                target="_blank"
                rel="noreferrer"
                className="relative text-2xl text-slate-200 hover:text-white transition-colors"
                initial={{ opacity: 0, y: 15 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -8, 0] // CONTINUOUS FLOATING ANIMATION
                }}
                transition={{ 
                  opacity: { delay: 0.5 + i * 0.1, duration: 0.4 },
                  y: { 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: i * 0.4 // Staggered floating
                  }
                }}
                whileHover={{
                  scale: 1.25,
                  color: s.color,
                  y: -5, // Lift slightly more on hover
                  textShadow: "0 0 14px rgba(248,250,252,0.9)",
                  transition: { duration: 0.2, y: { duration: 0.2, repeat: 0 } } // Stop floating slightly on hover
                }}
              >
                <s.icon />
                <span className="sr-only">{s.label}</span>
              </motion.a>
            ))}
          </div>

          {/* Real Time Clock & Date */}
          <motion.div 
            className="mt-8 inline-flex flex-col items-center lg:items-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900/40 border border-cyan-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(56,189,248,0.15)]">
              <span className="text-lg">🕐</span>
              <span className="font-mono text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-200 to-indigo-200 tracking-wider">
                {formatTime(currentTime)}
              </span>
            </div>
            <motion.div 
              className="mt-2 text-sm sm:text-base text-slate-300/80 font-medium tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {formatDate(currentTime)}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* VISUAL SIDE */}
        <motion.div
          className="order-1 lg:order-2 relative h-[260px] sm:h-[320px] lg:h-[480px] flex items-center justify-center"
          variants={rightSideVariants}
        >
          <div className="relative w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] lg:w-[340px] lg:h-[340px]">
            <motion.div
              className="absolute inset-[-10%] rounded-full border border-sky-400/15"
              style={{ boxShadow: "0 0 16px rgba(56,189,248,0.25)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              className="absolute inset-[4%] rounded-full border border-indigo-400/18 border-dashed"
              animate={{ rotate: -360 }}
              transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
            />

            <motion.div
              className="absolute inset-[20%] rounded-full border border-slate-500/18"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)]" />
              <span className="absolute -right-1 top-1/3 -translate-y-1/2 h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_6px_rgba(244,114,182,0.7)]" />
            </motion.div>

            <motion.div
              className="absolute inset-[24%] rounded-[36%] bg-gradient-to-br from-cyan-400/60 via-sky-300/50 to-indigo-500/60"
              animate={{
                borderRadius: [
                  "40% 60% 55% 45% / 40% 40% 60% 60%",
                  "70% 30% 50% 50% / 40% 70% 30% 60%",
                  "45% 55% 40% 60% / 65% 35% 55% 35%"
                ],
                rotate: [0, 8, -6, 0],
                boxShadow: [
                  "0 0 24px rgba(56,189,248,0.45)",
                  "0 0 30px rgba(129,140,248,0.55)",
                  "0 0 26px rgba(56,189,248,0.5)"
                ]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(248,250,252,0.5),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(34,211,238,0.6),transparent_60%)] mix-blend-screen" />
            </motion.div>

            <motion.div
              className="absolute left-1/2 top-1/2 w-[150px] sm:w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-slate-950/55 border border-slate-500/30 shadow-[0_12px_26px_rgba(15,23,42,0.75)] flex flex-col items-center justify-center gap-1 py-4 backdrop-blur-xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="h-12 w-12 rounded-full bg-slate-900/70 flex items-center justify-center text-3xl shadow-[0_0_12px_rgba(56,189,248,0.6)]">
                👨‍💻
              </div>
              <div className="mt-1 text-center">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-100">
                  Portfolio
                </p>
                <p className="text-sm font-semibold text-sky-100">
                  Sarvjeet
                </p>
              </div>
            </motion.div>

            {particleData.map((particle, i) => (
              <motion.div
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-sky-300/70"
                style={{
                  top: `${particle.top}%`,
                  left: `${particle.left}%`,
                  boxShadow: "0 0 8px rgba(56,189,248,0.75)"
                }}
                animate={{
                  y: [0, -5, 0],
                  x: [0, i % 2 === 0 ? 6 : -6, 0],
                  opacity: [0.18, 0.7, 0.18]
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaGithub, FaLinkedinIn, FaEnvelope, FaMapMarkerAlt,
  FaDownload, FaPrint, FaArrowLeft, FaExternalLinkAlt,
  FaGraduationCap, FaBriefcase, FaCode, FaTrophy,
  FaBrain, FaRocket, FaTerminal, FaCamera, FaRobot
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const ease = [0.22, 1, 0.36, 1];

// ── Data ─────────────────────────────────────────────────────────────────────

const skillGroups = [
  {
    label: 'Machine Learning',
    color: '#818CF8',
    skills: [
      { name: 'Python', level: 90 },
      { name: 'Scikit-Learn', level: 80 },
      { name: 'Pandas', level: 85 },
      { name: 'NumPy', level: 85 },
      { name: 'Jupyter', level: 90 },
      { name: 'Math & Stats', level: 75 },
    ],
  },
  {
    label: 'Deep Learning',
    color: '#C084FC',
    skills: [
      { name: 'TensorFlow', level: 70 },
      { name: 'PyTorch', level: 60 },
      { name: 'Keras', level: 75 },
      { name: 'HuggingFace', level: 65 },
      { name: 'OpenCV', level: 60 },
      { name: 'GenAI / LLMs', level: 50 },
    ],
  },
  {
    label: 'Data & MLOps',
    color: '#34D399',
    skills: [
      { name: 'Git & GitHub', level: 90 },
      { name: 'MySQL', level: 80 },
      { name: 'PostgreSQL', level: 65 },
      { name: 'Docker', level: 30 },
      { name: 'Linux CLI', level: 50 },
      { name: 'Web Dashboards', level: 80 },
    ],
  },
  {
    label: 'Core DSA',
    color: '#60A5FA',
    skills: [
      { name: 'C++', level: 60 },
      { name: 'Data Structures', level: 80 },
      { name: 'Graph Algorithms', level: 70 },
      { name: 'OOP', level: 80 },
      { name: 'Logic & Problem Solving', level: 90 },
    ],
  },
];

const education = [
  {
    degree: 'B.Tech — Computer Science Engineering',
    institution: 'Katihar Engineering College, Bihar',
    period: '2023 – Present',
    gpa: '7.92 CGPA (Aggregate)',
    highlights: [
      'Lead Coordinator — TechFusion\'26 (Annual Tech Fest)',
      'Core Team & Technical Team Lead',
      'Focus: AI/ML Engineering, Data Science',
    ],
  },
  {
    degree: 'JEE Scholar — Residential Coaching',
    institution: 'Magadh Super 30, Gaya',
    period: '2020 – 2022',
    gpa: null,
    highlights: [
      'Mentored under Ex-DGP Abhiyanand Sir',
      'Advanced Physics & Mathematics',
      'Intensive competitive exam preparation',
    ],
  },
  {
    degree: 'Intermediate — Science (PCM)',
    institution: 'S.S. College, Jehanabad',
    period: '2020 – 2022',
    gpa: null,
    highlights: [
      'Stream: Physics, Chemistry, Mathematics',
      'Analytical Problem Solving',
    ],
  },
];

const experience = [
  {
    role: 'ML Researcher',
    org: 'Kaggle & Open Source',
    period: '2026 – Present',
    type: 'Research',
    bullets: [
      'Competing in Computer Vision & NLP challenges on Kaggle',
      'Achieved Top 20% ranking in Image Classification competition',
      'Designed and optimised end-to-end data pipelines for model training',
      'Exploring fine-tuning of LLMs and transformer architectures',
    ],
  },
];

const projects = [
  {
    name: 'Portfolio Launchpad',
    description:
      'A premium, multi-theme personal portfolio engineered from scratch with a custom canvas neural-network starfield, Firebase-backed travel photography gallery with real-time stats, and a 4-theme system. Deployed on Vercel.',
    tech: ['React 18', 'Vite', 'Tailwind CSS v4', 'Framer Motion', 'Firebase', 'Vercel Analytics'],
    github: 'https://github.com/sarvjeetrajverma/My-portfolio-3',
    demo: 'https://my-protfolio.vercel.app',
    status: 'Live',
  },
];

const leadership = [
  {
    title: 'Lead Coordinator — TechFusion\'26',
    org: 'Katihar Engineering College',
    desc: 'Spearheaded the annual technical festival, overseeing event planning, sponsorship, and cross-functional team coordination for 500+ student attendees.',
  },
  {
    title: 'Technical Team Lead',
    org: 'Katihar Engineering College',
    desc: 'Led the core technical committee, managing web infrastructure, hardware projects, and autonomous algorithm development for Robo War competitions.',
  },
];

// ── Sub-components ───────────────────────────────────────────────────────────

const SectionTitle = ({ label, icon }) => (
  <div className="flex items-center gap-3 mb-6 print:mb-4">
    <div className="text-indigo-400 text-sm print:text-indigo-600">{icon}</div>
    <h3 className="text-[10px] tracking-[0.35em] text-slate-500 uppercase font-medium print:text-slate-700">
      {label}
    </h3>
    <div className="flex-1 h-px bg-white/[0.06] print:bg-slate-200" />
  </div>
);

const SkillBar = ({ name, level, color, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });

  return (
    <div ref={ref} className="mb-3 print:mb-2">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-slate-300 print:text-slate-700">{name}</span>
        <span className="text-[10px] text-slate-600 font-mono print:text-slate-400">{level}%</span>
      </div>
      <div className="h-0.5 bg-white/[0.05] rounded-full overflow-hidden print:bg-slate-200">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: index * 0.06, ease }}
        />
      </div>
    </div>
  );
};

const TimelineItem = ({ item, index, type }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease, delay: index * 0.1 }}
      className="relative pl-6 pb-8 last:pb-0 border-l border-white/[0.06] print:border-slate-200 print:pb-5"
    >
      {/* Dot */}
      <div
        className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full border border-white/20 bg-black print:bg-white print:border-slate-400"
        style={{ boxShadow: '0 0 8px rgba(129,140,248,0.4)' }}
      />

      <div className="group">
        {type === 'education' ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
              <h4 className="text-white text-sm font-medium tracking-tight leading-snug print:text-slate-900">
                {item.degree}
              </h4>
              <span className="text-[10px] font-mono text-slate-600 whitespace-nowrap print:text-slate-500">
                {item.period}
              </span>
            </div>
            <p className="text-indigo-400 text-xs mb-2 print:text-indigo-600">{item.institution}</p>
            {item.gpa && (
              <span className="inline-block text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 mb-2 print:text-emerald-700 print:bg-transparent print:border-emerald-300">
                {item.gpa}
              </span>
            )}
            <ul className="space-y-1 mt-1">
              {item.highlights.map((h, i) => (
                <li key={i} className="text-xs text-slate-500 flex items-start gap-2 print:text-slate-600">
                  <span className="text-indigo-500 mt-0.5 shrink-0 print:text-indigo-400">›</span>
                  {h}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-1">
              <h4 className="text-white text-sm font-medium tracking-tight print:text-slate-900">{item.role}</h4>
              <span className="text-[10px] font-mono text-slate-600 whitespace-nowrap print:text-slate-500">
                {item.period}
              </span>
            </div>
            <p className="text-indigo-400 text-xs mb-3 print:text-indigo-600">
              {item.org}
              <span className="ml-2 text-[9px] uppercase tracking-widest text-slate-600 border border-white/[0.08] rounded-full px-2 py-0.5 print:border-slate-300 print:text-slate-500">
                {item.type}
              </span>
            </p>
            <ul className="space-y-1.5">
              {item.bullets.map((b, i) => (
                <li key={i} className="text-xs text-slate-500 flex items-start gap-2 print:text-slate-600">
                  <span className="text-indigo-500 mt-0.5 shrink-0 print:text-indigo-400">›</span>
                  {b}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function Resume() {
  const [activeGroup, setActiveGroup] = useState(0);

  // Inject print styles once
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'resume-print-styles';
    style.textContent = `
      @media print {
        .no-print { display: none !important; }
        body { background: white !important; color: #111 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .resume-doc { box-shadow: none !important; border: none !important; background: white !important; border-radius: 0 !important; }
        .resume-doc * { color: inherit; }
        .resume-sidebar { background: #f8f8f8 !important; border-right: 1px solid #eee !important; }
        @page { margin: 0.5in; size: A4; }
      }
    `;
    document.head.appendChild(style);
    return () => document.getElementById('resume-print-styles')?.remove();
  }, []);

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-black text-white font-sans">

      {/* ── Top control bar (no-print) ── */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 h-14 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-medium"
        >
          <FaArrowLeft size={11} />
          Portfolio
        </Link>

        <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-slate-600 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Interactive Resume
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-full transition-all"
          >
            <FaPrint size={10} /> Print
          </button>
          <a
            href="/sarvjeetrajverma_resume.pdf"
            download="SarvjeetRajVerma_Resume.pdf"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black bg-white hover:bg-slate-100 rounded-full transition-all"
          >
            <FaDownload size={10} /> Download PDF
          </a>
        </div>
      </div>

      {/* ── Page content ── */}
      <div className="pt-14 pb-20 px-3 md:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Ambient glow */}
          <div
            className="no-print fixed top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }}
          />

          {/* ── Resume document card ── */}
          <motion.div
            className="resume-doc relative rounded-2xl border border-white/[0.07] overflow-hidden"
            style={{ background: 'rgba(8,8,12,0.97)', boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 1px rgba(255,255,255,0.05)' }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          >

            {/* ═══ HEADER ══════════════════════════════════════════════════════ */}
            <div className="relative border-b border-white/[0.06] px-8 md:px-12 py-10 print:py-8 print:border-slate-200">
              {/* Subtle gradient top strip */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease }}
                    className="text-4xl md:text-5xl font-medium tracking-tighter text-white mb-1 print:text-slate-900"
                  >
                    Sarvjeet Raj{' '}
                    <span
                      className="text-transparent print:text-slate-900"
                      style={{ WebkitTextStroke: '1px rgba(255,255,255,0.35)' }}
                    >
                      Verma
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.15, ease }}
                    className="text-slate-400 text-base font-light tracking-wide print:text-slate-600"
                  >
                    AI/ML Engineer Learner &nbsp;·&nbsp; Data Science Enthusiast &nbsp;·&nbsp; CSE Student
                  </motion.p>
                </div>

                {/* Contact pills */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.25, ease }}
                  className="flex flex-wrap gap-2"
                >
                  {[
                    { icon: <FaEnvelope size={10} />, label: 'sarvjeetrajverma@gmail.com', href: 'mailto:sarvjeetrajverma@gmail.com' },
                    { icon: <FaGithub size={10} />, label: 'sarvjeetrajverma', href: 'https://github.com/sarvjeetrajverma' },
                    { icon: <FaLinkedinIn size={10} />, label: 'sarvjeetrajverma', href: 'https://linkedin.com/in/sarvjeetrajverma' },
                    { icon: <FaMapMarkerAlt size={10} />, label: 'India', href: null },
                  ].map((c) =>
                    c.href ? (
                      <a
                        key={c.label}
                        href={c.href}
                        target={c.href.startsWith('mailto') ? undefined : '_blank'}
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-slate-400 hover:text-white border border-white/[0.07] hover:border-white/20 rounded-full transition-all print:border-slate-200 print:text-slate-600"
                      >
                        {c.icon} {c.label}
                      </a>
                    ) : (
                      <span
                        key={c.label}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-slate-500 border border-white/[0.07] rounded-full print:border-slate-200 print:text-slate-600"
                      >
                        {c.icon} {c.label}
                      </span>
                    )
                  )}
                </motion.div>
              </div>
            </div>

            {/* ═══ BODY — 2 columns ════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06] print:divide-slate-200">

              {/* ── LEFT SIDEBAR ── */}
              <div className="resume-sidebar px-8 md:px-10 py-10 print:py-8 space-y-10 print:space-y-8 print:bg-slate-50">

                {/* Skills section with tab switcher */}
                <div>
                  <SectionTitle label="Technical Skills" icon={<FaTerminal />} />

                  {/* Category tabs */}
                  <div className="flex flex-wrap gap-1.5 mb-5 no-print">
                    {skillGroups.map((g, i) => (
                      <button
                        key={g.label}
                        onClick={() => setActiveGroup(i)}
                        className={`text-[10px] px-2.5 py-1 rounded-full border transition-all font-medium tracking-wide ${
                          activeGroup === i
                            ? 'border-white/25 text-white bg-white/[0.06]'
                            : 'border-white/[0.06] text-slate-600 hover:text-slate-300 hover:border-white/15'
                        }`}
                      >
                        {g.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Animated skill bars (screen) */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeGroup}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="no-print"
                    >
                      <p className="text-[10px] tracking-widest text-slate-700 uppercase mb-3">
                        {skillGroups[activeGroup].label}
                      </p>
                      {skillGroups[activeGroup].skills.map((s, i) => (
                        <SkillBar
                          key={s.name}
                          name={s.name}
                          level={s.level}
                          color={skillGroups[activeGroup].color}
                          index={i}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>

                  {/* Print version: all skills as pills */}
                  <div className="hidden print:block space-y-4">
                    {skillGroups.map((g) => (
                      <div key={g.label}>
                        <p className="text-[9px] tracking-widest text-slate-500 uppercase mb-1.5">{g.label}</p>
                        <div className="flex flex-wrap gap-1">
                          {g.skills.map((s) => (
                            <span key={s.name} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <SectionTitle label="Interests" icon={<FaBrain />} />
                  <ul className="space-y-2.5">
                    {[
                      { icon: <FaRobot size={11} />, label: 'Agentic AI & LLMs' },
                      { icon: <FaCode size={11} />, label: 'Computer Vision' },
                      { icon: <FaCamera size={11} />, label: 'Travel Photography' },
                      { icon: <FaTerminal size={11} />, label: 'Combat Robotics' },
                      { icon: <FaBrain size={11} />, label: 'Deep Learning Research' },
                    ].map((item) => (
                      <li
                        key={item.label}
                        className="flex items-center gap-2.5 text-xs text-slate-400 print:text-slate-600"
                      >
                        <span className="text-indigo-500 print:text-indigo-400">{item.icon}</span>
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Links */}
                <div>
                  <SectionTitle label="Links" icon={<FaExternalLinkAlt />} />
                  <div className="space-y-3">
                    {[
                      { icon: <FaGithub />, label: 'GitHub', sub: 'sarvjeetrajverma', href: 'https://github.com/sarvjeetrajverma' },
                      { icon: <FaLinkedinIn />, label: 'LinkedIn', sub: 'sarvjeetrajverma', href: 'https://linkedin.com/in/sarvjeetrajverma' },
                      { icon: <FaXTwitter />, label: 'X (Twitter)', sub: '@itssarvjeet', href: 'https://twitter.com/itssarvjeet' },
                      { icon: <FaEnvelope />, label: 'Email', sub: 'sarvjeetrajverma@gmail.com', href: 'mailto:sarvjeetrajverma@gmail.com' },
                    ].map((l) => (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 group"
                      >
                        <div className="text-slate-600 group-hover:text-indigo-400 transition-colors text-sm print:text-slate-500">
                          {l.icon}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors print:text-slate-700">
                            {l.label}
                          </p>
                          <p className="text-[10px] text-slate-700 group-hover:text-slate-400 transition-colors print:text-slate-500">
                            {l.sub}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="no-print">
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-emerald-400">Available for Opportunities</p>
                      <p className="text-[10px] text-slate-600 mt-0.5">Internships · Collaborations</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── RIGHT MAIN CONTENT ── */}
              <div className="px-8 md:px-10 py-10 print:py-8 space-y-12 print:space-y-8">

                {/* Education */}
                <div>
                  <SectionTitle label="Education" icon={<FaGraduationCap />} />
                  <div className="space-y-0">
                    {education.map((item, i) => (
                      <TimelineItem key={i} item={item} index={i} type="education" />
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <SectionTitle label="Research & Experience" icon={<FaBriefcase />} />
                  <div className="space-y-0">
                    {experience.map((item, i) => (
                      <TimelineItem key={i} item={item} index={i} type="experience" />
                    ))}
                  </div>
                  {/* "More coming" indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="no-print mt-4 pl-6 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-slate-700 rounded-full animate-pulse" />
                    <span className="text-[10px] font-mono text-slate-700 tracking-widest">
                      Actively building experience — actively training...
                    </span>
                  </motion.div>
                </div>

                {/* Projects */}
                <div>
                  <SectionTitle label="Projects" icon={<FaRocket />} />
                  <div className="space-y-5">
                    {projects.map((proj, i) => (
                      <motion.div
                        key={proj.name}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, ease, delay: i * 0.1 }}
                        className="relative p-5 rounded-xl border border-white/[0.06] hover:border-white/15 transition-colors duration-300 group print:border-slate-200"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2.5">
                            <h4 className="text-white text-sm font-medium print:text-slate-900">{proj.name}</h4>
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 print:text-emerald-700">
                              {proj.status}
                            </span>
                          </div>
                          <div className="no-print flex items-center gap-2 shrink-0">
                            <a
                              href={proj.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-600 hover:text-white transition-colors"
                            >
                              <FaGithub size={13} />
                            </a>
                            <a
                              href={proj.demo}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-600 hover:text-white transition-colors"
                            >
                              <FaExternalLinkAlt size={11} />
                            </a>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3 print:text-slate-600">{proj.description}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.tech.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-mono text-slate-500 border border-white/[0.06] rounded px-1.5 py-0.5 print:border-slate-200 print:text-slate-600"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        {/* Print URLs */}
                        <div className="hidden print:flex gap-4 mt-2">
                          <span className="text-[9px] text-slate-500">GitHub: {proj.github}</span>
                          <span className="text-[9px] text-slate-500">Live: {proj.demo}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Leadership & Achievements */}
                <div>
                  <SectionTitle label="Leadership & Activities" icon={<FaTrophy />} />
                  <div className="space-y-5">
                    {leadership.map((item, i) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, ease, delay: i * 0.1 }}
                        className="flex gap-4"
                      >
                        <div
                          className="w-0.5 shrink-0 mt-1 rounded-full bg-gradient-to-b from-indigo-500/60 to-transparent"
                          style={{ minHeight: '40px' }}
                        />
                        <div>
                          <h4 className="text-white text-sm font-medium mb-0.5 print:text-slate-900">{item.title}</h4>
                          <p className="text-indigo-400 text-xs mb-1.5 print:text-indigo-600">{item.org}</p>
                          <p className="text-xs text-slate-500 leading-relaxed print:text-slate-600">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}

                    {/* Extra: Combat Robotics / Photography */}
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.65, ease, delay: 0.2 }}
                      className="flex gap-4"
                    >
                      <div
                        className="w-0.5 shrink-0 mt-1 rounded-full bg-gradient-to-b from-purple-500/60 to-transparent"
                        style={{ minHeight: '40px' }}
                      />
                      <div>
                        <h4 className="text-white text-sm font-medium mb-0.5 print:text-slate-900">
                          Combat Robotics & Photography
                        </h4>
                        <p className="text-xs text-slate-500 leading-relaxed print:text-slate-600">
                          Developed autonomous control algorithms for competitive Robo War events. Travel photographer with documented expeditions to Sikkim, Jharkhand, and Varanasi — 65+ photographs across 3 trips.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

              </div>
            </div>

            {/* ═══ FOOTER ══════════════════════════════════════════════════════ */}
            <div className="border-t border-white/[0.05] px-8 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 print:border-slate-200">
              <p className="text-[10px] font-mono text-slate-700 tracking-widest print:text-slate-500">
                LAST UPDATED · JUN 2026
              </p>
              <div className="no-print flex items-center gap-4">
                <a
                  href="/sarvjeetrajverma_resume.pdf"
                  download="SarvjeetRajVerma_Resume.pdf"
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
                >
                  <FaDownload size={10} /> Download PDF version
                </a>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
                >
                  <FaPrint size={10} /> Print
                </button>
              </div>
              <p className="text-[10px] font-mono text-slate-700 print:text-slate-500">
                sarvjeetrajverma@gmail.com
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

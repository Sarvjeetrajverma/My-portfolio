// src/components/AnalyticsDashboard.jsx
// Premium Analytics Dashboard — packed with real browser APIs

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiUsers, FiClock, FiWifi, FiWifiOff, FiMonitor,
  FiGlobe, FiSmartphone, FiZap, FiActivity, FiMousePointer,
  FiArrowDown, FiBattery, FiCpu, FiEye, FiCheckCircle
} from 'react-icons/fi';
import { usePresence } from '../hooks/usePresence';

const ease = [0.22, 1, 0.36, 1];

/* ─── Sparkline SVG ─────────────────────────────────────────── */
function Sparkline({ data, color = '#34d399', height = 32 }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 100;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill={`url(#sg-${color.replace('#','')})`}
      />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      {data.length > 0 && (() => {
        const last = data[data.length - 1];
        const lx = 100;
        const ly = height - ((last - min) / range) * (height - 4) - 2;
        return <circle cx={lx} cy={ly} r="2.5" fill={color} />;
      })()}
    </svg>
  );
}

/* ─── Circular Progress ─────────────────────────────────────── */
function CircleProgress({ pct, color, size = 56, stroke = 4, label, value }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
          <motion.circle
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color }}>{value}</span>
        </div>
      </div>
      <span className="text-[10px] text-slate-500 text-center">{label}</span>
    </div>
  );
}

/* ─── Hooks ─────────────────────────────────────────────────── */
function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return now;
}

function useSessionTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => { const t = setInterval(() => setSeconds(s => s + 1), 1000); return () => clearInterval(t); }, []);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return { display: m > 0 ? `${m}m ${String(s).padStart(2,'0')}s` : `${s}s`, seconds };
}

function useScrollDepth() {
  const [depth, setDepth] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      setDepth(Math.min(100, Math.round((window.scrollY / scrollable) * 100)));
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return depth;
}

function useInteractions() {
  const [clicks, setClicks] = useState(0);
  const [keys, setKeys] = useState(0);
  useEffect(() => {
    const onC = () => setClicks(c => c + 1);
    const onK = () => setKeys(k => k + 1);
    window.addEventListener('click', onC);
    window.addEventListener('keydown', onK);
    return () => { window.removeEventListener('click', onC); window.removeEventListener('keydown', onK); };
  }, []);
  return { clicks, keys };
}

function useSectionTracker() {
  const sections = ['home','about','skills','projects','experience','testimonials','travel','contact'];
  const [visited, setVisited] = useState(new Set());
  useEffect(() => {
    const observers = [];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setVisited(prev => new Set([...prev, id]));
      }, { threshold: 0.2 });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);
  return { visited, total: sections.length, sections };
}

function useNetworkInfo() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const [info, setInfo] = useState({
    type: conn?.effectiveType || 'Unknown',
    downlink: conn?.downlink || null,
    rtt: conn?.rtt || null,
    saveData: conn?.saveData || false,
  });
  useEffect(() => {
    if (!conn) return;
    const update = () => setInfo({
      type: conn.effectiveType || 'Unknown',
      downlink: conn.downlink || null,
      rtt: conn.rtt || null,
      saveData: conn.saveData || false,
    });
    conn.addEventListener('change', update);
    return () => conn.removeEventListener('change', update);
  }, []);
  return info;
}

function usePagePerf() {
  const [perf, setPerf] = useState(null);
  useEffect(() => {
    const nav = performance.getEntriesByType?.('navigation')?.[0];
    if (!nav) return;
    setPerf({
      dns: Math.round(nav.domainLookupEnd - nav.domainLookupStart),
      tcp: Math.round(nav.connectEnd - nav.connectStart),
      ttfb: Math.round(nav.responseStart - nav.requestStart),
      load: Math.round(nav.loadEventEnd - nav.startTime),
      dom: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
    });
  }, []);
  return perf;
}

/* ─── Helpers ─────────────────────────────────────────────────── */
function getDeviceInfo() {
  const ua = navigator.userAgent;
  let browser = 'Unknown';
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Edg')) browser = 'Edge';
  let os = 'Unknown';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';
  const isMobile = /Mobi|Android/i.test(ua);
  return { browser, os, device: isMobile ? 'Mobile' : 'Desktop', isMobile };
}

function getReferrer() {
  const ref = document.referrer;
  if (!ref) return 'Direct';
  try { return new URL(ref).hostname; } catch { return ref; }
}

function networkColor(type) {
  if (type === '4g') return '#34d399';
  if (type === '3g') return '#fbbf24';
  if (type === '2g' || type === 'slow-2g') return '#f87171';
  return '#818cf8';
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function AnalyticsDashboard() {
  const [open, setOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [battery, setBattery] = useState(null);
  const [visitorHistory, setVisitorHistory] = useState([]);

  const { liveCount } = usePresence();
  const now = useLiveClock();
  const { display: sessionTime, seconds } = useSessionTimer();
  const scrollDepth = useScrollDepth();
  const { clicks, keys } = useInteractions();
  const { visited, total: sectionTotal, sections } = useSectionTracker();
  const network = useNetworkInfo();
  const perf = usePagePerf();
  const { browser, os, device, isMobile } = getDeviceInfo();

  // Track visitor count history for sparkline
  useEffect(() => {
    if (liveCount === null) return;
    setVisitorHistory(prev => {
      const next = [...prev, liveCount];
      if (next.length > 20) next.shift();
      return next;
    });
  }, [liveCount]);

  // Record every 30s
  useEffect(() => {
    if (liveCount === null) return;
    const t = setInterval(() => {
      setVisitorHistory(prev => {
        const next = [...prev, liveCount];
        if (next.length > 20) next.shift();
        return next;
      });
    }, 30000);
    return () => clearInterval(t);
  }, [liveCount]);

  // Battery API
  useEffect(() => {
    if (!navigator.getBattery) return;
    navigator.getBattery().then(b => {
      const update = () => setBattery({ level: Math.round(b.level * 100), charging: b.charging });
      update();
      b.addEventListener('levelchange', update);
      b.addEventListener('chargingchange', update);
    }).catch(() => {});
  }, []);

  // Toggle
  useEffect(() => {
    const handleToggle = () => setOpen(o => !o);
    window.addEventListener('toggle-analytics-dashboard', handleToggle);
    return () => window.removeEventListener('toggle-analytics-dashboard', handleToggle);
  }, []);

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  const netColor = networkColor(network.type);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 20 }}
            transition={{ duration: 0.45, ease }}
            className="relative w-full max-w-[820px] max-h-[92vh] overflow-y-auto rounded-3xl border border-white/[0.07] bg-[#060608] shadow-[0_40px_100px_rgba(0,0,0,0.9)] flex flex-col font-sans text-white scrollbar-hide"
          >
            {/* Header */}
            <div className="relative overflow-hidden rounded-t-3xl shrink-0">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-28 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

              <div className="flex items-center justify-between px-6 md:px-8 pt-6 pb-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/20 flex items-center justify-center">
                      <FiActivity size={18} className="text-emerald-400" />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#060608] animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-semibold tracking-tight text-white">Portfolio Analytics</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">Live · Real browser data · {dateStr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-semibold tracking-wide uppercase ${
                    isOnline ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-red-500/20 bg-red-500/5 text-red-400'
                  }`}>
                    {isOnline ? <FiWifi size={9} /> : <FiWifiOff size={9} />}
                    {isOnline ? 'Online' : 'Offline'}
                  </div>
                  <button onClick={() => setOpen(false)}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none">
                    <FiX size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 md:px-8 pb-8 flex flex-col gap-5">

              {/* ── Row 1: Live Visitors (wide) + Session ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                {/* Live Visitors — spans 2 cols */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4, ease }}
                  className="sm:col-span-2 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl pointer-events-none" />
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Live Visitors</p>
                      <div className="flex items-end gap-3 mt-1">
                        <span className="text-5xl font-bold tracking-tight text-emerald-400">
                          {liveCount === null ? '—' : liveCount}
                        </span>
                        {liveCount !== null && (
                          <span className="text-[11px] text-slate-500 mb-1.5">people on site now</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Live</span>
                    </div>
                  </div>
                  {/* Sparkline */}
                  <div className="h-10 mt-1 opacity-80">
                    <Sparkline data={visitorHistory.length > 1 ? visitorHistory : [0, liveCount ?? 0]} color="#34d399" height={40} />
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">Firebase Realtime DB · updates instantly</p>
                </motion.div>

                {/* Session Timer */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4, ease }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Your Session</p>
                    <FiClock size={13} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold tracking-tight text-amber-400 mt-3">{sessionTime}</p>
                    <p className="text-[10px] text-slate-600 mt-1.5">on site since page load</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                    <FiMousePointer size={10} />
                    <span>{clicks} clicks · {keys} keystrokes</span>
                  </div>
                </motion.div>
              </div>

              {/* ── Row 2: Scroll depth + Network + Battery + Time ── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                {/* Scroll Depth */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4, ease }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col items-center justify-center gap-2"
                >
                  <CircleProgress pct={scrollDepth} color="#818cf8" size={60} stroke={4} label="Scroll" value={`${scrollDepth}%`} />
                  <p className="text-[10px] text-slate-600 text-center">Page scrolled</p>
                </motion.div>

                {/* Sections Visited */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.4, ease }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col items-center justify-center gap-2"
                >
                  <CircleProgress
                    pct={Math.round((visited.size / sectionTotal) * 100)}
                    color="#f472b6"
                    size={60} stroke={4}
                    label="Sections"
                    value={`${visited.size}/${sectionTotal}`}
                  />
                  <p className="text-[10px] text-slate-600 text-center">Sections visited</p>
                </motion.div>

                {/* Network */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.4, ease }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Network</p>
                    <FiWifi size={12} style={{ color: netColor }} />
                  </div>
                  <p className="text-xl font-bold tracking-tight mt-1" style={{ color: netColor }}>
                    {network.type.toUpperCase()}
                  </p>
                  {network.downlink && <p className="text-[10px] text-slate-600">{network.downlink} Mbps</p>}
                  {network.rtt && <p className="text-[10px] text-slate-600">RTT: {network.rtt}ms</p>}
                  {!network.downlink && <p className="text-[10px] text-slate-600">Connection type</p>}
                </motion.div>

                {/* Battery */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.4, ease }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Battery</p>
                    <FiBattery size={12} className={battery?.level > 20 ? 'text-emerald-400' : 'text-red-400'} />
                  </div>
                  {battery ? (
                    <>
                      <p className={`text-xl font-bold tracking-tight mt-1 ${battery.level > 20 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {battery.level}%
                      </p>
                      <p className="text-[10px] text-slate-600">{battery.charging ? '⚡ Charging' : 'On battery'}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-bold tracking-tight mt-1 text-slate-500">N/A</p>
                      <p className="text-[10px] text-slate-600">Not available</p>
                    </>
                  )}
                </motion.div>
              </div>

              {/* ── Row 3: Page Performance ── */}
              {perf && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4, ease }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FiZap size={12} className="text-yellow-400" />
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Page Load Performance</p>
                    <span className="ml-auto text-[10px] text-slate-600 font-mono">Navigation Timing API</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: 'DNS', value: perf.dns, color: '#818cf8' },
                      { label: 'TCP', value: perf.tcp, color: '#38bdf8' },
                      { label: 'TTFB', value: perf.ttfb, color: '#fbbf24' },
                      { label: 'DOM Ready', value: perf.dom, color: '#34d399' },
                      { label: 'Full Load', value: perf.load, color: '#f472b6' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex flex-col items-center gap-1.5">
                        <div className="w-full bg-white/[0.03] rounded-lg overflow-hidden" style={{ height: 48 }}>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.min(100, (value / (perf.load || 1)) * 100)}%` }}
                            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                            className="w-full rounded-lg mt-auto"
                            style={{ background: color, opacity: 0.7 }}
                          />
                        </div>
                        <p className="text-[10px] font-bold" style={{ color }}>{value}ms</p>
                        <p className="text-[9px] text-slate-600">{label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Row 4: Sections Visited Tracker ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.4, ease }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FiEye size={12} className="text-pink-400" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Sections Viewed This Session</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sections.map(id => {
                    const seen = visited.has(id);
                    return (
                      <div key={id} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all duration-500 ${
                        seen
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-white/[0.06] bg-white/[0.02] text-slate-600'
                      }`}>
                        {seen && <FiCheckCircle size={9} />}
                        <span className="capitalize">{id}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* ── Row 5: Device + Environment info ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4, ease }}
                className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden"
              >
                <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-2">
                  <FiMonitor size={11} className="text-slate-500" />
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Environment</p>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {[
                    ['Browser', browser],
                    ['Operating System', os],
                    ['Device Type', device],
                    ['Screen', `${window.screen.width} × ${window.screen.height} (${window.devicePixelRatio}x DPR)`],
                    ['Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone],
                    ['Language', navigator.language],
                    ['Referred From', getReferrer()],
                    ['Current Page', window.location.pathname || '/'],
                    ['Local Time', timeStr],
                    ['Cookies Enabled', navigator.cookieEnabled ? 'Yes' : 'No'],
                    ['Touch Support', ('ontouchstart' in window) ? 'Yes' : 'No'],
                    ['CPU Cores', navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} logical cores` : 'Unknown'],
                  ].map(([label, value], i) => (
                    <div key={label} className="flex items-center justify-between px-5 py-2 hover:bg-white/[0.02] transition-colors duration-150">
                      <span className="text-[11px] text-slate-500">{label}</span>
                      <span className="text-[11px] text-slate-300 font-medium max-w-[55%] truncate text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 pb-1">
                <p className="text-[10px] text-slate-700 font-mono">Easter egg: logo ×5 · or footer ⚡</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-700">
                  <span className="w-1 h-1 bg-emerald-500/40 rounded-full" />
                  <span>Firebase RTDB · Navigation API · Browser APIs</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

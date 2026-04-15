import React, { useState, useMemo, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { travelData } from '../sections/travelData';

const ease = [0.22, 1, 0.36, 1];

// --- 1. Precision Highlight ---
const HighlightText = ({ text, highlight }) => {
  if (!highlight || !highlight.trim() || !text) return <>{text}</>;
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase()
          ? <span key={i} className="text-white border-b border-white/40">{part}</span>
          : part
      )}
    </>
  );
};

// --- 2. Stats row — Apple editorial style ---
const ModernStats = ({ trips }) => {
  const stats = useMemo(() => {
    const totalPhotos = trips.reduce((acc, t) => acc + (t.photos?.length || 0), 0);
    const uniqueLocs = new Set();
    trips.forEach(t => (t.photos || []).forEach(p => { if (p.location) uniqueLocs.add(p.location.toLowerCase()); }));
    return [
      { label: 'Photographs', value: totalPhotos },
      { label: 'Journeys', value: trips.length },
      { label: 'Locations', value: uniqueLocs.size },
    ];
  }, [trips]);

  return (
    <div className="flex gap-8 md:gap-16 mb-10 md:mb-16">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.6, ease }}
          className="flex flex-col"
        >
          <span className="text-4xl sm:text-6xl md:text-7xl font-medium text-white tracking-tighter leading-none">{stat.value}</span>
          <span className="text-xs sm:text-sm tracking-[0.3em] text-slate-600 uppercase mt-2 font-medium">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

// --- 3. Search & filter bar — minimalist underline style ---
const ModernCommandBar = ({ searchTerm, setSearchTerm, selectedYear, setSelectedYear, sortBy, setSortBy, years, resultCount }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14 md:mb-20"
    >
      {/* Search */}
      <div className="relative flex items-center border-b border-white/[0.08] focus-within:border-white/30 transition-colors duration-300 flex-1 w-full sm:max-w-sm">
        <span className="text-slate-600 mr-3 text-base">⌕</span>
        <input
          type="text"
          placeholder="Search journeys, locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent py-3 text-base sm:text-lg text-white focus:outline-none placeholder:text-slate-700"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <select
          className="bg-transparent border-b border-white/[0.08] text-slate-500 text-xs font-medium px-0 py-2 focus:outline-none cursor-pointer hover:text-white transition-colors"
          value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map(y => <option key={y} value={y} className="bg-black">{y === 'All' ? 'ALL YEARS' : y}</option>)}
        </select>
        <select
          className="bg-transparent border-b border-white/[0.08] text-slate-500 text-xs font-medium px-0 py-2 focus:outline-none cursor-pointer hover:text-white transition-colors"
          value={sortBy} onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest" className="bg-black">NEWEST</option>
          <option value="photos" className="bg-black">MOST PHOTOS</option>
        </select>
        <span className="text-[10px] tracking-widest text-slate-700 font-mono">{resultCount} FOUND</span>
      </div>
    </motion.div>
  );
};

// --- 4. Card — clean editorial style ---
const ModernCard = forwardRef(({ trip, searchTerm, onClick, onTagClick }, ref) => {
  const cover = trip.coverImage || trip.photos?.[0]?.url;
  const totalPhotos = trip.photos?.length || 0;
  const locations = Array.from(new Set(trip.photos?.map(p => p.location).filter(Boolean)));

  return (
    <motion.div
      ref={ref}
      layout
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease } }}
      onClick={onClick}
      className="group relative flex flex-row md:flex-col bg-black border border-white/[0.06] overflow-hidden hover:border-white/15 transition-all duration-500 cursor-pointer h-[110px] md:h-auto"
    >
      {/* Image */}
      <div className="w-[110px] md:w-auto aspect-square md:aspect-[4/3] overflow-hidden relative flex-shrink-0">
        <img
          src={cover} alt={trip.title}
          className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 flex flex-col justify-center md:justify-start flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base sm:text-xl md:text-2xl font-medium text-white tracking-tight leading-tight group-hover:text-slate-300 transition-colors truncate">
            <HighlightText text={trip.title} highlight={searchTerm} />
          </h3>
          <span className="hidden md:block text-[10px] text-slate-700 font-mono ml-4 shrink-0">{trip.date}</span>
        </div>

        <p className="hidden md:block text-sm sm:text-base text-slate-400 line-clamp-2 mb-5 leading-relaxed font-light">
          {trip.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1.5 overflow-hidden">
            {locations.slice(0, 2).map((loc, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); onTagClick(loc); }}
                className="text-[10px] text-slate-500 border border-white/[0.06] px-2.5 py-1 tracking-wide hover:text-white hover:border-white/20 transition-colors truncate max-w-[90px] md:max-w-[130px]"
              >
                {loc}
              </button>
            ))}
            {locations.length > 2 && <span className="text-[10px] text-slate-700 self-center">+{locations.length - 2}</span>}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 font-mono">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
            <span className="text-slate-400">{totalPhotos}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// --- 5. Main Component ---
const TravelGallery = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const years = useMemo(() => {
    const allYears = travelData.map(t => t.date?.match(/\d{4}/)?.[0]).filter(Boolean);
    return ['All', ...new Set(allYears)].sort((a, b) => b - a);
  }, []);

  const filteredAndSortedTrips = useMemo(() => {
    let filtered = travelData.filter(trip => {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesMain = trip.title.toLowerCase().includes(lowerSearch);
      const matchesDest = (trip.photos || []).some(p => p.location.toLowerCase().includes(lowerSearch));
      const matchesYear = selectedYear === 'All' || trip.date?.includes(selectedYear);
      return (matchesMain || matchesDest) && matchesYear;
    });
    return filtered.sort((a, b) => {
      if (sortBy === 'photos') return (b.photos?.length || 0) - (a.photos?.length || 0);
      return new Date(b.date) - new Date(a.date);
    });
  }, [searchTerm, selectedYear, sortBy]);

  return (
    <div className="w-full bg-transparent text-white py-5 md:py-8 lg:py-10 px-6 md:px-10 font-sans">
      <div className="max-w-[1100px] mx-auto">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="text-[10px] tracking-[0.35em] text-slate-600 uppercase font-medium mb-10 md:mb-14"
        >
          Journeys
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
          className="text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[8rem] leading-[0.95] font-medium tracking-tighter text-white mb-10 md:mb-14"
        >
          Visual <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--theme-stroke)' }}>Diaries.</span>
        </motion.h2>

        {/* Stats */}
        <ModernStats trips={travelData} />

        {/* Command bar */}
        <ModernCommandBar
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          selectedYear={selectedYear} setSelectedYear={setSelectedYear}
          sortBy={sortBy} setSortBy={setSortBy}
          years={years} resultCount={filteredAndSortedTrips.length}
        />

        {/* Cards grid */}
        <motion.div
          layout
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-white/[0.05]"
        >
          <AnimatePresence mode="popLayout">
            {filteredAndSortedTrips.map((trip) => (
              <ModernCard
                key={trip.id}
                trip={trip}
                searchTerm={searchTerm}
                onClick={() => navigate(`/travel/${trip.id}`)}
                onTagClick={setSearchTerm}
              />
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
};

export default TravelGallery;
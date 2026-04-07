import React, { useState, useMemo, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { travelData } from '../sections/travelData';

// --- 1. Precision Highlight ---
const HighlightText = ({ text, highlight }) => {
  if (!highlight || !highlight.trim() || !text) return <>{text}</>;
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="text-blue-400 font-medium border-b border-blue-400/50">
            {part}
          </span>
        ) : part
      )}
    </>
  );
};

// --- 2. Compact Bento Stats ---
const ModernStats = ({ trips }) => {
  const stats = useMemo(() => {
    const totalPhotos = trips.reduce((acc, t) => acc + (t.photos?.length || 0), 0);
    // Unique locations across all trips:
    const uniqueLocs = new Set();
    trips.forEach(t => {
      (t.photos || []).forEach(p => {
        if (p.location) uniqueLocs.add(p.location.toLowerCase());
      });
    });

    return [
      { label: 'Photos', value: totalPhotos },
      { label: 'Logs', value: trips.length },
      { label: 'Stops', value: uniqueLocs.size },
    ];
  }, [trips]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-row flex-wrap items-start justify-start gap-3 md:gap-6 mb-6 md:mb-10 w-full"
      style={{ minHeight: '80px' }}
    >
      {stats.map((stat, i) => (
        <div key={i} style={{ width: '120px', height: '80px', flex: '0 0 auto' }} className="flex flex-col justify-center items-start px-5 py-3 bg-white/[0.03] border border-white/5 rounded-2xl backdrop-blur-md shadow-2xl ring-1 ring-white/10 hover:bg-white/[0.08] transition-all">
          <span className="text-[11px] md:text-sm uppercase tracking-[0.2em] text-white/50 block leading-none mb-2 font-medium">{stat.label}</span>
          <span className="text-3xl font-extrabold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent leading-none block">{stat.value}</span>
        </div>
      ))}
    </motion.div>
  );
};

// --- 3. Responsive Command Bar ---
const ModernCommandBar = ({ searchTerm, setSearchTerm, selectedYear, setSelectedYear, sortBy, setSortBy, years, resultCount }) => {
  return (
    <motion.div
      className="max-w-4xl mx-auto mb-10 p-1.5 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl flex flex-col md:flex-row items-center gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <div className="relative flex-1 w-full flex items-center px-4">
        <span className="text-white/30 mr-3 text-lg">⌕</span>
        <input
          type="text"
          placeholder="Search by title, location or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none py-3 text-sm md:text-base text-white focus:outline-none placeholder:text-white/20"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto px-2 md:px-0">
        <select
          className="bg-white/5 border border-white/10 rounded-lg text-white/80 text-xs md:text-sm font-medium px-3 py-2.5 focus:outline-none cursor-pointer flex-1 md:flex-none hover:bg-white/10 transition-colors"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map(y => <option key={y} value={y} className="bg-zinc-900">{y === 'All' ? 'ALL YEARS' : y}</option>)}
        </select>
        <select
          className="bg-white/5 border border-white/10 rounded-lg text-white/80 text-xs md:text-sm font-medium px-3 py-2.5 focus:outline-none cursor-pointer flex-1 md:flex-none hover:bg-white/10 transition-colors"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest" className="bg-zinc-900">NEWEST</option>
          <option value="photos" className="bg-zinc-900">MOST PHOTOS</option>
        </select>
        <div className="px-3 py-1 mr-1 text-xs text-blue-400 font-mono hidden md:block rounded-md bg-blue-500/10 border border-blue-500/20">{resultCount} FOUND</div>
      </div>
    </motion.div>
  );
};

// --- 4. Responsive Detail-Rich Card ---
const ModernCard = forwardRef(({ trip, searchTerm, onClick, onTagClick }, ref) => {
  const cover = trip.coverImage || trip.photos?.[0]?.url;
  const totalPhotos = trip.photos?.length || 0;

  // Calculate top 2 locations to show on card
  const locations = Array.from(new Set(trip.photos?.map(p => p.location).filter(Boolean)));

  return (
    <motion.div
      ref={ref}
      layout
      variants={{ hidden: { opacity: 0, y: 30, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1 } }}
      whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
      onClick={onClick}
      className="group relative flex flex-row md:flex-col bg-white/[0.02] backdrop-blur-lg border border-white/[0.08] lg:border-white/[0.05] rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500 cursor-pointer h-[120px] md:h-auto"
    >
      <div className="w-[120px] md:w-auto aspect-square md:aspect-[16/10] overflow-hidden relative flex-shrink-0">
        <img
          src={cover}
          alt={trip.title}
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
      </div>

      <div className="p-4 md:p-6 flex flex-col justify-center md:justify-start flex-1 min-w-0 z-10">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base md:text-xl font-bold text-white truncate leading-tight group-hover:text-blue-400 transition-colors">
            <HighlightText text={trip.title} highlight={searchTerm} />
          </h3>
          <span className="hidden md:block text-[10px] text-white/40 font-mono border border-white/10 px-2 py-1 rounded-md bg-black/30">
            {trip.date}
          </span>
        </div>

        <p className="hidden md:block text-xs text-white/50 line-clamp-2 mb-4 leading-relaxed font-light">
          {trip.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1.5 overflow-hidden">
            {locations.slice(0, 2).map((loc, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); onTagClick(loc); }}
                className="text-[10px] text-blue-300 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20 truncate max-w-[80px] md:max-w-[120px] hover:bg-blue-500/20 transition-colors"
              >
                {loc}
              </button>
            ))}
            {locations.length > 2 && (
              <span className="text-[10px] text-white/30 self-center font-medium">+{locations.length - 2}</span>
            )}
          </div>

          <div className="text-[10px] text-white/40 font-mono flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded-md border border-white/5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
            <span className="text-white/80 font-bold">{totalPhotos}</span>
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
      if (sortBy === 'photos') {
        const photosA = a.photos?.length || 0;
        const photosB = b.photos?.length || 0;
        return photosB - photosA;
      }
      return new Date(b.date) - new Date(a.date);
    });
  }, [searchTerm, selectedYear, sortBy]);

  return (
    <div className="w-full min-h-screen bg-transparent text-zinc-100 p-4 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-[1400px] mx-auto pt-8">

        <header className="mb-8 md:mb-14 relative z-20 flex flex-col items-start w-full">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-white/50 font-bold">Journeys</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 md:mb-10 drop-shadow-2xl relative z-10 w-full block"
          >
            Visual<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-400">.Diaries</span>
          </motion.h1>

          <ModernStats trips={travelData} />

          <ModernCommandBar
            searchTerm={searchTerm} setSearchTerm={setSearchTerm}
            selectedYear={selectedYear} setSelectedYear={setSelectedYear}
            sortBy={sortBy} setSortBy={setSortBy}
            years={years} resultCount={filteredAndSortedTrips.length}
          />
        </header>

        <motion.div
          layout
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8"
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
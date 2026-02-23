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
    const totalPhotos = trips.reduce((acc, t) => acc + t.destinations.reduce((dAcc, d) => dAcc + (d.photos?.length || 0), 0), 0);
    const totalDest = trips.reduce((acc, t) => acc + t.destinations.length, 0);

    return [
      { label: 'Stops', value: totalDest },
      { label: 'Photos', value: totalPhotos },
      { label: 'Logs', value: trips.length },
    ];
  }, [trips]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex justify-center md:justify-start gap-3 mb-8 md:mb-12"
    >
      {stats.map((stat, i) => (
        <div key={i} className="px-3 py-1.5 md:px-5 md:py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md">
          <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-white/40 block leading-none mb-1">{stat.label}</span>
          <span className="text-sm md:text-xl font-bold text-white leading-none">{stat.value}</span>
        </div>
      ))}
    </motion.div>
  );
};

// --- 3. Responsive Command Bar ---
const ModernCommandBar = ({ searchTerm, setSearchTerm, selectedYear, setSelectedYear, sortBy, setSortBy, years, resultCount }) => {
  return (
    <motion.div 
      className="max-w-4xl mx-auto mb-10 p-1 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-xl md:rounded-2xl flex flex-col md:flex-row items-center gap-1 shadow-xl"
    >
      <div className="relative flex-1 w-full flex items-center px-3">
        <span className="text-white/20 mr-2 text-xs">⌕</span>
        <input 
          type="text" 
          placeholder="Filter..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none py-2 text-sm text-white focus:outline-none placeholder:text-white/20"
        />
      </div>

      <div className="flex items-center gap-1 w-full md:w-auto p-1 md:bg-black/20 rounded-lg">
        <select 
          className="bg-transparent text-white/70 text-[10px] font-bold px-2 py-1.5 focus:outline-none cursor-pointer flex-1 md:flex-none"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map(y => <option key={y} value={y} className="bg-zinc-900">{y === 'All' ? 'ALL' : y}</option>)}
        </select>
        <select 
          className="bg-transparent text-white/70 text-[10px] font-bold px-2 py-1.5 focus:outline-none cursor-pointer flex-1 md:flex-none"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest" className="bg-zinc-900">NEW</option>
          <option value="photos" className="bg-zinc-900">IMG</option>
        </select>
        <div className="px-2 text-[10px] text-blue-400 font-mono hidden md:block">{resultCount} FOUND</div>
      </div>
    </motion.div>
  );
};

// --- 4. Responsive Detail-Rich Card (FIXED WITH FORWARDREF) ---
const ModernCard = forwardRef(({ trip, searchTerm, onClick, onTagClick }, ref) => {
  const cover = trip.coverImage || trip.destinations?.[0]?.photos?.[0]?.url;
  const totalPhotos = trip.destinations.reduce((acc, d) => acc + (d.photos?.length || 0), 0);

  return (
    <motion.div 
      ref={ref} // <--- Added ref here so Framer Motion can grab it
      layout
      variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
      onClick={onClick}
      // Compact Mobile Row Layout vs Desktop Column Layout
      className="group relative flex flex-row md:flex-col bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 cursor-pointer h-[100px] md:h-auto"
    >
      {/* Thumbnail */}
      <div className="w-[100px] md:w-auto aspect-square md:aspect-[16/10] overflow-hidden relative flex-shrink-0">
        <img 
          src={cover} 
          alt={trip.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Content Area */}
      <div className="p-3 md:p-5 flex flex-col justify-center md:justify-start flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-sm md:text-lg font-semibold text-white truncate leading-tight">
            <HighlightText text={trip.title} highlight={searchTerm} />
          </h3>
          <span className="hidden md:block text-[9px] text-white/30 font-mono border border-white/10 px-1.5 py-0.5 rounded">
            {trip.date}
          </span>
        </div>

        {/* Detailed Info (Visible on desktop, semi-hidden on mobile to save space) */}
        <p className="hidden md:block text-[11px] text-white/40 line-clamp-2 mb-3 leading-relaxed">
          {trip.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1 overflow-hidden">
            {trip.destinations.slice(0, 1).map((dest, i) => (
              <button 
                key={i} 
                onClick={(e) => { e.stopPropagation(); onTagClick(dest.name); }}
                className="text-[9px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 truncate max-w-[80px] md:max-w-none"
              >
                {dest.name}
              </button>
            ))}
            {trip.destinations.length > 1 && (
              <span className="text-[9px] text-white/20 self-center">+{trip.destinations.length - 1}</span>
            )}
          </div>
          
          <div className="text-[9px] text-white/30 font-mono">
             <span className="text-white/60">{totalPhotos}</span> PHOTOS
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
      const matchesDest = trip.destinations.some(d => d.name.toLowerCase().includes(lowerSearch));
      const matchesYear = selectedYear === 'All' || trip.date?.includes(selectedYear);
      return (matchesMain || matchesDest) && matchesYear;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'photos') {
        const getPhotos = (t) => t.destinations.reduce((acc, d) => acc + (d.photos?.length || 0), 0);
        return getPhotos(b) - getPhotos(a);
      }
      return new Date(b.date) - new Date(a.date);
    });
  }, [searchTerm, selectedYear, sortBy]);

  return (
    <div className="w-full min-h-screen bg-transparent text-zinc-100 p-4 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-[1400px] mx-auto">
        
        <header className="mb-8 md:mb-16">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 mb-2 md:mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Travel Records</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-6xl font-bold tracking-tight text-white mb-6 md:mb-10"
          >
            Travel<span className="text-white/20">.Log</span>
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
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
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
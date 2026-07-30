import React, { useState, useMemo, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { FiImage } from 'react-icons/fi';

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

// Helper to get total photo count for nested trips
const getPhotoCount = (trip) => {
  let count = 0;
  if (trip.photos) count += trip.photos.length;
  if (trip.destinations) {
    trip.destinations.forEach(dest => {
      if (dest.points) {
        dest.points.forEach(pt => {
          if (pt.photos) count += pt.photos.length;
        });
      }
    });
  }
  return count;
};

// Helper to get all unique locations
const getLocations = (trip) => {
  const locs = new Set();
  if (trip.photos) trip.photos.forEach(p => p.location && locs.add(p.location));
  if (trip.destinations) {
    trip.destinations.forEach(dest => {
      if (dest.points) {
        dest.points.forEach(pt => {
          if (pt.name) locs.add(pt.name);
          if (pt.photos) pt.photos.forEach(p => p.location && locs.add(p.location));
        });
      }
    });
  }
  return Array.from(locs);
};

// --- 2. Stats row — Apple editorial style ---
const ModernStats = ({ trips }) => {
  const stats = useMemo(() => {
    const totalPhotos = trips.reduce((acc, t) => acc + getPhotoCount(t), 0);
    const uniqueLocs = new Set();
    trips.forEach(t => getLocations(t).forEach(loc => uniqueLocs.add(loc.toLowerCase())));
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
  let cover = trip.coverImage;
  if (!cover) {
    if (trip.photos?.[0]) cover = trip.photos[0].url;
    else if (trip.destinations?.[0]?.points?.[0]?.photos?.[0]) cover = trip.destinations[0].points[0].photos[0].url;
  }
  
  const totalPhotos = getPhotoCount(trip);
  const locations = getLocations(trip);

  return (
    <motion.div
      ref={ref}
      layout
      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
      whileHover={{ y: -6, transition: { duration: 0.3, ease } }}
      onClick={onClick}
      className="group min-w-[85vw] sm:min-w-0 snap-center flex-shrink-0 relative flex flex-col bg-gradient-to-b from-white/[0.04] to-transparent sm:bg-black border border-white/[0.08] hover:border-emerald-500/30 sm:hover:border-white/15 overflow-hidden transition-all duration-500 cursor-pointer h-auto rounded-[2rem] sm:rounded-none shadow-xl hover:shadow-emerald-500/10 sm:shadow-none backdrop-blur-xl sm:backdrop-blur-none"
    >
      {/* Image */}
      <div className="w-full aspect-[4/3] overflow-hidden relative flex-shrink-0 rounded-t-[2rem] sm:rounded-none">
        <img
          src={cover} alt={trip.title}
          loading="lazy" decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col justify-start flex-1 min-w-0 border-t border-white/[0.05] sm:border-t-0">
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

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><FiImage /> {totalPhotos}</span>
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
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const unsub = onSnapshot(collection(db, 'trips'), (snapshot) => {
      let tripsData = [];
      snapshot.forEach(doc => {
        tripsData.push({ id: doc.id, ...doc.data() });
      });
      setTrips(tripsData);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const years = useMemo(() => {
    const allYears = trips.map(t => t.date?.match(/\d{4}/)?.[0]).filter(Boolean);
    return ['All', ...new Set(allYears)].sort((a, b) => b - a);
  }, [trips]);

  const filteredAndSortedTrips = useMemo(() => {
    let filtered = trips.filter(trip => {
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
  }, [searchTerm, selectedYear, sortBy, trips]);

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
        {!loading && <ModernStats trips={trips} />}

        {/* Command bar */}
        <ModernCommandBar
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          selectedYear={selectedYear} setSelectedYear={setSelectedYear}
          sortBy={sortBy} setSortBy={setSortBy}
          years={years} resultCount={filteredAndSortedTrips.length}
        />

        {/* Cards grid wrapper for cinematic edge masking on mobile */}
        <div className="relative w-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] sm:[mask-image:none]">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div
              layout
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden" animate="show"
              className="flex overflow-x-auto sm:grid sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-px sm:bg-white/[0.05] pb-8 pt-4 px-6 -mx-6 sm:px-0 sm:mx-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
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
          )}
        </div>

      </div>
    </div>
  );
};

export default TravelGallery;

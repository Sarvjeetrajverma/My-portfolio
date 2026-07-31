import React, { useState, useMemo, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { FiImage } from 'react-icons/fi';
import { FaArrowRight } from 'react-icons/fa';

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
          <option value="featured" className="bg-black">FEATURED</option>
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
      className="group w-[85vw] sm:w-[320px] md:w-[360px] lg:w-[380px] shrink-0 snap-center relative flex flex-col bg-[#0A0A0A] border border-white/5 hover:border-emerald-500/40 overflow-hidden transition-all duration-500 cursor-pointer h-auto rounded-[2rem] shadow-2xl hover:shadow-[0_8px_30px_rgba(16,185,129,0.15)]"
    >
      {/* Image */}
      <div className="w-full aspect-[4/3] overflow-hidden relative flex-shrink-0 rounded-t-[2rem]">
        <img
          src={cover} alt={trip.title}
          loading="lazy" decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r md:bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col justify-start flex-1 min-w-0 border-t border-white/[0.05]">
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

const TravelGallery = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      // Calculate scroll based on device width to perfectly advance one card at a time
      const cardWidth = window.innerWidth > 1024 ? 380 : window.innerWidth > 768 ? 360 : window.innerWidth > 640 ? 320 : window.innerWidth * 0.85;
      const gap = window.innerWidth > 640 ? 32 : 24; 
      const scrollAmount = cardWidth + gap;
      
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  // Drag to scroll logic
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; 
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  React.useEffect(() => {
    const unsub = onSnapshot(collection(db, 'trips'), (snapshot) => {
      let tripsData = [];
      snapshot.forEach(doc => {
        tripsData.push({ id: doc.id, order: doc.data().order || 0, ...doc.data() });
      });
      tripsData.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
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
      // Default to sorting by the custom 'order' field
      if (a.order !== b.order) return a.order - b.order;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
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

        {/* Cards scroll wrapper */}
        <div className="relative w-full group/gallery">
            
            {/* Desktop Scroll Buttons */}
            {!loading && filteredAndSortedTrips.length > 2 && (
              <>
                <button 
                  onClick={() => scroll('left')}
                  className="hidden sm:flex opacity-0 group-hover/gallery:opacity-100 absolute left-4 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full border border-white/10 shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <FaArrowRight size={16} className="text-white rotate-180 opacity-70 hover:opacity-100 transition-opacity" />
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="hidden sm:flex opacity-0 group-hover/gallery:opacity-100 absolute right-4 top-1/2 -translate-y-1/2 z-30 items-center justify-center w-12 h-12 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full border border-white/10 shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105"
                >
                  <FaArrowRight size={16} className="text-white opacity-70 hover:opacity-100 transition-opacity" />
                </button>
              </>
            )}

            {/* Mobile Swipe Hint */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: [0, 1, 1, 1, 0], x: [20, 0, 0, 0, 10] }}
              viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              transition={{ duration: 4, times: [0, 0.1, 0.7, 0.9, 1] }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 sm:hidden flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-2xl pointer-events-none"
            >
              <span className="text-white/80 text-[11px] font-bold tracking-widest uppercase">Swipe</span>
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
              >
                <FaArrowRight size={14} className="text-white" />
              </motion.div>
            </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              layout
              variants={{ show: { transition: { staggerChildren: 0.07 } } }}
              initial="hidden" animate="show"
              className={`flex overflow-x-auto gap-6 sm:gap-8 pb-10 pt-4 px-6 sm:px-12 -mx-6 sm:-mx-12 snap-x snap-mandatory scroll-smooth ${isDragging ? 'cursor-grabbing !scroll-auto !snap-none' : 'cursor-grab'} [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent group-hover/gallery:[&::-webkit-scrollbar-track]:bg-white/[0.02] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent group-hover/gallery:[&::-webkit-scrollbar-thumb]:bg-white/[0.1] hover:[&::-webkit-scrollbar-thumb]:!bg-white/[0.2] [&::-webkit-scrollbar-thumb]:rounded-full transition-colors duration-500`}
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

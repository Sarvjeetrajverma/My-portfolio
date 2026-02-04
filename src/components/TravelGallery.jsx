import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { travelData } from '../sections/travelData'; 
import './TravelGallery.css';

// --- 1. Helper for Highlighting Text ---
const HighlightText = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) return <>{text}</>;
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="highlight">{part}</span>
        ) : part
      )}
    </>
  );
};

// --- 2. NEW CUSTOM DROPDOWN (Fixes the background issue) ---
const CustomDropdown = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown-container" ref={dropdownRef}>
      <button 
        className={`dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value === 'All' ? 'All Years' : value}</span>
        <motion.span 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="dropdown-arrow"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="dropdown-menu"
            initial={{ opacity: 0, y: -10, scaleY: 0.9 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((option) => (
              <div 
                key={option} 
                className={`dropdown-item ${value === option ? 'selected' : ''}`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option === 'All' ? 'All Years' : option}
                {value === option && <span className="check-icon">✓</span>}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 3. 3D Tilt Card Component ---
const TiltCard = ({ children, onClick, imageSrc, title }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 30 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);
  const imageX = useTransform(mouseX, [-0.5, 0.5], ["5%", "-5%"]);
  const imageY = useTransform(mouseY, [-0.5, 0.5], ["5%", "-5%"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0);
  };

  return (
    <motion.div
      className="trip-card-container"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="card-image-wrapper">
        <motion.img src={imageSrc} alt={title} style={{ x: imageX, y: imageY, scale: 1.15 }} className="card-image"/>
        <div className="card-overlay" />
      </div>
      <div className="card-content" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

// --- 4. Travel Stats Component ---
const TravelStats = ({ trips }) => {
  const stats = useMemo(() => {
    const totalTrips = trips.length;
    const totalPhotos = trips.reduce((acc, trip) => 
      acc + trip.destinations.reduce((dAcc, dest) => dAcc + (dest.photos?.length || 0), 0), 0
    );
    const years = new Set(trips.map(t => t.date.match(/\d{4}/)?.[0]).filter(Boolean)).size;
    
    return [
      { label: 'Expeditions', value: totalTrips, icon: '✈️' },
      { label: 'Snapshots', value: totalPhotos, icon: '📸' },
      { label: 'Years Active', value: years, icon: '🗓️' },
    ];
  }, [trips]);

  return (
    <div className="flex justify-center gap-4 md:gap-8 mb-12 flex-wrap">
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex flex-col items-center p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm min-w-[120px] hover:bg-white/10 transition-colors"
        >
          <span className="text-2xl mb-2">{stat.icon}</span>
          <span className="text-3xl font-bold text-white font-mono">{stat.value}</span>
          <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

// --- 5. Photo Carousel Component ---
const PhotoCarousel = ({ trips }) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  
  const allPhotos = useMemo(() => 
    trips.flatMap(t => 
      t.destinations.flatMap(d => 
        (d.photos || []).map(p => ({ ...p, tripId: t.id, tripTitle: t.title }))
      )
    ).filter(p => p && p.url), 
  [trips]);

  useEffect(() => {
    if (allPhotos.length === 0 || isPaused) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % allPhotos.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [allPhotos.length, isPaused]);

  if (allPhotos.length === 0) return null;
  const photo = allPhotos[index];

  return (
    <div 
      className="w-full max-w-5xl mx-auto mb-16 px-4 h-[400px] md:h-[600px] relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode='wait'>
        <motion.div
          key={photo.id || index}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img 
            src={photo.url} 
            alt={photo.caption} 
            className="w-full h-full object-cover"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col md:flex-row justify-between items-end gap-6"
            >
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-cyan-400 text-xs font-mono tracking-widest uppercase bg-cyan-950/50 px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-md">
                    {photo.tripTitle}
                  </span>
                  <span className="text-gray-300 text-xs font-mono bg-black/30 px-2 py-1 rounded backdrop-blur-md">
                    {photo.date}
                  </span>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight drop-shadow-xl">
                  {photo.location}
                </h3>
                <p className="text-gray-200 text-sm md:text-base line-clamp-2 max-w-xl drop-shadow-md">
                  {photo.caption}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(6, 182, 212, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/travel/${photo.tripId}`);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-white font-semibold transition-all group/btn whitespace-nowrap"
              >
                View Album
                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation Arrows */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
        <button 
          className="pointer-events-auto w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
          onClick={() => setIndex(prev => (prev - 1 + allPhotos.length) % allPhotos.length)}
        >
          ←
        </button>
        <button 
          className="pointer-events-auto w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
          onClick={() => setIndex(prev => (prev + 1) % allPhotos.length)}
        >
          →
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
        {!isPaused && (
          <motion.div 
            key={index}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
          />
        )}
      </div>
    </div>
  );
};

// --- 4. Main Gallery Component ---
const TravelGallery = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');

  const years = useMemo(() => {
    const allYears = travelData.map(trip => {
      const match = trip.date ? trip.date.match(/\d{4}/) : null;
      return match ? match[0] : null;
    }).filter(Boolean);
    return ['All', ...new Set(allYears)].sort((a, b) => b - a);
  }, []);

  const filteredTrips = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return travelData.filter(trip => {
      const matchesMain = trip.title.toLowerCase().includes(lowerSearch) || trip.description.toLowerCase().includes(lowerSearch);
      const matchesDest = trip.destinations.some(dest => dest.name.toLowerCase().includes(lowerSearch));
      const tripYear = trip.date.match(/\d{4}/)?.[0];
      const matchesYear = selectedYear === 'All' || tripYear === selectedYear;
      return (matchesMain || matchesDest) && matchesYear;
    });
  }, [searchTerm, selectedYear]);

  return (
    <div className="travel-gallery">
      <motion.div className="gallery-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2>My Travel Albums</h2>
        <p>Explore the places I've visited around the world</p>
      </motion.div>

      {/* STATS DASHBOARD */}
      <TravelStats trips={travelData} />

      {/* PHOTO CAROUSEL */}
      <PhotoCarousel trips={travelData} />

      <motion.div className="filter-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* REPLACED Standard Select with Custom Dropdown */}
        <CustomDropdown 
          options={years} 
          value={selectedYear} 
          onChange={setSelectedYear} 
        />
      </motion.div>

      <motion.div layout className="trips-grid">
        <AnimatePresence mode='popLayout'>
          {filteredTrips.length > 0 ? (
            filteredTrips.map(trip => {
              const imageSrc = trip.coverImage || trip.destinations?.[0]?.photos?.[0]?.url || 'https://via.placeholder.com/400';
              return (
                <TiltCard key={trip.id} onClick={() => navigate(`/travel/${trip.id}`)} imageSrc={imageSrc} title={trip.title}>
                  <div className="trip-info-container">
                    <div className="trip-header-row">
                      <h3><HighlightText text={trip.title} highlight={searchTerm} /></h3>
                      {trip.date.includes(new Date().getFullYear().toString()) && <span className="new-badge">NEW</span>}
                    </div>
                    <span className="trip-date">{trip.date}</span>
                    <p className="trip-desc"><HighlightText text={trip.description.substring(0, 80)} highlight={searchTerm} />...</p>
                    <div className="trip-tags">
                      {trip.destinations.slice(0, 3).map((dest, i) => (
                        <span key={i} className="trip-tag"><HighlightText text={dest.name} highlight={searchTerm} /></span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              );
            })
          ) : (
            <motion.div className="no-results">No trips found.</motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TravelGallery;
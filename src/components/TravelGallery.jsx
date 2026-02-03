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
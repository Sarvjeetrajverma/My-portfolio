import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { travelData } from '../sections/travelData';
import './TravelGallery.css';

// Helper for highlighting text
const HighlightText = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? <span key={i} className="highlight">{part}</span> : part
      )}
    </>
  );
};

// Tilt Card Component for 3D effect
const TiltCard = ({ children, onClick, coverImage, title }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 30 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);
  
  // Parallax effect: Image moves opposite to tilt
  const imageX = useTransform(mouseX, [-0.5, 0.5], ["8%", "-8%"]);
  const imageY = useTransform(mouseY, [-0.5, 0.5], ["8%", "-8%"]);

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
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="trip-card"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ height: '200px', overflow: 'hidden', borderRadius: '12px 12px 0 0', transform: "translateZ(20px)" }}>
        <motion.img 
          src={coverImage} 
          alt={title} 
          style={{
            x: imageX,
            y: imageY,
            scale: 1.15,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      <div style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

const TravelGallery = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('All');

  // Extract unique years from travelData
  const years = useMemo(() => {
    const allYears = travelData.map(trip => {
      const match = trip.date.match(/\d{4}/);
      return match ? match[0] : null;
    }).filter(Boolean);
    return ['All', ...new Set(allYears)].sort((a, b) => b - a);
  }, []);

  // Filter trips based on search and year
  const filteredTrips = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return travelData.filter(trip => {
      const matchesTrip = trip.title.toLowerCase().includes(lowerSearch) ||
                          trip.description.toLowerCase().includes(lowerSearch);

      const matchesDestinations = trip.destinations.some(dest => 
        dest.name.toLowerCase().includes(lowerSearch) ||
        dest.description.toLowerCase().includes(lowerSearch) ||
        dest.photos.some(photo => 
          (photo.location && photo.location.toLowerCase().includes(lowerSearch)) ||
          (photo.caption && photo.caption.toLowerCase().includes(lowerSearch))
        )
      );

      const matchesSearch = matchesTrip || matchesDestinations;
      const tripYear = trip.date.match(/\d{4}/)?.[0];
      const matchesYear = selectedYear === 'All' || tripYear === selectedYear;
      return matchesSearch && matchesYear;
    });
  }, [searchTerm, selectedYear]);

  // Helper to find matches inside destinations/photos for display
  const getDeepMatches = (trip, term) => {
    if (!term.trim()) return [];
    const lowerTerm = term.toLowerCase();
    const matches = [];

    trip.destinations.forEach(dest => {
      if (dest.name.toLowerCase().includes(lowerTerm)) {
        matches.push({ type: 'Dest', text: dest.name });
      }
      if (dest.description.toLowerCase().includes(lowerTerm)) {
         matches.push({ type: 'Desc', text: dest.description });
      }
      dest.photos.forEach(photo => {
        if (photo.location && photo.location.toLowerCase().includes(lowerTerm)) {
          matches.push({ type: 'Loc', text: photo.location });
        }
        if (photo.caption && photo.caption.toLowerCase().includes(lowerTerm)) {
          matches.push({ type: 'Cap', text: photo.caption });
        }
      });
    });

    // Deduplicate based on text
    const uniqueMatches = [];
    const seen = new Set();
    matches.forEach(m => {
      if (!seen.has(m.text)) {
        seen.add(m.text);
        uniqueMatches.push(m);
      }
    });

    return uniqueMatches.slice(0, 3); // Limit to 3 matches
  };

  return (
    <div className="travel-gallery">
      <div className="gallery-header">
        <h2>My Travel Albums</h2>
        <p>Explore the places I've visited</p>
      </div>

      <div className="filter-section">
        <input
          type="text"
          placeholder="Search trips..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="year-filter"
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="trips-grid">
        {filteredTrips.length > 0 ? (
          filteredTrips.map(trip => {
            const deepMatches = getDeepMatches(trip, searchTerm);
            return (
              <TiltCard key={trip.id} onClick={() => navigate(`/travel/${trip.id}`)} coverImage={trip.coverImage} title={trip.title}>
                <div className="trip-info">
                  <div className="trip-header-row">
                    <h3><HighlightText text={trip.title} highlight={searchTerm} /></h3>
                    {trip.date.includes(new Date().getFullYear().toString()) && (
                      <span className="new-badge">NEW</span>
                    )}
                  </div>
                  <span className="trip-date">{trip.date}</span>
                  <p><HighlightText text={trip.description} highlight={searchTerm} /></p>
                  
                  <div className="trip-tags">
                    {trip.destinations.slice(0, 3).map(dest => (
                      <span key={dest.id} className="trip-tag">
                        <HighlightText text={dest.name} highlight={searchTerm} />
                      </span>
                    ))}
                    {trip.destinations.length > 3 && (
                      <span className="trip-tag">+{trip.destinations.length - 3}</span>
                    )}
                  </div>
                  
                  {searchTerm && deepMatches.length > 0 && (
                    <div className="search-matches">
                      <small>Found in:</small>
                      {deepMatches.map((match, idx) => (
                        <div key={idx} className="match-item">
                          <span className="match-type">{match.type}:</span>
                          <HighlightText text={match.text} highlight={searchTerm} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TiltCard>
            );
          })
        ) : (
          <div className="no-results">No trips found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default TravelGallery;
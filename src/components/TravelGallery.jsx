import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
              <div key={trip.id} className="trip-card" onClick={() => navigate(`/travel/${trip.id}`)}>
                <img src={trip.coverImage} alt={trip.title} className="trip-cover" />
                <div className="trip-info">
                  <h3><HighlightText text={trip.title} highlight={searchTerm} /></h3>
                  <span className="trip-date">{trip.date}</span>
                  <p><HighlightText text={trip.description} highlight={searchTerm} /></p>
                  <p><strong>{trip.destinations.length} Destinations</strong></p>
                  
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
              </div>
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
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { travelData } from '../sections/travelData';
import ParticlesBackground from './ParticlesBackground';
import CustomCursor from './CustomCursor';
import Navbar from './Navbar';
import ScrollToTop from './ScrollToTop';
import './TravelGallery.css';

// Icons
const Icons = {
  Heart: ({ fill }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
  ),
  Share: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
  ),
  Download: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
  ),
  Close: () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  ),
  Back: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
  )
};

const INITIAL_PHOTOS_COUNT = 4;
const LOAD_MORE_COUNT = 4;

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [lightboxImage, setLightboxImage] = useState(null);
  const [likedPhotos, setLikedPhotos] = useState({});

  // Derive selectedTrip from tripId - no effect needed
  const selectedTrip = travelData.find(t => t.id === tripId);

  // Compute initial counts from selectedTrip (memoized for efficiency)
  const initialCounts = React.useMemo(() => {
    if (!selectedTrip) return {};
    const counts = {};
    selectedTrip.destinations.forEach(destination => {
      counts[destination.id] = INITIAL_PHOTOS_COUNT;
    });
    return counts;
  }, [selectedTrip]);

  // visibleCounts state with lazy initialization
  // Only recomputes on first render or when tripId changes (via lazyInit)
  const [visibleCounts, setVisibleCounts] = useState(() => {
    // This function runs once: on mount OR when lazyInit is triggered
    // We use a ref-like pattern: compute from selectedTrip, which only changes when tripId changes
    const trip = travelData.find(t => t.id === tripId);
    if (!trip) return {};
    const counts = {};
    trip.destinations.forEach(destination => {
      counts[destination.id] = INITIAL_PHOTOS_COUNT;
    });
    return counts;
  });

  // Effect to sync visibleCounts with initialCounts when tripId changes
  // This effect runs AFTER render, so it won't cause cascading renders
  useEffect(() => {
    setVisibleCounts(initialCounts);
  }, [initialCounts]);

  const handleLike = (photoId) => {
    setLikedPhotos(prev => ({ ...prev, [photoId]: !prev[photoId] }));
  };

  const handleLoadMore = (destinationId) => {
    setVisibleCounts(prev => ({ ...prev, [destinationId]: (prev[destinationId] || 0) + LOAD_MORE_COUNT }));
  };

  const handleShare = async (photo) => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Travel Photo', text: photo.caption, url: photo.url }); } catch (error) { console.log('Error sharing:', error); }
    } else { alert('Link copied to clipboard! (Simulation)'); }
  };

  const handleDownload = async (photo) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `travel-photo-${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) { console.error('Download failed:', error); window.open(photo.url, '_blank'); }
  };

  if (!selectedTrip) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div
      className="relative text-white min-h-screen bg-black overflow-hidden"
    >
      {/* Global Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
      >
        <ParticlesBackground />
        <div className="absolute -top-32 -left-32 w-[70vw] sm:w-[50vw] md:w-[40vw] h-[70vw] sm:h-[50vw] md:h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-30 sm:opacity-20 md:opacity-10 blur-[100px] sm:blur-[130px] md:blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[70vw] sm:w-[50vw] md:w-[40vw] h-[70vw] sm:h-[50vw] md:h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2] opacity-30 sm:opacity-20 md:opacity-10 blur-[100px] sm:blur-[130px] md:blur-[150px] animate-pulse delay-500"></div>
      </div>

      <CustomCursor />
      <Navbar />
      <ScrollToTop />

      <div className="relative z-10 travel-gallery">
        <button className="back-button" onClick={() => navigate(-1)}>
          <Icons.Back /> Back to Albums
        </button>
        
        <div className="gallery-header">
          <h2>{selectedTrip.title}</h2>
          <p>{selectedTrip.date}</p>
        </div>

        {selectedTrip.destinations.map(destination => (
          <div key={destination.id} className="destination-section">
            <div className="destination-header">
              <h3>{destination.name}</h3>
              <p>{destination.description}</p>
            </div>
            
            <div className="photos-grid">
              {destination.photos.length > 0 ? (
                destination.photos.slice(0, visibleCounts[destination.id]).map((photo, index) => (
                  <motion.div 
                    key={photo.id} 
                    className="photo-card"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
                  >
                    <img src={photo.url} alt={photo.caption} className="photo-thumbnail" onClick={() => setLightboxImage(photo)} />
                    <div className="photo-details">
                      <div className="photo-meta"><span>{photo.date}</span><span>{photo.location}</span></div>
                      <span className="photo-caption">{photo.caption}</span>
                      <div className="photo-actions">
                        <button className={`action-btn ${likedPhotos[photo.id] ? 'liked' : ''}`} onClick={() => handleLike(photo.id)}>
                          <Icons.Heart fill={likedPhotos[photo.id]} /> {likedPhotos[photo.id] ? 'Liked' : 'Like'}
                        </button>
                        <button className="action-btn" onClick={() => handleShare(photo)}><Icons.Share /> Share</button>
                        <button className="action-btn" onClick={() => handleDownload(photo)}><Icons.Download /> Download</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (<p>No photos added yet for this destination.</p>)}
            </div>

            {destination.photos.length > (visibleCounts[destination.id] || 0) && (
              <div className="load-more-container">
                <button onClick={() => handleLoadMore(destination.id)} className="load-more-button">Load More</button>
              </div>
            )}
          </div>
        ))}

        {lightboxImage && (
          <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
            <motion.div 
              className="lightbox-content" 
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button className="close-lightbox" onClick={() => setLightboxImage(null)}><Icons.Close /></button>
              <img src={lightboxImage.url} alt={lightboxImage.caption} className="lightbox-image" />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
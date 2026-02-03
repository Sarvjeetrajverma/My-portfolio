import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { travelData } from '../sections/travelData';
import Navbar from './Navbar';
import './TravelGallery.css'; 

// --- ICONS ---
const Icons = {
  Close: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  ArrowLeft: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>,
  ArrowRight: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>,
  Plus: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Minus: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Reset: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>,
  Download: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  Info: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  Maximize: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>,
  Minimize: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
};

// --- DRAGGABLE ZOOM VIEWER ---
const ZoomViewer = ({ photo, onClose, onNext, onPrev }) => {
  const [scale, setScale] = useState(1);
  const [showInfo, setShowInfo] = useState(false); // Hidden by default
  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef(null);

  // Zoom Handlers
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));
  const handleReset = () => setScale(1);
  const handleDoubleClick = () => setScale(prev => (prev === 1 ? 2.5 : 1));

  const handleWheel = (e) => {
    e.stopPropagation();
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  // Toggle Window Full Screen
  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullScreen(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Reset scale on photo change
  useEffect(() => {
    setScale(1);
  }, [photo]);

  return (
    <motion.div 
      className="viewer-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 1. INDEPENDENT CLOSE BUTTON (Always Visible) */}
      <button className="fixed-close-btn" onClick={onClose} title="Close">
        <Icons.Close />
      </button>

      {/* 2. TOP DETAILS (Conditionally Visible) */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            className="viewer-top-bar"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="viewer-info">
              <h3>{photo.location}</h3>
              <span>{photo.date}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. MAIN STAGE */}
      <div 
        className="viewer-stage" 
        ref={containerRef} 
        onWheel={handleWheel}
      >
        {scale === 1 && (
          <>
            <button className="nav-btn prev" onClick={onPrev}><Icons.ArrowLeft /></button>
            <button className="nav-btn next" onClick={onNext}><Icons.ArrowRight /></button>
          </>
        )}

        <motion.img
          key={photo.id}
          src={photo.url}
          alt={photo.caption}
          className="viewer-image"
          animate={{ scale: scale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag={scale > 1}
          dragConstraints={containerRef}
          dragElastic={0.2}
          onDoubleClick={handleDoubleClick}
          style={{ cursor: scale > 1 ? 'grab' : 'zoom-in' }}
          whileTap={{ cursor: scale > 1 ? 'grabbing' : 'zoom-in' }}
        />
      </div>

      {/* 4. SIDE TOOLBAR (Updated with Info & Fullscreen) */}
      <div className="viewer-toolbar">
        <button 
          className={`tool-btn info-toggle ${showInfo ? 'active' : ''}`} 
          onClick={() => setShowInfo(!showInfo)} 
          title="Toggle Details"
        >
          <motion.div
            animate={{ rotate: showInfo ? 360 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <Icons.Info />
          </motion.div>
        </button>

        <div className="tool-divider"></div>

        <button className="tool-btn" onClick={handleZoomIn} title="Zoom In"><Icons.Plus /></button>
        <button className="tool-btn" onClick={handleZoomOut} title="Zoom Out"><Icons.Minus /></button>
        <button className="tool-btn" onClick={handleReset} title="Reset"><Icons.Reset /></button>
        
        <div className="tool-divider"></div>

        <button className="tool-btn" onClick={toggleFullScreen} title="Fullscreen">
          {isFullScreen ? <Icons.Minimize /> : <Icons.Maximize />}
        </button>
        <button className="tool-btn" onClick={() => window.open(photo.url, '_blank')} title="Download"><Icons.Download /></button>
      </div>

      {/* 5. BOTTOM CAPTION (Conditionally Visible) */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            className="viewer-caption"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{photo.caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- MAIN COMPONENT ---
const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const trip = travelData.find(t => t.id === tripId);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleNavigate = useCallback((dir) => {
    if (!selectedPhoto || !trip) return;
    const allPhotos = trip.destinations.flatMap(d => d.photos);
    const idx = allPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (idx === -1) return;

    const newIdx = dir === 'next' 
      ? (idx + 1) % allPhotos.length 
      : (idx - 1 + allPhotos.length) % allPhotos.length;
    
    setSelectedPhoto(allPhotos[newIdx]);
  }, [selectedPhoto, trip]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!selectedPhoto) return;
      if (e.key === 'Escape') setSelectedPhoto(null);
      if (e.key === 'ArrowRight') handleNavigate('next');
      if (e.key === 'ArrowLeft') handleNavigate('prev');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedPhoto, handleNavigate]);

  if (!trip) return <div>Loading...</div>;

  return (
    <div className="gallery-root">
      <div className="starfield"></div>
      <div className="nebula"></div>
      <div className="shooting-star"></div>

      <Navbar forceHidden={!!selectedPhoto} />
      
      <div className="gallery-container">
        <button className="back-link" onClick={() => navigate(-1)}>← Back to Albums</button>
        
        <header className="gallery-header">
          <h1>{trip.title}</h1>
          <p>{trip.date}</p>
        </header>

        {trip.destinations.map(dest => (
          <section key={dest.id} className="dest-section">
            <h2>{dest.name}</h2>
            <div className="photo-grid">
              {dest.photos.map(photo => (
                <motion.div 
                  key={photo.id}
                  className="grid-card"
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img src={photo.url} alt={photo.caption} loading="lazy" />
                  <div className="card-overlay">{photo.location}</div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <ZoomViewer 
            photo={selectedPhoto} 
            onClose={() => setSelectedPhoto(null)}
            onNext={() => handleNavigate('next')}
            onPrev={() => handleNavigate('prev')}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripDetails;
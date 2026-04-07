import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { travelData } from '../sections/travelData'; 
import Navbar from './Navbar'; 
import './TravelGallery.css'; 

// --- FIREBASE IMPORTS ---
import { doc, onSnapshot, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase'; 

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
  Minimize: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>,
  Heart: ({ filled }) => <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
  Share: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>,
  Play: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
  Pause: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>,
  Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  Camera: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
};

// --- REAL-TIME FIREBASE HOOK ---
const usePhotoStats = (photos) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!photos || photos.length === 0) return;

    const unsubscribes = photos.map(photo => {
      if (!photo.id) {
        console.warn("Skipping stats for photo without ID", photo);
        return () => {};
      }

      const photoRef = doc(db, 'gallery_stats', String(photo.id));
      
      return onSnapshot(photoRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const userLikedLocally = localStorage.getItem(`liked_${photo.id}`) === 'true';
          
          setStats(prev => ({
            ...prev,
            [photo.id]: { ...data, userLiked: userLikedLocally }
          }));
        } else {
          setDoc(photoRef, { likes: 0, views: 0, downloads: 0, shares: 0 })
            .catch(err => console.error("Firebase Create Error:", err));
        }
      }, (error) => {
        console.error("Firebase Snapshot Error:", error);
      });
    });

    return () => unsubscribes.forEach(unsub => unsub && unsub());
  }, [photos]);

  const toggleLike = useCallback(async (photoId) => {
    if (!photoId) return alert("Cannot like: Photo ID is missing!");
    const photoRef = doc(db, 'gallery_stats', String(photoId));
    const localLikeKey = `liked_${photoId}`;
    const isLiked = localStorage.getItem(localLikeKey) === 'true';

    try {
      if (isLiked) {
        await updateDoc(photoRef, { likes: increment(-1) });
        localStorage.removeItem(localLikeKey);
      } else {
        await updateDoc(photoRef, { likes: increment(1) });
        localStorage.setItem(localLikeKey, 'true');
      }
    } catch (error) {
      alert(`Firebase Error (Like): ${error.message}`);
    }
  }, []);

  const recordView = useCallback(async (photoId) => {
    if (!photoId) return;
    const localViewKey = `viewed_${photoId}`;
    if (localStorage.getItem(localViewKey) !== 'true') {
      try {
        const photoRef = doc(db, 'gallery_stats', String(photoId));
        await updateDoc(photoRef, { views: increment(1) });
        localStorage.setItem(localViewKey, 'true'); 
      } catch (error) {
        console.error("Error recording view:", error);
      }
    }
  }, []);

  const recordAction = useCallback(async (photoId, actionType) => {
    if (!photoId) return;
    try {
      const photoRef = doc(db, 'gallery_stats', String(photoId));
      await updateDoc(photoRef, { [actionType]: increment(1) });
    } catch (error) {
      console.error(`Firebase Error (${actionType}): ${error.message}`);
    }
  }, []);

  return { stats, toggleLike, recordView, recordAction };
};

// --- DRAGGABLE ZOOM VIEWER ---
const ZoomViewer = ({ photo, stats, toggleLike, recordView, recordAction, onClose, onNext, onPrev }) => {
  const [scale, setScale] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (photo?.id) recordView(photo.id);
    setScale(1);
    setIsImageLoaded(false);
  }, [photo, recordView]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => onNext(), 4000); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, onNext]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));
  const handleReset = () => setScale(1);
  const handleDoubleClick = () => setScale(prev => (prev === 1 ? 2.5 : 1));

  const handleWheel = (e) => {
    e.stopPropagation();
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  const handleDownload = async () => {
    recordAction(photo.id, 'downloads');
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${photo.location?.replace(/\s+/g,'-') || 'photo'}-${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(photo.url, '_blank');
    }
  };

  const handleShare = async () => {
    recordAction(photo.id, 'shares');
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Beautiful photo from ${photo.location || 'my travels'}`,
          text: photo.caption,
          url: window.location.href, 
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

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

  const photoStats = stats[photo.id] || { likes: 0, views: 0, downloads: 0, shares: 0, userLiked: false };

  return (
    <motion.div 
      className="viewer-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button className="fixed-close-btn" onClick={onClose} title="Close">
        <Icons.Close />
      </button>

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
              <h3 style={{ margin: '0 0 5px', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '0.02em' }}>
                {photo.location || 'Unknown Location'}
              </h3>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{photo.date || ''}</span>
            </div>
            
            <div className="viewer-exif">
              <Icons.Camera />
              <span>Sony A7IV</span>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)' }}></span>
              <span>35mm f/1.4</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="viewer-stage" ref={containerRef} onWheel={handleWheel}>
        {scale === 1 && (
          <>
            <button className="nav-btn prev" onClick={onPrev}><Icons.ArrowLeft /></button>
            <button className="nav-btn next" onClick={onNext}><Icons.ArrowRight /></button>
          </>
        )}

        {!isImageLoaded && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #3b82f6', borderRadius: '50%' }} />
          </div>
        )}

        <motion.img
          key={photo.id}
          src={photo.url}
          alt={photo.caption}
          className="viewer-image"
          onLoad={() => setIsImageLoaded(true)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isImageLoaded ? 1 : 0, scale: scale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag={scale > 1}
          dragConstraints={containerRef}
          dragElastic={0.2}
          onDoubleClick={handleDoubleClick}
          style={{ cursor: scale > 1 ? 'grab' : 'zoom-in' }}
          whileTap={{ cursor: scale > 1 ? 'grabbing' : 'zoom-in' }}
        />
      </div>

      <div className="viewer-toolbar">
        <button 
          className="tool-btn" 
          onClick={() => toggleLike(photo.id)} 
          title={photoStats.userLiked ? "Unlike" : "Like"}
        >
          <motion.div whileTap={{ scale: 0.8 }}>
            <Icons.Heart filled={photoStats.userLiked} />
          </motion.div>
        </button>
        <button className="tool-btn" onClick={handleShare} title="Share"><Icons.Share /></button>
        
        <div className="tool-divider"></div>
        
        <button className="tool-btn" onClick={() => setIsPlaying(!isPlaying)} title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}>
          {isPlaying ? <Icons.Pause /> : <Icons.Play />}
        </button>

        <div className="tool-divider"></div>

        <button className={`tool-btn info-toggle ${showInfo ? 'active' : ''}`} onClick={() => setShowInfo(!showInfo)} title="Toggle Details">
          <motion.div animate={{ rotate: showInfo ? 360 : 0 }} transition={{ duration: 0.4 }}><Icons.Info /></motion.div>
        </button>
        <button className="tool-btn" onClick={handleZoomIn} title="Zoom In"><Icons.Plus /></button>
        <button className="tool-btn" onClick={handleZoomOut} title="Zoom Out"><Icons.Minus /></button>
        <button className="tool-btn" onClick={handleReset} title="Reset"><Icons.Reset /></button>
        <button className="tool-btn" onClick={toggleFullScreen} title="Fullscreen">
          {isFullScreen ? <Icons.Minimize /> : <Icons.Maximize />}
        </button>
        <button className="tool-btn" onClick={handleDownload} title="Download high-res"><Icons.Download /></button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div 
            className="viewer-caption"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
             <div className="viewer-stats-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Heart filled={photoStats.userLiked} /> {photoStats.likes} Likes</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Eye /> {photoStats.views} Views</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Download /> {photoStats.downloads || 0} Downloads</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Share /> {photoStats.shares || 0} Shares</span>
            </div>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', margin: 0, color: 'rgba(255,255,255,0.9)' }}>
              {photo.caption}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- MASONRY LAYOUT COMPONENT ---
const MasonryLayout = ({ photos, stats, toggleLike, onPhotoClick }) => {
  const [columns, setColumns] = useState(3);
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 600) setColumns(1);
      else if (window.innerWidth < 1000) setColumns(2);
      else if (window.innerWidth < 1400) setColumns(3);
      else setColumns(4);
    };
    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  useEffect(() => {
    setVisibleCount(12);
  }, [photos]);

  const sortedPhotos = useMemo(() => {
    let sorted = [...photos];
    if (sortOption === 'popularity') { 
       sorted.sort((a, b) => {
         const likesA = stats[a.id]?.likes || 0;
         const likesB = stats[b.id]?.likes || 0;
         return likesB - likesA;
       }); 
    }
    return sorted;
  }, [photos, sortOption, stats]);

  const visiblePhotos = useMemo(() => sortedPhotos.slice(0, visibleCount), [sortedPhotos, visibleCount]);

  const cols = useMemo(() => {
    const c = Array.from({ length: columns }, () => []);
    visiblePhotos.forEach((photo, i) => c[i % columns].push(photo));
    return c;
  }, [visiblePhotos, columns]);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 8);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="masonry-wrapper">
      <div className="masonry-controls">
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem' }}>
          Showing <span style={{ color: 'white' }}>{visiblePhotos.length}</span> of {photos.length} photos
        </div>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{
            padding: '10px 16px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            outline: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.2s ease',
          }}
        >
          <option value="default" style={{color: 'black'}}>Default Order</option>
          <option value="popularity" style={{color: 'black'}}>Most Popular</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {cols.map((col, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
            {col.map((photo) => {
              const photoStats = stats[photo.id] || { likes: 0, views: 0, userLiked: false };

              return (
                <motion.div 
                  key={photo.id}
                  className="grid-card group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  style={{ 
                    position: 'relative', 
                    borderRadius: '12px', 
                    overflow: 'hidden', 
                    background: 'rgba(255,255,255,0.02)'
                  }}
                >
                  <img 
                    src={photo.url} 
                    alt={photo.caption} 
                    loading="lazy" 
                    onClick={() => onPhotoClick(photo)}
                    className="w-full h-auto block transform origin-center transition-transform duration-700 ease-out group-hover:scale-105 cursor-zoom-in"
                  />
                  
                  <div 
                    className="card-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                      position: 'absolute',
                      bottom: 0, left: 0, right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                      padding: '40px 20px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {photo.location && (
                      <h4 style={{ margin: '0 0 10px', color: '#fff', fontSize: '1.05rem', fontWeight: '600' }}>
                        {photo.location}
                      </h4>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', pointerEvents: 'auto' }}>
                      <span style={{ display: 'flex', gap: '15px' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleLike(photo.id); }}
                          style={{ background: 'none', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: 0 }}
                          className="hover:text-white transition-colors"
                        >
                          <Icons.Heart filled={photoStats.userLiked} /> {photoStats.likes}
                        </button>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Icons.Eye /> {photoStats.views >= 1000 ? (photoStats.views / 1000).toFixed(1) + 'k' : photoStats.views}
                        </span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '60px', marginBottom: '40px', minHeight: '50px' }}>
        {isLoading ? (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ width: '30px', height: '30px', border: '3px solid rgba(59,130,246,0.2)', borderTop: '3px solid #3b82f6', borderRadius: '50%', display: 'inline-block' }} />
        ) : (
          <>
            {visibleCount < photos.length && (
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLoadMore}
                style={{ padding: '12px 36px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '30px', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: '500', backdropFilter: 'blur(10px)', transition: 'all 0.3s' }}
              >
                Load More
              </motion.button>
            )}
            
            {visibleCount >= photos.length && photos.length > 12 && (
              <motion.button 
                whileHover={{ opacity: 1 }}
                onClick={() => setVisibleCount(12)}
                style={{ padding: '12px 36px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '14px', fontWeight: '500', opacity: 0.8 }}
              >
                Hide Extra Photos
              </motion.button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  
  // Find the trip dynamically
  const safeTrip = useMemo(() => {
    const rawTrip = travelData.find(t => t.id === tripId);
    if (!rawTrip) return null;
    return {
      ...rawTrip,
      photos: rawTrip.photos || []
    };
  }, [tripId]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { stats, toggleLike, recordView, recordAction } = usePhotoStats(safeTrip?.photos || []);

  const handleNavigate = useCallback((dir) => {
    if (!selectedPhoto || !safeTrip) return;
    const allPhotos = safeTrip.photos;
    const idx = allPhotos.findIndex(p => p.id === selectedPhoto.id);
    if (idx === -1) return;

    const newIdx = dir === 'next' 
      ? (idx + 1) % allPhotos.length 
      : (idx - 1 + allPhotos.length) % allPhotos.length;
    
    setSelectedPhoto(allPhotos[newIdx]);
  }, [selectedPhoto, safeTrip]);

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

  const filteredPhotos = useMemo(() => {
    if (!safeTrip) return [];
    if (!searchTerm) return safeTrip.photos;
    const lowerTerm = searchTerm.toLowerCase();
    
    return safeTrip.photos.filter(photo => 
      (photo.caption && photo.caption.toLowerCase().includes(lowerTerm)) ||
      (photo.location && photo.location.toLowerCase().includes(lowerTerm))
    );
  }, [safeTrip, searchTerm]);

  if (!safeTrip) return (
    <div style={{ color:'white', textAlign:'center', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#050505', fontSize:'2rem', flexDirection: 'column', gap: '20px' }}>
      <p>Trip Not Found</p>
      <button onClick={() => navigate('/travel')} style={{ padding:'10px 20px', fontSize:'1rem', cursor:'pointer', background:'rgba(255,255,255,0.1)', border:'none', color:'white', borderRadius:'8px' }}>Return to Gallery</button>
    </div>
  );

  return (
    <div className="gallery-root">
      <Navbar forceHidden={!!selectedPhoto} />
      
      <div className="gallery-container" style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ paddingTop: '100px' }}>
          <button className="back-link" onClick={() => navigate(-1)}>
            ← Back to Journeys
          </button>
        </div>
        
        <header className="gallery-header" style={{ textAlign: 'center', marginBottom: '60px', marginTop: '40px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="trip-title">
              {safeTrip.title}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>{safeTrip.date}</p>
            {safeTrip.description && (
              <p style={{ maxWidth: '600px', margin: '20px auto 0', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                {safeTrip.description}
              </p>
            )}
          </motion.div>
        </header>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="search-wrapper" style={{ maxWidth: '600px', margin: '0 auto 60px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by location or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              style={{ 
                width: '100%', 
                padding: '16px 50px 16px 25px', 
                borderRadius: '40px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                background: 'rgba(255,255,255,0.03)', 
                color: 'white', 
                outline: 'none', 
                backdropFilter: 'blur(10px)',
                fontSize: '1rem',
                transition: 'all 0.3s ease'
              }}
            />
            <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, fontSize: '1.2rem' }}>
              🔍
            </span>
          </div>

          <section className="dest-section" style={{ marginBottom: '80px' }}>
            {filteredPhotos.length > 0 ? (
               <MasonryLayout 
                 photos={filteredPhotos} 
                 stats={stats}
                 toggleLike={toggleLike}
                 onPhotoClick={setSelectedPhoto} 
               />
            ) : (
               <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.4)', fontSize: '1.2rem' }}>
                 No moments found matching "{searchTerm}"
               </div>
            )}
          </section>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <ZoomViewer 
            photo={selectedPhoto} 
            stats={stats}
            toggleLike={toggleLike}
            recordView={recordView}
            recordAction={recordAction}
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
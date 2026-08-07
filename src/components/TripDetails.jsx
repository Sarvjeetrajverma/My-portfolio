import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';

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
      if (!photo.id) return () => {};

      try {
        if (!db) {
           console.error("Firebase DB is missing!");
           return () => {};
        }
        
        const photoRef = doc(db, 'gallery_stats', String(photo.id));
        return onSnapshot(photoRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const userLikedLocally = localStorage.getItem(`liked_${photo.id}`) === 'true';
            setStats(prev => ({ ...prev, [photo.id]: { ...data, userLiked: userLikedLocally } }));
          } else {
            setDoc(photoRef, { likes: 0, views: 0, downloads: 0, shares: 0 })
              .catch(err => {
                console.error("Firebase Create Error:", err);
                setStats(prev => ({ ...prev, [photo.id]: { likes: 0, views: 0, downloads: 0, shares: 0, userLiked: false } }));
              });
          }
        }, (error) => console.error("Firebase Snapshot Error:", error));
      } catch (err) {
        console.error("Critical Firebase Setup Error for photo:", photo.id, err);
        return () => {};
      }
    });

    return () => unsubscribes.forEach(unsub => unsub && typeof unsub === 'function' && unsub());
  }, [photos]);

  const toggleLike = useCallback(async (photoId) => {
    if (!photoId) return;
    try {
      if (!db) return;
      
      const localLikeKey = `liked_${photoId}`;
      const isLiked = localStorage.getItem(localLikeKey) === 'true';

      // 1. Optimistic Local Sync for Instant UI Response
      if (isLiked) {
        localStorage.removeItem(localLikeKey);
        setStats(prev => {
          if (!prev[photoId]) return prev;
          return { ...prev, [photoId]: { ...prev[photoId], likes: Math.max(0, prev[photoId].likes - 1), userLiked: false } };
        });
      } else {
        localStorage.setItem(localLikeKey, 'true');
        setStats(prev => {
          if (!prev[photoId]) return prev;
          return { ...prev, [photoId]: { ...prev[photoId], likes: prev[photoId].likes + 1, userLiked: true } };
        });
      }

      // 2. Actually update Firebase backend
      const photoRef = doc(db, 'gallery_stats', String(photoId));
      if (isLiked) {
        await updateDoc(photoRef, { likes: increment(-1) }).catch(e => console.error(e));
      } else {
        await updateDoc(photoRef, { likes: increment(1) }).catch(async (e) => {
          if (e.code === 'not-found') {
             await setDoc(photoRef, { likes: 1, views: 0, downloads: 0, shares: 0 }).catch(console.error);
          }
        });
      }
    } catch (error) {
      console.error(`Firebase Error (Like): ${error.message}`);
    }
  }, []);

  const recordView = useCallback(async (photoId) => {
    if (!photoId) return;
    
    try {
      const sessKey = `viewed_session_${photoId}`;
      if (sessionStorage.getItem(sessKey)) return; 
      sessionStorage.setItem(sessKey, 'true');

      if (!db) return;
      const photoRef = doc(db, 'gallery_stats', String(photoId));
      await updateDoc(photoRef, { views: increment(1) }).catch(async (e) => {
        if (e.code === 'not-found') {
          await setDoc(photoRef, { likes: 0, views: 1, downloads: 0, shares: 0 }).catch(console.error);
        }
      });
    } catch (error) {
      console.error("Error recording view:", error);
    }
  }, []);

  const recordAction = useCallback(async (photoId, actionType) => {
    if (!photoId) return;
    try {
      if (!db) return;
      const photoRef = doc(db, 'gallery_stats', String(photoId));
      await updateDoc(photoRef, { [actionType]: increment(1) });
    } catch (error) {
      console.error(`Firebase Error (${actionType}): ${error.message}`);
    }
  }, []);

  return { stats, toggleLike, recordView, recordAction };
};

// Helper to format large numbers
const formatCount = (count) => {
  if (!count) return 0;
  return count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count;
};

// --- GOOGLE PHOTOS STYLE VIEWER ---
const ZoomViewer = ({ photo, stats, toggleLike, recordView, recordAction, onClose, onNext, onPrev }) => {
  const [showUI, setShowUI] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [initialDistance, setInitialDistance] = useState(null);
  
  // Custom pointer-aware zoom states
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [currentScale, setCurrentScale] = useState(1);
  
  const containerRef = useRef(null);

  // Derive allPhotos context for swiping
  

  useEffect(() => {
    if (photo?.id) recordView(photo.id);
    scale.set(1);
    x.set(0);
    y.set(0);
    setCurrentScale(1);
    setIsImageLoaded(false);
    setShowInfo(false);
  }, [photo, recordView]);

  const handleZoom = (clientX, clientY, targetScale) => {
      const prevScale = scale.get();
      let newScale = Math.max(1, Math.min(targetScale, 4));
      
      if (newScale === prevScale) return;
      
      const ratio = newScale / prevScale;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const pointerX = clientX - centerX;
      const pointerY = clientY - centerY;
      
      const currentX = x.get();
      const currentY = y.get();
      
      let newX = pointerX - (pointerX - currentX) * ratio;
      let newY = pointerY - (pointerY - currentY) * ratio;
      
      if (newScale === 1) {
          newX = 0;
          newY = 0;
      }
      
      animate(scale, newScale, { type: "spring", stiffness: 300, damping: 30 });
      animate(x, newX, { type: "spring", stiffness: 300, damping: 30 });
      animate(y, newY, { type: "spring", stiffness: 300, damping: 30 });
      setCurrentScale(newScale);
  };

  const handleWheel = (e) => {
    e.stopPropagation();
    const delta = e.deltaY < 0 ? 0.5 : -0.5;
    handleZoom(e.clientX, e.clientY, scale.get() + delta);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    const targetScale = scale.get() === 1 ? 2.5 : 1;
    handleZoom(e.clientX, e.clientY, targetScale);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialDistance(dist);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialDistance) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const zoomFactor = dist / initialDistance;
      const targetScale = scale.get() * zoomFactor;
      
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      handleZoom(centerX, centerY, targetScale);
      setInitialDistance(dist);
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length < 2) setInitialDistance(null);
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
    }
  };

  const toggleFullScreen = async () => {
    if (!document.fullscreenElement) {
      try {
        const el = document.documentElement;
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) await el.msRequestFullscreen();
        setIsFullScreen(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullScreen(false);
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
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
      className="fixed inset-0 z-[100] bg-black text-white flex flex-col overflow-hidden touch-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* --- TOP BAR --- */}
      <AnimatePresence>
        {showUI && !showInfo && (
           <motion.div 
             className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-50 pointer-events-auto"
             initial={{ y: -70, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: -70, opacity: 0 }}
             transition={{ duration: 0.2 }}
           >
              <div className="flex items-center gap-3">
                 <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                   <Icons.ArrowLeft />
                 </button>
                 {photo.location && (
                    <div className="flex flex-col">
                       <span className="font-semibold text-sm md:text-[15px]">{photo.location}</span>
                       <span className="text-xs text-white/70">{photo.date}</span>
                    </div>
                 )}
              </div>
              <div className="flex items-center gap-1">
                 <button onClick={(e) => { e.stopPropagation(); toggleLike(photo.id); }} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Icons.Heart filled={photoStats.userLiked} />
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); toggleFullScreen(); }} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    {isFullScreen ? <Icons.Minimize /> : <Icons.Maximize />}
                 </button>
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN STAGE --- */}
      <div 
        className="flex-1 relative flex items-center justify-center overscroll-none min-h-0" 
        ref={containerRef}
        onClick={() => { if(!showInfo) setShowUI(!showUI); else setShowInfo(false); }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!isImageLoaded && (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="absolute w-10 h-10 border-4 border-white/10 border-t-white rounded-full" />
        )}

        {currentScale === 1 && showUI && !showInfo && window.innerWidth > 768 && onNext && onPrev && (
           <>
             <button className="absolute left-6 z-40 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-colors backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onPrev(); }}>
               <Icons.ArrowLeft />
             </button>
             <button className="absolute right-6 z-40 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-colors backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onNext(); }}>
               <Icons.ArrowRight />
             </button>
           </>
        )}

        {/* Cinematic Blur Background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <motion.img 
            key={`bg-${photo.id}`}
            src={photo.url} 
            alt="" 
            className="w-full h-full object-cover opacity-50 md:blur-[80px] scale-125"
            initial={{ opacity: 0 }}
            animate={{ opacity: isImageLoaded ? 0.5 : 0 }}
            transition={{ duration: 1.5 }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <motion.img
          key={photo.id}
          src={photo.url}
          alt={photo.caption}
          onLoad={() => setIsImageLoaded(true)}
          className="w-full h-full object-contain relative z-10"
          style={{ x, y, scale, cursor: currentScale > 1 ? 'grab' : 'default', willChange: 'transform' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: isImageLoaded ? 1 : 0 }}
          transition={{ opacity: { duration: 0.2 } }}
          drag
          dragConstraints={currentScale > 1 ? containerRef : { top: 0, bottom: 0, left: 0, right: 0 }}
          dragElastic={currentScale === 1 ? 0.6 : 0.2}
          onDragEnd={(e, info) => {
            if (currentScale === 1) {
              const hThreshold = window.innerWidth * 0.15;
              const vThreshold = 80;
              
              if (info.offset.x > hThreshold) onPrev(); else if (info.offset.x < -hThreshold) onNext();
              else if (info.offset.y > vThreshold) onClose();
              else if (info.offset.y < -vThreshold) { setShowInfo(true); setShowUI(false); }
            }
          }}
          onDoubleClick={handleDoubleClick}
          whileTap={{ cursor: currentScale > 1 ? 'grabbing' : 'default' }}
        />
      </div>

      {/* --- BOTTOM BAR --- */}
      <AnimatePresence>
        {showUI && !showInfo && (
           <motion.div 
             className="absolute bottom-0 left-0 w-full p-4 pb-8 flex justify-around items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent z-50 pointer-events-auto"
             initial={{ y: 80, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             exit={{ y: 80, opacity: 0 }}
             transition={{ duration: 0.2 }}
           >
              <button onClick={(e) => { e.stopPropagation(); handleShare(); }} className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white transition-colors">
                <Icons.Share /> <span className="text-[11px] font-medium tracking-wide">Share</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleDownload(); }} className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white transition-colors">
                <Icons.Download /> <span className="text-[11px] font-medium tracking-wide">Download</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setShowInfo(true); setShowUI(false); }} className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white transition-colors">
                <Icons.Info /> <span className="text-[11px] font-medium tracking-wide">Details</span>
              </button>
           </motion.div>
        )}
      </AnimatePresence>

      {/* --- INFO PANEL (DRAG-UP DRAWER) --- */}
      <AnimatePresence>
        {showInfo && (
           <>
             {/* Backdrop to close panel when clicking outside */}
             <motion.div 
                className="absolute inset-0 bg-transparent z-[55]"
                onClick={() => setShowInfo(false)}
             />
             <motion.div 
               className="absolute bottom-0 left-0 w-full bg-[#1e1e1e] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-[60] text-gray-200 p-6 pb-12 overscroll-none border-t border-white/10"
               initial={{ y: "100%" }} 
               animate={{ y: 0 }} 
               exit={{ y: "100%" }}
               transition={{ type: "spring", stiffness: 300, damping: 30 }}
               drag="y" 
               dragConstraints={{ top: 0, bottom: 0 }} 
               dragElastic={0.2}
               onDragEnd={(e, info) => { if (info.offset.y > 50) setShowInfo(false); }}
               onClick={(e) => e.stopPropagation()}
             >
                <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 shrink-0 cursor-grab active:cursor-grabbing" />
                
                <h4 className="text-xl font-semibold mb-1 text-white">Details</h4>
                <p className="text-sm text-gray-400 mb-6">{photo.date}</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl">
                      <Icons.Eye />
                      <div>
                         <p className="text-xs text-gray-400 uppercase tracking-wide">Views</p>
                         <p className="text-lg font-bold text-white">{formatCount(photoStats.views)}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl">
                      <Icons.Heart filled={photoStats.userLiked} />
                      <div>
                         <p className="text-xs text-gray-400 uppercase tracking-wide">Likes</p>
                         <p className="text-lg font-bold text-white">{formatCount(photoStats.likes)}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl">
                      <Icons.Share />
                      <div>
                         <p className="text-xs text-gray-400 uppercase tracking-wide">Shares</p>
                         <p className="text-lg font-bold text-white">{formatCount(photoStats.shares)}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl">
                      <Icons.Download />
                      <div>
                         <p className="text-xs text-gray-400 uppercase tracking-wide">Downloads</p>
                         <p className="text-lg font-bold text-white">{formatCount(photoStats.downloads)}</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white/5 p-5 rounded-2xl space-y-4">
                   <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/10 rounded-full shrink-0"><Icons.Camera /></div>
                      <div className="flex-1">
                         <p className="text-sm font-semibold text-white">Sony A7IV</p>
                         <p className="text-xs text-gray-400 mt-1">Sony FE 35mm f/1.4 GM</p>
                      </div>
                   </div>
                   <div className="flex gap-4 text-[11px] font-mono text-gray-300 ml-[52px]">
                      <span>35mm</span><span>f/1.4</span><span>1/1000s</span><span>ISO 100</span>
                   </div>
                </div>

                {photo.caption && (
                  <div className="mt-6">
                    <h5 className="text-sm font-semibold text-white mb-2">Description</h5>
                    <p className="text-[15px] text-gray-300 leading-relaxed font-light">{photo.caption}</p>
                  </div>
                )}
             </motion.div>
           </>
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
      if (window.innerWidth < 640) setColumns(1); // 1 column on mobile to drastically increase photo size
      else setColumns(2); // 2 columns on laptop/desktop
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
  
  const [safeTrip, setSafeTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState('');

  useEffect(() => {
    if (!tripId) return;
    const unsub = onSnapshot(doc(db, 'trips', tripId), (docSnap) => {
      if (docSnap.exists()) {
        const rawTrip = { id: docSnap.id, ...docSnap.data() };
        
        // Flatten all photos for the global viewer/stats
        let allPhotos = [];
        if (rawTrip.destinations) {
          rawTrip.destinations.forEach(dest => {
             if (dest.points) {
               dest.points.forEach(pt => {
                 if (pt.photos) {
                   allPhotos = [...allPhotos, ...pt.photos];
                 }
               });
             }
          });
        }
        
        setSafeTrip({
          ...rawTrip,
          allPhotos
        });
        
        if (rawTrip.destinations?.length > 0) {
          setActiveSectionId(rawTrip.destinations[0].id);
        }
      } else {
        setSafeTrip(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [tripId]);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const { stats, toggleLike, recordView, recordAction } = usePhotoStats(safeTrip?.allPhotos || []);

  const handleNavigate = useCallback((dir) => {
    if (!selectedPhoto || !safeTrip) return;
    const allPhotos = safeTrip.allPhotos;
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

  // Handle Scroll Spy for Sidebar (Destinations and Points)
  useEffect(() => {
    if (!safeTrip?.destinations) return;
    const handleScroll = () => {
      // Collect all IDs in order
      const ids = [];
      safeTrip.destinations.forEach(d => {
        ids.push(d.id);
        if (d.points) {
           d.points.forEach(p => ids.push(p.id));
        }
      });
      
      const elements = ids.map(id => document.getElementById(id));
      const scrollPos = window.scrollY + 250; // offset

      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i];
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(ids[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [safeTrip]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div style={{ color:'white', textAlign:'center', height:'100vh', display:'flex', alignItems:'center', justifyItems:'center', background:'#050505' }}>
      <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mt-60"></div>
    </div>
  );

  if (!safeTrip) return (
    <div style={{ color:'white', textAlign:'center', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#050505', fontSize:'2rem', flexDirection: 'column', gap: '20px' }}>
      <p>Trip Not Found</p>
      <button onClick={() => navigate('/travel')} style={{ padding:'10px 20px', fontSize:'1rem', cursor:'pointer', background:'rgba(255,255,255,0.1)', border:'none', color:'white', borderRadius:'8px' }}>Return to Gallery</button>
    </div>
  );

  return (
    <div className="bg-[#050505] min-h-screen text-slate-200 font-sans selection:bg-emerald-500/30">
      <Navbar forceHidden={!!selectedPhoto} />
      
      {/* Editorial Header */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex flex-col justify-end pb-16 px-6 md:px-16" style={{
        backgroundImage: `linear-gradient(to top, #050505 0%, transparent 100%), url(${safeTrip.coverImage || ''})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <button onClick={() => navigate(-1)} className="text-white/60 hover:text-white transition-colors flex items-center gap-2 mb-6 uppercase tracking-widest text-xs font-semibold">
            <Icons.ArrowLeft /> Back to Gallery
          </button>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-4"
          >
            {safeTrip.title}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-4 text-white/70">
            <span className="text-lg font-medium">{safeTrip.date}</span>
            {safeTrip.allPhotos?.length > 0 && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-white/30"></span>
                <span className="text-lg">{safeTrip.allPhotos.length} Photos</span>
              </>
            )}
          </motion.div>
          {safeTrip.description && (
             <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="max-w-2xl text-lg text-white/80 mt-6 leading-relaxed font-light">
               {safeTrip.description}
             </motion.p>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12 flex flex-col lg:flex-row gap-16 relative">
        
        {/* Sticky Sidebar Navigation */}
        {safeTrip.destinations?.length > 0 && (
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32">
              <h3 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-6">Itinerary</h3>
              <nav className="flex flex-col gap-1 border-l-2 border-white/10 pl-4">
                {safeTrip.destinations.map(dest => (
                  <div key={dest.id} className="mb-2">
                    <button 
                      onClick={() => scrollToSection(dest.id)}
                      className={`text-left py-2 px-4 rounded-lg transition-all duration-300 w-full ${activeSectionId === dest.id ? 'bg-white/10 text-white font-medium translate-x-1' : 'text-white/50 hover:text-white/80'}`}
                    >
                      {dest.name}
                    </button>
                    {dest.points && dest.points.length > 0 && (
                      <div className="flex flex-col ml-4 mt-1 border-l border-white/5 pl-2 gap-1">
                        {dest.points.map(pt => (
                          <button
                            key={pt.id}
                            onClick={() => scrollToSection(pt.id)}
                            className={`text-left text-sm py-1.5 px-3 rounded-md transition-all duration-300 ${activeSectionId === pt.id ? 'text-emerald-400 font-medium bg-white/5 translate-x-1' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {pt.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Scrolling Destinations Content */}
        <div className="flex-1">
          {!safeTrip.destinations || safeTrip.destinations.length === 0 ? (
            <div className="text-center py-20 text-white/40">No photos have been added to this trip yet.</div>
          ) : (
            <div className="space-y-32">
              {safeTrip.destinations.map((dest, i) => (
                <section key={dest.id} id={dest.id} className="scroll-mt-24">
                  
                  {/* Destination Header */}
                  <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-emerald-500 font-mono text-xl">{(i+1).toString().padStart(2, '0')}</span>
                      <h2 className="text-3xl md:text-5xl font-bold text-white">{dest.name}</h2>
                    </div>
                    {dest.description && (
                      <p className="text-lg text-white/60 leading-relaxed font-light ml-10 max-w-3xl">{dest.description}</p>
                    )}
                  </div>

                  {/* Points of Interest */}
                  <div className="space-y-10 ml-0 lg:ml-10">
                    {dest.points?.map(point => (
                      <div key={point.id} id={point.id} className="scroll-mt-32">
                        <div className="mb-8">
                          <h3 className="text-2xl font-semibold text-white mb-2">{point.name}</h3>
                          {point.description && <p className="text-white/50">{point.description}</p>}
                        </div>
                        
                        {/* The Masonry Gallery for this specific Point */}
                        {point.photos?.length > 0 ? (
                          <MasonryLayout 
                            photos={point.photos} 
                            stats={stats}
                            toggleLike={toggleLike}
                            onPhotoClick={setSelectedPhoto} 
                          />
                        ) : (
                          <p className="text-white/30 italic text-sm">No photos added to this location.</p>
                        )}
                      </div>
                    ))}
                  </div>

                </section>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Global Image Viewer Overlay */}
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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("TripDetails ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '50px', background: 'black', minHeight: '100vh' }}>
          <h2>Oops, the gallery crashed!</h2>
          <p>{this.state.error && this.state.error.toString()}</p>
          <pre style={{whiteSpace: 'pre-wrap', fontSize: '10px'}}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default function TripDetailsSafe() {
  return (
    <ErrorBoundary>
      <TripDetails />
    </ErrorBoundary>
  );
}
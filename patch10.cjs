const fs = require('fs');
const content = fs.readFileSync('src/components/TripDetails.jsx', 'utf8');

const startRegex = /const ZoomViewer = \({ photo, allPhotos, stats, toggleLike, recordView, recordAction, onClose }\) => {/;
const match = content.match(startRegex);
const startIndex = match.index;

const endRegex = /\/\/\s*---\s*MASONRY LAYOUT COMPONENT\s*---/;
const endMatch = content.match(endRegex);
const endIndex = endMatch.index;

const newZoomViewer = `const ZoomViewer = ({ photo, allPhotos, stats, toggleLike, recordView, recordAction, onClose }) => {
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
  const initialIndex = allPhotos.findIndex(p => p.id === photo.id);
  const [currentIndex, setCurrentIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const currentPhoto = allPhotos[currentIndex] || photo;

  useEffect(() => {
    if (currentPhoto?.id) recordView(currentPhoto.id);
    scale.set(1);
    x.set(0);
    y.set(0);
    setCurrentScale(1);
    setIsImageLoaded(false);
    setShowInfo(false);
  }, [currentPhoto, recordView]);

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
    recordAction(currentPhoto.id, 'downloads');
    try {
      const response = await fetch(currentPhoto.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = \`\${currentPhoto.location?.replace(/\\s+/g,'-') || 'photo'}-\${currentPhoto.id}.jpg\`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(currentPhoto.url, '_blank');
    }
  };

  const handleShare = async () => {
    recordAction(currentPhoto.id, 'shares');
    if (navigator.share) {
      try {
        await navigator.share({
          title: \`Beautiful photo from \${currentPhoto.location || 'my travels'}\`,
          text: currentPhoto.caption,
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

  const photoStats = stats[currentPhoto.id] || { likes: 0, views: 0, downloads: 0, shares: 0, userLiked: false };

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
                 {currentPhoto.location && (
                    <div className="flex flex-col">
                       <span className="font-semibold text-sm md:text-[15px]">{currentPhoto.location}</span>
                       <span className="text-xs text-white/70">{currentPhoto.date}</span>
                    </div>
                 )}
              </div>
              <div className="flex items-center gap-1">
                 <button onClick={(e) => { e.stopPropagation(); toggleLike(currentPhoto.id); }} className="p-2 rounded-full hover:bg-white/10 transition-colors">
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

        {currentScale === 1 && showUI && !showInfo && window.innerWidth > 768 && allPhotos.length > 1 && (
           <>
             <button className="absolute left-6 z-40 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-colors backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length); }}>
               <Icons.ArrowLeft />
             </button>
             <button className="absolute right-6 z-40 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-colors backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % allPhotos.length); }}>
               <Icons.ArrowRight />
             </button>
           </>
        )}

        {/* Cinematic Blur Background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <motion.img 
            key={\`bg-\${currentPhoto.id}\`}
            src={currentPhoto.url} 
            alt="" 
            className="w-full h-full object-cover opacity-50 md:blur-[80px] scale-125"
            initial={{ opacity: 0 }}
            animate={{ opacity: isImageLoaded ? 0.5 : 0 }}
            transition={{ duration: 1.5 }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <motion.img
          key={currentPhoto.id}
          src={currentPhoto.url}
          alt={currentPhoto.caption}
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
              
              if (info.offset.x > hThreshold) setCurrentIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
              else if (info.offset.x < -hThreshold) setCurrentIndex((prev) => (prev + 1) % allPhotos.length);
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
                <p className="text-sm text-gray-400 mb-6">{currentPhoto.date}</p>

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

                {currentPhoto.caption && (
                  <div className="mt-6">
                    <h5 className="text-sm font-semibold text-white mb-2">Description</h5>
                    <p className="text-[15px] text-gray-300 leading-relaxed font-light">{currentPhoto.caption}</p>
                  </div>
                )}
             </motion.div>
           </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
\n\n`;

let newContent = content.substring(0, startIndex) + newZoomViewer + content.substring(endIndex);

// Add missing imports
if (!newContent.includes('useMotionValue')) {
  newContent = newContent.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';");
}

fs.writeFileSync('src/components/TripDetails.jsx', newContent);
console.log("Successfully implemented cursor-aware zoom using useMotionValue.");

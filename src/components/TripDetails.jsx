import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { travelData } from '../sections/travelData';
import Navbar from './Navbar';
import ScrollToTop from './ScrollToTop';
import ParticlesBackground from './ParticlesBackground';
import CustomCursor from './CustomCursor';
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
  Back: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
  )
};

const PhotoCard = ({ photo, containerRef, onPhotoClick, isLiked, onLike, onShare, onDownload }) => {
  const cardRef = useRef(null);
  
  // Track this card's position within the container
  const { scrollXProgress } = useScroll({
    container: containerRef,
    target: cardRef,
    axis: "x",
    offset: ["center end", "center start"]
  });

  // Scale up when in center (0.5 progress), scale down at edges (0 and 1)
  const scale = useTransform(scrollXProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollXProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

  return (
    <motion.div 
      ref={cardRef} 
      className="photo-card"
      style={{ scale, opacity }}
    >
      <div className="photo-image-wrapper" onClick={() => onPhotoClick(photo)}>
        <img src={photo.url} alt={photo.caption} className="photo-thumbnail" />
        <div className="photo-overlay">
          <div className="photo-info">
            <span className="photo-caption">{photo.caption}</span>
            <div className="photo-meta-row">
              <span>{photo.date}</span>
              <span>•</span>
              <span>{photo.location}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="photo-actions-bar">
          <button className={`action-icon-btn ${isLiked ? 'liked' : ''}`} onClick={() => onLike(photo.id)} title="Like">
            <Icons.Heart fill={isLiked} />
          </button>
          <button className="action-icon-btn" onClick={() => onShare(photo)} title="Share">
            <Icons.Share />
          </button>
          <button className="action-icon-btn" onClick={() => onDownload(photo)} title="Download">
            <Icons.Download />
          </button>
      </div>
    </motion.div>
  );
};

const PhotoReel = ({ photos, onPhotoClick, likedPhotos, onLike, onShare, onDownload }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      const onWheel = (e) => {
        if (e.deltaY === 0) return;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

        const isScrollable = el.scrollWidth > el.clientWidth;
        if (!isScrollable) return;

        const atLeft = el.scrollLeft === 0;
        const atRight = Math.abs(el.scrollWidth - el.clientWidth - el.scrollLeft) < 2;

        if ((e.deltaY < 0 && !atLeft) || (e.deltaY > 0 && !atRight)) {
           e.preventDefault();
           el.scrollLeft += e.deltaY * 2;
        }
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []);

  if (!photos || photos.length === 0) {
    return <p>No photos added yet for this destination.</p>;
  }

  return (
    <div ref={scrollRef} className="photos-horizontal-scroll">
      {photos.map((photo) => (
        <PhotoCard 
          key={photo.id} 
          photo={photo} 
          containerRef={scrollRef}
          onPhotoClick={onPhotoClick}
          isLiked={likedPhotos[photo.id]}
          onLike={onLike}
          onShare={onShare}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
};

const TripDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [selectedTrip] = useState(() => travelData.find(t => t.id === tripId));
  const [likedPhotos, setLikedPhotos] = useState({});
  
  const handleLike = (photoId) => {
    setLikedPhotos(prev => ({ ...prev, [photoId]: !prev[photoId] }));
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
      <div className="fixed inset-0 z-0 pointer-events-none">
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
            
            <PhotoReel 
              photos={destination.photos}
              likedPhotos={likedPhotos}
              onLike={handleLike}
              onShare={handleShare}
              onDownload={handleDownload}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripDetails;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaPlay, FaStar, FaArrowLeft, FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { trackEvent } from '../hooks/useGlobalAnalytics';

import project1Image from '../assets/project1.png';
import project2Image from '../assets/project2.png';
import project3Image from '../assets/project3.png';
import project4Image from '../assets/project4.png';

const fallbackImages = {
  dark: project1Image,
  light: project2Image,
  read: project3Image,
  green: project4Image
};

const GitHubStars = ({ repoUrl }) => {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    if (!repoUrl || !repoUrl.includes('github.com')) return;
    try {
      const parts = repoUrl.split('github.com/')[1];
      if (parts) {
        const [owner, repo] = parts.split('/');
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
          .then(res => res.json())
          .then(data => {
            if (data.stargazers_count !== undefined) {
              setStars(data.stargazers_count);
            }
          })
          .catch(() => {});
      }
    } catch (e) {}
  }, [repoUrl]);

  if (stars === null) return null;
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-amber-400 border border-amber-500/30 rounded-full bg-amber-500/10 backdrop-blur">
      <FaStar className="w-3.5 h-3.5" /> {stars} Stars
    </div>
  );
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => document.documentElement.getAttribute('data-theme') || 'dark');
  
  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    if (theme !== currentTheme) setTheme(currentTheme);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, [theme]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const docRef = doc(db, 'projects', projectId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such project!");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch')) {
      const id = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  const isUpcoming = project?.category === 'upcoming';
  const mainImageUrl = project?.images?.[theme] || fallbackImages[theme];
  const allImages = project ? (!isUpcoming ? [mainImageUrl, ...(project.screenshots || [])] : (project.screenshots || [])) : [];

  const handleNext = (e) => {
    e?.stopPropagation?.();
    if (lightboxIndex !== null && allImages.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % allImages.length);
    }
  };

  const handlePrev = (e) => {
    e?.stopPropagation?.();
    if (lightboxIndex !== null && allImages.length > 0) {
      setLightboxIndex((lightboxIndex - 1 + allImages.length) % allImages.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') handleNext(e);
      if (e.key === 'ArrowLeft') handlePrev(e);
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, allImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="absolute inset-0 bg-black -z-10" />
        <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-white">
        <div className="absolute inset-0 bg-black -z-10" />
        <h2 className="text-2xl font-medium mb-4">Project Not Found</h2>
        <Link to="/projects" className="text-emerald-400 hover:text-emerald-300 transition-colors">Return to Projects</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white relative pb-20">
      <div className="absolute inset-0 bg-black -z-10" />
      <div className="absolute top-0 left-0 w-full h-[50vh] md:h-[60vh] -z-10">
        {!isUpcoming && (
          <>
            <img src={mainImageUrl} alt={project?.title} className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />
          </>
        )}
        {isUpcoming && (
           <div className="w-full h-full bg-gradient-to-b from-emerald-900/20 to-black" />
        )}
      </div>

      <div className="max-w-[900px] mx-auto px-6 md:px-10 pt-24">
        <Link to="/projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-mono text-sm mb-10 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
          <FaArrowLeft /> Back to Projects
        </Link>

        {isUpcoming && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-mono tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            In Training / Upcoming
          </div>
        )}

        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6"
        >
          {project.title}
        </motion.h1>

        <div className="flex flex-wrap items-center gap-4 mb-10">
          {project.status && (
            <div className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-mono text-emerald-400 border border-emerald-500/20 rounded-full bg-black/60 backdrop-blur">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              {project.status}
            </div>
          )}
          {project.createdAt && (
            <div className="flex items-center gap-2 text-slate-400 text-sm font-mono">
              <FaCalendarAlt /> {new Date(project.createdAt).toLocaleDateString()}
            </div>
          )}
          {project.github && <GitHubStars repoUrl={project.github} />}
        </div>

        {/* Tech Stack */}
        {project.tech && project.tech.length > 0 && (
          <div className="mb-12">
            <h3 className="text-sm text-slate-500 uppercase tracking-widest font-mono mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div className="prose prose-invert prose-lg max-w-none text-slate-300 font-light leading-relaxed">
              {(project.description || '').split('\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Video Demo */}
            {project.videoUrl && (
              <div className="mt-12 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl aspect-video relative">
                <iframe 
                  src={getEmbedUrl(project.videoUrl)} 
                  className="absolute inset-0 w-full h-full border-0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            )}
            
            {/* Main Image for Active Projects if no video */}
            {!project.videoUrl && !isUpcoming && (
              <div 
                className="mt-12 rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl cursor-pointer group relative"
                onClick={() => setLightboxIndex(0)}
              >
                 <img src={mainImageUrl} alt={project.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-sm">Click to expand</span>
                 </div>
              </div>
            )}
            
            {/* Screenshots Gallery */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-medium mb-6">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.screenshots.map((url, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setLightboxIndex(idx + (!isUpcoming ? 1 : 0))}
                      className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-black shadow-lg cursor-pointer group relative"
                    >
                      <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md p-2 rounded-full">
                          <FaStar className="w-3 h-3 text-white" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-lg font-medium mb-6">Links & Resources</h3>
              
              <div className="flex flex-col gap-4">
                {project.demo && (
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={() => trackEvent('project_detail_click', { id: `${project.id}_demo` })}
                    className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 hover:text-white transition-all group"
                  >
                    <span className="flex items-center gap-3 font-medium"><FaPlay className="text-emerald-500 group-hover:text-white transition-colors" /> Live Demo</span>
                    <FaExternalLinkAlt className="opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                
                {project.github && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={() => trackEvent('project_detail_click', { id: `${project.id}_github` })}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all group"
                  >
                    <span className="flex items-center gap-3 font-medium"><FaGithub className="text-slate-400 group-hover:text-white transition-colors" /> Source Code</span>
                    <FaExternalLinkAlt className="opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}

                {!project.demo && !project.github && (
                   <p className="text-slate-500 text-sm font-light italic">No external links available for this project.</p>
                )}
              </div>
            </div>
            
            {isUpcoming && (
              <div className="bg-black/80 border border-white/10 rounded-2xl p-6 font-mono text-xs text-slate-400 shadow-2xl">
                 <div className="flex items-center gap-2 mb-4 text-emerald-500 pb-2 border-b border-white/10">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   System Status
                 </div>
                 <p className="mb-2">{`> Initializing environment...`}</p>
                 <p className="mb-2">{`> Loading dependencies...`}</p>
                 <p className="mb-2">{`> Compiling source...`}</p>
                 <p className="text-emerald-500/70">{`> Status: In Development`}</p>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && allImages[lightboxIndex] && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
            onClick={() => setLightboxIndex(null)}
          >
            <div className="absolute top-6 right-6 z-50">
              <button 
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur"
              >
                <FaXmark size={24} />
              </button>
            </div>
            
            {allImages.length > 1 && (
              <div className="absolute inset-y-0 left-4 md:left-8 flex items-center z-50">
                <button 
                  onClick={handlePrev}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-black/50 border border-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur"
                >
                  <FaChevronLeft size={20} className="pr-1" />
                </button>
              </div>
            )}
            
            {allImages.length > 1 && (
              <div className="absolute inset-y-0 right-4 md:right-8 flex items-center z-50">
                <button 
                  onClick={handleNext}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-black/50 border border-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur"
                >
                  <FaChevronRight size={20} className="pl-1" />
                </button>
              </div>
            )}

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-[95vw] h-[85vh] md:w-[85vw] max-w-6xl flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={allImages[lightboxIndex]} 
                alt="Fullscreen view" 
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
              />
              <div className="absolute bottom-[-40px] left-0 right-0 flex justify-center items-center gap-2 text-slate-400 font-mono text-xs">
                {lightboxIndex + 1} / {allImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;

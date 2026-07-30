import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";

// Critical / Above the fold components (Eagerly loaded)
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import About from "./sections/About";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import IntroAnimation from './components/IntroAnimation';
import ParticlesBackground from "./components/ParticlesBackground";
import { usePresence } from './hooks/usePresence';

// Below the fold / heavy components (Lazy loaded)
const Projects = lazy(() => import("./sections/Projects"));
const Experience = lazy(() => import("./sections/Experience"));
const Testimonials = lazy(() => import("./sections/Testimonials"));
const TravelGallery = lazy(() => import("./components/TravelGallery"));
const SocialMedia = lazy(() => import("./sections/SocialMedia"));
const Contact = lazy(() => import("./sections/Contact"));
const Footer = lazy(() => import("./sections/footer"));

// Modals and Routes (Lazy loaded)
const TripDetails = lazy(() => import('./components/TripDetails'));
const Resume = lazy(() => import('./components/Resume'));

const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));


// Thin component that registers the visitor — rendered at root so it's always active
function PresenceTracker() {
  usePresence();
  return null;
}

// Fallback loader for lazy components
const SectionLoader = () => (
  <div className="w-full h-32 flex items-center justify-center text-emerald-500/50">
    <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
  </div>
);

// Main page with all sections
const MainPage = () => {
  return (
    <div className="relative text-white min-h-screen bg-transparent overflow-hidden">
      {/* Global Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden"></div>

      <CustomCursor />
      <Navbar />
      <ScrollToTop />
      
      <div className="relative z-10">
        <IntroAnimation />
        
        {/* Eagerly loaded components (Instant visual response) */}
        <Home />
        <About />

        {/* Lazy loaded components (Loaded as browser has idle time) */}
        <Suspense fallback={<SectionLoader />}>
          <Projects />
          <Experience />
          <Testimonials />
          <section id="travel">
            <TravelGallery />
          </section>
          <SocialMedia />
          <Contact />
          <Footer />
        </Suspense>
        <Analytics />
      </div>
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainPage />} />
        <Route path="/travel/:tripId" element={
          <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><SectionLoader /></div>}>
            <TripDetails />
          </Suspense>
        } />
        <Route path="/resume" element={
          <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center"><SectionLoader /></div>}>
            <Resume />
          </Suspense>
        } />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <PresenceTracker />
      
      <Suspense fallback={null}>

        <AnalyticsDashboard />

      </Suspense>
      
      <AnimatedRoutes />
      <Analytics />
    </BrowserRouter>
  )
}

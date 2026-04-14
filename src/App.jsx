
import TravelGallery from './components/TravelGallery';
import TripDetails from './components/TripDetails';
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import ParticlesBackground from "./components/ParticlesBackground";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Testimonials from "./sections/Testimonials";
import SocialMedia from "./sections/SocialMedia";
import Contact from "./sections/Contact";
import Footer from "./sections/footer";
import ScrollToTop from "./components/ScrollToTop";
import IntroAnimation from './components/IntroAnimation';
// Main page with all sections
const MainPage = () => {
  return (
    <div
      className="relative text-white min-h-screen bg-transparent overflow-hidden"
    >
      {/* Global Background — pure black; each section manages its own subtle glow */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      </div>

      <CustomCursor />
      <Navbar />
      <ScrollToTop />
      <div className="relative z-10">
        <IntroAnimation />
        <Home />
        <About />
        <Projects />
        <Experience />
        <Testimonials />
        <section id="travel">
          <TravelGallery />
        </section>
        <SocialMedia />
        <Contact />
        <Footer />
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
        <Route path="/travel/:tripId" element={<TripDetails />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
      <Analytics />
    </BrowserRouter>
  )
}

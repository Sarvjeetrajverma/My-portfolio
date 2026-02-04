import TravelGallery from './components/TravelGallery';
import TripDetails from './components/TripDetails';
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ParticlesBackground from "./components/ParticlesBackground";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Testimonials from "./sections/Testimonials";
import SocialMedia from "./sections/SocialMedia";
import Contact from "./sections/Contact";
import Footer from "./sections/footer";
import ScrollToTop from "./components/ScrollToTop";

// Main page with all sections
const MainPage = () => {
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

      <CustomCursor/>
      <Navbar />
      <ScrollToTop />
      <div className="relative z-10">
        <Home/>
        <About/>
        <Skills/>
        <Projects/>
        <Experience/>
        <Testimonials/>
        <section id="travel">
          <TravelGallery />
        </section>
        <SocialMedia/>
        <Contact/>
        <Footer/>
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

export default function App(){
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

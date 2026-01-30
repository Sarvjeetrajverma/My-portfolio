import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import IntroAnimation from "./components/IntroAnimation";
import ParticlesBackground from "./components/ParticlesBackground";
import CustomCursor from "./components/CustomCursor";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./sections/footer";

export default function App(){
  const [introDone , setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <IntroAnimation onfinish={() => setIntroDone(true)} />}

      {introDone && (
        <div className="relative gradient text-white min-h-screen">
          <ParticlesBackground/>
          <CustomCursor/>
          <Navbar/>
          <Home/>
          <About/>
          <Skills/>
          <Projects/>
          <Experience/>
          <Testimonials/>
          <Contact/>
          <Footer/> 
        </div> 
        )}
    
    </>
  )
}

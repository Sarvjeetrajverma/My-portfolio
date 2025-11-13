import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import Testimonials from "./sections/Testimonials";
import About from "./sections/About";
import Contact from "./sections/contact";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Footer from "./sections/footer";
import ParticlesBackground from "./components/ParticlesBackground";
import CustomCursor from "./components/CustomCursor";
import IntroAnimation from "./components/IntroAnimation";

export default function App(){
  const [introDone , setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <IntroAnimation onfinish={() => setIntroDone(true)} />}

      {introDone && (
        <div className="relative gradient text-white">
          {/*<ParticlesBackground/> */}
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

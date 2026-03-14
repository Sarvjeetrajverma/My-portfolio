import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // Disable entirely on touch devices/mobile to save battery and stop lag
    if (window.matchMedia("(hover: none)").matches) return;

    const moveHandler = (e) => {
      if (cursorRef.current) {
        // Bypass React state entirely for 60fps performance
        cursorRef.current.style.transform = `translate3d(${e.clientX - 40}px, ${e.clientY - 40}px, 0)`;
      }
    };
    
    // Use passive: true to tell the browser this won't block scrolling
    window.addEventListener("mousemove", moveHandler, { passive: true }); 
    return () => window.removeEventListener("mousemove", moveHandler);
  }, []);

  return (
    <div 
      ref={cursorRef}
      className="hidden md:block pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform" 
    >
      {/* Reduced blur from 3xl to 2xl, and opacity from 80 to 50 for performance */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 blur-2xl opacity-50" />
    </div>
  );
}
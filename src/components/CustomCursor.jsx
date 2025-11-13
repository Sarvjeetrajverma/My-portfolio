//rafce and enter

import { useEffect, useState } from "react"

export default function CustomCursor() {
 const [position , setPosition] = useState({ x:0 , y:0}); // initial position of cursor
 
 useEffect(() => {
   const moveHandler = (e) => {
      setPosition({x: e.clientX, y: e.clientY}) // update position on mouse move
   };
    window.addEventListener("mousemove", moveHandler); // listen to mousemove event
    return ()=> window.removeEventListener("mousemove", moveHandler); // cleanup event listener on unmount

 }, [])


  return (
    <div className="pointer-events-none fixed top-0 left-0 z-[9999]" style={{transform: `translate(${position.x - 40}px, ${position.y - 40}px)`}}>
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 blur-3xl opacity-80" />
    </div>
  )






}
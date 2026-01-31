import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo } from "react";

export default function IntroAnimation({onfinish}){
  const greetings = useMemo(() =>[
"Hello", "नमस्ते", "Welcome"
  ],[])
  const backgroundColors = useMemo(() => [
    "linear-gradient(to right, #141516, #2d3748)", "linear-gradient(to right, #1e3a8a, #3b82f6)", "linear-gradient(to right, #064e3b, #10b981)", "linear-gradient(to right, #7f1d1d, #ef4444)", "linear-gradient(to right, #581c87, #a855f7)", "linear-gradient(to right, #0f172a, #475569)", "linear-gradient(to right, #312e81, #6366f1)", "linear-gradient(to right, #881337, #ec4899)", "linear-gradient(to right, #14532d, #22c55e)", "linear-gradient(to right, #0c4a6e, #0ea5e9)", "linear-gradient(to right, #000000, #434343)"
  ], []);
 const [index,setIndex] = React.useState(0);
 const [visible , setVisible]= React.useState(true);

 useEffect(() =>{
   if(index <greetings.length-1){
    const id = setInterval(()=> setIndex((i)=> i+1),300);
    return ()=> clearInterval(id);

   }
   else{
    const t= setTimeout(()=> setVisible(false),500);
    return () => clearTimeout(t);
     }

 }, [index, greetings.length])
  return(
    <AnimatePresence onExitComplete={onfinish}>
      {visible &&(
    <motion.div

    className=" fixed inset-0 z-[9999] flex items-center justify-center text-white overflow-hidden"
    initial={{ y: 0, background: backgroundColors[0] }}
    animate={{ background: backgroundColors[index % backgroundColors.length] }}
      exit={{ y: "-100vh",
        transition: {
          duration: 0.8,
          ease :[ 0.76, 0, 0.24, 1],
        }
      }}
    >
      <AnimatePresence mode="wait">
      <motion.h1
      key={index}
      className=" text-5xl md:text-7xl lg:text-8xl font-bold"
      initial={{ opacity:0 ,y: -50, scale: 1.2, filter: "blur(10px)"}}
      animate={{ opacity:1 ,y: 0, scale: 1, filter: "blur(0px)"}}
      exit={{ opacity:0 ,y: 50, scale: 0.8, filter: "blur(10px)"}}
      transition={{ duration:0.15, ease: "easeInOut"}}

      >
        {greetings[index]}
      </motion.h1>
      </AnimatePresence>


    </motion.div>

      )}

    </AnimatePresence>

  )
}

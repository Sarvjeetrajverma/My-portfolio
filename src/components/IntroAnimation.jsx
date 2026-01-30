import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo } from "react";

export default function IntroAnimation({onfinish}){
  const greetings = useMemo(() =>[
"Hello", "नमस्ते", "Hola", "Bonjour",
      "Ciao", "Olá", "Здравствуйте",
      "Merhaba", "Γειά", "Hej", "Hallo", "Salam"
  ],[])
 const [index,setIndex] = React.useState(0);
 const [visible , setVisible]= React.useState(true);

 useEffect(() =>{
   if(index <greetings.length-1){
    const id = setInterval(()=> setIndex((i)=> i+1),180);
    return ()=> clearInterval(id);

   }
   else{
    const t= setTimeout(()=> setVisible(false),3000);
    return () => clearTimeout(t);
     }

 })
  return(
    <AnimatePresence onExitComplete={onfinish}>
      {visible &&(
    <motion.div

    className=" fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white overflow-hidden"
    initial={{ y: 0}}
      exit={{ y: "-100vh",
        transition: {
          duration: 0,
          ease :[ 0.22, 1, 0.36,1],
        }
      }}
    >
      <motion.h1
      key={index}
      className=" text-5xl md:text-7xl lg:text-8xl font-bold"
      initial={{ opacity:0 ,y: 20}}
      animate={{ opacity:1 ,y: 0}}
      exit={{ opacity:0 ,y: -20}}
      transition={{ duration:0.12}}

      >
        {greetings[index]}
      </motion.h1>


    </motion.div>

      )}

    </AnimatePresence>

  )
}
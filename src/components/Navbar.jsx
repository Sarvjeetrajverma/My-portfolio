import { useState, useRef, useEffect } from "react";
import OverlayMenu from "./OverlayMenu";
import logo from "../assets/logo.png"; // Adjust the path as needed
import { FiMenu } from "react-icons/fi";




export default function Navbar() {
const [visible, setVisible] = useState(true);
const [menuOpen, setMenuOpen] = useState(false);
const [forceVisible , setForceVisible] = useState(false);


const lastscrollY = useRef(0);
const timerId = useRef(null);

 useEffect(() => {
     const homesection = document.querySelector("home");
     const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setForceVisible(true);
            setVisible(true);

          }
          else{
            setForceVisible(false);
          }
        },{threshold: 0.1}

     )
     if (homesection) observer.observe(homesection);
     return () => {
      if(homesection) observer.unobserve(homesection);
     }
},[]);// to handle navbar visibility on scroll

useEffect(() => {
 const handleScroll = () => {
      if(forceVisible){
        setVisible(true);
        return;
      }
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastscrollY.current){
        setVisible(false);
      } else {
        setVisible(true);

        if (timerId.current) clearTimeout(timerId.current);
        timerId.current = setTimeout(() => {
          setVisible(false);
        },3000)
      }
      lastscrollY.current = currentScrollY;
      }
 window.addEventListener("scroll", handleScroll, { passive: true})
  return () => { 
    window.removeEventListener("scroll", handleScroll)
    if(timerId.current) clearTimeout(timerId.current);
  }
}, [forceVisible])
  return (
    <>
      <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex items-center space-x-2">
          <img src={logo} alt="logo" className="w-15 h-15"/>
          <div className="text-2xl font-bold text-white hidden sm:block"> 
            Sarvjeet
          </div>
          <div className="block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-white text-3xl focus:outline-none"
              aria-label="open Menu"
            >
              <FiMenu />
            </button>
          </div>
        </div>
        <div className="hidden lg:block">
          <a href="#contact" className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-5 py-2 rounded-full font-medium shadow-lg hover:opacity-90 transition-opacity duration-300">
            Reach out
          </a>
        </div>
      </nav>
      <OverlayMenu isopen={menuOpen} onclose={() => setMenuOpen(false)}/>
    </>
  )



}
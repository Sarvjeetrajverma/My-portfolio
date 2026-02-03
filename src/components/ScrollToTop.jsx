import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={scrollToTop}
            className="bg-transparent border border-white text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:text-black hover:scale-110"
            aria-label="Scroll to top"
          >
            <FaArrowUp size={20} />
          </button>
        </div>
      )}
    </>
  );
};

export default ScrollToTop;

import React from 'react';

const Footer = () => {
  return (
    <div className='w-full bg-gray-900 text-gray-300 py-8 px-4 border-t border-gray-700'>
      <div className='max-w-[1240px] mx-auto flex flex-col items-center justify-between md:flex-row'>
        
        {/* Left Side: Brand & Copyright */}
        <div className='text-center md:text-left mb-4 md:mb-0'>
          <h2 className='text-2xl font-bold text-white'>PORTFOLIO.</h2>
          
          {/* MODIFIED SECTION START */}
          <div className='py-2 text-sm text-gray-500'>
             <p>Made with <span className="text-red-500">❤️</span> </p>
             <p>© {new Date().getFullYear()} All rights reserved.</p>
          </div>
          {/* MODIFIED SECTION END */}

        </div>

        {/* Right Side: Social Icons */}
        <div className='flex justify-between w-[200px] text-2xl'>
          {/* GitHub Icon */}
          <a href='https://github.com' target='_blank' rel='noreferrer' className='hover:text-white transition-colors duration-300'>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C3.68.65 3.5 1 3.5 1a5.07 5.07 0 0 0-.38 3.77 5.44 5.44 0 0 0 0 4.77 4.77 0 0 0 1.94 3 13.38 13.38 0 0 0 7 0V21"></path></svg>
          </a>
          
          {/* LinkedIn Icon */}
          <a href='https://linkedin.com' target='_blank' rel='noreferrer' className='hover:text-blue-500 transition-colors duration-300'>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>

          {/* Twitter / X Icon */}
          <a href='https://twitter.com' target='_blank' rel='noreferrer' className='hover:text-sky-400 transition-colors duration-300'>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
          </a>
          
          {/* Mail Icon */}
          <a href='mailto:email@example.com' className='hover:text-emerald-400 transition-colors duration-300'>
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
        </div>
        
      </div>
    </div>
  )
}

export default Footer
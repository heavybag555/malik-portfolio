"use client";

import { useEffect, useState } from "react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how close we are to the bottom of the page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrolledPercentage = (scrollTop + windowHeight) / documentHeight;

      // Change background when 50% through the page
      setScrolled(scrolledPercentage > 0.5);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-start gap-[8px] text-[13px] font-medium leading-none tracking-[0.03em] px-[12px] py-[4px] backdrop-blur-md bg-white/0 transition-colors duration-300 ${
        scrolled ? "text-white" : "text-[#0043e0]"
      }`}
    >
      <div className="flex-1">
        <a href="/" className="hover:opacity-60">
          M.L.
        </a>
      </div>
      <div className="flex-1 flex justify-between items-start">
        <nav className="flex gap-[12px]">
          <div>
            <a href="#overview" className="hover:opacity-60">
              Overview
            </a>
          </div>
          <div>
            <a href="/info" className="hover:opacity-60">
              Info
            </a>
          </div>
        </nav>
        <div>
          <a href="mailto:malikphoto1@gmail.com" className="hover:opacity-60">
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}


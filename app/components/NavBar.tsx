"use client";

import { useEffect, useState } from "react";

export default function NavBar() {
  const [isOverImage, setIsOverImage] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      const images = document.querySelectorAll("main img");
      
      if (!header) return;
      
      const headerRect = header.getBoundingClientRect();
      let overImage = false;
      
      images.forEach((img) => {
        const imgRect = img.getBoundingClientRect();
        // Check if header overlaps with any image
        if (
          headerRect.bottom > imgRect.top &&
          headerRect.top < imgRect.bottom &&
          headerRect.right > imgRect.left &&
          headerRect.left < imgRect.right
        ) {
          overImage = true;
        }
      });
      
      setIsOverImage(overImage);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex items-start gap-[8px] text-[13px] font-medium leading-none tracking-[0.03em] px-[12px] py-[4px] backdrop-blur-md bg-white/0 text-foreground ${
        isOverImage ? "mix-blend-difference text-white" : ""
      }`}
    >
      <div className="flex-1">M.L.</div>
      <div className="flex-1 flex justify-between items-start">
        <nav className="flex gap-[12px]">
          <div>
            <a href="#overview" className="hover:opacity-60">
              Overview
            </a>
          </div>
          <div>
            <a href="#index" className="hover:opacity-60">
              Index
            </a>
          </div>
        </nav>
        <div>Info</div>
      </div>
    </header>
  );
}


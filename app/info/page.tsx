"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import { edwardianScript } from "../fonts";

export default function Info() {
  const [showLoading, setShowLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isOverImage, setIsOverImage] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);
  const fullText = "Malik Laing";

  // Check if loading screen has already been shown
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSeenLoading = sessionStorage.getItem("hasSeenLoading");
      if (!hasSeenLoading) {
        setShowLoading(true);
        sessionStorage.setItem("hasSeenLoading", "true");
      }
    }
  }, []);

  // Typewriter effect for "Malik Laing"
  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 100; // milliseconds per character

    const typeNextChar = () => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
        if (currentIndex > fullText.length) {
          setTypingComplete(true);
        } else {
          setTimeout(typeNextChar, typingSpeed);
        }
      }
    };

    // Start typing after a brief delay
    const initialDelay = setTimeout(typeNextChar, 500);

    return () => clearTimeout(initialDelay);
  }, []);

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
    <>
      {showLoading && (
        <LoadingScreen onComplete={() => setShowLoading(false)} />
      )}
      <main
        className={`w-full min-h-screen p-[12px] pb-[48px] flex flex-col gap-[48px] transition-all duration-[1500ms] ${
          scrolled ? "bg-[#0043e0]" : "bg-white"
        } ${
          showLoading
            ? "opacity-0 pointer-events-none"
            : "opacity-100 pointer-events-auto"
        }`}
        style={{
          transition: "opacity 0.6s ease-in-out, background-color 1500ms",
        }}
      >
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 py-[4px] px-[12px] backdrop-blur-md">
          <div
            className={`w-full flex items-start gap-[8px] text-[13px] font-medium leading-none tracking-[0.03em] transition-colors duration-300 ${
              isOverImage
                ? "text-white"
                : scrolled
                ? "text-white"
                : "text-[#0043e0]"
            }`}
          >
            <div className="flex-1">M.L.</div>
            <div className="flex-1 flex justify-between items-start">
              <nav className="flex gap-[12px]">
                <div>
                  <a href="/" className="hover:opacity-60">
                    Overview
                  </a>
                </div>
                <div>
                  <a href="/#index" className="hover:opacity-60">
                    Index
                  </a>
                </div>
              </nav>
              <div>Info</div>
            </div>
          </div>
        </header>

        <section className="w-full flex flex-col gap-[156px]">
          <div className="h-[80vh] flex flex-col justify-end relative z-10">
            <div className="flex gap-[10px] items-end">
              {/* Malik Laing container - fills available width */}
              <div className="flex-1">
                <h1 className="font-bold italic text-[32px] leading-[60%] tracking-[0.1em]">
                  <span
                    className={`transition-all duration-[1500ms]`}
                    style={{
                      fontFamily: edwardianScript.style.fontFamily,
                      color: "transparent",
                      WebkitTextStroke: "0.5px #0043E0",
                      paintOrder: "stroke fill",
                    }}
                  >
                    {displayedText}
                    {!typingComplete && (
                      <span className="animate-pulse">|</span>
                    )}
                  </span>
                </h1>
              </div>

              <div
                className={`flex-1 flex flex-col gap-[12px] text-[13px] font-medium leading-[1.4] tracking-[0.03em] transition-colors duration-[1500ms] ${
                  scrolled ? "text-white" : "text-[#0043e0]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="max-w-[400px]">
                      Renell Medrano is a Dominican-American photographer and director from The Bronx, New York, whose work focuses on finding vulnerability in her subjects, drawing inspiration from New York City and her motherland of the Dominican Republic. She graduated from Parsons School of Design | The New School with a degree in Photography. In 2015, she was awarded "New York Times Lens Blog Award" for her photography series 'Untitled Youth', which explored 4 teenage girls living in the Bronx going through adolescence. Her commercial fashion photography has been published in dozens of publications such as Vogue, Elle, Harper's Bazaar, GQ, CR Men, and W.
                    </p>
                  </div>
                  <span>1998</span>
                </div>
                <p className="max-w-[400px]">
                  She has shot campaigns for various brands, including, Burberry, Gucci and Prada. Medrano has had three solo photography exhibitions. Peluca at MILK studios, New York, 2019, Pampara at Gallery Rosenfeld in London in 2020 and Lambon at WSA, New York in 2024. Group shows include 20TK's "The Next Generation of Bronx Photographers," Just Pictures and Aperture Foundation's ground-breaking traveling exhibition, the New Black Vanguard: Photography between Art and Fashion.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}


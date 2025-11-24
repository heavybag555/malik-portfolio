"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import CustomCursor from "../components/CustomCursor";

export default function Info() {
  const [scrolled, setScrolled] = useState(false);
  const [isOverImage, setIsOverImage] = useState(false);
  const [lettersVisible, setLettersVisible] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const fullText = "MALIK LAING⋅";
  const letters = fullText.split("");

  // Initialize scroll state based on preserved scroll position
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem("homeScrollPosition");
    if (savedScrollPosition) {
      const scrollY = parseInt(savedScrollPosition, 10);
      const windowHeight = window.innerHeight;
      // Estimate document height (will be updated when page loads)
      const estimatedHeight = Math.max(
        document.documentElement.scrollHeight,
        windowHeight * 2
      );
      const scrolledPercentage = (scrollY + windowHeight) / estimatedHeight;
      // Set initial state based on preserved scroll position
      setScrolled(scrolledPercentage > 0.5);
    }
  }, []);

  // Ensure overlay starts at top
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, []);

  // Trigger letter fade-in animation
  useEffect(() => {
    setLettersVisible(true);
  }, []);

  useEffect(() => {
    if (!mainRef.current) return;

    const handleScroll = () => {
      if (!mainRef.current) return;
      // Calculate how close we are to the bottom of the page
      const container = mainRef.current;
      const containerHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;
      const scrollTop = container.scrollTop;
      const scrolledPercentage = (scrollTop + containerHeight) / scrollHeight;

      // Change background when 50% through the page
      setScrolled(scrolledPercentage > 0.5);
    };

    const container = mainRef.current;
    container.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <>
      <CustomCursor scrolled={scrolled} />
      <main
        ref={mainRef}
        className="fixed inset-0 w-full h-full overflow-y-auto p-[12px] pb-[48px] flex flex-col gap-[48px] pointer-events-auto z-[100]"
        style={{
          backgroundColor: scrolled
            ? "rgba(0, 67, 224, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          transition: "background-color 1500ms ease-in-out",
          willChange: "background-color",
        }}
      >
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 py-[4px] px-[12px] backdrop-blur-md">
          <div
            className={`w-full flex items-start gap-[8px] text-[13px] font-medium leading-none tracking-[0.03em] transition-colors duration-300 ${
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
                  <a href="/" className="hover:opacity-60">
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
                <a
                  href="mailto:malikphoto1@gmail.com"
                  className="hover:opacity-60"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className="w-full flex flex-col gap-[156px] pt-[120px]">
          <div className="flex flex-col justify-start relative z-10">
            <div className="flex flex-col md:flex-row gap-[12px] items-start">
              {/* Malik Laing container - fills available width */}
              <div className="flex-[0.5] w-full md:w-auto flex flex-row gap-[12px] items-start relative">
                {/* Container 1: Image aligned to the left */}
                <div className="relative w-full">
                  <div
                    className="w-full relative"
                    onMouseEnter={() => setIsOverImage(true)}
                    onMouseLeave={() => setIsOverImage(false)}
                    style={{
                      mixBlendMode: isOverImage ? "difference" : "normal",
                    }}
                  >
                    <Image
                      src="/malik-info.jpg"
                      alt="Malik Laing"
                      width={200}
                      height={200}
                      priority
                      className="w-full h-auto shadow-none transition-all duration-300"
                      style={{
                        display: "block",
                        border: "0.5px solid white",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`flex-1 w-full md:w-auto flex flex-col gap-[12px] text-[30px] font-semibold leading-[1.1] tracking-[-0.01em] ${
                  scrolled ? "text-white" : "text-[#0043e0]"
                }`}
                style={{
                  transition: "color 1500ms ease-in-out",
                  willChange: "color",
                }}
              >
                {/* Container 1: Text content */}
                <div className="flex flex-col gap-[12px]">
                  <div className="flex flex-col md:flex-row md:items-start gap-[12px]">
                    <div className="flex-1 flex flex-col gap-[24px]">
                      <p>
                        Malik Laing [b. 2000] is an independent photographer
                        hailing from San Bernardino, California.
                      </p>
                      <p>
                        For years, he has been enveloped in the world of
                        photography, inside and out. His lengthiest project, the
                        community photography space Eclipse is a testament to
                        the communal and personal themes in his work. Some of
                        his material has been publicly featured at the Riverside
                        Art Museum and alongside The Civil Rights Institute of
                        Southern California.
                      </p>
                      <p>
                        <a
                          href="https://www.instagram.com/maliklphoto/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:opacity-60"
                        >
                          @maliklphoto
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                {/* Container 2: Empty for now */}
                <div></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

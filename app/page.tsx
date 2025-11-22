"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Server-side data fetching moved to a separate function
const photoOrder = [
  "img20231009_09033075.jpg",
  "12AA003.jpg",
  "mali014-103.jpg",
  "000084160016.jpg",
  "Photo Jul 26 2025, 5 37 21 PM (1).jpg",
  "000047380010.jpg",
  "274A1716.jpg",
  "raw20221216_00004245.jpg",
  "000047380025.jpg",
  "000047390026.jpg",
  "Photo Dec 27 2024, 6 02 50 PM.jpg",
  "069B0081.jpg",
  "IMG3414-R01-020A.jpg",
  "000060350032.jpg",
  "neighbork82022AA006.jpg",
  "img20250730_02231568.jpg",
  "000018560026.jpg",
  "MALI699-021.jpg",
  "raw20221026_12204259-2.jpg",
  "000047380023.jpg",
  "C32A5470.jpg",
  "000002830010.jpg",
  "Photo Nov 21 2025, 8 25 53 AM (2).jpg",
  "000069560031.jpg",
  "IMG9434-R01-011A.jpg",
  "000065990027.jpg",
  "img20210722_13372500.jpg",
  "Photo Dec 19 2024, 1 47 51 PM.jpg",
  "img20251110_18045890.jpg",
  "000047390016.jpg",
  "000060360002.jpg",
  "IMG3414-R01-003A.jpg",
  "000095000004.jpg",
  "000087180038.jpg",
  "cine400dbtsAA033.jpg",
  "000060350001.jpg",
  "Photo Nov 21 2025, 8 20 48 AM.jpg",
  "img20210308_18205472_2006.jpg",
  "000002840004.jpg",
  "Photo Mar 05 2024, 12 51 55 PM.jpg",
  "000060350003.jpg",
  "IMG9434-R01-009A.jpg",
  "000018560014.jpg",
  "0F4A3103.jpg",
  "img20210723_19195076.jpg",
  "IMG3414-R01-010A.jpg",
  "000084160022.jpg",
  "mali587-026.jpg",
  "000011460023.jpg",
  "Photo Nov 21 2025, 8 25 53 AM.jpg",
  "069B1206.jpg",
  "MALI699-053.jpg",
  "neighbork82022AA005.jpg",
  "Photo Dec 27 2024, 6 02 50 PM (9).jpg",
  "000002820005.jpg",
  "cine400dbtsAA032.jpg",
  "000060350010.jpg",
  "0F4A3402.jpg",
  "IMG9434-R01-026A.jpg",
  "img20231009_09074829.jpg",
  "000047390030.jpg",
  "000069550002.jpg",
  "img20251110_18063404.jpg",
  "IMG3414-R01-002A.jpg",
  "AA007A.jpg",
  "6G1A4184-2.jpg",
  "C32A5435.jpg",
  "Laing0049.jpg",
  "MALI699-049.jpg",
  "000065990011.jpg",
  "000060360015.jpg",
  "000094990036.jpg",
  "raw20221026_12421548 3.jpg",
  "img20210723_18531122.jpg",
  "Photo Dec 27 2024, 6 02 50 PM (7) (1).jpg",
  "069B0084.jpg",
  "Photo Dec 24 2022, 4 43 06 PM.jpg",
  "img20250730_03173069.jpg",
  "000087180036.jpg",
  "IMG9434-R01-025A.jpg",
  "000060350030.jpg",
  "0F4A3254.jpg",
  "000050880027.jpg",
  "Photo Nov 21 2025, 8 25 53 AM (1).jpg",
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isOverImage, setIsOverImage] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [typingComplete, setTypingComplete] = useState(false);
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const fullText = "Malik Laing";

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

  // Intersection Observer for image fade-in
  useEffect(() => {
    const imageElements = document.querySelectorAll("[data-image-index]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-image-index") || "0"
            );
            setVisibleImages((prev) => new Set(prev).add(index));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    imageElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how close we are to the bottom of the page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrolledPercentage = (scrollTop + windowHeight) / documentHeight;

      // Change background when 65% through the page
      setScrolled(scrolledPercentage > 0.5);

      // Check if navigation overlaps with any image
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

  const projects = photoOrder.map((file, i) => {
    return {
      id: i + 1,
      title: `Project ${i + 1}`,
      description: "Description",
      image: `/ML-photos/${encodeURIComponent(file)}`,
    };
  });

  return (
    <main
      className={`w-full min-h-screen p-[12px] pb-[48px] flex flex-col gap-[48px] transition-colors duration-[1500ms] ${
        scrolled ? "bg-[#0043e0]" : "bg-white"
      }`}
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
        </div>
      </header>

      <section className="w-full flex flex-col gap-[156px]">
        <div className="h-[40vh] flex flex-col justify-end relative z-10">
          <div className="flex gap-[10px] items-end">
            {/* Malik Laing container - fills available width */}
            <div className="flex-1">
              <h1 className="font-bold italic text-[96px] leading-[60%] tracking-[-0.06em]">
                <span
                  className={`text-transparent transition-all duration-[1500ms]`}
                  style={{
                    WebkitTextStroke: scrolled
                      ? "0.5px white"
                      : "0.5px #0043e0",
                    fontFamily: "Times New Roman, serif",
                  }}
                >
                  {displayedText}
                  {!typingComplete && <span className="animate-pulse">|</span>}
                </span>
              </h1>
            </div>

            <div
              className={`flex-1 flex justify-between items-start text-[13px] font-medium leading-none tracking-[0.03em] transition-colors duration-[1500ms] ${
                scrolled ? "text-white" : "text-[#0043e0]"
              }`}
            >
              <p className="max-w-[403px]">
                Photographer and director from San Bernardino, California.
              </p>
              <span>1998</span>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-6 gap-x-[12px] gap-y-[48px]">
          {projects.map((project, i) => {
            const columnIndex = i % 6; // 0-5 for 6 columns
            const isVisible = visibleImages.has(i);
            const transitionDelay = columnIndex * 150; // 150ms stagger per column for more delay

            return (
              <div
                key={i}
                data-image-index={i}
                className="flex flex-col gap-[10px] group cursor-pointer"
              >
                <div className="w-full relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={800}
                    className="w-full h-auto"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible
                        ? "scale(1) translateY(0)"
                        : "scale(0.98) translateY(8px)",
                      transition:
                        "opacity 0.8s ease-out, transform 0.8s ease-out",
                      transitionDelay: isVisible
                        ? `${transitionDelay}ms`
                        : "0ms",
                    }}
                    sizes="16vw"
                  />
                </div>
                <div
                  className="flex flex-col gap-[2px] text-[11px] font-medium leading-none tracking-[0.03em]"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(5px)",
                    transition:
                      "opacity 0.6s ease-out, transform 0.6s ease-out",
                    transitionDelay: isVisible
                      ? `${transitionDelay + 300}ms`
                      : "0ms",
                  }}
                >
                  <span
                    className={`transition-colors duration-[1500ms] ${
                      scrolled ? "text-white" : "text-black"
                    }`}
                  >
                    {project.title}
                  </span>
                  <span
                    className={`transition-colors duration-[1500ms] ${
                      scrolled ? "text-[#D0D0D0]" : "text-[#ACACAC]"
                    }`}
                  >
                    {project.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

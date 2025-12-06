"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Lightbox from "./components/Lightbox";
import CustomCursor from "./components/CustomCursor";
import photoMetadata from "./photoMetadata.json";
import { useIsDesktop } from "./hooks/useIsDesktop";
import { libreBaskerville } from "./fonts";

// Fade-in text component
function FadeInText({ text, className }: { text: string; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Start fade after a small delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <span
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 1.2s ease-out',
      }}
    >
      {text}
    </span>
  );
}

// Server-side data fetching moved to a separate function
const photoOrder = [
  "IMG9434-R01-025A.jpg",
  "Photo Nov 22 2025, 6 30 13 PM.jpg",
  "000069560031.jpg",
  "cine400dbtsAA033.jpg",
  "000047380010.jpg",
  "Photo Nov 21 2025, 11 07 07 PM (1).jpg",
  "raw20221026_12421548 3.jpg",
  "000084160016.jpg",
  "mali014-103.jpg",
  "Photo Nov 21 2025, 8 20 48 AM.jpg",
  "Photo Jul 26 2025, 5 37 21 PM (1).jpg",
  "raw20221216_00004245.jpg",
  "274A1716.jpg",
  "img20231009_09033075.jpg",
  "000047380025.jpg",
  "000047390026.jpg",
  "img20250730_02231568.jpg",
  "Photo Nov 21 2025, 11 07 07 PM (3).jpg",
  "IMG3414-R01-020A.jpg",
  "000060350032.jpg",
  "neighbork82022AA006.jpg",
  "Photo Dec 27 2024, 6 02 50 PM.jpg",
  "000018560026.jpg",
  "MALI699-021.jpg",
  "raw20221026_12204259-2.jpg",
  "000047380023.jpg",
  "C32A5470.jpg",
  "000002830010.jpg",
  "Photo Nov 21 2025, 8 25 53 AM (2).jpg",
  "12AA003.jpg",
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
  "000060350001.jpg",
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
  "069B0081.jpg",
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
  "img20231009_09074829.jpg",
  "img20210723_18531122.jpg",
  "Photo Dec 27 2024, 6 02 50 PM (7) (1).jpg",
  "069B0084.jpg",
  "Photo Dec 24 2022, 4 43 06 PM.jpg",
  "img20250730_03173069.jpg",
  "000087180036.jpg",
  "Photo Nov 21 2025, 11 07 07 PM (4).jpg",
  "000060350030.jpg",
  "0F4A3254.jpg",
  "000050880027.jpg",
  "Photo Nov 21 2025, 8 25 53 AM (1).jpg",
  "Photo Nov 21 2025, 11 07 07 PM (2).jpg",
  "Photo Nov 21 2025, 11 07 07 PM (5).jpg",
  "Photo Nov 21 2025, 11 07 07 PM (6).jpg",
  "Photo Nov 22 2025, 2 16 16 PM (1).jpg",
  "Photo Nov 22 2025, 2 16 16 PM.jpg",
  "Photo Nov 22 2025, 6 30 13 PM (1).jpg",
  "Photo Nov 22 2025, 6 30 13 PM (2).jpg",
  "Photo Nov 22 2025, 6 30 13 PM (3).jpg",
  "Photo Nov 22 2025, 6 30 13 PM (5).jpg",
  "Photo Nov 22 2025, 6 30 13 PM (6).jpg",
  "Photo Nov 22 2025, 6 30 13 PM (7).jpg",
];

export default function Home() {
  const isDesktop = useIsDesktop();
  const [scrolled, setScrolled] = useState(false);
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [initialImagePosition, setInitialImagePosition] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [cursorStartPos, setCursorStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [columns, setColumns] = useState(4);
  const [lightboxCursorSide, setLightboxCursorSide] = useState<
    "left" | "right"
  >("right");
  const [isOverLightboxImage, setIsOverLightboxImage] = useState(false);

  // Smooth scroll to gallery
  const scrollToGallery = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const galleryElement = document.getElementById("overview");
    if (galleryElement) {
      const headerHeight = 80; // Account for fixed header
      const elementPosition = galleryElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

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

  // Update columns based on screen size
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setColumns(2); // Mobile: 2 columns
      } else if (width < 1024) {
        setColumns(3); // Tablet: 3 columns
      } else if (width < 1280) {
        setColumns(4); // Desktop: 4 columns
      } else {
        setColumns(5); // Large desktop: 5 columns
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
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

  // Create a lookup map for metadata by filename
  const metadataMap = new Map(
    photoMetadata.map((meta) => [meta.filename, meta])
  );

  const projects = photoOrder.map((file, i) => {
    const metadata = metadataMap.get(file);
    return {
      id: i + 1,
      title: metadata?.title || `Project ${i + 1}`,
      description: metadata?.description || "Description",
      image: `/ML-photos/${file}`,
    };
  });

  return (
    <>
      {isDesktop && lightboxOpen && (
        <CustomCursor
          scrolled={scrolled}
          lightboxOpen={lightboxOpen}
          cursorSide={lightboxCursorSide}
          isOverLightboxImage={isOverLightboxImage}
          initialPosition={cursorStartPos}
        />
      )}
      <main
        className={`w-full min-h-screen p-[12px] pb-[48px] flex flex-col gap-[48px] transition-all duration-[1500ms] ${
          scrolled ? "bg-[#0043e0]/98" : "bg-white"
        } opacity-100 pointer-events-auto`}
        style={{
          transition: "background-color 1500ms",
        }}
      >
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 py-[12px] px-[12px]">
          <div
            className={`w-full flex items-start gap-[8px] text-[12px] leading-none tracking-[0.03em] transition-colors duration-300 ${
              scrolled ? "text-white" : "text-[#0043e0]"
            }`}
          >
            <div className="flex-1">
              <a href="/" className="hover:opacity-60">
                Malik Laing<span className={`${libreBaskerville.className}`} style={{ fontSize: '15px', letterSpacing: '-0.02em' }}>, 2000</span>
              </a>
            </div>
            <div className="flex-1 flex justify-end items-start gap-[12px]">
              <a
                href="#overview"
                onClick={scrollToGallery}
                className="hover:opacity-60"
              >
                Overview
              </a>
              <a
                href="/info"
                className="hover:opacity-60"
                onClick={(e) => {
                  // Save current scroll position before navigation
                  sessionStorage.setItem(
                    "homeScrollPosition",
                    window.scrollY.toString()
                  );
                }}
              >
                Info
              </a>
              <a
                href="mailto:Maliklphoto1@gmail.com"
                className="hover:opacity-60"
              >
                Contact
              </a>
            </div>
          </div>
        </header>

        <section className="w-full flex flex-col gap-0">
          <div className="h-[250px]"></div>
          <div className="md:sticky md:top-[12px] z-40">
            <div
              className={`text-center text-[12px] leading-none tracking-[0.03em] transition-colors duration-[1500ms] ${
                scrolled ? "text-white" : "text-[#0043e0]"
              }`}
            >
              <FadeInText text="Photographer and director from San Bernardino, California." />
            </div>
          </div>
          <div className="h-[250px]"></div>

          {/* Gallery Grid */}
          <div id="overview" className="scroll-mt-[80px]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-[24px] md:gap-x-[48px] lg:gap-x-[96px] gap-y-[48px] items-end">
              {projects.map((project, i) => {
                const columnIndex = i % columns; // Dynamic based on screen size
                const isVisible = visibleImages.has(i);
                const transitionDelay = columnIndex * 100; // 100ms stagger per column for smoother reveal

                return (
                  <div
                    key={i}
                    data-image-index={i}
                    className="flex flex-col gap-[8px] group cursor-pointer"
                    onClick={(e) => {
                      // Capture the click position for cursor
                      setCursorStartPos({ x: e.clientX, y: e.clientY });

                      // Capture the image element's position before opening lightbox
                      const imageElement = e.currentTarget.querySelector("img");
                      if (imageElement) {
                        const rect = imageElement.getBoundingClientRect();
                        setInitialImagePosition({
                          x: rect.left + rect.width / 2,
                          y: rect.top + rect.height / 2,
                          width: rect.width,
                          height: rect.height,
                        });
                      }
                      setCurrentImageIndex(i);
                      setLightboxOpen(true);
                    }}
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
                          transition:
                            "opacity 1.6s cubic-bezier(0.4, 0, 0.2, 1)",
                          transitionDelay: isVisible
                            ? `${transitionDelay}ms`
                            : "0ms",
                        }}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                      />
                    </div>
                    <div
                      className="flex flex-col gap-[4px] text-[10px] leading-none tracking-[0.04em]"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transition: "opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        transitionDelay: isVisible
                          ? `${transitionDelay + 200}ms`
                          : "0ms",
                      }}
                    >
                      <div className="flex items-center gap-[6px]">
                        <span
                          className={`transition-colors duration-[1500ms] ${
                            scrolled ? "text-white" : "text-black"
                          }`}
                        >
                          {project.title}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                          <svg
                            width="5"
                            height="5"
                            viewBox="0 0 5 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="2.5"
                              cy="2.5"
                              r="2.25"
                              className={`transition-colors duration-[1500ms] ${
                                scrolled ? "fill-white" : "fill-black"
                              }`}
                            />
                          </svg>
                        </div>
                      </div>
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
          </div>
        </section>
      </main>
      <Lightbox
        isOpen={lightboxOpen}
        currentIndex={currentImageIndex}
        images={projects}
        onClose={() => {
          setLightboxOpen(false);
          setIsOverLightboxImage(false);
          // Clear position after close animation completes
          setTimeout(() => setInitialImagePosition(null), 300);
        }}
        onNavigate={(index) => setCurrentImageIndex(index)}
        scrolled={scrolled}
        initialImagePosition={initialImagePosition}
        onCursorSideChange={isDesktop ? setLightboxCursorSide : undefined}
        onImageHoverChange={isDesktop ? setIsOverLightboxImage : undefined}
      />
    </>
  );
}

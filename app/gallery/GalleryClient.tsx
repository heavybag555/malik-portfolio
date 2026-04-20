"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Lightbox from "../components/Lightbox";
import CustomCursor from "../components/CustomCursor";
import { useIsDesktop } from "../hooks/useIsDesktop";
import type { Project } from "@/lib/content";

const TAGLINE_LEAD = "Photographer and director from";
const TAGLINE_ACCENT = "San Bernardino, California.";

interface GalleryClientProps {
  projects: Project[];
}

export default function GalleryClient({ projects }: GalleryClientProps) {
  const isDesktop = useIsDesktop();
  const scrolled = false;
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set());
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cursorStartPos, setCursorStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [columns, setColumns] = useState(6);
  const [lightboxCursorSide, setLightboxCursorSide] = useState<
    "left" | "right"
  >("right");
  const [isOverLightboxImage, setIsOverLightboxImage] = useState(false);

  useEffect(() => {
    const imageElements = document.querySelectorAll("[data-image-index]");
    let flushTimer: ReturnType<typeof setTimeout> | null = null;
    const pending = new Set<number>();

    const flush = () => {
      if (pending.size === 0) return;
      const toAdd = new Set(pending);
      pending.clear();
      setVisibleImages((prev) => new Set([...prev, ...toAdd]));
      flushTimer = null;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(
              entry.target.getAttribute("data-image-index") || "0",
            );
            pending.add(index);
          }
        });
        if (pending.size > 0 && !flushTimer) {
          flushTimer = setTimeout(flush, 50);
        }
      },
      { threshold: 0.05, rootMargin: "80px" },
    );

    imageElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      if (flushTimer) clearTimeout(flushTimer);
    };
  }, [projects.length]);

  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 768) setColumns(2);
      else if (width < 1024) setColumns(3);
      else setColumns(6);
    };

    updateColumns();
    const debouncedResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateColumns, 150);
    };
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, []);

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
      <main className="w-full min-h-screen px-[20px] pt-[60px] pb-[60px] flex flex-col gap-[48px] bg-white opacity-100 pointer-events-auto">
        <section className="w-full flex flex-col gap-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-[20px] gap-y-[48px] items-end">
            {projects.map((project, i) => {
              const columnIndex = i % columns;
              const isVisible = visibleImages.has(i);
              const transitionDelay = columnIndex * 100;

              return (
                <div
                  key={project.id ?? i}
                  data-image-index={i}
                  className="flex flex-col gap-[8px] group cursor-pointer"
                  onClick={(e) => {
                    setCursorStartPos({ x: e.clientX, y: e.clientY });
                    setCurrentImageIndex(i);
                    setLightboxOpen(true);
                  }}
                >
                  <div className="w-full relative">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={project.width ?? 800}
                      height={project.height ?? 800}
                      quality={75}
                      className="w-full h-auto"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transition:
                          "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                        transitionDelay: isVisible
                          ? `${transitionDelay}ms`
                          : "0ms",
                      }}
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 17vw"
                    />
                  </div>
                  <div
                    className="text-1 flex flex-col gap-[4px]"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                      transitionDelay: isVisible
                        ? `${transitionDelay + 200}ms`
                        : "0ms",
                    }}
                  >
                    <div className="flex items-center gap-[6px]">
                      <span
                        className={`transition-colors duration-700 ${
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
                            className={`transition-colors duration-700 ${
                              scrolled ? "fill-white" : "fill-black"
                            }`}
                          />
                        </svg>
                      </div>
                    </div>
                    <span
                      className={`transition-colors duration-700 ${
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
      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 px-[20px] py-[20px] pointer-events-none mix-blend-difference text-white">
        <div className="text-3 w-full grid grid-cols-6 gap-x-[20px] items-end">
          <div className="col-start-1 pointer-events-auto">
            {TAGLINE_LEAD}
            <br />
            <span className="text-4">{TAGLINE_ACCENT}</span>
          </div>
          <div className="col-start-6 flex justify-end pointer-events-auto">
            © 2026
          </div>
        </div>
      </footer>
      <Lightbox
        isOpen={lightboxOpen}
        currentIndex={currentImageIndex}
        images={projects}
        onClose={() => {
          setLightboxOpen(false);
          setIsOverLightboxImage(false);
        }}
        onNavigate={(index) => setCurrentImageIndex(index)}
        scrolled={scrolled}
        onCursorSideChange={isDesktop ? setLightboxCursorSide : undefined}
        onImageHoverChange={isDesktop ? setIsOverLightboxImage : undefined}
      />
    </>
  );
}

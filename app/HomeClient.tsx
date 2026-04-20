"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Lightbox from "./components/Lightbox";
import CustomCursor from "./components/CustomCursor";
import { useIsDesktop } from "./hooks/useIsDesktop";
import type { Project } from "@/lib/content";

const TAGLINE_LEAD = "Photographer and director from";
const TAGLINE_ACCENT = "San Bernardino, California.";

const THUMB_COUNT_DESKTOP = 24;
const THUMB_COUNT_TABLET = 12;
const THUMB_COUNT_MOBILE = 12;

interface HomeClientProps {
  projects: Project[];
}

export default function HomeClient({ projects }: HomeClientProps) {
  const isDesktop = useIsDesktop();
  const [thumbCount, setThumbCount] = useState<number>(THUMB_COUNT_DESKTOP);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxCursorSide, setLightboxCursorSide] = useState<
    "left" | "right"
  >("right");
  const [isOverLightboxImage, setIsOverLightboxImage] = useState(false);
  const [cursorStartPos, setCursorStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setThumbCount(THUMB_COUNT_MOBILE);
      else if (w < 1024) setThumbCount(THUMB_COUNT_TABLET);
      else setThumbCount(THUMB_COUNT_DESKTOP);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const thumbs = useMemo(
    () => projects.slice(0, thumbCount),
    [projects, thumbCount],
  );

  if (activeIndex >= thumbs.length && activeIndex !== 0) {
    setActiveIndex(0);
  }

  const activeProject = thumbs[activeIndex] ?? thumbs[0];

  const openLightboxAt = (index: number, e?: { clientX: number; clientY: number }) => {
    if (e) setCursorStartPos({ x: e.clientX, y: e.clientY });
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {isDesktop && lightboxOpen && (
        <CustomCursor
          scrolled={false}
          lightboxOpen={lightboxOpen}
          cursorSide={lightboxCursorSide}
          isOverLightboxImage={isOverLightboxImage}
          initialPosition={cursorStartPos}
        />
      )}
      <main className="fixed inset-0 w-full h-full overflow-hidden bg-white">
        {/* Background: active image fills the viewport height.
            Native <img> with eager loading so hover swaps are instant once loaded. */}
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={(e) => openLightboxAt(activeIndex, e)}
          role="button"
          aria-label={`Open ${activeProject?.title ?? "image"}`}
        >
          {thumbs.map((project, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={project.id ?? i}
              src={project.image}
              alt={project.title}
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{
                opacity: i === activeIndex ? 1 : 0,
                transition: "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          ))}
        </div>

        {/* Fixed thumbnail row — ignores horizontal page padding */}
        <div
          className="fixed left-0 right-0 top-1/2 -translate-y-1/2 z-40 flex items-center overflow-x-auto overflow-y-hidden scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ WebkitOverflowScrolling: "touch" }}
          aria-label="Featured photos"
        >
          {thumbs.map((project, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={project.id ?? i}
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onPointerEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
                onClick={(e) => {
                  setActiveIndex(i);
                  openLightboxAt(i, e);
                }}
                className="flex-shrink-0 block cursor-pointer focus:outline-none h-[48px] md:h-[64px] lg:h-[72px]"
                style={{
                  opacity: isActive ? 1 : 0.2,
                  filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
                  transition:
                    "opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), filter 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                aria-label={`Open ${project.title}`}
              >
                <Image
                  src={project.image}
                  alt=""
                  width={project.width ?? 800}
                  height={project.height ?? 800}
                  quality={75}
                  className="block h-full w-auto"
                  sizes="120px"
                />
              </button>
            );
          })}
        </div>

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

        {/* Screen-reader helper: currently active image title */}
        <span className="sr-only" aria-live="polite">
          {activeProject?.title}
        </span>
      </main>

      <Lightbox
        isOpen={lightboxOpen}
        currentIndex={lightboxIndex}
        images={thumbs}
        onClose={() => {
          setLightboxOpen(false);
          setIsOverLightboxImage(false);
        }}
        onNavigate={(index) => {
          setLightboxIndex(index);
          setActiveIndex(index);
        }}
        scrolled={false}
        onCursorSideChange={isDesktop ? setLightboxCursorSide : undefined}
        onImageHoverChange={isDesktop ? setIsOverLightboxImage : undefined}
      />
    </>
  );
}

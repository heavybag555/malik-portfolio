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

const THUMB_HEIGHT_DESKTOP = 72;
const THUMB_HEIGHT_TABLET = 64;
const THUMB_HEIGHT_MOBILE = 48;

interface HomeClientProps {
  projects: Project[];
}

export default function HomeClient({ projects }: HomeClientProps) {
  const isDesktop = useIsDesktop();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [maxThumbs, setMaxThumbs] = useState<number>(THUMB_COUNT_DESKTOP);
  const [thumbHeight, setThumbHeight] = useState<number>(THUMB_HEIGHT_DESKTOP);
  const [viewportWidth, setViewportWidth] = useState<number>(0);
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
      setViewportWidth(w);
      if (w < 768) {
        setMaxThumbs(THUMB_COUNT_MOBILE);
        setThumbHeight(THUMB_HEIGHT_MOBILE);
        setIsMobile(true);
      } else if (w < 1024) {
        setMaxThumbs(THUMB_COUNT_TABLET);
        setThumbHeight(THUMB_HEIGHT_TABLET);
        setIsMobile(false);
      } else {
        setMaxThumbs(THUMB_COUNT_DESKTOP);
        setThumbHeight(THUMB_HEIGHT_DESKTOP);
        setIsMobile(false);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Fit as many thumbnails as possible across the full viewport width at the
  // current row height, preserving each image's natural aspect ratio. This
  // guarantees the strip spans the entire page and never needs to scroll.
  const thumbs = useMemo(() => {
    const pool = projects.slice(0, maxThumbs);
    if (!viewportWidth) return pool;
    const fitted: Project[] = [];
    let used = 0;
    for (const p of pool) {
      const ar = p.width && p.height ? p.width / p.height : 1;
      const w = thumbHeight * ar;
      if (used + w > viewportWidth) break;
      used += w;
      fitted.push(p);
    }
    return fitted.length > 0 ? fitted : pool.slice(0, 1);
  }, [projects, maxThumbs, thumbHeight, viewportWidth]);

  if (activeIndex >= thumbs.length && activeIndex !== 0) {
    setActiveIndex(0);
  }

  const activeProject = thumbs[activeIndex] ?? thumbs[0];

  const openLightboxAt = (index: number, e?: { clientX: number; clientY: number }) => {
    if (isMobile) return;
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
          className={`absolute inset-0 ${isMobile ? "" : "cursor-pointer"}`}
          onClick={isMobile ? undefined : (e) => openLightboxAt(activeIndex, e)}
          role={isMobile ? undefined : "button"}
          aria-label={
            isMobile ? undefined : `Open ${activeProject?.title ?? "image"}`
          }
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

        {/* Fixed thumbnail row — spans the full viewport width, no scrolling */}
        <div
          className="fixed left-0 right-0 top-1/2 -translate-y-1/2 z-40 flex items-center justify-between overflow-hidden"
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
                  if (!isMobile) openLightboxAt(i, e);
                }}
                className={`flex-shrink-0 block focus:outline-none h-[48px] md:h-[64px] lg:h-[72px] ${
                  isMobile ? "" : "cursor-pointer"
                }`}
                aria-label={
                  isMobile ? project.title : `Open ${project.title}`
                }
                style={{
                  opacity: isActive ? 1 : 0.2,
                  filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
                  transition:
                    "opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), filter 400ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
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
          <div className="text-3 w-full grid grid-cols-2 lg:grid-cols-6 gap-x-[20px] items-end">
            <div className="col-start-1 min-w-0 pointer-events-auto">
              {TAGLINE_LEAD}
              <br />
              <span className="text-4">{TAGLINE_ACCENT}</span>
            </div>
            <div className="col-start-2 flex justify-end pointer-events-auto lg:col-start-6">
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

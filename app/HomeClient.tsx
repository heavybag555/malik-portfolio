"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { timesBoldItalic } from "./fonts";
import type { Project } from "@/lib/content";

const BRAND_NAME = "Malik Laing";
const BRAND_SUFFIX = ", 2000";
const CONTACT_EMAIL = "Maliklphoto1@gmail.com";
const TAGLINE_LEAD = "Photographer and director from";
const TAGLINE_ACCENT = "San Bernardino, California.";

const THUMB_COUNT_DESKTOP = 24;
const THUMB_COUNT_TABLET = 12;
const THUMB_COUNT_MOBILE = 12;

interface HomeClientProps {
  projects: Project[];
}

export default function HomeClient({ projects }: HomeClientProps) {
  const [thumbCount, setThumbCount] = useState<number>(THUMB_COUNT_DESKTOP);
  const [activeIndex, setActiveIndex] = useState<number>(0);

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

  useEffect(() => {
    if (activeIndex >= thumbs.length) setActiveIndex(0);
  }, [thumbs.length, activeIndex]);

  const activeProject = thumbs[activeIndex] ?? thumbs[0];

  return (
    <main className="fixed inset-0 w-full h-full overflow-hidden bg-black">
      {/* Background: active image fills the viewport height.
          Native <img> with eager loading so hover swaps are instant once loaded. */}
      <div className="absolute inset-0">
        {thumbs.map((project, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={project.id ?? i}
            src={project.image}
            alt={project.title}
            loading="eager"
            decoding="async"
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              opacity: i === activeIndex ? 1 : 0,
              transition: "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        ))}
      </div>

      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-[20px] py-[20px] mix-blend-difference text-white">
        <div className="w-full grid grid-cols-6 gap-x-[20px] items-start text-[12px] leading-none tracking-[0.03em]">
          <div className="col-start-1">
            <a href="/" className="hover:opacity-60">
              {BRAND_NAME}
              <span className={timesBoldItalic.className}>{BRAND_SUFFIX}</span>
            </a>
          </div>
          <div className="col-start-4 flex items-start gap-[12px]">
            <a href="/" className="hover:opacity-60">
              Home
            </a>
            <a href="/gallery" className="hover:opacity-60">
              Gallery
            </a>
            <a href="/info" className="hover:opacity-60">
              Info
            </a>
          </div>
          <div className="col-start-6 flex justify-end">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hover:opacity-60"
            >
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* Fixed thumbnail row — ignores horizontal page padding */}
      <div
        className="fixed left-0 right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-[8px] overflow-x-auto overflow-y-hidden scroll-smooth px-[20px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              onClick={() => setActiveIndex(i)}
              className="flex-shrink-0 block cursor-pointer focus:outline-none h-[48px] md:h-[64px] lg:h-[72px]"
              style={{
                opacity: isActive ? 1 : 0.2,
                filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
                transition:
                  "opacity 400ms cubic-bezier(0.4, 0, 0.2, 1), filter 400ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              aria-label={project.title}
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
        <div className="w-full grid grid-cols-6 gap-x-[20px] items-end text-[12px] leading-none tracking-[0.03em]">
          <div className="col-start-1 pointer-events-auto">
            {TAGLINE_LEAD}{" "}
            <span className={timesBoldItalic.className}>{TAGLINE_ACCENT}</span>
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
  );
}

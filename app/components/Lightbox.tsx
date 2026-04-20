"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useIsDesktop } from "../hooks/useIsDesktop";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface LightboxProps {
  isOpen: boolean;
  currentIndex: number;
  images: Project[];
  onClose: () => void;
  onNavigate: (index: number) => void;
  scrolled?: boolean;
  // Kept for API compatibility with existing callers; no longer used.
  initialImagePosition?: { x: number; y: number; width: number; height: number } | null;
  onCursorSideChange?: (side: "left" | "right") => void;
  onImageHoverChange?: (isOver: boolean) => void;
}

const ENTER_MS = 220;
const EXIT_MS = 180;
const SWAP_MS = 180;

export default function Lightbox({
  isOpen,
  currentIndex,
  images,
  onClose,
  onNavigate,
  onCursorSideChange,
  onImageHoverChange,
}: LightboxProps) {
  const isDesktop = useIsDesktop();
  const [mounted, setMounted] = useState(false);
  const [entered, setEntered] = useState(false);
  const preloadedRef = useRef<Set<string>>(new Set());

  // Two-slot crossfade state: each slot holds a src; only one is "active" at a time.
  const [slotA, setSlotA] = useState<string | null>(null);
  const [slotB, setSlotB] = useState<string | null>(null);
  const [activeSlot, setActiveSlot] = useState<"a" | "b">("a");
  const firstEnterRef = useRef(true);

  const currentProject = images[currentIndex];

  const handlePrevious = useCallback(() => {
    onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, images.length, onNavigate]);

  // Mount / unmount with enter transition.
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Two RAFs so the initial styles are committed before we flip to "entered".
      let id2 = 0;
      const id1 = requestAnimationFrame(() => {
        id2 = requestAnimationFrame(() => setEntered(true));
      });
      return () => {
        cancelAnimationFrame(id1);
        if (id2) cancelAnimationFrame(id2);
      };
    }
    setEntered(false);
    const t = setTimeout(() => setMounted(false), EXIT_MS);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Preload current + adjacent (raw URLs — same as <img src> below, so cache actually hits).
  useEffect(() => {
    if (!isOpen) return;
    const preload = (src?: string) => {
      if (!src || preloadedRef.current.has(src)) return;
      const img = new window.Image();
      img.decoding = "async";
      img.src = src;
      preloadedRef.current.add(src);
    };
    const prev = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    const next = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    preload(images[currentIndex]?.image);
    preload(images[prev]?.image);
    preload(images[next]?.image);
  }, [isOpen, currentIndex, images]);

  // Seed the active slot when the lightbox opens (no crossfade for the first frame).
  useEffect(() => {
    if (!isOpen) {
      firstEnterRef.current = true;
      return;
    }
    if (!currentProject) return;
    if (firstEnterRef.current) {
      firstEnterRef.current = false;
      setSlotA(currentProject.image);
      setSlotB(null);
      setActiveSlot("a");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Crossfade on navigation: park the new src in the *inactive* slot first, then flip.
  useEffect(() => {
    if (!isOpen || !currentProject) return;
    if (firstEnterRef.current) return;
    const activeSrc = activeSlot === "a" ? slotA : slotB;
    if (activeSrc === currentProject.image) return;
    if (activeSlot === "a") {
      setSlotB(currentProject.image);
      const id = requestAnimationFrame(() => setActiveSlot("b"));
      return () => cancelAnimationFrame(id);
    }
    setSlotA(currentProject.image);
    const id = requestAnimationFrame(() => setActiveSlot("a"));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProject?.image, isOpen]);

  // Keyboard navigation.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrevious, handleNext]);

  // Report cursor side while the lightbox is open.
  useEffect(() => {
    if (!isOpen || !isDesktop) return;
    onCursorSideChange?.("right");
    const handleMouseMove = (e: MouseEvent) => {
      onCursorSideChange?.(
        e.clientX < window.innerWidth / 2 ? "left" : "right",
      );
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isOpen, isDesktop, onCursorSideChange]);

  // Body scroll lock.
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      if (e.clientX < centerX) handlePrevious();
      else handleNext();
    },
    [handlePrevious, handleNext],
  );

  const handleImageMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDesktop) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      onCursorSideChange?.(e.clientX < centerX ? "left" : "right");
    },
    [isDesktop, onCursorSideChange],
  );

  if (!mounted || !currentProject) return null;

  const slotASrc = slotA;
  const slotBSrc = slotB;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center cursor-none"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.97)",
        opacity: entered ? 1 : 0,
        transition: `opacity ${entered ? ENTER_MS : EXIT_MS}ms ease-out`,
      }}
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center gap-3 max-w-[90vw]"
        style={{
          opacity: entered ? 1 : 0,
          transform: entered ? "scale(1)" : "scale(0.965)",
          transition: `opacity ${ENTER_MS}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${ENTER_MS + 40}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          willChange: "transform, opacity",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative p-3 cursor-none"
          onClick={handleImageClick}
          onMouseEnter={() => isDesktop && onImageHoverChange?.(true)}
          onMouseLeave={() => isDesktop && onImageHoverChange?.(false)}
          onMouseMove={handleImageMouseMove}
        >
          {/* Invisible sizer defines container dims from the current image's natural aspect;
              both crossfading slots are absolutely positioned on top. */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentProject.image}
              alt=""
              aria-hidden
              draggable={false}
              decoding="async"
              className="block w-auto h-auto max-w-[90vw] max-h-[80vh] object-contain select-none invisible"
              style={{ pointerEvents: "none", userSelect: "none" }}
            />
            {slotASrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={slotASrc}
                alt={activeSlot === "a" ? currentProject.title : ""}
                draggable={false}
                decoding="async"
                className="absolute inset-0 w-full h-full object-contain select-none"
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  opacity: activeSlot === "a" ? 1 : 0,
                  transition: `opacity ${SWAP_MS}ms ease-out`,
                }}
              />
            )}
            {slotBSrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={slotBSrc}
                alt={activeSlot === "b" ? currentProject.title : ""}
                draggable={false}
                decoding="async"
                className="absolute inset-0 w-full h-full object-contain select-none"
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  opacity: activeSlot === "b" ? 1 : 0,
                  transition: `opacity ${SWAP_MS}ms ease-out`,
                }}
              />
            )}
          </div>
        </div>
        <div className="text-1 flex flex-col gap-[4px] text-center">
          <span className="text-black">{currentProject.title}</span>
          <span className="text-[#ACACAC]">{currentProject.description}</span>
        </div>
      </div>
    </div>
  );
}

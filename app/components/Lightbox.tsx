"use client";

import Image from "next/image";
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
  scrolled: boolean;
  initialImagePosition?: { x: number; y: number; width: number; height: number } | null;
  onCursorSideChange?: (side: "left" | "right") => void;
  onImageHoverChange?: (isOver: boolean) => void;
}

export default function Lightbox({
  isOpen,
  currentIndex,
  images,
  onClose,
  onNavigate,
  initialImagePosition,
  onCursorSideChange,
  onImageHoverChange,
}: LightboxProps) {
  const isDesktop = useIsDesktop();
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(currentIndex);
  const preloadedRef = useRef<Set<string>>(new Set());

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  }, [currentIndex, images.length, onNavigate]);

  // Preload adjacent images
  useEffect(() => {
    if (!isOpen) return;

    const preload = (src: string) => {
      if (preloadedRef.current.has(src)) return;
      const img = new window.Image();
      img.src = src;
      preloadedRef.current.add(src);
    };

    const prev = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    const next = currentIndex === images.length - 1 ? 0 : currentIndex + 1;

    preload(images[currentIndex]?.image);
    preload(images[prev]?.image);
    preload(images[next]?.image);
  }, [isOpen, currentIndex, images]);

  // Track mouse for cursor side
  useEffect(() => {
    if (!isOpen || !isDesktop) return;

    onCursorSideChange?.("right");

    const handleMouseMove = (e: MouseEvent) => {
      const side = e.clientX < window.innerWidth / 2 ? "left" : "right";
      onCursorSideChange?.(side);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isOpen, isDesktop, onCursorSideChange]);

  // Keyboard navigation
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

  // Handle visibility
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setDisplayIndex(currentIndex);
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentIndex]);

  // Sync display index with current index (for navigation while open)
  useEffect(() => {
    if (isOpen) setDisplayIndex(currentIndex);
  }, [currentIndex, isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Handle click navigation on image
  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    if (e.clientX < centerX) {
      handlePrevious();
    } else {
      handleNext();
    }
  }, [handlePrevious, handleNext]);

  // Handle mouse move over image for cursor
  const handleImageMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    onCursorSideChange?.(e.clientX < centerX ? "left" : "right");
  }, [isDesktop, onCursorSideChange]);

  if (!isVisible) return null;

  const currentProject = images[displayIndex];

  // Calculate morph transform
  let morphStyle: React.CSSProperties = {};
  if (initialImagePosition && !isAnimating) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dx = vw / 2 - initialImagePosition.x;
    const dy = vh / 2 - initialImagePosition.y;
    const finalWidth = Math.min(1200, vw * 0.9);
    const scale = finalWidth / initialImagePosition.width;
    morphStyle = {
      transform: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`,
    };
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center cursor-none"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.97)",
        opacity: isAnimating ? 1 : 0,
        transition: "opacity 0.3s ease-out",
      }}
      onClick={onClose}
    >
      <div
        className="flex flex-col items-center gap-3 max-w-[90vw] max-h-[90vh]"
        style={{
          ...morphStyle,
          transition: isAnimating
            ? "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",
          transform: isAnimating ? "translate3d(0, 0, 0) scale(1)" : morphStyle.transform,
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
          <Image
            key={currentProject.image}
            src={currentProject.image}
            alt={currentProject.title}
            width={1200}
            height={1200}
            className="w-auto h-auto max-w-full max-h-[80vh] object-contain select-none"
            draggable={false}
            priority
            style={{
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        </div>
        <div className="flex flex-col gap-[4px] text-[10px] leading-none tracking-[0.04em] text-center">
          <span className="text-black" style={{ fontWeight: 550 }}>{currentProject.title}</span>
          <span className="text-[#ACACAC]" style={{ fontWeight: 550 }}>{currentProject.description}</span>
        </div>
      </div>
    </div>
  );
}

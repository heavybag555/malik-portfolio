"use client";

import { useEffect, useRef } from "react";

interface CustomCursorProps {
  scrolled: boolean;
  lightboxOpen?: boolean;
  cursorSide?: "left" | "right";
  isOverLightboxImage?: boolean;
  initialPosition?: { x: number; y: number } | null;
}

export default function CustomCursor({
  scrolled,
  lightboxOpen = false,
  cursorSide = "right",
  isOverLightboxImage = false,
  initialPosition,
}: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(initialPosition || { x: 0, y: 0 });
  const targetRef = useRef(initialPosition || { x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Initialize position
    if (initialPosition) {
      positionRef.current = { ...initialPosition };
      targetRef.current = { ...initialPosition };
      cursor.style.transform = `translate3d(${initialPosition.x}px, ${initialPosition.y}px, 0) translate(-50%, -50%)`;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      isVisibleRef.current = true;
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
    };

    // Smooth animation loop
    const animate = () => {
      const pos = positionRef.current;
      const target = targetRef.current;
      
      // Lerp towards target
      const ease = 0.15;
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;

      if (cursor) {
        cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
        cursor.style.opacity = isVisibleRef.current ? "1" : "0";
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [initialPosition]);

  const showArrow = lightboxOpen;
  const cursorLabel = !isOverLightboxImage
    ? "[ESC]"
    : cursorSide === "left"
    ? "[PREV]"
    : "[NEXT]";

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999]"
      style={{
        willChange: "transform",
        transition: "opacity 0.1s ease-out",
      }}
    >
      {/* Arrow/text cursor */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center whitespace-nowrap"
        style={{
          opacity: showArrow ? 1 : 0,
          transform: `translate(-50%, -50%) scale(${showArrow ? 1 : 0.8})`,
          transition: "opacity 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        }}
      >
        <span
          className="text-[11px] leading-none font-medium tracking-[0.03em]"
          style={{
            color: !isOverLightboxImage ? "black" : "white",
            backgroundColor: !isOverLightboxImage ? "white" : "#000000",
            padding: "2px 2px 3px 2px",
          }}
        >
          {cursorLabel}
        </span>
      </div>

      {/* Dot cursor */}
      <div
        className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
        style={{
          transform: `translate(-50%, -50%) scale(${showArrow ? 0.8 : 1})`,
          backgroundColor: lightboxOpen ? "#0043e0" : scrolled ? "white" : "#0043e0",
          opacity: showArrow ? 0 : 1,
          boxShadow: scrolled && !lightboxOpen
            ? "0 0 0 1px rgba(0, 0, 0, 0.1)"
            : "0 0 0 1px rgba(255, 255, 255, 0.1)",
          transition: "background-color 700ms ease-in-out, opacity 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        }}
      />
    </div>
  );
}

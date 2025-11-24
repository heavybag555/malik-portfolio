"use client";

import { useEffect, useState, useRef } from "react";

interface CustomCursorProps {
  scrolled: boolean;
  lightboxOpen?: boolean;
  cursorSide?: "left" | "right";
  isOverLightboxImage?: boolean;
}

export default function CustomCursor({ scrolled, lightboxOpen = false, cursorSide = "right", isOverLightboxImage = false }: CustomCursorProps) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);
  const [cursorType, setCursorType] = useState<"dot" | "arrow">("dot");
  const animationFrameRef = useRef<number | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Initialize cursor position - use saved position if available, otherwise use current mouse position or center
    if (typeof window !== "undefined") {
      // Try to get saved cursor position from sessionStorage
      const savedPosition = sessionStorage.getItem("cursorPosition");
      let initialX = window.innerWidth / 2;
      let initialY = window.innerHeight / 2;
      
      if (savedPosition) {
        try {
          const { x, y } = JSON.parse(savedPosition);
          // Validate saved position is within viewport bounds
          if (x >= 0 && x <= window.innerWidth && y >= 0 && y <= window.innerHeight) {
            initialX = x;
            initialY = y;
          }
        } catch (e) {
          // If parsing fails, use center
        }
      }
      
      mousePositionRef.current = { x: initialX, y: initialY };
      setCursorPosition({ x: initialX, y: initialY });
      setIsVisible(true);
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMountedRef.current) return;
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
      // Save cursor position to sessionStorage for persistence across page navigations
      try {
        sessionStorage.setItem("cursorPosition", JSON.stringify({ x: e.clientX, y: e.clientY }));
      } catch (e) {
        // Ignore storage errors (e.g., in private browsing)
      }
      setIsVisible(true);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Handle viewport resize - update saved position if viewport changes significantly
    const handleResize = () => {
      if (typeof window !== "undefined" && mousePositionRef.current) {
        const { x, y } = mousePositionRef.current;
        // Clamp position to new viewport bounds
        const clampedX = Math.max(0, Math.min(x, window.innerWidth));
        const clampedY = Math.max(0, Math.min(y, window.innerHeight));
        mousePositionRef.current = { x: clampedX, y: clampedY };
        try {
          sessionStorage.setItem("cursorPosition", JSON.stringify({ x: clampedX, y: clampedY }));
        } catch (e) {
          // Ignore storage errors
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Update cursor type smoothly
  useEffect(() => {
    if (lightboxOpen) {
      setCursorType("arrow");
    } else {
      setCursorType("dot");
    }
  }, [lightboxOpen, isOverLightboxImage]);

  useEffect(() => {
    if (!isMountedRef.current) return;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      if (!isMountedRef.current) {
        return;
      }

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Normalize deltaTime to ~16.67ms (60fps) for consistent easing
      const normalizedDelta = Math.min(deltaTime / 16.67, 2);

      setCursorPosition((prev) => {
        const targetX = mousePositionRef.current.x;
        const targetY = mousePositionRef.current.y;
        const dx = targetX - prev.x;
        const dy = targetY - prev.y;
        
        // Smooth interpolation factor - slightly adjusted for smoother feel
        const ease = 0.15 * normalizedDelta;
        
        // Only update if movement is significant to avoid micro-jitter
        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
          return prev;
        }
        
        // Calculate new position
        const newX = prev.x + dx * ease;
        const newY = prev.y + dy * ease;
        
        return {
          x: newX,
          y: newY,
        };
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      className="fixed pointer-events-none"
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0) translate(-50%, -50%)`,
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.1s ease-out",
        zIndex: 99999,
        willChange: "transform",
        pointerEvents: "none",
      }}
    >
      {/* Text cursor */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${cursorType === "arrow" ? 1 : 0.8})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: cursorType === "arrow" ? 1 : 0,
          transition: "opacity 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            lineHeight: "1",
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            color: lightboxOpen && !isOverLightboxImage ? "black" : "white",
            backgroundColor: lightboxOpen && !isOverLightboxImage ? "white" : "#000000",
            padding: "2px 2px 3px 2px",
            letterSpacing: "0.03em",
            fontWeight: "500",
          }}
        >
          {lightboxOpen && !isOverLightboxImage ? "[ESC]" : cursorSide === "left" ? "[PREV]" : "[NEXT]"}
        </span>
      </div>
      
      {/* Dot cursor */}
      <div
        className="w-3 h-3 rounded-full"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${cursorType === "dot" ? 1 : 0.8})`,
          backgroundColor: lightboxOpen ? "#0043e0" : (scrolled ? "white" : "#0043e0"),
          transition: "background-color 1500ms ease-in-out, opacity 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          opacity: cursorType === "dot" ? 1 : 0,
          boxShadow: lightboxOpen 
            ? "0 0 0 1px rgba(255, 255, 255, 0.1)"
            : (scrolled 
              ? "0 0 0 1px rgba(0, 0, 0, 0.1)" 
              : "0 0 0 1px rgba(255, 255, 255, 0.1)"),
          pointerEvents: "none",
        }}
      />
    </div>
  );
}


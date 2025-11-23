"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

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
}

export default function Lightbox({
  isOpen,
  currentIndex,
  images,
  onClose,
  onNavigate,
  scrolled,
}: LightboxProps) {
  const [mouseX, setMouseX] = useState(0);
  const [cursorSide, setCursorSide] = useState<"left" | "right">("right");
  const [isVisible, setIsVisible] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const prevIndexRef = useRef(currentIndex);
  const imageLoadedRef = useRef(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrevious = () => {
    if (isTransitioning) return;
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setSlideDirection("right");
    onNavigate(newIndex);
  };

  const handleNext = () => {
    if (isTransitioning) return;
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setSlideDirection("left");
    onNavigate(newIndex);
  };

  // Preload adjacent images for smooth transitions
  useEffect(() => {
    if (!isOpen) return;

    const preloadImage = (src: string) => {
      const img = new window.Image();
      img.src = src;
    };

    // Preload previous and next images
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;

    preloadImage(images[prevIndex]?.image);
    preloadImage(images[nextIndex]?.image);
  }, [isOpen, currentIndex, images]);

  // Track mouse position
  useEffect(() => {
    if (!isOpen) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      const viewportWidth = window.innerWidth;
      setCursorSide(e.clientX < viewportWidth / 2 ? "left" : "right");
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isOpen]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen || isTransitioning) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
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
  }, [isOpen, currentIndex, images.length, onClose, isTransitioning]);

  // Handle fade in/out transitions for lightbox open/close
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setContentOpacity(0);
      const timer = setTimeout(() => {
        setContentOpacity(1);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setContentOpacity(0);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Handle smooth image transitions
  useEffect(() => {
    if (!isOpen) return;

    // Detect direction based on index change
    const direction =
      currentIndex > prevIndexRef.current
        ? "left"
        : currentIndex < prevIndexRef.current
        ? "right"
        : null;

    if (direction && currentIndex !== prevIndexRef.current) {
      setSlideDirection(direction);
      setIsTransitioning(true);

      // Clear any existing timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      // Wait for image to load, then complete transition
      let checkCount = 0;
      const maxChecks = 100; // Max 100 frames (~1.6s at 60fps)

      const checkImageLoad = () => {
        checkCount++;
        if (imageLoadedRef.current || checkCount >= maxChecks) {
          // Small delay to ensure smooth transition completion
          transitionTimeoutRef.current = setTimeout(() => {
            setIsTransitioning(false);
            setSlideDirection(null);
          }, 30);
        } else {
          requestAnimationFrame(checkImageLoad);
        }
      };

      // Start checking after a brief delay to allow image to start loading
      setTimeout(() => {
        requestAnimationFrame(checkImageLoad);
      }, 10);

      prevIndexRef.current = currentIndex;

      return () => {
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
      };
    }
  }, [currentIndex, isOpen]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTransitioning) return;

    const viewportWidth = window.innerWidth;
    const clickX = e.clientX;

    // Navigate based on which side of the screen is clicked
    if (clickX < viewportWidth / 2) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const handleImageLoad = () => {
    // Mark image as loaded
    imageLoadedRef.current = true;
  };

  // Reset image loaded state when image changes
  useEffect(() => {
    imageLoadedRef.current = false;
  }, [currentIndex]);

  if (!isVisible) return null;

  const currentProject = images[currentIndex];

  // Calculate slide transform based on direction
  const getSlideTransform = () => {
    if (!slideDirection || !isTransitioning)
      return "translate3d(0, 0, 0) scale(1)";
    // No transform effects - only opacity changes during transition
    return "translate3d(0, 0, 0) scale(1)";
  };

  const getSlideOpacity = () => {
    if (!slideDirection || !isTransitioning) return 1;
    return 0;
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.97)",
        cursor: "default",
        opacity: isOpen ? contentOpacity : 0,
        transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={onClose}
    >
      <div
        className="lightbox-content flex flex-col items-center gap-[12px] max-w-[90vw] max-h-[90vh] relative"
        style={{
          cursor: "default",
          willChange: isTransitioning ? "transform, opacity" : "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full h-auto flex items-center justify-center overflow-hidden"
          style={{
            contain: "layout style paint",
          }}
        >
          <div
            className="relative p-[12px]"
            style={{
              transform: getSlideTransform(),
              opacity: getSlideOpacity(),
              transition:
                "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: isTransitioning ? "transform, opacity" : "auto",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              perspective: "1000px",
            }}
            onClick={(e) => {
              if (isTransitioning) return;
              e.stopPropagation();

              // Get the image container's bounding rect
              const imageContainer = e.currentTarget;
              const rect = imageContainer.getBoundingClientRect();
              const clickX = e.clientX;
              const imageCenterX = rect.left + rect.width / 2;

              // Navigate based on which side of the image is clicked
              if (clickX < imageCenterX) {
                handlePrevious();
              } else {
                handleNext();
              }
            }}
            onMouseMove={(e) => {
              // Update cursor based on which side of the image the mouse is over
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseX = e.clientX;
              const imageCenterX = rect.left + rect.width / 2;
              setCursorSide(mouseX < imageCenterX ? "left" : "right");
            }}
          >
            <Image
              src={currentProject.image}
              alt={currentProject.title}
              width={1200}
              height={1200}
              className="w-auto h-auto max-w-full max-h-[80vh] object-contain"
              priority
              onLoad={handleImageLoad}
              onLoadingComplete={handleImageLoad}
              style={{
                cursor: cursorSide === "left" ? "w-resize" : "e-resize",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
        <div
          className="flex flex-col gap-[2px] text-[11px] font-medium leading-none tracking-[0.03em] text-center"
          style={{
            transform: getSlideTransform(),
            opacity: getSlideOpacity(),
            transition:
              "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: isTransitioning ? "transform, opacity" : "auto",
          }}
        >
          <span
            className={`transition-colors duration-1500 ${
              scrolled ? "text-black" : "text-black"
            }`}
          >
            {currentProject.title}
          </span>
          <span
            className={`transition-colors duration-1500 ${
              scrolled ? "text-[#666666]" : "text-[#666666]"
            }`}
          >
            {currentProject.description}
          </span>
        </div>
      </div>
    </div>
  );
}

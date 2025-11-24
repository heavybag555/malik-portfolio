"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
}

interface InitialImagePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LightboxProps {
  isOpen: boolean;
  currentIndex: number;
  images: Project[];
  onClose: () => void;
  onNavigate: (index: number) => void;
  scrolled: boolean;
  initialImagePosition?: InitialImagePosition | null;
  onCursorSideChange?: (side: "left" | "right") => void;
  onImageHoverChange?: (isOver: boolean) => void;
}

export default function Lightbox({
  isOpen,
  currentIndex,
  images,
  onClose,
  onNavigate,
  scrolled,
  initialImagePosition,
  onCursorSideChange,
  onImageHoverChange,
}: LightboxProps) {
  const [mouseX, setMouseX] = useState(0);
  const [cursorSide, setCursorSide] = useState<"left" | "right">("right");
  const [isOverImage, setIsOverImage] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [contentOpacity, setContentOpacity] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [morphTransform, setMorphTransform] = useState<string>("translate3d(0, 0, 0) scale(1)");
  const [isMorphing, setIsMorphing] = useState(false);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const prevIndexRef = useRef(currentIndex);
  const imageLoadedRef = useRef(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const preloadedImagesRef = useRef<Set<string>>(new Set());
  const imageLoadPromisesRef = useRef<Map<string, Promise<void>>>(new Map());

  const handlePrevious = () => {
    // Allow navigation even during transitions, but clear any pending transition
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    setIsTransitioning(false);
    setSlideDirection(null);
    setPreviousIndex(null);
    setTransitionProgress(0);
    
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
  };

  const handleNext = () => {
    // Allow navigation even during transitions, but clear any pending transition
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    setIsTransitioning(false);
    setSlideDirection(null);
    setPreviousIndex(null);
    setTransitionProgress(0);
    
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  };

  // Sync prevIndexRef when lightbox opens
  useEffect(() => {
    if (isOpen) {
      prevIndexRef.current = currentIndex;
      setIsTransitioning(false);
      setSlideDirection(null);
      setPreviousIndex(null);
      setTransitionProgress(0);
    }
  }, [isOpen, currentIndex]);

  // Aggressively preload images for smooth transitions
  useEffect(() => {
    if (!isOpen) return;

    const preloadImage = (src: string): Promise<void> => {
      // Return existing promise if already loading
      if (imageLoadPromisesRef.current.has(src)) {
        return imageLoadPromisesRef.current.get(src)!;
      }

      // Return immediately if already loaded
      if (preloadedImagesRef.current.has(src)) {
        return Promise.resolve();
      }

      const promise = new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          preloadedImagesRef.current.add(src);
          resolve();
        };
        img.onerror = () => {
          // Still resolve on error to not block transitions
          preloadedImagesRef.current.add(src);
          resolve();
        };
        img.src = src;
      });

      imageLoadPromisesRef.current.set(src, promise);
      return promise;
    };

    // Preload current, previous, next, and one more in each direction
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    const prev2Index = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
    const next2Index = nextIndex === images.length - 1 ? 0 : nextIndex + 1;

    // Preload all adjacent images
    preloadImage(images[currentIndex]?.image);
    preloadImage(images[prevIndex]?.image);
    preloadImage(images[nextIndex]?.image);
    preloadImage(images[prev2Index]?.image);
    preloadImage(images[next2Index]?.image);
  }, [isOpen, currentIndex, images]);

  // Track mouse position
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Initialize cursor side when lightbox opens
    const initialSide = window.innerWidth / 2 < window.innerWidth / 2 ? "left" : "right";
    setCursorSide("right"); // Default to right
    onCursorSideChange?.("right");

    const handleMouseMove = (e: MouseEvent) => {
      setMouseX(e.clientX);
      const viewportWidth = window.innerWidth;
      const newSide = e.clientX < viewportWidth / 2 ? "left" : "right";
      setCursorSide(newSide);
      onCursorSideChange?.(newSide);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isOpen, onCursorSideChange]);

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, currentIndex, images.length, onClose]);

  // Handle enter/exit morph animations and fade transitions
  useEffect(() => {
    if (isOpen && initialImagePosition) {
      setIsVisible(true);
      setIsMorphing(true);
      setContentOpacity(0);
      
      // Calculate center position
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      
      // Calculate transform needed to move from initial position to center
      const deltaX = viewportCenterX - initialImagePosition.x;
      const deltaY = viewportCenterY - initialImagePosition.y;
      
      // Estimate final image size (will be adjusted based on max-width/max-height constraints)
      // For now, use a reasonable scale factor
      const estimatedFinalWidth = Math.min(1200, window.innerWidth * 0.9);
      const scale = estimatedFinalWidth / initialImagePosition.width;
      
      // Start from initial position
      setMorphTransform(`translate3d(${deltaX}px, ${deltaY}px) scale(${scale})`);
      
      // Use requestAnimationFrame to ensure smooth transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Animate to center
          setMorphTransform("translate3d(0, 0, 0) scale(1)");
          
          // Fade in content after morph starts
          setTimeout(() => {
            setContentOpacity(1);
          }, 50);
          
          // Complete morphing after animation duration
          setTimeout(() => {
            setIsMorphing(false);
          }, 300);
        });
      });
    } else if (!isOpen && initialImagePosition) {
      // Exit animation: morph back to original position
      // Ensure we start from center position
      setMorphTransform("translate3d(0, 0, 0) scale(1)");
      setIsMorphing(true);
      setContentOpacity(0);
      
      // Use requestAnimationFrame to ensure smooth transition from current state
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const viewportCenterX = window.innerWidth / 2;
          const viewportCenterY = window.innerHeight / 2;
          const deltaX = viewportCenterX - initialImagePosition.x;
          const deltaY = viewportCenterY - initialImagePosition.y;
          const estimatedFinalWidth = Math.min(1200, window.innerWidth * 0.9);
          const scale = estimatedFinalWidth / initialImagePosition.width;
          
          // Animate back to initial position
          setMorphTransform(`translate3d(${deltaX}px, ${deltaY}px) scale(${scale})`);
        });
      });
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsMorphing(false);
        setMorphTransform("translate3d(0, 0, 0) scale(1)");
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      // Fallback for when no initial position (shouldn't happen, but handle gracefully)
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
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, initialImagePosition]);

  // Handle smooth image transitions with cross-fade
  useEffect(() => {
    if (!isOpen) return;

    // Only trigger transition if index actually changed
    if (currentIndex === prevIndexRef.current) return;

    // Detect direction based on index change
    const direction =
      currentIndex > prevIndexRef.current
        ? "left"
        : currentIndex < prevIndexRef.current
        ? "right"
        : null;

    if (!direction) return;

    const newImageSrc = images[currentIndex]?.image;
    const previousIndex = prevIndexRef.current;
    
    // Update ref immediately to prevent duplicate transitions
    prevIndexRef.current = currentIndex;
    
    // Check if image is already preloaded
    const isPreloaded = preloadedImagesRef.current.has(newImageSrc);
    
    // Start transition immediately if preloaded, otherwise wait briefly
    const startTransition = () => {
      // Clear any existing timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }

      setSlideDirection(direction);
      setPreviousIndex(previousIndex);
      setIsTransitioning(true);
      setTransitionProgress(0); // Start with previous visible, new hidden
      
      // Use CSS transition timing (250ms) for smooth fade
      // This matches the CSS transition duration exactly
      const duration = 250;

      // Use double RAF to ensure initial state is painted before transition
      // This ensures CSS transition can properly animate the opacity change
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Trigger opacity change - CSS transition will handle smooth fade
          setTransitionProgress(1); // Fade to new image
        });
      });

      // Complete transition after duration (matching CSS transition time)
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
        setSlideDirection(null);
        setPreviousIndex(null);
        setTransitionProgress(0);
      }, duration);
    };

    if (isPreloaded) {
      // Start immediately if preloaded
      requestAnimationFrame(() => {
        requestAnimationFrame(startTransition);
      });
    } else {
      // Wait briefly for image to start loading, but don't block too long
      const checkImageLoad = () => {
        if (imageLoadedRef.current || preloadedImagesRef.current.has(newImageSrc)) {
          requestAnimationFrame(() => {
            requestAnimationFrame(startTransition);
          });
        } else {
          // Don't wait more than 50ms - start transition anyway
          setTimeout(() => {
            requestAnimationFrame(() => {
              requestAnimationFrame(startTransition);
            });
          }, 50);
        }
      };

      requestAnimationFrame(checkImageLoad);
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [currentIndex, isOpen, images]);

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

  // Calculate opacity for cross-fade transition
  // Using CSS transitions for smoother GPU-accelerated animations
  const getImageOpacity = (isCurrent: boolean) => {
    if (!isTransitioning) {
      return isCurrent ? 1 : 0;
    }
    
    // During transition, CSS handles the smooth fade
    // transitionProgress starts at 0, then becomes 1
    // CSS transition animates the opacity change smoothly
    if (isCurrent) {
      // New image: starts at 0, transitions to 1 when progress > 0
      return transitionProgress > 0 ? 1 : 0;
    } else {
      // Previous image: starts at 1, transitions to 0 when progress > 0
      return transitionProgress > 0 ? 0 : 1;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.97)",
        opacity: isOpen ? contentOpacity : 0,
        transition: "opacity 0.15s ease-out",
      }}
      onClick={onClose}
    >
      <div
        ref={contentRef}
        className="lightbox-content flex flex-col items-center gap-[12px] max-w-[90vw] max-h-[90vh] relative"
        style={{
          willChange: isTransitioning || isMorphing ? "transform, opacity" : "auto",
          transform: morphTransform,
          transition: isMorphing
            ? "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full h-auto flex items-center justify-center overflow-hidden"
          style={{
            contain: "layout style paint",
            transform: "translateZ(0)",
            willChange: isTransitioning ? "contents" : "auto",
          }}
        >
          {/* Previous image (during transition) */}
          {previousIndex !== null && isTransitioning && (
            <div
              className="absolute inset-0 flex items-center justify-center p-[12px]"
              style={{
                opacity: getImageOpacity(false),
                willChange: "opacity",
                pointerEvents: "none",
                zIndex: 1,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "translateZ(0)",
                transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Image
                src={images[previousIndex].image}
                alt={images[previousIndex].title}
                width={1200}
                height={1200}
                className="w-auto h-auto max-w-full max-h-[80vh] object-contain"
                style={{
                  pointerEvents: "none",
                  transform: "translateZ(0)",
                }}
              />
            </div>
          )}
          
          {/* Current image */}
          <div
            className="relative p-[12px]"
            style={{
              opacity: getImageOpacity(true),
              willChange: isTransitioning ? "opacity" : "auto",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "translateZ(0)",
              zIndex: 2,
              transition: isTransitioning ? "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            }}
            onClick={(e) => {
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
            onMouseEnter={() => {
              setIsOverImage(true);
              onImageHoverChange?.(true);
            }}
            onMouseLeave={() => {
              setIsOverImage(false);
              onImageHoverChange?.(false);
            }}
            onMouseMove={(e) => {
              // Update cursor based on which side of the image the mouse is over
              const rect = e.currentTarget.getBoundingClientRect();
              const mouseX = e.clientX;
              const imageCenterX = rect.left + rect.width / 2;
              const newSide = mouseX < imageCenterX ? "left" : "right";
              setCursorSide(newSide);
              onCursorSideChange?.(newSide);
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
                pointerEvents: "none",
                transform: "translateZ(0)",
                imageRendering: "high-quality",
              }}
            />
          </div>
        </div>
        <div
          className="flex flex-col gap-[2px] text-[11px] font-medium leading-none tracking-[0.03em] text-center"
          style={{
            opacity: getImageOpacity(true),
            transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: isTransitioning ? "opacity" : "auto",
            transform: "translateZ(0)",
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

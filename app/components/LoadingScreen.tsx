"use client";

import { useEffect, useState, useRef } from "react";
import { edwardianScript } from "../fonts";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const hasStartedRef = useRef(false);

  const firstName = "Malik";
  const lastName = "Laing";
  const firstNameLetters = Array.from(firstName);
  const lastNameLetters = Array.from(lastName);
  const letterDelay = 120; // milliseconds between each letter

  useEffect(() => {
    // Only run once
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Check if mobile or tablet
    const isMobileOrTablet =
      typeof window !== "undefined" && window.innerWidth < 1024;
    const totalLetters = firstNameLetters.length + lastNameLetters.length;

    // If mobile/tablet, show all letters immediately
    if (isMobileOrTablet) {
      setVisibleCount(totalLetters);
      // Start fade-out after a brief pause
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 800);

      // Call onComplete after fade-out completes
      const timer = setTimeout(() => {
        onComplete();
      }, 800 + 500);

      return () => {
        clearTimeout(timer);
        clearTimeout(fadeOutTimer);
      };
    }

    // Desktop: Reveal letters one by one
    let currentIndex = 0;

    const revealNextLetter = () => {
      if (currentIndex < totalLetters) {
        setVisibleCount(currentIndex + 1);
        currentIndex++;
        if (currentIndex < totalLetters) {
          setTimeout(revealNextLetter, letterDelay);
        }
      }
    };

    // Start revealing letters after a brief delay
    const startTimer = setTimeout(revealNextLetter, 200);

    // Start fade-out after all letters are revealed + pause
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, totalLetters * letterDelay + 800);

    // Call onComplete after fade-out completes
    const timer = setTimeout(() => {
      onComplete();
    }, totalLetters * letterDelay + 800 + 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fadeOutTimer);
      clearTimeout(startTimer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-100 bg-white flex items-start justify-start transition-opacity duration-500 ease-in-out ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-[771px] px-8">
        <div className="flex flex-col items-start justify-start gap-0">
          {/* First name */}
          <div className="flex items-center justify-start gap-x-[2px]">
            {firstNameLetters.map((letter, index) => {
              const isVisible = index < visibleCount;

              return (
                <span
                  key={`first-${letter}-${index}`}
                  className="inline-block transition-opacity duration-300 ease-out"
                  style={{
                    fontFamily: edwardianScript.style.fontFamily,
                    fontSize: "clamp(5rem, 20vw, 16rem)",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    letterSpacing: "0",
                    lineHeight: "0.6",
                    color: "transparent",
                    WebkitTextStroke: "1px #0043E0",
                    paintOrder: "stroke fill",
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>
          {/* Last name */}
          <div className="flex items-center justify-start gap-x-[2px]">
            {lastNameLetters.map((letter, index) => {
              const isVisible = index + firstNameLetters.length < visibleCount;

              return (
                <span
                  key={`last-${letter}-${index}`}
                  className="inline-block transition-opacity duration-300 ease-out"
                  style={{
                    fontFamily: edwardianScript.style.fontFamily,
                    fontSize: "clamp(5rem, 20vw, 16rem)",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    letterSpacing: "0",
                    lineHeight: "0.6",
                    color: "transparent",
                    WebkitTextStroke: "1px #0043E0",
                    paintOrder: "stroke fill",
                    opacity: isVisible ? 1 : 0,
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

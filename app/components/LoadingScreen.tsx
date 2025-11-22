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
  const fullName = `${firstName} ${lastName}`;
  const letters = Array.from(fullName);
  const letterDelay = 120; // milliseconds between each letter

  useEffect(() => {
    // Only run once
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Reveal letters one by one
    let currentIndex = 0;

    const revealNextLetter = () => {
      if (currentIndex < letters.length) {
        setVisibleCount(currentIndex + 1);
        currentIndex++;
        if (currentIndex < letters.length) {
          setTimeout(revealNextLetter, letterDelay);
        }
      }
    };

    // Start revealing letters after a brief delay
    const startTimer = setTimeout(revealNextLetter, 200);

    // Start fade-out after all letters are revealed + pause
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, letters.length * letterDelay + 800);

    // Call onComplete after fade-out completes
    const timer = setTimeout(() => {
      onComplete();
    }, letters.length * letterDelay + 800 + 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(fadeOutTimer);
      clearTimeout(startTimer);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-white flex items-center justify-center transition-opacity duration-500 ease-in-out ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-[771px] px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-[2px]">
          {letters.map((letter, index) => {
            const isSpace = letter === " ";
            const isVisible = index < visibleCount;

            return (
              <span
                key={`${letter}-${index}`}
                className="inline-block transition-opacity duration-300 ease-out"
                style={{
                  fontFamily: edwardianScript.style.fontFamily,
                  fontSize: "clamp(2.5rem, 10vw, 8rem)",
                  fontWeight: "bold",
                  fontStyle: "italic",
                  letterSpacing: "0.1em",
                  lineHeight: "0.9",
                  color: "transparent",
                  WebkitTextStroke: "1px #0043E0",
                  WebkitTextStrokeWidth: "1px",
                  WebkitTextStrokeColor: "#0043E0",
                  paintOrder: "stroke fill",
                  textStroke: "1px #0043E0",
                  opacity: isVisible ? 1 : 0,
                  width: isSpace ? "0.3em" : "auto",
                }}
              >
                {isSpace ? "\u00A0" : letter}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

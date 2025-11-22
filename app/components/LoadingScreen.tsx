"use client";

import { useEffect, useState } from "react";
import { edwardianScript } from "../fonts";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  const firstName = "Malik";
  const lastName = "Laing";
  const firstNameLetters = Array.from(firstName);
  const lastNameLetters = Array.from(lastName);

  useEffect(() => {
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
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-100 bg-white flex items-center justify-start transition-opacity duration-500 ease-in-out ${
        isFadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-[771px] px-8">
        <div className="flex flex-col items-start justify-start gap-0">
          {/* First name */}
          <div className="flex items-center justify-start gap-x-[2px]">
            {firstNameLetters.map((letter, index) => {
              return (
                <span
                  key={`first-${letter}-${index}`}
                  className="inline-block"
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
              return (
                <span
                  key={`last-${letter}-${index}`}
                  className="inline-block"
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

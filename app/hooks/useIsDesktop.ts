"use client";

import { useEffect, useState } from "react";

export function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === "undefined") {
      return;
    }

    // Use matchMedia to detect desktop screens (min-width: 1024px)
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    
    // Set initial value
    setIsDesktop(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(e.matches);
    };

    // Modern browsers support addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return isDesktop;
}



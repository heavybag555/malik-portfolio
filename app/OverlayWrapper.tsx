"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Home from "./page";

export default function OverlayWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isInfoPage = pathname === "/info";
  const backgroundContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isInfoPage && backgroundContainerRef.current) {
      // Get saved scroll position from sessionStorage
      const savedScrollPosition = sessionStorage.getItem("homeScrollPosition");
      if (savedScrollPosition) {
        const scrollY = parseInt(savedScrollPosition, 10);
        // Apply scroll position to the background container
        backgroundContainerRef.current.scrollTop = scrollY;
      }
    }
  }, [isInfoPage]);

  if (isInfoPage) {
    return (
      <>
        <div
          ref={backgroundContainerRef}
          className="fixed inset-0 overflow-y-auto pointer-events-none"
          style={{
            willChange: "transform",
          }}
        >
          <div className="pointer-events-none">
            <Home />
          </div>
        </div>
        <div className="relative z-[100]">
          {children}
        </div>
      </>
    );
  }

  return <>{children}</>;
}


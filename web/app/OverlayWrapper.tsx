"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function OverlayWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInfoPage = pathname === "/info";
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [HomeComponent, setHomeComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (!isInfoPage) return;

    // Lightweight placeholder instead of full Home (100 images) for performance
    import("./components/BackgroundPlaceholder").then((module) => {
      setHomeComponent(() => module.default);
      // Restore scroll after placeholder is rendered
      const savedScroll = sessionStorage.getItem("homeScrollPosition");
      if (savedScroll) {
        requestAnimationFrame(() => {
          if (backgroundRef.current) {
            backgroundRef.current.scrollTop = parseInt(savedScroll, 10);
          }
        });
      }
    });
  }, [isInfoPage]);

  if (!isInfoPage) return <>{children}</>;

  return (
    <>
      <div
        ref={backgroundRef}
        className="fixed inset-0 overflow-y-auto pointer-events-none"
      >
        <div className="pointer-events-none">
          {HomeComponent && <HomeComponent />}
        </div>
      </div>
      <div className="relative z-[100]">{children}</div>
    </>
  );
}

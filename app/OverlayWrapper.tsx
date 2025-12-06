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

    // Dynamically import Home to avoid circular dependency
    import("./page").then((module) => setHomeComponent(() => module.default));

    // Restore scroll position
    const savedScroll = sessionStorage.getItem("homeScrollPosition");
    if (savedScroll && backgroundRef.current) {
      backgroundRef.current.scrollTop = parseInt(savedScroll, 10);
    }
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

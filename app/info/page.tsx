"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function Info() {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Check initial scroll state from session storage
  useEffect(() => {
    const saved = sessionStorage.getItem("homeScrollPosition");
    if (saved) {
      const scrollY = parseInt(saved, 10);
      const progress = (scrollY + window.innerHeight) / Math.max(document.documentElement.scrollHeight, window.innerHeight * 2);
      setScrolled(progress > 0.5);
    }
    setLoaded(true);
  }, []);

  // Scroll handler
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const handleScroll = () => {
      const progress = (container.scrollTop + container.clientHeight) / container.scrollHeight;
      setScrolled(progress > 0.5);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main
      ref={mainRef}
      className="fixed inset-0 w-full overflow-y-auto overscroll-contain p-3 pb-12 flex flex-col z-[100]"
      style={{
        backgroundColor: scrolled ? "rgba(0, 67, 224, 0.95)" : "rgba(255, 255, 255, 0.95)",
        transition: "background-color 1.5s ease",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-3">
        <div
          className={`w-full flex items-start gap-2 text-[12px] leading-none tracking-[0.02em] transition-colors duration-300 ${scrolled ? "text-white" : "text-[#0043e0]"}`}
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 1s ease-in-out, color 300ms" }}
        >
          <div className="flex-1">
            <a href="/" className="hover:opacity-60">Malik Laing</a>
          </div>
          <div className="flex-1 flex justify-end gap-3">
            <a href="/#gallery" className="hover:opacity-60">Overview</a>
            <a href="/info" className="hover:opacity-60">Info</a>
            <a href="mailto:Maliklphoto1@gmail.com" className="hover:opacity-60">Contact</a>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ paddingTop: '48px' }} />

      {/* Content */}
      <section className="w-full flex flex-col gap-[156px]">
        <div className="flex flex-col md:flex-row gap-3 items-start">
          {/* Image */}
          <div className="flex-[0.5] w-full md:w-auto overflow-hidden">
            <Image
              src="/malik-info.jpg"
              alt="Malik Laing"
              width={200}
              height={200}
              priority
              className="w-full h-auto transition-all duration-500 ease-out grayscale hover:grayscale-0"
            />
          </div>

          {/* Bio */}
          <div
            className={`flex-1 w-full md:w-auto flex flex-col gap-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] ${scrolled ? "text-white" : "text-[#0043e0]"}`}
            style={{
              opacity: loaded ? 1 : 0,
              transition: "opacity 1s ease-in-out 0.3s, color 1.5s ease",
            }}
          >
            <div className="flex flex-col gap-6">
              <p>
                Malik Laing [b. 2000] is an independent photographer hailing from San Bernardino, California.
              </p>
              <p>
                For years, he has been enveloped in the world of photography, inside and out. His lengthiest project, the community photography space Eclipse is a testament to the communal and personal themes in his work. Some of his material has been publicly featured at the Riverside Art Museum and alongside The Civil Rights Institute of Southern California.
              </p>
              <p>
                <a
                  href="https://www.instagram.com/maliklphoto/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-60"
                >
                  @maliklphoto
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

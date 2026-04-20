"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { timesBoldItalic } from "../fonts";

const BRAND_NAME = "Malik Laing";
const BRAND_SUFFIX = ", 2000";
const CONTACT_EMAIL = "Maliklphoto1@gmail.com";

const PORTRAIT_SRC = "/malik-info.jpg";
const PORTRAIT_ALT = "Malik Laing";

const BIO_PARAGRAPHS = [
  "Malik Laing [b. 2000] is an independent photographer hailing from San Bernardino, California.",
  "For years, he has been enveloped in the world of photography, inside and out. His lengthiest project, the community photography space Eclipse is a testament to the communal and personal themes in his work. Some of his material has been publicly featured at the Riverside Art Museum and alongside The Civil Rights Institute of Southern California.",
];

const INSTAGRAM_HANDLE = "@maliklphoto";
const INSTAGRAM_URL = "https://www.instagram.com/maliklphoto/";

export default function InfoClient() {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("homeScrollPosition");
    if (saved) {
      const scrollY = parseInt(saved, 10);
      const progress =
        (scrollY + window.innerHeight) /
        Math.max(document.documentElement.scrollHeight, window.innerHeight * 2);
      setScrolled(progress > 0.5);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const handleScroll = () => {
      const progress =
        (container.scrollTop + container.clientHeight) / container.scrollHeight;
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
        backgroundColor: scrolled
          ? "rgba(0, 67, 224, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        transition: "background-color 1.5s ease",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <header className="fixed top-0 left-0 right-0 z-50 py-[12px] px-[12px]">
        <div
          className={`w-full flex items-start gap-[8px] text-[12px] leading-none tracking-[0.03em] transition-colors duration-300 ${
            scrolled ? "text-white" : "text-[#0043e0]"
          }`}
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 1s ease-in-out, color 300ms",
          }}
        >
          <div className="flex-1">
            <a href="/" className="hover:opacity-60">
              {BRAND_NAME}
              <span className={timesBoldItalic.className}>{BRAND_SUFFIX}</span>
            </a>
          </div>
          <div className="flex-1 flex justify-end items-start gap-[12px]">
            <a href="/" className="hover:opacity-60">
              Overview
            </a>
            <a href="/info" className="hover:opacity-60">
              Info
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hover:opacity-60"
            >
              Contact
            </a>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div style={{ paddingTop: "48px" }} />

      {/* Content */}
      <section className="w-full flex flex-col gap-[156px]">
        <div className="flex flex-col md:flex-row gap-3 items-start">
          {/* Image */}
          <div className="flex-[0.25] w-full md:w-auto overflow-hidden">
            <Image
              src={PORTRAIT_SRC}
              alt={PORTRAIT_ALT}
              width={600}
              height={600}
              quality={80}
              priority
              sizes="(max-width: 768px) 50vw, 20vw"
              className="w-full h-auto transition-all duration-500 ease-out grayscale hover:grayscale-0"
            />
          </div>

          {/* Bio */}
          <div
            className={`flex-1 w-full md:w-auto flex flex-col gap-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] ${
              scrolled ? "text-white" : "text-[#0043e0]"
            }`}
            style={{
              opacity: loaded ? 1 : 0,
              transition: "opacity 1s ease-in-out 0.3s, color 1.5s ease",
            }}
          >
            <div className="flex flex-col gap-6">
              {BIO_PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-60"
                >
                  {INSTAGRAM_HANDLE}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

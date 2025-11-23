"use client";

import { useEffect, useState } from "react";
import { edwardianScript } from "../fonts";

export default function Info() {
  const [scrolled, setScrolled] = useState(false);
  const [isOverImage, setIsOverImage] = useState(false);
  const [lettersVisible, setLettersVisible] = useState(false);
  const fullText = "Malik Laing";
  const letters = fullText.split("");

  // Trigger letter fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setLettersVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate how close we are to the bottom of the page
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrolledPercentage = (scrollTop + windowHeight) / documentHeight;

      // Change background when 50% through the page
      setScrolled(scrolledPercentage > 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <main
        className={`w-full min-h-screen p-[12px] pb-[48px] flex flex-col gap-[48px] transition-all duration-[1500ms] ${
          scrolled ? "bg-[#0043e0]" : "bg-white"
        } opacity-100 pointer-events-auto`}
        style={{
          transition: "background-color 1500ms",
        }}
      >
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 z-50 py-[4px] px-[12px] backdrop-blur-md">
          <div
            className={`w-full flex items-start gap-[8px] text-[13px] font-medium leading-none tracking-[0.03em] transition-colors duration-300 ${
              isOverImage
                ? "text-white"
                : scrolled
                ? "text-white"
                : "text-[#0043e0]"
            }`}
          >
            <div className="flex-1">
              <a href="/" className="hover:opacity-60">
                M.L.
              </a>
            </div>
            <div className="flex-1 flex justify-between items-start">
              <nav className="flex gap-[12px]">
                <div>
                  <a href="/" className="hover:opacity-60">
                    Overview
                  </a>
                </div>
                <div>
                  <a href="/info" className="hover:opacity-60">
                    Info
                  </a>
                </div>
              </nav>
              <div>
                <a href="mailto:malikphoto1@gmail.com" className="hover:opacity-60">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className="w-full flex flex-col gap-[156px] pt-[400px]">
          <div className="flex flex-col justify-start relative z-10">
            <div className="flex flex-col md:flex-row gap-[10px] items-start">
              {/* Malik Laing container - fills available width */}
              <div className="flex-1 w-full md:w-auto">
                <h1 className="font-bold italic text-[32px] leading-[60%] tracking-[0.0em]">
                  <span
                    style={{
                      fontFamily: edwardianScript.style.fontFamily,
                      color: "white",
                    }}
                  >
                    {letters.map((letter, index) => (
                      <span
                        key={index}
                        style={{
                          opacity: lettersVisible ? 1 : 0,
                          transition: "opacity 1200ms ease-in-out",
                          transitionDelay: lettersVisible ? `${index * 80}ms` : "0ms",
                        }}
                      >
                        {letter === " " ? "\u00A0" : letter}
                      </span>
                    ))}
                  </span>
                </h1>
              </div>

              <div
                className={`flex-1 w-full md:w-auto flex flex-col gap-[12px] text-[13px] font-medium leading-[1.4] tracking-[0.03em] transition-colors duration-[1500ms] ${
                  scrolled ? "text-white" : "text-[#0043e0]"
                }`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-[12px] md:gap-0">
                  <div className="flex-1">
                    <p className="max-w-[400px]">
                      Renell Medrano is a Dominican-American photographer and director from The Bronx, New York, whose work focuses on finding vulnerability in her subjects, drawing inspiration from New York City and her motherland of the Dominican Republic. She graduated from Parsons School of Design | The New School with a degree in Photography. In 2015, she was awarded "New York Times Lens Blog Award" for her photography series 'Untitled Youth', which explored 4 teenage girls living in the Bronx going through adolescence. Her commercial fashion photography has been published in dozens of publications such as Vogue, Elle, Harper's Bazaar, GQ, CR Men, and W.
                    </p>
                  </div>
                  <span className="hidden md:inline">2000</span>
                </div>
                <p className="max-w-[400px]">
                  She has shot campaigns for various brands, including, Burberry, Gucci and Prada. Medrano has had three solo photography exhibitions. Peluca at MILK studios, New York, 2019, Pampara at Gallery Rosenfeld in London in 2020 and Lambon at WSA, New York in 2024. Group shows include 20TK's "The Next Generation of Bronx Photographers," Just Pictures and Aperture Foundation's ground-breaking traveling exhibition, the New Black Vanguard: Photography between Art and Fashion.
                </p>
                <span className="md:hidden">2000</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}


"use client";

import Image from "next/image";
import ArrowUpRight from "../components/ArrowUpRight";

const CONTACT_EMAIL = "maliklphoto1@gmail.com";
const TAGLINE_LEAD = "Photographer and director from";
const TAGLINE_ACCENT = "San Bernardino, California.";

const PORTRAIT_SRC = "/malik-info.jpg";
const PORTRAIT_ALT = "Malik Laing";

const BIO_PARAGRAPHS = [
  "Malik Laing [b. 2000] is an independent photographer hailing from San Bernardino, California.",
  "For years, he has been enveloped in the world of photography, inside and out. His lengthiest project, the community photography space Eclipse is a testament to the communal and personal themes in his work. Some of his material has been publicly featured at the Riverside Art Museum and alongside The Civil Rights Institute of Southern California.",
];

const INSTAGRAM_HANDLE = "@maliklphoto";
const INSTAGRAM_URL = "https://www.instagram.com/maliklphoto/";

export default function InfoClient() {
  return (
    <main className="relative min-h-screen w-full bg-white lg:fixed lg:inset-0 lg:h-full lg:min-h-0 lg:overflow-hidden">
      {/* Bio — flows in document on mobile/tablet, absolute on desktop */}
      <div className="relative z-40 px-[20px] pt-[72px] lg:absolute lg:top-0 lg:left-0 lg:right-0 lg:pt-[60px]">
        <div className="w-full grid grid-cols-6 gap-x-[20px] items-start">
          <div className="text-5 col-span-6 md:col-span-4 lg:col-start-1 lg:col-span-3 flex flex-col gap-6 text-black">
            {BIO_PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Portrait + contact — mobile/tablet only (desktop renders these inside the fixed footer) */}
      <div className="px-[20px] pt-[48px] pb-[96px] lg:hidden">
        <div className="grid grid-cols-6 gap-x-[20px] items-end">
          <div className="col-span-3 md:col-span-2">
            <Image
              src={PORTRAIT_SRC}
              alt={PORTRAIT_ALT}
              width={600}
              height={600}
              quality={80}
              priority
              sizes="(max-width: 768px) 50vw, 33vw"
              className="block w-full h-auto"
            />
          </div>
          <div className="text-3 col-span-3 md:col-span-2 md:col-start-3 flex flex-col gap-[6px] text-black">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[4px] hover:opacity-60"
            >
              {INSTAGRAM_HANDLE}
              <ArrowUpRight className="text-[#ACACAC]" />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-[4px] hover:opacity-60"
            >
              {CONTACT_EMAIL}
              <ArrowUpRight className="text-[#ACACAC]" />
            </a>
          </div>
        </div>
      </div>

      {/* Desktop Footer — unchanged */}
      <footer className="hidden lg:block fixed bottom-0 left-0 right-0 z-50 px-[20px] py-[20px] pointer-events-none">
        <div className="text-3 w-full grid grid-cols-6 gap-x-[20px] items-end">
          <div className="col-start-1 pointer-events-auto mix-blend-difference text-white">
            {TAGLINE_LEAD}
            <br />
            <span className="text-4">{TAGLINE_ACCENT}</span>
          </div>
          <div className="col-start-4 pointer-events-auto">
            <Image
              src={PORTRAIT_SRC}
              alt={PORTRAIT_ALT}
              width={600}
              height={600}
              quality={80}
              priority
              sizes="(max-width: 768px) 50vw, 17vw"
              className="block w-full h-auto"
            />
          </div>
          <div className="col-start-5 pointer-events-auto text-black flex flex-col">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[4px] hover:opacity-60"
            >
              {INSTAGRAM_HANDLE}
              <ArrowUpRight className="text-[#ACACAC]" />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-[4px] hover:opacity-60"
            >
              {CONTACT_EMAIL}
              <ArrowUpRight className="text-[#ACACAC]" />
            </a>
          </div>
          <div className="col-start-6 flex justify-end pointer-events-auto mix-blend-difference text-white">
            © 2026
          </div>
        </div>
      </footer>

      {/* Mobile/tablet Footer — fixed tagline + © only */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-[20px] py-[20px] pointer-events-none">
        <div className="text-3 w-full flex items-end justify-between gap-[20px]">
          <div className="pointer-events-auto mix-blend-difference text-white">
            {TAGLINE_LEAD}
            <br />
            <span className="text-4">{TAGLINE_ACCENT}</span>
          </div>
          <div className="pointer-events-auto mix-blend-difference text-white">
            © 2026
          </div>
        </div>
      </footer>
    </main>
  );
}

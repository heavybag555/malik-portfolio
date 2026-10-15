"use client";

import Image from "next/image";
import ArrowUpRight from "../components/ArrowUpRight";

interface InfoClientProps {
  portraitUrl: string | null;
  portraitAlt: string;
  portraitWidth?: number;
  portraitHeight?: number;
  bioParagraphs: string[];
  instagramHandle: string;
  instagramUrl: string;
  contactEmail: string;
  copyrightText: string;
}

export default function InfoClient({
  portraitUrl,
  portraitAlt,
  portraitWidth,
  portraitHeight,
  bioParagraphs,
  instagramHandle,
  instagramUrl,
  contactEmail,
  copyrightText,
}: InfoClientProps) {
  return (
    <>
      <main className="fixed inset-0 h-full w-full overflow-hidden bg-white">
        {/* Bio — flows in document on mobile/tablet, absolute on desktop */}
        <div className="relative z-40 px-[20px] pt-[72px] lg:absolute lg:top-0 lg:left-0 lg:right-0 lg:pt-[60px]">
          <div className="w-full grid grid-cols-6 gap-x-[20px] items-start">
            <div className="text-5 col-span-6 md:col-span-4 lg:col-start-1 lg:col-span-3 flex flex-col gap-6 text-black">
              {bioParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Portrait + contact — mobile/tablet only (desktop renders these inside the fixed footer) */}
        <div className="px-[20px] pt-[48px] pb-[96px] lg:hidden">
          <div className="grid grid-cols-6 gap-x-[20px] items-end">
            <div className="col-span-3 md:col-span-2">
              {portraitUrl && (
                <Image
                  src={portraitUrl}
                  alt={portraitAlt}
                  width={portraitWidth ?? 600}
                  height={portraitHeight ?? 600}
                  quality={80}
                  priority
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="block w-full h-auto"
                />
              )}
            </div>
            <div className="text-3 col-span-3 md:col-span-2 md:col-start-3 flex flex-col gap-[6px] text-black">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[4px] hover:opacity-60"
              >
                {instagramHandle}
                <ArrowUpRight className="text-[#ACACAC]" />
              </a>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-[4px] hover:opacity-60"
              >
                {contactEmail}
                <ArrowUpRight className="text-[#ACACAC]" />
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Desktop Footer — lifted out of <main> so mix-blend-difference composites correctly */}
      <footer className="hidden lg:block fixed bottom-0 left-0 right-0 z-[60] px-[20px] py-[20px] pointer-events-none">
        <div className="text-3 w-full grid grid-cols-6 gap-x-[20px] items-end">
          <div className="col-start-4 pointer-events-auto">
            {portraitUrl && (
              <Image
                src={portraitUrl}
                alt={portraitAlt}
                width={portraitWidth ?? 600}
                height={portraitHeight ?? 600}
                quality={80}
                priority
                sizes="(max-width: 768px) 50vw, 17vw"
                className="block w-full h-auto"
              />
            )}
          </div>
          <div className="col-start-5 pointer-events-auto text-black flex flex-col">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-[4px] hover:opacity-60"
            >
              {instagramHandle}
              <ArrowUpRight className="text-[#ACACAC]" />
            </a>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-[4px] hover:opacity-60"
            >
              {contactEmail}
              <ArrowUpRight className="text-[#ACACAC]" />
            </a>
          </div>
          <div className="col-start-6 flex justify-end pointer-events-auto mix-blend-difference text-white">
            {copyrightText}
          </div>
        </div>
      </footer>

      {/* Mobile/tablet Footer — lifted out of <main> so mix-blend-difference composites correctly */}
      <footer className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] px-[20px] py-[20px] pointer-events-none">
        <div className="text-3 w-full grid grid-cols-2 gap-x-[20px] items-end">
          <div className="col-start-2 flex justify-end pointer-events-auto mix-blend-difference text-white">
            {copyrightText}
          </div>
        </div>
      </footer>
    </>
  );
}

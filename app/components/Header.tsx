"use client";

import Link from "next/link";
import { timesBoldItalic } from "../fonts";

interface HeaderProps {
  scrolled: boolean;
  onOverviewClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  showYear?: boolean;
}

export default function Header({ scrolled, onOverviewClick, showYear = true }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-3">
      <nav
        className="flex items-start text-xs leading-none tracking-wide"
        style={{ color: scrolled ? "#fff" : "#0043e0" }}
      >
        <Link href="/" className="flex-1 hover:opacity-60 transition-opacity">
          Malik Laing
          {showYear && (
            <span className={timesBoldItalic.className}>
              , 2000
            </span>
          )}
        </Link>
        <div className="flex gap-3">
          {onOverviewClick ? (
            <a href="#overview" onClick={onOverviewClick} className="hover:opacity-60 transition-opacity">
              Overview
            </a>
          ) : (
            <Link href="/#overview" className="hover:opacity-60 transition-opacity">
              Overview
            </Link>
          )}
          <Link href="/info" className="hover:opacity-60 transition-opacity">
            Info
          </Link>
          <a href="mailto:Maliklphoto1@gmail.com" className="hover:opacity-60 transition-opacity">
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}


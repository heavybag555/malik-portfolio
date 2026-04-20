"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import ArrowUpRight from "./ArrowUpRight";

const BRAND_NAME = "Malik Laing";
const BRAND_SUFFIX = ", 2000";
const CONTACT_EMAIL = "maliklphoto1@gmail.com";

const NAV_ITEMS: Array<{ href: string; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/info", label: "Info" },
];

const ACTIVE_COLOR = "text-white";
const INACTIVE_COLOR = "text-[#ACACAC]";

const subscribeNoop = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function rememberHomeScroll(href: string) {
  if (typeof window === "undefined") return;
  if (href !== "/info") return;
  sessionStorage.setItem("homeScrollPosition", window.scrollY.toString());
}

export default function SiteNav() {
  const pathname = usePathname() || "/";
  const mounted = useIsMounted();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const close = () => setOpen(false);

  const overlay = (
    <div
      id="mobile-menu-overlay"
      aria-hidden={!open}
      className="md:hidden fixed top-0 left-0 right-0 z-[120] overflow-hidden transition-[height] duration-300 ease-out"
      style={{
        height: open ? "50vh" : "0vh",
        backgroundColor: "#0043e0",
        pointerEvents: open ? "auto" : "none",
        isolation: "isolate",
        mixBlendMode: "normal",
      }}
    >
      <div className="relative h-full w-full" style={{ color: "#fff" }}>
        <button
          type="button"
          onClick={close}
          className="text-3 absolute top-[20px] right-[20px] hover:opacity-60"
        >
          Close
        </button>
        <div className="h-full w-full flex flex-col justify-end px-[20px] pb-[24px] text-5 gap-[4px]">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  rememberHomeScroll(item.href);
                  close();
                }}
                className="hover:opacity-60"
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            onClick={close}
            className="hover:opacity-60"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[110] px-[20px] py-[20px] mix-blend-difference text-white pointer-events-none">
        <div className="text-3 w-full flex items-start justify-between gap-[12px] md:grid md:grid-cols-6 md:gap-x-[20px]">
          <div className="md:col-start-1 pointer-events-auto">
            <Link href="/" className="hover:opacity-60">
              {BRAND_NAME}
              <span className="text-4">{BRAND_SUFFIX}</span>
            </Link>
          </div>

          <div className="hidden md:flex md:col-start-4 items-start gap-[12px] pointer-events-auto">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch
                  onClick={() => rememberHomeScroll(item.href)}
                  className={`${active ? ACTIVE_COLOR : INACTIVE_COLOR} hover:opacity-60`}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex md:col-start-6 justify-end pointer-events-auto">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-[4px] hover:opacity-60"
            >
              Contact
              <ArrowUpRight />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu-overlay"
            className="md:hidden hover:opacity-60 pointer-events-auto"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {mounted && createPortal(overlay, document.body)}
    </>
  );
}

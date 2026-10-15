"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { normalizeCssColor, opaqueHex } from "./edgeColor";
import { PAGE_BACKGROUND } from "../theme-color";

const TOP_VAR = "--edge-top-background";
const BOTTOM_VAR = "--edge-bottom-background";

/**
 * Matches the color behind mobile Safari's status bar and bottom toolbar to
 * the visible top and bottom edges of the current route. Each page paints
 * `--background`; overlays such as the mobile menu contribute their own
 * background when they cover an edge. One sample is written to the strips,
 * the document backgrounds, and the theme-color meta tag.
 */
export default function SafariEdgeBackground() {
  const pathname = usePathname() || "/";

  useLayoutEffect(() => {
    const root = document.documentElement;
    const { body } = document;

    const previous = {
      top: root.style.getPropertyValue(TOP_VAR),
      bottom: root.style.getPropertyValue(BOTTOM_VAR),
      htmlBg: root.style.backgroundColor,
      bodyBg: body.style.backgroundColor,
    };

    const existingMeta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    const createdMeta = !existingMeta;
    const meta = existingMeta ?? document.createElement("meta");
    if (createdMeta) {
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    const previousTheme = createdMeta ? null : meta.getAttribute("content");

    let frame = 0;
    let applying = false;
    const timeouts: number[] = [];

    const themeBackground = () => {
      const raw = getComputedStyle(root).getPropertyValue("--background").trim();
      return normalizeCssColor(raw) || PAGE_BACKGROUND;
    };

    const readEdge = (x: number, y: number, fallback: string) => {
      let stack: Element[] = [];
      try {
        stack = document.elementsFromPoint(x, y);
      } catch {
        return fallback;
      }

      const layers: string[] = [];
      for (const el of stack) {
        if (el === root || el === body) continue;
        if (el.closest(".edge-top, .edge-bottom")) continue;
        const style = getComputedStyle(el);
        if (Number.parseFloat(style.opacity) === 0) continue;
        layers.push(style.backgroundColor);
      }
      return opaqueHex(layers, fallback);
    };

    const samplePoints = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (width <= 0 || height <= 0) return null;
      const viewport = window.visualViewport;
      const offsetTop = viewport?.offsetTop ?? 0;
      const offsetLeft = viewport?.offsetLeft ?? 0;
      const visibleWidth = viewport?.width ?? width;
      const visibleHeight = viewport?.height ?? height;
      return {
        x: clamp(offsetLeft + visibleWidth / 2, 0, width - 1),
        top: clamp(offsetTop + 1, 0, height - 1),
        bottom: clamp(offsetTop + visibleHeight - 2, 0, height - 1),
      };
    };

    const sync = () => {
      if (applying) return;
      const fallback = themeBackground();
      const points = samplePoints();
      const top = points ? readEdge(points.x, points.top, fallback) : fallback;
      const bottom = points
        ? readEdge(points.x, points.bottom, fallback)
        : fallback;

      if (
        normalizeCssColor(root.style.getPropertyValue(TOP_VAR)) === top &&
        normalizeCssColor(root.style.getPropertyValue(BOTTOM_VAR)) === bottom &&
        normalizeCssColor(root.style.backgroundColor) === top &&
        normalizeCssColor(body.style.backgroundColor) === bottom &&
        normalizeCssColor(meta.getAttribute("content") ?? "") === top
      ) {
        return;
      }

      applying = true;
      try {
        root.style.setProperty(TOP_VAR, top);
        root.style.setProperty(BOTTOM_VAR, bottom);
        root.style.backgroundColor = top;
        body.style.backgroundColor = bottom;
        meta.setAttribute("content", top);
      } finally {
        applying = false;
      }
    };

    let transitionDepth = 0;
    let transitionFrames = 0;

    const schedule = () => {
      if (applying || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        sync();
        if (transitionDepth > 0 && transitionFrames < 45) {
          transitionFrames += 1;
          schedule();
        }
      });
    };

    const onTransitionRun = () => {
      transitionDepth += 1;
      transitionFrames = 0;
      schedule();
    };
    const onTransitionDone = () => {
      transitionDepth = Math.max(0, transitionDepth - 1);
      schedule();
    };

    const later = (ms: number) => {
      const id = window.setTimeout(() => {
        sync();
      }, ms);
      timeouts.push(id);
    };

    sync();
    later(0);
    later(50);

    const onVisible = () => {
      if (document.visibilityState === "visible") schedule();
    };

    window.addEventListener("scroll", schedule, { capture: true, passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    window.addEventListener("pageshow", schedule);
    window.addEventListener("popstate", schedule);
    document.addEventListener("visibilitychange", onVisible);
    window.visualViewport?.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("scroll", schedule);
    document.addEventListener("transitionrun", onTransitionRun, true);
    document.addEventListener("transitionend", onTransitionDone, true);
    document.addEventListener("transitioncancel", onTransitionDone, true);

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(root);

    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    mutationObserver.observe(document.head, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["content"],
    });

    return () => {
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
      window.removeEventListener("pageshow", schedule);
      window.removeEventListener("popstate", schedule);
      document.removeEventListener("visibilitychange", onVisible);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
      document.removeEventListener("transitionrun", onTransitionRun, true);
      document.removeEventListener("transitionend", onTransitionDone, true);
      document.removeEventListener("transitioncancel", onTransitionDone, true);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      timeouts.forEach((id) => window.clearTimeout(id));

      if (previous.top) root.style.setProperty(TOP_VAR, previous.top);
      else root.style.removeProperty(TOP_VAR);
      if (previous.bottom) root.style.setProperty(BOTTOM_VAR, previous.bottom);
      else root.style.removeProperty(BOTTOM_VAR);
      root.style.backgroundColor = previous.htmlBg;
      body.style.backgroundColor = previous.bodyBg;
      if (createdMeta) meta.remove();
      else if (previousTheme != null) meta.setAttribute("content", previousTheme);
    };
  }, [pathname]);

  return (
    <>
      <div className="edge-top" aria-hidden="true" />
      <div className="edge-bottom" aria-hidden="true" />
    </>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

"use client";

import { useSyncExternalStore } from "react";

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function snapshot() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

export function useIsDesktop(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}

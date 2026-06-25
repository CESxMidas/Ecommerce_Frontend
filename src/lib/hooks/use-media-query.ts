"use client";

import { useSyncExternalStore } from "react";

function subscribeMediaQuery(query: string, callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

/**
 * SSR-safe media query — server + hydration dùng `fallback`, sau đó sync client.
 */
export function useMediaQuery(query: string, fallback = false) {
  return useSyncExternalStore(
    (callback) => subscribeMediaQuery(query, callback),
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

/** Tablet trở lên (≥768px) — đủ chỗ cho modal xem nhanh */
export function useCanQuickView() {
  return useMediaQuery("(min-width: 768px)");
}

/** Desktop có chuột — hiện nút overlay khi hover */
export function useCanHover() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

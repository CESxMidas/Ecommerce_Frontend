"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string, defaultValue = false) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return defaultValue;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Tablet trở lên (≥768px) — đủ chỗ cho modal xem nhanh */
export function useCanQuickView() {
  return useMediaQuery("(min-width: 768px)");
}

/** Desktop có chuột — hiện nút overlay khi hover */
export function useCanHover() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

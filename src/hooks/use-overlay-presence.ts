"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION = 300;

export function useOverlayPresence(open: boolean, duration = DEFAULT_DURATION) {
  const [mounted, setMounted] = useState(open);
  const [active, setActive] = useState(open);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      if (closeTimerRef.current != null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }

      setMounted(true);

      const enterTimer = window.setTimeout(() => {
        setActive(true);
      }, 16);

      return () => {
        window.clearTimeout(enterTimer);
      };
    }

    setActive(false);

    closeTimerRef.current = window.setTimeout(() => {
      setMounted(false);
      closeTimerRef.current = null;
    }, duration);

    return () => {
      if (closeTimerRef.current != null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [open, duration]);

  useEffect(() => {
    if (!open || active) return;

    const fallbackTimer = window.setTimeout(() => {
      setActive(true);
    }, 80);

    return () => window.clearTimeout(fallbackTimer);
  }, [open, active]);

  return { mounted, active };
}

let overlayLockCount = 0;

export function useOverlayLock(shouldLock: boolean) {
  useEffect(() => {
    if (!shouldLock) return;

    overlayLockCount += 1;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      overlayLockCount = Math.max(0, overlayLockCount - 1);

      if (overlayLockCount === 0) {
        document.body.style.overflow = previousOverflow || "";
      }
    };
  }, [shouldLock]);
}

export function useOverlayEscape(shouldListen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!shouldListen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shouldListen, onClose]);
}

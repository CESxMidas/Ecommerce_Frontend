"use client";

import { useEffect, useRef, useState } from "react";

import { lockBodyScroll } from "@/lib/utils/body-scroll-lock";

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
let overlayUnlock: (() => void) | null = null;

export function useOverlayLock(shouldLock: boolean) {
  useEffect(() => {
    if (!shouldLock) return;

    overlayLockCount += 1;

    if (overlayLockCount === 1) {
      overlayUnlock = lockBodyScroll();
    }

    return () => {
      overlayLockCount = Math.max(0, overlayLockCount - 1);

      if (overlayLockCount === 0 && overlayUnlock) {
        overlayUnlock();
        overlayUnlock = null;
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

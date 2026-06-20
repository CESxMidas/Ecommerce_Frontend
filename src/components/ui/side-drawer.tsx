"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

type SideDrawerProps = {
  open: boolean;
  onClose: () => void;
  anchor?: "left" | "right";
  className?: string;
  children: React.ReactNode;
};

export default function SideDrawer({
  open,
  onClose,
  anchor = "left",
  className,
  children,
}: SideDrawerProps) {
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!portalReady || !open) {
    return null;
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[1200] min-h-screen animate-fade-in bg-keyshop-bg/70 backdrop-blur-[2px] motion-reduce:animate-none"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "keyshop-scrollbar fixed inset-y-0 z-[1201] max-h-screen overflow-y-auto shadow-2xl",
          anchor === "left"
            ? "left-0 w-[min(320px,100vw)] animate-slide-in-left bg-keyshop-soft motion-reduce:animate-none"
            : "right-0 w-[min(580px,100vw)] animate-slide-in-right bg-keyshop-bg motion-reduce:animate-none",
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

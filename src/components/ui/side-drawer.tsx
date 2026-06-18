"use client";

import { useEffect } from "react";

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

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[1200] bg-keyshop-bg/70 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "fixed top-0 z-[1201] h-screen max-w-full overflow-y-auto bg-[#071739] transition-transform duration-300",
          anchor === "left"
            ? "left-0 w-[min(320px,100vw)]"
            : "right-0 w-[min(580px,100vw)] bg-keyshop-bg",
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>
  );
}

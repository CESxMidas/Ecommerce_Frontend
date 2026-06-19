"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import {
  useOverlayEscape,
  useOverlayLock,
  useOverlayPresence,
} from "@/hooks/use-overlay-presence";
import {
  overlayDialogPanelClass,
  overlayModalBackdropClass,
  overlayModalPanelClass,
} from "@/lib/utils/overlay-motion";
import { cn } from "@/lib/utils";

type OverlayModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  variant?: "modal" | "dialog";
  ariaLabel?: string;
};

export default function OverlayModal({
  open,
  onClose,
  children,
  className,
  panelClassName,
  variant = "modal",
  ariaLabel,
}: OverlayModalProps) {
  const [portalReady, setPortalReady] = useState(false);
  const { mounted, active } = useOverlayPresence(open);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useOverlayLock(open && active);
  useOverlayEscape(open, onClose);

  if (!portalReady || !mounted) {
    return null;
  }

  const panelClass =
    variant === "dialog"
      ? overlayDialogPanelClass(active, panelClassName)
      : overlayModalPanelClass(active, panelClassName);

  return createPortal(
    <div
      className={cn(overlayModalBackdropClass(active), className)}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div className={panelClass} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

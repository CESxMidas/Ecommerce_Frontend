"use client";

import { Copy, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import OverlayModal from "@/components/ui/overlay-modal";
import type { PlacedOrder } from "@/types/cart";
import { cn } from "@/lib/utils";

type LicenseKeyModalProps = {
  open: boolean;
  order: PlacedOrder | null;
  onClose: () => void;
};

const actionBtnClass =
  "inline-flex min-h-[42px] items-center justify-center gap-2 rounded-control px-4 text-xs font-extrabold uppercase tracking-wide transition";

function collectLicenseKeys(order: PlacedOrder | null) {
  if (!order?.items?.length || order.paymentStatus !== "paid") {
    return [];
  }

  return order.items.flatMap((item) =>
    (item.licenseKeys || []).map((key) => ({
      key,
      productName: item.product?.name || item.product?.title || "Product",
    })),
  );
}

export default function LicenseKeyModal({
  open,
  order,
  onClose,
}: LicenseKeyModalProps) {
  const [displayOrder, setDisplayOrder] = useState<PlacedOrder | null>(order);

  useEffect(() => {
    if (order) {
      setDisplayOrder(order);
      return;
    }

    if (!open) {
      const timer = window.setTimeout(() => setDisplayOrder(null), 300);
      return () => window.clearTimeout(timer);
    }
  }, [order, open]);

  if (!displayOrder) {
    return null;
  }

  const keys = collectLicenseKeys(displayOrder);

  const copyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy key");
    }
  };

  return (
    <OverlayModal
      open={open}
      onClose={onClose}
      variant="dialog"
      panelClassName="max-w-lg p-6 md:p-7"
      ariaLabel="Your license keys"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Your license keys</h2>
          <p className="mt-1 text-sm text-keyshop-muted">
            Order #{displayOrder.id} — copy each key below.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-control p-2 text-keyshop-muted transition hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {keys.length === 0 ? (
        <p className="text-sm text-keyshop-muted">No keys found for this order.</p>
      ) : (
        <ul className="space-y-3">
          {keys.map((entry) => (
            <li
              key={entry.key}
              className="rounded-card border border-keyshop-line bg-white/[0.03] p-4"
            >
              <p className="text-sm font-bold text-white">{entry.productName}</p>
              <code className="mt-2 block break-all rounded-control border border-keyshop-line bg-black/30 px-3 py-2.5 text-sm text-sky-200">
                {entry.key}
              </code>
              <button
                type="button"
                className={cn(
                  actionBtnClass,
                  "keyshop-interactive mt-3 border border-keyshop-line bg-white/[0.03] text-white hover:border-keyshop-blue/40",
                )}
                onClick={() => copyKey(entry.key)}
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        className={cn(
          actionBtnClass,
          "keyshop-interactive mt-6 w-full bg-gradient-to-br from-keyshop-blue-hover to-keyshop-blue text-white hover:-translate-y-0.5 hover:shadow-glow",
        )}
        onClick={onClose}
      >
        Done
      </button>
    </OverlayModal>
  );
}

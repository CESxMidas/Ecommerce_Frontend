"use client";

import { Copy, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PlacedOrder } from "@/types/cart";

type LicenseKeyModalProps = {
  open: boolean;
  order: PlacedOrder | null;
  onClose: () => void;
};

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
  if (!open || !order) {
    return null;
  }

  const keys = collectLicenseKeys(order);

  const copyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Your license key</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Order #{order.id} — copy the key below.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {keys.length === 0 ? (
          <p className="text-sm text-muted-foreground">No keys found for this order.</p>
        ) : (
          <ul className="space-y-3">
            {keys.map((entry) => (
              <li
                key={entry.key}
                className="rounded-xl border border-border bg-background/60 p-4"
              >
                <p className="text-sm font-medium">{entry.productName}</p>
                <code className="mt-2 block break-all rounded-lg bg-secondary px-3 py-2 text-sm">
                  {entry.key}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => copyKey(entry.key)}
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </li>
            ))}
          </ul>
        )}

        <Button type="button" className="mt-6 w-full" onClick={onClose}>
          Done
        </Button>
      </div>
    </div>
  );
}

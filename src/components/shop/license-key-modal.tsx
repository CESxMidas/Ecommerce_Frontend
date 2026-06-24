"use client";

import { Copy, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import OverlayModal from "@/components/ui/overlay-modal";
import type { AccountCredential, PlacedOrder } from "@/types/cart";
import { cn } from "@/lib/utils";

type LicenseKeyModalProps = {
  open: boolean;
  order: PlacedOrder | null;
  onClose: () => void;
};

const actionBtnClass =
  "inline-flex min-h-[42px] items-center justify-center gap-2 rounded-control px-4 text-xs font-extrabold uppercase tracking-wide transition";

type KeyEntry = {
  key: string;
  productName: string;
};

type AccountEntry = AccountCredential & {
  productName: string;
};

function collectLicenseKeys(order: PlacedOrder | null): KeyEntry[] {
  if (!order?.items?.length || order.paymentStatus !== "paid") {
    return [];
  }

  return order.items.flatMap((item) =>
    (item.licenseKeys || []).map((key) => ({
      key,
      productName: item.product?.name || item.product?.title || "Sản phẩm",
    })),
  );
}

function collectAccountCredentials(order: PlacedOrder | null): AccountEntry[] {
  if (!order?.items?.length || order.paymentStatus !== "paid") {
    return [];
  }

  return order.items.flatMap((item) =>
    (item.accountCredentials || []).map((credential) => ({
      ...credential,
      productName: item.product?.name || item.product?.title || "Sản phẩm",
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
  const accounts = collectAccountCredentials(displayOrder);
  const hasKeys = keys.length > 0;
  const hasAccounts = accounts.length > 0;

  const copyText = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`Đã sao chép ${label}`);
    } catch {
      toast.error(`Không thể sao chép ${label}`);
    }
  };

  const modalTitle = hasKeys && hasAccounts
    ? "Sản phẩm số của bạn"
    : hasAccounts
      ? "Tài khoản Premium"
      : "Key bản quyền";

  return (
    <OverlayModal
      open={open}
      onClose={onClose}
      variant="dialog"
      panelClassName="max-w-lg p-6 md:p-7"
      ariaLabel={modalTitle}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white">{modalTitle}</h2>
          <p className="mt-1 text-sm text-keyshop-muted">
            Đơn #{displayOrder.id} — sao chép thông tin bên dưới.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="flex h-11 w-11 items-center justify-center rounded-control text-keyshop-muted transition hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {!hasKeys && !hasAccounts ? (
        <p className="text-sm text-keyshop-muted">Không tìm thấy sản phẩm số cho đơn này.</p>
      ) : (
        <div className="space-y-6">
          {hasKeys ? (
            <div className="space-y-3">
              {hasAccounts ? (
                <h3 className="text-sm font-bold uppercase tracking-wide text-keyshop-muted">
                  Mã bản quyền
                </h3>
              ) : null}
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
                      onClick={() => copyText(entry.key, "key")}
                    >
                      <Copy className="h-4 w-4" />
                      Sao chép key
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {hasAccounts ? (
            <div className="space-y-3">
              {hasKeys ? (
                <h3 className="text-sm font-bold uppercase tracking-wide text-keyshop-muted">
                  Tài khoản Premium
                </h3>
              ) : null}
              <ul className="space-y-3">
                {accounts.map((entry, index) => (
                  <li
                    key={`${entry.username}-${index}`}
                    className="rounded-card border border-keyshop-line bg-white/[0.03] p-4"
                  >
                    <p className="text-sm font-bold text-white">{entry.productName}</p>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="rounded-control border border-keyshop-line bg-black/30 px-3 py-2.5">
                        <p className="text-xs uppercase text-keyshop-muted">Email / Username</p>
                        <code className="mt-1 block break-all text-sky-200">{entry.username}</code>
                      </div>
                      <div className="rounded-control border border-keyshop-line bg-black/30 px-3 py-2.5">
                        <p className="text-xs uppercase text-keyshop-muted">Mật khẩu</p>
                        <code className="mt-1 block break-all text-sky-200">{entry.password}</code>
                      </div>
                      {entry.note ? (
                        <p className="text-xs text-keyshop-muted">Ghi chú: {entry.note}</p>
                      ) : null}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className={cn(
                          actionBtnClass,
                          "keyshop-interactive border border-keyshop-line bg-white/[0.03] text-white hover:border-keyshop-blue/40",
                        )}
                        onClick={() => copyText(entry.username, "email")}
                      >
                        <Copy className="h-4 w-4" />
                        Email
                      </button>
                      <button
                        type="button"
                        className={cn(
                          actionBtnClass,
                          "keyshop-interactive border border-keyshop-line bg-white/[0.03] text-white hover:border-keyshop-blue/40",
                        )}
                        onClick={() => copyText(entry.password, "mật khẩu")}
                      >
                        <Copy className="h-4 w-4" />
                        Mật khẩu
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      <button
        type="button"
        className={cn(
          actionBtnClass,
          "keyshop-interactive mt-6 w-full bg-gradient-to-br from-keyshop-blue-hover to-keyshop-blue text-white hover:-translate-y-0.5 hover:shadow-glow",
        )}
        onClick={onClose}
      >
        Hoàn tất
      </button>
    </OverlayModal>
  );
}

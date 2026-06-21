import { Bolt, CreditCard, KeyRound, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";

const signals = [
  { icon: Bolt, label: "Giao key tức thì" },
  { icon: KeyRound, label: "Bản quyền chính hãng" },
  { icon: ShieldCheck, label: "Thanh toán bảo mật" },
  { icon: CreditCard, label: "VNPay & COD" },
] as const;

type TrustSignalsProps = {
  className?: string;
  compact?: boolean;
};

export function TrustSignals({ className, compact }: TrustSignalsProps) {
  return (
    <ul
      className={cn(
        "grid gap-3",
        compact ? "grid-cols-2 sm:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
      aria-label="Cam kết dịch vụ"
    >
      {signals.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex items-center gap-2.5 rounded-control border border-keyshop-line bg-white/[0.03] px-3 py-2.5 text-xs text-keyshop-muted"
        >
          <Icon className="h-4 w-4 shrink-0 text-keyshop-blue" aria-hidden />
          <span className="font-medium text-white/85">{label}</span>
        </li>
      ))}
    </ul>
  );
}

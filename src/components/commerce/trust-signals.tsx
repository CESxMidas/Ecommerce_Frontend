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
        "grid w-full min-w-0 gap-3",
        compact
          ? "grid-cols-2"
          : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
      aria-label="Cam kết dịch vụ"
    >
      {signals.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className={cn(
            "flex min-w-0 items-start gap-2 rounded-control border border-keyshop-line bg-white/[0.03] py-2.5 text-xs text-keyshop-muted",
            compact ? "px-2.5" : "px-3",
          )}
        >
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-keyshop-blue" aria-hidden />
          <span className="min-w-0 flex-1 font-medium leading-snug text-white/85">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}

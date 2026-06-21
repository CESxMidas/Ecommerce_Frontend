import { cn } from "@/lib/utils";

/** Primary checkout / conversion CTA — dùng cho cart, checkout, empty states */
export const checkoutCtaClass =
  "keyshop-interactive flex h-[58px] w-full cursor-pointer items-center justify-center rounded-control bg-gradient-to-br from-keyshop-blue-hover to-keyshop-blue text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-glow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-keyshop-blue/30 motion-reduce:hover:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none";

export const checkoutCtaCompactClass = cn(checkoutCtaClass, "h-[52px]");

/** Form field — thống nhất commerce, checkout, account */
export const fieldClass =
  "h-auto w-full rounded-control border border-keyshop-line bg-white/[0.03] px-[18px] py-4 text-[15px] text-white outline-none placeholder:text-white/30 focus:border-keyshop-blue focus:ring-4 focus:ring-keyshop-blue/15 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export const labelClass = "mb-2 block text-sm font-bold text-white";

export const selectClass = cn(fieldClass, "cursor-pointer");

/** Panel / card surface */
export const panelClass =
  "rounded-card border border-keyshop-line bg-white/[0.03] backdrop-blur-xl";

/** Secondary outline button */
export const outlineBtnClass =
  "keyshop-interactive inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-control border border-keyshop-line px-4 text-sm font-semibold text-white transition hover:border-keyshop-blue/50 hover:text-keyshop-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-keyshop-blue/20";

/** Ghost / text link button */
export const ghostBtnClass =
  "keyshop-interactive inline-flex cursor-pointer items-center justify-center gap-2 rounded-control px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyshop-blue/30";

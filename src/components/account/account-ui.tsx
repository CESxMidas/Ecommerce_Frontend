import Link from "next/link";
import type { ReactNode } from "react";

import { AccountPageSkeleton } from "@/components/ui/skeleton";
import {
  checkoutCtaClass,
  fieldClass,
  labelClass,
  selectClass,
} from "@/lib/ui/tokens";
import { cn } from "@/lib/utils";

export const accountFieldClass = fieldClass;
export const accountLabelClass = labelClass;
export const accountSelectClass = selectClass;

export function AccountCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-keyshop-line bg-white/[0.03] p-6 backdrop-blur-xl md:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AccountCardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-[28px] font-extrabold text-white md:text-[32px]">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-keyshop-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function AccountActionButton({
  children,
  onClick,
  disabled,
  type = "button",
  variant = "primary",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "primary" | "outline";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-[42px] items-center justify-center rounded-control px-4 text-xs font-extrabold uppercase tracking-wide transition disabled:opacity-60",
        variant === "primary"
          ? "bg-keyshop-blue-hover text-white hover:bg-keyshop-blue"
          : "border border-keyshop-line bg-white/[0.03] text-white hover:border-keyshop-blue/40",
      )}
    >
      {children}
    </button>
  );
}

export function AccountEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-card border border-dashed border-keyshop-line py-14 text-center">
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-keyshop-muted">{description}</p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className={cn(checkoutCtaClass, "mx-auto mt-6 inline-flex max-w-xs")}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function AccountLoading({ label = "Đang tải..." }: { label?: string }) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <AccountPageSkeleton />
    </div>
  );
}

export function AccountListItem({
  children,
  action,
  unread,
}: {
  children: ReactNode;
  action?: ReactNode;
  unread?: boolean;
}) {
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-card border border-keyshop-line bg-white/[0.02] p-5 sm:flex-row sm:items-start sm:justify-between",
        unread && "border-keyshop-blue/30 bg-keyshop-blue/5",
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">{children}</div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </article>
  );
}

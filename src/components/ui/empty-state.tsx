import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { checkoutCtaClass } from "@/lib/ui/tokens";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-dashed border-keyshop-line px-6 py-14 text-center",
        className,
      )}
    >
      {Icon ? (
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-keyshop-blue/15 text-keyshop-blue"
          aria-hidden
        >
          <Icon className="h-7 w-7" />
        </div>
      ) : null}
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-keyshop-muted">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className={cn(checkoutCtaClass, "mx-auto mt-6 inline-flex max-w-xs")}
        >
          {actionLabel}
        </Link>
      ) : null}
      {actionLabel && onAction && !actionHref ? (
        <button
          type="button"
          onClick={onAction}
          className={cn(checkoutCtaClass, "mx-auto mt-6 max-w-xs")}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

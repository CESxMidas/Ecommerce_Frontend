import Link from "next/link";
import type { ReactNode } from "react";

import {
  checkoutCtaClass,
  fieldClass,
  ghostBtnClass,
  labelClass,
} from "@/lib/ui/tokens";
import { cn } from "@/lib/utils";

export { checkoutCtaClass, fieldClass as commerceFieldClass, labelClass };

export function CommercePage({ children }: { children: ReactNode }) {
  return (
    <main className="keyshop-page-bg min-h-screen py-8 pb-14 sm:py-10 md:py-12 md:pb-[72px]">
      <div className="container">
        <div className="mx-auto max-w-[1120px]">{children}</div>
      </div>
    </main>
  );
}

export function CommerceHero({
  kicker,
  title,
  description,
}: {
  kicker: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-7">
      <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-keyshop-blue">
        {kicker}
      </span>
      <h1 className="max-w-[780px] text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-[720px] text-base leading-7 text-keyshop-muted">{description}</p>
    </header>
  );
}

export function CommercePanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "keyshop-panel p-4 sm:p-6 md:p-[26px]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function CommerceActions({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex flex-wrap gap-3">{children}</div>;
}

export function CommerceBtn({
  href,
  onClick,
  children,
  disabled,
  type = "button",
  variant = "primary",
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "primary" | "ghost";
}) {
  const className = cn(
    "keyshop-interactive inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-control px-[18px] text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-keyshop-blue/25 disabled:cursor-not-allowed disabled:opacity-60",
    variant === "primary"
      ? "bg-keyshop-blue-hover text-white hover:bg-keyshop-blue"
      : ghostBtnClass,
    variant === "ghost" && "min-h-11 border border-sky-400/35 px-[18px] text-sky-200",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function CommerceField({
  label,
  children,
  htmlFor,
}: {
  label: string;
  children: ReactNode;
  htmlFor?: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function CommerceNotice({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 rounded-control border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      {children}
    </p>
  );
}

export function CommerceSectionBlock({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="mt-6 first:mt-0">
      <h2 className="text-lg font-extrabold text-white sm:text-xl md:text-[22px]">{title}</h2>
      <p className="mt-2.5 leading-7 text-slate-300">{body}</p>
    </div>
  );
}

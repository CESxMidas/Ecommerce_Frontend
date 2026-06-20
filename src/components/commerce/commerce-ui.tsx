import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function CommercePage({ children }: { children: ReactNode }) {
  return (
    <main className="keyshop-page-bg min-h-screen py-12 pb-[72px] md:py-[48px]">
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
      <h1 className="max-w-[780px] text-3xl font-extrabold leading-tight text-white md:text-4xl">
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
        "keyshop-panel p-6 md:p-[26px]",
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
    "inline-flex min-h-[42px] items-center justify-center gap-2 rounded-control px-[18px] text-sm font-extrabold transition disabled:opacity-60",
    variant === "primary"
      ? "bg-keyshop-blue-hover text-white hover:bg-keyshop-blue"
      : "border border-sky-400/35 text-sky-200 hover:border-keyshop-blue/50 hover:bg-keyshop-blue/10",
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

export const commerceFieldClass =
  "h-auto w-full rounded-control border border-keyshop-line bg-white/[0.03] px-[18px] py-4 text-[15px] text-white outline-none placeholder:text-white/30 focus:border-keyshop-blue focus:ring-4 focus:ring-keyshop-blue/15";

export function CommerceField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-white">{label}</label>
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
      <h2 className="text-[22px] font-extrabold text-white">{title}</h2>
      <p className="mt-2.5 leading-7 text-slate-300">{body}</p>
    </div>
  );
}

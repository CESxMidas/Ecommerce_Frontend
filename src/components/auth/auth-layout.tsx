import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { resolveMediaUrl } from "@/lib/utils/image";

type AuthSplitLayoutProps = {
  heroImage: string;
  badge: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthSplitLayout({
  heroImage,
  badge,
  title,
  description,
  children,
}: AuthSplitLayoutProps) {
  return (
    <section className="flex min-h-[100svh] bg-keyshop-bg">
      <div className="relative hidden flex-1 overflow-hidden lg:block">
        <Image
          src={resolveMediaUrl(heroImage)}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-keyshop-bg/15 to-keyshop-bg/92" />
        <div className="absolute bottom-14 left-14 z-10 max-w-[520px]">
          <span className="mb-5 inline-flex items-center rounded-full border border-white/10 bg-keyshop-blue/15 px-[18px] py-2.5 text-xs font-bold text-sky-400">
            {badge}
          </span>
          <h1 className="text-[clamp(42px,4vw,68px)] font-extrabold leading-[1.05] text-white">
            {title}
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-white/70">{description}</p>
        </div>
      </div>

      <div className="keyshop-scrollbar flex flex-1 items-center justify-center overflow-y-auto bg-keyshop-soft p-5">
        {children}
      </div>
    </section>
  );
}

export function AuthCenteredLayout({ children }: { children: ReactNode }) {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-keyshop-bg p-8">
      <div className="pointer-events-none absolute -right-28 -top-44 h-[600px] w-[600px] rounded-full bg-keyshop-blue-hover/15 blur-[120px]" />
      <div className="relative z-10 w-full max-w-[520px]">{children}</div>
    </section>
  );
}

export function AuthGlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-[480px] rounded-[24px] border border-keyshop-line bg-white/[0.03] p-8 shadow-card backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AuthCenteredCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[30px] border border-keyshop-line bg-white/[0.03] px-9 py-11 text-center shadow-card backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AuthGradientIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="mx-auto mb-6 flex h-[100px] w-[100px] items-center justify-center rounded-[28px] bg-gradient-to-br from-keyshop-blue-hover to-keyshop-blue text-white shadow-glow">
      <Icon className="h-12 w-12" />
    </div>
  );
}

export function AuthCardTop({
  title,
  description,
  centered,
}: {
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <div className={cn("mb-6", centered && "text-center")}>
      <h2 className="text-[clamp(28px,3vw,40px)] font-extrabold leading-tight text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
    </div>
  );
}

export function AuthField({
  label,
  children,
  action,
}: {
  label: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-bold text-white">{label}</label>
        {action}
      </div>
      {children}
    </div>
  );
}

export function AuthInput({
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  id,
  name,
  endAction,
}: {
  icon?: LucideIcon;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  id?: string;
  name?: string;
  endAction?: ReactNode;
}) {
  return (
    <div className="flex h-[54px] items-center gap-3 rounded-2xl border border-keyshop-line bg-white/[0.03] px-4 transition focus-within:border-keyshop-blue focus-within:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]">
      {Icon ? <Icon className="h-5 w-5 shrink-0 text-white/45" /> : null}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
      />
      {endAction}
    </div>
  );
}

export function AuthSubmitButton({
  children,
  disabled,
  type = "submit",
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="mt-2 flex h-[54px] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-keyshop-blue-hover to-keyshop-blue text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
    >
      {children}
    </button>
  );
}

export function AuthOutlineButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-keyshop-line bg-white/[0.03] text-sm font-semibold text-white transition hover:border-keyshop-blue/40 hover:bg-white/[0.05] disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function AuthDivider() {
  return (
    <div className="relative my-5 text-center text-xs font-semibold uppercase tracking-wider text-white/40">
      <span className="relative z-10 bg-transparent px-3">Hoặc đăng nhập bằng</span>
      <div className="absolute inset-x-0 top-1/2 border-t border-keyshop-line" />
    </div>
  );
}

export function AuthBottomText({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <p className="mt-5 text-center text-sm text-white/60">{children}</p>
  );
}

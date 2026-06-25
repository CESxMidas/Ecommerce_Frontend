"use client";

import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

import { AccountCard } from "@/components/account/account-ui";
import { isGoogleOnlyAccount } from "@/lib/auth/account-password";
import type { UserProfile } from "@/lib/services/user-service";
import { cn } from "@/lib/utils";

type PasswordSetupPromptProps = {
  profile: UserProfile | null;
  loading?: boolean;
  className?: string;
};

export default function PasswordSetupPrompt({
  profile,
  loading = false,
  className,
}: PasswordSetupPromptProps) {
  if (loading || !profile || profile.hasPassword) {
    return null;
  }

  const googleOnly = isGoogleOnlyAccount(profile);

  return (
    <AccountCard
      className={cn(
        "border-sky-400/25 bg-gradient-to-br from-sky-500/10 via-transparent to-keyshop-blue/5",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-400/25 bg-sky-500/15 text-sky-300">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-extrabold uppercase tracking-wide text-sky-300">
              Gợi ý bảo mật
            </p>
            <h2 className="mt-1 text-lg font-bold text-white">
              {googleOnly ? "Thiết lập mật khẩu đăng nhập" : "Tạo mật khẩu cho tài khoản"}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-keyshop-muted">
              {googleOnly
                ? "Bạn đang dùng Google. Thêm mật khẩu để có thể đăng nhập bằng email khi cần."
                : "Tài khoản chưa có mật khẩu. Thiết lập ngay để đăng nhập bằng email."}
            </p>
          </div>
        </div>

        <Link
          href="/account/security#password-setup"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-control bg-keyshop-blue-hover px-4 text-xs font-extrabold uppercase tracking-wide text-white transition hover:bg-keyshop-blue"
        >
          Thiết lập ngay
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </AccountCard>
  );
}

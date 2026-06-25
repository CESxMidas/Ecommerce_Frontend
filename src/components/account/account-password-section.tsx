"use client";

import { Check, Eye, EyeOff, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  AccountActionButton,
  AccountCard,
  AccountCardHeader,
  accountFieldClass,
  accountLabelClass,
} from "@/components/account/account-ui";
import { isGoogleOnlyAccount } from "@/lib/auth/account-password";
import { changePassword, type UserProfile } from "@/lib/services/user-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import { cn } from "@/lib/utils";

type AccountPasswordSectionProps = {
  profile: UserProfile | null;
  loading?: boolean;
  onUpdated?: () => void | Promise<void>;
  className?: string;
};

type PasswordFields = {
  currentPassword: string;
  password: string;
  confirmPassword: string;
};

const emptyFields: PasswordFields = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

function GoogleBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-300">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-slate-700">
        G
      </span>
      Google
    </span>
  );
}

function PasswordStrengthHint({ password }: { password: string }) {
  const checks = useMemo(
    () => [
      { label: "Ít nhất 6 ký tự", ok: password.length >= 6 },
      { label: "Có chữ và số (khuyến nghị)", ok: /[A-Za-z]/.test(password) && /\d/.test(password) },
    ],
    [password],
  );

  if (!password) return null;

  return (
    <ul className="space-y-1.5 text-xs">
      {checks.map((check) => (
        <li
          key={check.label}
          className={cn(
            "flex items-center gap-2",
            check.ok ? "text-emerald-300" : "text-keyshop-muted",
          )}
        >
          <Check className={cn("h-3.5 w-3.5", check.ok ? "opacity-100" : "opacity-35")} />
          {check.label}
        </li>
      ))}
    </ul>
  );
}

export default function AccountPasswordSection({
  profile,
  loading = false,
  onUpdated,
  className,
}: AccountPasswordSectionProps) {
  const needsSetup = profile ? !profile.hasPassword : false;
  const googleOnly = isGoogleOnlyAccount(profile);
  const [fields, setFields] = useState<PasswordFields>(emptyFields);
  const [saving, setSaving] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (needsSetup) {
      setSetupComplete(false);
    }
  }, [needsSetup]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (fields.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (fields.password !== fields.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        currentPassword: needsSetup ? undefined : fields.currentPassword,
        password: fields.password,
        confirmPassword: fields.confirmPassword,
      });

      setFields(emptyFields);
      setSetupComplete(true);
      await onUpdated?.();

      toast.success(
        needsSetup
          ? "Đã thiết lập mật khẩu. Bạn có thể đăng nhập bằng email và mật khẩu."
          : "Đã đổi mật khẩu",
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          needsSetup ? "Không thể thiết lập mật khẩu" : "Không thể đổi mật khẩu",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AccountCard id="password-setup" className={className}>
        <AccountCardHeader
          title="Mật khẩu đăng nhập"
          description="Đang tải thông tin bảo mật..."
        />
      </AccountCard>
    );
  }

  const showSuccessState = setupComplete;

  return (
    <AccountCard id="password-setup" className={className}>
      <AccountCardHeader
        title={needsSetup ? "Thiết lập mật khẩu" : "Đổi mật khẩu"}
        description={
          needsSetup
            ? "Thêm mật khẩu để đăng nhập bằng email, bên cạnh phương thức hiện tại."
            : "Cập nhật mật khẩu đăng nhập cho tài khoản của bạn."
        }
      />

      {googleOnly ? (
        <div className="mb-5 rounded-xl border border-sky-400/20 bg-sky-500/10 px-4 py-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-sky-100">Tài khoản đăng nhập Google</p>
            <GoogleBadge />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-sky-100/80">
            Bạn chưa có mật khẩu KEYSHOP. Thiết lập mật khẩu bên dưới để có thể đăng nhập bằng{" "}
            <span className="font-medium text-white">{profile?.email}</span> và mật khẩu — đồng
            thời vẫn dùng Google như bình thường.
          </p>
        </div>
      ) : needsSetup ? (
        <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3.5">
          <p className="text-sm leading-relaxed text-amber-100/90">
            Tài khoản của bạn chưa có mật khẩu. Hãy tạo mật khẩu để đăng nhập bằng email khi
            cần.
          </p>
        </div>
      ) : null}

      {showSuccessState ? (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-white">Mật khẩu đã được thiết lập</p>
                <p className="mt-1 text-sm text-emerald-100/85">
                  Từ giờ bạn có thể đăng nhập theo hai cách:
                </p>
              </div>
              <ul className="space-y-2 text-sm text-emerald-100/90">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0" />
                  Email + mật khẩu vừa tạo
                </li>
                {googleOnly || profile?.authProvider === "google" ? (
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0" />
                    Nút đăng nhập Google
                  </li>
                ) : null}
              </ul>
              <AccountActionButton
                variant="outline"
                onClick={() => setSetupComplete(false)}
              >
                Đổi mật khẩu khác
              </AccountActionButton>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {!needsSetup ? (
            <div>
              <label htmlFor="currentPassword" className={accountLabelClass}>
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  autoComplete="current-password"
                  value={fields.currentPassword}
                  onChange={(event) =>
                    setFields({ ...fields, currentPassword: event.target.value })
                  }
                  className={cn(accountFieldClass, "pr-11")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-keyshop-muted hover:text-white"
                  onClick={() => setShowCurrent((value) => !value)}
                  aria-label={showCurrent ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 rounded-xl border border-keyshop-line bg-white/[0.02] p-4 sm:grid-cols-3">
              {[
                { step: "1", title: "Nhập mật khẩu", icon: KeyRound },
                { step: "2", title: "Xác nhận lại", icon: Lock },
                { step: "3", title: "Đăng nhập email", icon: ShieldCheck },
              ].map(({ step, title, icon: Icon }) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-keyshop-blue/15 text-xs font-extrabold text-sky-300">
                    {step}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
                      <Icon className="h-3.5 w-3.5 text-keyshop-blue" />
                      {title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="newPassword" className={accountLabelClass}>
                {needsSetup ? "Mật khẩu mới" : "Mật khẩu mới"}
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  autoComplete={needsSetup ? "new-password" : "new-password"}
                  value={fields.password}
                  onChange={(event) =>
                    setFields({ ...fields, password: event.target.value })
                  }
                  className={cn(accountFieldClass, "pr-11")}
                  placeholder="Tối thiểu 6 ký tự"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-keyshop-muted hover:text-white"
                  onClick={() => setShowNew((value) => !value)}
                  aria-label={showNew ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className={accountLabelClass}>
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={fields.confirmPassword}
                  onChange={(event) =>
                    setFields({ ...fields, confirmPassword: event.target.value })
                  }
                  className={cn(accountFieldClass, "pr-11")}
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-keyshop-muted hover:text-white"
                  onClick={() => setShowConfirm((value) => !value)}
                  aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <PasswordStrengthHint password={fields.password} />

          <div className="flex flex-wrap gap-3 pt-1">
            <AccountActionButton type="submit" disabled={saving}>
              {saving
                ? "Đang lưu..."
                : needsSetup
                  ? "Thiết lập mật khẩu"
                  : "Đổi mật khẩu"}
            </AccountActionButton>
          </div>
        </form>
      )}
    </AccountCard>
  );
}

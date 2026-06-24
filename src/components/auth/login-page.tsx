"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FormEvent, Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  AuthBottomText,
  AuthCardTop,
  AuthField,
  AuthGlassCard,
  AuthInput,
  AuthSplitLayout,
  AuthSubmitButton,
} from "@/components/auth/auth-layout";
import SocialAuthButtons from "@/components/auth/social-auth-buttons";
import { parseEmailNotVerifiedError } from "@/lib/auth/constants";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");

    if (rememberedEmail) {
      setFormFields((prev) => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formFields.email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formFields.email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    if (!formFields.password.trim()) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    setLoading(true);

    const result = await signIn("credentials", {
      email: formFields.email.trim(),
      password: formFields.password,
      rememberMe: rememberMe ? "true" : "false",
      redirect: false,
    });

    setLoading(false);

    if (!result?.ok || result?.error) {
      const verificationError = result?.error
        ? parseEmailNotVerifiedError(result.error)
        : null;

      if (verificationError) {
        toast[verificationError.emailSent ? "success" : "error"](
          verificationError.message || "Vui lòng xác minh tài khoản",
        );
        router.push(
          `/auth/verify?email=${encodeURIComponent(
            verificationError.email || formFields.email,
          )}`,
        );
        return;
      }

      toast.error(result?.error || "Đăng nhập thất bại");
      return;
    }

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", formFields.email.trim());
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    await getSession();
    toast.success("Đăng nhập thành công");
    const safeCallbackUrl =
      callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")
        ? callbackUrl
        : "/account";
    window.location.assign(safeCallbackUrl);
  }

  return (
    <AuthSplitLayout
      heroImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop"
      badge="Gaming đỉnh cao"
      title="Chợ game số cao cấp"
      description="Đăng nhập để tiếp tục khám phá key game và ưu đãi độc quyền."
    >
      <AuthGlassCard>
        <AuthCardTop
          title="Chào mừng trở lại"
          description="Đăng nhập để tiếp tục mua sắm."
        />

        <form onSubmit={onSubmit}>
          <AuthField label="Email">
            <AuthInput
              id="email"
              type="email"
              icon={Mail}
              value={formFields.email}
              onChange={(email) => setFormFields({ ...formFields, email })}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </AuthField>

          <AuthField
            label="Mật khẩu"
            action={
              <Link
                href="/auth/forgot-password"
                className="inline-flex min-h-11 items-center py-1 text-xs font-semibold text-keyshop-blue hover:text-sky-300"
              >
                Quên mật khẩu?
              </Link>
            }
          >
            <AuthInput
              id="password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              value={formFields.password}
              onChange={(password) => setFormFields({ ...formFields, password })}
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              endAction={
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center text-white/55 transition hover:text-white"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />
          </AuthField>

          <label className="mb-4 flex cursor-pointer items-center gap-2.5 text-sm text-white/70">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 rounded border-keyshop-line accent-keyshop-blue"
            />
            Ghi nhớ đăng nhập
          </label>

          <AuthSubmitButton disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </AuthSubmitButton>
        </form>

        <SocialAuthButtons callbackUrl={callbackUrl} />

        <AuthBottomText>
          Chưa có tài khoản?{" "}
          <Link href="/auth/register" className="font-semibold text-keyshop-blue hover:text-sky-300">
            Tạo tài khoản
          </Link>
        </AuthBottomText>
      </AuthGlassCard>
    </AuthSplitLayout>
  );
}

export default function LoginPageClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100svh] items-center justify-center bg-keyshop-bg text-white/60">
          Đang tải...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FormEvent, Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import {
  AuthBottomText,
  AuthCardTop,
  AuthCenteredCard,
  AuthCenteredLayout,
  AuthField,
  AuthGradientIcon,
  AuthInput,
  AuthSubmitButton,
} from "@/components/auth/auth-layout";
import { forgotPassword, resetPassword } from "@/lib/services/auth-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";

export function ForgotPasswordPageClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Vui lòng nhập email hợp lệ");
      return;
    }

    try {
      setLoading(true);
      const result = await forgotPassword(email.trim());
      toast.success(result.message || "Mã đặt lại mật khẩu đã được gửi");
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCenteredLayout>
      <AuthCenteredCard>
        <AuthGradientIcon icon={Mail} />
        <AuthCardTop
          centered
          title="Quên mật khẩu?"
          description="Nhập email để nhận mã đặt lại mật khẩu."
        />

        <form onSubmit={onSubmit}>
          <AuthField label="Email">
            <AuthInput
              type="email"
              icon={Mail}
              value={email}
              onChange={setEmail}
              placeholder="Địa chỉ email"
            />
          </AuthField>

          <AuthSubmitButton disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi mã đặt lại"}
          </AuthSubmitButton>
        </form>

        <AuthBottomText>
          <Link href="/auth/login" className="font-semibold text-keyshop-blue hover:text-sky-300">
            Quay lại đăng nhập
          </Link>
        </AuthBottomText>
      </AuthCenteredCard>
    </AuthCenteredLayout>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const emailFromQuery = searchParams.get("email") || "";

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formFields, setFormFields] = useState({
    email: emailFromQuery,
    otp: "",
    password: "",
    confirmPassword: "",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formFields.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (formFields.password !== formFields.confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    if (!isAuthenticated) {
      if (!formFields.email.trim()) {
        toast.error("Vui lòng nhập email");
        return;
      }

      if (!formFields.otp.trim()) {
        toast.error("Vui lòng nhập mã đặt lại");
        return;
      }
    }

    try {
      setLoading(true);

      const payload: Record<string, string> = {
        password: formFields.password,
        confirmPassword: formFields.confirmPassword,
      };

      if (!isAuthenticated) {
        payload.email = formFields.email;
        payload.otp = formFields.otp;
      }

      await resetPassword(payload);
      toast.success("Đặt lại mật khẩu thành công");
      router.push("/auth/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCenteredLayout>
      <AuthCenteredCard>
        <AuthGradientIcon icon={Lock} />
        <AuthCardTop
          centered
          title="Tạo mật khẩu mới"
          description="Mật khẩu mới phải khác mật khẩu trước đó."
        />

        <form onSubmit={onSubmit}>
          {!isAuthenticated ? (
            <>
              <AuthField label="Email">
                <AuthInput
                  id="email"
                  name="email"
                  type="email"
                  icon={Mail}
                  value={formFields.email}
                  onChange={(email) => setFormFields({ ...formFields, email })}
                />
              </AuthField>
              <AuthField label="Mã đặt lại">
                <AuthInput
                  id="otp"
                  name="otp"
                  value={formFields.otp}
                  onChange={(otp) => setFormFields({ ...formFields, otp })}
                  placeholder="Mã 6 chữ số"
                />
              </AuthField>
            </>
          ) : null}

          <AuthField label="Mật khẩu mới">
            <AuthInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              value={formFields.password}
              onChange={(password) => setFormFields({ ...formFields, password })}
              endAction={
                <button
                  type="button"
                  className="text-white/55 transition hover:text-white"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              }
            />
          </AuthField>

          <AuthField label="Xác nhận mật khẩu">
            <AuthInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              icon={Lock}
              value={formFields.confirmPassword}
              onChange={(confirmPassword) =>
                setFormFields({ ...formFields, confirmPassword })
              }
              endAction={
                <button
                  type="button"
                  className="text-white/55 transition hover:text-white"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              }
            />
          </AuthField>

          <AuthSubmitButton disabled={loading}>
            {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
          </AuthSubmitButton>
        </form>

        <AuthBottomText>
          <Link href="/auth/login" className="font-semibold text-keyshop-blue hover:text-sky-300">
            Quay lại đăng nhập
          </Link>
        </AuthBottomText>
      </AuthCenteredCard>
    </AuthCenteredLayout>
  );
}

export function ResetPasswordPageClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100svh] items-center justify-center bg-keyshop-bg text-white/60">
          Đang tải...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

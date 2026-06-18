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
      toast.error("Valid email is required");
      return;
    }

    try {
      setLoading(true);
      const result = await forgotPassword(email.trim());
      toast.success(result.message || "Password reset code sent");
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
          title="Forgot your password?"
          description="Enter your email and we'll send you a reset code."
        />

        <form onSubmit={onSubmit}>
          <AuthField label="Email">
            <AuthInput
              type="email"
              icon={Mail}
              value={email}
              onChange={setEmail}
              placeholder="Email address"
            />
          </AuthField>

          <AuthSubmitButton disabled={loading}>
            {loading ? "Sending..." : "Send reset code"}
          </AuthSubmitButton>
        </form>

        <AuthBottomText>
          <Link href="/auth/login" className="font-semibold text-keyshop-blue hover:text-sky-300">
            Back to login
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
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formFields.password !== formFields.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!isAuthenticated) {
      if (!formFields.email.trim()) {
        toast.error("Email is required");
        return;
      }

      if (!formFields.otp.trim()) {
        toast.error("Reset code is required");
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
      toast.success("Password reset successfully");
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
          title="Create new password"
          description="Your new password must be different from previous passwords."
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
              <AuthField label="Reset code">
                <AuthInput
                  id="otp"
                  name="otp"
                  value={formFields.otp}
                  onChange={(otp) => setFormFields({ ...formFields, otp })}
                  placeholder="6-digit code"
                />
              </AuthField>
            </>
          ) : null}

          <AuthField label="New password">
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

          <AuthField label="Confirm password">
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
            {loading ? "Updating..." : "Reset password"}
          </AuthSubmitButton>
        </form>

        <AuthBottomText>
          <Link href="/auth/login" className="font-semibold text-keyshop-blue hover:text-sky-300">
            Back to login
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
          Loading...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}

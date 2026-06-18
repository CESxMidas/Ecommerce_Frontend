"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FormEvent, Suspense, useState } from "react";
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
import { login as loginRequest } from "@/lib/services/auth-service";
import { getApiErrorData, getApiErrorMessage } from "@/lib/utils/api-error";

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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formFields.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formFields.email)) {
      toast.error("Invalid email format");
      return;
    }

    if (!formFields.password.trim()) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);

    try {
      await loginRequest({
        email: formFields.email.trim(),
        password: formFields.password,
      });
    } catch (error) {
      const data = getApiErrorData(error);

      if (data?.code === "EMAIL_NOT_VERIFIED") {
        toast[data.emailSent ? "success" : "error"](
          data.message || "Please verify your account",
        );
        router.push(
          `/auth/verify?email=${encodeURIComponent(data.email || formFields.email)}`,
        );
        setLoading(false);
        return;
      }

      toast.error(getApiErrorMessage(error, "Login failed"));
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email: formFields.email.trim(),
      password: formFields.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    if (rememberMe && typeof window !== "undefined") {
      localStorage.setItem("rememberedEmail", formFields.email.trim());
    }

    toast.success("Login successful");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <AuthSplitLayout
      heroImage="/images/bypass/cerberus-banner.png"
      badge="Next Level Gaming"
      title="Premium Digital Gaming Marketplace"
      description="Access your account and continue exploring premium software keys and exclusive offers."
    >
      <AuthGlassCard>
        <AuthCardTop
          title="Welcome back"
          description="Login to continue your shopping experience."
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
            label="Password"
            action={
              <Link
                href="/auth/forgot-password"
                className="text-xs font-semibold text-keyshop-blue hover:text-sky-300"
              >
                Forgot password?
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
              placeholder="Enter your password"
              endAction={
                <button
                  type="button"
                  className="text-white/55 transition hover:text-white"
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
            Remember me
          </label>

          <AuthSubmitButton disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </AuthSubmitButton>
        </form>

        <SocialAuthButtons callbackUrl={callbackUrl} />

        <AuthBottomText>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-keyshop-blue hover:text-sky-300">
            Create account
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
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

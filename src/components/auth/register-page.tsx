"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { FormEvent, useState } from "react";
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
import { register as registerRequest } from "@/lib/services/auth-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";

export default function RegisterPageClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formFields.name.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!formFields.email.trim() || !/\S+@\S+\.\S+/.test(formFields.email)) {
      toast.error("Valid email is required");
      return;
    }

    if (formFields.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const result = await registerRequest(formFields);
      toast.success(result.message || "Register successful");
      router.push(
        `/auth/verify?email=${encodeURIComponent(formFields.email)}`,
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthSplitLayout
      heroImage="/images/bypass/snake-app.png"
      badge="Join the community"
      title="Create your gaming account"
      description="Unlock premium digital products, exclusive deals and member rewards."
    >
      <AuthGlassCard>
        <AuthCardTop
          title="Create account"
          description="Register now and start your journey."
        />

        <form onSubmit={onSubmit}>
          <AuthField label="Full name">
            <AuthInput
              id="name"
              icon={User}
              value={formFields.name}
              onChange={(name) => setFormFields({ ...formFields, name })}
              placeholder="Your full name"
            />
          </AuthField>

          <AuthField label="Email">
            <AuthInput
              id="email"
              type="email"
              icon={Mail}
              value={formFields.email}
              onChange={(email) => setFormFields({ ...formFields, email })}
              placeholder="you@example.com"
            />
          </AuthField>

          <AuthField label="Password">
            <AuthInput
              id="password"
              type="password"
              icon={Lock}
              value={formFields.password}
              onChange={(password) => setFormFields({ ...formFields, password })}
              placeholder="At least 6 characters"
            />
          </AuthField>

          <AuthSubmitButton disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </AuthSubmitButton>
        </form>

        <SocialAuthButtons callbackUrl="/" />

        <AuthBottomText>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-keyshop-blue hover:text-sky-300">
            Sign in
          </Link>
        </AuthBottomText>
      </AuthGlassCard>
    </AuthSplitLayout>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MailCheck, RefreshCw } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  AuthBottomText,
  AuthCardTop,
  AuthCenteredCard,
  AuthCenteredLayout,
  AuthGradientIcon,
  AuthOutlineButton,
  AuthSubmitButton,
} from "@/components/auth/auth-layout";
import OTPBox from "@/components/auth/otp-box";
import {
  resendVerification,
  verifyAccount,
} from "@/lib/services/auth-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";

export default function VerifyPageClient({ email }: { email: string }) {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  async function verifyOTP() {
    const code = otp.join("").trim();

    if (!email) {
      toast.error("Missing email");
      return;
    }

    if (code.length !== 6) {
      toast.error("Enter all 6 digits");
      return;
    }

    try {
      setLoading(true);
      await verifyAccount({ email, otp: code });
      toast.success("Verification successful");
      router.push("/auth/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Invalid or expired code"));
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    if (!email) {
      toast.error("Missing email");
      return;
    }

    try {
      setLoading(true);
      const result = await resendVerification(email);
      toast.success(result.message || "Verification code resent");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCenteredLayout>
      <AuthCenteredCard>
        <AuthGradientIcon icon={MailCheck} />
        <AuthCardTop
          centered
          title="Verify your email"
          description="Enter the 6-digit code sent to your inbox (check spam too)."
        />

        <div className="mb-6 rounded-2xl border border-keyshop-line bg-white/[0.03] p-4">
          <p className="text-xs text-white/50">Sent to</p>
          <p className="mt-1 font-semibold text-white">{email || "—"}</p>
        </div>

        <OTPBox otp={otp} setOtp={setOtp} />

        <div className="mt-6 space-y-3">
          <AuthSubmitButton type="button" onClick={verifyOTP} disabled={loading}>
            {loading ? "Processing..." : "Verify"}
          </AuthSubmitButton>

          <AuthOutlineButton onClick={resendOTP} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            Resend code
          </AuthOutlineButton>
        </div>

        <AuthBottomText>
          <Link href="/auth/login" className="font-semibold text-keyshop-blue hover:text-sky-300">
            Back to login
          </Link>
        </AuthBottomText>
      </AuthCenteredCard>
    </AuthCenteredLayout>
  );
}

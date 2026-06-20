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
      toast.error("Thiếu email");
      return;
    }

    if (code.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 chữ số");
      return;
    }

    try {
      setLoading(true);
      await verifyAccount({ email, otp: code });
      toast.success("Xác minh thành công");
      router.push("/auth/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Mã không hợp lệ hoặc đã hết hạn"));
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    if (!email) {
      toast.error("Thiếu email");
      return;
    }

    try {
      setLoading(true);
      const result = await resendVerification(email);
      toast.success(result.message || "Mã xác minh đã được gửi lại");
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
          title="Xác minh email"
          description="Nhập mã 6 chữ số đã gửi tới hộp thư (kiểm tra cả thư rác)."
        />

        <div className="mb-6 rounded-2xl border border-keyshop-line bg-white/[0.03] p-4">
          <p className="text-xs text-white/50">Gửi tới</p>
          <p className="mt-1 font-semibold text-white">{email || "—"}</p>
        </div>

        <OTPBox otp={otp} setOtp={setOtp} />

        <div className="mt-6 space-y-3">
          <AuthSubmitButton type="button" onClick={verifyOTP} disabled={loading}>
            {loading ? "Đang xử lý..." : "Xác minh"}
          </AuthSubmitButton>

          <AuthOutlineButton onClick={resendOTP} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            Gửi lại mã
          </AuthOutlineButton>
        </div>

        <AuthBottomText>
          <Link href="/auth/login" className="font-semibold text-keyshop-blue hover:text-sky-300">
            Quay lại đăng nhập
          </Link>
        </AuthBottomText>
      </AuthCenteredCard>
    </AuthCenteredLayout>
  );
}

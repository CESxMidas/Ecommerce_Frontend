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
      toast.error("Vui lòng nhập họ tên");
      return;
    }

    if (!formFields.email.trim() || !/\S+@\S+\.\S+/.test(formFields.email)) {
      toast.error("Vui lòng nhập email hợp lệ");
      return;
    }

    if (formFields.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setLoading(true);
      const result = await registerRequest(formFields);
      toast.success(result.message || "Đăng ký thành công");
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
      badge="Tham gia cộng đồng"
      title="Tạo tài khoản game của bạn"
      description="Mở khóa sản phẩm số cao cấp, ưu đãi độc quyền và quyền lợi thành viên."
    >
      <AuthGlassCard>
        <AuthCardTop
          title="Tạo tài khoản"
          description="Đăng ký ngay để bắt đầu hành trình của bạn."
        />

        <form onSubmit={onSubmit}>
          <AuthField label="Họ và tên">
            <AuthInput
              id="name"
              icon={User}
              value={formFields.name}
              onChange={(name) => setFormFields({ ...formFields, name })}
              placeholder="Họ và tên của bạn"
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

          <AuthField label="Mật khẩu">
            <AuthInput
              id="password"
              type="password"
              icon={Lock}
              value={formFields.password}
              onChange={(password) => setFormFields({ ...formFields, password })}
              placeholder="Ít nhất 6 ký tự"
            />
          </AuthField>

          <AuthSubmitButton disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo tài khoản"}
          </AuthSubmitButton>
        </form>

        <SocialAuthButtons callbackUrl="/" />

        <AuthBottomText>
          Đã có tài khoản?{" "}
          <Link href="/auth/login" className="font-semibold text-keyshop-blue hover:text-sky-300">
            Đăng nhập
          </Link>
        </AuthBottomText>
      </AuthGlassCard>
    </AuthSplitLayout>
  );
}

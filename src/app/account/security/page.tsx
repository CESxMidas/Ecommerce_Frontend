import type { Metadata } from "next";

import SecurityPageClient from "@/components/account/security-page";

export const metadata: Metadata = {
  title: "Bảo mật",
  description: "Quản lý phiên đăng nhập và cài đặt bảo mật tài khoản.",
};

export default function SecurityPage() {
  return <SecurityPageClient />;
}

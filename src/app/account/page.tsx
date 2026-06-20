import type { Metadata } from "next";

import AccountProfilePage from "@/components/account/profile-page";

export const metadata: Metadata = {
  title: "Hồ sơ",
  description: "Cập nhật hồ sơ và thông tin liên hệ tài khoản KEYSHOP.",
};

export default function AccountPage() {
  return <AccountProfilePage />;
}

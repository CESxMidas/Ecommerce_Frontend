import type { Metadata } from "next";

import AccountSidebar from "@/components/account/account-sidebar";
import { noIndexMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: {
    default: "Tài khoản",
    template: "%s | Tài khoản | KEYSHOP",
  },
  description: "Quản lý hồ sơ, đơn hàng và key bản quyền KEYSHOP.",
  ...noIndexMetadata,
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container py-10 pb-16">
      <div className="grid gap-6 lg:grid-cols-[292px_1fr]">
        <AccountSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

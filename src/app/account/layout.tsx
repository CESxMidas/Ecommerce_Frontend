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
    <div className="container min-w-0 py-4 pb-10 sm:py-6 md:py-8 md:pb-16 lg:py-10">
      <div className="grid min-w-0 gap-4 lg:grid-cols-[292px_1fr] lg:gap-6">
        <div className="min-w-0 max-w-full overflow-hidden">
          <AccountSidebar />
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

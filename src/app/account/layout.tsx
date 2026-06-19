import type { Metadata } from "next";

import AccountSidebar from "@/components/account/account-sidebar";
import { noIndexMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: {
    default: "Account",
    template: "%s | Account | KEYSHOP",
  },
  description: "Manage your KEYSHOP profile, orders, and digital licenses.",
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

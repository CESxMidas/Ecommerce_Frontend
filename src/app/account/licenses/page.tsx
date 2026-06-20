import type { Metadata } from "next";

import LicensesPageClient from "@/components/account/licenses-page";

export const metadata: Metadata = {
  title: "License",
  description: "Truy cập và gửi lại key license KEYSHOP đã mua.",
};

export default function LicensesPage() {
  return <LicensesPageClient />;
}

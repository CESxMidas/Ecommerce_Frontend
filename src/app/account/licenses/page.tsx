import type { Metadata } from "next";

import LicensesPageClient from "@/components/account/licenses-page";

export const metadata: Metadata = {
  title: "Licenses",
  description: "Access and resend your purchased KEYSHOP license keys.",
};

export default function LicensesPage() {
  return <LicensesPageClient />;
}

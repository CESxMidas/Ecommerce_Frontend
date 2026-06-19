import type { Metadata } from "next";

import SecurityPageClient from "@/components/account/security-page";

export const metadata: Metadata = {
  title: "Security",
  description: "Manage active sessions and account security settings.",
};

export default function SecurityPage() {
  return <SecurityPageClient />;
}

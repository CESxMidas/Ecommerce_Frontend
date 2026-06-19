import type { Metadata } from "next";

import AccountProfilePage from "@/components/account/profile-page";

export const metadata: Metadata = {
  title: "Profile",
  description: "Update your KEYSHOP account profile and contact details.",
};

export default function AccountPage() {
  return <AccountProfilePage />;
}

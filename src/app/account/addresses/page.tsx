import type { Metadata } from "next";

import AddressesPageClient from "@/components/account/addresses-page";

export const metadata: Metadata = {
  title: "Addresses",
  description: "Manage shipping addresses for your KEYSHOP orders.",
};

export default function AddressesPage() {
  return <AddressesPageClient />;
}

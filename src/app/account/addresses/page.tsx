import type { Metadata } from "next";

import AddressesPageClient from "@/components/account/addresses-page";

export const metadata: Metadata = {
  title: "Địa chỉ",
  description: "Quản lý địa chỉ giao hàng cho đơn hàng KEYSHOP.",
};

export default function AddressesPage() {
  return <AddressesPageClient />;
}

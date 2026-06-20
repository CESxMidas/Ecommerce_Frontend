import type { Metadata } from "next";

import TicketsPageClient from "@/components/account/tickets-page";

export const metadata: Metadata = {
  title: "Phiếu hỗ trợ",
  description: "Mở và quản lý phiếu hỗ trợ KEYSHOP.",
};

export default function TicketsPage() {
  return <TicketsPageClient />;
}

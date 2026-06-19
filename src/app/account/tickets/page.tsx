import type { Metadata } from "next";

import TicketsPageClient from "@/components/account/tickets-page";

export const metadata: Metadata = {
  title: "Support Tickets",
  description: "Open and manage KEYSHOP support tickets.",
};

export default function TicketsPage() {
  return <TicketsPageClient />;
}

import type { Metadata } from "next";

import NotificationsPageClient from "@/components/account/notifications-page";

export const metadata: Metadata = {
  title: "Notifications",
  description: "View account and order notifications from KEYSHOP.",
};

export default function NotificationsPage() {
  return <NotificationsPageClient />;
}

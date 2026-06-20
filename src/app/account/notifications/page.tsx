import type { Metadata } from "next";

import NotificationsPageClient from "@/components/account/notifications-page";

export const metadata: Metadata = {
  title: "Thông báo",
  description: "Xem thông báo tài khoản và đơn hàng từ KEYSHOP.",
};

export default function NotificationsPage() {
  return <NotificationsPageClient />;
}

import type { Metadata } from "next";

import WishlistPageClient from "@/components/account/wishlist-page";

export const metadata: Metadata = {
  title: "Yêu thích",
  description: "Xem và quản lý sản phẩm KEYSHOP bạn đã lưu.",
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}

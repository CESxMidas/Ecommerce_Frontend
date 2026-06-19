import type { Metadata } from "next";

import WishlistPageClient from "@/components/account/wishlist-page";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View and manage your saved KEYSHOP products.",
};

export default function WishlistPage() {
  return <WishlistPageClient />;
}

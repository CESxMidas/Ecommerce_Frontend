"use client";

import Link from "next/link";
import {
  ChevronDown,
  Monitor,
  Headphones,
  Home,
  Key,
  Menu,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";

import CategoryPanel from "@/components/layout/category-panel";
import SideDrawer from "@/components/ui/side-drawer";
import type { Category } from "@/types/api";

type SiteNavigationProps = {
  categories: Category[];
};

export default function SiteNavigation({ categories }: SiteNavigationProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="border-b border-white/[0.05] bg-keyshop-bg/80">
        <div className="container flex min-h-[54px] items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden items-center gap-2 rounded-control bg-keyshop-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-keyshop-blue-hover lg:inline-flex"
          >
            <Menu className="h-4 w-4" />
            All Categories
          </button>

          <ul className="hidden flex-1 items-center gap-1 lg:flex">
            {[
              { href: "/", label: "Home", icon: Home },
              { href: "/products", label: "Shop", icon: ShoppingBag },
              {
                href: "/products?category=digital-products",
                label: "Digital Products",
                icon: Key,
              },
              { href: "/products?category=hardware", label: "Hardware", icon: Monitor },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 rounded-control px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}

            <li className="group relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-control px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Headphones className="h-4 w-4" />
                Support
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="invisible absolute left-0 top-full z-50 min-w-[200px] rounded-card border border-keyshop-line bg-keyshop-soft p-2 opacity-0 shadow-card transition-all group-hover:visible group-hover:opacity-100">
                {[
                  ["/support/help-center", "Help Center"],
                  ["/contact", "Contact Us"],
                  ["/track-order", "Track Order"],
                  ["/legal/payment-policy", "Payment Policy"],
                  ["/support/returns", "Refund Policy"],
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="block rounded-control px-3 py-2 text-sm text-white/80 hover:bg-white/5 hover:text-white"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </li>
          </ul>

          <Link
            href="/track-order"
            className="text-sm font-medium text-keyshop-blue hover:text-keyshop-blue-hover"
          >
            Track Order
          </Link>
        </div>
      </nav>

      <SideDrawer open={open} onClose={() => setOpen(false)} anchor="left">
        <CategoryPanel categories={categories} onNavigate={() => setOpen(false)} />
      </SideDrawer>
    </>
  );
}

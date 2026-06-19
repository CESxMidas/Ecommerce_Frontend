"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Globe,
  Heart,
  LogIn,
  Menu,
  ShoppingCart,
  Shuffle,
  User,
} from "lucide-react";
import { useState } from "react";

import CategoryPanel from "@/components/layout/category-panel";
import SearchBox from "@/components/layout/search-box";
import SiteNavigation from "@/components/layout/site-navigation";
import { useCart } from "@/components/providers/cart-provider";
import { performLogout } from "@/lib/auth/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SideDrawer from "@/components/ui/side-drawer";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/api";

type SiteHeaderProps = {
  categories: Category[];
};

export default function SiteHeader({ categories }: SiteHeaderProps) {
  const { data: session } = useSession();
  const { cartSummary, wishlist, setOpenCartPanel } = useCart();
  const [openCategory, setOpenCategory] = useState(false);

  const isLoggedIn = Boolean(session?.user);
  const userName = session?.user?.name || "User";

  return (
    <header className="sticky top-0 z-[999] w-full bg-keyshop-bg/95 backdrop-blur-[14px]">
      <div className="border-b border-white/[0.05] bg-white/[0.02]">
        <div className="container flex min-h-[34px] items-center justify-between gap-5 text-xs text-keyshop-muted">
          <p className="truncate">Verified software keys. Instant digital delivery.</p>
          <div className="flex shrink-0 items-center gap-5">
            <Link href="/support/help-center" className="hover:text-white">
              Help Center
            </Link>
            <Link href="/track-order" className="hover:text-white">
              Order Tracking
            </Link>
            <span className="inline-flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              EN
            </span>
          </div>
        </div>
      </div>

      <div className="border-b border-white/[0.05] py-3.5">
        <div className="container grid items-center gap-6 lg:grid-cols-[minmax(190px,250px)_1fr_auto]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-white lg:hidden"
              onClick={() => setOpenCategory(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex flex-col">
              <span className="text-[32px] font-extrabold leading-none text-white hover:text-keyshop-blue">
                KEYSHOP
              </span>
              <span className="text-xs text-keyshop-muted">Digital licenses</span>
            </Link>
          </div>

          <div className="hidden lg:block">
            <SearchBox />
          </div>

          <div className="flex items-center justify-end gap-4">
            <div className="hidden items-center gap-3 sm:flex">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 rounded-control px-3 py-2 text-sm text-white hover:bg-white/5"
                    >
                      <User className="h-4 w-4" />
                      <span className="max-w-[120px] truncate">Hello, {userName}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="z-[1300] min-w-[200px] rounded-card border border-keyshop-line bg-keyshop-soft p-1.5 text-white shadow-glow"
                  >
                    <DropdownMenuItem asChild className="rounded-control text-white/90 focus:bg-white/10 focus:text-white">
                      <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-control text-white/90 focus:bg-white/10 focus:text-white">
                      <Link href="/account/orders">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-control text-white/90 focus:bg-white/10 focus:text-white">
                      <Link href="/account/wishlist">My Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-control text-red-400 focus:bg-red-500/10 focus:text-red-400"
                      onClick={() => performLogout("/")}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 rounded-control px-3 py-2 text-sm text-white hover:bg-white/5"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-control bg-keyshop-blue px-4 py-2 text-sm font-semibold text-white hover:bg-keyshop-blue-hover"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <HeaderIconLink href="/account/wishlist" badge={wishlist.length}>
                <Heart className="h-5 w-5" />
              </HeaderIconLink>
              <HeaderIconLink href="/compare">
                <Shuffle className="h-5 w-5" />
              </HeaderIconLink>
              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5"
                onClick={() => setOpenCartPanel(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartSummary.count > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {cartSummary.count}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </div>

        <div className="container mt-3 lg:hidden">
          <SearchBox />
        </div>
      </div>

      <SiteNavigation categories={categories} />

      <SideDrawer open={openCategory} onClose={() => setOpenCategory(false)} anchor="left">
        <CategoryPanel
          categories={categories}
          onNavigate={() => setOpenCategory(false)}
        />
      </SideDrawer>
    </header>
  );
}

function HeaderIconLink({
  href,
  children,
  badge = 0,
}: {
  href: string;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5",
      )}
    >
      {children}
      {badge > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

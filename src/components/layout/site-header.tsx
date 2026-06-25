"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Suspense, useEffect, useState } from "react";

import CategoryPanel from "@/components/layout/category-panel";
import SearchBox from "@/components/layout/search-box";
import SiteNavigation, { SiteNavigationSkeleton } from "@/components/layout/site-navigation";
import { useCartCore } from "@/components/providers/cart-provider";
import { useCartUi } from "@/components/providers/cart-ui-provider";
import { useWishlistCompare } from "@/components/providers/wishlist-compare-provider";
import { useCategories } from "@/lib/hooks/use-categories";
import { performLogout } from "@/lib/auth/logout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SideDrawer from "@/components/ui/side-drawer";
import { cn } from "@/lib/utils";

const MOBILE_HEADER_COMPACT_QUERY = "(max-width: 1023px)";
const HEADER_COMPACT_SCROLL_OFFSET = 12;

function mobileHeaderSectionClass(compact: boolean, expandedMaxHeight: string) {
  return cn(
    "overflow-hidden transition-[max-height,opacity,margin] duration-300 ease-out",
    "lg:max-h-none lg:opacity-100 lg:pointer-events-auto",
    compact
      ? "max-h-0 opacity-0 pointer-events-none"
      : cn(expandedMaxHeight, "opacity-100"),
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const isAccountRoute = pathname.startsWith("/account");
  const categories = useCategories();
  const { data: session, status } = useSession();
  const { cartSummary } = useCartCore();
  const { wishlist } = useWishlistCompare();
  const { setOpenCartPanel } = useCartUi();
  const [openCategory, setOpenCategory] = useState(false);
  const [compactHeader, setCompactHeader] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_HEADER_COMPACT_QUERY);

    const updateCompactHeader = () => {
      if (!mediaQuery.matches) {
        setCompactHeader(false);
        return;
      }

      setCompactHeader(window.scrollY > HEADER_COMPACT_SCROLL_OFFSET);
    };

    updateCompactHeader();
    window.addEventListener("scroll", updateCompactHeader, { passive: true });
    window.addEventListener("resize", updateCompactHeader);
    mediaQuery.addEventListener("change", updateCompactHeader);

    return () => {
      window.removeEventListener("scroll", updateCompactHeader);
      window.removeEventListener("resize", updateCompactHeader);
      mediaQuery.removeEventListener("change", updateCompactHeader);
    };
  }, []);

  const isLoggedIn = Boolean(session?.user);
  const userName = session?.user?.name || "User";

  return (
    <header className="sticky top-0 z-[999] w-full bg-keyshop-bg/95 backdrop-blur-[14px]">
      <div
        className={mobileHeaderSectionClass(compactHeader, "max-h-10")}
        aria-hidden={compactHeader}
      >
        <div className="keyshop-topbar">
          <div className="container flex min-h-[34px] items-center justify-between gap-3">
          <p className="min-w-0 truncate">Key phần mềm chính hãng — giao hàng số tức thì.</p>
          <div className="hidden shrink-0 items-center gap-4 md:flex md:gap-5">
            <Link href="/help" className="transition-colors hover:text-white">
              Trung tâm trợ giúp
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Liên hệ
            </Link>
            <Link href="/track-order" className="transition-colors hover:text-white">
              Tra cứu đơn
            </Link>
            <span className="inline-flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              VI
            </span>
          </div>
          <Link
            href="/help"
            className="shrink-0 transition-colors hover:text-white md:hidden"
          >
            Hỗ trợ
          </Link>
          </div>
        </div>
      </div>

      <div className="keyshop-header-main">
        <div className="container flex items-center justify-between gap-3 lg:grid lg:grid-cols-[minmax(190px,250px)_1fr_auto] lg:items-center lg:gap-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyshop-blue/40 lg:hidden"
              onClick={() => setOpenCategory(true)}
              aria-label="Mở danh mục"
              aria-expanded={openCategory}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex min-w-0 flex-col">
              <span className="text-2xl font-extrabold leading-none text-white transition-colors hover:text-keyshop-blue sm:text-3xl">
                KEYSHOP
              </span>
              <span className="text-xs text-keyshop-muted">Bản quyền số</span>
            </Link>
          </div>

          <div className="hidden lg:block">
            <SearchBox />
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-4">
            <div className="hidden min-w-0 items-center justify-end gap-3 sm:flex lg:min-w-[220px]">
              {status === "loading" ? (
                <>
                  <div className="h-10 w-24 rounded-control bg-white/[0.06]" aria-hidden />
                  <div className="h-10 w-[88px] rounded-control bg-white/[0.06]" aria-hidden />
                </>
              ) : isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex cursor-pointer items-center gap-2 rounded-control px-3 py-2 text-sm text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyshop-blue/30"
                    >
                      <User className="h-4 w-4" />
                      <span className="max-w-[120px] truncate">Xin chào, {userName}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="z-[1300] min-w-[200px] rounded-card border border-keyshop-line bg-keyshop-soft p-1.5 text-white shadow-glow"
                  >
                    <DropdownMenuItem asChild className="rounded-control text-white/90 focus:bg-white/10 focus:text-white">
                      <Link href="/account">Tài khoản</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-control text-white/90 focus:bg-white/10 focus:text-white">
                      <Link href="/account/orders">Đơn hàng</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-control text-white/90 focus:bg-white/10 focus:text-white">
                      <Link href="/account/wishlist">Yêu thích</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-control text-red-400 focus:bg-red-500/10 focus:text-red-400"
                      onClick={() => performLogout("/")}
                    >
                      Đăng xuất
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
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-control bg-keyshop-blue px-4 py-2 text-sm font-semibold text-white hover:bg-keyshop-blue-hover"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {status !== "loading" && !isLoggedIn ? (
                <Link
                  href="/auth/login"
                  aria-label="Đăng nhập"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyshop-blue/40 sm:hidden"
                >
                  <LogIn className="h-5 w-5" />
                </Link>
              ) : null}
              {status !== "loading" && isLoggedIn && !isAccountRoute ? (
                <Link
                  href="/account"
                  aria-label="Tài khoản"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyshop-blue/40 sm:hidden"
                >
                  <User className="h-5 w-5" />
                </Link>
              ) : null}
              <HeaderIconLink
                href="/account/wishlist"
                badge={wishlist.length}
                label="Yêu thích"
              >
                <Heart className="h-5 w-5" />
              </HeaderIconLink>
              <HeaderIconLink
                href="/compare"
                label="So sánh"
                className="hidden min-[400px]:flex"
              >
                <Shuffle className="h-5 w-5" />
              </HeaderIconLink>
              <button
                type="button"
                className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyshop-blue/40"
                onClick={() => setOpenCartPanel(true)}
                aria-label={`Giỏ hàng${cartSummary.count > 0 ? `, ${cartSummary.count} sản phẩm` : ""}`}
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

        <div
          className={cn(
            mobileHeaderSectionClass(compactHeader, "max-h-24"),
            "container lg:hidden",
            compactHeader ? "mt-0" : "mt-3",
            isAccountRoute && "hidden",
          )}
          aria-hidden={compactHeader || isAccountRoute}
        >
          <SearchBox />
        </div>
      </div>

      <div
        className={mobileHeaderSectionClass(compactHeader, "max-h-16")}
        aria-hidden={compactHeader}
      >
        <Suspense fallback={<SiteNavigationSkeleton />}>
          <SiteNavigation categories={categories} hiddenOnMobileAccount={isAccountRoute} />
        </Suspense>
      </div>

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
  label,
  className,
}: {
  href: string;
  children: React.ReactNode;
  badge?: number;
  label: string;
  className?: string;
}) {
  const ariaLabel = badge > 0 ? `${label}, ${badge} sản phẩm` : label;

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyshop-blue/40",
        className,
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

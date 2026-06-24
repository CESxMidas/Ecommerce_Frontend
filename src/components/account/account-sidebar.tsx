"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Heart,
  Key,
  LogOut,
  MapPin,
  MessageCircle,
  Shield,
  ShoppingBag,
  Star,
  User,
  UserRound,
  Bell,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { performLogout } from "@/lib/auth/logout";

const links = [
  { href: "/account", label: "Hồ sơ", shortLabel: "Hồ sơ", icon: User },
  { href: "/account/addresses", label: "Địa chỉ", shortLabel: "Địa chỉ", icon: MapPin },
  { href: "/account/wishlist", label: "Yêu thích", shortLabel: "Yêu thích", icon: Heart },
  { href: "/account/orders", label: "Đơn hàng", shortLabel: "Đơn hàng", icon: ShoppingBag },
  { href: "/account/reviews", label: "Đánh giá", shortLabel: "Đánh giá", icon: Star },
  { href: "/account/licenses", label: "Key bản quyền", shortLabel: "Key", icon: Key },
  {
    href: "/account/premium-accounts",
    label: "Tài khoản Premium",
    shortLabel: "Premium",
    icon: UserRound,
  },
  { href: "/account/notifications", label: "Thông báo", shortLabel: "Thông báo", icon: Bell },
  { href: "/account/tickets", label: "Hỗ trợ", shortLabel: "Hỗ trợ", icon: MessageCircle },
  { href: "/account/security", label: "Bảo mật", shortLabel: "Bảo mật", icon: Shield },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const displayName = session?.user?.name || "Tài khoản";
  const displayEmail = session?.user?.email || "";
  const avatar = session?.user?.image || "";

  return (
    <aside className="w-full min-w-0 max-w-full overflow-hidden lg:sticky lg:top-24 lg:h-fit lg:rounded-[18px] lg:border lg:border-keyshop-line lg:bg-keyshop-surface lg:p-[18px] lg:shadow-card lg:backdrop-blur-md">
      <div className="mb-0 hidden grid-cols-[58px_1fr] gap-x-3.5 gap-y-1 border-b border-keyshop-line pb-[18px] lg:mb-3 lg:grid">
        <div className="row-span-3 h-[58px] w-[58px] overflow-hidden rounded-2xl border border-sky-400/30 bg-white/[0.06] shadow-[0_10px_22px_rgba(37,99,235,0.13)]">
          {avatar ? (
            <Image
              src={avatar}
              alt={displayName}
              width={58}
              height={58}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-extrabold text-keyshop-blue">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <h3 className="truncate text-lg font-extrabold text-white">{displayName}</h3>
        <p className="truncate text-xs text-slate-400">{displayEmail}</p>
        <div className="accountSidebar__badge">
          <span className="inline-flex min-h-6 items-center rounded-full bg-emerald-500/15 px-2.5 text-[11px] font-extrabold text-emerald-300">
            Thành viên
          </span>
        </div>
      </div>

      <div className="keyshop-account-nav-scroll w-full max-w-full overflow-x-auto lg:overflow-visible">
        <nav className="flex w-max min-w-full gap-2 pb-1 lg:w-full lg:flex-col lg:gap-1.5 lg:pb-0">
          {links.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href ||
              (link.href !== "/account" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border px-3 text-sm font-bold transition sm:gap-3 lg:min-h-[46px] lg:w-full lg:shrink",
                  active
                    ? "border-keyshop-blue/35 bg-keyshop-blue/15 text-sky-300"
                    : "border-transparent text-slate-300 hover:border-keyshop-line hover:bg-white/[0.04] hover:text-white",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap lg:hidden">{link.shortLabel}</span>
                <span className="hidden whitespace-nowrap lg:inline">{link.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            className="flex min-h-[44px] shrink-0 items-center gap-2 rounded-xl border border-transparent px-3 text-sm font-bold text-slate-300 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-300 sm:gap-3 lg:mt-1 lg:min-h-[46px] lg:w-full lg:shrink"
            onClick={() => performLogout("/")}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">Đăng xuất</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}

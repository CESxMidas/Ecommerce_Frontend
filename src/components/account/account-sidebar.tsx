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
  User,
  Bell,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { performLogout } from "@/lib/auth/logout";

const links = [
  { href: "/account", label: "Hồ sơ", icon: User },
  { href: "/account/addresses", label: "Địa chỉ", icon: MapPin },
  { href: "/account/wishlist", label: "Yêu thích", icon: Heart },
  { href: "/account/orders", label: "Đơn hàng", icon: ShoppingBag },
  { href: "/account/licenses", label: "Key bản quyền", icon: Key },
  { href: "/account/notifications", label: "Thông báo", icon: Bell },
  { href: "/account/tickets", label: "Hỗ trợ", icon: MessageCircle },
  { href: "/account/security", label: "Bảo mật", icon: Shield },
];

export default function AccountSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const displayName = session?.user?.name || "Tài khoản";
  const displayEmail = session?.user?.email || "";
  const avatar = session?.user?.image || "";

  return (
    <aside className="h-fit rounded-[18px] border border-keyshop-line bg-keyshop-surface p-[18px] shadow-card backdrop-blur-md lg:sticky lg:top-24">
      <div className="mb-3 grid grid-cols-[58px_1fr] gap-x-3.5 gap-y-1 border-b border-keyshop-line pb-[18px]">
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

      <nav className="flex flex-col gap-1.5">
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
                "flex min-h-[46px] items-center gap-3 rounded-xl border px-3 text-sm font-bold transition",
                active
                  ? "border-keyshop-blue/35 bg-keyshop-blue/15 text-sky-300"
                  : "border-transparent text-slate-300 hover:border-keyshop-line hover:bg-white/[0.04] hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}

        <button
          type="button"
          className="mt-1 flex min-h-[46px] w-full items-center gap-3 rounded-xl border border-transparent px-3 text-sm font-bold text-slate-300 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
          onClick={() => performLogout("/")}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Đăng xuất
        </button>
      </nav>
    </aside>
  );
}

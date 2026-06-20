"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";

import CategoryPanel from "@/components/layout/category-panel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SideDrawer from "@/components/ui/side-drawer";
import {
  COMPANY_NAV_ITEMS,
  PRIMARY_NAV_ITEM,
  SHOP_NAV_GROUP,
  SUPPORT_NAV_GROUP,
  isNavGroupActive,
  isNavLinkActive,
  type NavDropdownGroup,
  type NavLinkItem,
} from "@/lib/navigation/site-nav";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/api";

type SiteNavigationProps = {
  categories: Category[];
};

const NAV_LIST_ITEM_CLASS =
  "flex shrink-0 lg:min-w-0 lg:flex-1 lg:justify-center";

export default function SiteNavigation({ categories }: SiteNavigationProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const searchSuffix = search ? `?${search}` : "";

  return (
    <>
      <nav className="keyshop-nav-bar">
        <div className="container flex min-h-[56px] items-center gap-3 lg:gap-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hidden shrink-0 items-center gap-2.5 rounded-control bg-keyshop-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-keyshop-blue-hover lg:inline-flex"
          >
            <Menu className="h-4 w-4" />
            Tất cả danh mục
          </button>

          <ul className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-hide sm:gap-3 lg:gap-0">
            <NavItem item={PRIMARY_NAV_ITEM} pathname={pathname} search={searchSuffix} />

            <NavDropdown group={SHOP_NAV_GROUP} pathname={pathname} search={searchSuffix} />

            {COMPANY_NAV_ITEMS.map((item) => (
              <NavItem key={item.href} item={item} pathname={pathname} search={searchSuffix} />
            ))}

            <NavDropdown group={SUPPORT_NAV_GROUP} pathname={pathname} search={searchSuffix} />
          </ul>
        </div>
      </nav>

      <SideDrawer open={open} onClose={() => setOpen(false)} anchor="left">
        <CategoryPanel categories={categories} onNavigate={() => setOpen(false)} />
      </SideDrawer>
    </>
  );
}

function NavItem({
  item,
  pathname,
  search,
}: {
  item: NavLinkItem;
  pathname: string;
  search: string;
}) {
  const active = isNavLinkActive(pathname, search, item.href, item.match);

  return (
    <li className={NAV_LIST_ITEM_CLASS}>
      <Link
        href={item.href}
        className={cn(
          "keyshop-nav-link whitespace-nowrap lg:px-2 xl:px-3",
          active && "keyshop-nav-link-active",
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {item.label}
      </Link>
    </li>
  );
}

function NavDropdown({
  group,
  pathname,
  search,
}: {
  group: NavDropdownGroup;
  pathname: string;
  search: string;
}) {
  const active = isNavGroupActive(pathname, search, group);

  return (
    <li className={NAV_LIST_ITEM_CLASS}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "keyshop-nav-link whitespace-nowrap outline-none lg:px-2 xl:px-3",
              "data-[state=open]:bg-white/10 data-[state=open]:text-white",
              active && "keyshop-nav-link-active",
            )}
          >
            <group.icon className="h-4 w-4 shrink-0" />
            {group.label}
            <ChevronDown className="h-3 w-3 shrink-0 opacity-70" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={10}
          className="z-[1300] min-w-[240px] space-y-0.5 rounded-card border border-keyshop-line bg-keyshop-soft p-2 text-white shadow-card"
        >
          {group.items.map((item) => {
            const itemActive = isNavLinkActive(pathname, search, item.href, item.match);

            return (
              <DropdownMenuItem key={item.href} asChild className="p-0 focus:bg-transparent">
                <Link
                  href={item.href}
                  className={cn(
                    "keyshop-nav-link w-full px-3.5 py-3",
                    itemActive && "keyshop-nav-link-active",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0 text-keyshop-blue" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}

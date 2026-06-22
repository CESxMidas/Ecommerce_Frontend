import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CircleHelp,
  CreditCard,
  Headphones,
  HelpCircle,
  Home,
  Key,
  Mail,
  Monitor,
  Newspaper,
  PackageSearch,
  RotateCcw,
  ShoppingBag,
  Tag,
  Truck,
  User,
} from "lucide-react";

export type NavLinkItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match?: "exact" | "prefix";
};

export type NavDropdownGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavLinkItem[];
};

export const PRIMARY_NAV_ITEM: NavLinkItem = {
  href: "/",
  label: "Trang chủ",
  icon: Home,
  match: "exact",
};

export const SHOP_QUICK_LINKS: NavLinkItem[] = [
  {
    href: "/products?category=phan-mem-ban-quyen",
    label: "Phần mềm & Bản quyền",
    icon: Key,
  },
  {
    href: "/products?category=phan-cung-thiet-bi",
    label: "Phần cứng & Thiết bị",
    icon: Monitor,
  },
  {
    href: "/products?category=tai-khoan-premium-pro",
    label: "Tài khoản Premium",
    icon: User,
  },
];

export const SHOP_NAV_GROUP: NavDropdownGroup = {
  id: "shop",
  label: "Sản phẩm",
  icon: ShoppingBag,
  items: [
    { href: "/products", label: "Tất cả sản phẩm", icon: ShoppingBag, match: "prefix" },
    { href: "/deals", label: "Khuyến mãi", icon: Tag, match: "prefix" },
    ...SHOP_QUICK_LINKS,
  ],
};

export const COMPANY_NAV_ITEMS: NavLinkItem[] = [
  { href: "/about", label: "Giới thiệu", icon: Building2, match: "prefix" },
  { href: "/blog", label: "Tin tức", icon: Newspaper, match: "prefix" },
  { href: "/contact", label: "Liên hệ", icon: Mail, match: "prefix" },
];

export const SUPPORT_NAV_GROUP: NavDropdownGroup = {
  id: "support",
  label: "Hỗ trợ",
  icon: Headphones,
  items: [
    { href: "/help", label: "Trung tâm trợ giúp", icon: HelpCircle, match: "prefix" },
    { href: "/track-order", label: "Tra cứu đơn hàng", icon: PackageSearch, match: "prefix" },
    { href: "/faq", label: "FAQ", icon: CircleHelp, match: "prefix" },
    { href: "/support/shipping", label: "Vận chuyển", icon: Truck, match: "prefix" },
    {
      href: "/legal/payment-policy",
      label: "Thanh toán",
      icon: CreditCard,
      match: "prefix",
    },
    { href: "/support/returns", label: "Đổi trả & hoàn tiền", icon: RotateCcw, match: "prefix" },
  ],
};

export const NAV_DROPDOWN_GROUPS = [SHOP_NAV_GROUP, SUPPORT_NAV_GROUP];

export function isNavLinkActive(
  pathname: string,
  search: string,
  href: string,
  match: NavLinkItem["match"] = "prefix",
): boolean {
  const [path, query = ""] = href.split("?");

  if (query) {
    const expected = new URLSearchParams(query);
    const current = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (pathname !== path) return false;

    let matches = true;
    expected.forEach((value, key) => {
      if (current.get(key) !== value) {
        matches = false;
      }
    });

    return matches;
  }

  if (match === "exact") {
    return pathname === path;
  }

  if (path === "/products") {
    const current = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
    if (current.has("category")) return false;
  }

  return pathname === path || (path !== "/" && pathname.startsWith(`${path}/`));
}

export function isNavGroupActive(
  pathname: string,
  search: string,
  group: NavDropdownGroup,
): boolean {
  return group.items.some((item) =>
    isNavLinkActive(pathname, search, item.href, item.match),
  );
}


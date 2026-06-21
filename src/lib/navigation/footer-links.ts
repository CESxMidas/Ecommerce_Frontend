/** Footer link groups — single source of truth */

export type FooterLink = { href: string; label: string };

export const FOOTER_SHOP_LINKS: FooterLink[] = [
  { href: "/products", label: "Sản phẩm" },
  { href: "/products?sort=new", label: "Hàng mới" },
  { href: "/deals", label: "Khuyến mãi" },
  { href: "/blog", label: "Tin tức & hướng dẫn" },
];

export const FOOTER_SUPPORT_LINKS: FooterLink[] = [
  { href: "/contact", label: "Liên hệ" },
  { href: "/faq", label: "FAQ" },
  { href: "/track-order", label: "Tra cứu đơn" },
  { href: "/support/shipping", label: "Vận chuyển" },
  { href: "/legal/payment-policy", label: "Thanh toán" },
  { href: "/support/returns", label: "Đổi trả & hoàn tiền" },
];

export const FOOTER_ABOUT_LINKS: FooterLink[] = [
  { href: "/about", label: "Giới thiệu" },
  { href: "/our-story", label: "Câu chuyện thương hiệu" },
  { href: "/careers", label: "Tuyển dụng" },
  { href: "/partners", label: "Đối tác" },
  { href: "/store-locator", label: "Hệ thống cửa hàng" },
];

export const FOOTER_LEGAL_LINKS: FooterLink[] = [
  { href: "/legal/privacy-policy", label: "Chính sách bảo mật" },
  { href: "/legal/terms", label: "Điều khoản sử dụng" },
  { href: "/legal/cookie-policy", label: "Cookie Policy" },
  { href: "/support/returns", label: "Chính sách hoàn tiền" },
];

export const CONTACT_INFO = {
  email: "hoangdohuy0907@gmail.com",
  phone: "+84 941 383 007",
  phoneDisplay: "+84 941 383 007",
  hours: "Hỗ trợ hàng ngày, 8:00 – 22:00 (GMT+7)",
} as const;

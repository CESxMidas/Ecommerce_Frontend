import Link from "next/link";
import Image from "next/image";
import {
  Bolt,
  Facebook,
  Headphones,
  Instagram,
  KeyRound,
  CreditCard,
  RotateCcw,
  Youtube,
} from "lucide-react";

import {
  CONTACT_INFO,
  FOOTER_ABOUT_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_SHOP_LINKS,
  FOOTER_SUPPORT_LINKS,
} from "@/lib/navigation/footer-links";

export default function SiteFooter() {
  const features = [
    { icon: Bolt, title: "Giao ngay", text: "Key số sau khi thanh toán" },
    { icon: RotateCcw, title: "Xem xét hoàn tiền", text: "Hỗ trợ khi key lỗi" },
    { icon: CreditCard, title: "Thanh toán an toàn", text: "Quy trình checkout bảo mật" },
    { icon: KeyRound, title: "Key chính hãng", text: "Bản quyền số đã xác minh" },
    {
      icon: Headphones,
      title: "Hỗ trợ kích hoạt",
      text: "Giúp khi cài đặt gặp sự cố",
    },
  ];

  return (
    <footer className="mt-auto border-t border-keyshop-line bg-keyshop-bg">
      <div className="border-b border-keyshop-line">
        <div className="container grid gap-6 py-8 sm:grid-cols-2 xl:grid-cols-5">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start gap-4">
              <feature.icon className="mt-1 h-7 w-7 shrink-0 text-keyshop-blue" />
              <div>
                <h4 className="font-semibold text-white">{feature.title}</h4>
                <p className="mt-1 text-sm text-keyshop-muted">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <div className="xl:col-span-1">
          <h3 className="mb-4 text-lg font-bold text-white">Liên hệ</h3>
          <p className="text-sm text-keyshop-muted">KEYSHOP — Cửa hàng bản quyền số</p>
          <p className="mt-2 text-sm text-keyshop-muted">{CONTACT_INFO.hours}</p>
          <p className="mt-4 text-sm">
            <a href={`mailto:${CONTACT_INFO.email}`} className="text-keyshop-muted hover:text-white">
              {CONTACT_INFO.email}
            </a>
          </p>
          <p className="mt-2 text-xl font-bold text-keyshop-blue">
            <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}>{CONTACT_INFO.phoneDisplay}</a>
          </p>
        </div>

        <FooterColumn title="Mua sắm" links={FOOTER_SHOP_LINKS} />
        <FooterColumn title="Hỗ trợ" links={FOOTER_SUPPORT_LINKS} />
        <FooterColumn title="Về chúng tôi" links={FOOTER_ABOUT_LINKS} />
        <FooterColumn title="Pháp lý" links={FOOTER_LEGAL_LINKS} />
      </div>

      <div className="border-t border-keyshop-line py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Youtube, label: "YouTube" },
              { icon: Instagram, label: "Instagram" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="keyshop-interactive flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-keyshop-line text-white/80 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-keyshop-blue/30"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <p className="text-sm text-keyshop-muted">© 2026 KEYSHOP. Bản quyền thuộc về KEYSHOP.</p>
          <Image
            src="https://i.imgur.com/D9jR4YQ.png"
            alt="Phương thức thanh toán VNPay và COD"
            width={160}
            height={32}
            className="h-8 w-auto object-contain opacity-90"
          />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-white">{title}</h3>
      <ul className="space-y-3 text-sm text-keyshop-muted">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

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

      <div className="container grid gap-12 py-14 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <h3 className="mb-4 text-lg font-bold text-white">Liên hệ</h3>
          <p className="text-sm text-keyshop-muted">KEYSHOP - Cửa hàng bản quyền số</p>
          <p className="mt-2 text-sm text-keyshop-muted">
            Key phần mềm, sản phẩm game và hỗ trợ kích hoạt
          </p>
          <p className="mt-6 text-sm text-keyshop-muted">hoangdohuy0907@gmail.com</p>
          <p className="mt-4 text-[28px] font-bold text-keyshop-blue">+84 941 383 007</p>
          <div className="mt-6 flex items-center gap-4 rounded-card border border-keyshop-line bg-white/[0.03] p-4">
            <Headphones className="h-8 w-8 text-keyshop-blue" />
            <div>
              <h4 className="font-semibold text-white">Chat trực tuyến</h4>
              <p className="text-sm text-keyshop-muted">Nhận hỗ trợ nhanh</p>
            </div>
          </div>
        </div>

        <FooterColumn
          title="Sản phẩm"
          links={[
            ["/deals?sort=popular", "Giảm giá"],
            ["/products?sort=new", "Hàng mới"],
            ["/deals?sort=popular", "Bán chạy"],
            ["/contact", "Liên hệ"],
            ["/blog", "Tin tức"],
            ["/track-order", "Tra cứu đơn"],
          ]}
        />

        <FooterColumn
          title="Công ty"
          links={[
            ["/support/shipping", "Giao hàng"],
            ["/legal/privacy-policy", "Thông báo pháp lý"],
            ["/legal/terms", "Điều khoản"],
            ["/about", "Giới thiệu"],
            ["/legal/payment-policy", "Thanh toán an toàn"],
            ["/auth/login", "Đăng nhập"],
          ]}
        />

        <div>
          <h3 className="mb-4 text-lg font-bold text-white">Đăng ký nhận tin</h3>
          <p className="mb-6 text-sm text-keyshop-muted">
            Nhận tin khuyến mãi và cập nhật phần mềm qua email.
          </p>
          <div className="flex overflow-hidden rounded-control border border-keyshop-line">
            <input
              type="email"
              placeholder="Email của bạn"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
            />
            <button
              type="button"
              className="bg-keyshop-blue px-4 text-xs font-bold text-white hover:bg-keyshop-blue-hover"
            >
              ĐĂNG KÝ
            </button>
          </div>
          <label className="mt-4 flex items-start gap-3 text-xs text-keyshop-muted">
            <input type="checkbox" className="mt-0.5" />
            <span>Tôi đồng ý với điều khoản và chính sách bảo mật</span>
          </label>
        </div>
      </div>

      <div className="border-t border-keyshop-line py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            {[Facebook, Youtube, Instagram].map((Icon, index) => (
              <button
                key={index}
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-keyshop-line text-white/80 hover:bg-white/5 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <p className="text-sm text-keyshop-muted">Bản quyền 2026 - KEYSHOP</p>
          <Image
            src="https://i.imgur.com/D9jR4YQ.png"
            alt="Phương thức thanh toán"
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
  links: [string, string][];
}) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-white">{title}</h3>
      <ul className="space-y-3 text-sm text-keyshop-muted">
        {links.map(([href, label]) => (
          <li key={`${href}-${label}`}>
            <Link href={href} className="transition-colors hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

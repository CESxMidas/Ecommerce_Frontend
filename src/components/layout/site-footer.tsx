import Link from "next/link";
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
    { icon: Bolt, title: "Instant Delivery", text: "Digital keys after checkout" },
    { icon: RotateCcw, title: "Refund Review", text: "Support for key issues" },
    { icon: CreditCard, title: "Secure Payment", text: "Protected checkout flow" },
    { icon: KeyRound, title: "Genuine Keys", text: "Verified digital licenses" },
    {
      icon: Headphones,
      title: "Activation Support",
      text: "Help when setup fails",
    },
  ];

  return (
    <footer className="mt-auto border-t border-white/10 bg-keyshop-bg">
      <div className="border-b border-white/10">
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
          <h3 className="mb-4 text-lg font-bold text-white">Contact us</h3>
          <p className="text-sm text-keyshop-muted">KEYSHOP - Digital License Store</p>
          <p className="mt-2 text-sm text-keyshop-muted">
            Software keys, gaming products and activation support
          </p>
          <p className="mt-6 text-sm text-keyshop-muted">hoangdohuy0907@gmail.com</p>
          <p className="mt-4 text-[28px] font-bold text-keyshop-blue">+84 941 383 007</p>
          <div className="mt-6 flex items-center gap-4 rounded-card border border-keyshop-line bg-white/[0.03] p-4">
            <Headphones className="h-8 w-8 text-keyshop-blue" />
            <div>
              <h4 className="font-semibold text-white">Online Chat</h4>
              <p className="text-sm text-keyshop-muted">Get Expert Help</p>
            </div>
          </div>
        </div>

        <FooterColumn
          title="Products"
          links={[
            ["/deals?sort=popular", "Prices drop"],
            ["/products?sort=new", "New products"],
            ["/deals?sort=popular", "Best sales"],
            ["/contact", "Contact us"],
            ["/blog", "Articles"],
            ["/track-order", "Order tracking"],
          ]}
        />

        <FooterColumn
          title="Our company"
          links={[
            ["/support/shipping", "Delivery"],
            ["/legal/privacy-policy", "Legal Notice"],
            ["/legal/terms", "Terms and conditions"],
            ["/about", "About us"],
            ["/legal/payment-policy", "Secure payment"],
            ["/auth/login", "Login"],
          ]}
        />

        <div>
          <h3 className="mb-4 text-lg font-bold text-white">Subscribe to newsletter</h3>
          <p className="mb-6 text-sm text-keyshop-muted">
            Subscribe to our latest newsletter to get news about special discounts
            and software updates.
          </p>
          <div className="flex overflow-hidden rounded-control border border-keyshop-line">
            <input
              type="email"
              placeholder="Your Email Address"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
            />
            <button
              type="button"
              className="bg-keyshop-blue px-4 text-xs font-bold text-white hover:bg-keyshop-blue-hover"
            >
              SUBSCRIBE
            </button>
          </div>
          <label className="mt-4 flex items-start gap-3 text-xs text-keyshop-muted">
            <input type="checkbox" className="mt-0.5" />
            <span>I agree to the terms and conditions and the privacy policy</span>
          </label>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
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
          <p className="text-sm text-keyshop-muted">Copyright 2026 - KEYSHOP</p>
          <img
            src="https://i.imgur.com/D9jR4YQ.png"
            alt="Payment methods"
            className="h-8 object-contain opacity-90"
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

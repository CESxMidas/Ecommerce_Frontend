import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";

import { TrustSignals } from "@/components/commerce/trust-signals";
import {
  CommerceActions,
  CommerceBtn,
  CommerceHero,
  CommercePage,
  CommercePanel,
  CommerceSectionBlock,
} from "@/components/commerce/commerce-ui";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { CONTACT_INFO } from "@/lib/navigation/footer-links";
import type { StaticPageContent } from "@/lib/content/static-pages";
import { cn } from "@/lib/utils";

type StaticPageViewProps = {
  content: StaticPageContent;
};

export default function StaticPageView({ content }: StaticPageViewProps) {
  return (
    <CommercePage>
      <CommerceHero
        kicker={content.kicker}
        title={content.title}
        description={content.intro}
      />

      <p className="mb-4 text-sm text-keyshop-muted">
        Cập nhật lần cuối:{" "}
        <time dateTime={content.updatedAt}>
          {new Date(content.updatedAt).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
      </p>

      {content.shortcuts && content.shortcuts.length > 0 ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {content.shortcuts.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="keyshop-card-hover rounded-card border border-keyshop-line bg-white/[0.03] p-5 transition hover:border-keyshop-blue/35"
            >
              <p className="font-semibold text-white">{item.label}</p>
              <p className="mt-1 text-sm text-keyshop-muted">{item.description}</p>
            </Link>
          ))}
        </div>
      ) : null}

      <CommercePanel>
        {content.sections.map((section) => (
          <CommerceSectionBlock key={section.title} title={section.title} body={section.body} />
        ))}

        {content.faqs && content.faqs.length > 0 ? (
          <div className="mt-8">
            <FaqAccordion items={content.faqs} />
          </div>
        ) : null}

        {content.showContactCta ? <ContactSupportStrip className="mt-8" /> : null}

        <TrustSignals className="mt-6" />

        <CommerceActions>
          <CommerceBtn href="/products">Xem sản phẩm</CommerceBtn>
          <CommerceBtn href="/contact" variant="ghost">
            Liên hệ hỗ trợ
          </CommerceBtn>
        </CommerceActions>
      </CommercePanel>
    </CommercePage>
  );
}

function ContactSupportStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-card border border-keyshop-blue/25 bg-keyshop-blue/10 p-5 md:p-6",
        className,
      )}
    >
      <h2 className="text-lg font-bold text-white">Cần hỗ trợ thêm?</h2>
      <p className="mt-1 text-sm text-keyshop-muted">{CONTACT_INFO.hours}</p>
      <ul className="mt-4 space-y-2 text-sm">
        <li>
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="inline-flex items-center gap-2 text-white hover:text-keyshop-blue"
          >
            <Mail className="h-4 w-4 text-keyshop-blue" aria-hidden />
            {CONTACT_INFO.email}
          </a>
        </li>
        <li>
          <a
            href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 text-white hover:text-keyshop-blue"
          >
            <Phone className="h-4 w-4 text-keyshop-blue" aria-hidden />
            {CONTACT_INFO.phoneDisplay}
          </a>
        </li>
        <li>
          <Link
            href="/account/tickets"
            className="inline-flex items-center gap-2 font-medium text-keyshop-blue hover:underline"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            Tạo ticket hỗ trợ (cần đăng nhập)
          </Link>
        </li>
      </ul>
    </div>
  );
}

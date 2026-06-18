import {
  CommerceActions,
  CommerceBtn,
  CommerceHero,
  CommercePage,
  CommercePanel,
  CommerceSectionBlock,
} from "@/components/commerce/commerce-ui";
import type { StaticPageContent } from "@/lib/content/static-pages";

export default function StaticPageView({ content }: { content: StaticPageContent }) {
  return (
    <CommercePage>
      <CommerceHero
        kicker={content.kicker}
        title={content.title}
        description={content.intro}
      />

      <CommercePanel>
        {content.sections.map((section) => (
          <CommerceSectionBlock key={section.title} title={section.title} body={section.body} />
        ))}

        <CommerceActions>
          <CommerceBtn href="/products">Browse products</CommerceBtn>
          <CommerceBtn href="/contact" variant="ghost">
            Contact support
          </CommerceBtn>
        </CommerceActions>
      </CommercePanel>
    </CommercePage>
  );
}

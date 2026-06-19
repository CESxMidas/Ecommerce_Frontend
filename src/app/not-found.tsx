import Link from "next/link";

import {
  CommerceBtn,
  CommerceHero,
  CommercePage,
  CommercePanel,
} from "@/components/commerce/commerce-ui";

export default function NotFound() {
  return (
    <CommercePage>
      <CommerceHero
        kicker="404"
        title="Page not found"
        description="The page you are looking for may have moved or no longer exists."
      />
      <CommercePanel>
        <p className="text-slate-300">
          Check the URL or return to the storefront to keep shopping.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <CommerceBtn href="/">Back to home</CommerceBtn>
          <CommerceBtn href="/products" variant="ghost">
            Browse products
          </CommerceBtn>
        </div>
      </CommercePanel>
    </CommercePage>
  );
}

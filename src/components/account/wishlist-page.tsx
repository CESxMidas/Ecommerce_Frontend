"use client";

import Link from "next/link";

import {
  AccountCard,
  AccountCardHeader,
  AccountEmptyState,
} from "@/components/account/account-ui";
import ProductItem from "@/components/product/product-item";
import { useCart } from "@/components/providers/cart-provider";

export default function WishlistPageClient() {
  const { wishlist } = useCart();
  const isEmpty = wishlist.length === 0;

  return (
    <AccountCard>
      <AccountCardHeader
        title="My List"
        description={
          <>
            There are <span className="font-bold text-white">{wishlist.length}</span>{" "}
            products in your wishlist
          </>
        }
        action={
          !isEmpty ? (
            <Link
              href="/products"
              className="text-sm font-semibold text-keyshop-blue hover:text-sky-300"
            >
              Continue shopping
            </Link>
          ) : null
        }
      />

      {isEmpty ? (
        <AccountEmptyState
          title="Your wishlist is empty"
          description="Save your favorite products to your wishlist and shop them later anytime."
          actionLabel="Continue Shopping"
          actionHref="/products"
        />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
          {wishlist.map((item, index) => (
            <ProductItem key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </AccountCard>
  );
}

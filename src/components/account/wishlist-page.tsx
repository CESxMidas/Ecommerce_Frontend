"use client";

import Link from "next/link";

import {
  AccountCard,
  AccountCardHeader,
  AccountEmptyState,
} from "@/components/account/account-ui";
import ProductItem from "@/components/product/product-item";
import { useWishlistCompare } from "@/components/providers/wishlist-compare-provider";

export default function WishlistPageClient() {
  const { wishlist } = useWishlistCompare();
  const isEmpty = wishlist.length === 0;

  return (
    <AccountCard>
      <AccountCardHeader
        title="Danh sách yêu thích"
        description={
          <>
            Bạn có <span className="font-bold text-white">{wishlist.length}</span>{" "}
            sản phẩm trong danh sách yêu thích
          </>
        }
        action={
          !isEmpty ? (
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center text-sm font-semibold text-keyshop-blue hover:text-sky-300"
            >
              Tiếp tục mua sắm
            </Link>
          ) : null
        }
      />

      {isEmpty ? (
        <AccountEmptyState
          title="Danh sách yêu thích trống"
          description="Lưu sản phẩm yêu thích để mua sau bất cứ lúc nào."
          actionLabel="Tiếp tục mua sắm"
          actionHref="/products"
        />
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-5 min-[400px]:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          {wishlist.map((item, index) => (
            <ProductItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </AccountCard>
  );
}

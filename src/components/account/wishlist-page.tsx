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
              className="text-sm font-semibold text-keyshop-blue hover:text-sky-300"
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] items-stretch gap-5">
          {wishlist.map((item, index) => (
            <ProductItem key={item.id} item={item} index={index} />
          ))}
        </div>
      )}
    </AccountCard>
  );
}

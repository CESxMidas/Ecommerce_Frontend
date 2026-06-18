"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";

import {
  CommerceActions,
  CommerceBtn,
  CommerceHero,
  CommercePage,
  CommercePanel,
} from "@/components/commerce/commerce-ui";
import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/utils/format";
import {
  getDeliveryLabel,
  getProductDisplayName,
  getProductThumbnail,
  getProductTypeLabel,
  getSalePrice,
} from "@/lib/utils/product-schema";
import type { NormalizedProduct } from "@/types/cart";

const rows: [string, (item: NormalizedProduct) => string | number][] = [
  ["Vendor", (item) => item.vendor || item.brand || "-"],
  ["Category", (item) => item.categoryName || "-"],
  ["Price", (item) => formatPrice(getSalePrice(item))],
  ["Rating", (item) => `${Number(item.rating || 0).toFixed(1)} / 5`],
  ["Reviews", (item) => item.reviewsCount || 0],
  ["Stock", (item) => (item.stock > 0 ? `${item.stock} available` : "Out of stock")],
  ["Type", (item) => getProductTypeLabel(item)],
  ["Delivery", (item) => getDeliveryLabel(item)],
  ["SKU", (item) => item.sku || "-"],
];

export default function ComparePageClient() {
  const { compareItems, addToCart, removeFromCompare, clearCompare } = useCart();

  return (
    <CommercePage>
      <CommerceHero
        kicker="Compare"
        title="Compare Products"
        description="Compare up to four products side by side before adding the right license to your cart."
      />

      {compareItems.length === 0 ? (
        <CommercePanel>
          <h2 className="text-xl font-extrabold text-white">No products selected</h2>
          <p className="mt-2 text-slate-300">
            Use the compare icon on product cards to add items here.
          </p>
          <CommerceActions>
            <CommerceBtn href="/products">Browse products</CommerceBtn>
          </CommerceActions>
        </CommercePanel>
      ) : (
        <CommercePanel>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <CommerceBtn href="/products" variant="ghost">
              Add more products
            </CommerceBtn>
            <CommerceBtn onClick={clearCompare}>Clear compare</CommerceBtn>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-keyshop-line px-4 py-3 text-left font-extrabold text-slate-400">
                    Product
                  </th>
                  {compareItems.map((item) => (
                    <th
                      key={item.id}
                      className="border-b border-keyshop-line px-4 py-3 text-left align-top"
                    >
                      <div className="flex flex-col items-start gap-3">
                        <div className="relative h-24 w-24 overflow-hidden rounded-[18px] bg-white/10">
                          <Image
                            src={getProductThumbnail(item)}
                            alt={getProductDisplayName(item)}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        <Link
                          href={`/products/${item.slug || item.id}`}
                          className="font-bold text-white hover:text-keyshop-blue"
                        >
                          {getProductDisplayName(item)}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([label, getValue]) => (
                  <tr key={label}>
                    <td className="border-b border-keyshop-line px-4 py-3 font-bold text-slate-400">
                      {label}
                    </td>
                    {compareItems.map((item) => (
                      <td
                        key={`${item.id}-${label}`}
                        className="border-b border-keyshop-line px-4 py-3 text-slate-200"
                      >
                        {getValue(item)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-4 font-bold text-slate-400">Action</td>
                  {compareItems.map((item) => (
                    <td key={`${item.id}-action`} className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <CommerceBtn onClick={() => addToCart(item)}>
                          <ShoppingCart className="h-4 w-4" />
                          Add
                        </CommerceBtn>
                        <button
                          type="button"
                          className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-control border border-sky-400/35 text-sky-200 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
                          onClick={() => removeFromCompare(item.id)}
                          aria-label="Remove from compare"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CommercePanel>
      )}
    </CommercePage>
  );
}

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
  ["Nhà cung cấp", (item) => item.vendor || item.brand || "-"],
  ["Danh mục", (item) => item.categoryName || "-"],
  ["Giá", (item) => formatPrice(getSalePrice(item))],
  ["Đánh giá", (item) => `${Number(item.rating || 0).toFixed(1)} / 5`],
  ["Nhận xét", (item) => item.reviewsCount || 0],
  ["Tồn kho", (item) => (item.stock > 0 ? `Còn ${item.stock}` : "Hết hàng")],
  ["Loại", (item) => getProductTypeLabel(item)],
  ["Giao hàng", (item) => getDeliveryLabel(item)],
  ["SKU", (item) => item.sku || "-"],
];

export default function ComparePageClient() {
  const { compareItems, addToCart, removeFromCompare, clearCompare } = useCart();

  return (
    <CommercePage>
      <CommerceHero
        kicker="So sánh"
        title="So sánh sản phẩm"
        description="So sánh tối đa bốn sản phẩm cạnh nhau trước khi thêm bản quyền phù hợp vào giỏ hàng."
      />

      {compareItems.length === 0 ? (
        <CommercePanel>
          <h2 className="text-xl font-extrabold text-white">Chưa chọn sản phẩm</h2>
          <p className="mt-2 text-slate-300">
            Bấm biểu tượng so sánh trên thẻ sản phẩm để thêm vào đây.
          </p>
          <CommerceActions>
            <CommerceBtn href="/products">Xem sản phẩm</CommerceBtn>
          </CommerceActions>
        </CommercePanel>
      ) : (
        <CommercePanel>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <CommerceBtn href="/products" variant="ghost">
              Thêm sản phẩm
            </CommerceBtn>
            <CommerceBtn onClick={clearCompare}>Xóa danh sách so sánh</CommerceBtn>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-keyshop-line px-4 py-3 text-left font-extrabold text-slate-400">
                    Sản phẩm
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
                  <td className="px-4 py-4 font-bold text-slate-400">Thao tác</td>
                  {compareItems.map((item) => (
                    <td key={`${item.id}-action`} className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <CommerceBtn onClick={() => addToCart(item)}>
                          <ShoppingCart className="h-4 w-4" />
                          Thêm
                        </CommerceBtn>
                        <button
                          type="button"
                          className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-control border border-sky-400/35 text-sky-200 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
                          onClick={() => removeFromCompare(item.id)}
                          aria-label="Xóa khỏi danh sách so sánh"
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

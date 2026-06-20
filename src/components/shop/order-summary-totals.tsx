import { formatPrice } from "@/lib/utils/format";
import { getPayableCartTotal } from "@/lib/utils/cart-storage";
import type { AppliedCoupon, CartSummary } from "@/types/cart";

type OrderSummaryTotalsProps = {
  cartSummary: CartSummary;
  effectiveCoupon?: AppliedCoupon | null;
  totalClassName?: string;
};

export function OrderSummaryTotals({
  cartSummary,
  effectiveCoupon = null,
  totalClassName = "text-2xl font-extrabold text-white",
}: OrderSummaryTotalsProps) {
  const payableTotal = getPayableCartTotal(cartSummary, effectiveCoupon);

  return (
    <div className="space-y-3">
      {cartSummary.savings > 0 ? (
        <>
          <div className="flex justify-between">
            <span className="text-keyshop-muted">Giá gốc</span>
            <span className="text-white/45 line-through">
              {formatPrice(cartSummary.listSubtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-keyshop-muted">Giảm giá sản phẩm</span>
            <span className="font-semibold text-keyshop-green">
              -{formatPrice(cartSummary.savings)}
            </span>
          </div>
        </>
      ) : null}

      <div className="flex justify-between">
        <span className="text-keyshop-muted">Tạm tính</span>
        <span className="font-semibold text-white">
          {formatPrice(cartSummary.subtotal)}
        </span>
      </div>

      {effectiveCoupon?.discount ? (
        <div className="flex justify-between">
          <span className="text-keyshop-muted">Mã giảm ({effectiveCoupon.code})</span>
          <span className="font-semibold text-keyshop-green">
            -{formatPrice(effectiveCoupon.discount)}
          </span>
        </div>
      ) : null}

      <div className="flex justify-between">
        <span className="text-keyshop-muted">Giao hàng</span>
        <span className="text-keyshop-green">Miễn phí</span>
      </div>

      <div className={`flex justify-between border-t border-keyshop-line pt-4 ${totalClassName}`}>
        <span>Tổng cộng</span>
        <span>{formatPrice(payableTotal)}</span>
      </div>
    </div>
  );
}

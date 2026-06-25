"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import {
  AccountCard,
  AccountCardHeader,
} from "@/components/account/account-ui";
import { useCartCore } from "@/components/providers/cart-provider";
import { useSessionQuery } from "@/lib/hooks/use-session-query";
import {
  fetchOrderById,
  type Order,
} from "@/lib/services/order-service";
import { formatPrice } from "@/lib/utils/format";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import {
  formatOrderDisplayStatus,
  formatOrderPaymentSummary,
} from "@/lib/utils/order-display";

const PAYMENT_MESSAGES: Record<string, { type: "success" | "error"; message: string }> = {
  success: {
    type: "success",
    message: "Thanh toán thành công. Đơn hàng của bạn đang được xử lý.",
  },
  failed: {
    type: "error",
    message: "Thanh toán chưa hoàn tất. Bạn có thể thử thanh toán lại.",
  },
  invalid_signature: {
    type: "error",
    message: "Xác minh thanh toán thất bại. Vui lòng liên hệ bộ phận hỗ trợ.",
  },
  invalid_amount: {
    type: "error",
    message: "Số tiền thanh toán không khớp với đơn hàng này.",
  },
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-keyshop-line bg-white/[0.03] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-keyshop-muted">
        {label}
      </p>
      <p className="mt-1 font-extrabold text-white">{value}</p>
    </div>
  );
}

export default function OrderDetailPageClient({ orderId }: { orderId: string }) {
  const searchParams = useSearchParams();
  const paymentResult = searchParams.get("payment");
  const { completeCheckout, showLicenseKeysFromOrder } = useCartCore();
  const handledPaymentResultRef = useRef("");

  const loadOrder = useCallback(() => fetchOrderById(orderId), [orderId]);
  const {
    data: order,
    loading,
    reload,
  } = useSessionQuery<Order | null>(loadOrder, null);

  const error = !loading && !order ? "Không thể tải đơn hàng" : "";

  useEffect(() => {
    const paymentMessage = paymentResult
      ? PAYMENT_MESSAGES[paymentResult]
      : undefined;

    if (!paymentMessage) return;

    const paymentKey = `${orderId}:${paymentResult}`;

    if (handledPaymentResultRef.current === paymentKey) {
      return;
    }

    handledPaymentResultRef.current = paymentKey;

    if (paymentResult === "success") {
      completeCheckout();
      void reload().then(() => {
        // Modal opens after order refetch in effect below
      });
    }

    toast[paymentMessage.type](paymentMessage.message);
  }, [completeCheckout, orderId, paymentResult, reload]);

  useEffect(() => {
    if (paymentResult !== "success" || !order) return;

    const hasDigitalDelivery = order.items?.some(
      (item) => item.licenseKeys?.length || item.accountCredentials?.length,
    );

    if (hasDigitalDelivery && order.paymentStatus === "paid") {
      showLicenseKeysFromOrder(order);
    }
  }, [order, paymentResult, showLicenseKeysFromOrder]);

  if (loading) {
    return <p className="text-sm text-keyshop-muted">Đang tải đơn hàng...</p>;
  }

  if (error || !order) {
    return (
      <AccountCard className="text-center">
        <p className="text-keyshop-muted">{error || "Không tìm thấy đơn hàng"}</p>
        <div className="mt-4">
          <Link
            href="/account/orders"
            className="inline-flex min-h-[42px] items-center justify-center rounded-control border border-keyshop-line bg-white/[0.03] px-4 text-xs font-extrabold uppercase tracking-wide text-white transition hover:border-keyshop-blue/40"
          >
            Quay lại đơn hàng
          </Link>
        </div>
      </AccountCard>
    );
  }

  const currentOrderId = order.id || order.orderId;

  return (
    <AccountCard>
      <AccountCardHeader
        title={`Đơn hàng #${currentOrderId}`}
        description={`${formatOrderDisplayStatus(order)} · ${formatOrderPaymentSummary(order)}`}
        action={
          <Link
            href="/account/orders"
            className="inline-flex min-h-[42px] items-center justify-center rounded-control border border-keyshop-line bg-white/[0.03] px-4 text-xs font-extrabold uppercase tracking-wide text-white transition hover:border-keyshop-blue/40"
          >
            Quay lại đơn hàng
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Trạng thái" value={formatOrderDisplayStatus(order)} />
        <StatCard label="Thanh toán" value={formatOrderPaymentSummary(order)} />
        <StatCard label="Tổng tiền" value={formatPrice(order.total || 0)} />
        <StatCard label="Khách hàng" value={order.name || "—"} />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">
          Thông tin nhận hàng
        </h3>
        <p className="mt-2 text-sm text-keyshop-muted">
          {order.name} · {order.phone} · {order.email}
        </p>
        <p className="text-sm text-keyshop-muted">{order.address}</p>
      </div>

      <div className="mt-8">
        <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-white">
          Sản phẩm
        </h3>
        <div className="space-y-3">
          {(order.items || []).map((item) => (
            <div
              key={`${item.productId}-${item.quantity}`}
              className="flex flex-col gap-3 rounded-card border border-keyshop-line bg-white/[0.03] p-4 sm:flex-row sm:gap-4"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-control bg-white/10">
                <Image
                  src={
                    item.product?.thumbnail ||
                    item.product?.image ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={item.product?.name || "Sản phẩm"}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white">
                  {item.product?.name ||
                    item.product?.title ||
                    `Sản phẩm ${item.productId}`}
                </p>
                <p className="text-sm text-keyshop-muted">
                  Số lượng: {item.quantity}
                </p>
                {item.licenseKeys?.length ? (
                  <p className="mt-2 break-all text-sm text-sky-300">
                    Mã bản quyền: {item.licenseKeys.join(", ")}
                  </p>
                ) : null}
                {item.accountCredentials?.length ? (
                  <div className="mt-2 space-y-1 break-all text-sm text-sky-300">
                    {item.accountCredentials.map((credential, index) => (
                      <p key={`${credential.username}-${index}`}>
                        Tài khoản: {credential.username} / {credential.password}
                        {credential.note ? ` (${credential.note})` : ""}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>
              <p className="font-extrabold text-sky-400 sm:shrink-0">
                {formatPrice(item.product?.salePrice || item.product?.price || 0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AccountCard>
  );
}

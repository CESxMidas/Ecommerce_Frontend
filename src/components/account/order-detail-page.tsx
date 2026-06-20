"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import {
  AccountCard,
  AccountCardHeader,
} from "@/components/account/account-ui";
import { useCart } from "@/components/providers/cart-provider";
import {
  fetchOrderById,
  type Order,
} from "@/lib/services/order-service";
import { formatPrice } from "@/lib/utils/format";
import { getApiErrorMessage } from "@/lib/utils/api-error";

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
  const { completeCheckout } = useCart();
  const handledPaymentResultRef = useRef("");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchOrderById(orderId);
        if (!cancelled) {
          setOrder(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(getApiErrorMessage(err, "Không thể tải đơn hàng"));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

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
    }

    toast[paymentMessage.type](paymentMessage.message);
  }, [completeCheckout, orderId, paymentResult]);

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
        description={`${order.status || "Chờ xử lý"} · ${order.paymentStatus || order.paymentMethod || "Chờ thanh toán"}`}
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
        <StatCard label="Trạng thái" value={order.status || "Chờ xử lý"} />
        <StatCard
          label="Thanh toán"
          value={order.paymentStatus || order.paymentMethod || "Chờ xử lý"}
        />
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
              className="flex gap-4 rounded-card border border-keyshop-line bg-white/[0.03] p-4"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-control bg-white/10">
                <Image
                  src={
                    item.product?.thumbnail ||
                    item.product?.image ||
                    "/images/bypass/cerberus-banner.png"
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
                  <p className="mt-2 text-sm text-sky-300">
                    Mã bản quyền: {item.licenseKeys.join(", ")}
                  </p>
                ) : null}
              </div>
              <p className="font-extrabold text-sky-400">
                {formatPrice(item.product?.salePrice || item.product?.price || 0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AccountCard>
  );
}

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
    message: "Payment completed. Your order is being processed.",
  },
  failed: {
    type: "error",
    message: "Payment was not completed. You can try paying again.",
  },
  invalid_signature: {
    type: "error",
    message: "Payment verification failed. Please contact support.",
  },
  invalid_amount: {
    type: "error",
    message: "Payment amount did not match this order.",
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
          setError(getApiErrorMessage(err, "Could not load order"));
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
    return <p className="text-sm text-keyshop-muted">Loading order...</p>;
  }

  if (error || !order) {
    return (
      <AccountCard className="text-center">
        <p className="text-keyshop-muted">{error || "Order not found"}</p>
        <div className="mt-4">
          <Link
            href="/account/orders"
            className="inline-flex min-h-[42px] items-center justify-center rounded-control border border-keyshop-line bg-white/[0.03] px-4 text-xs font-extrabold uppercase tracking-wide text-white transition hover:border-keyshop-blue/40"
          >
            Back to orders
          </Link>
        </div>
      </AccountCard>
    );
  }

  const currentOrderId = order.id || order.orderId;

  return (
    <AccountCard>
      <AccountCardHeader
        title={`Order #${currentOrderId}`}
        description={`${order.status || "Pending"} · ${order.paymentStatus || order.paymentMethod || "Pending payment"}`}
        action={
          <Link
            href="/account/orders"
            className="inline-flex min-h-[42px] items-center justify-center rounded-control border border-keyshop-line bg-white/[0.03] px-4 text-xs font-extrabold uppercase tracking-wide text-white transition hover:border-keyshop-blue/40"
          >
            Back to orders
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Status" value={order.status || "Pending"} />
        <StatCard
          label="Payment"
          value={order.paymentStatus || order.paymentMethod || "Pending"}
        />
        <StatCard label="Total" value={formatPrice(order.total || 0)} />
        <StatCard label="Customer" value={order.name || "—"} />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">
          Delivery contact
        </h3>
        <p className="mt-2 text-sm text-keyshop-muted">
          {order.name} · {order.phone} · {order.email}
        </p>
        <p className="text-sm text-keyshop-muted">{order.address}</p>
      </div>

      <div className="mt-8">
        <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wide text-white">
          Items
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
                  alt={item.product?.name || "Product"}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white">
                  {item.product?.name ||
                    item.product?.title ||
                    `Product ${item.productId}`}
                </p>
                <p className="text-sm text-keyshop-muted">
                  Quantity: {item.quantity}
                </p>
                {item.licenseKeys?.length ? (
                  <p className="mt-2 text-sm text-sky-300">
                    License keys: {item.licenseKeys.join(", ")}
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

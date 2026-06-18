"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import { useCart } from "@/components/providers/cart-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    return <p className="text-muted-foreground">Loading order...</p>;
  }

  if (error || !order) {
    return (
      <Card className="border-border/60">
        <CardContent className="space-y-4 py-10 text-center">
          <p className="text-muted-foreground">{error || "Order not found"}</p>
          <Button asChild>
            <Link href="/account/orders">Back to orders</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentOrderId = order.id || order.orderId;

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle>Order #{currentOrderId}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="font-semibold">{order.status || "Pending"}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Payment</p>
            <p className="font-semibold">
              {order.paymentStatus || order.paymentMethod || "Pending"}
            </p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-semibold">{formatPrice(order.total || 0)}</p>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Customer</p>
            <p className="font-semibold">{order.name}</p>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">Delivery contact</h3>
          <p className="text-sm text-muted-foreground">
            {order.name} · {order.phone} · {order.email}
          </p>
          <p className="text-sm text-muted-foreground">{order.address}</p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Items</h3>
          <div className="space-y-3">
            {(order.items || []).map((item) => (
              <div
                key={`${item.productId}-${item.quantity}`}
                className="flex gap-4 rounded-xl border border-border p-4"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary/30">
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
                  <p className="font-medium">
                    {item.product?.name ||
                      item.product?.title ||
                      `Product ${item.productId}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                  {item.licenseKeys?.length ? (
                    <p className="mt-2 text-sm text-accent">
                      License keys: {item.licenseKeys.join(", ")}
                    </p>
                  ) : null}
                </div>
                <p className="font-semibold">
                  {formatPrice(item.product?.salePrice || item.product?.price || 0)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Button variant="outline" asChild>
          <Link href="/account/orders">Back to orders</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

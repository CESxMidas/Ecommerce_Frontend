"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  AccountActionButton,
  AccountCard,
  AccountCardHeader,
  AccountLoading,
} from "@/components/account/account-ui";
import { useCart } from "@/components/providers/cart-provider";
import {
  cancelOrder,
  fetchOrders,
  hideOrder,
  recreateVnpayPayment,
  type Order,
} from "@/lib/services/order-service";
import { formatPrice } from "@/lib/utils/format";
import { getApiErrorMessage } from "@/lib/utils/api-error";

const ORDERS_PER_PAGE = 5;

export default function OrdersPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeCheckout } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        const data = await fetchOrders();
        if (!cancelled) {
          setOrders(data);
          setCurrentPage(1);
        }
      } catch {
        if (!cancelled) {
          setOrders([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const paymentResult = searchParams.get("payment");

    if (!paymentResult) return;

    if (paymentResult === "success") {
      completeCheckout();
      toast.success("Payment completed");
    } else if (paymentResult === "failed") {
      toast.error("Payment was not completed");
    } else if (paymentResult === "invalid_signature") {
      toast.error("Payment verification failed");
    }

    router.replace("/account/orders");
  }, [completeCheckout, router, searchParams]);

  async function handleRePay(orderId: string) {
    try {
      setPayingId(orderId);
      const response = await recreateVnpayPayment(orderId);

      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
        return;
      }

      toast.error("Could not create payment link");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      const data = await fetchOrders().catch(() => []);
      setOrders(data);
      setCurrentPage(1);
    } finally {
      setPayingId(null);
    }
  }

  async function handleCancel(orderId: string) {
    try {
      await cancelOrder(orderId);
      toast.success("Order cancelled");
      setOrders(await fetchOrders());
      setCurrentPage(1);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleHideOrder(orderId: string) {
    const ok = window.confirm(
      "Remove this order from your order history? Admin records will remain unchanged.",
    );

    if (!ok) return;

    try {
      await hideOrder(orderId);
      setOrders((prev) =>
        prev.filter(
          (order) => String(order.id || order.orderId) !== String(orderId),
        ),
      );
      toast.success("Order removed from your history");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
  const pageStart = (currentPage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = orders.slice(pageStart, pageStart + ORDERS_PER_PAGE);

  return (
    <AccountCard>
      <AccountCardHeader
        title="My Orders"
        description={`${orders.length} order${orders.length !== 1 ? "s" : ""}`}
        action={
          !loading && orders.length > 0 ? (
            <span className="text-sm text-keyshop-muted">
              Page {currentPage} of {totalPages}
            </span>
          ) : null
        }
      />

      {loading ? (
        <AccountLoading label="Loading orders..." />
      ) : orders.length === 0 ? (
        <p className="text-sm text-keyshop-muted">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-keyshop-line text-keyshop-muted">
                  <tr>
                    <th className="py-3 pr-4">Order ID</th>
                    <th className="py-3 pr-4">Total</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Payment</th>
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => {
                    const currentOrderId = String(order.id || order.orderId);
                    const canPayOnline =
                      order.paymentMethod === "vnpay" &&
                      ["failed", "pending"].includes(order.paymentStatus || "");
                    const canCancel =
                      ["PendingPayment", "Processing", "Pending"].includes(
                        order.status || "",
                      ) &&
                      !order.items?.some((item) => item.licenseKeys?.length);

                    const statusLabel =
                      order.paymentStatus === "failed"
                        ? "Payment Failed"
                        : order.status === "PendingPayment"
                          ? "Pending Payment"
                          : order.paymentStatus === "pending" &&
                              order.paymentMethod === "vnpay"
                            ? "Awaiting Payment"
                            : order.paymentStatus === "paid"
                              ? order.status
                              : order.paymentStatus || order.status;

                    return (
                      <tr key={currentOrderId} className="border-b border-keyshop-line/60">
                        <td className="py-4 pr-4 text-white">#{currentOrderId}</td>
                        <td className="py-4 pr-4 text-keyshop-blue">
                          {formatPrice(order.total || 0)}
                        </td>
                        <td className="py-4 pr-4 text-white">{statusLabel}</td>
                        <td className="py-4 pr-4">
                          <div>
                            <p className="font-semibold text-white">
                              {order.paymentMethod === "vnpay"
                                ? "VNPay"
                                : order.paymentMethod === "cod"
                                  ? "Manual"
                                  : order.paymentMethod || "-"}
                            </p>
                            <p className="text-xs text-keyshop-muted">
                              {order.paymentStatus || "-"}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-keyshop-muted">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/account/orders/${currentOrderId}`}
                              className="inline-flex min-h-[42px] items-center justify-center rounded-control border border-keyshop-line bg-white/[0.03] px-4 text-xs font-extrabold uppercase tracking-wide text-white transition hover:border-keyshop-blue/40"
                            >
                              View
                            </Link>
                            {canPayOnline ? (
                              <AccountActionButton
                                onClick={() => handleRePay(currentOrderId)}
                                disabled={payingId === currentOrderId}
                              >
                                {payingId === currentOrderId
                                  ? "Processing..."
                                  : order.paymentStatus === "failed"
                                    ? "Pay again"
                                    : "Continue payment"}
                              </AccountActionButton>
                            ) : null}
                            {canCancel ? (
                              <AccountActionButton
                                variant="outline"
                                onClick={() => handleCancel(currentOrderId)}
                              >
                                Cancel
                              </AccountActionButton>
                            ) : null}
                            <AccountActionButton
                              variant="outline"
                              onClick={() => handleHideOrder(currentOrderId)}
                            >
                              Remove
                            </AccountActionButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 ? (
              <div className="flex items-center justify-center gap-2">
                <AccountActionButton
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                >
                  Prev
                </AccountActionButton>
                <span className="text-sm text-keyshop-muted">
                  {currentPage} / {totalPages}
                </span>
                <AccountActionButton
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                >
                  Next
                </AccountActionButton>
              </div>
            ) : null}
          </div>
        )}
    </AccountCard>
  );
}

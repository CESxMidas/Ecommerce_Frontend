"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  AccountActionButton,
  AccountCard,
  AccountCardHeader,
  AccountLoading,
} from "@/components/account/account-ui";
import { useCartCore } from "@/components/providers/cart-provider";
import { useSessionQuery } from "@/lib/hooks/use-session-query";
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

function getOrderStatusLabel(order: Order) {
  if (order.paymentStatus === "failed") return "Thanh toán thất bại";
  if (order.status === "PendingPayment") return "Chờ thanh toán";
  if (order.paymentStatus === "pending" && order.paymentMethod === "vnpay") {
    return "Đang chờ thanh toán";
  }
  if (order.paymentStatus === "paid") return order.status || "Đã thanh toán";
  return order.paymentStatus || order.status || "-";
}

function getPaymentMethodLabel(order: Order) {
  if (order.paymentMethod === "vnpay") return "VNPay";
  if (order.paymentMethod === "cod") return "Thủ công";
  return order.paymentMethod || "-";
}

function canPayOrderOnline(order: Order) {
  return (
    order.paymentMethod === "vnpay" &&
    ["failed", "pending"].includes(order.paymentStatus || "")
  );
}

function canCancelOrder(order: Order) {
  return (
    ["PendingPayment", "Processing", "Pending"].includes(order.status || "") &&
    !order.items?.some(
      (item) => item.licenseKeys?.length || item.accountCredentials?.length,
    )
  );
}

export default function OrdersPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeCheckout } = useCartCore();

  const loadOrders = useCallback(() => fetchOrders(), []);
  const { data: orders, loading, reload, setData } = useSessionQuery<Order[]>(
    loadOrders,
    [],
  );
  const [payingId, setPayingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const paymentResult = searchParams.get("payment");

    if (!paymentResult) return;

    if (paymentResult === "success") {
      completeCheckout();
      toast.success("Thanh toán thành công");
    } else if (paymentResult === "failed") {
      toast.error("Thanh toán chưa hoàn tất");
    } else if (paymentResult === "invalid_signature") {
      toast.error("Xác minh thanh toán thất bại");
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

      toast.error("Không thể tạo liên kết thanh toán");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      await reload();
      setCurrentPage(1);
    } finally {
      setPayingId(null);
    }
  }

  async function handleCancel(orderId: string) {
    try {
      await cancelOrder(orderId);
      toast.success("Đã hủy đơn hàng");
      await reload();
      setCurrentPage(1);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleHideOrder(orderId: string) {
    const ok = window.confirm(
      "Xóa đơn hàng này khỏi lịch sử? Dữ liệu quản trị vẫn được giữ nguyên.",
    );

    if (!ok) return;

    try {
      await hideOrder(orderId);
      setData((prev) =>
        prev.filter(
          (order) => String(order.id || order.orderId) !== String(orderId),
        ),
      );
      toast.success("Đã xóa đơn hàng khỏi lịch sử");
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
        title="Đơn hàng của tôi"
        description={`${orders.length} đơn hàng`}
        action={
          !loading && orders.length > 0 ? (
            <span className="text-sm text-keyshop-muted">
              Trang {currentPage} / {totalPages}
            </span>
          ) : null
        }
      />

      {loading ? (
        <AccountLoading label="Đang tải đơn hàng..." />
      ) : orders.length === 0 ? (
        <p className="text-sm text-keyshop-muted">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3 md:hidden">
            {paginatedOrders.map((order) => {
              const currentOrderId = String(order.id || order.orderId);
              const canPayOnline = canPayOrderOnline(order);
              const canCancel = canCancelOrder(order);
              const statusLabel = getOrderStatusLabel(order);

              return (
                <div
                  key={currentOrderId}
                  className="rounded-card border border-keyshop-line bg-white/[0.03] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">#{currentOrderId}</p>
                      <p className="mt-1 text-sm text-keyshop-muted">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                          : "-"}
                      </p>
                    </div>
                    <p className="text-lg font-extrabold text-keyshop-blue">
                      {formatPrice(order.total || 0)}
                    </p>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p className="text-white">{statusLabel}</p>
                    <p className="text-keyshop-muted">
                      {getPaymentMethodLabel(order)} · {order.paymentStatus || "-"}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/account/orders/${currentOrderId}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-control border border-keyshop-line bg-white/[0.03] px-4 text-xs font-extrabold uppercase tracking-wide text-white transition hover:border-keyshop-blue/40"
                    >
                      Xem
                    </Link>
                    {canPayOnline ? (
                      <AccountActionButton
                        onClick={() => handleRePay(currentOrderId)}
                        disabled={payingId === currentOrderId}
                      >
                        {payingId === currentOrderId
                          ? "Đang xử lý..."
                          : order.paymentStatus === "failed"
                            ? "Thanh toán lại"
                            : "Tiếp tục thanh toán"}
                      </AccountActionButton>
                    ) : null}
                    {canCancel ? (
                      <AccountActionButton
                        variant="outline"
                        onClick={() => handleCancel(currentOrderId)}
                      >
                        Hủy
                      </AccountActionButton>
                    ) : null}
                    <AccountActionButton
                      variant="outline"
                      onClick={() => handleHideOrder(currentOrderId)}
                    >
                      Xóa
                    </AccountActionButton>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-keyshop-line text-keyshop-muted">
                  <tr>
                    <th className="py-3 pr-4">Mã đơn</th>
                    <th className="py-3 pr-4">Tổng tiền</th>
                    <th className="py-3 pr-4">Trạng thái</th>
                    <th className="py-3 pr-4">Thanh toán</th>
                    <th className="py-3 pr-4">Ngày</th>
                    <th className="py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order) => {
                    const currentOrderId = String(order.id || order.orderId);
                    const canPayOnline = canPayOrderOnline(order);
                    const canCancel = canCancelOrder(order);
                    const statusLabel = getOrderStatusLabel(order);

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
                              {getPaymentMethodLabel(order)}
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
                              Xem
                            </Link>
                            {canPayOnline ? (
                              <AccountActionButton
                                onClick={() => handleRePay(currentOrderId)}
                                disabled={payingId === currentOrderId}
                              >
                                {payingId === currentOrderId
                                  ? "Đang xử lý..."
                                  : order.paymentStatus === "failed"
                                    ? "Thanh toán lại"
                                    : "Tiếp tục thanh toán"}
                              </AccountActionButton>
                            ) : null}
                            {canCancel ? (
                              <AccountActionButton
                                variant="outline"
                                onClick={() => handleCancel(currentOrderId)}
                              >
                                Hủy
                              </AccountActionButton>
                            ) : null}
                            <AccountActionButton
                              variant="outline"
                              onClick={() => handleHideOrder(currentOrderId)}
                            >
                              Xóa
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
                  Trước
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
                  Sau
                </AccountActionButton>
              </div>
            ) : null}
          </div>
        )}
    </AccountCard>
  );
}

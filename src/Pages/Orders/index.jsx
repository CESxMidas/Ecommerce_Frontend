import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AccountSidebar from "../AccountSidebar";
import { MyContext } from "../../App";
import {
  fetchOrders,
  recreateVnpayPayment,
} from "../../services/orderService";
import { formatPrice } from "../../utils/products";
import "./index.css";

const ORDERS_PER_PAGE = 5;

const MyOrders = () => {
  const context = useContext(MyContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const loadInitialOrders = async () => {
      try {
        const data = await fetchOrders();

        if (!cancelled) {
          setOrders(data);
          setCurrentPage(1);
        }
      } catch {
        if (!cancelled) {
          setOrders([]);
          setCurrentPage(1);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const paymentResult = new URLSearchParams(location.search).get("payment");

    if (!paymentResult) {
      return;
    }

    if (paymentResult === "success") {
      context.clearCart();
      localStorage.removeItem("appliedCoupon");
      context.openAlertBox("success", "Payment completed");
    } else if (paymentResult === "failed") {
      context.openAlertBox("error", "Payment was not completed");
    } else if (paymentResult === "invalid_signature") {
      context.openAlertBox("error", "Payment verification failed");
    }

    navigate(location.pathname, { replace: true });
  }, [context, location.pathname, location.search, navigate]);

  const handleRePay = async (orderId) => {
    try {
      setPayingId(orderId);
      const response = await recreateVnpayPayment(orderId);

      if (response?.paymentUrl) {
        window.location.href = response.paymentUrl;
        return;
      }

      context.openAlertBox("error", "Could not create payment link");
    } catch (error) {
      context.openAlertBox(
        "error",
        error.message || "Order expired or payment could not be recreated.",
      );
      const data = await fetchOrders().catch(() => []);
      setOrders(data);
      setCurrentPage(1);
    } finally {
      setPayingId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
  const pageStart = (currentPage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = orders.slice(pageStart, pageStart + ORDERS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <section className="orders">
      <div className="container">
        <div className="orders__wrapper">
          <AccountSidebar />

          <div className="orders__content">
            <div className="orders__panel">
              <div className="orders__header">
                <div>
                  <h2>My Orders</h2>
                  <p>
                    There are {orders.length} order
                    {orders.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {!loading && orders.length > 0 && (
                  <span className="orders__pageMeta">
                    Page {currentPage} of {totalPages}
                  </span>
                )}
              </div>

              {loading ? (
                <p className="orders__emptyState">Loading orders...</p>
              ) : orders.length === 0 ? (
                <p className="orders__emptyState">No orders yet.</p>
              ) : (
                <>
                <div className="orders__tableWrapper">
                  <table className="orders__table">
                    <thead>
                      <tr>
                        <th>ORDER ID</th>
                        <th>TOTAL</th>
                        <th>STATUS</th>
                        <th>PAYMENT</th>
                        <th>DATE</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedOrders.map((order) => {
                        const currentOrderId = order.id || order.orderId;
                        const canPayOnline =
                          order.paymentMethod === "vnpay" &&
                          ["failed", "pending"].includes(order.paymentStatus);
                        const statusLabel =
                          order.paymentStatus === "failed"
                            ? "Payment Failed"
                            : order.paymentStatus === "pending" &&
                                order.paymentMethod === "vnpay"
                              ? "Awaiting Payment"
                              : order.paymentStatus === "paid"
                                ? order.status
                                : order.paymentStatus || order.status;
                        const paymentLabel =
                          order.paymentMethod === "vnpay"
                            ? "VNPay"
                            : order.paymentMethod === "cod"
                              ? "Manual"
                              : order.paymentMethod || "-";

                        return (
                          <tr key={currentOrderId}>
                            <td>#{currentOrderId}</td>
                            <td>{formatPrice(order.total)}</td>
                            <td>
                              <span
                                className={`orders__status ${order.status?.toLowerCase()} ${order.paymentStatus?.toLowerCase()}`}
                              >
                                {statusLabel}
                              </span>
                            </td>
                            <td>
                              <div className="orders__paymentCell">
                                <strong>{paymentLabel}</strong>
                                <span>{order.paymentStatus || "-"}</span>
                              </div>
                            </td>
                            <td>
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString()
                                : "-"}
                            </td>
                            <td>
                              <div className="orders__actions">
                                <Link
                                  to={`/orders/${currentOrderId}`}
                                  className="orders__viewBtn"
                                >
                                  View
                                </Link>

                                {canPayOnline && (
                                  <button
                                    className="orders__repayBtn"
                                    onClick={() => handleRePay(currentOrderId)}
                                    disabled={payingId === currentOrderId}
                                  >
                                    {payingId === currentOrderId
                                      ? "Processing..."
                                      : order.paymentStatus === "failed"
                                        ? "Pay Again"
                                        : "Continue Payment"}
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="orders__pagination">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>

                    <div className="orders__pageButtons">
                      {pageNumbers.map((page) => (
                        <button
                          key={page}
                          type="button"
                          className={page === currentPage ? "active" : ""}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}

                {orders.some((order) =>
                  (order.items || []).some((item) => item.licenseKeys?.length)
                ) && (
                  <div className="orders__licenseHint">
                    License keys are available in order details and the License
                    Keys page.
                    <Link to="/licenses">View License Keys</Link>
                  </div>
                )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyOrders;

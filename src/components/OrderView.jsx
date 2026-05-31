import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrderById } from "../services/orderService";
import { formatPrice } from "../utils/products";

const OrderView = ({ initialOrder = null }) => {
  const { id } = useParams();
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(Boolean(id) && !initialOrder);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || initialOrder) return;

    let cancelled = false;

    const load = async () => {
      try {
        const data = await fetchOrderById(id);

        if (!cancelled) {
          setOrder(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not load order");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id, initialOrder]);

  if (loading) {
    return (
      <section className="commercePanel">
        <p>Loading order...</p>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="commercePanel">
        <p className="commerceNotice">{error || "Order not found"}</p>
        <div className="commerceActions">
          <Link to="/orders" className="commerceBtn">
            Back to orders
          </Link>
        </div>
      </section>
    );
  }

  const orderId = order.id || order.orderId;

  return (
    <section className="commercePanel">
      <div className="orderSummary">
        <div>
          <span>Order</span>
          <strong>#{orderId}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong>{order.status || "Pending"}</strong>
        </div>
        <div>
          <span>Payment</span>
          <strong>{order.paymentStatus || order.paymentMethod || "Pending"}</strong>
        </div>
        <div>
          <span>Total</span>
          <strong>{formatPrice(order.total || 0)}</strong>
        </div>
      </div>

      <h2>Customer</h2>
      <p>
        {order.name} - {order.phone} - {order.email}
      </p>
      <p>{order.address}</p>

      <h2>Items</h2>
      <div className="orderItems">
        {(order.items || []).map((item) => (
          <article key={`${item.productId}-${item.quantity}`} className="orderItem">
            <img
              src={item.product?.thumbnail || item.product?.image || "/images/bypass/cerberus-banner.png"}
              alt={item.product?.name || item.product?.title || "Product"}
            />
            <div>
              <h3>{item.product?.name || item.product?.title || `Product ${item.productId}`}</h3>
              <p>Quantity: {item.quantity}</p>
              {item.licenseKeys?.length > 0 && (
                <p>License keys: {item.licenseKeys.join(", ")}</p>
              )}
            </div>
            <strong>{formatPrice(item.product?.salePrice || item.product?.price || 0)}</strong>
          </article>
        ))}
      </div>
    </section>
  );
};

export default OrderView;

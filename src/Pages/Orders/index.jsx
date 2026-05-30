import { useEffect, useState } from "react";
import AccountSidebar from "../AccountSidebar";
import { fetchOrders } from "../../services/orderService";
import "./index.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <section className="orders">
      <div className="container">
        <div className="orders__wrapper">
          <AccountSidebar />

          <div className="orders__content">
            <div className="orders__header">
              <h2>My Orders</h2>

              <p>
                There are {orders.length} order
                {orders.length !== 1 ? "s" : ""}
              </p>
            </div>

            {loading ? (
              <p style={{ color: "#64748b" }}>Loading orders...</p>
            ) : orders.length === 0 ? (
              <p style={{ color: "#64748b" }}>No orders yet.</p>
            ) : (
              <>
                <div className="orders__tableWrapper">
                  <table className="orders__table">
                    <thead>
                      <tr>
                        <th>ORDER ID</th>
                        <th>TOTAL</th>
                        <th>STATUS</th>
                        <th>DATE</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>${order.total}</td>
                          <td>
                            <span
                              className={`orders__status ${order.status.toLowerCase()}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td>
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString()
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="orders__keys">
                  {orders.map((order) => {
                    const keyItems = (order.items || []).filter(
                      (item) => item.licenseKeys?.length,
                    );

                    if (keyItems.length === 0) {
                      return null;
                    }

                    return (
                      <div key={order.id} className="orders__keyCard">
                        <h3>Order #{order.id} — License keys</h3>

                        {keyItems.map((item) => (
                          <div key={item.productId} className="orders__keyRow">
                            <span>
                              {item.product?.name || item.product?.title}
                            </span>
                            <code>{item.licenseKeys.join(", ")}</code>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyOrders;

import { useState } from "react";
import { trackOrder } from "../../services/orderService";
import OrderView from "../../components/OrderView";

const TrackOrder = () => {
  const [form, setForm] = useState({ orderId: "", contact: "" });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const data = await trackOrder(form);
      setOrder(data);
    } catch (err) {
      setError(err.message || "Could not track this order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="commercePage">
      <div className="container">
        <div className="commerceShell">
          <header className="commerceHero">
            <span className="commerceKicker">Tracking</span>
            <h1>Order Tracking</h1>
            <p>Enter your order ID and email or phone number to check the latest order status.</p>
          </header>

          <section className="commercePanel">
            <form className="commerceForm" onSubmit={handleSubmit}>
              <div className="commerceField">
                <label>Order ID</label>
                <input
                  value={form.orderId}
                  onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                  placeholder="Example: 12345"
                  required
                />
              </div>
              <div className="commerceField">
                <label>Email or phone</label>
                <input
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  placeholder="Email or phone used on the order"
                  required
                />
              </div>
              <button type="submit" className="commerceBtn" disabled={loading}>
                {loading ? "Checking..." : "Track order"}
              </button>
            </form>

            {error && <p className="commerceNotice">{error}</p>}
          </section>

          {order && <OrderView initialOrder={order} />}
        </div>
      </div>
    </main>
  );
};

export default TrackOrder;

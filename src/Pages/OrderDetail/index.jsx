import OrderView from "../../components/OrderView";

const OrderDetail = () => (
  <main className="commercePage">
    <div className="container">
      <div className="commerceShell">
        <header className="commerceHero">
          <span className="commerceKicker">Order</span>
          <h1>Order Details</h1>
          <p>Review order status, payment state, delivery information and purchased items.</p>
        </header>

        <OrderView />
      </div>
    </div>
  </main>
);

export default OrderDetail;

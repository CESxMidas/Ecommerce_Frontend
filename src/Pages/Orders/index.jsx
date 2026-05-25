import AccountSidebar from "../AccountSidebar";

import "./index.css";

const MyOrders = () => {
  const orders = [
    {
      id: "84521",

      paymentId: "PAY12345",

      name: "Hoang Do",

      phone: "+84 123456789",

      address: "Ho Chi Minh City",

      pincode: "700000",

      total: 29.99,

      email: "test@gmail.com",

      userId: "USR001",

      status: "Delivered",
    },

    {
      id: "84522",

      paymentId: "PAY12346",

      name: "Hoang Do",

      phone: "+84 987654321",

      address: "Ha Noi",

      pincode: "100000",

      total: 59.99,

      email: "admin@gmail.com",

      userId: "USR002",

      status: "Pending",
    },
  ];

  return (
    <section className="orders">
      <div className="container">
        <div className="orders__wrapper">
          {/* SIDEBAR */}

          <AccountSidebar />

          {/* CONTENT */}

          <div className="orders__content">
            {/* HEADER */}

            <div className="orders__header">
              <h2>My Orders</h2>

              <p>
                There are {orders.length} orders
              </p>
            </div>

            {/* TABLE */}

            <div className="orders__tableWrapper">
              <table className="orders__table">
                <thead>
                  <tr>
                    <th>ORDER ID</th>

                    <th>PAYMENT ID</th>

                    <th>NAME</th>

                    <th>PHONE NUMBER</th>

                    <th>ADDRESS</th>

                    <th>PINCODE</th>

                    <th>TOTAL</th>

                    <th>EMAIL</th>

                    <th>USER ID</th>

                    <th>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        #{order.id}
                      </td>

                      <td>
                        {order.paymentId}
                      </td>

                      <td>
                        {order.name}
                      </td>

                      <td>
                        {order.phone}
                      </td>

                      <td>
                        {order.address}
                      </td>

                      <td>
                        {order.pincode}
                      </td>

                      <td>
                        ${order.total}
                      </td>

                      <td>
                        {order.email}
                      </td>

                      <td>
                        {order.userId}
                      </td>

                      <td>
                        <span
                          className={`orders__status ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyOrders;
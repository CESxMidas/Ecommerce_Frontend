import { useContext, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { MyContext } from "../../App";
import OrderView from "../../components/OrderView";

const PAYMENT_MESSAGES = {
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

const OrderDetail = () => {
  const context = useContext(MyContext);
  const location = useLocation();
  const navigate = useNavigate();
  const paymentResult = new URLSearchParams(location.search).get("payment");
  const handledPaymentResultRef = useRef("");

  useEffect(() => {
    const paymentMessage = PAYMENT_MESSAGES[paymentResult];

    if (!paymentMessage) {
      return;
    }

    const paymentKey = `${location.pathname}:${paymentResult}`;

    if (handledPaymentResultRef.current === paymentKey) {
      return;
    }

    handledPaymentResultRef.current = paymentKey;

    if (paymentResult === "success") {
      context.completeCheckout();
    }

    context.openAlertBox(paymentMessage.type, paymentMessage.message);
  }, [context, location.pathname, paymentResult]);

  useEffect(() => {
    if (!paymentResult) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(location.search);
      params.delete("payment");

      navigate(
        {
          pathname: location.pathname,
          search: params.toString() ? `?${params.toString()}` : "",
        },
        { replace: true },
      );
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [location.pathname, location.search, navigate, paymentResult]);

  return (
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
};

export default OrderDetail;

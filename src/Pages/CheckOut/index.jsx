import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { placeOrder } from "../../services/orderService";
import {
  getProductDisplayName,
  getProductThumbnail,
  getSalePrice,
} from "../../utils/productSchema";
import { formatPrice } from "../../utils/products";
import "./index.css";

const CheckOut = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const { cartItems, cartSummary } = context;

  /* ========================= */
  /* STATES */
  /* ========================= */

  const [loading, setLoading] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("card");

  const [formFields, setFormFields] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      city: "",
      address: "",
    });

  useEffect(() => {
    if (!context.user) return;

    const nameParts = (context.user.name || "").trim().split(" ");

    setFormFields((prev) => ({
      ...prev,
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: context.user.email || prev.email,
      phone: context.user.phone || prev.phone,
    }));
  }, [context.user]);

  /* ========================= */
  /* INPUT CHANGE */
  /* ========================= */

  const onChangeInput = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value,
    });
  };

  /* ========================= */
  /* VALIDATE */
  /* ========================= */

  const validateValue = () => {
    if (
      !formFields.firstName.trim()
    ) {
      context.openAlertBox(
        "error",
        "First name is required"
      );

      return false;
    }

    if (
      !formFields.lastName.trim()
    ) {
      context.openAlertBox(
        "error",
        "Last name is required"
      );

      return false;
    }

    if (!formFields.email.trim()) {
      context.openAlertBox(
        "error",
        "Email is required"
      );

      return false;
    }

    if (
      !/\S+@\S+\.\S+/.test(
        formFields.email
      )
    ) {
      context.openAlertBox(
        "error",
        "Invalid email format"
      );

      return false;
    }

    if (!formFields.phone.trim()) {
      context.openAlertBox(
        "error",
        "Phone number is required"
      );

      return false;
    }

    if (
      !formFields.address.trim()
    ) {
      context.openAlertBox(
        "error",
        "Address is required"
      );

      return false;
    }

    return true;
  };

  /* ========================= */
  /* PLACE ORDER */
  /* ========================= */

  const handlePlaceOrder = async () => {
    const isValid = validateValue();

    if (!isValid) return;

    if (cartItems.length === 0) {
      context.openAlertBox("error", "Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const order = await placeOrder({
        name: `${formFields.firstName} ${formFields.lastName}`.trim(),
        phone: formFields.phone,
        address: `${formFields.address}, ${formFields.city}, ${formFields.country}`,
        pincode: "000000",
        total: cartSummary.total,
        email: context.user?.email || formFields.email,
        userId: context.user?.email || formFields.email,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          product: item.product,
        })),
        paymentMethod,
      });

      await context.clearCart();

      context.showLicenseKeysFromOrder(order);

      context.openAlertBox(
        "success",
        "Order placed successfully"
      );

      if (!order?.items?.some((item) => item.licenseKeys?.length)) {
        navigate("/orders");
      }
    } catch (error) {
      context.openAlertBox(
        "error",
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="checkoutPage">
      <div className="container">
        <div className="checkoutWrapper">
          {/* LEFT */}
          <div className="checkoutLeft">
            {/* TOP */}
            <div className="checkoutCard">
              <h1>Checkout</h1>

              <p>
                Complete your order securely.
              </p>
            </div>

            {/* BILLING */}
            <div className="checkoutCard">
              <div className="cardTitle">
                Billing Details
              </div>

              <div className="checkoutForm">
                {/* FIRST NAME */}
                <div className="formGroup">
                  <label>
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={
                      formFields.firstName
                    }
                    onChange={
                      onChangeInput
                    }
                    placeholder="Enter first name"
                  />
                </div>

                {/* LAST NAME */}
                <div className="formGroup">
                  <label>
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={
                      formFields.lastName
                    }
                    onChange={
                      onChangeInput
                    }
                    placeholder="Enter last name"
                  />
                </div>

                {/* EMAIL */}
                <div className="formGroup fullWidth">
                  <label>
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      formFields.email
                    }
                    onChange={
                      onChangeInput
                    }
                    placeholder="Enter email"
                  />
                </div>

                {/* PHONE */}
                <div className="formGroup fullWidth">
                  <label>
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={
                      formFields.phone
                    }
                    onChange={
                      onChangeInput
                    }
                    placeholder="Enter phone number"
                  />
                </div>

                {/* COUNTRY */}
                <div className="formGroup">
                  <label>
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={
                      formFields.country
                    }
                    onChange={
                      onChangeInput
                    }
                    placeholder="Country"
                  />
                </div>

                {/* CITY */}
                <div className="formGroup">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={
                      formFields.city
                    }
                    onChange={
                      onChangeInput
                    }
                    placeholder="City"
                  />
                </div>

                {/* ADDRESS */}
                <div className="formGroup fullWidth">
                  <label>
                    Address
                  </label>

                  <textarea
                    rows="5"
                    name="address"
                    value={
                      formFields.address
                    }
                    onChange={
                      onChangeInput
                    }
                    placeholder="Enter your address"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="checkoutCard">
              <div className="cardTitle">
                Payment Method
              </div>

              <div className="paymentMethods">
                {/* CARD */}
                <label className="paymentBox">
                  <input
                    type="radio"
                    name="payment"
                    checked={
                      paymentMethod ===
                      "card"
                    }
                    onChange={() =>
                      setPaymentMethod(
                        "card"
                      )
                    }
                  />

                  <div>
                    <h4>
                      Credit / Debit Card
                    </h4>

                    <p>
                      Pay securely using Visa
                      or Mastercard.
                    </p>
                  </div>
                </label>

                {/* PAYPAL */}
                <label className="paymentBox">
                  <input
                    type="radio"
                    name="payment"
                    checked={
                      paymentMethod ===
                      "paypal"
                    }
                    onChange={() =>
                      setPaymentMethod(
                        "paypal"
                      )
                    }
                  />

                  <div>
                    <h4>PayPal</h4>

                    <p>
                      Fast and secure payment
                      using PayPal.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="checkoutRight">
            <div className="summaryCard">
              <h2>Order Summary</h2>

              {cartItems.map((item) => (
                <div className="summaryItem" key={item.productId}>
                  <img
                    src={getProductThumbnail(item.product)}
                    alt={getProductDisplayName(item.product)}
                  />

                  <div className="summaryInfo">
                    <h4>{getProductDisplayName(item.product)}</h4>

                    <span>Qty: {item.quantity}</span>

                    <div className="price">
                      {formatPrice(
                        getSalePrice(item.product) * item.quantity
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="summaryPrice">
                <div className="priceRow">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSummary.subtotal)}</span>
                </div>

                {cartSummary.savings > 0 && (
                  <div className="priceRow">
                    <span>Discount</span>
                    <span className="discount">
                      -{formatPrice(cartSummary.savings)}
                    </span>
                  </div>
                )}

                <div className="priceRow">
                  <span>Tax</span>
                  <span>{formatPrice(cartSummary.tax)}</span>
                </div>

                <div className="priceRow total">
                  <span>Total</span>
                  <span>{formatPrice(cartSummary.total)}</span>
                </div>
              </div>

              <button
                className="placeOrderBtn"
                onClick={handlePlaceOrder}
                disabled={loading || cartItems.length === 0}
              >
                {loading
                  ? "Processing..."
                  : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;
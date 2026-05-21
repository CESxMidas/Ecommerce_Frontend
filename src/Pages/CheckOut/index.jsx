import { useContext, useState } from "react";

import { MyContext } from "../../App";

import "./index.css";

const CheckOut = () => {
  const context = useContext(MyContext);

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

  const placeOrder = async () => {
    const isValid = validateValue();

    if (!isValid) return;

    try {
      setLoading(true);

      await new Promise((resolve) =>
        setTimeout(resolve, 1500)
      );

      console.log({
        ...formFields,
        paymentMethod,
      });

      context.openAlertBox(
        "success",
        "Order placed successfully"
      );
    } catch (error) {
        console.log(error);
        
      context.openAlertBox(
        "error",
        "Something went wrong"
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

              {/* ITEM */}
              <div className="summaryItem">
                <img
                  src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop"
                  alt=""
                />

                <div className="summaryInfo">
                  <h4>
                    Windows 11 Pro Key
                  </h4>

                  <span>
                    Qty: 1
                  </span>

                  <div className="price">
                    $29.99
                  </div>
                </div>
              </div>

              {/* TOTAL */}
              <div className="summaryPrice">
                <div className="priceRow">
                  <span>
                    Subtotal
                  </span>

                  <span>
                    $29.99
                  </span>
                </div>

                <div className="priceRow">
                  <span>
                    Discount
                  </span>

                  <span className="discount">
                    -$5.00
                  </span>
                </div>

                <div className="priceRow">
                  <span>Tax</span>

                  <span>
                    $2.00
                  </span>
                </div>

                <div className="priceRow total">
                  <span>Total</span>

                  <span>
                    $26.99
                  </span>
                </div>
              </div>

              {/* BUTTON */}
              <button
                className="placeOrderBtn"
                onClick={placeOrder}
                disabled={loading}
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
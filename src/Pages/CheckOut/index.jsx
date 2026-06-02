import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import { placeOrder } from "../../services/orderService";
import { fetchAddresses } from "../../services/userService";
import {
  getProductDisplayName,
  getProductThumbnail,
  getCartItemSalePrice,
  getDeliveryLabel,
  isPhysicalProduct,
} from "../../utils/productSchema";
import { formatPrice } from "../../utils/products";
import "./index.css";

const CheckOut = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const { cartItems, cartSummary } = context;
  const allItemsAllowCod =
    cartItems.length > 0 &&
    cartItems.every((item) => isPhysicalProduct(item.product));
  const hasDigitalItems = cartItems.some(
    (item) => !isPhysicalProduct(item.product),
  );

  /* ========================= */
  /* STATES */
  /* ========================= */

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [formFields, setFormFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    pincode: "",
    address: "",
  });

  /* ========================= */
  /* EFFECT: PREFILL CUSTOMER AND SAVED ADDRESS */
  /* ========================= */
  useEffect(() => {
    if (!context.user) return;

    const nameParts = (context.user.name || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const loadDefaultAddress = async () => {
      try {
        const data = await fetchAddresses();
        let savedAddresses = [];

        if (Array.isArray(data)) {
          savedAddresses = data;
        } else if (Array.isArray(data?.addresses)) {
          savedAddresses = data.addresses;
        }

        if (savedAddresses.length > 0) {
          setSavedAddresses(savedAddresses);
          const defaultAddr =
            savedAddresses.find((address) => address.isDefault) ||
            savedAddresses[0];
          setSelectedAddressId(defaultAddr.id || defaultAddr._id || "");

          setFormFields({
            firstName,
            lastName,
            email: context.user.email || "",
            phone: context.user.phone || "",
            country: defaultAddr.country || "",
            city: defaultAddr.city || "",
            pincode: defaultAddr.pincode || "",
            address: defaultAddr.address_line || "",
          });
        } else {
          setFormFields({
            firstName,
            lastName,
            email: context.user.email || "",
            phone: context.user.phone || "",
            country: "",
            city: "",
            pincode: "",
            address: "",
          });
        }
      } catch (error) {
        console.error("Failed to load checkout address:", error);
        setFormFields({
          firstName,
          lastName,
          email: context.user.email || "",
          phone: context.user.phone || "",
          country: "",
          city: "",
          pincode: "",
          address: "",
        });
      }
    };

    loadDefaultAddress();
  }, [context.user]);

  const applySavedAddress = (addressId) => {
    setSelectedAddressId(addressId);

    const selected = savedAddresses.find(
      (address) => String(address.id || address._id) === String(addressId),
    );

    if (!selected) return;

    setFormFields((prev) => ({
      ...prev,
      phone: selected.mobile || prev.phone,
      country: selected.country || "",
      city: selected.city || "",
      pincode: selected.pincode || "",
      address: selected.address_line || "",
    }));
  };

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
    if (!formFields.firstName.trim()) {
      context.openAlertBox("error", "First name is required");
      return false;
    }

    if (!formFields.lastName.trim()) {
      context.openAlertBox("error", "Last name is required");
      return false;
    }

    if (!formFields.email.trim()) {
      context.openAlertBox("error", "Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formFields.email)) {
      context.openAlertBox("error", "Invalid email format");
      return false;
    }

    if (!formFields.phone.trim()) {
      context.openAlertBox("error", "Phone number is required");
      return false;
    }

    if (!/^[0-9+\-\s()]{8,20}$/.test(formFields.phone.trim())) {
      context.openAlertBox("error", "Invalid phone number");
      return false;
    }

    if (!formFields.address.trim()) {
      context.openAlertBox("error", "Address is required");
      return false;
    }

    if (!formFields.city.trim()) {
      context.openAlertBox("error", "City is required");
      return false;
    }

    if (
      formFields.pincode.trim() &&
      !/^[A-Za-z0-9\-\s]{3,12}$/.test(formFields.pincode.trim())
    ) {
      context.openAlertBox("error", "Invalid pincode");
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

    if (!paymentMethod) {
      context.openAlertBox("error", "Please choose a payment method");
      return;
    }

    if (!allItemsAllowCod && paymentMethod === "cod") {
      context.openAlertBox(
        "error",
        "COD is only available for physical products",
      );
      return;
    }

    if (cartItems.length === 0) {
      context.openAlertBox("error", "Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      let appliedCoupon = null;

      try {
        appliedCoupon = JSON.parse(
          localStorage.getItem("appliedCoupon") || "null"
        );
      } catch {
        appliedCoupon = null;
      }

      const order = await placeOrder({
        name: `${formFields.firstName} ${formFields.lastName}`.trim(),
        phone: formFields.phone,
        address: `${formFields.address}${formFields.city ? `, ${formFields.city}` : ""}${formFields.country ? `, ${formFields.country}` : ""}`,
        pincode: formFields.pincode.trim() || "DIGITAL",
        total: cartSummary.total,
        email: context.user?.email || formFields.email,
        userId: context.user?.email || formFields.email,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          variant: item.variant || null,
          product: item.product,
        })),
        paymentMethod,
        couponCode: appliedCoupon?.code || "",
      });

      if (order?.paymentUrl) {
        window.location.href = order.paymentUrl;
        return;
      }

      await context.completeCheckout();

      context.showLicenseKeysFromOrder(order);

      context.openAlertBox("success", "Order placed successfully");

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
              <p>Confirm your account details for digital license delivery.</p>
            </div>

            {/* BILLING */}
            <div className="checkoutCard">
              <div className="cardTitle">Delivery Contact</div>

              {savedAddresses.length > 0 && (
                <div className="checkoutForm" style={{ marginBottom: 18 }}>
                  <div className="formGroup fullWidth">
                    <label>Saved Address</label>
                    <select
                      value={selectedAddressId}
                      onChange={(event) =>
                        applySavedAddress(event.target.value)
                      }
                    >
                      {savedAddresses.map((address) => (
                        <option
                          key={address.id || address._id}
                          value={address.id || address._id}
                        >
                          {address.isDefault ? "Default - " : ""}
                          {address.label || address.address_line},{" "}
                          {address.city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="checkoutForm">
                {/* FIRST NAME */}
                <div className="formGroup">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formFields.firstName}
                    onChange={onChangeInput}
                    placeholder="Enter first name"
                  />
                </div>

                {/* LAST NAME */}
                <div className="formGroup">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formFields.lastName}
                    onChange={onChangeInput}
                    placeholder="Enter last name"
                  />
                </div>

                {/* EMAIL */}
                <div className="formGroup fullWidth">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formFields.email}
                    onChange={onChangeInput}
                    placeholder="Enter email"
                  />
                </div>

                {/* PHONE */}
                <div className="formGroup fullWidth">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formFields.phone}
                    onChange={onChangeInput}
                    placeholder="Enter phone number"
                  />
                </div>

                {/* COUNTRY */}
                <div className="formGroup">
                  <label>Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formFields.country}
                    onChange={onChangeInput}
                    placeholder="Country"
                  />
                </div>

                {/* CITY */}
                <div className="formGroup">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formFields.city}
                    onChange={onChangeInput}
                    placeholder="City"
                  />
                </div>

                <div className="formGroup">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formFields.pincode}
                    onChange={onChangeInput}
                    placeholder="Postal or ZIP code"
                  />
                </div>

                {/* ADDRESS */}
                <div className="formGroup fullWidth">
                  <label>Billing Address</label>
                  <textarea
                    rows="5"
                    name="address"
                    value={formFields.address}
                    onChange={onChangeInput}
                    placeholder="Enter billing address"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="checkoutCard">
              <div className="cardTitle">Payment Method</div>

              <div className={`checkoutPaymentBanner ${hasDigitalItems ? "digital" : "physical"}`}>
                <strong>
                  {hasDigitalItems
                    ? "VNPay required for this cart"
                    : "COD and VNPay are available"}
                </strong>
                <span>
                  {hasDigitalItems
                    ? "Keys, accounts and service products are delivered only after successful online payment."
                    : "This cart contains only physical hardware, so the customer can choose COD or VNPay."}
                </span>
              </div>

              <div className="paymentMethods">
                {allItemsAllowCod && (
                  <label className="paymentBox">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <div>
                      <h4>Manual Confirmation</h4>
                      <p>Pay after receiving eligible physical products.</p>
                    </div>
                  </label>
                )}

                {/* VNPAY */}
                <label className="paymentBox">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "vnpay"}
                    onChange={() => setPaymentMethod("vnpay")}
                  />
                  <div>
                    <h4>VNPay</h4>
                    <p>Pay securely through the VNPay gateway.</p>
                  </div>
                </label>
              </div>

              {hasDigitalItems && (
                <p className="checkoutPaymentNote">
                  Digital products require online payment. COD is only
                  available when every item is physical hardware.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="checkoutRight">
            <div className="summaryCard">
              <h2>Order Summary</h2>

              {cartItems.map((item) => (
                <div className="summaryItem" key={`${item.productId}-${item.variant?.id || "default"}`}>
                  <img
                    src={getProductThumbnail(item.product)}
                    alt={getProductDisplayName(item.product)}
                  />
                  <div className="summaryInfo">
                    <h4>{getProductDisplayName(item.product)}</h4>
                    <div className="summaryMeta">
                      <span>Qty: {item.quantity}</span>
                      {item.variant && (
                        <span className="summaryVariant">
                          {item.variant.color && (
                            <i style={{ background: item.variant.color }} />
                          )}
                          {item.variant.name}
                        </span>
                      )}
                      <span>{getDeliveryLabel(item.product)}</span>
                    </div>
                    <div className="price">
                      {formatPrice(
                        getCartItemSalePrice(item) * item.quantity
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
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOut;

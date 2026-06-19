"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useCart } from "@/components/providers/cart-provider";
import { placeOrder } from "@/lib/services/order-service";
import { fetchAddresses } from "@/lib/services/user-service";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/format";
import {
  getCartItemSalePrice,
  getDeliveryLabel,
  getProductDisplayName,
  getProductThumbnail,
  isPhysicalProduct,
} from "@/lib/utils/product-schema";
import type { AppliedCoupon, UserAddress } from "@/types/cart";
import { getCheckoutErrorMessage } from "@/lib/utils/order-errors";

type CheckoutForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  pincode: string;
  address: string;
};

const emptyForm: CheckoutForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  pincode: "",
  address: "",
};

const fieldClass =
  "h-auto w-full rounded-control border border-keyshop-line bg-white/[0.03] px-[18px] py-4 text-[15px] text-white outline-none placeholder:text-white/30 focus:border-keyshop-blue focus:ring-4 focus:ring-keyshop-blue/15";

const labelClass = "mb-2 block text-sm font-bold text-white";

const checkoutCtaClass =
  "flex h-[58px] w-full items-center justify-center rounded-[18px] bg-gradient-to-br from-keyshop-blue-hover to-keyshop-blue text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none";

export default function CheckoutPageClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const {
    cartItems,
    cartSummary,
    clearCart,
    completeCheckout,
    showLicenseKeysFromOrder,
  } = useCart();

  const allItemsAllowCod =
    cartItems.length > 0 &&
    cartItems.every((item) => isPhysicalProduct(item.product));
  const hasDigitalItems = cartItems.some(
    (item) => !isPhysicalProduct(item.product),
  );

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"vnpay" | "cod">("vnpay");
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [formFields, setFormFields] = useState<CheckoutForm>(emptyForm);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    if (typeof window === "undefined") return null;

    try {
      return JSON.parse(localStorage.getItem("appliedCoupon") || "null");
    } catch {
      return null;
    }
  });

  const hasValidCoupon =
    appliedCoupon &&
    cartSummary.subtotal > 0 &&
    Number(appliedCoupon.subtotal) === Number(cartSummary.subtotal);
  const effectiveCoupon = hasValidCoupon ? appliedCoupon : null;
  const displayTotal = effectiveCoupon
    ? effectiveCoupon.total + (cartSummary.subtotal > 0 ? cartSummary.tax : 0)
    : cartSummary.total;

  useEffect(() => {
    if (appliedCoupon && !hasValidCoupon) {
      localStorage.removeItem("appliedCoupon");
      setAppliedCoupon(null);
    }
  }, [appliedCoupon, hasValidCoupon]);

  useEffect(() => {
    if (!session?.user) return;

    const nameParts = (session.user.name || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const loadDefaultAddress = async () => {
      try {
        const data = await fetchAddresses();
        let addresses: UserAddress[] = [];

        if (Array.isArray(data)) {
          addresses = data;
        } else if (Array.isArray(data?.addresses)) {
          addresses = data.addresses;
        }

        if (addresses.length > 0) {
          setSavedAddresses(addresses);
          const defaultAddr =
            addresses.find((address) => address.isDefault) || addresses[0];
          setSelectedAddressId(defaultAddr.id || defaultAddr._id || "");

          setFormFields({
            firstName,
            lastName,
            email: session.user.email || "",
            phone: "",
            country: defaultAddr.country || "",
            city: defaultAddr.city || "",
            pincode: defaultAddr.pincode || "",
            address: defaultAddr.address_line || "",
          });
        } else {
          setFormFields({
            firstName,
            lastName,
            email: session.user.email || "",
            phone: "",
            country: "",
            city: "",
            pincode: "",
            address: "",
          });
        }
      } catch {
        setFormFields({
          firstName,
          lastName,
          email: session.user.email || "",
          phone: "",
          country: "",
          city: "",
          pincode: "",
          address: "",
        });
      }
    };

    loadDefaultAddress();
  }, [session?.user]);

  const applySavedAddress = (addressId: string) => {
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

  const onChangeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormFields({
      ...formFields,
      [event.target.name]: event.target.value,
    });
  };

  const validateValue = () => {
    if (!formFields.firstName.trim()) {
      toast.error("First name is required");
      return false;
    }

    if (!formFields.lastName.trim()) {
      toast.error("Last name is required");
      return false;
    }

    if (!formFields.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formFields.email)) {
      toast.error("Invalid email format");
      return false;
    }

    if (!formFields.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }

    if (!/^[0-9+\-\s()]{8,20}$/.test(formFields.phone.trim())) {
      toast.error("Invalid phone number");
      return false;
    }

    if (!formFields.address.trim()) {
      toast.error("Address is required");
      return false;
    }

    if (!formFields.city.trim()) {
      toast.error("City is required");
      return false;
    }

    if (
      formFields.pincode.trim() &&
      !/^[A-Za-z0-9\-\s]{3,12}$/.test(formFields.pincode.trim())
    ) {
      toast.error("Invalid pincode");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateValue()) return;

    if (!allItemsAllowCod && paymentMethod === "cod") {
      toast.error("COD is only available for physical products");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      let appliedCouponForOrder: AppliedCoupon | null = effectiveCoupon;

      if (
        appliedCouponForOrder &&
        Number(appliedCouponForOrder.subtotal) !== Number(cartSummary.subtotal)
      ) {
        localStorage.removeItem("appliedCoupon");
        appliedCouponForOrder = null;
      }

      const order = await placeOrder({
        name: `${formFields.firstName} ${formFields.lastName}`.trim(),
        phone: formFields.phone,
        address: `${formFields.address}${formFields.city ? `, ${formFields.city}` : ""}${formFields.country ? `, ${formFields.country}` : ""}`,
        pincode: formFields.pincode.trim() || "DIGITAL",
        total: displayTotal,
        email: session?.user?.email || formFields.email,
        userId: session?.user?.email || formFields.email,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          variant: item.variant || null,
          product: item.product,
        })),
        paymentMethod,
        couponCode: appliedCouponForOrder?.code || "",
      });

      if (order?.paymentUrl) {
        localStorage.removeItem("appliedCoupon");
        await clearCart();
        window.location.href = order.paymentUrl;
        return;
      }

      await completeCheckout();
      showLicenseKeysFromOrder(order);
      toast.success("Order placed successfully");

      if (!order?.items?.some((item) => item.licenseKeys?.length)) {
        router.push("/account/orders");
      }
    } catch (error) {
      toast.error(getCheckoutErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-h-screen py-10 pb-16">
      <div className="grid gap-6 lg:grid-cols-[7fr_3fr]">
        <div className="space-y-6">
          <div className="rounded-card border border-keyshop-line bg-white/[0.03] p-7 backdrop-blur-xl">
            <h1 className="text-[34px] font-extrabold text-white">Checkout</h1>
            <p className="mt-2 text-sm text-keyshop-muted">
              Confirm your account details for digital license delivery.
            </p>
          </div>

          <div className="rounded-card border border-keyshop-line bg-white/[0.03] p-7 backdrop-blur-xl">
            <h2 className="text-[22px] font-bold text-white">Delivery Contact</h2>
            <div className="mt-5 space-y-4">
              {savedAddresses.length > 0 ? (
                <div>
                  <label htmlFor="saved-address" className={labelClass}>
                    Saved Address
                  </label>
                  <select
                    id="saved-address"
                    className={fieldClass}
                    value={selectedAddressId}
                    onChange={(event) => applySavedAddress(event.target.value)}
                  >
                    {savedAddresses.map((address) => (
                      <option
                        key={address.id || address._id}
                        value={address.id || address._id}
                        className="bg-keyshop-bg"
                      >
                        {address.isDefault ? "Default - " : ""}
                        {address.label || address.address_line}, {address.city}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <form className="grid gap-4 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="firstName" className={labelClass}>
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={formFields.firstName}
                    onChange={onChangeInput}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className={labelClass}>
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={formFields.lastName}
                    onChange={onChangeInput}
                    className={fieldClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formFields.email}
                    onChange={onChangeInput}
                    className={fieldClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={formFields.phone}
                    onChange={onChangeInput}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="country" className={labelClass}>
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    value={formFields.country}
                    onChange={onChangeInput}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="city" className={labelClass}>
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    value={formFields.city}
                    onChange={onChangeInput}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="pincode" className={labelClass}>
                    Pincode
                  </label>
                  <input
                    id="pincode"
                    name="pincode"
                    value={formFields.pincode}
                    onChange={onChangeInput}
                    className={fieldClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className={labelClass}>
                    Billing Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={5}
                    value={formFields.address}
                    onChange={onChangeInput}
                    className={cn(fieldClass, "min-h-[120px] resize-y")}
                  />
                </div>
              </form>
            </div>
          </div>

          <div className="rounded-card border border-keyshop-line bg-white/[0.03] p-7 backdrop-blur-xl">
            <h2 className="text-[22px] font-bold text-white">Payment Method</h2>
            <div className="mt-5 space-y-4">
              <div
                className={cn(
                  "rounded-card border p-5",
                  hasDigitalItems
                    ? "border-sky-400/20 bg-keyshop-blue/10"
                    : "border-keyshop-green/25 bg-keyshop-green/10",
                )}
              >
                <p className="font-bold text-white">
                  {hasDigitalItems
                    ? "VNPay required for this cart"
                    : "COD and VNPay are available"}
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm leading-relaxed",
                    hasDigitalItems ? "text-sky-200" : "text-green-200",
                  )}
                >
                  {hasDigitalItems
                    ? "Keys and digital products are delivered only after successful online payment."
                    : "This cart contains only physical products, so COD or VNPay can be used."}
                </p>
              </div>

              <div className="space-y-3">
                {allItemsAllowCod ? (
                  <label className="flex cursor-pointer gap-4 rounded-card border border-keyshop-line bg-white/[0.04] p-5 transition hover:border-keyshop-blue/40">
                    <input
                      type="radio"
                      name="payment"
                      className="mt-1 accent-keyshop-blue"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <div>
                      <p className="font-bold text-white">Manual Confirmation (COD)</p>
                      <p className="mt-1 text-sm text-keyshop-muted">
                        Pay after receiving eligible physical products.
                      </p>
                    </div>
                  </label>
                ) : null}

                <label className="flex cursor-pointer gap-4 rounded-card border border-keyshop-line bg-white/[0.04] p-5 transition hover:border-keyshop-blue/40">
                  <input
                    type="radio"
                    name="payment"
                    className="mt-1 accent-keyshop-blue"
                    checked={paymentMethod === "vnpay"}
                    onChange={() => setPaymentMethod("vnpay")}
                  />
                  <div>
                    <p className="font-bold text-white">VNPay</p>
                    <p className="mt-1 text-sm text-keyshop-muted">
                      Pay securely through the VNPay gateway.
                    </p>
                  </div>
                </label>
              </div>

              {hasDigitalItems ? (
                <p className="text-[13px] leading-relaxed text-sky-300">
                  License keys and redeem codes are delivered instantly to your account
                  after payment is confirmed.
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="h-fit rounded-card border border-keyshop-line bg-white/[0.03] p-7 backdrop-blur-xl lg:sticky lg:top-24">
          <h2 className="text-xl font-bold text-white">Order Summary</h2>
          <div className="mt-5 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.variant?.id || "default"}`}
                className="flex gap-3 border-b border-keyshop-line pb-4 last:border-0 last:pb-0"
              >
                <div className="relative h-[90px] w-[90px] shrink-0 overflow-hidden rounded-[20px] bg-white/10">
                  <Image
                    src={getProductThumbnail(item.product)}
                    alt={getProductDisplayName(item.product)}
                    fill
                    className="object-cover"
                    sizes="90px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white">{getProductDisplayName(item.product)}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-extrabold text-keyshop-muted">
                      Qty: {item.quantity}
                    </span>
                    {item.variant ? (
                      <span className="rounded-full bg-keyshop-blue/15 px-2.5 py-1 text-xs font-extrabold text-sky-200">
                        {item.variant.name}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-extrabold text-keyshop-muted">
                      {getDeliveryLabel(item.product)}
                    </span>
                  </div>
                  <p className="mt-2 font-bold text-sky-400">
                    {formatPrice(getCartItemSalePrice(item) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

            <div className="space-y-2 border-t border-keyshop-line pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-keyshop-muted">Subtotal</span>
                <span className="text-white">{formatPrice(cartSummary.subtotal)}</span>
              </div>
              {cartSummary.savings > 0 ? (
                <div className="flex justify-between">
                  <span className="text-keyshop-muted">Discount</span>
                  <span className="text-keyshop-green">
                    -{formatPrice(cartSummary.savings)}
                  </span>
                </div>
              ) : null}
              {effectiveCoupon?.discount ? (
                <div className="flex justify-between">
                  <span className="text-keyshop-muted">
                    Coupon ({effectiveCoupon.code})
                  </span>
                  <span className="text-keyshop-green">
                    -{formatPrice(effectiveCoupon.discount)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span className="text-keyshop-muted">Tax</span>
                <span className="text-white">{formatPrice(cartSummary.tax)}</span>
              </div>
              <div className="flex justify-between pt-3 text-[22px] font-bold text-white">
                <span>Total</span>
                <span>{formatPrice(displayTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              className={checkoutCtaClass}
              onClick={handlePlaceOrder}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

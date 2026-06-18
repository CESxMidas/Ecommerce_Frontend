"use client";

import { FormEvent, useState } from "react";

import OrderView from "@/components/commerce/order-view";
import {
  CommerceBtn,
  CommerceField,
  CommerceHero,
  CommerceNotice,
  CommercePage,
  CommercePanel,
  commerceFieldClass,
} from "@/components/commerce/commerce-ui";
import { trackOrder, type Order } from "@/lib/services/order-service";
import { getApiErrorMessage } from "@/lib/utils/api-error";

export default function TrackOrderPageClient() {
  const [form, setForm] = useState({ orderId: "", contact: "" });
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const data = await trackOrder(form);
      setOrder(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not track this order"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <CommercePage>
      <CommerceHero
        kicker="Tracking"
        title="Order Tracking"
        description="Enter your order ID and email or phone number to check the latest order status."
      />

      <CommercePanel>
        <form className="grid max-w-xl gap-4" onSubmit={handleSubmit}>
          <CommerceField label="Order ID">
            <input
              value={form.orderId}
              onChange={(event) => setForm({ ...form, orderId: event.target.value })}
              placeholder="Example: 12345"
              required
              className={commerceFieldClass}
            />
          </CommerceField>
          <CommerceField label="Email or phone">
            <input
              value={form.contact}
              onChange={(event) => setForm({ ...form, contact: event.target.value })}
              placeholder="Email or phone used on the order"
              required
              className={commerceFieldClass}
            />
          </CommerceField>
          <CommerceBtn type="submit" disabled={loading}>
            {loading ? "Checking..." : "Track order"}
          </CommerceBtn>
        </form>

        {error ? <CommerceNotice>{error}</CommerceNotice> : null}
      </CommercePanel>

      {order ? <OrderView order={order} /> : null}
    </CommercePage>
  );
}

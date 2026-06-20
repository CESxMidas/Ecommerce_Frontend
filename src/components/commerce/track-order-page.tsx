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
      setError(getApiErrorMessage(err, "Không thể tra cứu đơn hàng này"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <CommercePage>
      <CommerceHero
        kicker="Theo dõi"
        title="Tra cứu đơn hàng"
        description="Nhập mã đơn hàng và email hoặc số điện thoại để xem trạng thái mới nhất."
      />

      <CommercePanel>
        <form className="grid max-w-xl gap-4" onSubmit={handleSubmit}>
          <CommerceField label="Mã đơn hàng">
            <input
              value={form.orderId}
              onChange={(event) => setForm({ ...form, orderId: event.target.value })}
              placeholder="Ví dụ: 12345"
              required
              className={commerceFieldClass}
            />
          </CommerceField>
          <CommerceField label="Email hoặc số điện thoại">
            <input
              value={form.contact}
              onChange={(event) => setForm({ ...form, contact: event.target.value })}
              placeholder="Email hoặc SĐT đã dùng khi đặt hàng"
              required
              className={commerceFieldClass}
            />
          </CommerceField>
          <CommerceBtn type="submit" disabled={loading}>
            {loading ? "Đang tra cứu..." : "Tra cứu đơn hàng"}
          </CommerceBtn>
        </form>

        {error ? <CommerceNotice>{error}</CommerceNotice> : null}
      </CommercePanel>

      {order ? <OrderView order={order} /> : null}
    </CommercePage>
  );
}

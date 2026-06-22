import Image from "next/image";
import Link from "next/link";

import { CommercePanel } from "@/components/commerce/commerce-ui";
import { formatPrice } from "@/lib/utils/format";
import type { Order } from "@/lib/services/order-service";

export default function OrderView({ order }: { order: Order }) {
  const orderId = String(order.id || order.orderId || "");

  return (
    <CommercePanel className="mt-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="text-xs uppercase tracking-wide text-slate-400">Đơn hàng</span>
          <p className="mt-1 text-lg font-extrabold text-white">#{orderId}</p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-slate-400">Trạng thái</span>
          <p className="mt-1 text-lg font-extrabold text-white">{order.status || "Chờ xử lý"}</p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-slate-400">Thanh toán</span>
          <p className="mt-1 text-lg font-extrabold text-white">
            {order.paymentStatus || order.paymentMethod || "Chờ xử lý"}
          </p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-wide text-slate-400">Tổng tiền</span>
          <p className="mt-1 text-lg font-extrabold text-keyshop-blue">
            {formatPrice(order.total || 0)}
          </p>
        </div>
      </div>

      <h2 className="mt-8 text-[22px] font-extrabold text-white">Khách hàng</h2>
      <p className="mt-2 text-slate-300">
        {order.name} - {order.phone} - {order.email}
      </p>
      <p className="text-slate-400">{order.address}</p>

      <h2 className="mt-8 text-[22px] font-extrabold text-white">Sản phẩm</h2>
      <div className="mt-4 space-y-4">
        {(order.items || []).map((item) => (
          <article
            key={`${item.productId}-${item.quantity}`}
            className="flex flex-col gap-4 rounded-card border border-keyshop-line bg-white/[0.02] p-4 sm:flex-row sm:items-center"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[18px] bg-white/10">
              <Image
                src={
                  item.product?.thumbnail ||
                  item.product?.image ||
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop"
                }
                alt={item.product?.name || item.product?.title || "Sản phẩm"}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white">
                {item.product?.name || item.product?.title || `Sản phẩm ${item.productId}`}
              </h3>
              <p className="mt-1 text-sm text-slate-400">Số lượng: {item.quantity}</p>
              {item.licenseKeys?.length ? (
                <p className="mt-1 text-sm text-sky-300">
                  Mã bản quyền: {item.licenseKeys.join(", ")}
                </p>
              ) : null}
              {item.accountCredentials?.length ? (
                <div className="mt-1 space-y-1 text-sm text-sky-300">
                  {item.accountCredentials.map((credential, index) => (
                    <p key={`${credential.username}-${index}`}>
                      Tài khoản: {credential.username} / {credential.password}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
            <strong className="text-keyshop-blue">
              {formatPrice(item.product?.salePrice || item.product?.price || 0)}
            </strong>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <Link
          href="/account/orders"
          className="text-sm font-semibold text-keyshop-blue hover:text-sky-300"
        >
          Xem trong Đơn hàng của tôi
        </Link>
      </div>
    </CommercePanel>
  );
}

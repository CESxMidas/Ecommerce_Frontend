import Link from "next/link";

import {
  CommerceBtn,
  CommerceHero,
  CommercePage,
  CommercePanel,
} from "@/components/commerce/commerce-ui";

export default function NotFound() {
  return (
    <CommercePage>
      <CommerceHero
        kicker="404"
        title="Không tìm thấy trang"
        description="Trang bạn tìm có thể đã được di chuyển hoặc không còn tồn tại."
      />
      <CommercePanel>
        <p className="text-slate-300">
          Kiểm tra lại đường dẫn hoặc quay về cửa hàng để tiếp tục mua sắm.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <CommerceBtn href="/">Về trang chủ</CommerceBtn>
          <CommerceBtn href="/products" variant="ghost">
            Xem sản phẩm
          </CommerceBtn>
        </div>
      </CommercePanel>
    </CommercePage>
  );
}

export type StaticPageSection = {
  title: string;
  body: string;
};

export type StaticPageContent = {
  kicker: string;
  title: string;
  intro: string;
  sections: StaticPageSection[];
};

export const STATIC_PAGES: Record<string, StaticPageContent> = {
  about: {
    kicker: "Công ty",
    title: "Giới thiệu KEYSHOP",
    intro:
      "KEYSHOP là cửa hàng thương mại điện tử chuyên key phần mềm, sản phẩm game và giao hàng số nhanh.",
    sections: [
      {
        title: "Sản phẩm chúng tôi cung cấp",
        body: "Chúng tôi tập trung vào sản phẩm số như bản quyền phần mềm, công cụ game và sản phẩm tải xuống có thể giao ngay sau thanh toán.",
      },
      {
        title: "Cam kết dịch vụ",
        body: "Trang sản phẩm, trạng thái đơn hàng, hỗ trợ, thanh toán và giao key được thiết kế rõ ràng để khách hàng mua hàng an tâm.",
      },
    ],
  },
  contact: {
    kicker: "Hỗ trợ",
    title: "Liên hệ",
    intro:
      "Cần hỗ trợ đơn hàng, kích hoạt sản phẩm hoặc tài khoản? Liên hệ đội hỗ trợ kèm mã đơn và email đăng ký.",
    sections: [
      { title: "Email", body: "hoangdohuy0907@gmail.com" },
      { title: "Điện thoại", body: "+84 941 383 007" },
      {
        title: "Giờ hỗ trợ",
        body: "Yêu cầu hỗ trợ được xử lý hàng ngày. Gửi kèm ảnh chụp màn hình và mã đơn để được phản hồi nhanh hơn.",
      },
    ],
  },
  "help-center": {
    kicker: "Hỗ trợ",
    title: "Trung tâm trợ giúp",
    intro: "Tìm câu trả lời nhanh về đơn hàng, thanh toán, giao hàng số và truy cập tài khoản.",
    sections: [
      {
        title: "Hỗ trợ đơn hàng",
        body: "Dùng trang tra cứu đơn để kiểm tra trạng thái. Khách đã đăng nhập có thể xem chi tiết trong mục Đơn hàng.",
      },
      {
        title: "Key bản quyền",
        body: "Key hiển thị sau khi mua thành công và luôn có trong chi tiết đơn hàng của bạn.",
      },
      {
        title: "Hỗ trợ tài khoản",
        body: "Dùng trang quên mật khẩu hoặc xác minh email nếu không đăng nhập được.",
      },
    ],
  },
  terms: {
    kicker: "Pháp lý",
    title: "Điều khoản sử dụng",
    intro: "Điều khoản mô tả quy tắc cơ bản khi sử dụng cửa hàng và mua sản phẩm số.",
    sections: [
      {
        title: "Đặt hàng",
        body: "Khách hàng chịu trách nhiệm cung cấp đúng thông tin tài khoản, liên hệ và thanh toán trước khi đặt hàng.",
      },
      {
        title: "Sản phẩm số",
        body: "Sản phẩm số có thể được giao ngay sau thanh toán thành công, nên tùy chọn hủy có thể bị giới hạn.",
      },
      {
        title: "Sử dụng tài khoản",
        body: "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động qua tài khoản của mình.",
      },
    ],
  },
  "privacy-policy": {
    kicker: "Pháp lý",
    title: "Chính sách bảo mật",
    intro: "Trang này giải thích dữ liệu khách hàng được dùng để vận hành đơn hàng, tài khoản và hỗ trợ.",
    sections: [
      {
        title: "Dữ liệu thu thập",
        body: "Chúng tôi dùng thông tin tài khoản, liên hệ, sản phẩm đặt mua và trạng thái thanh toán để xử lý đơn và hỗ trợ.",
      },
      {
        title: "Mục đích sử dụng",
        body: "Dữ liệu dùng cho xác thực, giao hàng, xác minh thanh toán, phòng chống gian lận và xử lý yêu cầu hỗ trợ.",
      },
      {
        title: "Quyền của khách hàng",
        body: "Khách hàng có thể cập nhật hồ sơ và địa chỉ trong tài khoản khi tính năng được hỗ trợ.",
      },
    ],
  },
  returns: {
    kicker: "Chính sách",
    title: "Chính sách hoàn tiền",
    intro: "Thương mại điện tử số cần quy tắc hoàn tiền rõ ràng vì nhiều sản phẩm được giao ngay.",
    sections: [
      {
        title: "Trường hợp được xem xét",
        body: "Hoàn tiền hoặc đổi key có thể được xem xét khi key không hợp lệ, trùng lặp hoặc không giao do lỗi hệ thống.",
      },
      {
        title: "Trường hợp không hoàn",
        body: "Sản phẩm đã kích hoạt, đổi thành công hoặc giao đầy đủ có thể không được hoàn trừ khi hỗ trợ xác nhận khác.",
      },
      {
        title: "Cách gửi yêu cầu",
        body: "Liên hệ hỗ trợ kèm mã đơn, tên sản phẩm, ảnh chụp màn hình và mô tả rõ vấn đề.",
      },
    ],
  },
  shipping: {
    kicker: "Chính sách",
    title: "Giao hàng",
    intro:
      "Phần lớn sản phẩm tại cửa hàng là số và được giao qua hệ thống đơn hàng thay vì vận chuyển vật lý.",
    sections: [
      {
        title: "Giao hàng số",
        body: "Key và sản phẩm số được gắn vào đơn sau thanh toán và xem được trong chi tiết đơn hàng.",
      },
      {
        title: "Trì hoãn giao hàng",
        body: "Một số đơn có thể chậm trong khi xác minh thanh toán, tồn kho hoặc kiểm tra gian lận.",
      },
    ],
  },
  "payment-policy": {
    kicker: "Chính sách",
    title: "Thanh toán an toàn",
    intro:
      "Thanh toán qua các cổng được hỗ trợ và trạng thái đơn được cập nhật sau khi xác nhận.",
    sections: [
      {
        title: "Trạng thái thanh toán",
        body: "Đơn có thể ở trạng thái chờ thanh toán, đã thanh toán, thất bại hoặc đã hủy tùy cổng thanh toán.",
      },
      {
        title: "Thử lại thanh toán",
        body: "Nếu thanh toán thất bại hoặc hết hạn, vào mục Đơn hàng để xem tùy chọn thanh toán lại.",
      },
    ],
  },
};

export function getStaticPage(slug: string): StaticPageContent | null {
  return STATIC_PAGES[slug] || null;
}

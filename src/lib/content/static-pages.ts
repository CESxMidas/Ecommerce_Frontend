export type StaticPageSection = {
  title: string;
  body: string;
};

export type StaticPageShortcut = {
  href: string;
  label: string;
  description: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type StaticPageContent = {
  kicker: string;
  title: string;
  intro: string;
  updatedAt: string;
  sections: StaticPageSection[];
  faqs?: FaqItem[];
  shortcuts?: StaticPageShortcut[];
  showContactCta?: boolean;
};

const POLICY_UPDATED = "2026-06-21";

export const STATIC_PAGES: Record<string, StaticPageContent> = {
  about: {
    kicker: "Về KEYSHOP",
    title: "Giới thiệu KEYSHOP",
    intro:
      "KEYSHOP là cửa hàng thương mại điện tử chuyên key phần mềm, bản quyền game và giao hàng số tức thì sau thanh toán.",
    updatedAt: POLICY_UPDATED,
    showContactCta: true,
    sections: [
      {
        title: "Sứ mệnh",
        body: "Mang bản quyền phần mềm chính hãng đến gần hơn với người dùng Việt Nam — minh bạch giá, giao key nhanh và hỗ trợ kích hoạt tận tình.",
      },
      {
        title: "Sản phẩm",
        body: "Key Windows, Office, antivirus, công cụ thiết kế, game và phần mềm năng suất. Sản phẩm số giao ngay; phần cứng hỗ trợ COD.",
      },
      {
        title: "Cam kết",
        body: "Thanh toán VNPay bảo mật, key từ kho đã xác minh, tra cứu đơn minh bạch và đội hỗ trợ phản hồi qua ticket trong tài khoản.",
      },
    ],
    shortcuts: [
      { href: "/our-story", label: "Câu chuyện", description: "Hành trình xây dựng KEYSHOP" },
      { href: "/partners", label: "Đối tác", description: "Nhà cung cấp & hợp tác" },
      { href: "/careers", label: "Tuyển dụng", description: "Gia nhập đội ngũ" },
    ],
  },
  contact: {
    kicker: "Hỗ trợ",
    title: "Liên hệ",
    intro:
      "Cần hỗ trợ đơn hàng, kích hoạt sản phẩm hoặc tài khoản? Gửi yêu cầu kèm mã đơn và email đăng ký để được phản hồi nhanh.",
    updatedAt: POLICY_UPDATED,
    showContactCta: true,
    sections: [
      { title: "Email", body: "hoangdohuy0907@gmail.com" },
      { title: "Hotline / Zalo", body: "+84 941 383 007" },
      { title: "Giờ hỗ trợ", body: "8:00 – 22:00 hàng ngày (GMT+7). Phản hồi ticket trong vòng 24 giờ làm việc." },
      {
        title: "Gửi yêu cầu hỗ trợ",
        body: "Khách đã đăng nhập có thể tạo ticket tại Tài khoản → Hỗ trợ. Đính kèm mã đơn, tên sản phẩm và ảnh chụp màn hình lỗi.",
      },
    ],
    shortcuts: [
      { href: "/faq", label: "FAQ", description: "Câu hỏi thường gặp" },
      { href: "/track-order", label: "Tra cứu đơn", description: "Kiểm tra trạng thái đơn" },
      { href: "/help", label: "Trung tâm trợ giúp", description: "Tổng hợp hướng dẫn" },
    ],
  },
  "our-story": {
    kicker: "Thương hiệu",
    title: "Câu chuyện KEYSHOP",
    intro:
      "KEYSHOP ra đời từ nhu cầu mua bản quyền số minh bạch — không chờ đợi, không key lậu, không mơ hồ về giá.",
    updatedAt: POLICY_UPDATED,
    showContactCta: true,
    sections: [
      {
        title: "Khởi nguồn",
        body: "Chúng tôi bắt đầu với catalog key phần mềm nhỏ, tập trung giao hàng tự động và hỗ trợ kích hoạt bằng tiếng Việt.",
      },
      {
        title: "Hôm nay",
        body: "KEYSHOP phục vụ hàng nghìn đơn số mỗi tháng với quy trình thanh toán VNPay, quản lý kho key và dashboard admin chuyên nghiệp.",
      },
    ],
  },
  careers: {
    kicker: "Tuyển dụng",
    title: "Gia nhập KEYSHOP",
    intro: "Chúng tôi tìm kiếm người đam mê ecommerce, phần mềm và trải nghiệm khách hàng.",
    updatedAt: POLICY_UPDATED,
    showContactCta: true,
    sections: [
      {
        title: "Vị trí đang mở",
        body: "Customer Support (part-time), Frontend Engineer, Content Marketing. Gửi CV qua email liên hệ kèm portfolio hoặc GitHub.",
      },
      {
        title: "Quyền lợi",
        body: "Làm việc remote/hybrid, môi trường startup ecommerce thực chiến, tiếp cận stack Next.js + Node.js production.",
      },
    ],
  },
  partners: {
    kicker: "Đối tác",
    title: "Đối tác & nhà cung cấp",
    intro: "KEYSHOP hợp tác với nhà phân phối bản quyền và đối tác thanh toán uy tín.",
    updatedAt: POLICY_UPDATED,
    showContactCta: true,
    sections: [
      {
        title: "Nhà cung cấp key",
        body: "Chúng tôi làm việc với nguồn key chính hãng có hóa đơn và quy trình import kiểm soát chất lượng.",
      },
      {
        title: "Đề xuất hợp tác",
        body: "Gửi email giới thiệu công ty, catalog và mô hình hợp tác. Bộ phận kinh doanh sẽ phản hồi trong 3–5 ngày làm việc.",
      },
    ],
  },
  "store-locator": {
    kicker: "Cửa hàng",
    title: "Hệ thống cửa hàng",
    intro:
      "KEYSHOP hoạt động chủ yếu online. Mọi giao dịch và giao key diễn ra qua website — không có cửa hàng vật lý bán lẻ tại thời điểm hiện tại.",
    updatedAt: POLICY_UPDATED,
    sections: [
      {
        title: "Mua hàng online",
        body: "Chọn sản phẩm → Thanh toán VNPay/COD → Nhận key trong tài khoản hoặc email xác nhận.",
      },
      {
        title: "Hỗ trợ trực tuyến",
        body: "Liên hệ qua hotline, email hoặc ticket trong tài khoản. Không cần đến cửa hàng.",
      },
    ],
    shortcuts: [
      { href: "/products", label: "Mua ngay", description: "Xem catalog sản phẩm" },
      { href: "/contact", label: "Liên hệ", description: "Hỗ trợ trực tuyến" },
    ],
  },
  "help-center": {
    kicker: "Hỗ trợ",
    title: "Trung tâm trợ giúp",
    intro: "Tìm hướng dẫn nhanh về đơn hàng, thanh toán, giao key và tài khoản.",
    updatedAt: POLICY_UPDATED,
    showContactCta: true,
    sections: [
      {
        title: "Bắt đầu nhanh",
        body: "Tra cứu đơn không cần đăng nhập. Khách đã login xem chi tiết key tại Đơn hàng hoặc Key bản quyền.",
      },
    ],
    shortcuts: [
      { href: "/faq", label: "FAQ", description: "40+ câu hỏi phổ biến" },
      { href: "/track-order", label: "Tra cứu đơn", description: "Mã đơn + email/SĐT" },
      { href: "/support/shipping", label: "Giao hàng số", description: "Thời gian nhận key" },
      { href: "/legal/payment-policy", label: "Thanh toán", description: "VNPay & COD" },
      { href: "/support/returns", label: "Hoàn tiền", description: "Khi nào được hỗ trợ" },
      { href: "/contact", label: "Liên hệ", description: "Email & hotline" },
    ],
  },
  faq: {
    kicker: "Hỗ trợ",
    title: "Câu hỏi thường gặp (FAQ)",
    intro: "Giải đáp nhanh các thắc mắc về mua hàng, thanh toán, nhận key và tài khoản tại KEYSHOP.",
    updatedAt: POLICY_UPDATED,
    showContactCta: true,
    sections: [],
    faqs: [
      {
        question: "Sau khi thanh toán, tôi nhận key ở đâu?",
        answer:
          "Key hiển thị trong Tài khoản → Key bản quyền và chi tiết đơn hàng ngay sau khi thanh toán VNPay được xác nhận. Một số trường hợp có thể mất vài phút để hệ thống đồng bộ.",
      },
      {
        question: "Tôi có thể mua khi chưa đăng ký tài khoản không?",
        answer:
          "Có. Giỏ hàng guest được hỗ trợ. Tuy nhiên đăng ký tài khoản giúp lưu đơn hàng, key và ticket hỗ trợ lâu dài.",
      },
      {
        question: "Thanh toán VNPay thất bại thì sao?",
        answer:
          "Kiểm tra số dư hoặc thử lại. Vào Tài khoản → Đơn hàng để xem trạng thái và thanh toán lại nếu đơn còn hiệu lực.",
      },
      {
        question: "Key báo lỗi hoặc đã được sử dụng?",
        answer:
          "Tạo ticket tại Tài khoản → Hỗ trợ kèm mã đơn, ảnh chụp lỗi kích hoạt. Chúng tôi kiểm tra kho và hỗ trợ đổi key nếu đủ điều kiện.",
      },
      {
        question: "Sản phẩm vật lý có hỗ trợ COD không?",
        answer: "Có. Giỏ hàng chỉ có sản phẩm vật lý mới hiển thị tùy chọn COD tại checkout.",
      },
      {
        question: "Làm sao tra cứu đơn không cần đăng nhập?",
        answer: "Vào Tra cứu đơn, nhập mã đơn và email hoặc số điện thoại đã dùng khi đặt hàng.",
      },
    ],
  },
  returns: {
    kicker: "Chính sách",
    title: "Đổi trả & hoàn tiền",
    intro: "Quy tắc hoàn tiền rõ ràng cho sản phẩm số — template, cần rà soát pháp lý trước khi production.",
    updatedAt: POLICY_UPDATED,
    sections: [
      {
        title: "Trường hợp được xem xét",
        body: "Key không hợp lệ, trùng lặp, không giao do lỗi hệ thống sau khi thanh toán thành công.",
      },
      {
        title: "Trường hợp không hoàn",
        body: "Key đã kích hoạt thành công, sản phẩm đã giao đầy đủ và không có lỗi từ phía nhà cung cấp.",
      },
      {
        title: "Quy trình",
        body: "Gửi ticket kèm mã đơn, mô tả và ảnh chụp. Bộ phận hỗ trợ phản hồi trong 24–48 giờ làm việc.",
      },
    ],
    showContactCta: true,
  },
  shipping: {
    kicker: "Giao hàng",
    title: "Vận chuyển & giao key",
    intro: "Phần lớn sản phẩm là số — giao qua hệ thống đơn hàng, không vận chuyển vật lý.",
    updatedAt: POLICY_UPDATED,
    sections: [
      {
        title: "Giao hàng số (instant)",
        body: "Key gắn vào đơn sau xác nhận thanh toán. Xem tại chi tiết đơn hoặc mục Key bản quyền.",
      },
      {
        title: "Sản phẩm vật lý",
        body: "Giao qua đơn vị vận chuyển. Thời gian 2–5 ngày làm việc tùy khu vực. Hỗ trợ COD.",
      },
      {
        title: "Trì hoãn",
        body: "Đơn có thể chờ khi xác minh thanh toán, kiểm tra gian lận hoặc hết tồn kho key.",
      },
    ],
    showContactCta: true,
  },
  terms: {
    kicker: "Pháp lý",
    title: "Điều khoản sử dụng",
    intro: "Điều khoản điều chỉnh việc sử dụng website và mua sản phẩm tại KEYSHOP. Nội dung template — thay bằng văn bản pháp lý chính thức trước go-live.",
    updatedAt: POLICY_UPDATED,
    sections: [
      {
        title: "1. Chấp nhận điều khoản",
        body: "Khi truy cập website và đặt hàng, bạn đồng ý tuân thủ các điều khoản này và chính sách liên quan.",
      },
      {
        title: "2. Tài khoản",
        body: "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động qua tài khoản của mình.",
      },
      {
        title: "3. Đặt hàng & thanh toán",
        body: "Thông tin đơn hàng phải chính xác. Giá và khuyến mãi có thể thay đổi mà không báo trước.",
      },
      {
        title: "4. Sản phẩm số",
        body: "Key và bản quyền số được coi là đã giao khi hiển thị trong tài khoản. Hủy đơn có thể bị giới hạn sau khi giao key.",
      },
      {
        title: "5. Giới hạn trách nhiệm",
        body: "KEYSHOP không chịu trách nhiệm cho thiệt hại gián tiếp phát sinh từ việc sử dụng sản phẩm bên thứ ba.",
      },
    ],
  },
  "privacy-policy": {
    kicker: "Pháp lý",
    title: "Chính sách bảo mật",
    intro: "Mô tả cách KEYSHOP thu thập, sử dụng và bảo vệ dữ liệu cá nhân. Template — cần rà soát pháp lý.",
    updatedAt: POLICY_UPDATED,
    sections: [
      {
        title: "1. Dữ liệu thu thập",
        body: "Họ tên, email, SĐT, địa chỉ giao hàng, lịch sử đơn hàng, log thanh toán và ticket hỗ trợ.",
      },
      {
        title: "2. Mục đích",
        body: "Xử lý đơn, giao key, xác thực thanh toán, chống gian lận, hỗ trợ khách hàng và cải thiện dịch vụ.",
      },
      {
        title: "3. Chia sẻ",
        body: "Chỉ chia sẻ với cổng thanh toán (VNPay), email delivery và nhà cung cấp hạ tầng khi cần thiết.",
      },
      {
        title: "4. Quyền của bạn",
        body: "Yêu cầu truy cập, cập nhật hoặc xóa dữ liệu qua email liên hệ. Một số dữ liệu đơn hàng có thể cần lưu theo quy định kế toán.",
      },
    ],
  },
  "cookie-policy": {
    kicker: "Pháp lý",
    title: "Chính sách Cookie",
    intro: "Giải thích cookie và công nghệ lưu trữ tương tự mà KEYSHOP sử dụng trên website.",
    updatedAt: POLICY_UPDATED,
    sections: [
      {
        title: "1. Cookie là gì?",
        body: "Cookie là file nhỏ lưu trên trình duyệt để ghi nhớ phiên đăng nhập, giỏ hàng và tùy chọn.",
      },
      {
        title: "2. Cookie chúng tôi dùng",
        body: "Cookie phiên (NextAuth, giỏ hàng), cookie bảo mật (CSRF) và cookie phân tích nếu được bật trong tương lai.",
      },
      {
        title: "3. Quản lý cookie",
        body: "Bạn có thể xóa cookie trong cài đặt trình duyệt. Một số tính năng (đăng nhập, giỏ hàng) có thể không hoạt động nếu tắt cookie.",
      },
    ],
  },
  "payment-policy": {
    kicker: "Thanh toán",
    title: "Chính sách thanh toán",
    intro: "Thông tin về VNPay, COD và trạng thái thanh toán đơn hàng.",
    updatedAt: POLICY_UPDATED,
    sections: [
      {
        title: "VNPay",
        body: "Thanh toán online qua cổng VNPay. Bắt buộc cho sản phẩm số. Đơn chuyển sang xử lý sau khi VNPay xác nhận.",
      },
      {
        title: "COD",
        body: "Chỉ áp dụng sản phẩm vật lý. Thanh toán khi nhận hàng. Key số không hỗ trợ COD.",
      },
      {
        title: "Trạng thái",
        body: "Chờ thanh toán, đã thanh toán, thất bại, đã hủy — theo dõi tại chi tiết đơn hàng.",
      },
    ],
    showContactCta: true,
  },
};

export function getStaticPage(slug: string): StaticPageContent | null {
  return STATIC_PAGES[slug] || null;
}

export function getStaticPageSlugs(): string[] {
  return Object.keys(STATIC_PAGES);
}

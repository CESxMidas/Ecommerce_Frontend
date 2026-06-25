import axios from "axios";

type ErrorPattern = { pattern: RegExp; message: string };

const TOAST_ERROR_PATTERNS: ErrorPattern[] = [
  // NextAuth
  { pattern: /^CredentialsSignin$/i, message: "Email hoặc mật khẩu không đúng" },
  { pattern: /^AccessDenied$/i, message: "Bạn không có quyền truy cập" },
  { pattern: /^Configuration$/i, message: "Cấu hình đăng nhập chưa đúng" },
  { pattern: /^OAuthSignin$/i, message: "Đăng nhập mạng xã hội thất bại" },
  { pattern: /^OAuthCallback$/i, message: "Đăng nhập mạng xã hội thất bại" },
  { pattern: /^OAuthCreateAccount$/i, message: "Không thể tạo tài khoản qua mạng xã hội" },
  { pattern: /^EmailCreateAccount$/i, message: "Không thể tạo tài khoản bằng email" },
  { pattern: /^Callback$/i, message: "Đăng nhập thất bại" },
  { pattern: /^SessionRequired$/i, message: "Vui lòng đăng nhập để tiếp tục" },
  { pattern: /^AdminAccessRequired$/i, message: "Yêu cầu quyền quản trị. Vui lòng dùng tài khoản Admin." },

  // Auth
  { pattern: /invalid email or password/i, message: "Email hoặc mật khẩu không đúng" },
  { pattern: /account is not active/i, message: "Tài khoản chưa được kích hoạt" },
  { pattern: /email already registered/i, message: "Email đã được đăng ký" },
  { pattern: /invalid or expired verification code/i, message: "Mã xác minh không hợp lệ hoặc đã hết hạn" },
  { pattern: /invalid or expired reset code/i, message: "Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn" },
  { pattern: /google token không hợp lệ/i, message: "Phiên Google không hợp lệ. Vui lòng thử lại." },
  { pattern: /google credential is required/i, message: "Thiếu thông tin đăng nhập Google" },
  { pattern: /đăng nhập google thất bại/i, message: "Đăng nhập Google thất bại" },
  { pattern: /đăng nhập bằng google/i, message: "Tài khoản này đăng nhập bằng Google. Vui lòng bấm nút Google bên dưới." },

  // Network / generic
  { pattern: /^network error$/i, message: "Không thể kết nối máy chủ. Kiểm tra mạng và thử lại." },
  { pattern: /^request failed$/i, message: "Đã xảy ra lỗi. Vui lòng thử lại." },
  { pattern: /failed to fetch/i, message: "Không thể kết nối máy chủ. Kiểm tra mạng và thử lại." },
  { pattern: /login failed/i, message: "Đăng nhập thất bại" },

  // Orders / stock / cart
  { pattern: /hết key trong kho/i, message: "Sản phẩm đã hết key trong kho. Vui lòng thử lại sau." },
  { pattern: /không đủ key trong kho/i, message: "Sản phẩm đã hết key trong kho. Vui lòng thử lại sau." },
  { pattern: /not enough license keys in pool/i, message: "Sản phẩm đã hết key trong kho. Vui lòng thử lại sau." },
  { pattern: /hết hàng/i, message: "Sản phẩm đã hết hàng." },
  { pattern: /insufficient stock/i, message: "Sản phẩm đã hết hàng." },
  { pattern: /stock failed/i, message: "Không đủ tồn kho để hoàn tất đơn hàng." },
  { pattern: /this order can no longer be cancelled/i, message: "Đơn hàng này không thể hủy" },
  { pattern: /invalid payment method/i, message: "Phương thức thanh toán không hợp lệ" },
  { pattern: /cod is only available for physical products/i, message: "COD chỉ áp dụng cho sản phẩm vật lý" },
  { pattern: /cart item not found/i, message: "Không tìm thấy sản phẩm trong giỏ hàng" },
  { pattern: /product .+ is not available/i, message: "Sản phẩm không còn khả dụng" },
  { pattern: /quantity must be at least 1/i, message: "Số lượng phải ít nhất là 1" },

  // Coupons
  { pattern: /invalid coupon code/i, message: "Mã giảm giá không hợp lệ" },
  { pattern: /coupon has expired/i, message: "Mã giảm giá đã hết hạn" },
  { pattern: /coupon usage limit reached/i, message: "Mã giảm giá đã hết lượt sử dụng" },
  { pattern: /coupon code is required/i, message: "Vui lòng nhập mã giảm giá" },
  { pattern: /coupon not found/i, message: "Không tìm thấy mã giảm giá" },

  // Reviews
  { pattern: /only verified buyers can review/i, message: "Chỉ khách đã mua sản phẩm mới được đánh giá" },
  { pattern: /rating must be between 1 and 5/i, message: "Vui lòng chọn số sao từ 1 đến 5" },
  { pattern: /review comment is required/i, message: "Vui lòng viết đánh giá" },
  { pattern: /review must be 500 characters or less/i, message: "Đánh giá tối đa 500 ký tự" },

  // Profile / account
  { pattern: /password must be at least 6 characters/i, message: "Mật khẩu phải có ít nhất 6 ký tự" },
  { pattern: /password must be at least 8 characters/i, message: "Mật khẩu phải có ít nhất 8 ký tự" },
  { pattern: /passwords do not match/i, message: "Mật khẩu không khớp" },
  { pattern: /current password is incorrect/i, message: "Mật khẩu hiện tại không đúng" },
  { pattern: /current password is required/i, message: "Vui lòng nhập mật khẩu hiện tại" },
  { pattern: /email already in use/i, message: "Email đã được sử dụng" },
  { pattern: /valid email is required/i, message: "Vui lòng nhập email hợp lệ" },
  { pattern: /address line and city are required/i, message: "Địa chỉ và thành phố là bắt buộc" },
  { pattern: /address not found/i, message: "Không tìm thấy địa chỉ" },
  { pattern: /subject and message are required/i, message: "Tiêu đề và nội dung là bắt buộc" },
  { pattern: /reply message is required/i, message: "Nội dung phản hồi là bắt buộc" },
  { pattern: /ticket not found/i, message: "Không tìm thấy yêu cầu hỗ trợ" },

  // Common resources
  { pattern: /product not found/i, message: "Không tìm thấy sản phẩm" },
  { pattern: /order not found/i, message: "Không tìm thấy đơn hàng" },
  { pattern: /not allowed/i, message: "Bạn không có quyền thực hiện thao tác này" },
  { pattern: /no valid keys to import/i, message: "Không có key hợp lệ để nhập" },
  { pattern: /no valid accounts to import/i, message: "Không có tài khoản hợp lệ để nhập" },
  { pattern: /upload thất bại/i, message: "Tải ảnh lên thất bại" },
];

const VIETNAMESE_CHAR_PATTERN =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

export function translateToastMessage(
  message: string,
  fallback = "Đã xảy ra lỗi. Vui lòng thử lại.",
) {
  const trimmed = message.trim();

  if (!trimmed) {
    return fallback;
  }

  for (const entry of TOAST_ERROR_PATTERNS) {
    if (entry.pattern.test(trimmed)) {
      return entry.message;
    }
  }

  if (VIETNAMESE_CHAR_PATTERN.test(trimmed)) {
    return trimmed;
  }

  return trimmed;
}

export function getToastErrorMessage(
  error: unknown,
  fallback = "Đã xảy ra lỗi. Vui lòng thử lại.",
) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;

    if (data?.message) {
      return translateToastMessage(data.message, fallback);
    }

    if (error.message) {
      return translateToastMessage(error.message, fallback);
    }
  }

  if (error instanceof Error && error.message) {
    return translateToastMessage(error.message, fallback);
  }

  if (typeof error === "string" && error.trim()) {
    return translateToastMessage(error, fallback);
  }

  return fallback;
}

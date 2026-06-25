import { describe, expect, it } from "vitest";

import {
  getToastErrorMessage,
  translateToastMessage,
} from "@/lib/utils/toast-error";

describe("toast-error", () => {
  it("maps NextAuth credentials error to Vietnamese", () => {
    expect(translateToastMessage("CredentialsSignin")).toBe(
      "Email hoặc mật khẩu không đúng",
    );
  });

  it("maps Google-only account message with guidance", () => {
    expect(
      translateToastMessage("Tài khoản này đăng nhập bằng Google"),
    ).toBe(
      "Tài khoản này đăng nhập bằng Google. Vui lòng bấm nút Google bên dưới.",
    );
  });

  it("maps invalid coupon code", () => {
    expect(translateToastMessage("Invalid coupon code")).toBe(
      "Mã giảm giá không hợp lệ",
    );
  });

  it("returns fallback for empty message", () => {
    expect(getToastErrorMessage(null, "Lỗi tùy chỉnh")).toBe("Lỗi tùy chỉnh");
  });
});

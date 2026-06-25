export const EMAIL_NOT_VERIFIED_PREFIX = "EMAIL_NOT_VERIFIED:";

export const SESSION_MAX_AGE_SECONDS = 60 * 60;
export const REMEMBER_ME_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export type EmailNotVerifiedPayload = {
  message: string;
  email?: string;
  emailSent?: boolean;
};

export function encodeEmailNotVerifiedError(payload: EmailNotVerifiedPayload) {
  return `${EMAIL_NOT_VERIFIED_PREFIX}${JSON.stringify(payload)}`;
}

export function parseEmailNotVerifiedError(
  error: string,
): EmailNotVerifiedPayload | null {
  if (!error.startsWith(EMAIL_NOT_VERIFIED_PREFIX)) {
    return null;
  }

  try {
    return JSON.parse(
      error.slice(EMAIL_NOT_VERIFIED_PREFIX.length),
    ) as EmailNotVerifiedPayload;
  } catch {
    return null;
  }
}

import { translateToastMessage } from "@/lib/utils/toast-error";

/** Chuyển mã lỗi NextAuth/backend sang thông báo tiếng Việt cho form đăng nhập */
export function formatAuthLoginError(error?: string | null) {
  return translateToastMessage(error?.trim() || "", "Đăng nhập thất bại");
}
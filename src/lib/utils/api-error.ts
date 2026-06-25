import axios from "axios";

import {
  getToastErrorMessage,
  translateToastMessage,
} from "@/lib/utils/toast-error";

export function getApiErrorData(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data as
      | {
          message?: string;
          code?: string;
          email?: string;
          emailSent?: boolean;
        }
      | undefined;
  }

  return undefined;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Đã xảy ra lỗi. Vui lòng thử lại.",
) {
  return getToastErrorMessage(error, fallback);
}

export { translateToastMessage };

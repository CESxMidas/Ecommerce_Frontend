import axios from "axios";

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

export function getApiErrorMessage(error: unknown, fallback = "Request failed") {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return getApiErrorData(error)?.message || fallback;
}

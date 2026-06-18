import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { AuthUser } from "@/types/api";

export async function login(credentials: { email: string; password: string }) {
  const { data } = await apiClient.post<AuthUser>(
    API_ENDPOINTS.auth.login,
    credentials,
  );

  return data;
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const { data } = await apiClient.post<{ message?: string }>(
    API_ENDPOINTS.auth.register,
    payload,
  );

  return data;
}

export async function forgotPassword(email: string) {
  const { data } = await apiClient.post<{ message?: string }>(
    API_ENDPOINTS.auth.forgotPassword,
    { email },
  );

  return data;
}

export async function resetPassword(payload: Record<string, string>) {
  const { data } = await apiClient.post(API_ENDPOINTS.auth.resetPassword, payload);

  return data;
}

export async function verifyAccount(payload: { email: string; otp: string }) {
  const { data } = await apiClient.post(API_ENDPOINTS.auth.verify, payload);

  return data;
}

export async function resendVerification(email: string) {
  const { data } = await apiClient.post<{ message?: string }>(
    API_ENDPOINTS.auth.resendVerify,
    { email },
  );

  return data;
}

export async function getMe() {
  const { data } = await apiClient.get(API_ENDPOINTS.auth.me);

  return data;
}

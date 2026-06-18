import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export async function googleLogin(credential, clientId) {
  const { data } = await apiClient.post(API_ENDPOINTS.auth.google, {
    credential,
    clientId,
  });

  return data;
}

export async function login(credentials) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.auth.login,
    credentials
  );

  return data;
}

export async function register(payload) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.auth.register,
    payload
  );

  return data;
}

export async function forgotPassword(email) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.auth.forgotPassword,
    { email }
  );

  return data;
}

export async function resetPassword(payload) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.auth.resetPassword,
    payload
  );

  return data;
}

export async function verifyAccount(payload) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.auth.verify,
    payload
  );

  return data;
}

export async function resendVerification(email) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.auth.resendVerify,
    { email }
  );

  return data;
}

export async function getMe() {
  const { data } = await apiClient.get(API_ENDPOINTS.auth.me);

  return data;
}

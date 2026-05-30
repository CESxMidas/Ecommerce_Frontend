import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export async function updateProfile(profile) {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.user.profile,
    profile
  );

  return data;
}

export async function changePassword(payload) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.user.password,
    payload
  );

  return data;
}

export async function fetchAddresses() {
  const { data } = await apiClient.get(API_ENDPOINTS.user.addresses);

  return data;
}

export async function createAddress(address) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.user.addresses,
    address
  );

  return data;
}

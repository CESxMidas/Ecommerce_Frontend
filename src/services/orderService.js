import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export async function fetchOrders() {
  const { data } = await apiClient.get(API_ENDPOINTS.orders.list);

  return data;
}

export async function fetchOrderById(orderId) {
  const { data } = await apiClient.get(API_ENDPOINTS.orders.detail(orderId));

  return data;
}

export async function trackOrder(payload) {
  const { data } = await apiClient.post(API_ENDPOINTS.orders.track, payload);

  return data;
}

export async function placeOrder(orderPayload) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.orders.list,
    orderPayload
  );

  return data;
}

export async function recreateVnpayPayment(orderId) {
  const { data } = await apiClient.post(API_ENDPOINTS.payments.recreateVnpay, {
    orderId,
  });

  return data;
}

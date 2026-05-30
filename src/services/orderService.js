import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export async function fetchOrders() {
  const { data } = await apiClient.get(API_ENDPOINTS.orders.list);

  return data;
}

export async function placeOrder(orderPayload) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.orders.list,
    orderPayload
  );

  return data;
}

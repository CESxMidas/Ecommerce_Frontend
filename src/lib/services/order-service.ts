import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { CartItem, PlacedOrder } from "@/types/cart";

export interface OrderItem {
  productId: string;
  quantity: number;
  licenseKeys?: string[];
  product?: {
    name?: string;
    title?: string;
    thumbnail?: string;
    image?: string;
    salePrice?: number;
    price?: number;
  };
}

export interface Order extends PlacedOrder {
  orderId?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  total?: number;
  createdAt?: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  items?: OrderItem[];
}

export async function fetchOrders() {
  const { data } = await apiClient.get<Order[]>(API_ENDPOINTS.orders.list);

  return data;
}

export async function fetchOrderById(orderId: string) {
  const { data } = await apiClient.get<Order>(API_ENDPOINTS.orders.detail(orderId));

  return data;
}

export async function placeOrder(orderPayload: Record<string, unknown>) {
  const { data } = await apiClient.post<Order>(
    API_ENDPOINTS.orders.list,
    orderPayload,
  );

  return data;
}

export async function recreateVnpayPayment(orderId: string) {
  const { data } = await apiClient.post<{ paymentUrl?: string }>(
    API_ENDPOINTS.payments.recreateVnpay,
    { orderId },
  );

  return data;
}

export async function cancelOrder(orderId: string) {
  const { data } = await apiClient.patch(API_ENDPOINTS.orders.cancel(orderId));

  return data;
}

export async function hideOrder(orderId: string) {
  const { data } = await apiClient.patch(API_ENDPOINTS.orders.hide(orderId));

  return data;
}

export async function trackOrder(payload: { orderId: string; contact: string }) {
  const { data } = await apiClient.post<Order>(API_ENDPOINTS.orders.track, payload);

  return data;
}

export type { CartItem };

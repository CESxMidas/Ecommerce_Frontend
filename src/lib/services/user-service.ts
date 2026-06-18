import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { UserAddress } from "@/types/cart";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  dateOfBirth?: string | null;
  gender: string;
  verify_email: boolean;
  twoFactorEnabled?: boolean;
  pendingEmail?: string;
}

export async function updateProfile(profile: Partial<UserProfile>) {
  const { data } = await apiClient.patch<UserProfile>(
    API_ENDPOINTS.user.profile,
    profile,
  );

  return data;
}

export async function fetchProfile() {
  const { data } = await apiClient.get<UserProfile>(API_ENDPOINTS.user.profile);

  return data;
}

export async function changePassword(payload: {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}) {
  const { data } = await apiClient.post(API_ENDPOINTS.user.password, payload);

  return data;
}

export async function requestEmailChange(email: string) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.user.emailRequest,
    { email },
  );

  return data;
}

export async function verifyEmailChange(payload: { otp: string }) {
  const { data } = await apiClient.post<UserProfile>(
    API_ENDPOINTS.user.emailVerify,
    payload,
  );

  return data;
}

export async function fetchAddresses() {
  const { data } = await apiClient.get<UserAddress[] | { addresses: UserAddress[] }>(
    API_ENDPOINTS.user.addresses,
  );

  return data;
}

export async function createAddress(address: Record<string, unknown>) {
  const { data } = await apiClient.post(API_ENDPOINTS.user.addresses, address);

  return data;
}

export async function updateAddress(addressId: string, address: Record<string, unknown>) {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.user.addressItem(addressId),
    address,
  );

  return data;
}

export async function setDefaultAddress(addressId: string) {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.user.addressDefault(addressId),
  );

  return data;
}

export async function deleteAddress(addressId: string) {
  const { data } = await apiClient.delete(
    API_ENDPOINTS.user.addressItem(addressId),
  );

  return data;
}

export type UserSession = {
  id: string;
  deviceName?: string;
  ipAddress?: string;
  lastUsedAt?: string;
};

export type LicenseEntry = {
  id: string;
  orderId: string;
  productName: string;
  variant?: { name?: string } | null;
  keys?: string[];
};

export type UserNotification = {
  id: string;
  title: string;
  message: string;
  createdAt?: string;
  readAt?: string | null;
};

export type TicketReply = {
  id: string;
  authorRole: string;
  message: string;
};

export type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  orderId?: string;
  replies?: TicketReply[];
};

export async function fetchSessions() {
  const { data } = await apiClient.get<UserSession[]>(API_ENDPOINTS.user.sessions);
  return Array.isArray(data) ? data : [];
}

export async function deleteSession(sessionId: string) {
  const { data } = await apiClient.delete(API_ENDPOINTS.user.sessionItem(sessionId));
  return data;
}

export async function deleteAllSessions() {
  const { data } = await apiClient.delete(API_ENDPOINTS.user.sessions);
  return data;
}

export async function fetchLicenses() {
  const { data } = await apiClient.get<LicenseEntry[]>(API_ENDPOINTS.user.licenses);
  return Array.isArray(data) ? data : [];
}

export async function resendLicenseKeys(orderId: string) {
  const { data } = await apiClient.post(API_ENDPOINTS.user.licenseResend(orderId));
  return data;
}

export async function fetchNotifications() {
  const { data } = await apiClient.get<UserNotification[]>(
    API_ENDPOINTS.user.notifications,
  );
  return Array.isArray(data) ? data : [];
}

export async function markNotificationRead(notificationId: string) {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.user.notificationRead(notificationId),
  );
  return data;
}

export async function markAllNotificationsRead() {
  const { data } = await apiClient.patch(API_ENDPOINTS.user.notificationsReadAll);
  return data;
}

export async function fetchTickets() {
  const { data } = await apiClient.get<SupportTicket[]>(API_ENDPOINTS.user.tickets);
  return Array.isArray(data) ? data : [];
}

export async function createTicket(payload: {
  orderId?: string;
  subject: string;
  message: string;
  priority?: string;
}) {
  const { data } = await apiClient.post(API_ENDPOINTS.user.tickets, payload);
  return data;
}

export async function addTicketReply(ticketId: string, message: string) {
  const { data } = await apiClient.post(API_ENDPOINTS.user.ticketReplies(ticketId), {
    message,
  });
  return data;
}

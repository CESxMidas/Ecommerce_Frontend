import apiClient from "./apiClient";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export async function updateProfile(profile) {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.user.profile,
    profile
  );

  return data;
}

export async function fetchProfile() {
  const { data } = await apiClient.get(API_ENDPOINTS.user.profile);

  return data;
}

export async function changePassword(payload) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.user.password,
    payload
  );

  return data;
}

export async function requestEmailChange(email) {
  const { data } = await apiClient.post(API_ENDPOINTS.user.emailRequest, {
    email,
  });

  return data;
}

export async function verifyEmailChange(payload) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.user.emailVerify,
    payload,
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

export async function updateAddress(addressId, address) {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.user.addressItem(addressId),
    address
  );

  return data;
}

export async function setDefaultAddress(addressId) {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.user.addressDefault(addressId),
  );

  return data;
}

export async function deleteAddress(addressId) {
  const { data } = await apiClient.delete(
    API_ENDPOINTS.user.addressItem(addressId)
  );

  return data;
}

export async function fetchSessions() {
  const { data } = await apiClient.get(API_ENDPOINTS.user.sessions);

  return data;
}

export async function deleteSession(sessionId) {
  const { data } = await apiClient.delete(
    API_ENDPOINTS.user.sessionItem(sessionId),
  );

  return data;
}

export async function deleteAllSessions() {
  const { data } = await apiClient.delete(API_ENDPOINTS.user.sessions);

  return data;
}

export async function fetchLicenses() {
  const { data } = await apiClient.get(API_ENDPOINTS.user.licenses);

  return data;
}

export async function resendLicenseKeys(orderId) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.user.licenseResend(orderId),
  );

  return data;
}

export async function fetchNotifications() {
  const { data } = await apiClient.get(API_ENDPOINTS.user.notifications);

  return data;
}

export async function markNotificationRead(notificationId) {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.user.notificationRead(notificationId),
  );

  return data;
}

export async function markAllNotificationsRead() {
  const { data } = await apiClient.patch(
    API_ENDPOINTS.user.notificationsReadAll,
  );

  return data;
}

export async function fetchTickets() {
  const { data } = await apiClient.get(API_ENDPOINTS.user.tickets);

  return data;
}

export async function createTicket(payload) {
  const { data } = await apiClient.post(API_ENDPOINTS.user.tickets, payload);

  return data;
}

export async function addTicketReply(ticketId, message) {
  const { data } = await apiClient.post(
    API_ENDPOINTS.user.ticketReplies(ticketId),
    { message },
  );

  return data;
}

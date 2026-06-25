export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    google: "/auth/google",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verify: "/auth/verify",
    resendVerify: "/auth/resend-verify",
    me: "/auth/me",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  products: {
    list: "/products",
    detail: (id: string) => `/products/${id}`,
    reviews: (id: string) => `/products/${id}/reviews`,
  },
  categories: {
    list: "/categories",
    detail: (id: string) => `/categories/${id}`,
  },
  banners: {
    list: "/banners",
  },
  blogs: {
    list: "/blogs",
    detail: (id: string) => `/blogs/${id}`,
  },
  cart: {
    root: "/cart",
    item: (id: string) => `/cart/${id}`,
  },
  wishlist: {
    root: "/wishlist",
    item: (id: string) => `/wishlist/${id}`,
  },
  orders: {
    list: "/orders",
    detail: (id: string) => `/orders/${id}`,
    cancel: (id: string) => `/orders/${id}/cancel`,
    hide: (id: string) => `/orders/${id}/hide`,
    track: "/orders/track",
  },
  coupons: {
    validate: "/coupons/validate",
  },
  payments: {
    recreateVnpay: "/payments/re-create-vnpay",
  },
  user: {
    profile: "/user/profile",
    avatarUpload: "/user/profile/avatar",
    password: "/user/profile/password",
    emailRequest: "/user/profile/email/request",
    emailVerify: "/user/profile/email/verify",
    addresses: "/user/addresses",
    addressItem: (id: string) => `/user/addresses/${id}`,
    addressDefault: (id: string) => `/user/addresses/${id}/default`,
    licenses: "/user/licenses",
    licenseResend: (orderId: string) => `/user/licenses/${orderId}/resend`,
    premiumAccounts: "/user/accounts",
    premiumAccountResend: (orderId: string) => `/user/accounts/${orderId}/resend`,
    notifications: "/user/notifications",
    notificationRead: (id: string) => `/user/notifications/${id}/read`,
    notificationsReadAll: "/user/notifications/read-all",
    tickets: "/user/tickets",
    ticketReplies: (id: string) => `/user/tickets/${id}/replies`,
    sessions: "/user/sessions",
    sessionItem: (id: string) => `/user/sessions/${id}`,
  },
} as const;

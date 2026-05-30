export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    google: "/auth/google",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verify: "/auth/verify",
    resendVerify: "/auth/resend-verify",
  },
  products: {
    list: "/products",
    detail: (id) => `/products/${id}`,
  },
  categories: {
    list: "/categories",
    detail: (id) => `/categories/${id}`,
  },
  cart: {
    root: "/cart",
    item: (id) => `/cart/${id}`,
  },
  orders: {
    list: "/orders",
    detail: (id) => `/orders/${id}`,
  },
  user: {
    profile: "/user/profile",
    password: "/user/profile/password",
    addresses: "/user/addresses",
  },
};

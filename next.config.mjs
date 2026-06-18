/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },

  async rewrites() {
    const apiBase =
      process.env.API_INTERNAL_URL || "http://localhost:888";

    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      { source: "/productListing", destination: "/products", permanent: true },
      { source: "/product/:id", destination: "/products/:id", permanent: true },
      { source: "/login", destination: "/auth/login", permanent: true },
      { source: "/register", destination: "/auth/register", permanent: true },
      {
        source: "/forgot-password",
        destination: "/auth/forgot-password",
        permanent: true,
      },
      {
        source: "/reset-password",
        destination: "/auth/reset-password",
        permanent: true,
      },
      {
        source: "/verifyAccount",
        destination: "/auth/verify",
        permanent: true,
      },
      { source: "/myAccount", destination: "/account", permanent: true },
      { source: "/my-list", destination: "/account/wishlist", permanent: true },
      { source: "/address", destination: "/account/addresses", permanent: true },
      { source: "/orders", destination: "/account/orders", permanent: true },
      {
        source: "/orders/:id",
        destination: "/account/orders/:id",
        permanent: true,
      },
      {
        source: "/licenses",
        destination: "/account/licenses",
        permanent: true,
      },
      {
        source: "/notifications",
        destination: "/account/notifications",
        permanent: true,
      },
      { source: "/tickets", destination: "/account/tickets", permanent: true },
      { source: "/security", destination: "/account/security", permanent: true },
      {
        source: "/help-center",
        destination: "/support/help-center",
        permanent: true,
      },
      {
        source: "/payment-policy",
        destination: "/legal/payment-policy",
        permanent: true,
      },
      {
        source: "/privacy-policy",
        destination: "/legal/privacy-policy",
        permanent: true,
      },
      { source: "/terms", destination: "/legal/terms", permanent: true },
      { source: "/returns", destination: "/support/returns", permanent: true },
      { source: "/shipping", destination: "/support/shipping", permanent: true },
    ];
  },
};

export default nextConfig;

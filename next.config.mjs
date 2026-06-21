/** @type {import('next').NextConfig} */

// Only proxy known Express backend routes. NextAuth lives at /api/next-auth/* on Next.js.
const BACKEND_API_PREFIXES = [
  "auth",
  "products",
  "categories",
  "cart",
  "orders",
  "user",
  "wishlist",
  "coupons",
  "banners",
  "blogs",
  "admin",
  "payments",
  "health",
];

function createBackendRewrites(apiBase) {
  return BACKEND_API_PREFIXES.flatMap((prefix) => [
    {
      source: `/api/${prefix}`,
      destination: `${apiBase}/api/${prefix}`,
    },
    {
      source: `/api/${prefix}/:path*`,
      destination: `${apiBase}/api/${prefix}/:path*`,
    },
  ]);
}

const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "**.googleusercontent.com", pathname: "/**" },
    ],
  },

  async rewrites() {
    const apiBase =
      process.env.API_INTERNAL_URL || "http://localhost:888";

    return {
      afterFiles: createBackendRewrites(apiBase),
    };
  },

  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/favicon.svg", permanent: false },
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
        destination: "/help",
        permanent: true,
      },
      {
        source: "/support/help-center",
        destination: "/help",
        permanent: true,
      },
      { source: "/order-tracking", destination: "/track-order", permanent: true },
      { source: "/order-tracking/:path*", destination: "/track-order", permanent: true },
      { source: "/payment", destination: "/legal/payment-policy", permanent: true },
      { source: "/refund-policy", destination: "/support/returns", permanent: true },
      { source: "/terms-of-service", destination: "/legal/terms", permanent: true },
      { source: "/cookie-policy", destination: "/legal/cookie-policy", permanent: true },
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

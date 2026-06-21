"use client";

import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

import ScrollToTop from "@/components/layout/scroll-to-top";
import { AuthTokenSync } from "@/components/providers/auth-token-sync";
import { CartProvider, useCartCore } from "@/components/providers/cart-provider";
import { CartUiProvider } from "@/components/providers/cart-ui-provider";
import { WishlistCompareProvider } from "@/components/providers/wishlist-compare-provider";

const CartPanel = dynamic(() => import("@/components/layout/cart-panel"), {
  ssr: false,
});

const LicenseKeyModal = dynamic(
  () => import("@/components/shop/license-key-modal"),
  { ssr: false },
);

function GlobalLicenseKeyModal() {
  const { licenseKeyOrder, closeLicenseKeyModal } = useCartCore();

  return (
    <LicenseKeyModal
      open={Boolean(licenseKeyOrder)}
      order={licenseKeyOrder}
      onClose={closeLicenseKeyModal}
    />
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/next-auth">
      <CartUiProvider>
        <WishlistCompareProvider>
          <CartProvider>
            <AuthTokenSync />
            <Suspense fallback={null}>
              <ScrollToTop />
            </Suspense>
            {children}
            <CartPanel />
            <GlobalLicenseKeyModal />
            <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
            style: {
              background: "#0f172a",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.08)",
            },
          }}
        />
          </CartProvider>
        </WishlistCompareProvider>
      </CartUiProvider>
    </SessionProvider>
  );
}

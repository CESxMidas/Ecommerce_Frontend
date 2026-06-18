"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import LicenseKeyModal from "@/components/checkout/license-key-modal";
import CartPanel from "@/components/layout/cart-panel";
import { AuthTokenSync } from "@/components/providers/auth-token-sync";
import { CartProvider, useCart } from "@/components/providers/cart-provider";

function GlobalLicenseKeyModal() {
  const { licenseKeyOrder, closeLicenseKeyModal } = useCart();

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
    <SessionProvider>
      <CartProvider>
        <AuthTokenSync />
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
    </SessionProvider>
  );
}

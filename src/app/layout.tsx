import type { Metadata } from "next";
import { Inter } from "next/font/google";

import StorefrontChrome from "@/components/layout/storefront-chrome";
import Providers from "@/components/providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: {
    default: "KEYSHOP | Key phần mềm & bản quyền số",
    template: "%s | KEYSHOP",
  },
  description:
    "Mua key game, phần mềm và bản quyền số với giao hàng tức thì sau thanh toán.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <StorefrontChrome>{children}</StorefrontChrome>
        </Providers>
      </body>
    </html>
  );
}

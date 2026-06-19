import type { Metadata } from "next";
import { Inter } from "next/font/google";

import StorefrontChrome from "@/components/layout/storefront-chrome";
import Providers from "@/components/providers";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "KEYSHOP | Premium Digital Keys",
    template: "%s | KEYSHOP",
  },
  description:
    "Buy premium game and software license keys with instant delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <StorefrontChrome>{children}</StorefrontChrome>
        </Providers>
      </body>
    </html>
  );
}

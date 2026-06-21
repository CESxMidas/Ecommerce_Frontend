import type { Metadata } from "next";
import { Inter } from "next/font/google";

import StorefrontChrome from "@/components/layout/storefront-chrome";
import Providers from "@/components/providers";

import "./globals.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "KEYSHOP | Key phần mềm & bản quyền số",
    template: "%s | KEYSHOP",
  },
  description:
    "Mua key game, phần mềm và bản quyền số với giao hàng tức thì sau thanh toán.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" style={{ backgroundColor: "#020817", colorScheme: "dark" }}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if("scrollRestoration"in history)history.scrollRestoration="manual";}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-keyshop-bg text-white`}>
        <Providers>
          <StorefrontChrome>{children}</StorefrontChrome>
        </Providers>
      </body>
    </html>
  );
}

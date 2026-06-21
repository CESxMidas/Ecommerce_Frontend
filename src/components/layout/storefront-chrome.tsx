import StorefrontChromeClient from "./storefront-chrome-client";

export default function StorefrontChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StorefrontChromeClient>{children}</StorefrontChromeClient>;
}

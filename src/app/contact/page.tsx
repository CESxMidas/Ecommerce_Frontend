import { staticPageMetadata, StaticPage } from "@/lib/content/render-static-page";

export const metadata = staticPageMetadata("contact");

export default function ContactPage() {
  return <StaticPage slug="contact" />;
}

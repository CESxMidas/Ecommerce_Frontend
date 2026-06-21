import { staticPageMetadata, StaticPage } from "@/lib/content/render-static-page";

export const metadata = staticPageMetadata("about");

export default function AboutPage() {
  return <StaticPage slug="about" />;
}

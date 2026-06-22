const DEFAULT_MEDIA_FALLBACK =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1920&auto=format&fit=crop";

const LOCAL_IMAGE_FALLBACKS: Record<string, string> = {
  "/images/bypass/snake-app.png":
    "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?q=80&w=1920&auto=format&fit=crop",
};

export function resolveMediaUrl(
  url?: string | null,
  fallback: string = DEFAULT_MEDIA_FALLBACK,
): string {
  const trimmed = typeof url === "string" ? url.trim() : "";

  if (!trimmed) {
    return fallback;
  }

  if (LOCAL_IMAGE_FALLBACKS[trimmed]) {
    return LOCAL_IMAGE_FALLBACKS[trimmed];
  }

  if (trimmed.startsWith("/images/") || trimmed.startsWith("/assets/")) {
    return fallback;
  }

  return trimmed;
}

export function normalizeCommerceLink(link?: string | null): string {
  if (!link?.trim()) {
    return "/products";
  }

  return link.trim().replace(/^\/productListing/i, "/products");
}

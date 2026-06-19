import type { Metadata } from "next";

export const noIndexMetadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export function pageMetadata(
  title: string,
  description: string,
  options?: { noIndex?: boolean },
): Metadata {
  return {
    title,
    description,
    ...(options?.noIndex ? noIndexMetadata : {}),
  };
}

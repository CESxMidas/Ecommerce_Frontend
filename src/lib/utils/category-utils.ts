import { createElement } from "react";
import {
  FaCloud,
  FaCode,
  FaGamepad,
  FaMobileAlt,
  FaShieldAlt,
  FaWindows,
} from "react-icons/fa";
import { MdDesignServices } from "react-icons/md";
import { HiOutlineFolder } from "react-icons/hi";

import type { Category } from "@/types/api";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  games: FaGamepad,
  software: FaWindows,
  windows: FaWindows,
  office: MdDesignServices,
  design: MdDesignServices,
  development: FaCode,
  security: FaShieldAlt,
  mobile: FaMobileAlt,
  cloud: FaCloud,
  default: HiOutlineFolder,
};

export function getCategoryIcon(iconKey?: string, className = "category-icon") {
  const Icon = ICON_MAP[iconKey || ""] || ICON_MAP.default;
  return createElement(Icon, { className });
}

export function getCategoryListingUrl(category?: Pick<Category, "slug"> | null) {
  if (!category?.slug) {
    return "/products";
  }

  return `/products?category=${encodeURIComponent(category.slug)}`;
}

export function flattenLeafCategories(nodes: Category[] = []): Category[] {
  return nodes.flatMap((category) => {
    const children = category.children || [];
    const childItems = flattenLeafCategories(children);

    if (childItems.length > 0) {
      return childItems;
    }

    const count = (category as Category & { productCount?: number }).productCount;
    return count && count > 0 ? [category] : [];
  });
}

export function findCategoryBySlug(
  tree: Category[],
  slug?: string | null,
): Category | null {
  if (!slug) return null;

  for (const category of tree) {
    if (category.slug === slug) {
      return category;
    }

    const childMatch = findCategoryBySlug(category.children || [], slug);
    if (childMatch) {
      return childMatch;
    }
  }

  return null;
}

export function collectCategoryIds(category?: Category | null): string[] {
  if (!category) return [];

  const ids = [String(category.id)];

  (category.children || []).forEach((child) => {
    ids.push(...collectCategoryIds(child));
  });

  return ids;
}

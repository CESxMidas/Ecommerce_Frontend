import { createElement } from "react";
import {
  FaCloud,
  FaCode,
  FaGamepad,
  FaMobileAlt,
  FaShieldAlt,
  FaWindows,
} from "react-icons/fa";
import { MdGames, MdSecurity, MdDesignServices } from "react-icons/md";
import { HiOutlineFolder } from "react-icons/hi";

const ICON_MAP = {
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

export function getCategoryIcon(iconKey, className = "category-icon") {
  const Icon = ICON_MAP[iconKey] || ICON_MAP.default;

  return createElement(Icon, { className });
}

export function getCategoryListingUrl(category) {
  if (!category?.slug) {
    return "/productListing";
  }

  return `/productListing?category=${encodeURIComponent(category.slug)}`;
}

export function flattenCategoryTree(tree, depth = 0) {
  return tree.flatMap((category) => [
    { ...category, depth },
    ...flattenCategoryTree(category.children || [], depth + 1),
  ]);
}

export function findCategoryBySlug(tree, slug) {
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

export function collectCategoryIds(category) {
  if (!category) return [];

  const ids = [String(category.id)];

  (category.children || []).forEach((child) => {
    ids.push(...collectCategoryIds(child));
  });

  return ids;
}

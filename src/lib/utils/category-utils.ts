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
  hardware: FaMobileAlt,
  key: FaShieldAlt,
  user: FaCloud,
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

export function findCategoryById(
  tree: Category[],
  id: string,
): Category | null {
  for (const category of tree) {
    if (String(category.id) === String(id)) {
      return category;
    }

    const childMatch = findCategoryById(category.children || [], id);
    if (childMatch) {
      return childMatch;
    }
  }

  return null;
}

export function normalizeCategorySelection(
  tree: Category[],
  selectedIds: string[],
): string[] {
  const selected = new Set(selectedIds.map(String));

  function prune(nodes: Category[]) {
    for (const node of nodes) {
      const selfId = String(node.id);
      const descendants = collectCategoryIds(node).map(String);

      if (selected.has(selfId) && descendants.some((id) => !selected.has(id))) {
        selected.delete(selfId);
      }

      prune(node.children || []);
    }
  }

  prune(tree);
  return [...selected];
}

export function getFilterTargetCategories(
  tree: Category[],
  selectedIds: string[],
): Category[] {
  const normalized = new Set(normalizeCategorySelection(tree, selectedIds));
  const targets: Category[] = [];

  function walk(nodes: Category[]) {
    for (const node of nodes) {
      if (normalized.has(String(node.id))) {
        targets.push(node);
        continue;
      }

      walk(node.children || []);
    }
  }

  walk(tree);
  return targets;
}

export function buildCategoryFilterParams(
  tree: Category[],
  selectedIds: string[],
): { category: string | null; categoryIds: string | null } {
  const targets = getFilterTargetCategories(tree, selectedIds);

  if (targets.length === 0) {
    return { category: null, categoryIds: null };
  }

  if (targets.length === 1) {
    return { category: targets[0].slug, categoryIds: null };
  }

  return {
    category: null,
    categoryIds: targets.map((target) => String(target.id)).join(","),
  };
}

export function findExactCategoryMatch(
  tree: Category[],
  selectedIds: string[],
): Category | null {
  const normalized = [...selectedIds].map(String).sort();

  function walk(nodes: Category[]): Category | null {
    for (const node of nodes) {
      const nodeIds = collectCategoryIds(node)
        .map(String)
        .sort();

      if (
        nodeIds.length === normalized.length &&
        nodeIds.every((id, index) => id === normalized[index])
      ) {
        return node;
      }

      const childMatch = walk(node.children || []);
      if (childMatch) {
        return childMatch;
      }
    }

    return null;
  }

  return walk(tree);
}

export function collectCategoryIds(category?: Category | null): string[] {
  if (!category) return [];

  const ids = [String(category.id)];

  (category.children || []).forEach((child) => {
    ids.push(...collectCategoryIds(child));
  });

  return ids;
}

import { getSalePrice } from "@/lib/utils/product-schema";
import type { Product } from "@/types/api";

const SORT_OPTIONS: Record<string, (a: Product, b: Product) => number> = {
  latest: (a, b) => Number(b.id) - Number(a.id),
  "price-asc": (a, b) => getSalePrice(a) - getSalePrice(b),
  "price-desc": (a, b) => getSalePrice(b) - getSalePrice(a),
  popular: (a, b) => {
    const tagScore = (tag?: string) => {
      if (tag === "HOT") return 4;
      if (tag === "BEST") return 3;
      if (tag === "NEW") return 2;
      return 1;
    };

    return (
      tagScore((b as Product & { tag?: string }).tag || b.badge) -
      tagScore((a as Product & { tag?: string }).tag || a.badge)
    );
  },
};

type ProductWithBrand = Product & { vendor?: string; brand?: string };

function getProductBrand(product: Product) {
  const extended = product as ProductWithBrand;
  return extended.vendor || extended.brand || "";
}

export function getUniqueBrands(products: Product[]) {
  return Array.from(
    new Set(products.map(getProductBrand).filter(Boolean)),
  ).sort() as string[];
}

export function filterProducts(
  products: Product[],
  filters: {
    search?: string;
    categoryIds?: string[];
    brands?: string[];
    priceRange?: [number, number];
    dealsOnly?: boolean;
  },
) {
  const {
    search = "",
    categoryIds = [],
    brands = [],
    priceRange = [0, 999999999],
    dealsOnly = false,
  } = filters;

  const query = search.trim().toLowerCase();
  const normalizedCategoryIds = categoryIds.map(String);

  return products.filter((product) => {
    if (dealsOnly) {
      const list = Number(product.price);
      const sale = getSalePrice(product);
      const hasDeal = sale < list || Boolean(product.badge);
      if (!hasDeal) return false;
    }

    if (query) {
      const brand = getProductBrand(product);
      const haystack =
        `${product.name} ${brand} ${product.categoryName} ${product.badge || ""}`.toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    const vendor = getProductBrand(product);

    if (brands.length > 0 && !brands.includes(vendor)) {
      return false;
    }

    const salePrice = getSalePrice(product);

    if (salePrice < priceRange[0] || salePrice > priceRange[1]) {
      return false;
    }

    if (
      normalizedCategoryIds.length > 0 &&
      !normalizedCategoryIds.includes(String(product.categoryId))
    ) {
      return false;
    }

    return true;
  });
}

export function sortProducts(products: Product[], sortBy = "latest") {
  const sorter = SORT_OPTIONS[sortBy] || SORT_OPTIONS.latest;
  return [...products].sort(sorter);
}

export function paginateProducts(products: Product[], page: number, perPage = 12) {
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * perPage;

  return {
    items: products.slice(start, start + perPage),
    page: safePage,
    totalPages,
    totalItems: products.length,
    perPage,
  };
}

export function getProductPriceBounds(products: Product[]): [number, number] {
  if (products.length === 0) {
    return [0, 100];
  }

  const prices = products.map((product) => getSalePrice(product));
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
}

export const SORT_LABELS: Record<string, string> = {
  latest: "Mới nhất",
  "price-asc": "Giá: thấp đến cao",
  "price-desc": "Giá: cao đến thấp",
  popular: "Phổ biến",
};

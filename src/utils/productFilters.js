import { getSalePrice } from "./productSchema";

const SORT_OPTIONS = {
  latest: (a, b) => Number(b.id) - Number(a.id),
  "price-asc": (a, b) => getSalePrice(a) - getSalePrice(b),
  "price-desc": (a, b) => getSalePrice(b) - getSalePrice(a),
  popular: (a, b) => {
    const tagScore = (tag) => {
      if (tag === "HOT") return 4;
      if (tag === "BEST") return 3;
      if (tag === "NEW") return 2;
      return 1;
    };

    return tagScore(b.tag || b.badge) - tagScore(a.tag || a.badge);
  },
};

export function getUniqueBrands(products) {
  return [
    ...new Set(
      products.map((p) => p.vendor || p.brand).filter(Boolean),
    ),
  ].sort();
}

export function filterProducts(products, filters) {
  const {
    search = "",
    categoryIds = [],
    brands = [],
    priceRange = [0, 9999],
  } = filters;

  const query = search.trim().toLowerCase();
  const normalizedCategoryIds = categoryIds.map(String);

  return products.filter((product) => {
    if (query) {
      const haystack =
        `${product.name || product.title} ${product.vendor || product.brand} ${product.categoryName} ${product.badge || product.tag}`.toLowerCase();

      if (!haystack.includes(query)) {
        return false;
      }
    }

    if (brands.length > 0 && !brands.includes(product.vendor || product.brand)) {
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

export function sortProducts(products, sortBy = "latest") {
  const sorter = SORT_OPTIONS[sortBy] || SORT_OPTIONS.latest;

  return [...products].sort(sorter);
}

export function paginateProducts(products, page, perPage = 8) {
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

export function getProductPriceBounds(products) {
  if (products.length === 0) {
    return [0, 100];
  }

  const prices = products.map((p) => getSalePrice(p));

  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
}

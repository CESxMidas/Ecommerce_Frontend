export function getSalePrice(product) {
  if (!product) return 0;

  const list = Number(product.price);
  const sale =
    product.discountPrice != null ? Number(product.discountPrice) : null;

  if (sale != null && !Number.isNaN(sale) && sale < list) {
    return sale;
  }

  if (product.salePrice != null) {
    return Number(product.salePrice);
  }

  return Number.isNaN(list) ? 0 : list;
}

export function getListPrice(product) {
  if (!product) return null;

  const list = Number(product.price);
  const sale = getSalePrice(product);

  return sale < list ? list : null;
}

export function computeDiscountLabel(product) {
  const list = getListPrice(product);
  const sale = getSalePrice(product);

  if (!list || list <= sale) {
    return product?.discount || undefined;
  }

  return `-${Math.round(((list - sale) / list) * 100)}%`;
}

export function normalizeProduct(raw) {
  if (!raw) return null;

  const salePrice = getSalePrice(raw);
  const listPrice = getListPrice(raw);
  const thumbnail = raw.thumbnail || raw.image || raw.images?.[0] || "";
  const images =
    Array.isArray(raw.images) && raw.images.length > 0
      ? raw.images
      : thumbnail
        ? [thumbnail]
        : [];

  return {
    id: raw.id,
    name: raw.name || raw.title || "",
    slug: raw.slug || "",
    description: raw.description || "",
    price: Number(raw.price ?? salePrice) || 0,
    discountPrice: raw.discountPrice,
    images,
    thumbnail,
    categoryId: raw.categoryId != null ? String(raw.categoryId) : "",
    categoryName: raw.categoryName || "",
    vendor: raw.vendor || raw.brand || "",
    stock: Number(raw.stock ?? 0),
    rating: Number(raw.rating ?? 0),
    reviewsCount: Number(raw.reviewsCount ?? 0),
    isActive: raw.isActive !== false,
    createdAt: raw.createdAt || new Date().toISOString(),
    badge: raw.badge || raw.tag || "",
    salePrice,
    listPrice,
    title: raw.name || raw.title || "",
    brand: raw.vendor || raw.brand || raw.categoryName || "",
    image: thumbnail,
    oldPrice: listPrice ?? 0,
    tag: raw.badge || raw.tag || "",
    discount: raw.discount || computeDiscountLabel({ ...raw, salePrice, listPrice }),
    productType: raw.productType || "standard",
    keyPrefix: raw.keyPrefix || "",
  };
}

export function isLicenseKeyProduct(product) {
  return product?.productType === "license_key";
}

export function normalizeProducts(list = []) {
  return list.map(normalizeProduct).filter(Boolean);
}

export function getProductDisplayName(product) {
  return product?.name || product?.title || "";
}

export function getProductThumbnail(product) {
  return product?.thumbnail || product?.image || product?.images?.[0] || "";
}

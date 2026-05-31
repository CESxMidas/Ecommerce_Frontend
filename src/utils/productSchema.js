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

export function normalizeProductType(value) {
  const allowed = [
    "license_key",
    "redeem_code",
    "account",
    "manual_service",
    "hardware",
  ];

  return allowed.includes(value) ? value : "manual_service";
}

export function normalizeDeliveryType(value, productType) {
  const allowed = [
    "instant_key",
    "account_credentials",
    "manual_delivery",
    "physical",
  ];

  if (allowed.includes(value)) {
    return value;
  }

  if (productType === "hardware") {
    return "physical";
  }

  if (productType === "license_key" || productType === "redeem_code") {
    return "instant_key";
  }

  if (productType === "account") {
    return "account_credentials";
  }

  return "manual_delivery";
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

  const productType = normalizeProductType(raw.productType);
  const deliveryType = normalizeDeliveryType(raw.deliveryType, productType);
  const requiresOnlinePayment =
    raw.requiresOnlinePayment !== undefined
      ? Boolean(raw.requiresOnlinePayment)
      : deliveryType !== "physical";
  const rawVariants = Array.isArray(raw.variants) ? raw.variants : [];

  return {
    id: raw.id ?? raw.productId ?? raw._id,
    sku: raw.sku || "",
    name: raw.name || raw.title || "",
    slug: raw.slug || "",
    description: raw.description || "",
    price: Number(raw.price ?? salePrice) || 0,
    discountPrice: raw.discountPrice,
    currency: raw.currency || "USD",
    images,
    thumbnail,
    categoryId: raw.categoryId != null ? String(raw.categoryId) : "",
    categoryName: raw.categoryName || "",
    vendor: raw.vendor || raw.brand || "",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    attributes: raw.attributes || {},
    variants: rawVariants,
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
    productType,
    deliveryType,
    requiresOnlinePayment,
    keyPrefix: raw.keyPrefix || "",
    weight: Number(raw.weight ?? 0),
    dimensions: raw.dimensions || { length: 0, width: 0, height: 0 },
  };
}

export function isLicenseKeyProduct(product) {
  return product?.productType === "license_key";
}

export function isInstantCodeProduct(product) {
  return ["license_key", "redeem_code"].includes(product?.productType);
}

export function isPhysicalProduct(product) {
  return product?.deliveryType === "physical" || product?.productType === "hardware";
}

export function supportsPurchaseVariants(product) {
  return (
    product &&
    !isPhysicalProduct(product) &&
    ["license_key", "redeem_code", "account", "manual_service"].includes(
      product.productType,
    )
  );
}

function normalizePurchaseVariant(raw, fallbackPrice, fallbackListPrice = null) {
  const id = String(raw?.id || raw?.code || raw?.name || "").trim();
  const name = String(raw?.name || raw?.label || id).trim();
  const price = Number(raw?.price ?? raw?.salePrice ?? fallbackPrice);
  const listPrice =
    raw?.listPrice != null ? Number(raw.listPrice) : fallbackListPrice;

  if (!id || !name || Number.isNaN(price) || price < 0) {
    return null;
  }

  return {
    id,
    name,
    price,
    listPrice:
      listPrice != null && !Number.isNaN(listPrice) ? listPrice : null,
    duration: raw?.duration || id,
  };
}

export function getPurchaseVariants(product) {
  if (!supportsPurchaseVariants(product)) {
    return [];
  }

  const baseSalePrice = getSalePrice(product);
  const baseListPrice = getListPrice(product);
  const customVariants = Array.isArray(product.variants)
    ? product.variants
        .map((variant) =>
          normalizePurchaseVariant(variant, baseSalePrice, baseListPrice),
        )
        .filter(Boolean)
    : [];

  if (customVariants.length > 0) {
    return customVariants;
  }

  return [
    {
      id: "monthly",
      name: "Key tháng",
      price: baseSalePrice,
      listPrice: baseListPrice,
      duration: "monthly",
    },
    {
      id: "yearly",
      name: "Key năm",
      price: Math.round(baseSalePrice * 10),
      listPrice: null,
      duration: "yearly",
    },
    {
      id: "lifetime",
      name: "Key vĩnh viễn",
      price: Math.round(baseSalePrice * 24),
      listPrice: null,
      duration: "lifetime",
    },
  ];
}

export function getDefaultPurchaseVariant(product) {
  return getPurchaseVariants(product)[0] || null;
}

export function resolvePurchaseVariant(product, requestedVariant) {
  const variants = getPurchaseVariants(product);

  if (variants.length === 0) {
    return null;
  }

  const requestedId =
    typeof requestedVariant === "string"
      ? requestedVariant
      : requestedVariant?.id;

  return (
    variants.find((variant) => variant.id === requestedId) ||
    variants[0]
  );
}

export function getCartItemKey(itemOrProduct, variant) {
  const productId = itemOrProduct?.productId ?? itemOrProduct?.id;
  const variantId = variant?.id || itemOrProduct?.variant?.id || "default";

  return `${productId}:${variantId}`;
}

export function getCartItemSalePrice(item) {
  return Number(item?.variant?.price ?? getSalePrice(item?.product || item)) || 0;
}

export function getCartItemListPrice(item) {
  if (item?.variant?.listPrice != null) {
    return Number(item.variant.listPrice);
  }

  return getListPrice(item?.product || item);
}

export function requiresOnlinePayment(product) {
  return !isPhysicalProduct(product) || product?.requiresOnlinePayment === true;
}

export function getDeliveryLabel(product) {
  if (isPhysicalProduct(product)) return "Physical delivery";
  if (product?.productType === "account") return "Account delivery";
  if (product?.productType === "manual_service") return "Manual service";
  if (product?.productType === "redeem_code") return "Redeem code";
  if (product?.productType === "license_key") return "Instant key";

  return "Digital delivery";
}

export function getProductTypeLabel(product) {
  const labels = {
    license_key: "License key",
    redeem_code: "Redeem code",
    account: "Account",
    manual_service: "Manual service",
    hardware: "Hardware",
  };

  return labels[product?.productType] || "Product";
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

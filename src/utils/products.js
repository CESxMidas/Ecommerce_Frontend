import { getProductThumbnail } from "./productSchema";

export function formatPrice(value) {
  return `$${Number(value).toFixed(2)}`;
}

export function getProductImages(product) {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images;
  }

  const thumbnail = getProductThumbnail(product);

  return thumbnail ? [thumbnail] : [];
}

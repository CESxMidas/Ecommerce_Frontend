export interface PurchaseVariant {
  id: string;
  name: string;
  price: number;
  listPrice: number | null;
  duration?: string;
  color?: string | null;
}

export interface NormalizedProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  currency: string;
  images: string[];
  thumbnail: string;
  categoryId: string;
  categoryName: string;
  vendor: string;
  brand: string;
  tags: string[];
  attributes: Record<string, unknown>;
  variants: PurchaseVariant[];
  stock: number;
  rating: number;
  reviewsCount: number;
  isActive: boolean;
  createdAt: string;
  badge: string;
  salePrice: number;
  listPrice: number | null;
  title: string;
  image: string;
  oldPrice: number;
  tag: string;
  discount?: string;
  productType: string;
  deliveryType: string;
  requiresOnlinePayment: boolean;
  keyPrefix: string;
  weight: number;
  dimensions: { length: number; width: number; height: number };
}

export interface CartItem {
  productId: string;
  quantity: number;
  variant: PurchaseVariant | null;
  product: NormalizedProduct;
}

export interface CartSummary {
  count: number;
  listSubtotal: number;
  subtotal: number;
  savings: number;
  tax: number;
  total: number;
}

export interface AppliedCoupon {
  code: string;
  type: string;
  value: number;
  discount: number;
  subtotal: number;
  total: number;
}

export interface UserAddress {
  id?: string;
  _id?: string;
  label?: string;
  fullName?: string;
  address_line: string;
  city: string;
  state?: string;
  pincode: string;
  country: string;
  mobile?: string;
  isDefault?: boolean;
}

export interface OrderLicenseItem {
  licenseKeys?: string[];
  product?: { name?: string; title?: string };
}

export interface PlacedOrder {
  id: string;
  paymentUrl?: string;
  paymentStatus?: string;
  items?: OrderLicenseItem[];
}

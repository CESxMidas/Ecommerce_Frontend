export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  phoneVerified: boolean;
  dateOfBirth?: string | null;
  gender: string;
  verify_email: boolean;
  twoFactorEnabled: boolean;
  role: UserRole;
  token: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: number;
  salePrice?: number | null;
  stock?: number;
  attributes?: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: number;
  salePrice: number | null;
  listPrice: number | null;
  thumbnail: string;
  images: string[];
  categoryId: string;
  categoryName: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  productType: string;
  deliveryType: string;
  variants: ProductVariant[];
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  icon: string;
  parentId: string | null;
  children?: Category[];
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  order?: number;
  placement?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author?: string;
  category?: string;
  publishedAt?: string;
}

export interface ApiListResponse<T> {
  data?: T[];
  products?: T[];
  categories?: T[];
  blogs?: T[];
  banners?: T[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiErrorBody {
  message: string;
}

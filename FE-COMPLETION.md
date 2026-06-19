# FE Completion Checklist — KEYSHOP Next.js Storefront

> Trạng thái sau Phase 5 implementation.  
> Cập nhật: 2025-06-18

## Bắt đầu từ đây

1. Chạy dev: BE `localhost:888` → FE `npm run dev` (`localhost:3000`)
2. UI/UX chi tiết → `FE-UI-UX-AUDIT.md` · Cấu trúc folder → `STRUCTURE.md`

**Đã xong:** migrate Next.js + TypeScript, cleanup legacy, logic gaps, UI polish Phase 5, SEO metadata cơ bản, production env template.

---

## Đã hoàn thành

| Khu vực | Routes / ghi chú |
|---------|------------------|
| **Shop core** | `/products`, `/products/[id]`, `/cart`, `/checkout`, `/deals` |
| **Auth** | `/auth/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify` |
| **Account** | `/account`, `/addresses`, `/wishlist`, `/orders`, `/orders/[id]`, `/licenses`, `/notifications`, `/tickets`, `/security` |
| **Content** | `/blog`, `/blog/[id]`, `/compare`, `/track-order` |
| **Static** | `/about`, `/contact`, `/legal/*`, `/support/*` |
| **Kiến trúc** | Next.js 14 App Router, TypeScript, Tailwind KEYSHOP, NextAuth v4, API layer |

---

## Phase 5 — Ưu tiên cao (trước production)

### 1. Dọn dẹp codebase

- [x] Xóa thư mục `legacy/`
- [x] Xóa `src/styles/legacy/`
- [x] Làm phẳng `src/app/` routes
- [x] Gom `cart/` + `checkout/` components vào `components/shop/`
- [x] `providers.tsx` → `components/providers/index.tsx`
- [x] Thêm `STRUCTURE.md`
- [x] Cập nhật `README.md`

### 2. UI còn lệch KEYSHOP

- [x] `order-detail-page.tsx` → `AccountCard` + tokens KEYSHOP
- [x] `license-key-modal.tsx` → polish modal license keys
- [x] `cart-panel.tsx` → đồng bộ với cart page
- [x] `not-found.tsx` → commerce hero
- [x] `add-to-cart-button.tsx` → KEYSHOP button
- [x] Brand `KEY STORE` → `KEYSHOP` (`layout.tsx`, blog metadata)
- [ ] `site-header.tsx` dropdown account — Shadcn, chấp nhận tạm (không blocking)

### 3. Logic / API

- [x] **Wishlist API** — `wishlist-service.ts` + merge trong `cart-provider.tsx`
- [x] **Profile load** — `fetchProfile()` on mount trong `profile-page.tsx`
- [x] **Checkout summary** — hiển thị coupon + total sau giảm
- [x] **Remember me** — lưu/xóa `rememberedEmail` trong `localStorage`, pre-fill on load

### 4. Production env & deploy

- [x] `.env.example` production (`NEXTAUTH_URL`, `API_INTERNAL_URL`)
- [x] `next.config.mjs` — `images.remotePatterns` (Cloudinary, Unsplash, Imgur)
- [x] Backend `.env.example` — `CORS_ORIGIN` gồm `localhost:3000`
- [x] VNPay return URL → `/account/orders/:id?payment=...` (backend `payment.controller.js`)

---

## Phase 5 — Ưu tiên trung bình

### 5. SEO & metadata

- [x] `/cart`, `/checkout`, `/compare`, `/track-order`
- [x] Các trang `/account/*`
- [x] OpenGraph image cho product / blog

### 6. Test E2E (với backend chạy) — **test tay**

- [ ] Guest → login → mua hàng → VNPay / COD → nhận license keys
- [ ] Forgot / reset password, verify email
- [ ] Wishlist, compare, coupon
- [ ] Track order (guest)
- [ ] Account: resend license, tickets, logout all sessions
- [ ] Mobile: filter drawer, cart, checkout form

### 7. Auth bổ sung

- [ ] Google OAuth — cần `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` + callback `http://localhost:3000/api/next-auth/callback/google`
- [x] GitHub / Discord — "coming soon" (`social-auth-buttons.tsx`)
- [x] Logout gọi `POST /api/auth/logout` trước `signOut` (`performLogout`)
- [x] Login một lần gọi API (NextAuth credentials only)
- [x] Remember me — email localStorage + session JWT 30 ngày khi bật

### 8. ESLint / build warnings

- [x] `cart-provider.tsx` — stable `sessionUserId` deps
- [x] `<img>` → `next/image` ở `site-footer`, `cart-panel`, `blog-carousel`

---

## Phase 5 — Ưu tiên thấp (nice-to-have)

### 9. UX polish

- [ ] Loading skeletons (products, blog, account lists)
- [ ] Error boundary / trang lỗi API thân thiện hơn
- [ ] Blog: field `category`
- [ ] Static pages từ CMS API thay `static-pages.ts`
- [ ] Copy tiếng Việt nếu cần parity legacy

### 10. Tối ưu kỹ thuật

- [ ] Rà soát type `Product` vs `NormalizedProduct`
- [ ] Suspense cho client pages nặng
- [ ] Review `revalidate` / cache từng route SSR

---

## Ghi chú kỹ thuật

- **Dev:** FE `localhost:3000`, BE `localhost:888`
- **NextAuth:** `/api/next-auth/*` (Next.js) — `NEXTAUTH_URL=http://localhost:3000/api/next-auth`
- **Backend API:** `/api/auth/login`, `/api/cart`, … — proxy qua `next.config.mjs` (không proxy `/api/next-auth`)
- **Production CORS:** `CORS_ORIGIN` backend phải gồm URL storefront

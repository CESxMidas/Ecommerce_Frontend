# FE Completion Checklist — KEYSHOP Next.js Storefront

> Trạng thái sau Phase 1–4 + cleanup cấu trúc.  
> Cập nhật: 2025-06-18

## Bắt đầu từ đây (tối nay)

1. Chạy dev: BE `localhost:888` → FE `npm run dev` (`localhost:3000`)
2. Làm theo thứ tự **§ Thứ tự làm đề xuất** bên dưới
3. UI/UX chi tiết → `FE-UI-UX-AUDIT.md` · Cấu trúc folder → `STRUCTURE.md`

**Đã xong:** migrate Next.js + TypeScript 100% (`src/` chỉ `.ts`/`.tsx`), xóa `legacy/`, làm phẳng `app/`.

---

## Đã hoàn thành

| Khu vực | Routes / ghi chú |
|---------|------------------|
| **Shop core** | `/products`, `/products/[id]`, `/cart`, `/checkout`, `/deals` |
| **Auth** | `/auth/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify` |
| **Account** | `/account`, `/addresses`, `/wishlist`, `/orders`, `/orders/[id]`, `/licenses`, `/notifications`, `/tickets`, `/security` |
| **Content** | `/blog`, `/blog/[id]`, `/compare`, `/track-order` |
| **Static** | `/about`, `/contact`, `/legal/*`, `/support/*` |
| **Kiến trúc** | Next.js 14 App Router, TypeScript, Tailwind KEYSHOP, NextAuth v4, API layer (`src/lib/api/`) |

Legacy URL redirects đã cấu hình trong `next.config.mjs`.

---

## Phase 5 — Ưu tiên cao (trước production)

### 1. Dọn dẹp codebase

- [x] Xóa thư mục `legacy/` (Vite SPA cũ — không chạy runtime)
- [x] Xóa `src/styles/legacy/` (19 file CSS không còn được import)
- [x] Làm phẳng `src/app/` routes (bỏ `(account)/account`, `(auth)/auth`, route groups)
- [x] Gom `cart/` + `checkout/` components vào `components/shop/`
- [x] `providers.tsx` → `components/providers/index.tsx`
- [x] Thêm `STRUCTURE.md`
- [x] Cập nhật `README.md`

### 2. UI còn lệch KEYSHOP (vẫn dùng Shadcn / generic)

- [ ] `src/components/account/order-detail-page.tsx` → `AccountCard` + tokens KEYSHOP
- [ ] `src/components/shop/license-key-modal.tsx` → polish modal license keys
- [ ] `src/components/layout/cart-panel.tsx` → đồng bộ với cart page
- [ ] `src/app/not-found.tsx` → commerce hero thay page generic
- [ ] Rà soát Shadcn còn lại: `product-listing.tsx`, `site-header.tsx`, `add-to-cart-button.tsx`

### 3. Logic / API còn thiếu so với legacy

- [ ] **Wishlist API** — hiện chỉ `localStorage`; legacy sync `/wishlist` khi đăng nhập  
  → Tạo `src/lib/services/wishlist-service.ts` + merge trong `cart-provider.tsx`
- [ ] **Profile load** — `fetchProfile()` có nhưng `profile-page.tsx` chưa gọi → phone, DOB, gender trống
- [ ] **Checkout summary** — coupon gửi API nhưng không hiển thị dòng giảm giá trong UI summary
- [ ] **Remember me** (login) — có UI; xác nhận hành vi mong muốn (chỉ lưu email local?)

### 4. Production env & deploy

- [ ] Bổ sung `.env.example` cho production (`NEXTAUTH_URL`, `API_INTERNAL_URL` Vercel/Render)
- [ ] `next.config.mjs` — `images.remotePatterns` cho CDN ảnh sản phẩm
- [ ] CORS backend cho domain production
- [ ] VNPay return URL → `/account/orders?payment=...`

---

## Phase 5 — Ưu tiên trung bình

### 5. SEO & metadata

Thiếu `metadata` / `generateMetadata` trên:

- [ ] `/cart`, `/checkout`, `/compare`, `/track-order`
- [ ] Các trang `/account/*`
- [ ] OpenGraph image cho product / blog

### 6. Test E2E (với backend chạy)

- [ ] Guest → login → mua hàng → VNPay / COD → nhận license keys
- [ ] Forgot / reset password, verify email
- [ ] Wishlist, compare, coupon
- [ ] Track order (guest)
- [ ] Account: resend license, tickets, logout all sessions
- [ ] Mobile: filter drawer, cart, checkout form

### 7. Auth bổ sung

- [ ] Google OAuth — env đầy đủ + test flow
- [ ] GitHub / Discord — hiện "coming soon" (`social-auth-buttons.tsx`)

### 8. ESLint / build warnings

- [ ] `cart-provider.tsx` — `react-hooks/exhaustive-deps` (`sessionUser`)
- [ ] Thay `<img>` bằng `next/image` ở `site-footer`, `cart-panel`, carousels (nếu còn)

---

## Phase 5 — Ưu tiên thấp (nice-to-have)

### 9. UX polish

- [ ] Loading skeletons (products, blog, account lists)
- [ ] Error boundary / trang lỗi API thân thiện hơn
- [ ] Blog: field `category` (legacy có; `BlogPost` type chưa có)
- [ ] Static pages từ CMS API thay hardcode `src/lib/content/static-pages.ts`
- [ ] Copy tiếng Việt (verify, thông báo) nếu cần parity legacy

### 10. Tối ưu kỹ thuật

- [ ] Rà soát type `Product` vs `NormalizedProduct`
- [ ] Suspense cho client pages nặng (`orders-page`, `product-listing`)
- [ ] Review `revalidate` / cache từng route SSR

---

## Thứ tự làm đề xuất

```
✅ 1. Dọn legacy/ + cấu trúc folder + README  (XONG)

2. Logic gaps (~2–4h)
   - Wishlist API + cart-provider sync
   - profile-page gọi fetchProfile on mount
   - checkout summary hiện coupon

3. UI polish (~3–5h) — chi tiết FE-UI-UX-AUDIT.md
   - order-detail-page, license-key-modal, cart-panel, not-found
   - brand KEY STORE → KEYSHOP

4. Production env + image domains + E2E test

5. SEO metadata + ESLint warnings

6. Nice-to-have
```

---

## Ước lượng effort

| Nhóm | Thời gian |
|------|-----------|
| ~~Cleanup + README~~ | ~~xong~~ |
| Logic gaps (wishlist, profile, coupon UI) | 2–4 giờ |
| UI polish còn lại | 3–5 giờ |
| Production + E2E test | 2–4 giờ |
| SEO + warnings + nice-to-have | 2–3 giờ |

**Tổng:** ~1–2 ngày để production-ready; thêm 0.5–1 ngày nếu polish UX đầy đủ.

---

## Ghi chú kỹ thuật

- **Runtime code** (`src/`): 100% `.ts` / `.tsx` — không còn `.jsx`
- **Cấu trúc:** xem `STRUCTURE.md`
- **Dev:** FE `localhost:3000`, BE `localhost:888`, proxy `/api` qua `next.config.mjs`

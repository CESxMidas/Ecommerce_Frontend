# KEYSHOP Frontend — Handoff & việc làm hôm nay

> Gộp từ `FE-COMPLETION.md`, `FE-UI-UX-AUDIT.md`, `STRUCTURE.md`  
> Cập nhật: **2026-06-19**

---

## Bắt đầu nhanh

```powershell
# Terminal 1 — Backend
cd ..\Ecommerce_Backend
npm run dev          # localhost:888

# Terminal 2 — Frontend
cd Ecommerce_Frontend
npm run dev          # localhost:3000
```

| Biến môi trường | Giá trị dev |
|-----------------|-------------|
| `NEXTAUTH_URL` | `http://localhost:3000/api/next-auth` |
| `API_INTERNAL_URL` | `http://localhost:888` |
| `NEXT_PUBLIC_API_URL` | `/api` (proxy qua `next.config.mjs`) |

**Nếu dev 500 sau nhiều lần build:**

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

**Build:** `npm run build` cần BE đang chạy (`:888`) — layout fetch categories lúc build.

---

## Cấu trúc project (tóm tắt)

```
Ecommerce_Frontend/
├── src/app/              # Routes (URL = folder path)
│   ├── page.tsx          # /
│   ├── account/*         # Protected — profile, orders, licenses…
│   ├── auth/*            # Login, register, forgot… (ẩn header/footer)
│   ├── products/, cart/, checkout/, deals/, compare/, track-order/
│   ├── blog/, legal/, support/, [slug]/
│   └── api/auth/[...nextauth]/
├── src/components/
│   ├── layout/           # Header, footer, nav, cart drawer
│   ├── home/             # Hero, carousels, product sections
│   ├── shop/             # Cart, checkout, license modal
│   ├── product/          # Card, detail, gallery, quick view
│   ├── account/          # Account pages + account-ui
│   ├── commerce/         # Compare, track-order, static pages
│   ├── providers/        # Session, cart, auth sync
│   └── ui/               # Button, drawer, overlay-modal, keyshop-swiper
├── src/lib/
│   ├── api/client.ts     # Browser API
│   ├── api/server.ts     # SSR + normalizers
│   ├── services/         # Domain API calls
│   └── utils/            # format, image, filters, storage
├── tailwind.config.ts    # Tokens keyshop-*
└── next.config.mjs       # Rewrites, images, redirects
```

**Quy ước:** `app/**/page.tsx` = route entry + metadata; logic UI nằm trong `components/`.

**Design tokens:** `tailwind.config.ts` · primitives: `account-ui.tsx`, `commerce-ui.tsx`, `auth-layout.tsx`

**Đã xóa:** `legacy/`, `src/styles/legacy/`, route groups `(shop)/`, `(account)/`…

---

## Đã hoàn thành (tổng hợp)

### Kiến trúc & cleanup
- [x] Migrate Next.js 14 + TypeScript + Tailwind KEYSHOP
- [x] Làm phẳng `src/app/` routes, gom `shop/` components
- [x] Production env template, `next.config.mjs` images, VNPay return URL
- [x] SEO metadata (cart, checkout, account, OG product/blog)

### Logic / API
- [x] Wishlist API sync + merge trong `cart-provider`
- [x] Profile `fetchProfile()` on mount
- [x] Checkout summary hiển thị coupon + total
- [x] Remember me (localStorage + JWT 30 ngày)
- [x] Logout gọi `POST /api/auth/logout` trước `signOut`
- [x] Add to cart **không** auto mở cart panel
- [x] Product variant selection — fix `useEffect` reset bug
- [x] Blog excerpt map từ BE `description`
- [x] Banner / product images — `resolveMediaUrl`, Unsplash seed

### UI / UX (Phase 5 + session gần đây)
- [x] Brand `KEYSHOP` thống nhất
- [x] Polish: `order-detail-page`, `license-key-modal`, `cart-panel`, `not-found`, `add-to-cart-button`
- [x] Product card — Add to cart, View, quick view modal (portal + full fetch)
- [x] Profile dropdown z-index fix
- [x] Animations: card hover, reveal, modal/drawer motion
- [x] **SideDrawer** — rewrite đơn giản (All Categories, Cart, filter)
- [x] **Swiper custom chevron** — `keyshop-swiper.tsx`, nút nằm trong carousel (không lòi ra ngoài)
- [x] ESLint / `<img>` → `next/image` ở footer, cart-panel, blog-carousel
- [x] **Nav tiếng Việt** — dropdown Sản phẩm / Hỗ trợ, Company links riêng, `justify-evenly`
- [x] **Việt hóa UI** — checkout, cart, auth, account, product detail, home, blog, compare, track-order
- [x] **Blog category badge** — hiển thị `category` từ BE trên card/carousel
- [x] **Modal overlay** — `useOverlayEscape` chỉ lắng nghe khi `open && active` (tránh kẹt scroll)

### Routes đã có
Shop: `/products`, `/products/[id]`, `/cart`, `/checkout`, `/deals`  
Auth: `/auth/login`, register, forgot, reset, verify  
Account: profile, addresses, wishlist, orders, licenses, notifications, tickets, security  
Content: `/blog`, `/compare`, `/track-order`, static `/about`, `/legal/*`, `/support/*`

---

## Việc làm hôm nay (ưu tiên)

> **Code FE + BE data đã việt hóa.** Phần còn lại chủ yếu là **QA tay** và **build production**.

### 1. QA regression — bắt buộc (~30–45 phút)

Hard refresh `Ctrl+Shift+R`, BE `:888` + FE `:3000`:

```
[ ] All Categories (desktop nav + mobile) — mở/đóng drawer, không kẹt scroll
[ ] Cart panel (header icon) — mở/đóng, thêm SP, qty, không kẹt scroll
[ ] Swiper nav — chevron xanh nằm trong carousel (hero, products, blog, categories, ads)
[ ] Quick view modal — mở từ icon expand trên product card
[ ] Profile dropdown — không bị header che
[ ] Add to cart — không tự mở cart panel
```

### 2. Test E2E tay — trước production (~1–2 giờ)

```
[ ] Guest → login → mua hàng → VNPay / COD → nhận license keys
[ ] Forgot / reset password, verify email
[ ] Wishlist, compare, coupon (cart → checkout thấy dòng giảm giá)
[ ] Track order (guest)
[ ] Account: resend license, tickets, logout all sessions
[ ] Mobile 390px — filter drawer, cart, checkout form, compare scroll
```

### 3. Modal overlay — rà soát nhanh (~30 phút)

SideDrawer đã tách khỏi `useOverlayPresence`. Các modal còn dùng hook này:

- `overlay-modal.tsx` — **đã sửa** Escape chỉ khi panel `active`
- `product-quick-view-modal.tsx`
- `license-key-modal.tsx`

```
[ ] Mở/đóng từng modal — không kẹt body scroll
[ ] Escape + click backdrop đóng đúng
[ ] Không còn overlay invisible chặn click
```

Nếu vẫn lỗi → cân nhắc simplify giống `side-drawer.tsx`.

### 4. Production checklist (~30 phút)

```
[ ] Copy .env từ .env.example — NEXTAUTH_SECRET, NEXTAUTH_URL production
[ ] Backend CORS_ORIGIN gồm URL storefront production
[ ] npm run build (BE đang chạy) — pass
[ ] Smoke test trên build production local: npm run start
```

---

## Backlog — không blocking hôm nay

| Ưu tiên | Việc | Ghi chú |
|---------|------|---------|
| Google OAuth | Client ID trên FE + BE; `GOOGLE_CLIENT_SECRET` tùy chọn | GIS Sign-In (không cần secret); Console: Authorized origins |
| Trung bình | `site-header` account dropdown | Shadcn — chấp nhận tạm hoặc custom KEYSHOP |
| Thấp | Loading skeletons | products, blog, account lists |
| Thấp | Error boundary / trang lỗi API | UX khi API fail |
| ~~Thấp~~ | ~~Blog field `category` từ BE~~ | **Done** — badge trên card |
| ~~Thấp~~ | ~~Copy tiếng Việt~~ | **Done** — UI chính + BE seed |
| Thấp | Order status từ API | Hiển thị `statusLabel` / `paymentStatusLabel` nếu BE trả về |
| Thấp | Static pages từ CMS API | Thay `static-pages.ts` |
| Thấp | Suspense client pages nặng | Performance |
| Thấp | Review `revalidate` / cache SSR | Từng route |

---

## Checklist test nhanh (15 phút — mở máy)

```
[ ] Home — slider, categories, product sections, blog
[ ] /products — filter, sort, pagination
[ ] /products/[slug] — variant, add cart, reviews tab
[ ] /cart + cart drawer
[ ] /checkout — form, COD/VNPay banner
[ ] /auth/login — split panel
[ ] /account — profile save, orders table
[ ] /compare — 2 SP, bảng scroll
[ ] /track-order
[ ] /blog list + detail
[ ] /about, /legal/terms
```

---

## Thứ tự gợi ý trong ngày

```
Sáng / đầu phiên
  → QA regression (drawer, cart, swiper, modals)

Giữa phiên
  → E2E flows chính (mua hàng, auth, account)

Chiều
  → Modal overlay audit + npm run build
  → Ghi lại bug còn lại (issue list hoặc checkbox trên file này)
```

---

## Ghi chú kỹ thuật

| Chủ đề | Chi tiết |
|--------|----------|
| NextAuth | `/api/next-auth/*` — không proxy qua backend |
| Backend API | `/api/auth/login`, `/api/cart`, … — proxy `next.config.mjs` |
| Middleware | `/checkout`, `/account` redirect login — **đúng** |
| SideDrawer | `side-drawer.tsx` — portal, scroll lock khi `open`, không dùng `useOverlayPresence` |
| Swiper | `components/ui/keyshop-swiper.tsx` + `.keyshop-swiper-nav` trong `globals.css` |
| Dev CORS | `Ecommerce_Backend/.env` → `CORS_ORIGIN=http://localhost:3000,http://127.0.0.1:3000` (+ Vercel khi deploy) |
| Google local | Google Console → Authorized JavaScript origins: `http://localhost:3000`, `http://127.0.0.1:3000` |
| BE catalog seed | `Ecommerce_Backend/scripts/seedCatalog.js` — chạy `npm run seed:catalog -- --yes` |

---

## File tham chiếu code

| File | Mục đích |
|------|----------|
| `tailwind.config.ts` | Tokens `keyshop-*`, animations |
| `globals.css` | Card hover, swiper nav, hero stagger |
| `components/ui/side-drawer.tsx` | Panel Categories / Cart / Filter |
| `components/ui/keyshop-swiper.tsx` | Custom chevron navigation |
| `components/ui/overlay-modal.tsx` | Modal + `useOverlayPresence` |
| `components/providers/cart-provider.tsx` | Cart state, wishlist merge |
| `lib/api/server.ts` | SSR normalizers (product, blog, banner) |

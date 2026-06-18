# FE UI/UX Audit — Handoff tối làm việc

> Rà soát tổng quan trước khi kết thúc phiên.  
> Cập nhật: 2025-06-18

---

## Tổng quan nhanh

| Mức | Đánh giá |
|-----|----------|
| **Nhìn chung (KEYSHOP dark + blue)** | ~85% — đủ dùng, gần legacy |
| **Đồng nhất design system** | ~70% — còn trộn Shadcn tokens |
| **Luồng UX chính** | ~80% — shop/auth/account ổn |
| **Production-ready UI** | ~75% — cần polish vài màn + mobile QA |

**Build:** `npm run build` pass  
**Dev:** Nếu gặp 500, chạy `Remove-Item -Recurse -Force .next` rồi `npm run dev`

---

## ✅ UI/UX đã ổn (giữ nguyên, chỉ test lại)

### Shell & điều hướng
- [x] Header sticky, top bar, search, category drawer, cart badge
- [x] Navigation + mobile drawer
- [x] Footer links (help, legal, support)
- [x] Auth pages **ẩn** header/footer (`storefront-chrome-client`)

### Trang chính
- [x] **Home** — hero slider, category slider, product sections, blog carousel
- [x] **Products / Deals** — sidebar filter, sort, grid toggle, pagination URL, breadcrumbs
- [x] **Product detail** — gallery, variants, qty, cart/buy now, tabs, reviews
- [x] **Cart / Checkout** — KEYSHOP cards, gradient CTA, payment banner digital/physical
- [x] **Auth** — split-panel login/register, centered forgot/reset/verify, OTP lớn

### Account & content
- [x] Account sidebar (avatar, badge Member, nav active)
- [x] Profile, orders table, addresses, wishlist grid, licenses, notifications, tickets, security
- [x] Compare, track-order, blog, static pages — `commerce-ui` hero + panel

### Micro-interactions
- [x] Toast (`react-hot-toast`) cho hầu hết actions
- [x] Cart drawer (side panel)
- [x] Empty states: cart, wishlist, compare

---

## ⚠️ Vấn đề UI/UX cần xử lý (ưu tiên khi quay lại)

### P0 — Nhất quán thương hiệu & cảm giác “lệch”

| Vấn đề | Chi tiết | File liên quan |
|--------|----------|----------------|
| **Tên brand lẫn lộn** | Metadata: `KEY STORE` · Header/Footer: `KEYSHOP` | `layout.tsx`, `site-header.tsx`, `site-footer.tsx` |
| **Order detail chưa KEYSHOP** | Vẫn Shadcn `Card`, `text-muted-foreground`, `Button` | `order-detail-page.tsx` |
| **License modal chưa KEYSHOP** | Shadcn `Button` | `license-key-modal.tsx` |
| **404 generic** | `page-shell` + Shadcn, không có commerce hero | `not-found.tsx` |

**Việc tối nay / mai:** Thống nhất `KEYSHOP` (hoặc một tên), polish 3 file trên.

---

### P1 — Đồng nhất design tokens

Còn dùng **Shadcn semantic** (`border-border`, `text-muted-foreground`, `bg-card`) thay vì `keyshop-*`:

| File | Ghi chú |
|------|---------|
| `order-detail-page.tsx` | Nhiều nhất — ưu tiên số 1 |
| `license-key-modal.tsx` | Modal sau thanh toán — UX quan trọng |
| `product-listing.tsx` | Drawer/filter ổn; rà lại toolbar |
| `site-header.tsx` | Dropdown account (Shadcn) — chấp nhận tạm hoặc custom |
| `add-to-cart-button.tsx` | Nút nhỏ trên card |
| `not-found.tsx` | Nhanh, 15 phút |

**Quy tắc khi polish:** Ưu tiên `keyshop-line`, `keyshop-muted`, `keyshop-blue`, `rounded-card`, `AccountCard` / `CommercePanel`.

---

### P1 — UX logic / thiếu feedback

| Vấn đề | Impact |
|--------|--------|
| **Checkout summary không hiện coupon** | User apply coupon ở cart nhưng checkout không thấy dòng giảm giá |
| **Profile không load từ API** | Phone, DOB, gender trống dù đã lưu trên server |
| **Wishlist chỉ localStorage** | Đăng nhập máy khác mất list; badge header không sync server |
| **Loading chỉ text** | “Loading orders…”, “Loading licenses…” — chưa skeleton |
| **Review form** | Cần login nhưng chưa rõ CTA nếu guest xem tab reviews |

---

### P2 — Mobile & responsive (cần test tay)

| Màn | Cần kiểm tra |
|-----|--------------|
| Products listing | Filter drawer, sort dropdown, grid 1/2/4 cột |
| Product detail | Gallery swipe, variant pills wrap |
| Cart | Item card stack, qty buttons |
| Checkout | Form 2 cột → 1 cột, sticky summary |
| Compare | Bảng scroll ngang — OK nhưng chật trên <375px |
| Account orders | Table scroll ngang |
| Auth | Split panel ẩn hero < lg — OK |

---

### P2 — Typography & spacing (minor)

| Khu vực | Hiện tại | Gợi ý |
|---------|----------|-------|
| Commerce pages | `h1` 42px | Chuẩn |
| Account cards | `h1` 28–32px | OK — khác commerce có chủ đích |
| Cart title | 42px | Khớp legacy |
| Breadcrumbs | `text-sm` muted | OK |

Không blocking — chỉ cần không thêm style mới lạ.

---

## 📋 Checklist test nhanh khi mở máy (15–20 phút)

Chạy BE `:888` + FE `:3000`, đăng nhập account test:

```
[ ] Home — slider, categories, product sections load
[ ] /products — filter, sort, pagination
[ ] /products/[slug] — add cart, variant, reviews tab
[ ] Cart drawer (header icon) + /cart page
[ ] /checkout — form, payment COD/VNPay banner
[ ] /auth/login — split panel
[ ] /account — sidebar + profile save
[ ] /account/orders — table + view detail
[ ] /compare — thêm 2 SP từ card, xem bảng
[ ] /track-order — nhập order ID
[ ] /blog — list + detail
[ ] /about, /legal/terms — static content
[ ] Mobile width 390px — header menu, cart
```

---

## 🗺️ Thứ tự làm tiếp (UI/UX focus)

```
Buổi tới — Session 1 (~2h)
  1. Brand KEY STORE → KEYSHOP (metadata + title)
  2. Polish order-detail-page → AccountCard
  3. Polish license-key-modal + not-found
  4. Checkout hiển thị coupon trong summary

Buổi tới — Session 2 (~2h)
  5. cart-panel đồng bộ cart-page (ảnh, pills, CTA)
  6. Profile fetchProfile on mount
  7. Wishlist API sync
  8. Mobile QA + fix lệch nhỏ

Sau đó — FE Phase 5 cleanup (legacy/, README, production env)
```

---

## 🔗 File tham chiếu

| File | Mục đích |
|------|----------|
| `FE-COMPLETION.md` | Checklist kỹ thuật tổng FE |
| `tailwind.config.ts` | Tokens `keyshop-*` |
| `account-ui.tsx` | Account card/field/button |
| `commerce-ui.tsx` | Commerce hero/panel/button |
| `auth-layout.tsx` | Auth split/centered |

---

## Ghi chú dev

```powershell
# Nếu dev 500 sau nhiều lần build:
Remove-Item -Recurse -Force .next
npm run dev

# BE CORS cho Next:
# Ecommerce_Backend/.env
# CORS_ORIGIN=http://localhost:3000
```

`/checkout` và `/account` redirect 307 → login là **đúng** (middleware).

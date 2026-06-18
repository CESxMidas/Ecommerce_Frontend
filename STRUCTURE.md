# Frontend Folder Structure

> KEYSHOP Next.js storefront — cập nhật sau khi làm phẳng `app/` routes.

## Root

```
Ecommerce_Frontend/
├── src/                    # Runtime source (100% .ts / .tsx)
├── public/                 # Static assets
├── next.config.mjs         # Rewrites, redirects, image domains
├── tailwind.config.ts      # KEYSHOP design tokens
├── STRUCTURE.md            # This file
├── FE-COMPLETION.md        # Remaining work
└── FE-UI-UX-AUDIT.md       # UI/UX audit
```

## `src/app/` — Routes (URL = folder path)

```
src/app/
├── layout.tsx              # Root layout + Providers + StorefrontChrome
├── page.tsx                # / (home)
├── not-found.tsx           # 404
├── globals.css
├── api/auth/[...nextauth]/ # NextAuth handler
│
├── account/                # Protected (middleware)
│   ├── layout.tsx          # Account sidebar shell
│   ├── page.tsx            # /account (profile)
│   ├── addresses/
│   ├── wishlist/
│   ├── orders/ + orders/[id]/
│   ├── licenses/
│   ├── notifications/
│   ├── tickets/
│   └── security/
│
├── auth/                   # No storefront chrome
│   ├── layout.tsx
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   ├── reset-password/
│   └── verify/
│
├── products/ + products/[id]/
├── cart/
├── checkout/               # Protected
├── deals/
├── compare/
├── track-order/
│
├── blog/ + blog/[id]/
├── [slug]/                 # /about, /contact
├── legal/[slug]/           # /legal/terms, etc.
└── support/[slug]/         # /support/help-center, etc.
```

**Đã bỏ:** route groups `(account)/account/`, `(auth)/auth/`, `(shop)/`, `(content)/` — trùng tên, khó đọc.

## `src/components/` — UI by domain

```
src/components/
├── layout/         # Header, footer, nav, cart drawer, storefront chrome
├── home/           # Homepage sections
├── shop/           # Listing, sidebar, cart, checkout, license modal
├── product/        # Product card, detail, gallery
├── auth/           # Login, register, OTP, social buttons
├── account/        # Account pages + sidebar + account-ui primitives
├── commerce/       # Compare, track-order, static pages, commerce-ui
├── providers/      # Session, cart, auth sync, toasts (index.tsx)
└── ui/             # Shared primitives (button, drawer, dropdown)
```

**Quy ước:** `app/*/page.tsx` chỉ re-export component client; logic UI nằm trong `components/`.

## `src/lib/` — Data & utilities

```
src/lib/
├── api/
│   ├── client.ts           # Browser API (axios + auth token)
│   └── server.ts           # SSR fetch + normalizers
├── auth.ts                 # NextAuth config
├── services/               # Domain API calls (orders, cart, auth, …)
├── utils/                  # product-schema, filters, storage, format
└── content/
    └── static-pages.ts     # CMS-like static copy (about, legal, support)
```

## `src/constants/` & `src/types/`

```
src/constants/apiEndpoints.ts
src/types/api.ts
```

## Conventions

| Layer | Responsibility |
|-------|----------------|
| `app/**/page.tsx` | Route entry, metadata, SSR data fetch |
| `components/**` | UI, client interactivity |
| `lib/api/server.ts` | Server Components data |
| `lib/services/*` | Client-side API mutations |
| `lib/utils/*` | Pure helpers, localStorage adapters |

## Removed (no longer in repo)

- `legacy/` — old Vite SPA reference
- `src/styles/legacy/` — unused CSS from migration

## Docs làm việc tiếp

| File | Dùng khi |
|------|----------|
| `FE-COMPLETION.md` | Checklist kỹ thuật + thứ tự ưu tiên |
| `FE-UI-UX-AUDIT.md` | Polish UI, test tay, session plan |
| `README.md` | Chạy dev, env, stack |

# Ecommerce Storefront (Next.js)

Next.js App Router storefront migrated from the legacy Vite app in `legacy/`.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + Shadcn UI
- NextAuth v4
- Express API backend (separate repo)

## Development

```bash
# Terminal 1 - Backend
cd ../Ecommerce_Backend
npm run dev

# Terminal 2 - Storefront
npm install
npm run dev
```

Open http://localhost:3000

## Environment

Copy `.env.example` to `.env` and set:

- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — dev credentials (separate from production)
- `API_INTERNAL_URL` — backend for server-side fetch (default `http://localhost:888`)

Client requests use `NEXT_PUBLIC_API_URL=/api` (proxied to backend via `next.config.mjs`).

## Production URL map

| Legacy URL | New URL |
|------------|---------|
| `/productListing` | `/products` |
| `/product/:id` | `/products/:id` |
| `/login` | `/auth/login` |
| `/myAccount` | `/account` |
| `/orders` | `/account/orders` |
| `/my-list` | `/account/wishlist` |

Permanent redirects are configured in `next.config.mjs`.

## Migration status

- Done: Next.js scaffold, Shadcn UI, NextAuth v4, Home/Products/Blog (SSR/ISR), auth login
- Next phase: port Cart, Checkout, Register, Account modules from `legacy/src`

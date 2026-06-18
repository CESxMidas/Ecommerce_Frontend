# Ecommerce Storefront (Next.js)

KEYSHOP digital storefront — Next.js 14 App Router + TypeScript + Tailwind.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (KEYSHOP design tokens)
- NextAuth v4
- Express API backend (`../Ecommerce_Backend`)

## Development

```bash
# Terminal 1 — Backend
cd ../Ecommerce_Backend
npm run dev

# Terminal 2 — Storefront
npm install
npm run dev
```

Open http://localhost:3000

## Environment

Copy `.env.example` to `.env`:

- `NEXTAUTH_SECRET` — `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional OAuth
- `API_INTERNAL_URL` — server-side API (default `http://localhost:888`)

Client requests use `NEXT_PUBLIC_API_URL=/api` (proxied via `next.config.mjs`).

## Project structure

See [`STRUCTURE.md`](./STRUCTURE.md) for the full folder map.

## Legacy URL redirects

Permanent redirects from the old Vite SPA are in `next.config.mjs` (`/login` → `/auth/login`, `/orders` → `/account/orders`, etc.).

## Docs

- [`STRUCTURE.md`](./STRUCTURE.md) — folder layout
- [`FE-COMPLETION.md`](./FE-COMPLETION.md) — remaining work checklist
- [`FE-UI-UX-AUDIT.md`](./FE-UI-UX-AUDIT.md) — UI/UX audit

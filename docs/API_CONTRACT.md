# API Contract (Frontend ↔ Backend)

Base URL: `VITE_API_URL` (default `http://localhost:888/api`)

## Auth

- `POST /auth/register` — `{ name, email, password }`
- `POST /auth/login` — `{ email, password }` → `{ _id, name, email, phone, token }`
- `POST /auth/google` — `{ credential }`
- `POST /auth/verify` — `{ email, otp }`
- `POST /auth/forgot-password` — `{ email }`
- `POST /auth/reset-password` — `{ password, confirmPassword, email?, otp? }`
- `GET /auth/me` — requires Bearer token

## Product (canonical API shape)

```json
{
  "id": 1,
  "name": "Windows 11 Pro License Key",
  "slug": "windows-11-pro-license-key",
  "description": "...",
  "price": 59,
  "discountPrice": 29,
  "images": ["https://..."],
  "thumbnail": "https://...",
  "categoryId": "21",
  "categoryName": "Windows",
  "vendor": "Microsoft",
  "stock": 240,
  "rating": 4.9,
  "reviewsCount": 312,
  "isActive": true,
  "createdAt": "2026-05-29T00:00:00.000Z",
  "badge": "HOT",
  "salePrice": 29,
  "listPrice": 59,
  "title": "Windows 11 Pro License Key",
  "brand": "Microsoft",
  "image": "https://...",
  "oldPrice": 59,
  "tag": "HOT",
  "discount": "-51%"
}
```

- `price` — list/original price (number)
- `discountPrice` — sale price when on promotion (optional)
- `salePrice` / `listPrice` — computed helpers for UI/cart
- Legacy aliases (`title`, `brand`, `image`, `tag`, `oldPrice`, `discount`) remain for backward compatibility

### Products

- `GET /products` — query: `category` (slug), `categoryId`, `slug` (category slug alias), `q`, `minPrice`, `maxPrice`
- `GET /products/:idOrSlug` — numeric id or product slug

## Category (canonical API shape)

```json
{
  "id": "21",
  "name": "Windows",
  "slug": "windows",
  "image": "",
  "description": "",
  "icon": "windows",
  "parentId": "2",
  "sortOrder": 1,
  "isActive": true,
  "productCount": 1,
  "children": []
}
```

- `GET /categories` — category tree with `productCount`
- `GET /categories/:idOrSlug` — category detail + products

## Cart (requires login)

- `GET /cart`
- `POST /cart` — `{ productId, quantity }`
- `PUT /cart` — `{ items: [{ productId, quantity }] }`
- `PUT /cart/:id` — `{ quantity }`
- `DELETE /cart/:id`

Guest cart uses `localStorage` until login; cart merges on login.

## Orders (requires login)

- `GET /orders`
- `POST /orders` — checkout payload with `items`, `total`, shipping fields

## User (requires login)

- `PATCH /user/profile` — `{ name, email, phone }`
- `POST /user/profile/password` — `{ password, confirmPassword }`
- `GET|POST /user/addresses`

## Seed / migration

Restart the backend to upsert `data/categories.json` and `data/products.json` into MongoDB with the normalized schema.

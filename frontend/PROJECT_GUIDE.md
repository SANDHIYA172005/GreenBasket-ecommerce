# GreenBasket — Organic Grocery Store (Angular)

A fully working front-end for an organic grocery store, built with **Angular 18 (standalone components)**, **TypeScript**, **HTML/CSS**. No backend required — auth, cart, and orders are persisted to the browser's `localStorage` so the whole app runs and is testable on its own.

## 1. Run it

```bash
cd organic-grocery
npm install
npm start
```

Then open **http://localhost:4200**. That's it.

To create a production build:
```bash
npm run build
```
Output goes to `dist/organic-grocery` — deployable to any static host (Netlify, Vercel, GitHub Pages, S3, etc).

## 2. What's included

| Feature | Where it lives |
|---|---|
| User authentication (register/login/logout) | `services/auth.service.ts`, `components/login`, `components/register` |
| Product categories (Fruits, Vegetables, Dairy, Grains) | `services/product.service.ts`, `components/home`, `components/product-list` |
| Search & filter (text, category, price range, organic-only) | `components/product-list` |
| Shopping cart (add/update/remove, persisted) | `services/cart.service.ts`, `components/cart` |
| Checkout (delivery details + payment method) | `components/checkout` |
| Order tracking (status timeline: Placed → Packed → Shipped → Out for Delivery → Delivered) | `services/order.service.ts`, `components/order-tracking`, `components/order-history` |
| Responsive design | Every component's `.css` file has a `@media` breakpoint; global tokens in `src/styles.css` |
| White theme, blue buttons | CSS custom properties in `src/styles.css` (`--color-bg: #fff`, `--color-primary: #2563eb`) |

## 3. Project structure

```
src/app/
├── models/                 # TypeScript interfaces: Product, User, Order, CartItem
├── services/                # Business logic, all localStorage-backed
│   ├── auth.service.ts       # register(), login(), logout(), currentUser signal
│   ├── product.service.ts    # mock catalog + search()/filter logic
│   ├── cart.service.ts       # signals-based cart with computed totals
│   └── order.service.ts      # placeOrder(), status progression for tracking
├── guards/
│   └── auth.guard.ts         # protects /checkout and /orders routes
├── components/
│   ├── header/                # nav bar, cart badge, auth-aware buttons
│   ├── footer/
│   ├── home/                  # landing hero + category tiles
│   ├── login/  register/      # auth forms
│   ├── product-list/          # search bar, filter sidebar, product grid
│   ├── cart/                   # cart table + order summary
│   ├── checkout/               # delivery form + payment + order confirmation
│   ├── order-history/          # list of a user's past orders
│   └── order-tracking/         # visual status timeline for one order
├── app.routes.ts             # all routes, lazy-loaded via loadComponent()
├── app.config.ts             # providers (router, zone change detection)
└── app.component.ts          # shell: header + <router-outlet> + footer
```

## 4. How the pieces connect (mental model)

- **Angular Signals** power all shared state (`currentUser`, cart `items`, `totalItems`, `totalPrice`, `orders`). Signals auto-update every component that reads them — no manual subscriptions needed.
- **Standalone components** — no `NgModule`s. Each component declares its own `imports: []`.
- **Lazy-loaded routes** (`loadComponent`) — each page's JS is only downloaded when visited, keeping the initial bundle small.
- **`localStorage` keys used:** `ogs_users`, `ogs_session`, `ogs_cart`, `ogs_orders`. Clearing browser storage resets the whole demo.
- **Route guard** (`authGuard`) blocks `/checkout`, `/orders`, `/orders/:id` for logged-out users and redirects to `/login`.

## 5. Extending this into a "real" app

This front-end is deliberately backend-free so you can run it immediately. To move it to production:

1. **Replace `AuthService`, `OrderService`, `ProductService` internals** with `HttpClient` calls to a real API (Node/Express, Firebase, Supabase, .NET, etc.) — the public method signatures (`login()`, `placeOrder()`, `search()`) can stay the same, so components won't need to change.
2. **Hash passwords server-side** — the current auth is a plaintext-in-localStorage demo only, never do this in production.
3. **Add real payment integration** (Stripe/Razorpay) in the checkout flow.
4. **Add product images** — swap the emoji placeholders in `product.service.ts` for real image URLs, and add an `<img>` in the product card template.
5. **Add pagination** to `product-list` once your catalog grows beyond a page or two.
6. **Add unit tests** — the project was scaffolded with `--skip-tests` to keep it lean; run `ng generate component` for new features going forward and Angular will scaffold spec files automatically.

## 6. Customizing the theme

All colors are CSS variables at the top of `src/styles.css`:

```css
:root {
  --color-bg: #ffffff;       /* page background */
  --color-primary: #2563eb;  /* button/link blue */
  --color-primary-hover: #1d4ed8;
  ...
}
```

Change `--color-primary` to re-theme every button, badge, and link across the whole app in one place.

## 7. Suggested next features

- Wishlist / "save for later"
- Product reviews & ratings input
- Admin panel to manage inventory
- Email notifications on order status change
- Multi-address book per user

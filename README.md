# THE WIZ

Bilingual storefront for independent printed medical study books. Minimal black, white and grey design, with mobile-first spiral-bound previews.

## Develop and build

- `npm install`
- `npm run dev`
- `npm run typecheck`
- `npm run build` for Netlify/Next.js
- `npm run build:pages` for GitHub Pages
- `node scripts/verify-previews.mjs` to verify preview boundaries

## Current storefront

The real collection comes from `lib/courses.generated.json`: 19 books organized into medicine years 1–6. Empty years show a coming-soon state. Modules and integrated teaching units (UEI) are grouped separately according to the source folders.

Each book uses the original first PDF page as its cover. The reader advances directly from that cover to page 2 and stops at page 10. On Netlify, customers submit an order request which is saved before a reference is shown. No invented prices or stock guarantees are displayed; price, availability and delivery across Algeria are confirmed directly.

## Orders and administration

- Visit `/admin` and sign in with `WIZ_ADMIN_PASSWORD` (at least 16 characters).
- In Netlify, set that password as a **secret environment variable available to Functions**, then deploy. Never put it in Git or a `NEXT_PUBLIC_` variable.
- Netlify Blobs stores orders privately in the site-wide `wiz-orders` store, retaining them across production deployments. Non-production contexts use their own store name.
- The admin table supports search, status filtering, status changes and a download of all orders as UTF-8 CSV for Excel. Import using a semicolon separator if Excel does not detect it. Formula-like values are escaped.
- Authentication uses an eight-hour HTTP-only session cookie. Admin reads/exports require authentication; mutations require the same origin. Login/order attempts are rate-limited, and order submissions are validated and idempotent.
- For local development only, set `ORDERS_STORAGE=local` in ignored `.env.local`. Orders are stored under ignored `.data/orders/`. Local data and credentials are excluded from the deployment bundle.
- A local admin password has been generated in `.env.local`; copy it to the local login form. Set a separate production password in Netlify if desired.
- GitHub Pages cannot run a private database/API: it retains an email-order fallback. If the Netlify password is not configured, the form also falls back to email rather than pretending to save an order.
- No automatic email notification is sent. New orders are received in the admin table; press **Actualiser** to refresh.
- To run the API regression checks, start a local server on port 3101 with `ORDERS_TEST_MODE=true`, then run `node scripts/test-orders.mjs`. Synthetic orders are isolated under `.data/order-tests` and removed by the test.

English lives at `/`, French at `/fr`. The language switch preserves the current page. Legacy sample-catalogue URLs redirect to the real collection; the old sample bundles are not sold.

## Main files

- `components/collection-home.tsx`: bilingual home and FAQ
- `components/catalogue/course-library.tsx`: years, modules, UEI, search and book cards
- `components/catalogue/course-product.tsx`: touch/keyboard reader and order form
- `components/notebook/course-cover.tsx`: original PDF cover with black plastic spiral
- `components/order/admin-orders.tsx`: private order table
- `lib/order-store.ts`: durable Netlify storage and isolated local storage
- `lib/content.ts`: official contact details and navigation
- `app/globals.css`: shared design and book styling

## Preview generation

Full source PDFs in `Content/` are ignored by Git and never served.

1. Run `npm run previews` to generate fresh PDFs containing only the first ten pages.
2. Optionally run `python scripts/optimize-previews.py` to compress the public previews.
3. Run `python scripts/render-preview-pages.py` (PyMuPDF and Pillow) to render the already-truncated PDFs to WebP.
4. Run `node scripts/verify-previews.mjs`.
5. Commit the manifest, truncated PDFs and `public/course-pages/` images together.

The reader never loads original full PDFs. Its images are rendered from the truncated previews. Cover rotation, swipe navigation, arrow buttons, keyboard navigation and reduced-motion preferences are supported.

## Deployment

Netlify uses `netlify.toml` and the standard Next.js build. The site URL comes from `NEXT_PUBLIC_SITE_URL`, Netlify's `URL`, or `DEPLOY_PRIME_URL`.

GitHub Pages exports into `.next-pages` with the `/the-wiz` base path; the workflow publishes on pushes to main. It supports email requests only. The private order inbox requires the Netlify/Next.js deployment.

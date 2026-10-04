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
- GitHub Pages cannot run a private database/API. Checkout remains visible, but confirmation is disabled when the server is unavailable or WIZ_ADMIN_PASSWORD is missing. Orders require the Netlify/Next.js deployment.
- No automatic email notification is sent. New orders are received in the admin table; press **Actualiser** to refresh.
- To run the API regression checks, start a local server on port 3101 with `ORDERS_TEST_MODE=true`, then run `node scripts/test-orders.mjs`. Synthetic orders are isolated under `.data/order-tests` and removed by the test.

English lives at `/`, French at `/fr`, and Arabic at `/ar` with RTL layout. The language switch preserves the current page. Legacy sample-catalogue URLs redirect to the real collection; the old sample bundles are not sold.

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
2. Optionally run `python scripts/optimize-previews.py` to compress the preview sources.
3. Run `python scripts/render-preview-pages.py` (PyMuPDF and Pillow) to render the already-truncated PDFs to WebP.
4. Run `node scripts/verify-previews.mjs`.
5. Commit the manifest, truncated PDFs and `public/course-pages/` images together.

The reader never loads original full PDFs. Its images are rendered from the truncated previews. Cover rotation, swipe navigation, arrow buttons, keyboard navigation and reduced-motion preferences are supported.

## Deployment

Netlify uses `netlify.toml` and the standard Next.js build. The site URL comes from `NEXT_PUBLIC_SITE_URL`, Netlify's `URL`, or `DEPLOY_PRIME_URL`.

GitHub Pages exports into `.next-pages` with the `/the-wiz` base path; the workflow publishes on pushes to main. It displays the cart and price calculator, but cannot save orders. The private order inbox requires the Netlify/Next.js deployment.

## Multi-book cart

The trilingual cart saves course IDs and quantities in this browser’s local storage (no customer contact details). Customers can add several courses, change quantities or remove books, then submit one delivery form. A successful save clears the cart and provides an order reference. The admin table shows all books under that reference; the Excel CSV contains one row per book. Historical single-book orders remain supported. Prices and delivery charges are shown before confirmation and independently recalculated by the server.

## V3 pricing, delivery and languages

- `lib/book-details.json` owns prices, availability and EN/FR/AR titles for the 49 books; PDF identities and preview paths remain stable. Full PDF titles are used, with matching English and Arabic translations and the exact V4 spelling overrides. Individual V3 prices remain unchanged.
- `lib/delivery-rates.json` owns the supplied 58-wilaya tariff independently of book prices. Destinations 50, 54 and 56 are unavailable. Rates are supplied business data, not live courier quotes.
- `lib/commerce.ts` validates items and calculates books subtotal + one delivery fee. Client-supplied prices are never trusted; expected totals must match the server calculation.
- Checkout requires first and last names, phone, email and a wilaya. Home delivery requires an address; stopdesk discards the home address from the stored order. Review precedes confirmation; the saved receipt retains all ordered items and amounts.
- Cart items and delivery selection persist in local storage. Customer contact fields stay in React memory while changing language, and are cleared after success. The protected order store retains the submitted customer data.
- Admin displays historical price snapshots. Excel CSV uses one row per ordered item (individual book or pack), with order subtotal/delivery/total on the first row only to avoid counting delivery repeatedly. Older orders without prices still display.
- The header wordmark remains until the owner supplies the circular logo image.

## V4 offers and administration

- `/offers`, `/fr/offers`, `/ar/offers` list six annual packs (6000, 4500, 6000, 4000, 5000, 5500 DZD) and the complete collection (31000 DZD). Pack contents and physical book counts are captured in each order. Reference totals are calculated from actual individual prices: year 4 is 4400 DZD and the whole collection 33600 DZD, pending correction of the conflicting supplied totals (4300/33500).
- Optional phone2 is retained in receipts, admin and Excel exports.
- Authenticated admin POST creates a separate gift entry, permanently zero-valued. PATCH can change commercial delivery fees (including zero) and recomputes the final total. DELETE requires an explicit confirmation flag and removes the entry from storage. No public API can create gifts or waive delivery.
- Commercial orders and gifts have separate views. Revenue and sales count completed commercial orders only; produced books count shipped/completed commercial orders plus gifts. Pending/cancelled orders do not count as produced. Deletion is reflected by recalculating from remaining entries.
- Preview PDFs have been moved out of public to `preview-source/`, excluded from function tracing. The website only exposes the first-ten-page image reader with navigation and zoom; there are no PDF, download or print controls. Browser-visible images can still be captured; this is not DRM. Previously published Git history/deployments can still contain former preview PDFs.

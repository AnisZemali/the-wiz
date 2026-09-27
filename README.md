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

Each book has an independent cover, full page count, interactive ten-page preview and email order request. No invented prices or stock guarantees are displayed. Orders go to `thewiz.dz@gmail.com`; price, availability and delivery across Algeria are confirmed directly. The former demo order endpoint returns HTTP 410.

English lives at `/`, French at `/fr`. The language switch preserves the current page. Legacy sample-catalogue URLs redirect to the real collection; the old sample bundles are not sold.

## Main files

- `components/collection-home.tsx`: bilingual home and FAQ
- `components/catalogue/course-library.tsx`: years, modules, UEI, search and book cards
- `components/catalogue/course-product.tsx`: touch/keyboard reader and email order
- `components/notebook/course-cover.tsx`: minimal cover with black plastic spiral
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

GitHub Pages exports into `.next-pages` with the `/the-wiz` base path; the workflow publishes on pushes to main. Both hosts support the email-based ordering flow.

# ITL Storefront

A JavaScript and Next.js storefront project modeled on the publicly visible catalog and shopping experience at [United Tools Ltd](https://utl.co.ke/). The implementation is being built in this repository and is not affiliated with or operated by United Tools Ltd.

## Project Status

The storefront includes a responsive public catalog, category and product routes, search/filter controls, a browser-persisted enquiry list, and a guest quotation form with WhatsApp handoff. A Supabase-backed superadmin product workspace is available at `/admin`; it supports product details, SKU, categories, publishing, photo capture, and image uploads. Admin access requires Supabase Auth plus the server-managed `app_metadata.role = "superadmin"` claim. Product rows and image writes are protected with database and Storage Row Level Security policies.

The product manager requires the Supabase project setup described below. Without Supabase environment variables, the storefront uses sample fixture data and the superadmin workspace displays setup instructions. A complete catalog import, real checkout, payment processing, email, and order-management tools are not implemented. Sample catalog content is not a full or authoritative inventory.

The reference site has a broad industrial-tools catalog, category navigation, product listings, a checkout promotion, and a WhatsApp contact entry. Its homepage navigation includes Engineering - Tooling; Measuring, Marking & Testing; Tools & Accessories; Abrasives; Automotive Tools; Sealants & Lubricants; and Safety.

The public WordPress API reported 2,646 product records when checked on 2026-10-02. That catalog has not been exported into this project. The site's `robots.txt` specifies a 30-second crawl delay, so a full public crawl must be paced accordingly. Product copy, images, stock, shipping terms, and the reference site's active payment gateway still need confirmation before they can be reproduced accurately.

See [the product requirements document](docs/PRODUCT_REQUIREMENTS.md) for proposed scope, requirements, assumptions, and decisions that remain open.

## Technology

The current application foundation is:

- Next.js App Router
- React
- JavaScript (not TypeScript)
- CSS Modules for component-scoped styles
- Lucide React for interface icons
- Prisma 7 CLI and client for the planned PostgreSQL data layer

The product catalog and product image storage use Supabase. Prisma remains installed for the previously proposed data layer but is not used by this catalog implementation. Checkout, payment, email, and enquiry/order persistence still require separate implementation.

## Requirements

- Node.js compatible with the installed Next.js version
- npm

## Run Locally

From this directory, install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The development server uses the `src/app` directory.

## Available Commands

```bash
npm run dev    # Start the development server
npm run lint   # Run ESLint
npm run build  # Create a production build
npm start      # Serve the production build
```

Run `npm run build` before deploying. `npm start` requires a successful production build first.

## Project Structure

```text
src/
  app/
    globals.css       Global styles
    layout.js         Root layout and document metadata
    page.js           Home page
    storefront.js     Interactive storefront prototype
    storefront.module.css  Storefront styles
    admin/
      page.js          Superadmin sign-in
      actions.js       Auth and product management server actions
      product-manager.js Catalog and photo editor
      dashboard/       Protected product workspace
    category/[slug]/   Sample category pages
    product/[slug]/    Sample product details
    enquiry/           Guest quotation form
  components/          Shared catalog and enquiry UI
  data/catalog.js      Sample categories, products and hero slides
  lib/enquiry.js       Browser-only enquiry-list persistence
  lib/supabase/        Supabase browser/server clients and role checks
supabase/migrations/   Catalog schema, RLS and product-image bucket policies
public/                Static assets
docs/
  PRODUCT_REQUIREMENTS.md
```

As the storefront grows, keep route-specific and component-specific styles in `.module.css` files. Keep global CSS for resets, fonts, and design tokens. Do not introduce TypeScript or a utility-CSS framework without an explicit project decision.

## Configuration and Secrets

Copy `.env.example` to `.env.local` and set the Supabase project URL and publishable key. These are public client credentials; security is enforced by Supabase Auth and RLS, not by hiding the publishable key. Never put a Supabase service-role key in `NEXT_PUBLIC_*`, browser code, or the repository.

### Enable the superadmin catalog

1. Create a Supabase project and set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. Put the session-pooler connection string in `.env` as `DATABASE_URL` (Supabase Dashboard → Connect → Connection string → Session pooler; edited by Prisma Migrate, no SQL Editor needed).
2. Apply the schema with `npm run db:deploy` (`prisma migrate deploy`). This creates the catalog tables, row-level-security policies and the public `product-images` bucket.
3. Import content: `node scripts/pull-wc.mjs` (2,681 products, categories, brands, tags) then `node scripts/seed-home.mjs` (hero slides, banners, blog posts, settings, brand logos). Scripts are idempotent; re-run to refresh.
4. Create the intended staff user in Supabase Authentication. In the user's **app metadata** (not user metadata), set `"role": "superadmin"`.

Only published products are returned to the storefront. Each upload is checked for JPG, PNG, or WebP format and size in the browser; Supabase Storage also enforces the configured MIME and size limits. The mobile **Take photo** control uses the browser's environment-camera capture hint when supported.

## Reference and Data Notes

The current reference is [utl.co.ke](https://utl.co.ke/). The implementation should use only product data and media that the project is authorized to use. The product-count observation is a point-in-time API count, not a local catalog export. Reference-site payment methods, exact shipping prices, inventory rules, and all product content have not yet been verified.

## Deployment

No production deployment is configured. Vercel is a proposed hosting option for the Next.js application; the production database, image storage, domains, payment credentials, and webhook URL must be configured and tested before accepting orders.
